"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VerifiedBadge from "@/components/VerifiedBadge";
import RadialGauge from "@/components/RadialGauge";
import StarRating from "@/components/StarRating";
import {
  ChevronRight,
  ArrowRight,
  Dna,
  CheckCircle2,
  Target,
  Apple,
  Dumbbell,
  BarChart3,
  Eye,
  Users,
  Crosshair,
  Shield,
  UserCheck,
} from "lucide-react";

/* ═══════════════════════════════════════════
   COUNTER — animated number
   ═══════════════════════════════════════════ */
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
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════
   ROTATING WORDS — cycling text
   ═══════════════════════════════════════════ */
function RotatingWords({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="inline-block relative h-[1.2em] overflow-hidden align-bottom min-w-[200px]">
      {words.map((w, i) => (
        <motion.span
          key={w}
          className="absolute left-0 gradient-text whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={
            i === idx
              ? { y: 0, opacity: 1 }
              : i === (idx - 1 + words.length) % words.length
                ? { y: "-100%", opacity: 0 }
                : { y: "100%", opacity: 0 }
          }
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   REVEAL SECTION — scroll reveal wrapper
   ═══════════════════════════════════════════ */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   PIPELINE DATA
   ═══════════════════════════════════════════ */
const pipelineSteps = [
  {
    step: "01",
    label: "Train",
    title: "Mechanics & Arm Strength",
    desc: "D1-level quarterback development with Cole Northrup. Arm slot optimization, footwork progression, pocket presence — built rep by rep.",
    Icon: Target,
    color: "#00C2FF",
    person: "Cole Northrup",
    role: "QB Development",
  },
  {
    step: "02",
    label: "Fuel",
    title: "Sports Nutrition & Body Comp",
    desc: "NFL Combine-level nutrition programming with Jenna Braddock, CSSD. Body composition, hydration protocols, and performance fueling.",
    Icon: Apple,
    color: "#00FF88",
    person: "Jenna Braddock",
    role: "Sports Dietitian",
  },
  {
    step: "03",
    label: "Track",
    title: "Velocity · Spin · Speed · Weight",
    desc: "Every session logged. Throwing velocity, spin rate, 40 time, body weight trend, and training load tracked over time.",
    Icon: BarChart3,
    color: "#A855F7",
    person: "Data Layer",
    role: "Under Center",
  },
  {
    step: "04",
    label: "Evaluate",
    title: "National Recruiting Assessment",
    desc: "Regional and national recruiting directors assess positioning, film grade, and college-level readiness across the country.",
    Icon: Eye,
    color: "#FACC15",
    person: "Brian Herny",
    role: "National Recruiting",
  },
  {
    step: "05",
    label: "Verify",
    title: "Verified Athlete Profile",
    desc: "Under Center publishes verified, objective metrics into a cinematic QB identity — built for coaches and scouts.",
    Icon: CheckCircle2,
    color: "#00C2FF",
    person: "Under Center",
    role: "Verified Index",
  },
  {
    step: "06",
    label: "Recruit",
    title: "Coach Visibility & Exposure",
    desc: "Verified data cards, searchable profiles, and recruiting intelligence — coaches see objective development trajectory.",
    Icon: Users,
    color: "#00FF88",
    person: "Recruiting Team",
    role: "Jared Tucker · Abu Turay",
  },
];

const fourPillars = [
  {
    icon: Dumbbell,
    title: "Development System",
    desc: "Lifting, speed, mechanics, and arm strength — a structured physical foundation built by coaches.",
    href: "/training",
    gradient: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: Crosshair,
    title: "Verified Measurement",
    desc: "Wilson QBX, radar tracking, GAI scoring — every throw captured with objective data.",
    href: "/search",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Athlete Profile",
    desc: "Cinematic verified QB identity with metrics, film, offers, and development timeline.",
    href: "/profile/1",
    gradient: "from-purple-500/20 to-violet-500/10",
  },
  {
    icon: UserCheck,
    title: "Recruiting Visibility",
    desc: "Searchable profiles, verified cards, and direct recruiting intelligence for college coaches.",
    href: "/system",
    gradient: "from-yellow-500/20 to-orange-500/10",
  },
];

const featured = {
  id: "6",
  name: "Andre Mitchell",
  school: "IMG Academy",
  gradYear: 2026,
  height: '6\'5"',
  weight: 225,
  rating: 5.0,
  metrics: {
    velocity: 63.4,
    releaseTime: 0.35,
    spinRate: 710,
    mechanics: 95,
    accuracy: 93,
    decisionSpeed: 91,
  },
  offers: [
    "Alabama",
    "Georgia",
    "Ohio State",
    "Clemson",
    "Texas",
    "USC",
    "Oregon",
    "Notre Dame",
  ],
};

const verifiedAthletes = [
  {
    id: "1",
    name: "Jaxon Smith",
    school: "Westlake HS",
    metrics: { velocity: 61.8, releaseTime: 0.38, accuracy: 88 },
  },
  {
    id: "4",
    name: "Dylan Park",
    school: "Arch. Moeller",
    metrics: { velocity: 60.1, releaseTime: 0.36, accuracy: 91 },
  },
  {
    id: "5",
    name: "Kai Nakamura",
    school: "Saint Louis",
    metrics: { velocity: 56.5, releaseTime: 0.42, accuracy: 86 },
  },
];

const marqueeItems = [
  "VEL 63.4 MPH",
  "RELEASE 0.35s",
  "ACCURACY 93%",
  "SPIN 710 RPM",
  "MECHANICS 95",
  "DECISION 91",
  "FOOTWORK 90",
  "POISE 93",
  "VISION 89",
  "CLUTCH 94",
];

/* ═══════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-uc-black text-white overflow-hidden">
      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/qb.png"
            alt="Quarterback under center"
            fill
            className="object-cover object-top opacity-30"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-uc-black via-black/50 to-uc-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-uc-black/70 via-transparent to-uc-black/70" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-8"
          >
            <Dna size={12} />
            Quarterback Development Infrastructure
          </motion.div>

          {/* Stacked headline */}
          <div className="mb-6">
            {["TRAIN.", "MEASURE.", "VERIFY."].map((word, i) => (
              <motion.h1
                key={word}
                initial={{ opacity: 0, x: -60, skewX: -4 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                transition={{
                  delay: 0.5 + i * 0.15,
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white"
              >
                {word}
              </motion.h1>
            ))}
            <motion.h1
              initial={{ opacity: 0, x: -60, skewX: -4 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{
                delay: 0.95,
                type: "spring",
                stiffness: 80,
                damping: 20,
              }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] gradient-text"
            >
              GET RECRUITED.
            </motion.h1>
          </div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm md:text-base text-uc-gray-400 max-w-xl mx-auto mb-6 leading-relaxed"
          >
            The only system that connects{" "}
            <RotatingWords
              words={[
                "arm strength",
                "nutrition",
                "film grade",
                "recruiting",
                "verified data",
              ]}
            />{" "}
            to a verified quarterback identity.
          </motion.p>

          {/* Pipeline mini-strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap"
          >
            {pipelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: step.color + "15" }}
                  >
                    <step.Icon size={13} style={{ color: step.color }} />
                  </div>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-uc-gray-400 hidden sm:inline">
                    {step.label}
                  </span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <ChevronRight size={10} className="text-white/10 shrink-0" />
                )}
              </div>
            ))}
          </motion.div>

          {/* Metric tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex justify-center gap-3 md:gap-6 mb-10 flex-wrap"
          >
            {[
              { value: 63.4, dec: 1, suffix: "", label: "MPH" },
              { value: 0.35, dec: 2, suffix: "s", label: "RELEASE" },
              { value: 93, dec: 0, suffix: "%", label: "ACCURACY" },
              { value: 710, dec: 0, suffix: "", label: "RPM" },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ scale: 1.08, y: -3 }}
                className="glass rounded-xl px-5 py-3 border border-white/[0.06] cursor-default"
              >
                <p className="text-xl md:text-2xl font-black font-mono text-white">
                  <Counter
                    target={metric.value}
                    decimals={metric.dec}
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/system"
              className="group flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              See The System
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
              <span className="text-uc-cyan mr-2">&#9632;</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 3 — THE FOUR PILLARS ═══ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            The Infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            One system. <span className="gradient-text">Four pillars.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-20">
            Under Center isn&apos;t a training company. It&apos;s measurable quarterback
            development infrastructure — from the weight room to the recruiting
            board.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {fourPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  href={pillar.href}
                  className="group block glass rounded-2xl p-7 border border-white/[0.04] hover:border-uc-cyan/20 transition-all duration-500 h-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-5 border border-white/[0.06]`}
                  >
                    <pillar.icon size={20} className="text-uc-cyan" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight group-hover:text-uc-cyan transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 4 — DEVELOPMENT PIPELINE ═══ */}
      <RevealSection className="py-32 px-6 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            The Pipeline
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            From first rep to{" "}
            <span className="gradient-text">first offer.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every quarterback enters a structured pipeline. Each stage has a
            person, a purpose, and a measurable output.
          </p>

          <div className="space-y-4">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group glass rounded-xl p-5 md:p-6 border border-white/[0.04] hover:border-white/10 transition-all flex items-start gap-5"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: step.color + "12" }}
                >
                  <step.Icon size={20} style={{ color: step.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-[9px] font-black tracking-[0.3em] uppercase"
                      style={{ color: step.color }}
                    >
                      {step.step} — {step.label}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="hidden md:flex flex-col items-end shrink-0">
                  <span className="text-[10px] font-bold text-white/80">
                    {step.person}
                  </span>
                  <span className="text-[8px] text-uc-gray-500">
                    {step.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/system"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan/10 border border-uc-cyan/20 text-uc-cyan font-bold text-sm tracking-wider uppercase hover:bg-uc-cyan/20 transition-all"
            >
              Full System Breakdown <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 5 — FEATURED PROSPECT ═══ */}
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
            Every QB in the system gets a verified data profile — metrics
            captured, development tracked, identity built for coaches.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden relative"
          >
            <div className="relative h-72 md:h-96">
              <Image
                src="/images/athlete-action.png"
                alt="Quarterback in action"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-uc-black via-uc-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-uc-black/70 via-transparent to-uc-black/40" />

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
                      {featured.school} &middot; Class of {featured.gradYear} &middot;{" "}
                      {featured.height} &middot; {featured.weight} lbs
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

      {/* ═══ SECTION 6 — VERIFIED CARDS ═══ */}
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

      {/* ═══ SECTION 7 — TEAM PREVIEW ═══ */}
      <RevealSection className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            The Team
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Built by people who{" "}
            <span className="gradient-text">played the position.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every stage of the pipeline is run by someone with direct experience
            developing and placing quarterbacks.
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Cole Northrup",
                role: "QB Development",
                detail: "D1 QB · Lafayette & William & Mary",
                color: "#00C2FF",
              },
              {
                name: "Jenna Braddock",
                role: "Sports Nutrition",
                detail: "MSH, RDN, CSSD · NFL Combine Prep",
                color: "#00FF88",
              },
              {
                name: "Brian Herny",
                role: "National Recruiting",
                detail: "10+ Years · Jacksonville University",
                color: "#FACC15",
              },
              {
                name: "Jared Tucker",
                role: "Midwest Recruiting",
                detail: "Wake Forest · Auburn · Liberty",
                color: "#A855F7",
              },
              {
                name: "Abu Turay",
                role: "Northeast Recruiting",
                detail: "Georgia Tech · Northwestern",
                color: "#FF6B6B",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass rounded-xl p-5 border border-white/[0.04] hover:border-white/10 transition-all text-center"
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: member.color + "15" }}
                >
                  <span
                    className="text-lg font-black"
                    style={{ color: member.color }}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-0.5">{member.name}</h4>
                <p
                  className="text-[9px] font-bold tracking-wider uppercase mb-2"
                  style={{ color: member.color }}
                >
                  {member.role}
                </p>
                <p className="text-[9px] text-uc-gray-500">{member.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-uc-gray-400 hover:text-uc-cyan transition-colors"
            >
              Meet The Full Team <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* ═══ SECTION 8 — FULL-SCREEN CTA ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
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
            <span className="text-white">Your development.</span>
            <br />
            <span className="gradient-text">Your proof.</span>
          </h2>
          <p className="text-uc-gray-300 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light">
            Stop guessing. Start proving. Enter the system and let the data
            speak for you.
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
              href="/system"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              See The System
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
