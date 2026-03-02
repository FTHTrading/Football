"use client";

import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { getPercentileColor } from "@/lib/utils";

interface RadialGaugeProps {
  label: string;
  value: number;
  maxValue?: number;
  size?: number;
}

export default function RadialGauge({
  label,
  value,
  maxValue = 100,
  size = 180,
}: RadialGaugeProps) {
  const percent = Math.round((value / maxValue) * 100);
  const color = getPercentileColor(percent);

  const data = [
    {
      name: label,
      value: percent,
      fill: color,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-2"
    >
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="75%"
            outerRadius="100%"
            data={data}
            startAngle={225}
            endAngle={-45}
            barSize={8}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "#1A1A1A" }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color }}
          >
            {percent}
          </span>
          <span className="text-[10px] tracking-widest uppercase text-uc-gray-400">
            %ile
          </span>
        </div>
      </div>

      <span className="text-xs tracking-[0.2em] uppercase text-uc-gray-400">
        {label}
      </span>
    </motion.div>
  );
}
