"use client";

import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import RadialGauge from "@/components/RadialGauge";
import StarRating from "@/components/StarRating";
import {
  ChevronRight,
  ArrowRight,
  Dna,
  Share2,
  CheckCircle2,
} from "lucide-react";

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

/* ── Featured athlete ── */
const featured = PLACEHOLDER_ATHLETES.find((a) => a.id === "6") || PLACEHOLDER_ATHLETES[0];

export default function Home() {
  return (
    <main className="relative">

      {/* ═══ SECTION 1 — CINEMATIC HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Hero Photo Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-stadium.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-uc-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 px-5 py-2 rounded-full glass text-[10px] tracking-[0.4em] uppercase text-uc-cyan border border-uc-cyan/20"
          >
            The Verified Quarterback Index
          </motion.div>

          {/* Headline — Overtime-scale typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            <span className="text-white">Verified</span>
            <br />
            <span className="gradient-text">Quarterbacks.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-uc-gray-300 text-xl md:text-2xl max-w-lg mb-12 font-light tracking-wide"
          >
            Objective metrics. Real signal. No guesswork.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/search"
              className="group flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              View Verified QBs
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-10 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
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

      {/* ═══ SECTION 2 — FEATURED ATHLETE (Editorial) ═══ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Featured Prospect
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 leading-tight">
            This is what <span className="gradient-text">verified</span> looks like.
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every verified QB gets a cinematic data page — metrics captured, film graded, profile built for coaches.
          </p>

          {/* Editorial athlete card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden relative"
          >
            {/* Large background image */}
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/athlete-action.png"
                alt="Quarterback in action"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-uc-black via-uc-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-uc-black/80 via-transparent to-uc-black/40" />

              {/* Identity overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        {featured.name}
                      </h3>
                      <VerifiedBadge size="lg" />
                    </div>
                    <p className="text-sm text-uc-gray-300 mb-1">
                      {featured.school} · Class of {featured.gradYear} · {featured.height} · {featured.weight} lbs
                    </p>
                    <StarRating rating={featured.rating} />
                  </div>
                  <div className="hidden md:flex gap-2">
                    {featured.offers.slice(0, 3).map((school) => (
                      <div key={school} className="glass rounded-lg px-3 py-2 text-center backdrop-blur-md">
                        <span className="text-[10px] font-bold text-white/80">{school}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics below image */}
            <div className="bg-uc-panel p-6 md:p-8 border border-white/[0.04]">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                <RadialGauge label="Velocity" value={featured.metrics.velocity} maxValue={70} size={110} />
                <RadialGauge label="Release" value={(1 - featured.metrics.releaseTime) * 100} maxValue={100} size={110} />
                <RadialGauge label="Spin Rate" value={featured.metrics.spinRate} maxValue={800} size={110} />
                <RadialGauge label="Mechanics" value={featured.metrics.mechanics} size={110} />
                <RadialGauge label="Accuracy" value={featured.metrics.accuracy} size={110} />
                <RadialGauge label="Decision" value={featured.metrics.decisionSpeed} size={110} />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/athlete/${featured.id}`}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-uc-cyan/10 border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/20 transition-all"
                >
                  Full Profile <ArrowRight size={14} />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-uc-gray-400 hover:text-uc-cyan transition-colors"
                >
                  All Prospects <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 3 — SOCIAL CARD SHOWCASE ═══ */}
      <RevealSection className="py-32 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Share Your Signal
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight">
            Built for the modern QB.
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-md mx-auto mb-16">
            Generate verified cards. Share everywhere. Let data do the talking.
          </p>

          {/* 3 staggered card previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PLACEHOLDER_ATHLETES.filter((a) => a.verified).slice(0, 3).map((athlete, i) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 30, rotate: i === 0 ? -3 : i === 2 ? 3 : 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -3 : i === 2 ? 3 : 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: 0, y: -8 }}
                className="glass rounded-2xl p-5 border border-white/10 cursor-pointer transition-all duration-300 hover:border-uc-cyan/30 hover:shadow-[0_0_30px_rgba(0,194,255,0.1)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-uc-cyan/30 to-uc-panel flex items-center justify-center border border-white/10">
                      <span className="text-sm font-black text-uc-cyan">{athlete.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{athlete.name}</p>
                      <p className="text-[8px] text-uc-gray-400">{athlete.school}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={14} className="text-uc-cyan" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-black font-mono text-white">{athlete.metrics.velocity.toFixed(1)}</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">MPH</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black font-mono text-white">{athlete.metrics.releaseTime.toFixed(2)}</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">Release</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black font-mono text-white">{athlete.metrics.accuracy}%</p>
                    <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">Accuracy</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/card-generator"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/10 hover:shadow-[0_0_25px_rgba(0,194,255,0.15)] transition-all"
            >
              <Dna size={16} />
              Generate Your Card
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 4 — CLOSING CTA ═══ */}
      <RevealSection className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tight">
            <span className="gradient-text">Your data.</span>
            <br />
            <span className="text-uc-gray-400">Your identity.</span>
          </h2>
          <p className="text-uc-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Stop guessing. Start proving. Get verified and let the metrics speak for themselves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-12 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              Get Verified
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-12 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Browse Prospects
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
