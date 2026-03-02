import { clsx, type ClassValue } from "clsx";

/**
 * Utility for merging class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
