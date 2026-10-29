import { z } from 'zod';

export const envSchema = z.object({
  APP_ID: z.enum(['careerforge', 'kinetic', 'freelanceos', 'viralmatrix']),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEPLOY_TARGET: z.enum(['vercel-serverless', 'vps-docker', 'hybrid']).default('hybrid'),
  WEB_ORIGIN_URL: z.string().url(),
  API_PUBLIC_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1000).max(65535),
  WS_PORT: z.coerce.number().int().min(1000).max(65535),

  DB_DIALECT: z.enum(['postgres', 'neon', 'sqlite', 'turso', 'mysql']).default('postgres'),
  DATABASE_URL: z.string().optional(),
  TURSO_DATABASE_URL: z.string().optional(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  MYSQL_DATABASE_URL: z.string().optional(),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  ENABLE_LIVE_ADMIN_WS: z.coerce.boolean().default(true),

  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL_FAST: z.string().default('gemini-2.5-flash'),
  GEMINI_MODEL_COPILOT: z.string().default('gemini-2.5-pro'),
  FREE_MONTHLY_QUOTA: z.coerce.number().int().default(5),
  COPILOT_STRIPE_PRICE_ID: z.string().optional(),
  DEFAULT_THEME: z.string().default('clean-slate'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(): AppEnv {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    throw new Error('Environment validation failed');
  }
  return result.data;
}
