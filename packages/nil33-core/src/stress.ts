/**
 * @nil33/core — Stress Test Engine
 *
 * Deterministic stress testing for athlete portfolios.
 * Applies shock scenarios to signal scores, re-scores athletes,
 * and computes portfolio-level impact.
 *
 * Pure functions. No side effects.
 */

import {
  type SignalDimension,
  type StressTestScenario,
  type StressTestResult,
  type StressShock,
  type CompositeScore,
  type InstrumentWeightProfile,
  type AthleteSignalInput,
  type SignalInput,
  type ValuationBand,
} from "./types";
import { scoreAthlete, ALL_DIMENSIONS } from "./scoring";

// ─── Built-in Scenario Library ──────────────────────────────────────────────

export const BUILT_IN_SCENARIOS: StressTestScenario[] = [
  {
    id: "stress-injury-star",
    type: "injury_star_player",
    name: "Star Player Season-Ending Injury",
    description:
      "Models impact of a season-ending injury to the highest-valued athlete in the portfolio. " +
      "Injury/availability drops sharply (-40%), engagement drops moderately (-20%), " +
      "and revenue durability declines (-15%).",
    shocks: [
      { dimension: "injury_availability", shockPct: -4000, appliesTo: null },
      { dimension: "engagement_quality", shockPct: -2000, appliesTo: null },
      { dimension: "revenue_durability", shockPct: -1500, appliesTo: null },
    ],
  },
  {
    id: "stress-conference-realignment",
    type: "conference_realignment",
    name: "Conference Realignment Disruption",
    description:
      "Models the impact of a major conference realignment affecting eligibility and sponsor relationships. " +
      "Eligibility risk drops (-25%), sponsor concentration worsens (-20%), revenue durability drops (-10%).",
    shocks: [
      { dimension: "eligibility_risk", shockPct: -2500, appliesTo: null },
      { dimension: "sponsor_concentration", shockPct: -2000, appliesTo: null },
      { dimension: "revenue_durability", shockPct: -1000, appliesTo: null },
    ],
  },
  {
    id: "stress-nil-regulation",
    type: "nil_regulation_change",
    name: "Adverse NIL Regulatory Change",
    description:
      "Models a federal or state regulatory change that restricts NIL deal structures. " +
      "Eligibility risk drops sharply (-35%), revenue durability declines (-20%), " +
      "engagement quality moderately affected (-10%).",
    shocks: [
      { dimension: "eligibility_risk", shockPct: -3500, appliesTo: null },
      { dimension: "revenue_durability", shockPct: -2000, appliesTo: null },
      { dimension: "engagement_quality", shockPct: -1000, appliesTo: null },
    ],
  },
  {
    id: "stress-sponsor-withdrawal",
    type: "sponsor_withdrawal",
    name: "Major Sponsor Category Withdrawal",
    description:
      "Models a top sponsor exiting the NIL space or pulling specific category deals. " +
      "Sponsor concentration worsens sharply (-35%), revenue durability drops (-25%).",
    shocks: [
      { dimension: "sponsor_concentration", shockPct: -3500, appliesTo: null },
      { dimension: "revenue_durability", shockPct: -2500, appliesTo: null },
    ],
  },
  {
    id: "stress-transfer-wave",
    type: "transfer_portal_wave",
    name: "Transfer Portal Wave",
    description:
      "Models a wave of athletes entering the transfer portal, disrupting continuity and sponsor relationships. " +
      "Eligibility risk drops (-30%), sponsor concentration (-15%), engagement quality (-15%).",
    shocks: [
      { dimension: "eligibility_risk", shockPct: -3000, appliesTo: null },
      { dimension: "sponsor_concentration", shockPct: -1500, appliesTo: null },
      { dimension: "engagement_quality", shockPct: -1500, appliesTo: null },
    ],
  },
  {
    id: "stress-economic-downturn",
    type: "economic_downturn",
    name: "Macro Economic Downturn",
    description:
      "Models a broad economic contraction reducing sponsor budgets and brand deal volumes. " +
      "Revenue durability drops (-30%), sponsor concentration worsens (-25%), reputational volatility rises (-10%).",
    shocks: [
      { dimension: "revenue_durability", shockPct: -3000, appliesTo: null },
      { dimension: "sponsor_concentration", shockPct: -2500, appliesTo: null },
      { dimension: "reputational_volatility", shockPct: -1000, appliesTo: null },
    ],
  },
];

