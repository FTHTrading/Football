"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Dna,
  ChevronRight,
  ChevronDown,
  Target,
  Apple,
  Dumbbell,
  BarChart3,
  Heart,
  Zap,
  Activity,
  Shield,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Circle,
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

/* ═══ Types ═══ */
import type { LucideIcon } from "lucide-react";

interface Drill {
  name: string;
  sets: string;
  focus: string;
  icon: LucideIcon;
  color: string;
}

interface TrainingDay {
  day: string;
  label: string;
  focus: string;
  duration: string;
  intensity: "low" | "medium" | "high";
  drills: Drill[];
}

/* ═══ Four development cores ═══ */
const cores = [
  {
    id: "field",
    label: "Field Work",
    title: "Mechanics & Throwing",
    Icon: Target,
    color: "#00C2FF",
    desc: "Arm slot, footwork, pocket movement, and throwing mechanics. Every session tracked with velocity and accuracy data.",
    coach: "Cole Northrup",
    metrics: ["Velocity (mph)", "Release Time", "Accuracy %", "Spin Rate"],
    schedule: [
      {
        day: "MON",
        label: "Power Foundation",
        focus: "Hip-to-shoulder separation + arm strength",
        duration: "75 min",
        intensity: "high" as const,
        drills: [
          { name: "Weighted Rotational Throws", sets: "4×8", focus: "Hip-to-shoulder separation", icon: Zap, color: "#00C2FF" },
          { name: "Med Ball Scoop Toss", sets: "3×10", focus: "Ground-up force chain", icon: Activity, color: "#A855F7" },
          { name: "Long Toss Progression", sets: "20 min", focus: "Build arm strength gradually", icon: Target, color: "#00FF88" },
          { name: "Radar Gun Session", sets: "15 throws", focus: "Max velocity tracking", icon: BarChart3, color: "#FACC15" },
        ],
      },
      {
        day: "WED",
        label: "Release Mechanics",
        focus: "Arm slot + wrist snap optimization",
        duration: "60 min",
        intensity: "medium" as const,
        drills: [
          { name: "Wrist Flick Drills", sets: "3×15", focus: "Snap speed at final release", icon: Zap, color: "#00C2FF" },
          { name: "1-Knee Throws", sets: "3×10", focus: "Isolate upper body mechanics", icon: Target, color: "#00FF88" },
          { name: "Spin Rate Focused Throws", sets: "15 min", focus: "Tight spirals at max effort", icon: Activity, color: "#A855F7" },
        ],
      },
      {
        day: "FRI",
        label: "Live Reps",
        focus: "Full-speed throwing with data capture",
        duration: "70 min",
        intensity: "high" as const,
        drills: [
          { name: "Out Routes at Distance", sets: "3×8", focus: "Power on sideline throws", icon: Target, color: "#00FF88" },
          { name: "Deep Ball Series", sets: "3×6", focus: "45+ yard accuracy at velocity", icon: Activity, color: "#A855F7" },
          { name: "7-on-7 Simulation", sets: "30 min", focus: "Velocity under pressure", icon: Zap, color: "#00C2FF" },
          { name: "Session Data Review", sets: "10 min", focus: "Compare to baseline metrics", icon: Eye, color: "#FACC15" },
        ],
      },
    ],
  },
  {
    id: "weights",
    label: "Strength & Power",
    title: "Lifting & Speed",
    Icon: Dumbbell,
    color: "#A855F7",
    desc: "Structured strength programming designed for quarterback-specific power. Lower body explosiveness, rotational strength, and speed development.",
    coach: "Strength Staff",
    metrics: ["Squat Max", "40 Time", "Vertical Jump", "Rotational Power"],
    schedule: [
      {
        day: "MON",
        label: "Lower Body Power",
        focus: "Squat, deadlift, and explosive movement",
        duration: "60 min",
        intensity: "high" as const,
        drills: [
          { name: "Back Squat", sets: "5×5", focus: "Foundation lower body strength", icon: Dumbbell, color: "#A855F7" },
          { name: "Box Jumps", sets: "4×6", focus: "Explosive hip extension", icon: Zap, color: "#00C2FF" },
          { name: "Lateral Bounds", sets: "3×8", focus: "Lateral power for pocket movement", icon: Activity, color: "#00FF88" },
        ],
      },
      {
        day: "WED",
        label: "Upper Body + Core",
        focus: "Pressing, pulling, and rotational core",
        duration: "55 min",
        intensity: "medium" as const,
        drills: [
          { name: "Bench Press", sets: "4×6", focus: "Upper body pressing strength", icon: Dumbbell, color: "#A855F7" },
          { name: "Cable Rotations", sets: "3×12", focus: "Rotational core power", icon: Activity, color: "#00C2FF" },
          { name: "Pull-ups", sets: "4×8", focus: "Posterior chain balance", icon: Shield, color: "#FACC15" },
        ],
      },
      {
        day: "FRI",
        label: "Speed & Agility",
        focus: "Sprint work, agility, and footwork speed",
        duration: "45 min",
        intensity: "high" as const,
        drills: [
          { name: "10-Yard Sprints", sets: "8×1", focus: "First-step explosion", icon: Zap, color: "#00C2FF" },
          { name: "Pro Agility Shuttle", sets: "4×1", focus: "Change of direction speed", icon: Activity, color: "#00FF88" },
          { name: "Ladder Drills", sets: "3 sets", focus: "Foot speed and coordination", icon: Target, color: "#A855F7" },
        ],
      },
    ],
  },
  {
    id: "nutrition",
    label: "Nutrition",
    title: "Fueling & Body Comp",
    Icon: Apple,
    color: "#00FF88",
    desc: "NFL Combine-level nutrition protocols. Body composition tracking, performance fueling, hydration, and recovery nutrition — built by Jenna Braddock, CSSD.",
    coach: "Jenna Braddock, CSSD",
    metrics: ["Body Weight", "Body Fat %", "Hydration", "Caloric Intake"],
    schedule: [
      {
        day: "DAILY",
        label: "Fueling Protocol",
        focus: "Pre/post training nutrition + daily intake",
        duration: "Ongoing",
        intensity: "medium" as const,
        drills: [
          { name: "Pre-Training Fuel", sets: "1 meal", focus: "Carb + protein 90 min before", icon: Apple, color: "#00FF88" },
          { name: "Post-Training Recovery", sets: "30 min window", focus: "Protein + carbs for recovery", icon: Heart, color: "#FF6B6B" },
          { name: "Hydration Tracking", sets: "Daily", focus: "Bodyweight-based fluid intake", icon: Activity, color: "#00C2FF" },
        ],
      },
      {
        day: "WEEKLY",
        label: "Body Comp Check",
        focus: "Weight and composition monitoring",
        duration: "15 min",
        intensity: "low" as const,
        drills: [
          { name: "Weigh-In", sets: "AM fasted", focus: "Track weight trend over time", icon: BarChart3, color: "#FACC15" },
          { name: "Body Comp Assessment", sets: "Monthly", focus: "Lean mass vs body fat ratio", icon: TrendingUp, color: "#A855F7" },
        ],
      },
    ],
  },
  {
    id: "recovery",
    label: "Recovery",
    title: "Rest & Restoration",
    Icon: Heart,
    color: "#FF6B6B",
    desc: "Active recovery, arm care, mobility work, and film study. Recovery isn't passive — it's the session where adaptation happens.",
    coach: "Integrated Staff",
    metrics: ["Sleep Quality", "Readiness Score", "Soreness Level", "Arm Health"],
    schedule: [
      {
        day: "TUE",
        label: "Active Recovery",
        focus: "Mobility, arm care, and light movement",
        duration: "40 min",
        intensity: "low" as const,
        drills: [
          { name: "J-Band Arm Care", sets: "15 min", focus: "Shoulder stability and health", icon: Shield, color: "#FACC15" },
          { name: "Hip Mobility Sequence", sets: "10 min", focus: "Hip flexor and glute activation", icon: Activity, color: "#A855F7" },
          { name: "Foam Rolling", sets: "10 min", focus: "Soft tissue recovery", icon: Heart, color: "#FF6B6B" },
        ],
      },
      {
        day: "THU",
        label: "Film + Mental Reps",
        focus: "Game film study and visualization",
        duration: "45 min",
        intensity: "low" as const,
        drills: [
          { name: "Film Study", sets: "25 min", focus: "Breakdown mechanics from game film", icon: Eye, color: "#00FF88" },
          { name: "Visualization Session", sets: "10 min", focus: "Mental reps on target throws", icon: Target, color: "#00C2FF" },
          { name: "Self-Assessment Log", sets: "10 min", focus: "Rate readiness, soreness, energy", icon: BarChart3, color: "#FACC15" },
        ],
      },
      {
        day: "SUN",
        label: "Full Rest",
        focus: "Complete physical and mental rest",
        duration: "Full day",
        intensity: "low" as const,
        drills: [
          { name: "Sleep Optimization", sets: "8+ hours", focus: "Quality sleep for adaptation", icon: Heart, color: "#FF6B6B" },
          { name: "Light Walk", sets: "20 min", focus: "Blood flow without load", icon: Activity, color: "#00FF88" },
        ],
      },
    ],
  },
];

