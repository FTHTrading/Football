"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import VerifiedBadge from "@/components/VerifiedBadge";
import { DNAStrandDivider } from "@/components/DNAHelix";
import { calculateQBIndex, type QBIndexInput } from "@/lib/qb-index";
import { computeGAI } from "@/lib/genome-activation-index";
import {
  Dna,
  Eye,
  Shield,
  Target,
  Zap,
  Activity,
  BarChart3,
  Filter,
  SortDesc,
  ChevronDown,
  Star,
  Search,
  ArrowRight,
  Bookmark,
  FileText,
  Download,
  TrendingUp,
  Users,
  MapPin,
  GraduationCap,
} from "lucide-react";

/* ── Metrics adapter ── */
function metricsToIndexInput(m: { velocity: number; releaseTime: number; accuracy: number; mechanics: number; decisionSpeed: number }): QBIndexInput {
  return {
    velocity: m.velocity,
    releaseTime: m.releaseTime,
    accuracy: m.accuracy,
    mechanics: m.mechanics,
    footwork: m.mechanics * 0.9,
    poise: m.decisionSpeed,
    fieldVision: m.decisionSpeed * 0.95,
    clutchFactor: (m.accuracy + m.decisionSpeed) / 2,
  };
}

/* ── Athlete scout card ── */
function ScoutCard({ athlete, rank, delay }: { athlete: Athlete; rank: number; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const gaiResult = computeGAI(athlete.metrics);
  const qbIndex = calculateQBIndex(metricsToIndexInput(athlete.metrics));
  const tier = { label: gaiResult.tier.toUpperCase(), color: gaiResult.tierColor, bg: `${gaiResult.tierColor}15` };

  const geneTraits = [
    { label: "VEL", value: athlete.metrics.velocity.toFixed(1), max: 70, pct: (athlete.metrics.velocity / 70) * 100, color: "bg-uc-cyan" },
    { label: "REL", value: athlete.metrics.releaseTime.toFixed(2), max: 1, pct: ((1 - athlete.metrics.releaseTime) / 1) * 100, color: "bg-uc-green" },
    { label: "SPR", value: `${athlete.metrics.spinRate}`, max: 800, pct: (athlete.metrics.spinRate / 800) * 100, color: "bg-purple-400" },
    { label: "MECH", value: `${athlete.metrics.mechanics}`, max: 100, pct: athlete.metrics.mechanics, color: "bg-yellow-400" },
    { label: "ACC", value: `${athlete.metrics.accuracy}`, max: 100, pct: athlete.metrics.accuracy, color: "bg-uc-cyan" },
    { label: "DEC", value: `${athlete.metrics.decisionSpeed}`, max: 100, pct: athlete.metrics.decisionSpeed, color: "bg-uc-green" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-300"
    >
      {/* Main card */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 text-center">
            <span className="text-lg font-black font-mono text-uc-gray-500">#{rank}</span>
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uc-cyan/15 to-uc-panel flex items-center justify-center flex-shrink-0 border border-white/5">
            <span className="text-lg font-bold text-uc-cyan/50">{athlete.name.charAt(0)}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold truncate">
                <Link href={`/athlete/${athlete.id}`} className="hover:text-uc-cyan transition-colors">
                  {athlete.name}
                </Link>
              </h3>
              {athlete.verified && <VerifiedBadge size="sm" />}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-uc-gray-400">
              <span className="flex items-center gap-0.5"><MapPin size={8} /> {athlete.state}</span>
              <span className="flex items-center gap-0.5"><GraduationCap size={8} /> {athlete.gradYear}</span>
              <span>{athlete.qbClass}</span>
            </div>
          </div>

          {/* QB Index + GAI + Tier */}
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-black font-mono" style={{ color: gaiResult.tierColor }}>{gaiResult.gai}</p>
            <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase" style={{ color: gaiResult.tierColor, backgroundColor: tier.bg }}>
              {tier.label}
            </span>
            <p className="text-[8px] text-uc-gray-500 mt-0.5">QBI {qbIndex.toFixed(0)}</p>
          </div>
        </div>

        {/* Quick genome bars */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          {geneTraits.map((g) => (
            <div key={g.label} className="text-center">
              <p className="text-[8px] text-uc-gray-500 tracking-wider mb-1">{g.label}</p>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${g.pct}%` }}
                  transition={{ delay: delay + 0.3, duration: 0.8 }}
                  className={`h-full rounded-full ${g.color}/60`}
                />
              </div>
              <p className="text-[9px] font-mono font-bold mt-0.5">{g.value}</p>
            </div>
          ))}
        </div>

        {/* Offers + actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Users size={10} className="text-uc-gray-400" />
            <span className="text-[10px] text-uc-gray-400">{athlete.offers.length} offers</span>
            <span className="text-[10px] text-uc-gray-400">•</span>
            <Star size={10} className="text-yellow-400" />
            <span className="text-[10px] text-uc-gray-400">{athlete.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[9px] text-uc-cyan tracking-wider uppercase font-bold hover:text-white transition-colors"
            >
              {expanded ? "Collapse" : "Full Genome"}
              <ChevronDown size={10} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
            <Link
              href={`/athlete/${athlete.id}`}
              className="flex items-center gap-1 text-[9px] text-uc-gray-400 tracking-wider uppercase font-bold hover:text-uc-cyan transition-colors"
            >
              Profile <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* Expanded genome detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-5 dna-bg-pattern">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Offers list */}
                <div>
                  <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 mb-2 font-bold">Current Offers</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {athlete.offers.map((o) => (
                      <span key={o} className="px-2 py-1 rounded text-[9px] bg-white/5 text-white border border-white/5 font-medium">{o}</span>
                    ))}
                  </div>
                </div>

                {/* Scouting notes */}
                <div>
                  <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 mb-2 font-bold">Scout Notes</h4>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">
                    {athlete.metrics.velocity > 60 ? "Elite arm talent. " : "Developing arm strength. "}
                    {athlete.metrics.accuracy > 88 ? "Plus accuracy across all levels. " : "Accuracy shows room for growth. "}
                    {athlete.metrics.mechanics > 88 ? "Polished mechanics. " : "Mechanical refinement needed. "}
                    {athlete.metrics.decisionSpeed > 88 ? "Quick processor in the pocket." : "Processing speed trending up."}
                    {athlete.comparisonPlayer ? ` Pro comp: ${athlete.comparisonPlayer}.` : ""}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uc-cyan/10 text-uc-cyan text-[9px] font-bold tracking-wider uppercase border border-uc-cyan/20 hover:bg-uc-cyan/20 transition-all">
                  <Bookmark size={10} /> Save to Board
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-uc-gray-400 text-[9px] font-bold tracking-wider uppercase border border-white/5 hover:bg-white/10 transition-all">
                  <FileText size={10} /> Export Report
                </button>
                <Link
                  href={`/compare?a=${athlete.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-uc-gray-400 text-[9px] font-bold tracking-wider uppercase border border-white/5 hover:bg-white/10 transition-all"
                >
                  <BarChart3 size={10} /> Compare
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Scout Page ── */
export default function ScoutPage() {
  const [sortBy, setSortBy] = useState<"index" | "velocity" | "accuracy" | "offers">("index");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAthletes = useMemo(() => {
    let list = [...PLACEHOLDER_ATHLETES];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.school.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q)
      );
    }

    // Filters
    if (verifiedOnly) list = list.filter((a) => a.verified);
    if (classFilter !== "all") list = list.filter((a) => a.gradYear.toString() === classFilter);

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "velocity": return b.metrics.velocity - a.metrics.velocity;
        case "accuracy": return b.metrics.accuracy - a.metrics.accuracy;
        case "offers": return b.offers.length - a.offers.length;
        default: return calculateQBIndex(metricsToIndexInput(b.metrics)) - calculateQBIndex(metricsToIndexInput(a.metrics));
      }
    });

    return list;
  }, [sortBy, classFilter, verifiedOnly, searchQuery]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.3em] uppercase text-uc-green mb-4">
            <Eye size={12} />
            Coach Scout View
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Genome Scouting Lab</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Evaluate quarterback DNA at a glance. Filter, sort, and compare
            decoded genomes to find your next signal caller.
          </p>
        </motion.div>

        {/* ── Filters Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4"
        >
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <input
              type="text"
              placeholder="Search by name, school, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-uc-gray-500 focus:outline-none focus:border-uc-cyan/50 transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SortDesc size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-uc-surface border border-white/10 rounded-lg pl-8 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-cyan/50"
            >
              <option value="index">QB Index</option>
              <option value="velocity">Arm Velocity</option>
              <option value="accuracy">Accuracy</option>
              <option value="offers">Offer Count</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>

          {/* Class filter */}
          <div className="relative">
            <GraduationCap size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-uc-surface border border-white/10 rounded-lg pl-8 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-cyan/50"
            >
              <option value="all">All Classes</option>
              <option value="2026">Class of 2026</option>
              <option value="2027">Class of 2027</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>

          {/* Verified toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
              verifiedOnly
                ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                : "bg-uc-surface text-uc-gray-400 border border-white/10 hover:border-white/20"
            }`}
          >
            <Shield size={12} />
            Verified
          </button>
        </motion.div>

        {/* ── Summary Stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total QBs", value: filteredAthletes.length.toString(), icon: Users, color: "text-uc-cyan" },
            { label: "Verified", value: filteredAthletes.filter((a) => a.verified).length.toString(), icon: Shield, color: "text-uc-green" },
            { label: "Avg. QB Index", value: (filteredAthletes.reduce((s, a) => s + calculateQBIndex(metricsToIndexInput(a.metrics)), 0) / (filteredAthletes.length || 1)).toFixed(1), icon: BarChart3, color: "text-purple-400" },
            { label: "Top Velocity", value: Math.max(...filteredAthletes.map((a) => a.metrics.velocity)).toFixed(1) + " mph", icon: Zap, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.color.replace("text-", "bg-")}/10 flex items-center justify-center`}>
                <s.icon size={14} className={s.color} />
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{s.value}</p>
                <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Athlete Cards ── */}
        <div className="space-y-4 mb-12">
          {filteredAthletes.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-uc-gray-400">No athletes match your filters.</p>
            </div>
          ) : (
            filteredAthletes.map((a, i) => (
              <ScoutCard key={a.id} athlete={a} rank={i + 1} delay={0.05 * i} />
            ))
          )}
        </div>

        {/* CTA */}
        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Need deeper analysis? Compare genomes head-to-head.
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Open Genome Compare
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
