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
import { ContentService } from './content.service';

@Controller('api/v1')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'api-content',
      port: 4004,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('content/repurpose')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('VIDEO_REPURPOSE', 1)
  async repurposeVideo(
    @Req() req: any,
    @Body() body: { videoUrl: string; title?: string },
  ) {
    const userId = req.user?.id || 'demo-user-4';
    return this.contentService.repurposeVideo(userId, body.videoUrl, body.title);
  }

  @Post('content/export-clip')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('CLIP_EXPORT', 1)
  async exportClip(
    @Req() req: any,
    @Body() body: { projectId: string; startTime: number; endTime: number },
  ) {
    const userId = req.user?.id || 'demo-user-4';
    return this.contentService.exportWatermarkedClip(
      userId,
      body.projectId,
      body.startTime,
      body.endTime,
    );
  }

  @Post('copilot/reframe-916')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async reframe916(
    @Req() req: any,
    @Body() body: { projectId: string; videoUrl: string },
  ) {
    const userId = req.user?.id || 'demo-user-4';
    return this.contentService.reframe916Copilot(userId, body.projectId, body.videoUrl);
  }

  @Post('copilot/auto-publish')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async autoPublish(
    @Req() req: any,
    @Body() body: { clipId: string; platforms: string[] },
  ) {
    const userId = req.user?.id || 'demo-user-4';
    return this.contentService.autoPublishCopilot(userId, body.clipId, body.platforms);
  }
}

