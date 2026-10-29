import { z } from 'zod';

export const ResumeSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const ParseResumeRequestSchema = z.object({
  fileUrl: z.string().optional(),
  base64File: z.string().optional(),
  mimeType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']).optional(),
});

export const AtsScanRequestSchema = z.object({
  jobDescription: z.string().min(20),
});

export const AtsScanResultSchema = z.object({
  atsScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  gapAnalysis: z.string(),
  recommendations: z.array(z.string()),
});

export const TailorJobRequestSchema = z.object({
  jobUrl: z.string().url(),
  targetRole: z.string().optional(),
  companyName: z.string().optional(),
});

export const TailorJobResultSchema = z.object({
  jobId: z.string(),
  tailoredPdfUrl: z.string().nullable(),
  coverLetter: z.string(),
  status: z.enum(['QUEUED', 'TAILORED', 'APPLIED', 'FOLLOW_UP_SENT']),
});

export type AtsScanRequestDto = z.infer<typeof AtsScanRequestSchema>;
export type AtsScanResultDto = z.infer<typeof AtsScanResultSchema>;
export type TailorJobRequestDto = z.infer<typeof TailorJobRequestSchema>;
export type TailorJobResultDto = z.infer<typeof TailorJobResultSchema>;

