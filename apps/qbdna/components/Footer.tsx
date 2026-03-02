import Link from "next/link";
import { Dna, Shield } from "lucide-react";

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Data Processing", href: "/legal/data-processing" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-uc-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Platform Role Banner */}
        <div className="flex items-start gap-3 mb-8 max-w-3xl">
          <Shield size={14} className="text-uc-cyan shrink-0 mt-0.5" />
          <p className="text-[10px] text-uc-gray-500 leading-relaxed">
            Under Center is a technology platform providing educational resources and workflow tools.
            We are not a law firm, athlete agency, brokerage, or compliance authority. Content does not constitute legal, tax, or financial advice.
          </p>
        </div>

        {/* Links + Brand */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] text-uc-gray-500 hover:text-uc-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <p className="text-[9px] text-uc-gray-700 mt-6">
          &copy; {new Date().getFullYear()} Under Center. All rights reserved. Educational use only.
        </p>
      </div>
    </footer>
  );
}
