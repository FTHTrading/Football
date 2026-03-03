/**
 * @nil33/core — Genome Signature (Cryptographic Model Identity)
 *
 * Freezes the entire underwriting model into an immutable cryptographic
 * fingerprint. Two GenomeSignatures are equal iff the underlying model
 * configuration is identical.
 *
 * This is what makes the engine DOI-ready:
 *   - Every memo references a genomeId
 *   - A published genome can be independently verified
 *   - Peer reviewers can reproduce any score by replaying inputs + genome
 *
 * Pure functions. No side effects. Deterministic.
 */

import { createHash } from "crypto";

import {
  type GenomeSignature,
  type InstrumentWeightProfile,
  type UnderwritingGrade,
  GRADE_THRESHOLDS,
} from "./types";
import { ALL_SIGNAL_IDS, ALL_DIMENSIONS, SIGNAL_DIMENSION_MAP } from "./scoring";
import { COVENANT_RULES_CANONICAL } from "./covenants";
import { BUILT_IN_SCENARIOS } from "./stress";

// ─── Canonical Serialization ────────────────────────────────────────────────

/**
 * Deterministic JSON serialization.
 * Keys sorted, no whitespace, no undefined coercion.
 * This ensures identical objects always produce identical hashes.
 */
function canonicalize(value: unknown): string {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

/**
 * Deep-sort all keys recursively for complex nested structures.
 */
function deepCanonical(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(deepCanonical).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + deepCanonical(obj[k])).join(",") + "}";
}

/**
 * SHA-256 hex digest of a string.
 */
function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

// ─── Flag Rules Canonical Form ──────────────────────────────────────────────

/**
 * Canonical representation of flag rules.
 * We extract the structural parts (signalId, dimension, severity, code)
 * but NOT the runtime condition function — instead we encode the fact
 * that the threshold logic is part of the source code at a specific version.
 *
 * The flag rules hash changes when:
 *   1. A flag rule is added or removed
 *   2. A flag's severity, code, or target signal/dimension changes
 *   3. The threshold values change (captured via FLAG_RULES_CANONICAL)
 */
export const FLAG_RULES_CANONICAL = [
  { signalId: "top3_sponsor_dependency", dimension: "sponsor_concentration", severity: "critical", code: "HIGH_SPONSOR_CONCENTRATION", threshold: 40 },
  { signalId: "ncaa_eligibility_status", dimension: "eligibility_risk", severity: "critical", code: "ELIGIBILITY_AT_RISK", threshold: 50 },
  { signalId: "transfer_portal_probability", dimension: "eligibility_risk", severity: "caution", code: "TRANSFER_PORTAL_RISK", threshold: 40 },
  { signalId: "controversy_exposure_index", dimension: "reputational_volatility", severity: "caution", code: "REPUTATION_RISK", threshold: 35 },
  { signalId: "position_specific_injury_rate", dimension: "injury_availability", severity: "caution", code: "HIGH_INJURY_RISK", threshold: 30 },
  { signalId: "revenue_source_diversification", dimension: "revenue_durability", severity: "watch", code: "LOW_REVENUE_DIVERSITY", threshold: 35 },
  { signalId: "brand_safety_index", dimension: "engagement_quality", severity: "watch", code: "BRAND_SAFETY_CONCERN", threshold: 40 },
  { signalId: null, dimension: "revenue_durability", severity: "critical", code: "WEAK_REVENUE_DURABILITY", threshold: 45 },
  { signalId: null, dimension: "eligibility_risk", severity: "critical", code: "ELIGIBILITY_DIMENSION_FAIL", threshold: 40 },
  { signalId: null, dimension: "reputational_volatility", severity: "caution", code: "VOLATILE_REPUTATION", threshold: 40 },
];

// ─── Valuation Model Canonical Form ─────────────────────────────────────────

/**
 * The valuation model parameters encoded as a hashable structure.
 * Changes when the score-to-multiplier curve or spread logic changes.
 */
export const VALUATION_MODEL_CANONICAL = {
  multiplierCurve: [
    { rangeStart: 90, rangeEnd: 99, baseMultiplier: 2.5, perPointDelta: 0.05 },
    { rangeStart: 75, rangeEnd: 89, baseMultiplier: 1.5, perPointDelta: 1.0 / 15 },
    { rangeStart: 50, rangeEnd: 74, baseMultiplier: 0.8, perPointDelta: 0.7 / 25 },
    { rangeStart: 25, rangeEnd: 49, baseMultiplier: 0.3, perPointDelta: 0.5 / 25 },
    { rangeStart: 0, rangeEnd: 24, baseMultiplier: 0.1, perPointDelta: 0.2 / 25 },
  ],
  spreadFormula: "0.10 + (1 - avgConfidence) * 0.25",
  criticalFlagPenalty: 0.05,
};

