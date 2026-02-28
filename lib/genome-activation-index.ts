/**
 * ══════════════════════════════════════════════════════════════
 *  GENOME ACTIVATION INDEX (GAI)
 *  The core primitive of Under Center.
 *
 *  Every page, every visualization, every decision in the
 *  platform resolves to this single computation.
 *
 *  Four coefficients fuse into one number:
 *    1. Base Genome Score        — raw trait expression
 *    2. Live Activation Mult.    — in-game flare intensity
 *    3. Seasonal Growth Delta    — trajectory over time
 *    4. Institutional Fit Coeff. — program alignment
 *
 *  GAI  =  Base × Activation × (1 + Growth) × Fit
 *  Normalized to 0–99 scale.
 * ══════════════════════════════════════════════════════════════
 */

import type { AthleteMetrics } from "./store";

/* ── Gene Definitions ─────────────────────────────────────── */
export interface GeneProfile {
  id: string;
  label: string;
  shortLabel: string;
  value: number;       // normalized 0-100
  rawValue: number;    // original metric value
  color: string;
  tier: "elite" | "strong" | "developing" | "raw";
}

export const GENE_COLORS = {
  "VEL-α": "#00C2FF",
  "ACC-γ": "#00FF88",
  "REL-β": "#A855F7",
  "MECH-δ": "#F59E0B",
  "DEC-ε": "#EC4899",
  "SPR-ζ": "#06B6D4",
} as const;

export type GeneId = keyof typeof GENE_COLORS;

function tier(val: number): GeneProfile["tier"] {
  if (val >= 90) return "elite";
  if (val >= 75) return "strong";
  if (val >= 55) return "developing";
  return "raw";
}

/* ── Extract 6 Gene Profiles from raw metrics ─────────────── */
export function extractGenes(m: AthleteMetrics): GeneProfile[] {
  const velNorm = Math.round(((m.velocity - 40) / 35) * 100);
  const relNorm = Math.round(((0.55 - m.releaseTime) / 0.25) * 100);
  const sprNorm = Math.round(((m.spinRate - 400) / 400) * 100);

  return [
    { id: "VEL-α", label: "Velocity",       shortLabel: "VEL", value: velNorm,            rawValue: m.velocity,      color: GENE_COLORS["VEL-α"], tier: tier(velNorm) },
    { id: "ACC-γ", label: "Accuracy",        shortLabel: "ACC", value: m.accuracy,         rawValue: m.accuracy,      color: GENE_COLORS["ACC-γ"], tier: tier(m.accuracy) },
    { id: "REL-β", label: "Release Speed",   shortLabel: "REL", value: relNorm,            rawValue: m.releaseTime,   color: GENE_COLORS["REL-β"], tier: tier(relNorm) },
    { id: "MECH-δ", label: "Mechanics",      shortLabel: "MECH", value: m.mechanics,       rawValue: m.mechanics,     color: GENE_COLORS["MECH-δ"], tier: tier(m.mechanics) },
    { id: "DEC-ε", label: "Decision Speed",  shortLabel: "DEC", value: m.decisionSpeed,    rawValue: m.decisionSpeed, color: GENE_COLORS["DEC-ε"], tier: tier(m.decisionSpeed) },
    { id: "SPR-ζ", label: "Spin Rate",       shortLabel: "SPR", value: sprNorm,            rawValue: m.spinRate,      color: GENE_COLORS["SPR-ζ"], tier: tier(sprNorm) },
  ];
}

/* ── 1. BASE GENOME SCORE ─────────────────────────────────── */
const GENE_WEIGHTS = {
  "VEL-α": 0.20,
  "ACC-γ": 0.20,
  "REL-β": 0.15,
  "MECH-δ": 0.20,
  "DEC-ε": 0.15,
  "SPR-ζ": 0.10,
};

export function baseGenomeScore(m: AthleteMetrics): number {
  const genes = extractGenes(m);
  return Math.round(
    genes.reduce((sum, g) => {
      const w = GENE_WEIGHTS[g.id as GeneId] ?? 0;
      return sum + g.value * w;
    }, 0)
  );
}

/* ── 2. LIVE ACTIVATION MULTIPLIER ────────────────────────── */
/**
 * Simulates how "activated" a QB's genome is during live play.
 * Returns a multiplier between 0.80 (cold) and 1.25 (on fire).
 *
 * In production this would consume real-time game event data.
 * For now we generate deterministic simulation based on athlete
 * identity + a time-seed.
 */
export interface ActivationSnapshot {
  multiplier: number;             // 0.80 – 1.25
  geneFlares: Record<string, number>; // per-gene activation 0-100
  status: "dormant" | "warming" | "activated" | "peak" | "cooling";
  peakGene: string;
}

