import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import {
  computeGenomeSignature,
  FLAG_RULES_CANONICAL,
  VALUATION_MODEL_CANONICAL,
} from "@nil33/core";
import { RPN_WEIGHT_PROFILE, PTN_WEIGHT_PROFILE } from "@nil33/core";
import { GenomeComponentTable } from "@/components/GenomeComponentTable";
import { GenomeDriftIndicator } from "@/components/GenomeDriftIndicator";
import { GenomeDistributionChart } from "@/components/GenomeDistributionChart";
import { GenomeCoverageBar } from "@/components/GenomeCoverageBar";

// ─── Data Fetchers ──────────────────────────────────────────────────────────

async function getPortfolioGenomeData() {
  const instruments = await prisma.instrument.findMany({
    where: { genomeId: { not: null } },
    select: {
      id: true,
      name: true,
      genomeId: true,
      genomeVersion: true,
      totalIssuanceAmtCents: true,
      status: true,
    },
  });

  const clusterMap = new Map<string, {
    genomeId: string;
    genomeVersion: string | null;
    instrumentCount: number;
    totalExposureCents: number;
  }>();

  for (const inst of instruments) {
    const gid = inst.genomeId!;
    const existing = clusterMap.get(gid);
    if (existing) {
      existing.instrumentCount++;
      existing.totalExposureCents += inst.totalIssuanceAmtCents;
    } else {
      clusterMap.set(gid, {
        genomeId: gid,
        genomeVersion: inst.genomeVersion,
        instrumentCount: 1,
        totalExposureCents: inst.totalIssuanceAmtCents,
      });
    }
  }

  const totalExposureCents = instruments.reduce((s, i) => s + i.totalIssuanceAmtCents, 0);
  const clusters = Array.from(clusterMap.values())
    .map((c) => ({
      ...c,
      weightPct: totalExposureCents > 0 ? c.totalExposureCents / totalExposureCents : 0,
    }))
    .sort((a, b) => b.totalExposureCents - a.totalExposureCents);

  const hhi = clusters.reduce((s, c) => s + c.weightPct * c.weightPct, 0) || 1;

  return {
    stampedInstruments: instruments.length,
    totalExposureCents,
    distinctGenomes: clusters.length,
    clusters,
    homogeneityIndex: hhi,
    mutationRisk: clusters.length > 1 ? Math.min(1, (1 - hhi) * 1.5) : 0,
  };
}

