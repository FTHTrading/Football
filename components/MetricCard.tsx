"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  delay?: number;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  numericValue,
  suffix = "",
  delay = 0,
  className,
}: MetricCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    numericValue && numericValue % 1 !== 0 ? v.toFixed(1) : Math.round(v).toString()
  );
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (numericValue !== undefined) {
      const controls = animate(count, numericValue, {
        duration: 2,
        ease: "easeOut",
        delay: delay + 0.3,
      });
      return controls.stop;
    }
  }, [numericValue, count, delay]);

  useEffect(() => {
    if (numericValue === undefined || !displayRef.current) return;
    const unsub = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${v}${suffix}`;
      }
    });
    return unsub;
  }, [rounded, suffix, numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 30px rgba(0,194,255,0.3)",
      }}
      className={cn(
        "glass glow rounded-2xl p-6 min-w-[200px] cursor-default light-sweep",
        className
      )}
    >
      <p className="text-xs tracking-[0.25em] uppercase text-uc-gray-400 mb-2">
        {label}
      </p>
      {numericValue !== undefined ? (
        <span
          ref={displayRef}
          className="text-3xl font-bold text-uc-white"
        >
          0{suffix}
        </span>
      ) : (
        <p className="text-3xl font-bold text-uc-white">{value}</p>
      )}
    </motion.div>
  );
}
