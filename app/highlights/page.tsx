"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import {
  Play,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Flame,
  Clock,
  Filter,
  TrendingUp,
  Zap,
  Trophy,
  Target,
} from "lucide-react";

/* ── Highlight content data ── */
type HighlightCategory = "all" | "throws" | "games" | "training" | "camps";

interface Highlight {
  id: string;
  athleteId: string;
  athleteName: string;
  school: string;
  verified: boolean;
  title: string;
  description: string;
  category: Exclude<HighlightCategory, "all">;
  thumbnailGradient: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  timestamp: string;
  featured: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
}

const HIGHLIGHTS: Highlight[] = [
  {
    id: "h1",
    athleteId: "6",
    athleteName: "Andre Mitchell",
    school: "IMG Academy",
    verified: true,
    title: "63.4 MPH BOMB — State Championship Game",
    description:
      "Andre Mitchell uncorks the fastest throw of the season in the 4th quarter of the Florida 8A State Championship. 52-yard post route, perfect spiral.",
    category: "games",
    thumbnailGradient: "from-yellow-500/30 via-uc-panel to-purple-500/20",
    duration: "0:38",
    views: 234500,
    likes: 18200,
    comments: 1420,
    timestamp: "2 hours ago",
    featured: true,
    metrics: [
      { label: "Velocity", value: "63.4 MPH" },
      { label: "Distance", value: "52 YDS" },
      { label: "Spiral", value: "Elite" },
    ],
  },
  {
    id: "h2",
    athleteId: "1",
    athleteName: "Jaxon Smith",
    school: "Westlake HS",
    verified: true,
    title: "Pre-Snap Read Breakdown — Film Study",
    description:
      "Jaxon walks through his pre-snap read progression against cover-3. Shows the decision speed that has Ohio State and Alabama fighting for his commitment.",
    category: "training",
    thumbnailGradient: "from-uc-cyan/30 via-uc-panel to-blue-500/20",
    duration: "2:14",
    views: 89400,
    likes: 7300,
    comments: 856,
    timestamp: "5 hours ago",
    featured: false,
    metrics: [
      { label: "Decision", value: "85/100" },
      { label: "Read Time", value: "1.2s" },
    ],
  },
  {
    id: "h3",
    athleteId: "2",
    athleteName: "Marcus Rivera",
    school: "Mater Dei HS",
    verified: true,
    title: "DUAL THREAT — 3 TDs Rushing + 4 Passing",
    description:
      "Marcus Rivera puts up 7 total TDs against St. John Bosco. The Mater Dei dual-threat is rewriting what it means to be a modern QB.",
    category: "games",
    thumbnailGradient: "from-uc-red/30 via-uc-panel to-orange-500/20",
    duration: "1:42",
    views: 156200,
    likes: 12800,
    comments: 1100,
    timestamp: "12 hours ago",
    featured: true,
    metrics: [
      { label: "Total TDs", value: "7" },
      { label: "Rush Yds", value: "128" },
      { label: "Pass Yds", value: "312" },
    ],
  },
  {
    id: "h4",
    athleteId: "4",
    athleteName: "Dylan Park",
    school: "Archbishop Moeller",
    verified: true,
    title: "0.36s Release — Fastest in the Class",
    description:
      "Dylan Park's QBX testing confirms the fastest release time in the 2026 class. Pure pocket passer mechanics with elite processing speed.",
    category: "throws",
    thumbnailGradient: "from-green-500/30 via-uc-panel to-uc-cyan/20",
    duration: "0:55",
    views: 67800,
    likes: 5400,
    comments: 432,
    timestamp: "1 day ago",
    featured: false,
    metrics: [
      { label: "Release", value: "0.36s" },
      { label: "Velocity", value: "60.1 MPH" },
    ],
  },
  {
    id: "h5",
    athleteId: "5",
    athleteName: "Kai Nakamura",
    school: "Saint Louis School",
    verified: true,
    title: "Island Arm — Hawaii to Pac-12 Pipeline",
    description:
      "Kai Nakamura showcases the arm talent that has Oregon, Washington, and UCLA all extending offers. Watch the dual-threat work from the islands.",
    category: "camps",
    thumbnailGradient: "from-teal-500/30 via-uc-panel to-blue-500/20",
    duration: "1:18",
    views: 45200,
    likes: 3800,
    comments: 290,
    timestamp: "2 days ago",
    featured: false,
  },
  {
    id: "h6",
    athleteId: "1",
    athleteName: "Jaxon Smith",
    school: "Westlake HS",
    verified: true,
    title: "Off-Platform Magic — Scramble Drill Highlights",
    description:
      "Jaxon Smith's off-platform throwing ability is elite. Watch him create outside the pocket against top Texas talent.",
    category: "throws",
    thumbnailGradient: "from-purple-500/30 via-uc-panel to-pink-500/20",
    duration: "1:05",
    views: 92100,
    likes: 8100,
    comments: 620,
    timestamp: "3 days ago",
    featured: false,
    metrics: [
      { label: "Velocity", value: "61.8 MPH" },
      { label: "Accuracy", value: "88/100" },
    ],
  },
];

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const CATEGORY_ICONS: Record<string, typeof Play> = {
  throws: Target,
  games: Trophy,
  training: Zap,
  camps: Flame,
};

