"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import { computeGAI, detectArchetype } from "@/lib/genome-activation-index";
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Dna,
  Zap,
  Target,
  Shield,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react";

/* ── Draft projection logic ── */
interface DraftProjection {
  athlete: Athlete;
  overallRank: number;
  positionRank: number;
  projectedRound: string;
  projectedPick: string;
  trend: "rising" | "steady" | "falling";
  trendDelta: number;
  scoutGrade: number;
  bestFit: string[];
  comparison: string;
  strengths: string[];
  concerns: string[];
  genomeScore: number;
  gaiTier: string;
  gaiTierColor: string;
  archetype: string;
}

function generateProjections(athletes: Athlete[]): DraftProjection[] {
  return athletes
    .map((a) => {
      const m = a.metrics;
      const gai = computeGAI(m);
      const genomeScore = gai.gai;
      const arch = detectArchetype(m);

      const seed = parseInt(a.id);

      // Strengths and concerns based on metrics
      const strengths: string[] = [];
      const concerns: string[] = [];
      if (m.velocity >= 60) strengths.push("Plus arm strength");
      if (m.accuracy >= 88) strengths.push("Elite accuracy");
      if (m.releaseTime <= 0.38) strengths.push("Lightning release");
      if (m.mechanics >= 90) strengths.push("Clean mechanics");
      if (m.decisionSpeed >= 88) strengths.push("Advanced processor");
      if (m.spinRate >= 650) strengths.push("Tight spiral");

      if (m.velocity < 57) concerns.push("Below-avg arm strength");
      if (m.releaseTime > 0.42) concerns.push("Slow release");
      if (m.mechanics < 82) concerns.push("Mechanical inconsistency");
      if (m.accuracy < 84) concerns.push("Accuracy limitations");
      if (strengths.length === 0) strengths.push("High upside");
      if (concerns.length === 0) concerns.push("Needs more film");

      // Best fit from GAI program profiles
      const bestFit = gai.bestFit ? [gai.bestFit.program.name] : ["TBD"];

      // Trend based on GAI tier
      const trends: Array<"rising" | "steady" | "falling"> = ["rising", "steady", "falling"];
      const trend = genomeScore >= 85 ? "rising" : genomeScore >= 70 ? trends[seed % 2] : trends[(seed + 1) % 3];
      const trendDelta = trend === "rising" ? (seed % 5) + 2 : trend === "falling" ? -((seed % 3) + 1) : 0;

      // Scout grade
      const scoutGrade = +(55 + genomeScore * 0.4 + (seed % 3)).toFixed(1);

      return {
        athlete: a,
        overallRank: 0,
        positionRank: 0,
        projectedRound: "",
        projectedPick: "",
        trend,
        trendDelta,
        scoutGrade: Math.min(scoutGrade, 97),
        bestFit,
        comparison: a.comparisonPlayer || "N/A",
        strengths: strengths.slice(0, 3),
        concerns: concerns.slice(0, 2),
        genomeScore,
        gaiTier: gai.tier,
        gaiTierColor: gai.tierColor,
        archetype: arch.name,
      };
    })
    .sort((a, b) => b.genomeScore - a.genomeScore)
    .map((p, i) => ({
      ...p,
      overallRank: i + 1,
      positionRank: i + 1,
      projectedRound: i < 2 ? "1st Round" : i < 4 ? "2nd Round" : "3rd Round",
      projectedPick: i < 2 ? `Top ${5 + i * 3}` : i < 4 ? `#${32 + i * 6}` : `#${64 + i * 8}`,
    }));
}

