import { SetMetadata } from '@nestjs/common';

export const COPILOT_METADATA_KEY = 'require_copilot';

/**
 * Decorator that marks an endpoint as Copilot-only (Model 5 - Paid Tier).
 * Works with CopilotProGuard to validate Stripe/RevenueCat entitlement.
 * 
 * @example @RequireCopilot()
 */
export const RequireCopilot = () => SetMetadata(COPILOT_METADATA_KEY, true);
