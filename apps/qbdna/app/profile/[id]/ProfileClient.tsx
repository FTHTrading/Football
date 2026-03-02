"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Dna,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Brain,
  MapPin,
  GraduationCap,
  Trophy,
  Star,
  Building2,
  Film,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Sparkles,
  Shield,
  Eye,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import {
  computeGAI,
  generateGAITimeline,
  extractGenes,
  detectArchetype,
  computeAllFits,
  type GAIResult,
} from "@/lib/genome-activation-index";

/**
 * Unified Genome Profile
 * The definitive athlete page — every dimension in one view.
 * Identity, Evidence, Activation, Growth, Fit — resolved to GAI.
 */

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 16, params is a Promise in Server Components but
  // we're a client component, so we'll resolve from URL
  return <ProfileInner />;
}

function ProfileInner() {
  // Extract ID from URL
  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "1";
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === id) ?? PLACEHOLDER_ATHLETES[0];

  const gai = useMemo(() => computeGAI(athlete.metrics), [athlete]);
  const timeline = useMemo(() => generateGAITimeline(athlete.metrics), [athlete]);
  const archetype = useMemo(() => detectArchetype(athlete.metrics), [athlete]);
  const topFits = useMemo(() => computeAllFits(athlete.metrics).slice(0, 3), [athlete]);
  const genes = useMemo(() => extractGenes(athlete.metrics), [athlete]);

  const TrajectoryIcon = gai.growth.trajectory === "ascending" ? ArrowUpRight :
    gai.growth.trajectory === "declining" ? ArrowDownRight : Minus;

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* ── HERO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden"
        >
          {/* DNA background pattern */}
          <div className="absolute inset-0 dna-bg-pattern opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* GAI Ring */}
            <div className="relative shrink-0">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(from 180deg, ${gai.tierColor}40, transparent, ${gai.tierColor}40)`,
                  boxShadow: `0 0 60px ${gai.tierColor}15`,
                }}
              >
                <div className="w-28 h-28 rounded-full bg-uc-black flex flex-col items-center justify-center">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-uc-gray-400">GENOME</span>
                  <span className="text-4xl font-black tabular-nums leading-none" style={{ color: gai.tierColor }}>{gai.gai}</span>
                  <span className="text-[9px] font-bold mt-0.5" style={{ color: gai.tierColor }}>{gai.tier}</span>
                </div>
              </div>
              {/* Activation pulse */}
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[8px] font-bold"
                style={{
                  background: gai.activation.status === "peak" ? "rgba(255,215,0,0.2)" :
                    gai.activation.status === "activated" ? "rgba(0,255,136,0.2)" :
                    "rgba(0,194,255,0.2)",
                  color: gai.activation.status === "peak" ? "#FFD700" :
                    gai.activation.status === "activated" ? "#00FF88" : "#00C2FF",
                }}
              >
                {gai.activation.status.toUpperCase()}
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{athlete.name}</h1>
                {athlete.verified && <CheckCircle2 size={18} className="text-uc-cyan" />}
              </div>
              <p className="text-sm text-uc-gray-400 mb-3">
                {athlete.school} · {athlete.state} · Class of {athlete.gradYear} · {athlete.height} · {athlete.weight} lbs
              </p>

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-white">{athlete.qbClass}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: `${archetype.color}15`, color: archetype.color }}>
                  <Dna size={9} className="inline mr-1" />{archetype.name}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                  gai.growth.trajectory === "ascending" ? "bg-uc-green/15 text-uc-green" :
                  gai.growth.trajectory === "declining" ? "bg-red-400/15 text-red-400" :
                  "bg-white/5 text-uc-gray-400"
                }`}>
                  <TrajectoryIcon size={9} /> {gai.growth.trajectory}
                </span>
                {athlete.comparisonPlayer && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-400/15 text-purple-400">
                    Comp: {athlete.comparisonPlayer}
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(athlete.rating) ? "text-yellow-400 fill-yellow-400" : "text-uc-gray-400/30"} />
                ))}
                <span className="text-xs text-uc-gray-400 ml-1">{athlete.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── GAI Components ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Base Score", value: gai.base, sub: "Raw Genome", icon: Dna, color: "text-uc-cyan" },
            { label: "Activation", value: `${gai.activation.multiplier}×`, sub: `Peak: ${gai.activation.peakGene}`, icon: Zap, color: "text-yellow-400" },
            { label: "Growth", value: `${gai.growth.delta > 0 ? "+" : ""}${(gai.growth.delta * 100).toFixed(1)}%`, sub: gai.growth.trajectory, icon: TrendingUp, color: gai.growth.delta >= 0 ? "text-uc-green" : "text-red-400" },
            { label: "Best Fit", value: topFits[0]?.fitScore ?? "—", sub: topFits[0]?.program.name ?? "", icon: Building2, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass rounded-xl p-4 text-center"
              >
                <Icon size={16} className={`mx-auto mb-1.5 ${s.color}`} />
                <p className={`text-xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-[8px] text-uc-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-[8px] text-uc-gray-400/60 mt-0.5 capitalize">{s.sub}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* ── Gene Panel ── */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <Dna size={12} /> Gene Expression
            </h3>
            <div className="space-y-3">
              {genes.map((g) => {
                const flare = gai.activation.geneFlares[g.id] ?? 0;
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono" style={{ color: g.color }}>{g.id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-uc-gray-400">{g.label}</span>
                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                          g.tier === "elite" ? "bg-uc-green/15 text-uc-green" :
                          g.tier === "strong" ? "bg-uc-cyan/15 text-uc-cyan" :
                          g.tier === "developing" ? "bg-yellow-400/15 text-yellow-400" :
                          "bg-white/5 text-uc-gray-400"
                        }`}>{g.tier}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${g.value}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: g.color, opacity: 0.7 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white tabular-nums w-7 text-right">{g.value}</span>
                    </div>
                    {/* Flare indicator */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-0.5 bg-white/[0.03] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${flare}%`, background: g.color, opacity: 0.4 }} />
                      </div>
                      <span className="text-[7px] text-uc-gray-400 tabular-nums">{flare}⚡</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mini Timeline ── */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <Activity size={12} /> GAI Over Season
            </h3>
            <div className="flex items-end gap-1 h-32 mb-4">
              {timeline.map((p) => {
                const max = Math.max(...timeline.map((t) => t.gai));
                const min = Math.min(...timeline.map((t) => t.gai));
                const range = max - min || 1;
                const pct = ((p.gai - min) / range) * 100;
                const statusColor = p.activationStatus === "peak" ? "#FFD700" :
                  p.activationStatus === "activated" ? "#00FF88" :
                  p.activationStatus === "warming" ? "#00C2FF" : "#9CA3AF";
                return (
                  <div key={p.week} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-[6px] tabular-nums" style={{ color: statusColor }}>{p.gai}</span>
                    <div className="w-full rounded-t" style={{ height: `${Math.max(10, pct)}%`, background: statusColor, opacity: 0.6 }} />
                    <span className="text-[6px] text-uc-gray-400/50">W{p.week}</span>
                  </div>
                );
              })}
            </div>
            <Link href="/genome" className="flex items-center gap-1 text-[10px] text-uc-cyan hover:underline">
              View Full Genome Timeline <ChevronRight size={10} />
            </Link>
          </div>

          {/* ── Top Fits ── */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <Building2 size={12} /> Top Program Fits
            </h3>
            <div className="space-y-3">
              {topFits.map((fit, i) => (
                <div key={fit.program.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                  <span className={`text-sm font-black w-5 ${
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-orange-400"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{fit.program.name}</p>
                    <p className="text-[8px] text-uc-gray-400">{fit.program.conference} · {fit.program.scheme}</p>
                  </div>
                  <span className={`text-sm font-black tabular-nums ${fit.fitScore >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>
                    {fit.fitScore}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/offers" className="flex items-center gap-1 text-[10px] text-uc-cyan hover:underline mt-3">
              View All Offers <ChevronRight size={10} />
            </Link>
          </div>
        </div>

        {/* ── Offers Bar ── */}
        <div className="glass rounded-xl p-5 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-3 flex items-center gap-1.5">
            <GraduationCap size={12} /> Scholarship Offers ({athlete.offers.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {athlete.offers.map((school) => (
              <span key={school} className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs font-medium text-white border border-white/5">
                {school}
              </span>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Game Day Live", href: "/gameday", icon: Activity, color: "from-red-500 to-orange-500" },
            { label: "Season Stats", href: "/stats", icon: BarChart3, color: "from-green-500 to-emerald-500" },
            { label: "Film Room", href: "/film-room", icon: Film, color: "from-blue-500 to-cyan-500" },
            { label: "Genome Lab", href: "/lab", icon: Dna, color: "from-purple-500 to-pink-500" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/[0.04] transition group"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white group-hover:text-uc-cyan transition">{link.label}</p>
                </div>
                <ChevronRight size={12} className="text-uc-gray-400 group-hover:text-uc-cyan transition" />
              </Link>
            );
          })}
        </div>

        {/* ── Bottom ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
          <Link href="/genome" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-green-400 to-purple-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
            <Sparkles size={16} /> Full Genome Timeline <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