/* ── Draft Card ── */
function DraftCard({ projection, index }: { projection: DraftProjection; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const a = projection.athlete;

  const TrendIcon = projection.trend === "rising" ? TrendingUp : projection.trend === "falling" ? TrendingDown : Minus;
  const trendColor = projection.trend === "rising" ? "#00FF88" : projection.trend === "falling" ? "#FF3B5C" : "#C0C0C0";

  const rankColor =
    projection.overallRank === 1 ? "#FFD700" :
    projection.overallRank === 2 ? "#C0C0C0" :
    projection.overallRank === 3 ? "#CD7F32" : "#00C2FF";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 * index }}
      className="glass rounded-xl overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Rank stripe */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${rankColor}, transparent)` }} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Rank badge */}
          <div className="relative shrink-0">
            <div
              className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border"
              style={{
                borderColor: rankColor + "40",
                background: rankColor + "08",
              }}
            >
              <span className="text-[7px] text-uc-gray-500 uppercase tracking-wider">Rank</span>
              <span className="text-xl font-black font-mono" style={{ color: rankColor }}>
                {projection.overallRank}
              </span>
            </div>
            {projection.overallRank <= 3 && (
              <Trophy size={10} className="absolute -top-1 -right-1" style={{ color: rankColor }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/athlete/${a.id}`}
                className="text-base font-bold hover:text-uc-cyan transition-colors"
              >
                {a.name}
              </Link>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-uc-gray-400 font-mono">
                {a.qbClass}
              </span>
              <div className="flex items-center gap-1 ml-auto" style={{ color: trendColor }}>
                <TrendIcon size={12} />
                <span className="text-[9px] font-bold">
                  {projection.trend === "rising" ? `+${projection.trendDelta}` : projection.trend === "falling" ? projection.trendDelta : "—"}
                </span>
              </div>
            </div>

            <p className="text-[9px] text-uc-gray-500 mb-3">
              {a.height} · {a.weight}lbs · {a.school} · {a.state} · {a.rating}★ · Class of {a.gradYear}
            </p>

            {/* Key Stats Row */}
            <div className="flex items-center gap-5 mb-3">
              <div>
                <p className="text-[6px] text-uc-gray-600 uppercase tracking-wider">GAI</p>
                <p className="text-lg font-black font-mono" style={{ color: projection.gaiTierColor }}>{projection.genomeScore}</p>
                <p className="text-[7px] font-bold" style={{ color: projection.gaiTierColor }}>{projection.gaiTier}</p>
              </div>
              <div>
                <p className="text-[6px] text-uc-gray-600 uppercase tracking-wider">Scout Grade</p>
                <p className="text-lg font-black font-mono text-uc-green">{projection.scoutGrade}</p>
              </div>
              <div>
                <p className="text-[6px] text-uc-gray-600 uppercase tracking-wider">Projected</p>
                <p className="text-sm font-bold text-white">{projection.projectedRound}</p>
                <p className="text-[8px] text-uc-gray-500">{projection.projectedPick}</p>
              </div>
              <div>
                <p className="text-[6px] text-uc-gray-600 uppercase tracking-wider">Comp</p>
                <p className="text-xs font-bold text-uc-gray-300">{projection.comparison}</p>
              </div>
              <div className="ml-auto">
                <p className="text-[6px] text-uc-gray-600 uppercase tracking-wider">Offers</p>
                <p className="text-sm font-bold font-mono text-white">{a.offers?.length || 0}</p>
              </div>
            </div>

            {/* Genome bar */}
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${projection.genomeScore}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${rankColor}60, ${rankColor})` }}
              />
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[8px] text-uc-cyan tracking-wider uppercase font-bold hover:text-white transition-colors flex items-center gap-1"
            >
              {expanded ? "Collapse" : "Scouting Report"}
              {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/5 grid md:grid-cols-3 gap-4">
                {/* Strengths */}
                <div>
                  <h5 className="text-[8px] text-uc-green tracking-wider uppercase font-bold mb-2 flex items-center gap-1">
                    <Sparkles size={8} /> Strengths
                  </h5>
                  <div className="space-y-1">
                    {projection.strengths.map((s) => (
                      <p key={s} className="text-[9px] text-uc-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-uc-green" />
                        {s}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                <div>
                  <h5 className="text-[8px] text-uc-red tracking-wider uppercase font-bold mb-2 flex items-center gap-1">
                    <Shield size={8} /> Concerns
                  </h5>
                  <div className="space-y-1">
                    {projection.concerns.map((c) => (
                      <p key={c} className="text-[9px] text-uc-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-uc-red" />
                        {c}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Best Fits */}
                <div>
                  <h5 className="text-[8px] text-uc-cyan tracking-wider uppercase font-bold mb-2 flex items-center gap-1">
                    <MapPin size={8} /> Best Fit Programs
                  </h5>
                  <div className="space-y-1">
                    {projection.bestFit.map((f) => (
                      <p key={f} className="text-[9px] text-uc-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-uc-cyan" />
                        {f}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Main Draft Page ── */
export default function DraftPage() {
  const athletes = PLACEHOLDER_ATHLETES;
  const projections = useMemo(() => generateProjections(athletes), [athletes]);

  const [classFilter, setClassFilter] = useState<"all" | "2026" | "2027">("all");
  const filtered = classFilter === "all" ? projections : projections.filter((p) => p.athlete.gradYear === parseInt(classFilter));

  // Summary stats
  const top3Avg = Math.round(projections.slice(0, 3).reduce((s, p) => s + p.genomeScore, 0) / 3);
  const risingCount = projections.filter((p) => p.trend === "rising").length;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Trophy size={12} />
            Draft Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Big Board</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Genome-powered draft rankings. Scout grades, projections, trends,
            and scouting reports for every QB in the pipeline.
          </p>
        </motion.div>

        {/* Stats + Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-8 flex flex-wrap items-center gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-uc-cyan" />
              <span className="text-xs font-bold">{projections.length} QBs Ranked</span>
            </div>
            <div>
              <span className="text-[8px] text-uc-gray-500 uppercase tracking-wider">Top 3 Avg</span>
              <span className="text-xs font-bold font-mono text-uc-cyan ml-2">{top3Avg}</span>
            </div>
            <div>
              <span className="text-[8px] text-uc-gray-500 uppercase tracking-wider">Rising</span>
              <span className="text-xs font-bold font-mono text-uc-green ml-2">{risingCount}</span>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            {(["all", "2026", "2027"] as const).map((year) => (
              <button
                key={year}
                onClick={() => setClassFilter(year)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-colors ${
                  classFilter === year
                    ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                    : "text-uc-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {year === "all" ? "All Classes" : `Class '${year.slice(2)}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Draft Board */}
        <div className="space-y-4 mb-10">
          {filtered.map((projection, i) => (
            <DraftCard key={projection.athlete.id} projection={projection} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-uc-gray-500">
            <p className="text-sm">No prospects in this class.</p>
          </div>
        )}

        <DNAStrandDivider className="mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Want to test them in combine drills?
          </p>
          <Link
            href="/combine"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            QB Combine
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
