"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  Dna,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  MapPin,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────

export type GraphicTemplate =
  | "commitment"
  | "offer"
  | "ranking"
  | "verified"
  | "gameday"
  | "stat-showcase"
  | "story";

export interface SocialGraphicProps {
  template: GraphicTemplate;
  athleteName: string;
  school: string;
  position?: string;
  /** For commitment: committed school */
  committedTo?: string;
  /** For offer: offering school */
  offerFrom?: string;
  /** For ranking: rank number */
  rank?: number;
  /** For ranking: total ranked */
  totalRanked?: number;
  rating?: number;
  metrics?: Record<string, string | number>;
  genomeScore?: number;
  /** Optional subtitle */
  subtitle?: string;
  verified?: boolean;
}

// ─── Shared Background Pattern ─────────────────────

function GridPattern({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,194,255,${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,194,255,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  );
}

function DNAWatermark() {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 opacity-40">
      <Dna size={14} className="text-uc-cyan" />
      <span className="text-[9px] tracking-[0.3em] uppercase text-uc-cyan font-bold">
        Under Center
      </span>
    </div>
  );
}

// ─── Commitment Graphic ───────────────────────────

function CommitmentGraphic({
  athleteName,
  school,
  committedTo,
  rating,
  genomeScore,
  verified,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-b from-[#0A0A0A] via-[#0D1117] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      <GridPattern />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-uc-cyan to-transparent" />

      {/* COMMITTED label */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan/60 mb-2">
          Committed
        </div>

        <h2 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>

        {verified && (
          <div className="flex items-center gap-1 mb-4">
            <Shield size={10} className="text-uc-cyan" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-uc-cyan">
              Verified Prospect
            </span>
          </div>
        )}

        {/* Arrow Down */}
        <div className="w-px h-8 bg-gradient-to-b from-uc-cyan/40 to-transparent mb-4" />

        {/* School */}
        <div className="px-6 py-3 rounded-xl bg-uc-cyan/10 border border-uc-cyan/20">
          <div className="text-[9px] tracking-[0.3em] uppercase text-uc-gray-400 mb-1">
            Has Committed To
          </div>
          <h3 className="text-xl font-bold text-uc-cyan">
            {committedTo || "University"}
          </h3>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-6">
          {rating && (
            <div className="text-center">
              <div className="flex items-center gap-0.5 justify-center">
                {Array.from({ length: Math.floor(rating) }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <div className="text-[8px] tracking-wider uppercase text-uc-gray-400 mt-1">
                Rating
              </div>
            </div>
          )}
          {genomeScore && (
            <div className="text-center">
              <div className="text-lg font-black font-mono text-uc-green">
                {genomeScore}
              </div>
              <div className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                GAI Score
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-uc-gray-400 mt-4">
          {school} · QB
        </div>
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Offer Graphic ────────────────────────────────

function OfferGraphic({
  athleteName,
  school,
  offerFrom,
  rating,
  verified,
  metrics,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-br from-[#0A0A0A] via-[#111318] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      <GridPattern opacity={0.03} />

      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-uc-cyan/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Offer badge */}
        <div className="w-14 h-14 rounded-2xl bg-uc-cyan/10 border border-uc-cyan/20 flex items-center justify-center mb-4">
          <Trophy size={24} className="text-uc-cyan" />
        </div>

        <div className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan mb-2">
          New Offer
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>

        {verified && (
          <div className="flex items-center gap-1 mb-6">
            <Shield size={10} className="text-uc-cyan" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-uc-cyan">
              Verified
            </span>
          </div>
        )}

        <div className="text-xs text-uc-gray-400 mb-2">
          has received an offer from
        </div>
        <h3 className="text-2xl font-bold text-white mb-6">
          {offerFrom || "University"}
        </h3>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 gap-3 w-full">
            {Object.entries(metrics)
              .slice(0, 4)
              .map(([key, val]) => (
                <div
                  key={key}
                  className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <div className="text-[9px] tracking-wider uppercase text-uc-gray-400">
                    {key}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {val}
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="text-[10px] text-uc-gray-400 mt-5">
          {school} · {rating && `${rating}★`} · QB
        </div>
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Ranking Graphic ──────────────────────────────

function RankingGraphic({
  athleteName,
  school,
  rank,
  totalRanked,
  rating,
  genomeScore,
  verified,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-b from-[#0A0A0A] via-[#0F0F14] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      <GridPattern opacity={0.03} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="text-[10px] tracking-[0.5em] uppercase text-amber-400/60 mb-4">
          National Ranking
        </div>

        {/* Rank circle */}
        <div className="relative w-28 h-28 mb-6">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#rankGrad)"
              strokeWidth="4"
              strokeDasharray={`${((rank ? (totalRanked ? (totalRanked - rank + 1) / totalRanked : 1) : 0.5) * 339)}, 339`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="rankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#00C2FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] tracking-wider uppercase text-uc-gray-400">
              Rank
            </span>
            <span className="text-3xl font-black text-white">
              #{rank || 1}
            </span>
            {totalRanked && (
              <span className="text-[9px] text-uc-gray-400">
                of {totalRanked}
              </span>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>
        <div className="text-xs text-uc-gray-400 mb-4">{school} · QB</div>

        {verified && (
          <div className="flex items-center gap-1 mb-3">
            <Shield size={10} className="text-uc-cyan" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-uc-cyan">
              Verified
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6">
          {rating && (
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">
                {rating}★
              </div>
              <div className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                Rating
              </div>
            </div>
          )}
          {genomeScore && (
            <div className="text-center">
              <div className="text-lg font-bold text-uc-green">
                {genomeScore}
              </div>
              <div className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                GAI
              </div>
            </div>
          )}
        </div>
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Verified Card Graphic ────────────────────────

function VerifiedGraphic({
  athleteName,
  school,
  rating,
  genomeScore,
  metrics,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-b from-[#0A0A0A] via-[#0D1117] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      <GridPattern />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-uc-green to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full">
        {/* Verified shield */}
        <div className="w-16 h-16 rounded-2xl bg-uc-green/10 border border-uc-green/20 flex items-center justify-center mb-4">
          <Shield size={28} className="text-uc-green" />
        </div>

        <div className="text-[10px] tracking-[0.5em] uppercase text-uc-green mb-2">
          Verified Prospect
        </div>

        <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>
        <div className="text-xs text-uc-gray-400 mb-6">{school} · QB</div>

        {/* GAI Score */}
        {genomeScore && (
          <div className="mb-6">
            <div className="text-4xl font-black font-mono bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400 bg-clip-text text-transparent">
              {genomeScore}
            </div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-uc-gray-400 mt-1">
              Genome Activation Index
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/5 w-48 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400"
                style={{ width: `${genomeScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-2 w-full px-2">
            {Object.entries(metrics)
              .slice(0, 6)
              .map(([key, val]) => (
                <div
                  key={key}
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <div className="text-[8px] tracking-wider uppercase text-uc-gray-400 truncate">
                    {key}
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {val}
                  </div>
                </div>
              ))}
          </div>
        )}

        {rating && (
          <div className="flex items-center gap-0.5 mt-4">
            {Array.from({ length: Math.floor(rating) }, (_, i) => (
              <Star
                key={i}
                size={14}
                className="text-amber-400 fill-amber-400"
              />
            ))}
          </div>
        )}
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Game Day Graphic ─────────────────────────────

function GameDayGraphic({
  athleteName,
  school,
  subtitle,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-b from-[#0A0A0A] via-[#10100A] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-end pb-12">
      <GridPattern opacity={0.02} />

      {/* Large glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="text-[11px] tracking-[0.5em] uppercase text-amber-400 mb-3 font-bold">
          Game Day
        </div>

        <h2 className="text-4xl font-black uppercase tracking-wide text-white mb-2 leading-tight">
          {athleteName}
        </h2>

        <div className="text-sm text-uc-gray-400 mb-4">
          {subtitle || "Friday Night Lights"}
        </div>

        <div className="flex items-center gap-2 text-amber-400/60">
          <MapPin size={12} />
          <span className="text-[10px] tracking-[0.2em] uppercase">
            {school}
          </span>
        </div>

        <Zap
          size={40}
          className="text-amber-400/10 mt-6"
          strokeWidth={1}
        />
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Stat Showcase Graphic ────────────────────────

function StatShowcaseGraphic({
  athleteName,
  school,
  metrics,
  genomeScore,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[400px] h-[500px] bg-gradient-to-b from-[#0A0A0A] via-[#0A1018] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      <GridPattern />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-uc-cyan to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
        <TrendingUp size={20} className="text-uc-cyan mb-3" />

        <div className="text-[10px] tracking-[0.5em] uppercase text-uc-cyan/60 mb-2">
          Verified Metrics
        </div>

        <h2 className="text-xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>
        <div className="text-[10px] text-uc-gray-400 mb-6">
          {school} · QB
        </div>

        {/* GAI */}
        {genomeScore && (
          <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 w-full">
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400">
                Genome Activation Index
              </span>
              <span className="text-xl font-black font-mono text-uc-green">
                {genomeScore}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400"
                style={{ width: `${genomeScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics grid */}
        {metrics && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {Object.entries(metrics).map(([key, val]) => (
              <div
                key={key}
                className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left"
              >
                <div className="text-[8px] tracking-wider uppercase text-uc-gray-400 mb-0.5">
                  {key}
                </div>
                <div className="text-base font-bold text-white">{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DNAWatermark />
    </div>
  );
}

// ─── Story Template (9:16) ────────────────────────

function StoryGraphic({
  athleteName,
  school,
  rating,
  genomeScore,
  metrics,
  verified,
  subtitle,
}: SocialGraphicProps) {
  return (
    <div className="relative w-[360px] h-[640px] bg-gradient-to-b from-[#0A0A0A] via-[#0D1117] to-[#0A0A0A] overflow-hidden flex flex-col items-center justify-between py-12">
      <GridPattern opacity={0.03} />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-uc-cyan to-transparent" />

      {/* Top */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 mb-3">
          <Dna size={12} className="text-uc-cyan" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-uc-cyan font-bold">
            Under Center
          </span>
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400">
          {subtitle || "Verified Prospect"}
        </div>
      </div>

      {/* Center */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h2 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          {athleteName}
        </h2>
        <div className="text-xs text-uc-gray-400 mb-4">{school} · QB</div>

        {verified && (
          <div className="flex items-center gap-1 mb-4">
            <Shield size={10} className="text-uc-green" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-uc-green">
              Verified
            </span>
          </div>
        )}

        {genomeScore && (
          <div className="text-5xl font-black font-mono bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400 bg-clip-text text-transparent mb-2">
            {genomeScore}
          </div>
        )}

        {rating && (
          <div className="flex items-center gap-0.5 mb-6">
            {Array.from({ length: Math.floor(rating) }, (_, i) => (
              <Star
                key={i}
                size={16}
                className="text-amber-400 fill-amber-400"
              />
            ))}
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {Object.entries(metrics)
              .slice(0, 4)
              .map(([key, val]) => (
                <div
                  key={key}
                  className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <div className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                    {key}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {val}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="relative z-10 text-[9px] text-uc-gray-400 tracking-wider uppercase">
        undercenter.com
      </div>
    </div>
  );
}

// ─── Router Component ─────────────────────────────

const TEMPLATE_MAP: Record<
  GraphicTemplate,
  React.ComponentType<SocialGraphicProps>
> = {
  commitment: CommitmentGraphic,
  offer: OfferGraphic,
  ranking: RankingGraphic,
  verified: VerifiedGraphic,
  gameday: GameDayGraphic,
  "stat-showcase": StatShowcaseGraphic,
  story: StoryGraphic,
};

export default function SocialGraphic(props: SocialGraphicProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const Component = TEMPLATE_MAP[props.template] || VerifiedGraphic;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0A0A0A",
      });
      const link = document.createElement("a");
      link.download = `${props.athleteName.replace(/\s/g, "-").toLowerCase()}-${props.template}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl">
        <Component {...props} />
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 text-sm font-semibold tracking-wider uppercase hover:bg-uc-cyan/20 transition-all disabled:opacity-50"
        >
          <Download size={14} />
          {downloading ? "Exporting..." : "Download PNG"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${props.athleteName} — Under Center`,
                text: `Check out ${props.athleteName}'s verified profile on Under Center`,
                url: `https://undercenter.com/athlete/${encodeURIComponent(props.athleteName)}`,
              });
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-uc-gray-400 border border-white/10 text-sm font-semibold tracking-wider uppercase hover:text-white hover:border-white/20 transition-all"
        >
          <Share2 size={14} />
          Share
        </motion.button>
      </div>
    </div>
  );
}
