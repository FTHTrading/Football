"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Dna,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Brain,
  Crosshair,
  Wind,
  Gauge,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Eye,
  Sparkles,
  ChevronRight,
  Trophy,
  Building2,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import {
  computeGAI,
  generateGAITimeline,
  extractGenes,
  detectArchetype,
  computeAllFits,
  GENE_COLORS,
  type GAIResult,
  type TimelinePoint,
  type GeneProfile,
  type FitResult,
} from "@/lib/genome-activation-index";

/* ── Helix SVG ── */
function HelixStrand({
  points,
  activeWeek,
  height = 500,
  width = 720,
}: {
  points: TimelinePoint[];
  activeWeek: number;
  height?: number;
  width?: number;
}) {
  const padding = 40;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  // Build helix path with two intertwined strands
  const strandA: string[] = [];
  const strandB: string[] = [];
  const dots: { x: number; y: number; gai: number; week: number; active: boolean; status: string }[] = [];

  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * usableW;
    const baseY = padding + usableH / 2;

    // Helix oscillation based on GAI
    const amplitude = 30 + (p.gai / 99) * 50;
    const phase = (i / points.length) * Math.PI * 3;
    const yA = baseY - Math.sin(phase) * amplitude;
    const yB = baseY + Math.sin(phase) * amplitude;

    // Also shift vertically based on GAI (higher = higher on screen)
    const gaiShift = ((p.gai - 50) / 50) * 60;
    const finalYA = yA - gaiShift;
    const finalYB = yB - gaiShift;

    if (i === 0) {
      strandA.push(`M ${x} ${finalYA}`);
      strandB.push(`M ${x} ${finalYB}`);
    } else {
      strandA.push(`L ${x} ${finalYA}`);
      strandB.push(`L ${x} ${finalYB}`);
    }

    dots.push({
      x,
      y: (finalYA + finalYB) / 2,
      gai: p.gai,
      week: p.week,
      active: p.week === activeWeek,
      status: p.activationStatus,
    });
  });

  const statusColor = (s: string) =>
    s === "peak" ? "#FFD700" :
    s === "activated" ? "#00FF88" :
    s === "warming" ? "#00C2FF" :
    s === "cooling" ? "#F59E0B" :
    "#9CA3AF";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Grid */}
      {[0.25, 0.5, 0.75].map((frac) => (
        <line
          key={frac}
          x1={padding}
          y1={padding + usableH * frac}
          x2={width - padding}
          y2={padding + usableH * frac}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.5"
        />
      ))}

      {/* Connecting rungs (base pairs) between strands */}
      {points.map((_, i) => {
        const x = padding + (i / (points.length - 1)) * usableW;
        const phase = (i / points.length) * Math.PI * 3;
        const baseY = padding + usableH / 2;
        const p = points[i];
        const amplitude = 30 + (p.gai / 99) * 50;
        const gaiShift = ((p.gai - 50) / 50) * 60;
        const yA = baseY - Math.sin(phase) * amplitude - gaiShift;
        const yB = baseY + Math.sin(phase) * amplitude - gaiShift;

        return (
          <line
            key={`rung-${i}`}
            x1={x}
            y1={yA}
            x2={x}
            y2={yB}
            stroke={statusColor(p.activationStatus)}
            strokeWidth={p.week === activeWeek ? 2 : 0.5}
            opacity={p.week === activeWeek ? 0.8 : 0.15}
          />
        );
      })}

      {/* Strand A */}
      <path
        d={strandA.join(" ")}
        fill="none"
        stroke="url(#helixGradA)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Strand B */}
      <path
        d={strandB.join(" ")}
        fill="none"
        stroke="url(#helixGradB)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />

      {/* GAI dots on center line */}
      {dots.map((d) => (
        <g key={d.week}>
          {/* Glow */}
          {d.active && (
            <circle cx={d.x} cy={d.y} r={14} fill={statusColor(d.status)} opacity={0.15}>
              <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle
            cx={d.x}
            cy={d.y}
            r={d.active ? 6 : 3.5}
            fill={statusColor(d.status)}
            stroke={d.active ? "white" : "none"}
            strokeWidth={1.5}
          />
          {/* Label */}
          <text
            x={d.x}
            y={d.y - 12}
            textAnchor="middle"
            fontSize={d.active ? "10" : "7"}
            fontWeight={d.active ? "bold" : "normal"}
            fill={d.active ? "white" : "rgba(255,255,255,0.35)"}
          >
            {d.gai}
          </text>
          <text
            x={d.x}
            y={d.y + 20}
            textAnchor="middle"
            fontSize="7"
            fill="rgba(255,255,255,0.25)"
          >
            W{d.week}
          </text>
        </g>
      ))}

      {/* Gradients */}
      <defs>
        <linearGradient id="helixGradA" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C2FF" />
          <stop offset="50%" stopColor="#00FF88" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="helixGradB" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#00C2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── GAI Badge ── */
function GAIBadge({ result }: { result: GAIResult }) {
  return (
    <div className="relative">
      <div className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(from 180deg, ${result.tierColor}40, ${result.tierColor}10, ${result.tierColor}40)`,
          boxShadow: `0 0 40px ${result.tierColor}20`,
        }}
      >
        <div className="w-24 h-24 rounded-full bg-uc-black flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-uc-gray-400">GAI</span>
          <span className="text-3xl font-black tabular-nums" style={{ color: result.tierColor }}>{result.gai}</span>
          <span className="text-[8px] font-medium" style={{ color: result.tierColor }}>{result.tier}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function GenomeTimelinePage() {
  const [selectedAthlete, setSelectedAthlete] = useState(PLACEHOLDER_ATHLETES[0].id);
  const [activeWeek, setActiveWeek] = useState(6);
  const [animating, setAnimating] = useState(false);

  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthlete) ?? PLACEHOLDER_ATHLETES[0];
  const gai = useMemo(() => computeGAI(athlete.metrics, { activationSeed: activeWeek / 12 }), [athlete, activeWeek]);
  const timeline = useMemo(() => generateGAITimeline(athlete.metrics), [athlete]);
  const archetype = useMemo(() => detectArchetype(athlete.metrics), [athlete]);
  const topFits = useMemo(() => computeAllFits(athlete.metrics).slice(0, 5), [athlete]);
  const genes = useMemo(() => extractGenes(athlete.metrics), [athlete]);

  // Animate through weeks
  const playTimeline = () => {
    if (animating) return;
    setAnimating(true);
    setActiveWeek(1);
    let w = 1;
    const iv = setInterval(() => {
      w++;
      setActiveWeek(w);
      if (w >= 12) {
        clearInterval(iv);
        setAnimating(false);
      }
    }, 600);
  };

  const trajectoryIcon = gai.growth.trajectory === "ascending" ? ArrowUpRight :
    gai.growth.trajectory === "declining" ? ArrowDownRight : Minus;
  const TrajectoryIcon = trajectoryIcon;

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-green-400 to-purple-500 flex items-center justify-center">
              <Dna size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Genome <span className="gradient-text-dna">Timeline</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            The Genome Activation Index — a unified signal fusing base traits, live activation, seasonal growth, and institutional fit into one evolving number.
          </p>
        </motion.div>

        {/* ── Athlete Selector ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Eye size={14} className="text-uc-gray-400" />
          {PLACEHOLDER_ATHLETES.map((a) => {
            const aGai = computeGAI(a.metrics);
            return (
              <button
                key={a.id}
                onClick={() => { setSelectedAthlete(a.id); setActiveWeek(6); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedAthlete === a.id ? "bg-uc-cyan/20 text-uc-cyan border border-uc-cyan/30" : "bg-white/5 text-uc-gray-400 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-uc-surface flex items-center justify-center text-[8px] font-bold">
                  {a.name.split(" ").map((n) => n[0]).join("")}
                </span>
                {a.name.split(" ")[1]}
                <span className="text-[9px] opacity-60">{aGai.gai}</span>
              </button>
            );
          })}
        </div>

        {/* ── Hero: GAI + Athlete + Archetype ── */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <GAIBadge result={gai} />

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{athlete.name}</h2>
              <p className="text-xs text-uc-gray-400 mb-2">{athlete.school} · Class of {athlete.gradYear} · {athlete.qbClass}</p>

              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                {/* Archetype */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${archetype.color}15` }}>
                  <Dna size={10} style={{ color: archetype.color }} />
                  <span className="text-[10px] font-medium" style={{ color: archetype.color }}>{archetype.name}</span>
                </div>

                {/* Trajectory */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  gai.growth.trajectory === "ascending" ? "bg-uc-green/15 text-uc-green" :
                  gai.growth.trajectory === "declining" ? "bg-red-400/15 text-red-400" :
                  "bg-white/5 text-uc-gray-400"
                }`}>
                  <TrajectoryIcon size={10} />
                  <span className="text-[10px] font-medium capitalize">{gai.growth.trajectory}</span>
                </div>

                {/* Activation Status */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  gai.activation.status === "peak" ? "bg-yellow-400/15 text-yellow-400" :
                  gai.activation.status === "activated" ? "bg-uc-green/15 text-uc-green" :
                  gai.activation.status === "warming" ? "bg-uc-cyan/15 text-uc-cyan" :
                  "bg-white/5 text-uc-gray-400"
                }`}>
                  <Activity size={10} />
                  <span className="text-[10px] font-medium capitalize">{gai.activation.status}</span>
                </div>
              </div>
            </div>

            {/* Component Scores */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {[
                { label: "Base", value: gai.base, icon: Dna, color: "text-uc-cyan" },
                { label: "Activation", value: `${gai.activation.multiplier}×`, icon: Zap, color: "text-yellow-400" },
                { label: "Growth", value: `${gai.growth.delta > 0 ? "+" : ""}${(gai.growth.delta * 100).toFixed(1)}%`, icon: TrendingUp, color: gai.growth.delta >= 0 ? "text-uc-green" : "text-red-400" },
                { label: "Best Fit", value: gai.bestFit.fitScore, icon: Building2, color: "text-purple-400" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white/[0.03] rounded-lg p-2.5 text-center min-w-[80px]">
                    <Icon size={12} className={`mx-auto mb-0.5 ${s.color}`} />
                    <p className={`text-sm font-bold tabular-nums ${s.color}`}>{s.value}</p>
                    <p className="text-[7px] text-uc-gray-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── THE HELIX TIMELINE ── */}
        <div className="glass rounded-2xl p-6 mb-8 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 flex items-center gap-1.5">
              <Activity size={12} /> Genome Helix Timeline
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={playTimeline}
                disabled={animating}
                className="px-3 py-1.5 rounded-lg bg-uc-cyan/15 text-uc-cyan text-[10px] font-medium hover:bg-uc-cyan/25 transition disabled:opacity-50"
              >
                {animating ? "Playing..." : "▶ Play Season"}
              </button>
              <span className="text-[10px] text-uc-gray-400">Week {activeWeek}/12</span>
            </div>
          </div>

          <div className="relative h-[300px] sm:h-[400px]">
            <HelixStrand points={timeline} activeWeek={activeWeek} height={400} width={720} />
          </div>

          {/* Week Scrubber */}
          <div className="flex items-center gap-1 mt-4">
            {timeline.map((p) => (
              <button
                key={p.week}
                onClick={() => setActiveWeek(p.week)}
                className={`flex-1 h-8 rounded flex flex-col items-center justify-center transition-all ${
                  activeWeek === p.week ? "bg-uc-cyan/20 ring-1 ring-uc-cyan/40" : "bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <span className={`text-[8px] font-bold tabular-nums ${activeWeek === p.week ? "text-uc-cyan" : "text-uc-gray-400"}`}>
                  {p.gai}
                </span>
                <span className="text-[6px] text-uc-gray-400/60">W{p.week}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* ── Gene Radial ── */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <Dna size={12} /> Gene Expression @ Week {activeWeek}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {genes.map((g) => {
                const flare = gai.activation.geneFlares[g.id] ?? 0;
                const isPeak = gai.activation.peakGene === g.id;
                return (
                  <div key={g.id} className={`text-center p-3 rounded-lg transition ${isPeak ? "bg-white/[0.05] ring-1 ring-white/10" : ""}`}>
                    {/* Ring gauge */}
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                        {/* Base value */}
                        <circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke={g.color}
                          strokeWidth="2"
                          strokeDasharray={`${g.value} 100`}
                          strokeLinecap="round"
                          opacity={0.4}
                        />
                        {/* Activation flare */}
                        <circle
                          cx="18" cy="18" r="12" fill="none"
                          stroke={g.color}
                          strokeWidth="1.5"
                          strokeDasharray={`${flare} 100`}
                          strokeLinecap="round"
                          opacity={0.9}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-white">{g.value}</span>
                        <span className="text-[7px]" style={{ color: g.color }}>{flare}⚡</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-mono" style={{ color: g.color }}>{g.id}</p>
                    <p className="text-[7px] text-uc-gray-400">{g.label}</p>
                    {isPeak && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[7px] bg-yellow-400/15 text-yellow-400 font-bold">PEAK</span>
                    )}
                    <div className="mt-1">
                      <span className={`text-[7px] font-medium px-1.5 py-0.5 rounded ${
                        g.tier === "elite" ? "bg-uc-green/15 text-uc-green" :
                        g.tier === "strong" ? "bg-uc-cyan/15 text-uc-cyan" :
                        g.tier === "developing" ? "bg-yellow-400/15 text-yellow-400" :
                        "bg-white/5 text-uc-gray-400"
                      }`}>{g.tier}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Growth Trajectory ── */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <TrendingUp size={12} /> Seasonal Growth
            </h3>

            {/* Sparkline */}
            <div className="flex items-end gap-0.5 h-24 mb-4">
              {gai.growth.weekSnapshots.map((val, i) => {
                const max = Math.max(...gai.growth.weekSnapshots);
                const min = Math.min(...gai.growth.weekSnapshots);
                const range = max - min || 1;
                const pct = ((val - min) / range) * 100;
                const isActive = i + 1 === activeWeek;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    {isActive && <span className="text-[7px] text-uc-cyan font-bold">{val}</span>}
                    <div
                      className={`w-full rounded-t transition-all ${isActive ? "bg-uc-cyan" : "bg-white/10"}`}
                      style={{ height: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Per-gene growth */}
            <div className="space-y-2">
              {genes.map((g) => {
                const delta = gai.growth.geneDeltas[g.id] ?? 0;
                return (
                  <div key={g.id} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono w-10" style={{ color: g.color }}>{g.id}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, delta * 20)}%`, background: g.color }} />
                    </div>
                    <span className={`text-[9px] font-bold tabular-nums w-10 text-right ${delta > 0 ? "text-uc-green" : "text-uc-gray-400"}`}>
                      +{delta.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <TrajectoryIcon size={14} className={
                  gai.growth.trajectory === "ascending" ? "text-uc-green" :
                  gai.growth.trajectory === "declining" ? "text-red-400" : "text-uc-gray-400"
                } />
                <div>
                  <p className="text-xs font-semibold text-white capitalize">{gai.growth.trajectory}</p>
                  <p className="text-[9px] text-uc-gray-400">Season delta: {gai.growth.delta > 0 ? "+" : ""}{(gai.growth.delta * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Institutional Fit ── */}
        <div className="glass rounded-xl p-5 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
            <Building2 size={12} /> Top Institutional Fits — Genome Alignment
          </h3>
          <div className="grid sm:grid-cols-5 gap-3">
            {topFits.map((fit, i) => (
              <div
                key={fit.program.name}
                className={`rounded-xl p-4 text-center transition ${
                  i === 0 ? "bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-400/20" : "bg-white/[0.03]"
                }`}
              >
                <div className={`text-lg font-black mb-1 ${
                  i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-uc-gray-400"
                }`}>
                  #{i + 1}
                </div>
                <p className="text-sm font-bold text-white mb-0.5">{fit.program.name}</p>
                <p className="text-[9px] text-uc-gray-400 mb-2">{fit.program.conference} · {fit.program.scheme}</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full mb-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fit.fitScore}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-uc-cyan to-uc-green"
                  />
                </div>
                <span className={`text-lg font-black tabular-nums ${fit.fitScore >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>{fit.fitScore}</span>
                <p className="text-[7px] text-uc-gray-400 uppercase tracking-widest">Fit Score</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GAI Formula Explainer ── */}
        <div className="glass rounded-xl p-6 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
            <Brain size={12} /> GAI Formula Breakdown
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <div className="bg-white/[0.03] rounded-lg px-4 py-3">
              <p className="text-lg font-black text-uc-cyan tabular-nums">{gai.base}</p>
              <p className="text-[8px] text-uc-gray-400 uppercase tracking-widest">Base</p>
            </div>
            <span className="text-uc-gray-400 text-lg">×</span>
            <div className="bg-white/[0.03] rounded-lg px-4 py-3">
              <p className="text-lg font-black text-yellow-400 tabular-nums">{gai.activation.multiplier}</p>
              <p className="text-[8px] text-uc-gray-400 uppercase tracking-widest">Activation</p>
            </div>
            <span className="text-uc-gray-400 text-lg">×</span>
            <div className="bg-white/[0.03] rounded-lg px-4 py-3">
              <p className={`text-lg font-black tabular-nums ${gai.growth.delta >= 0 ? "text-uc-green" : "text-red-400"}`}>
                {(1 + gai.growth.delta).toFixed(3)}
              </p>
              <p className="text-[8px] text-uc-gray-400 uppercase tracking-widest">1 + Growth</p>
            </div>
            <span className="text-uc-gray-400 text-lg">×</span>
            <div className="bg-white/[0.03] rounded-lg px-4 py-3">
              <p className="text-lg font-black text-purple-400 tabular-nums">{gai.bestFit.coefficient}</p>
              <p className="text-[8px] text-uc-gray-400 uppercase tracking-widest">Fit Coeff.</p>
            </div>
            <span className="text-uc-gray-400 text-lg">=</span>
            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-lg px-6 py-3 border border-white/10">
              <p className="text-2xl font-black tabular-nums" style={{ color: gai.tierColor }}>{gai.gai}</p>
              <p className="text-[8px] uppercase tracking-widest" style={{ color: gai.tierColor }}>{gai.tier}</p>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
          <p className="text-uc-gray-400 text-sm mb-4">Every page, every decision resolves to this.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/gameday" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition">
              <Activity size={14} /> Game Day Live
            </Link>
            <Link href="/stats" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition">
              <TrendingUp size={14} /> Season Stats
            </Link>
            <Link href="/offers" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition">
              <Building2 size={14} /> Offers
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-green-400 to-purple-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              <Sparkles size={14} /> Discover QBs <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
