"use client";

import Link from "next/link";
import { useState } from "react";

const footerLinks = {
  Platform: [
    { href: "/rankings", label: "Rankings" },
    { href: "/compare", label: "Compare" },
    { href: "/board", label: "Prospect Board" },
    { href: "/lab", label: "DNA Lab" },
  ],
  Resources: [
    { href: "/methodology", label: "Methodology" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "#", label: "API (Coming Soon)" },
  ],
  Company: [
    { href: "#", label: "About" },
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Contact" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-uc-border bg-uc-dark/50">
      {/* Newsletter banner */}
      <div className="border-b border-uc-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-uc-white mb-1">
              Stay ahead of the board
            </h3>
            <p className="text-sm text-uc-muted max-w-md">
              Weekly scouting intel, DNA score updates, and prospect alerts.
              Delivered every Tuesday.
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 bg-uc-green/10 border border-uc-green/20 rounded-xl px-5 py-3">
              <svg
                className="w-4 h-4 text-uc-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-uc-green font-medium">
                You&apos;re on the list
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="flex-1 md:w-64 bg-uc-panel border border-uc-border rounded-xl px-4 py-2.5 text-sm text-uc-white placeholder:text-uc-muted focus:outline-none focus:border-uc-gold/40 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-uc-gold text-black font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-uc-gold/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Link grid + logo */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
                <span className="text-uc-gold font-bold text-xs">UC</span>
              </div>
              <span className="text-uc-white font-medium text-sm">
                Under Center
              </span>
            </div>
            <p className="text-xs text-uc-muted leading-relaxed max-w-[200px]">
              The verified quarterback intelligence platform. Every number
              earned. Every metric proven.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              {["X", "IG", "YT"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-uc-panel border border-uc-border flex items-center justify-center text-[10px] font-bold text-uc-muted hover:text-uc-gold hover:border-uc-gold/20 transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-uc-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-uc-muted hover:text-uc-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-uc-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-uc-muted">
            © {new Date().getFullYear()} Under Center. All rights reserved.
          </p>
          <p className="text-[10px] text-uc-muted/60">
            Built with verified data. Not affiliated with NCAA or any
            institution.
          </p>
        </div>
      </div>
    </footer>
  );
}
