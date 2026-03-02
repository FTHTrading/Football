"use client";

/* ═══════════════════════════════════════════════════════════════
   IQ LAB — Hub Page
   The Field Intelligence Engine Dashboard
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Zap,
  Trophy,
  Target,
  ArrowRight,
  ChevronRight,
  Lock,
  Eye,
  Shield,
  Calculator,
  Ruler,
  Scan,
  TrendingUp,
  Star,
  Timer,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { IQ_MODULES, type ModuleId } from "@/lib/iq-data";
import {
  loadProfile,
  gradeToColor,
  gradeToLabel,
  xpToNextLevel,
  calculateLevel,
  formatReactionTime,
  type IQProfile,
} from "@/lib/iq-engine";

/* ═══ Module icon mapping ═══ */
const iconMap: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-7 h-7" />,
  Eye: <Eye className="w-7 h-7" />,
  Shield: <Shield className="w-7 h-7" />,
  Scan: <Scan className="w-7 h-7" />,
  Calculator: <Calculator className="w-7 h-7" />,
};

/* ═══ Reveal wrapper ═══ */
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══ Composite IQ Ring ═══ */
function IQRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 150, 1);
  const offset = circumference - progress * circumference;

  const color =
    score >= 120
      ? "#FFD700"
      : score >= 90
      ? "#00FF88"
      : score >= 60
      ? "#00C2FF"
      : score >= 30
      ? "#FACC15"
      : "#FF3B5C";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}50)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] tracking-[0.3em] text-white/40 font-bold uppercase">
          Football IQ
        </span>
      </div>
    </div>
  );
}

