/**
 * @nil33/core — Shared domain types for NIL33 Institutional Rails
 * All types used across apps and packages.
 */

// ─── Auth & RBAC ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "compliance" | "ops" | "viewer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// ─── SPV ─────────────────────────────────────────────────────────────────────

export type SpvStatus = "draft" | "active" | "closed" | "dissolved";
export type SpvJurisdiction = "DE" | "CA" | "NY" | "WY" | "FL" | "OTHER";

export interface Spv {
  id: string;
  name: string;
  legalName: string;
  jurisdiction: SpvJurisdiction;
  taxId: string | null;
  managerName: string;
  managerEmail: string;
  bankName: string | null;      // placeholder — custodian integration TBD
  custodianName: string | null; // placeholder
  status: SpvStatus;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  notes: string | null;
}

// ─── Athlete ──────────────────────────────────────────────────────────────────

export type AthleteStatus = "active" | "inactive" | "restricted";

export interface Athlete {
  id: string;
  spvId: string | null;
  firstName: string;
  lastName: string;
  sport: string;
  school: string;
  state: string;
  gradYear: number;
  status: AthleteStatus;
  nilScoreComposite: number | null; // 0-100 internal composite (SAMPLE)
  createdAt: Date;
  updatedAt: Date;
}

// ─── NIL Contract ─────────────────────────────────────────────────────────────

export type ContractStatus = "draft" | "active" | "expired" | "terminated";

