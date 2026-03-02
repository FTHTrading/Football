"use client";

import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import RadialGauge from "@/components/RadialGauge";
import StarRating from "@/components/StarRating";
import {
  ChevronRight,
  Target,
  Eye,
  Shield,
  Play,
  ArrowRight,
  Dna,
  Film,
  Share2,
  CheckCircle2,
} from "lucide-react";

const HeroTunnel = dynamic(() => import("@/components/HeroTunnel"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-uc-black" />,
});

/* ── Scroll-reveal wrapper ── */
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

/* ── Stat counter ── */
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

/* ── Featured athlete for profile preview (Mason Carter — mockup hero) ── */
const featured = {
  id: "mason-carter",
  name: "Mason Carter",
  gradYear: 2026,
  position: "QB" as const,
  height: "6'6\"",
  weight: 220,
  state: "Florida",
  school: "Orlando, FL",
  photoUrl: "/athletes/mason-carter.jpg",
  verified: true,
  rating: 5.0,
  qbClass: "Pro-Style",
  metrics: {
    velocity: 52,
    releaseTime: 0.41,
    spinRate: 690,
    mechanics: 89,
    accuracy: 92,
    decisionSpeed: 88,
  },
  offers: ["Ohio State", "Penn State", "Alabama", "Georgia", "Clemson", "USC"],
  filmUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  comparisonPlayer: "Justin Herbert",
};

