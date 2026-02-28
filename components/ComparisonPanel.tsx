"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComparisonPanelProps {
  athleteName: string;
  comparisonPlayer: string;
  athleteMetrics: Record<string, number>;
  comparisonMetrics: Record<string, number>;
}

export default function ComparisonPanel({
  athleteName,
  comparisonPlayer,
  athleteMetrics,
  comparisonMetrics,
}: ComparisonPanelProps) {
  const metrics = Object.keys(athleteMetrics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 w-full"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 mb-1">
          Comparable Traits
        </p>
        <h3 className="text-lg font-bold">
          <span className="text-uc-cyan">{athleteName}</span>
          <span className="text-uc-gray-600 mx-3">vs</span>
          <span className="text-uc-silver">{comparisonPlayer}</span>
        </h3>
      </div>

      {/* Split Comparison */}
      <div className="flex flex-col gap-4">
        {metrics.map((metric, i) => {
          const aVal = athleteMetrics[metric];
          const cVal = comparisonMetrics[metric];
          const aWins = aVal >= cVal;

          return (
            <motion.div
              key={metric}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Athlete Value */}
              <div className="flex-1 text-right">
                <span
                  className={cn(
                    "text-lg font-bold font-mono",
                    aWins ? "text-uc-cyan" : "text-uc-gray-400"
                  )}
                >
                  {aVal}
                </span>
              </div>

              {/* Metric Label */}
              <div className="w-32 text-center">
                <span className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
                  {metric.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>

              {/* Comparison Value */}
              <div className="flex-1 text-left">
                <span
                  className={cn(
                    "text-lg font-bold font-mono",
                    !aWins ? "text-uc-silver" : "text-uc-gray-400"
                  )}
                >
                  {cVal}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
