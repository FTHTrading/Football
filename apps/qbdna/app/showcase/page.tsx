"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Dna,
  Shield,
  Palette,
  BarChart3,
  Share2,
  Zap,
  Eye,
  Layers,
  Smartphone,
  Monitor,
  Code2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ─── Capabilities Data ────────────────────────────

const PLATFORM_LAYERS = [
  {
    id: "profiles",
    label: "Athlete Profiles",
    icon: <Shield size={20} />,
    color: "uc-cyan",
    description:
      "QB-specific verified profiles with video, metrics, scouting data, and recruiting status — built for the evaluator, not just the athlete.",
    stats: ["62+ pages", "6 data views per profile", "Video-integrated"],
    link: "/search",
    cta: "Browse QBs",
  },
  {
    id: "metrics",
    label: "Data Visualization",
    icon: <BarChart3 size={20} />,
    color: "uc-green",
    description:
      "A proprietary visual language for arm velocity, release time, spin rate, accuracy heatmaps, and mechanics grades — all purpose-built for quarterback data.",
    stats: [
      "Genome Activation Index",
      "10+ metric types",
      "Percentile engine",
    ],
    link: "/search",
    cta: "See Metrics",
  },
  {
    id: "cards",
    label: "Card Generator",
    icon: <Palette size={20} />,
    color: "uc-cyan",
    description:
      "Three theme variants — Dark, Holographic, DNA — each fully data-bound to the athlete profile. Downloadable as high-res PNGs via html-to-image.",
    stats: ["3 themes", "Auto data-binding", "PNG export"],
    link: "/card-generator",
    cta: "Card Lab",
  },
  {
    id: "graphics",
    label: "Social Identity",
    icon: <Share2 size={20} />,
    color: "uc-green",
    description:
      "Seven shareable graphic templates — commitment, offer, ranking, verified, game-day, stat showcase, and IG story — designed for Instagram and Twitter.",
    stats: ["7 templates", "3x retina export", "Web Share API"],
    link: "/graphics",
    cta: "Graphics Studio",
  },
  {
    id: "studio",
    label: "AI Media Studio",
    icon: <Zap size={20} />,
    color: "uc-cyan",
    description:
      "Text-to-image and text-to-video generation using open-source AI models (HuggingFace FLUX) with fallback to OpenAI DALL-E, Replicate Flux Pro, and Stability SDXL.",
    stats: ["4 image providers", "4 video models", "Free tier included"],
    link: "/studio",
    cta: "AI Studio",
  },
  {
    id: "nil",
    label: "NIL Infrastructure",
    icon: <Layers size={20} />,
    color: "uc-green",
    description:
      "Digital marketplace, compliance tracking, and deal-flow management — the business layer that turns eyeballs into revenue for athletes and the platform.",
    stats: ["Marketplace hub", "Compliance engine", "Deal tracker"],
    link: "/nil",
    cta: "NIL Hub",
  },
];

const TECH_STACK = [
  { name: "Next.js 16", note: "App Router, SSR + Static" },
  { name: "React 19", note: "Latest concurrent features" },
  { name: "Tailwind 4", note: "Design tokens, layers" },
  { name: "TypeScript", note: "Strict mode, Zod validation" },
  { name: "Framer Motion", note: "Physics-based animation" },
  { name: "GSAP + Three.js", note: "3D and scroll effects" },
  { name: "Zustand", note: "Lightweight state management" },
  { name: "NextAuth.js", note: "Auth layer ready" },
  { name: "Prisma", note: "DB schema for athletes, NIL" },
  { name: "HuggingFace", note: "Free AI image gen" },
  { name: "Replicate", note: "AI video gen" },
  { name: "html-to-image", note: "PNG card export" },
];

