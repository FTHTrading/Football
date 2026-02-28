"use client";

import { motion } from "framer-motion";
import { cn, getPercentileColor } from "@/lib/utils";

interface PercentileBarProps {
  label: string;
  percentile: number;
  delay?: number;
}

export default function PercentileBar({
  label,
  percentile,
  delay = 0,
}: PercentileBarProps) {
  const color = getPercentileColor(percentile);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs tracking-[0.2em] uppercase text-uc-gray-400">
          {label}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color }}
        >
          {percentile}th
        </span>
      </div>
      <div className="w-full h-2 bg-uc-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{
            duration: 1.2,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={cn("h-full rounded-full")}
          style={{
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
