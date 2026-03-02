"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import CardCanvas from "@/components/CardCanvas";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import { formatVelocity, formatReleaseTime, getSpinRateTier, getMechanicsGrade } from "@/lib/utils";
import { computeGAI } from "@/lib/genome-activation-index";
import VerifiedBadge from "@/components/VerifiedBadge";
import { Dna, Sparkles, ArrowLeft, ChevronDown } from "lucide-react";

function CardGeneratorContent() {
  const searchParams = useSearchParams();
  const athleteId = searchParams.get("athlete") || "6";

  const [selectedAthleteId, setSelectedAthleteId] = useState(athleteId);
  const [theme, setTheme] = useState<"dark" | "holographic" | "dna">("dark");
  const [selectorOpen, setSelectorOpen] = useState(false);

  const athlete =
    PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthleteId) || PLACEHOLDER_ATHLETES[0];

  const gaiResult = computeGAI(athlete.metrics);
  const genomeScore = gaiResult.gai;

  const baseMetrics = [
    { label: "Throw Velocity", value: formatVelocity(athlete.metrics.velocity) },
    { label: "Release Time", value: formatReleaseTime(athlete.metrics.releaseTime) },
    { label: "Spin Rate", value: getSpinRateTier(athlete.metrics.spinRate) },
  ];

  const dnaMetrics = [
    { label: "Arm Velocity", value: formatVelocity(athlete.metrics.velocity) },
    { label: "Release Seq.", value: formatReleaseTime(athlete.metrics.releaseTime) },
    { label: "Spin Rate", value: getSpinRateTier(athlete.metrics.spinRate) },
    { label: "Mechanics", value: getMechanicsGrade(athlete.metrics.mechanics) },
    { label: "Accuracy", value: `${athlete.metrics.accuracy}%` },
    { label: "Decision Speed", value: `${athlete.metrics.decisionSpeed}/100` },
  ];

  const metrics = theme === "dna" ? dnaMetrics : baseMetrics;

  return (
    <main className="min-h-screen pt-20 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            <Dna size={12} />
            Verified Card Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">Generate Your</span>{" "}
            <span className="gradient-text">Verified Card</span>
          </h1>
          <p className="text-uc-gray-400 text-lg max-w-lg mx-auto">
            Three themes. One identity. Export Instagram-ready cards backed by verified data.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* ═══ LEFT: Controls ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-80 flex flex-col gap-6"
          >
            {/* Athlete Selector — visual dropdown */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 block mb-3 font-bold">
                Select Athlete
              </label>
              <div className="relative">
                <button
                  onClick={() => setSelectorOpen(!selectorOpen)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg p-3 flex items-center justify-between hover:border-uc-cyan/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center border border-white/10">
                      <span className="text-sm font-black text-uc-cyan">{athlete.name.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{athlete.name}</p>
                        {athlete.verified && <VerifiedBadge size="sm" />}
                      </div>
                      <p className="text-[9px] text-uc-gray-500">{athlete.school} · {athlete.qbClass}</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-uc-gray-400 transition-transform ${selectorOpen ? "rotate-180" : ""}`} />
                </button>

                {selectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-uc-surface rounded-lg border border-white/10 overflow-hidden z-50 shadow-2xl"
                  >
                    {PLACEHOLDER_ATHLETES.filter((a) => a.verified).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setSelectedAthleteId(a.id); setSelectorOpen(false); }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left ${
                          a.id === selectedAthleteId ? "bg-uc-cyan/5 border-l-2 border-l-uc-cyan" : ""
                        }`}
                      >
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-uc-cyan/15 to-uc-panel flex items-center justify-center border border-white/5">
                          <span className="text-xs font-black text-uc-cyan">{a.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold">{a.name}</p>
                          <p className="text-[8px] text-uc-gray-500">{a.school}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 block mb-3 font-bold">
                Card Theme
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { key: "dark", label: "Dark", icon: null },
                    { key: "holographic", label: "Holo", icon: Sparkles },
                    { key: "dna", label: "DNA", icon: Dna },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex flex-col items-center gap-1.5 ${
                      theme === t.key
                        ? t.key === "dna"
                          ? "bg-uc-green/15 text-uc-green border border-uc-green/30"
                          : t.key === "holographic"
                          ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                          : "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                        : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    {t.icon && <t.icon size={14} />}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Preview */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 block mb-3 font-bold">
                Card Data
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[8px] text-uc-gray-500 mb-0.5">Velocity</p>
                  <p className="text-sm font-bold font-mono text-uc-cyan">{athlete.metrics.velocity.toFixed(1)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[8px] text-uc-gray-500 mb-0.5">Release</p>
                  <p className="text-sm font-bold font-mono text-uc-cyan">{athlete.metrics.releaseTime.toFixed(2)}s</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[8px] text-uc-gray-500 mb-0.5">Mechanics</p>
                  <p className="text-sm font-bold font-mono text-uc-cyan">{getMechanicsGrade(athlete.metrics.mechanics)}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2.5">
                  <p className="text-[8px] text-uc-gray-500 mb-0.5">GAI</p>
                  <p className="text-sm font-bold font-mono" style={{ color: gaiResult.tierColor }}>{gaiResult.gai}</p>
                </div>
              </div>
              {theme === "dna" && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-uc-gray-500">Genome Tier</span>
                    <span className="text-xs font-bold" style={{ color: gaiResult.tierColor }}>{gaiResult.tier}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genomeScore}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* View Profile Link */}
            <Link
              href={`/athlete/${athlete.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass border border-white/10 text-sm text-uc-gray-400 hover:text-uc-cyan hover:border-uc-cyan/30 transition-all"
            >
              View Full Profile →
            </Link>

            {/* How It Works */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 mb-3 font-bold">How It Works</h3>
              <ul className="text-xs text-uc-gray-400 space-y-2 leading-relaxed">
                <li className="flex gap-2"><span className="text-uc-cyan font-mono">01</span> Select a verified athlete</li>
                <li className="flex gap-2"><span className="text-uc-cyan font-mono">02</span> Choose your card theme</li>
                <li className="flex gap-2"><span className="text-uc-cyan font-mono">03</span> Download as high-res PNG</li>
                <li className="flex gap-2"><span className="text-uc-cyan font-mono">04</span> Share across social platforms</li>
              </ul>
              <p className="text-[9px] text-uc-gray-600 mt-3">
                Exports at 1080 × 1350px · Instagram &amp; Twitter optimized
              </p>
            </div>
          </motion.div>

          {/* ═══ RIGHT: Live Card Preview ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <CardCanvas
              athleteName={athlete.name}
              metrics={metrics}
              rating={athlete.rating}
              qbClass={athlete.qbClass}
              verified={athlete.verified}
              theme={theme}
              genomeScore={theme === "dna" ? genomeScore : undefined}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function CardGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-16">
          <p className="text-uc-gray-400">Loading Card Lab...</p>
        </div>
      }
    >
      <CardGeneratorContent />
    </Suspense>
  );
}
