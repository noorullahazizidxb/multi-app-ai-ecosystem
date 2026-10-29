import { z } from 'zod';

export const MealScanRequestSchema = z.object({
  imageBase64: z.string().min(1),
  notes: z.string().optional(),
});

export const MacroNutrientsSchema = z.object({
  calories: z.number().int().nonnegative(),
  proteinGrams: z.number().int().nonnegative(),
  carbsGrams: z.number().int().nonnegative(),
  fatGrams: z.number().int().nonnegative(),
  aiConfidence: z.number().min(0).max(1),
  identifiedFoods: z.array(z.string()),
});

export const BiometricSyncRequestSchema = z.object({
  hrv: z.number().positive(),
  restingHeartRate: z.number().positive().optional(),
  sleepHours: z.number().min(0).max(24),
  deepSleepHours: z.number().optional(),
  recordedDate: z.string(),
});

export const BiometricSyncResultSchema = z.object({
  readinessScore: z.number().int().min(0).max(100),
  adjustedVolumeMultiplier: z.number().positive(),
  recommendedIntensity: z.enum(['DELOAD', 'LIGHT', 'MODERATE', 'HIGH', 'MAXIMAL']),
  guidanceNotes: z.string(),
});

export type MealScanRequestDto = z.infer<typeof MealScanRequestSchema>;
export type MacroNutrientsDto = z.infer<typeof MacroNutrientsSchema>;
export type BiometricSyncRequestDto = z.infer<typeof BiometricSyncRequestSchema>;
export type BiometricSyncResultDto = z.infer<typeof BiometricSyncResultSchema>;

