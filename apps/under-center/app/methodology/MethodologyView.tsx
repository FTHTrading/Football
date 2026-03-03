"use client";

import Reveal from "@/components/Reveal";
import Link from "next/link";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  METRIC DEFINITIONS                                           */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const METRICS = [
  {
    name: "Arm Strength",
    weight: 15,
    scale: "1–99",
    icon: "💪",
    description:
      "Measured via radar gun velocity at multiple release points. Accounts for ball spiral tightness, trajectory under pressure, and deep-ball carry distance.",
    protocol: "3-throw series: 10-yard out, 20-yard dig, 50-yard bomb. Best composite score normalized to 1–99.",
  },
  {
    name: "Release Time",
    weight: 10,
    scale: "0.28–0.50s",
    icon: "⚡",
    description:
      "High-speed camera capture (240fps) from first hand movement to ball departure. Lower is better — measures pure mechanical quickness.",
    protocol: "5-step drop, 3-step drop, and play-action sets. Median of 12 attempts.",
  },
  {
    name: "Accuracy",
    weight: 18,
    scale: "0–100%",
    icon: "🎯",
    description:
      "Target-zone precision across short (0–10), intermediate (11–25), and deep (26+) zones. Combines on-target rate with ball placement scoring.",
    protocol: "40-throw circuit with static and moving targets at 3 depth bands. Weighted average.",
  },
  {
    name: "Decision Speed",
    weight: 12,
    scale: "100–300ms",
    icon: "🧠",
    description:
      "Time from post-snap read to throw decision under simulated pressure. Lower is better — measures cognitive processing speed.",
    protocol: "Film-based reaction test + live 11v11 sessions with eye-tracking. Median result.",
  },
  {
    name: "Pocket Presence",
    weight: 13,
    scale: "1–99",
    icon: "🛡️",
    description:
      "Composite of spatial awareness, subtle pocket movement, and throw-under-duress accuracy. Evaluators score live reps and film review.",
    protocol: "3 evaluators score 20 live reps independently. Z-score normalized, then converted to 1–99.",
  },
  {
    name: "Athleticism",
    weight: 10,
    scale: "1–99",
    icon: "🏃",
    description:
      "Combines 40-yard time, shuttle agility, vertical jump, and designed-run effectiveness. Captures physical upside and escapability.",
    protocol: "NFL Combine-style testing + game film scramble grading. Composite normalized to 1–99.",
  },
  {
    name: "Film Grade",
    weight: 12,
    scale: "1–99",
    icon: "🎬",
    description:
      "Expert evaluation of game film across decision-making, progression reads, audible usage, and situational awareness. Holistic football IQ grade.",
    protocol: "Minimum 5 full-game films. 3 evaluators using standardized rubric. Inter-rater reliability > 0.85.",
  },
  {
    name: "Mechanics Grade",
    weight: 10,
    scale: "1–99",
    icon: "⚙️",
    description:
      "Throwing motion efficiency, footwork, base alignment, and transfer mechanics. Evaluates both current form and projectability.",
    protocol: "Biomechanical analysis via motion capture + evaluator grades. Emphasis on repeatability under pressure.",
  },
];

