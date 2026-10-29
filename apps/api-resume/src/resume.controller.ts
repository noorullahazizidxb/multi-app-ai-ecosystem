import {
  Controller,
  Post,
  Get,
  Param,
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
import { ResumeService } from './resume.service';

@Controller('api/v1')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) { }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'api-resume',
      port: 4001,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('resumes/parse')
  async parseResume(
    @Req() req: any,
    @Body() body: { title?: string; rawText?: string },
  ) {
    const userId = req.user?.id || 'demo-user-1';
    return this.resumeService.parseResume(userId, body.title || 'My Resume', body.rawText);
  }

  @Post('resumes/:id/ats-scan')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('ATS_SCAN', 1)
  async atsScan(
    @Req() req: any,
    @Param('id') resumeId: string,
    @Body() body: { jobDescription: string },
  ) {
    const userId = req.user?.id || 'demo-user-1';
    return this.resumeService.runAtsScan(userId, resumeId, body.jobDescription);
  }

  @Post('resumes/star-rewrite')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('STAR_REWRITE', 1)
  async starRewrite(
    @Req() req: any,
    @Body() body: { bullet: string; targetRole?: string },
  ) {
    const userId = req.user?.id || 'demo-user-1';
    return this.resumeService.rewriteBulletStar(userId, body.bullet, body.targetRole);
  }

  @Post('copilot/tailor-job')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async tailorJob(
    @Req() req: any,
    @Body() body: { jobUrl: string; companyName?: string },
  ) {
    const userId = req.user?.id || 'demo-user-1';
    return this.resumeService.tailorJobCopilot(userId, body.jobUrl, body.companyName);
  }

  // FR-1.5: Voice Mock Interview Grading
  @Post('copilot/voice-interview')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async voiceInterview(
    @Req() req: any,
    @Body()
    body: {
      question: string;
      transcript: string;
      companyRubric?: string;
    },
  ) {
    const userId = req.user?.id || 'demo-user-1';
    return this.resumeService.gradeVoiceInterview(
      userId,
      body.question,
      body.transcript,
      body.companyRubric,
    );
  }
}
