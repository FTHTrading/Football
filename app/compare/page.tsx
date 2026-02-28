"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import VerifiedBadge from "@/components/VerifiedBadge";
import { DNAStrandDivider } from "@/components/DNAHelix";
import { computeGAI, detectArchetype } from "@/lib/genome-activation-index";
import {
  Dna,
  ArrowRight,
  ChevronDown,
  Zap,
  Target,
  Activity,
  Eye,
  BarChart3,
  Shield,
  Trophy,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/* ── Gene trait definitions ── */
const GENOME_TRAITS = [
  { key: "velocity", label: "ARM VELOCITY", code: "VEL-α", icon: Zap, max: 70, unit: "mph", color: "text-uc-cyan", bg: "bg-uc-cyan", invert: false },
  { key: "releaseTime", label: "RELEASE SPEED", code: "REL-β", icon: Gauge, max: 1, unit: "s", color: "text-uc-green", bg: "bg-uc-green", invert: true },
  { key: "spinRate", label: "SPIN RATE", code: "SPR-ζ", icon: Activity, max: 800, unit: "rpm", color: "text-purple-400", bg: "bg-purple-400", invert: false },
  { key: "mechanics", label: "MECHANICS BLUEPRINT", code: "MECH-δ", icon: Shield, max: 100, unit: "/100", color: "text-yellow-400", bg: "bg-yellow-400", invert: false },
  { key: "accuracy", label: "ACCURACY STRAND", code: "ACC-γ", icon: Target, max: 100, unit: "/100", color: "text-uc-cyan", bg: "bg-uc-cyan", invert: false },
  { key: "decisionSpeed", label: "PROCESSING SPEED", code: "DEC-ε", icon: Eye, max: 100, unit: "/100", color: "text-uc-green", bg: "bg-uc-green", invert: false },
] as const;

/* ── Radar Chart (SVG) ── */
function GenomeRadar({ athleteA, athleteB }: { athleteA: Athlete; athleteB: Athlete }) {
  const cx = 150, cy = 150, r = 110;
  const traits = GENOME_TRAITS;
  const n = traits.length;

  function polarToCart(index: number, value: number, max: number) {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const ratio = value / max;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  }

  function buildPolygon(athlete: Athlete) {
    return traits
      .map((t, i) => {
        const raw = athlete.metrics[t.key as keyof typeof athlete.metrics];
        const val = t.invert ? (1 - raw) * t.max : raw;
        const p = polarToCart(i, val, t.max);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto">
      <defs>
        <radialGradient id="radar-bg">
          <stop offset="0%" stopColor="rgba(0,194,255,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((pct) => (
        <polygon
          key={pct}
          points={Array.from({ length: n })
            .map((_, i) => {
              const p = polarToCart(i, pct * 100, 100);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {traits.map((_, i) => {
        const end = polarToCart(i, 100, 100);
        return (
          <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        );
      })}

      {/* Radial bg */}
      <circle cx={cx} cy={cy} r={r} fill="url(#radar-bg)" />

      {/* Athlete A polygon */}
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        points={buildPolygon(athleteA)}
        fill="rgba(0,194,255,0.12)"
        stroke="#00C2FF"
        strokeWidth="2"
      />

      {/* Athlete B polygon */}
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        points={buildPolygon(athleteB)}
        fill="rgba(0,255,136,0.12)"
        stroke="#00FF88"
        strokeWidth="2"
      />

      {/* Labels */}
      {traits.map((t, i) => {
        const p = polarToCart(i, 120, 100);
        return (
          <text
            key={t.code}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-uc-gray-400"
            fontSize="8"
            fontFamily="monospace"
          >
            {t.code}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Stat comparison row ── */
function CompareRow({
  trait,
  athleteA,
  athleteB,
  delay,
}: {
  trait: (typeof GENOME_TRAITS)[number];
  athleteA: Athlete;
  athleteB: Athlete;
  delay: number;
}) {
  const rawA = athleteA.metrics[trait.key as keyof typeof athleteA.metrics];
  const rawB = athleteB.metrics[trait.key as keyof typeof athleteB.metrics];

  // For release time, lower = better
  const aWins = trait.invert ? rawA < rawB : rawA > rawB;
  const tie = rawA === rawB;
  const diff = trait.invert
    ? ((rawB - rawA) / rawB * 100).toFixed(1)
    : ((rawA - rawB) / rawB * 100).toFixed(1);

  const pctA = trait.invert ? ((1 - rawA) / (1 - 0)) * 100 : (rawA / trait.max) * 100;
  const pctB = trait.invert ? ((1 - rawB) / (1 - 0)) * 100 : (rawB / trait.max) * 100;

  const Icon = trait.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-xl p-4 group hover:border-white/10 transition-all"
    >
      {/* Trait header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={trait.color} />
        <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${trait.color}`}>
          {trait.label}
        </span>
        <span className="text-[8px] font-mono text-uc-gray-600 ml-auto">{trait.code}</span>
      </div>

      {/* Values */}
      <div className="flex items-center gap-4">
        {/* A */}
        <div className="flex-1 text-right">
          <span className={`text-lg font-bold font-mono ${aWins && !tie ? "text-uc-cyan" : "text-uc-gray-400"}`}>
            {trait.key === "releaseTime" ? rawA.toFixed(2) : rawA.toFixed(1)}
          </span>
          <span className="text-[9px] text-uc-gray-500 ml-1">{trait.unit}</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pctA, 100)}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-uc-cyan/60"
            />
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pctB, 100)}%` }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-uc-green/60"
            />
          </div>
        </div>

        {/* B */}
        <div className="flex-1">
          <span className={`text-lg font-bold font-mono ${!aWins && !tie ? "text-uc-green" : "text-uc-gray-400"}`}>
            {trait.key === "releaseTime" ? rawB.toFixed(2) : rawB.toFixed(1)}
          </span>
          <span className="text-[9px] text-uc-gray-500 ml-1">{trait.unit}</span>
        </div>
      </div>

      {/* Diff badge */}
      <div className="flex justify-center mt-2">
        {tie ? (
          <span className="flex items-center gap-1 text-[9px] text-uc-gray-500">
            <Minus size={10} /> Even
          </span>
        ) : aWins ? (
          <span className="flex items-center gap-1 text-[9px] text-uc-cyan">
            <ArrowUpRight size={10} /> {athleteA.name.split(" ")[0]} +{Math.abs(Number(diff))}%
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] text-uc-green">
            <ArrowUpRight size={10} /> {athleteB.name.split(" ")[0]} +{Math.abs(Number(diff))}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ComparePage() {
  const [idA, setIdA] = useState("1");
  const [idB, setIdB] = useState("6");

  const athleteA = PLACEHOLDER_ATHLETES.find((a) => a.id === idA) || PLACEHOLDER_ATHLETES[0];
  const athleteB = PLACEHOLDER_ATHLETES.find((a) => a.id === idB) || PLACEHOLDER_ATHLETES[5];

  /* Compute GAI for both athletes */
  const gaiA = computeGAI(athleteA.metrics);
  const gaiB = computeGAI(athleteB.metrics);
  const archetypeA = detectArchetype(athleteA.metrics);
  const archetypeB = detectArchetype(athleteB.metrics);
  const scoreA = gaiA.gai;
  const scoreB = gaiB.gai;

  /* Count trait advantages */
  const advantages = useMemo(() => {
    let aWins = 0, bWins = 0;
    GENOME_TRAITS.forEach((t) => {
      const rawA = athleteA.metrics[t.key as keyof typeof athleteA.metrics];
      const rawB = athleteB.metrics[t.key as keyof typeof athleteB.metrics];
      if (t.invert ? rawA < rawB : rawA > rawB) aWins++;
      else if (t.invert ? rawB < rawA : rawB > rawA) bWins++;
    });
    return { a: aWins, b: bWins };
  }, [athleteA, athleteB]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Dna size={12} />
            Genome Comparison
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Head-to-Head DNA</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Compare two quarterback genomes side by side. Every gene trait decoded and measured.
          </p>
        </motion.div>

        {/* ── Athlete Selectors ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-12"
        >
          {/* A Selector */}
          <div className="glass rounded-xl p-5 border-l-2 border-uc-cyan/40">
            <label className="text-[9px] tracking-[0.2em] uppercase text-uc-cyan block mb-2 font-bold">Genome A</label>
            <div className="relative">
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="w-full bg-uc-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold appearance-none focus:outline-none focus:border-uc-cyan/50 transition-colors"
              >
                {PLACEHOLDER_ATHLETES.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {a.school}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 rounded-full bg-uc-cyan/10 flex items-center justify-center border border-uc-cyan/20">
                <span className="text-sm font-bold text-uc-cyan">{athleteA.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-1.5">
                  {athleteA.name} {athleteA.verified && <VerifiedBadge size="sm" />}
                </p>
                <p className="text-[10px] text-uc-gray-400">{athleteA.qbClass} • {athleteA.state} • Class of {athleteA.gradYear}</p>
              </div>
            </div>
          </div>

          {/* VS badge */}
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center border border-white/10">
              <span className="text-xs font-black tracking-wider text-uc-gray-400">VS</span>
            </div>
          </div>

          {/* B Selector */}
          <div className="glass rounded-xl p-5 border-r-2 border-uc-green/40">
            <label className="text-[9px] tracking-[0.2em] uppercase text-uc-green block mb-2 font-bold">Genome B</label>
            <div className="relative">
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="w-full bg-uc-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold appearance-none focus:outline-none focus:border-uc-green/50 transition-colors"
              >
                {PLACEHOLDER_ATHLETES.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {a.school}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 rounded-full bg-uc-green/10 flex items-center justify-center border border-uc-green/20">
                <span className="text-sm font-bold text-uc-green">{athleteB.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-1.5">
                  {athleteB.name} {athleteB.verified && <VerifiedBadge size="sm" />}
                </p>
                <p className="text-[10px] text-uc-gray-400">{athleteB.qbClass} • {athleteB.state} • Class of {athleteB.gradYear}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Genome Score Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden dna-bg-pattern"
        >
          <div className="absolute inset-0 genome-scan pointer-events-none" />
          <div className="relative z-10">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* A Score */}
              <div className="text-center md:text-left">
                <p className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 mb-1">Genome Activation Index</p>
                <p className="text-5xl font-black font-mono" style={{ color: gaiA.tierColor }}>{scoreA}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: gaiA.tierColor }}>{gaiA.tier}</span>
                  <span className="text-[8px] text-uc-gray-500">{archetypeA.name}</span>
                </div>
                <p className="text-xs text-uc-gray-400 mt-1">
                  {advantages.a} trait{advantages.a !== 1 ? "s" : ""} dominant
                </p>
              </div>

              {/* Radar Chart */}
              <div>
                <GenomeRadar athleteA={athleteA} athleteB={athleteB} />
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-uc-cyan" />
                    <span className="text-[9px] text-uc-gray-400">{athleteA.name.split(" ")[1]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-uc-green" />
                    <span className="text-[9px] text-uc-gray-400">{athleteB.name.split(" ")[1]}</span>
                  </div>
                </div>
              </div>

              {/* B Score */}
              <div className="text-center md:text-right">
                <p className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 mb-1">Genome Activation Index</p>
                <p className="text-5xl font-black font-mono" style={{ color: gaiB.tierColor }}>{scoreB}</p>
                <div className="flex items-center gap-2 mt-1 justify-center md:justify-end">
                  <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: gaiB.tierColor }}>{gaiB.tier}</span>
                  <span className="text-[8px] text-uc-gray-500">{archetypeB.name}</span>
                </div>
                <p className="text-xs text-uc-gray-400 mt-1">
                  {advantages.b} trait{advantages.b !== 1 ? "s" : ""} dominant
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DNA Strand divider */}
        <DNAStrandDivider className="mb-8 opacity-30" />

        {/* ── Trait-by-Trait Breakdown ── */}
        <div className="mb-6">
          <h2 className="text-[10px] tracking-[0.4em] uppercase gradient-text-dna font-bold flex items-center gap-2 mb-6">
            <Dna size={14} />
            Gene-by-Gene Breakdown
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {GENOME_TRAITS.map((trait, i) => (
              <CompareRow key={trait.key} trait={trait} athleteA={athleteA} athleteB={athleteB} delay={0.1 * i} />
            ))}
          </div>
        </div>

        {/* ── Additional Context ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Recruiting */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 mb-4 font-bold">Recruiting Comparison</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-uc-gray-400">Total Offers</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-uc-cyan font-mono">{athleteA.offers.length}</span>
                  <span className="text-[8px] text-uc-gray-600">vs</span>
                  <span className="text-sm font-bold text-uc-green font-mono">{athleteB.offers.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-uc-gray-400">Star Rating</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-uc-cyan font-mono">{athleteA.rating.toFixed(1)}★</span>
                  <span className="text-[8px] text-uc-gray-600">vs</span>
                  <span className="text-sm font-bold text-uc-green font-mono">{athleteB.rating.toFixed(1)}★</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-uc-gray-400">QB Style</span>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-uc-cyan">{athleteA.qbClass}</span>
                  <span className="text-[8px] text-uc-gray-600">vs</span>
                  <span className="text-[10px] font-bold text-uc-green">{athleteB.qbClass}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-uc-gray-400">Pro Comparison</span>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-uc-cyan">{athleteA.comparisonPlayer || "—"}</span>
                  <span className="text-[8px] text-uc-gray-600">vs</span>
                  <span className="text-[10px] font-bold text-uc-green">{athleteB.comparisonPlayer || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Offers */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 mb-4 font-bold">Shared Offer Schools</h3>
            {(() => {
              const shared = athleteA.offers.filter((o) => athleteB.offers.includes(o));
              if (shared.length === 0) {
                return <p className="text-xs text-uc-gray-500 italic">No shared offers</p>;
              }
              return (
                <div className="flex flex-wrap gap-2">
                  {shared.map((school) => (
                    <span key={school} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-white border border-white/5">
                      {school}
                    </span>
                  ))}
                </div>
              );
            })()}

            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-cyan mb-2">Only {athleteA.name.split(" ")[0]}</h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {athleteA.offers.filter((o) => !athleteB.offers.includes(o)).map((s) => (
                  <span key={s} className="px-2 py-1 rounded text-[9px] text-uc-cyan bg-uc-cyan/5 border border-uc-cyan/10">{s}</span>
                ))}
              </div>
              <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-green mb-2">Only {athleteB.name.split(" ")[0]}</h4>
              <div className="flex flex-wrap gap-1.5">
                {athleteB.offers.filter((o) => !athleteA.offers.includes(o)).map((s) => (
                  <span key={s} className="px-2 py-1 rounded text-[9px] text-uc-green bg-uc-green/5 border border-uc-green/10">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Discover More QBs
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
