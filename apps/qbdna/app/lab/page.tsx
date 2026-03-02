"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FlaskConical,
  Dna,
  Zap,
  Target,
  Brain,
  Gauge,
  RotateCcw,
  Download,
  Share2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI, detectArchetype } from "@/lib/genome-activation-index";

/* ── Gene Definitions ─────────────────── */
const GENES = [
  { key: "velocity" as const, gene: "VEL-α", label: "Velocity", icon: Zap, color: "#00C2FF", unit: "mph", min: 40, max: 75 },
  { key: "accuracy" as const, gene: "ACC-γ", label: "Accuracy", icon: Target, color: "#00FF88", unit: "%", min: 50, max: 100 },
  { key: "releaseTime" as const, gene: "REL-β", label: "Release", icon: Gauge, color: "#A855F7", unit: "s", min: 0.55, max: 0.30, invert: true },
  { key: "mechanics" as const, gene: "MECH-δ", label: "Mechanics", icon: Dna, color: "#F59E0B", unit: "/100", min: 50, max: 100 },
  { key: "decisionSpeed" as const, gene: "DEC-ε", label: "Decision", icon: Brain, color: "#FF3B5C", unit: "/100", min: 50, max: 100 },
  { key: "spinRate" as const, gene: "SPR-ζ", label: "Spin Rate", icon: RotateCcw, color: "#EC4899", unit: "rpm", min: 400, max: 800 },
] as const;

/* ── Percentile helper ────────────────── */
function genePercentile(key: keyof AthleteMetrics, value: number): number {
  const all = PLACEHOLDER_ATHLETES.map((a) => a.metrics[key]);
  const below = all.filter((v) => (key === "releaseTime" ? v > value : v < value)).length;
  return Math.round((below / all.length) * 100);
}

