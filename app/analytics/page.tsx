"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  BarChart3,
  TrendingUp,
  Dna,
  ArrowRight,
  ChevronDown,
  Zap,
  Target,
  Shield,
  Activity,
  Eye,
  Clock,
  Users,
  Award,
} from "lucide-react";

/* ── Metric definitions ── */
const METRIC_DEFS = [
  { key: "velocity" as const, label: "Arm Velocity", code: "VEL-α", unit: "mph", max: 70, icon: Zap, color: "#00C2FF", description: "Peak throwing velocity measured at release point", invert: false, decimals: 1 },
  { key: "releaseTime" as const, label: "Release Time", code: "REL-β", unit: "s", max: 1, icon: Clock, color: "#00FF88", description: "Time from snap to ball release", invert: true, decimals: 2 },
  { key: "spinRate" as const, label: "Spin Rate", code: "SPR-ζ", unit: "rpm", max: 800, icon: Activity, color: "#A855F7", description: "RPM measured at optimal spiral", invert: false, decimals: 0 },
  { key: "mechanics" as const, label: "Mechanics", code: "MECH-δ", unit: "/100", max: 100, icon: Shield, color: "#FACC15", description: "Composite grade of throwing motion, footwork, base", invert: false, decimals: 1 },
  { key: "accuracy" as const, label: "Accuracy", code: "ACC-γ", unit: "%", max: 100, icon: Target, color: "#00C2FF", description: "Completion accuracy across all throw types", invert: false, decimals: 1 },
  { key: "decisionSpeed" as const, label: "Decision Speed", code: "DEC-ε", unit: "/100", max: 100, icon: Eye, color: "#00FF88", description: "Pre-snap read + post-snap processing grade", invert: false, decimals: 1 },
] as const;

type MetricKey = typeof METRIC_DEFS[number]["key"];

