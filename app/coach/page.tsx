"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  UserPlus,
  Mail,
  Download,
  BarChart3,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  Dna,
  Zap,
  Target,
  Brain,
  Gauge,
  RotateCcw,
  Shield,
  Eye,
  Bookmark,
  Send,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── Tab Navigation ───────────────────── */
type TabId = "roster" | "depth-chart" | "watchlist" | "messages" | "reports";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "roster", label: "Roster", icon: Users },
  { id: "depth-chart", label: "Depth Chart", icon: ClipboardList },
  { id: "watchlist", label: "Watchlist", icon: Bookmark },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

/* ── Depth Chart Data ─────────────────── */
interface DepthSlot {
  label: string;
  athlete: Athlete | null;
  genomeScore: number;
  gaiTierColor: string;
}

function buildDepthChart(): DepthSlot[] {
  const sorted = [...PLACEHOLDER_ATHLETES].sort((a, b) => computeGAI(b.metrics).gai - computeGAI(a.metrics).gai);
  return [
    { label: "QB1 — Starter", athlete: sorted[0] || null, ...(() => { const r = sorted[0] ? computeGAI(sorted[0].metrics) : null; return { genomeScore: r?.gai ?? 0, gaiTierColor: r?.tierColor ?? "#C0C0C0" }; })() },
    { label: "QB2 — Backup", athlete: sorted[1] || null, ...(() => { const r = sorted[1] ? computeGAI(sorted[1].metrics) : null; return { genomeScore: r?.gai ?? 0, gaiTierColor: r?.tierColor ?? "#C0C0C0" }; })() },
    { label: "QB3 — Scout Team", athlete: sorted[2] || null, ...(() => { const r = sorted[2] ? computeGAI(sorted[2].metrics) : null; return { genomeScore: r?.gai ?? 0, gaiTierColor: r?.tierColor ?? "#C0C0C0" }; })() },
    { label: "QB4 — Development", athlete: sorted[3] || null, ...(() => { const r = sorted[3] ? computeGAI(sorted[3].metrics) : null; return { genomeScore: r?.gai ?? 0, gaiTierColor: r?.tierColor ?? "#C0C0C0" }; })() },
  ];
}

/* ── Message Data ─────────────────────── */
interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  tag: "recruit" | "staff" | "system";
}

const MESSAGES: Message[] = [
  { id: "m1", from: "Jaxon Smith", subject: "Film review request", preview: "Coach, I uploaded my latest game film and wanted to get your breakdown on my 3rd quarter reads...", time: "2h ago", unread: true, tag: "recruit" },
  { id: "m2", from: "OC Williams", subject: "Re: Spring roster decisions", preview: "Agreed on the depth chart adjustments. Let's finalize QB2 after the combine scores come in...", time: "5h ago", unread: true, tag: "staff" },
  { id: "m3", from: "Andre Mitchell", subject: "Official visit confirmation", preview: "Coach, I'm confirmed for the Feb 28 visit. Looking forward to meeting the team and touring the facilities...", time: "1d ago", unread: false, tag: "recruit" },
  { id: "m4", from: "System", subject: "Genome alert: Tyler Washington", preview: "Tyler Washington's genome score increased by 4 points after latest evaluation. New score: 72.", time: "2d ago", unread: false, tag: "system" },
  { id: "m5", from: "DC Rodriguez", subject: "Transfer portal update", preview: "Two new QBs entered the portal today matching our program needs. Fit scores attached...", time: "3d ago", unread: false, tag: "staff" },
];

/* ── Report Data ──────────────────────── */
interface Report {
  id: string;
  title: string;
  type: "scouting" | "analytics" | "combine" | "roster";
  date: string;
  status: "ready" | "generating" | "scheduled";
}

const REPORTS: Report[] = [
  { id: "r1", title: "2026 QB Class Genome Report", type: "scouting", date: "Feb 25, 2026", status: "ready" },
  { id: "r2", title: "Spring Combine Results Summary", type: "combine", date: "Feb 22, 2026", status: "ready" },
  { id: "r3", title: "Roster Genome Distribution Analysis", type: "analytics", date: "Feb 20, 2026", status: "ready" },
  { id: "r4", title: "Transfer Portal Fit Report — March", type: "scouting", date: "Mar 1, 2026", status: "scheduled" },
  { id: "r5", title: "Gene Growth Tracking — Q1 2026", type: "roster", date: "Mar 15, 2026", status: "scheduled" },
];