export default function Home() {
  return (
    <main className="relative">
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
          Dark stadium background, animated fog, bold headline
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <HeroTunnel />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-uc-black pointer-events-none z-[1]" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 px-4 py-1.5 rounded-full glass text-[10px] tracking-[0.3em] uppercase text-uc-cyan border border-uc-cyan/20"
          >
            The Verified Quarterback Index
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
          >
            <span className="gradient-text">Verified Quarterbacks.</span>
            <br />
            <span className="text-uc-gray-400">No Guesswork.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-uc-gray-400 text-lg md:text-xl max-w-xl mb-10"
          >
            Objective throwing metrics. Real recruiting signal.
          </motion.p>

          {/* Animated hero metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-4 md:gap-6 mb-12"
          >
            <MetricCard label="Velocity" value="52 MPH" numericValue={52} suffix=" MPH" delay={0.9} />
            <MetricCard label="Release" value="0.41s" numericValue={0.41} suffix="s" delay={1.1} />
            <MetricCard label="Accuracy" value="92%" numericValue={92} suffix="%" delay={1.3} />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/search"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-250"
            >
              View Verified QBs
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10 text-uc-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/30 hover:text-uc-cyan transition-all duration-250"
            >
              Get Verified
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-uc-cyan" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — WHAT "VERIFIED" MEANS
          3 premium cards with subtle glow
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            Why Verified?
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 leading-tight">
            What &ldquo;Verified&rdquo; means.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Objective Metrics",
                desc: "Captured using QBX & standardized tools. Velocity, release, spin rate, accuracy — no self-reported stats.",
                color: "text-uc-cyan",
                bg: "bg-uc-cyan/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(0,194,255,0.15)]",
              },
              {
                icon: Film,
                title: "Film + Mechanics Grading",
                desc: "Real breakdown from former D1 QBs. Footwork, hip rotation, platform, release — every throw analyzed.",
                color: "text-uc-green",
                bg: "bg-uc-green/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(0,255,136,0.15)]",
              },
              {
                icon: Eye,
                title: "Recruiting Visibility",
                desc: "Structured profiles coaches can trust. Filterable, searchable, verified signal — not guesswork.",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className={`glass rounded-2xl p-8 cursor-default transition-all duration-300 group ${card.glow}`}
              >
                <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center mb-5`}>
                  <card.icon className={card.color} size={26} />
                </div>
                <h3 className="text-lg font-bold mb-3">{card.title}</h3>
                <p className="text-sm text-uc-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 3 — PROFILE PREVIEW
          Scroll-triggered mock QB profile (combine interface feel)
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            The Product
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 leading-tight">
            What &ldquo;Verified&rdquo; means.
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every verified QB gets a cinematic data page that feels like a draft combine interface.
          </p>

          {/* Mock profile card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-2xl p-6 md:p-8 max-w-4xl mx-auto relative overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-uc-cyan/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Identity header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center border border-white/5 shrink-0">
                <span className="text-4xl font-bold text-uc-cyan/40">{featured.name.charAt(0)}</span>
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
              <div className="flex gap-3 shrink-0">
                {featured.offers.slice(0, 2).map((school) => (
                  <div key={school} className="glass rounded-xl px-3 py-2 text-center">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-1 border border-white/10">
                      <span className="text-xs font-bold text-uc-cyan/80">{school.split(" ").map(w => w[0]).join("")}</span>
                    </div>
                    <p className="text-[8px] text-uc-gray-400 whitespace-nowrap">{school}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radial gauge row */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 relative z-10">
              <RadialGauge label="Velocity" value={featured.metrics.velocity} maxValue={70} size={120} />
              <RadialGauge label="Release" value={(1 - featured.metrics.releaseTime) * 100} maxValue={100} size={120} />
              <RadialGauge label="Spin Rate" value={featured.metrics.spinRate} maxValue={800} size={120} />
              <RadialGauge label="Mechanics" value={featured.metrics.mechanics} size={120} />
              <RadialGauge label="Accuracy" value={featured.metrics.accuracy} size={120} />
              <RadialGauge label="Decision" value={featured.metrics.decisionSpeed} size={120} />
            </div>

            {/* Film thumbnail */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="flex-1 rounded-xl bg-gradient-to-br from-uc-surface to-uc-panel aspect-video relative overflow-hidden border border-white/5 cursor-pointer group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-uc-cyan/20 group-hover:border-uc-cyan/40 transition-all">
                    <Play size={18} className="text-white ml-0.5 group-hover:text-uc-cyan transition-colors" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20">
                    61.8 MPH
                  </span>
                  <span className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20">
                    0.38s Release
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-2 shrink-0 w-40">
                <div className="glass rounded-lg p-3 text-center">
                  <p className="text-[8px] tracking-wider uppercase text-uc-gray-400">Offers</p>
                  <p className="text-lg font-bold">{featured.offers.length}</p>
                </div>
                <div className="glass rounded-lg p-3 text-center">
                  <p className="text-[8px] tracking-wider uppercase text-uc-gray-400">Interest</p>
                  <p className="text-lg font-bold text-uc-green">High</p>
                </div>
              </div>
            </div>

            {/* View profile CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href={`/athlete/${PLACEHOLDER_ATHLETES[0].id}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/10 transition-all"
              >
                View Profile
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-sm font-bold text-uc-gray-400 hover:text-uc-cyan transition-colors"
              >
                Explore Profiles <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 4 — STATS BAR
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value="500+" label="QBs Verified" delay={0} />
          <StatBlock value="12K" label="Coach Views" delay={0.1} />
          <StatBlock value="48" label="States" delay={0.2} />
          <StatBlock value="98%" label="Data Accuracy" delay={0.3} />
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 5 — SOCIAL GROWTH / VERIFIED CARDS
          Floating verified card mockups in a grid
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            Social-First
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight">
            Built for the modern QB.
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Share your verified metrics. Let the data speak.
          </p>

          {/* Floating card grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PLACEHOLDER_ATHLETES.filter((a) => a.verified).slice(0, 3).map((athlete, i) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 30, rotate: i === 0 ? -3 : i === 2 ? 3 : 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -3 : i === 2 ? 3 : 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.03, rotate: 0, y: -8 }}
                className="glass rounded-2xl p-5 border border-white/10 cursor-pointer transition-all duration-300"
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center border border-white/5">
                      <span className="text-sm font-bold text-uc-cyan/60">{athlete.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{athlete.name}</p>
                      <p className="text-[8px] text-uc-gray-400">{athlete.school}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={14} className="text-uc-cyan" />
                </div>

                {/* Mini metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-white">{athlete.metrics.velocity.toFixed(1)}</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400">MPH</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-white">{athlete.metrics.releaseTime.toFixed(2)}</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400">Release</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-white">{athlete.metrics.accuracy}%</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400">Accuracy</p>
                  </div>
                </div>

                {/* Stars + share */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className={`w-2 h-2 rounded-full ${
                          j < Math.floor(athlete.rating) ? "bg-yellow-400" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <Share2 size={12} className="text-uc-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/card-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/10 transition-all"
            >
              Start a Profile
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 6 — TOP PROSPECTS
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-16 px-6 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6 text-center font-bold">
            2026 Verified Prospects
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLACEHOLDER_ATHLETES.map((athlete, i) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/athlete/${athlete.id}`}
                  className="glass rounded-xl p-4 flex items-center gap-3 group hover:border-uc-cyan/20 transition-all duration-300 block"
                >
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 7 — HOW IT WORKS (5-step flow)
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 leading-tight">
            From sign-up to signing day.
          </h2>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Create your profile",
                desc: "Sign up and build your quarterback identity in minutes.",
                color: "bg-uc-cyan/20 text-uc-cyan",
              },
              {
                step: "2",
                title: "Book an on-field evaluation",
                desc: "Train with our coaching staff (former D1 QBs) so we can evaluate your skills objectively.",
                color: "bg-uc-green/20 text-uc-green",
              },
              {
                step: "3",
                title: "We formulate a plan together",
                desc: "Custom development roadmap — training consistently to get you better now and for the future.",
                color: "bg-purple-400/20 text-purple-400",
              },
              {
                step: "4",
                title: "Put in the work",
                desc: "Maximize your potential with verified metrics, film review, and recruiting visibility.",
                color: "bg-yellow-400/20 text-yellow-400",
              },
              {
                step: "5",
                title: "Achieve your dream",
                desc: "Get recruited to play college football with real data backing every conversation.",
                color: "bg-uc-cyan/20 text-uc-cyan",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-5 glass rounded-xl p-6"
              >
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0 text-sm font-bold`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-uc-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 8 — TRAINING LOCATIONS
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4">
            On-Field Training
          </p>
          <h2 className="text-2xl md:text-4xl font-bold mb-12">
            Our training locations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Ponte Vedra / Fruit Cove",
              "Tampa, FL",
              "Port St Lucie, FL",
              "Saint Augustine, FL",
              "Daytona, FL",
              "Melbourne, FL",
              "Gainesville, FL",
              "Green Bay, WI",
            ].map((loc, i) => (
              <motion.div
                key={loc}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl px-4 py-3 text-sm font-medium text-uc-gray-300 border border-white/5 hover:border-uc-cyan/20 hover:text-white transition-all"
              >
                {loc}
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 9 — PARTNERS
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-12">
            Official Partners
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "Dome Headwear Co.", url: "https://www.domeheadwear.com", tagline: "Premium Athletic Headwear" },
              { name: "Spartan Orthopedic Institute", url: "https://www.spartanorthopedic.com", tagline: "Sports Medicine & Recovery" },
              { name: "Tork Sports Performance", url: "https://www.torksportsperformance.com", tagline: "Strength & Conditioning" },
              { name: "Rhythm Sports Nutrition", url: "https://www.rhythmsportsnutrition.com", tagline: "Fuel The Machine" },
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
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,194,255,0.12)" }}
                className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-1 group-hover:bg-uc-cyan/10 transition-colors">
                  <span className="text-xl font-black gradient-text">{partner.name.split(" ")[0][0]}</span>
                </div>
                <p className="text-xs font-bold tracking-wider uppercase text-white/90">{partner.name}</p>
                <p className="text-[10px] text-uc-gray-400 tracking-wide">{partner.tagline}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTION 10 — CTA + CONTACT
      ═══════════════════════════════════════════ */}
      <RevealSection className="py-32 px-6 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">The Verified Identity Standard</span>
            <br />
            <span className="text-uc-gray-400">for Quarterbacks.</span>
          </h2>
          <p className="text-uc-gray-400 text-lg mb-4 max-w-xl mx-auto">
            Our goal is to make you the best possible quarterback you can be.
            Through on-field training, film review, and verified metrics.
          </p>
          <p className="text-sm text-uc-gray-500 mb-10">
            Call us: <a href="tel:+19044846916" className="text-uc-cyan hover:underline">(904) 484-6916</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.4)] transition-all duration-250"
            >
              Start Your Profile
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl glass border border-white/10 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/30 hover:text-uc-cyan transition-all duration-250"
            >
              Learn More
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna size={16} className="text-uc-cyan" />
            <span className="text-sm font-bold tracking-[0.15em] uppercase gradient-text">Under Center</span>
          </div>
          <p className="text-xs text-uc-gray-600">
            &copy; {new Date().getFullYear()} Under Center — The Verified Quarterback Index. #BeTheOne
          </p>
          <div className="flex gap-6">
            <Link href="/search" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">Discover</Link>
            <Link href="/product" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">Product</Link>
            <Link href="/pricing" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">Pricing</Link>
            <Link href="/dashboard" className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
