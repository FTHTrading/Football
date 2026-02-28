"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dna, ChevronDown } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Discover QBs" },
  { href: "/leaderboard", label: "QB Index" },
  { href: "/genome", label: "Genome" },
  { href: "/compare", label: "Compare" },
  { href: "/combine", label: "Combine" },
  { href: "/draft", label: "Big Board" },
  { href: "/film-room", label: "Film Room" },
  { href: "/highlights", label: "Highlights" },
  { href: "/lab", label: "Genome Lab" },
  { href: "/portal", label: "Portal" },
  { href: "/awards", label: "Awards" },
  { href: "/coach", label: "Coach Hub" },
  { href: "/gameday", label: "Game Day" },
  { href: "/stats", label: "Stats" },
  { href: "/offers", label: "Offers" },
  { href: "/map", label: "Map" },
  { href: "/community", label: "Community" },
  { href: "/training", label: "Training" },
  { href: "/analytics", label: "Analytics" },
  { href: "/nil", label: "NIL Market" },
  { href: "/board", label: "Board" },
  { href: "/scout", label: "Scout" },
  { href: "/collectibles", label: "Collectibles" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  /* Show first 6 links, rest go into "More" dropdown on desktop */
  const primaryLinks = navLinks.slice(0, 6);
  const moreLinks = navLinks.slice(6);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Dna className="w-6 h-6 text-uc-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.6)] transition-all duration-300" />
          <span className="text-lg font-bold tracking-[0.2em] uppercase gradient-text-dna">
            Under Center
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider uppercase text-uc-gray-400 hover:text-uc-cyan transition-colors duration-250"
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 text-sm tracking-wider uppercase text-uc-gray-400 hover:text-uc-cyan transition-colors duration-250"
            >
              More
              <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-2 w-44 py-2 rounded-xl glass-heavy border border-white/5 shadow-2xl"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm tracking-wider uppercase text-uc-gray-400 hover:text-uc-cyan hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/5 my-1" />
                  <Link
                    href="/pricing"
                    className="block px-4 py-2 text-sm tracking-wider uppercase text-uc-green hover:bg-uc-green/5 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/card-generator"
                    className="block px-4 py-2 text-sm tracking-wider uppercase text-uc-cyan hover:bg-uc-cyan/5 transition-colors"
                  >
                    Card Lab
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeSwitcher />

          <Link
            href="/pricing"
            className="px-5 py-2 rounded-lg text-sm font-semibold tracking-wider uppercase bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.2)] transition-all duration-250"
          >
            Get Decoded
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-uc-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-heavy border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm tracking-wider uppercase text-uc-gray-400 hover:text-uc-cyan transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/5 pt-3 flex flex-col gap-3">
                <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-uc-green hover:text-uc-green/80">
                  Pricing
                </Link>
                <Link href="/card-generator" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-uc-cyan hover:text-uc-cyan/80">
                  Card Lab
                </Link>
                <div className="pt-2">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
