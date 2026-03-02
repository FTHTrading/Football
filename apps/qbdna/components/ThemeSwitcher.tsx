"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, ChevronDown } from "lucide-react";
import { useThemeStore, THEMES, type ThemeId } from "@/lib/theme-store";

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const ref = useRef<HTMLDivElement>(null);

  const current = THEMES.find((t) => t.id === theme)!;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase
          bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15]
          text-uc-gray-400 hover:text-white transition-all duration-200"
        title="Switch visual theme"
      >
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: current.accent }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: current.accentAlt }} />
        </div>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden
              shadow-2xl shadow-black/50 z-[999]"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="px-4 pt-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gray-500">
                <Palette size={10} /> Visual Theme
              </div>
            </div>

            <div className="p-2 space-y-0.5">
              {THEMES.map((t) => {
                const active = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as ThemeId);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                      active
                        ? "bg-white/[0.08] border border-white/[0.1]"
                        : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-1 flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: t.accent }} />
                      <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: t.accentAlt }} />
                    </div>

                    {/* Label & description */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${active ? "text-white" : "text-gray-300"}`}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{t.description}</p>
                    </div>

                    {/* Check */}
                    {active && <Check size={14} className="text-green-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-2 border-t border-white/[0.06]">
              <p className="text-[9px] text-gray-600 text-center">
                Preview different visual styles · Colors swap in real time
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
