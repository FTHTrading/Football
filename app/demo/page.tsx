"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import RadialGauge from "@/components/RadialGauge";
import StarRating from "@/components/StarRating";
import {
  ChevronRight,
  ChevronDown,
  Target,
  Eye,
  Film,
  Play,
  ArrowRight,
  ArrowDown,
  Dna,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  DollarSign,
  Shield,
  BarChart3,
  Users,
  Globe,
  Smartphone,
} from "lucide-react";

/* ── reveal wrapper ── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── section divider ── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 max-w-4xl mx-auto px-6 py-16">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-uc-cyan/30 to-transparent" />
      <span className="text-[9px] tracking-[0.4em] uppercase text-uc-cyan/60 font-bold whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-uc-cyan/30 to-transparent" />
    </div>
  );
}

/* ── phase card ── */
function PhaseCard({
  phase,
  title,
  items,
  color,
  delay = 0,
}: {
  phase: string;
  title: string;
  items: string[];
  color: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
        <div
          className="absolute top-0 right-0 w-[200px] h-[120px] blur-[60px] rounded-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
          style={{ background: color }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase mb-4"
            style={{
              color,
              backgroundColor: `${color}15`,
              borderColor: `${color}30`,
              borderWidth: 1,
            }}
          >
            {phase}
          </div>
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-uc-gray-400">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

const featured = PLACEHOLDER_ATHLETES[0];

export default function DemoPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <main className="min-h-screen">
      {/* ═══════════════════════════════════════════
          HERO — Title Screen
      ═══════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-uc-black via-[#0B1520] to-uc-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.05),transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 px-4 py-1.5 rounded-full glass text-[9px] tracking-[0.4em] uppercase text-uc-cyan/80 border border-uc-cyan/15"
          >
            Platform Walkthrough
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <Dna className="w-8 h-8 text-uc-cyan" />
            <span className="text-2xl font-bold tracking-[0.2em] uppercase gradient-text">
              Under Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6 max-w-4xl"
          >
            <span className="text-white">The Verified Identity Standard</span>
            <br />
            <span className="gradient-text">for Quarterbacks.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-uc-gray-400 text-lg md:text-xl max-w-2xl mb-12"
          >
            A data-first platform that replaces guesswork with objective metrics,
            shareable identity, and recruiting visibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-3 text-sm text-uc-gray-500"
          >
            <span>Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          SECTION 1 — THE PROBLEM
      ═══════════════════════════════════════════ */}
      <SectionDivider label="The Problem" />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight">
              QB recruiting is broken.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-xl mx-auto mb-16">
              The current system relies on subjective film opinions, self-reported stats,
              and camp hype. Coaches don&apos;t have standardized data. Athletes don&apos;t have proof.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "No Standardized Metrics",
                desc: "Every camp measures differently. Coaches can't compare athletes across regions.",
                color: "#FF3B5C",
              },
              {
                icon: Eye,
                title: "Invisible Athletes",
                desc: "Top QBs outside major markets get overlooked. No searchable, verified database exists.",
                color: "#FFB800",
              },
              {
                icon: BarChart3,
                title: "No Data Ownership",
                desc: "Athletes train for years but own zero portable data. Everything resets at every tryout.",
                color: "#FF6B35",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — CURRENT LIMITATIONS
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Current State" />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Where QBDNA is today.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-lg mx-auto mb-12">
              Strong training foundation. But the digital layer limits scale and monetization.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What works */}
            <Reveal>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={16} className="text-uc-green" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-uc-green">
                    What&apos;s Working
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Elite on-field training (former D1 staff)",
                    "8 training locations across FL + WI",
                    "Strong athlete word-of-mouth",
                    "Established coaching methodology",
                    "Brand recognition in regional market",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-uc-gray-300">
                      <CheckCircle2 size={12} className="text-uc-green/60 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Limitations */}
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-yellow-400" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-yellow-400">
                    Opportunities
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Website is static — no athlete database or search",
                    "No shareable verified credentials",
                    "Metrics live on paper, not online",
                    "No coach-facing portal or dashboard",
                    "NIL monetization layer doesn't exist yet",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-uc-gray-300">
                      <ArrowRight size={12} className="text-yellow-400/60 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — WHAT CHANGES
      ═══════════════════════════════════════════ */}
      <SectionDivider label="The Platform" />

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              What changes with this system.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-lg mx-auto mb-16">
              Not a redesign. An entirely new operating layer for athlete identity.
            </p>
          </Reveal>

          {/* Capability Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                desc: "Every QB gets a cinematic command center with objective, standardized metrics.",
                color: "#00C2FF",
              },
              {
                icon: BarChart3,
                title: "Radial Gauges + Percentiles",
                desc: "Velocity, release, spin rate, mechanics, accuracy — displayed like a draft combine interface.",
                color: "#00FF88",
              },
              {
                icon: Film,
                title: "Film + Overlay Metrics",
                desc: "Video with real-time metric overlays. Coaches see data while watching throws.",
                color: "#A855F7",
              },
              {
                icon: Users,
                title: "NFL Pro Comparison",
                desc: "Side-by-side comparison against active NFL QBs using the same metric framework.",
                color: "#FFB800",
              },
              {
                icon: Smartphone,
                title: "Shareable Verified Card",
                desc: "Instagram-optimized (1080×1350) card with QR code. 3 design themes. Screenshot-ready.",
                color: "#00C2FF",
              },
              {
                icon: Globe,
                title: "Recruiting Visibility",
                desc: "Searchable, filterable QB database. Coaches find athletes by state, metrics, grad year.",
                color: "#00FF88",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — LIVE PROFILE PREVIEW
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Live Preview" />

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              This is what athletes get.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-lg mx-auto mb-12">
              A working prototype — not a mockup.
            </p>
          </Reveal>

          {/* Profile card preview */}
          <Reveal>
            <div className="glass rounded-2xl p-6 md:p-8 max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-uc-cyan/5 blur-[80px] rounded-full pointer-events-none" />

              {/* Identity header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center border border-white/5 shrink-0">
                  <span className="text-3xl font-bold text-uc-cyan/40">
                    {featured.name.charAt(0)}
                  </span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <h3 className="text-2xl font-bold">{featured.name}</h3>
                    <VerifiedBadge size="sm" />
                  </div>
                  <p className="text-sm text-uc-gray-400 mb-2">
                    {featured.school} · Class of {featured.gradYear} · {featured.height} · {featured.weight} lbs
                  </p>
                  <StarRating rating={featured.rating} />
                </div>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 relative z-10">
                <RadialGauge label="Velocity" value={featured.metrics.velocity} maxValue={70} size={110} />
                <RadialGauge label="Release" value={(1 - featured.metrics.releaseTime) * 100} maxValue={100} size={110} />
                <RadialGauge label="Spin Rate" value={featured.metrics.spinRate} maxValue={800} size={110} />
                <RadialGauge label="Mechanics" value={featured.metrics.mechanics} size={110} />
                <RadialGauge label="Accuracy" value={featured.metrics.accuracy} size={110} />
                <RadialGauge label="Decision" value={featured.metrics.decisionSpeed} size={110} />
              </div>

              {/* Film */}
              <div className="rounded-xl bg-gradient-to-br from-uc-surface to-uc-panel aspect-video relative overflow-hidden border border-white/5 cursor-pointer group mb-6 relative z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-uc-cyan/20 group-hover:border-uc-cyan/40 transition-all">
                    <Play size={20} className="text-white ml-0.5 group-hover:text-uc-cyan transition-colors" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20">
                    61.8 MPH
                  </span>
                  <span className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20">
                    0.38s Release
                  </span>
                  <span className="px-2 py-1 rounded-md bg-uc-green/10 backdrop-blur-sm text-[9px] font-bold text-uc-green border border-uc-green/20">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="text-center relative z-10">
                <Link
                  href={`/athlete/${featured.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-uc-cyan hover:underline"
                >
                  View Full Interactive Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — VERIFIED CARD EXPORT
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Social Layer" />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shareable from day one.
            </h2>
            <p className="text-uc-gray-400 max-w-lg mx-auto mb-12">
              Every verified QB gets an Instagram-ready card. QR code links back to their
              full profile. Coaches scan, athletes share.
            </p>
          </Reveal>

          {/* Card mockups */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {PLACEHOLDER_ATHLETES.filter((a) => a.verified)
              .slice(0, 3)
              .map((athlete, i) => (
                <Reveal key={athlete.id} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -6, rotate: 0 }}
                    className="glass rounded-2xl p-4 border border-white/10 cursor-pointer"
                    style={{
                      rotate: i === 0 ? -3 : i === 2 ? 3 : 0,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center border border-white/5">
                          <span className="text-[10px] font-bold text-uc-cyan/60">
                            {athlete.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold">{athlete.name.split(" ")[0]}</span>
                      </div>
                      <CheckCircle2 size={10} className="text-uc-cyan" />
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="text-center">
                        <p className="text-sm font-bold font-mono">{athlete.metrics.velocity.toFixed(0)}</p>
                        <p className="text-[6px] uppercase text-uc-gray-400">MPH</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-mono">{athlete.metrics.accuracy}%</p>
                        <p className="text-[6px] uppercase text-uc-gray-400">ACC</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 mb-2" />
                    <p className="text-[7px] text-uc-gray-500 text-center">{athlete.gradYear} · {athlete.state}</p>
                  </motion.div>
                </Reveal>
              ))}
          </div>

          <Reveal delay={0.2}>
            <Link
              href="/card-generator"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass border border-uc-cyan/20 text-uc-cyan font-bold text-xs tracking-wider uppercase hover:bg-uc-cyan/10 transition-all"
            >
              Try the Card Generator <ArrowRight size={12} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — MONETIZATION EXPANSION
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Revenue Layer" />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Monetization beyond training.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-lg mx-auto mb-12">
              This platform creates revenue streams that don&apos;t exist yet.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Verification Fee ($149)",
                desc: "One-time payment for verified status + premium profile. Stripe-integrated, live today.",
                color: "#00C2FF",
              },
              {
                icon: TrendingUp,
                title: "NIL Deal Tracking",
                desc: "Athletes track brand deals, sponsors, and NIL valuation directly on their profile.",
                color: "#00FF88",
              },
              {
                icon: Users,
                title: "Coach Portal (Premium)",
                desc: "Coaches pay for access to filter, compare, and export athlete data. Recurring revenue.",
                color: "#A855F7",
              },
              {
                icon: Zap,
                title: "Digital Collectibles",
                desc: "Limited-edition verified cards backed by real data. Tradeable. Value grows with performance.",
                color: "#FFB800",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — PHASE ROLLOUT PLAN
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Rollout" />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Phase rollout plan.
            </h2>
            <p className="text-uc-gray-400 text-center max-w-lg mx-auto mb-12">
              Structured expansion. Each phase unlocks the next revenue layer.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            <PhaseCard
              phase="Phase 1"
              title="Website + Verified Card"
              items={[
                "Cinematic homepage with clear CTA",
                "Individual QB profile pages",
                "Shareable verified card (1080×1350)",
                "Stripe checkout ($149 verification)",
                "Mobile-responsive dark UI",
              ]}
              color="#00C2FF"
              delay={0}
            />
            <PhaseCard
              phase="Phase 2"
              title="Data Dashboard + Coach Portal"
              items={[
                "Radial gauge metrics dashboard",
                "NFL pro comparison engine",
                "Film overlay with live metrics",
                "Coach-facing search + filter",
                "Recruiting timeline + offers",
              ]}
              color="#00FF88"
              delay={0.1}
            />
            <PhaseCard
              phase="Phase 3"
              title="NIL + Monetization Layer"
              items={[
                "NIL valuation engine",
                "Brand deal tracker",
                "Digital collectible marketplace",
                "Premium coach subscriptions",
                "Analytics + reporting dashboard",
              ]}
              color="#A855F7"
              delay={0.2}
            />
          </div>

          {/* Status indicator */}
          <Reveal delay={0.3}>
            <div className="mt-8 glass rounded-xl p-4 max-w-md mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-uc-green animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-uc-green">
                  Phases 1–3 Built
                </span>
              </div>
              <p className="text-[10px] text-uc-gray-400">
                All three phases are functional in the current codebase. 52 pages. Build passing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8 — TECH STACK
      ═══════════════════════════════════════════ */}
      <SectionDivider label="Infrastructure" />

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Production-grade infrastructure.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Next.js 16", sub: "React 19" },
              { label: "Stripe", sub: "Payments" },
              { label: "Prisma 7", sub: "PostgreSQL" },
              { label: "NextAuth", sub: "RBAC" },
              { label: "PostHog", sub: "Analytics" },
              { label: "Redis", sub: "Rate Limiting" },
              { label: "Three.js", sub: "3D Visuals" },
              { label: "Framer", sub: "Animations" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.04}>
                <div className="glass rounded-lg p-3 text-center">
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[9px] text-uc-gray-400">{item.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan/60 mb-6">
              Next Step
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              This isn&apos;t a website.
              <br />
              <span className="gradient-text">
                This is a data identity layer
              </span>
              <br />
              for athlete monetization.
            </h2>
            <p className="text-uc-gray-400 text-lg mb-10 max-w-xl mx-auto">
              I&apos;d love to walk you through the architecture and discuss
              how this maps to your roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+19044846916"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.4)] transition-all duration-250"
              >
                Let&apos;s Talk
                <ChevronRight size={16} />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl glass border border-white/10 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/30 hover:text-uc-cyan transition-all duration-250"
              >
                View Live Site
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text">
              Under Center
            </span>
          </div>
          <p className="text-[10px] text-uc-gray-600">
            Platform Walkthrough · Confidential
          </p>
        </div>
      </footer>
    </main>
  );
}
