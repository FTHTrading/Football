"use client";

/* ═══════════════════════════════════════════════════════════════
   IQ LAB — Quiz Shell Component
   Shared interactive quiz engine used by every module
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Brain,
  Trophy,
  Timer,
  TrendingUp,
  Star,
} from "lucide-react";
import type { IQQuestion, ModuleId } from "@/lib/iq-data";
import { getModuleById, getModuleQuestions, shuffleQuestions } from "@/lib/iq-data";
import {
  createSession,
  scoreSession,
  loadProfile,
  saveProfile,
  updateProfileWithSession,
  formatReactionTime,
  gradeToColor,
  gradeToLabel,
  difficultyLabel,
  difficultyColor,
  xpToNextLevel,
  type IQSession,
  type SessionScore,
} from "@/lib/iq-engine";

/* ═══ TIMER BAR ═══ */
function TimerBar({
  timeLimit,
  timeLeft,
  isActive,
}: {
  timeLimit: number;
  timeLeft: number;
  isActive: boolean;
}) {
  const pct = (timeLeft / timeLimit) * 100;
  const urgent = pct < 25;

  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: urgent
            ? "linear-gradient(90deg, #FF3B5C, #FF6B35)"
            : "linear-gradient(90deg, #00C2FF, #00FF88)",
        }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: "linear" }}
      />
    </div>
  );
}

/* ═══ PROGRESS DOTS ═══ */
function ProgressDots({
  total,
  current,
  answers,
}: {
  total: number;
  current: number;
  answers: (boolean | null)[];
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i === current
              ? "ring-2 ring-uc-cyan ring-offset-1 ring-offset-uc-black scale-125"
              : ""
          }`}
          style={{
            background:
              answers[i] === true
                ? "#00FF88"
                : answers[i] === false
                ? "#FF3B5C"
                : i === current
                ? "#00C2FF"
                : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══ OPTION BUTTON ═══ */
function OptionButton({
  label,
  index,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}: {
  label: string;
  index: number;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const letters = ["A", "B", "C", "D", "E", "F"];

  let borderColor = "border-white/10";
  let bgColor = "bg-white/[0.03]";
  let textColor = "text-white/80";

  if (revealed) {
    if (correct) {
      borderColor = "border-green-400/50";
      bgColor = "bg-green-400/10";
      textColor = "text-green-300";
    } else if (selected && !correct) {
      borderColor = "border-red-400/50";
      bgColor = "bg-red-400/10";
      textColor = "text-red-300";
    } else {
      textColor = "text-white/30";
    }
  } else if (selected) {
    borderColor = "border-uc-cyan/50";
    bgColor = "bg-uc-cyan/10";
    textColor = "text-uc-cyan";
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      className={`w-full text-left p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} transition-all duration-200 flex items-start gap-4 group ${
        disabled ? "cursor-default" : "cursor-pointer hover:border-white/20"
      }`}
    >
      <span
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
          revealed && correct
            ? "bg-green-400/20 text-green-300"
            : revealed && selected && !correct
            ? "bg-red-400/20 text-red-300"
            : selected
            ? "bg-uc-cyan/20 text-uc-cyan"
            : "bg-white/5 text-white/40"
        }`}
      >
        {revealed && correct ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : revealed && selected && !correct ? (
          <XCircle className="w-5 h-5" />
        ) : (
          letters[index]
        )}
      </span>
      <span className="flex-1 text-[15px] leading-relaxed">{label}</span>
    </motion.button>
  );
}

