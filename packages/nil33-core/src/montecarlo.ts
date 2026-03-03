/**
 * @nil33/core — Seeded Monte Carlo Engine
 *
 * Deterministic pseudo-random simulation for VaR and risk analysis.
 * Uses a seeded PRNG so that identical seeds produce identical results.
 *
 * Peer reviewers can replicate any simulation by knowing the seed.
 *
 * Pure functions. No side effects. Fully reproducible.
 */

import {
  type MonteCarloConfig,
  type MonteCarloVaRResult,
  type InstrumentWeightProfile,
  type AthleteSignalInput,
  type SignalInput,
  type SignalDimension,
} from "./types";
import { scoreAthlete, ALL_DIMENSIONS } from "./scoring";
import type { PortfolioAthleteEntry } from "./stress";

// ─── Seeded PRNG (Mulberry32) ───────────────────────────────────────────────

/**
 * Mulberry32 — fast 32-bit seeded PRNG.
 * Deterministic: same seed = same sequence. Always.
 *
 * Returns a function that yields [0, 1) on each call.
 * Quality: passes SmallCrush and most of BigCrush.
 * Suitable for Monte Carlo — NOT for cryptography.
 */
export function createSeededRng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Box-Muller transform for normal distribution samples.
 * Uses the seeded PRNG to produce N(0,1) values.
 */
