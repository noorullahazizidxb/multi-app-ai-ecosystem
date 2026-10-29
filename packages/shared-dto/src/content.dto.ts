import { z } from 'zod';

export const RepurposeVideoRequestSchema = z.object({
  videoUrl: z.string().url().optional(),
  videoFileUrl: z.string().optional(),
  title: z.string().optional(),
  targetPlatforms: z.array(z.enum(['TIKTOK', 'REELS', 'SHORTS', 'X_TWITTER', 'LINKEDIN'])).default([
    'TIKTOK',
    'REELS',
    'SHORTS',
    'X_TWITTER',
    'LINKEDIN',
  ]),
});

export const RepurposedContentResultSchema = z.object({
  summary: z.string(),
  viralHooks: z.array(z.string()),
  xThread: z.array(z.string()),
  linkedInPost: z.string(),
  suggestedClips: z.array(
    z.object({
      startTimeSeconds: z.number(),
      endTimeSeconds: z.number(),
      hookText: z.string(),
      estimatedViralityScore: z.number(),
    }),
  ),
});

export const ReframeVideoJobSchema = z.object({
  videoId: z.string(),
  aspectRatio: z.literal('9:16').default('9:16'),
  addAnimatedCaptions: z.boolean().default(true),
  removeWatermark: z.boolean().default(true),
});

export type RepurposeVideoRequestDto = z.infer<typeof RepurposeVideoRequestSchema>;
export type RepurposedContentResultDto = z.infer<typeof RepurposedContentResultSchema>;
export type ReframeVideoJobDto = z.infer<typeof ReframeVideoJobSchema>;

