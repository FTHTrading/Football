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
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useMemo, useState } from "react";

/* ─── Tier Definitions ─── */
interface Tier {
  label: string;
  tag: string;
  color: string;
  bgColor: string;
  borderColor: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const TIERS: Tier[] = [
  {
    label: "Elite Franchise",
    tag: "ELITE",
    color: "#d4a843",
    bgColor: "rgba(212,168,67,0.06)",
    borderColor: "rgba(212,168,67,0.20)",
    minScore: 90,
    maxScore: 100,
    description: "Generational talent. Program-defining quarterback.",
  },
  {
    label: "Blue Chip",
    tag: "BLUE CHIP",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.06)",
    borderColor: "rgba(59,130,246,0.20)",
    minScore: 82,
    maxScore: 89.99,
    description: "Day-one starter. High-ceiling, low-risk prospect.",
  },
  {
    label: "Impact Starter",
    tag: "STARTER",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.06)",
    borderColor: "rgba(34,197,94,0.20)",
    minScore: 75,
    maxScore: 81.99,
    description: "Ready contributor. Strong foundation with upside.",
  },
  {
    label: "Development",
    tag: "DEV",
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.06)",
    borderColor: "rgba(168,85,247,0.20)",
    minScore: 68,
    maxScore: 74.99,
    description: "High-ceiling prospect needing refinement.",
  },
  {
    label: "Sleeper",
    tag: "SLEEPER",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.20)",
    minScore: 0,
    maxScore: 67.99,
    description: "Under-the-radar talent with breakout potential.",
  },
];

function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];
}

