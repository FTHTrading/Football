"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/product", label: "Product" },
  { href: "/athletes", label: "Athletes" },
  { href: "/collectives", label: "Collectives" },
  { href: "/developers", label: "Developers" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [path]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-nil-black/95 backdrop-blur-2xl border-b border-nil-border/60 shadow-[0_1px_20px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group relative z-50">
            <div className="w-9 h-9 rounded-xl bg-nil-green/10 border border-nil-green/25 flex items-center justify-center group-hover:bg-nil-green/20 group-hover:border-nil-green/40 transition-all group-hover:shadow-[0_0_20px_rgba(0,255,136,0.12)]">
              <span className="text-nil-green font-extrabold text-sm font-mono">33</span>
            </div>
            <div className="flex flex-col">
              <span className="text-nil-white font-bold tracking-tight text-[15px] leading-tight">NIL33</span>
              <span className="text-nil-muted text-[9px] tracking-[0.12em] uppercase leading-tight hidden sm:block">Capital Discipline</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  path === l.href
                    ? "text-nil-white bg-nil-white/[0.08] font-medium"
                    : "text-nil-muted hover:text-nil-white hover:bg-nil-white/[0.04]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/demo"
              className={`text-[13px] font-bold px-5 py-2 rounded-xl transition-all ml-3 ${
                path === "/demo"
                  ? "bg-nil-white text-nil-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  : "bg-nil-green text-nil-black hover:bg-nil-green/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              }`}
            >
              Score a Deal
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-[2px] bg-nil-white transition-all duration-300 ${open ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`w-5 h-[2px] bg-nil-white transition-all duration-300 ${open ? "opacity-0 scale-0" : ""}`} />
            <span className={`w-5 h-[2px] bg-nil-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-nil-black/98 backdrop-blur-2xl" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-3 p-8">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-2xl font-semibold py-3 px-6 rounded-2xl transition-all animate-fade-up ${
                  path === l.href
                    ? "text-nil-green"
                    : "text-nil-white hover:text-nil-green"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/demo"
              className="mt-6 bg-nil-green text-nil-black font-bold text-lg px-8 py-3.5 rounded-2xl animate-fade-up hover:bg-nil-green/90 transition-colors"
              style={{ animationDelay: `${links.length * 60}ms` }}
            >
              Score a Deal →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
