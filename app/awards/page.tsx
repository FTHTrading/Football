"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Sparkles,
  Dna,
  Zap,
  Target,
  Brain,
  Gauge,
  RotateCcw,
  Shield,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── Gene Definitions ─────────────────── */
const GENE_MAP = {
  velocity: { gene: "VEL-α", label: "Velocity", icon: Zap, color: "#00C2FF", unit: "mph" },
  accuracy: { gene: "ACC-γ", label: "Accuracy", icon: Target, color: "#00FF88", unit: "%" },
  releaseTime: { gene: "REL-β", label: "Release", icon: Gauge, color: "#A855F7", unit: "s" },
  mechanics: { gene: "MECH-δ", label: "Mechanics", icon: Dna, color: "#F59E0B", unit: "/100" },
  decisionSpeed: { gene: "DEC-ε", label: "Decision", icon: Brain, color: "#FF3B5C", unit: "/100" },
  spinRate: { gene: "SPR-ζ", label: "Spin Rate", icon: RotateCcw, color: "#EC4899", unit: "rpm" },
} as const;


/* ── Award Categories ─────────────────── */
interface AwardCategory {
  id: string;
  name: string;
  icon: typeof Trophy;
  color: string;
  description: string;
  awards: AwardEntry[];
}

interface AwardEntry {
  title: string;
  athlete: Athlete;
  value: string;
  detail: string;
  genomeScore: number;
  gaiTierColor: string;
}

function generateAwards(): AwardCategory[] {
  const sorted = [...PLACEHOLDER_ATHLETES].sort((a, b) => computeGAI(b.metrics).gai - computeGAI(a.metrics).gai);
  const byVelocity = [...PLACEHOLDER_ATHLETES].sort((a, b) => b.metrics.velocity - a.metrics.velocity);
  const byAccuracy = [...PLACEHOLDER_ATHLETES].sort((a, b) => b.metrics.accuracy - a.metrics.accuracy);
  const byRelease = [...PLACEHOLDER_ATHLETES].sort((a, b) => a.metrics.releaseTime - b.metrics.releaseTime);
  const byMechanics = [...PLACEHOLDER_ATHLETES].sort((a, b) => b.metrics.mechanics - a.metrics.mechanics);
  const byDecision = [...PLACEHOLDER_ATHLETES].sort((a, b) => b.metrics.decisionSpeed - a.metrics.decisionSpeed);
  const bySpinRate = [...PLACEHOLDER_ATHLETES].sort((a, b) => b.metrics.spinRate - a.metrics.spinRate);

  const gai = (a: Athlete) => { const r = computeGAI(a.metrics); return { genomeScore: r.gai, gaiTierColor: r.tierColor }; };

  return [
    {
      id: "genome-mvp",
      name: "Genome MVP",
      icon: Crown,
      color: "#FFD700",
      description: "Highest GAI — the most complete QB genome.",
      awards: sorted.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Genome MVP" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${gai(a).genomeScore} GAI`,
        detail: `${a.offers.length} D1 offers · ${a.qbClass}`,
        ...gai(a),
      })),
    },
    {
      id: "cannon-award",
      name: "Cannon Award",
      icon: Zap,
      color: "#00C2FF",
      description: "Strongest arm — elite VEL-α gene expression. Pure arm talent.",
      awards: byVelocity.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Hardest Thrower" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.velocity} mph`,
        detail: `VEL-α gene: ${a.metrics.velocity} mph · SPR-ζ: ${a.metrics.spinRate} rpm`,
        ...gai(a),
      })),
    },
    {
      id: "surgeon-award",
      name: "Surgeon Award",
      icon: Target,
      color: "#00FF88",
      description: "Most precise passer — dominant ACC-γ gene marker.",
      awards: byAccuracy.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Most Accurate" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.accuracy}%`,
        detail: `ACC-γ gene: ${a.metrics.accuracy}% · MECH-δ: ${a.metrics.mechanics}`,
        ...gai(a),
      })),
    },
    {
      id: "quickdraw-award",
      name: "Quick Draw",
      icon: Gauge,
      color: "#A855F7",
      description: "Fastest release — elite REL-β gene. Ball out in a blink.",
      awards: byRelease.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Fastest Release" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.releaseTime}s`,
        detail: `REL-β gene: ${a.metrics.releaseTime}s · VEL-α: ${a.metrics.velocity} mph`,
        ...gai(a),
      })),
    },
    {
      id: "architect-award",
      name: "Architect Award",
      icon: Shield,
      color: "#F59E0B",
      description: "Best mechanics — pristine MECH-δ gene expression. Textbook form.",
      awards: byMechanics.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Best Mechanics" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.mechanics}/100`,
        detail: `MECH-δ gene: ${a.metrics.mechanics} · REL-β: ${a.metrics.releaseTime}s`,
        ...gai(a),
      })),
    },
    {
      id: "brain-award",
      name: "Cerebral Award",
      icon: Brain,
      color: "#FF3B5C",
      description: "Fastest processor — elite DEC-ε gene marker. Reads defenses instantly.",
      awards: byDecision.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Best Decision Maker" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.decisionSpeed}/100`,
        detail: `DEC-ε gene: ${a.metrics.decisionSpeed} · ACC-γ: ${a.metrics.accuracy}%`,
        ...gai(a),
      })),
    },
    {
      id: "spin-award",
      name: "Spiral King",
      icon: RotateCcw,
      color: "#EC4899",
      description: "Highest spin rate — dominant SPR-ζ gene. Perfect spirals.",
      awards: bySpinRate.slice(0, 3).map((a, i) => ({
        title: i === 0 ? "Best Spiral" : i === 1 ? "Runner-Up" : "Honorable Mention",
        athlete: a,
        value: `${a.metrics.spinRate} rpm`,
        detail: `SPR-ζ gene: ${a.metrics.spinRate} rpm · VEL-α: ${a.metrics.velocity} mph`,
        ...gai(a),
      })),
    },
  ];
}

