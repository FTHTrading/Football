"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SIGNAL_GROUPS = [
  {
    dimension: "Revenue Durability",
    signals: [
      { id: "contract_tenure_renewal", label: "Contract Tenure & Renewal" },
      { id: "earning_trajectory_vs_cohort", label: "Earning Trajectory vs Cohort" },
      { id: "market_depth_demand", label: "Market Depth & Demand" },
      { id: "revenue_source_diversification", label: "Revenue Source Diversification" },
      { id: "season_adjusted_earnings", label: "Season-Adjusted Earnings" },
      { id: "off_field_revenue_stability", label: "Off-Field Revenue Stability" },
      { id: "post_career_transition", label: "Post-Career Transition" },
    ],
  },
  {
    dimension: "Sponsor Concentration",
    signals: [
      { id: "top3_sponsor_dependency", label: "Top-3 Sponsor Dependency" },
      { id: "category_diversity_index", label: "Category Diversity Index" },
      { id: "renewal_rate_vs_industry", label: "Renewal Rate vs Industry" },
      { id: "sponsor_credit_quality", label: "Sponsor Credit Quality" },
      { id: "contract_duration_distribution", label: "Contract Duration Distribution" },
    ],
  },
  {
    dimension: "Engagement Quality",
    signals: [
      { id: "authentic_reach_vs_followers", label: "Authentic Reach vs Followers" },
      { id: "conversion_clickthrough", label: "Conversion & Click-Through" },
      { id: "audience_demographic_alignment", label: "Audience Demographic Alignment" },
      { id: "content_consistency", label: "Content Consistency" },
      { id: "platform_diversification", label: "Platform Diversification" },
      { id: "brand_safety_index", label: "Brand Safety Index" },
    ],
  },
  {
    dimension: "Eligibility & Transfer Risk",
    signals: [
      { id: "ncaa_eligibility_status", label: "NCAA Eligibility Status" },
      { id: "transfer_portal_probability", label: "Transfer Portal Probability" },
      { id: "draft_timeline_declaration", label: "Draft Timeline Declaration" },
      { id: "academic_standing", label: "Academic Standing" },
      { id: "conference_realignment_impact", label: "Conference Realignment Impact" },
    ],
  },
  {
    dimension: "Injury & Availability",
    signals: [
      { id: "position_specific_injury_rate", label: "Position-Specific Injury Rate" },
      { id: "historical_medical_record", label: "Historical Medical Record" },
      { id: "workload_snap_count_trends", label: "Workload & Snap Count Trends" },
      { id: "recovery_timeline_model", label: "Recovery Timeline Model" },
      { id: "insurance_availability", label: "Insurance Availability" },
    ],
  },
  {
    dimension: "Reputational Volatility",
    signals: [
      { id: "sentiment_analysis", label: "Sentiment Analysis" },
      { id: "controversy_exposure_index", label: "Controversy Exposure Index" },
      { id: "brand_safety_classification", label: "Brand Safety Classification" },
      { id: "media_cycle_resilience", label: "Media Cycle Resilience" },
      { id: "community_standing", label: "Community Standing" },
    ],
  },
] as const;

type SignalScores = Record<string, number>;

export default function NewUnderwritingForm({
  athletes,
  spvs,
}: {
  athletes: { id: string; displayName: string; sport: string; school: string }[];
  spvs: { id: string; legalName: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [athleteId, setAthleteId] = useState("");
  const [spvId, setSpvId] = useState("");
  const [weightProfileType, setWeightProfileType] = useState("revenue_participation_note");
  const [analystNotes, setAnalystNotes] = useState("");
  const [runStressTests, setRunStressTests] = useState(true);

  // Initialize all 33 signals at 50
  const [scores, setScores] = useState<SignalScores>(() => {
    const init: SignalScores = {};
    for (const group of SIGNAL_GROUPS) {
      for (const sig of group.signals) {
        init[sig.id] = 50;
      }
    }
    return init;
  });

  function setScore(id: string, value: number) {
    setScores((prev) => ({ ...prev, [id]: Math.max(0, Math.min(99, value)) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!athleteId) {
      setError("Select an athlete");
      return;
    }

    const signals = Object.entries(scores).map(([signalId, rawScore]) => ({
      signalId,
      rawScore,
      confidence: 0.8,
      dataSource: "manual",
    }));

    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/underwrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            athleteId,
            spvId: spvId || undefined,
            signals,
            weightProfileType,
            analystNotes: analystNotes || undefined,
            runStressTests,
          }),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || `Request failed (${res.status})`);
        }

        const data = await res.json();
        router.push(`/nil33/underwriting/${data.memoId}`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/nil33/underwriting" className="text-xs text-rails-muted hover:text-rails-text">
          ← Underwriting
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-rails-text">New Underwriting Analysis</h1>
        <p className="mt-1 text-sm text-rails-text-dim">
          Complete all 33 signal scores (0–99) to generate a full underwriting memo.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-rails-red/30 bg-rails-red/10 px-4 py-3 text-sm text-rails-red">
          {error}
        </div>
      )}

      {/* Athlete + SPV selection */}
      <div className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">
            Athlete *
          </label>
          <select
            className="input text-sm w-full"
            value={athleteId}
            onChange={(e) => setAthleteId(e.target.value)}
            required
          >
            <option value="">Select athlete…</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.displayName} — {a.sport}, {a.school}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">
            SPV (optional)
          </label>
          <select
            className="input text-sm w-full"
            value={spvId}
            onChange={(e) => setSpvId(e.target.value)}
          >
            <option value="">No SPV</option>
            {spvs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.legalName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">
            Weight Profile
          </label>
          <select
            className="input text-sm w-full"
            value={weightProfileType}
            onChange={(e) => setWeightProfileType(e.target.value)}
          >
            <option value="revenue_participation_note">Revenue Participation Note</option>
            <option value="portal_transfer_note">Portal Transfer Note</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-rails-text-dim cursor-pointer">
            <input
              type="checkbox"
              checked={runStressTests}
              onChange={(e) => setRunStressTests(e.target.checked)}
              className="accent-rails-green h-4 w-4"
            />
            Run stress tests
          </label>
        </div>
      </div>

      {/* Signal groups */}
      {SIGNAL_GROUPS.map((group) => (
        <div key={group.dimension} className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">{group.dimension}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.signals.map((sig) => (
              <div key={sig.id}>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor={sig.id}
                    className="text-xs text-rails-text-dim"
                  >
                    {sig.label}
                  </label>
                  <span
                    className={`font-mono text-xs font-bold ${
                      scores[sig.id] >= 80
                        ? "text-rails-green"
                        : scores[sig.id] >= 60
                          ? "text-rails-cyan"
                          : scores[sig.id] >= 40
                            ? "text-rails-gold"
                            : "text-rails-red"
                    }`}
                  >
                    {scores[sig.id]}
                  </span>
                </div>
                <input
                  id={sig.id}
                  type="range"
                  min={0}
                  max={99}
                  value={scores[sig.id]}
                  onChange={(e) => setScore(sig.id, parseInt(e.target.value, 10))}
                  className="w-full accent-rails-green"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Analyst notes */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-rails-text">Analyst Notes</h2>
        <textarea
          className="input w-full text-sm"
          rows={4}
          placeholder="Optional qualitative assessment…"
          value={analystNotes}
          onChange={(e) => setAnalystNotes(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {isPending ? "Running engine…" : "Generate Underwriting Memo"}
        </button>
        <Link href="/nil33/underwriting" className="btn-outline text-sm">
          Cancel
        </Link>
      </div>
    </form>
  );
}
