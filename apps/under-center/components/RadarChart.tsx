"use client";

import type { RadarPoint } from "@/lib/athletes";
import { useEffect, useRef, useState } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  SVG RADAR CHART                                              */
/*  Pure SVG — no dependencies                                   */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface RadarChartProps {
  data: RadarPoint[];
  color?: string;
  size?: number;
  /** Optional overlay dataset for comparison mode */
  overlay?: {
    data: RadarPoint[];
    color: string;
    label: string;
  };
  label?: string;
  animated?: boolean;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function RadarChart({
  data,
  color = "#d4a843",
  size = 280,
  overlay,
  label,
  animated = true,
}: RadarChartProps) {
  const [progress, setProgress] = useState(animated ? 0 : 1);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start: number;
          const duration = 800;
          const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setProgress(easeOutCubic(p));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const n = data.length;
  const angleStep = 360 / n;

  /* Ring levels */
  const rings = [0.25, 0.5, 0.75, 1.0];

  /* Build polygon path */
  const buildPath = (points: RadarPoint[], p: number) => {
    return points
      .map((pt, i) => {
        const r = (pt.value / 100) * maxR * p;
        const { x, y } = polarToCartesian(cx, cy, r, i * angleStep);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ") + " Z";
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Grid rings */}
        {rings.map((pct) => {
          const points = Array.from({ length: n })
            .map((_, i) => {
              const { x, y } = polarToCartesian(cx, cy, maxR * pct, i * angleStep);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={pct}
              points={points}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const { x, y } = polarToCartesian(cx, cy, maxR, i * angleStep);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Overlay data polygon (behind) */}
        {overlay && (
          <path
            d={buildPath(overlay.data, progress)}
            fill={`${overlay.color}15`}
            stroke={overlay.color}
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity={0.8}
          />
        )}

        {/* Primary data polygon */}
        <path
          d={buildPath(data, progress)}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {data.map((pt, i) => {
          const r = (pt.value / 100) * maxR * progress;
          const { x, y } = polarToCartesian(cx, cy, r, i * angleStep);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill={color}
              stroke="#050505"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Labels */}
        {data.map((pt, i) => {
          const { x, y } = polarToCartesian(cx, cy, maxR + 20, i * angleStep);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.45)"
              fontSize={10}
              fontWeight={600}
              fontFamily="var(--font-mono, monospace)"
            >
              {pt.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      {(label || overlay?.label) && (
        <div className="flex items-center gap-5 mt-3">
          {label && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="text-[11px] text-uc-muted">{label}</span>
            </div>
          )}
          {overlay?.label && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: overlay.color }} />
              <span className="text-[11px] text-uc-muted">{overlay.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
