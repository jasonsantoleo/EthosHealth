import { z } from "zod";

// HealthID Schema
export const healthIdSchema = z.object({
  id: z.string(),
  patientName: z.string().min(1, "Patient name is required"),
  dateOfBirth: z.string(),
  nationalId: z.string().min(1, "National ID is required"),
  bloodGroup: z.string().optional(),
  gender: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyContact: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type HealthId = z.infer<typeof healthIdSchema>;

// Health Scheme Schema
export const healthSchemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  coverage: z.number(),
  processingTime: z.string(),
  networkHospitals: z.number(),
  matchPercentage: z.number(),
  type: z.enum(['diabetes-care', 'general-health', 'family-care', 'emergency-care']),
});

export type HealthScheme = z.infer<typeof healthSchemeSchema>;

// Voucher Schema
export const voucherSchema = z.object({
  id: z.string(),
  healthIdId: z.string(),
  schemeId: z.string(),
  amount: z.number(),
  status: z.enum(['active', 'claimed', 'expired']),
  validUntil: z.date(),
  createdAt: z.date().default(() => new Date()),
});

export type Voucher = z.infer<typeof voucherSchema>;

// Transaction Schema
export const transactionSchema = z.object({
  id: z.string(),
  voucherId: z.string(),
  hospitalName: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'completed', 'failed']),
  transactionId: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type Transaction = z.infer<typeof transactionSchema>;

// AI Recommendation Schema
export const aiRecommendationSchema = z.object({
  healthIdId: z.string(),
  recommendations: z.array(z.object({
    schemeId: z.string(),
    matchPercentage: z.number(),
    reasoning: z.string(),
  })),
  eligibilityScore: z.number(),
  riskLevel: z.enum(['low', 'medium', 'high']),
});

export type AiRecommendation = z.infer<typeof aiRecommendationSchema>;

// Hospital Schema
export const hospitalSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  location: z.string(),
  city: z.string(),
  state: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  specializations: z.array(z.string()),
  rating: z.number().min(0).max(5),
  availableServices: z.array(z.string()),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type Hospital = z.infer<typeof hospitalSchema>;

// Form Schemas
export const createHealthIdFormSchema = healthIdSchema.omit({ id: true, createdAt: true });
export const claimVoucherFormSchema = z.object({
  voucherId: z.string(),
  hospitalName: z.string(),
});

export type CreateHealthIdForm = z.infer<typeof createHealthIdFormSchema>;
export type ClaimVoucherForm = z.infer<typeof claimVoucherFormSchema>;