// ─── Genome Computation ─────────────────────────────────────────────────────

/**
 * Compute the genome signature for the current model configuration.
 *
 * The genomeId is derived from all component hashes, making it a single
 * value that captures the entire model state.
 *
 * DETERMINISTIC: calling this with the same codebase always produces
 * the same genome signature.
 */
export function computeGenomeSignature(
  weightProfile: InstrumentWeightProfile,
  version: string = "1.0.0"
): GenomeSignature {
  // ── 1. Signal schema hash ─────────────────────────────────────────────
  const signalSchema = ALL_SIGNAL_IDS.map((id) => ({
    signalId: id,
    dimension: SIGNAL_DIMENSION_MAP[id],
  }));
  const signalSchemaHash = sha256(deepCanonical(signalSchema));

  // ── 2. Weight profile hash ────────────────────────────────────────────
  const weightData = {
    instrumentType: weightProfile.instrumentType,
    dimensionWeights: weightProfile.dimensionWeights,
    signalOverrides: weightProfile.signalOverrides,
    version: weightProfile.version,
  };
  const weightProfileHash = sha256(deepCanonical(weightData));

  // ── 3. Grade thresholds hash ──────────────────────────────────────────
  const thresholdHash = sha256(deepCanonical(GRADE_THRESHOLDS));

  // ── 4. Stress matrix hash ─────────────────────────────────────────────
  const stressMatrix = BUILT_IN_SCENARIOS.map((s) => ({
    id: s.id,
    type: s.type,
    shocks: s.shocks.map((sh) => ({
      dimension: sh.dimension,
      shockPct: sh.shockPct,
    })),
  }));
  const stressMatrixHash = sha256(deepCanonical(stressMatrix));

  // ── 5. Covenant rules hash ────────────────────────────────────────────
  const covenantRulesHash = sha256(deepCanonical(COVENANT_RULES_CANONICAL));

  // ── 6. Flag rules hash ────────────────────────────────────────────────
  const flagRulesHash = sha256(deepCanonical(FLAG_RULES_CANONICAL));

  // ── 7. Valuation model hash ───────────────────────────────────────────
  const valuationModelHash = sha256(deepCanonical(VALUATION_MODEL_CANONICAL));

  // ── 8. Composite genome ID ────────────────────────────────────────────
  // The genome ID is a hash of all component hashes, making it a single
  // value that changes if ANY model component changes.
  const genomeId = sha256(
    [
      signalSchemaHash,
      weightProfileHash,
      thresholdHash,
      stressMatrixHash,
      covenantRulesHash,
      flagRulesHash,
      valuationModelHash,
    ].join(":")
  ).slice(0, 32); // 32 hex chars = 128 bits, collision-resistant for identifiers

  return {
    genomeId,
    signalSchemaHash,
    weightProfileHash,
    thresholdHash,
    stressMatrixHash,
    covenantRulesHash,
    flagRulesHash,
    valuationModelHash,
    createdAt: new Date().toISOString(),
    version,
  };
}

// ─── Genome Comparison ──────────────────────────────────────────────────────

export interface GenomeDiff {
  identical: boolean;
  changedComponents: string[];
  details: {
    component: string;
    hashA: string;
    hashB: string;
  }[];
}

/**
 * Compare two genome signatures and identify which components differ.
 * Useful for detecting model drift between releases.
 */
export function diffGenomes(a: GenomeSignature, b: GenomeSignature): GenomeDiff {
  const components: { key: keyof GenomeSignature; label: string }[] = [
    { key: "signalSchemaHash", label: "Signal Schema" },
    { key: "weightProfileHash", label: "Weight Profile" },
    { key: "thresholdHash", label: "Grade Thresholds" },
    { key: "stressMatrixHash", label: "Stress Matrix" },
    { key: "covenantRulesHash", label: "Covenant Rules" },
    { key: "flagRulesHash", label: "Flag Rules" },
    { key: "valuationModelHash", label: "Valuation Model" },
  ];

  const changedComponents: string[] = [];
  const details: GenomeDiff["details"] = [];

  for (const { key, label } of components) {
    if (a[key] !== b[key]) {
      changedComponents.push(label);
      details.push({
        component: label,
        hashA: String(a[key]),
        hashB: String(b[key]),
      });
    }
  }

  return {
    identical: changedComponents.length === 0,
    changedComponents,
    details,
  };
}

/**
 * Verify that a genome signature matches the current model.
 * Returns true if the genome was produced by this exact codebase.
 */
export function verifyGenome(
  genome: GenomeSignature,
  weightProfile: InstrumentWeightProfile
): { valid: boolean; drift: GenomeDiff } {
  const current = computeGenomeSignature(weightProfile, genome.version);
  const drift = diffGenomes(genome, current);
  return { valid: drift.identical, drift };
}
