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

/* ─── Sort Options ─── */
type SortKey = "dnaScore" | "starRating" | "yards" | "touchdowns" | "qbr" | "accuracy";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "dnaScore", label: "DNA Score" },
  { key: "starRating", label: "Star Rating" },
  { key: "yards", label: "Passing Yards" },
  { key: "touchdowns", label: "Touchdowns" },
  { key: "qbr", label: "QBR" },
  { key: "accuracy", label: "Accuracy" },
];

/* ─── Filter Options ─── */
const CLASS_OPTIONS = ["All", "2026", "2027"];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  RANKINGS VIEW                                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function RankingsView() {
  const [sortBy, setSortBy] = useState<SortKey>("dnaScore");
  const [classFilter, setClassFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    let list = [...athletes];

    // Class filter
    if (classFilter !== "All") {
      list = list.filter((a) => a.class === classFilter);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "dnaScore":
          return computeDnaScore(b.metrics) - computeDnaScore(a.metrics);
        case "starRating":
          return b.starRating - a.starRating || computeDnaScore(b.metrics) - computeDnaScore(a.metrics);
        case "yards":
          return b.seasonStats.yards - a.seasonStats.yards;
        case "touchdowns":
          return b.seasonStats.touchdowns - a.seasonStats.touchdowns;
        case "qbr":
          return b.seasonStats.qbr - a.seasonStats.qbr;
        case "accuracy":
          return b.metrics.accuracy - a.metrics.accuracy;
        default:
          return 0;
      }
    });

    return list;
  }, [sortBy, classFilter]);

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
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/rankings"
              className="text-xs text-uc-gold font-semibold"
            >
              Rankings
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-uc-gold text-xs uppercase tracking-widest font-semibold mb-3">
              QB DNA Rankings
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white mb-3">
              Verified Quarterback Leaderboard
            </h1>
            <p className="text-uc-muted text-sm max-w-xl">
              Every metric verified. Every score computed. The definitive ranking
              of prep quarterbacks powered by composite DNA analysis.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Controls ─── */}
      <section className="px-6 pb-8 sticky top-14 z-40 bg-uc-black/95 backdrop-blur-lg border-b border-uc-border">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3 pt-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-uc-muted uppercase tracking-wider">
              Sort
            </span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  sortBy === opt.key
                    ? "bg-uc-gold/10 border-uc-gold/30 text-uc-gold"
                    : "border-uc-border text-uc-muted hover:border-uc-gold/15 hover:text-uc-light"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-uc-border mx-1" />

          {/* Class filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-uc-muted uppercase tracking-wider">
              Class
            </span>
            {CLASS_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  classFilter === c
                    ? "bg-uc-gold/10 border-uc-gold/30 text-uc-gold"
                    : "border-uc-border text-uc-muted hover:border-uc-gold/15 hover:text-uc-light"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[11px] text-uc-muted">
            {sorted.length} athlete{sorted.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* ─── Table ─── */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-3">
          {sorted.map((athlete, i) => (
            <RankingRow
              key={athlete.id}
              athlete={athlete}
              rank={i + 1}
              expanded={expanded === athlete.id}
              onToggle={() =>
                setExpanded(expanded === athlete.id ? null : athlete.id)
              }
            />
          ))}

          {sorted.length === 0 && (
            <div className="text-center py-20 text-uc-muted text-sm">
              No athletes match the current filters.
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-uc-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
/*  RANKING ROW (expandable)                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function RankingRow({
  athlete,
  rank,
  expanded,
  onToggle,
}: {
  athlete: Athlete;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const score = computeDnaScore(athlete.metrics);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        expanded
          ? "bg-uc-dark border-uc-gold/20"
          : "bg-uc-dark/50 border-uc-border hover:border-uc-gold/10"
      }`}
    >
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 cursor-pointer text-left"
      >
        {/* Rank */}
        <div className="w-8 text-center">
          <span
            className={`text-lg font-mono font-bold ${
              rank <= 3 ? "text-uc-gold" : "text-uc-muted"
            }`}
          >
            {rank}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
          style={{
            background: `${athlete.accentColor}12`,
            border: `2px solid ${athlete.accentColor}30`,
          }}
        >
          {athlete.avatarInitials}
        </div>

        {/* Name + info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-uc-white font-semibold truncate">
              {athlete.name}
            </span>
            <Stars count={athlete.starRating} />
          </div>
          <p className="text-uc-muted text-xs truncate">
            {athlete.highSchool} · {athlete.state} · Class of {athlete.class}
          </p>
        </div>

        {/* Key stats */}
        <div className="hidden md:flex items-center gap-8">
          <StatCell label="YDS" value={athlete.seasonStats.yards.toLocaleString()} />
          <StatCell label="TD" value={athlete.seasonStats.touchdowns} />
          <StatCell label="QBR" value={athlete.seasonStats.qbr} />
        </div>

        {/* DNA Score */}
        <div className="text-center shrink-0 ml-4">
          <div className="text-xl font-mono font-bold" style={{ color: gradeColor }}>
            {score}
          </div>
          <div
            className="text-[9px] font-semibold uppercase tracking-wider"
            style={{ color: gradeColor }}
          >
            {grade}
          </div>
        </div>

        {/* Chevron */}
        <div className="text-uc-muted ml-2">
          <span
            className="inline-block transition-transform"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-uc-border/50">
          <div className="grid md:grid-cols-[280px_1fr] gap-8">
            {/* Radar */}
            <div className="flex justify-center">
              <RadarChart
                data={getRadarData(athlete.metrics)}
                color={athlete.accentColor}
                size={240}
              />
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Arm Strength", value: athlete.metrics.armStrength },
                { label: "Release", value: `${athlete.metrics.releaseTime}s` },
                { label: "Accuracy", value: `${athlete.metrics.accuracy}%` },
                { label: "Decision", value: `${athlete.metrics.decisionSpeed}ms` },
                { label: "Pocket", value: athlete.metrics.pocketPresence },
                { label: "Athleticism", value: athlete.metrics.athleticism },
                { label: "Film Grade", value: athlete.metrics.filmGrade },
                { label: "Mechanics", value: athlete.metrics.mechanicsGrade },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-uc-panel border border-uc-border rounded-xl p-4 text-center"
                >
                  <div className="text-lg font-mono font-bold text-uc-white">
                    {m.value}
                  </div>
                  <div className="text-[9px] text-uc-muted uppercase tracking-wider mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mt-6">
            <Link
              href={`/athlete/${athlete.slug}`}
              className="text-xs bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-4 py-2 rounded-lg hover:bg-uc-gold/20 transition-colors"
            >
              Full Profile →
            </Link>
            <Link
              href={`/card/${athlete.slug}`}
              className="text-xs bg-uc-dark text-uc-light border border-uc-border px-4 py-2 rounded-lg hover:border-uc-gold/20 transition-colors"
            >
              View Card
            </Link>
            <Link
              href={`/compare?a=${athlete.slug}`}
              className="text-xs bg-uc-dark text-uc-light border border-uc-border px-4 py-2 rounded-lg hover:border-uc-gold/20 transition-colors"
            >
              Compare
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Tiny Helpers ─── */

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${i < count ? "text-uc-gold" : "text-uc-border"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-sm font-mono font-bold text-uc-white">{value}</div>
      <div className="text-[9px] text-uc-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
