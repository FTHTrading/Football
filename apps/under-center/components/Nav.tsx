"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", anchor: false },
  { href: "/rankings", label: "Rankings", anchor: false },
  { href: "/compare", label: "Compare", anchor: false },
  { href: "/board", label: "Board", anchor: false },
  { href: "/lab", label: "DNA Lab", anchor: false },
  { href: "/methodology", label: "Methodology", anchor: false },
  { href: "/watchlist", label: "Watchlist", anchor: false },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close drawer on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-uc-black/90 backdrop-blur-xl border-b border-uc-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-sm">UC</span>
            </div>
            <span className="text-uc-white font-semibold tracking-tight">
              Under Center
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.filter(l => l.href !== "/").map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${
                  isActive(l.href)
                    ? "text-uc-gold"
                    : "text-uc-muted hover:text-uc-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <button className="text-sm bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-4 py-1.5 rounded-lg hover:bg-uc-gold/20 transition-colors cursor-pointer">
              Request Invite
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`absolute w-5 h-[1.5px] bg-uc-white transition-all duration-300 ${
                open ? "rotate-45 translate-y-0" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute w-5 h-[1.5px] bg-uc-white transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute w-5 h-[1.5px] bg-uc-white transition-all duration-300 ${
                open ? "-rotate-45 translate-y-0" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-45 w-72 bg-uc-dark border-l border-uc-border transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 45 }}
      >
        <div className="flex flex-col p-6 gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-uc-gold/10 text-uc-gold"
                  : "text-uc-light hover:bg-uc-panel hover:text-uc-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-uc-border">
            <button className="w-full text-sm bg-uc-gold text-black font-semibold px-4 py-3 rounded-xl hover:bg-uc-gold/90 transition-colors cursor-pointer">
              Request Invite
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
