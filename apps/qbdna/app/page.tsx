"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
  Target,
  Shield,
} from "lucide-react";

/* ── Animated counter ── */
function Counter({
  target,
  decimals = 0,
  suffix = "",
  duration = 2,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ── Rotating words ── */
function RotatingWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
        transition={{ duration: 0.5 }}
        className="inline-block text-uc-cyan"
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── Scroll-reveal wrapper ── */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

/* ── Data ── */
const featured =
  PLACEHOLDER_ATHLETES.find((a) => a.id === "6") || PLACEHOLDER_ATHLETES[0];
const verifiedAthletes = PLACEHOLDER_ATHLETES.filter((a) => a.verified).slice(0, 3);

const marqueeItems = [
  "VEL: 63.4 MPH",
  "RELEASE: 0.35s",
  "ACCURACY: 93%",
  "SPIN: 710 RPM",
  "MECHANICS: 95",
  "DECISION: 91",
  "FOOTWORK: 90",
  "POISE: 93",
  "VISION: 89",
  "CLUTCH: 94",
];

const howItWorks = [
  {
    step: "01",
    title: "Capture",
    desc: "Film throws with any camera. Our system extracts velocity, spin, release time, and 12+ biomechanical markers from every rep.",
    Icon: Target,
    gradient: "from-uc-cyan/20 to-transparent",
  },
  {
    step: "02",
    title: "Verify",
    desc: "Metrics are validated against our QB genome model. Each data point is cross-referenced, percentiled, and stamped as verified.",
    Icon: Shield,
    gradient: "from-uc-green/20 to-transparent",
  },
  {
    step: "03",
    title: "Share",
    desc: "Your verified profile goes live — searchable by coaches, shareable as social cards, backed by real data instead of hype.",
    Icon: Share2,
    gradient: "from-uc-cyan/20 to-transparent",
  },
];

/* ════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="relative overflow-x-hidden">

      {/* ═══ SECTION 1 — CINEMATIC HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Multi-layer cinematic background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/qb.png"
            alt=""
            fill
            className="object-cover object-top scale-110"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-uc-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-uc-black via-transparent to-uc-black/90" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-uc-cyan/[0.06]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-10 px-6 py-2.5 rounded-full glass-heavy text-[10px] tracking-[0.5em] uppercase text-uc-cyan font-bold border border-uc-cyan/20"
          >
            The Verified Quarterback Index
          </motion.div>

          {/* Massive stacked headline */}
          <h1 className="mb-8">
            {["EVERY", "THROW", "MEASURED."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, skewY: 2 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{
                  delay: 0.5 + i * 0.15,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] ${
                  word === "MEASURED." ? "gradient-text" : "text-white"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtext with rotating word */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg md:text-xl text-uc-gray-400 mb-14 font-light tracking-wide max-w-md"
          >
            Objective metrics for{" "}
            <RotatingWords
              words={[
                "velocity",
                "accuracy",
                "release time",
                "decision speed",
                "every throw",
              ]}
            />
          </motion.p>

          {/* Animated metric tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-14"
          >
            {[
              { label: "MPH", value: 63.4, decimals: 1, suffix: "" },
              { label: "RELEASE", value: 0.35, decimals: 2, suffix: "s" },
              { label: "ACCURACY", value: 93, decimals: 0, suffix: "%" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.1 }}
                className="glass-heavy rounded-xl px-6 py-4 text-center min-w-[100px] border border-white/[0.06] hover:border-uc-cyan/20 transition-colors duration-500"
              >
                <p className="text-2xl md:text-3xl font-black font-mono text-white mb-0.5">
                  <Counter
                    target={metric.value}
                    decimals={metric.decimals}
                    suffix={metric.suffix}
                  />
                </p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-uc-gray-400 font-bold">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/search"
              className="group flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              View Verified QBs
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Get Verified
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-uc-cyan" />
          </div>
        </motion.div>
      </section>

      {/* ═══ SECTION 2 — BROADCAST TICKER ═══ */}
      <div className="border-y border-white/[0.04] bg-uc-panel/50 py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="mx-8 text-xs font-mono font-bold tracking-wider text-uc-gray-400"
            >
              <span className="text-uc-cyan mr-2">■</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 3 — HOW IT WORKS ═══ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Three steps. <span className="gradient-text">Zero guesswork.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-md mx-auto mb-20">
            From raw throws to verified QB identity — built for coaches,
            scouts, and athletes.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative glass rounded-2xl p-8 border border-white/[0.04] hover:border-uc-cyan/20 transition-all duration-500"
              >
                <span className="absolute -top-4 -left-2 text-7xl font-black text-white/[0.03] select-none pointer-events-none">
                  {item.step}
                </span>

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 border border-white/[0.06]`}
                >
                  <item.Icon size={20} className="text-uc-cyan" />
                </div>

                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-uc-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 4 — FEATURED PROSPECT ═══ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Featured Prospect
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tight">
            This is what <span className="gradient-text">verified</span> looks
            like.
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every verified QB gets a cinematic data profile — metrics captured,
            film graded, identity built for coaches.
          </p>

          {/* Editorial athlete card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden relative"
          >
            {/* Large background image — taller for impact */}
            <div className="relative h-72 md:h-96">
              <Image
                src="/images/athlete-action.png"
                alt="Quarterback in action"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-uc-black via-uc-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-uc-black/70 via-transparent to-uc-black/40" />

              {/* Identity overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-5xl md:text-6xl font-black tracking-tight text-white">
                        {featured.name}
                      </h3>
                      <VerifiedBadge size="lg" />
                    </div>
                    <p className="text-sm text-uc-gray-300 mb-2">
                      {featured.school} · Class of {featured.gradYear} ·{" "}
                      {featured.height} · {featured.weight} lbs
                    </p>
                    <StarRating rating={featured.rating} />
                  </div>
                  <div className="hidden md:flex gap-2">
                    {featured.offers.slice(0, 4).map((school) => (
                      <div
                        key={school}
                        className="glass-heavy rounded-lg px-3 py-2"
                      >
                        <span className="text-[10px] font-bold text-white/90">
                          {school}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics below image */}
            <div className="bg-uc-panel p-6 md:p-10 border border-white/[0.04]">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-8">
                <RadialGauge
                  label="Velocity"
                  value={featured.metrics.velocity}
                  maxValue={70}
                  size={110}
                />
                <RadialGauge
                  label="Release"
                  value={(1 - featured.metrics.releaseTime) * 100}
                  maxValue={100}
                  size={110}
                />
                <RadialGauge
                  label="Spin Rate"
                  value={featured.metrics.spinRate}
                  maxValue={800}
                  size={110}
                />
                <RadialGauge
                  label="Mechanics"
                  value={featured.metrics.mechanics}
                  size={110}
                />
                <RadialGauge
                  label="Accuracy"
                  value={featured.metrics.accuracy}
                  size={110}
                />
                <RadialGauge
                  label="Decision"
                  value={featured.metrics.decisionSpeed}
                  size={110}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/athlete/${featured.id}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan/10 border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/20 transition-all"
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

      {/* ═══ SECTION 5 — SOCIAL CARD SHOWCASE ═══ */}
      <RevealSection className="py-32 px-6 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Share Your Signal
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Built for the <span className="gradient-text">modern QB.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-md mx-auto mb-16">
            Generate verified cards. Share everywhere. Let your data speak.
          </p>

          {/* Card fan layout */}
          <div className="flex justify-center items-end gap-4 md:gap-6 max-w-3xl mx-auto mb-12">
            {verifiedAthletes.map((athlete, i) => {
              const rotation = i === 0 ? -6 : i === 2 ? 6 : 0;
              const yOffset = i === 1 ? 0 : 20;
              return (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 60, rotate: rotation }}
                  whileInView={{
                    opacity: 1,
                    y: yOffset,
                    rotate: rotation,
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  whileHover={{ scale: 1.06, rotate: 0, y: -12, zIndex: 10 }}
                  className="glass rounded-2xl p-5 border border-white/10 cursor-pointer transition-all duration-300 hover:border-uc-cyan/30 hover:shadow-[0_0_40px_rgba(0,194,255,0.15)] w-full max-w-[220px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-uc-cyan/30 to-uc-panel flex items-center justify-center border border-white/10">
                        <span className="text-sm font-black text-uc-cyan">
                          {athlete.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">
                          {athlete.name}
                        </p>
                        <p className="text-[8px] text-uc-gray-400">
                          {athlete.school}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 size={14} className="text-uc-cyan" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-white">
                        {athlete.metrics.velocity.toFixed(1)}
                      </p>
                      <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">
                        MPH
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-white">
                        {athlete.metrics.releaseTime.toFixed(2)}
                      </p>
                      <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">
                        REL
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-white">
                        {athlete.metrics.accuracy}%
                      </p>
                      <p className="text-[7px] tracking-wider uppercase text-uc-gray-400 font-bold">
                        ACC
                      </p>
                    </div>
                  </div>

                  {/* Trait sequence tags */}
                  <div className="flex gap-1 justify-center">
                    {["VEL", "ACC", "REL"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[7px] font-mono font-bold text-uc-cyan/60 bg-uc-cyan/5 rounded px-1.5 py-0.5 border border-uc-cyan/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/card-generator"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/10 hover:shadow-[0_0_30px_rgba(0,194,255,0.2)] transition-all"
            >
              <Dna size={16} />
              Generate Your Card
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 6 — FULL-SCREEN CTA ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/qb-69.png"
            alt=""
            fill
            className="object-cover object-center"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-uc-black via-black/70 to-uc-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-uc-black/60 via-transparent to-uc-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.85] tracking-tighter">
            <span className="text-white">Your data.</span>
            <br />
            <span className="gradient-text">Your identity.</span>
          </h2>
          <p className="text-uc-gray-300 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light">
            Stop guessing. Start proving. Get verified and let the metrics
            speak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_50px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              Get Verified
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Browse Prospects
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
