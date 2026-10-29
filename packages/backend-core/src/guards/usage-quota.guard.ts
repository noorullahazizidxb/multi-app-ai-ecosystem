import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QUOTA_METADATA_KEY, QuotaMetadata } from '../decorators/use-quota.decorator';
import Redis from 'ioredis';

const QUOTA_LUA_SCRIPT = `
local key = KEYS[1]
local cost = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local ttl = tonumber(ARGV[3])

local current = redis.call('GET', key)
if current == false then
  redis.call('SET', key, cost, 'EX', ttl)
  return cost
end

current = tonumber(current)
if current + cost > limit then
  return -1
end

redis.call('INCRBY', key, cost)
local remaining_ttl = redis.call('TTL', key)
if remaining_ttl == -1 then
  redis.call('EXPIRE', key, ttl)
end

return current + cost
`;

@Injectable()
export class UsageQuotaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<QuotaMetadata>(
      QUOTA_METADATA_KEY,
      context.getHandler(),
    );

    if (!metadata) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const freeQuota = parseInt(process.env.FREE_MONTHLY_QUOTA || '5', 10);
    const periodKey = this.getCurrentPeriodKey();
    const redisKey = `quota:${userId}:${metadata.featureKey}:${periodKey}`;
    
    // TTL: seconds remaining until end of current month
    const ttl = this.getSecondsUntilMonthEnd();

    const result = await this.redis.eval(
      QUOTA_LUA_SCRIPT,
      1,
      redisKey,
      metadata.cost,
      freeQuota,
      ttl,
    ) as number;

    if (result === -1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          error: 'Quota Exhausted',
          message: `Free ${metadata.featureKey} quota (${freeQuota}/month) has been exhausted.`,
          upgradeUrl: `/api/v1/billing/upgrade`,
          featureKey: metadata.featureKey,
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }

  private getCurrentPeriodKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getSecondsUntilMonthEnd(): number {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return Math.floor((endOfMonth.getTime() - now.getTime()) / 1000);
  }
}
