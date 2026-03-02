"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Download, Dna, DollarSign, TrendingUp, BarChart3,
  Users, Globe, Smartphone, CheckCircle2, ArrowRight, Zap,
  Shield, Star, Target, Layers
} from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-uc-green to-emerald-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-uc-green/25 transition-all"
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

const REVENUE_STREAMS = [
  {
    title: "Verification Fee",
    price: "$149",
    type: "One-time",
    desc: "Athletes pay to receive verified status. Includes metric capture, profile activation, and shareable card generation.",
    status: "Live",
    color: "#00C2FF",
  },
  {
    title: "Premium Coach Access",
    price: "$49/mo",
    type: "Subscription",
    desc: "Coaches and recruiters pay for advanced filtering, athlete comparison tools, and contact access.",
    status: "Planned",
    color: "#00FF88",
  },
  {
    title: "NIL Deal Commission",
    price: "10-15%",
    type: "Transaction",
    desc: "Platform takes a percentage of NIL deals facilitated through the marketplace matchmaking engine.",
    status: "Planned",
    color: "#A855F7",
  },
  {
    title: "Featured Athlete Placement",
    price: "$29/mo",
    type: "Subscription",
    desc: "Athletes can pay for featured placement in search results, leaderboards, and coach discovery feeds.",
    status: "Planned",
    color: "#FFB800",
  },
  {
    title: "Digital Collectibles",
    price: "Variable",
    type: "Transaction",
    desc: "Limited-edition verified cards backed by real performance data. Value grows with athlete performance.",
    status: "Planned",
    color: "#00C2FF",
  },
];

const NIL_DATA_MODEL = [
  { field: "NilProfile", desc: "Per-athlete NIL readiness assessment, social reach, and estimated valuation" },
  { field: "NilDeal", desc: "Individual deal records with brand, value, status, and compliance tracking" },
  { field: "NilDeal.brand", desc: "Brand or sponsor entity name" },
  { field: "NilDeal.value", desc: "Deal monetary value (Float)" },
  { field: "NilDeal.status", desc: "Pipeline stage: PENDING → ACTIVE → COMPLETED" },
  { field: "NilProfile.valuation", desc: "Computed athlete NIL valuation based on metrics + social reach" },
];

