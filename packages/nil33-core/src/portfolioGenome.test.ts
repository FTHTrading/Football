/**
 * @nil33/core — Portfolio Genome Metrics Tests
 *
 * Validates aggregatePortfolioGenomeMetrics():
 *   1. Empty portfolio → safe defaults
 *   2. Single-genome portfolio → HHI = 1, mutationRisk = 0
 *   3. Multi-genome portfolio → drift edges, fragmentation
 *   4. Exposure weighting correctness
 *   5. Mutation risk scales with drift intensity
 */

import { describe, it, expect } from "vitest";

import {
  aggregatePortfolioGenomeMetrics,
  type PortfolioGenomeEntry,
} from "./portfolioGenome";
import { computeGenomeSignature } from "./genome";
import { RPN_WEIGHT_PROFILE, PTN_WEIGHT_PROFILE } from "./scoring";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeEntry(
  id: string,
  name: string,
  exposureCents: number,
  genome: ReturnType<typeof computeGenomeSignature>
): PortfolioGenomeEntry {
  return { instrumentId: id, instrumentName: name, exposureCents, genome };
}

// Two distinct genomes (different weight profiles → different genomeIds)
const GENOME_RPN = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
const GENOME_PTN = computeGenomeSignature(PTN_WEIGHT_PROFILE, "1.0.0");

