"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download, Dna, Palette, Type, Layers, Sparkles, Monitor, Box } from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all"
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
      <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent mt-4" />
    </div>
  );
}

const COLORS = [
  { name: "UC Black", value: "#0A0A0A", css: "bg-uc-black", usage: "Primary background" },
  { name: "UC Surface", value: "#111111", css: "bg-uc-surface / bg-uc-panel", usage: "Card backgrounds, panels" },
  { name: "UC Cyan", value: "#00C2FF", css: "text-uc-cyan", usage: "Primary accent, links, highlights" },
  { name: "UC Silver", value: "#C0C0C0", css: "text-uc-silver", usage: "Secondary text, subtle accents" },
  { name: "UC Green", value: "#00FF88", css: "text-uc-green", usage: "Success states, GAI elite tier, DNA accent" },
  { name: "UC Red", value: "#FF3B5C", css: "text-uc-red", usage: "Warnings, declining trends, Gunslinger archetype" },
  { name: "Gold", value: "#FFD700", css: "text-yellow-400", usage: "Generational tier, awards, #1 rankings" },
  { name: "Purple", value: "#A855F7", css: "text-purple-400", usage: "Elite tier, Catalyst archetype, genome badges" },
  { name: "Gray 400", value: "#9CA3AF", css: "text-uc-gray-400", usage: "Body text, labels, descriptions" },
  { name: "Gray 600", value: "#4B5563", css: "text-uc-gray-600", usage: "Muted text, disclaimers, borders" },
];

const COMPONENTS = [
  { name: "Glass Panel", desc: "Semi-transparent panels with backdrop-blur — the primary container for all content cards", css: ".glass", usage: "Every card, modal, and section container" },
  { name: "Gradient Text (DNA)", desc: "Animated gradient text cycling cyan → green → purple", css: ".gradient-text-dna", usage: "Page titles, hero headlines, premium labels" },
  { name: "Genome Scan", desc: "Horizontal scanning shimmer animation on metric bars", css: ".genome-scan", usage: "Loading states, metric reveals, emphasis" },
  { name: "Nucleotide Drift", desc: "Floating particle animation suggesting DNA base pairs", css: ".nucleotide-drift", usage: "Background ambience on genome pages" },
  { name: "Base Pair Glow", desc: "Pulsing glow effect on interactive DNA elements", css: ".base-pair-glow", usage: "Hover states, active gene markers" },
  { name: "DNA Background Pattern", desc: "Subtle background pattern with double-helix motif", css: ".dna-bg-pattern", usage: "Full-page backgrounds, section dividers" },
  { name: "Genome Border", desc: "Animated gradient border cycling through gene colors", css: ".genome-border", usage: "Featured cards, premium athlete profiles" },
  { name: "Verified Badge", desc: "Checkmark badge with cyan glow confirming verified metrics", css: "<VerifiedBadge />", usage: "Athlete cards, profiles, leaderboards" },
  { name: "DNA Helix", desc: "3D WebGL double-helix component using React Three Fiber", css: "<DNAHelix />", usage: "Hero section, genome pages" },
  { name: "DNA Strand Divider", desc: "Horizontal animated strand used as section separator", css: "<DNAStrandDivider />", usage: "Between page sections" },
  { name: "Metric Card", desc: "Individual metric display with value, percentile bar, and gene label", css: "<MetricCard />", usage: "Athlete profiles, search results, comparisons" },
  { name: "NIL Valuation", desc: "Animated dollar counter with factor breakdown bars", css: "<NILValuation />", usage: "Athlete profiles, NIL marketplace" },
  { name: "Card Canvas", desc: "Shareable athlete card with three themes: Dark, Holographic, DNA", css: "<CardCanvas />", usage: "Card Generator page, social sharing" },
  { name: "Hero Tunnel", desc: "3D perspective tunnel with postprocessing bloom effects", css: "<HeroTunnel />", usage: "Homepage hero background" },
];

