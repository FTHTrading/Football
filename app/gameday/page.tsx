"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Radio,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Activity,
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  Dna,
  Star,
  Timer,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";

/* ── Types ────────────────────────────── */
interface PlayEvent {
  id: string;
  quarter: number;
  time: string;
  type: "pass_complete" | "pass_incomplete" | "touchdown" | "interception" | "sack" | "scramble" | "rush_td";
  description: string;
  yardsGained: number;
  distance: "short" | "medium" | "deep";
  geneActivated: string;
  genePulse: number; // 0-100 how much that gene was used
}

interface GameState {
  quarter: number;
  timeRemaining: string;
  homeScore: number;
  awayScore: number;
  possession: "home" | "away";
  down: number;
  distance: number;
  yardLine: number;
  drivePlays: number;
  driveYards: number;
}

interface LiveStats {
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  rushYards: number;
  qbRating: number;
  genePulses: Record<string, number>;
}

/* ── Gene Map ─────────────────────────── */
const GENE_COLORS: Record<string, string> = {
  "VEL-α": "#00C2FF",
  "ACC-γ": "#00FF88",
  "REL-β": "#A855F7",
  "MECH-δ": "#F59E0B",
  "DEC-ε": "#FF3B5C",
  "SPR-ζ": "#EC4899",
};

/* ── Play Generator ───────────────────── */
function generatePlays(athlete: Athlete): PlayEvent[] {
  const m = athlete.metrics;
  const plays: PlayEvent[] = [];
  const playTemplates = [
    { type: "pass_complete" as const, desc: "Complete pass over the middle", yards: 12, dist: "medium" as const, gene: "ACC-γ", pulse: 85 },
    { type: "pass_complete" as const, desc: "Quick slant, ball out in a flash", yards: 8, dist: "short" as const, gene: "REL-β", pulse: 92 },
    { type: "pass_complete" as const, desc: "Deep ball down the sideline", yards: 38, dist: "deep" as const, gene: "VEL-α", pulse: 95 },
    { type: "pass_incomplete" as const, desc: "Overthrown on a corner route", yards: 0, dist: "deep" as const, gene: "MECH-δ", pulse: 40 },
    { type: "touchdown" as const, desc: "TOUCHDOWN! Perfect read on the seam", yards: 24, dist: "medium" as const, gene: "DEC-ε", pulse: 98 },
    { type: "pass_complete" as const, desc: "Screen pass, great touch", yards: 6, dist: "short" as const, gene: "MECH-δ", pulse: 78 },
    { type: "scramble" as const, desc: "Escapes pressure, gains yards", yards: 14, dist: "medium" as const, gene: "DEC-ε", pulse: 88 },
    { type: "pass_complete" as const, desc: "Bullet pass across the field", yards: 16, dist: "medium" as const, gene: "VEL-α", pulse: 90 },
    { type: "sack" as const, desc: "Sacked trying to extend the play", yards: -7, dist: "short" as const, gene: "DEC-ε", pulse: 25 },
    { type: "pass_complete" as const, desc: "Back-shoulder throw, elite accuracy", yards: 22, dist: "deep" as const, gene: "ACC-γ", pulse: 94 },
    { type: "touchdown" as const, desc: "TOUCHDOWN! Rope to the corner of the endzone", yards: 18, dist: "medium" as const, gene: "VEL-α", pulse: 97 },
    { type: "pass_complete" as const, desc: "Checkdown under pressure", yards: 4, dist: "short" as const, gene: "DEC-ε", pulse: 72 },
    { type: "interception" as const, desc: "Picked off trying to force it deep", yards: 0, dist: "deep" as const, gene: "DEC-ε", pulse: 15 },
    { type: "pass_complete" as const, desc: "Perfect spiral on the out route", yards: 14, dist: "medium" as const, gene: "SPR-ζ", pulse: 88 },
    { type: "rush_td" as const, desc: "RUSHING TD! Designed QB draw", yards: 8, dist: "short" as const, gene: "DEC-ε", pulse: 85 },
    { type: "pass_complete" as const, desc: "Quick release on the bubble screen", yards: 5, dist: "short" as const, gene: "REL-β", pulse: 90 },
  ];

  const quarters = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
  const times = ["12:45", "10:22", "7:15", "3:48", "14:30", "11:05", "6:32", "1:15", "13:20", "9:55", "5:40", "2:10", "14:00", "10:30", "5:15", "0:42"];

  // Adjust plays based on athlete genes
  for (let i = 0; i < playTemplates.length; i++) {
    const t = playTemplates[i];
    let adjustedPulse = t.pulse;
    if (t.gene === "VEL-α") adjustedPulse = Math.min(99, Math.round(t.pulse * (m.velocity / 60)));
    if (t.gene === "ACC-γ") adjustedPulse = Math.min(99, Math.round(t.pulse * (m.accuracy / 90)));
    if (t.gene === "DEC-ε") adjustedPulse = Math.min(99, Math.round(t.pulse * (m.decisionSpeed / 88)));
    
    plays.push({
      id: `play-${i}`,
      quarter: quarters[i],
      time: times[i],
      type: t.type,
      description: t.desc,
      yardsGained: t.yards,
      distance: t.dist,
      geneActivated: t.gene,
      genePulse: adjustedPulse,
    });
  }
  return plays;
}

