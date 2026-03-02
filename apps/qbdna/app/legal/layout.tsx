import Link from "next/link";
import { Scale } from "lucide-react";

const LEGAL_NAV = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/data-processing", label: "Data Processing" },
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Legal Nav */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-white/5">
          <Link
            href="/legal/terms"
            className="flex items-center gap-2 text-xs text-uc-gray-400 hover:text-white transition"
          >
            <Scale size={12} className="text-uc-cyan" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-uc-gray-400">
              Legal
            </span>
          </Link>
          <span className="text-uc-gray-600">|</span>
          {LEGAL_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-wider uppercase text-uc-gray-500 hover:text-uc-cyan transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