// Confirm they actually differ (sanity check)
if (GENOME_RPN.genomeId === GENOME_PTN.genomeId) {
  throw new Error("Test setup error: RPN and PTN genomes should differ");
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("aggregatePortfolioGenomeMetrics", () => {
  // ── Empty portfolio ─────────────────────────────────────────────────────

  it("returns safe defaults for empty portfolio", () => {
    const result = aggregatePortfolioGenomeMetrics([]);
    expect(result.totalPositions).toBe(0);
    expect(result.totalExposureCents).toBe(0);
    expect(result.distinctGenomes).toBe(0);
    expect(result.clusters).toHaveLength(0);
    expect(result.driftEdges).toHaveLength(0);
    expect(result.homogeneityIndex).toBe(1.0);
    expect(result.mutationRisk).toBe(0);
    expect(result.dominantGenomeId).toBeNull();
    expect(result.dominantGenomeWeight).toBe(0);
  });

  // ── Single-genome portfolio (mono-model) ────────────────────────────────

  it("produces HHI = 1 and zero mutation risk for single-genome portfolio", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("inst-1", "Alpha Note", 500_000_00, GENOME_RPN),
      makeEntry("inst-2", "Beta Note", 300_000_00, GENOME_RPN),
      makeEntry("inst-3", "Gamma Note", 200_000_00, GENOME_RPN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);

    expect(result.totalPositions).toBe(3);
    expect(result.totalExposureCents).toBe(1_000_000_00);
    expect(result.distinctGenomes).toBe(1);
    expect(result.clusters).toHaveLength(1);
    expect(result.clusters[0].genomeId).toBe(GENOME_RPN.genomeId);
    expect(result.clusters[0].instrumentCount).toBe(3);
    expect(result.clusters[0].weightPct).toBeCloseTo(1.0);
    expect(result.driftEdges).toHaveLength(0); // no pairs to compare
    expect(result.homogeneityIndex).toBeCloseTo(1.0);
    expect(result.mutationRisk).toBe(0);
    expect(result.dominantGenomeId).toBe(GENOME_RPN.genomeId);
    expect(result.dominantGenomeWeight).toBeCloseTo(1.0);
  });

  // ── Two-genome portfolio ────────────────────────────────────────────────

  it("detects drift between two distinct genomes", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("inst-1", "RPN Note 1", 600_000_00, GENOME_RPN),
      makeEntry("inst-2", "RPN Note 2", 200_000_00, GENOME_RPN),
      makeEntry("inst-3", "PTN Note 1", 200_000_00, GENOME_PTN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);

    expect(result.totalPositions).toBe(3);
    expect(result.distinctGenomes).toBe(2);
    expect(result.clusters).toHaveLength(2);

    // Dominant should be RPN (80% weight)
    expect(result.dominantGenomeId).toBe(GENOME_RPN.genomeId);
    expect(result.dominantGenomeWeight).toBeCloseTo(0.8);

    // Exactly 1 drift edge (2 choose 2 = 1)
    expect(result.driftEdges).toHaveLength(1);
    expect(result.driftEdges[0].diff.identical).toBe(false);
    expect(result.driftEdges[0].diff.changedComponents.length).toBeGreaterThan(0);

    // HHI < 1 (not mono-genome)
    expect(result.homogeneityIndex).toBeLessThan(1.0);
    // HHI = 0.8^2 + 0.2^2 = 0.64 + 0.04 = 0.68
    expect(result.homogeneityIndex).toBeCloseTo(0.68);

    // Mutation risk > 0 (drift exists)
    expect(result.mutationRisk).toBeGreaterThan(0);
    expect(result.mutationRisk).toBeLessThanOrEqual(1);
  });

  // ── Cluster aggregation ─────────────────────────────────────────────────

  it("correctly aggregates exposure into clusters", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("a", "A", 100_00, GENOME_RPN),
      makeEntry("b", "B", 200_00, GENOME_RPN),
      makeEntry("c", "C", 300_00, GENOME_PTN),
      makeEntry("d", "D", 400_00, GENOME_PTN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);

    // PTN cluster should be larger (700 vs 300)
    expect(result.clusters[0].genomeId).toBe(GENOME_PTN.genomeId);
    expect(result.clusters[0].totalExposureCents).toBe(700_00);
    expect(result.clusters[0].instrumentCount).toBe(2);
    expect(result.clusters[0].instrumentIds).toContain("c");
    expect(result.clusters[0].instrumentIds).toContain("d");

    expect(result.clusters[1].genomeId).toBe(GENOME_RPN.genomeId);
    expect(result.clusters[1].totalExposureCents).toBe(300_00);
    expect(result.clusters[1].instrumentCount).toBe(2);
  });

  // ── Equal split → maximum fragmentation for 2 genomes ──────────────────

  it("computes correct HHI for equal 50/50 split", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("a", "A", 500_00, GENOME_RPN),
      makeEntry("b", "B", 500_00, GENOME_PTN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);

    // HHI = 0.5^2 + 0.5^2 = 0.5
    expect(result.homogeneityIndex).toBeCloseTo(0.5);
    expect(result.mutationRisk).toBeGreaterThan(0);
  });

  // ── Single position ────────────────────────────────────────────────────

  it("handles single-position portfolio", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("solo", "Solo Note", 1_000_000_00, GENOME_RPN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);

    expect(result.totalPositions).toBe(1);
    expect(result.distinctGenomes).toBe(1);
    expect(result.homogeneityIndex).toBeCloseTo(1.0);
    expect(result.mutationRisk).toBe(0);
    expect(result.dominantGenomeId).toBe(GENOME_RPN.genomeId);
    expect(result.dominantGenomeWeight).toBeCloseTo(1.0);
  });

  // ── Drift edge details ─────────────────────────────────────────────────

  it("provides actionable drift details", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("a", "A", 500_00, GENOME_RPN),
      makeEntry("b", "B", 500_00, GENOME_PTN),
    ];

    const result = aggregatePortfolioGenomeMetrics(entries);
    const edge = result.driftEdges[0];

    // Weight Profile must differ (different weight profiles used)
    expect(edge.diff.changedComponents).toContain("Weight Profile");

    // Each detail entry should have component name and both hashes
    for (const detail of edge.diff.details) {
      expect(detail.component).toBeTruthy();
      expect(detail.hashA).toBeTruthy();
      expect(detail.hashB).toBeTruthy();
      expect(detail.hashA).not.toBe(detail.hashB);
    }
  });

  // ── Determinism ─────────────────────────────────────────────────────────

  it("produces identical results on repeated calls", () => {
    const entries: PortfolioGenomeEntry[] = [
      makeEntry("a", "A", 100_00, GENOME_RPN),
      makeEntry("b", "B", 200_00, GENOME_PTN),
    ];

    const r1 = aggregatePortfolioGenomeMetrics(entries);
    const r2 = aggregatePortfolioGenomeMetrics(entries);

    expect(r1.homogeneityIndex).toBe(r2.homogeneityIndex);
    expect(r1.mutationRisk).toBe(r2.mutationRisk);
    expect(r1.dominantGenomeId).toBe(r2.dominantGenomeId);
    expect(r1.distinctGenomes).toBe(r2.distinctGenomes);
    expect(r1.driftEdges.length).toBe(r2.driftEdges.length);
  });
});
