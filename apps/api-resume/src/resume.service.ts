import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { GeminiClient, TokenMeter } from '@repo/ai-sdk';
import { DynamicPrismaService } from '@repo/db-core';
import { AdminWsGateway, TaskQueueService } from '@repo/backend-core';

@Injectable()
export class ResumeService implements OnModuleInit {
  constructor(
    private readonly prisma: DynamicPrismaService,
    private readonly gemini: GeminiClient,
    private readonly tokenMeter: TokenMeter,
    private readonly wsGateway: AdminWsGateway,
    private readonly queue: TaskQueueService,
  ) { }

  onModuleInit() {
    // FR-1.6: Register BullMQ background processor for auto-tracking applications & scheduling follow-ups
    this.queue.registerProcessor('resume-auto-tracker', async (job) => {
      const { applicationId, userId, companyName } = job.data as {
        applicationId: string;
        userId: string;
        companyName: string;
      };

      // Transition application to FOLLOW_UP_SENT
      await (this.prisma as any).copilotJobApplication.update({
        where: { id: applicationId },
        data: { status: 'FOLLOW_UP_SENT' },
      });

      this.wsGateway.broadcastEvent({
        type: 'COPILOT_SUBSCRIBED',
        appId: 'careerforge',
        userId,
        data: {
          event: 'AUTO_TRACKER_FOLLOWUP_DISPATCHED',
          applicationId,
          companyName,
        },
        timestamp: new Date().toISOString(),
      });
    });
  }