export function computeActivation(
  m: AthleteMetrics,
  /** 0-1 progress through a game or session */
  progressSeed: number = 0.5,
): ActivationSnapshot {
  const genes = extractGenes(m);
  const flares: Record<string, number> = {};

  let maxFlare = 0;
  let peakGene = genes[0].id;

  for (const g of genes) {
    // Simulate activation curve: ramps up mid-game, dips late
    const curve = Math.sin(progressSeed * Math.PI) * 0.3;
    const noise = Math.sin(progressSeed * 7 + g.value * 0.13) * 0.15;
    const flare = Math.max(0, Math.min(100, g.value * (0.7 + curve + noise)));
    flares[g.id] = Math.round(flare);
    if (flare > maxFlare) {
      maxFlare = flare;
      peakGene = g.id;
    }
  }

  const avgFlare = Object.values(flares).reduce((a, b) => a + b, 0) / 6;
  const multiplier = parseFloat((0.80 + (avgFlare / 100) * 0.45).toFixed(3));

  const status: ActivationSnapshot["status"] =
    avgFlare >= 85 ? "peak" :
    avgFlare >= 70 ? "activated" :
    avgFlare >= 50 ? "warming" :
    avgFlare >= 30 ? "cooling" :
    "dormant";

  return { multiplier, geneFlares: flares, status, peakGene };
}

/* ── 3. SEASONAL GROWTH DELTA ─────────────────────────────── */
/**
 * Measures trajectory — how much a QB's genome has evolved
 * over time. Returns a delta between -0.15 and +0.25.
 *
 * Positive = improving. Negative = regressing.
 * In production this would diff historical snapshots.
 */
export interface GrowthProfile {
  delta: number;                   // -0.15 to +0.25
  geneDeltas: Record<string, number>; // per-gene change
  trajectory: "ascending" | "steady" | "plateauing" | "declining";
  weekSnapshots: number[];         // 12-week genome scores
}

export function computeGrowth(
  m: AthleteMetrics,
  /** Simulated weeks of data */
  weeks: number = 12,
): GrowthProfile {
  const base = baseGenomeScore(m);
  const genes = extractGenes(m);
  const geneDeltas: Record<string, number> = {};
  const snapshots: number[] = [];

  for (const g of genes) {
    // Simulate improvement curve: better athletes improve slower (ceiling effect)
    const ceiling = 100 - g.value;
    const growth = ceiling * 0.04 * (1 + Math.sin(g.value * 0.07) * 0.3);
    geneDeltas[g.id] = Math.round(growth * 10) / 10;
  }

  // Generate weekly snapshots showing progression
  for (let w = 0; w < weeks; w++) {
    const progress = w / (weeks - 1);
    const weekScore = Math.round(
      base * (0.92 + progress * 0.12) + Math.sin(w * 1.3) * 2
    );
    snapshots.push(Math.min(99, Math.max(1, weekScore)));
  }

  const earlyAvg = snapshots.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const lateAvg = snapshots.slice(-4).reduce((a, b) => a + b, 0) / 4;
  const delta = parseFloat(((lateAvg - earlyAvg) / earlyAvg).toFixed(3));

  const trajectory: GrowthProfile["trajectory"] =
    delta >= 0.08 ? "ascending" :
    delta >= 0.02 ? "steady" :
    delta >= -0.02 ? "plateauing" :
    "declining";

  return { delta, geneDeltas, trajectory, weekSnapshots: snapshots };
}

/* ── 4. INSTITUTIONAL FIT COEFFICIENT ─────────────────────── */
/**
 * How well a QB's genome aligns with a program's scheme.
 * Different programs weight different genes.
 * Returns 0.70 – 1.15.
 */
export interface ProgramProfile {
  name: string;
  conference: string;
  weights: Record<string, number>;
  scheme: string;
}

