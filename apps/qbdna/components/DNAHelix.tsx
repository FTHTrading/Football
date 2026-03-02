"use client";

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   DNAHelix — animated double-helix SVG
   Sizes: sm (80px), md (200px), lg (400px), full (100%)
   Can be used as page decoration, section backgrounds,
   or inline within athlete genome breakdowns.
───────────────────────────────────────────────── */

interface DNAHelixProps {
  size?: "sm" | "md" | "lg" | "full";
  orientation?: "vertical" | "horizontal";
  speed?: number;        // seconds per full cycle
  glowColor?: string;    // tailwind color or hex
  className?: string;
  basePairs?: number;    // how many rungs to draw
}

const SIZES = {
  sm: { width: 80, height: 200 },
  md: { width: 120, height: 400 },
  lg: { width: 160, height: 600 },
  full: { width: 160, height: 800 },
};

const BASE_PAIR_COLORS = [
  { left: "#00C2FF", right: "#00FF88" },   // cyan ↔ green (A-T)
  { left: "#A855F7", right: "#FACC15" },   // purple ↔ gold (C-G)
  { left: "#00C2FF", right: "#FF3B5C" },   // cyan ↔ red
  { left: "#00FF88", right: "#A855F7" },   // green ↔ purple
];

export default function DNAHelix({
  size = "md",
  orientation = "vertical",
  speed = 8,
  glowColor = "#00C2FF",
  className = "",
  basePairs = 12,
}: DNAHelixProps) {
  const dim = SIZES[size];
  const isHorizontal = orientation === "horizontal";
  const viewW = isHorizontal ? dim.height : dim.width;
  const viewH = isHorizontal ? dim.width : dim.height;

  // Generate helix path data
  const strandPoints = generateHelixPoints(basePairs, dim.width, dim.height);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className={`dna-helix-container ${className}`}
      style={{
        width: size === "full" ? "100%" : viewW,
        height: size === "full" ? "100%" : viewH,
        transform: isHorizontal ? "rotate(-90deg)" : undefined,
      }}
    >
      <svg
        viewBox={`0 0 ${dim.width} ${dim.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="dna-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strand gradients */}
          <linearGradient id="strand-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0" />
            <stop offset="15%" stopColor="#00C2FF" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#A855F7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strand-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0" />
            <stop offset="15%" stopColor="#00FF88" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#FACC15" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Animated group */}
        <g filter="url(#dna-glow)">
          {/* Left strand (backbone) */}
          <motion.path
            d={strandPoints.leftPath}
            stroke="url(#strand-left)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Right strand (backbone) */}
          <motion.path
            d={strandPoints.rightPath}
            stroke="url(#strand-right)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          />

          {/* Base pairs (rungs) */}
          {strandPoints.rungs.map((rung, i) => {
            const colors = BASE_PAIR_COLORS[i % BASE_PAIR_COLORS.length];
            return (
              <motion.line
                key={i}
                x1={rung.x1}
                y1={rung.y1}
                x2={rung.x2}
                y2={rung.y2}
                stroke={`url(#bp-grad-${i})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={0.6}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: [0, 0.7, 0.5], pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + i * 0.12,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {/* Base pair gradients */}
          {strandPoints.rungs.map((_, i) => {
            const colors = BASE_PAIR_COLORS[i % BASE_PAIR_COLORS.length];
            return (
              <defs key={`bp-defs-${i}`}>
                <linearGradient id={`bp-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colors.left} />
                  <stop offset="100%" stopColor={colors.right} />
                </linearGradient>
              </defs>
            );
          })}

          {/* Floating nucleotide particles */}
          {strandPoints.particles.map((p, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={p.color}
              opacity={0}
              animate={{
                opacity: [0, 0.8, 0],
                cy: [p.y, p.y - 20, p.y - 40],
                cx: [p.x, p.x + (Math.random() > 0.5 ? 8 : -8), p.x],
              }}
              transition={{
                duration: speed / 2,
                delay: p.delay,
                repeat: Infinity,
                repeatDelay: speed / 3,
              }}
            />
          ))}
        </g>

        {/* Pulsing center glow */}
        <motion.ellipse
          cx={dim.width / 2}
          cy={dim.height / 2}
          rx={30}
          ry={dim.height * 0.3}
          fill={glowColor}
          opacity={0}
          animate={{ opacity: [0, 0.04, 0] }}
          transition={{ duration: speed, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

/* ── Helix geometry generator ─────────────── */
function generateHelixPoints(
  pairs: number,
  width: number,
  height: number,
) {
  const cx = width / 2;
  const amplitude = width * 0.35;
  const step = height / (pairs + 1);
  const leftPoints: { x: number; y: number }[] = [];
  const rightPoints: { x: number; y: number }[] = [];
  const rungs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const particles: { x: number; y: number; r: number; color: string; delay: number }[] = [];

  for (let i = 0; i <= pairs; i++) {
    const t = (i / pairs) * Math.PI * 2;
    const y = step * (i + 0.5);
    const xL = cx + Math.sin(t) * amplitude;
    const xR = cx - Math.sin(t) * amplitude;

    leftPoints.push({ x: xL, y });
    rightPoints.push({ x: xR, y });

    // Base pair rungs at every point
    rungs.push({ x1: xL, y1: y, x2: xR, y2: y });

    // Random floating particles
    if (i % 3 === 0) {
      const colors = ["#00C2FF", "#00FF88", "#A855F7", "#FACC15"];
      particles.push({
        x: xL + (Math.random() - 0.5) * 10,
        y,
        r: 1.5 + Math.random() * 1.5,
        color: colors[i % colors.length],
        delay: i * 0.5,
      });
    }
  }

  // Build smooth SVG paths through the points
  const leftPath = buildSmoothPath(leftPoints);
  const rightPath = buildSmoothPath(rightPoints);

  return { leftPath, rightPath, rungs, particles };
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/* ─────────────────────────────────────────────
   DNAStrandDivider — horizontal DNA strand
   used as a section divider across pages
───────────────────────────────────────────────── */
export function DNAStrandDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-12 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="strand-h-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0" />
            <stop offset="20%" stopColor="#00C2FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#00FF88" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strand-h-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0" />
            <stop offset="20%" stopColor="#FACC15" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Top strand */}
        <motion.path
          d={generateHorizontalHelix(1200, 48, 14, true)}
          stroke="url(#strand-h-1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        {/* Bottom strand */}
        <motion.path
          d={generateHorizontalHelix(1200, 48, 14, false)}
          stroke="url(#strand-h-2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
        />
        {/* Rungs */}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = (1200 / 15) * (i + 1);
          const t = (i / 14) * Math.PI * 2;
          const y1 = 24 + Math.sin(t) * 14;
          const y2 = 24 - Math.sin(t) * 14;
          return (
            <motion.line
              key={i}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke="#00C2FF"
              strokeWidth="1"
              strokeOpacity="0.25"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.08 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function generateHorizontalHelix(w: number, h: number, waves: number, top: boolean): string {
  const cy = h / 2;
  const amp = h * 0.35;
  const step = w / (waves * 2);
  let d = `M 0 ${cy}`;
  for (let i = 0; i < waves * 2; i++) {
    const x = step * (i + 1);
    const y = cy + (top ? 1 : -1) * (i % 2 === 0 ? -amp : amp);
    const cpx = step * i + step / 2;
    d += ` Q ${cpx} ${y}, ${x} ${cy}`;
  }
  return d;
}

/* ─────────────────────────────────────────────
   DNABasePairLabel — a single "gene" label
   with animated helix connector, used in the
   QB Genome section on athlete profiles.
───────────────────────────────────────────────── */
interface BasePairLabelProps {
  label: string;       // e.g. "ARM VELOCITY GENE"
  value: string;       // e.g. "62.4 mph"
  code: string;        // e.g. "VEL-α"
  color: string;       // tailwind text color
  bgColor: string;     // tailwind bg color
  delay?: number;
}

export function DNABasePairLabel({
  label,
  value,
  code,
  color,
  bgColor,
  delay = 0,
}: BasePairLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="flex items-center gap-3 group"
    >
      {/* Nucleotide dot */}
      <div className="relative flex-shrink-0">
        <div className={`w-3 h-3 rounded-full ${bgColor} ring-2 ring-offset-2 ring-offset-uc-bg ${color.replace("text-", "ring-")}`} />
        <motion.div
          className={`absolute inset-0 w-3 h-3 rounded-full ${bgColor}`}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, delay }}
        />
      </div>

      {/* Connector strand */}
      <div className="w-8 h-px bg-gradient-to-r from-white/20 to-transparent relative">
        <motion.div
          className="absolute inset-0 h-px bg-gradient-to-r from-uc-cyan/40 to-transparent"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: delay + 0.5 }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* Gene info */}
      <div className="flex-1 flex items-center justify-between glass rounded-lg px-4 py-2.5 group-hover:border-white/10 transition-all">
        <div>
          <p className={`text-[9px] tracking-[0.3em] uppercase font-bold ${color}`}>{label}</p>
          <p className="text-sm font-bold font-mono mt-0.5">{value}</p>
        </div>
        <span className="text-[8px] font-mono text-uc-gray-600 tracking-wider">{code}</span>
      </div>
    </motion.div>
  );
}
