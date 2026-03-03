"use client";

import type { Athlete } from "@/lib/athletes";
import { computeDnaScore, dnaGrade, dnaGradeColor, getRadarData } from "@/lib/athletes";
import RadarChart from "@/components/RadarChart";
import Reveal, { useReveal } from "@/components/Reveal";
import Stars from "@/components/Stars";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useWatchlist } from "@/app/watchlist/WatchlistView";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Grade Bar ─── */
function GradeBar({
  label,
  value,
  max = 99,
  color,
  visible,
  delay = 0,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  visible: boolean;
  delay?: number;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-uc-muted group-hover:text-uc-light transition-colors">
          {label}
        </span>
        <span className="text-sm font-mono font-bold text-uc-white">
          {value}
        </span>
      </div>
      <div className="h-2 bg-uc-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transitionDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  ATHLETE PROFILE                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AthleteProfile({ athlete }: { athlete: Athlete }) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const { isWatched, toggle: toggleWatch } = useWatchlist();

  const score = computeDnaScore(athlete.metrics);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMetricsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const completionPct = Math.round(
    (athlete.seasonStats.completions / athlete.seasonStats.attempts) * 100
  );

  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-12 px-6 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04]"
          style={{ background: athlete.accentColor }}
        />

        <div className="max-w-5xl mx-auto relative">
          <Reveal>
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0"
                style={{
                  background: `${athlete.accentColor}15`,
                  border: `2px solid ${athlete.accentColor}40`,
                }}
              >
                {athlete.avatarInitials}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white">
                    {athlete.name}
                  </h1>
                  {athlete.verified && (
                    <span className="inline-flex items-center gap-1.5 bg-uc-gold/10 border border-uc-gold/30 text-uc-gold text-xs font-semibold px-3 py-1 rounded-full animate-verified">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p className="text-uc-light text-base mb-3">
                  {athlete.position} · Class of {athlete.class} ·{" "}
                  {athlete.height} · {athlete.weight} lbs
                </p>
                <p className="text-uc-muted text-sm mb-4">
                  {athlete.highSchool} — {athlete.city}, {athlete.state}
                </p>

                <div className="flex items-center gap-4">
                  <Stars count={athlete.starRating} size="lg" />
                  <span className="text-xs text-uc-muted uppercase tracking-wider">
                    {athlete.starRating}-Star · GPA {athlete.gpa}
                  </span>
                </div>
              </div>

              {/* Recruiting Status + Watch */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div
                  className="px-6 py-3 rounded-xl border text-sm font-semibold"
                  style={{
                    background: `${athlete.accentColor}08`,
                    borderColor: `${athlete.accentColor}30`,
                    color: athlete.accentColor,
                  }}
                >
                  {athlete.recruitingStatus}
                </div>
                <p className="text-[10px] text-uc-muted uppercase tracking-wider">
                  Recruiting Status
                </p>
                <button
                  onClick={() => toggleWatch(athlete.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isWatched(athlete.slug)
                      ? "bg-uc-gold/10 border-uc-gold/30 text-uc-gold"
                      : "bg-uc-dark border-uc-border text-uc-muted hover:border-uc-gold/20 hover:text-uc-gold"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill={isWatched(athlete.slug) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  {isWatched(athlete.slug) ? "Watching" : "Watch"}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Season Stats Bar ─── */}
      <section className="py-8 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-6">
              {[
                { label: "Games", value: athlete.seasonStats.games },
                { label: "Comp %", value: `${completionPct}%` },
                {
                  label: "Comp/Att",
                  value: `${athlete.seasonStats.completions}/${athlete.seasonStats.attempts}`,
                },
                {
                  label: "Yards",
                  value: athlete.seasonStats.yards.toLocaleString(),
                },
                { label: "TD", value: athlete.seasonStats.touchdowns },
                { label: "INT", value: athlete.seasonStats.interceptions },
                { label: "QBR", value: athlete.seasonStats.qbr },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-lg md:text-xl font-mono font-bold text-uc-white">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-uc-muted uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── QB DNA Score ─── */}
      <section className="py-16 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Radar Chart */}
              <div className="shrink-0">
                <RadarChart
                  data={getRadarData(athlete.metrics)}
                  color={athlete.accentColor}
                  size={280}
                />
              </div>

              {/* DNA Score Card */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
                  Composite DNA Score
                </p>
                <div className="flex items-baseline gap-3 justify-center md:justify-start mb-2">
                  <span
                    className="text-6xl font-mono font-bold"
                    style={{ color: gradeColor }}
                  >
                    {score}
                  </span>
                  <span
                    className="text-lg font-semibold uppercase tracking-wider"
                    style={{ color: gradeColor }}
                  >
                    {grade}
                  </span>
                </div>
                <p className="text-uc-muted text-sm max-w-md">
                  Weighted composite across all 8 verified metrics — arm
                  strength, release, accuracy, decision speed, pocket presence,
                  athleticism, film grade, and mechanics.
                </p>
                <div className="mt-6">
                  <Link
                    href={`/compare?a=${athlete.slug}`}
                    className="inline-flex items-center gap-2 text-xs bg-uc-panel border border-uc-border text-uc-light px-5 py-2.5 rounded-xl hover:border-uc-gold/20 transition-colors"
                  >
                    Compare with another QB →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Metrics Grid ─── */}
      <section className="py-20 px-6" ref={metricsRef}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              Verified Metrics
            </h2>
            <p className="text-uc-muted text-sm mb-10">
              Verified on{" "}
              {new Date(athlete.verifiedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { label: "Arm Strength", value: athlete.metrics.armStrength },
              { label: "Release Time", value: athlete.metrics.releaseTime, max: 1, invert: true },
              { label: "Accuracy", value: athlete.metrics.accuracy },
              { label: "Decision Speed", value: Math.round(100 - (athlete.metrics.decisionSpeed / 3)), max: 99 },
              { label: "Pocket Presence", value: athlete.metrics.pocketPresence },
              { label: "Athleticism", value: athlete.metrics.athleticism },
              { label: "Film Grade", value: athlete.metrics.filmGrade },
              { label: "Mechanics Grade", value: athlete.metrics.mechanicsGrade },
            ].map((m, i) => (
              <GradeBar
                key={m.label}
                label={m.label}
                value={typeof m.value === "number" && m.value < 1 ? m.value : Math.round(m.value as number)}
                max={m.max || 99}
                color={athlete.accentColor}
                visible={metricsVisible}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Quick-read metrics below */}
          <Reveal delay={0.3}>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-uc-dark border border-uc-border rounded-xl p-5 text-center">
                <div className="text-2xl font-mono font-bold text-uc-white">
                  {athlete.metrics.releaseTime}s
                </div>
                <div className="text-[10px] text-uc-muted uppercase tracking-wider mt-1">
                  Release Time
                </div>
              </div>
              <div className="bg-uc-dark border border-uc-border rounded-xl p-5 text-center">
                <div className="text-2xl font-mono font-bold text-uc-white">
                  {athlete.metrics.decisionSpeed}ms
                </div>
                <div className="text-[10px] text-uc-muted uppercase tracking-wider mt-1">
                  Decision Speed
                </div>
              </div>
              <div className="bg-uc-dark border border-uc-border rounded-xl p-5 text-center">
                <div className="text-2xl font-mono font-bold text-uc-white">
                  {athlete.metrics.accuracy}%
                </div>
                <div className="text-[10px] text-uc-muted uppercase tracking-wider mt-1">
                  Accuracy Rate
                </div>
              </div>
              <div className="bg-uc-dark border border-uc-border rounded-xl p-5 text-center">
                <div className="text-2xl font-mono font-bold text-uc-white">
                  {athlete.metrics.armStrength}
                </div>
                <div className="text-[10px] text-uc-muted uppercase tracking-wider mt-1">
                  Arm Grade
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── NFL Comparisons ─── */}
      <section className="py-20 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">
              NFL Comparisons
            </h2>
            <p className="text-uc-muted text-sm mb-10">
              Based on verified mechanics, arm data, and play style analysis.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {athlete.nflComparisons.map((comp, i) => (
              <Reveal key={comp.name} delay={i * 0.1}>
                <div className="bg-uc-panel border border-uc-border rounded-2xl p-6 hover:border-uc-gold/20 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-uc-white font-semibold text-lg">
                      {comp.name}
                    </h3>
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        background: `${athlete.accentColor}15`,
                        color: athlete.accentColor,
                      }}
                    >
                      {comp.similarity}%
                    </span>
                  </div>
                  <p className="text-uc-light text-sm">{comp.trait}</p>
                  <div className="mt-4 h-1.5 bg-uc-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${comp.similarity}%`,
                        background: `linear-gradient(90deg, ${athlete.accentColor}66, ${athlete.accentColor})`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Offers ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">Offers</h2>
            <p className="text-uc-muted text-sm mb-10">
              {athlete.offers.length} program
              {athlete.offers.length !== 1 ? "s" : ""}
            </p>
          </Reveal>

          <div className="space-y-3">
            {athlete.offers.map((offer, i) => (
              <Reveal key={offer.school} delay={i * 0.06}>
                <div className="flex items-center justify-between bg-uc-dark border border-uc-border rounded-xl px-6 py-4 hover:border-uc-gold/15 transition-colors">
                  <div>
                    <span className="text-uc-white font-semibold">
                      {offer.school}
                    </span>
                    <span className="text-uc-muted text-sm ml-3">
                      {offer.conference}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      offer.status === "committed"
                        ? "bg-uc-green/10 text-uc-green border border-uc-green/20"
                        : offer.status === "offered"
                          ? "bg-uc-gold/10 text-uc-gold border border-uc-gold/20"
                          : "bg-uc-blue/10 text-uc-blue border border-uc-blue/20"
                    }`}
                  >
                    {offer.status === "committed"
                      ? "✓ Committed"
                      : offer.status === "offered"
                        ? "Offered"
                        : "Interested"}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Film ─── */}
      <section className="py-20 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-uc-white mb-2">Film</h2>
            <p className="text-uc-muted text-sm mb-10">
              Verified game film and evaluation clips.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {athlete.filmClips.map((clip, i) => (
              <Reveal key={clip.title} delay={i * 0.1}>
                <div className="bg-uc-panel border border-uc-border rounded-2xl overflow-hidden hover:border-uc-gold/20 transition-colors group">
                  {/* Film placeholder */}
                  <div className="aspect-video bg-uc-black flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full bg-uc-white/10 flex items-center justify-center group-hover:bg-uc-white/20 transition-colors">
                      <span className="text-uc-white text-xl ml-1">▶</span>
                    </div>
                    <span className="absolute bottom-2 right-3 text-[10px] text-uc-muted bg-uc-black/80 px-2 py-0.5 rounded">
                      {clip.plays} plays
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-uc-white font-semibold text-sm mb-1">
                      {clip.title}
                    </h3>
                    <p className="text-uc-muted text-xs">
                      {new Date(clip.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NIL Valuation Insights ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-uc-white">
                NIL Valuation Insights
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-2.5 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <p className="text-uc-muted text-sm mb-10">
              Projected NIL value range powered by the NIL33 institutional underwriting engine.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-uc-dark border border-uc-border rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Estimated Range */}
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-2">
                    Estimated NIL Range
                  </p>
                  <div className="flex items-baseline gap-1 justify-center md:justify-start">
                    <span className="text-3xl font-mono font-bold text-uc-gold">
                      ${(() => {
                        const base = score >= 85 ? 800 : score >= 75 ? 400 : score >= 65 ? 150 : 50;
                        const starMult = athlete.starRating >= 5 ? 2.5 : athlete.starRating >= 4 ? 1.5 : 1;
                        const low = Math.round(base * starMult);
                        return `${low}K`;
                      })()}
                    </span>
                    <span className="text-uc-muted text-sm">–</span>
                    <span className="text-3xl font-mono font-bold text-uc-gold">
                      ${(() => {
                        const base = score >= 85 ? 800 : score >= 75 ? 400 : score >= 65 ? 150 : 50;
                        const starMult = athlete.starRating >= 5 ? 2.5 : athlete.starRating >= 4 ? 1.5 : 1;
                        const high = Math.round(base * starMult * 2.2);
                        return high >= 1000 ? `${(high / 1000).toFixed(1)}M` : `${high}K`;
                      })()}
                    </span>
                  </div>
                  <p className="text-[9px] text-uc-muted mt-1">Annual projected value</p>
                </div>

                {/* DNA Contribution */}
                <div className="text-center">
                  <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-2">
                    DNA Score Factor
                  </p>
                  <div className="flex items-baseline gap-2 justify-center">
                    <span className="text-3xl font-mono font-bold" style={{ color: gradeColor }}>
                      {score}
                    </span>
                    <span className="text-sm font-semibold uppercase" style={{ color: gradeColor }}>
                      {grade}
                    </span>
                  </div>
                  <p className="text-[9px] text-uc-muted mt-1">Primary valuation driver</p>
                </div>

                {/* Market Factors */}
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-2">
                    Market Signals
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    <span className="text-xs bg-uc-panel border border-uc-border px-2.5 py-1 rounded-lg text-uc-light">
                      {athlete.offers.length} Offers
                    </span>
                    <span className="text-xs bg-uc-panel border border-uc-border px-2.5 py-1 rounded-lg text-uc-light">
                      {athlete.starRating}★ Rating
                    </span>
                    <span className="text-xs bg-uc-panel border border-uc-border px-2.5 py-1 rounded-lg text-uc-light">
                      {athlete.state} Market
                    </span>
                  </div>
                </div>
              </div>

              {/* Valuation Drivers */}
              <div className="border-t border-uc-border pt-6">
                <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-4">
                  Key Valuation Drivers
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Performance", value: Math.round(score), icon: "📊" },
                    { label: "Marketability", value: Math.round(athlete.starRating * 20), icon: "📱" },
                    { label: "School Pipeline", value: Math.min(99, athlete.offers.length * 12), icon: "🏟️" },
                    { label: "Position Premium", value: 95, icon: "🎯" },
                  ].map((d) => (
                    <div key={d.label} className="bg-uc-black/50 rounded-xl p-3 border border-uc-border/50 text-center">
                      <div className="text-lg mb-1">{d.icon}</div>
                      <div className="text-sm font-mono font-bold text-uc-white">{d.value}</div>
                      <div className="text-[9px] text-uc-muted uppercase tracking-wider mt-0.5">{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-uc-muted/50 mt-6 text-center">
                NIL valuations are projections based on verified metrics + market data. Powered by NIL33 Engine.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Share CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <p className="text-uc-muted text-xs uppercase tracking-widest mb-4">
              Share This Profile
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-uc-white mb-6">
              Get {athlete.firstName}&apos;s verified card
            </h2>
            <Link
              href={`/card/${athlete.slug}`}
              className="inline-flex items-center gap-2 bg-uc-gold text-black font-semibold px-7 py-3 rounded-xl hover:bg-uc-gold/90 transition-colors text-sm"
            >
              View Shareable Card
              <span className="text-base">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
