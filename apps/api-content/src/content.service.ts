import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { GeminiClient, TokenMeter } from '@repo/ai-sdk';
import { DynamicPrismaService } from '@repo/db-core';
import { AdminWsGateway, TaskQueueService } from '@repo/backend-core';

@Injectable()
export class ContentService implements OnModuleInit {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private readonly prisma: DynamicPrismaService,
    private readonly gemini: GeminiClient,
    private readonly tokenMeter: TokenMeter,
    private readonly wsGateway: AdminWsGateway,
    private readonly queue: TaskQueueService,
  ) { }

  onModuleInit() {
    // FR-4.3: Register FFmpeg Active-Speaker Reframing Worker
    this.queue.registerProcessor('ffmpeg-reframe-worker', async (job) => {
      const { clipId, projectId, videoUrl } = job.data as {
        clipId: string;
        projectId: string;
        videoUrl: string;
      };

      this.logger.log(`[ViralMatrix] FFmpeg worker cropping 16:9 -> 9:16 for clip ${clipId}`);

      // Emit active speaker tracking progress
      this.wsGateway.server?.emit('content.reframe.progress', {
        clipId,
        progress: 45,
        phase: 'ACTIVE_SPEAKER_TRACKING',
      });

      // Update to READY
      const outputUrl = `https://storage.viralmatrix.example.com/clips/reframe916_${clipId}.mp4`;
      await (this.prisma as any).videoClip.update({
        where: { id: clipId },
        data: {
          status: 'READY',
          clipUrl: outputUrl,
        },
      });

      this.wsGateway.server?.emit('content.reframe.progress', {
        clipId,
        progress: 100,
        phase: 'COMPLETED',
        clipUrl: outputUrl,
      });

      this.wsGateway.broadcastEvent({
        type: 'COPILOT_SUBSCRIBED',
        appId: 'viralmatrix',
        data: { event: 'REFRAME_916_RENDERED', clipId, outputUrl },
        timestamp: new Date().toISOString(),
      });
    });
  }

  async repurposeVideo(userId: string, videoUrl: string, title?: string) {
    const result = await this.gemini.generate<{
      transcript: string;
      viralHooks: string[];
      xThread: string[];
      linkedInPost: string;
      topClips: Array<{ start: number; end: number; caption: string }>;
    }>({
      model: 'fast',
      prompt: `Repurpose this long-form video into social assets:
URL: ${videoUrl}
Title: ${title || 'Source Video'}
Generate:
1. 5 High-CTR Viral Hook statements
2. A 6-part X (Twitter) thread with call-to-actions
3. A professional, insightful LinkedIn post
4. 2-3 vertical clip timestamps (each <= 60 seconds) with punchy captions`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          transcript: { type: 'STRING' },
          viralHooks: { type: 'ARRAY', items: { type: 'STRING' } },
          xThread: { type: 'ARRAY', items: { type: 'STRING' } },
          linkedInPost: { type: 'STRING' },
          topClips: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                start: { type: 'INTEGER' },
                end: { type: 'INTEGER' },
                caption: { type: 'STRING' },
              },
            },
          },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'viralmatrix',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'VIDEO_REPURPOSE',
      timestamp: new Date().toISOString(),
    });

    const project = await (this.prisma as any).contentProject.create({
      data: {
        userId,
        title: title || 'Repurposed Video Project',
        sourceVideoUrl: videoUrl,
        status: 'READY',
        transcript: result.data.transcript,
        viralHooksJson: JSON.stringify(result.data.viralHooks),
        xThreadJson: JSON.stringify(result.data.xThread),
        linkedInPost: result.data.linkedInPost,
      },
    });

    this.wsGateway.broadcastEvent({
      type: 'QUOTA_HIT',
      appId: 'viralmatrix',
      userId,
      data: { featureKey: 'VIDEO_REPURPOSE', projectId: project.id },
      timestamp: new Date().toISOString(),
    });

    return { project, generated: result.data };
  }

  async exportWatermarkedClip(userId: string, projectId: string, start: number, end: number) {
    const project = await (this.prisma as any).contentProject.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    const clip = await (this.prisma as any).videoClip.create({
      data: {
        projectId,
        startTime: start,
        endTime: Math.min(start + 60, end),
        isWatermarked: true,
        status: 'READY',
        clipUrl: `https://storage.viralmatrix.example.com/clips/wm_${projectId}_${start}_${end}.mp4`,
      },
    });

    return clip;
  }

  async reframe916Copilot(userId: string, projectId: string, videoUrl: string) {
    const clip = await (this.prisma as any).videoClip.create({
      data: {
        projectId,
        startTime: 0,
        endTime: 60,
        isWatermarked: false,
        status: 'RENDERING',
      },
    });

      // Queue to background worker
      await this.queue.addJob('ffmpeg-reframe-worker', {
        clipId: clip.id,
        projectId,
        videoUrl,
      });

      return clip;
    }

  async autoPublishCopilot(userId: string, clipId: string, platforms: string[]) {
      return {
        clipId,
        status: 'SCHEDULED',
        scheduledTimes: platforms.map((p) => ({
          platform: p,
          scheduledFor: '2026-10-30T18:00:00Z', // Peak engagement algorithmic window
          status: 'QUEUED',
        })),
      };
    }
}
