"use client";

import {
  athletes,
  computeDnaScore,
  dnaGrade,
  dnaGradeColor,
  getRadarData,
} from "@/lib/athletes";
import type { Athlete } from "@/lib/athletes";
import RadarChart from "@/components/RadarChart";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";

/* ─── Reveal ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  COMPARE VIEW                                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function CompareView() {
  const [slugA, setSlugA] = useState(athletes[0].slug);
  const [slugB, setSlugB] = useState(athletes[1].slug);

  const athleteA = useMemo(
    () => athletes.find((a) => a.slug === slugA) ?? athletes[0],
    [slugA]
  );
  const athleteB = useMemo(
    () => athletes.find((a) => a.slug === slugB) ?? athletes[1],
    [slugB]
  );

  const scoreA = computeDnaScore(athleteA.metrics);
  const scoreB = computeDnaScore(athleteB.metrics);

  const radarA = getRadarData(athleteA.metrics);
  const radarB = getRadarData(athleteB.metrics);

  return (
    <>
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
          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="text-xs text-uc-gold font-semibold"
            >
              Compare
            </Link>
            <Link
              href="/rankings"
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              Rankings
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-24 pb-6 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-uc-gold text-xs uppercase tracking-widest font-semibold mb-3">
              Head-to-Head
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white mb-3">
              QB Comparison
            </h1>
            <p className="text-uc-muted text-sm max-w-xl">
              Overlapping radar charts, metric-by-metric breakdowns, and
              composite DNA analysis — side by side.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Selectors ─── */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <AthleteSelector
            value={slugA}
            onChange={setSlugA}
            color={athleteA.accentColor}
            exclude={slugB}
          />
          <div className="text-uc-muted text-lg font-bold">VS</div>
          <AthleteSelector
            value={slugB}
            onChange={setSlugB}
            color={athleteB.accentColor}
            exclude={slugA}
          />
        </div>
      </section>

      {/* ─── DNA Score Comparison ─── */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* Player A */}
              <div className="text-right">
                <div
                  className="text-4xl font-mono font-bold"
                  style={{ color: athleteA.accentColor }}
                >
                  {scoreA}
                </div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: dnaGradeColor(scoreA) }}
                >
                  {dnaGrade(scoreA)}
                </div>
                <p className="text-uc-muted text-sm mt-1">{athleteA.name}</p>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-uc-muted uppercase tracking-widest">
                  DNA Score
                </span>
                <div className="w-px h-10 bg-uc-border" />
              </div>

              {/* Player B */}
              <div className="text-left">
                <div
                  className="text-4xl font-mono font-bold"
                  style={{ color: athleteB.accentColor }}
                >
                  {scoreB}
                </div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: dnaGradeColor(scoreB) }}
                >
                  {dnaGrade(scoreB)}
                </div>
                <p className="text-uc-muted text-sm mt-1">{athleteB.name}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Overlapping Radar ─── */}
      <section className="px-6 py-16 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <Reveal>
            <h2 className="text-xl font-bold text-uc-white mb-8 text-center">
              Radar Overlay
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <RadarChart
              data={radarA}
              color={athleteA.accentColor}
              size={340}
              label={athleteA.lastName}
              overlay={{
                data: radarB,
                color: athleteB.accentColor,
                label: athleteB.lastName,
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* ─── Metric-by-Metric ─── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-xl font-bold text-uc-white mb-8 text-center">
              Metric Breakdown
            </h2>
          </Reveal>

          <div className="space-y-4">
            {METRIC_LABELS.map((m, i) => (
              <Reveal key={m.key} delay={i * 0.04}>
                <MetricBar
                  label={m.label}
                  valueA={getMetricDisplay(athleteA, m.key)}
                  valueB={getMetricDisplay(athleteB, m.key)}
                  pctA={normalizeMetric(athleteA, m.key)}
                  pctB={normalizeMetric(athleteB, m.key)}
                  colorA={athleteA.accentColor}
                  colorB={athleteB.accentColor}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Season Stats ─── */}
      <section className="px-6 py-16 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-xl font-bold text-uc-white mb-8 text-center">
              Season Stats
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-5">
              {STAT_LABELS.map((s) => {
                const aVal = getStatValue(athleteA, s.key);
                const bVal = getStatValue(athleteB, s.key);
                const aWins = compareStatValue(aVal, bVal, s.key);
                return (
                  <div
                    key={s.key}
                    className="contents"
                  >
                    <div className="text-right">
                      <span
                        className={`text-lg font-mono font-bold ${
                          aWins ? "text-uc-white" : "text-uc-muted"
                        }`}
                      >
                        {formatStat(aVal, s.key)}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-uc-muted uppercase tracking-wider">
                        {s.label}
                      </span>
                    </div>
                    <div className="text-left">
                      <span
                        className={`text-lg font-mono font-bold ${
                          !aWins ? "text-uc-white" : "text-uc-muted"
                        }`}
                      >
                        {formatStat(bVal, s.key)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── NFL Comparisons ─── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-xl font-bold text-uc-white mb-8 text-center">
              NFL Comparisons
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[athleteA, athleteB].map((a) => (
              <Reveal key={a.id} delay={a === athleteB ? 0.1 : 0}>
                <div className="space-y-3">
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: a.accentColor }}
                  >
                    {a.name}
                  </p>
                  {a.nflComparisons.map((comp) => (
                    <div
                      key={comp.name}
                      className="flex items-center justify-between bg-uc-dark border border-uc-border rounded-xl px-5 py-3"
                    >
                      <div>
                        <span className="text-uc-white font-semibold text-sm">
                          {comp.name}
                        </span>
                        <p className="text-uc-muted text-xs">{comp.trait}</p>
                      </div>
                      <span
                        className="text-xs font-mono font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: `${a.accentColor}15`,
                          color: a.accentColor,
                        }}
                      >
                        {comp.similarity}%
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Profile Links ─── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/athlete/${athleteA.slug}`}
            className="text-sm bg-uc-dark border border-uc-border text-uc-light px-6 py-3 rounded-xl hover:border-uc-gold/30 transition-colors"
          >
            {athleteA.name}&apos;s Profile →
          </Link>
          <Link
            href={`/athlete/${athleteB.slug}`}
            className="text-sm bg-uc-dark border border-uc-border text-uc-light px-6 py-3 rounded-xl hover:border-uc-gold/30 transition-colors"
          >
            {athleteB.name}&apos;s Profile →
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-uc-border py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-[10px]">UC</span>
            </div>
            <span className="text-uc-white font-medium text-sm">
              Under Center
            </span>
          </Link>
          <p className="text-xs text-uc-muted">
            © {new Date().getFullYear()} Under Center. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  ATHLETE SELECTOR                                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function AthleteSelector({
  value,
  onChange,
  color,
  exclude,
}: {
  value: string;
  onChange: (slug: string) => void;
  color: string;
  exclude: string;
}) {
  const selected = athletes.find((a) => a.slug === value);

  return (
    <div className="flex-1 w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-uc-dark border rounded-xl px-5 py-4 text-uc-white text-sm font-semibold appearance-none cursor-pointer outline-none transition-colors"
        style={{ borderColor: `${color}40` }}
      >
        {athletes
          .filter((a) => a.slug !== exclude)
          .map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name} — {a.starRating}★ · {a.highSchool}
            </option>
          ))}
      </select>
      {selected && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
          <span className="text-[10px] text-uc-muted">
            {selected.position} · Class of {selected.class} · {selected.state}
          </span>
        </div>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  METRIC BAR (bidirectional)                                   */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function MetricBar({
  label,
  valueA,
  valueB,
  pctA,
  pctB,
  colorA,
  colorB,
}: {
  label: string;
  valueA: string;
  valueB: string;
  pctA: number;
  pctB: number;
  colorA: string;
  colorB: string;
}) {
  const aWins = pctA >= pctB;

  return (
    <div className="grid grid-cols-[80px_1fr_100px_1fr_80px] items-center gap-3">
      {/* Value A */}
      <div className="text-right">
        <span
          className={`text-sm font-mono font-bold ${aWins ? "text-uc-white" : "text-uc-muted"}`}
        >
          {valueA}
        </span>
      </div>

      {/* Bar A (right-aligned, fills left) */}
      <div className="h-2.5 bg-uc-border/30 rounded-full overflow-hidden flex justify-end">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pctA}%`,
            background: `linear-gradient(90deg, ${colorA}55, ${colorA})`,
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center">
        <span className="text-[10px] text-uc-muted uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>

      {/* Bar B (left-aligned, fills right) */}
      <div className="h-2.5 bg-uc-border/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pctB}%`,
            background: `linear-gradient(270deg, ${colorB}55, ${colorB})`,
          }}
        />
      </div>

      {/* Value B */}
      <div className="text-left">
        <span
          className={`text-sm font-mono font-bold ${!aWins ? "text-uc-white" : "text-uc-muted"}`}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  DATA HELPERS                                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type MetricKey =
  | "armStrength"
  | "releaseTime"
  | "accuracy"
  | "decisionSpeed"
  | "pocketPresence"
  | "athleticism"
  | "filmGrade"
  | "mechanicsGrade";

const METRIC_LABELS: { key: MetricKey; label: string }[] = [
  { key: "armStrength", label: "Arm" },
  { key: "releaseTime", label: "Release" },
  { key: "accuracy", label: "Accuracy" },
  { key: "decisionSpeed", label: "Decision" },
  { key: "pocketPresence", label: "Pocket" },
  { key: "athleticism", label: "Athletic" },
  { key: "filmGrade", label: "Film" },
  { key: "mechanicsGrade", label: "Mechanics" },
];

function getMetricDisplay(a: Athlete, key: MetricKey): string {
  const v = a.metrics[key];
  switch (key) {
    case "releaseTime":
      return `${v}s`;
    case "accuracy":
      return `${v}%`;
    case "decisionSpeed":
      return `${v}ms`;
    default:
      return String(v);
  }
}

function normalizeMetric(a: Athlete, key: MetricKey): number {
  const v = a.metrics[key];
  switch (key) {
    case "releaseTime":
      return Math.round(((0.50 - v) / 0.20) * 100);
    case "decisionSpeed":
      return Math.round(((300 - v) / 200) * 100);
    default:
      return v;
  }
}

type StatKey = "games" | "compPct" | "yards" | "touchdowns" | "interceptions" | "qbr";

const STAT_LABELS: { key: StatKey; label: string }[] = [
  { key: "games", label: "Games" },
  { key: "compPct", label: "Comp %" },
  { key: "yards", label: "Yards" },
  { key: "touchdowns", label: "TD" },
  { key: "interceptions", label: "INT" },
  { key: "qbr", label: "QBR" },
];

function getStatValue(a: Athlete, key: StatKey): number {
  if (key === "compPct") {
    return Math.round((a.seasonStats.completions / a.seasonStats.attempts) * 100);
  }
  return a.seasonStats[key as keyof Athlete["seasonStats"]] as number;
}

function compareStatValue(a: number, b: number, key: StatKey): boolean {
  if (key === "interceptions") return a <= b; // fewer is better
  return a >= b;
}

function formatStat(val: number, key: StatKey): string {
  if (key === "compPct") return `${val}%`;
  if (key === "yards") return val.toLocaleString();
  return String(val);
}
