/**
 * @nil33/core — Scoring Engine + Covenant + Stress + Memo Tests
 *
 * Validates determinism, correctness, and edge cases of the
 * 33-Signal underwriting pipeline.
 */

import { describe, it, expect } from "vitest";
import {
  scoreAthlete,
  assignGrade,
  validateWeightProfile,
  validateSignalInputs,
  ALL_SIGNAL_IDS,
  ALL_DIMENSIONS,
  RPN_WEIGHT_PROFILE,
  PTN_WEIGHT_PROFILE,
  getDefaultWeightProfile,
} from "./scoring";
import { generateCovenants, countTriggeredCovenants } from "./covenants";
import { applyShocks, BUILT_IN_SCENARIOS, runStressTest } from "./stress";
import { generateMemo, estimateValuation, generateRiskNarrative } from "./memo";
import type {
  AthleteSignalInput,
  SignalInput,
  SignalId,
  InstrumentWeightProfile,
  ValuationBand,
} from "./types";
import { GRADE_THRESHOLDS } from "./types";

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function makeSignalInput(overrides: Partial<Record<SignalId, number>> = {}): SignalInput[] {
  return ALL_SIGNAL_IDS.map((signalId) => ({
    signalId,
    rawScore: overrides[signalId] ?? 75,
    confidence: 0.9,
    dataSource: "test",
  }));
}

function makeAthleteInput(
  signalOverrides: Partial<Record<SignalId, number>> = {},
  athleteId: string = "athlete-001"
): AthleteSignalInput {
  return {
    athleteId,
    athlete: {
      firstName: "Test",
      lastName: "Athlete",
      sport: "Football",
      school: "Texas",
      position: "QB",
      gradYear: 2027,
    },
    signals: makeSignalInput(signalOverrides),
    observedAt: new Date("2026-03-01"),
  };
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

describe("scoreAthlete", () => {
  it("produces a composite score for all-75 signals", () => {
    const input = makeAthleteInput();
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    expect(score.composite).toBeGreaterThan(0);
    expect(score.composite).toBeLessThanOrEqual(99);
    expect(score.dimensions).toHaveLength(6);
    expect(score.athleteId).toBe("athlete-001");
    expect(score.instrumentType).toBe("revenue_participation_note");
  });

  it("is deterministic — same inputs produce same output", () => {
    const input = makeAthleteInput();
    const { score: a } = scoreAthlete(input, RPN_WEIGHT_PROFILE, "v1");
    const { score: b } = scoreAthlete(input, RPN_WEIGHT_PROFILE, "v1");

    expect(a.composite).toBe(b.composite);
    expect(a.grade).toBe(b.grade);
    expect(a.totalFlags).toBe(b.totalFlags);
    expect(a.dimensions.map((d) => d.score)).toEqual(b.dimensions.map((d) => d.score));
  });

  it("higher signals produce higher composite", () => {
    const low = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 30])) as Record<SignalId, number>
    );
    const high = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 90])) as Record<SignalId, number>
    );

    const { score: lowScore } = scoreAthlete(low, RPN_WEIGHT_PROFILE);
    const { score: highScore } = scoreAthlete(high, RPN_WEIGHT_PROFILE);

    expect(highScore.composite).toBeGreaterThan(lowScore.composite);
  });

  it("clamps scores to [0, 99]", () => {
    const input = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 150])) as Record<SignalId, number>
    );
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    // All raw scores should be clamped to 99
    for (const dim of score.dimensions) {
      for (const sig of dim.signals) {
        expect(sig.rawScore).toBeLessThanOrEqual(99);
      }
    }
  });

  it("includes all 33 signals across 6 dimensions", () => {
    const input = makeAthleteInput();
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    const totalSignals = score.dimensions.reduce((sum, d) => sum + d.signalCount, 0);
    expect(totalSignals).toBe(33);
    expect(score.dimensions).toHaveLength(6);
  });

  it("produces different scores for different weight profiles", () => {
    // Give revenue durability very high scores and others low
    const skewed: Partial<Record<SignalId, number>> = {
      contract_tenure_renewal: 99,
      earning_trajectory_vs_cohort: 99,
      market_depth_demand: 99,
      revenue_source_diversification: 99,
      season_adjusted_earnings: 99,
      off_field_revenue_stability: 99,
      post_career_transition: 99,
      // Others default to 40
    };
    const defaults = Object.fromEntries(
      ALL_SIGNAL_IDS.map((id) => [id, 40])
    ) as Record<SignalId, number>;
    const input = makeAthleteInput({ ...defaults, ...skewed });

    const { score: rpn } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const { score: ptn } = scoreAthlete(input, PTN_WEIGHT_PROFILE);

    // RPN overweights revenue_durability (0.30 vs 0.20), so should score higher
    expect(rpn.composite).toBeGreaterThan(ptn.composite);
  });

  it("includes explainability tree", () => {
    const input = makeAthleteInput();
    const { explainability } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    expect(explainability.signalContributions).toHaveLength(33);
    expect(explainability.dimensionSubtotals).toHaveLength(6);
    expect(explainability.compositeDerivation).toBeGreaterThan(0);
    expect(explainability.modelVersionId).toBe("33-v1.0.0");
  });
});