/* ── Record Book ──────────────────────── */
interface GenomeRecord {
  label: string;
  athlete: Athlete;
  value: string;
  gene: string;
  color: string;
}

function generateRecords(): GenomeRecord[] {
  const records: GenomeRecord[] = [];
  const keys: (keyof AthleteMetrics)[] = ["velocity", "accuracy", "releaseTime", "mechanics", "decisionSpeed", "spinRate"];
  for (const key of keys) {
    const sorted = [...PLACEHOLDER_ATHLETES].sort((a, b) =>
      key === "releaseTime" ? a.metrics[key] - b.metrics[key] : b.metrics[key] - a.metrics[key]
    );
    const best = sorted[0];
    const gm = GENE_MAP[key];
    records.push({
      label: gm.label,
      athlete: best,
      value: key === "releaseTime" ? `${best.metrics[key]}s` : key === "spinRate" ? `${best.metrics[key]} rpm` : key === "velocity" ? `${best.metrics[key]} mph` : `${best.metrics[key]}`,
      gene: gm.gene,
      color: gm.color,
    });
  }
  return records;
}

/* ── Main Component ───────────────────── */
export default function AwardsPage() {
  const categories = useMemo(generateAwards, []);
  const records = useMemo(generateRecords, []);
  const [expandedCat, setExpandedCat] = useState<string>(categories[0].id);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Awards <span className="gradient-text-dna">& Honors</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            The genome awards ceremony. Elite gene markers earn recognition — from Cannon Award velocity kings to Cerebral Award decision masters.
          </p>
        </motion.div>

        {/* ── Genome Record Book ── */}
        <div className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-2">
            <Flame size={12} className="text-orange-400" /> Genome Record Book
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {records.map((r, i) => (
              <motion.div
                key={r.gene}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 text-center relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: r.color }} />
                <p className="text-[9px] uppercase tracking-widest text-uc-gray-400 mb-1">{r.label}</p>
                <p className="text-xl font-black tabular-nums" style={{ color: r.color }}>{r.value}</p>
                <p className="text-[10px] text-white mt-1 font-medium">{r.athlete.name}</p>
                <p className="text-[9px] text-uc-gray-400 font-mono">{r.gene}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Award Categories ── */}
        <div className="space-y-4">
          {categories.map((cat, ci) => {
            const Icon = cat.icon;
            const expanded = expandedCat === cat.id;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.04 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCat(expanded ? "" : cat.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.color + "18" }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-white group-hover:text-opacity-90">{cat.name}</p>
                    <p className="text-xs text-uc-gray-400 mt-0.5">{cat.description}</p>
                  </div>
                  <div className="shrink-0 hidden sm:flex items-center gap-2">
                    {cat.awards.slice(0, 3).map((aw, ai) => (
                      <div
                        key={ai}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: ai === 0 ? "#FFD70020" : ai === 1 ? "#C0C0C020" : "#CD7F3220",
                          color: ai === 0 ? "#FFD700" : ai === 1 ? "#C0C0C0" : "#CD7F32",
                        }}
                      >
                        {ai + 1}
                      </div>
                    ))}
                  </div>
                  <ChevronDown size={16} className={`text-uc-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded Winners */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 border-t border-white/5 pt-5">
                        <div className="grid sm:grid-cols-3 gap-4">
                          {cat.awards.map((aw, ai) => {
                            const medalColor = ai === 0 ? "#FFD700" : ai === 1 ? "#C0C0C0" : "#CD7F32";
                            const medalBg = ai === 0 ? "#FFD70015" : ai === 1 ? "#C0C0C015" : "#CD7F3215";
                            return (
                              <motion.div
                                key={ai}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ai * 0.08 }}
                                className="rounded-xl p-4 border relative overflow-hidden"
                                style={{ borderColor: medalColor + "30", background: medalBg }}
                              >
                                {/* Place indicator */}
                                <div className="absolute top-3 right-3">
                                  {ai === 0 ? (
                                    <Crown size={18} style={{ color: medalColor }} />
                                  ) : (
                                    <Medal size={16} style={{ color: medalColor }} />
                                  )}
                                </div>

                                {/* Winner info */}
                                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: medalColor }}>{aw.title}</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-uc-panel flex items-center justify-center text-sm font-bold" style={{ color: cat.color }}>
                                    {aw.athlete.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white flex items-center gap-1">
                                      {aw.athlete.name}
                                      {aw.athlete.verified && <CheckCircle2 size={10} className="text-uc-cyan" />}
                                    </p>
                                    <p className="text-[10px] text-uc-gray-400">{aw.athlete.school}</p>
                                  </div>
                                </div>

                                {/* Value */}
                                <p className="text-2xl font-black tabular-nums mb-1" style={{ color: cat.color }}>{aw.value}</p>
                                <p className="text-[10px] text-uc-gray-400">{aw.detail}</p>

                                {/* GAI Score */}
                                <div className="mt-3 pt-2 border-t" style={{ borderColor: medalColor + "15" }}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-uc-gray-400">GAI</span>
                                    <span className="text-xs font-bold" style={{ color: aw.gaiTierColor }}>{aw.genomeScore}</span>
                                  </div>
                                </div>

                                {/* Link */}
                                <Link
                                  href={`/athlete/${aw.athlete.id}`}
                                  className="mt-3 flex items-center gap-1 text-[10px] font-medium hover:underline transition"
                                  style={{ color: cat.color }}
                                >
                                  View Profile <ArrowRight size={10} />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── Hall of Fame Teaser ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 glass rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 dna-bg-pattern opacity-5" />
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <Star size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Genome <span className="gradient-text-dna">Hall of Fame</span>
            </h3>
            <p className="text-uc-gray-400 text-sm max-w-md mx-auto mb-6">
              The all-time greats. QBs whose genome scores set records that define the standard for future generations.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
              >
                <Trophy size={14} /> View QB Index
              </Link>
              <Link
                href="/combine"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm transition"
              >
                Virtual Combine <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
