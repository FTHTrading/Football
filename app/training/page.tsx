"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Target,
  Shield,
  Eye,
  Activity,
  Flame,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Dna,
  Calendar,
  TrendingUp,
  Lock,
  Star,
} from "lucide-react";

/* ── Training program types ── */
interface Drill {
  name: string;
  sets: string;
  focus: string;
  icon: typeof Zap;
  color: string;
}

interface TrainingDay {
  day: string;
  label: string;
  focus: string;
  drills: Drill[];
  duration: string;
  intensity: "low" | "medium" | "high";
}

interface Program {
  id: string;
  name: string;
  description: string;
  weeks: number;
  level: string;
  targetGenes: string[];
  color: string;
  locked: boolean;
  schedule: TrainingDay[];
}

/* ── Generate programs ── */
function generatePrograms(): Program[] {
  return [
    {
      id: "velocity",
      name: "Velocity Protocol",
      description: "Max arm strength and throwing power. Built for QBs who want to add 3-5 mph to their fastball.",
      weeks: 8,
      level: "Advanced",
      targetGenes: ["VEL-α", "SPR-ζ"],
      color: "#00C2FF",
      locked: false,
      schedule: [
        {
          day: "MON",
          label: "Power Foundation",
          focus: "Lower body + core explosiveness",
          duration: "75 min",
          intensity: "high",
          drills: [
            { name: "Weighted Rotational Throws", sets: "4×8", focus: "Hip-to-shoulder separation", icon: Zap, color: "#00C2FF" },
            { name: "Med Ball Scoop Toss", sets: "3×10", focus: "Ground-up force chain", icon: Activity, color: "#A855F7" },
            { name: "Band-Resisted Drops", sets: "4×6", focus: "Explosive weight transfer", icon: Shield, color: "#FACC15" },
            { name: "Long Toss Progression", sets: "20 min", focus: "Build arm strength gradually", icon: Target, color: "#00FF88" },
          ],
        },
        {
          day: "TUE",
          label: "Release Mechanics",
          focus: "Arm slot + wrist snap optimization",
          duration: "60 min",
          intensity: "medium",
          drills: [
            { name: "Wrist Flick Drills", sets: "3×15", focus: "Snap speed at final release", icon: Zap, color: "#00C2FF" },
            { name: "Towel Drill", sets: "4×12", focus: "Arm path consistency", icon: Shield, color: "#FACC15" },
            { name: "1-Knee Throws", sets: "3×10", focus: "Isolate upper body mechanics", icon: Target, color: "#00FF88" },
            { name: "Spin Rate Focused Throws", sets: "15 min", focus: "Tight spirals at max effort", icon: Activity, color: "#A855F7" },
          ],
        },
        {
          day: "WED",
          label: "Recovery + Film",
          focus: "Active recovery + mechanical review",
          duration: "45 min",
          intensity: "low",
          drills: [
            { name: "Arm Care Routine", sets: "15 min", focus: "J-band, stretching, mobility", icon: Shield, color: "#FACC15" },
            { name: "Film Study: Velocity Models", sets: "20 min", focus: "Study Allen, Mahomes release", icon: Eye, color: "#00FF88" },
            { name: "Visualization Session", sets: "10 min", focus: "Mental reps on power throws", icon: Activity, color: "#A855F7" },
          ],
        },
        {
          day: "THU",
          label: "Live Arm Day",
          focus: "Full-speed throwing with tracking",
          duration: "70 min",
          intensity: "high",
          drills: [
            { name: "Radar Gun Session", sets: "25 throws", focus: "Max velocity attempts tracked", icon: Zap, color: "#00C2FF" },
            { name: "Out Routes at Distance", sets: "3×8", focus: "Power on sideline throws", icon: Target, color: "#00FF88" },
            { name: "Deep Ball Series", sets: "3×6", focus: "45+ yard accuracy at velocity", icon: Activity, color: "#A855F7" },
            { name: "Plyo Ball Throws", sets: "3×10", focus: "Overload/underload training", icon: Shield, color: "#FACC15" },
          ],
        },
        {
          day: "FRI",
          label: "Compete Day",
          focus: "Simulated game pressure throws",
          duration: "60 min",
          intensity: "high",
          drills: [
            { name: "7-on-7 Simulation", sets: "30 min", focus: "Velocity under pressure", icon: Zap, color: "#00C2FF" },
            { name: "Moving Platform Throws", sets: "3×8", focus: "Throw on the run power", icon: Activity, color: "#A855F7" },
            { name: "Velocity Tracking Review", sets: "15 min", focus: "Compare to baseline data", icon: Eye, color: "#00FF88" },
          ],
        },
      ],
    },
    {
      id: "accuracy",
      name: "Precision Lab",
      description: "Surgical accuracy across all throw zones. Short, intermediate, and deep ball placement.",
      weeks: 6,
      level: "All Levels",
      targetGenes: ["ACC-γ", "MECH-δ"],
      color: "#00FF88",
      locked: false,
      schedule: [
        {
          day: "MON",
          label: "Short Game Mastery",
          focus: "0-10 yard accuracy",
          duration: "60 min",
          intensity: "medium",
          drills: [
            { name: "Net Drill: Box Targets", sets: "4×12", focus: "Hit 2x2 ft window", icon: Target, color: "#00FF88" },
            { name: "Quick Game Script", sets: "20 reps", focus: "Slants, hitches, screens", icon: Zap, color: "#00C2FF" },
            { name: "Footwork + Accuracy Combo", sets: "3×10", focus: "Throw on rhythm", icon: Shield, color: "#FACC15" },
          ],
        },
        {
          day: "WED",
          label: "Intermediate Precision",
          focus: "10-25 yard window throws",
          duration: "65 min",
          intensity: "high",
          drills: [
            { name: "Bucket Drill", sets: "4×8", focus: "Drop ball into target zone", icon: Target, color: "#00FF88" },
            { name: "Seam Route Accuracy", sets: "3×8", focus: "Thread the needle", icon: Activity, color: "#A855F7" },
            { name: "Moving Target Throws", sets: "3×10", focus: "Lead receiver accurately", icon: Eye, color: "#00C2FF" },
          ],
        },
        {
          day: "FRI",
          label: "Deep Ball Lab",
          focus: "30+ yard placement",
          duration: "55 min",
          intensity: "high",
          drills: [
            { name: "Corner Route Touch", sets: "3×6", focus: "Back shoulder placement", icon: Target, color: "#00FF88" },
            { name: "Post Route Tracking", sets: "3×6", focus: "Ball over inside shoulder", icon: Zap, color: "#00C2FF" },
            { name: "Go Route Drops", sets: "3×6", focus: "Drop it in the basket", icon: Activity, color: "#A855F7" },
          ],
        },
      ],
    },
    {
      id: "decision",
      name: "Decision Engine",
      description: "Speed up your reads. Process defenses faster. Make the right throw every time.",
      weeks: 6,
      level: "Intermediate+",
      targetGenes: ["DEC-ε", "ACC-γ"],
      color: "#A855F7",
      locked: true,
      schedule: [
        {
          day: "MON",
          label: "Pre-Snap Reads",
          focus: "Identify coverage before the snap",
          duration: "50 min",
          intensity: "medium",
          drills: [
            { name: "Coverage Recognition Cards", sets: "30 reps", focus: "ID Cover 1-4 in < 3s", icon: Eye, color: "#00FF88" },
            { name: "Film Quiz: Defense IDs", sets: "20 min", focus: "Live game pre-snap reads", icon: Activity, color: "#A855F7" },
          ],
        },
        {
          day: "WED",
          label: "Post-Snap Processing",
          focus: "Read progressions under pressure",
          duration: "55 min",
          intensity: "high",
          drills: [
            { name: "Progression Throws", sets: "4×8", focus: "1st read → 2nd → check", icon: Eye, color: "#00FF88" },
            { name: "Hot Route Reactions", sets: "3×10", focus: "Blitz recognition + adjust", icon: Zap, color: "#00C2FF" },
          ],
        },
        {
          day: "FRI",
          label: "Live Decision Making",
          focus: "Full-speed decision reps",
          duration: "60 min",
          intensity: "high",
          drills: [
            { name: "7-on-7 Decision Tracking", sets: "30 min", focus: "Grade every decision", icon: Target, color: "#00FF88" },
            { name: "Decision Timer Drill", sets: "3×8", focus: "Throw within 2.5s of snap", icon: Zap, color: "#00C2FF" },
          ],
        },
      ],
    },
    {
      id: "elite",
      name: "Genesis Protocol",
      description: "The complete quarterback development program. Every gene, every trait, every edge.",
      weeks: 12,
      level: "Elite Only",
      targetGenes: ["VEL-α", "REL-β", "ACC-γ", "MECH-δ", "DEC-ε", "SPR-ζ"],
      color: "#FFD700",
      locked: true,
      schedule: [],
    },
  ];
}

