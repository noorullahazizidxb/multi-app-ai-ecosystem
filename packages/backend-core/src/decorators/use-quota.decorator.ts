import { SetMetadata } from '@nestjs/common';

export const QUOTA_METADATA_KEY = 'usage_quota';

export interface QuotaMetadata {
  featureKey: string;
  cost: number;
}

/**
 * Decorator that marks an endpoint as usage-capped (Model 1 - Free Tier).
 * Works with UsageQuotaGuard to enforce monthly/weekly limits via Redis.
 * 
 * @example @UseQuota('ATS_SCAN', 1)
 */
export const UseQuota = (featureKey: string, cost: number = 1) =>
  SetMetadata(QUOTA_METADATA_KEY, { featureKey, cost } as QuotaMetadata);
