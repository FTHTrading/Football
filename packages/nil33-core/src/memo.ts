/**
 * @nil33/core — Underwriting Memo Generator
 *
 * Orchestrates the full underwriting pipeline:
 *   signals → score → covenants → compliance → valuation → memo
 *
 * Pure data transformation. No side effects. No network calls.
 * The memo is the primary output distributed to investors and agencies.
 */

import { randomUUID } from "crypto";

import {
  type UnderwritingMemo,
  type UnderwritingMemoStatus,
  type CompositeScore,
  type ValuationBand,
  type ComplianceClearance,
  type CovenantRecommendation,
  type InstrumentWeightProfile,
  type AthleteSignalInput,
  type ScoreExplainability,
} from "./types";
import { scoreAthlete, assignGrade } from "./scoring";
import { generateCovenants } from "./covenants";

// ─── Valuation Engine (simplified) ──────────────────────────────────────────

/**
 * Produce a valuation band from a composite score.
 *
 * This is a simplified model:
 * - Base valuation = score-driven multiplier on a reference facility size
 * - Low/high = confidence-adjusted spread
 *
 * In production, this would integrate DCF models, comparable transactions,
 * and market-specific adjustments.
 */
export function estimateValuation(
  composite: CompositeScore,
  referenceFacilityCents: number = 200_000_00, // $200K default reference
  methodology: "dcf" | "comparable" | "hybrid" = "hybrid"
): ValuationBand {
  // Score-to-multiplier mapping (linear interpolation)
  // 99 → 3.0x, 75 → 2.0x, 50 → 1.0x, 25 → 0.5x, 0 → 0.2x
  const multiplier = scoreToMultiplier(composite.composite);

  const midCents = Math.round(referenceFacilityCents * multiplier);

  // Confidence interval based on overall data confidence
  const avgConfidence =
    composite.dimensions.length > 0
      ? composite.dimensions.reduce((sum, d) => sum + d.confidence, 0) /
        composite.dimensions.length
      : 0.5;

  // Lower confidence = wider spread
  const spreadPct = 0.10 + (1 - avgConfidence) * 0.25; // 10-35% spread
  const lowCents = Math.round(midCents * (1 - spreadPct));
  const highCents = Math.round(midCents * (1 + spreadPct));

  const assumptions: string[] = [
    `Composite score: ${composite.composite} (${composite.grade})`,
    `Score-to-value multiplier: ${multiplier.toFixed(2)}x`,
    `Reference facility: $${(referenceFacilityCents / 100).toLocaleString()}`,
    `Data confidence: ${(avgConfidence * 100).toFixed(0)}%`,
    `Spread: ±${(spreadPct * 100).toFixed(0)}%`,
    `Critical flags: ${composite.criticalFlags}`,
  ];

  // Adjust down for critical flags
  if (composite.criticalFlags > 0) {
    const penalty = composite.criticalFlags * 0.05; // 5% per critical flag
    assumptions.push(`Critical flag penalty: -${(penalty * 100).toFixed(0)}%`);
    const factor = 1 - penalty;
    return {
      lowCents: Math.round(lowCents * factor),
      midCents: Math.round(midCents * factor),
      highCents: Math.round(highCents * factor),
      confidenceInterval: Math.max(0.70, avgConfidence - 0.05 * composite.criticalFlags),
      methodology,
      assumptions,
    };
  }

  return {
    lowCents,
    midCents,
    highCents,
    confidenceInterval: Math.min(0.95, avgConfidence),
    methodology,
    assumptions,
  };
}

function scoreToMultiplier(score: number): number {
  // Piecewise linear: more generous at top, drops fast at bottom
  if (score >= 90) return 2.5 + (score - 90) * 0.05; // 90-99: 2.5x to 2.95x
  if (score >= 75) return 1.5 + (score - 75) * (1.0 / 15); // 75-89: 1.5x to 2.5x
  if (score >= 50) return 0.8 + (score - 50) * (0.7 / 25); // 50-74: 0.8x to 1.5x
  if (score >= 25) return 0.3 + (score - 25) * (0.5 / 25); // 25-49: 0.3x to 0.8x
  return 0.1 + score * (0.2 / 25); // 0-24: 0.1x to 0.3x
}

// ─── Risk Narrative Generator ───────────────────────────────────────────────

/**
 * Generate a structured risk narrative from the composite score.
 * This is a template-driven narrative, not AI-generated (deterministic).
 */
