"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  Play,
  Pause,
  Film,
  Dna,
  Target,
  ArrowRight,
  ChevronDown,
  Zap,
  Eye,
  Shield,
  Activity,
  Clock,
  MapPin,
  Crosshair,
  TrendingUp,
  BarChart3,
} from "lucide-react";

/* ── Play types for the film breakdown ── */
type PlayResult = "completion" | "incompletion" | "touchdown" | "interception" | "scramble";

interface PlayBreakdown {
  id: string;
  playNumber: number;
  quarter: number;
  down: number;
  distance: number;
  yardLine: number;
  passType: string;
  routeTarget: string;
  result: PlayResult;
  airYards: number;
  completionPct: number;
  timeInPocket: number;
  readProgression: string[];
  defenseScheme: string;
  notes: string;
}

/* ── Generate realistic play data ── */
function generateFilm(a: Athlete): PlayBreakdown[] {
  const routes = ["Slant", "Post", "Go", "Out", "Dig", "Comeback", "Corner", "Seam", "Screen", "Curl"];
  const defenses = ["Cover 2", "Cover 3", "Cover 4", "Man Press", "Zone Blitz", "Tampa 2"];
  const progressions = ["1st Read", "2nd Read", "3rd Read", "Checkdown"];

  return Array.from({ length: 12 }, (_, i) => {
    const base = a.metrics.accuracy;
    const isComplete = Math.random() * 100 < base;
    const isTD = isComplete && Math.random() < 0.15;
    const isINT = !isComplete && Math.random() < 0.08;
    const isScramble = !isComplete && !isINT && Math.random() < 0.12;

    const result: PlayResult = isTD
      ? "touchdown"
      : isINT
      ? "interception"
      : isScramble
      ? "scramble"
      : isComplete
      ? "completion"
      : "incompletion";

    const readCount = Math.floor(Math.random() * 3) + 1;
    const readProg = progressions.slice(0, readCount);

    return {
      id: `${a.id}-play-${i + 1}`,
      playNumber: i + 1,
      quarter: Math.min(4, Math.floor(i / 3) + 1),
      down: (i % 4) + 1,
      distance: Math.floor(Math.random() * 12) + 2,
      yardLine: Math.floor(Math.random() * 60) + 20,
      passType: Math.random() > 0.5 ? "Dropback" : Math.random() > 0.5 ? "Play Action" : "RPO",
      routeTarget: routes[Math.floor(Math.random() * routes.length)],
      result,
      airYards: Math.floor(Math.random() * 35) + 3,
      completionPct: Math.round(base + (Math.random() * 10 - 5)),
      timeInPocket: +(1.5 + Math.random() * 2.5).toFixed(1),
      readProgression: readProg,
      defenseScheme: defenses[Math.floor(Math.random() * defenses.length)],
      notes: result === "touchdown"
        ? "Perfect placement on the money throw."
        : result === "interception"
        ? "Forced into tight window against coverage."
        : result === "scramble"
        ? "Escaped pressure, gained yards with legs."
        : isComplete
        ? "Clean release, hit receiver in stride."
        : "Receiver well-covered, elected to throw away.",
    };
  });
}

const resultColors: Record<PlayResult, string> = {
  completion: "text-uc-green bg-uc-green/10",
  incompletion: "text-uc-gray-400 bg-white/5",
  touchdown: "text-yellow-400 bg-yellow-400/10",
  interception: "text-uc-red bg-uc-red/10",
  scramble: "text-uc-cyan bg-uc-cyan/10",
};

const resultLabels: Record<PlayResult, string> = {
  completion: "CMP",
  incompletion: "INC",
  touchdown: "TD",
  interception: "INT",
  scramble: "SCR",
};

