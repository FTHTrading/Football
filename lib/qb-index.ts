// ─── QB Index — Composite Ranking Engine ───────────────
// Weighted scoring algorithm that creates a single "QB Index"
// score from verified metrics. This is the moat.

export interface QBIndexInput {
  velocity: number;       // mph (typically 40–70)
  releaseTime: number;    // seconds (lower is better, typically 0.3–0.7)
  accuracy: number;       // completion % (0–100)
  mechanics: number;      // 0–100 grade
  footwork: number;       // 0–100 percentile
  poise: number;          // 0–100 percentile
  fieldVision: number;    // 0–100 percentile
  clutchFactor: number;   // 0–100 percentile
}

// Weight distribution — tuned for what college coaches care about
const WEIGHTS = {
  velocity: 0.18,
  release: 0.14,
  accuracy: 0.20,
  mechanics: 0.16,
  footwork: 0.10,
  poise: 0.08,
  fieldVision: 0.08,
  clutchFactor: 0.06,
} as const;

// Normalize velocity (40–70 mph range → 0–100 scale)
function normalizeVelocity(mph: number): number {
  return Math.min(100, Math.max(0, ((mph - 40) / 30) * 100));
}

// Normalize release time (0.3–0.7s range → 0–100 scale, lower is better)
function normalizeRelease(seconds: number): number {
  return Math.min(100, Math.max(0, ((0.7 - seconds) / 0.4) * 100));
}

/**
 * Calculate the composite QB Index score (0–99)
 * This is the single number that defines a prospect's verified ranking.
 */
export function calculateQBIndex(input: QBIndexInput): number {
  const normalized = {
    velocity: normalizeVelocity(input.velocity),
    release: normalizeRelease(input.releaseTime),
    accuracy: input.accuracy,
    mechanics: input.mechanics,
    footwork: input.footwork,
    poise: input.poise,
    fieldVision: input.fieldVision,
    clutchFactor: input.clutchFactor,
  };

  const weighted =
    normalized.velocity * WEIGHTS.velocity +
    normalized.release * WEIGHTS.release +
    normalized.accuracy * WEIGHTS.accuracy +
    normalized.mechanics * WEIGHTS.mechanics +
    normalized.footwork * WEIGHTS.footwork +
    normalized.poise * WEIGHTS.poise +
    normalized.fieldVision * WEIGHTS.fieldVision +
    normalized.clutchFactor * WEIGHTS.clutchFactor;

  // Clamp between 0–99 (nobody gets a perfect 100)
  return Math.min(99, Math.max(0, Math.round(weighted)));
}

/**
 * Get the tier label for a QB Index score
 */
export function getQBIndexTier(score: number): {
  tier: string;
  label: string;
  color: string;
} {
  if (score >= 90) return { tier: "ELITE", label: "Elite Prospect", color: "#00FF88" };
  if (score >= 80) return { tier: "PREMIUM", label: "Premium Prospect", color: "#00C2FF" };
  if (score >= 70) return { tier: "VERIFIED", label: "Verified Starter", color: "#FFD700" };
  if (score >= 60) return { tier: "DEVELOPING", label: "Developing Talent", color: "#C0C0C0" };
  return { tier: "EMERGING", label: "Emerging Prospect", color: "#888888" };
}

/**
 * Generate a national percentile from index scores
 * (placeholder — in production, compute from database distribution)
 */
export function getIndexPercentile(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 50;
  const below = allScores.filter((s) => s < score).length;
  return Math.round((below / allScores.length) * 100);
}

/**
 * Rank athletes by QB Index and return sorted with rank
 */
export function rankAthletes<T extends { qbIndex: number }>(
  athletes: T[]
): (T & { rank: number })[] {
  return [...athletes]
    .sort((a, b) => b.qbIndex - a.qbIndex)
    .map((a, i) => ({ ...a, rank: i + 1 }));
}