describe("assignGrade", () => {
  it("assigns A+ for score >= 95", () => {
    expect(assignGrade(95)).toBe("A+");
    expect(assignGrade(99)).toBe("A+");
  });

  it("assigns F for very low scores", () => {
    expect(assignGrade(0)).toBe("F");
    expect(assignGrade(10)).toBe("F");
    expect(assignGrade(44)).toBe("F");
  });

  it("assigns correct boundary grades", () => {
    expect(assignGrade(90)).toBe("A");
    expect(assignGrade(85)).toBe("A-");
    expect(assignGrade(80)).toBe("B+");
    expect(assignGrade(75)).toBe("B");
    expect(assignGrade(70)).toBe("B-");
    expect(assignGrade(65)).toBe("C+");
    expect(assignGrade(60)).toBe("C");
    expect(assignGrade(55)).toBe("C-");
    expect(assignGrade(45)).toBe("D");
  });
});

describe("validateWeightProfile", () => {
  it("accepts valid built-in profiles", () => {
    expect(validateWeightProfile(RPN_WEIGHT_PROFILE)).toEqual([]);
    expect(validateWeightProfile(PTN_WEIGHT_PROFILE)).toEqual([]);
  });

  it("rejects profile with weights not summing to 1.0", () => {
    const bad: InstrumentWeightProfile = {
      ...RPN_WEIGHT_PROFILE,
      dimensionWeights: { ...RPN_WEIGHT_PROFILE.dimensionWeights, revenue_durability: 0.90 },
    };
    const errors = validateWeightProfile(bad);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("sum to");
  });
});

describe("validateSignalInputs", () => {
  it("accepts complete 33-signal set", () => {
    const signals = makeSignalInput();
    expect(validateSignalInputs(signals)).toEqual([]);
  });

  it("reports missing signals", () => {
    const signals = makeSignalInput().slice(0, 30);
    const errors = validateSignalInputs(signals);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("Missing signal");
  });

  it("rejects out-of-range scores", () => {
    const signals = makeSignalInput();
    signals[0].rawScore = 150;
    const errors = validateSignalInputs(signals);
    expect(errors.some((e) => e.includes("out of range"))).toBe(true);
  });
});

// ─── Risk Flags ─────────────────────────────────────────────────────────────

describe("risk flag detection", () => {
  it("triggers HIGH_SPONSOR_CONCENTRATION when top3 dependency is low", () => {
    const input = makeAthleteInput({ top3_sponsor_dependency: 20 });
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    const allFlags = score.dimensions.flatMap((d) => d.flags);
    expect(allFlags.some((f) => f.code === "HIGH_SPONSOR_CONCENTRATION")).toBe(true);
  });

  it("triggers ELIGIBILITY_AT_RISK when NCAA eligibility is low", () => {
    const input = makeAthleteInput({ ncaa_eligibility_status: 25 });
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);

    const allFlags = score.dimensions.flatMap((d) => d.flags);
    expect(allFlags.some((f) => f.code === "ELIGIBILITY_AT_RISK")).toBe(true);
  });

  it("no flags for clean profile", () => {
    const input = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 85])) as Record<SignalId, number>
    );
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    expect(score.totalFlags).toBe(0);
  });
});

