import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  UseQuota,
  RequireCopilot,
  UsageQuotaGuard,
  CopilotProGuard,
} from '@repo/backend-core';
import { FreelanceService } from './freelance.service';

@Controller('api/v1')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) { }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'api-freelance',
      port: 4003,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('contracts/generate')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('DOC_GEN', 1)
  async generateContract(
    @Req() req: any,
    @Body()
    body: {
      clientName: string;
      clientEmail: string;
      projectTitle: string;
      deliverables: string[];
      hourlyRateCents: number;
    },
  ) {
    const userId = req.user?.id || 'demo-user-3';
    return this.freelanceService.generateContract(
      userId,
      body.clientName,
      body.clientEmail,
      body.projectTitle,
      body.deliverables,
      body.hourlyRateCents,
    );
  }

  @Post('proposals/generate')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('DOC_GEN', 1)
  async generateProposal(
    @Req() req: any,
    @Body()
    body: {
      clientName: string;
      projectBrief: string;
      estimatedBudgetCents: number;
    },
  ) {
    const userId = req.user?.id || 'demo-user-3';
    return this.freelanceService.generateProposal(
      userId,
      body.clientName,
      body.projectBrief,
      body.estimatedBudgetCents,
    );
  }

  @Post('receipts/ocr')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('RECEIPT_OCR', 1)
  async scanReceipt(
    @Req() req: any,
    @Body() body: { imageBase64: string },
  ) {
    const userId = req.user?.id || 'demo-user-3';
    return this.freelanceService.scanReceiptOcr(userId, body.imageBase64);
  }

  @Post('copilot/analyze-scope')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async analyzeScope(
    @Req() req: any,
    @Body() body: { contractId: string; clientMessage: string },
  ) {
    const userId = req.user?.id || 'demo-user-3';
    return this.freelanceService.analyzeScopeCreepShield(
      userId,
      body.contractId,
      body.clientMessage,
    );
  }

  @Post('copilot/collections/chase')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async triggerCollections(@Body() body: { invoiceId: string }) {
    return this.freelanceService.triggerCollectionsChaser(body.invoiceId);
  }

  @Post('webhooks/stripe')
  async stripeWebhook(@Body() payload: any) {
    return this.freelanceService.handleStripeWebhook(payload);
  }
}