export const PROGRAM_PROFILES: ProgramProfile[] = [
  { name: "Alabama",     conference: "SEC",         scheme: "Pro-Style RPO",       weights: { "VEL-α": 0.25, "ACC-γ": 0.20, "REL-β": 0.15, "MECH-δ": 0.20, "DEC-ε": 0.10, "SPR-ζ": 0.10 } },
  { name: "Ohio State",  conference: "Big Ten",     scheme: "Spread RPO",          weights: { "VEL-α": 0.20, "ACC-γ": 0.15, "REL-β": 0.20, "MECH-δ": 0.15, "DEC-ε": 0.20, "SPR-ζ": 0.10 } },
  { name: "Georgia",     conference: "SEC",         scheme: "Pro-Style",           weights: { "VEL-α": 0.25, "ACC-γ": 0.20, "REL-β": 0.10, "MECH-δ": 0.25, "DEC-ε": 0.10, "SPR-ζ": 0.10 } },
  { name: "Texas",       conference: "SEC",         scheme: "Air Raid Hybrid",     weights: { "VEL-α": 0.20, "ACC-γ": 0.25, "REL-β": 0.20, "MECH-δ": 0.15, "DEC-ε": 0.10, "SPR-ζ": 0.10 } },
  { name: "USC",         conference: "Big Ten",     scheme: "West Coast",          weights: { "VEL-α": 0.10, "ACC-γ": 0.25, "REL-β": 0.20, "MECH-δ": 0.15, "DEC-ε": 0.20, "SPR-ζ": 0.10 } },
  { name: "Oregon",      conference: "Big Ten",     scheme: "Spread Option",       weights: { "VEL-α": 0.15, "ACC-γ": 0.15, "REL-β": 0.25, "MECH-δ": 0.10, "DEC-ε": 0.25, "SPR-ζ": 0.10 } },
  { name: "Michigan",    conference: "Big Ten",     scheme: "Pro-Style",           weights: { "VEL-α": 0.25, "ACC-γ": 0.15, "REL-β": 0.10, "MECH-δ": 0.30, "DEC-ε": 0.10, "SPR-ζ": 0.10 } },
  { name: "Clemson",     conference: "ACC",         scheme: "Spread",              weights: { "VEL-α": 0.20, "ACC-γ": 0.20, "REL-β": 0.15, "MECH-δ": 0.15, "DEC-ε": 0.20, "SPR-ζ": 0.10 } },
  { name: "LSU",         conference: "SEC",         scheme: "Pro Spread",          weights: { "VEL-α": 0.25, "ACC-γ": 0.20, "REL-β": 0.15, "MECH-δ": 0.15, "DEC-ε": 0.15, "SPR-ζ": 0.10 } },
  { name: "Notre Dame",  conference: "Independent", scheme: "West Coast Pro",      weights: { "VEL-α": 0.15, "ACC-γ": 0.25, "REL-β": 0.15, "MECH-δ": 0.25, "DEC-ε": 0.10, "SPR-ζ": 0.10 } },
  { name: "Penn State",  conference: "Big Ten",     scheme: "RPO Heavy",           weights: { "VEL-α": 0.20, "ACC-γ": 0.15, "REL-β": 0.20, "MECH-δ": 0.15, "DEC-ε": 0.20, "SPR-ζ": 0.10 } },
  { name: "Oklahoma",    conference: "SEC",         scheme: "Air Raid",            weights: { "VEL-α": 0.15, "ACC-γ": 0.30, "REL-β": 0.20, "MECH-δ": 0.10, "DEC-ε": 0.15, "SPR-ζ": 0.10 } },
  { name: "Tennessee",   conference: "SEC",         scheme: "Tempo Spread",        weights: { "VEL-α": 0.15, "ACC-γ": 0.15, "REL-β": 0.25, "MECH-δ": 0.10, "DEC-ε": 0.25, "SPR-ζ": 0.10 } },
  { name: "Miami",       conference: "ACC",         scheme: "Pro Spread",          weights: { "VEL-α": 0.25, "ACC-γ": 0.15, "REL-β": 0.15, "MECH-δ": 0.20, "DEC-ε": 0.15, "SPR-ζ": 0.10 } },
];

export function computeInstitutionalFit(
  m: AthleteMetrics,
  program: ProgramProfile,
): number {
  const genes = extractGenes(m);
  const geneMap = Object.fromEntries(genes.map((g) => [g.id, g.value]));

  // Weighted dot product of gene values × program weights
  let fit = 0;
  for (const [geneId, weight] of Object.entries(program.weights)) {
    fit += (geneMap[geneId] ?? 50) * weight;
  }

  // Normalize to coefficient range: 0.70 – 1.15
  const coeff = parseFloat((0.70 + (fit / 100) * 0.45).toFixed(3));
  return Math.max(0.70, Math.min(1.15, coeff));
}

/**
 * Compute fit against ALL programs and return sorted list.
 */
export interface FitResult {
  program: ProgramProfile;
  coefficient: number;
  fitScore: number; // 0-99 human-readable
}

export function computeAllFits(m: AthleteMetrics): FitResult[] {
  return PROGRAM_PROFILES.map((prog) => {
    const coeff = computeInstitutionalFit(m, prog);
    const fitScore = Math.round(((coeff - 0.70) / 0.45) * 99);
    return { program: prog, coefficient: coeff, fitScore };
  }).sort((a, b) => b.fitScore - a.fitScore);
}

/* ══════════════════════════════════════════════════════════════
 *  THE GENOME ACTIVATION INDEX (GAI)
 *  The unified number.
 * ══════════════════════════════════════════════════════════════ */

