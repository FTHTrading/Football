"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import StarRating from "@/components/StarRating";
import RadialGauge from "@/components/RadialGauge";
import PercentileBar from "@/components/PercentileBar";
import ComparisonPanel from "@/components/ComparisonPanel";
import VideoOverlayPlayer from "@/components/VideoOverlayPlayer";
import RecruitingTimeline from "@/components/RecruitingTimeline";
import DNAHelix, { DNABasePairLabel, DNAStrandDivider } from "@/components/DNAHelix";
import {
  MapPin,
  GraduationCap,
  Ruler,
  Weight,
  Share2,
  ArrowLeft,
  Users,
  Eye,
  TrendingUp,
  Sparkles,
  Crown,
  ArrowRight,
  Dna,
  Activity,
  Flame,
} from "lucide-react";
import { formatVelocity, formatReleaseTime, getSpinRateTier, getMechanicsGrade } from "@/lib/utils";
import NILValuation from "@/components/NILValuation";
import { computeGAI, detectArchetype, extractGenes, GENE_COLORS, type GeneId } from "@/lib/genome-activation-index";

/* ── Comparison data (placeholder NFL pro traits) ── */
const proComparisons: Record<string, Record<string, number>> = {
  "Patrick Mahomes": { velocity: 62, releaseTime: 37, mechanics: 94, accuracy: 91, decisionSpeed: 95 },
  "Lamar Jackson": { velocity: 57, releaseTime: 42, mechanics: 82, accuracy: 85, decisionSpeed: 96 },
  "Justin Herbert": { velocity: 63, releaseTime: 38, mechanics: 90, accuracy: 89, decisionSpeed: 88 },
  "Joe Burrow": { velocity: 58, releaseTime: 36, mechanics: 93, accuracy: 94, decisionSpeed: 92 },
  "Marcus Mariota": { velocity: 56, releaseTime: 43, mechanics: 80, accuracy: 83, decisionSpeed: 88 },
  "Trevor Lawrence": { velocity: 61, releaseTime: 37, mechanics: 95, accuracy: 92, decisionSpeed: 91 },
};