/* ═══ Day Card Component ═══ */
function DayCard({ day, index }: { day: TrainingDay; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const intensityColors = { low: "#00FF88", medium: "#FACC15", high: "#FF3B5C" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-uc-surface border border-white/10 flex items-center justify-center text-xs font-black text-uc-cyan">
          {day.day}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold">{day.label}</h4>
          <p className="text-[9px] text-uc-gray-500">{day.focus}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[8px] text-uc-gray-500 flex items-center gap-1">
            <Clock size={8} /> {day.duration}
          </span>
          <span
            className="text-[7px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{
              backgroundColor: intensityColors[day.intensity] + "15",
              color: intensityColors[day.intensity],
            }}
          >
            {day.intensity}
          </span>
          {open ? (
            <ChevronDown size={14} className="text-uc-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-uc-gray-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {day.drills.map((drill, di) => (
                <div
                  key={di}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <Circle size={12} className="text-uc-gray-600 shrink-0" />
                  <drill.icon
                    size={12}
                    style={{ color: drill.color }}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{drill.name}</p>
                    <p className="text-[8px] text-uc-gray-500">{drill.focus}</p>
                  </div>
                  <span className="text-[9px] font-mono text-uc-gray-400 shrink-0">
                    {drill.sets}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══ Training Page ═══ */
export default function TrainingPage() {
  const [activeCore, setActiveCore] = useState(cores[0].id);
  const selected = cores.find((c) => c.id === activeCore)!;

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
            <Dumbbell size={12} />
            Development Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
          >
            Four cores.
            <br />
            <span className="gradient-text">One daily system.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-uc-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Every training day is structured around four development cores:
            field work, strength, nutrition, and recovery. Each session is
            logged, each metric is tracked, and every output feeds the verified
            athlete profile.
          </motion.p>
        </div>
      </section>

      {/* ═══ CORE SELECTOR ═══ */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cores.map((core, i) => (
              <motion.button
                key={core.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setActiveCore(core.id)}
                className={`glass rounded-xl p-5 text-left transition-all relative overflow-hidden ${
                  activeCore === core.id
                    ? "border-white/20 ring-1"
                    : "border-white/[0.04] hover:border-white/10"
                }`}
                style={
                  activeCore === core.id
                    ? { boxShadow: `0 0 0 1px ${core.color}40` }
                    : undefined
                }
              >
                <div
                  className="h-0.5 absolute top-0 left-0 right-0"
                  style={{
                    backgroundColor:
                      activeCore === core.id ? core.color : "transparent",
                  }}
                />
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-white/10"
                  style={{ backgroundColor: core.color + "15" }}
                >
                  <core.Icon size={18} style={{ color: core.color }} />
                </div>
                <h3 className="text-sm font-bold mb-0.5">{core.label}</h3>
                <p className="text-[9px] text-uc-gray-500">{core.title}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SELECTED CORE DETAIL ═══ */}
      <RevealSection className="py-12 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Core header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                style={{ backgroundColor: selected.color + "15" }}
              >
                <selected.Icon
                  size={24}
                  style={{ color: selected.color }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {selected.title}
                  </h2>
                </div>
                <p className="text-xs text-uc-gray-400 leading-relaxed mb-3">
                  {selected.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-uc-gray-500">
                    Led by:
                  </span>
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: selected.color }}
                  >
                    {selected.coach}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracked metrics */}
            <div className="flex flex-wrap gap-2 mb-8">
              {selected.metrics.map((m) => (
                <span
                  key={m}
                  className="text-[8px] font-mono font-bold px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06]"
                  style={{ color: selected.color }}
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-3 mb-5">
              <Calendar size={14} style={{ color: selected.color }} />
              <h3 className="text-lg font-bold">Weekly Schedule</h3>
              <span className="text-[8px] font-mono text-uc-gray-500 ml-auto">
                {selected.schedule.reduce(
                  (s, d) => s + d.drills.length,
                  0
                )}{" "}
                total drills
              </span>
            </div>

            <div className="space-y-3">
              {selected.schedule.map((day, i) => (
                <DayCard key={day.day} day={day} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ═══ DAILY LOG CONCEPT ═══ */}
      <RevealSection className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-4 text-center font-bold">
            Daily Development Log
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Every day is{" "}
            <span className="gradient-text">measured.</span>
          </h2>
          <p className="text-sm text-uc-gray-500 text-center max-w-lg mx-auto mb-16">
            The development log captures every session across all four cores.
            Over time, this data feeds directly into the verified athlete
            profile.
          </p>

          {/* Mock daily log */}
          <div className="glass rounded-2xl p-6 md:p-8 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-uc-gray-500 font-bold">
                  Sample Training Day
                </p>
                <h3 className="text-lg font-bold">Monday — Full Development</h3>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-uc-gray-500">Total Load</p>
                <p className="text-xl font-black font-mono text-uc-cyan">
                  HIGH
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              {cores.map((core) => (
                <div
                  key={core.id}
                  className="rounded-xl p-4 border border-white/[0.06]"
                  style={{ backgroundColor: core.color + "06" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <core.Icon size={14} style={{ color: core.color }} />
                    <span
                      className="text-[9px] font-bold tracking-wider uppercase"
                      style={{ color: core.color }}
                    >
                      {core.label}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {core.metrics.slice(0, 2).map((m) => (
                      <div key={m} className="flex items-center justify-between">
                        <span className="text-[8px] text-uc-gray-500">{m}</span>
                        <span
                          className="text-[9px] font-mono font-bold"
                          style={{ color: core.color }}
                        >
                          ✓
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-3 h-1 rounded-full"
                    style={{ backgroundColor: core.color + "20" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: core.color,
                        width: `${60 + Math.random() * 35}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[8px] text-uc-gray-600 text-center mt-4">
              All session data syncs to the Under Center profile automatically
            </p>
          </div>
        </div>
      </RevealSection>

      {/* ═══ CTA ═══ */}
      <section className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
            Training is the{" "}
            <span className="gradient-text">first stage.</span>
          </h2>
          <p className="text-sm text-uc-gray-400 max-w-md mx-auto mb-10">
            Every rep in the development engine feeds directly into the verified
            athlete profile. See how the full system works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/system"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
              See The Full System
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/40 hover:text-uc-cyan transition-all duration-300"
            >
              Meet The Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
