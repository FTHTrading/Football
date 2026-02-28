"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Download, Video, Image, Share2, Palette, Shield,
  BarChart3, Users, Trophy, Smartphone, Film, Camera, Zap,
  Globe, Settings, Layout, MessageSquare, Wand2, Eye
} from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-uc-green to-uc-cyan text-black font-semibold text-sm hover:shadow-lg hover:shadow-uc-green/25 transition-all"
    >
      <Download size={14} /> Download PDF
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 print-page-break">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-uc-gray-400">{subtitle}</p>
      <div className="h-px bg-gradient-to-r from-uc-green/50 to-transparent mt-4" />
    </div>
  );
}

const FEATURE_CATEGORIES = [
  {
    name: "Athlete-Facing",
    icon: <Shield size={16} />,
    color: "#00C2FF",
    features: [
      { route: "/profile/[id]", name: "Athlete Profile", desc: "Full genome breakdown, film, stats, NIL valuation, GAI score — the athlete's digital identity hub" },
      { route: "/dashboard", name: "Athlete Dashboard", desc: "Personal metrics overview, recent activity, GAI trend, quick links to all profile sections" },
      { route: "/card-generator", name: "Card Generator", desc: "Create shareable athlete cards in 3 themes (Dark, Holo, DNA) — Instagram-ready with photo, stats, GAI" },
      { route: "/nil-marketplace", name: "NIL Marketplace", desc: "Browse and filter NIL opportunities, valuations, brand match scoring using GAI data" },
      { route: "/community", name: "Community Hub", desc: "Social feed for athletes — posts, highlights, workout clips, team interactions" },
      { route: "/portal", name: "Transfer Portal", desc: "Explore portal entries with GAI fit scoring to available programs" },
    ],
  },
  {
    name: "Coach & Recruiting",
    icon: <Users size={16} />,
    color: "#00FF88",
    features: [
      { route: "/search", name: "Athlete Search", desc: "Advanced search with 12+ filters — position, GAI range, archetype, state, class year, stats" },
      { route: "/board", name: "Recruiting Board", desc: "Kanban-style pipeline. Drag athletes across stages: Prospect → Offered → Committed → Signed" },
      { route: "/compare", name: "Head-to-Head Compare", desc: "Side-by-side profile comparison with 8 genome categories, radar charts, percentile bars" },
      { route: "/draft", name: "Mock Draft", desc: "Simulated draft board with pick projections driven by GAI composite scores" },
      { route: "/coach-dashboard", name: "Coach Dashboard", desc: "Class building tools, watchlist management, recruiting analytics, pipeline health metrics" },
      { route: "/scout", name: "Scout Tool", desc: "Film annotation and scouting reports with gene-specific notes and custom grading" },
    ],
  },
  {
    name: "Analytics & Data",
    icon: <BarChart3 size={16} />,
    color: "#A855F7",
    features: [
      { route: "/leaderboard", name: "National Leaderboard", desc: "Ranked list of all athletes by GAI, filterable by archetype, tier, state, position" },
      { route: "/stats", name: "Stats Explorer", desc: "Deep statistical breakdowns with season splits, game logs, efficiency metrics, comparisons" },
      { route: "/awards", name: "Awards & Rankings", desc: "Weekly/seasonal awards — Genome of the Week, top risers, all-conference teams, honors" },
      { route: "/map", name: "National Map", desc: "Interactive US map showing athlete density, program locations, recruiting hotbeds by state" },
      { route: "/trends", name: "Trend Analytics", desc: "GAI trajectory charts, class ranking movements, metric growth over time" },
      { route: "/lab", name: "Genome Lab", desc: "Experimental analytics sandbox — custom gene weights, what-if scenarios, fit projections" },
    ],
  },
  {
    name: "Content & Media",
    icon: <Film size={16} />,
    color: "#FFD700",
    features: [
      { route: "/film-room", name: "Film Room", desc: "Embedded video player for game film breakdown — tag plays, annotate reads, grade throws" },
      { route: "/highlights", name: "Highlight Reels", desc: "Curated highlight packages organized by category — best throws, scrambles, clutch plays" },
      { route: "/game-day", name: "Game Day Live", desc: "Real-time game tracking with live stat updates, play-by-play, and scoring drives" },
      { route: "/offers", name: "Offer Tracker", desc: "Track scholarship offers with program details, visit dates, commitment timelines" },
      { route: "/chat", name: "Messaging", desc: "Direct messaging between athletes, coaches, and recruiters with role-based access" },
      { route: "/notifications", name: "Activity Feed", desc: "Real-time notifications for offers, mentions, new film uploads, watchlist changes" },
    ],
  },
];

