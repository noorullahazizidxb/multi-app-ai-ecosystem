import Redis from 'ioredis';

export interface TokenUsageEntry {
  userId: string;
  appId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  featureKey: string;
  timestamp: string;
}

export class TokenMeter {
  private redis: Redis | null = null;

  constructor(redisUrl?: string) {
    const url = redisUrl || process.env.REDIS_URL;
    if (url) {
      this.redis = new Redis(url, { lazyConnect: true });
    }
  }

  async record(entry: TokenUsageEntry): Promise<void> {
    if (!this.redis) return;

    const monthKey = entry.timestamp.slice(0, 7); // YYYY-MM
    const dailyKey = entry.timestamp.slice(0, 10); // YYYY-MM-DD

    const pipeline = this.redis.pipeline();

    // Monthly aggregate per user
    pipeline.hincrby(
      `tokens:monthly:${entry.userId}:${monthKey}`,
      'totalTokens',
      entry.totalTokens,
    );
    pipeline.hincrby(
      `tokens:monthly:${entry.userId}:${monthKey}`,
      'requests',
      1,
    );

    // Daily aggregate per app
    pipeline.hincrby(
      `tokens:daily:${entry.appId}:${dailyKey}`,
      'totalTokens',
      entry.totalTokens,
    );
    pipeline.hincrby(
      `tokens:daily:${entry.appId}:${dailyKey}`,
      'requests',
      1,
    );

    // Recent requests list (keep last 1000 per app)
    pipeline.lpush(
      `tokens:recent:${entry.appId}`,
      JSON.stringify(entry),
    );
    pipeline.ltrim(`tokens:recent:${entry.appId}`, 0, 999);

    // Latency tracking for admin dashboard
    pipeline.lpush(
      `latency:${entry.appId}`,
      JSON.stringify({ ms: entry.latencyMs, model: entry.model, ts: entry.timestamp }),
    );
    pipeline.ltrim(`latency:${entry.appId}`, 0, 499);

    await pipeline.exec();
  }

  async getMonthlyUsage(userId: string, month: string): Promise<{ totalTokens: number; requests: number }> {
    if (!this.redis) return { totalTokens: 0, requests: 0 };
    const data = await this.redis.hgetall(`tokens:monthly:${userId}:${month}`);
    return {
      totalTokens: parseInt(data.totalTokens || '0', 10),
      requests: parseInt(data.requests || '0', 10),
    };
  }

  async getDailyAppUsage(appId: string, date: string): Promise<{ totalTokens: number; requests: number }> {
    if (!this.redis) return { totalTokens: 0, requests: 0 };
    const data = await this.redis.hgetall(`tokens:daily:${appId}:${date}`);
    return {
      totalTokens: parseInt(data.totalTokens || '0', 10),
      requests: parseInt(data.requests || '0', 10),
    };
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