// ─── Covenant Engine ────────────────────────────────────────────────────────

describe("generateCovenants", () => {
  it("generates no covenants for a strong score", () => {
    const input = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 90])) as Record<SignalId, number>
    );
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const covenants = generateCovenants(score);

    expect(covenants.length).toBe(0);
  });

  it("generates covenants for a weak score", () => {
    const input = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 35])) as Record<SignalId, number>
    );
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const covenants = generateCovenants(score);

    expect(covenants.length).toBeGreaterThan(0);
    // Should include financial and reporting covenants at minimum
    expect(covenants.some((c) => c.type === "financial")).toBe(true);
    expect(covenants.some((c) => c.type === "reporting")).toBe(true);
  });

  it("includes morality clause when reputation risk flag exists", () => {
    const input = makeAthleteInput({ controversy_exposure_index: 10 });
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const covenants = generateCovenants(score);

    expect(covenants.some((c) => c.description.includes("Morality clause"))).toBe(true);
  });

  it("countTriggeredCovenants matches generateCovenants length", () => {
    const input = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 45])) as Record<SignalId, number>
    );
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const covenants = generateCovenants(score);
    const counts = countTriggeredCovenants(score);

    expect(counts.total).toBe(covenants.length);
    expect(counts.financial + counts.behavioral + counts.eligibility + counts.reporting).toBe(
      counts.total
    );
  });
});

// ─── Stress Testing ─────────────────────────────────────────────────────────

describe("applyShocks", () => {
  it("reduces scores in shocked dimensions", () => {
    const signals = makeSignalInput();
    const shocks = BUILT_IN_SCENARIOS[0].shocks; // injury scenario
    const shocked = applyShocks(signals, shocks, null);

    // injury_availability dimension signals should be lower
    const injurySignal = shocked.find((s) => s.signalId === "position_specific_injury_rate");
    const original = signals.find((s) => s.signalId === "position_specific_injury_rate");
    expect(injurySignal!.rawScore).toBeLessThan(original!.rawScore);
  });

  it("does not affect unshocked dimensions", () => {
    const signals = makeSignalInput();
    const shocks = [{ dimension: "injury_availability" as const, shockPct: -5000, appliesTo: null }];
    const shocked = applyShocks(signals, shocks, null);

    // Revenue durability signals should be unchanged
    const revSig = shocked.find((s) => s.signalId === "contract_tenure_renewal");
    const origRev = signals.find((s) => s.signalId === "contract_tenure_renewal");
    expect(revSig!.rawScore).toBe(origRev!.rawScore);
  });

  it("clamps shocked scores to minimum 0", () => {
    const signals = makeSignalInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 10])) as Record<SignalId, number>
    );
    const shocks = [{ dimension: "injury_availability" as const, shockPct: -9000, appliesTo: null }];
    const shocked = applyShocks(signals, shocks, null);

    const injurySignal = shocked.find((s) => s.signalId === "position_specific_injury_rate");
    expect(injurySignal!.rawScore).toBeGreaterThanOrEqual(0);
  });
});

describe("runStressTest", () => {
  it("produces a result with negative NAV impact", () => {
    const athlete = makeAthleteInput();
    const portfolio = [
      {
        input: athlete,
        valuation: {
          lowCents: 100_000_00,
          midCents: 150_000_00,
          highCents: 200_000_00,
          confidenceInterval: 0.9,
          methodology: "hybrid" as const,
          assumptions: [],
        },
        exposureCents: 150_000_00,
      },
    ];

    const result = runStressTest(
      "spv-001",
      portfolio,
      BUILT_IN_SCENARIOS[0], // injury
      RPN_WEIGHT_PROFILE
    );

    expect(result.portfolioId).toBe("spv-001");
    expect(result.stressedNavCents).toBeLessThan(result.baselineNavCents);
    expect(result.navImpactPct).toBeLessThan(0);
    expect(result.mostImpactedAthletes).toHaveLength(1);
  });

  it("has 6 built-in scenarios", () => {
    expect(BUILT_IN_SCENARIOS).toHaveLength(6);
  });
});

// ─── Memo Generator ─────────────────────────────────────────────────────────

