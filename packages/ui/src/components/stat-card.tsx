"use client";

import React from "react";
import { cn } from "../utils";

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  trend,
  className,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
        ? "text-red-400"
        : "text-gray-400";

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-gray-400">
            {suffix}
          </span>
        )}
      </p>
      {trend && (
        <span className={cn("text-xs font-medium", trendColor)}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
        </span>
      )}
    </div>
  );
}