/* ── Main Component ───────────────────── */
export default function CoachHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>("roster");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"genome" | "name" | "class">("genome");

  const roster = useMemo(() => {
    const list = PLACEHOLDER_ATHLETES.map((a) => {
      const gaiResult = computeGAI(a.metrics);
      return { ...a, gs: gaiResult.gai, gaiTierColor: gaiResult.tierColor };
    });

    const filtered = list.filter(
      (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "genome") return b.gs - a.gs;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.gradYear - b.gradYear;
    });
  }, [searchQuery, sortBy]);

  const depthChart = useMemo(buildDepthChart, []);

  const teamStats = useMemo(() => {
    const scores = PLACEHOLDER_ATHLETES.map((a) => computeGAI(a.metrics).gai);
    return {
      avgGenome: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
      topGenome: Math.max(...scores),
      totalAthletes: PLACEHOLDER_ATHLETES.length,
      verifiedCount: PLACEHOLDER_ATHLETES.filter((a) => a.verified).length,
    };
  }, []);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Coach <span className="gradient-text-dna">Hub</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Your coaching command center. Manage roster, depth chart, watchlist, and access genome-powered scouting reports — all in one place.
          </p>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Roster Size", value: teamStats.totalAthletes, icon: Users, color: "text-white" },
            { label: "Avg Genome", value: teamStats.avgGenome, icon: Dna, color: "text-uc-cyan" },
            { label: "Top Genome", value: teamStats.topGenome, icon: TrendingUp, color: "text-uc-green" },
            { label: "Verified", value: teamStats.verifiedCount, icon: CheckCircle2, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} className="text-uc-gray-400" />
                  <p className="text-[10px] uppercase tracking-widest text-uc-gray-400">{s.label}</p>
                </div>
                <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1 border-b border-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition whitespace-nowrap ${
                  active ? "bg-uc-panel text-white border-b-2 border-uc-cyan" : "text-uc-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {tab.id === "messages" && (
                  <span className="w-4 h-4 rounded-full bg-uc-red text-[9px] flex items-center justify-center text-white font-bold">
                    {MESSAGES.filter((m) => m.unread).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {/* ─── ROSTER TAB ─── */}
          {activeTab === "roster" && (
            <motion.div key="roster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Search + Sort */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roster..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-uc-panel border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-uc-gray-400 focus:outline-none focus:border-uc-cyan/50 transition"
                  />
                </div>
                <div className="flex gap-2">
                  {(["genome", "name", "class"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        sortBy === s ? "bg-uc-cyan/20 text-uc-cyan" : "bg-white/5 text-uc-gray-400 hover:text-white"
                      }`}
                    >
                      {s === "genome" ? "Genome" : s === "name" ? "Name" : "Class"}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uc-green/10 text-uc-green text-xs font-medium hover:bg-uc-green/20 transition">
                  <UserPlus size={12} /> Add Athlete
                </button>
              </div>

              {/* Roster Table */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[10px] uppercase tracking-widest text-uc-gray-400">
                  <span>#</span>
                  <span>Athlete</span>
                  <span className="hidden sm:block">Class</span>
                  <span className="hidden md:block">Type</span>
                  <span>Genome</span>
                  <span>Actions</span>
                </div>
                {roster.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition"
                  >
                    <span className="text-xs text-uc-gray-400 tabular-nums w-5">{i + 1}</span>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-uc-surface flex items-center justify-center text-xs font-bold text-uc-cyan shrink-0">
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate flex items-center gap-1">
                          {a.name}
                          {a.verified && <CheckCircle2 size={10} className="text-uc-cyan shrink-0" />}
                        </p>
                        <p className="text-[10px] text-uc-gray-400 truncate">{a.school} · {a.state}</p>
                      </div>
                    </div>
                    <span className="text-xs text-uc-gray-400 hidden sm:block">{a.gradYear}</span>
                    <span className="text-xs text-uc-gray-400 hidden md:block">{a.qbClass}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: a.gaiTierColor }}>
                      {a.gs}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link href={`/athlete/${a.id}`} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white transition">
                        <Eye size={12} />
                      </Link>
                      <Link href="/lab" className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-purple-400 transition">
                        <Dna size={12} />
                      </Link>
                      <Link href="/compare" className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-uc-cyan transition">
                        <BarChart3 size={12} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── DEPTH CHART TAB ─── */}
          {activeTab === "depth-chart" && (
            <motion.div key="depth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {depthChart.map((slot, i) => (
                  <motion.div
                    key={slot.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-xl p-5 flex items-center gap-5"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${
                      i === 0 ? "bg-uc-green/15 text-uc-green" : i === 1 ? "bg-uc-cyan/15 text-uc-cyan" : "bg-white/5 text-uc-gray-400"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-uc-gray-400 mb-1">{slot.label}</p>
                      {slot.athlete ? (
                        <div>
                          <p className="text-lg font-bold text-white flex items-center gap-2">
                            {slot.athlete.name}
                            {slot.athlete.verified && <CheckCircle2 size={12} className="text-uc-cyan" />}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-uc-gray-400">
                            <span>{slot.athlete.height} · {slot.athlete.weight} lbs</span>
                            <span>{slot.athlete.qbClass}</span>
                            <span>Class of {slot.athlete.gradYear}</span>
                            <span>{slot.athlete.offers.length} offers</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-uc-gray-400 italic">Open position</p>
                      )}
                    </div>
                    {slot.athlete && (
                      <div className="text-right shrink-0">
                        <p className="text-[9px] uppercase tracking-widest text-uc-gray-400 mb-0.5">GAI</p>
                        <p className="text-2xl font-black tabular-nums" style={{ color: slot.gaiTierColor }}>
                          {slot.genomeScore}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Genome Gap Analysis */}
              <div className="mt-8 glass rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4">Genome Gap: QB1 vs QB2</h3>
                {depthChart[0].athlete && depthChart[1].athlete && (
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                    {(["velocity", "accuracy", "releaseTime", "mechanics", "decisionSpeed", "spinRate"] as const).map((key) => {
                      const v1 = depthChart[0].athlete!.metrics[key];
                      const v2 = depthChart[1].athlete!.metrics[key];
                      const diff = key === "releaseTime" ? v2 - v1 : v1 - v2;
                      const positive = key === "releaseTime" ? diff > 0 : diff > 0;
                      return (
                        <div key={key} className="text-center">
                          <p className="text-[9px] text-uc-gray-400 uppercase tracking-wider mb-1">
                            {key === "releaseTime" ? "Release" : key === "decisionSpeed" ? "Decision" : key === "spinRate" ? "Spin" : key.charAt(0).toUpperCase() + key.slice(1)}
                          </p>
                          <p className={`text-sm font-bold ${positive ? "text-uc-green" : "text-uc-red"}`}>
                            {diff > 0 ? "+" : ""}{key === "releaseTime" ? diff.toFixed(2) : Math.round(diff)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── WATCHLIST TAB ─── */}
          {activeTab === "watchlist" && (
            <motion.div key="watchlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-uc-gray-400 mb-4">Transfer portal targets and recruitment watchlist.</p>
              <div className="space-y-3">
                {PLACEHOLDER_ATHLETES.slice(0, 4).map((a, i) => {
                  const gaiResult = computeGAI(a.metrics);
                  const gs = gaiResult.gai;
                  const tags = [
                    ...(a.metrics.velocity >= 60 ? ["CANNON"] : []),
                    ...(a.metrics.accuracy >= 90 ? ["SNIPER"] : []),
                    ...(a.metrics.decisionSpeed >= 90 ? ["PROCESSOR"] : []),
                  ];
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-xl p-4 flex items-center gap-4"
                    >
                      <Bookmark size={14} className="text-uc-cyan shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {a.name}
                          {tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-uc-cyan/10 text-uc-cyan">{t}</span>
                          ))}
                        </p>
                        <p className="text-[10px] text-uc-gray-400">{a.school} · {a.state} · Class of {a.gradYear}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black tabular-nums" style={{ color: gaiResult.tierColor }}>{gs}</p>
                        <p className="text-[9px] text-uc-gray-400">GAI</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Link href={`/athlete/${a.id}`} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-white transition">
                          <Eye size={12} />
                        </Link>
                        <button className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-uc-gray-400 hover:text-uc-green transition">
                          <Send size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Link href="/portal" className="inline-flex items-center gap-2 text-xs text-uc-cyan hover:underline">
                  Browse Transfer Portal <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* ─── MESSAGES TAB ─── */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-2">
                {MESSAGES.map((msg, i) => {
                  const tagColor = msg.tag === "recruit" ? "text-uc-cyan bg-uc-cyan/10" : msg.tag === "staff" ? "text-uc-green bg-uc-green/10" : "text-uc-gray-400 bg-white/5";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`glass rounded-xl p-4 cursor-pointer hover:bg-white/[0.03] transition ${msg.unread ? "border-l-2 border-uc-cyan" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-uc-surface flex items-center justify-center text-[10px] font-bold text-uc-cyan shrink-0 mt-0.5">
                          {msg.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-sm font-semibold ${msg.unread ? "text-white" : "text-uc-gray-400"}`}>{msg.from}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${tagColor}`}>{msg.tag}</span>
                            {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-uc-cyan" />}
                          </div>
                          <p className={`text-xs mb-0.5 ${msg.unread ? "text-white font-medium" : "text-uc-gray-400"}`}>{msg.subject}</p>
                          <p className="text-[11px] text-uc-gray-400 line-clamp-1">{msg.preview}</p>
                        </div>
                        <span className="text-[10px] text-uc-gray-400 shrink-0">{msg.time}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── REPORTS TAB ─── */}
          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-uc-gray-400">Genome-powered scouting and analytics reports.</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uc-cyan/10 text-uc-cyan text-xs font-medium hover:bg-uc-cyan/20 transition">
                  <Sparkles size={12} /> Generate Report
                </button>
              </div>
              <div className="space-y-3">
                {REPORTS.map((report, i) => {
                  const typeColor = {
                    scouting: "text-uc-cyan bg-uc-cyan/10",
                    analytics: "text-purple-400 bg-purple-400/10",
                    combine: "text-uc-green bg-uc-green/10",
                    roster: "text-orange-400 bg-orange-400/10",
                  }[report.type];
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass rounded-xl p-4 flex items-center gap-4"
                    >
                      <BarChart3 size={16} className="text-uc-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{report.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${typeColor}`}>{report.type}</span>
                          <span className="text-[10px] text-uc-gray-400 flex items-center gap-1">
                            <Calendar size={9} /> {report.date}
                          </span>
                        </div>
                      </div>
                      {report.status === "ready" ? (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uc-green/10 text-uc-green text-xs font-medium hover:bg-uc-green/20 transition">
                          <Download size={12} /> Download
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-white/5 text-uc-gray-400 text-xs">
                          {report.status === "generating" ? "Generating..." : "Scheduled"}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick Actions Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid sm:grid-cols-3 gap-4"
        >
          {[
            { label: "Scout View", desc: "Full scouting interface", href: "/scout", icon: Eye, color: "from-cyan-600 to-blue-600" },
            { label: "Genome Lab", desc: "Simulate gene development", href: "/lab", icon: Dna, color: "from-purple-600 to-pink-600" },
            { label: "Transfer Portal", desc: "Portal genome fit tracker", href: "/portal", icon: Users, color: "from-orange-500 to-red-600" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`glass rounded-xl p-5 flex items-center gap-4 hover:bg-white/[0.03] transition group`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-uc-cyan transition">{action.label}</p>
                  <p className="text-[10px] text-uc-gray-400">{action.desc}</p>
                </div>
                <ArrowRight size={14} className="text-uc-gray-400 ml-auto group-hover:text-uc-cyan transition" />
              </Link>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
