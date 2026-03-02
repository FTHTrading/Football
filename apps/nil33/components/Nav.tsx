"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/product", label: "Product" },
  { href: "/collectives", label: "Collectives" },
  { href: "/pricing", label: "Pricing" },
  { href: "/developers", label: "Developers" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/90 backdrop-blur-xl border-b border-nil-border/60">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center group-hover:bg-nil-green/15 transition-colors">
            <span className="text-nil-green font-bold text-sm font-mono">33</span>
          </div>
          <span className="text-nil-white font-semibold tracking-tight text-[15px]">NIL33</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] px-3 py-1.5 rounded-md transition-colors hidden sm:block ${
                path === l.href
                  ? "text-nil-white bg-nil-white/[0.06]"
                  : "text-nil-muted hover:text-nil-white hover:bg-nil-white/[0.04]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className={`text-[13px] font-semibold px-4 py-1.5 rounded-lg transition-all ml-2 ${
              path === "/demo"
                ? "bg-nil-white text-nil-black"
                : "bg-nil-green text-nil-black hover:bg-nil-green/90"
            }`}
          >
            Try Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
