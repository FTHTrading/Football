"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Dna,
  ChevronRight,
  Target,
  Apple,
  BarChart3,
  Eye,
  Users,
  MapPin,
  GraduationCap,
  Trophy,
  Briefcase,
  CheckCircle2,
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

/* ═══ Team data ═══ */
const team = [
  {
    name: "Cole Northrup",
    title: "Founder & QB Development Architect",
    pipelineRole: "Train",
    pipelineStep: "01",
    color: "#00C2FF",
    Icon: Target,
    photo: null,
    bio: "Cole built QBDNA from the ground up — combining his D1 quarterback experience with a systems-level approach to development. Every training protocol, every metric framework, and every pipeline stage was designed to answer one question: how do you objectively prove a quarterback is getting better?",
    background: [
      "Division I Quarterback — Lafayette College",
      "Division I Quarterback — William & Mary",
      "Founder, QBDNA & Under Center",
    ],
    philosophy:
      "Development without measurement is just practice. Measurement without context is just numbers. The system connects both — so every rep has a purpose and every data point tells a story.",
    responsibilities: [
      "Quarterback mechanics and arm development",
      "Training program architecture",
      "Pipeline design and system integration",
      "Platform vision and athlete experience",
    ],
  },
  {
    name: "Jenna Braddock",
    title: "Director of Sports Nutrition",
    pipelineRole: "Fuel",
    pipelineStep: "02",
    color: "#00FF88",
    Icon: Apple,
    photo: null,
    bio: "Jenna brings NFL Combine-level nutrition programming to developing quarterbacks. As a board-certified sports dietitian (CSSD), she has designed fueling protocols for athletes preparing for the highest levels of professional football — including Caleb Williams' Combine preparation.",
    background: [
      "MSH, RDN, CSSD — Board Certified Sports Dietitian",
      "NFL Combine Nutrition Prep (Caleb Williams)",
      "Sports Performance Nutrition Specialist",
    ],
    philosophy:
      "Body composition isn't vanity — it's infrastructure. A quarterback who fuels correctly throws harder, recovers faster, and develops more consistently. Nutrition is the invisible multiplier in the development pipeline.",
    responsibilities: [
      "Body composition monitoring and targets",
      "Performance fueling and hydration protocols",
      "Recovery nutrition programming",
      "Weight management for growth-phase athletes",
    ],
  },
  {
    name: "Brian Herny",
    title: "Head of National Recruiting",
    pipelineRole: "Evaluate",
    pipelineStep: "04",
    color: "#FACC15",
    Icon: Eye,
    photo: null,
    bio: "Brian leads the recruiting evaluation layer with over a decade of experience in college recruiting. His background at Jacksonville University and across the recruiting landscape gives him the network and pattern recognition to accurately assess where a quarterback fits at the next level.",
    background: [
      "10+ Years in College Recruiting",
      "Jacksonville University — Recruiting Staff",
      "National Recruiting Network",
    ],
    philosophy:
      "Recruiting isn't about hype — it's about fit. The right data, presented to the right coaches, at the right time. That's what turns a prospect into a recruit.",
    responsibilities: [
      "National recruiting assessment and positioning",
      "Film grading and college-readiness evaluation",
      "Target school list development",
      "Recruiting timeline and calendar management",
    ],
  },
  {
    name: "Jared Tucker",
    title: "Midwest Recruiting Director",
    pipelineRole: "Recruit",
    pipelineStep: "06",
    color: "#A855F7",
    Icon: Users,
    photo: null,
    bio: "Jared covers the Midwest recruiting territory with deep relationships across major conference programs. His coaching and recruiting experience spans Wake Forest, Auburn, Coastal Carolina, and Liberty — giving him direct access to decision-makers at every level.",
    background: [
      "Wake Forest — Recruiting",
      "Auburn — Recruiting",
      "Coastal Carolina — Coaching Staff",
      "Liberty — Coaching Staff",
    ],
    philosophy:
      "Every program has a need. Every quarterback has a ceiling. My job is matching verified development data to the right opportunity — not selling, but showing.",
    responsibilities: [
      "Midwest territory recruiting relationships",
      "Direct coach communication and data sharing",
      "Camp and showcase placement",
      "Regional recruiting board intelligence",
    ],
  },
  {
    name: "Abu Turay",
    title: "Northeast Recruiting Director",
    pipelineRole: "Recruit",
    pipelineStep: "06",
    color: "#FF6B6B",
    Icon: Users,
    photo: null,
    bio: "Abu covers the Northeast recruiting territory with connections across Power Five and Group of Five programs. His experience at Georgia Tech, Northwestern, and Coastal Carolina gives him unique insight into what coaching staffs are looking for at every competitive level.",
    background: [
      "Georgia Tech — Recruiting Staff",
      "Northwestern — Recruiting Staff",
      "Coastal Carolina — Coaching Staff",
    ],
    philosophy:
      "The northeast is undervalued quarterback territory. When you combine verified data with the right exposure, coaches see what they've been missing.",
    responsibilities: [
      "Northeast territory recruiting relationships",
      "Program-specific quarterback need analysis",
      "Verified profile distribution to coaches",
      "Offer tracking and communication support",
    ],
  },
];