export interface GAIResult {
  /** The final index: 0-99 */
  gai: number;

  /** Component scores */
  base: number;
  activation: ActivationSnapshot;
  growth: GrowthProfile;
  bestFit: FitResult;

  /** All gene profiles */
  genes: GeneProfile[];

  /** Human-readable tier */
  tier: "Generational" | "Elite" | "Blue-Chip" | "Prospect" | "Developmental";
  tierColor: string;
}

export function computeGAI(
  m: AthleteMetrics,
  options?: {
    activationSeed?: number;
    program?: ProgramProfile;
  },
): GAIResult {
  const base = baseGenomeScore(m);
  const genes = extractGenes(m);
  const activation = computeActivation(m, options?.activationSeed ?? 0.5);
  const growth = computeGrowth(m);
  const allFits = computeAllFits(m);
  const bestFit = options?.program
    ? { program: options.program, coefficient: computeInstitutionalFit(m, options.program), fitScore: Math.round(((computeInstitutionalFit(m, options.program) - 0.70) / 0.45) * 99) }
    : allFits[0];

  // GAI = Base × Activation × (1 + Growth) × Fit
  // Then normalize back to 0-99
  const raw = base * activation.multiplier * (1 + growth.delta) * bestFit.coefficient;
  const gai = Math.max(0, Math.min(99, Math.round(raw / 1.15))); // divide by max possible coefficient

  const tierThresholds: [number, GAIResult["tier"], string][] = [
    [92, "Generational", "#FFD700"],
    [82, "Elite", "#00FF88"],
    [68, "Blue-Chip", "#00C2FF"],
    [50, "Prospect", "#C0C0C0"],
    [0, "Developmental", "#9CA3AF"],
  ];

  const [, tierLabel, tierColor] = tierThresholds.find(([min]) => gai >= min)!;

  return {
    gai,
    base,
    activation,
    growth,
    bestFit,
    genes,
    tier: tierLabel,
    tierColor,
  };
}

/* ── Timeline Helpers ─────────────────────────────────────── */
/**
 * Generate a full-season GAI timeline (12 weekly snapshots)
 * showing how the index evolves through competitions.
 */
export interface TimelinePoint {
  week: number;
  gai: number;
  base: number;
  activationStatus: ActivationSnapshot["status"];
  peakGene: string;
  growthDelta: number;
}

export function generateGAITimeline(m: AthleteMetrics, weeks: number = 12): TimelinePoint[] {
  const points: TimelinePoint[] = [];
  for (let w = 1; w <= weeks; w++) {
    const progress = w / weeks;
    const result = computeGAI(m, { activationSeed: progress });
    points.push({
      week: w,
      gai: result.gai,
      base: result.base,
      activationStatus: result.activation.status,
      peakGene: result.activation.peakGene,
      growthDelta: result.growth.delta,
    });
  }
  return points;
}

/* ── Archetype Computation ────────────────────────────────── */
export type ArchetypeId = "cannon" | "surgeon" | "architect" | "gunslinger" | "catalyst" | "cerebral";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  primaryGenes: GeneId[];
  color: string;
}

export const ARCHETYPES: Archetype[] = [
  { id: "cannon",      name: "Cannon Elite",   description: "Elite arm talent with overpowering velocity",       primaryGenes: ["VEL-α", "SPR-ζ"],          color: "#00C2FF" },
  { id: "surgeon",     name: "Surgeon",         description: "Surgical precision with elite accuracy",            primaryGenes: ["ACC-γ", "MECH-δ"],          color: "#00FF88" },
  { id: "architect",   name: "Architect",       description: "Masterful game design and scheme execution",        primaryGenes: ["DEC-ε", "MECH-δ"],          color: "#A855F7" },
  { id: "gunslinger",  name: "Gunslinger",      description: "High-risk, high-reward playmaker",                  primaryGenes: ["VEL-α", "REL-β"],          color: "#F59E0B" },
  { id: "catalyst",    name: "Catalyst",        description: "Dynamic threat who creates with speed and instinct", primaryGenes: ["REL-β", "DEC-ε"],          color: "#EC4899" },
  { id: "cerebral",    name: "Cerebral",        description: "Elite processor who controls tempo and reads",       primaryGenes: ["DEC-ε", "ACC-γ"],          color: "#06B6D4" },
];

export function detectArchetype(m: AthleteMetrics): Archetype {
  const genes = extractGenes(m);
  const geneMap = Object.fromEntries(genes.map((g) => [g.id, g.value]));

  let best: Archetype = ARCHETYPES[0];
  let bestScore = 0;

  for (const arch of ARCHETYPES) {
    const score = arch.primaryGenes.reduce((s, gid) => s + (geneMap[gid] ?? 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = arch;
    }
  }

  return best;
}
