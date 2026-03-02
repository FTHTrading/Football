"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  MessageCircle,
  Heart,
  Share2,
  Flame,
  TrendingUp,
  Star,
  BookmarkPlus,
  Bookmark,
  ChevronDown,
  ArrowRight,
  Dna,
  Shield,
  Zap,
  Trophy,
  Target,
  Eye,
  Clock,
  Filter,
  Video,
  BarChart3,
  Award,
} from "lucide-react";

/* ── Post types ── */
type PostType = "highlight" | "update" | "analysis" | "milestone" | "comparison";

interface Post {
  id: string;
  type: PostType;
  athlete: Athlete;
  timestamp: string;
  timeAgo: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isHot: boolean;
  media?: { type: "stat" | "video" | "chart"; label: string };
}

/* ── Post Generator ── */
function generatePosts(athletes: Athlete[]): Post[] {
  const posts: Post[] = [];
  const now = Date.now();

  const templates: Array<{
    type: PostType;
    titleFn: (a: Athlete) => string;
    bodyFn: (a: Athlete) => string;
    tagsFn: (a: Athlete) => string[];
    media?: Post["media"];
  }> = [
    {
      type: "highlight",
      titleFn: (a) => `🎯 ${a.name} drops a DIME — 45-yard bomb in Friday Night Lights`,
      bodyFn: (a) =>
        `${a.name} out of ${a.school} just threw an absolute laser downfield. ${a.metrics.velocity.toFixed(1)} mph exit velocity, ${a.metrics.releaseTime.toFixed(2)}s release. The ball barely moved off the spiral. This is what the scouts are talking about.`,
      tagsFn: (a) => ["FridayNightLights", "QBDNAVerified", a.state],
      media: { type: "video", label: "Film clip" },
    },
    {
      type: "update",
      titleFn: (a) => `${a.name} picks up ${a.offers && a.offers.length > 3 ? "another P5" : "a new"} offer`,
      bodyFn: (a) =>
        `The ${a.gradYear} ${a.qbClass} QB from ${a.school} adds to his offer sheet. Now sitting at ${a.offers?.length || 0} total offers. Genome score trending up after a strong camp showing.`,
      tagsFn: (a) => ["Recruiting", `Class${a.gradYear}`, "OfferSzn"],
    },
    {
      type: "analysis",
      titleFn: (a) => `📊 Genome Breakdown: Why ${a.name}'s release is next-level`,
      bodyFn: (a) =>
        `We decoded ${a.name}'s throwing mechanics frame by frame. At ${a.metrics.releaseTime.toFixed(2)}s snap-to-release, he's in the top tier nationally. Combined with ${a.metrics.mechanics}/100 mechanical grade, this ${a.comparisonPlayer} comp is looking more real every week.`,
      tagsFn: (a) => ["GenomeBreakdown", "FilmStudy", "MechanicsLab"],
      media: { type: "chart", label: "Genome radar" },
    },
    {
      type: "milestone",
      titleFn: (a) => `🏆 ${a.name} cracks the Top ${Math.max(5, Math.round(6 - a.rating))} on the QBDNA Big Board`,
      bodyFn: (a) =>
        `After consistent performances, ${a.name} moves into elite territory on our genome-powered rankings. Accuracy: ${a.metrics.accuracy}%, Decision Speed: ${a.metrics.decisionSpeed}/100. The ${a.qbClass} architect is putting it all together.`,
      tagsFn: (a) => ["BigBoard", "QBIndex", "EliteGenome"],
      media: { type: "stat", label: "Rank card" },
    },
    {
      type: "comparison",
      titleFn: (a) => `${a.name} vs. ${a.comparisonPlayer}: The genome overlap is wild`,
      bodyFn: (a) =>
        `We ran ${a.name}'s genome profile against the NFL archetype for ${a.comparisonPlayer}. The overlap in arm velocity, decision processing, and pocket mechanics is striking. At ${a.height}, ${a.weight}lbs with the ${a.qbClass} label, the projection model loves this match.`,
      tagsFn: (a) => ["NFLComp", "GenomeMatch", a.comparisonPlayer?.replace(/\s/g, "") || "NFL"],
      media: { type: "chart", label: "Comparison overlay" },
    },
  ];

  athletes.forEach((a, ai) => {
    // Generate 2-3 posts per athlete
    const count = 2 + (parseInt(a.id) % 2);
    for (let pi = 0; pi < count; pi++) {
      const t = templates[(ai + pi) % templates.length];
      const hoursAgo = ai * 4 + pi * 7 + (parseInt(a.id) % 3);
      const seed = parseInt(a.id) * 13 + pi * 7;

      posts.push({
        id: `${a.id}-${pi}`,
        type: t.type,
        athlete: a,
        timestamp: new Date(now - hoursAgo * 3600000).toISOString(),
        timeAgo: hoursAgo < 1 ? "just now" : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
        title: t.titleFn(a),
        body: t.bodyFn(a),
        likes: 40 + seed % 300,
        comments: 5 + seed % 45,
        shares: 2 + seed % 30,
        tags: t.tagsFn(a),
        isHot: seed % 4 === 0,
        media: t.media,
      });
    }
  });

  // Sort by recency (reverse of hoursAgo effectively)
  return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/* ── Post Card ── */
function PostCard({ post, index }: { post: Post; index: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const a = post.athlete;

  const typeConfig: Record<PostType, { color: string; icon: typeof Flame; badge: string }> = {
    highlight: { color: "#FF3B5C", icon: Video, badge: "HIGHLIGHT" },
    update: { color: "#00C2FF", icon: TrendingUp, badge: "UPDATE" },
    analysis: { color: "#A855F7", icon: BarChart3, badge: "ANALYSIS" },
    milestone: { color: "#FFD700", icon: Trophy, badge: "MILESTONE" },
    comparison: { color: "#00FF88", icon: Target, badge: "VS" },
  };

  const cfg = typeConfig[post.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * Math.min(index, 10) }}
      className="glass rounded-xl overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Type stripe */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      <div className="p-5">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-uc-surface border border-white/10 flex items-center justify-center text-xs font-bold"
            style={{ color: cfg.color }}>
            {a.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href={`/athlete/${a.id}`} className="text-sm font-bold hover:text-uc-cyan transition-colors">
                {a.name}
              </Link>
              {a.verified && (
                <Shield size={10} className="text-uc-cyan" />
              )}
              <span
                className="text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded"
                style={{ backgroundColor: cfg.color + "15", color: cfg.color }}
              >
                {cfg.badge}
              </span>
              {post.isHot && (
                <span className="flex items-center gap-0.5 text-[7px] font-bold text-orange-400">
                  <Flame size={8} /> HOT
                </span>
              )}
            </div>
            <p className="text-[9px] text-uc-gray-500">
              {a.school} · {a.qbClass} · {post.timeAgo}
            </p>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-sm font-bold mb-2 leading-relaxed">{post.title}</h3>
        <p className="text-xs text-uc-gray-400 leading-relaxed mb-3">{post.body}</p>

        {/* Media placeholder */}
        {post.media && (
          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4 mb-3 flex items-center justify-center gap-2">
            <cfg.icon size={14} style={{ color: cfg.color }} />
            <span className="text-[9px] text-uc-gray-500 uppercase tracking-wider">{post.media.label}</span>
            <span className="text-[8px] text-uc-gray-600 ml-auto">{post.media.type === "video" ? "▶ Play" : "View"}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-uc-gray-500 hover:text-uc-cyan hover:bg-uc-cyan/5 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-6 pt-3 border-t border-white/5">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 text-[9px] font-bold transition-colors ${
              liked ? "text-uc-red" : "text-uc-gray-500 hover:text-uc-red"
            }`}
          >
            <Heart size={12} className={liked ? "fill-current" : ""} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-[9px] font-bold text-uc-gray-500 hover:text-uc-cyan transition-colors">
            <MessageCircle size={12} />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-[9px] font-bold text-uc-gray-500 hover:text-uc-green transition-colors">
            <Share2 size={12} />
            {post.shares}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`ml-auto flex items-center gap-1 text-[9px] font-bold transition-colors ${
              saved ? "text-uc-cyan" : "text-uc-gray-500 hover:text-uc-cyan"
            }`}
          >
            {saved ? <Bookmark size={12} className="fill-current" /> : <BookmarkPlus size={12} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Community Page ── */
export default function CommunityPage() {
  const athletes = PLACEHOLDER_ATHLETES;
  const allPosts = useMemo(() => generatePosts(athletes), [athletes]);

  const [filter, setFilter] = useState<PostType | "all">("all");
  const [showCount, setShowCount] = useState(8);

  const filtered = filter === "all" ? allPosts : allPosts.filter((p) => p.type === filter);
  const visible = filtered.slice(0, showCount);

  const filterOptions: Array<{ value: PostType | "all"; label: string; color: string }> = [
    { value: "all", label: "All", color: "#C0C0C0" },
    { value: "highlight", label: "Highlights", color: "#FF3B5C" },
    { value: "update", label: "Updates", color: "#00C2FF" },
    { value: "analysis", label: "Analysis", color: "#A855F7" },
    { value: "milestone", label: "Milestones", color: "#FFD700" },
    { value: "comparison", label: "Comparisons", color: "#00FF88" },
  ];

  // Trending tags
  const tagCounts = new Map<string, number>();
  allPosts.forEach((p) => p.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)));
  const trendingTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <MessageCircle size={12} />
            Community
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">The Feed</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Highlights, genome breakdowns, recruiting updates, and milestones
            from the QB ecosystem. Stay locked in.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main Feed */}
          <div>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilter(opt.value); setShowCount(8); }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${
                    filter === opt.value
                      ? "border"
                      : "text-uc-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    filter === opt.value
                      ? { backgroundColor: opt.color + "15", color: opt.color, borderColor: opt.color + "30" }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>

            {/* Posts */}
            <div className="space-y-4">
              {visible.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* Load more */}
            {visible.length < filtered.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6">
                <button
                  onClick={() => setShowCount((c) => c + 6)}
                  className="px-6 py-3 rounded-xl glass text-xs font-bold tracking-wider uppercase text-uc-cyan hover:bg-uc-cyan/10 transition-colors"
                >
                  Load More ({filtered.length - visible.length} remaining)
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block space-y-4"
          >
            {/* Trending Tags */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-3 flex items-center gap-1.5">
                <Flame size={10} className="text-orange-400" /> Trending
              </h3>
              <div className="space-y-2">
                {trendingTags.map(([tag, count], i) => (
                  <div key={tag} className="flex items-center gap-2">
                    <span className="text-[8px] text-uc-gray-600 w-4">{i + 1}</span>
                    <span className="text-xs text-uc-gray-400 hover:text-uc-cyan transition-colors cursor-pointer">
                      #{tag}
                    </span>
                    <span className="text-[8px] text-uc-gray-600 ml-auto">{count} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top QBs sidebar */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-3 flex items-center gap-1.5">
                <Award size={10} className="text-uc-cyan" /> Top Genomes
              </h3>
              <div className="space-y-2">
                {athletes
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((a, i) => (
                    <Link
                      key={a.id}
                      href={`/athlete/${a.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="text-[9px] font-bold text-uc-gray-500 w-4">{i + 1}</span>
                      <div className="w-6 h-6 rounded bg-uc-surface border border-white/10 flex items-center justify-center text-[8px] font-bold text-uc-cyan">
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate">{a.name}</p>
                        <p className="text-[7px] text-uc-gray-600">{a.school}</p>
                      </div>
                      <span className="text-[8px] font-bold text-uc-cyan">{a.rating}★</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass rounded-xl p-4 space-y-2">
              <h3 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-2">Quick Links</h3>
              {[
                { href: "/leaderboard", label: "QB Index", icon: BarChart3 },
                { href: "/draft", label: "Big Board", icon: Trophy },
                { href: "/combine", label: "Combine", icon: Zap },
                { href: "/film-room", label: "Film Room", icon: Video },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-[10px] text-uc-gray-400 hover:text-uc-cyan transition-colors py-1"
                >
                  <link.icon size={10} />
                  {link.label}
                  <ArrowRight size={8} className="ml-auto" />
                </Link>
              ))}
            </div>
          </motion.aside>
        </div>

        <DNAStrandDivider className="mt-10 mb-8 opacity-30" />

        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Want your genome decoded?
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Get Decoded
            <Dna size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
