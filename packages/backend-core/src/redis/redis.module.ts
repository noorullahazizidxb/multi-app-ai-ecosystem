import { Module, Global, DynamicModule } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({})
export class RedisModule {
  static forRoot(url?: string): DynamicModule {
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379';
        const client = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy(times: number) {
            const delay = Math.min(times * 200, 5000);
            return delay;
          },
          lazyConnect: true,
        });

        client.on('error', (err) => {
          console.error('[Redis] Connection error:', err.message);
        });

        client.on('connect', () => {
          console.log('[Redis] Connected successfully');
        });

        return client;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: ['REDIS_CLIENT'],
    };
  }
}
