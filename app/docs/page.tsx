"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Palette, Layers, ArrowRight, Download, Dna } from "lucide-react";

const DOCS = [
  {
    title: "Platform Overview",
    subtitle: "What Under Center Is & What's Been Built",
    description: "Complete walkthrough of the platform architecture, 36+ routes, the GAI core primitive, and technology stack. Designed for stakeholders and new team members.",
    href: "/docs/platform-overview",
    icon: FileText,
    color: "from-uc-cyan to-blue-500",
    accent: "text-uc-cyan",
  },
  {
    title: "Design System",
    subtitle: "Visual Language, Components & Brand Identity",
    description: "Color palette, typography, component library, animation patterns, icon system, and DNA theming. Everything a designer needs to extend the brand.",
    href: "/docs/design-system",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    accent: "text-purple-400",
  },
  {
    title: "Capabilities & Customization",
    subtitle: "Features, Video/Imagery, Logo & Personalization",
    description: "Full feature map with video integration points, imagery upload areas, logo customization, shareable cards, and white-label configuration options.",
    href: "/docs/capabilities",
    icon: Layers,
    color: "from-uc-green to-emerald-500",
    accent: "text-uc-green",
  },
];

export default function DocsHubPage() {
  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="doc-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            <Dna size={12} /> QBDNA · Under Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Platform <span className="gradient-text-dna">Documentation</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Downloadable PDF documents covering the full Under Center build — architecture, design system, and customization capabilities. Built for your team.
          </p>
        </motion.div>

        {/* Doc Cards */}
        <div className="grid gap-6 mb-16">
          {DOCS.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={doc.href} className="block glass rounded-2xl p-6 sm:p-8 hover:border-white/10 border border-white/[0.04] transition-all group">
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-uc-cyan transition-colors">{doc.title}</h2>
                      <p className={`text-xs font-semibold tracking-wider uppercase mb-2 ${doc.accent}`}>{doc.subtitle}</p>
                      <p className="text-sm text-uc-gray-400 leading-relaxed">{doc.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <span className="text-[10px] text-uc-gray-400 uppercase tracking-wider hidden sm:block">View & Download</span>
                      <ArrowRight size={16} className="text-uc-gray-400 group-hover:text-uc-cyan group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center border-t border-white/5 pt-8">
          <p className="text-xs text-uc-gray-400 flex items-center justify-center gap-2">
            <Download size={12} /> Each document has a &quot;Download PDF&quot; button · Print-optimized formatting
          </p>
        </div>
      </div>
    </main>
  );
}