const GRADE_TIERS = [
  { grade: "ELITE", range: "≥ 92", color: "#22c55e", description: "Generational talent — top 1% nationally" },
  { grade: "A+",    range: "85–91", color: "#4ade80", description: "Blue-chip prospect — Power 5 starter projection" },
  { grade: "A",     range: "80–84", color: "#d4a843", description: "High-level talent — immediate program impact" },
  { grade: "B+",    range: "75–79", color: "#f59e0b", description: "Strong prospect — developmental upside" },
  { grade: "B",     range: "70–74", color: "#3b82f6", description: "Solid — needs refinement in key areas" },
  { grade: "C+",    range: "65–69", color: "#8b5cf6", description: "Emerging — significant development needed" },
  { grade: "C",     range: "< 65",  color: "#6b7280", description: "Early stage — foundational traits present" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  METHODOLOGY VIEW                                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MethodologyView() {
  return (
    <div className="min-h-screen bg-uc-black">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-uc-black/90 backdrop-blur-xl border-b border-uc-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-xs">UC</span>
            </div>
            <span className="text-uc-white font-semibold text-sm tracking-tight">
              Under Center
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/rankings" className="text-xs text-uc-muted hover:text-uc-white transition-colors">Rankings</Link>
            <Link href="/compare" className="text-xs text-uc-muted hover:text-uc-white transition-colors">Compare</Link>
            <Link href="/lab" className="text-xs text-uc-muted hover:text-uc-white transition-colors">DNA Lab</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-16 px-6 border-b border-uc-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[11px] text-uc-gold uppercase tracking-widest mb-4">
              Evaluation Framework
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-uc-white mb-4 leading-tight">
              Methodology
            </h1>
            <p className="text-uc-light text-base max-w-2xl leading-relaxed">
              Under Center evaluates quarterbacks through a rigorous, multi-stage
              verification process. Every metric is independently tested,
              validated by multiple evaluators, and synthesized into the
              composite DNA score — a single number that captures the full
              spectrum of quarterback ability.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── The 8 Metrics ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              The 8 Verified Metrics
            </h2>
            <p className="text-uc-muted text-sm mb-12">
              Each metric is independently captured, validated, and normalized
              before contributing to the composite score.
            </p>
          </Reveal>

          <div className="space-y-6">
            {METRICS.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className="bg-uc-dark border border-uc-border rounded-2xl p-6 hover:border-uc-gold/15 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl shrink-0 mt-1">{m.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-uc-white font-semibold text-lg">{m.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-uc-muted font-mono">{m.scale}</span>
                          <span className="text-xs font-mono font-bold text-uc-gold bg-uc-gold/10 px-2 py-0.5 rounded-md">
                            {m.weight}%
                          </span>
                        </div>
                      </div>
                      <p className="text-uc-light text-sm leading-relaxed mb-3">
                        {m.description}
                      </p>
                      <div className="bg-uc-black/50 rounded-xl p-3 border border-uc-border/50">
                        <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-1">
                          Protocol
                        </p>
                        <p className="text-uc-light text-xs leading-relaxed">
                          {m.protocol}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DNA Score Formula ─── */}
      <section className="py-20 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              DNA Score Computation
            </h2>
            <p className="text-uc-muted text-sm mb-10">
              The composite score uses a weighted linear model after normalizing
              each metric to a common 0–100 scale.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-uc-panel border border-uc-border rounded-2xl p-8">
              {/* Formula */}
              <div className="mb-8">
                <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-4">
                  Formula
                </p>
                <div className="bg-uc-black rounded-xl p-5 font-mono text-sm text-uc-light leading-loose border border-uc-border/50">
                  <p>DNA = Σ(w<sub>i</sub> × normalize(metric<sub>i</sub>))</p>
                  <p className="text-uc-muted text-xs mt-3">
                    where w<sub>i</sub> are the metric weights and normalize() maps
                    each metric to a 0–100 scale
                  </p>
                </div>
              </div>

              {/* Normalization Notes */}
              <div className="mb-8">
                <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-4">
                  Normalization Rules
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Arm Strength, Accuracy, Pocket Presence, Athleticism, Film Grade, Mechanics", rule: "Direct map (already 0–100 range)" },
                    { label: "Release Time", rule: "Inverted: (0.50 − value) / 0.20 × 100 → lower is better" },
                    { label: "Decision Speed", rule: "Inverted: (300 − value) / 200 × 100 → lower is better" },
                  ].map((n) => (
                    <div key={n.label} className="bg-uc-black/50 rounded-xl p-4 border border-uc-border/50">
                      <p className="text-uc-light text-xs font-semibold mb-1">{n.label}</p>
                      <p className="text-uc-muted text-xs font-mono">{n.rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight Distribution */}
              <div>
                <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-4">
                  Weight Distribution
                </p>
                <div className="space-y-2">
                  {METRICS.sort((a, b) => b.weight - a.weight).map((m) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <span className="text-xs text-uc-muted w-32 shrink-0">{m.name}</span>
                      <div className="flex-1 h-2 bg-uc-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(m.weight / 18) * 100}%`,
                            background: `linear-gradient(90deg, rgba(212,168,67,0.4), rgba(212,168,67,0.8))`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-uc-white w-8 text-right">
                        {m.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Grade Tiers ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              Grade Tiers
            </h2>
            <p className="text-uc-muted text-sm mb-10">
              DNA scores map to letter grades that indicate prospect tier and projection.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GRADE_TIERS.map((t, i) => (
              <Reveal key={t.grade} delay={i * 0.06}>
                <div
                  className="rounded-2xl p-5 border transition-colors hover:border-opacity-40"
                  style={{
                    background: `${t.color}06`,
                    borderColor: `${t.color}20`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xl font-mono font-bold"
                      style={{ color: t.color }}
                    >
                      {t.grade}
                    </span>
                    <span className="text-xs font-mono text-uc-muted">
                      {t.range}
                    </span>
                  </div>
                  <p className="text-uc-light text-xs leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Verification Process ─── */}
      <section className="py-20 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              Verification Process
            </h2>
            <p className="text-uc-muted text-sm mb-12">
              Every Under Center profile goes through a standardized pipeline to
              ensure data integrity and evaluation consistency.
            </p>
          </Reveal>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Data Capture",
                description:
                  "On-field testing session with radar guns, high-speed cameras, and motion capture. All equipment calibrated to NFL Combine standards.",
              },
              {
                step: "02",
                title: "Multi-Evaluator Review",
                description:
                  "Minimum 3 independent evaluators grade film and metrics using standardized rubric. Inter-rater reliability threshold: > 0.85.",
              },
              {
                step: "03",
                title: "Normalization & Scoring",
                description:
                  "Raw metrics are normalized to 0–100 scale with inverted axes for time-based metrics. Weighted composite DNA score computed.",
              },
              {
                step: "04",
                title: "Verified Badge",
                description:
                  "Profile receives Verified status with timestamp. All metrics become immutable — any re-evaluation creates a new verified snapshot.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="flex gap-6 relative">
                  {/* Timeline line */}
                  {i < 3 && (
                    <div className="absolute left-[19px] top-12 w-[2px] h-full bg-uc-border" />
                  )}
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-xl bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center shrink-0 z-10">
                    <span className="text-uc-gold font-mono text-xs font-bold">{s.step}</span>
                  </div>
                  {/* Content */}
                  <div className="pb-10">
                    <h3 className="text-uc-white font-semibold text-lg mb-1">{s.title}</h3>
                    <p className="text-uc-light text-sm leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-3">
              See It in Action
            </h2>
            <p className="text-uc-muted text-sm mb-8 max-w-md mx-auto">
              Explore verified QB profiles, compare athletes head-to-head,
              or simulate your own profiles in the DNA Lab.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/rankings"
                className="px-6 py-3 bg-uc-gold text-black font-semibold rounded-xl text-sm hover:bg-uc-gold/90 transition-colors"
              >
                View Rankings
              </Link>
              <Link
                href="/lab"
                className="px-6 py-3 bg-uc-dark border border-uc-border text-uc-light font-medium rounded-xl text-sm hover:border-uc-gold/30 hover:text-uc-white transition-colors"
              >
                Open DNA Lab
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-uc-dark border border-uc-border text-uc-light font-medium rounded-xl text-sm hover:border-uc-gold/30 hover:text-uc-white transition-colors"
              >
                Compare QBs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-uc-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-[8px]">UC</span>
            </div>
            <span className="text-uc-muted text-xs">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-muted/50">
            © {new Date().getFullYear()} Under Center. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