export interface NilContract {
  id: string;
  athleteId: string;
  spvId: string;
  counterpartyName: string;
  counterpartyType: "brand" | "collective" | "media" | "apparel" | "other";
  contractValue: number;   // USD cents to avoid float issues
  currency: "USD";
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  revenueSharePct: number; // basis points (e.g. 2000 = 20%)
  paymentSchedule: PaymentScheduleEntry[];
  docIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentScheduleEntry {
  dueDate: string; // ISO date string
  amountCents: number;
  status: "pending" | "paid" | "late";
}

// ─── Instrument ───────────────────────────────────────────────────────────────

export type InstrumentType = "revenue_participation_note" | "portfolio_tranche_note";
export type InstrumentStatus = "draft" | "offering" | "closed" | "matured";
export type EligibilityRule = "accredited_only" | "qib_only" | "us_only" | "non_us_only" | "open";

export interface Instrument {
  id: string;
  spvId: string;
  name: string;
  type: InstrumentType;
  status: InstrumentStatus;
  offeringSizeCents: number;        // total raise target in USD cents
  minTicketCents: number;           // minimum subscription
  maxTicketCents: number | null;    // per-investor cap (null = uncapped)
  targetYield: number | null;       // basis points (informational only)
  maturityMonths: number | null;
  eligibilityRules: EligibilityRule[];
  holdingPeriodDays: number;        // reg D / transfer restriction
  concentrationLimitPct: number;    // max % per single investor (basis points)
  offeringDocId: string | null;     // PPM / offering memo document id
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
}

// ─── Investor ─────────────────────────────────────────────────────────────────

export type InvestorEntityType = "individual" | "entity" | "trust" | "fund";
export type KycStatus = "not_started" | "pending" | "approved" | "rejected" | "expired";
export type AccreditationStatus = "not_started" | "pending" | "approved" | "rejected";

export interface Investor {
  id: string;
  entityType: InvestorEntityType;
  legalName: string;
  ein: string | null;   // placeholder
  jurisdiction: string;
  kycStatus: KycStatus;
  kycCompletedAt: Date | null;
  accreditationStatus: AccreditationStatus;
  accreditationExpiry: Date | null;
  riskFlags: string[];
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "intent"
  | "docs_pending"
  | "docs_signed"
  | "compliance_review"
  | "accepted"
  | "funded"
  | "rejected"
  | "withdrawn";

export interface Subscription {
  id: string;
  instrumentId: string;
  investorId: string;
  amountCents: number;
  status: SubscriptionStatus;
  intendedAt: Date;
  docsSignedAt: Date | null;
  acceptedAt: Date | null;
  fundedAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  docIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Distribution ─────────────────────────────────────────────────────────────

export type DistributionStatus =
  | "draft"
  | "calculated"
  | "compliance_approved"
  | "executed"
  | "reversed";

export interface DistributionRun {
  id: string;
  instrumentId: string;
  periodStart: Date;
  periodEnd: Date;
  totalRevenueCents: number;   // input: total collected for period
  totalDistributedCents: number;
  waterfallJson: WaterfallEntry[]; // ordered distribution waterfall
  status: DistributionStatus;
  approvedBy: string | null;   // user id
  approvedAt: Date | null;
  executedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterfallEntry {
  label: string;        // e.g. "SPV Management Fee", "Investor Return"
  amountCents: number;
  pct: number;          // basis points of total revenue
}

export interface DistributionLineItem {
  id: string;
  runId: string;
  subscriptionId: string;
  investorId: string;
  amountCents: number;
  status: "pending" | "paid" | "failed";
}

// ─── Audit Ledger ─────────────────────────────────────────────────────────────

export type LedgerActor = "system" | "user" | "service";

export interface LedgerEvent {
  id: string;
  correlationId: string; // groups related events
  actor: LedgerActor;
  actorId: string;       // userId or service name
  action: string;        // e.g. "spv.created", "investor.kyc.approved"
  entityType: string;    // "SPV" | "Investor" | "Instrument" etc.
  entityId: string;
  beforeHash: string | null;   // sha256 of before-state JSON
  afterHash: string | null;    // sha256 of after-state JSON
  snapshotBefore: unknown | null;
  snapshotAfter: unknown | null;
  meta: Record<string, unknown>;
  createdAt: Date;
}

// ─── Document ─────────────────────────────────────────────────────────────────

export type DocumentType =
  | "ppm"
  | "subscription_agreement"
  | "nletter"
  | "kyc_doc"
  | "contract"
  | "statement"
  | "other";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  storageKey: string;   // relative path in local storage / MinIO key
  uploadedBy: string;   // userId
  linkedEntityType: string | null;
  linkedEntityId: string | null;
  createdAt: Date;
}

// ─── Compliance ───────────────────────────────────────────────────────────────

export type ComplianceCheckType =
  | "kyc"
  | "aml"
  | "accreditation"
  | "eligibility"
  | "transfer_allowed"
  | "concentration_limit";

export type ComplianceCheckOutcome = "pass" | "fail" | "needs_review" | "expired";

export interface ComplianceCheck {
  id: string;
  investorId: string;
  instrumentId: string | null;
  subscriptionId: string | null;
  type: ComplianceCheckType;
  outcome: ComplianceCheckOutcome;
  reasonCode: string | null;
  reasonDetail: string | null;
  performedAt: Date;
  expiresAt: Date | null;
  performedBy: string; // userId or "system"
}

// ─── Compliance Gate ─────────────────────────────────────────────────────────

export type TransferCheckReasonCode =
  | "HOLDING_PERIOD_NOT_MET"
  | "INVESTOR_NOT_ACCREDITED"
  | "JURISDICTION_RESTRICTED"
  | "CONCENTRATION_LIMIT_EXCEEDED"
  | "INVESTOR_NOT_ON_WHITELIST"
  | "INSTRUMENT_CLOSED"
  | "OK";

export interface TransferCheckResult {
  allowed: boolean;
  reasonCode: TransferCheckReasonCode;
  detail: string;
  checkedAt: Date;
}

// ─── 33-Signal Underwriting Engine ────────────────────────────────────────────

/**
 * Six risk dimensions, each containing a subset of the 33 total signals.
 * Signal IDs are stable identifiers used in scoring, weighting, and storage.
 */

export type SignalDimension =
  | "revenue_durability"
  | "sponsor_concentration"
  | "engagement_quality"
  | "eligibility_risk"
  | "injury_availability"
  | "reputational_volatility";

// ── Revenue Durability (7 signals) ───────────────────────────────────────────

export type RevenueDurabilitySignal =
  | "contract_tenure_renewal"
  | "earning_trajectory_vs_cohort"
  | "market_depth_demand"
  | "revenue_source_diversification"
  | "season_adjusted_earnings"
  | "off_field_revenue_stability"
  | "post_career_transition";

// ── Sponsor Concentration (5 signals) ────────────────────────────────────────

export type SponsorConcentrationSignal =
  | "top3_sponsor_dependency"
  | "category_diversity_index"
  | "renewal_rate_vs_industry"
  | "sponsor_credit_quality"
  | "contract_duration_distribution";

// ── Engagement Quality (6 signals) ───────────────────────────────────────────

export type EngagementQualitySignal =
  | "authentic_reach_vs_followers"
  | "conversion_clickthrough"
  | "audience_demographic_alignment"
  | "content_consistency"
  | "platform_diversification"
  | "brand_safety_index";

// ── Eligibility & Transfer Risk (5 signals) ──────────────────────────────────

export type EligibilityRiskSignal =
  | "ncaa_eligibility_status"
  | "transfer_portal_probability"
  | "draft_timeline_declaration"
  | "academic_standing"
  | "conference_realignment_impact";

// ── Injury & Availability (5 signals) ────────────────────────────────────────

export type InjuryAvailabilitySignal =
  | "position_specific_injury_rate"
  | "historical_medical_record"
  | "workload_snap_count_trends"
  | "recovery_timeline_model"
  | "insurance_availability";

// ── Reputational Volatility (5 signals) ──────────────────────────────────────

export type ReputationalVolatilitySignal =
  | "sentiment_analysis"
  | "controversy_exposure_index"
  | "brand_safety_classification"
  | "media_cycle_resilience"
  | "community_standing";

/** Union of all 33 signal identifiers */
export type SignalId =
  | RevenueDurabilitySignal
  | SponsorConcentrationSignal
  | EngagementQualitySignal
  | EligibilityRiskSignal
  | InjuryAvailabilitySignal
  | ReputationalVolatilitySignal;

/** Map each dimension to its signal type */
export interface DimensionSignalMap {
  revenue_durability: RevenueDurabilitySignal;
  sponsor_concentration: SponsorConcentrationSignal;
  engagement_quality: EngagementQualitySignal;
  eligibility_risk: EligibilityRiskSignal;
  injury_availability: InjuryAvailabilitySignal;
  reputational_volatility: ReputationalVolatilitySignal;
}

/** A single signal score (0–99 scale) */
export interface SignalScore {
  signalId: SignalId;
  dimension: SignalDimension;
  rawScore: number;          // 0–99
  weight: number;            // 0–1, sums to 1.0 within dimension
  weightedScore: number;     // rawScore * weight
  confidence: number;        // 0–1 data quality / coverage
  dataSource: string;        // e.g. "on3", "sportradar", "social_api", "manual"
  staleAt: Date | null;      // when this score should be refreshed
  computedAt: Date;
}

/** Dimension-level aggregate score */
export interface DimensionScore {
  dimension: SignalDimension;
  score: number;             // 0–99, weighted avg of signal scores
  maxScore: 99;
  signalCount: number;       // how many signals contributed
  confidence: number;        // avg confidence across signals
  signals: SignalScore[];
  flags: RiskFlag[];
}

/** Risk flag raised by any signal or dimension */
export type RiskFlagSeverity = "info" | "watch" | "caution" | "critical";

export interface RiskFlag {
  signalId: SignalId | null;       // null = dimension-level flag
  dimension: SignalDimension;
  severity: RiskFlagSeverity;
  code: string;                    // e.g. "HIGH_SPONSOR_CONCENTRATION"
  message: string;
  recommendation: string | null;
}

/** Instrument-specific weight configuration */
export interface InstrumentWeightProfile {
  instrumentType: InstrumentType;
  label: string;                   // e.g. "Revenue Participation Note"
  dimensionWeights: Record<SignalDimension, number>; // sum to 1.0
  signalOverrides: Partial<Record<SignalId, number>>; // optional per-signal weight overrides
  version: string;                 // e.g. "2026.Q1"
  effectiveDate: Date;
}

/** Composite underwriting score (the "NIL33 Score") */
export interface CompositeScore {
  athleteId: string;
  instrumentType: InstrumentType;
  composite: number;               // 0–99 final score
  grade: UnderwritingGrade;
  dimensions: DimensionScore[];
  weightProfile: InstrumentWeightProfile;
  totalFlags: number;
  criticalFlags: number;
  computedAt: Date;
}

export type UnderwritingGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F";

/** Grade thresholds (inclusive lower bound) */
export const GRADE_THRESHOLDS: { grade: UnderwritingGrade; minScore: number }[] = [
  { grade: "A+", minScore: 95 },
  { grade: "A",  minScore: 90 },
  { grade: "A-", minScore: 85 },
  { grade: "B+", minScore: 80 },
  { grade: "B",  minScore: 75 },
  { grade: "B-", minScore: 70 },
  { grade: "C+", minScore: 65 },
  { grade: "C",  minScore: 60 },
  { grade: "C-", minScore: 55 },
  { grade: "D",  minScore: 45 },
  { grade: "F",  minScore: 0 },
];

/** Valuation band produced by the underwriting engine */
export interface ValuationBand {
  lowCents: number;                // conservative estimate
  midCents: number;                // base case
  highCents: number;               // optimistic case
  confidenceInterval: number;      // 0–1 (e.g. 0.90 = 90% CI)
  methodology: "dcf" | "comparable" | "hybrid";
  assumptions: string[];           // human-readable assumptions
}

/** State-level compliance clearance */
export interface ComplianceClearance {
  totalStates: number;             // e.g. 50
  passedStates: number;
  failedStates: string[];          // state codes that failed
  restrictedStates: string[];      // states with conditions
  conferenceCleared: boolean;
  ncaaCleared: boolean;
  checkedAt: Date;
}

/** Full underwriting memo — the primary output of the engine */
export interface UnderwritingMemo {
  id: string;
  athleteId: string;
  athlete: {
    firstName: string;
    lastName: string;
    sport: string;
    school: string;
    position: string;
    gradYear: number;
  };
  instrumentType: InstrumentType;
  compositeScore: CompositeScore;
  valuation: ValuationBand;
  compliance: ComplianceClearance;
  covenantRecommendations: CovenantRecommendation[];
  riskNarrative: string;           // AI-generated risk summary
  analystNotes: string | null;
  status: UnderwritingMemoStatus;
  reviewedBy: string | null;       // userId
  reviewedAt: Date | null;
  version: number;                 // incremented on re-score
  createdAt: Date;
  updatedAt: Date;
}

export type UnderwritingMemoStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "stale";

export interface CovenantRecommendation {
  type: "financial" | "behavioral" | "eligibility" | "reporting";
  description: string;
  triggerCondition: string;        // e.g. "composite drops below 60"
  consequence: string;             // e.g. "early redemption at par"
}

// ─── Portfolio Intelligence ──────────────────────────────────────────────────

/** Portfolio-level analytics across a roster or fund */

export type ConcentrationAxis =
  | "sport"
  | "conference"
  | "school"
  | "brand_sponsor"
  | "position"
  | "grad_year"
  | "state"
  | "instrument_type";

export interface ConcentrationBucket {
  axis: ConcentrationAxis;
  label: string;               // e.g. "SEC", "Football", "Nike"
  exposureCents: number;       // total notional exposure
  exposurePct: number;         // basis points (e.g. 2500 = 25%)
  athleteCount: number;
  breachesLimit: boolean;      // true if exceeds configured limit
  limitPct: number | null;     // configured limit (basis points)
}

export interface ConcentrationAnalysis {
  portfolioId: string;         // SPV id or roster id
  totalExposureCents: number;
  buckets: ConcentrationBucket[];
  breachCount: number;
  analysisDate: Date;
}

/** Value-at-Risk calculation */
export type VaRMethod = "historical" | "parametric" | "monte_carlo";
export type VaRHorizon = "1d" | "1w" | "1m" | "1q" | "1y";

export interface PortfolioVaR {
  portfolioId: string;
  method: VaRMethod;
  horizon: VaRHorizon;
  confidenceLevel: number;     // e.g. 0.95 or 0.99
  varCents: number;            // max expected loss in USD cents
  cvarCents: number;           // conditional VaR (expected shortfall)
  componentVaR: ComponentVaR[];
  computedAt: Date;
}

export interface ComponentVaR {
  athleteId: string;
  athleteName: string;
  varContributionCents: number;
  varContributionPct: number;  // basis points of total VaR
}

/** Cohort analysis for benchmarking */
export type CohortDimension =
  | "sport"
  | "conference"
  | "position"
  | "grad_year"
  | "score_band";

export interface CohortAnalysis {
  dimension: CohortDimension;
  cohortLabel: string;         // e.g. "SEC QBs 2026"
  athleteCount: number;
  avgComposite: number;
  medianComposite: number;
  p25Composite: number;
  p75Composite: number;
  avgValuationCents: number;
  totalExposureCents: number;
  defaultRate: number;         // historical, basis points
  period: string;              // e.g. "2025-Q4"
}

/** Cashflow calendar for distribution planning */
export interface CashflowEvent {
  date: string;                // ISO date
  type: "inflow" | "outflow" | "distribution" | "fee" | "redemption";
  instrumentId: string;
  instrumentName: string;
  athleteId: string | null;
  amountCents: number;
  status: "projected" | "confirmed" | "completed";
  description: string;
}

export interface CashflowCalendar {
  portfolioId: string;
  periodStart: string;         // ISO date
  periodEnd: string;           // ISO date
  events: CashflowEvent[];
  netInflowCents: number;      // projected net for period
  netOutflowCents: number;
  netPositionCents: number;
}

/** Stress testing */
export type StressScenarioType =
  | "injury_star_player"
  | "conference_realignment"
  | "nil_regulation_change"
  | "sponsor_withdrawal"
  | "transfer_portal_wave"
  | "economic_downturn"
  | "custom";

export interface StressTestScenario {
  id: string;
  type: StressScenarioType;
  name: string;
  description: string;
  shocks: StressShock[];       // what inputs change
}

export interface StressShock {
  dimension: SignalDimension | "valuation" | "cashflow";
  shockPct: number;            // basis points change (e.g. -2000 = -20%)
  appliesTo: string | null;    // athleteId, sport, or null (portfolio-wide)
}

export interface StressTestResult {
  scenarioId: string;
  portfolioId: string;
  baselineVaRCents: number;
  stressedVaRCents: number;
  baselineNavCents: number;
  stressedNavCents: number;
  navImpactPct: number;        // basis points
  mostImpactedAthletes: {
    athleteId: string;
    athleteName: string;
    scoreChange: number;       // delta
    valuationImpactCents: number;
  }[];
  runAt: Date;
}

/** Portfolio summary (top-level dashboard data) */
export interface PortfolioSummary {
  portfolioId: string;
  portfolioName: string;
  aumCents: number;            // total assets under management
  navCents: number;            // net asset value
  athleteCount: number;
  instrumentCount: number;
  avgComposite: number;        // weighted avg 33-signal composite
  medianComposite: number;
  concentrationBreaches: number;
  activeFlags: number;
  criticalFlags: number;
  nextDistributionDate: string | null;
  asOfDate: Date;
}

// ─── Model Versioning ────────────────────────────────────────────────────────

/**
 * Every underwriting memo references a specific model version.
 * This ensures reproducibility, auditability, and prevents silent model drift.
 */
export interface ModelVersion {
  id: string;                      // e.g. "33-v1.0.0"
  signalSetHash: string;           // SHA-256 of the ordered signal ID list
  weightProfileHash: string;       // SHA-256 of the canonical weight profile JSON
  gradeThresholdsHash: string;     // SHA-256 of the grade thresholds JSON
  covenantRulesHash: string;       // SHA-256 of the covenant rules JSON
  signalCount: number;             // should always be 33
  dimensionCount: number;          // should always be 6
  changelog: string;               // human-readable description of changes
  createdAt: Date;
  effectiveAt: Date;
  retiredAt: Date | null;          // null = currently active
}

// ─── Genome Signature (Cryptographic Model Identity) ─────────────────────────

/**
 * Immutable cryptographic fingerprint of the entire underwriting model.
 *
 * Every component that affects scoring, covenants, stress testing, or
 * valuation is hashed into a single genome identity. Two GenomeSignatures
 * are equal if and only if the underlying model configuration is identical.
 *
 * This is what makes the engine DOI-ready: a published genome can be
 * independently verified by any peer reviewer given the same source code.
 */
export interface GenomeSignature {
  /** Globally unique genome identifier (deterministic from component hashes) */
  genomeId: string;
  /** SHA-256 of the canonical ordered signal ID array */
  signalSchemaHash: string;
  /** SHA-256 of the canonical weight profile JSON */
  weightProfileHash: string;
  /** SHA-256 of the grade thresholds JSON */
  thresholdHash: string;
  /** SHA-256 of the stress scenario matrix JSON */
  stressMatrixHash: string;
  /** SHA-256 of the covenant rules configuration JSON */
  covenantRulesHash: string;
  /** SHA-256 of the flag rules configuration JSON */
  flagRulesHash: string;
  /** SHA-256 of the valuation model parameters JSON */
  valuationModelHash: string;
  /** ISO timestamp when this genome was computed */
  createdAt: string;
  /** Version label for human reference */
  version: string;
}

// ─── Reproducibility ─────────────────────────────────────────────────────────

/**
 * A sealed record of every input + configuration used to produce a memo.
 * Given this record, `replayUnderwriting()` will produce an identical result.
 */
export interface UnderwritingReplayRecord {
  /** The genome signature that was active when the memo was generated */
  genome: GenomeSignature;
  /** Frozen athlete signal inputs */
  athleteInput: AthleteSignalInput;
  /** Frozen weight profile */
  weightProfile: InstrumentWeightProfile;
  /** Reference facility size used */
  referenceFacilityCents: number;
  /** Valuation methodology used */
  valuationMethodology: "dcf" | "comparable" | "hybrid";
  /** Compliance clearance snapshot */
  complianceClearance: ComplianceClearance | null;
  /** Analyst notes */
  analystNotes: string | null;
  /** RNG seed for Monte Carlo (if used) */
  monteCarloSeed: number | null;
  /** Memo ID produced */
  memoId: string;
  /** When the original memo was generated */
  generatedAt: string;
}

// ─── Explainability Maps ─────────────────────────────────────────────────────

/**
 * Dimension-level contribution map showing how each dimension
 * pushed the composite score up or down relative to the mean.
 */
export interface DimensionContributionMap {
  /** Per-dimension signed contribution to composite */
  contributions: Record<SignalDimension, number>;
  /** Portfolio-weighted mean across all dimensions (equal-weight baseline) */
  equalWeightBaseline: number;
  /** Actual composite */
  actualComposite: number;
  /** Net effect of weighting (actual - baseline) */
  weightingEffect: number;
}

/**
 * Shock-level contribution map for stress test explainability.
 * Shows how each shock dimension contributed to the total NAV impact.
 */
export interface ShockContributionMap {
  scenarioId: string;
  /** Per-dimension shock contribution to total NAV delta */
  dimensionImpacts: {
    dimension: SignalDimension;
    shockPct: number;
    preShockDimensionScore: number;
    postShockDimensionScore: number;
    navImpactCents: number;
    navImpactPct: number;
  }[];
  /** Total NAV impact (sum of dimension impacts) */
  totalNavImpactCents: number;
  totalNavImpactPct: number;
}

// ─── Seeded RNG ──────────────────────────────────────────────────────────────

/**
 * Configuration for seeded Monte Carlo simulation.
 * A fixed seed guarantees identical output across runs.
 */
export interface MonteCarloConfig {
  /** RNG seed — same seed = same random sequence */
  seed: number;
  /** Number of simulation paths */
  paths: number;
  /** Confidence level for VaR (e.g. 0.95 or 0.99) */
  confidenceLevel: number;
  /** Time horizon in days */
  horizonDays: number;
}

/**
 * Monte Carlo VaR result with full reproducibility metadata.
 */
export interface MonteCarloVaRResult {
  /** VaR in USD cents at the specified confidence level */
  varCents: number;
  /** Expected Shortfall (CVaR) in cents */
  cvarCents: number;
  /** Percentile distribution of outcomes (e.g. p1, p5, p10, p25, p50, p75, p90, p95, p99) */
  percentiles: Record<string, number>;
  /** The seed used — publish this for reproducibility */
  seed: number;
  /** Number of paths simulated */
  paths: number;
  /** Confidence level used */
  confidenceLevel: number;
  /** Per-athlete VaR decomposition */
  componentVaR: {
    athleteId: string;
    varContributionCents: number;
    varContributionPct: number;
  }[];
}

// ─── Research Snapshot ───────────────────────────────────────────────────────

/**
 * Complete research-grade snapshot of the model for archival / DOI.
 * Contains everything needed to independently verify any memo produced
 * under this genome.
 */
export interface ResearchSnapshot {
  /** Genome signature of the model */
  genome: GenomeSignature;
  /** Human-readable metadata */
  metadata: {
    title: string;
    version: string;
    authors: string[];
    description: string;
    createdAt: string;
    license: string;
  };
  /** Full signal schema */
  signalSchema: {
    signalId: string;
    dimension: string;
    description: string;
  }[];
  /** Weight profiles for each instrument type */
  weightProfiles: InstrumentWeightProfile[];
  /** Grade thresholds */
  gradeThresholds: { grade: UnderwritingGrade; minScore: number }[];
  /** Stress scenario definitions */
  stressScenarios: {
    id: string;
    name: string;
    shocks: { dimension: string; shockPct: number }[];
  }[];
  /** Covenant rule summary (descriptions only, not code) */
  covenantRuleSummary: {
    type: string;
    description: string;
    triggerType: string;
  }[];
  /** Flag rule summary */
  flagRuleSummary: {
    code: string;
    signalId: string | null;
    dimension: string;
    severity: string;
    threshold: string;
  }[];
  /** Synthetic sample dataset with expected outputs */
  syntheticSamples: {
    input: AthleteSignalInput;
    expectedComposite: number;
    expectedGrade: UnderwritingGrade;
    expectedFlagCount: number;
    expectedCovenantCount: number;
  }[];
}

/** Input for the scoring engine — raw signal observations */
export interface SignalInput {
  signalId: SignalId;
  rawScore: number;                // 0–99
  confidence: number;              // 0–1
  dataSource: string;
}

/** Input for the scoring engine — grouped by athlete */
export interface AthleteSignalInput {
  athleteId: string;
  athlete: {
    firstName: string;
    lastName: string;
    sport: string;
    school: string;
    position: string;
    gradYear: number;
  };
  signals: SignalInput[];
  observedAt: Date;
}

/** Scoring engine output — explainability tree */
export interface ScoreExplainability {
  /** Per-signal contribution to the final composite */
  signalContributions: {
    signalId: SignalId;
    dimension: SignalDimension;
    rawScore: number;
    dimensionWeight: number;
    signalWeight: number;
    effectiveContribution: number; // rawScore * signalWeight * dimensionWeight
  }[];
  /** Per-dimension subtotals */
  dimensionSubtotals: {
    dimension: SignalDimension;
    weightedAvg: number;
    dimensionWeight: number;
    contribution: number;          // weightedAvg * dimensionWeight
  }[];
  /** Sum of all contributions = composite */
  compositeDerivation: number;
  /** Model version used */
  modelVersionId: string;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiError {
  error: string;
  code: string;
  detail?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
