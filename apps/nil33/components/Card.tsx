import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  /** Accent color for top border — use nil-green, nil-cyan, nil-purple, nil-gold */
  accent?: string;
}

export default function Card({ children, className = "", hover, accent }: CardProps) {
  return (
    <div
      className={`
        bg-nil-dark/60 border border-nil-border/60 rounded-2xl p-6 sm:p-8
        ${hover ? "hover:border-nil-border transition-colors" : ""}
        ${className}
      `}
      style={accent ? { borderTopColor: accent, borderTopWidth: "2px" } : undefined}
    >
      {children}
    </div>
  );
}

/* ─── Feature card with icon/number ─── */
interface FeatureCardProps {
  number?: string;
  numberColor?: string;
  title: string;
  description: string;
  detail?: string;
  children?: ReactNode;
}

export function FeatureCard({ number, numberColor = "var(--color-nil-green)", title, description, detail, children }: FeatureCardProps) {
  return (
    <Card hover className="flex flex-col">
      {number && (
        <span className="font-mono text-sm font-bold mb-4" style={{ color: numberColor }}>
          {number}
        </span>
      )}
      <h3 className="text-nil-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-nil-muted text-sm leading-relaxed flex-1">{description}</p>
      {detail && (
        <p className="mt-4 font-mono text-sm text-nil-text/50 bg-nil-black/40 rounded-lg px-4 py-2.5 border border-nil-border/30">
          {detail}
        </p>
      )}
      {children}
    </Card>
  );
}