export default function NilExpansionDoc() {
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
            <DollarSign size={12} /> Revenue Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            NIL <span className="text-uc-green">Expansion</span> Blueprint
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            Infrastructure and strategy for monetizing verified quarterback identity through NIL deal tracking, athlete valuation, brand matching, and premium access tiers.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">March 2026 · Confidential</p>
        </motion.div>

        {/* Market Context */}
        <SectionHeader title="Market Context" subtitle="The NIL opportunity in verified metrics" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {[
              { stat: "$1.17B", label: "NIL market size (2025)", sub: "Source: Opendorse" },
              { stat: "~500K", label: "NCAA athletes eligible", sub: "All divisions" },
              { stat: "0", label: "Verified QB data platforms", sub: "Under Center is first" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-uc-green font-mono">{s.stat}</p>
                <p className="text-xs text-uc-gray-300 mt-1">{s.label}</p>
                <p className="text-[9px] text-uc-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-uc-gray-300 leading-relaxed">
            The NIL market is growing rapidly, but lacks standardized athlete identity infrastructure. Brands negotiate with athletes who have no verifiable performance data beyond highlight reels. Under Center fills this gap by providing objective, verified metrics that increase both athlete and brand confidence in NIL transactions.
          </p>
        </div>

        {/* Revenue Streams */}
        <SectionHeader title="Revenue Streams" subtitle="5 monetization layers from verification to marketplace" />
        <div className="space-y-4 mb-12">
          {REVENUE_STREAMS.map((stream, i) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${stream.color}12` }}
                >
                  <DollarSign size={18} style={{ color: stream.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{stream.title}</h3>
                    <span className="text-[10px] font-mono font-bold text-uc-cyan">{stream.price}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-uc-gray-400 font-bold uppercase tracking-wider">{stream.type}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${stream.status === "Live" ? "bg-uc-green/10 text-uc-green" : "bg-yellow-400/10 text-yellow-400"}`}>
                      {stream.status}
                    </span>
                  </div>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">{stream.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Model */}
        <SectionHeader title="NIL Data Model" subtitle="Prisma schema entities supporting the NIL layer" />
        <div className="glass rounded-2xl overflow-hidden mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Field / Model</th>
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {NIL_DATA_MODEL.map((row) => (
                <tr key={row.field} className="border-b border-white/[0.03]">
                  <td className="px-6 py-3 font-mono text-xs text-uc-cyan font-bold">{row.field}</td>
                  <td className="px-6 py-3 text-xs text-uc-gray-300">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Valuation Engine */}
        <SectionHeader title="Athlete Valuation Engine" subtitle="How Under Center computes NIL valuation" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <pre className="text-xs text-uc-gray-300 font-mono leading-relaxed overflow-x-auto">
{`NIL Valuation = f(Verified Metrics, Social Reach, Recruiting Rank, Engagement)

Inputs:
├── Verified Metrics Score ─── Velocity + Release + Accuracy + Mechanics
├── Social Reach ──────────── Instagram + Twitter + TikTok follower count
├── Recruiting Rank ───────── Star rating + offer count + program tier
├── Engagement Rate ───────── Profile views + card shares + film plays
└── Market Factor ─────────── Position scarcity + geographic market size

Output:
├── Estimated NIL Value ($)
├── Valuation Tier (Rising / Established / Premium / Elite)
├── Brand Match Score (0-100)
└── Growth Trajectory (Trending Up / Stable / Declining)`}
          </pre>
        </div>

        {/* Brand Pipeline */}
        <SectionHeader title="Brand Partnership Pipeline" subtitle="How NIL deals flow through the platform" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-5 gap-3">
            {[
              { step: "1", label: "Brand Lists\nOpportunity", color: "#00C2FF" },
              { step: "2", label: "Platform\nMatches QBs", color: "#00FF88" },
              { step: "3", label: "Athlete\nAccepts/Declines", color: "#A855F7" },
              { step: "4", label: "Deal\nExecuted", color: "#FFB800" },
              { step: "5", label: "Commission\nCaptured", color: "#00C2FF" },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  {s.step}
                </div>
                <p className="text-[10px] text-uc-gray-300 whitespace-pre-line leading-tight">{s.label}</p>
                {i < 4 && <ArrowRight size={12} className="text-uc-gray-600 mt-2 hidden sm:block rotate-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <SectionHeader title="Compliance Considerations" subtitle="NIL regulatory awareness" />
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="space-y-3">
            {[
              "State-by-state NIL regulation tracking (varies significantly)",
              "Minor athlete protections — parental consent architecture baked into data model",
              "Deal recording for institutional compliance reporting",
              "Transparent valuation methodology (auditable formula)",
              "No direct payment processing between brands and athletes (marketplace facilitation only)",
              "Terms of service governing athlete data usage and brand access",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-uc-gray-300">
                <CheckCircle2 size={12} className="text-uc-green/60 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Expansion Timeline */}
        <SectionHeader title="Expansion Timeline" subtitle="NIL layer rollout plan" />
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { phase: "Phase 1", title: "Foundation", items: ["NilProfile model active", "Valuation placeholder on profiles", "NIL marketplace page scaffolded", "Dashboard NIL section live"], color: "#00C2FF", status: "Complete" },
            { phase: "Phase 2", title: "Deal Tracking", items: ["Brand deal CRUD operations", "Deal pipeline stages", "Commission tracking", "Athlete notification system"], color: "#00FF88", status: "Next" },
            { phase: "Phase 3", title: "Intelligence", items: ["AI-powered brand matching", "Valuation algorithm refinement", "Analytics reporting dashboard", "Compliance export tools"], color: "#A855F7", status: "Planned" },
          ].map((p) => (
            <div key={p.phase} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
                  style={{ color: p.color, backgroundColor: `${p.color}15` }}
                >
                  {p.phase}
                </span>
                <span className={`text-[9px] font-bold tracking-wider uppercase ${p.status === "Complete" ? "text-uc-green" : p.status === "Next" ? "text-uc-cyan" : "text-uc-gray-400"}`}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-3">{p.title}</h3>
              <ul className="space-y-1.5">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[11px] text-uc-gray-400">
                    <CheckCircle2 size={10} className="mt-0.5 shrink-0" style={{ color: p.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">NIL Infrastructure & Expansion Blueprint · v1.0 · March 2026</p>
          <p className="text-[10px] text-uc-gray-600">Confidential — Under Center LLC</p>
        </div>
      </div>
    </main>
  );
}
