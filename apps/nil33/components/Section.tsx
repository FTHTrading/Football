import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Dark alternating background */
  dark?: boolean;
}

export default function Section({ children, className = "", id, dark }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 sm:py-32 px-6 ${dark ? "bg-nil-dark/50 border-y border-nil-border/40" : ""} ${className}`}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}

/* ─── Section header pattern ─── */
interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({ overline, title, subtitle, center }: SectionHeaderProps) {
  return (
    <div className={`mb-16 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {overline && (
        <p className="text-nil-green text-[11px] font-semibold uppercase tracking-[0.15em] mb-3">
          {overline}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-nil-white tracking-tight leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-nil-muted text-[15px] leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
