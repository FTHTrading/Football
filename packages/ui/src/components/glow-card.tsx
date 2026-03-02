"use client";

import React from "react";
import { cn } from "../utils";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

export function GlowCard({
  children,
  glowColor = "#00ff88",
  className,
  onClick,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: glowColor }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
