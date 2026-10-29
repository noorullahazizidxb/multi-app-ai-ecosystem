import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/db-core';
import { RedisModule, AdminWsGateway, TaskQueueService } from '@repo/backend-core';
import { AiSdkModule } from '@repo/ai-sdk';
import { FreelanceController } from './freelance.controller';
import { FreelanceService } from './freelance.service';

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
  controllers: [FreelanceController],
  providers: [FreelanceService, AdminWsGateway, TaskQueueService],
})
export class AppModule { }
