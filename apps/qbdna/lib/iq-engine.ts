/* ═══════════════════════════════════════════════════════════════
   IQ LAB — Scoring Engine
   Client-side session management, scoring, and localStorage persistence
   ═══════════════════════════════════════════════════════════════ */

import type { ModuleId, Difficulty } from "./iq-data";

/* ═══ TYPES ═══ */
export interface SessionQuestion {
  questionId: string;
  answeredIndex: number | null;
  correct: boolean;
  reactionTimeMs: number;
  answeredAt: number | null;
}

export interface IQSession {
  id: string;
  moduleId: ModuleId;
  startedAt: number;
  completedAt: number | null;
  questions: SessionQuestion[];
  currentIndex: number;
  completed: boolean;
  score: SessionScore | null;
}

export interface SessionScore {
  accuracy: number; // 0-100
  totalCorrect: number;
  totalQuestions: number;
  avgReactionMs: number;
  fastestReactionMs: number;
  slowestReactionMs: number;
  xpEarned: number;
  grade: IQGrade;
  timeBonus: number;
}

export type IQGrade = "S" | "A" | "B" | "C" | "D" | "F";

export interface ModuleProgress {
  moduleId: ModuleId;
  bestAccuracy: number;
  bestGrade: IQGrade;
  avgReactionMs: number;
  totalAttempts: number;
  totalXpEarned: number;
  lastCompletedAt: number | null;
  unlocked: boolean;
}

export interface IQProfile {
  totalXP: number;
  level: number;
  compositeIQ: number; // 0-150 scale
  modules: Record<ModuleId, ModuleProgress>;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionAt: number | null;
}

/* ═══ CONSTANTS ═══ */
const STORAGE_KEY = "uc_iq_profile";
const SESSION_KEY = "uc_iq_session";
const XP_PER_LEVEL = 200;
const TIME_BONUS_THRESHOLD_MS = 5000; // under 5s gets time bonus
const TIME_BONUS_MULTIPLIER = 1.25;

/* ═══ GRADE CALCULATION ═══ */
export function calculateGrade(accuracy: number, avgReactionMs: number): IQGrade {
  // Weighted: 70% accuracy, 30% speed
  const speedFactor = Math.max(0, 1 - avgReactionMs / 15000); // normalized 0-1
  const weighted = accuracy * 0.7 + speedFactor * 100 * 0.3;

  if (weighted >= 95) return "S";
  if (weighted >= 85) return "A";
  if (weighted >= 75) return "B";
  if (weighted >= 60) return "C";
  if (weighted >= 40) return "D";
  return "F";
}

export function gradeToColor(grade: IQGrade): string {
  const colors: Record<IQGrade, string> = {
    S: "#FFD700", // Gold
    A: "#00FF88", // Green
    B: "#00C2FF", // Cyan
    C: "#FACC15", // Yellow
    D: "#F97316", // Orange
    F: "#FF3B5C", // Red
  };
  return colors[grade];
}

export function gradeToLabel(grade: IQGrade): string {
  const labels: Record<IQGrade, string> = {
    S: "ELITE",
    A: "ADVANCED",
    B: "PROFICIENT",
    C: "DEVELOPING",
    D: "FOUNDATIONAL",
    F: "NEEDS WORK",
  };
  return labels[grade];
}

/* ═══ IQ COMPOSITE CALCULATION ═══ */
export function calculateCompositeIQ(profile: IQProfile): number {
  const moduleIds: ModuleId[] = [
    "foundation",
    "halo",
    "fronts",
    "coverage",
    "space-counting",
  ];
  const weights: Record<ModuleId, number> = {
    foundation: 0.1,
    halo: 0.2,
    fronts: 0.2,
    coverage: 0.25,
    "space-counting": 0.25,
  };

  let totalWeighted = 0;
  let totalWeight = 0;

  for (const id of moduleIds) {
    const mod = profile.modules[id];
    if (mod && mod.totalAttempts > 0) {
      // Scale accuracy (0-100) to IQ contribution (0-150)
      const accuracyContrib = (mod.bestAccuracy / 100) * 150;
      // Speed bonus (faster = higher)
      const speedBonus = mod.avgReactionMs > 0
        ? Math.max(0, (1 - mod.avgReactionMs / 20000)) * 15
        : 0;
      totalWeighted += (accuracyContrib + speedBonus) * weights[id];
      totalWeight += weights[id];
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeighted / totalWeight);
}

/* ═══ SESSION SCORING ═══ */
export function scoreSession(session: IQSession, questionsXP: number[]): SessionScore {
  const answered = session.questions.filter((q) => q.answeredAt !== null);
  const correct = answered.filter((q) => q.correct);
  const accuracy = answered.length > 0 ? (correct.length / answered.length) * 100 : 0;

  const reactionTimes = answered.map((q) => q.reactionTimeMs).filter((t) => t > 0);
  const avgReaction = reactionTimes.length > 0
    ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
    : 0;
  const fastestReaction = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
  const slowestReaction = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0;

  // XP calculation
  let baseXP = 0;
  session.questions.forEach((q, i) => {
    if (q.correct) {
      baseXP += questionsXP[i] || 0;
    }
  });

  // Time bonus for fast answers
  const fastAnswers = reactionTimes.filter((t) => t < TIME_BONUS_THRESHOLD_MS).length;
  const timeBonus = Math.round(fastAnswers * 5);
  const totalXP = Math.round(baseXP + timeBonus);

  const grade = calculateGrade(accuracy, avgReaction);

  return {
    accuracy: Math.round(accuracy * 10) / 10,
    totalCorrect: correct.length,
    totalQuestions: answered.length,
    avgReactionMs: Math.round(avgReaction),
    fastestReactionMs: Math.round(fastestReaction),
    slowestReactionMs: Math.round(slowestReaction),
    xpEarned: totalXP,
    grade,
    timeBonus,
  };
}

/* ═══ LEVEL CALCULATION ═══ */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(totalXP: number): { current: number; needed: number } {
  const currentLevelXP = totalXP % XP_PER_LEVEL;
  return { current: currentLevelXP, needed: XP_PER_LEVEL };
}

/* ═══ DIFFICULTY LABEL ═══ */
export function difficultyLabel(d: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    1: "ROOKIE",
    2: "STARTER",
    3: "ALL-CONFERENCE",
    4: "ALL-AMERICAN",
    5: "NFL READY",
  };
  return labels[d];
}

