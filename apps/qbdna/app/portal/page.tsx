"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  GraduationCap,
  Star,
  Search,
  Filter,
  Dna,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  School,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI, computeAllFits } from "@/lib/genome-activation-index";

/* ── Portal Entry Type ──────────────────── */
interface PortalEntry {
  athlete: Athlete;
  fromSchool: string;
  status: "entered" | "committed" | "withdrawn";
  entryDate: string;
  commitDate?: string;
  destination?: string;
  topFits: { school: string; fitScore: number }[];
  portalRanking: number;
  visits: string[];
  trendDirection: "rising" | "steady" | "falling";
  genomeScore: number;
  gaiTier: string;
  gaiTierColor: string;
}

/* ── Generate Portal Entries ────────────── */
function generatePortalEntries(): PortalEntry[] {
  const statuses: PortalEntry["status"][] = ["entered", "committed", "entered", "entered", "withdrawn", "entered"];
  const fromSchools = ["LSU", "Michigan", "Penn State", "Clemson", "Miami", "Oregon"];
  const dates = ["Jan 5, 2026", "Dec 18, 2025", "Jan 12, 2026", "Dec 28, 2025", "Jan 2, 2026", "Dec 15, 2025"];
  const visitSets = [
    ["Alabama", "Georgia", "Ohio State"],
    ["Oregon", "USC", "Texas"],
    ["Georgia", "Auburn", "Clemson"],
    ["Ohio State", "Notre Dame", "Michigan"],
    ["USC", "UCLA", "Washington"],
    ["Alabama", "Georgia", "Texas", "Ohio State"],
  ];

  return PLACEHOLDER_ATHLETES.map((athlete, i) => {
    const gai = computeGAI(athlete.metrics);
    const genomeScore = gai.gai;
    const fits = computeAllFits(athlete.metrics);
    const topFits = fits
      .map((f) => ({ school: f.program.name, fitScore: f.fitScore }))
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 5);

    const status = statuses[i];
    return {
      athlete,
      fromSchool: fromSchools[i],
      status,
      entryDate: dates[i],
      commitDate: status === "committed" ? "Feb 14, 2026" : undefined,
      destination: status === "committed" ? topFits[0].school : undefined,
      topFits,
      portalRanking: i + 1,
      visits: visitSets[i],
      trendDirection: (genomeScore >= 80 ? "rising" : genomeScore >= 65 ? "steady" : "falling") as PortalEntry["trendDirection"],
      genomeScore,
      gaiTier: gai.tier,
      gaiTierColor: gai.tierColor,
    };
  }).sort((a, b) => b.genomeScore - a.genomeScore).map((e, i) => ({ ...e, portalRanking: i + 1 }));
}

/* ── Status Badge Component ───────────── */
function StatusBadge({ status }: { status: PortalEntry["status"] }) {
  const config = {
    entered: { color: "text-uc-cyan", bg: "bg-uc-cyan/10", icon: Clock, label: "In Portal" },
    committed: { color: "text-uc-green", bg: "bg-uc-green/10", icon: CheckCircle2, label: "Committed" },
    withdrawn: { color: "text-uc-gray-400", bg: "bg-white/5", icon: Minus, label: "Withdrawn" },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
      <Icon size={10} /> {config.label}
    </span>
  );
}

/* ── Trend Icon ───────────────────────── */
function TrendIcon({ dir }: { dir: "rising" | "steady" | "falling" }) {
  if (dir === "rising") return <TrendingUp size={12} className="text-uc-green" />;
  if (dir === "falling") return <TrendingDown size={12} className="text-uc-red" />;
  return <Minus size={12} className="text-uc-gray-400" />;
}

