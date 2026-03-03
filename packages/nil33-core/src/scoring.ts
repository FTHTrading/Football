/**
 * @nil33/core — Deterministic 33-Signal Scoring Engine
 *
 * Pure function layer. No side effects. No randomness.
 * Every output is reproducible given the same inputs + weight profile.
 *
 * scoreAthlete(signals, weightProfile) => CompositeScore
 */

import {
  type SignalId,
  type SignalDimension,
  type SignalInput,
  type SignalScore,
  type DimensionScore,
  type CompositeScore,
  type InstrumentWeightProfile,
  type UnderwritingGrade,
  type RiskFlag,
  type RiskFlagSeverity,
  type ScoreExplainability,
  type AthleteSignalInput,
  GRADE_THRESHOLDS,
} from "./types";

// ─── Signal → Dimension Mapping ─────────────────────────────────────────────

export const SIGNAL_DIMENSION_MAP: Record<SignalId, SignalDimension> = {
  // Revenue Durability (7)
  contract_tenure_renewal: "revenue_durability",
  earning_trajectory_vs_cohort: "revenue_durability",
  market_depth_demand: "revenue_durability",
  revenue_source_diversification: "revenue_durability",
  season_adjusted_earnings: "revenue_durability",
  off_field_revenue_stability: "revenue_durability",
  post_career_transition: "revenue_durability",
  // Sponsor Concentration (5)
  top3_sponsor_dependency: "sponsor_concentration",
  category_diversity_index: "sponsor_concentration",
  renewal_rate_vs_industry: "sponsor_concentration",
  sponsor_credit_quality: "sponsor_concentration",
  contract_duration_distribution: "sponsor_concentration",
  // Engagement Quality (6)
  authentic_reach_vs_followers: "engagement_quality",
  conversion_clickthrough: "engagement_quality",
  audience_demographic_alignment: "engagement_quality",
  content_consistency: "engagement_quality",
  platform_diversification: "engagement_quality",
  brand_safety_index: "engagement_quality",
  // Eligibility Risk (5)
  ncaa_eligibility_status: "eligibility_risk",
  transfer_portal_probability: "eligibility_risk",
  draft_timeline_declaration: "eligibility_risk",
  academic_standing: "eligibility_risk",
  conference_realignment_impact: "eligibility_risk",
  // Injury & Availability (5)
  position_specific_injury_rate: "injury_availability",
  historical_medical_record: "injury_availability",
  workload_snap_count_trends: "injury_availability",
  recovery_timeline_model: "injury_availability",
  insurance_availability: "injury_availability",
  // Reputational Volatility (5)
  sentiment_analysis: "reputational_volatility",
  controversy_exposure_index: "reputational_volatility",
  brand_safety_classification: "reputational_volatility",
  media_cycle_resilience: "reputational_volatility",
  community_standing: "reputational_volatility",
};

/** All 33 signal IDs in canonical order */
export const ALL_SIGNAL_IDS: SignalId[] = Object.keys(SIGNAL_DIMENSION_MAP) as SignalId[];

/** All 6 dimensions in canonical order */
export const ALL_DIMENSIONS: SignalDimension[] = [
  "revenue_durability",
  "sponsor_concentration",
  "engagement_quality",
  "eligibility_risk",
  "injury_availability",
  "reputational_volatility",
];

/** Expected signal counts per dimension */
export const DIMENSION_SIGNAL_COUNTS: Record<SignalDimension, number> = {
  revenue_durability: 7,
  sponsor_concentration: 5,
  engagement_quality: 6,
  eligibility_risk: 5,
  injury_availability: 5,
  reputational_volatility: 5,
};

// ─── Default Weight Profiles ────────────────────────────────────────────────

/** Revenue Participation Note — overweight revenue durability + sponsor concentration */
export const RPN_WEIGHT_PROFILE: InstrumentWeightProfile = {
  instrumentType: "revenue_participation_note",
  label: "Revenue Participation Note",
  dimensionWeights: {
    revenue_durability: 0.30,
    sponsor_concentration: 0.20,
    engagement_quality: 0.15,
    eligibility_risk: 0.15,
    injury_availability: 0.10,
    reputational_volatility: 0.10,
  },
  signalOverrides: {},
  version: "2026.Q1",
  effectiveDate: new Date("2026-01-01"),
};

