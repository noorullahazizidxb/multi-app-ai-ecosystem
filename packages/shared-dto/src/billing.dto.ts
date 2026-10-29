import { z } from 'zod';

export const UsageQuotaStatusSchema = z.object({
  featureKey: z.string(),
  used: z.number(),
  limit: z.number(),
  remaining: z.number(),
  periodKey: z.string(),
  resetAt: z.string().datetime(),
});

export const SubscriptionStatusSchema = z.object({
  userId: z.string(),
  appId: z.string(),
  status: z.enum(['active', 'trialing', 'cancelled', 'expired', 'none']),
  planName: z.string().optional(),
  priceId: z.string().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
});

export const UpgradeRequestSchema = z.object({
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type UsageQuotaStatusDto = z.infer<typeof UsageQuotaStatusSchema>;
export type SubscriptionStatusDto = z.infer<typeof SubscriptionStatusSchema>;
export type UpgradeRequestDto = z.infer<typeof UpgradeRequestSchema>;