export default function HighlightsPage() {
  const [category, setCategory] = useState<HighlightCategory>("all");

  const filtered =
    category === "all"
      ? HIGHLIGHTS
      : HIGHLIGHTS.filter((h) => h.category === category);

  const featured = HIGHLIGHTS.filter((h) => h.featured);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ═══════════ HERO ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-uc-red/10 flex items-center justify-center">
              <Flame size={20} className="text-uc-red" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Highlights</span>
              </h1>
              <p className="text-sm text-uc-gray-400">
                The best QB moments. Verified. Every throw tells a story.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══════════ FEATURED (OVERTIME-STYLE HERO CARDS) ═══════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((highlight, i) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[16/10]"
              >
                {/* Background gradient (simulates video thumbnail) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.thumbnailGradient}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Play button center */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-uc-cyan/20 group-hover:border-uc-cyan/40 transition-all duration-300"
                  >
                    <Play
                      size={24}
                      className="text-white ml-1 group-hover:text-uc-cyan transition-colors"
                      fill="currentColor"
                    />
                  </motion.div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Clock size={10} className="text-white/70" />
                  <span className="text-[10px] font-mono text-white/90">
                    {highlight.duration}
                  </span>
                </div>

                {/* Trending badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-uc-red/20 backdrop-blur-sm border border-uc-red/30">
                  <Flame size={10} className="text-uc-red" />
                  <span className="text-[10px] font-bold text-uc-red uppercase tracking-wider">
                    Trending
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  {/* Metrics chips */}
                  {highlight.metrics && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {highlight.metrics.map((m) => (
                        <span
                          key={m.label}
                          className="px-2 py-1 rounded-md bg-uc-cyan/10 backdrop-blur-sm text-[9px] font-bold text-uc-cyan border border-uc-cyan/20"
                        >
                          {m.label}: {m.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight group-hover:text-uc-cyan transition-colors">
                    {highlight.title}
                  </h2>

                  <div className="flex items-center gap-3 mb-3">
                    <Link
                      href={`/athlete/${highlight.athleteId}`}
                      className="flex items-center gap-2 hover:text-uc-cyan transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-uc-cyan/10 flex items-center justify-center border border-uc-cyan/20">
                        <span className="text-xs font-bold text-uc-cyan">
                          {highlight.athleteName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {highlight.athleteName}
                      </span>
                      {highlight.verified && <VerifiedBadge size="sm" />}
                    </Link>
                    <span className="text-[10px] text-uc-gray-400">
                      {highlight.school}
                    </span>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center gap-5 text-uc-gray-400">
                    <span className="flex items-center gap-1 text-xs">
                      <Eye size={12} />
                      {formatViewCount(highlight.views)}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Heart size={12} />
                      {formatViewCount(highlight.likes)}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <MessageCircle size={12} />
                      {formatViewCount(highlight.comments)}
                    </span>
                    <span className="text-[10px] ml-auto">
                      {highlight.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ CATEGORY FILTER ═══════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <Filter size={14} className="text-uc-gray-400" />
          {(
            ["all", "throws", "games", "training", "camps"] as HighlightCategory[]
          ).map((cat) => {
            const Icon = cat === "all" ? Flame : CATEGORY_ICONS[cat] || Flame;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  category === cat
                    ? "bg-uc-cyan/20 text-uc-cyan border border-uc-cyan/30"
                    : "glass text-uc-gray-400 border border-transparent hover:border-white/10"
                }`}
              >
                <Icon size={12} />
                {cat === "all" ? "All" : cat}
              </button>
            );
          })}
        </motion.div>

        {/* ═══════════ HIGHLIGHT FEED ═══════════ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((highlight, i) => (
              <motion.div
                key={highlight.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${highlight.thumbnailGradient}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-uc-cyan/20 backdrop-blur-sm flex items-center justify-center border border-uc-cyan/40">
                      <Play
                        size={18}
                        className="text-uc-cyan ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80">
                    {highlight.duration}
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-uc-gray-400">
                    {highlight.category}
                  </div>

                  {/* Metric overlay chips */}
                  {highlight.metrics && (
                    <div className="absolute bottom-2 left-2 flex gap-1.5">
                      {highlight.metrics.slice(0, 2).map((m) => (
                        <span
                          key={m.label}
                          className="px-1.5 py-0.5 rounded bg-uc-cyan/10 backdrop-blur-sm text-[8px] font-bold text-uc-cyan border border-uc-cyan/20"
                        >
                          {m.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold mb-2 leading-snug group-hover:text-uc-cyan transition-colors line-clamp-2">
                  {highlight.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/athlete/${highlight.athleteId}`}
                    className="flex items-center gap-1.5 text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-uc-cyan/10 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-uc-cyan">
                        {highlight.athleteName.charAt(0)}
                      </span>
                    </div>
                    {highlight.athleteName}
                    {highlight.verified && <VerifiedBadge size="sm" />}
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-uc-gray-600 text-[10px]">
                  <span className="flex items-center gap-1">
                    <Eye size={10} />
                    {formatViewCount(highlight.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={10} />
                    {formatViewCount(highlight.likes)}
                  </span>
                  <span className="ml-auto">{highlight.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ═══════════ TRENDING ATHLETES ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-uc-cyan" />
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan font-bold">
              Trending QBs This Week
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLACEHOLDER_ATHLETES.map((athlete, i) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/athlete/${athlete.id}`}
                  className="glass rounded-xl p-4 flex flex-col items-center text-center group hover:border-uc-cyan/20 transition-all duration-300 block"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center mb-3 border border-white/5 group-hover:border-uc-cyan/30 transition-all">
                    <span className="text-lg font-bold text-uc-cyan/60 group-hover:text-uc-cyan transition-colors">
                      {athlete.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs font-bold truncate w-full group-hover:text-uc-cyan transition-colors">
                    {athlete.name}
                  </p>
                  <p className="text-[9px] text-uc-gray-400 mt-0.5">
                    {athlete.school.split(" ")[0]}
                  </p>
                  {athlete.verified && (
                    <div className="mt-2">
                      <VerifiedBadge size="sm" />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ CTA ═══════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Your film. Your DNA. Your moment.</span>
          </h2>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-8">
            Upload your highlights and let your decoded genome do the talking.
            Every throw reveals DNA that coaches need to see.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-300"
            >
              Upload Highlights
              <Play size={14} fill="currentColor" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10 text-uc-white font-semibold text-sm tracking-wider uppercase hover:border-uc-cyan/30 hover:text-uc-cyan transition-all duration-300"
            >
              Discover QBs
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
