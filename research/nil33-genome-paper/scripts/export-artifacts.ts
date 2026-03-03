/**
 * export-artifacts.ts
 *
 * Generates research artifacts from @nil33/core for the genome paper.
 * Run via: npx tsx research/nil33-genome-paper/scripts/export-artifacts.ts
 *
 * Outputs:
 *   - artifacts/example-research-snapshot.json
 *   - artifacts/example-replay-record.json
 *   - artifacts/example-portfolio-genome-metrics.json
 *   - artifacts/synthetic-data.csv
 */

import * as fs from "fs";
import * as path from "path";

import {
  computeGenomeSignature,
  generateResearchSnapshot,
  generateMemo,
  sealReplayRecord,
  RPN_WEIGHT_PROFILE,
  PTN_WEIGHT_PROFILE,
  aggregatePortfolioGenomeMetrics,
} from "../../../packages/nil33-core/src/index";

import type {
  AthleteSignalInput,
  PortfolioGenomeEntry,
} from "../../../packages/nil33-core/src/types";

import type { GenomeSignature } from "../../../packages/nil33-core/src/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const ARTIFACTS_DIR = path.resolve(__dirname, "..", "artifacts");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJSON(filename: string, data: unknown) {
  const filepath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ ${filepath}`);
}

function writeCSV(filename: string, content: string) {
  const filepath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(filepath, content, "utf-8");
  console.log(`  ✓ ${filepath}`);
}

// ─── Signal IDs (all 33) ────────────────────────────────────────────────────

const SIGNAL_IDS = [
  "contract_tenure_renewal",
  "earning_trajectory_vs_cohort",
  "market_depth_demand",
  "revenue_source_diversification",
  "season_adjusted_earnings",
  "off_field_revenue_stability",
  "post_career_transition",
  "top3_sponsor_dependency",
  "category_diversity_index",
  "renewal_rate_vs_industry",
  "sponsor_credit_quality",
  "contract_duration_distribution",
  "authentic_reach_vs_followers",
  "conversion_clickthrough",
  "audience_demographic_alignment",
  "content_consistency",
  "platform_diversification",
  "brand_safety_index",
  "ncaa_eligibility_status",
  "transfer_portal_probability",
  "draft_timeline_declaration",
  "academic_standing",
  "conference_realignment_impact",
  "position_specific_injury_rate",
  "historical_medical_record",
  "workload_snap_count_trends",
  "recovery_timeline_model",
  "insurance_availability",
  "sentiment_analysis",
  "controversy_exposure_index",
  "brand_safety_classification",
  "media_cycle_resilience",
  "community_standing",
] as const;

// ─── Synthetic Athletes ─────────────────────────────────────────────────────

function makeSyntheticAthlete(
  id: string,
  firstName: string,
  lastName: string,
  sport: string,
  position: string,
  school: string,
  conference: string,
  gradYear: number,
  baseScores: Record<string, number>
): AthleteSignalInput {
  return {
    athleteId: id,
    athlete: {
      firstName,
      lastName,
      sport,
      school,
      position,
      gradYear,
    },
    signals: SIGNAL_IDS.map((signalId) => ({
      signalId,
      rawScore: baseScores[signalId] ?? 50,
      confidence: 0.85 + Math.random() * 0.1, // 0.85–0.95
      dataSource: "synthetic",
    })),
    observedAt: new Date("2026-03-15T00:00:00.000Z"),
  } as unknown as AthleteSignalInput;
}

// Seeded pseudo-random for reproducible synthetic data
let _seed = 42;
function seededRand(): number {
  _seed = (_seed * 16807) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function randScore(base: number, variance: number): number {
  const raw = base + (seededRand() - 0.5) * 2 * variance;
  return Math.max(0, Math.min(99, Math.round(raw)));
}

function generateAthletes(): AthleteSignalInput[] {
  const athletes: AthleteSignalInput[] = [];

  const profiles = [
    { id: "ath-001", first: "Marcus", last: "Williams", sport: "Football", pos: "QB", school: "Ohio State", conf: "Big Ten", grad: 2027, base: 88 },
    { id: "ath-002", first: "Jaylen", last: "Carter", sport: "Football", pos: "WR", school: "Alabama", conf: "SEC", grad: 2026, base: 82 },
    { id: "ath-003", first: "Devon", last: "Brooks", sport: "Football", pos: "RB", school: "Texas", conf: "SEC", grad: 2027, base: 75 },
    { id: "ath-004", first: "Tyler", last: "Richardson", sport: "Football", pos: "LB", school: "Georgia", conf: "SEC", grad: 2026, base: 70 },
    { id: "ath-005", first: "Caleb", last: "Morrison", sport: "Football", pos: "DE", school: "Michigan", conf: "Big Ten", grad: 2028, base: 65 },
    { id: "ath-006", first: "Isaiah", last: "Green", sport: "Football", pos: "CB", school: "USC", conf: "Big Ten", grad: 2027, base: 60 },
    { id: "ath-007", first: "Xavier", last: "Thompson", sport: "Football", pos: "TE", school: "Penn State", conf: "Big Ten", grad: 2026, base: 55 },
    { id: "ath-008", first: "Jordan", last: "Mitchell", sport: "Football", pos: "OT", school: "Oregon", conf: "Big Ten", grad: 2027, base: 50 },
    { id: "ath-009", first: "Andre", last: "Johnson", sport: "Football", pos: "S", school: "Clemson", conf: "ACC", grad: 2026, base: 45 },
    { id: "ath-010", first: "Malik", last: "Davis", sport: "Football", pos: "DT", school: "LSU", conf: "SEC", grad: 2028, base: 40 },
    { id: "ath-011", first: "Cameron", last: "Wilson", sport: "Basketball", pos: "PG", school: "Duke", conf: "ACC", grad: 2027, base: 85 },
    { id: "ath-012", first: "Bryce", last: "Anderson", sport: "Basketball", pos: "SG", school: "Kentucky", conf: "SEC", grad: 2026, base: 78 },
    { id: "ath-013", first: "Elijah", last: "Thomas", sport: "Basketball", pos: "SF", school: "Kansas", conf: "Big 12", grad: 2027, base: 72 },
    { id: "ath-014", first: "Derek", last: "Jackson", sport: "Basketball", pos: "PF", school: "UNC", conf: "ACC", grad: 2026, base: 68 },
    { id: "ath-015", first: "Noah", last: "White", sport: "Basketball", pos: "C", school: "Gonzaga", conf: "WCC", grad: 2028, base: 62 },
    { id: "ath-016", first: "Ryan", last: "Harris", sport: "Football", pos: "QB", school: "Oklahoma", conf: "SEC", grad: 2027, base: 91 },
    { id: "ath-017", first: "Justin", last: "Martin", sport: "Football", pos: "WR", school: "Florida", conf: "SEC", grad: 2026, base: 77 },
    { id: "ath-018", first: "Aaron", last: "Garcia", sport: "Football", pos: "RB", school: "Notre Dame", conf: "Ind.", grad: 2027, base: 73 },
    { id: "ath-019", first: "Chris", last: "Lee", sport: "Football", pos: "LB", school: "Tennessee", conf: "SEC", grad: 2026, base: 58 },
    { id: "ath-020", first: "David", last: "Robinson", sport: "Football", pos: "DE", school: "Miami", conf: "ACC", grad: 2028, base: 53 },
    { id: "ath-021", first: "Brandon", last: "Clark", sport: "Football", pos: "CB", school: "Auburn", conf: "SEC", grad: 2027, base: 48 },
    { id: "ath-022", first: "Eric", last: "Lewis", sport: "Football", pos: "TE", school: "Wisconsin", conf: "Big Ten", grad: 2026, base: 43 },
    { id: "ath-023", first: "Kevin", last: "Walker", sport: "Football", pos: "OT", school: "Iowa", conf: "Big Ten", grad: 2027, base: 38 },
    { id: "ath-024", first: "Nathan", last: "Hall", sport: "Football", pos: "S", school: "Colorado", conf: "Big 12", grad: 2026, base: 33 },
    { id: "ath-025", first: "Trevor", last: "Allen", sport: "Football", pos: "DT", school: "Arizona", conf: "Big 12", grad: 2028, base: 28 },
    { id: "ath-026", first: "Patrick", last: "Young", sport: "Basketball", pos: "PG", school: "UCLA", conf: "Big Ten", grad: 2027, base: 80 },
    { id: "ath-027", first: "Sean", last: "King", sport: "Basketball", pos: "SG", school: "Villanova", conf: "Big East", grad: 2026, base: 74 },
    { id: "ath-028", first: "Austin", last: "Wright", sport: "Basketball", pos: "SF", school: "Baylor", conf: "Big 12", grad: 2027, base: 66 },
    { id: "ath-029", first: "Daniel", last: "Lopez", sport: "Basketball", pos: "PF", school: "Houston", conf: "Big 12", grad: 2026, base: 57 },
    { id: "ath-030", first: "Jason", last: "Hill", sport: "Basketball", pos: "C", school: "Purdue", conf: "Big Ten", grad: 2028, base: 51 },
    { id: "ath-031", first: "Brian", last: "Scott", sport: "Football", pos: "QB", school: "Florida State", conf: "ACC", grad: 2027, base: 86 },
    { id: "ath-032", first: "Steven", last: "Adams", sport: "Football", pos: "WR", school: "Arkansas", conf: "SEC", grad: 2026, base: 69 },
    { id: "ath-033", first: "Adam", last: "Nelson", sport: "Football", pos: "RB", school: "Michigan State", conf: "Big Ten", grad: 2027, base: 63 },
    { id: "ath-034", first: "Mark", last: "Carter", sport: "Football", pos: "LB", school: "Stanford", conf: "ACC", grad: 2026, base: 56 },
    { id: "ath-035", first: "Zach", last: "Perez", sport: "Football", pos: "DE", school: "Virginia Tech", conf: "ACC", grad: 2028, base: 49 },
    { id: "ath-036", first: "Luke", last: "Roberts", sport: "Football", pos: "CB", school: "Pittsburgh", conf: "ACC", grad: 2027, base: 42 },
    { id: "ath-037", first: "Grant", last: "Turner", sport: "Football", pos: "TE", school: "Missouri", conf: "SEC", grad: 2026, base: 37 },
    { id: "ath-038", first: "Jake", last: "Phillips", sport: "Football", pos: "OT", school: "Minnesota", conf: "Big Ten", grad: 2027, base: 32 },
    { id: "ath-039", first: "Cole", last: "Campbell", sport: "Football", pos: "S", school: "South Carolina", conf: "SEC", grad: 2026, base: 27 },
    { id: "ath-040", first: "Drew", last: "Parker", sport: "Football", pos: "DT", school: "NC State", conf: "ACC", grad: 2028, base: 22 },
    { id: "ath-041", first: "Ian", last: "Evans", sport: "Basketball", pos: "PG", school: "Connecticut", conf: "Big East", grad: 2027, base: 83 },
    { id: "ath-042", first: "Kyle", last: "Edwards", sport: "Basketball", pos: "SG", school: "Indiana", conf: "Big Ten", grad: 2026, base: 76 },
    { id: "ath-043", first: "Max", last: "Collins", sport: "Basketball", pos: "SF", school: "Marquette", conf: "Big East", grad: 2027, base: 64 },
    { id: "ath-044", first: "Peter", last: "Stewart", sport: "Basketball", pos: "PF", school: "Creighton", conf: "Big East", grad: 2026, base: 59 },
    { id: "ath-045", first: "Sam", last: "Sanchez", sport: "Basketball", pos: "C", school: "St. Johns", conf: "Big East", grad: 2028, base: 52 },
    { id: "ath-046", first: "Will", last: "Morris", sport: "Football", pos: "QB", school: "BYU", conf: "Big 12", grad: 2027, base: 71 },
    { id: "ath-047", first: "Alex", last: "Rogers", sport: "Football", pos: "WR", school: "Memphis", conf: "AAC", grad: 2026, base: 46 },
    { id: "ath-048", first: "Ben", last: "Reed", sport: "Football", pos: "RB", school: "UCF", conf: "Big 12", grad: 2027, base: 41 },
    { id: "ath-049", first: "Chase", last: "Cook", sport: "Football", pos: "LB", school: "SMU", conf: "ACC", grad: 2026, base: 36 },
    { id: "ath-050", first: "Dane", last: "Morgan", sport: "Football", pos: "DE", school: "Cincinnati", conf: "Big 12", grad: 2028, base: 31 },
  ];

  for (const p of profiles) {
    const scores: Record<string, number> = {};
    for (const sid of SIGNAL_IDS) {
      scores[sid] = randScore(p.base, 12);
    }
    athletes.push(
      makeSyntheticAthlete(
        p.id, p.first, p.last, p.sport, p.pos, p.school, p.conf, p.grad, scores
      )
    );
  }

  return athletes;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  NIL33 Genome Paper — Artifact Export                   ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  ensureDir(ARTIFACTS_DIR);

  // 1. Compute genome
  console.log("[1/4] Computing genome signature...");
  const genome = computeGenomeSignature(RPN_WEIGHT_PROFILE);
  console.log(`  Genome ID: ${genome.genomeId}`);
  console.log(`  Version:   ${genome.version}`);

  // 2. Research snapshot
  console.log("\n[2/4] Generating research snapshot...");
  const snapshot = generateResearchSnapshot(genome, {
    title: "NIL33 Genome v1.0 — Research Snapshot",
    authors: ["Kevan Fehr"],
    description:
      "Complete model specification for the NIL33 deterministic " +
      "underwriting engine, genome version 1.0.0. Includes signal " +
      "schema, weight profiles, grade thresholds, stress scenarios, " +
      "covenant rules, flag rules, and synthetic verification vectors.",
    license: "All rights reserved",
  });
  writeJSON("example-research-snapshot.json", snapshot);

  // 3. Replay record (using first synthetic sample from snapshot)
  console.log("\n[3/4] Generating replay record...");
  const sampleInput = snapshot.syntheticSamples[0].input;
  const memoResult = generateMemo({
    athleteInput: sampleInput,
    weightProfile: RPN_WEIGHT_PROFILE,
    referenceFacilityCents: 100_000_00, // $100,000
  });
  const replayRecord = sealReplayRecord(
    {
      athleteInput: sampleInput,
      weightProfile: RPN_WEIGHT_PROFILE,
      referenceFacilityCents: 100_000_00,
    },
    memoResult.memo.memoId,
    genome
  );
  writeJSON("example-replay-record.json", replayRecord);

  // 4. Portfolio genome metrics
  console.log("\n[4/4] Generating portfolio genome metrics...");

  // Create a second genome with PTN profile to demonstrate multi-genome portfolio
  const genomePTN = computeGenomeSignature(PTN_WEIGHT_PROFILE);

  const portfolioEntries: PortfolioGenomeEntry[] = [
    // 5 instruments under RPN genome
    { instrumentId: "inst-001", instrumentName: "Williams RPN Note", exposureCents: 50_000_00, genome },
    { instrumentId: "inst-002", instrumentName: "Carter RPN Note", exposureCents: 35_000_00, genome },
    { instrumentId: "inst-003", instrumentName: "Brooks RPN Note", exposureCents: 25_000_00, genome },
    { instrumentId: "inst-004", instrumentName: "Richardson RPN Note", exposureCents: 20_000_00, genome },
    { instrumentId: "inst-005", instrumentName: "Morrison RPN Note", exposureCents: 15_000_00, genome },
    // 3 instruments under PTN genome (different weight profile → different genome)
    { instrumentId: "inst-006", instrumentName: "Wilson PTN Tranche", exposureCents: 40_000_00, genome: genomePTN },
    { instrumentId: "inst-007", instrumentName: "Anderson PTN Tranche", exposureCents: 30_000_00, genome: genomePTN },
    { instrumentId: "inst-008", instrumentName: "Thomas PTN Tranche", exposureCents: 20_000_00, genome: genomePTN },
  ];

  const metrics = aggregatePortfolioGenomeMetrics(portfolioEntries);
  writeJSON("example-portfolio-genome-metrics.json", metrics);

  // 5. Synthetic data CSV
  console.log("\n[5/5] Generating synthetic data CSV...");
  const athletes = generateAthletes();

  const header = [
    "athlete_id",
    "first_name",
    "last_name",
    "sport",
    "position",
    "school",
    "grad_year",
    ...SIGNAL_IDS,
  ].join(",");

  const rows = athletes.map((a) => {
    const signalScores = SIGNAL_IDS.map((sid) => {
      const signal = a.signals.find((s: any) => s.signalId === sid);
      return signal ? (signal as any).rawScore : 50;
    });
    return [
      a.athleteId,
      a.athlete.firstName,
      a.athlete.lastName,
      a.athlete.sport,
      a.athlete.position,
      a.athlete.school,
      a.athlete.gradYear,
      ...signalScores,
    ].join(",");
  });

  writeCSV("synthetic-data.csv", [header, ...rows].join("\n"));

  console.log("\n✓ All artifacts exported successfully.\n");
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
