import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/db-core';
import { RedisModule, AdminWsGateway, TaskQueueService } from '@repo/backend-core';
import { AiSdkModule } from '@repo/ai-sdk';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  imports: [
    PrismaModule,
    RedisModule.forRoot(process.env.REDIS_URL),
    AiSdkModule.forRoot({
      apiKey: process.env.GEMINI_API_KEY,
      fastModel: process.env.GEMINI_MODEL_FAST || 'gemini-2.5-flash',
      copilotModel: process.env.GEMINI_MODEL_COPILOT || 'gemini-2.5-pro',
    }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService, AdminWsGateway, TaskQueueService],
})
export class AppModule { }