  async parseResume(userId: string, title: string, rawText?: string) {
    const textContent = rawText || 'Sample Resume Content with Experience and Skills';

    const result = await this.gemini.generate<{
      title: string;
      skills: string[];
      experience: Array<{ role: string; company: string; duration: string; bullets: string[] }>;
    }>({
      model: 'fast',
      prompt: `Parse the following resume text into a structured JSON schema:
${textContent}`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          skills: { type: 'ARRAY', items: { type: 'STRING' } },
          experience: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                role: { type: 'STRING' },
                company: { type: 'STRING' },
                duration: { type: 'STRING' },
                bullets: { type: 'ARRAY', items: { type: 'STRING' } },
              },
            },
          },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'careerforge',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'RESUME_PARSE',
      timestamp: new Date().toISOString(),
    });

    const doc = await (this.prisma as any).resumeDocument.create({
      data: {
        userId,
        title: title || 'Parsed Resume',
        templateId: 'executive-modern',
        themePreset: 'clean-slate',
        sectionsJson: JSON.stringify(result.data),
      },
    });

    return doc;
  }

  async runAtsScan(userId: string, resumeId: string, jobDescription: string) {
    const resume = await (this.prisma as any).resumeDocument.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException(`Resume ${resumeId} not found`);
    }

    const result = await this.gemini.generate<{
      atsScore: number;
      matchedKeywords: string[];
      missingKeywords: string[];
      gapAnalysis: string;
      recommendations: string[];
    }>({
      model: 'fast',
      prompt: `Perform an ATS keyword and gap scan for this resume against the target job description:
RESUME DATA:
${resume.sectionsJson}

JOB DESCRIPTION:
${jobDescription}`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          atsScore: { type: 'INTEGER' },
          matchedKeywords: { type: 'ARRAY', items: { type: 'STRING' } },
          missingKeywords: { type: 'ARRAY', items: { type: 'STRING' } },
          gapAnalysis: { type: 'STRING' },
          recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'careerforge',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'ATS_SCAN',
      timestamp: new Date().toISOString(),
    });

    await (this.prisma as any).resumeDocument.update({
      where: { id: resumeId },
      data: { atsScore: result.data.atsScore },
    });

    this.wsGateway.broadcastEvent({
      type: 'QUOTA_HIT',
      appId: 'careerforge',
      userId,
      data: { featureKey: 'ATS_SCAN', score: result.data.atsScore },
      timestamp: new Date().toISOString(),
    });

    return result.data;
  }

  async rewriteBulletStar(userId: string, rawBullet: string, targetRole?: string) {
    const result = await this.gemini.generate<{
      situation: string;
      task: string;
      action: string;
      result: string;
      starBullet: string;
    }>({
      model: 'fast',
      prompt: `Rewrite this resume accomplishment using the STAR (Situation, Task, Action, Result) method for target role "${targetRole || 'Software Engineer'}":
Original: "${rawBullet}"`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          situation: { type: 'STRING' },
          task: { type: 'STRING' },
          action: { type: 'STRING' },
          result: { type: 'STRING' },
          starBullet: { type: 'STRING' },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'careerforge',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'STAR_REWRITE',
      timestamp: new Date().toISOString(),
    });

    return result.data;
  }

  async tailorJobCopilot(userId: string, jobUrl: string, companyName?: string) {
    const application = await (this.prisma as any).copilotJobApplication.create({
      data: {
        userId,
        companyName: companyName || 'Target Enterprise',
        jobUrl,
        status: 'QUEUED',
      },
    });

    // Stream progress via WebSocket event 'resume.tailor.progress'
    this.wsGateway.server?.emit('resume.tailor.progress', {
      applicationId: application.id,
      status: 'SCRAPING_JOB',
      progress: 25,
    });

    const result = await this.gemini.generate<{
      coverLetter: string;
      customSummary: string;
      priorityKeywords: string[];
    }>({
      model: 'copilot',
      prompt: `Generate an autonomous bespoke cover letter and tailored career summary for job posting at: ${jobUrl} (Company: ${companyName || 'Target Enterprise'}).`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          coverLetter: { type: 'STRING' },
          customSummary: { type: 'STRING' },
          priorityKeywords: { type: 'ARRAY', items: { type: 'STRING' } },
        },
      },
    });

    await (this.prisma as any).copilotJobApplication.update({
      where: { id: application.id },
      data: {
        status: 'TAILORED',
        tailoredPdfUrl: `https://storage.careerforge.example.com/tailored/${application.id}.pdf`,
      },
    });

    // FR-1.6: Auto-schedule follow-up task via Queue (scheduled for 72 hours, 5000ms in simulation)
    await this.queue.addJob(
      'resume-auto-tracker',
      {
        applicationId: application.id,
        userId,
        companyName: companyName || 'Target Enterprise',
      },
      { delayMs: 5000 },
    );

    this.wsGateway.server?.emit('resume.tailor.progress', {
      applicationId: application.id,
      status: 'COMPLETED',
      progress: 100,
      tailoredPdfUrl: `https://storage.careerforge.example.com/tailored/${application.id}.pdf`,
    });

    return {
      applicationId: application.id,
      status: 'TAILORED',
      coverLetter: result.data.coverLetter,
      tailoredPdfUrl: `https://storage.careerforge.example.com/tailored/${application.id}.pdf`,
    };
  }

  // FR-1.5: Voice Interview Prep
  async gradeVoiceInterview(
    userId: string,
    question: string,
    transcript: string,
    companyRubric?: string,
  ) {
    const result = await this.gemini.generate<{
      overallScore: number;
      starScore: number;
      relevanceScore: number;
      communicationScore: number;
      strengths: string[];
      areasForImprovement: string[];
      modelAnswer: string;
    }>({
      model: 'copilot',
      prompt: `Act as an expert technical mock interviewer. Grade this spoken answer against company interview rubric:
RUBRIC: "${companyRubric || 'Amazon Leadership Principles / Google Engineering Competencies'}"
QUESTION: "${question}"
SPOKEN ANSWER TRANSCRIPT: "${transcript}"
Grade across STAR structure, technical depth, and actionable coaching recommendations.`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          overallScore: { type: 'INTEGER' },
          starScore: { type: 'INTEGER' },
          relevanceScore: { type: 'INTEGER' },
          communicationScore: { type: 'INTEGER' },
          strengths: { type: 'ARRAY', items: { type: 'STRING' } },
          areasForImprovement: { type: 'ARRAY', items: { type: 'STRING' } },
          modelAnswer: { type: 'STRING' },
        },
      },
    });

    return result.data;
  }
}