const COMPETITIVE_ADVANTAGES = [
  {
    title: "Not a Webflow site",
    description:
      "This is a React application with API routes, AI integration, data pipelines, and a component system. It's infrastructure, not a marketing page.",
  },
  {
    title: "Component library",
    description:
      "MetricCard, PercentileBar, GenomeWheel, SocialGraphic, CardCanvas — composable, theme-aware, data-bound components.",
  },
  {
    title: "Social-first design",
    description:
      "Every graphic template is built for Instagram dimensions, retina export, and Web Share API. Kids will post these without being asked.",
  },
  {
    title: "AI-native",
    description:
      "Image and video generation baked into the platform — not bolted on. Free models by default, premium models as upgrade path.",
  },
  {
    title: "Data visualization language",
    description:
      "Purpose-built visual system for quarterback metrics — velocity arcs, release time gauges, accuracy heatmaps, mechanics grades.",
  },
  {
    title: "Monorepo ready",
    description:
      "Turborepo + npm workspaces. Under Center (QBDNA) and NIL33 run side by side with shared packages. Built for scale.",
  },
];

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ShowcasePage() {
  const [activeLayer, setActiveLayer] = useState("profiles");

  const current =
    PLATFORM_LAYERS.find((l) => l.id === activeLayer) || PLATFORM_LAYERS[0];

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ─── Hero ───────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            <Eye size={12} />
            Platform Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="gradient-text">Under Center</span>
            <br />
            <span className="text-white/80 text-2xl md:text-3xl font-light tracking-wide">
              is the platform QBDNA needs.
            </span>
          </h1>
          <p className="text-uc-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mt-4">
            You posted a job for a Webflow designer. We built a full-stack
            athlete intelligence platform — with AI generation, social identity
            templates, NIL infrastructure, and a proprietary data visualization
            language — in React.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 transition-all text-sm font-semibold tracking-wider uppercase"
            >
              Explore Platform <ArrowRight size={14} />
            </Link>
            <Link
              href="/graphics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold tracking-wider uppercase"
            >
              Social Graphics <Share2 size={14} />
            </Link>
          </div>
        </motion.section>

        {/* ─── Platform Layers ────────────── */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-10"
          >
            <Layers size={12} className="inline mr-2" />
            Platform Architecture — 6 Layers
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Layer selector */}
            <div className="lg:w-56 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {PLATFORM_LAYERS.map((layer, i) => (
                <motion.button
                  key={layer.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all whitespace-nowrap lg:whitespace-normal ${
                    activeLayer === layer.id
                      ? `bg-${layer.color}/15 border border-${layer.color}/30`
                      : "bg-uc-surface border border-white/5 hover:border-white/10"
                  }`}
                >
                  <span
                    className={
                      activeLayer === layer.id
                        ? `text-${layer.color}`
                        : "text-uc-gray-400"
                    }
                  >
                    {layer.icon}
                  </span>
                  <span
                    className={`text-xs font-semibold ${activeLayer === layer.id ? "text-white" : "text-uc-gray-400"}`}
                  >
                    {layer.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Layer detail */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-${current.color}`}>
                      {current.icon}
                    </span>
                    <h3 className="text-xl font-bold">{current.label}</h3>
                  </div>
                  <p className="text-uc-gray-400 leading-relaxed mb-6">
                    {current.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {current.stats.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-uc-gray-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={current.link}
                    className={`inline-flex items-center gap-2 text-sm font-semibold text-${current.color} hover:underline`}
                  >
                    {current.cta} <ChevronRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ─── Competitive Advantages ────── */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-10"
          >
            <Dna size={12} className="inline mr-2" />
            Why This Isn&apos;t Just a Website
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            {COMPETITIVE_ADVANTAGES.map((adv, i) => (
              <motion.div
                key={adv.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-uc-green mt-0.5 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{adv.title}</h4>
                    <p className="text-xs text-uc-gray-400 leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Tech Stack ────────────────── */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-10"
          >
            <Code2 size={12} className="inline mr-2" />
            Technology Stack
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                className="bg-uc-surface border border-white/5 rounded-lg p-4 hover:border-uc-cyan/20 transition-colors"
              >
                <p className="text-xs font-semibold text-white mb-0.5">
                  {tech.name}
                </p>
                <p className="text-[10px] text-uc-gray-400">{tech.note}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Responsive Showcase ────────── */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] tracking-[0.4em] uppercase text-uc-gray-400 mb-10"
          >
            <Monitor size={12} className="inline mr-2" />
            <Smartphone size={12} className="inline mr-2" />
            Fully Responsive — Desktop to Mobile
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-40 h-24 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                  <Monitor size={28} className="text-uc-gray-400" />
                </div>
                <span className="text-[10px] text-uc-gray-400">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-24 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                  <Smartphone size={20} className="text-uc-gray-400" />
                </div>
                <span className="text-[10px] text-uc-gray-400">Mobile</span>
              </div>
            </div>
            <p className="text-sm text-uc-gray-400">
              Every page, component, and graphic template is fully responsive.
              <br />
              The social graphics render at 3x retina resolution for
              Instagram-quality exports.
            </p>
          </motion.div>
        </section>

        {/* ─── CTA Footer ────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-10 md:p-14 border border-uc-cyan/10">
            <Dna size={32} className="text-uc-cyan mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="gradient-text">
                This is what a platform architect delivers.
              </span>
            </h2>
            <p className="text-uc-gray-400 max-w-xl mx-auto mb-8">
              62+ pages. 7 social templates. AI-powered media generation. NIL
              infrastructure. A proprietary data language. And a monorepo that
              scales to multiple products.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 transition-all text-sm font-semibold tracking-wider uppercase"
              >
                Homepage <ArrowRight size={14} />
              </Link>
              <a
                href="https://undercenter-demo.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold tracking-wider uppercase"
              >
                Live Demo <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