/* ── Schedule Day Card ── */
function DayCard({ day, index }: { day: TrainingDay; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const intensityColors = { low: "#00FF88", medium: "#FACC15", high: "#FF3B5C" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
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
          {expanded ? <ChevronDown size={14} className="text-uc-gray-400" /> : <ChevronRight size={14} className="text-uc-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
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
                  <drill.icon size={12} style={{ color: drill.color }} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{drill.name}</p>
                    <p className="text-[8px] text-uc-gray-500">{drill.focus}</p>
                  </div>
                  <span className="text-[9px] font-mono text-uc-gray-400 shrink-0">{drill.sets}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Training Page ── */
export default function TrainingPage() {
  const programs = useMemo(() => generatePrograms(), []);
  const [selectedId, setSelectedId] = useState(programs[0].id);
  const selected = programs.find((p) => p.id === selectedId)!;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Dumbbell size={12} />
            Development Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Training Protocols</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Gene-targeted development programs designed to upgrade specific traits in your QB genome.
            Every drill has a purpose. Every rep counts.
          </p>
        </motion.div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {programs.map((prog, i) => (
            <motion.button
              key={prog.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => !prog.locked && setSelectedId(prog.id)}
              className={`glass rounded-xl p-5 text-left transition-all relative overflow-hidden ${
                selectedId === prog.id ? "border-white/20 ring-1" : "hover:border-white/10"
              } ${prog.locked ? "opacity-60" : ""}`}
              style={selectedId === prog.id ? { boxShadow: `0 0 0 1px ${prog.color}40` } : undefined}
            >
              {prog.locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-[1px]">
                  <div className="text-center">
                    <Lock size={20} className="mx-auto mb-1 text-uc-gray-400" />
                    <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">Unlock with Double Helix+</p>
                  </div>
                </div>
              )}

              <div className="h-0.5 absolute top-0 left-0 right-0" style={{ backgroundColor: prog.color }} />
              <div className="flex items-center gap-2 mb-2">
                <Dna size={14} style={{ color: prog.color }} />
                <h3 className="text-sm font-bold">{prog.name}</h3>
                <span
                  className="text-[7px] font-bold px-1.5 py-0.5 rounded tracking-wider ml-auto"
                  style={{ backgroundColor: prog.color + "15", color: prog.color }}
                >
                  {prog.level}
                </span>
              </div>
              <p className="text-[9px] text-uc-gray-500 mb-3 leading-relaxed">{prog.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-[8px] text-uc-gray-500 flex items-center gap-1">
                  <Calendar size={8} /> {prog.weeks} weeks
                </span>
                <span className="text-[8px] text-uc-gray-500 flex items-center gap-1">
                  <Target size={8} /> {prog.schedule.length} training days/wk
                </span>
              </div>
              <div className="flex gap-1.5 mt-3">
                {prog.targetGenes.map((gene) => (
                  <span
                    key={gene}
                    className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-uc-gray-400"
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Program Schedule */}
        {!selected.locked && selected.schedule.length > 0 && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <Dumbbell size={14} style={{ color: selected.color }} />
              <h2 className="text-lg font-bold">{selected.name} — Weekly Schedule</h2>
              <span className="text-[8px] font-mono text-uc-gray-500 ml-auto">
                {selected.schedule.reduce((s, d) => s + d.drills.length, 0)} total drills
              </span>
            </div>

            <div className="space-y-3">
              {selected.schedule.map((day, i) => (
                <DayCard key={day.day} day={day} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress Preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 dna-bg-pattern opacity-10" />
          <div className="relative">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={12} /> Expected Genome Growth
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {selected.targetGenes.slice(0, 3).map((gene) => {
                const pct = 8 + (gene.charCodeAt(0) % 7);
                return (
                  <div key={gene} className="text-center p-4 rounded-lg bg-white/[0.02]">
                    <p className="text-[8px] font-mono text-uc-gray-500 tracking-wider mb-1">{gene}</p>
                    <p className="text-2xl font-black font-mono" style={{ color: selected.color }}>
                      +{pct}%
                    </p>
                    <p className="text-[8px] text-uc-gray-500">after {selected.weeks} weeks</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[8px] text-uc-gray-600 text-center mt-3">
              *Projected growth based on athlete compliance and baseline metrics
            </p>
          </div>
        </motion.div>

        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Unlock all training protocols with Double Helix or Genesis Sequence.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            View Plans
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