function normalSample(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

// ─── Monte Carlo VaR ────────────────────────────────────────────────────────

/**
 * Dimension-level volatility assumptions (annualized, basis points).
 * These are calibrated to athlete NIL revenue characteristics.
 * In production, these would be estimated from historical data.
 */
const DIMENSION_ANNUAL_VOL: Record<SignalDimension, number> = {
  revenue_durability: 0.15,
  sponsor_concentration: 0.20,
  engagement_quality: 0.25,
  eligibility_risk: 0.30,
  injury_availability: 0.35,
  reputational_volatility: 0.30,
};

/**
 * Correlation matrix between dimensions (simplified — block diagonal).
 * In production, this would be estimated from historical co-movements.
 */
const DIMENSION_CORRELATIONS: Record<string, number> = {
  "revenue_durability:sponsor_concentration": 0.6,
  "revenue_durability:engagement_quality": 0.3,
  "sponsor_concentration:engagement_quality": 0.4,
  "eligibility_risk:injury_availability": 0.2,
  "injury_availability:reputational_volatility": 0.15,
  "eligibility_risk:reputational_volatility": 0.25,
};

function getCorrelation(a: SignalDimension, b: SignalDimension): number {
  if (a === b) return 1.0;
  const key1 = `${a}:${b}`;
  const key2 = `${b}:${a}`;
  return DIMENSION_CORRELATIONS[key1] ?? DIMENSION_CORRELATIONS[key2] ?? 0.05;
}

/**
 * Run a seeded Monte Carlo VaR simulation for a portfolio of athletes.
 *
 * DETERMINISTIC: same seed + same inputs = same output. Always.
 * The seed is embedded in the result for reproducibility.
 *
 * Algorithm:
 *   1. For each path, shock each athlete's dimension scores by
 *      correlated normal draws scaled by dimension volatility
 *   2. Re-score each athlete under the shocked scenario
 *   3. Compute portfolio valuation change
 *   4. Sort path outcomes and extract percentiles
 *
 * @param athletes - Portfolio entries with signals and valuations
 * @param profile - Weight profile for scoring
 * @param config - Monte Carlo configuration (seed, paths, confidence, horizon)
 * @returns MonteCarloVaRResult with full reproducibility metadata
 */
export function runMonteCarloVaR(
  athletes: PortfolioAthleteEntry[],
  profile: InstrumentWeightProfile,
  config: MonteCarloConfig
): MonteCarloVaRResult {
  const rng = createSeededRng(config.seed);
  const { paths, confidenceLevel, horizonDays } = config;

  // Annualize → horizon-adjust volatility
  const horizonFactor = Math.sqrt(horizonDays / 365);

  // Baseline NAV
  const baselineNavCents = athletes.reduce((sum, a) => sum + a.valuation.midCents, 0);

  // Per-athlete baseline composites
  const baselineComposites = athletes.map(
    (a) => scoreAthlete(a.input, profile).score.composite
  );

  // ── Simulate paths ────────────────────────────────────────────────────

  const pathPnLs: number[] = new Array(paths);
  const athletePathLosses: number[][] = athletes.map(() => new Array(paths).fill(0));

  for (let p = 0; p < paths; p++) {
    let pathNav = 0;

    for (let ai = 0; ai < athletes.length; ai++) {
      const a = athletes[ai];

      // Generate correlated dimension shocks
      // Simplified: independent normal draws with pairwise correlation adjustment
      const dimShocks = new Map<SignalDimension, number>();
      const rawDraws = new Map<SignalDimension, number>();

      for (const dim of ALL_DIMENSIONS) {
        rawDraws.set(dim, normalSample(rng));
      }

      // Apply simple correlation adjustment
      for (const dim of ALL_DIMENSIONS) {
        const vol = DIMENSION_ANNUAL_VOL[dim] * horizonFactor;
        let correlatedDraw = rawDraws.get(dim)!;

        // Blend with first correlated dimension for simplicity
        for (const otherDim of ALL_DIMENSIONS) {
          if (otherDim === dim) continue;
          const rho = getCorrelation(dim, otherDim);
          if (rho > 0.1) {
            correlatedDraw =
              rho * rawDraws.get(otherDim)! + Math.sqrt(1 - rho * rho) * correlatedDraw;
            break; // one correlation adjustment per dimension
          }
        }

        dimShocks.set(dim, correlatedDraw * vol);
      }

      // Apply shocks to signals
      const shockedSignals: SignalInput[] = a.input.signals.map((s) => {
        const dim = getDimForSignal(s.signalId);
        const shock = dimShocks.get(dim) ?? 0;
        const shockedScore = Math.max(0, Math.min(99, s.rawScore * (1 + shock)));
        return { ...s, rawScore: Math.round(shockedScore) };
      });

      const shockedInput: AthleteSignalInput = {
        ...a.input,
        signals: shockedSignals,
      };

      const { score } = scoreAthlete(shockedInput, profile);
      const baseComposite = baselineComposites[ai];
      const scaleFactor = baseComposite > 0 ? score.composite / baseComposite : 1;
      const shockedVal = Math.round(a.valuation.midCents * scaleFactor);

      pathNav += shockedVal;
      athletePathLosses[ai][p] = shockedVal - a.valuation.midCents;
    }

    pathPnLs[p] = pathNav - baselineNavCents;
  }

  // ── Sort and extract percentiles ──────────────────────────────────────

  const sorted = [...pathPnLs].sort((a, b) => a - b);

  const varIdx = Math.floor(paths * (1 - confidenceLevel));
  const varCents = -sorted[varIdx]; // VaR is positive loss

  // CVaR = average of losses worse than VaR
  const tailLosses = sorted.slice(0, varIdx + 1);
  const cvarCents = tailLosses.length > 0
    ? -Math.round(tailLosses.reduce((s, v) => s + v, 0) / tailLosses.length)
    : varCents;

  // Percentiles
  const pctKeys = ["p1", "p5", "p10", "p25", "p50", "p75", "p90", "p95", "p99"];
  const pctValues = [0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99];
  const percentiles: Record<string, number> = {};
  for (let i = 0; i < pctKeys.length; i++) {
    percentiles[pctKeys[i]] = sorted[Math.floor(paths * pctValues[i])];
  }

  // Component VaR (marginal contribution)
  const componentVaR = athletes.map((a, ai) => {
    const losses = athletePathLosses[ai];
    const athleteSorted = [...losses].sort((x, y) => x - y);
    const athleteVaR = -athleteSorted[varIdx];
    return {
      athleteId: a.input.athleteId,
      varContributionCents: athleteVaR,
      varContributionPct: varCents > 0 ? Math.round((athleteVaR / varCents) * 10000) : 0,
    };
  });

  return {
    varCents,
    cvarCents,
    percentiles,
    seed: config.seed,
    paths,
    confidenceLevel,
    componentVaR,
  };
}

// ─── Signal → Dimension helper ──────────────────────────────────────────────

const SIGNAL_DIM_LOOKUP: Record<string, SignalDimension> = {
  contract_tenure_renewal: "revenue_durability",
  earning_trajectory_vs_cohort: "revenue_durability",
  market_depth_demand: "revenue_durability",
  revenue_source_diversification: "revenue_durability",
  season_adjusted_earnings: "revenue_durability",
  off_field_revenue_stability: "revenue_durability",
  post_career_transition: "revenue_durability",
  top3_sponsor_dependency: "sponsor_concentration",
  category_diversity_index: "sponsor_concentration",
  renewal_rate_vs_industry: "sponsor_concentration",
  sponsor_credit_quality: "sponsor_concentration",
  contract_duration_distribution: "sponsor_concentration",
  authentic_reach_vs_followers: "engagement_quality",
  conversion_clickthrough: "engagement_quality",
  audience_demographic_alignment: "engagement_quality",
  content_consistency: "engagement_quality",
  platform_diversification: "engagement_quality",
  brand_safety_index: "engagement_quality",
  ncaa_eligibility_status: "eligibility_risk",
  transfer_portal_probability: "eligibility_risk",
  draft_timeline_declaration: "eligibility_risk",
  academic_standing: "eligibility_risk",
  conference_realignment_impact: "eligibility_risk",
  position_specific_injury_rate: "injury_availability",
  historical_medical_record: "injury_availability",
  workload_snap_count_trends: "injury_availability",
  recovery_timeline_model: "injury_availability",
  insurance_availability: "injury_availability",
  sentiment_analysis: "reputational_volatility",
  controversy_exposure_index: "reputational_volatility",
  brand_safety_classification: "reputational_volatility",
  media_cycle_resilience: "reputational_volatility",
  community_standing: "reputational_volatility",
};

function getDimForSignal(signalId: string): SignalDimension {
  return SIGNAL_DIM_LOOKUP[signalId] ?? "revenue_durability";
}