/* ── Throw Map Visualization (SVG field) ── */
function ThrowMap({ plays }: { plays: PlayBreakdown[] }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4">Throw Map</h3>
      <svg viewBox="0 0 300 400" className="w-full max-w-xs mx-auto">
        {/* Field background */}
        <rect x="0" y="0" width="300" height="400" rx="8" fill="#111111" />

        {/* Yard lines */}
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <line x1="20" y1={40 + i * 32} x2="280" y2={40 + i * 32} stroke="#ffffff08" strokeWidth="1" />
            <text x="10" y={44 + i * 32} fill="#333" fontSize="6" fontFamily="monospace">{i * 10}</text>
          </g>
        ))}

        {/* Hash marks */}
        <line x1="100" y1="40" x2="100" y2="380" stroke="#ffffff05" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="200" y1="40" x2="200" y2="380" stroke="#ffffff05" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* QB position */}
        <circle cx="150" cy="360" r="6" fill="#00C2FF" opacity="0.3" />
        <text x="150" y="363" textAnchor="middle" fill="#00C2FF" fontSize="6" fontFamily="monospace">QB</text>

        {/* Throw dots */}
        {plays.map((p, i) => {
          const spreadX = 60 + ((i * 37 + p.airYards * 7) % 180);
          const spreadY = 360 - (p.airYards * 8);
          const color = p.result === "touchdown" ? "#FFD700" :
                        p.result === "completion" ? "#00FF88" :
                        p.result === "interception" ? "#FF3B5C" :
                        p.result === "scramble" ? "#00C2FF" : "#4B5563";
          return (
            <g key={p.id}>
              <line x1="150" y1="360" x2={spreadX} y2={spreadY} stroke={color} strokeWidth="0.5" opacity="0.3" />
              <circle cx={spreadX} cy={spreadY} r={p.result === "touchdown" ? 5 : 3.5} fill={color} opacity="0.7" />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {(["completion", "touchdown", "incompletion", "interception", "scramble"] as const).map((r) => (
          <div key={r} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              r === "completion" ? "bg-uc-green" :
              r === "touchdown" ? "bg-yellow-400" :
              r === "interception" ? "bg-uc-red" :
              r === "scramble" ? "bg-uc-cyan" : "bg-uc-gray-500"
            }`} />
            <span className="text-[8px] text-uc-gray-500 uppercase">{resultLabels[r]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Play Row ── */
function PlayRow({ play, delay }: { play: PlayBreakdown; delay: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="glass rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[10px] font-mono text-uc-gray-500 w-6">#{play.playNumber}</span>
        <span className="text-[10px] text-uc-gray-500 w-12">Q{play.quarter}</span>
        <span className="text-[10px] text-uc-gray-400 w-16">{play.down}&{play.distance}</span>
        <span className="text-xs font-bold flex-1 truncate">{play.passType} → {play.routeTarget}</span>
        <span className="text-[10px] font-mono text-uc-gray-400 w-12">{play.airYards} yds</span>
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${resultColors[play.result]}`}>
          {resultLabels[play.result]}
        </span>
        <ChevronDown size={12} className={`text-uc-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase mb-0.5">Time in Pocket</p>
                <p className="text-sm font-bold font-mono">{play.timeInPocket}s</p>
              </div>
              <div>
                <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase mb-0.5">Defense</p>
                <p className="text-sm font-bold">{play.defenseScheme}</p>
              </div>
              <div>
                <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase mb-0.5">Read Progression</p>
                <div className="flex gap-1">
                  {play.readProgression.map((r, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[7px] font-bold bg-uc-cyan/10 text-uc-cyan">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase mb-0.5">Completion Zone</p>
                <p className="text-sm font-bold font-mono">{play.completionPct}%</p>
              </div>
              <div className="col-span-2 md:col-span-4">
                <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase mb-0.5">Scout Note</p>
                <p className="text-xs text-uc-gray-400">{play.notes}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Film Room ── */
export default function FilmRoomPage() {
  const [selectedId, setSelectedId] = useState("1");
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedId) || PLACEHOLDER_ATHLETES[0];
  const plays = useMemo(() => generateFilm(athlete), [athlete]);

  const stats = useMemo(() => {
    const completions = plays.filter((p) => p.result === "completion" || p.result === "touchdown");
    const tds = plays.filter((p) => p.result === "touchdown");
    const ints = plays.filter((p) => p.result === "interception");
    const attempts = plays.filter((p) => p.result !== "scramble");
    const avgAirYards = plays.reduce((s, p) => s + p.airYards, 0) / plays.length;
    const avgPocket = plays.reduce((s, p) => s + p.timeInPocket, 0) / plays.length;

    return {
      completion: ((completions.length / (attempts.length || 1)) * 100).toFixed(1),
      tds: tds.length,
      ints: ints.length,
      avgAirYards: avgAirYards.toFixed(1),
      avgPocket: avgPocket.toFixed(1),
      plays: plays.length,
    };
  }, [plays]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-400/20 text-[10px] tracking-[0.3em] uppercase text-purple-400 mb-4">
            <Film size={12} />
            Film Room
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Genome Film Breakdown</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Play-by-play DNA analysis. See throw maps, read progressions,
            pocket time, and scout-level insights on every snap.
          </p>
        </motion.div>

        {/* Athlete Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-1 w-full md:w-auto">
            <Film size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-purple-400/50 transition-colors"
            >
              {PLACEHOLDER_ATHLETES.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.school}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>

          <Link
            href={`/athlete/${selectedId}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/5 text-uc-gray-400 text-xs font-bold tracking-wider uppercase border border-white/5 hover:bg-white/10 transition-all"
          >
            Full Profile <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8"
        >
          {[
            { label: "Comp %", value: `${stats.completion}%`, icon: Target, color: "text-uc-green" },
            { label: "TDs", value: stats.tds.toString(), icon: Zap, color: "text-yellow-400" },
            { label: "INTs", value: stats.ints.toString(), icon: Shield, color: "text-uc-red" },
            { label: "Avg Air Yds", value: stats.avgAirYards, icon: TrendingUp, color: "text-uc-cyan" },
            { label: "Avg Pocket", value: `${stats.avgPocket}s`, icon: Clock, color: "text-purple-400" },
            { label: "Total Plays", value: stats.plays.toString(), icon: BarChart3, color: "text-uc-gray-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-3 text-center">
              <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
              <p className="text-lg font-bold font-mono">{s.value}</p>
              <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Throw map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ThrowMap plays={plays} />
          </motion.div>

          {/* Play-by-play */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 space-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold">Play-by-Play Breakdown</h3>
              <span className="text-[9px] text-uc-gray-500">{plays.length} plays analyzed</span>
            </div>
            {plays.map((play, i) => (
              <PlayRow key={play.id} play={play} delay={0.03 * i} />
            ))}
          </motion.div>
        </div>

        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Compare film performance head-to-head.
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-500 text-white font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
          >
            Compare Genomes
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