export default function AthleteProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === id);

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Athlete Not Found</h1>
          <Link href="/search" className="text-uc-cyan hover:underline">
            Browse Verified QBs
          </Link>
        </div>
      </div>
    );
  }

  const compMetrics = athlete.comparisonPlayer
    ? proComparisons[athlete.comparisonPlayer]
    : null;

  const athleteCompMetrics = {
    velocity: Math.round(athlete.metrics.velocity),
    releaseTime: Math.round(athlete.metrics.releaseTime * 100),
    mechanics: athlete.metrics.mechanics,
    accuracy: athlete.metrics.accuracy,
    decisionSpeed: athlete.metrics.decisionSpeed,
  };

  const sampleTimeline = athlete.offers.slice(0, 5).map((school, i) => ({
    date: `${["Jan", "Mar", "May", "Jun", "Aug"][i % 5]} 2025`,
    school,
    type: (i === 0 ? "offer" : i === 4 ? "visit" : "offer") as "offer" | "visit",
  }));

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
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Search
          </Link>
        </motion.div>

        {/* ═══════════ IDENTITY HEADER ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center overflow-hidden border border-white/5">
                <span className="text-6xl font-bold text-uc-cyan/30">
                  {athlete.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {athlete.name}
                </h1>
                {athlete.verified && <VerifiedBadge size="lg" />}
              </div>

              <p className="text-sm text-uc-gray-400 mb-4">
                {athlete.qbClass} Quarterback
              </p>

              <StarRating rating={athlete.rating} />

              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-uc-gray-400">
                  <GraduationCap size={14} className="text-uc-cyan" />
                  Class of {athlete.gradYear}
                </div>
                <div className="flex items-center gap-2 text-sm text-uc-gray-400">
                  <Ruler size={14} className="text-uc-cyan" />
                  {athlete.height}
                </div>
                <div className="flex items-center gap-2 text-sm text-uc-gray-400">
                  <Weight size={14} className="text-uc-cyan" />
                  {athlete.weight} lbs
                </div>
                <div className="flex items-center gap-2 text-sm text-uc-gray-400">
                  <MapPin size={14} className="text-uc-cyan" />
                  {athlete.state}
                </div>
              </div>
            </div>

            {/* Status Box */}
            <div className="flex flex-col items-end gap-3">
              <div className="glass rounded-xl p-4 text-center min-w-[140px]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 mb-1">Status</p>
                <p className={`text-lg font-bold ${athlete.verified ? "text-uc-green" : "text-yellow-400"}`}>
                  {athlete.verified ? "VERIFIED" : "PENDING"}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors">
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </motion.section>

        {/* ═══════════ GENOME ACTIVATION INDEX ═══════════ */}
        {(() => {
          const gaiResult = computeGAI(athlete.metrics);
          const archetype = detectArchetype(athlete.metrics);
          const genes = extractGenes(athlete.metrics);
          return (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Dna size={16} className="text-purple-400" />
                <h2 className="text-[10px] tracking-[0.4em] uppercase gradient-text-dna font-bold">
                  Genome Activation Index
                </h2>
              </div>

              <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden animate-genome-border">
                <div className="absolute top-0 right-0 w-[300px] h-[200px] blur-[80px] rounded-full pointer-events-none" style={{ background: `${gaiResult.tierColor}08` }} />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  {/* GAI Ring */}
                  <div className="flex-shrink-0">
                    <div className="relative w-36 h-36">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle
                          cx="60" cy="60" r="52"
                          fill="none"
                          stroke={gaiResult.tierColor}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(gaiResult.gai / 99) * 327} 327`}
                          transform="rotate(-90 60 60)"
                          style={{ filter: `drop-shadow(0 0 8px ${gaiResult.tierColor}40)` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black font-mono" style={{ color: gaiResult.tierColor }}>{gaiResult.gai}</span>
                        <span className="text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: gaiResult.tierColor }}>{gaiResult.tier}</span>
                      </div>
                    </div>
                  </div>

                  {/* GAI Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase" style={{ color: gaiResult.tierColor, backgroundColor: `${gaiResult.tierColor}15`, borderColor: `${gaiResult.tierColor}30`, borderWidth: 1 }}>
                        {gaiResult.tier}
                      </span>
                      <span className="px-2 py-1 rounded text-[9px] bg-white/5 text-uc-gray-400 border border-white/10">
                        {archetype.name}
                      </span>
                      <span className="px-2 py-1 rounded text-[9px] bg-white/5 border border-white/10" style={{ color: gaiResult.growth.trajectory === 'ascending' ? '#00FF88' : gaiResult.growth.trajectory === 'declining' ? '#FF3B5C' : '#C0C0C0' }}>
                        {gaiResult.growth.trajectory === 'ascending' ? '↑' : gaiResult.growth.trajectory === 'declining' ? '↓' : '→'} {gaiResult.growth.trajectory}
                      </span>
                    </div>

                    {/* Component scores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase mb-1">Base</p>
                        <p className="text-lg font-bold font-mono text-uc-cyan">{gaiResult.base.toFixed(1)}</p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase mb-1">Activation</p>
                        <p className="text-lg font-bold font-mono text-yellow-400">{gaiResult.activation.multiplier.toFixed(2)}×</p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase mb-1">Growth</p>
                        <p className={`text-lg font-bold font-mono ${gaiResult.growth.delta >= 0 ? 'text-uc-green' : 'text-uc-red'}`}>
                          {gaiResult.growth.delta >= 0 ? '+' : ''}{(gaiResult.growth.delta * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase mb-1">Best Fit</p>
                        <p className="text-lg font-bold font-mono text-purple-400">{gaiResult.bestFit.fitScore}</p>
                        <p className="text-[8px] text-uc-gray-500">{gaiResult.bestFit.program.name}</p>
                      </div>
                    </div>

                    {/* Gene bars mini */}
                    <div className="grid grid-cols-6 gap-2">
                      {genes.map((gene) => (
                        <div key={gene.id} className="text-center">
                          <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-1">
                            <div className="h-full rounded-full" style={{ width: `${gene.value}%`, backgroundColor: GENE_COLORS[gene.id as GeneId] ?? '#888' }} />
                          </div>
                          <span className="text-[7px] font-mono" style={{ color: GENE_COLORS[gene.id as GeneId] ?? '#888' }}>{gene.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA to Genome Timeline */}
                <div className="flex items-center justify-center mt-6 pt-4 border-t border-white/5 relative z-10">
                  <Link
                    href="/genome"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-400/10 text-purple-400 text-[10px] font-bold tracking-wider uppercase border border-purple-400/20 hover:bg-purple-400/20 transition-all"
                  >
                    <Activity size={12} />
                    View Full Genome Timeline
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.section>
          );
        })()}

        {/* ═══════════ METRICS GRID ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            Performance Metrics
          </h2>

          {/* Radial Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <RadialGauge label="Velocity" value={athlete.metrics.velocity} maxValue={70} />
            <RadialGauge label="Release" value={(1 - athlete.metrics.releaseTime) * 100} maxValue={100} />
            <RadialGauge label="Spin Rate" value={athlete.metrics.spinRate} maxValue={800} />
            <RadialGauge label="Mechanics" value={athlete.metrics.mechanics} />
            <RadialGauge label="Accuracy" value={athlete.metrics.accuracy} />
            <RadialGauge label="Decision" value={athlete.metrics.decisionSpeed} />
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-uc-gray-400 tracking-wider uppercase mb-1">Velocity</p>
              <p className="text-2xl font-bold font-mono text-uc-cyan">{formatVelocity(athlete.metrics.velocity)}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-uc-gray-400 tracking-wider uppercase mb-1">Release Time</p>
              <p className="text-2xl font-bold font-mono text-uc-cyan">{formatReleaseTime(athlete.metrics.releaseTime)}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-uc-gray-400 tracking-wider uppercase mb-1">Spin Rate</p>
              <p className="text-2xl font-bold font-mono text-uc-cyan">{getSpinRateTier(athlete.metrics.spinRate)}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-uc-gray-400 tracking-wider uppercase mb-1">Mechanics</p>
              <p className="text-2xl font-bold font-mono text-uc-cyan">{getMechanicsGrade(athlete.metrics.mechanics)}</p>
            </div>
          </div>

          {/* Percentile Bars */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs tracking-[0.3em] uppercase text-uc-gray-400 mb-6">Percentile Rankings</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              <PercentileBar label="Throw Velocity" percentile={Math.round(athlete.metrics.velocity / 70 * 100)} delay={0} />
              <PercentileBar label="Release Speed" percentile={Math.round((1 - athlete.metrics.releaseTime) * 100)} delay={0.1} />
              <PercentileBar label="Spiral Efficiency" percentile={Math.round(athlete.metrics.spinRate / 800 * 100)} delay={0.2} />
              <PercentileBar label="Mechanics Grade" percentile={athlete.metrics.mechanics} delay={0.3} />
              <PercentileBar label="Accuracy" percentile={athlete.metrics.accuracy} delay={0.4} />
              <PercentileBar label="Decision Speed" percentile={athlete.metrics.decisionSpeed} delay={0.5} />
            </div>
          </div>
        </motion.section>

        {/* ═══════════ QB GENOME DECODED ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Dna size={16} className="text-uc-cyan" />
            <h2 className="text-[10px] tracking-[0.4em] uppercase gradient-text-dna font-bold">
              QB Genome — Decoded
            </h2>
          </div>

          <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden animate-genome-border dna-bg-pattern">
            {/* Scan line overlay */}
            <div className="absolute inset-0 genome-scan pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* Helix visualization */}
              <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                <DNAHelix size="md" basePairs={10} speed={10} />
              </div>

              {/* Gene traits */}
              <div className="flex-1 space-y-3">
                <DNABasePairLabel
                  label="Arm Velocity Gene"
                  value={formatVelocity(athlete.metrics.velocity)}
                  code="VEL-α"
                  color="text-uc-cyan"
                  bgColor="bg-uc-cyan/20"
                  delay={0.1}
                />
                <DNABasePairLabel
                  label="Release Sequence"
                  value={formatReleaseTime(athlete.metrics.releaseTime)}
                  code="REL-β"
                  color="text-uc-green"
                  bgColor="bg-uc-green/20"
                  delay={0.2}
                />
                <DNABasePairLabel
                  label="Accuracy Strand"
                  value={`${athlete.metrics.accuracy}/100`}
                  code="ACC-γ"
                  color="text-purple-400"
                  bgColor="bg-purple-400/20"
                  delay={0.3}
                />
                <DNABasePairLabel
                  label="Mechanics Blueprint"
                  value={getMechanicsGrade(athlete.metrics.mechanics)}
                  code="MECH-δ"
                  color="text-yellow-400"
                  bgColor="bg-yellow-400/20"
                  delay={0.4}
                />
                <DNABasePairLabel
                  label="Processing Speed"
                  value={`${athlete.metrics.decisionSpeed}/100`}
                  code="DEC-ε"
                  color="text-uc-cyan"
                  bgColor="bg-uc-cyan/20"
                  delay={0.5}
                />
                <DNABasePairLabel
                  label="Spin Rate Marker"
                  value={getSpinRateTier(athlete.metrics.spinRate)}
                  code="SPR-ζ"
                  color="text-uc-green"
                  bgColor="bg-uc-green/20"
                  delay={0.6}
                />
              </div>
            </div>

            {/* Genome summary bar */}
            <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-uc-gray-400 tracking-wider">
                    GENOME SEQUENCE: {athlete.name.toUpperCase().replace(/\s/g, "-")}-2026
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-uc-cyan animate-nucleotide-drift" />
                    <span className="text-[8px] font-mono text-uc-gray-500">ACTIVE</span>
                  </div>
                  <span className="text-[9px] font-mono gradient-text-dna font-bold">
                    {athlete.verified ? "VERIFIED SEQUENCE" : "UNVERIFIED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DNA strand divider */}
        <DNAStrandDivider className="mb-8 opacity-40" />

        {/* ═══════════ NFL COMPARISON ═══════════ */}
        {athlete.comparisonPlayer && compMetrics && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
              Pro Comparison
            </h2>
            <ComparisonPanel
              athleteName={athlete.name}
              comparisonPlayer={athlete.comparisonPlayer}
              athleteMetrics={athleteCompMetrics}
              comparisonMetrics={compMetrics}
            />
          </motion.section>
        )}

        {/* ═══════════ FILM REVIEW ═══════════ */}
        {athlete.filmUrl && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
              Film Review
            </h2>
            <VideoOverlayPlayer
              url={athlete.filmUrl}
              metrics={{
                Velocity: formatVelocity(athlete.metrics.velocity),
                Release: formatReleaseTime(athlete.metrics.releaseTime),
                "Spin Rate": getSpinRateTier(athlete.metrics.spinRate),
              }}
            />
          </motion.section>
        )}

        {/* ═══════════ RECRUITING ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            Recruiting Activity
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-xl p-5 text-center">
              <Users size={20} className="text-uc-cyan mx-auto mb-2" />
              <p className="text-3xl font-bold">{athlete.offers.length}</p>
              <p className="text-xs text-uc-gray-400 mt-1">Total Offers</p>
            </div>
            <div className="glass rounded-xl p-5 text-center">
              <Eye size={20} className="text-uc-cyan mx-auto mb-2" />
              <p className="text-3xl font-bold">{Math.floor(Math.random() * 500) + 100}</p>
              <p className="text-xs text-uc-gray-400 mt-1">Coach Views</p>
            </div>
            <div className="glass rounded-xl p-5 text-center">
              <TrendingUp size={20} className="text-uc-cyan mx-auto mb-2" />
              <p className="text-3xl font-bold text-uc-green">High</p>
              <p className="text-xs text-uc-gray-400 mt-1">Interest Tier</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs tracking-[0.3em] uppercase text-uc-gray-400 mb-6">Offers Timeline</h3>
            <RecruitingTimeline events={sampleTimeline} />
          </div>
        </motion.section>

        {/* ═══════════ NIL VALUATION ═══════════ */}
        {athlete.verified && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-green mb-6">
              NIL Valuation
            </h2>
            <NILValuation
              athleteName={athlete.name}
              velocity={athlete.metrics.velocity}
              mechanics={athlete.metrics.mechanics}
              accuracy={athlete.metrics.accuracy}
              offers={athlete.offers.length}
              rating={athlete.rating}
              verified={athlete.verified}
              state={athlete.state}
              metrics={athlete.metrics}
            />
          </motion.section>
        )}

        {/* ═══════════ DIGITAL COLLECTIBLE PREVIEW ═══════════ */}
        {athlete.verified && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-purple-400 mb-6">
              Digital Collectible
            </h2>
            <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[250px] h-[200px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Card preview */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-64 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 via-uc-panel to-uc-cyan/5 p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(168,85,247,0.12)] relative overflow-hidden">
                    <div className="absolute inset-0 holographic-bg opacity-20 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Crown size={14} className="text-purple-400" />
                        <span className="text-[8px] font-mono text-purple-400/70">#1/10</span>
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-purple-400/10 flex items-center justify-center mx-auto mb-2 border border-purple-400/20">
                        <span className="text-2xl font-black text-purple-400/80">
                          {athlete.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-center text-xs font-bold">{athlete.name}</p>
                      <p className="text-center text-[8px] text-uc-gray-400">{athlete.school}</p>
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between text-[8px] text-uc-gray-400 mb-0.5">
                        <span>VEL</span><span>MECH</span><span>ACC</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold font-mono text-uc-cyan">
                        <span>{athlete.metrics.velocity.toFixed(1)}</span>
                        <span>{athlete.metrics.mechanics}</span>
                        <span>{athlete.metrics.accuracy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 text-[9px] tracking-[0.2em] uppercase font-bold mb-3">
                    <Sparkles size={10} />
                    Legendary Edition
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {athlete.name}&apos;s Verified Card
                  </h3>
                  <p className="text-sm text-uc-gray-400 mb-4 max-w-md">
                    This collectible card is backed by verified QBX data.
                    As {athlete.name.split(" ")[0]}&apos;s metrics improve and recruiting heats up,
                    the card value grows.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-uc-green font-mono">$850</p>
                      <p className="text-[8px] text-uc-gray-400">Floor Price</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-purple-400">10</p>
                      <p className="text-[8px] text-uc-gray-400">Total Editions</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-uc-cyan">3</p>
                      <p className="text-[8px] text-uc-gray-400">Available</p>
                    </div>
                  </div>
                  <Link
                    href="/collectibles"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs tracking-wider uppercase border border-purple-400/20 hover:bg-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
                  >
                    View in Marketplace
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════ SHARE CARD CTA ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Generate Your Decoded Card</h2>
          <p className="text-sm text-uc-gray-400 mb-6">Share your quarterback DNA across social media</p>
          <Link
            href={`/card-generator?athlete=${athlete.id}`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Create Card
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