/* ── Main Component ───────────────────── */
export default function TransferPortalPage() {
  const entries = useMemo(generatePortalEntries, []);
  const [filterStatus, setFilterStatus] = useState<"all" | PortalEntry["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return entries
      .filter((e) => filterStatus === "all" || e.status === filterStatus)
      .filter((e) => e.athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.fromSchool.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [entries, filterStatus, searchQuery]);

  const summary = useMemo(() => ({
    total: entries.length,
    inPortal: entries.filter((e) => e.status === "entered").length,
    committed: entries.filter((e) => e.status === "committed").length,
    avgGenome: Math.round(entries.reduce((s, e) => s + e.genomeScore, 0) / entries.length),
  }), [entries]);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <ArrowRightLeft size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Transfer <span className="gradient-text-dna">Portal</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Genome-powered portal tracker. Analyze QB transfers through the lens of genetic fit scores — find where their DNA aligns with program needs.
          </p>
        </motion.div>

        {/* ── Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Entries", value: summary.total, color: "text-white" },
            { label: "In Portal", value: summary.inPortal, color: "text-uc-cyan" },
            { label: "Committed", value: summary.committed, color: "text-uc-green" },
            { label: "Avg Genome", value: summary.avgGenome, color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 text-center"
            >
              <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-400" />
            <input
              type="text"
              placeholder="Search by name or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-uc-panel border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-uc-gray-400 focus:outline-none focus:border-uc-cyan/50 transition"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "entered", "committed", "withdrawn"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterStatus === s ? "bg-uc-cyan/20 text-uc-cyan" : "bg-white/5 text-uc-gray-400 hover:text-white"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Portal Entries ── */}
        <div className="space-y-4">
          {filtered.map((entry, i) => {
            const a = entry.athlete;
            const expanded = expandedId === a.id;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-xl overflow-hidden"
              >
                {/* ── Main Row ── */}
                <button
                  onClick={() => setExpandedId(expanded ? null : a.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center gap-4 hover:bg-white/[0.02] transition"
                >
                  {/* Rank Badge */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                    entry.portalRanking === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    entry.portalRanking === 2 ? "bg-gray-300/20 text-gray-300" :
                    entry.portalRanking === 3 ? "bg-orange-600/20 text-orange-400" :
                    "bg-white/5 text-uc-gray-400"
                  }`}>
                    #{entry.portalRanking}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{a.name}</span>
                      {a.verified && <CheckCircle2 size={12} className="text-uc-cyan" />}
                      <StatusBadge status={entry.status} />
                      <TrendIcon dir={entry.trendDirection} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-uc-gray-400">
                      <span className="flex items-center gap-1"><School size={10} /> {entry.fromSchool}</span>
                      <span>{a.height} · {a.weight} lbs</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {a.state}</span>
                      <span>{a.qbClass}</span>
                    </div>
                  </div>

                  {/* Genome Score */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-[9px] uppercase tracking-widest text-uc-gray-400">GAI</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: entry.gaiTierColor }}>{entry.genomeScore}</p>
                    <p className="text-[8px] font-bold" style={{ color: entry.gaiTierColor }}>{entry.gaiTier}</p>
                  </div>

                  {/* Chevron */}
                  <ChevronDown size={16} className={`text-uc-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>

                {/* ── Expanded Panel ── */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4">
                        <div className="grid sm:grid-cols-3 gap-6">
                          {/* Top Fits */}
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-3 flex items-center gap-1">
                              <Dna size={10} /> Genome Fit Rankings
                            </h4>
                            <div className="space-y-2">
                              {entry.topFits.map((fit, fi) => (
                                <div key={fit.school} className="flex items-center gap-2">
                                  <span className="text-[10px] text-uc-gray-400 w-4">{fi + 1}.</span>
                                  <span className="text-xs text-white flex-1">{fit.school}</span>
                                  <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${fit.fitScore}%`,
                                        background: fit.fitScore >= 85 ? "#00FF88" : fit.fitScore >= 70 ? "#00C2FF" : "#FF3B5C",
                                      }}
                                    />
                                  </div>
                                  <span className={`text-[10px] font-mono tabular-nums w-6 text-right ${
                                    fit.fitScore >= 85 ? "text-uc-green" : fit.fitScore >= 70 ? "text-uc-cyan" : "text-uc-red"
                                  }`}>{fit.fitScore}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Visit Schedule */}
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-3 flex items-center gap-1">
                              <MapPin size={10} /> Official Visits
                            </h4>
                            <div className="space-y-1.5">
                              {entry.visits.map((v) => (
                                <div key={v} className="flex items-center gap-2 text-xs">
                                  <GraduationCap size={10} className="text-uc-cyan" />
                                  <span className="text-white">{v}</span>
                                </div>
                              ))}
                            </div>
                            {entry.status === "committed" && entry.destination && (
                              <div className="mt-3 p-2 rounded-lg bg-uc-green/10 border border-uc-green/20">
                                <p className="text-[10px] text-uc-green flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Committed to <strong className="ml-0.5">{entry.destination}</strong>
                                </p>
                                <p className="text-[9px] text-uc-gray-400 mt-0.5">{entry.commitDate}</p>
                              </div>
                            )}
                          </div>

                          {/* Key Metrics */}
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-3 flex items-center gap-1">
                              <Sparkles size={10} /> Key Genome Markers
                            </h4>
                            <div className="space-y-2">
                              {([
                                { label: "Velocity", value: `${a.metrics.velocity} mph`, pct: ((a.metrics.velocity - 40) / 35) * 100, color: "#00C2FF" },
                                { label: "Accuracy", value: `${a.metrics.accuracy}%`, pct: a.metrics.accuracy, color: "#00FF88" },
                                { label: "Release", value: `${a.metrics.releaseTime}s`, pct: ((0.55 - a.metrics.releaseTime) / 0.25) * 100, color: "#A855F7" },
                                { label: "Mechanics", value: `${a.metrics.mechanics}/100`, pct: a.metrics.mechanics, color: "#F59E0B" },
                              ]).map((stat) => (
                                <div key={stat.label}>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] text-uc-gray-400">{stat.label}</span>
                                    <span className="text-[10px] font-mono" style={{ color: stat.color }}>{stat.value}</span>
                                  </div>
                                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, stat.pct))}%`, background: stat.color }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-5 pt-4 border-t border-white/5">
                          <Link
                            href={`/athlete/${a.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-uc-cyan/10 hover:bg-uc-cyan/20 text-uc-cyan text-xs font-medium transition"
                          >
                            Full Profile <ArrowRight size={12} />
                          </Link>
                          <Link
                            href="/lab"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium transition"
                          >
                            <Dna size={12} /> Genome Lab
                          </Link>
                          <Link
                            href="/compare"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white text-xs font-medium transition"
                          >
                            Compare
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-uc-gray-400">
            <ArrowRightLeft size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No portal entries match your filters.</p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-uc-gray-400 text-sm mb-4">Deep-dive into transfer genome analysis</p>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            <Sparkles size={16} /> Analytics Explorer <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
