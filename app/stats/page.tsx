"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  ChevronDown,
  ArrowRight,
  Dna,
  Zap,
  Target,
  Eye,
  Star,
  Users,
  Activity,
  Trophy,
  Crosshair,
  Wind,
  Brain,
  Sparkles,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── Simulated season game log ── */
interface GameLog {
  week: number;
  opponent: string;
  result: "W" | "L";
  score: string;
  compAtt: string;
  passYards: number;
  passTDs: number;
  ints: number;
  rushYards: number;
  rushTDs: number;
  qbRating: number;
  genomeFlare: number; // peak genome activation for the game
}

const OPPONENTS = [
  "Northside Prep", "Eastlake Academy", "St. Francis", "Lincoln High", "Central Prep",
  "Westfield Academy", "Oakwood School", "Riverside Prep", "Crestwood High", "Heritage Academy",
  "Summit Prep", "Valley Christian",
];

function generateSeason(a: Athlete): GameLog[] {
  const base = a.metrics;
  const logs: GameLog[] = [];
  for (let w = 1; w <= 12; w++) {
    const fluct = 0.85 + Math.sin(w * 1.3 + a.name.length) * 0.15;
    const compPct = Math.min(0.78, (base.accuracy / 100) * fluct * 0.85);
    const att = Math.floor(22 + Math.sin(w * 2.1 + a.name.length) * 8);
    const comp = Math.floor(att * compPct);
    const ypa = 7.5 + (base.velocity - 50) / 10 + Math.sin(w * 0.9) * 2;
    const passYards = Math.round(comp * ypa);
    const passTDs = Math.max(0, Math.floor(passYards / 85 + Math.sin(w) * 0.8));
    const ints = Math.max(0, Math.floor(2 - base.decisionSpeed / 50 + Math.sin(w * 3.3) * 0.8));
    const rushYards = Math.floor(25 + Math.sin(w * 1.7) * 20 + (a.qbClass === "Dual-Threat" ? 30 : 0));
    const rushTDs = Math.max(0, Math.floor(rushYards / 60));
    const qbRating = Math.round(Math.min(158.3, 80 + base.accuracy * 0.5 + passTDs * 8 - ints * 12 + Math.sin(w) * 10));
    const oppScore = Math.floor(14 + Math.random() * 17);
    const myScore = Math.floor((passTDs + rushTDs) * 7 + 3 + Math.random() * 7);
    const result = myScore > oppScore ? "W" as const : "L" as const;
    logs.push({
      week: w,
      opponent: OPPONENTS[(w - 1) % OPPONENTS.length],
      result,
      score: `${Math.max(myScore, oppScore)}-${Math.min(myScore, oppScore)}`,
      compAtt: `${comp}/${att}`,
      passYards,
      passTDs,
      ints,
      rushYards,
      rushTDs,
      qbRating,
      genomeFlare: Math.round(50 + computeGAI(base).gai * 0.4 + Math.sin(w * 1.8) * 15),
    });
  }
  return logs;
}

/* ── Stat Highlights ── */
function seasonTotals(logs: GameLog[]) {
  const totalComp = logs.reduce((s, g) => s + parseInt(g.compAtt.split("/")[0]), 0);
  const totalAtt = logs.reduce((s, g) => s + parseInt(g.compAtt.split("/")[1]), 0);
  return {
    record: `${logs.filter((g) => g.result === "W").length}-${logs.filter((g) => g.result === "L").length}`,
    compAtt: `${totalComp}/${totalAtt}`,
    compPct: ((totalComp / totalAtt) * 100).toFixed(1),
    passYards: logs.reduce((s, g) => s + g.passYards, 0),
    passTDs: logs.reduce((s, g) => s + g.passTDs, 0),
    ints: logs.reduce((s, g) => s + g.ints, 0),
    rushYards: logs.reduce((s, g) => s + g.rushYards, 0),
    rushTDs: logs.reduce((s, g) => s + g.rushTDs, 0),
    avgQBR: (logs.reduce((s, g) => s + g.qbRating, 0) / logs.length).toFixed(1),
    avgGenomeFlare: Math.round(logs.reduce((s, g) => s + g.genomeFlare, 0) / logs.length),
    bestGame: logs.sort((a, b) => b.qbRating - a.qbRating)[0],
  };
}

type TabId = "overview" | "gamelog" | "trends";