// ─── Shock Application ─────────────────────────────────────────────────────

/**
 * Apply shocks to an athlete's signal inputs.
 * Shocks are applied at the dimension level — all signals in the shocked
 * dimension are adjusted by the shock percentage.
 *
 * shockPct is in basis points: -2000 = -20% reduction.
 */
export function applyShocks(
  signals: SignalInput[],
  shocks: StressShock[],
  athleteId: string | null
): SignalInput[] {
  // Build a map of dimension → shock multiplier
  const dimensionMultipliers = new Map<SignalDimension, number>();

  for (const shock of shocks) {
    // Skip non-signal dimensions (valuation/cashflow handled separately)
    if (shock.dimension === "valuation" || shock.dimension === "cashflow") continue;

    // Skip if shock targets a specific athlete and this isn't them
    if (shock.appliesTo !== null && shock.appliesTo !== athleteId) continue;

    const dim = shock.dimension as SignalDimension;
    const existing = dimensionMultipliers.get(dim) ?? 0;
    // Accumulate shocks (additive in basis points)
    dimensionMultipliers.set(dim, existing + shock.shockPct);
  }

  // Mapping signal → dimension (inline to avoid circular import overhead)
  const signalDimMap: Record<string, SignalDimension> = {};
  const revDurSignals = [
    "contract_tenure_renewal", "earning_trajectory_vs_cohort", "market_depth_demand",
    "revenue_source_diversification", "season_adjusted_earnings", "off_field_revenue_stability",
    "post_career_transition",
  ];
  const sponsorSignals = [
    "top3_sponsor_dependency", "category_diversity_index", "renewal_rate_vs_industry",
    "sponsor_credit_quality", "contract_duration_distribution",
  ];
  const engageSignals = [
    "authentic_reach_vs_followers", "conversion_clickthrough", "audience_demographic_alignment",
    "content_consistency", "platform_diversification", "brand_safety_index",
  ];
  const eligSignals = [
    "ncaa_eligibility_status", "transfer_portal_probability", "draft_timeline_declaration",
    "academic_standing", "conference_realignment_impact",
  ];
  const injurySignals = [
    "position_specific_injury_rate", "historical_medical_record", "workload_snap_count_trends",
    "recovery_timeline_model", "insurance_availability",
  ];
  const repSignals = [
    "sentiment_analysis", "controversy_exposure_index", "brand_safety_classification",
    "media_cycle_resilience", "community_standing",
  ];

  for (const s of revDurSignals) signalDimMap[s] = "revenue_durability";
  for (const s of sponsorSignals) signalDimMap[s] = "sponsor_concentration";
  for (const s of engageSignals) signalDimMap[s] = "engagement_quality";
  for (const s of eligSignals) signalDimMap[s] = "eligibility_risk";
  for (const s of injurySignals) signalDimMap[s] = "injury_availability";
  for (const s of repSignals) signalDimMap[s] = "reputational_volatility";

  return signals.map((signal) => {
    const dim = signalDimMap[signal.signalId];
    if (!dim) return signal;

    const shockBps = dimensionMultipliers.get(dim);
    if (shockBps === undefined || shockBps === 0) return signal;

    // Apply shock: shockBps is basis points, so -2000 = -20%
    const multiplier = 1 + shockBps / 10000;
    const shocked = Math.max(0, Math.min(99, Math.round(signal.rawScore * multiplier)));

    return { ...signal, rawScore: shocked };
  });
}

// ─── Portfolio Stress Test ──────────────────────────────────────────────────

export interface PortfolioAthleteEntry {
  input: AthleteSignalInput;
  valuation: ValuationBand;
  /** Notional exposure in USD cents */
  exposureCents: number;
}