function computeStats(plays: PlayEvent[], upTo: number): LiveStats {
  const active = plays.slice(0, upTo);
  const passes = active.filter((p) => p.type.startsWith("pass") || p.type === "touchdown" || p.type === "interception");
  const completions = active.filter((p) => p.type === "pass_complete" || p.type === "touchdown").length;
  const attempts = passes.length;
  const yards = active.reduce((s, p) => s + (p.type !== "interception" ? p.yardsGained : 0), 0);
  const tds = active.filter((p) => p.type === "touchdown" || p.type === "rush_td").length;
  const ints = active.filter((p) => p.type === "interception").length;
  const rushYards = active.filter((p) => p.type === "scramble" || p.type === "rush_td").reduce((s, p) => s + p.yardsGained, 0);
  const compPct = attempts > 0 ? completions / attempts : 0;
  const ypa = attempts > 0 ? yards / attempts : 0;
  const qbRating = Math.min(158.3, Math.round(((compPct * 100 - 30) * 0.05 + (ypa - 3) * 0.25 + (tds / Math.max(1, attempts)) * 20 + 2.375 - (ints / Math.max(1, attempts)) * 25) * 100 / 6) / 100 * 158.3);

  const genePulses: Record<string, number> = {};
  for (const p of active) {
    if (!genePulses[p.geneActivated]) genePulses[p.geneActivated] = 0;
    genePulses[p.geneActivated] = Math.max(genePulses[p.geneActivated], p.genePulse);
  }

  return { completions, attempts, yards, touchdowns: tds, interceptions: ints, rushYards, qbRating: Math.max(0, Math.round(qbRating * 10) / 10), genePulses };
}

/* ── Play Type Badge ──────────────────── */
function PlayBadge({ type }: { type: PlayEvent["type"] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pass_complete: { bg: "bg-uc-green/10", text: "text-uc-green", label: "Complete" },
    pass_incomplete: { bg: "bg-uc-gray-400/10", text: "text-uc-gray-400", label: "Incomplete" },
    touchdown: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "TOUCHDOWN" },
    interception: { bg: "bg-uc-red/10", text: "text-uc-red", label: "INT" },
    sack: { bg: "bg-uc-red/10", text: "text-uc-red", label: "Sack" },
    scramble: { bg: "bg-uc-cyan/10", text: "text-uc-cyan", label: "Scramble" },
    rush_td: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "RUSH TD" },
  };
  const c = config[type] || config.pass_incomplete;
  return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
}