export default function SeasonStatsPage() {
  const [selectedAthlete, setSelectedAthlete] = useState(PLACEHOLDER_ATHLETES[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthlete) ?? PLACEHOLDER_ATHLETES[0];
  const season = useMemo(() => generateSeason(athlete), [athlete]);
  const totals = useMemo(() => seasonTotals([...season]), [season]);
  const gaiResult = computeGAI(athlete.metrics);
  const gs = gaiResult.gai;

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "gamelog", label: "Game Log", icon: Calendar },
    { id: "trends", label: "Trends", icon: TrendingUp },
  ];

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Season <span className="gradient-text-dna">Stats</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Complete season breakdown with genome-enhanced analytics. Track performance week by week and discover statistical DNA patterns.
          </p>
        </motion.div>

        {/* ── Athlete Selector ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Eye size={14} className="text-uc-gray-400" />
          {PLACEHOLDER_ATHLETES.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAthlete(a.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedAthlete === a.id ? "bg-uc-cyan/20 text-uc-cyan border border-uc-cyan/30" : "bg-white/5 text-uc-gray-400 hover:text-white"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-uc-surface flex items-center justify-center text-[8px] font-bold">
                {a.name.split(" ").map((n) => n[0]).join("")}
              </span>
              {a.name.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* ── Hero Stats ── */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-uc-cyan to-uc-green flex items-center justify-center text-xl font-black text-black">
              {athlete.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{athlete.name}</h2>
              <p className="text-xs text-uc-gray-400">{athlete.school} · Class of {athlete.gradYear} · {athlete.qbClass}</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest">GAI · {gaiResult.tier}</p>
              <p className="text-3xl font-black tabular-nums" style={{ color: gaiResult.tierColor }}>{gs}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Record", value: totals.record, icon: Trophy, color: "text-yellow-400" },
              { label: "Pass Yards", value: totals.passYards.toLocaleString(), icon: Zap, color: "text-uc-cyan" },
              { label: "Pass TDs", value: totals.passTDs, icon: Target, color: "text-uc-green" },
              { label: "Rush Yards", value: totals.rushYards.toLocaleString(), icon: Wind, color: "text-purple-400" },
              { label: "Avg QBR", value: totals.avgQBR, icon: Star, color: "text-orange-400" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <Icon size={14} className={`mx-auto mb-1 ${s.color}`} />
                  <p className={`text-lg font-black tabular-nums ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition ${
                  activeTab === tab.id ? "bg-uc-cyan/15 text-uc-cyan" : "text-uc-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Passing Splits */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                    <Crosshair size={12} /> Passing Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Comp/Att", value: totals.compAtt },
                      { label: "Comp %", value: `${totals.compPct}%` },
                      { label: "Pass Yards", value: totals.passYards.toLocaleString() },
                      { label: "Pass TDs", value: totals.passTDs },
                      { label: "INTs", value: totals.ints },
                      { label: "TD:INT Ratio", value: totals.ints > 0 ? `${(totals.passTDs / totals.ints).toFixed(1)}:1` : `${totals.passTDs}:0` },
                      { label: "Yards/Game", value: Math.round(totals.passYards / 12).toLocaleString() },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.03]">
                        <span className="text-xs text-uc-gray-400">{row.label}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rushing Splits */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                    <Wind size={12} /> Rushing + Genome
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Rush Yards", value: totals.rushYards.toLocaleString() },
                      { label: "Rush TDs", value: totals.rushTDs },
                      { label: "Rush Yards/Game", value: Math.round(totals.rushYards / 12) },
                      { label: "Total TDs", value: totals.passTDs + totals.rushTDs },
                      { label: "Total Yards", value: (totals.passYards + totals.rushYards).toLocaleString() },
                      { label: "Avg Genome Flare", value: totals.avgGenomeFlare },
                      { label: "Best QBR", value: totals.bestGame.qbRating },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.03]">
                        <span className="text-xs text-uc-gray-400">{row.label}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gene Averages */}
                <div className="glass rounded-xl p-5 md:col-span-2">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                    <Dna size={12} /> Gene Performance Averages
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { gene: "VEL-α", label: "Velocity", value: Math.round(athlete.metrics.velocity), max: 75, color: "#00C2FF" },
                      { gene: "ACC-γ", label: "Accuracy", value: athlete.metrics.accuracy, max: 100, color: "#00FF88" },
                      { gene: "REL-β", label: "Release", value: Math.round((1 - athlete.metrics.releaseTime / 0.55) * 100), max: 100, color: "#A855F7" },
                      { gene: "MECH-δ", label: "Mechanics", value: athlete.metrics.mechanics, max: 100, color: "#F59E0B" },
                      { gene: "DEC-ε", label: "Decision", value: athlete.metrics.decisionSpeed, max: 100, color: "#EC4899" },
                      { gene: "SPR-ζ", label: "Spin Rate", value: Math.round(athlete.metrics.spinRate / 8), max: 100, color: "#06B6D4" },
                    ].map((g) => (
                      <div key={g.gene} className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-2">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                            <circle
                              cx="18" cy="18" r="15.9" fill="none"
                              stroke={g.color}
                              strokeWidth="2"
                              strokeDasharray={`${(g.value / g.max) * 100} 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{g.value}</span>
                        </div>
                        <p className="text-[9px] font-mono text-uc-gray-400">{g.gene}</p>
                        <p className="text-[8px] text-uc-gray-400/60">{g.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "gamelog" && (
            <motion.div key="gamelog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-uc-gray-400">
                      {["Wk", "Opponent", "Result", "Score", "C/A", "Pass Yds", "Pass TD", "INT", "Rush Yds", "Rush TD", "QBR", "Genome"].map((h) => (
                        <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {season.map((g) => (
                      <tr key={g.week} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                        <td className="px-3 py-2.5 text-white font-bold">{g.week}</td>
                        <td className="px-3 py-2.5 text-white">{g.opponent}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            g.result === "W" ? "bg-uc-green/20 text-uc-green" : "bg-red-500/20 text-red-400"
                          }`}>
                            {g.result}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-white">{g.score}</td>
                        <td className="px-3 py-2.5 text-uc-gray-300 tabular-nums">{g.compAtt}</td>
                        <td className="px-3 py-2.5 text-white font-semibold tabular-nums">{g.passYards}</td>
                        <td className="px-3 py-2.5 text-uc-green font-bold tabular-nums">{g.passTDs}</td>
                        <td className="px-3 py-2.5 text-red-400 font-bold tabular-nums">{g.ints}</td>
                        <td className="px-3 py-2.5 text-purple-400 tabular-nums">{g.rushYards}</td>
                        <td className="px-3 py-2.5 text-purple-400 font-bold tabular-nums">{g.rushTDs}</td>
                        <td className="px-3 py-2.5 text-orange-400 font-bold tabular-nums">{g.qbRating}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-uc-cyan to-uc-green" style={{ width: `${g.genomeFlare}%` }} />
                            </div>
                            <span className="text-[10px] text-uc-cyan tabular-nums">{g.genomeFlare}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "trends" && (
            <motion.div key="trends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pass Yards Trend */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Pass Yards by Week</h3>
                  <div className="flex items-end gap-1 h-32">
                    {season.map((g) => {
                      const maxYards = Math.max(...season.map((s) => s.passYards));
                      const pct = (g.passYards / maxYards) * 100;
                      return (
                        <div key={g.week} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[7px] text-uc-gray-400 tabular-nums">{g.passYards}</span>
                          <div
                            className="w-full rounded-t bg-gradient-to-t from-uc-cyan/60 to-uc-cyan transition-all"
                            style={{ height: `${pct}%` }}
                          />
                          <span className="text-[7px] text-uc-gray-400/60">W{g.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* QBR Trend */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">QB Rating by Week</h3>
                  <div className="flex items-end gap-1 h-32">
                    {season.map((g) => {
                      const pct = (g.qbRating / 158.3) * 100;
                      return (
                        <div key={g.week} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[7px] text-uc-gray-400 tabular-nums">{g.qbRating}</span>
                          <div
                            className="w-full rounded-t transition-all"
                            style={{
                              height: `${pct}%`,
                              background: g.qbRating >= 120 ? "linear-gradient(to top, rgba(0,255,136,0.6), #00FF88)" :
                                g.qbRating >= 90 ? "linear-gradient(to top, rgba(0,194,255,0.6), #00C2FF)" :
                                "linear-gradient(to top, rgba(245,158,11,0.6), #F59E0B)",
                            }}
                          />
                          <span className="text-[7px] text-uc-gray-400/60">W{g.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Genome Flare Trend */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Genome Activation Trend</h3>
                  <div className="flex items-end gap-1 h-32">
                    {season.map((g) => {
                      const pct = g.genomeFlare;
                      return (
                        <div key={g.week} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[7px] text-uc-gray-400 tabular-nums">{g.genomeFlare}</span>
                          <div
                            className="w-full rounded-t bg-gradient-to-t from-purple-500/60 to-purple-400 transition-all"
                            style={{ height: `${pct}%` }}
                          />
                          <span className="text-[7px] text-uc-gray-400/60">W{g.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TD / INT Trend */}
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">TDs vs INTs by Week</h3>
                  <div className="flex items-end gap-1 h-32">
                    {season.map((g) => {
                      const maxTD = Math.max(...season.map((s) => s.passTDs + s.rushTDs));
                      const totalTD = g.passTDs + g.rushTDs;
                      return (
                        <div key={g.week} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="flex gap-0.5 w-full" style={{ height: "100%", alignItems: "flex-end" }}>
                            <div
                              className="flex-1 rounded-t bg-uc-green/70"
                              style={{ height: `${(totalTD / Math.max(maxTD, 1)) * 100}%`, minHeight: totalTD > 0 ? "4px" : 0 }}
                            />
                            <div
                              className="flex-1 rounded-t bg-red-500/70"
                              style={{ height: `${(g.ints / Math.max(maxTD, 1)) * 100}%`, minHeight: g.ints > 0 ? "4px" : 0 }}
                            />
                          </div>
                          <span className="text-[7px] text-uc-gray-400/60">W{g.week}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-uc-green/70" />
                      <span className="text-[8px] text-uc-gray-400">TDs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-red-500/70" />
                      <span className="text-[8px] text-uc-gray-400">INTs</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <p className="text-uc-gray-400 text-sm mb-4">Dive deeper into performance data</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/analytics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition">
              <Activity size={14} /> Analytics Explorer
            </Link>
            <Link href="/gameday" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all">
              <Sparkles size={14} /> Game Day Live <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
