import { z } from "zod";

// ─── Athlete Profile ───────────────────────────────────

export const athleteProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  school: z.string().min(1, "School is required").max(100),
  gradYear: z
    .number()
    .int()
    .min(2024, "Grad year too early")
    .max(2032, "Grad year too far out"),
  state: z.string().length(2, "Use 2-letter state code"),
  heightInches: z.number().int().min(60).max(84),
  weightLbs: z.number().int().min(100).max(300),
  bio: z.string().max(1000).optional(),
});

export type AthleteProfileInput = z.infer<typeof athleteProfileSchema>;

// ─── Athlete Metrics ───────────────────────────────────

export const athleteMetricsSchema = z.object({
  velocity: z.number().min(20).max(80),
  spiral: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  releaseTime: z.number().min(0.1).max(2.0),
  decisionTime: z.number().min(0.1).max(5.0),
  mechanics: z.number().min(0).max(100),
  footwork: z.number().min(0).max(100),
  poise: z.number().min(0).max(100),
  armStrength: z.number().min(0).max(100),
  fieldVision: z.number().min(0).max(100),
  clutchFactor: z.number().min(0).max(100),
  leadership: z.number().min(0).max(100),
});

export type AthleteMetricsInput = z.infer<typeof athleteMetricsSchema>;

// ─── Checkout ──────────────────────────────────────────

export const checkoutSchema = z.object({
  athleteId: z.string().min(1, "Athlete ID required"),
  athleteName: z.string().optional(),
  email: z.string().email("Valid email required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ─── Admin Verification ────────────────────────────────

export const verificationActionSchema = z.object({
  athleteId: z.string().min(1),
  action: z.enum(["approve", "revoke", "suspend"]),
  reason: z.string().max(500).optional(),
});

export type VerificationActionInput = z.infer<typeof verificationActionSchema>;

// ─── Search Filters ────────────────────────────────────

export const searchFiltersSchema = z.object({
  query: z.string().max(100).optional(),
  gradYear: z.number().int().optional(),
  state: z.string().length(2).optional(),
  minVelocity: z.number().min(0).max(80).optional(),
  verifiedOnly: z.boolean().optional(),
  sortBy: z.enum(["qbIndex", "velocity", "name", "gradYear"]).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;

// ─── Login ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Contact / Lead Capture ────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
  athleteName: z.string().max(100).optional(),
  gradYear: z.number().int().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
