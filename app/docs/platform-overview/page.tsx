"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download, Dna, Globe, Zap, Shield, BarChart3, Users, Code, Layers, Target, Brain, Trophy, Star } from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-uc-cyan to-uc-green text-black font-semibold text-sm hover:shadow-lg hover:shadow-uc-cyan/25 transition-all"
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
      <div className="h-px bg-gradient-to-r from-uc-cyan/50 to-transparent mt-4" />
    </div>
  );
}

const ROUTES = [
  { path: "/", label: "Homepage", desc: "Cinematic hero with 3D WebGL tunnel, floating metrics, athlete showcase, partners" },
  { path: "/search", label: "Prospect Search", desc: "Full-text search with filters (position, state, class year, metrics)" },
  { path: "/leaderboard", label: "Leaderboard", desc: "Ranked prospect tables with GAI scoring, percentile bars, tier badges" },
  { path: "/scout", label: "Scout", desc: "Scout cards with GAI tier, gene traits, QB index, and film links" },
  { path: "/compare", label: "Compare", desc: "Side-by-side athlete comparison with radar charts and metric deltas" },
  { path: "/athlete/[id]", label: "Athlete Profile", desc: "Full verified profile — metrics, NIL valuation, genome breakdown, film" },
  { path: "/profile/[id]", label: "Unified Profile", desc: "GAI timeline, gene expression chart, archetype analysis, fit rankings" },
  { path: "/genome", label: "Genome Timeline", desc: "Interactive GAI history chart with development trajectory visualization" },
  { path: "/lab", label: "Genome Lab", desc: "Slider-based gene modification sandbox — simulate development scenarios" },
  { path: "/combine", label: "Combine", desc: "Virtual combine events with drill results, leaderboards, and event scoring" },
  { path: "/draft", label: "Draft Board", desc: "Mock draft projections with GAI tiers, archetype labels, best-fit programs" },
  { path: "/board", label: "Big Board", desc: "Drag-and-drop prospect board with tier lanes and genome scoring" },
  { path: "/portal", label: "Transfer Portal", desc: "Portal tracker with fit rankings powered by GAI institutional fit algorithm" },
  { path: "/offers", label: "Offers Tracker", desc: "Scholarship offer management with genome fit scoring per program" },
  { path: "/map", label: "Prospect Map", desc: "Geographic hotbed visualization — state-by-state prospect density and GAI" },
  { path: "/stats", label: "Season Stats", desc: "Full season breakdown with game logs, passing/rushing splits, trends" },
  { path: "/gameday", label: "Game Day Live", desc: "Real-time game tracking with live stat feeds and performance grades" },
  { path: "/film-room", label: "Film Room", desc: "Video analysis hub with throw charts, play tagging, and coach notes" },
  { path: "/analytics", label: "Analytics", desc: "Advanced analytics dashboard with charts, percentile distributions" },
  { path: "/nil", label: "NIL Marketplace", desc: "Brand partnership listings, deal tracking, and NIL valuation engine" },
  { path: "/dashboard/nil", label: "NIL Dashboard", desc: "Personal NIL dashboard — earnings, deal pipeline, social metrics" },
  { path: "/collectibles", label: "Collectibles", desc: "Digital trading cards, genome-decoded card series, rarity tiers" },
  { path: "/card-generator", label: "Card Generator", desc: "Generate shareable QB cards — Dark, Holographic, and DNA themes" },
  { path: "/awards", label: "Awards", desc: "Annual genome awards — MVP, hardest thrower, most accurate, rising star" },
  { path: "/community", label: "Community", desc: "Social feed, discussion threads, coach/athlete interaction hub" },
  { path: "/training", label: "Training Programs", desc: "Development programs with drill progressions and genome growth tracking" },
  { path: "/coach", label: "Coach Hub", desc: "Coaching dashboard — depth charts, roster GAI analysis, watchlists" },
  { path: "/pricing", label: "Pricing", desc: "Tiered subscription plans — Free, Pro, and Elite with feature comparison" },
  { path: "/highlights", label: "Highlights", desc: "Top plays, trending moments, and curated athlete highlight reels" },
  { path: "/admin", label: "Admin Panel", desc: "Content management, athlete verification queue, metrics ingestion" },
  { path: "/login", label: "Authentication", desc: "JWT-based auth with role-based access (Athlete, Coach, Admin)" },
  { path: "/dashboard", label: "Dashboard", desc: "Personalized dashboard with recent activity, watchlist, notifications" },
];