/* ── Main Component ───────────────────── */
export default function GenomeLabPage() {
  const [selectedId, setSelectedId] = useState(PLACEHOLDER_ATHLETES[0].id);
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedId)!;

  /* Mutable gene sliders — start from athlete's actual metrics */
  const [modifiedMetrics, setModifiedMetrics] = useState<AthleteMetrics>({ ...athlete.metrics });
  const [isModified, setIsModified] = useState(false);

  const handleAthleteChange = useCallback((id: string) => {
    setSelectedId(id);
    const a = PLACEHOLDER_ATHLETES.find((x) => x.id === id)!;
    setModifiedMetrics({ ...a.metrics });
    setIsModified(false);
  }, []);

  const handleSliderChange = useCallback(
    (key: keyof AthleteMetrics, value: number) => {
      setModifiedMetrics((prev) => ({ ...prev, [key]: value }));
      setIsModified(true);
    },
    []
  );

  const handleReset = useCallback(() => {
    setModifiedMetrics({ ...athlete.metrics });
    setIsModified(false);
  }, [athlete]);

  const originalGAI = useMemo(() => computeGAI(athlete.metrics), [athlete]);
  const modifiedGAI = useMemo(() => computeGAI(modifiedMetrics), [modifiedMetrics]);
  const originalScore = originalGAI.gai;
  const modifiedScore = modifiedGAI.gai;
  const originalArchetype = useMemo(() => detectArchetype(athlete.metrics), [athlete]);
  const modifiedArchetype = useMemo(() => detectArchetype(modifiedMetrics), [modifiedMetrics]);
  const scoreDelta = modifiedScore - originalScore;
  const archetypeChanged = originalArchetype.name !== modifiedArchetype.name;

  /* ── Projection: what training gains would move this score? ── */
  const projections = useMemo(() => {
    return GENES.map((g) => {
      const orig = athlete.metrics[g.key];
      const mod = modifiedMetrics[g.key];
      const diff = mod - orig;
      const pctChange = orig !== 0 ? ((diff / orig) * 100) : 0;
      return { ...g, orig, mod, diff, pctChange };
    });
  }, [athlete, modifiedMetrics]);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <FlaskConical size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Genome <span className="gradient-text-dna">Lab</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            The sandbox for QB evolution. Adjust gene markers to simulate development scenarios, discover archetype shifts, and project genome growth trajectories.
          </p>
        </motion.div>

        {/* ── Athlete Selector ── */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => handleAthleteChange(e.target.value)}
              className="appearance-none bg-uc-panel border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition"
            >
              {PLACEHOLDER_ATHLETES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.school}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>

          {isModified && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-uc-gray-400 hover:text-white transition"
            >
              <RotateCcw size={12} /> Reset to baseline
            </motion.button>
          )}
        </div>

        {/* ── Score Banner ── */}
        <motion.div
          layout
          className="glass rounded-2xl p-6 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">GAI · {modifiedGAI.tier}</p>
            <p className="text-3xl font-black tabular-nums" style={{ color: modifiedGAI.tierColor }}>
              {modifiedScore}
            </p>
            {isModified && (
              <p className={`text-xs mt-0.5 ${scoreDelta > 0 ? "text-uc-green" : scoreDelta < 0 ? "text-uc-red" : "text-uc-gray-400"}`}>
                {scoreDelta > 0 ? "+" : ""}{scoreDelta} from baseline ({originalScore})
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">Archetype</p>
            <p className="text-lg font-bold" style={{ color: modifiedArchetype.color }}>
              {modifiedArchetype.name}
            </p>
            {archetypeChanged && isModified && (
              <p className="text-[10px] text-uc-cyan flex items-center gap-1 mt-0.5">
                <Sparkles size={10} /> Shifted from {originalArchetype.name}
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">QB Class</p>
            <p className="text-lg font-bold text-white">{athlete.qbClass}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">Genes Modified</p>
            <p className="text-3xl font-black text-uc-cyan tabular-nums">
              {projections.filter((p) => Math.abs(p.diff) > 0.001).length}
              <span className="text-sm text-uc-gray-400 font-normal"> / 6</span>
            </p>
          </div>
        </motion.div>

        {/* ── Two Column: Sliders + Projections ── */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── LEFT: Gene Sliders ── */}
          <div className="lg:col-span-3 space-y-5">
            <h2 className="text-sm font-semibold text-uc-gray-400 uppercase tracking-widest mb-2">Gene Marker Controls</h2>
            {GENES.map((g, i) => {
              const Icon = g.icon;
              const value = modifiedMetrics[g.key];
              const orig = athlete.metrics[g.key];
              const diff = value - orig;
              const pct = genePercentile(g.key, value);
              const step = g.key === "releaseTime" ? 0.01 : g.key === "spinRate" ? 5 : 1;
              const min = g.key === "releaseTime" ? g.max : g.min; // inverted for release
              const max = g.key === "releaseTime" ? g.min : g.max;

              return (
                <motion.div
                  key={g.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: g.color + "20" }}>
                        <Icon size={14} style={{ color: g.color }} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white">{g.label}</span>
                        <span className="text-[10px] text-uc-gray-400 ml-2 font-mono">{g.gene}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold tabular-nums" style={{ color: g.color }}>
                        {g.key === "releaseTime" ? value.toFixed(2) : Math.round(value)}
                      </span>
                      <span className="text-[10px] text-uc-gray-400 ml-1">{g.unit}</span>
                      {Math.abs(diff) > 0.001 && (
                        <span className={`text-[10px] ml-2 ${(g.key === "releaseTime" ? diff < 0 : diff > 0) ? "text-uc-green" : "text-uc-red"}`}>
                          {diff > 0 ? "+" : ""}{g.key === "releaseTime" ? diff.toFixed(2) : Math.round(diff)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={(e) => handleSliderChange(g.key, parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${g.color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
                      }}
                    />
                    {/* Baseline marker */}
                    <div
                      className="absolute top-0 w-0.5 h-1.5 bg-white/40"
                      style={{ left: `${((orig - min) / (max - min)) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-uc-gray-400">{g.key === "releaseTime" ? `${max}s (slow)` : `${min} ${g.unit}`}</span>
                    <span className="text-[9px] text-uc-gray-400">P{pct} percentile</span>
                    <span className="text-[9px] text-uc-gray-400">{g.key === "releaseTime" ? `${min}s (fast)` : `${max} ${g.unit}`}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── RIGHT: Projection Panel ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Archetype Card */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Archetype Analysis</h3>
              <div className="rounded-xl p-4 border" style={{ borderColor: modifiedArchetype.color + "40", background: modifiedArchetype.color + "08" }}>
                <p className="text-lg font-bold mb-1" style={{ color: modifiedArchetype.color }}>{modifiedArchetype.name}</p>
                <p className="text-xs text-uc-gray-400 leading-relaxed">{modifiedArchetype.description}</p>
              </div>

              {archetypeChanged && isModified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-2 text-xs text-uc-cyan"
                >
                  <Sparkles size={12} />
                  <span>Gene modifications triggered an archetype evolution from <strong>{originalArchetype.name}</strong></span>
                </motion.div>
              )}
            </div>

            {/* Gene Deltas */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Delta Report</h3>
              <div className="space-y-3">
                {projections.map((p) => {
                  const Icon = p.icon;
                  const positive = p.key === "releaseTime" ? p.diff < 0 : p.diff > 0;
                  const hasDiff = Math.abs(p.diff) > 0.001;
                  return (
                    <div key={p.key} className="flex items-center gap-3">
                      <Icon size={14} style={{ color: p.color }} />
                      <span className="text-xs text-uc-gray-400 flex-1">{p.gene}</span>
                      {hasDiff ? (
                        <>
                          <span className={`text-xs font-mono ${positive ? "text-uc-green" : "text-uc-red"}`}>
                            {p.diff > 0 ? "+" : ""}{p.key === "releaseTime" ? p.diff.toFixed(2) : Math.round(p.diff)}
                          </span>
                          <span className={`text-[10px] ${positive ? "text-uc-green/70" : "text-uc-red/70"}`}>
                            ({p.pctChange > 0 ? "+" : ""}{p.pctChange.toFixed(1)}%)
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-uc-gray-400">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Radar Preview (simplified bar comparison) */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Baseline vs Modified</h3>
              <div className="space-y-3">
                {GENES.map((g) => {
                  const orig = athlete.metrics[g.key];
                  const mod = modifiedMetrics[g.key];
                  const min = g.key === "releaseTime" ? 0.55 : g.min;
                  const max = g.key === "releaseTime" ? 0.30 : g.max;
                  const range = Math.abs(max - min);
                  const origPct = g.key === "releaseTime"
                    ? ((0.55 - orig) / 0.25) * 100
                    : ((orig - min) / range) * 100;
                  const modPct = g.key === "releaseTime"
                    ? ((0.55 - mod) / 0.25) * 100
                    : ((mod - min) / range) * 100;

                  return (
                    <div key={g.key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-uc-gray-400 font-mono">{g.gene}</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                        {/* Baseline bar */}
                        <div
                          className="absolute inset-y-0 left-0 rounded-full opacity-30"
                          style={{ width: `${Math.max(0, Math.min(100, origPct))}%`, background: g.color }}
                        />
                        {/* Modified bar */}
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: g.color }}
                          initial={false}
                          animate={{ width: `${Math.max(0, Math.min(100, modPct))}%` }}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded-full bg-white/30" />
                    <span className="text-[9px] text-uc-gray-400">Baseline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded-full bg-uc-cyan" />
                    <span className="text-[9px] text-uc-gray-400">Modified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link
                href={`/athlete/${athlete.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-uc-cyan/10 hover:bg-uc-cyan/20 text-uc-cyan text-xs font-medium transition"
              >
                Full Profile <ArrowRight size={12} />
              </Link>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white text-xs transition">
                <Share2 size={12} /> Share
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white text-xs transition">
                <Download size={12} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-uc-gray-400 text-sm mb-4">Want to unlock genome simulation training programs?</p>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <TrendingUp size={16} /> Open Training Programs <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
