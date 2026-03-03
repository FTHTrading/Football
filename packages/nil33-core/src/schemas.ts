import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const UserRoleSchema = z.enum(["admin", "compliance", "ops", "viewer"]);

// ─── SPV ─────────────────────────────────────────────────────────────────────

export const SpvJurisdictionSchema = z.enum(["DE", "CA", "NY", "WY", "FL", "OTHER"]);
export const SpvStatusSchema = z.enum(["draft", "active", "closed", "dissolved"]);

export const CreateSpvSchema = z.object({
  name: z.string().min(2).max(100),
  legalName: z.string().min(2).max(200),
  jurisdiction: SpvJurisdictionSchema,
  taxId: z.string().max(30).nullable().optional(),
  managerName: z.string().min(2).max(100),
  managerEmail: z.string().email(),
  bankName: z.string().max(100).nullable().optional(),
  custodianName: z.string().max(100).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateSpvInput = z.infer<typeof CreateSpvSchema>;

export const UpdateSpvSchema = CreateSpvSchema.partial().extend({
  status: SpvStatusSchema.optional(),
});

export type UpdateSpvInput = z.infer<typeof UpdateSpvSchema>;

// ─── Athlete ──────────────────────────────────────────────────────────────────

export const CreateAthleteSchema = z.object({
  spvId: z.string().uuid().nullable().optional(),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  sport: z.string().min(2).max(50),
  school: z.string().min(2).max(100),
  state: z.string().length(2),
  gradYear: z.number().int().min(2020).max(2035),
});

export type CreateAthleteInput = z.infer<typeof CreateAthleteSchema>;

// ─── Instrument ───────────────────────────────────────────────────────────────

export const InstrumentTypeSchema = z.enum([
  "revenue_participation_note",
  "portfolio_tranche_note",
]);

export const EligibilityRuleSchema = z.enum([
  "accredited_only",
  "qib_only",
  "us_only",
  "non_us_only",
  "open",
]);

export const CreateInstrumentSchema = z.object({
  spvId: z.string().uuid(),
  name: z.string().min(2).max(150),
  type: InstrumentTypeSchema,
  offeringSizeCents: z.number().int().positive(),
  minTicketCents: z.number().int().positive(),
  maxTicketCents: z.number().int().positive().nullable().optional(),
  targetYield: z.number().int().min(0).max(10000).nullable().optional(), // bps
  maturityMonths: z.number().int().positive().nullable().optional(),
  eligibilityRules: z.array(EligibilityRuleSchema).min(1),
  holdingPeriodDays: z.number().int().min(0).default(365),
  concentrationLimitPct: z.number().int().min(0).max(10000).default(2500), // bps
});

export type CreateInstrumentInput = z.infer<typeof CreateInstrumentSchema>;

// ─── Investor ─────────────────────────────────────────────────────────────────

export const InvestorEntityTypeSchema = z.enum(["individual", "entity", "trust", "fund"]);

export const CreateInvestorSchema = z.object({
  entityType: InvestorEntityTypeSchema,
  legalName: z.string().min(2).max(200),
  ein: z.string().max(30).nullable().optional(),
  jurisdiction: z.string().min(2).max(50),
  contactEmail: z.string().email(),
  contactName: z.string().min(2).max(100),
});

export type CreateInvestorInput = z.infer<typeof CreateInvestorSchema>;

// ─── Subscription ─────────────────────────────────────────────────────────────

export const CreateSubscriptionSchema = z.object({
  instrumentId: z.string().uuid(),
  investorId: z.string().uuid(),
  amountCents: z.number().int().positive(),
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;

// ─── Distribution ─────────────────────────────────────────────────────────────

export const CreateDistributionRunSchema = z.object({
  instrumentId: z.string().uuid(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  totalRevenueCents: z.number().int().nonnegative(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateDistributionRunInput = z.infer<typeof CreateDistributionRunSchema>;

// ─── Audit ─────────────────────────────────────────────────────────────────────

export const AuditSearchSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  action: z.string().optional(),
  actorId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export type AuditSearchInput = z.infer<typeof AuditSearchSchema>;

// ─── Compliance Check ─────────────────────────────────────────────────────────

export const RunComplianceCheckSchema = z.object({
  investorId: z.string().uuid(),
  instrumentId: z.string().uuid(),
  checkType: z.enum(["kyc", "aml", "accreditation", "eligibility", "transfer_allowed", "concentration_limit"]),
});

export type RunComplianceCheckInput = z.infer<typeof RunComplianceCheckSchema>;
