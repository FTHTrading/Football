"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

interface LegalAcceptanceProps {
  onAccept?: (accepted: boolean) => void;
  className?: string;
  compact?: boolean;
}

export default function LegalAcceptance({ onAccept, className = "", compact = false }: LegalAcceptanceProps) {
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted(e.target.checked);
    onAccept?.(e.target.checked);
  };

  return (
    <div className={`glass rounded-xl p-4 border border-white/[0.06] ${className}`}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleChange}
          className="mt-0.5 shrink-0 w-4 h-4 rounded border-white/20 bg-uc-surface text-uc-cyan focus:ring-uc-cyan/30 focus:ring-offset-0 accent-[#00C2FF]"
        />
        <div className="text-[11px] text-uc-gray-400 leading-relaxed">
          {compact ? (
            <span>
              I acknowledge that Under Center provides educational resources and tools only — not legal, tax, or financial advice.{" "}
              <Link href="/legal/terms" className="text-uc-cyan underline underline-offset-2">Terms</Link> &{" "}
              <Link href="/legal/disclaimer" className="text-uc-cyan underline underline-offset-2">Disclaimer</Link> apply.
            </span>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield size={12} className="text-uc-cyan" />
                <strong className="text-white text-[11px]">Acknowledgment Required</strong>
              </div>
              <span>
                I acknowledge that Under Center is a technology platform providing educational resources and workflow tools.
                This platform is not a law firm, athlete agency, brokerage, or compliance authority. Content and tools
                do not constitute legal, tax, or financial advice. I have read and agree to the{" "}
                <Link href="/legal/terms" className="text-uc-cyan underline underline-offset-2">Terms of Service</Link>,{" "}
                <Link href="/legal/privacy" className="text-uc-cyan underline underline-offset-2">Privacy Policy</Link>, and{" "}
                <Link href="/legal/disclaimer" className="text-uc-cyan underline underline-offset-2">Disclaimer</Link>.
              </span>
            </>
          )}
        </div>
      </label>
    </div>
  );
}