export function difficultyColor(d: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    1: "#9CA3AF",
    2: "#00C2FF",
    3: "#00FF88",
    4: "#A855F7",
    5: "#FFD700",
  };
  return colors[d];
}

/* ═══ PERSISTENCE (localStorage) ═══ */
function getDefaultModuleProgress(moduleId: ModuleId, unlocked: boolean): ModuleProgress {
  return {
    moduleId,
    bestAccuracy: 0,
    bestGrade: "F",
    avgReactionMs: 0,
    totalAttempts: 0,
    totalXpEarned: 0,
    lastCompletedAt: null,
    unlocked,
  };
}

export function getDefaultProfile(): IQProfile {
  return {
    totalXP: 0,
    level: 1,
    compositeIQ: 0,
    modules: {
      foundation: getDefaultModuleProgress("foundation", true),
      halo: getDefaultModuleProgress("halo", true), // unlock all for now
      fronts: getDefaultModuleProgress("fronts", true),
      coverage: getDefaultModuleProgress("coverage", true),
      "space-counting": getDefaultModuleProgress("space-counting", true),
    },
    sessionsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionAt: null,
  };
}

export function loadProfile(): IQProfile {
  if (typeof window === "undefined") return getDefaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    return JSON.parse(raw) as IQProfile;
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile: IQProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage full or unavailable
  }
}

export function updateProfileWithSession(
  profile: IQProfile,
  session: IQSession,
  score: SessionScore
): IQProfile {
  const updated = { ...profile };
  const mod = { ...updated.modules[session.moduleId] };

  // Update module progress
  mod.totalAttempts += 1;
  mod.totalXpEarned += score.xpEarned;
  mod.lastCompletedAt = Date.now();

  if (score.accuracy > mod.bestAccuracy) {
    mod.bestAccuracy = score.accuracy;
  }

  // Compare grades
  const gradeOrder: IQGrade[] = ["F", "D", "C", "B", "A", "S"];
  if (gradeOrder.indexOf(score.grade) > gradeOrder.indexOf(mod.bestGrade)) {
    mod.bestGrade = score.grade;
  }

  // Rolling average reaction time
  if (mod.avgReactionMs === 0) {
    mod.avgReactionMs = score.avgReactionMs;
  } else {
    mod.avgReactionMs = Math.round(
      (mod.avgReactionMs * (mod.totalAttempts - 1) + score.avgReactionMs) / mod.totalAttempts
    );
  }

  updated.modules[session.moduleId] = mod;

  // Update global profile
  updated.totalXP += score.xpEarned;
  updated.level = calculateLevel(updated.totalXP);
  updated.sessionsCompleted += 1;
  updated.lastSessionAt = Date.now();

  // Streak logic
  const lastSession = profile.lastSessionAt;
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (lastSession && Date.now() - lastSession < oneDayMs * 2) {
    updated.currentStreak += 1;
  } else {
    updated.currentStreak = 1;
  }
  if (updated.currentStreak > updated.longestStreak) {
    updated.longestStreak = updated.currentStreak;
  }

  // Recalculate composite IQ
  updated.compositeIQ = calculateCompositeIQ(updated);

  return updated;
}

/* ═══ SESSION PERSISTENCE ═══ */
export function saveSession(session: IQSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadSession(): IQSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as IQSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/* ═══ SESSION CREATION ═══ */
export function createSession(
  moduleId: ModuleId,
  questionIds: string[]
): IQSession {
  return {
    id: `${moduleId}-${Date.now()}`,
    moduleId,
    startedAt: Date.now(),
    completedAt: null,
    questions: questionIds.map((qid) => ({
      questionId: qid,
      answeredIndex: null,
      correct: false,
      reactionTimeMs: 0,
      answeredAt: null,
    })),
    currentIndex: 0,
    completed: false,
    score: null,
  };
}

/* ═══ FORMAT HELPERS ═══ */
export function formatReactionTime(ms: number): string {
  if (ms === 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy)}%`;
}
