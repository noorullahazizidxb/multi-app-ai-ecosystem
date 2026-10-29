import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { GeminiClient, TokenMeter } from '@repo/ai-sdk';
import { DynamicPrismaService } from '@repo/db-core';
import { AdminWsGateway, TaskQueueService } from '@repo/backend-core';

@Injectable()
export class FitnessService implements OnModuleInit {
  private readonly logger = new Logger(FitnessService.name);

  constructor(
    private readonly prisma: DynamicPrismaService,
    private readonly gemini: GeminiClient,
    private readonly tokenMeter: TokenMeter,
    private readonly wsGateway: AdminWsGateway,
    private readonly queue: TaskQueueService,
  ) { }

  onModuleInit() {
    // FR-2.5: Register scheduled 06:00 Biometric Auto-Regulation processor
    this.queue.registerProcessor('biometric-autoregulation', async (job) => {
      const { userId, hrv, sleepHours } = job.data as {
        userId: string;
        hrv: number;
        sleepHours: number;
      };

      this.logger.log(`[KineticAI] Running 06:00 Auto-Regulation for user ${userId}`);
      return this.syncBiometricsCopilot(userId, hrv || 75, sleepHours || 7.5);
    });
  }

  async scanMealPhoto(userId: string, imageBase64: string, notes?: string) {
    const result = await this.gemini.generate<{
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      identifiedFoods: string[];
      confidence: number;
    }>({
      model: 'fast',
      prompt: `Analyze this meal photo and provide estimated nutritional macro breakdowns. Notes: ${notes || 'none'}`,
      images: [
        {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      ],
      responseSchema: {
        type: 'OBJECT',
        properties: {
          calories: { type: 'INTEGER' },
          proteinGrams: { type: 'INTEGER' },
          carbsGrams: { type: 'INTEGER' },
          fatGrams: { type: 'INTEGER' },
          identifiedFoods: { type: 'ARRAY', items: { type: 'STRING' } },
          confidence: { type: 'NUMBER' },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'kinetic',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'MEAL_SCAN',
      timestamp: new Date().toISOString(),
    });

    const meal = await (this.prisma as any).mealLog.create({
      data: {
        userId,
        calories: result.data.calories,
        proteinGrams: result.data.proteinGrams,
        carbsGrams: result.data.carbsGrams,
        fatGrams: result.data.fatGrams,
        aiConfidence: result.data.confidence || 0.92,
      },
    });

    this.wsGateway.broadcastEvent({
      type: 'QUOTA_HIT',
      appId: 'kinetic',
      userId,
      data: { featureKey: 'MEAL_SCAN', calories: result.data.calories },
      timestamp: new Date().toISOString(),
    });

    return { meal, breakdown: result.data };
  }

  async generateWorkoutSplit(
    userId: string,
    experienceLevel: string,
    availableEquipment: string[],
    daysPerWeek: number,
  ) {
    const result = await this.gemini.generate<{
      splitName: string;
      routine: Array<{
        day: string;
        focus: string;
        exercises: Array<{ name: string; sets: number; reps: string; rpe: number }>;
      }>;
      coachingNotes: string;
    }>({
      model: 'fast',
      prompt: `Create a customized ${daysPerWeek}-day workout split for an athlete with experience level "${experienceLevel}".
Available equipment: ${availableEquipment.join(', ')}.`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          splitName: { type: 'STRING' },
          routine: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                day: { type: 'STRING' },
                focus: { type: 'STRING' },
                exercises: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      name: { type: 'STRING' },
                      sets: { type: 'INTEGER' },
                      reps: { type: 'STRING' },
                      rpe: { type: 'NUMBER' },
                    },
                  },
                },
              },
            },
          },
          coachingNotes: { type: 'STRING' },
        },
      },
    });

    await this.tokenMeter.record({
      userId,
      appId: 'kinetic',
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      latencyMs: result.latencyMs,
      featureKey: 'WORKOUT_SPLIT',
      timestamp: new Date().toISOString(),
    });

    return result.data;
  }

  async syncBiometricsCopilot(
    userId: string,
    hrv: number,
    sleepHours: number,
    restingHeartRate?: number,
  ) {
    const result = await this.gemini.generate<{
      readinessScore: number;
      volumeMultiplier: number;
      trainingRecommendation: string;
      targetIntensity: string;
      dailyMacroAdjustment: { calories: number; proteinGrams: number };
    }>({
      model: 'copilot',
      prompt: `Autonomous Biometric Auto-Regulation Engine:
User metrics: HRV=${hrv}ms, Sleep=${sleepHours}h, RestingHR=${restingHeartRate || 60}bpm.
      Calculate physiological readiness score(0- 100) and prescribe autoregulated daily training volume adjustment + daily macro adjustment.`,
      responseSchema: {
        type: 'OBJECT',
        properties: {
          readinessScore: { type: 'INTEGER' },
          volumeMultiplier: { type: 'NUMBER' },
          trainingRecommendation: { type: 'STRING' },
          targetIntensity: { type: 'STRING' },
          dailyMacroAdjustment: {
            type: 'OBJECT',
            properties: {
              calories: { type: 'INTEGER' },
              proteinGrams: { type: 'INTEGER' },
            },
          },
        },
      },
    });

    const session = await (this.prisma as any).workoutSession.create({
      data: {
        userId,
        programName: 'Daily Autoregulated Microcycle',
        readinessScore: result.data.readinessScore,
        exercisesJson: JSON.stringify(result.data),
      },
    });

    return { session, autoregulation: result.data };
  }

  // FR-2.1: 1RM Progression Calculator
  calculate1RM(weightKg: number, reps: number): { oneRepMaxKg: number; percentages: Record<string, number> } {
    // Epley Formula: 1RM = weight * (1 + reps / 30)
    const oneRepMaxKg = Math.round(weightKg * (1 + reps / 30));
    return {
      oneRepMaxKg,
      percentages: {
        '95%': Math.round(oneRepMaxKg * 0.95),
        '90%': Math.round(oneRepMaxKg * 0.90),
        '85%': Math.round(oneRepMaxKg * 0.85),
        '80%': Math.round(oneRepMaxKg * 0.80),
        '70%': Math.round(oneRepMaxKg * 0.70),
      },
    };
  }
}
