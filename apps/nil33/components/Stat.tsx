interface StatProps {
  value: string;
  label: string;
  color?: string;
}

export default function Stat({ value, label, color }: StatProps) {
  return (
    <div className="text-center">
      <p className="font-mono text-4xl sm:text-5xl font-bold" style={{ color: color || "var(--color-nil-white)" }}>
        {value}
      </p>
      <p className="text-nil-muted text-xs uppercase tracking-wider mt-2">{label}</p>
    </div>
  );
}

/* ─── Inline stat (key-value on one line) ─── */
interface InlineStatProps {
  label: string;
  value: string;
  valueColor?: string;
}

export function InlineStat({ label, value, valueColor }: InlineStatProps) {
  return (
    <div className="flex items-baseline justify-between py-2.5">
      <span className="text-nil-muted text-sm">{label}</span>
      <span className="font-mono font-bold" style={{ color: valueColor || "var(--color-nil-white)" }}>
        {value}
      </span>
    </div>
  );
}
