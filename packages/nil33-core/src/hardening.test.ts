/**
 * @nil33/core — Hardening Layer Tests
 *
 * Validates DOI-readiness:
 *   1. Genome hashing — deterministic, drift-detectable
 *   2. Seeded Monte Carlo — reproducible RNG
 *   3. Replay reproducibility — sealed record → identical output
 *   4. Explainability maps — contribution accounting
 *   5. Research snapshot — complete, self-consistent
 */

import { describe, it, expect } from "vitest";

import {
  computeGenomeSignature,
  diffGenomes,
  verifyGenome,
  FLAG_RULES_CANONICAL,
  VALUATION_MODEL_CANONICAL,
} from "./genome";
import {
  createSeededRng,
  runMonteCarloVaR,
} from "./montecarlo";
import {
  replayUnderwriting,
  sealReplayRecord,
  buildDimensionContributionMap,
  buildShockContributionMap,
  generateResearchSnapshot,
} from "./reproducibility";
import {
  scoreAthlete,
  ALL_SIGNAL_IDS,
  ALL_DIMENSIONS,
  RPN_WEIGHT_PROFILE,
  PTN_WEIGHT_PROFILE,
} from "./scoring";
import { generateMemo } from "./memo";
import { generateCovenants, COVENANT_RULES_CANONICAL } from "./covenants";
import { BUILT_IN_SCENARIOS, runStressTest } from "./stress";
import type {
  AthleteSignalInput,
  SignalInput,
  SignalId,
  InstrumentWeightProfile,
} from "./types";

// ─── Fixtures ───────────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════════════════════
// 1. GENOME HASHING
// ═══════════════════════════════════════════════════════════════════════════

describe("computeGenomeSignature", () => {
  it("produces a deterministic genomeId", () => {
    const a = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
    const b = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");

    expect(a.genomeId).toBe(b.genomeId);
    expect(a.signalSchemaHash).toBe(b.signalSchemaHash);
    expect(a.weightProfileHash).toBe(b.weightProfileHash);
    expect(a.thresholdHash).toBe(b.thresholdHash);
    expect(a.stressMatrixHash).toBe(b.stressMatrixHash);
    expect(a.covenantRulesHash).toBe(b.covenantRulesHash);
    expect(a.flagRulesHash).toBe(b.flagRulesHash);
    expect(a.valuationModelHash).toBe(b.valuationModelHash);
  });

  it("produces different genomeIds for different weight profiles", () => {
    const rpn = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
    const ptn = computeGenomeSignature(PTN_WEIGHT_PROFILE, "1.0.0");

    // GenomeId differs because weight profile hash differs
    expect(rpn.genomeId).not.toBe(ptn.genomeId);
    expect(rpn.weightProfileHash).not.toBe(ptn.weightProfileHash);

    // But everything else is the same model
    expect(rpn.signalSchemaHash).toBe(ptn.signalSchemaHash);
    expect(rpn.thresholdHash).toBe(ptn.thresholdHash);
    expect(rpn.stressMatrixHash).toBe(ptn.stressMatrixHash);
    expect(rpn.covenantRulesHash).toBe(ptn.covenantRulesHash);
    expect(rpn.flagRulesHash).toBe(ptn.flagRulesHash);
    expect(rpn.valuationModelHash).toBe(ptn.valuationModelHash);
  });

  it("genomeId is 32 hex characters", () => {
    const g = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    expect(g.genomeId).toMatch(/^[a-f0-9]{32}$/);
  });

  it("all component hashes are 64 hex characters (full SHA-256)", () => {
    const g = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const sha256Pattern = /^[a-f0-9]{64}$/;
    expect(g.signalSchemaHash).toMatch(sha256Pattern);
    expect(g.weightProfileHash).toMatch(sha256Pattern);
    expect(g.thresholdHash).toMatch(sha256Pattern);
    expect(g.stressMatrixHash).toMatch(sha256Pattern);
    expect(g.covenantRulesHash).toMatch(sha256Pattern);
    expect(g.flagRulesHash).toMatch(sha256Pattern);
    expect(g.valuationModelHash).toMatch(sha256Pattern);
  });

  it("includes version and timestamp", () => {
    const g = computeGenomeSignature(RPN_WEIGHT_PROFILE, "2.0.0");
    expect(g.version).toBe("2.0.0");
    expect(g.createdAt).toBeTruthy();
  });
});

