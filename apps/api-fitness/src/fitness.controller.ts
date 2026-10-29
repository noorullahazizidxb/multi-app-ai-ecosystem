import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  UseQuota,
  RequireCopilot,
  UsageQuotaGuard,
  CopilotProGuard,
} from '@repo/backend-core';
import { FitnessService } from './fitness.service';

@Controller('api/v1')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) { }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'api-fitness',
      port: 4002,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('nutrition/meal-scan')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('MEAL_SCAN', 1)
  async scanMeal(
    @Req() req: any,
    @Body() body: { imageBase64: string; notes?: string },
  ) {
    const userId = req.user?.id || 'demo-user-2';
    return this.fitnessService.scanMealPhoto(userId, body.imageBase64, body.notes);
  }

  @Post('workouts/split-generate')
  @UseGuards(UsageQuotaGuard)
  @UseQuota('WORKOUT_SPLIT', 1)
  async generateSplit(
    @Req() req: any,
    @Body()
    body: {
      experienceLevel?: string;
      availableEquipment?: string[];
      daysPerWeek?: number;
    },
  ) {
    const userId = req.user?.id || 'demo-user-2';
    return this.fitnessService.generateWorkoutSplit(
      userId,
      body.experienceLevel || 'Intermediate',
      body.availableEquipment || ['Barbell', 'Dumbbells', 'Bench'],
      body.daysPerWeek || 4,
    );
  }

  @Post('copilot/biometric-sync')
  @UseGuards(CopilotProGuard)
  @RequireCopilot()
  async biometricSync(
    @Req() req: any,
    @Body()
    body: {
      hrv: number;
      sleepHours: number;
      restingHeartRate?: number;
    },
  ) {
    const userId = req.user?.id || 'demo-user-2';
    return this.fitnessService.syncBiometricsCopilot(
      userId,
      body.hrv,
      body.sleepHours,
      body.restingHeartRate,
    );
  }

  // FR-2.1: 1RM Progression
  @Post('workouts/1rm-calculate')
  calculate1RM(@Body() body: { weightKg: number; reps: number }) {
    return this.fitnessService.calculate1RM(body.weightKg, body.reps);
  }
}