/* ═══ RESULTS SCREEN ═══ */
function ResultsScreen({
  score,
  moduleId,
  onRetry,
}: {
  score: SessionScore;
  moduleId: ModuleId;
  onRetry: () => void;
}) {
  const mod = getModuleById(moduleId);
  const levelInfo = xpToNextLevel(loadProfile().totalXP);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      {/* Grade Hero */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-full border-2 mb-6"
          style={{
            borderColor: gradeToColor(score.grade),
            background: `${gradeToColor(score.grade)}10`,
            boxShadow: `0 0 40px ${gradeToColor(score.grade)}30`,
          }}
        >
          <span
            className="text-5xl font-black"
            style={{ color: gradeToColor(score.grade) }}
          >
            {score.grade}
          </span>
        </motion.div>
        <p
          className="text-sm font-bold tracking-[0.3em] uppercase mb-2"
          style={{ color: gradeToColor(score.grade) }}
        >
          {gradeToLabel(score.grade)}
        </p>
        <h2 className="text-2xl font-bold">
          {mod?.title} — Complete
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "ACCURACY",
            value: `${score.accuracy}%`,
            sub: `${score.totalCorrect}/${score.totalQuestions}`,
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: "#00FF88",
          },
          {
            label: "AVG SPEED",
            value: formatReactionTime(score.avgReactionMs),
            sub: `Best: ${formatReactionTime(score.fastestReactionMs)}`,
            icon: <Timer className="w-5 h-5" />,
            color: "#00C2FF",
          },
          {
            label: "XP EARNED",
            value: `+${score.xpEarned}`,
            sub: score.timeBonus > 0 ? `+${score.timeBonus} time bonus` : "No time bonus",
            icon: <Zap className="w-5 h-5" />,
            color: "#FACC15",
          },
          {
            label: "GRADE",
            value: score.grade,
            sub: gradeToLabel(score.grade),
            icon: <Trophy className="w-5 h-5" />,
            color: gradeToColor(score.grade),
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 text-center"
          >
            <div className="flex justify-center mb-2" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-xs text-white/40 tracking-wider font-semibold mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* XP Bar */}
      <div className="glass rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40 tracking-wider font-semibold">
            LEVEL PROGRESS
          </span>
          <span className="text-sm text-uc-cyan font-bold">
            {levelInfo.current} / {levelInfo.needed} XP
          </span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #00C2FF, #00FF88)",
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${(levelInfo.current / levelInfo.needed) * 100}%`,
            }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all font-semibold text-sm tracking-wider uppercase"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/iq"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 transition-all font-semibold text-sm tracking-wider uppercase"
        >
          All Modules
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ═══ MAIN QUIZ SHELL ═══ */
export default function QuizShell({ moduleId }: { moduleId: ModuleId }) {
  const mod = getModuleById(moduleId);
  const [session, setSession] = useState<IQSession | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [finalScore, setFinalScore] = useState<SessionScore | null>(null);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize session
  const startSession = useCallback(() => {
    const questions = shuffleQuestions(getModuleQuestions(moduleId));
    const newSession = createSession(
      moduleId,
      questions.map((q) => q.id)
    );
    setSession(newSession);
    setSelectedIndex(null);
    setRevealed(false);
    setFinalScore(null);
    setStarted(true);
    setTimeLeft(questions[0]?.timeLimit || 20);
    setQuestionStartTime(Date.now());
  }, [moduleId]);

  // Current question
  const currentQuestion = session
    ? getModuleQuestions(moduleId).find(
        (q) => q.id === session.questions[session.currentIndex]?.questionId
      )
    : null;

  // Timer
  useEffect(() => {
    if (!started || !currentQuestion || revealed) return;

    setTimeLeft(currentQuestion.timeLimit);
    const start = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(0, currentQuestion.timeLimit - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        // Auto-submit as wrong
        handleAnswer(-1);
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentIndex, started, revealed]);

  // Handle answer selection
  const handleAnswer = useCallback(
    (index: number) => {
      if (!session || !currentQuestion || revealed) return;

      if (timerRef.current) clearInterval(timerRef.current);

      const reactionTimeMs = Date.now() - questionStartTime;
      const isCorrect = index === currentQuestion.correctIndex;

      setSelectedIndex(index);
      setRevealed(true);

      // Update session
      const updatedQuestions = [...session.questions];
      updatedQuestions[session.currentIndex] = {
        ...updatedQuestions[session.currentIndex],
        answeredIndex: index,
        correct: isCorrect,
        reactionTimeMs,
        answeredAt: Date.now(),
      };

      setSession({
        ...session,
        questions: updatedQuestions,
      });
    },
    [session, currentQuestion, revealed, questionStartTime]
  );

  // Advance to next question
  const nextQuestion = useCallback(() => {
    if (!session) return;

    const nextIdx = session.currentIndex + 1;

    if (nextIdx >= session.questions.length) {
      // Session complete
      const completedSession: IQSession = {
        ...session,
        currentIndex: nextIdx,
        completed: true,
        completedAt: Date.now(),
      };

      const allQuestions = getModuleQuestions(moduleId);
      const xpValues = completedSession.questions.map((sq) => {
        const q = allQuestions.find((aq) => aq.id === sq.questionId);
        return q?.xpValue || 0;
      });

      const score = scoreSession(completedSession, xpValues);
      completedSession.score = score;

      // Update profile
      const profile = loadProfile();
      const updatedProfile = updateProfileWithSession(profile, completedSession, score);
      saveProfile(updatedProfile);

      setSession(completedSession);
      setFinalScore(score);
    } else {
      setSession({
        ...session,
        currentIndex: nextIdx,
      });
      setSelectedIndex(null);
      setRevealed(false);
      setQuestionStartTime(Date.now());
    }
  }, [session, moduleId]);

  // Pre-start screen
  if (!started) {
    const questions = getModuleQuestions(moduleId);
    const profile = loadProfile();
    const modProgress = profile.modules[moduleId];

    return (
      <div className="min-h-screen bg-uc-black pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/iq"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-uc-cyan transition-colors mb-8"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            IQ Lab
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: `${mod?.color}15`,
                border: `1px solid ${mod?.color}30`,
              }}
            >
              <Brain className="w-8 h-8" style={{ color: mod?.color }} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              {mod?.title}
            </h1>
            <p className="text-lg text-white/40 mb-2">{mod?.subtitle}</p>
            <p className="text-sm text-white/30 max-w-lg mx-auto mb-10 leading-relaxed">
              {mod?.description}
            </p>

            {/* Module Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/40 tracking-wider font-semibold mb-1">
                  QUESTIONS
                </p>
                <p className="text-2xl font-black text-white">
                  {questions.length}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/40 tracking-wider font-semibold mb-1">
                  EST. TIME
                </p>
                <p className="text-2xl font-black text-white">
                  {mod?.estimatedMinutes}m
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/40 tracking-wider font-semibold mb-1">
                  BEST GRADE
                </p>
                <p
                  className="text-2xl font-black"
                  style={{
                    color:
                      modProgress.totalAttempts > 0
                        ? gradeToColor(modProgress.bestGrade)
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  {modProgress.totalAttempts > 0 ? modProgress.bestGrade : "—"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {mod?.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase bg-white/5 text-white/50 border border-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={startSession}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: `${mod?.color}15`,
                color: mod?.color,
                border: `1px solid ${mod?.color}30`,
                boxShadow: `0 0 30px ${mod?.color}15`,
              }}
            >
              <Zap className="w-5 h-5" />
              Begin Session
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results screen
  if (finalScore) {
    return (
      <div className="min-h-screen bg-uc-black pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <ResultsScreen
            score={finalScore}
            moduleId={moduleId}
            onRetry={startSession}
          />
        </div>
      </div>
    );
  }

  // Quiz screen
  if (!session || !currentQuestion) return null;

  const answers = session.questions.map((q) =>
    q.answeredAt !== null ? q.correct : null
  );

  return (
    <div className="min-h-screen bg-uc-black pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-lg"
              style={{
                background: `${mod?.color}15`,
                color: mod?.color,
                border: `1px solid ${mod?.color}30`,
              }}
            >
              {mod?.title}
            </span>
            <span className="text-sm text-white/40">
              {session.currentIndex + 1} / {session.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/30" />
            <span
              className={`text-sm font-mono font-bold ${
                timeLeft < 5 ? "text-red-400" : "text-white/60"
              }`}
            >
              {Math.ceil(timeLeft)}s
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <TimerBar
          timeLimit={currentQuestion.timeLimit}
          timeLeft={timeLeft}
          isActive={!revealed}
        />

        {/* Progress Dots */}
        <div className="mt-4 mb-8">
          <ProgressDots
            total={session.questions.length}
            current={session.currentIndex}
            answers={answers}
          />
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase px-2 py-1 rounded"
            style={{
              background: `${difficultyColor(currentQuestion.difficulty)}15`,
              color: difficultyColor(currentQuestion.difficulty),
            }}
          >
            {difficultyLabel(currentQuestion.difficulty)}
          </span>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-bold leading-snug mb-8">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, i) => (
              <OptionButton
                key={i}
                label={option}
                index={i}
                selected={selectedIndex === i}
                correct={i === currentQuestion.correctIndex}
                revealed={revealed}
                disabled={revealed}
                onSelect={() => handleAnswer(i)}
              />
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div
                  className="rounded-xl p-5 border"
                  style={{
                    background:
                      selectedIndex === currentQuestion.correctIndex
                        ? "rgba(0,255,136,0.05)"
                        : "rgba(255,59,92,0.05)",
                    borderColor:
                      selectedIndex === currentQuestion.correctIndex
                        ? "rgba(0,255,136,0.15)"
                        : "rgba(255,59,92,0.15)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {selectedIndex === currentQuestion.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-bold mb-1">
                        {selectedIndex === currentQuestion.correctIndex
                          ? "Correct"
                          : selectedIndex === -1
                          ? "Time's Up"
                          : "Incorrect"}
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextQuestion}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 transition-all font-semibold text-sm tracking-wider uppercase"
                >
                  {session.currentIndex + 1 >= session.questions.length
                    ? "See Results"
                    : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