describe("generateMemo", () => {
  it("produces a complete underwriting memo", () => {
    const { memo, explainability } = generateMemo({
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
    });

    expect(memo.id).toBeTruthy();
    expect(memo.athleteId).toBe("athlete-001");
    expect(memo.athlete.firstName).toBe("Test");
    expect(memo.instrumentType).toBe("revenue_participation_note");
    expect(memo.compositeScore.composite).toBeGreaterThan(0);
    expect(memo.valuation.midCents).toBeGreaterThan(0);
    expect(memo.compliance.totalStates).toBe(50);
    expect(memo.riskNarrative).toBeTruthy();
    expect(memo.status).toBe("draft");
    expect(memo.version).toBe(1);
    expect(explainability.signalContributions).toHaveLength(33);
  });

  it("is deterministic except for id and timestamps", () => {
    const input = {
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
      modelVersionId: "test-v1",
    };

    const { memo: a } = generateMemo(input);
    const { memo: b } = generateMemo(input);

    expect(a.compositeScore.composite).toBe(b.compositeScore.composite);
    expect(a.compositeScore.grade).toBe(b.compositeScore.grade);
    expect(a.valuation.midCents).toBe(b.valuation.midCents);
    expect(a.covenantRecommendations.length).toBe(b.covenantRecommendations.length);
    // IDs differ (UUID)
    expect(a.id).not.toBe(b.id);
  });

  it("includes covenants for weak athletes", () => {
    const { memo } = generateMemo({
      athleteInput: makeAthleteInput(
        Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 35])) as Record<SignalId, number>
      ),
      weightProfile: RPN_WEIGHT_PROFILE,
    });

    expect(memo.covenantRecommendations.length).toBeGreaterThan(0);
    expect(memo.compositeScore.grade).not.toBe("A+");
  });
});

describe("estimateValuation", () => {
  it("higher scores produce higher valuations", () => {
    const lowInput = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 30])) as Record<SignalId, number>
    );
    const highInput = makeAthleteInput(
      Object.fromEntries(ALL_SIGNAL_IDS.map((id) => [id, 90])) as Record<SignalId, number>
    );

    const { score: low } = scoreAthlete(lowInput, RPN_WEIGHT_PROFILE);
    const { score: high } = scoreAthlete(highInput, RPN_WEIGHT_PROFILE);

    const lowVal = estimateValuation(low);
    const highVal = estimateValuation(high);

    expect(highVal.midCents).toBeGreaterThan(lowVal.midCents);
    expect(highVal.lowCents).toBeGreaterThan(lowVal.lowCents);
  });

  it("critical flags reduce valuation", () => {
    const input = makeAthleteInput({
      ncaa_eligibility_status: 20,
      top3_sponsor_dependency: 15,
    });
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    expect(score.criticalFlags).toBeGreaterThan(0);

    const val = estimateValuation(score);
    // Valuation with critical flags should be lower than without
    // (we test this indirectly — the penalty is applied)
    expect(val.assumptions.some((a) => a.includes("Critical flag"))).toBe(true);
  });
});

describe("generateRiskNarrative", () => {
  it("mentions composite score and grade", () => {
    const input = makeAthleteInput();
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const covenants = generateCovenants(score);
    const narrative = generateRiskNarrative(score, covenants);

    expect(narrative).toContain(String(score.composite));
    expect(narrative).toContain(score.grade);
  });
});

// ─── Integration: Full Pipeline ─────────────────────────────────────────────

describe("full pipeline integration", () => {
  it("scores → covenants → valuation → memo → stress test roundtrip", () => {
    // 1. Generate memo
    const { memo } = generateMemo({
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
    });

    expect(memo.compositeScore.composite).toBeGreaterThan(0);
    expect(memo.valuation.midCents).toBeGreaterThan(0);

    // 2. Run stress test with memo data
    const portfolio = [{
      input: makeAthleteInput(),
      valuation: memo.valuation,
      exposureCents: memo.valuation.midCents,
    }];

    const result = runStressTest("spv-001", portfolio, BUILT_IN_SCENARIOS[0], RPN_WEIGHT_PROFILE);
    expect(result.stressedNavCents).toBeLessThan(result.baselineNavCents);

    // 3. Verify end-to-end consistency
    expect(result.mostImpactedAthletes[0].athleteId).toBe(memo.athleteId);
  });
});
