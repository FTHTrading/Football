"use client";

import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import DNAHelix, { DNAStrandDivider } from "@/components/DNAHelix";
import { computeGAI } from "@/lib/genome-activation-index";
import {
  ChevronRight,
  Target,
  Eye,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Play,
  Flame,
  Crown,
  Sparkles,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Dna,
} from "lucide-react";

const HeroTunnel = dynamic(() => import("@/components/HeroTunnel"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-uc-black" />,
});

/* ── Scroll Section Wrapper ── */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ── Stat Counter ──────────── */
function StatBlock({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <p className="text-4xl md:text-5xl font-bold gradient-text">{value}</p>
      <p className="text-xs tracking-[0.25em] uppercase text-uc-gray-400 mt-2">{label}</p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative">
      {/* ═══════════ SECTION 1: HERO ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <HeroTunnel />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 px-4 py-1.5 rounded-full glass text-[10px] tracking-[0.3em] uppercase text-uc-cyan border border-uc-cyan/20"
        >
          QBDNA — The Quarterback Genome
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          <span className="gradient-text">Decode Every Quarterback.</span>
          <br />
          <span className="text-uc-gray-400">Map the Genome.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-uc-gray-400 text-lg md:text-xl max-w-xl mb-10"
        >
          We decode the quarterback genome — objective throwing metrics,
          verified performance DNA, and the identity blueprint college coaches trust.
        </motion.p>

        {/* Floating Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12"
        >
          <MetricCard label="Throw Velocity" value="61.8 MPH" numericValue={61.8} suffix=" MPH" delay={0.9} />
          <MetricCard label="Release Time" value="0.38s" numericValue={0.38} suffix="s" delay={1.1} />
          <MetricCard label="Spin Rate" value="Elite Tier" delay={1.3} />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/athlete/1"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-250"
          >
            View a Verified QB
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10 text-uc-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/30 hover:text-uc-cyan transition-all duration-250"
          >
            Get Verified
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-uc-cyan" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════ SECTION 2: THE PROBLEM ═══════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 leading-tight">
            Recruiting is broken.
            <br />
            <span className="text-uc-gray-400">We&apos;re fixing it.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-uc-red/10 flex items-center justify-center mx-auto mb-4">
                <Eye className="text-uc-red" size={24} />
              </div>
              <p className="text-4xl font-bold text-uc-red mb-2">90%</p>
              <p className="text-sm text-uc-gray-400">of recruiting is subjective opinion</p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
                <Target className="text-yellow-400" size={24} />
              </div>
              <p className="text-4xl font-bold text-yellow-400 mb-2">Inflated</p>
              <p className="text-sm text-uc-gray-400">Camp ratings mask real skill gaps</p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-uc-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="text-uc-cyan" size={24} />
              </div>
              <p className="text-4xl font-bold text-uc-cyan mb-2">Hidden</p>
              <p className="text-sm text-uc-gray-400">Film alone can&apos;t reveal mechanics flaws</p>
            </motion.div>
          </div>

          <motion.blockquote
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            className="text-center text-xl md:text-2xl text-uc-gray-400 italic max-w-3xl mx-auto border-l-2 border-uc-cyan pl-6"
          >
            &ldquo;We decode quarterback DNA using objective performance metrics.
            No opinions. No politics. Just the genome.&rdquo;
          </motion.blockquote>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 2.5: THE QUARTERBACK GENOME ═══════════ */}
      <RevealSection className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* DNA background pattern */}
          <div className="absolute inset-0 dna-bg-pattern pointer-events-none" />

          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-6">
              <Dna size={12} />
              QBDNA Technology
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text-dna">Decode the Genome.</span>
            </h2>
            <p className="text-uc-gray-400 text-lg max-w-2xl mx-auto">
              Every quarterback has a unique genetic blueprint — a combination of arm talent,
              processing speed, and mechanical DNA that defines their ceiling. We map it.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center relative z-10">
            {/* Left: Gene traits */}
            <div className="space-y-6">
              {[
                { icon: Zap, gene: "ARM VELOCITY", code: "VEL-α", desc: "Raw arm strength & ball speed measured at point of release", color: "text-uc-cyan", bg: "bg-uc-cyan/10" },
                { icon: Target, gene: "ACCURACY STRAND", code: "ACC-γ", desc: "Precision mapping across short, medium, and deep targets", color: "text-uc-green", bg: "bg-uc-green/10" },
                { icon: Activity, gene: "MECHANICS BLUEPRINT", code: "MECH-δ", desc: "Footwork, hip rotation, release mechanics, and throwing platform", color: "text-purple-400", bg: "bg-purple-400/10" },
              ].map((trait, i) => (
                <motion.div
                  key={trait.gene}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i }}
                  className="glass rounded-xl p-5 flex items-start gap-4 group hover:border-white/10 transition-all animate-genome-border"
                >
                  <div className={`w-10 h-10 rounded-lg ${trait.bg} flex items-center justify-center flex-shrink-0`}>
                    <trait.icon size={18} className={trait.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${trait.color}`}>
                        {trait.gene}
                      </span>
                      <span className="text-[8px] font-mono text-uc-gray-600">{trait.code}</span>
                    </div>
                    <p className="text-xs text-uc-gray-400">{trait.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center: DNA Helix */}
            <div className="hidden md:flex items-center justify-center">
              <DNAHelix size="lg" basePairs={14} speed={12} />
            </div>

            {/* Right: Gene traits */}
            <div className="space-y-6">
              {[
                { icon: Eye, gene: "FIELD VISION", code: "FV-η", desc: "Pre-snap reads, progression speed, and coverage recognition", color: "text-yellow-400", bg: "bg-yellow-400/10" },
                { icon: BarChart3, gene: "PROCESSING SPEED", code: "DEC-ε", desc: "Time to read defense, make decision, and deliver the ball", color: "text-uc-cyan", bg: "bg-uc-cyan/10" },
                { icon: Shield, gene: "POISE UNDER PRESSURE", code: "POI-θ", desc: "Performance in clean vs. pressured pockets & late-game situations", color: "text-uc-green", bg: "bg-uc-green/10" },
              ].map((trait, i) => (
                <motion.div
                  key={trait.gene}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i }}
                  className="glass rounded-xl p-5 flex items-start gap-4 group hover:border-white/10 transition-all animate-genome-border"
                >
                  <div className={`w-10 h-10 rounded-lg ${trait.bg} flex items-center justify-center flex-shrink-0`}>
                    <trait.icon size={18} className={trait.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${trait.color}`}>
                        {trait.gene}
                      </span>
                      <span className="text-[8px] font-mono text-uc-gray-600">{trait.code}</span>
                    </div>
                    <p className="text-xs text-uc-gray-400">{trait.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom: Genome sequence ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass">
              <div className="w-2 h-2 rounded-full bg-uc-green animate-nucleotide-drift" />
              <span className="text-[9px] font-mono text-uc-gray-400 tracking-[0.2em]">
                GENOME ACTIVATION INDEX — LIVE
              </span>
              <div className="w-2 h-2 rounded-full bg-uc-cyan animate-nucleotide-drift" style={{ animationDelay: "1s" }} />
            </div>
            <div className="mt-4">
              <Link
                href="/genome"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500/15 text-purple-400 font-bold text-[10px] tracking-wider uppercase border border-purple-400/20 hover:bg-purple-500/25 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
              >
                <Dna size={12} />
                Explore Genome Timeline
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* DNA Strand Divider */}
      <DNAStrandDivider className="opacity-30" />

      {/* ═══════════ SECTION 3: THE EXPERIENCE ═══════════ */}
      <RevealSection className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            The Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 leading-tight">
            Not a profile.
            <br />
            <span className="text-uc-gray-400">A command center.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Identity",
                desc: "Objective metrics from Wilson QBX data. Every number earned, not given.",
              },
              {
                icon: Zap,
                title: "Live Metrics",
                desc: "Animated dashboards with radial gauges, percentile bars, and velocity tracking.",
              },
              {
                icon: BarChart3,
                title: "Pro Comparison",
                desc: "See how your mechanics compare to NFL quarterbacks at the same stage.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 0 30px rgba(0,194,255,0.15)" }}
                className="glass rounded-2xl p-8 cursor-default transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-uc-cyan/10 flex items-center justify-center mb-4">
                  <item.icon className="text-uc-cyan" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-uc-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 4: STATS ═══════════ */}
      <RevealSection className="py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value="500+" label="QBs Verified" delay={0} />
          <StatBlock value="12K" label="Coach Views" delay={0.1} />
          <StatBlock value="48" label="States" delay={0.2} />
          <StatBlock value="98%" label="Data Accuracy" delay={0.3} />
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 5: FEATURED HIGHLIGHTS (Overtime-style) ═══════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uc-red/10 flex items-center justify-center">
                <Flame size={20} className="text-uc-red" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-uc-red font-bold">
                  Trending Now
                </p>
                <h2 className="text-2xl md:text-3xl font-bold">Top Highlights</h2>
              </div>
            </div>
            <Link
              href="/highlights"
              className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Featured hero video cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "63.4 MPH BOMB — State Championship",
                athlete: "Andre Mitchell",
                athleteId: "6",
                school: "IMG Academy",
                gradient: "from-yellow-500/30 via-uc-panel to-purple-500/20",
                views: "234K",
                duration: "0:38",
                metrics: ["63.4 MPH", "52 YDS", "Elite Spiral"],
              },
              {
                title: "DUAL THREAT — 7 Total TDs vs. Bosco",
                athlete: "Marcus Rivera",
                athleteId: "2",
                school: "Mater Dei HS",
                gradient: "from-uc-red/30 via-uc-panel to-orange-500/20",
                views: "156K",
                duration: "1:42",
                metrics: ["7 TDs", "128 Rush", "312 Pass"],
              },
            ].map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[16/10]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-uc-cyan/20 group-hover:border-uc-cyan/40 transition-all duration-300"
                  >
                    <Play size={24} className="text-white ml-1 group-hover:text-uc-cyan transition-colors" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Duration + views */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white/90">
                    {video.duration}
                  </span>
                </div>
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-uc-red/20 backdrop-blur-sm border border-uc-red/30">
                  <Flame size={10} className="text-uc-red" />
                  <span className="text-[10px] font-bold text-uc-red uppercase tracking-wider">Trending</span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {video.metrics.map((m) => (
                      <span key={m} className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20">
                        {m}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-uc-cyan transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{video.athlete}</span>
                    <span className="text-[10px] text-uc-gray-400">{video.school}</span>
                    <span className="flex items-center gap-1 text-[10px] text-uc-gray-400 ml-auto">
                      <Eye size={10} /> {video.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Highlight reel row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "0.36s Release — Fastest in Class", athlete: "Dylan Park", views: "67K", gradient: "from-green-500/30 to-uc-cyan/10" },
              { title: "Pre-Snap Read Breakdown", athlete: "Jaxon Smith", views: "89K", gradient: "from-uc-cyan/30 to-blue-500/10" },
              { title: "Island Arm — Hawaii Pipeline", athlete: "Kai Nakamura", views: "45K", gradient: "from-teal-500/30 to-blue-500/10" },
              { title: "Off-Platform Magic", athlete: "Jaxon Smith", views: "92K", gradient: "from-purple-500/30 to-pink-500/10" },
            ].map((clip, i) => (
              <motion.div
                key={clip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`relative rounded-xl overflow-hidden aspect-video mb-2 bg-gradient-to-br ${clip.gradient}`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-uc-cyan/20 backdrop-blur-sm flex items-center justify-center">
                      <Play size={14} className="text-uc-cyan ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold truncate group-hover:text-uc-cyan transition-colors">{clip.title}</p>
                <p className="text-[10px] text-uc-gray-400 flex items-center gap-2">
                  {clip.athlete} <span className="flex items-center gap-0.5"><Eye size={8} />{clip.views}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 6: TOP PROSPECTS TICKER ═══════════ */}
      <RevealSection className="py-16 px-6 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6 text-center font-bold">
            2026 Top Prospects
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLACEHOLDER_ATHLETES.map((athlete, i) => {
              const gai = computeGAI(athlete.metrics);
              return (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/athlete/${athlete.id}`} className="glass rounded-xl p-4 flex items-center gap-3 group hover:border-uc-cyan/20 transition-all duration-300 block">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-uc-cyan/30 transition-all">
                    <span className="text-sm font-bold text-uc-cyan/60 group-hover:text-uc-cyan transition-colors">
                      {athlete.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate group-hover:text-uc-cyan transition-colors">
                      {athlete.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-[9px] text-uc-gray-400">{athlete.state}</p>
                      {athlete.verified && <VerifiedBadge size="sm" />}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-black font-mono" style={{ color: gai.tierColor }}>{gai.gai}</p>
                    <p className="text-[7px] font-bold tracking-wider uppercase" style={{ color: gai.tierColor }}>{gai.tier}</p>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 7: COLLECTIBLES PREVIEW ═══════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
                  <Sparkles size={12} />
                  Digital Collectibles
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="gradient-text">Own the next</span>
                  <br />
                  <span className="text-purple-400">generation of talent.</span>
                </h2>
                <p className="text-uc-gray-400 mb-6 max-w-md">
                  Every verified QB generates a digital collectible card backed by real performance data.
                  Collect, trade, and own a piece of the next first-round pick.
                </p>

                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <p className="text-2xl font-bold text-uc-green">$4,500+</p>
                    <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">Volume Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">6</p>
                    <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">Active Cards</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">1</p>
                    <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">Genesis Drop</p>
                  </div>
                </div>

                <Link
                  href="/collectibles"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-500/20 text-purple-400 font-bold text-sm tracking-wider uppercase border border-purple-400/20 hover:bg-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300"
                >
                  Explore Collectibles
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Preview cards stack */}
              <div className="flex-shrink-0 relative w-52 h-72">
                {[
                  { name: "A. Mitchell", color: "border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]", label: "Genesis", offset: "rotate-[-6deg] translate-x-[-8px]" },
                  { name: "J. Smith", color: "border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]", label: "Legendary", offset: "rotate-[0deg]" },
                  { name: "D. Park", color: "border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.08)]", label: "Legendary", offset: "rotate-[6deg] translate-x-[8px]" },
                ].map((card, i) => (
                  <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br from-uc-surface via-uc-panel to-uc-panel border p-4 flex flex-col justify-between ${card.color} ${card.offset}`}
                    style={{ zIndex: 3 - i }}
                  >
                    <div className="flex items-center justify-between">
                      <Crown size={12} className="text-yellow-400/60" />
                      <span className="text-[8px] font-bold text-uc-gray-400 tracking-wider uppercase">{card.label}</span>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-black text-uc-cyan/50">{card.name.charAt(0)}</span>
                      </div>
                      <p className="text-xs font-bold">{card.name}</p>
                    </div>
                    <div className="flex justify-between text-[8px] text-uc-gray-400">
                      <span>VEL</span><span>MECH</span><span>ACC</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 8: NIL VALUE PREVIEW ═══════════ */}
      <RevealSection className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-uc-green/10 text-uc-green text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            <DollarSign size={12} />
            NIL Valuations
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Know your value.</span>
          </h2>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-12">
            AI-powered NIL valuations based on verified metrics, recruiting heat, 
            social reach, and market signals. Every verified QB gets a live valuation.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Andre Mitchell", value: "$67,500", tier: "Elite", trend: "+12.5%", color: "text-yellow-400" },
              { name: "Jaxon Smith", value: "$42,200", tier: "Premium", trend: "+8.3%", color: "text-purple-400" },
              { name: "Dylan Park", value: "$38,800", tier: "Premium", trend: "+5.1%", color: "text-purple-400" },
            ].map((qb, i) => (
              <motion.div
                key={qb.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass rounded-2xl p-6 text-center group hover:border-uc-green/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-uc-green/20 to-uc-panel flex items-center justify-center mx-auto mb-3 border border-white/5">
                  <span className="text-lg font-bold text-uc-green/60">{qb.name.charAt(0)}</span>
                </div>
                <p className="text-sm font-bold mb-1">{qb.name}</p>
                <p className="text-3xl font-bold text-uc-green font-mono mb-1">{qb.value}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-[9px] font-bold tracking-wider uppercase ${qb.color}`}>{qb.tier}</span>
                  <span className="flex items-center gap-0.5 text-xs text-uc-green">
                    <TrendingUp size={10} /> {qb.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            href="/dashboard/nil"
            className="inline-flex items-center gap-2 mt-10 px-8 py-3.5 rounded-xl glass border border-uc-green/20 text-uc-green font-bold text-sm tracking-wider uppercase hover:bg-uc-green/10 hover:shadow-[0_0_25px_rgba(0,255,136,0.15)] transition-all duration-300"
          >
            Explore NIL Hub
            <ArrowRight size={16} />
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 9: PARTNERS ═══════════ */}
      <RevealSection className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-12">
            Official Partners
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              {
                name: "Dome Headwear Co.",
                url: "https://www.domeheadwear.com",
                tagline: "Premium Athletic Headwear",
              },
              {
                name: "Spartan Orthopedic Institute",
                url: "https://www.spartanorthopedic.com",
                tagline: "Sports Medicine & Recovery",
              },
              {
                name: "Tork Sports Performance",
                url: "https://www.torksportsperformance.com",
                tagline: "Strength & Conditioning",
              },
              {
                name: "Rhythm Sports Nutrition",
                url: "https://www.rhythmsportsnutrition.com",
                tagline: "Fuel The Machine",
              },
            ].map((partner, i) => (
              <motion.a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(0,194,255,0.12)",
                }}
                className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-1 group-hover:bg-uc-cyan/10 transition-colors">
                  <span className="text-xl font-black gradient-text">
                    {partner.name.split(" ")[0][0]}
                  </span>
                </div>
                <p className="text-xs font-bold tracking-wider uppercase text-white/90">
                  {partner.name}
                </p>
                <p className="text-[10px] text-uc-gray-400 tracking-wide">
                  {partner.tagline}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ SECTION 10: CTA ═══════════ */}
      <RevealSection className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4">
            The Draft Pipeline
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text-dna">Get your DNA decoded.</span>
          </h2>
          <p className="text-uc-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join the verified quarterback genome. Get your blueprint mapped.
            Get discovered by college coaches who trust data over hype.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.4)] transition-all duration-250"
          >
            Get Decoded Now
            <ChevronRight size={16} />
          </Link>
        </div>
      </RevealSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna size={16} className="text-uc-cyan" />
            <span className="text-sm font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-xs text-uc-gray-600">
            &copy; {new Date().getFullYear()} Under Center &bull; QBDNA — The Quarterback Genome.
          </p>
          <div className="flex gap-6">
            <Link href="/search" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">
              Discover
            </Link>
            <Link href="/card-generator" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">
              Card Lab
            </Link>
            <Link href="/dashboard" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