export default function PlatformOverviewDoc() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            <Dna size={12} /> QBDNA · Under Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Platform <span className="gradient-text-dna">Overview</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            The complete build summary for Under Center — the verified quarterback identity platform. 
            Everything a team member or partner needs to understand what has been built and where it&apos;s going.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">February 2026 · Confidential</p>
        </motion.div>

        {/* ═══ SECTION 1: WHAT IS UNDER CENTER ═══ */}
        <SectionHeader title="What Is Under Center?" subtitle="The elevator pitch and strategic context" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-sm text-uc-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Under Center</strong> is the verified quarterback prospect identity platform — think <strong className="text-uc-cyan">PFF meets On3</strong>, built exclusively for quarterbacks. We capture objective throwing metrics using technologies like Wilson QBX and decode them into a proprietary <strong className="text-uc-green">Genome Activation Index (GAI)</strong> that college coaches and recruiters trust.
            </p>
            <p className="text-sm text-uc-gray-300 leading-relaxed mb-4">
              The platform makes a 15-year-old QB prospect feel like a D1 prospect the moment he sees his profile — while giving coaches the verified, data-driven signal they need to make recruiting decisions.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <Users size={16} className="text-uc-cyan mb-2" />
                <p className="text-xs font-bold text-white mb-1">Athletes = Identity</p>
                <p className="text-[11px] text-uc-gray-400">The platform gives every QB a verified identity — genome-decoded profiles, NIL valuation, shareable cards, and a permanent digital footprint.</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <Target size={16} className="text-uc-green mb-2" />
                <p className="text-xs font-bold text-white mb-1">Coaches = Customer</p>
                <p className="text-[11px] text-uc-gray-400">Coaches get objective, verified data they can trust — not subjective star ratings. GAI scoring, institutional fit algorithms, and real metrics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: CORE PRIMITIVE ═══ */}
        <SectionHeader title="The Core Primitive: GAI" subtitle="Genome Activation Index — the single number" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-uc-gray-300 leading-relaxed mb-4">
                Every page, every score, every ranking in Under Center resolves to one formula:
              </p>
              <div className="bg-black/40 rounded-xl p-4 border border-uc-cyan/20 font-mono text-sm text-uc-cyan mb-4">
                GAI = Base × Activation × (1 + Growth) × Fit
              </div>
              <p className="text-xs text-uc-gray-400 leading-relaxed">
                Normalized 0–99. The GAI library (<code className="text-uc-cyan/80">lib/genome-activation-index.ts</code>) is approximately 392 lines and exports <code className="text-uc-cyan/80">computeGAI()</code>, <code className="text-uc-cyan/80">detectArchetype()</code>, <code className="text-uc-cyan/80">computeAllFits()</code>, gene profiles, and 14 D1 program fit profiles. Every page in the platform imports from this single library.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-2">GAI Tiers</p>
              {[
                { tier: "Generational", range: "92–99", color: "#FFD700", desc: "Franchise-level talent" },
                { tier: "Elite", range: "82–91", color: "#A855F7", desc: "Day 1 starter potential" },
                { tier: "Blue-Chip", range: "68–81", color: "#00C2FF", desc: "Top program target" },
                { tier: "Prospect", range: "50–67", color: "#00FF88", desc: "Strong development arc" },
                { tier: "Developmental", range: "0–49", color: "#9CA3AF", desc: "Emerging genome" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-2.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white">{t.tier}</span>
                    <span className="text-[10px] text-uc-gray-400 ml-2">{t.range}</span>
                  </div>
                  <span className="text-[10px] text-uc-gray-400">{t.desc}</span>
                </div>
              ))}
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mt-4 mb-2">Archetypes (6)</p>
              {[
                { name: "Cannon Elite", color: "#00C2FF" },
                { name: "Surgeon", color: "#00FF88" },
                { name: "Architect", color: "#F59E0B" },
                { name: "Gunslinger", color: "#FF3B5C" },
                { name: "Catalyst", color: "#A855F7" },
                { name: "Prospect", color: "#9CA3AF" },
              ].map((a) => (
                <div key={a.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  <span className="text-xs text-white">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SECTION 3: TECH STACK ═══ */}
        <SectionHeader title="Technology Stack" subtitle="Modern, production-grade infrastructure" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Framework", value: "Next.js 16.1.6", icon: Code, desc: "App Router + Turbopack" },
              { label: "Language", value: "TypeScript", icon: Code, desc: "Strict mode, full type safety" },
              { label: "3D / WebGL", value: "React Three Fiber", icon: Globe, desc: "@react-three/fiber + drei" },
              { label: "Animation", value: "Framer Motion", icon: Zap, desc: "Scroll reveals, transitions" },
              { label: "State", value: "Zustand", icon: Layers, desc: "Global athlete + UI store" },
              { label: "Auth", value: "NextAuth.js", icon: Shield, desc: "JWT, role-based access" },
              { label: "Charts", value: "Recharts", icon: BarChart3, desc: "Radial gauges, area charts" },
              { label: "Styling", value: "Tailwind CSS", icon: Layers, desc: "Custom design tokens" },
              { label: "Icons", value: "Lucide React", icon: Star, desc: "200+ icons, tree-shaken" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <Icon size={14} className="text-uc-cyan mb-2" />
                  <p className="text-xs font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-uc-gray-400">{item.label} — {item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ SECTION 4: ALL ROUTES ═══ */}
        <SectionHeader title="36 Routes · Full Site Map" subtitle="Every page built and production-ready" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="space-y-2">
            {ROUTES.map((r, i) => (
              <div key={r.path} className="flex items-start gap-3 py-2 border-b border-white/[0.03] last:border-0">
                <span className="text-[10px] text-uc-gray-600 font-mono w-5 text-right flex-shrink-0 mt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-white">{r.label}</span>
                    <span className="text-[10px] font-mono text-uc-cyan/60">{r.path}</span>
                  </div>
                  <p className="text-[11px] text-uc-gray-400 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 5: KEY METRICS ═══ */}
        <SectionHeader title="Build Metrics" subtitle="What the numbers look like" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: "36", label: "Routes", icon: Globe },
            { value: "25+", label: "Components", icon: Layers },
            { value: "0", label: "Build Errors", icon: Shield },
            { value: "392", label: "GAI Lines", icon: Brain },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-xl p-5 text-center">
                <Icon size={16} className="mx-auto text-uc-cyan mb-2" />
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ═══ SECTION 6: REFERENCE ═══ */}
        <SectionHeader title="Design References" subtitle="Aesthetic pillars and competitive positioning" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "On3.com", desc: "Recruiting database UX — prospect cards, rankings, offer tracking, and profile depth. Our data density benchmark.", color: "text-uc-cyan" },
              { name: "PFF.com", desc: "Analytics-forward presentation — grades, charts, and premium data display. Our charting and analytics standard.", color: "text-uc-green" },
              { name: "Overtime.tv", desc: "Youth sports energy — dark, bold, social-first design. Our brand energy and shareability model.", color: "text-purple-400" },
            ].map((ref) => (
              <div key={ref.name} className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.05]">
                <p className={`text-sm font-bold ${ref.color} mb-2`}>{ref.name}</p>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed">{ref.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">
            QBDNA · Under Center · Confidential Platform Documentation · February 2026
          </p>
          <div className="mt-4 no-print">
            <PrintButton />
          </div>
        </div>
      </div>
    </main>
  );
}
