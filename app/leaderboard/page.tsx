"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import { calculateQBIndex, getQBIndexTier, type QBIndexInput } from "@/lib/qb-index";
import { computeGAI } from "@/lib/genome-activation-index";
import { formatVelocity } from "@/lib/utils";
import {
  Trophy,
  TrendingUp,
  ChevronRight,
  Shield,
  ShieldCheck,
  Crown,
  Flame,
} from "lucide-react";

function metricsToIndexInput(m: {
  velocity: number;
  releaseTime: number;
  accuracy: number;
  mechanics: number;
  decisionSpeed: number;
}): QBIndexInput {
  return {
    velocity: m.velocity,
    releaseTime: m.releaseTime,
    accuracy: m.accuracy,
    mechanics: m.mechanics,
    footwork: m.mechanics * 0.9, // derived estimate
    poise: m.decisionSpeed,
    fieldVision: m.decisionSpeed * 0.95,
    clutchFactor: (m.accuracy + m.decisionSpeed) / 2,
  };
}

export default function LeaderboardPage() {
  const ranked = useMemo(() => {
    const withIndex = PLACEHOLDER_ATHLETES.map((a) => {
      const gaiResult = computeGAI(a.metrics);
      return {
        ...a,
        qbIndex: calculateQBIndex(metricsToIndexInput(a.metrics)),
        gai: gaiResult.gai,
        gaiTier: gaiResult.tier,
        gaiTierColor: gaiResult.tierColor,
      };
    });

    return withIndex
      .sort((a, b) => b.gai - a.gai)
      .map((a, i) => ({ ...a, rank: i + 1 }));
  }, []);

  const allScores = ranked.map((a) => a.qbIndex);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] tracking-[0.3em] uppercase text-uc-cyan border border-uc-cyan/20 mb-6">
            <Trophy size={12} />
            National Rankings
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">QB Index</span>{" "}
            <span className="text-uc-silver">Leaderboard</span>
          </h1>
          <p className="text-uc-gray-400 max-w-xl mx-auto">
            Ranked by Genome Activation Index (GAI). The unified score that fuses
            base talent, activation state, growth trajectory, and program fit.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { label: "Elite", color: "#00FF88", range: "90+" },
            { label: "Premium", color: "#00C2FF", range: "80-89" },
            { label: "Verified", color: "#FFD700", range: "70-79" },
            { label: "Developing", color: "#C0C0C0", range: "60-69" },
          ].map((tier) => (
            <div
              key={tier.label}
              className="flex items-center gap-2 text-xs text-uc-gray-400"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="font-semibold" style={{ color: tier.color }}>
                {tier.label}
              </span>
              <span className="text-uc-gray-600">({tier.range})</span>
            </div>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {ranked.map((athlete, i) => {
            const isTop3 = athlete.rank <= 3;

            return (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={`/athlete/${athlete.id}`}
                  className={`block glass rounded-xl p-5 hover:bg-white/[0.03] transition-all group ${
                    isTop3
                      ? "border border-white/10 hover:border-uc-cyan/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* Rank */}
                    <div className="w-12 text-center flex-shrink-0">
                      {athlete.rank === 1 ? (
                        <Crown
                          size={28}
                          className="mx-auto"
                          style={{ color: "#FFD700" }}
                        />
                      ) : athlete.rank === 2 ? (
                        <Crown
                          size={24}
                          className="mx-auto"
                          style={{ color: "#C0C0C0" }}
                        />
                      ) : athlete.rank === 3 ? (
                        <Crown
                          size={22}
                          className="mx-auto"
                          style={{ color: "#CD7F32" }}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-uc-gray-600 font-mono">
                          {athlete.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold gradient-text">
                        {athlete.name[0]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm truncate">
                          {athlete.name}
                        </h3>
                        {athlete.verified && (
                          <ShieldCheck
                            size={14}
                            className="text-uc-cyan flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-uc-gray-400">
                        <span>{athlete.school}</span>
                        <span>·</span>
                        <span>Class of {athlete.gradYear}</span>
                        <span>·</span>
                        <span>{athlete.state}</span>
                      </div>
                    </div>

                    {/* Metrics summary */}
                    <div className="hidden md:flex items-center gap-6 text-xs">
                      <div className="text-center">
                        <p className="font-mono font-bold text-uc-cyan">
                          {formatVelocity(athlete.metrics.velocity)}
                        </p>
                        <p className="text-[9px] text-uc-gray-500 uppercase tracking-wider">
                          Vel
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono font-bold">
                          {athlete.metrics.accuracy}%
                        </p>
                        <p className="text-[9px] text-uc-gray-500 uppercase tracking-wider">
                          Acc
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono font-bold">
                          {athlete.metrics.releaseTime}s
                        </p>
                        <p className="text-[9px] text-uc-gray-500 uppercase tracking-wider">
                          Rel
                        </p>
                      </div>
                    </div>

                    {/* QB Index score + GAI */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-mono font-bold text-uc-gray-400">
                          {athlete.qbIndex}
                        </p>
                        <p className="text-[8px] text-uc-gray-500 uppercase tracking-wider">
                          QBI
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-3xl font-black font-mono"
                          style={{ color: athlete.gaiTierColor }}
                        >
                          {athlete.gai}
                        </p>
                        <p
                          className="text-[9px] font-bold tracking-[0.2em] uppercase"
                          style={{ color: athlete.gaiTierColor, opacity: 0.7 }}
                        >
                          {athlete.gaiTier}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-uc-gray-600 group-hover:text-uc-cyan transition-colors"
                      />
                    </div>
                  </div>

                  {/* Index bar */}
                  <div className="mt-3 ml-[7.5rem] mr-16 hidden md:block">
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${athlete.gai}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${athlete.gaiTierColor}40, ${athlete.gaiTierColor})`,
                          boxShadow: `0 0 10px ${athlete.gaiTierColor}40`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-uc-gray-400 mb-6 text-sm">
            Only verified athletes appear on the leaderboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.3)] transition-all"
          >
            <Flame size={16} />
            Get Verified & Rank Up
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
