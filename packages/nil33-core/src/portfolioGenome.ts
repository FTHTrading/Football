/**
 * @nil33/core — Portfolio Genome Metrics
 *
 * Aggregates genome identity data across a portfolio of instruments
 * to quantify model homogeneity, drift exposure, and mutation risk.
 *
 * Pure functions. No database dependencies. No side effects.
 *
 * Usage:
 *   const metrics = aggregatePortfolioGenomeMetrics(entries);
 *   // → genome distribution, drift exposure, weighted stress impact
 */

import type { GenomeSignature } from "./types";
import { type GenomeDiff, diffGenomes } from "./genome";

// ─── Input / Output Types ───────────────────────────────────────────────────

/**
 * A single portfolio entry with genome identity attached.
 * Mirrors what a database query would return, but contains no ORM types.
 */
export interface PortfolioGenomeEntry {
  /** Unique identifier for the instrument/position */
  instrumentId: string;
  /** Display label */
  instrumentName: string;
  /** Exposure in cents (notional or NAV) */
  exposureCents: number;
  /** The genome that was active when this position was created */
  genome: GenomeSignature;
}

/**
 * Per-genome cluster: all positions sharing the same genomeId.
 */
export interface GenomeCluster {
  genomeId: string;
  genomeVersion: string;
  instrumentCount: number;
  totalExposureCents: number;
  /** Fraction of total portfolio exposure (0–1) */
  weightPct: number;
  instrumentIds: string[];
}

/**
 * Pairwise drift between two genome versions in the portfolio.
 */
export interface GenomeDriftEdge {
  genomeIdA: string;
  genomeIdB: string;
  diff: GenomeDiff;
  /** Sum of exposure across both clusters (dominance measure) */
  combinedExposureCents: number;
}

/**
 * Full portfolio genome metrics output.
 */
export interface PortfolioGenomeMetrics {
  /** Total positions analyzed */
  totalPositions: number;
  /** Total exposure across all positions */
  totalExposureCents: number;
  /** Distinct genome versions in the portfolio */
  distinctGenomes: number;
  /** Per-genome cluster breakdown */
  clusters: GenomeCluster[];
  /** Pairwise drift between every pair of distinct genomes */
  driftEdges: GenomeDriftEdge[];
  /**
   * Homogeneity score: 1.0 = all positions use the same genome,
   * 0.0 = each position uses a unique genome.
   * Computed as Herfindahl–Hirschman Index of genome weights.
   */
  homogeneityIndex: number;
  /**
   * Mutation risk indicator (0–1).
   * High when many distinct genomes coexist with large component diffs.
   * 0 when the portfolio is genome-homogeneous.
   */
  mutationRisk: number;
  /** The genome with the largest exposure weight (incumbent model) */
  dominantGenomeId: string | null;
  /** Fraction of portfolio under the dominant genome */
  dominantGenomeWeight: number;
}

// ─── Core Logic ─────────────────────────────────────────────────────────────

/**
 * Aggregate genome identity metrics across a portfolio.
 *
 * @param entries — Array of portfolio positions with genome signatures
 * @returns PortfolioGenomeMetrics — comprehensive genome distribution analysis
 */
export function aggregatePortfolioGenomeMetrics(
  entries: PortfolioGenomeEntry[]
): PortfolioGenomeMetrics {
  if (entries.length === 0) {
    return {
      totalPositions: 0,
      totalExposureCents: 0,
      distinctGenomes: 0,
      clusters: [],
      driftEdges: [],
      homogeneityIndex: 1.0,
      mutationRisk: 0,
      dominantGenomeId: null,
      dominantGenomeWeight: 0,
    };
  }

  const totalExposureCents = entries.reduce((sum, e) => sum + e.exposureCents, 0);

  // ── 1. Build genome clusters ──────────────────────────────────────────
  const clusterMap = new Map<
    string,
    {
      genome: GenomeSignature;
      instrumentIds: string[];
      totalExposureCents: number;
    }
  >();

  for (const entry of entries) {
    const existing = clusterMap.get(entry.genome.genomeId);
    if (existing) {
      existing.instrumentIds.push(entry.instrumentId);
      existing.totalExposureCents += entry.exposureCents;
    } else {
      clusterMap.set(entry.genome.genomeId, {
        genome: entry.genome,
        instrumentIds: [entry.instrumentId],
        totalExposureCents: entry.exposureCents,
      });
    }
  }

  const clusters: GenomeCluster[] = Array.from(clusterMap.entries())
    .map(([genomeId, data]) => ({
      genomeId,
      genomeVersion: data.genome.version,
      instrumentCount: data.instrumentIds.length,
      totalExposureCents: data.totalExposureCents,
      weightPct: totalExposureCents > 0 ? data.totalExposureCents / totalExposureCents : 0,
      instrumentIds: data.instrumentIds,
    }))
    .sort((a, b) => b.totalExposureCents - a.totalExposureCents);

  // ── 2. Compute pairwise drift edges ───────────────────────────────────
  const genomeEntries = Array.from(clusterMap.entries());
  const driftEdges: GenomeDriftEdge[] = [];

  for (let i = 0; i < genomeEntries.length; i++) {
    for (let j = i + 1; j < genomeEntries.length; j++) {
      const [idA, dataA] = genomeEntries[i];
      const [idB, dataB] = genomeEntries[j];
      const diff = diffGenomes(dataA.genome, dataB.genome);
      driftEdges.push({
        genomeIdA: idA,
        genomeIdB: idB,
        diff,
        combinedExposureCents: dataA.totalExposureCents + dataB.totalExposureCents,
      });
    }
  }

  // ── 3. Compute homogeneity (HHI of genome weights) ───────────────────
  // HHI = sum of squared weights. 1.0 = perfect concentration (one genome).
  const homogeneityIndex = clusters.reduce((sum, c) => sum + c.weightPct * c.weightPct, 0);

  // ── 4. Dominant genome ────────────────────────────────────────────────
  const dominant = clusters[0] ?? null;

  // ── 5. Mutation risk ──────────────────────────────────────────────────
  // Factors: (a) number of distinct genomes, (b) average component drift
  // per pair, (c) how fragmented the exposure is.
  // Scale: 0 = mono-genome, 1 = fully fragmented with max drift.
  const distinctGenomes = clusters.length;

  let mutationRisk = 0;
  if (distinctGenomes > 1) {
    // Average fraction of changed components across all pairs (max 7 components)
    const totalChangedComponents = driftEdges.reduce(
      (sum, edge) => sum + edge.diff.changedComponents.length,
      0
    );
    const maxPossibleChanges = driftEdges.length * 7;
    const avgDriftIntensity =
      maxPossibleChanges > 0 ? totalChangedComponents / maxPossibleChanges : 0;

    // Fragmentation: 1 - HHI (0 = concentrated, 1 = dispersed)
    const fragmentation = 1 - homogeneityIndex;

    // Combine: both dimensions matter equally
    mutationRisk = Math.min(1, (avgDriftIntensity + fragmentation) / 2);
  }

  return {
    totalPositions: entries.length,
    totalExposureCents,
    distinctGenomes,
    clusters,
    driftEdges,
    homogeneityIndex,
    mutationRisk,
    dominantGenomeId: dominant?.genomeId ?? null,
    dominantGenomeWeight: dominant?.weightPct ?? 0,
  };
}
