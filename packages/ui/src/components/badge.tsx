"use client";

import React from "react";
import { cn } from "../utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  default: "bg-white/10 text-white border-white/20",
  success: "bg-green-500/10 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  pulse,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: "currentColor" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: "currentColor" }}
          />
        </span>
      )}
      {children}
    </span>
  );
}
