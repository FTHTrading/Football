"use client";

import {
  athletes,
  computeDnaScore,
  dnaGrade,
  dnaGradeColor,
  getRadarData,
} from "@/lib/athletes";
import type { AthleteMetrics } from "@/lib/athletes";
import RadarChart from "@/components/RadarChart";
import Reveal from "@/components/Reveal";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  SLIDER CONFIG                                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface SliderDef {
  key: keyof AthleteMetrics;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  format: (v: number) => string;
}

const SLIDERS: SliderDef[] = [
  { key: "armStrength",    label: "Arm Strength",    min: 50, max: 99, step: 1,    unit: "",   format: (v) => `${v}` },
  { key: "releaseTime",   label: "Release Time",    min: 0.28, max: 0.50, step: 0.01, unit: "s",  format: (v) => `${v.toFixed(2)}s` },
  { key: "accuracy",      label: "Accuracy",        min: 50, max: 99, step: 1,    unit: "%",  format: (v) => `${v}%` },
  { key: "decisionSpeed", label: "Decision Speed",  min: 100, max: 300, step: 5,   unit: "ms", format: (v) => `${v}ms` },
  { key: "pocketPresence",label: "Pocket Presence", min: 50, max: 99, step: 1,    unit: "",   format: (v) => `${v}` },
  { key: "athleticism",   label: "Athleticism",      min: 50, max: 99, step: 1,    unit: "",   format: (v) => `${v}` },
  { key: "filmGrade",     label: "Film Grade",       min: 50, max: 99, step: 1,    unit: "",   format: (v) => `${v}` },
  { key: "mechanicsGrade",label: "Mechanics Grade",  min: 50, max: 99, step: 1,    unit: "",   format: (v) => `${v}` },
];

const DEFAULT_METRICS: AthleteMetrics = {
  armStrength: 82,
  releaseTime: 0.37,
  accuracy: 72,
  decisionSpeed: 190,
  pocketPresence: 80,
  athleticism: 78,
  filmGrade: 80,
  mechanicsGrade: 82,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  DNA LAB VIEW                                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function DnaLabView() {
  const [metrics, setMetrics] = useState<AthleteMetrics>({ ...DEFAULT_METRICS });
  const [preset, setPreset] = useState<string | null>(null);

  const score = useMemo(() => computeDnaScore(metrics), [metrics]);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);
  const radarData = useMemo(() => getRadarData(metrics), [metrics]);

  const handleSlider = useCallback((key: keyof AthleteMetrics, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
    setPreset(null);
  }, []);

  const loadPreset = useCallback((slug: string) => {
    const a = athletes.find((x) => x.slug === slug);
    if (a) {
      setMetrics({ ...a.metrics });
      setPreset(slug);
    }
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({ ...DEFAULT_METRICS });
    setPreset(null);
  }, []);

  /* Find the closest matching athlete based on metric similarity */
  const closestMatch = useMemo(() => {
    let best = athletes[0];
    let bestDist = Infinity;
    for (const a of athletes) {
      let dist = 0;
      for (const s of SLIDERS) {
        const mine = metrics[s.key] as number;
        const his = a.metrics[s.key] as number;
        const range = s.max - s.min;
        dist += ((mine - his) / range) ** 2;
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = a;
      }
    }
    return best;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-uc-black">
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.2)" }}
              >
                Interactive
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white">
                DNA Lab
              </h1>
            </div>
            <p className="text-uc-muted text-sm max-w-lg">
              Adjust the 8 verified metrics to simulate different quarterback profiles.
              Watch the DNA score and radar chart update in real-time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Main Grid ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10">

          {/* Left: Sliders */}
          <div>
            {/* Preset Buttons */}
            <div className="mb-8">
              <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
                Load a QB&apos;s Profile
              </p>
              <div className="flex flex-wrap gap-2">
                {athletes.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => loadPreset(a.slug)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                      preset === a.slug
                        ? "border-uc-gold/50 bg-uc-gold/10 text-uc-gold"
                        : "border-uc-border bg-uc-dark text-uc-muted hover:border-uc-gold/20 hover:text-uc-light"
                    }`}
                  >
                    {a.firstName} {a.lastName.charAt(0)}.
                  </button>
                ))}
                <button
                  onClick={resetMetrics}
                  className="px-3 py-1.5 text-xs rounded-lg border border-uc-border bg-uc-dark text-uc-muted hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              {SLIDERS.map((s) => {
                const val = metrics[s.key] as number;
                return (
                  <div key={s.key} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-uc-muted group-hover:text-uc-light transition-colors">
                        {s.label}
                      </span>
                      <span className="text-sm font-mono font-bold text-uc-white">
                        {s.format(val)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={val}
                      onChange={(e) => handleSlider(s.key, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-runnable-track]:bg-uc-border [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-2
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uc-gold [&::-webkit-slider-thumb]:mt-[-3px] [&::-webkit-slider-thumb]:shadow-lg
                        [&::-moz-range-track]:bg-uc-border [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-2
                        [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-uc-gold [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-uc-muted/50">{s.format(s.min)}</span>
                      <span className="text-[9px] text-uc-muted/50">{s.format(s.max)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Radar + Score */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-6">
            {/* DNA Score Card */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: `linear-gradient(135deg, ${gradeColor}06, transparent)`,
                borderColor: `${gradeColor}20`,
              }}
            >
              <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
                Composite DNA Score
              </p>
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="text-5xl font-mono font-bold transition-colors duration-300"
                  style={{ color: gradeColor }}
                >
                  {score}
                </span>
                <span
                  className="text-lg font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: gradeColor }}
                >
                  {grade}
                </span>
              </div>
              <p className="text-uc-muted text-xs">
                Weighted composite across 8 verified metrics
              </p>
            </div>

            {/* Radar Chart */}
            <div className="flex justify-center">
              <RadarChart data={radarData} color={gradeColor} size={320} />
            </div>

            {/* Closest Match */}
            <div className="rounded-2xl p-5 bg-uc-dark border border-uc-border">
              <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
                Closest QB Match
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{
                    background: `${closestMatch.accentColor}15`,
                    border: `1px solid ${closestMatch.accentColor}35`,
                  }}
                >
                  {closestMatch.avatarInitials}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/athlete/${closestMatch.slug}`}
                    className="text-uc-white font-semibold text-sm hover:text-uc-gold transition-colors"
                  >
                    {closestMatch.name}
                  </Link>
                  <p className="text-uc-muted text-xs">
                    {closestMatch.starRating}★ · {closestMatch.highSchool} · DNA {computeDnaScore(closestMatch.metrics)}
                  </p>
                </div>
                <Link
                  href={`/athlete/${closestMatch.slug}`}
                  className="text-[10px] text-uc-gold hover:text-uc-gold/80 transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>

            {/* Weight Breakdown */}
            <div className="rounded-2xl p-5 bg-uc-dark border border-uc-border">
              <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
                Weight Breakdown
              </p>
              <div className="space-y-2">
                {[
                  { label: "Accuracy", weight: 18 },
                  { label: "Arm Strength", weight: 15 },
                  { label: "Pocket Presence", weight: 13 },
                  { label: "Decision Speed", weight: 12 },
                  { label: "Film Grade", weight: 12 },
                  { label: "Release Time", weight: 10 },
                  { label: "Athleticism", weight: 10 },
                  { label: "Mechanics", weight: 10 },
                ].map((w) => (
                  <div key={w.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-uc-muted w-28 shrink-0">{w.label}</span>
                    <div className="flex-1 h-1 bg-uc-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-uc-gold/60"
                        style={{ width: `${(w.weight / 18) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-uc-muted w-6 text-right">{w.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
