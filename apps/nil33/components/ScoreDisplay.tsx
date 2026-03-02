interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 6, label }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 99) * circumference;

  const color =
    score >= 75 ? "var(--color-nil-green)" :
    score >= 50 ? "var(--color-nil-cyan)" :
    score >= 30 ? "var(--color-nil-gold)" :
    "var(--color-nil-red)";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-nil-border)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Score number overlay */}
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="font-mono text-3xl font-bold text-nil-white">{score}</span>
        <span className="text-nil-muted text-[10px] uppercase tracking-wider">/99</span>
      </div>
      {label && <span className="text-nil-muted text-xs">{label}</span>}
    </div>
  );
}

/* ─── Horizontal score bar ─── */
interface ScoreBarProps {
  label: string;
  value: number;
  color?: string;
}

export function ScoreBar({ label, value, color = "var(--color-nil-green)" }: ScoreBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-nil-muted text-xs w-20 capitalize shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-nil-border/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-nil-text font-mono text-xs w-7 text-right">{value}</span>
    </div>
  );
}
