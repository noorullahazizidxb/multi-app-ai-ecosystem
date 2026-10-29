import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export interface QueuedJob<T = Record<string, unknown>> {
  id: string;
  queueName: string;
  data: T;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  attempts: number;
  maxAttempts: number;
  delayMs?: number;
  runAt: number;
  createdAt: number;
  updatedAt: number;
}

export type JobProcessor<T = Record<string, unknown>, R = unknown> = (
  job: QueuedJob<T>,
) => Promise<R>;

@Injectable()
export class TaskQueueService {
  private readonly logger = new Logger(TaskQueueService.name);
  private processors = new Map<string, JobProcessor<any, any>>();
  private polling = false;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
    this.startWorkerLoop();
  }

  async addJob<T extends Record<string, unknown>>(
    queueName: string,
    data: T,
    options?: { delayMs?: number; maxAttempts?: number },
  ): Promise<QueuedJob<T>> {
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();
    const delayMs = options?.delayMs || 0;

    const job: QueuedJob<T> = {
      id,
      queueName,
      data,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      delayMs,
      runAt: now + delayMs,
      createdAt: now,
      updatedAt: now,
    };

    const serialized = JSON.stringify(job);
    await this.redis.hset(`queue:${queueName}:jobs`, id, serialized);
    await this.redis.zadd(`queue:${queueName}:schedule`, job.runAt, id);

    this.logger.log(`[Queue] Added job ${id} to "${queueName}" (delay: ${delayMs}ms)`);
    return job;
  }

  registerProcessor<T = Record<string, unknown>, R = unknown>(
    queueName: string,
    processor: JobProcessor<T, R>,
  ): void {
    this.processors.set(queueName, processor);
    this.logger.log(`[Queue] Registered worker processor for "${queueName}"`);
  }

  private async startWorkerLoop(): Promise<void> {
    if (this.polling) return;
    this.polling = true;

    const poll = async () => {
      try {
        const now = Date.now();
        for (const [queueName, processor] of this.processors.entries()) {
          const readyIds = await this.redis.zrangebyscore(
            `queue:${queueName}:schedule`,
            0,
            now,
            'LIMIT',
            0,
            5,
          );

          for (const id of readyIds) {
            const removed = await this.redis.zrem(`queue:${queueName}:schedule`, id);
            if (removed === 0) continue;

            const raw = await this.redis.hget(`queue:${queueName}:jobs`, id);
            if (!raw) continue;

            const job: QueuedJob = JSON.parse(raw);
            job.status = 'PROCESSING';
            job.attempts += 1;
            job.updatedAt = Date.now();
            await this.redis.hset(`queue:${queueName}:jobs`, id, JSON.stringify(job));

            try {
              this.logger.log(`[Queue] Executing ${queueName} job ${id} (attempt ${job.attempts})`);
              await processor(job);
              job.status = 'COMPLETED';
              job.updatedAt = Date.now();
              await this.redis.hset(`queue:${queueName}:jobs`, id, JSON.stringify(job));
            } catch (err: any) {
              this.logger.error(`[Queue] Job ${id} failed: ${err?.message}`);
              if (job.attempts < job.maxAttempts) {
                job.status = 'PENDING';
                job.runAt = Date.now() + 5000 * job.attempts;
                await this.redis.hset(`queue:${queueName}:jobs`, id, JSON.stringify(job));
                await this.redis.zadd(`queue:${queueName}:schedule`, job.runAt, id);
              } else {
                job.status = 'FAILED';
                await this.redis.hset(`queue:${queueName}:jobs`, id, JSON.stringify(job));
              }
            }
          }
        }
      } catch (err) {
        // Redis connection might still be initializing
      }

      if (this.polling) {
        setTimeout(poll, 1500);
      }
    };

    setTimeout(poll, 1000);
  }
}