/** Portfolio Tranche Note — more balanced, heavier on diversification + risk */
export const PTN_WEIGHT_PROFILE: InstrumentWeightProfile = {
  instrumentType: "portfolio_tranche_note",
  label: "Portfolio Tranche Note",
  dimensionWeights: {
    revenue_durability: 0.20,
    sponsor_concentration: 0.20,
    engagement_quality: 0.15,
    eligibility_risk: 0.15,
    injury_availability: 0.15,
    reputational_volatility: 0.15,
  },
  signalOverrides: {},
  version: "2026.Q1",
  effectiveDate: new Date("2026-01-01"),
};

/** Get the default weight profile for an instrument type */
export function getDefaultWeightProfile(
  instrumentType: "revenue_participation_note" | "portfolio_tranche_note"
): InstrumentWeightProfile {
  return instrumentType === "revenue_participation_note"
    ? RPN_WEIGHT_PROFILE
    : PTN_WEIGHT_PROFILE;
}

// ─── Default Signal Weights (equal within dimension) ────────────────────────

function getSignalWeight(signalId: SignalId, profile: InstrumentWeightProfile): number {
  // Check for per-signal override first
  if (profile.signalOverrides[signalId] !== undefined) {
    return profile.signalOverrides[signalId]!;
  }
  // Default: equal weight within dimension
  const dim = SIGNAL_DIMENSION_MAP[signalId];
  return 1 / DIMENSION_SIGNAL_COUNTS[dim];
}

// ─── Grade Assignment ───────────────────────────────────────────────────────

export function assignGrade(composite: number): UnderwritingGrade {
  for (const { grade, minScore } of GRADE_THRESHOLDS) {
    if (composite >= minScore) return grade;
  }
  return "F";
}

// ─── Risk Flag Detection ────────────────────────────────────────────────────

interface FlagRule {
  signalId: SignalId | null;
  dimension: SignalDimension;
  condition: (score: number) => boolean;
  severity: RiskFlagSeverity;
  code: string;
  message: string;
  recommendation: string | null;
}

const FLAG_RULES: FlagRule[] = [
  // Signal-level flags
  {
    signalId: "top3_sponsor_dependency",
    dimension: "sponsor_concentration",
    condition: (s) => s < 40,
    severity: "critical",
    code: "HIGH_SPONSOR_CONCENTRATION",
    message: "Top-3 sponsor dependency ratio exceeds safe threshold",
    recommendation: "Diversify sponsor portfolio before facility sizing",
  },
  {
    signalId: "ncaa_eligibility_status",
    dimension: "eligibility_risk",
    condition: (s) => s < 50,
    severity: "critical",
    code: "ELIGIBILITY_AT_RISK",
    message: "NCAA eligibility status indicates elevated risk",
    recommendation: "Require eligibility attestation before closing",
  },
  {
    signalId: "transfer_portal_probability",
    dimension: "eligibility_risk",
    condition: (s) => s < 40,
    severity: "caution",
    code: "TRANSFER_PORTAL_RISK",
    message: "High probability of transfer portal entry",
    recommendation: "Add transfer clause with facility adjustment trigger",
  },
  {
    signalId: "controversy_exposure_index",
    dimension: "reputational_volatility",
    condition: (s) => s < 35,
    severity: "caution",
    code: "REPUTATION_RISK",
    message: "Elevated controversy exposure detected",
    recommendation: "Add morality covenant with cure period",
  },
  {
    signalId: "position_specific_injury_rate",
    dimension: "injury_availability",
    condition: (s) => s < 30,
    severity: "caution",
    code: "HIGH_INJURY_RISK",
    message: "Position-specific injury rate above threshold",
    recommendation: "Require insurance certificate or adjust facility size",
  },
  {
    signalId: "revenue_source_diversification",
    dimension: "revenue_durability",
    condition: (s) => s < 35,
    severity: "watch",
    code: "LOW_REVENUE_DIVERSITY",
    message: "Revenue sources insufficiently diversified",
    recommendation: "Category diversification plan recommended before renewal",
  },
  {
    signalId: "brand_safety_index",
    dimension: "engagement_quality",
    condition: (s) => s < 40,
    severity: "watch",
    code: "BRAND_SAFETY_CONCERN",
    message: "Brand safety index below acceptable range",
    recommendation: "Content review and guardrail implementation advised",
  },
  // Dimension-level flags
  {
    signalId: null,
    dimension: "revenue_durability",
    condition: (s) => s < 45,
    severity: "critical",
    code: "WEAK_REVENUE_DURABILITY",
    message: "Overall revenue durability dimension is weak",
    recommendation: "Reduce facility size or require additional covenants",
  },
  {
    signalId: null,
    dimension: "eligibility_risk",
    condition: (s) => s < 40,
    severity: "critical",
    code: "ELIGIBILITY_DIMENSION_FAIL",
    message: "Eligibility risk dimension below minimum threshold",
    recommendation: "Manual review required before proceeding",
  },
  {
    signalId: null,
    dimension: "reputational_volatility",
    condition: (s) => s < 40,
    severity: "caution",
    code: "VOLATILE_REPUTATION",
    message: "Reputational volatility dimension elevated",
    recommendation: "Strengthen morality covenants and monitoring frequency",
  },
];

