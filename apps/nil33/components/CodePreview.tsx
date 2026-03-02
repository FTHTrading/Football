import { ReactNode } from "react";

interface CodePreviewProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function CodePreview({ title, children, className = "" }: CodePreviewProps) {
  return (
    <div className={`bg-nil-black border border-nil-border/60 rounded-2xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-nil-border/40 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-nil-red/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-nil-gold/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-nil-green/40" />
          </div>
          <span className="text-nil-muted/60 text-[11px] font-mono ml-2">{title}</span>
        </div>
      )}
      <div className="p-5 sm:p-6 font-mono text-sm text-nil-text leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

/* ─── Key-value data display (like receipts, outputs) ─── */
interface DataRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

export function DataRow({ label, value, mono = true }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-nil-muted text-sm">{label}</span>
      <span className={`text-nil-white text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

/* ─── Divider for data displays ─── */
export function DataDivider() {
  return <div className="h-px bg-nil-border/40 my-1" />;
}