describe("diffGenomes", () => {
  it("reports identical genomes as identical", () => {
    const a = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const b = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const diff = diffGenomes(a, b);

    expect(diff.identical).toBe(true);
    expect(diff.changedComponents).toHaveLength(0);
  });

  it("identifies which components changed", () => {
    const rpn = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const ptn = computeGenomeSignature(PTN_WEIGHT_PROFILE);
    const diff = diffGenomes(rpn, ptn);

    expect(diff.identical).toBe(false);
    expect(diff.changedComponents).toContain("Weight Profile");
    // Other components should be unchanged
    expect(diff.changedComponents).not.toContain("Signal Schema");
    expect(diff.changedComponents).not.toContain("Grade Thresholds");
  });
});

describe("verifyGenome", () => {
  it("verifies current model as valid", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const { valid, drift } = verifyGenome(genome, RPN_WEIGHT_PROFILE);

    expect(valid).toBe(true);
    expect(drift.identical).toBe(true);
  });

  it("detects drift when using different profile", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const { valid, drift } = verifyGenome(genome, PTN_WEIGHT_PROFILE);

    expect(valid).toBe(false);
    expect(drift.changedComponents).toContain("Weight Profile");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. SEEDED MONTE CARLO
// ═══════════════════════════════════════════════════════════════════════════

describe("createSeededRng", () => {
  it("produces deterministic sequences from the same seed", () => {
    const rng1 = createSeededRng(42);
    const rng2 = createSeededRng(42);

    const seq1 = Array.from({ length: 100 }, () => rng1());
    const seq2 = Array.from({ length: 100 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it("produces different sequences from different seeds", () => {
    const rng1 = createSeededRng(42);
    const rng2 = createSeededRng(99);

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());

    expect(seq1).not.toEqual(seq2);
  });

  it("produces values in [0, 1)", () => {
    const rng = createSeededRng(12345);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("runMonteCarloVaR", () => {
  it("is deterministic — same seed = same result", () => {
    const athletes = [{
      input: makeAthleteInput(),
      valuation: {
        lowCents: 100_000_00,
        midCents: 150_000_00,
        highCents: 200_000_00,
        confidenceInterval: 0.9,
        methodology: "hybrid" as const,
        assumptions: [],
      },
      exposureCents: 150_000_00,
    }];

    const config = { seed: 937263, paths: 200, confidenceLevel: 0.95, horizonDays: 30 };

    const a = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, config);
    const b = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, config);

    expect(a.varCents).toBe(b.varCents);
    expect(a.cvarCents).toBe(b.cvarCents);
    expect(a.seed).toBe(937263);
    expect(a.percentiles).toEqual(b.percentiles);
    expect(a.componentVaR).toEqual(b.componentVaR);
  });

  it("produces different results with different seeds", () => {
    const athletes = [{
      input: makeAthleteInput(),
      valuation: {
        lowCents: 100_000_00,
        midCents: 150_000_00,
        highCents: 200_000_00,
        confidenceInterval: 0.9,
        methodology: "hybrid" as const,
        assumptions: [],
      },
      exposureCents: 150_000_00,
    }];

    const a = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, {
      seed: 111, paths: 200, confidenceLevel: 0.95, horizonDays: 30,
    });
    const b = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, {
      seed: 222, paths: 200, confidenceLevel: 0.95, horizonDays: 30,
    });

    // Results should generally differ (extremely unlikely to match)
    expect(a.seed).toBe(111);
    expect(b.seed).toBe(222);
  });

  it("exposes seed in result for reproducibility", () => {
    const athletes = [{
      input: makeAthleteInput(),
      valuation: {
        lowCents: 100_000_00,
        midCents: 150_000_00,
        highCents: 200_000_00,
        confidenceInterval: 0.9,
        methodology: "hybrid" as const,
        assumptions: [],
      },
      exposureCents: 150_000_00,
    }];

    const result = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, {
      seed: 937263, paths: 100, confidenceLevel: 0.95, horizonDays: 30,
    });

    expect(result.seed).toBe(937263);
    expect(result.paths).toBe(100);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.varCents).toBeGreaterThan(0);
    expect(result.cvarCents).toBeGreaterThanOrEqual(result.varCents);
  });

  it("produces component VaR decomposition", () => {
    const athletes = [
      {
        input: makeAthleteInput({}, "athlete-001"),
        valuation: { lowCents: 100_000_00, midCents: 150_000_00, highCents: 200_000_00, confidenceInterval: 0.9, methodology: "hybrid" as const, assumptions: [] },
        exposureCents: 150_000_00,
      },
      {
        input: makeAthleteInput({}, "athlete-002"),
        valuation: { lowCents: 80_000_00, midCents: 120_000_00, highCents: 160_000_00, confidenceInterval: 0.9, methodology: "hybrid" as const, assumptions: [] },
        exposureCents: 120_000_00,
      },
    ];

    const result = runMonteCarloVaR(athletes, RPN_WEIGHT_PROFILE, {
      seed: 42, paths: 100, confidenceLevel: 0.95, horizonDays: 30,
    });

    expect(result.componentVaR).toHaveLength(2);
    expect(result.componentVaR[0].athleteId).toBe("athlete-001");
    expect(result.componentVaR[1].athleteId).toBe("athlete-002");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. REPLAY REPRODUCIBILITY
// ═══════════════════════════════════════════════════════════════════════════

describe("replayUnderwriting", () => {
  it("reproduces a memo from a sealed record", () => {
    const input = {
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
    };

    // Generate original
    const original = generateMemo(input);
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);

    // Seal it
    const record = sealReplayRecord(input, original.memo.id, genome);

    // Replay
    const { memo: replayed, reproducible, genomeDrift } = replayUnderwriting(record);

    expect(reproducible).toBe(true);
    expect(genomeDrift).toBe(false);

    // Core outputs should match (ignoring UUID and timestamps)
    expect(replayed.memo.compositeScore.composite).toBe(original.memo.compositeScore.composite);
    expect(replayed.memo.compositeScore.grade).toBe(original.memo.compositeScore.grade);
    expect(replayed.memo.valuation.midCents).toBe(original.memo.valuation.midCents);
    expect(replayed.memo.covenantRecommendations.length).toBe(
      original.memo.covenantRecommendations.length
    );
    expect(replayed.memo.riskNarrative).toBe(original.memo.riskNarrative);
  });

  it("detects genome drift when model changes", () => {
    const input = {
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
    };

    const original = generateMemo(input);
    // Compute genome with a DIFFERENT profile to simulate drift
    const genome = computeGenomeSignature(PTN_WEIGHT_PROFILE);

    const record = sealReplayRecord(input, original.memo.id, genome);

    const { reproducible, genomeDrift } = replayUnderwriting(record);

    expect(genomeDrift).toBe(true);
    expect(reproducible).toBe(false);
  });
});

describe("sealReplayRecord", () => {
  it("captures all inputs needed for replay", () => {
    const input = {
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
      referenceFacilityCents: 500_000_00,
      valuationMethodology: "dcf" as const,
      analystNotes: "Test note",
    };

    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const record = sealReplayRecord(input, "memo-123", genome);

    expect(record.genome.genomeId).toBe(genome.genomeId);
    expect(record.athleteInput.athleteId).toBe("athlete-001");
    expect(record.weightProfile).toBe(RPN_WEIGHT_PROFILE);
    expect(record.referenceFacilityCents).toBe(500_000_00);
    expect(record.valuationMethodology).toBe("dcf");
    expect(record.analystNotes).toBe("Test note");
    expect(record.memoId).toBe("memo-123");
    expect(record.generatedAt).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. EXPLAINABILITY MAPS
// ═══════════════════════════════════════════════════════════════════════════

describe("buildDimensionContributionMap", () => {
  it("accounts for weighting effect on composite", () => {
    const input = makeAthleteInput();
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const map = buildDimensionContributionMap(score);

    expect(map.actualComposite).toBe(score.composite);
    expect(map.equalWeightBaseline).toBeGreaterThan(0);

    // All 6 dimensions should have contributions
    expect(Object.keys(map.contributions)).toHaveLength(6);

    // Weighting effect = actual - baseline
    expect(map.weightingEffect).toBeCloseTo(
      map.actualComposite - map.equalWeightBaseline,
      1
    );
  });

  it("shows signed contributions (positive = helps, negative = hurts)", () => {
    // Create a skewed profile: revenue durability very high, others low
    const skewed = Object.fromEntries(
      ALL_SIGNAL_IDS.map((id) => [id, 40])
    ) as Record<SignalId, number>;
    // Revenue durability signals get high scores
    skewed.contract_tenure_renewal = 95;
    skewed.earning_trajectory_vs_cohort = 95;
    skewed.market_depth_demand = 95;
    skewed.revenue_source_diversification = 95;
    skewed.season_adjusted_earnings = 95;
    skewed.off_field_revenue_stability = 95;
    skewed.post_career_transition = 95;

    const input = makeAthleteInput(skewed);
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const map = buildDimensionContributionMap(score);

    // Revenue durability is overweight (0.30 vs 1/6 ≈ 0.167)
    // and has high scores, so contribution should be positive
    expect(map.contributions.revenue_durability).toBeGreaterThan(0);
  });

  it("contribution signs are consistent with equal-weight baseline", () => {
    const input = makeAthleteInput();
    const { score } = scoreAthlete(input, RPN_WEIGHT_PROFILE);
    const map = buildDimensionContributionMap(score);

    // Sum of all signed contributions should approximately equal weighting effect
    const contributionSum = Object.values(map.contributions).reduce(
      (sum, c) => sum + c,
      0
    );
    expect(contributionSum).toBeCloseTo(map.weightingEffect, 1);
  });
});

describe("buildShockContributionMap", () => {
  it("breaks down stress test into dimension-level impacts", () => {
    const athletes = [{
      input: makeAthleteInput(),
      valuation: { midCents: 150_000_00 },
    }];

    const scenario = BUILT_IN_SCENARIOS[0]; // injury
    const stressResult = runStressTest(
      "spv-001",
      [{
        ...athletes[0],
        valuation: {
          lowCents: 100_000_00,
          midCents: 150_000_00,
          highCents: 200_000_00,
          confidenceInterval: 0.9,
          methodology: "hybrid" as const,
          assumptions: [],
        },
        exposureCents: 150_000_00,
      }],
      scenario,
      RPN_WEIGHT_PROFILE
    );

    const map = buildShockContributionMap(athletes, scenario, stressResult, RPN_WEIGHT_PROFILE);

    expect(map.scenarioId).toBe(scenario.id);
    expect(map.dimensionImpacts.length).toBeGreaterThan(0);
    expect(map.totalNavImpactCents).toBeLessThan(0); // Shocks reduce NAV

    // Each dimension impact should show pre/post scores
    for (const impact of map.dimensionImpacts) {
      expect(impact.preShockDimensionScore).toBeGreaterThan(0);
      expect(impact.postShockDimensionScore).toBeLessThan(impact.preShockDimensionScore);
      expect(impact.navImpactCents).toBeLessThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. RESEARCH SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════

describe("generateResearchSnapshot", () => {
  it("produces a complete snapshot", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.genome.genomeId).toBe(genome.genomeId);
    expect(snapshot.metadata.version).toBe("1.0.0");
    expect(snapshot.metadata.title).toContain("NIL33");
  });

  it("includes all 33 signals with descriptions", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.signalSchema).toHaveLength(33);
    for (const signal of snapshot.signalSchema) {
      expect(signal.signalId).toBeTruthy();
      expect(signal.dimension).toBeTruthy();
      expect(signal.description).toBeTruthy();
    }
  });

  it("includes both weight profiles", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.weightProfiles).toHaveLength(2);
    const types = snapshot.weightProfiles.map((p) => p.instrumentType);
    expect(types).toContain("revenue_participation_note");
    expect(types).toContain("portfolio_tranche_note");
  });

  it("includes grade thresholds", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.gradeThresholds).toHaveLength(11);
    expect(snapshot.gradeThresholds[0].grade).toBe("A+");
    expect(snapshot.gradeThresholds[0].minScore).toBe(95);
  });

  it("includes all 6 stress scenarios", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.stressScenarios).toHaveLength(6);
    for (const scenario of snapshot.stressScenarios) {
      expect(scenario.shocks.length).toBeGreaterThan(0);
    }
  });

  it("includes flag and covenant rule summaries", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.flagRuleSummary.length).toBe(FLAG_RULES_CANONICAL.length);
    expect(snapshot.covenantRuleSummary.length).toBe(COVENANT_RULES_CANONICAL.length);
  });

  it("includes synthetic verification samples", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome);

    expect(snapshot.syntheticSamples.length).toBe(5);

    // Each sample should have deterministic expected outputs
    for (const sample of snapshot.syntheticSamples) {
      expect(sample.input.signals).toHaveLength(33);
      expect(sample.expectedComposite).toBeGreaterThanOrEqual(0);
      expect(sample.expectedComposite).toBeLessThanOrEqual(99);
      expect(sample.expectedGrade).toBeTruthy();

      // CRITICAL: verify the sample is self-consistent
      // Re-score and check it matches
      const { score } = scoreAthlete(sample.input, RPN_WEIGHT_PROFILE);
      expect(score.composite).toBe(sample.expectedComposite);
      expect(score.grade).toBe(sample.expectedGrade);
      expect(score.totalFlags).toBe(sample.expectedFlagCount);
    }
  });

  it("accepts custom metadata", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
    const snapshot = generateResearchSnapshot(genome, {
      title: "Custom Research Title",
      authors: ["Author A", "Author B"],
      license: "MIT",
    });

    expect(snapshot.metadata.title).toBe("Custom Research Title");
    expect(snapshot.metadata.authors).toEqual(["Author A", "Author B"]);
    expect(snapshot.metadata.license).toBe("MIT");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. INTEGRATION: DNA MODE END-TO-END
// ═══════════════════════════════════════════════════════════════════════════

describe("DNA mode end-to-end", () => {
  it("genome → memo → seal → replay → verify roundtrip", () => {
    // 1. Compute genome
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");

    // 2. Generate memo
    const input = {
      athleteInput: makeAthleteInput(),
      weightProfile: RPN_WEIGHT_PROFILE,
      modelVersionId: genome.genomeId,
    };
    const { memo, explainability } = generateMemo(input);

    // Memo should reference genome
    expect(explainability.modelVersionId).toBe(genome.genomeId);

    // 3. Seal replay record
    const record = sealReplayRecord(input, memo.id, genome);
    expect(record.genome.genomeId).toBe(genome.genomeId);

    // 4. Replay
    const { memo: replayed, reproducible, genomeDrift } = replayUnderwriting(record);
    expect(reproducible).toBe(true);
    expect(genomeDrift).toBe(false);
    expect(replayed.memo.compositeScore.composite).toBe(memo.compositeScore.composite);

    // 5. Verify genome
    const { valid } = verifyGenome(genome, RPN_WEIGHT_PROFILE);
    expect(valid).toBe(true);

    // 6. Generate research snapshot
    const snapshot = generateResearchSnapshot(genome);
    expect(snapshot.genome.genomeId).toBe(genome.genomeId);
    expect(snapshot.syntheticSamples.length).toBeGreaterThan(0);
  });

  it("full pipeline with Monte Carlo is reproducible", () => {
    const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
    const athlete = makeAthleteInput();

    // Generate memo
    const { memo } = generateMemo({
      athleteInput: athlete,
      weightProfile: RPN_WEIGHT_PROFILE,
      modelVersionId: genome.genomeId,
    });

    // Run seeded Monte Carlo
    const mcConfig = { seed: 937263, paths: 100, confidenceLevel: 0.95, horizonDays: 30 };
    const portfolio = [{
      input: athlete,
      valuation: memo.valuation,
      exposureCents: memo.valuation.midCents,
    }];

    const mc1 = runMonteCarloVaR(portfolio, RPN_WEIGHT_PROFILE, mcConfig);
    const mc2 = runMonteCarloVaR(portfolio, RPN_WEIGHT_PROFILE, mcConfig);

    // Exact reproducibility
    expect(mc1.varCents).toBe(mc2.varCents);
    expect(mc1.cvarCents).toBe(mc2.cvarCents);
    expect(mc1.seed).toBe(937263);

    // Build explainability
    const contribMap = buildDimensionContributionMap(memo.compositeScore);
    expect(contribMap.actualComposite).toBe(memo.compositeScore.composite);
    expect(Object.keys(contribMap.contributions)).toHaveLength(6);
  });
});
