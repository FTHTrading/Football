"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  Timer,
  Zap,
  Target,
  Crosshair,
  TrendingUp,
  Award,
  ChevronDown,
  ArrowRight,
  Dna,
  Shield,
  Eye,
  Activity,
  Flame,
  BarChart3,
} from "lucide-react";

/* ── Combine Drill Types ── */
interface DrillResult {
  drillId: string;
  name: string;
  value: number;
  unit: string;
  percentile: number;
  nationalRank: number;
  grade: "ELITE" | "ABOVE AVG" | "AVERAGE" | "BELOW AVG";
  icon: typeof Zap;
  color: string;
  description: string;
}

function generateCombineResults(athlete: Athlete): DrillResult[] {
  const m = athlete.metrics;
  const seed = parseInt(athlete.id) * 7;

  // Helper: clamp between 0-100
  const pctl = (v: number, min: number, max: number, invert = false) => {
    const raw = ((v - min) / (max - min)) * 100;
    return Math.round(Math.max(1, Math.min(99, invert ? 100 - raw : raw)));
  };

  const grade = (p: number): DrillResult["grade"] =>
    p >= 85 ? "ELITE" : p >= 65 ? "ABOVE AVG" : p >= 40 ? "AVERAGE" : "BELOW AVG";

  const drills: DrillResult[] = [
    {
      drillId: "velocity",
      name: "Max Velocity",
      value: m.velocity,
      unit: "mph",
      percentile: pctl(m.velocity, 48, 68),
      nationalRank: Math.max(1, Math.round((1 - (m.velocity - 48) / 20) * 500)),
      grade: grade(pctl(m.velocity, 48, 68)),
      icon: Zap,
      color: "#00C2FF",
      description: "Peak ball velocity measured via radar at release",
    },
    {
      drillId: "release",
      name: "Quick Release",
      value: m.releaseTime,
      unit: "sec",
      percentile: pctl(m.releaseTime, 0.30, 0.55, true),
      nationalRank: Math.max(1, Math.round(((m.releaseTime - 0.30) / 0.25) * 500)),
      grade: grade(pctl(m.releaseTime, 0.30, 0.55, true)),
      icon: Timer,
      color: "#00FF88",
      description: "Snap-to-release time on 3-step drop rhythm throw",
    },
    {
      drillId: "accuracy-short",
      name: "Short Accuracy",
      value: +(m.accuracy * (0.95 + (seed % 7) * 0.01)).toFixed(1),
      unit: "%",
      percentile: pctl(m.accuracy, 65, 98),
      nationalRank: Math.max(1, Math.round((1 - (m.accuracy - 65) / 33) * 500)),
      grade: grade(pctl(m.accuracy, 65, 98)),
      icon: Crosshair,
      color: "#FACC15",
      description: "Completion % on throws 0-10 yards — slants, outs, screens",
    },
    {
      drillId: "accuracy-deep",
      name: "Deep Ball",
      value: +(m.accuracy * (0.72 + (seed % 5) * 0.02)).toFixed(1),
      unit: "%",
      percentile: pctl(m.accuracy * 0.78, 45, 85),
      nationalRank: Math.max(1, Math.round((1 - (m.accuracy * 0.78 - 45) / 40) * 500)),
      grade: grade(pctl(m.accuracy * 0.78, 45, 85)),
      icon: Target,
      color: "#FF3B5C",
      description: "Accuracy on throws 30+ air yards downfield",
    },
    {
      drillId: "footwork",
      name: "Footwork Drill",
      value: +(m.mechanics * 0.93 + (seed % 4)).toFixed(1),
      unit: "/100",
      percentile: pctl(m.mechanics, 60, 98),
      nationalRank: Math.max(1, Math.round((1 - (m.mechanics - 60) / 38) * 500)),
      grade: grade(pctl(m.mechanics, 60, 98)),
      icon: Shield,
      color: "#A855F7",
      description: "Drop-back mechanics, weight transfer, base stability",
    },
    {
      drillId: "pocket-nav",
      name: "Pocket Navigation",
      value: +(m.decisionSpeed * 0.88 + m.mechanics * 0.12).toFixed(1),
      unit: "/100",
      percentile: pctl(m.decisionSpeed * 0.88 + m.mechanics * 0.12, 55, 95),
      nationalRank: Math.max(1, Math.round((1 - ((m.decisionSpeed * 0.88 + m.mechanics * 0.12) - 55) / 40) * 500)),
      grade: grade(pctl(m.decisionSpeed * 0.88 + m.mechanics * 0.12, 55, 95)),
      icon: Activity,
      color: "#00C2FF",
      description: "Slide, climb, escape — pocket awareness under pressure",
    },
    {
      drillId: "read-speed",
      name: "Read Speed",
      value: m.decisionSpeed,
      unit: "/100",
      percentile: pctl(m.decisionSpeed, 60, 96),
      nationalRank: Math.max(1, Math.round((1 - (m.decisionSpeed - 60) / 36) * 500)),
      grade: grade(pctl(m.decisionSpeed, 60, 96)),
      icon: Eye,
      color: "#00FF88",
      description: "Pre-snap identification + post-snap progression time",
    },
    {
      drillId: "spin-rate",
      name: "Spiral Efficiency",
      value: m.spinRate,
      unit: "rpm",
      percentile: pctl(m.spinRate, 450, 750),
      nationalRank: Math.max(1, Math.round((1 - (m.spinRate - 450) / 300) * 500)),
      grade: grade(pctl(m.spinRate, 450, 750)),
      icon: Flame,
      color: "#FACC15",
      description: "RPM at optimal tight spiral — ball stability in flight",
    },
  ];

  return drills;
}

