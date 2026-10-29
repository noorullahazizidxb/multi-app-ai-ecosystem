import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  role: z.enum(['SUPER_ADMIN', 'APP_ADMIN', 'SUPPORT_AGENT', 'BILLING_AUDITOR', 'END_USER']),
  themePreset: z.string(),
  appId: z.string(),
  copilotActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  themePreset: z.string().optional(),
});

export const UpdateThemeSchema = z.object({
  themePreset: z.enum([
    'clean-slate',
    'obsidian-gold',
    'cyber-neon',
    'synthwave-sunset',
    'nord-frost',
    'matcha-forest',
    'solarized-warm',
    'crimson-executive',
    'ocean-abyss',
    'rose-quartz',
  ]),
});

export type UserProfileDto = z.infer<typeof UserProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type UpdateThemeDto = z.infer<typeof UpdateThemeSchema>;