/* ─── Board Card ─── */
function BoardCard({
  athlete,
  rank,
}: {
  athlete: Athlete;
  rank: number;
}) {
  const score = computeDnaScore(athlete.metrics);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);
  const radarData = getRadarData(athlete.metrics);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative bg-uc-dark border border-uc-border rounded-2xl overflow-hidden hover:border-uc-gold/20 transition-all duration-300"
        style={{
          boxShadow: flipped
            ? `0 0 30px ${athlete.accentColor}15`
            : undefined,
        }}
      >
        {/* Rank badge */}
        <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg bg-uc-black/80 border border-uc-border flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-uc-white">
            {rank}
          </span>
        </div>

        {/* Grade badge */}
        <div
          className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold"
          style={{ background: `${gradeColor}20`, color: gradeColor }}
        >
          {grade}
        </div>

        {/* Front: player info */}
        <div
          className={`transition-all duration-300 ${
            flipped ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          {/* Color accent stripe */}
          <div
            className="h-1.5"
            style={{
              background: `linear-gradient(90deg, ${athlete.accentColor}, ${athlete.accentColor}44)`,
            }}
          />

          <div className="p-4 pt-6">
            {/* Name & school */}
            <h3 className="text-sm font-bold text-uc-white leading-tight mb-0.5">
              {athlete.name}
            </h3>
            <p className="text-[11px] text-uc-muted mb-3">
              {athlete.highSchool} · {athlete.state}
            </p>

            {/* Stars + Class */}
            <div className="flex items-center justify-between mb-3">
              <Stars count={athlete.starRating} size="sm" />
              <span className="text-[10px] text-uc-muted font-mono">
                {athlete.class}
              </span>
            </div>

            {/* DNA Score */}
            <div className="flex items-center gap-2">
              <div
                className="text-2xl font-mono font-black"
                style={{ color: gradeColor }}
              >
                {score}
              </div>
              <div className="text-[10px] text-uc-muted uppercase tracking-wider leading-tight">
                DNA
                <br />
                Score
              </div>
            </div>
          </div>
        </div>

        {/* Back: radar chart */}
        <div
          className={`transition-all duration-300 ${
            flipped ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          <div className="p-4">
            <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-2 text-center">
              Metric Profile
            </p>
            <RadarChart
              data={radarData}
              size={160}
              color={athlete.accentColor}
            />
            <div className="mt-2 text-center">
              <Link
                href={`/athlete/${athlete.slug}`}
                className="text-[10px] text-uc-gold hover:text-uc-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Full Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  BOARD VIEW                                                   */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function BoardView() {
  const [viewMode, setViewMode] = useState<"tiers" | "grid">("tiers");

  /* Sort all athletes by DNA score descending */
  const ranked = useMemo(() => {
    return [...athletes]
      .map((a) => ({ athlete: a, score: computeDnaScore(a.metrics) }))
      .sort((a, b) => b.score - a.score);
  }, []);

  /* Group into tiers */
  const tiered = useMemo(() => {
    return TIERS.map((tier) => ({
      tier,
      athletes: ranked.filter(
        (r) => r.score >= tier.minScore && r.score <= tier.maxScore
      ),
    })).filter((t) => t.athletes.length > 0);
  }, [ranked]);

  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-uc-gold text-xs uppercase tracking-widest font-semibold mb-3">
                  Prospect Board
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white mb-2">
                  QB Big Board
                </h1>
                <p className="text-uc-muted text-sm max-w-xl">
                  Every prospect tiered by verified DNA score. Tap any card to
                  reveal their metric profile.
                </p>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-uc-panel border border-uc-border rounded-xl p-1">
                <button
                  onClick={() => setViewMode("tiers")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === "tiers"
                      ? "bg-uc-gold/10 text-uc-gold"
                      : "text-uc-muted hover:text-uc-white"
                  }`}
                >
                  Tiered
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-uc-gold/10 text-uc-gold"
                      : "text-uc-muted hover:text-uc-white"
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Board summary ─── */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {TIERS.map((tier) => {
                const count = ranked.filter(
                  (r) => r.score >= tier.minScore && r.score <= tier.maxScore
                ).length;
                return (
                  <div
                    key={tier.tag}
                    className="flex items-center gap-2 bg-uc-dark border border-uc-border rounded-xl px-4 py-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: tier.color }}
                    />
                    <span className="text-xs text-uc-light">{tier.label}</span>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: tier.color }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Tiered View ─── */}
      {viewMode === "tiers" && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto space-y-12">
            {tiered.map(({ tier, athletes: tierAthletes }, ti) => (
              <Reveal key={tier.tag} delay={ti * 0.1}>
                <div
                  className="rounded-2xl border p-6"
                  style={{
                    background: tier.bgColor,
                    borderColor: tier.borderColor,
                  }}
                >
                  {/* Tier header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${tier.color}20`, color: tier.color }}
                    >
                      {tier.tag}
                    </span>
                    <h2
                      className="text-lg font-bold"
                      style={{ color: tier.color }}
                    >
                      {tier.label}
                    </h2>
                    <span className="text-xs text-uc-muted ml-auto">
                      {tier.minScore}–{Math.ceil(tier.maxScore)} DNA
                    </span>
                  </div>
                  <p className="text-xs text-uc-muted mb-5">
                    {tier.description}
                  </p>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tierAthletes.map((r, i) => {
                      const globalRank =
                        ranked.findIndex(
                          (x) => x.athlete.id === r.athlete.id
                        ) + 1;
                      return (
                        <BoardCard
                          key={r.athlete.id}
                          athlete={r.athlete}
                          rank={globalRank}
                        />
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── Grid View ─── */}
      {viewMode === "grid" && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ranked.map((r, i) => (
                <Reveal key={r.athlete.id} delay={i * 0.04}>
                  <BoardCard athlete={r.athlete} rank={i + 1} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Methodology CTA ─── */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-uc-dark border border-uc-border rounded-2xl p-8 text-center">
              <p className="text-[10px] text-uc-gold uppercase tracking-widest mb-3">
                How We Rank
              </p>
              <h3 className="text-xl font-bold text-uc-white mb-3">
                Every tier is earned, not assigned
              </h3>
              <p className="text-sm text-uc-muted mb-6 max-w-md mx-auto">
                Board placement is computed from 8 verified metrics using our
                composite DNA scoring algorithm. No subjective rankings.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/methodology"
                  className="text-sm bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-5 py-2.5 rounded-xl hover:bg-uc-gold/20 transition-colors"
                >
                  Read Methodology
                </Link>
                <Link
                  href="/lab"
                  className="text-sm text-uc-muted border border-uc-border px-5 py-2.5 rounded-xl hover:border-uc-gold/20 hover:text-uc-white transition-colors"
                >
                  Try DNA Lab
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