/* ═══ Team Page ═══ */
export default function TeamPage() {
  const [expanded, setExpanded] = useState<string | null>(team[0].name);

  return (
    <main className="min-h-screen bg-uc-black text-white pt-24 pb-20 overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6"
          >
            <Users size={12} />
            The Team
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
          >
            People who built
            <br />
            <span className="gradient-text">the system.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-uc-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Every stage of the pipeline is run by someone with direct
            experience developing and placing quarterbacks. Not advisors.
            Not consultants. Operators.
          </motion.p>
        </div>
      </section>

      {/* ═══ PIPELINE POSITION MAP ═══ */}
      <RevealSection className="py-12 px-6 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {[
              { step: "01", label: "Train", color: "#00C2FF", person: "Cole" },
              { step: "02", label: "Fuel", color: "#00FF88", person: "Jenna" },
              { step: "03", label: "Track", color: "#A855F7", person: "Platform" },
              { step: "04", label: "Evaluate", color: "#FACC15", person: "Brian" },
              { step: "05", label: "Verify", color: "#00C2FF", person: "UC" },
              { step: "06", label: "Recruit", color: "#00FF88", person: "Jared · Abu" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 md:gap-4">
                <div className="text-center">
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-1 flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: s.color + "15" }}
                  >
                    <span
                      className="text-[9px] font-black"
                      style={{ color: s.color }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <p
                    className="text-[8px] font-bold tracking-wider uppercase"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </p>
                  <p className="text-[8px] text-uc-gray-500">{s.person}</p>
                </div>
                {i < 5 && (
                  <ChevronRight size={10} className="text-white/10 shrink-0 mt-[-12px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ TEAM PROFILES ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {team.map((member, i) => {
            const isOpen = expanded === member.name;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="glass rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/10 transition-all"
              >
                {/* Color bar */}
                <div className="h-1" style={{ backgroundColor: member.color }} />

                {/* Header — always visible */}
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : member.name)
                  }
                  className="w-full p-6 md:p-8 flex items-center gap-5 text-left hover:bg-white/[0.01] transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: member.color + "15" }}
                  >
                    <span
                      className="text-xl font-black"
                      style={{ color: member.color }}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight">
                        {member.name}
                      </h3>
                      <span
                        className="text-[8px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: member.color + "15",
                          color: member.color,
                        }}
                      >
                        {member.pipelineRole}
                      </span>
                    </div>
                    <p className="text-xs text-uc-gray-400">{member.title}</p>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`text-uc-gray-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8 space-y-6">
                      {/* Bio */}
                      <p className="text-sm text-uc-gray-300 leading-relaxed">
                        {member.bio}
                      </p>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Background */}
                        <div>
                          <p className="text-[8px] tracking-[0.3em] uppercase text-uc-gray-500 font-bold mb-3 flex items-center gap-2">
                            <GraduationCap size={10} /> Background
                          </p>
                          <div className="space-y-2">
                            {member.background.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 text-xs text-uc-gray-300"
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: member.color }}
                                />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <p className="text-[8px] tracking-[0.3em] uppercase text-uc-gray-500 font-bold mb-3 flex items-center gap-2">
                            <Briefcase size={10} /> Pipeline Responsibilities
                          </p>
                          <div className="space-y-2">
                            {member.responsibilities.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 text-xs text-uc-gray-300"
                              >
                                <CheckCircle2
                                  size={10}
                                  style={{ color: member.color }}
                                  className="shrink-0"
                                />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Philosophy quote */}
                      <div
                        className="rounded-xl p-5 border-l-2"
                        style={{
                          borderColor: member.color,
                          backgroundColor: member.color + "08",
                        }}
                      >
                        <p className="text-xs text-uc-gray-300 italic leading-relaxed">
                          &ldquo;{member.philosophy}&rdquo;
                        </p>
                        <p
                          className="text-[9px] font-bold mt-2"
                          style={{ color: member.color }}
                        >
                          — {member.name}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <RevealSection className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            The system is the{" "}
            <span className="gradient-text">differentiator.</span>
          </h2>
          <p className="text-sm text-uc-gray-400 max-w-md mx-auto mb-10">
            When training, nutrition, data, and recruiting are connected by
            people who&apos;ve been in the position — the output changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/system"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              See The System
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Get Verified
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