/* ═══ Module Card ═══ */
function ModuleCard({
  module,
  profile,
  index,
}: {
  module: (typeof IQ_MODULES)[0];
  profile: IQProfile;
  index: number;
}) {
  const progress = profile.modules[module.id];
  const isUnlocked = progress?.unlocked ?? true;

  return (
    <Reveal delay={index * 0.08}>
      <Link
        href={isUnlocked ? `/iq/${module.id}` : "#"}
        className={`block group ${!isUnlocked ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div
          className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 h-full relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(17,17,17,0.9) 0%, ${module.color}08 100%)`,
          }}
        >
          {/* Lock overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-2xl">
              <Lock className="w-8 h-8 text-white/30" />
            </div>
          )}

          {/* Module number */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${module.color}12`,
                border: `1px solid ${module.color}25`,
              }}
            >
              <div style={{ color: module.color }}>{iconMap[module.icon]}</div>
            </div>
            <span className="text-xs font-mono text-white/20">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-200"
            style={{ color: module.color }}
          >
            {module.title}
          </h3>
          <p className="text-xs text-white/40 tracking-wider uppercase font-semibold mb-3">
            {module.subtitle}
          </p>
          <p className="text-sm text-white/30 leading-relaxed mb-5 line-clamp-2">
            {module.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {module.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-white/5 text-white/30"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Progress / Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {progress && progress.totalAttempts > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="text-lg font-black"
                    style={{ color: gradeToColor(progress.bestGrade) }}
                  >
                    {progress.bestGrade}
                  </span>
                  <div>
                    <p className="text-xs text-white/40">
                      {progress.bestAccuracy}% best
                    </p>
                    <p className="text-[10px] text-white/25">
                      {progress.totalAttempts} attempt
                      {progress.totalAttempts !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-white/30">
                  <span className="text-xs">
                    {module.questionCount} questions
                  </span>
                  <span className="text-white/10">·</span>
                  <span className="text-xs">~{module.estimatedMinutes}m</span>
                </div>
                <span
                  className="text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 transition-transform"
                  style={{ color: module.color }}
                >
                  START →
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function IQLabPage() {
  const [profile, setProfile] = useState<IQProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) return null;

  const levelInfo = xpToNextLevel(profile.totalXP);
  const completedModules = Object.values(profile.modules).filter(
    (m) => m.totalAttempts > 0
  ).length;

  return (
    <div className="min-h-screen bg-uc-black pt-20 pb-24">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background radials */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-uc-cyan/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left: Copy */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 mb-6">
                  <Brain className="w-4 h-4 text-uc-cyan" />
                  <span className="text-xs tracking-[0.2em] text-white/50 font-semibold uppercase">
                    Field Intelligence Engine
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-6">
                  <span className="gradient-text-dna">IQ LAB</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/40 font-light mb-4 max-w-lg">
                  Train the mind that throws the ball.
                </p>
                <p className="text-sm text-white/25 max-w-md leading-relaxed mb-8">
                  Five progressive modules designed to develop elite-level
                  pre-snap reading, defensive recognition, and spatial
                  processing speed. Timed. Scored. Tracked.
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div>
                    <p className="text-3xl font-black text-white">
                      {IQ_MODULES.reduce((a, m) => a + m.questionCount, 0)}
                    </p>
                    <p className="text-xs text-white/30 tracking-wider uppercase">
                      Questions
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">5</p>
                    <p className="text-xs text-white/30 tracking-wider uppercase">
                      Modules
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-uc-cyan">
                      {profile.sessionsCompleted}
                    </p>
                    <p className="text-xs text-white/30 tracking-wider uppercase">
                      Sessions
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: IQ Ring */}
              <div className="flex flex-col items-center gap-6">
                <IQRing score={profile.compositeIQ} size={180} />

                {/* Level + XP Bar */}
                <div className="w-full max-w-[200px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-white/40 font-bold tracking-wider">
                      LVL {profile.level}
                    </span>
                    <span className="text-xs text-white/25">
                      {levelInfo.current}/{levelInfo.needed} XP
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-uc-cyan to-green-400"
                      style={{
                        width: `${(levelInfo.current / levelInfo.needed) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Streak */}
                {profile.currentStreak > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-white/50">
                      {profile.currentStreak} day streak
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Module Grid ── */}
      <section className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Training Modules</h2>
              <p className="text-sm text-white/30 mt-1">
                {completedModules}/5 modules attempted
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-uc-cyan/50" />
              <span className="text-sm text-white/30">
                {profile.totalXP} total XP
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {IQ_MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} profile={profile} index={i} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <Reveal>
          <h2 className="text-2xl font-bold text-center mb-12">
            How IQ Lab Works
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Select Module",
              desc: "Choose a cognitive skill area — Foundation through Space Counting. Each builds on the last.",
              icon: <Brain className="w-6 h-6" />,
              color: "#00C2FF",
            },
            {
              step: "02",
              title: "Answer Under Pressure",
              desc: "Every question is timed. Elite QBs process information in seconds, not minutes. Train that speed.",
              icon: <Timer className="w-6 h-6" />,
              color: "#A855F7",
            },
            {
              step: "03",
              title: "Learn From Every Rep",
              desc: "Detailed explanations after every question. Understand the WHY — not just the WHAT.",
              icon: <TrendingUp className="w-6 h-6" />,
              color: "#00FF88",
            },
            {
              step: "04",
              title: "Track Your IQ",
              desc: "Composite Football IQ score, module grades, reaction times, XP progression — all tracked automatically.",
              icon: <Trophy className="w-6 h-6" />,
              color: "#FFD700",
            },
          ].map((item, i) => (
            <Reveal key={item.step} delay={i * 0.1}>
              <div className="glass rounded-xl p-6 text-center h-full">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{
                    background: `${item.color}12`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <div className="text-xs text-white/20 font-mono mb-2">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <Reveal>
          <div className="glass rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 dna-bg-pattern opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 gradient-text">
                The Game Is Won Before the Snap
              </h2>
              <p className="text-white/30 max-w-md mx-auto mb-8">
                Every elite quarterback reads the defense faster than the clock
                runs. IQ Lab trains that cognitive edge — the difference between
                guessing and knowing.
              </p>
              <Link
                href={`/iq/${IQ_MODULES[0].id}`}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 hover:shadow-[0_0_30px_rgba(0,194,255,0.15)] transition-all font-bold text-sm tracking-[0.2em] uppercase"
              >
                <Zap className="w-5 h-5" />
                Start Training
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