const VIDEO_INTEGRATION = [
  { area: "Film Room", path: "/film-room", icon: <Film size={16} />, desc: "Full-screen video player with frame-by-frame controls, play tagging, and gene-specific annotation. Supports embedded YouTube, Hudl links, and direct MP4 uploads.", capability: "Player, annotations, tags" },
  { area: "Highlight Reels", path: "/highlights", icon: <Video size={16} />, desc: "Auto-curated highlight packages. Athletes can upload clips categorized by play type (deep ball, RPO, scramble). Coaches can browse by gene category.", capability: "Upload, categorize, browse" },
  { area: "Athlete Profile", path: "/profile/[id]", icon: <Eye size={16} />, desc: "Profile includes a featured highlight reel section. Pinned top film, embedded player, view counts. First thing coaches see after the GAI score.", capability: "Featured reel, embed" },
  { area: "Community Posts", path: "/community", icon: <MessageSquare size={16} />, desc: "Social feed supports video attachments. Workout clips, training highlights, and game day moments can be shared and liked.", capability: "Video posts, feed" },
  { area: "Game Day Live", path: "/game-day", icon: <Zap size={16} />, desc: "Live game streams and replay clips. Integration point for broadcast feeds or stadium camera systems.", capability: "Live stream, replays" },
  { area: "Scout Reports", path: "/scout", icon: <Camera size={16} />, desc: "Scouting tool with timestamped video notes. Link specific film moments to gene grades for evidence-based evaluation.", capability: "Timestamped notes" },
];

const IMAGERY_AREAS = [
  { area: "Athlete Profile Photo", desc: "Primary headshot on profile and all cards. Supports upload, crop, and automatic background removal.", format: "Square, min 400×400" },
  { area: "Card Generator", desc: "Photo integrated into shareable cards across 3 themes. Cards auto-compose with athlete photo, GAI, stats, and branding.", format: "Portrait, auto-crop" },
  { area: "Community Posts", desc: "Image attachments on social feed. Gallery view for multi-image posts. Lazy loaded with blur placeholder.", format: "Any, responsive" },
  { area: "Program Logos", desc: "University/program logos on portal, offers, board, and compare views. Stored in public/logos/ directory.", format: "SVG preferred, 200×200" },
  { area: "Action Shots", desc: "Game action photos on highlights, awards, and featured sections. Parallax scroll effects on hero sections.", format: "16:9 landscape" },
  { area: "OG / Social Preview", desc: "Auto-generated Open Graph images for social sharing. Athlete name, GAI, and photo composited onto branded template.", format: "1200×630 OG spec" },
];

const CUSTOMIZATION = [
  { capability: "Color Theming", icon: <Palette size={14} />, desc: "All colors defined as CSS custom properties and Tailwind tokens. Swap the entire palette by editing 3 lines in tailwind.config.ts. Supports dark mode by default.", effort: "5 min" },
  { capability: "Logo Replacement", icon: <Image size={14} />, desc: "Drop new logo SVG into /public, update Navigation.tsx import. Supports icon-only and full variants for responsive display.", effort: "10 min" },
  { capability: "Font Swap", icon: <Layout size={14} />, desc: "Fonts loaded via next/font in layout.tsx. Replace Geist with any Google Font or custom .woff2 in one file change.", effort: "10 min" },
  { capability: "White-Label Mode", icon: <Globe size={14} />, desc: "All brand references (QBDNA, Under Center) are string constants. A white-label config file could rebrand the entire platform for a conference, school, or 7-on-7 org.", effort: "1 hr" },
  { capability: "Component Theming", icon: <Wand2 size={14} />, desc: "DNA theme classes (genome-scan, nucleotide-drift, etc.) can be globally toggled or replaced with alternative motion styles. All CSS animations in globals.css.", effort: "30 min" },
  { capability: "Layout Variants", icon: <Settings size={14} />, desc: "Module-based page construction. Each route is self-contained — add/remove pages by creating/deleting folders. No global routing config needed (App Router file-based routing).", effort: "Varies" },
];

