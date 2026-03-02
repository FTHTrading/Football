"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dna } from "lucide-react";

const navLinks = [
  { href: "/search", label: "QBs" },
  { href: "/nil", label: "NIL" },
  { href: "/card-generator", label: "Card Lab" },
  { href: "/demo", label: "Demo" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider uppercase text-uc-gray-400 hover:text-uc-cyan transition-colors duration-250"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/pricing"
            className="px-5 py-2 rounded-lg text-sm font-semibold tracking-wider uppercase bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.2)] transition-all duration-250"
          >
            Get Verified
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
              <div className="border-t border-white/5 pt-3">
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex px-5 py-2 rounded-lg text-sm font-semibold tracking-wider uppercase bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20"
                >
                  Get Verified
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
