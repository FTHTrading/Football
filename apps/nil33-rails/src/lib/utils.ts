import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format integer cents as USD string: 100000 → "$1,000.00" */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/** Format basis points as percentage: 2500 → "25.00%" */
export function formatBps(bps: number): string {
  return (bps / 100).toFixed(2) + "%";
}

/** Generate a URL-safe correlation/idempotency ID */
export function generateCorrelationId(): string {
  return nanoid(21);
}

/** Truncate a string with an ellipsis */
export function truncate(str: string, maxLen = 40): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}

/** ISO date string → "Jan 15, 2025" */
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(d));
}

/** Parse and validate a positive integer from a URL search param */
export function parsePageParam(value: string | null, fallback = 1): number {
  const n = parseInt(value ?? "", 10);
  return isNaN(n) || n < 1 ? fallback : n;
}