/* ── Distribution Bar Chart ── */
function DistributionChart({ metricKey, athletes }: { metricKey: MetricKey; athletes: Athlete[] }) {
  const def = METRIC_DEFS.find((m) => m.key === metricKey)!;
  const values = athletes.map((a) => a.metrics[metricKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;

  // Create buckets
  const bucketCount = 6;
  const range = max - min || 1;
  const bucketSize = range / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const low = min + i * bucketSize;
    const high = low + bucketSize;
    const count = values.filter((v) => v >= low && (i === bucketCount - 1 ? v <= high : v < high)).length;
    return { low, high, count };
  });
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <def.icon size={14} style={{ color: def.color }} />
        <h4 className="text-xs font-bold">{def.label}</h4>
        <span className="text-[8px] font-mono text-uc-gray-500 ml-auto">{def.code}</span>
      </div>
      <div className="flex items-end gap-1 h-20">
        {buckets.map((b, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(b.count / maxCount) * 100}%` }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="flex-1 rounded-t"
            style={{ backgroundColor: def.color, opacity: 0.3 + (b.count / maxCount) * 0.7 }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] font-mono text-uc-gray-500">
          {def.invert ? max.toFixed(def.decimals) : min.toFixed(def.decimals)}
        </span>
        <span className="text-[8px] font-mono text-uc-gray-500">
          {def.invert ? min.toFixed(def.decimals) : max.toFixed(def.decimals)}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div>
          <p className="text-[8px] text-uc-gray-500 uppercase tracking-wider">Range</p>
          <p className="text-xs font-bold font-mono">{min.toFixed(def.decimals)} – {max.toFixed(def.decimals)}{def.unit}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-uc-gray-500 uppercase tracking-wider">Average</p>
          <p className="text-xs font-bold font-mono" style={{ color: def.color }}>{avg.toFixed(def.decimals)}{def.unit}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Percentile Bar (athlete vs pool) ── */
function PercentileBar({ athlete, metricKey, allValues }: { athlete: Athlete; metricKey: MetricKey; allValues: number[] }) {
  const def = METRIC_DEFS.find((m) => m.key === metricKey)!;
  const val = athlete.metrics[metricKey];
  const sorted = [...allValues].sort((a, b) => def.invert ? b - a : a - b);
  const rank = sorted.indexOf(val) + 1;
  const percentile = Math.round((rank / sorted.length) * 100);
  const normalizedPct = def.invert
    ? ((Math.max(...allValues) - val) / (Math.max(...allValues) - Math.min(...allValues) || 1)) * 100
    : ((val - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues) || 1)) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[8px] font-mono w-12 text-uc-gray-500 tracking-wider">{def.code}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, normalizedPct)}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: def.color }}
        />
      </div>
      <span className="text-xs font-bold font-mono w-16 text-right" style={{ color: def.color }}>
        {val.toFixed(def.decimals)}
      </span>
      <span className={`text-[9px] font-bold w-10 text-right ${percentile >= 80 ? "text-uc-green" : percentile >= 50 ? "text-uc-cyan" : "text-uc-gray-400"}`}>
        P{percentile}
      </span>
    </div>
  );
}

/* ── Correlation Scatter (2D) ── */
function CorrelationScatter({ xKey, yKey, athletes, highlight }: { xKey: MetricKey; yKey: MetricKey; athletes: Athlete[]; highlight?: string }) {
  const xDef = METRIC_DEFS.find((m) => m.key === xKey)!;
  const yDef = METRIC_DEFS.find((m) => m.key === yKey)!;
  const xVals = athletes.map((a) => a.metrics[xKey]);
  const yVals = athletes.map((a) => a.metrics[yKey]);
  const xMin = Math.min(...xVals); const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals); const yMax = Math.max(...yVals);

  return (
    <div className="glass rounded-xl p-5">
      <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4">
        {xDef.label} vs {yDef.label}
      </h4>
      <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
        {/* Grid */}
        {[0, 50, 100, 150, 200].map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="200" stroke="#ffffff08" />
            <line x1="0" y1={v} x2="200" y2={v} stroke="#ffffff08" />
          </g>
        ))}
        {/* Points */}
        {athletes.map((a) => {
          const x = ((a.metrics[xKey] - xMin) / (xMax - xMin || 1)) * 180 + 10;
          const y = 190 - ((a.metrics[yKey] - yMin) / (yMax - yMin || 1)) * 180;
          const isHighlight = a.id === highlight;
          return (
            <motion.circle
              key={a.id}
              initial={{ r: 0 }}
              animate={{ r: isHighlight ? 6 : 4 }}
              transition={{ delay: 0.2 }}
              cx={x}
              cy={y}
              fill={isHighlight ? "#00C2FF" : "#ffffff30"}
              stroke={isHighlight ? "#00C2FF" : "transparent"}
              strokeWidth={isHighlight ? 2 : 0}
              opacity={isHighlight ? 1 : 0.6}
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2">
        <span className="text-[8px] text-uc-gray-500">{xDef.label} →</span>
        <span className="text-[8px] text-uc-gray-500">↑ {yDef.label}</span>
      </div>
    </div>
  );
}

/* ── Main Analytics Page ── */
export default function AnalyticsPage() {
  const [selectedAthlete, setSelectedAthlete] = useState<string | "all">("all");
  const athletes = PLACEHOLDER_ATHLETES;

  const allMetricValues = useMemo(() => {
    const result: Record<MetricKey, number[]> = {
      velocity: [], releaseTime: [], spinRate: [], mechanics: [], accuracy: [], decisionSpeed: [],
    };
    athletes.forEach((a) => {
      METRIC_DEFS.forEach((m) => {
        result[m.key].push(a.metrics[m.key]);
      });
    });
    return result;
  }, [athletes]);

  const selectedData = athletes.find((a) => a.id === selectedAthlete);

  // Leaderboard for each metric
  const metricLeaders = METRIC_DEFS.map((m) => {
    const sorted = [...athletes].sort((a, b) => m.invert ? a.metrics[m.key] - b.metrics[m.key] : b.metrics[m.key] - a.metrics[m.key]);
    return { ...m, leader: sorted[0] };
  });

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <BarChart3 size={12} />
            Analytics Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Genome Analytics</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Deep statistical exploration across every quarterback gene marker.
            Distributions, percentiles, correlations, and trait leaders.
          </p>
        </motion.div>

        {/* Athlete Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-8 flex items-center gap-4"
        >
          <BarChart3 size={14} className="text-uc-gray-500" />
          <div className="relative flex-1">
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-cyan/50 transition-colors"
            >
              <option value="all">All Athletes — Pool Analysis</option>
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — Individual Breakdown</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Individual athlete percentile breakdown */}
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <Dna size={16} className="text-uc-cyan" />
              <h3 className="text-sm font-bold">{selectedData.name} — Gene Percentile Map</h3>
              <Link href={`/athlete/${selectedData.id}`} className="ml-auto text-[9px] text-uc-cyan tracking-wider uppercase font-bold hover:text-white transition-colors flex items-center gap-1">
                Full Profile <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-3">
              {METRIC_DEFS.map((m) => (
                <PercentileBar key={m.key} athlete={selectedData} metricKey={m.key} allValues={allMetricValues[m.key]} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Distribution Charts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4 flex items-center gap-2">
            <Activity size={12} /> Pool Distributions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {METRIC_DEFS.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass rounded-xl p-5"
              >
                <DistributionChart metricKey={m.key} athletes={athletes} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Correlation Scatters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={12} /> Gene Correlations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <CorrelationScatter xKey="velocity" yKey="accuracy" athletes={athletes} highlight={selectedAthlete !== "all" ? selectedAthlete : undefined} />
            <CorrelationScatter xKey="mechanics" yKey="decisionSpeed" athletes={athletes} highlight={selectedAthlete !== "all" ? selectedAthlete : undefined} />
            <CorrelationScatter xKey="spinRate" yKey="velocity" athletes={athletes} highlight={selectedAthlete !== "all" ? selectedAthlete : undefined} />
          </div>
        </motion.div>

        {/* Gene Trait Leaders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 mb-12"
        >
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-5 flex items-center gap-2">
            <Award size={12} /> Gene Trait Leaders
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {metricLeaders.map((m) => (
              <div key={m.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                  <m.icon size={14} style={{ color: m.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase">{m.code} — {m.label}</p>
                  <Link href={`/athlete/${m.leader.id}`} className="text-xs font-bold hover:text-uc-cyan transition-colors truncate block">
                    {m.leader.name}
                  </Link>
                </div>
                <p className="text-lg font-black font-mono" style={{ color: m.color }}>
                  {m.leader.metrics[m.key].toFixed(m.decimals)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Want to see how two genomes stack up side by side?
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
