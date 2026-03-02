"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Target,
  Apple,
  BarChart3,
  Eye,
  CheckCircle2,
  Users,
  Dna,
  ChevronRight,
  Dumbbell,
  Crosshair,
  Shield,
  UserCheck,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";

/* ═══ Reveal wrapper ═══ */
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

/* ═══ Pipeline data ═══ */
const pipeline = [
  {
    step: "01",
    label: "TRAIN",
    title: "Mechanics & Arm Strength",
    person: "Cole Northrup",
    credential: "D1 Quarterback — Lafayette College & William & Mary",
    Icon: Target,
    color: "#00C2FF",
    description:
      "Cole designs every training session around measurable mechanical improvement. Arm slot optimization, footwork progression, pocket presence, throwing on the move — built rep by rep with the same structure used at the D1 level.",
    outputs: [
      "Throwing mechanics baseline & progression",
      "Footwork pattern development",
      "Pocket movement and platform drills",
      "Long toss & velocity-building protocols",
      "Film-integrated mechanical review",
    ],
  },
  {
    step: "02",
    label: "FUEL",
    title: "Sports Nutrition & Body Composition",
    person: "Jenna Braddock",
    credential: "MSH, RDN, CSSD — NFL Combine Prep Dietitian",
    Icon: Apple,
    color: "#00FF88",
    description:
      "Jenna builds nutrition protocols for athletes preparing for the next level. Body composition monitoring, hydration strategy, performance fueling, and recovery nutrition — the same programming used to prep quarterbacks for the NFL Combine.",
    outputs: [
      "Body composition tracking & targets",
      "Game-day and practice fueling plans",
      "Hydration and recovery protocols",
      "Weight management for growth athletes",
      "Supplement guidance & compliance",
    ],
  },
  {
    step: "03",
    label: "TRACK",
    title: "Performance Data Layer",
    person: "Under Center Platform",
    credential: "Wilson QBX · Radar · GAI Scoring Engine",
    Icon: BarChart3,
    color: "#A855F7",
    description:
      "Every training session generates data. Throwing velocity, spin rate, release time, 40 time, body weight, training load — all logged into the Under Center data layer with historical trend tracking.",
    outputs: [
      "Velocity trend over time (mph)",
      "Spin rate tracking (rpm)",
      "Release time measurement (seconds)",
      "Body weight & composition trend",
      "Training load and session volume",
    ],
  },
  {
    step: "04",
    label: "EVALUATE",
    title: "National Recruiting Assessment",
    person: "Brian Herny",
    credential: "Head of National Recruiting — 10+ Years, Jacksonville University",
    Icon: Eye,
    color: "#FACC15",
    description:
      "Brian leads the recruiting evaluation layer. Film grading, positional ranking assessment, college-level readiness signals, and national/regional positioning — connecting physical development to recruiting trajectory.",
    outputs: [
      "Film grade and positional assessment",
      "National and regional ranking analysis",
      "College-level readiness evaluation",
      "Target school list development",
      "Recruiting timeline and calendar",
    ],
  },
  {
    step: "05",
    label: "VERIFY",
    title: "Verified Athlete Profile",
    person: "Under Center",
    credential: "The Verified Quarterback Index",
    Icon: CheckCircle2,
    color: "#00C2FF",
    description:
      "Under Center publishes verified, objective metrics into a cinematic QB identity. Every data point is tracked, timestamped, and presented in a format built for college coaches and recruiting coordinators.",
    outputs: [
      "Verified metric profile with badges",
      "Cinematic social cards & graphics",
      "Development timeline visualization",
      "Searchable index for college coaches",
      "Shareable verified athlete card",
    ],
  },
  {
    step: "06",
    label: "RECRUIT",
    title: "Coach Visibility & Exposure",
    person: "Jared Tucker & Abu Turay",
    credential: "Midwest & Northeast Recruiting Directors",
    Icon: Users,
    color: "#00FF88",
    description:
      "Regional recruiting directors maintain relationships with college programs across the country. Jared covers the Midwest (Wake Forest, Auburn, Coastal Carolina, Liberty) and Abu covers the Northeast (Georgia Tech, Northwestern, Coastal Carolina).",
    outputs: [
      "Direct college coaching relationships",
      "Regional camp and showcase placement",
      "Verified data distribution to programs",
      "Recruiting board positioning",
      "Offer tracking and communication support",
    ],
  },
];

