import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COPILOT_METADATA_KEY } from '../decorators/require-copilot.decorator';
import Redis from 'ioredis';

@Injectable()
export class CopilotProGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresCopilot = this.reflector.get<boolean>(
      COPILOT_METADATA_KEY,
      context.getHandler(),
    );

    if (!requiresCopilot) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // Check Redis cache for subscription status
    const subStatus = await this.redis.get(`sub:status:${userId}`);

    if (subStatus !== 'active' && subStatus !== 'trialing') {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          error: 'Copilot Required',
          message: 'This feature requires an active Copilot subscription.',
          upgradeUrl: `/api/v1/billing/upgrade`,
          currentStatus: subStatus || 'none',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}
