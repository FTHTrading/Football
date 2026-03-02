"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import CardCanvas from "@/components/CardCanvas";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import { formatVelocity, formatReleaseTime, getSpinRateTier } from "@/lib/utils";
import { computeGAI } from "@/lib/genome-activation-index";
import { Dna } from "lucide-react";

function CardGeneratorContent() {
  const searchParams = useSearchParams();
  const athleteId = searchParams.get("athlete") || "1";
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === athleteId) || PLACEHOLDER_ATHLETES[0];

  const [theme, setTheme] = useState<"dark" | "holographic" | "dna">("dark");
  const [selectedAthleteId, setSelectedAthleteId] = useState(athleteId);

  const currentAthlete =
    PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthleteId) || athlete;

  const gaiResult = computeGAI(currentAthlete.metrics);
  const genomeScore = gaiResult.gai;

  const baseMetrics = [
    { label: "Throw Velocity", value: formatVelocity(currentAthlete.metrics.velocity) },
    { label: "Release Time", value: formatReleaseTime(currentAthlete.metrics.releaseTime) },
    { label: "Spin Rate", value: getSpinRateTier(currentAthlete.metrics.spinRate) },
  ];

  const dnaMetrics = [
    { label: "Arm Velocity", value: formatVelocity(currentAthlete.metrics.velocity) },
    { label: "Release Seq.", value: formatReleaseTime(currentAthlete.metrics.releaseTime) },
    { label: "Spin Rate", value: getSpinRateTier(currentAthlete.metrics.spinRate) },
    { label: "Mechanics", value: `${currentAthlete.metrics.mechanics}/100` },
    { label: "Accuracy", value: `${currentAthlete.metrics.accuracy}%` },
    { label: "Decision Speed", value: `${currentAthlete.metrics.decisionSpeed}/100` },
  ];

  const metrics = theme === "dna" ? dnaMetrics : baseMetrics;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4">
            <Dna size={12} />
            Card Lab
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text-dna">Decoded Card Generator</span>
          </h1>
          <p className="text-uc-gray-400 max-w-md mx-auto">
            Generate your genome-decoded quarterback card.
            Choose your strand style and share it everywhere.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-72 flex flex-col gap-6"
          >
            {/* Select Athlete */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                Select Athlete
              </label>
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors"
              >
                {PLACEHOLDER_ATHLETES.filter((a) => a.verified).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                Card Theme
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { key: "dark", label: "Dark" },
                    { key: "holographic", label: "Holo" },
                    { key: "dna", label: "DNA" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all ${
                      theme === t.key
                        ? t.key === "dna"
                          ? "bg-uc-green/15 text-uc-green border border-uc-green/30"
                          : "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                        : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genome Score (DNA theme) */}
            {theme === "dna" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5 border-uc-green/10"
              >
                <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                  GAI · {gaiResult.tier}
                </label>
                <div className="text-center">
                  <p className="text-4xl font-black font-mono gradient-text-dna">{genomeScore}</p>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genomeScore}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs tracking-[0.15em] uppercase text-uc-gray-400 mb-3">How It Works</h3>
              <ul className="text-xs text-uc-gray-400 space-y-2 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-uc-cyan">1.</span>
                  Select a verified athlete
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">2.</span>
                  Choose your card strand
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">3.</span>
                  Download as high-res PNG
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">4.</span>
                  Share across socials
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CardCanvas
              athleteName={currentAthlete.name}
              metrics={metrics}
              rating={currentAthlete.rating}
              qbClass={currentAthlete.qbClass}
              verified={currentAthlete.verified}
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