/* ── Gauge Ring SVG ── */
function GaugeRing({ percentile, color, size = 80 }: { percentile: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percentile / 100);

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff08" strokeWidth={4} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </svg>
  );
}

/* ── Drill Card ── */
function DrillCard({ drill, index }: { drill: DrillResult; index: number }) {
  const gradeColors: Record<string, string> = {
    ELITE: "#00FF88",
    "ABOVE AVG": "#00C2FF",
    AVERAGE: "#FACC15",
    "BELOW AVG": "#FF3B5C",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="glass rounded-xl p-5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Gauge */}
        <div className="relative shrink-0">
          <GaugeRing percentile={drill.percentile} color={drill.color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black font-mono" style={{ color: drill.color }}>
              {drill.percentile}
            </span>
            <span className="text-[6px] text-uc-gray-500 uppercase tracking-wider">Pctl</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <drill.icon size={12} style={{ color: drill.color }} />
            <h4 className="text-sm font-bold">{drill.name}</h4>
          </div>
          <p className="text-[9px] text-uc-gray-500 mb-3 leading-relaxed">{drill.description}</p>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-[7px] text-uc-gray-600 uppercase tracking-wider">Result</p>
              <p className="text-base font-black font-mono" style={{ color: drill.color }}>
                {drill.value}{" "}
                <span className="text-[8px] text-uc-gray-500 font-normal">{drill.unit}</span>
              </p>
            </div>
            <div>
              <p className="text-[7px] text-uc-gray-600 uppercase tracking-wider">Natl Rank</p>
              <p className="text-base font-black font-mono text-white">
                #{drill.nationalRank}
              </p>
            </div>
            <div className="ml-auto">
              <span
                className="px-2 py-0.5 rounded text-[8px] font-bold tracking-wider"
                style={{
                  backgroundColor: gradeColors[drill.grade] + "15",
                  color: gradeColors[drill.grade],
                }}
              >
                {drill.grade}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Summary Stat ── */
function SummaryStat({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-[7px] text-uc-gray-600 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-2xl font-black font-mono" style={{ color }}>{value}</p>
      {sub && <p className="text-[8px] text-uc-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Main Combine Page ── */
export default function CombinePage() {
  const athletes = PLACEHOLDER_ATHLETES;
  const [selectedId, setSelectedId] = useState(athletes[5].id); // Andre Mitchell (5-star)
  const athlete = athletes.find((a) => a.id === selectedId)!;
  const drills = useMemo(() => generateCombineResults(athlete), [athlete]);

  // Summary stats
  const avgPercentile = Math.round(drills.reduce((s, d) => s + d.percentile, 0) / drills.length);
  const eliteCount = drills.filter((d) => d.grade === "ELITE").length;
  const bestDrill = [...drills].sort((a, b) => b.percentile - a.percentile)[0];
  const compositeRank = Math.round(drills.reduce((s, d) => s + d.nationalRank, 0) / drills.length);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Flame size={12} />
            Virtual Pro Day
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">QB Combine</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Eight elite drills. Raw measurables. National percentile rankings.
            Every throw decoded, every movement graded.
          </p>
        </motion.div>

        {/* Athlete Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-8 flex items-center gap-4"
        >
          <Dna size={14} className="text-uc-cyan" />
          <div className="relative flex-1">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-cyan/50 transition-colors"
            >
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.school} — {a.rating}★
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>
          <Link
            href={`/athlete/${athlete.id}`}
            className="text-[9px] text-uc-cyan tracking-wider uppercase font-bold hover:text-white transition-colors flex items-center gap-1"
          >
            Profile <ArrowRight size={10} />
          </Link>
        </motion.div>

        {/* Athlete Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 dna-bg-pattern opacity-20" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-uc-surface border border-white/10 flex items-center justify-center text-xl font-black gradient-text-dna">
                {athlete.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-xl font-bold">{athlete.name}</h2>
                <p className="text-xs text-uc-gray-400">
                  {athlete.height} · {athlete.weight}lbs · {athlete.qbClass} · Class of {athlete.gradYear}
                </p>
                <p className="text-[9px] text-uc-gray-500 mt-0.5">
                  {athlete.school} — {athlete.state} · Comp: {athlete.comparisonPlayer}
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <SummaryStat label="Composite Pctl" value={`${avgPercentile}`} sub="Avg across drills" color="#00C2FF" />
              <SummaryStat label="Elite Drills" value={`${eliteCount}/${drills.length}`} sub="85th+ percentile" color="#00FF88" />
              <SummaryStat label="Natl Comp Rank" value={`#${compositeRank}`} sub="vs 500 QBs" color="#FACC15" />
              <SummaryStat label="Best Drill" value={bestDrill.name.split(" ")[0]} sub={`P${bestDrill.percentile}`} color={bestDrill.color} />
            </div>
          </div>
        </motion.div>

        {/* Drill Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {drills.map((drill, i) => (
            <DrillCard key={drill.drillId} drill={drill} index={i} />
          ))}
        </div>

        {/* Percentile Spectrum */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-10"
        >
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-5 flex items-center gap-2">
            <BarChart3 size={12} /> Percentile Spectrum
          </h3>
          <div className="space-y-3">
            {drills.map((drill) => (
              <div key={drill.drillId} className="flex items-center gap-3">
                <span className="text-[8px] font-mono w-24 text-uc-gray-500 truncate">{drill.name}</span>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden relative">
                  {/* Zone markers */}
                  <div className="absolute left-[40%] top-0 bottom-0 w-px bg-white/5" />
                  <div className="absolute left-[65%] top-0 bottom-0 w-px bg-white/5" />
                  <div className="absolute left-[85%] top-0 bottom-0 w-px bg-white/5" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${drill.percentile}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${drill.color}40, ${drill.color})`,
                    }}
                  >
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: drill.color, borderColor: "#0A0A0A" }}
                    />
                  </motion.div>
                </div>
                <span className="text-xs font-black font-mono w-8 text-right" style={{ color: drill.color }}>
                  {drill.percentile}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-28">
            <span className="text-[7px] text-uc-gray-600">Below Avg</span>
            <span className="text-[7px] text-uc-gray-600">Average</span>
            <span className="text-[7px] text-uc-gray-600">Above Avg</span>
            <span className="text-[7px] text-uc-gray-600">Elite</span>
          </div>
        </motion.div>

        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Ready to see how this genome compares head-to-head?
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Compare Genomes
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