async function getVersionHistory() {
  const runs = await prisma.underwritingRun.findMany({
    select: {
      id: true,
      genomeId: true,
      genomeVersion: true,
      snapshotHash: true,
      createdAt: true,
      athlete: { select: { displayName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const versionMap = new Map<string, {
    genomeId: string;
    genomeVersion: string;
    firstSeen: Date;
    lastSeen: Date;
    runCount: number;
  }>();

  for (const run of runs) {
    const existing = versionMap.get(run.genomeId);
    if (existing) {
      existing.runCount++;
      if (run.createdAt < existing.firstSeen) existing.firstSeen = run.createdAt;
      if (run.createdAt > existing.lastSeen) existing.lastSeen = run.createdAt;
    } else {
      versionMap.set(run.genomeId, {
        genomeId: run.genomeId,
        genomeVersion: run.genomeVersion,
        firstSeen: run.createdAt,
        lastSeen: run.createdAt,
        runCount: 1,
      });
    }
  }

  return {
    history: Array.from(versionMap.values()).sort(
      (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
    ),
    recentRuns: runs.slice(0, 15),
  };
}

async function getCoverage() {
  const [totalMemos, memosStamped, totalDists, distsStamped, totalInst, instStamped] =
    await Promise.all([
      prisma.underwritingMemo.count(),
      prisma.underwritingMemo.count({ where: { genomeId: { not: "" } } }),
      prisma.distribution.count(),
      prisma.distribution.count({ where: { genomeId: { not: null } } }),
      prisma.instrument.count(),
      prisma.instrument.count({ where: { genomeId: { not: null } } }),
    ]);

  return {
    memos: { total: totalMemos, stamped: memosStamped, pct: totalMemos > 0 ? memosStamped / totalMemos : 0 },
    distributions: { total: totalDists, stamped: distsStamped, pct: totalDists > 0 ? distsStamped / totalDists : 0 },
    instruments: { total: totalInst, stamped: instStamped, pct: totalInst > 0 ? instStamped / totalInst : 0 },
  };
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function GenomeConsolePage() {
  // Compute live genomes
  const rpnGenome = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
  const ptnGenome = computeGenomeSignature(PTN_WEIGHT_PROFILE, "1.0.0");

  // Parallel data fetch
  const [portfolio, { history, recentRuns }, coverage] = await Promise.all([
    getPortfolioGenomeData(),
    getVersionHistory(),
    getCoverage(),
  ]);

  // Drift detection
  const latestStampedId = recentRuns[0]?.genomeId ?? null;
  const driftDetected = latestStampedId ? latestStampedId !== rpnGenome.genomeId : false;

  // Component breakdown
  const components = [
    { key: "signalSchemaHash", label: "Signal Schema", hash: rpnGenome.signalSchemaHash, description: "33 signals → 6 dimensions mapping" },
    { key: "weightProfileHash", label: "Weight Profile", hash: rpnGenome.weightProfileHash, description: "Dimension & signal weight vectors" },
    { key: "thresholdHash", label: "Grade Thresholds", hash: rpnGenome.thresholdHash, description: "A+ through F scoring boundaries" },
    { key: "stressMatrixHash", label: "Stress Matrix", hash: rpnGenome.stressMatrixHash, description: "5 macro shock scenarios" },
    { key: "covenantRulesHash", label: "Covenant Rules", hash: rpnGenome.covenantRulesHash, description: "4-type covenant generation logic" },
    { key: "flagRulesHash", label: "Flag Rules", hash: rpnGenome.flagRulesHash, description: `${FLAG_RULES_CANONICAL.length} risk flag thresholds` },
    { key: "valuationModelHash", label: "Valuation Model", hash: rpnGenome.valuationModelHash, description: `${VALUATION_MODEL_CANONICAL.multiplierCurve.length}-band multiplier curve` },
  ];

  // Model meta
  const modelMeta = [
    { label: "Signals", value: "33" },
    { label: "Dimensions", value: "6" },
    { label: "Flag Rules", value: String(FLAG_RULES_CANONICAL.length) },
    { label: "Stress Scenarios", value: "5" },
    { label: "Covenant Types", value: "4" },
    { label: "Valuation Bands", value: String(VALUATION_MODEL_CANONICAL.multiplierCurve.length) },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl text-rails-green">⧬</span>
          <div>
            <h1 className="text-2xl font-bold text-rails-text">Genome Identity Console</h1>
            <p className="mt-0.5 text-sm text-rails-text-dim">
              Cryptographic model fingerprint — determinism, traceability, scientific authority
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Genome Identity ────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* RPN Genome */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-rails-text">Revenue Participation Note</h2>
            <span className="badge badge-green text-[10px]">LIVE</span>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Genome ID</span>
              <p className="mt-0.5 font-mono text-sm text-rails-cyan break-all" title={rpnGenome.genomeId}>
                {rpnGenome.genomeId}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Version</span>
                <p className="mt-0.5 font-mono text-sm text-rails-green">v{rpnGenome.version}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Computed</span>
                <p className="mt-0.5 text-sm text-rails-text-dim">{formatDate(rpnGenome.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PTN Genome */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-rails-text">Portfolio Tranche Note</h2>
            <span className="badge badge-green text-[10px]">LIVE</span>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Genome ID</span>
              <p className="mt-0.5 font-mono text-sm text-rails-cyan break-all" title={ptnGenome.genomeId}>
                {ptnGenome.genomeId}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Version</span>
                <p className="mt-0.5 font-mono text-sm text-rails-green">v{ptnGenome.version}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Computed</span>
                <p className="mt-0.5 text-sm text-rails-text-dim">{formatDate(ptnGenome.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Drift Detection ─────────────────────────────────────────────── */}
      <GenomeDriftIndicator
        driftDetected={driftDetected}
        currentGenomeId={rpnGenome.genomeId}
        lastStampedGenomeId={latestStampedId}
      />

      {/* ── Model Architecture ──────────────────────────────────────────── */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Model Architecture</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {modelMeta.map((m) => (
            <div key={m.label} className="rounded-lg border border-surface-border bg-surface-muted p-3 text-center">
              <span className="font-mono text-xl font-bold text-rails-green">{m.value}</span>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-rails-text-dim">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Component Hash Breakdown ────────────────────────────────────── */}
      <GenomeComponentTable components={components} />

      {/* ── Genome Stamp Coverage ───────────────────────────────────────── */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Genome Stamp Coverage</h2>
        <p className="mb-4 text-xs text-rails-text-dim">
          Fraction of capital objects that carry a cryptographic genome fingerprint at creation.
        </p>
        <div className="space-y-4">
          <GenomeCoverageBar label="Underwriting Memos" total={coverage.memos.total} stamped={coverage.memos.stamped} pct={coverage.memos.pct} />
          <GenomeCoverageBar label="Instruments" total={coverage.instruments.total} stamped={coverage.instruments.stamped} pct={coverage.instruments.pct} />
          <GenomeCoverageBar label="Distributions" total={coverage.distributions.total} stamped={coverage.distributions.stamped} pct={coverage.distributions.pct} />
        </div>
      </div>

      {/* ── Portfolio Genome Distribution ────────────────────────────────── */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">Portfolio Genome Distribution</h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="font-mono text-lg font-bold text-rails-cyan">{portfolio.distinctGenomes}</span>
              <p className="text-[10px] text-rails-text-dim">Distinct</p>
            </div>
            <div className="text-center">
              <span className="font-mono text-lg font-bold text-rails-green">
                {(portfolio.homogeneityIndex * 100).toFixed(1)}%
              </span>
              <p className="text-[10px] text-rails-text-dim">HHI</p>
            </div>
            <div className="text-center">
              <span className={`font-mono text-lg font-bold ${portfolio.mutationRisk > 0.3 ? "text-rails-red" : portfolio.mutationRisk > 0 ? "text-rails-gold" : "text-rails-green"}`}>
                {(portfolio.mutationRisk * 100).toFixed(0)}%
              </span>
              <p className="text-[10px] text-rails-text-dim">Mutation</p>
            </div>
          </div>
        </div>

        {portfolio.clusters.length > 0 ? (
          <GenomeDistributionChart clusters={portfolio.clusters} totalExposureCents={portfolio.totalExposureCents} />
        ) : (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted p-8 text-center">
            <p className="text-sm text-rails-text-dim">No genome-stamped instruments yet.</p>
            <p className="mt-1 text-xs text-rails-muted">
              Create an underwriting run to stamp instruments with a genome identity.
            </p>
          </div>
        )}
      </div>

      {/* ── Version Lineage ─────────────────────────────────────────────── */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Version Lineage</h2>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-rails-text-dim">
                  <th className="pb-2 pr-4 font-medium">Genome ID</th>
                  <th className="pb-2 pr-4 font-medium">Version</th>
                  <th className="pb-2 pr-4 font-medium">Runs</th>
                  <th className="pb-2 pr-4 font-medium">First Seen</th>
                  <th className="pb-2 pr-4 font-medium">Last Seen</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((v, i) => (
                  <tr key={v.genomeId} className="border-b border-surface-border/50 table-row-hover">
                    <td className="py-2 pr-4 font-mono text-rails-cyan" title={v.genomeId}>
                      {v.genomeId.slice(0, 8)}…{v.genomeId.slice(-4)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-rails-green">v{v.genomeVersion}</td>
                    <td className="py-2 pr-4 font-mono text-rails-text">{v.runCount}</td>
                    <td className="py-2 pr-4 text-rails-text-dim">{formatDate(v.firstSeen)}</td>
                    <td className="py-2 pr-4 text-rails-text-dim">{formatDate(v.lastSeen)}</td>
                    <td className="py-2">
                      <span className={`badge ${i === 0 && v.genomeId === rpnGenome.genomeId ? "badge-green" : i === 0 ? "badge-yellow" : "badge-muted"} text-[10px]`}>
                        {i === 0 && v.genomeId === rpnGenome.genomeId ? "CURRENT" : i === 0 ? "DRIFTED" : "RETIRED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted p-6 text-center">
            <p className="text-sm text-rails-text-dim">No underwriting runs recorded yet.</p>
          </div>
        )}
      </div>

      {/* ── Recent Underwriting Runs ────────────────────────────────────── */}
      {recentRuns.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Recent Underwriting Runs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-rails-text-dim">
                  <th className="pb-2 pr-4 font-medium">Athlete</th>
                  <th className="pb-2 pr-4 font-medium">Genome ID</th>
                  <th className="pb-2 pr-4 font-medium">Version</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id} className="border-b border-surface-border/50 table-row-hover">
                    <td className="py-2 pr-4 text-rails-text">{run.athlete.displayName}</td>
                    <td className="py-2 pr-4 font-mono text-rails-cyan" title={run.genomeId}>
                      {run.genomeId.slice(0, 8)}…{run.genomeId.slice(-4)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-rails-green">v{run.genomeVersion}</td>
                    <td className="py-2 text-rails-text-dim">{formatDate(run.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Genome Authority Footer ────────────────────────────────────── */}
      <div className="rounded-xl border border-surface-border bg-surface-muted/50 p-5">
        <div className="flex items-start gap-3">
          <span className="font-mono text-lg text-rails-green">◇</span>
          <div>
            <p className="text-xs font-semibold text-rails-text">Deterministic. Reproducible. Verifiable.</p>
            <p className="mt-1 text-xs text-rails-text-dim">
              Every underwriting memo, instrument issuance, and distribution carries a cryptographic genome fingerprint.
              Given the same inputs and genome, any peer can independently reproduce any score.
              This is what makes NIL33 DOI-ready research infrastructure, not just a platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
