import { z } from 'zod';

export const GenerateContractRequestSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  projectTitle: z.string().min(3),
  deliverables: z.array(z.string().min(2)),
  hourlyRateCents: z.number().int().positive(),
  estimatedHours: z.number().int().positive().optional(),
  fixedPriceCents: z.number().int().positive().optional(),
  paymentTerms: z.string().default('Net 15'),
});

export const AnalyzeScopeRequestSchema = z.object({
  contractId: z.string(),
  clientMessage: z.string().min(10),
});

export const ScopeAnalysisResultSchema = z.object({
  outOfScope: z.boolean(),
  scopeDeviationPercent: z.number().min(0).max(100),
  reasoning: z.string(),
  suggestedChangeOrder: z
    .object({
      title: z.string(),
      description: z.string(),
      estimatedAdditionalHours: z.number(),
      suggestedPriceCents: z.number(),
      politeEmailResponse: z.string(),
    })
    .nullable(),
});

export type GenerateContractRequestDto = z.infer<typeof GenerateContractRequestSchema>;
export type AnalyzeScopeRequestDto = z.infer<typeof AnalyzeScopeRequestSchema>;
export type ScopeAnalysisResultDto = z.infer<typeof ScopeAnalysisResultSchema>;

