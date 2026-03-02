"use client";

import React from "react";

interface NIL33LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export function NIL33Logo({ size = "md", className = "" }: NIL33LogoProps) {
  return (
    <span
      className={`font-black tracking-tighter ${SIZES[size]} ${className}`}
    >
      <span style={{ color: "#00ff88" }}>NIL</span>
      <span style={{ color: "#ffffff" }}>33</span>
    </span>
  );
}