const pillars = [
  {
    icon: Dumbbell,
    title: "Development System",
    desc: "Lifting, speed, mechanics, arm strength — physical foundation built by D1 coaches with structured programming.",
    color: "#00C2FF",
    metrics: ["Velocity", "Release Time", "Footwork Score", "Arm Strength"],
  },
  {
    icon: Crosshair,
    title: "Verified Measurement",
    desc: "Wilson QBX, radar, GAI engine — every throw captured with objective, timestamped data.",
    color: "#00FF88",
    metrics: ["Spin Rate", "Velocity Trend", "Accuracy %", "Session Load"],
  },
  {
    icon: Shield,
    title: "Athlete Profile",
    desc: "Cinematic verified identity with metrics, film, offers, development timeline, and team integration.",
    color: "#A855F7",
    metrics: ["Verified Badge", "Film Grade", "Offer Count", "GAI Score"],
  },
  {
    icon: UserCheck,
    title: "Recruiting Intelligence",
    desc: "Searchable profiles, social cards, direct coach relationships, and regional recruiting coverage.",
    color: "#FACC15",
    metrics: ["Profile Views", "Card Shares", "Coach Reach", "Board Position"],
  },
];

/* ═══ System Page ═══ */
export default function SystemPage() {
  return (
    <main className="min-h-screen bg-uc-black text-white pt-24 pb-20 overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6"
          >
            <Dna size={12} />
            The System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
          >
            Quarterback development
            <br />
            <span className="gradient-text">as infrastructure.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-uc-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Under Center connects physical training, nutrition, data tracking,
            recruiting evaluation, and verified profiles into a single
            measurable pipeline. Every stage has a person, a purpose, and a
            measurable output.
          </motion.p>

          {/* Pipeline strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 md:gap-5 flex-wrap"
          >
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 md:gap-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: step.color + "15" }}
                  >
                    <step.Icon size={16} style={{ color: step.color }} />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p
                      className="text-[8px] font-black tracking-[0.3em] uppercase"
                      style={{ color: step.color }}
                    >
                      {step.label}
                    </p>
                    <p className="text-[9px] text-uc-gray-500">
                      {step.person.split(" &")[0]}
                    </p>
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <ChevronRight size={12} className="text-white/10 shrink-0" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FOUR PILLARS ═══ */}
      <RevealSection className="py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 tracking-tight">
            Four pillars. <span className="gradient-text">One system.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-7 border border-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: pillar.color + "15" }}
                  >
                    <pillar.icon size={20} style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{pillar.title}</h3>
                    <p className="text-xs text-uc-gray-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pillar.metrics.map((m) => (
                    <span
                      key={m}
                      className="text-[8px] font-mono font-bold px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06]"
                      style={{ color: pillar.color }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ FULL PIPELINE BREAKDOWN ═══ */}
      <RevealSection className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            The Pipeline
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Six stages. <span className="gradient-text">One trajectory.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            Every quarterback who enters the system moves through the same
            structured pipeline — from first training session to verified
            recruiting exposure.
          </p>

          <div className="space-y-6">
            {pipeline.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.6 }}
                className="glass rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/10 transition-all"
              >
                {/* Color bar */}
                <div
                  className="h-1"
                  style={{ backgroundColor: step.color }}
                />

                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    {/* Step icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                      style={{ backgroundColor: step.color + "12" }}
                    >
                      <step.Icon size={24} style={{ color: step.color }} />
                    </div>

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span
                            className="text-[9px] font-black tracking-[0.4em] uppercase"
                            style={{ color: step.color }}
                          >
                            {step.step} — {step.label}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Person */}
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center border border-white/10"
                          style={{ backgroundColor: step.color + "20" }}
                        >
                          <span
                            className="text-[9px] font-black"
                            style={{ color: step.color }}
                          >
                            {step.person
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white/80">
                            {step.person}
                          </span>
                          <span className="text-[9px] text-uc-gray-500 ml-2">
                            {step.credential}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-uc-gray-400 leading-relaxed mb-5">
                        {step.description}
                      </p>

                      {/* Outputs */}
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-uc-gray-500 font-bold mb-2">
                          Measurable Outputs
                        </p>
                        <div className="grid sm:grid-cols-2 gap-1.5">
                          {step.outputs.map((output) => (
                            <div
                              key={output}
                              className="flex items-center gap-2 text-xs text-uc-gray-300"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: step.color }}
                              />
                              {output}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ WHAT THIS ISN'T ═══ */}
      <RevealSection className="py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">
            What this <span className="gradient-text">isn&apos;t.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                wrong: "A QB training company",
                right:
                  "A measurable development infrastructure that connects training to verified output",
              },
              {
                wrong: "A recruiting service",
                right:
                  "A data layer that gives coaches objective, verified metrics instead of hype",
              },
              {
                wrong: "A highlight video editor",
                right:
                  "A cinematic profile builder backed by real tracked performance data",
              },
              {
                wrong: "A combine testing event",
                right:
                  "A continuous tracking system that shows development trajectory over time",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-6 border border-white/[0.04]"
              >
                <p className="text-sm text-red-400/70 line-through mb-2">
                  {item.wrong}
                </p>
                <p className="text-sm text-uc-gray-300 font-medium">
                  {item.right}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ CTA ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            Enter the system.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-uc-gray-400 text-base mb-10 max-w-md mx-auto"
          >
            Development is measurable. Recruiting is objective. Your data is
            your identity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_50px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              Get Verified
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Meet The Team
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