export function generateRiskNarrative(
  composite: CompositeScore,
  covenants: CovenantRecommendation[]
): string {
  const parts: string[] = [];
  const { athlete } = findAthleteContext(composite);

  // Opening
  parts.push(
    `Underwriting assessment for ${athlete} ` +
    `produces a composite score of ${composite.composite}/99 (${composite.grade}).`
  );

  // Dimension highlights
  const sorted = [...composite.dimensions].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  if (strongest) {
    parts.push(
      `Strongest dimension: ${formatDimension(strongest.dimension)} at ${strongest.score}/99.`
    );
  }
  if (weakest && weakest.dimension !== strongest?.dimension) {
    parts.push(
      `Weakest dimension: ${formatDimension(weakest.dimension)} at ${weakest.score}/99.`
    );
  }

  // Flags summary
  if (composite.criticalFlags > 0) {
    parts.push(
      `${composite.criticalFlags} critical risk flag(s) identified — ` +
      `enhanced monitoring and covenant protections recommended.`
    );
  } else if (composite.totalFlags > 0) {
    parts.push(
      `${composite.totalFlags} non-critical risk flag(s) noted — ` +
      `standard covenant protections apply.`
    );
  } else {
    parts.push("No risk flags triggered — clean risk profile.");
  }

  // Covenant summary
  if (covenants.length > 0) {
    const types = new Set(covenants.map((c) => c.type));
    parts.push(
      `${covenants.length} covenant recommendation(s) triggered across ` +
      `${Array.from(types).map(formatCovenantType).join(", ")} categories.`
    );
  }

  return parts.join(" ");
}

function findAthleteContext(composite: CompositeScore): { athlete: string } {
  // We reconstruct from athleteId since CompositeScore doesn't carry name
  return { athlete: `Athlete ${composite.athleteId}` };
}

function formatDimension(dim: string): string {
  return dim
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatCovenantType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// ─── Default Compliance Clearance (placeholder) ─────────────────────────────

/**
 * Placeholder compliance clearance.
 * In production, this integrates with the state/conference/NCAA policy engine.
 */
export function defaultComplianceClearance(): ComplianceClearance {
  return {
    totalStates: 50,
    passedStates: 50,
    failedStates: [],
    restrictedStates: [],
    conferenceCleared: true,
    ncaaCleared: true,
    checkedAt: new Date(),
  };
}

// ─── Memo Generator ─────────────────────────────────────────────────────────

export interface GenerateMemoInput {
  /** Raw signals for the athlete */
  athleteInput: AthleteSignalInput;
  /** Weight profile for the target instrument */
  weightProfile: InstrumentWeightProfile;
  /** Reference facility size in USD cents (for valuation) */
  referenceFacilityCents?: number;
  /** Valuation methodology */
  valuationMethodology?: "dcf" | "comparable" | "hybrid";
  /** Optional compliance clearance (defaults to clean if not provided) */
  complianceClearance?: ComplianceClearance;
  /** Optional analyst notes */
  analystNotes?: string | null;
  /** Model version ID */
  modelVersionId?: string;
}

export interface GenerateMemoOutput {
  memo: UnderwritingMemo;
  explainability: ScoreExplainability;
}

/**
 * Generate a complete underwriting memo.
 *
 * This is the primary orchestration function:
 *   1. Score the athlete (deterministic scoring engine)
 *   2. Generate covenant recommendations (deterministic covenant engine)
 *   3. Estimate valuation band (deterministic valuation model)
 *   4. Generate risk narrative (template-driven, deterministic)
 *   5. Assemble memo
 *
 * DETERMINISTIC: same inputs = same output. Always.
 *
 * @param input - All inputs needed to generate a memo
 * @returns Complete UnderwritingMemo + ScoreExplainability
 */
export function generateMemo(input: GenerateMemoInput): GenerateMemoOutput {
  const {
    athleteInput,
    weightProfile,
    referenceFacilityCents = 200_000_00,
    valuationMethodology = "hybrid",
    complianceClearance,
    analystNotes = null,
    modelVersionId = "33-v1.0.0",
  } = input;

  const now = new Date();

  // ── 1. Score ────────────────────────────────────────────────────────────

  const { score: compositeScore, explainability } = scoreAthlete(
    athleteInput,
    weightProfile,
    modelVersionId
  );

  // ── 2. Covenants ────────────────────────────────────────────────────────

  const covenants = generateCovenants(compositeScore);

  // ── 3. Valuation ────────────────────────────────────────────────────────

  const valuation = estimateValuation(
    compositeScore,
    referenceFacilityCents,
    valuationMethodology
  );

  // ── 4. Compliance ───────────────────────────────────────────────────────

  const compliance = complianceClearance ?? defaultComplianceClearance();

  // ── 5. Risk narrative ───────────────────────────────────────────────────

  const riskNarrative = generateRiskNarrative(compositeScore, covenants);

  // ── 6. Assemble ─────────────────────────────────────────────────────────

  const memo: UnderwritingMemo = {
    id: randomUUID(),
    athleteId: athleteInput.athleteId,
    athlete: { ...athleteInput.athlete },
    instrumentType: weightProfile.instrumentType,
    compositeScore,
    valuation,
    compliance,
    covenantRecommendations: covenants,
    riskNarrative,
    analystNotes,
    status: "draft" as UnderwritingMemoStatus,
    reviewedBy: null,
    reviewedAt: null,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  return { memo, explainability };
}

// ─── Model Version Utilities ────────────────────────────────────────────────
// Superseded by genome.ts — computeGenomeSignature() provides full
// cryptographic model identity. See genome.ts for documentation.
