import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { GeminiClient, TokenMeter } from '@repo/ai-sdk';
import { DynamicPrismaService } from '@repo/db-core';
import { AdminWsGateway, TaskQueueService } from '@repo/backend-core';

@Injectable()
export class FreelanceService implements OnModuleInit {
  private readonly logger = new Logger(FreelanceService.name);

  constructor(
    private readonly prisma: DynamicPrismaService,
    private readonly gemini: GeminiClient,
    private readonly tokenMeter: TokenMeter,
    private readonly wsGateway: AdminWsGateway,
    private readonly queue: TaskQueueService,
  ) { }

  onModuleInit() {
    // FR-3.5: Register BullMQ autonomous collections chaser processor
    this.queue.registerProcessor('invoice-collections-chaser', async (job) => {
      const { invoiceId, contractId, clientEmail, amountCents, chaseCount } = job.data as {
        invoiceId: string;
        contractId: string;
        clientEmail: string;
        amountCents: number;
        chaseCount: number;
      };

      const nextChaseCount = (chaseCount || 0) + 1;
      this.logger.log(`[FreelanceOS] Autonomous Collections Agent sending reminder #${nextChaseCount} to ${clientEmail}`);

      await (this.prisma as any).invoiceRecord.update({
        where: { id: invoiceId },
        data: {
          status: 'CHASING',
          copilotChaseCount: nextChaseCount,
        },
      });

      this.wsGateway.broadcastEvent({
        type: 'COPILOT_SUBSCRIBED',
        appId: 'freelanceos',
        data: {
          event: 'COLLECTIONS_REMINDER_SENT',
          invoiceId,
          chaseCount: nextChaseCount,
          amountCents,
        },
        timestamp: new Date().toISOString(),
      });
    });
  }