/**
 * Run a stress test scenario against a portfolio of athletes.
 *
 * DETERMINISTIC: same portfolio + same scenario + same profile = same result.
 *
 * @param portfolioId - Identifier for the portfolio/SPV
 * @param athletes - Array of athlete entries with signals and valuations
 * @param scenario - Stress scenario to apply
 * @param profile - Weight profile for re-scoring
 * @param modelVersionId - Model version for audit trail
 * @returns StressTestResult with portfolio-level impact
 */
export function runStressTest(
  portfolioId: string,
  athletes: PortfolioAthleteEntry[],
  scenario: StressTestScenario,
  profile: InstrumentWeightProfile,
  modelVersionId: string = "33-v1.0.0"
): StressTestResult {
  const now = new Date();

  // ── 1. Score baseline ─────────────────────────────────────────────────

  const baselineScores = athletes.map((a) => ({
    entry: a,
    result: scoreAthlete(a.input, profile, modelVersionId),
  }));

  // ── 2. Apply shocks and re-score ──────────────────────────────────────

  const stressedScores = athletes.map((a) => {
    const shockedSignals = applyShocks(a.input.signals, scenario.shocks, a.input.athleteId);
    const shockedInput: AthleteSignalInput = {
      ...a.input,
      signals: shockedSignals,
    };
    return {
      entry: a,
      result: scoreAthlete(shockedInput, profile, modelVersionId),
    };
  });

  // ── 3. Compute portfolio-level metrics ────────────────────────────────

  const baselineNavCents = athletes.reduce((sum, a) => sum + a.valuation.midCents, 0);

  // Estimate stressed NAV by scaling each athlete's valuation by score change ratio
  let stressedNavCents = 0;
  const impactedAthletes: StressTestResult["mostImpactedAthletes"] = [];

  for (let i = 0; i < athletes.length; i++) {
    const baseComposite = baselineScores[i].result.score.composite;
    const stressedComposite = stressedScores[i].result.score.composite;
    const scoreChange = stressedComposite - baseComposite;

    // Valuation scales proportionally with composite change
    const scaleFactor = baseComposite > 0 ? stressedComposite / baseComposite : 1;
    const stressedVal = Math.round(athletes[i].valuation.midCents * scaleFactor);
    stressedNavCents += stressedVal;

    impactedAthletes.push({
      athleteId: athletes[i].input.athleteId,
      athleteName: `${athletes[i].input.athlete.firstName} ${athletes[i].input.athlete.lastName}`,
      scoreChange: Math.round(scoreChange * 100) / 100,
      valuationImpactCents: stressedVal - athletes[i].valuation.midCents,
    });
  }

  // Sort by impact (most negative first)
  impactedAthletes.sort((a, b) => a.valuationImpactCents - b.valuationImpactCents);

  // Simple VaR proxy: use the NAV change as a rough VaR estimate
  const baselineVaRCents = Math.round(baselineNavCents * 0.05); // 5% baseline VaR
  const navDelta = baselineNavCents - stressedNavCents;
  const stressedVaRCents = baselineVaRCents + navDelta;

  const navImpactPct =
    baselineNavCents > 0
      ? Math.round(((stressedNavCents - baselineNavCents) / baselineNavCents) * 10000)
      : 0;

  return {
    scenarioId: scenario.id,
    portfolioId,
    baselineVaRCents,
    stressedVaRCents,
    baselineNavCents,
    stressedNavCents,
    navImpactPct,
    mostImpactedAthletes: impactedAthletes,
    runAt: now,
  };
}

/**
 * Run all built-in scenarios against a portfolio.
 * Returns results sorted by severity (most negative NAV impact first).
 */
export function runAllScenarios(
  portfolioId: string,
  athletes: PortfolioAthleteEntry[],
  profile: InstrumentWeightProfile,
  modelVersionId: string = "33-v1.0.0"
): StressTestResult[] {
  return BUILT_IN_SCENARIOS
    .map((scenario) => runStressTest(portfolioId, athletes, scenario, profile, modelVersionId))
    .sort((a, b) => a.navImpactPct - b.navImpactPct);
}