function detectFlags(
  signalScores: Map<SignalId, number>,
  dimensionScores: Map<SignalDimension, number>
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  for (const rule of FLAG_RULES) {
    if (rule.signalId !== null) {
      // Signal-level check
      const score = signalScores.get(rule.signalId);
      if (score !== undefined && rule.condition(score)) {
        flags.push({
          signalId: rule.signalId,
          dimension: rule.dimension,
          severity: rule.severity,
          code: rule.code,
          message: rule.message,
          recommendation: rule.recommendation,
        });
      }
    } else {
      // Dimension-level check
      const dimScore = dimensionScores.get(rule.dimension);
      if (dimScore !== undefined && rule.condition(dimScore)) {
        flags.push({
          signalId: null,
          dimension: rule.dimension,
          severity: rule.severity,
          code: rule.code,
          message: rule.message,
          recommendation: rule.recommendation,
        });
      }
    }
  }

  return flags;
}

// ─── Core Scoring Function ───────────────────────────────────────────────────

/**
 * Score an athlete across 33 signals using a specific weight profile.
 *
 * DETERMINISTIC: same inputs + same profile = same output. Always.
 * No randomness. No side effects. No network calls.
 *
 * @param input - Raw signal observations for one athlete
 * @param profile - Instrument-specific weight configuration
 * @param modelVersionId - Version ID for audit trail
 * @returns CompositeScore with full explainability
 */
