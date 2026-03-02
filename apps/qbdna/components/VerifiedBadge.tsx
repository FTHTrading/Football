"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { wrapper: "px-2.5 py-1 text-[10px]", icon: 12 },
  md: { wrapper: "px-4 py-1.5 text-xs", icon: 14 },
  lg: { wrapper: "px-5 py-2 text-sm", icon: 18 },
};

export default function VerifiedBadge({
  size = "md",
  className,
}: VerifiedBadgeProps) {
  const s = sizes[size];

  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 12px rgba(0,194,255,0.2)",
          "0 0 24px rgba(0,194,255,0.4)",
          "0 0 12px rgba(0,194,255,0.2)",
        ],
      }}
      transition={{ repeat: Infinity, duration: 3 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold tracking-[0.15em] uppercase",
        "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30",
        s.wrapper,
        className
      )}
    >
      <ShieldCheck size={s.icon} />
      <span>Verified</span>
    </motion.div>
  );
}