export default function CapabilitiesDoc() {
  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="doc-container">
        {/* Nav */}
        <div className="flex items-center justify-between mb-12 no-print">
          <Link href="/docs" className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to Docs
          </Link>
          <PrintButton />
        </div>

        {/* Cover */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.4em] uppercase text-uc-green mb-6">
            <Zap size={12} /> Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Features & <span className="gradient-text-dna">Customization</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            Every feature built into Under Center — organized by audience, with details on video, imagery, 
            logo integration, and how the platform can be tailored to your brand.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">February 2026 · Confidential</p>
        </motion.div>

        {/* ═══ SECTION 1: FEATURE MAP ═══ */}
        <SectionHeader title="Feature Map" subtitle="24 features across 4 categories" />
        {FEATURE_CATEGORIES.map((cat) => (
          <div key={cat.name} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: cat.color }}>{cat.icon}</span>
              <h3 className="text-sm font-bold text-white">{cat.name}</h3>
              <span className="text-[10px] text-uc-gray-500 ml-2">{cat.features.length} features</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {cat.features.map((feat) => (
                <div key={feat.route} className="glass rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{feat.name}</span>
                    <code className="text-[9px] font-mono" style={{ color: cat.color + "80" }}>{feat.route}</code>
                  </div>
                  <p className="text-[11px] text-uc-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ═══ SECTION 2: VIDEO INTEGRATION ═══ */}
        <SectionHeader title="Video & Film Integration" subtitle="6 integration points for video content across the platform" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="space-y-4">
            {VIDEO_INTEGRATION.map((v) => (
              <div key={v.area} className="bg-white/[0.03] rounded-xl p-4 border border-yellow-400/[0.06] flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0 text-yellow-400">
                  {v.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{v.area}</span>
                    <code className="text-[9px] font-mono text-yellow-400/50">{v.path}</code>
                    <span className="ml-auto text-[9px] text-uc-gray-500 bg-white/[0.03] px-2 py-0.5 rounded-full">{v.capability}</span>
                  </div>
                  <p className="text-[11px] text-uc-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
            <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-2">Supported Formats</p>
            <div className="flex flex-wrap gap-2">
              {["MP4", "WebM", "YouTube Embed", "Hudl Link", "Vimeo", "HLS Stream", "iframe Embed"].map((f) => (
                <span key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-uc-gray-300 border border-white/[0.06]">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SECTION 3: IMAGERY ═══ */}
        <SectionHeader title="Imagery & Media" subtitle="Photo and image integration across the platform" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {IMAGERY_AREAS.map((img) => (
              <div key={img.area} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold text-white">{img.area}</span>
                  <span className="text-[9px] font-mono text-uc-cyan/50">{img.format}</span>
                </div>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed">{img.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
            <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-2">Image Optimization</p>
            <p className="text-[11px] text-uc-gray-300 leading-relaxed">
              All images use Next.js <code className="text-uc-cyan/70">&lt;Image /&gt;</code> component with automatic WebP conversion, 
              responsive srcset generation, lazy loading, and blur-up placeholder. No manual image optimization needed — the framework handles 
              format selection, CDN delivery, and device-appropriate sizing automatically.
            </p>
          </div>
        </div>

        {/* ═══ SECTION 4: CUSTOMIZATION ═══ */}
        <SectionHeader title="Customization & White-Label" subtitle="How to tailor the platform to any brand or organization" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="space-y-3">
            {CUSTOMIZATION.map((c) => (
              <div key={c.capability} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-uc-green/10 flex items-center justify-center flex-shrink-0 text-uc-green">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xs font-bold text-white">{c.capability}</span>
                    <span className="text-[9px] bg-uc-green/10 text-uc-green px-2 py-0.5 rounded-full">~{c.effort}</span>
                  </div>
                  <p className="text-[11px] text-uc-gray-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 5: FOR THE DESIGNER ═══ */}
        <SectionHeader title="For the Webflow Designer" subtitle="What you'll be working with and how to extend it" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-4">What's Built</p>
              <div className="space-y-2">
                {[
                  "36 production routes with full UI",
                  "25+ reusable components",
                  "GAI scoring engine (392 lines)",
                  "3D WebGL hero with bloom effects",
                  "Complete design system with DNA theme",
                  "Print-ready documentation (you're reading it)",
                  "Role-based auth (Athlete/Coach/Admin)",
                  "Full responsive mobile support",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-uc-green text-xs mt-0.5">✓</span>
                    <span className="text-[11px] text-uc-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-4">What You Can Add</p>
              <div className="space-y-2">
                {[
                  "Webflow landing pages & marketing site",
                  "Custom logo design and brand assets",
                  "Rich media upload flows (drag & drop)",
                  "Enhanced mobile interactions & gestures",
                  "Marketing email templates",
                  "Onboarding flow design",
                  "Print materials (recruiting flyers, etc.)",
                  "Additional page templates & layouts",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 text-xs mt-0.5">+</span>
                    <span className="text-[11px] text-uc-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 bg-gradient-to-r from-uc-green/5 to-purple-500/5 rounded-xl p-5 border border-uc-green/10">
            <p className="text-sm font-bold text-white mb-2">The Vision</p>
            <p className="text-[11px] text-uc-gray-300 leading-relaxed">
              Under Center is built to be the <strong className="text-white">On3 + PFF + Overtime</strong> for quarterback identity. 
              The app engine is production-ready. What it needs next is a world-class visual layer — a Webflow marketing site, 
              polished brand assets, and the kind of design craft that makes athletes want to claim their profile and coaches want 
              to live in the platform. That's where you come in.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">
            QBDNA · Under Center · Capabilities & Customization · February 2026
          </p>
          <div className="mt-4 no-print">
            <PrintButton />
          </div>
        </div>
      </div>
    </main>
  );
}