export function scoreAthlete(
  input: AthleteSignalInput,
  profile: InstrumentWeightProfile,
  modelVersionId: string = "33-v1.0.0"
): { score: CompositeScore; explainability: ScoreExplainability } {
  const now = new Date();

  // ── 1. Build signal scores ──────────────────────────────────────────────

  const signalScoreMap = new Map<SignalId, number>();
  const signalScores: SignalScore[] = input.signals.map((s) => {
    const dimension = SIGNAL_DIMENSION_MAP[s.signalId];
    const weight = getSignalWeight(s.signalId, profile);
    const clamped = clamp(s.rawScore, 0, 99);
    signalScoreMap.set(s.signalId, clamped);

    return {
      signalId: s.signalId,
      dimension,
      rawScore: clamped,
      weight,
      weightedScore: round2(clamped * weight),
      confidence: clamp(s.confidence, 0, 1),
      dataSource: s.dataSource,
      staleAt: null,
      computedAt: now,
    };
  });

  // ── 2. Group by dimension and compute dimension scores ──────────────────

  const dimensionScoreMap = new Map<SignalDimension, number>();
  const dimensionScores: DimensionScore[] = ALL_DIMENSIONS.map((dim) => {
    const dimSignals = signalScores.filter((s) => s.dimension === dim);
    const dimWeightedAvg =
      dimSignals.length > 0
        ? dimSignals.reduce((sum, s) => sum + s.weightedScore, 0)
        : 0;
    const avgConfidence =
      dimSignals.length > 0
        ? dimSignals.reduce((sum, s) => sum + s.confidence, 0) / dimSignals.length
        : 0;

    dimensionScoreMap.set(dim, round2(dimWeightedAvg));

    return {
      dimension: dim,
      score: round2(dimWeightedAvg),
      maxScore: 99 as const,
      signalCount: dimSignals.length,
      confidence: round2(avgConfidence),
      signals: dimSignals,
      flags: [], // populated below
    };
  });

  // ── 3. Detect risk flags ────────────────────────────────────────────────

  const allFlags = detectFlags(signalScoreMap, dimensionScoreMap);

  // Attach flags to their dimensions
  for (const flag of allFlags) {
    const dimScore = dimensionScores.find((d) => d.dimension === flag.dimension);
    if (dimScore) dimScore.flags.push(flag);
  }

  // ── 4. Compute composite score ──────────────────────────────────────────

  const composite = round2(
    dimensionScores.reduce((sum, d) => {
      return sum + d.score * profile.dimensionWeights[d.dimension];
    }, 0)
  );

  const grade = assignGrade(composite);
  const totalFlags = allFlags.length;
  const criticalFlags = allFlags.filter((f) => f.severity === "critical").length;

  // ── 5. Build explainability tree ────────────────────────────────────────

  const signalContributions = signalScores.map((s) => ({
    signalId: s.signalId,
    dimension: s.dimension,
    rawScore: s.rawScore,
    dimensionWeight: profile.dimensionWeights[s.dimension],
    signalWeight: s.weight,
    effectiveContribution: round2(s.rawScore * s.weight * profile.dimensionWeights[s.dimension]),
  }));

  const dimensionSubtotals = dimensionScores.map((d) => ({
    dimension: d.dimension,
    weightedAvg: d.score,
    dimensionWeight: profile.dimensionWeights[d.dimension],
    contribution: round2(d.score * profile.dimensionWeights[d.dimension]),
  }));

  const explainability: ScoreExplainability = {
    signalContributions,
    dimensionSubtotals,
    compositeDerivation: composite,
    modelVersionId,
  };

  // ── 6. Assemble CompositeScore ──────────────────────────────────────────

  const compositeScore: CompositeScore = {
    athleteId: input.athleteId,
    instrumentType: profile.instrumentType,
    composite,
    grade,
    dimensions: dimensionScores,
    weightProfile: profile,
    totalFlags,
    criticalFlags,
    computedAt: now,
  };

  return { score: compositeScore, explainability };
}

// ─── Validation ─────────────────────────────────────────────────────────────

/** Validate that a weight profile is well-formed */
export function validateWeightProfile(profile: InstrumentWeightProfile): string[] {
  const errors: string[] = [];

  // Dimension weights must sum to 1.0 (within floating-point tolerance)
  const weightSum = Object.values(profile.dimensionWeights).reduce((a, b) => a + b, 0);
  if (Math.abs(weightSum - 1.0) > 0.001) {
    errors.push(`Dimension weights sum to ${weightSum}, expected 1.0`);
  }

  // All dimensions must be present
  for (const dim of ALL_DIMENSIONS) {
    if (profile.dimensionWeights[dim] === undefined) {
      errors.push(`Missing dimension weight: ${dim}`);
    }
    if (profile.dimensionWeights[dim] < 0) {
      errors.push(`Negative dimension weight: ${dim}`);
    }
  }

  // Signal overrides must reference valid signal IDs
  for (const signalId of Object.keys(profile.signalOverrides)) {
    if (!SIGNAL_DIMENSION_MAP[signalId as SignalId]) {
      errors.push(`Invalid signal override ID: ${signalId}`);
    }
  }

  return errors;
}

/** Validate that signal inputs are complete (all 33 present) */
export function validateSignalInputs(signals: SignalInput[]): string[] {
  const errors: string[] = [];
  const provided = new Set(signals.map((s) => s.signalId));

  for (const id of ALL_SIGNAL_IDS) {
    if (!provided.has(id)) {
      errors.push(`Missing signal: ${id}`);
    }
  }

  for (const s of signals) {
    if (!SIGNAL_DIMENSION_MAP[s.signalId]) {
      errors.push(`Unknown signal ID: ${s.signalId}`);
    }
    if (s.rawScore < 0 || s.rawScore > 99) {
      errors.push(`Signal ${s.signalId}: rawScore ${s.rawScore} out of range [0, 99]`);
    }
    if (s.confidence < 0 || s.confidence > 1) {
      errors.push(`Signal ${s.signalId}: confidence ${s.confidence} out of range [0, 1]`);
    }
  }

  return errors;
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