  // FR-3.2: Legal Contract Generation
  async generateContract(
    freelancerId: string,
    clientName: string,
    clientEmail: string,
    projectTitle: string,
    deliverables: string[],
    hourlyRateCents: number,
  ) {
    const result = await this.gemini.generate<{
      structuredSOW: Array<{ item: string; description: string; estimatedHours: number }>;
      legalClauses: string[];
      fullContractMarkdown: string;
    }>({
      model: 'fast',
      prompt: `Generate a legally sound Scope of Work (SOW) agreement and contract for:
Client: ${clientName} (${clientEmail})
Project: ${projectTitle}
Hourly Rate: $${(hourlyRateCents / 100).toFixed(2)}/hr
Deliverables: ${deliverables.join('; ')}`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          structuredSOW: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                item: { type: 'STRING' },
                description: { type: 'STRING' },
                estimatedHours: { type: 'NUMBER' },
              },
            },
          },
          legalClauses: { type: 'ARRAY', items: { type: 'STRING' } },
          fullContractMarkdown: { type: 'STRING' },
        },
      },
    });

    await this.tokenMeter.record({
      userId: freelancerId,
      appId: 'freelanceos',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'DOC_GEN',
      timestamp: new Date().toISOString(),
    });

    const contract = await (this.prisma as any).clientContract.create({
      data: {
        freelancerId,
        clientName,
        clientEmail,
        deliverablesJson: JSON.stringify(result.data.structuredSOW),
        hourlyRateCents,
      },
    });

    this.wsGateway.broadcastEvent({
      type: 'QUOTA_HIT',
      appId: 'freelanceos',
      userId: freelancerId,
      data: { featureKey: 'DOC_GEN', contractId: contract.id },
      timestamp: new Date().toISOString(),
    });

    return { contract, contractDetails: result.data };
  }

  // FR-3.2: AI Proposal Generation
  async generateProposal(
    freelancerId: string,
    clientName: string,
    projectBrief: string,
    estimatedBudgetCents: number,
  ) {
    const result = await this.gemini.generate<{
      executiveSummary: string;
      milestones: Array<{ name: string; timelineDays: number; deliverable: string }>;
      pitchRationale: string;
    }>({
      model: 'fast',
      prompt: `Draft a high-conversion client proposal based on brief:
Client: ${clientName}
Budget: $${(estimatedBudgetCents / 100).toFixed(2)}
Brief: "${projectBrief}"`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          executiveSummary: { type: 'STRING' },
          milestones: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                timelineDays: { type: 'INTEGER' },
                deliverable: { type: 'STRING' },
              },
            },
          },
          pitchRationale: { type: 'STRING' },
        },
      },
    });

    return result.data;
  }

  // FR-3.2: Milestone Invoice Generation
  async createMilestoneInvoice(
    contractId: string,
    amountCents: number,
    dueDate: Date,
  ) {
    const invoice = await (this.prisma as any).invoiceRecord.create({
      data: {
        contractId,
        amountCents,
        dueDate,
        status: 'ISSUED',
      },
    });

    return invoice;
  }

  // FR-3.3: Receipt OCR
  async scanReceiptOcr(freelancerId: string, imageBase64: string) {
    const result = await this.gemini.generate<{
      vendor: string;
      totalAmountCents: number;
      taxDeductionCategory: string;
      date: string;
      confidence: number;
    }>({
      model: 'fast',
      prompt: `Extract receipt data and categorize tax deduction (e.g. Office Supplies, Software, Travel, Meals).`,
      images: [
        {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      ],
      responseSchema: {
        type: 'OBJECT',
        properties: {
          vendor: { type: 'STRING' },
          totalAmountCents: { type: 'INTEGER' },
          taxDeductionCategory: { type: 'STRING' },
          date: { type: 'STRING' },
          confidence: { type: 'NUMBER' },
        },
      },
    });

    await this.tokenMeter.record({
      userId: freelancerId,
      appId: 'freelanceos',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'RECEIPT_OCR',
      timestamp: new Date().toISOString(),
    });

    return result.data;
  }

  // FR-3.4: Scope-Creep Shield
  async analyzeScopeCreepShield(
    freelancerId: string,
    contractId: string,
    clientMessage: string,
  ) {
    const contract = await (this.prisma as any).clientContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException(`Contract ${contractId} not found`);
    }

    const result = await this.gemini.generate<{
      isScopeCreep: boolean;
      scopeDeviationPercent: number;
      explanation: string;
      changeOrderEstimate: {
        title: string;
        additionalHours: number;
        costCents: number;
        politeEmailResponse: string;
      };
    }>({
      model: 'copilot',
      prompt: `Scope-Creep Shield Autonomous Evaluator:
Compare this incoming client request against the agreed contract deliverables:
AGREED SOW:
${contract.deliverablesJson}

CLIENT REQUEST MESSAGE:
"${clientMessage}"

Determine if this is out-of-scope, calculate deviation percentage, and draft a polite change-order email.`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          isScopeCreep: { type: 'BOOLEAN' },
          scopeDeviationPercent: { type: 'NUMBER' },
          explanation: { type: 'STRING' },
          changeOrderEstimate: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              additionalHours: { type: 'NUMBER' },
              costCents: { type: 'INTEGER' },
              politeEmailResponse: { type: 'STRING' },
            },
          },
        },
      },
    });

    return result.data;
  }

  // FR-3.5: Trigger Autonomous Collections Chaser
  async triggerCollectionsChaser(invoiceId: string) {
    const invoice = await (this.prisma as any).invoiceRecord.findUnique({
      where: { id: invoiceId },
      include: { contract: true },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    const job = await this.queue.addJob('invoice-collections-chaser', {
      invoiceId: invoice.id,
      contractId: invoice.contractId,
      clientEmail: invoice.contract.clientEmail,
      amountCents: invoice.amountCents,
      chaseCount: invoice.copilotChaseCount,
    });

    return { queued: true, jobId: job.id };
  }

  async handleStripeWebhook(paymentEvent: any) {
    const invoiceId = paymentEvent?.data?.object?.metadata?.invoiceId;
    if (invoiceId) {
      await (this.prisma as any).invoiceRecord.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      });
    }

    this.wsGateway.broadcastEvent({
      type: 'COPILOT_SUBSCRIBED',
      appId: 'freelanceos',
      data: { event: 'PAYMENT_RECEIVED', invoiceId },
      timestamp: new Date().toISOString(),
    });

    return { received: true };
  }
}
