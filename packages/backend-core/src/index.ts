// Decorators
export { UseQuota, QUOTA_METADATA_KEY } from './decorators/use-quota.decorator';
export type { QuotaMetadata } from './decorators/use-quota.decorator';
export { RequireCopilot, COPILOT_METADATA_KEY } from './decorators/require-copilot.decorator';
export { Roles, ROLES_METADATA_KEY } from './decorators/roles.decorator';
export type { AppRole } from './decorators/roles.decorator';

// Guards
export { UsageQuotaGuard } from './guards/usage-quota.guard';
export { CopilotProGuard } from './guards/copilot-pro.guard';
export { RolesGuard } from './guards/roles.guard';

// Redis
export { RedisModule } from './redis/redis.module';

// Queue
export { TaskQueueService } from './queue/task-queue.service';
export type { QueuedJob, JobProcessor } from './queue/task-queue.service';

// WebSocket
export { AdminWsGateway } from './gateway/admin-ws.gateway';
export type { AdminEvent } from './gateway/admin-ws.gateway';

// Environment
export { validateEnv, envSchema } from './middleware/env-validation';
export type { AppEnv } from './middleware/env-validation';
