import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVelocity(mph: number): string {
  return `${mph.toFixed(1)} MPH`;
}

export function formatReleaseTime(seconds: number): string {
  return `${seconds.toFixed(2)}s`;
}

export function getSpinRateTier(rpm: number): string {
  if (rpm >= 650) return "Elite Tier";
  if (rpm >= 550) return "Above Average";
  if (rpm >= 450) return "Average";
  return "Below Average";
}

export function getMechanicsGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  return "C";
}

export function getPercentileColor(percentile: number): string {
  if (percentile >= 90) return "#00FF88";
  if (percentile >= 70) return "#00C2FF";
  if (percentile >= 50) return "#FFD700";
  return "#FF3B5C";
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