/* ── Main Component ───────────────────── */
export default function GameDayPage() {
  const [selectedId, setSelectedId] = useState(PLACEHOLDER_ATHLETES[0].id);
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedId)!;
  const allPlays = useMemo(() => generatePlays(athlete), [athlete]);

  const [currentPlay, setCurrentPlay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quarterFilter, setQuarterFilter] = useState<number | null>(null);

  // Auto-advance plays
  useEffect(() => {
    if (!isPlaying || currentPlay >= allPlays.length) {
      if (currentPlay >= allPlays.length) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentPlay((p) => p + 1), 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, currentPlay, allPlays.length]);

  const handleReset = useCallback(() => {
    setCurrentPlay(0);
    setIsPlaying(false);
  }, []);

  const stats = useMemo(() => computeStats(allPlays, currentPlay), [allPlays, currentPlay]);
  const visiblePlays = allPlays.slice(0, currentPlay);
  const filteredPlays = quarterFilter ? visiblePlays.filter((p) => p.quarter === quarterFilter) : visiblePlays;

  const gameState: GameState = useMemo(() => {
    const lastPlay = visiblePlays[visiblePlays.length - 1];
    return {
      quarter: lastPlay?.quarter || 1,
      timeRemaining: lastPlay?.time || "15:00",
      homeScore: stats.touchdowns * 7,
      awayScore: Math.max(0, Math.floor(stats.touchdowns * 7 * 0.6) - 3),
      possession: "home",
      down: ((currentPlay % 4) + 1) as 1 | 2 | 3 | 4,
      distance: 10 - (currentPlay % 4) * 3,
      yardLine: 35 + (currentPlay * 3) % 40,
      drivePlays: (currentPlay % 6) + 1,
      driveYards: ((currentPlay % 6) + 1) * 8,
    };
  }, [visiblePlays, stats, currentPlay]);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center relative">
              <Radio size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-uc-red animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Game Day <span className="gradient-text-dna">Live</span>
            </h1>
            {isPlaying && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-uc-red/20 text-uc-red text-[10px] font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-uc-red" /> LIVE
              </span>
            )}
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Real-time genome activation tracker. Watch gene markers fire during live game action — see which DNA sequences define the performance.
          </p>
        </motion.div>

        {/* ── Controls Bar ── */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setCurrentPlay(0); setIsPlaying(false); }}
            className="appearance-none bg-uc-panel border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-uc-cyan/50"
          >
            {PLACEHOLDER_ATHLETES.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                isPlaying ? "bg-uc-red/20 text-uc-red" : "bg-uc-green/20 text-uc-green"
              }`}
            >
              {isPlaying ? <><Pause size={12} /> Pause</> : <><Play size={12} /> {currentPlay > 0 ? "Resume" : "Start Game"}</>}
            </button>
            <button onClick={handleReset} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white transition">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-uc-gray-400 mr-1">Play</span>
            <span className="text-sm font-bold text-uc-cyan tabular-nums">{currentPlay}</span>
            <span className="text-[10px] text-uc-gray-400">/ {allPlays.length}</span>
          </div>
        </div>

        {/* ── Scoreboard ── */}
        <motion.div layout className="glass rounded-2xl p-5 mb-8">
          <div className="grid grid-cols-3 items-center">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">Home</p>
              <p className="text-4xl font-black text-uc-green tabular-nums">{gameState.homeScore}</p>
              <p className="text-xs text-white mt-1">{athlete.school.split(" ")[0]}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer size={12} className="text-uc-cyan" />
                <span className="text-xs font-mono text-uc-cyan">Q{gameState.quarter} · {gameState.timeRemaining}</span>
              </div>
              <p className="text-[10px] text-uc-gray-400">
                {gameState.down}{gameState.down === 1 ? "st" : gameState.down === 2 ? "nd" : gameState.down === 3 ? "rd" : "th"} & {Math.max(1, gameState.distance)}
              </p>
              <p className="text-[10px] text-uc-gray-400 mt-0.5">Ball on {gameState.yardLine > 50 ? `OPP ${100 - gameState.yardLine}` : `OWN ${gameState.yardLine}`}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">Away</p>
              <p className="text-4xl font-black text-white tabular-nums">{gameState.awayScore}</p>
              <p className="text-xs text-uc-gray-400 mt-1">Opponent</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── LEFT: Stat Line + Gene Pulses ── */}
          <div className="space-y-6">
            {/* Stat Line */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                <Activity size={12} /> Live Stat Line
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Comp/Att", value: `${stats.completions}/${stats.attempts}`, color: "text-white" },
                  { label: "Pass Yards", value: stats.yards.toString(), color: "text-uc-cyan" },
                  { label: "Touchdowns", value: stats.touchdowns.toString(), color: "text-uc-green" },
                  { label: "INTs", value: stats.interceptions.toString(), color: stats.interceptions > 0 ? "text-uc-red" : "text-white" },
                  { label: "Rush Yards", value: stats.rushYards.toString(), color: "text-purple-400" },
                  { label: "QB Rating", value: stats.qbRating.toFixed(1), color: stats.qbRating > 100 ? "text-uc-green" : "text-uc-cyan" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] rounded-lg p-3">
                    <p className="text-[9px] uppercase tracking-widest text-uc-gray-400 mb-0.5">{s.label}</p>
                    <p className={`text-xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gene Pulse Monitor */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                <Dna size={12} /> Gene Pulse Monitor
              </h3>
              <div className="space-y-3">
                {Object.entries(GENE_COLORS).map(([gene, color]) => {
                  const pulse = stats.genePulses[gene] || 0;
                  const lastFired = visiblePlays.filter((p) => p.geneActivated === gene).slice(-1)[0];
                  return (
                    <div key={gene}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-uc-gray-400">{gene}</span>
                        <span className="text-xs font-bold tabular-nums" style={{ color }}>{pulse > 0 ? pulse : "—"}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={false}
                          animate={{ width: `${pulse}%` }}
                          transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        />
                        {lastFired && pulse > 80 && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: color, opacity: 0.3 }}
                            animate={{ opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── CENTER + RIGHT: Play Feed ── */}
          <div className="lg:col-span-2">
            {/* Quarter Filter */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-uc-gray-400 uppercase tracking-widest">Quarter:</span>
              {[null, 1, 2, 3, 4].map((q) => (
                <button
                  key={q ?? "all"}
                  onClick={() => setQuarterFilter(q)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    quarterFilter === q ? "bg-uc-cyan/20 text-uc-cyan" : "bg-white/5 text-uc-gray-400 hover:text-white"
                  }`}
                >
                  {q || "All"}
                </button>
              ))}
            </div>

            {/* Play-by-Play Feed */}
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
              <AnimatePresence>
                {[...filteredPlays].reverse().map((play, i) => (
                  <motion.div
                    key={play.id}
                    initial={{ opacity: 0, x: 20, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`glass rounded-xl p-4 border-l-2 ${
                      play.type === "touchdown" || play.type === "rush_td"
                        ? "border-yellow-500 bg-yellow-500/[0.03]"
                        : play.type === "interception" || play.type === "sack"
                        ? "border-uc-red bg-uc-red/[0.02]"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Gene indicator */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: (GENE_COLORS[play.geneActivated] || "#666") + "15" }}
                      >
                        <Dna size={14} style={{ color: GENE_COLORS[play.geneActivated] || "#666" }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-uc-gray-400">Q{play.quarter} · {play.time}</span>
                          <PlayBadge type={play.type} />
                          {play.yardsGained !== 0 && (
                            <span className={`text-xs font-bold ${play.yardsGained > 0 ? "text-uc-green" : "text-uc-red"}`}>
                              {play.yardsGained > 0 ? "+" : ""}{play.yardsGained} yds
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white">{play.description}</p>

                        {/* Gene Activation */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] text-uc-gray-400">Gene:</span>
                          <span className="text-[10px] font-mono font-bold" style={{ color: GENE_COLORS[play.geneActivated] }}>
                            {play.geneActivated}
                          </span>
                          <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: GENE_COLORS[play.geneActivated] }}
                              initial={{ width: 0 }}
                              animate={{ width: `${play.genePulse}%` }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                            />
                          </div>
                          <span className="text-[9px] tabular-nums" style={{ color: GENE_COLORS[play.geneActivated] }}>
                            {play.genePulse}%
                          </span>
                        </div>
                      </div>

                      {/* Play type icon */}
                      {(play.type === "touchdown" || play.type === "rush_td") && (
                        <Flame size={18} className="text-yellow-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {currentPlay === 0 && (
                <div className="text-center py-16 text-uc-gray-400">
                  <Radio size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Press <strong className="text-uc-green">Start Game</strong> to begin the live simulation</p>
                  <p className="text-[10px] mt-1">Watch gene markers activate in real-time as plays unfold</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <p className="text-uc-gray-400 text-sm mb-4">Deep-dive into genome performance metrics</p>
          <div className="flex justify-center gap-3">
            <Link href="/film-room" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all">
              <Play size={14} /> Film Room <ArrowRight size={14} />
            </Link>
            <Link href="/analytics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm transition">
              Analytics Explorer
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