const ANIMATIONS = [
  { name: "Scroll Reveal", desc: "Elements fade in and slide up as they enter viewport", lib: "framer-motion useInView", usage: "All page sections, cards, content blocks" },
  { name: "Staggered List", desc: "Sequential delay on child elements for cascade reveal", lib: "framer-motion transition.delay", usage: "Leaderboard rows, grid items, stat blocks" },
  { name: "Tab Transitions", desc: "AnimatePresence with opacity/position swap between tabs", lib: "framer-motion AnimatePresence", usage: "Stats tabs, filter views, dashboard panels" },
  { name: "Animated Counter", desc: "Number counting animation from 0 to target value", lib: "framer-motion useMotionValue", usage: "NIL dollar values, GAI scores, stats" },
  { name: "Hover Lift", desc: "Cards scale and glow on hover with shadow expansion", lib: "CSS transition + framer-motion whileHover", usage: "All interactive cards and buttons" },
  { name: "Gradient Shift", desc: "Background gradient slowly rotates or shifts colors", lib: "CSS @keyframes", usage: "CTA buttons, hero elements, premium badges" },
];

export default function DesignSystemDoc() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-400/20 text-[10px] tracking-[0.4em] uppercase text-purple-400 mb-6">
            <Palette size={12} /> Design System
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Visual <span className="gradient-text-dna">Language</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            The complete design system for Under Center — colors, typography, components, animations, and DNA theming. 
            Everything a designer needs to extend, customize, and build upon the brand.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">February 2026 · Confidential</p>
        </motion.div>

        {/* ═══ SECTION 1: COLOR PALETTE ═══ */}
        <SectionHeader title="Color Palette" subtitle="10 core colors with specific usage contexts" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {COLORS.slice(0, 5).map((c) => (
              <div key={c.name}>
                <div className="aspect-[3/2] rounded-xl border border-white/[0.05] mb-2" style={{ background: c.value }} />
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-[10px] font-mono text-uc-gray-400">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {COLORS.slice(5).map((c) => (
              <div key={c.name}>
                <div className="aspect-[3/2] rounded-xl border border-white/[0.05] mb-2" style={{ background: c.value }} />
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-[10px] font-mono text-uc-gray-400">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-6">
            <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-3">Usage Guide</p>
            {COLORS.map((c) => (
              <div key={c.name} className="flex items-center gap-3 py-1.5 border-b border-white/[0.03] last:border-0">
                <div className="w-4 h-4 rounded-full flex-shrink-0 border border-white/10" style={{ background: c.value }} />
                <span className="text-xs font-bold text-white w-24">{c.name}</span>
                <code className="text-[10px] font-mono text-uc-cyan/60 w-48">{c.css}</code>
                <span className="text-[11px] text-uc-gray-400 flex-1">{c.usage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 2: TYPOGRAPHY ═══ */}
        <SectionHeader title="Typography" subtitle="Font families, sizing, and text patterns" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-4">Primary Fonts</p>
              <div className="space-y-4">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-2xl font-bold text-white font-sans mb-1">Geist Sans</p>
                  <p className="text-[11px] text-uc-gray-400">Body text, headings, labels — clean geometric sans-serif from Vercel</p>
                  <p className="text-[10px] font-mono text-uc-cyan/60 mt-2">var(--font-geist-sans)</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-2xl font-bold text-white font-mono mb-1">Geist Mono</p>
                  <p className="text-[11px] text-uc-gray-400">Metrics, gene labels, codes, technical data — monospaced variant</p>
                  <p className="text-[10px] font-mono text-uc-cyan/60 mt-2">var(--font-geist-mono)</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-4">Text Patterns</p>
              <div className="space-y-3">
                {[
                  { label: "Hero Headlines", example: "text-5xl md:text-7xl font-bold tracking-tight", size: "text-5xl", tracking: "tracking-tight" },
                  { label: "Page Titles", example: "text-3xl sm:text-4xl font-bold", size: "text-3xl+", tracking: "tracking-tight" },
                  { label: "Section Labels", example: "text-[10px] tracking-[0.4em] uppercase", size: "10px", tracking: "0.4em" },
                  { label: "Metric Values", example: "text-3xl font-black tabular-nums", size: "text-3xl", tracking: "tabular-nums" },
                  { label: "Body Text", example: "text-sm text-uc-gray-400", size: "text-sm", tracking: "normal" },
                  { label: "Gene Labels", example: "text-[8px] font-mono uppercase", size: "8px", tracking: "mono" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                    <span className="text-xs font-bold text-white">{t.label}</span>
                    <code className="text-[9px] font-mono text-uc-gray-400">{t.size} · {t.tracking}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 3: COMPONENT LIBRARY ═══ */}
        <SectionHeader title="Component Library" subtitle="14 reusable components with DNA theming" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="space-y-3">
            {COMPONENTS.map((comp, i) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full min-h-[40px] rounded-full bg-gradient-to-b from-uc-cyan to-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{comp.name}</span>
                      <code className="text-[9px] font-mono text-uc-cyan/50">{comp.css}</code>
                    </div>
                    <p className="text-[11px] text-uc-gray-400 leading-relaxed mb-1">{comp.desc}</p>
                    <p className="text-[10px] text-uc-gray-500">Used in: {comp.usage}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 4: ANIMATION ═══ */}
        <SectionHeader title="Animation Patterns" subtitle="Motion design language powered by Framer Motion" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {ANIMATIONS.map((anim) => (
              <div key={anim.name} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <Sparkles size={12} className="text-purple-400 mb-2" />
                <p className="text-xs font-bold text-white mb-1">{anim.name}</p>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed mb-2">{anim.desc}</p>
                <div className="flex items-center justify-between">
                  <code className="text-[9px] font-mono text-purple-400/60">{anim.lib}</code>
                  <span className="text-[9px] text-uc-gray-500">{anim.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 5: LOGO & BRANDING ═══ */}
        <SectionHeader title="Logo & Brand Identity" subtitle="Customizable branding and identity configuration" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-uc-gray-300 leading-relaxed mb-4">
                The platform supports full logo and brand identity customization. The current brand elements include:
              </p>
              <div className="space-y-3">
                {[
                  { label: "Brand Name", value: "Under Center · QBDNA", note: "Configurable in layout.tsx metadata" },
                  { label: "Tagline", value: "The Verified Quarterback Index", note: "Used in nav, hero, meta description" },
                  { label: "Logo Placement", value: "Navigation bar (top-left)", note: "SVG/PNG swap via Navigation.tsx" },
                  { label: "Favicon", value: "app/favicon.ico", note: "Standard ICO format, replaceable" },
                  { label: "Badge System", value: "QBDNA · Under Center pill", note: "Appears on hero, cards, docs" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.03] rounded-lg p-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span className="text-[10px] text-uc-cyan">{item.value}</span>
                    </div>
                    <p className="text-[10px] text-uc-gray-400 mt-0.5">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-uc-gray-400 uppercase tracking-widest mb-4">Designer Notes</p>
              <div className="bg-white/[0.02] rounded-xl p-5 border border-purple-400/10">
                <p className="text-[11px] text-uc-gray-300 leading-relaxed mb-3">
                  A full logo asset can be added to the <code className="text-uc-cyan/80">public/</code> directory and referenced in the Navigation component. The design system supports:
                </p>
                <ul className="text-[11px] text-uc-gray-400 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span> SVG logos with white/cyan colorways for dark backgrounds</li>
                  <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span> Responsive logo variants (icon-only for mobile, full for desktop)</li>
                  <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span> Animated logo with genome-scan shimmer effect</li>
                  <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span> Card watermark for generated shareable cards</li>
                  <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span> OG image template for social sharing previews</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">
            QBDNA · Under Center · Design System Documentation · February 2026
          </p>
          <div className="mt-4 no-print">
            <PrintButton />
          </div>
        </div>
      </div>
    </main>
  );
}
