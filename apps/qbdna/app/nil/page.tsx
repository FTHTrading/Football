"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Dna, Shield, FileText, Scale, BarChart3, ArrowRight,
  Globe, Users, DollarSign, CheckCircle2, AlertTriangle,
  BookOpen, Briefcase, TrendingUp, Lock, Zap
} from "lucide-react";

/* ── State Law Sample Data ── */
const STATE_MATRIX = [
  { state: "Florida", code: "FL", nil: true, disclosure: true, minor: true, agent: true, institutional: false, notes: "Cannot conflict with school sponsors" },
  { state: "Wisconsin", code: "WI", nil: true, disclosure: true, minor: true, agent: true, institutional: true, notes: "Institutional restrictions apply" },
  { state: "Texas", code: "TX", nil: true, disclosure: true, minor: true, agent: true, institutional: false, notes: "No institutional approval required" },
  { state: "California", code: "CA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, notes: "Athlete-friendly, broad NIL rights" },
  { state: "Alabama", code: "AL", nil: true, disclosure: true, minor: true, agent: true, institutional: true, notes: "School may restrict categories" },
  { state: "Georgia", code: "GA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, notes: "Broad protections for athletes" },
  { state: "Ohio", code: "OH", nil: true, disclosure: true, minor: true, agent: true, institutional: true, notes: "School reporting required" },
  { state: "Pennsylvania", code: "PA", nil: true, disclosure: true, minor: true, agent: false, institutional: false, notes: "Follows NCAA baseline" },
];

/* ── NIL Deal Flow Steps ── */
const DEAL_FLOW = [
  { step: "1", title: "Brand Initiates Offer", desc: "Brand identifies athlete via verified profile, metric data, and social reach. Submits structured offer through platform." },
  { step: "2", title: "Terms Drafted", desc: "Agreement template auto-populates with brand details, compensation, deliverables, duration, and usage rights." },
  { step: "3", title: "Guardian Approval", desc: "If athlete is under 18, guardian receives notification and must digitally consent before terms are finalized." },
  { step: "4", title: "Deal Signed", desc: "Both parties execute the agreement. Contract versioned, timestamped, and stored in athlete's document vault." },
  { step: "5", title: "Deliverables Completed", desc: "Athlete completes content, appearances, or promotional obligations. Status tracked in dashboard." },
  { step: "6", title: "Revenue Logged", desc: "Payment recorded, disclosure form auto-generated, tax documentation flagged, and compliance audit trail updated." },
];

/* ── Revenue Streams ── */
const REVENUE = [
  { stream: "Athlete Verification", price: "$149", model: "One-time", status: "Live" },
  { stream: "Coach Analytics Access", price: "$49/mo", model: "Subscription", status: "Planned" },
  { stream: "NIL Deal Commission", price: "10–15%", model: "Revenue Share", status: "Planned" },
  { stream: "Brand Listing Access", price: "$99/mo", model: "Subscription", status: "Planned" },
  { stream: "Premium Intelligence", price: "$29/mo", model: "Subscription", status: "Planned" },
  { stream: "Contract Processing", price: "$25/deal", model: "Per Transaction", status: "Planned" },
];

/* ── Sub-sections ── */
const SECTIONS = [
  {
    title: "Compliance & Governance",
    subtitle: "State-aware NIL compliance intelligence",
    description: "Interactive state law matrix, disclosure requirements, minor athlete protections, and institutional conflict rules. Location-aware compliance guidance.",
    href: "/nil/compliance",
    icon: Shield,
    color: "from-uc-red to-orange-500",
    accent: "text-uc-red",
  },
  {
    title: "Agreement Library",
    subtitle: "Structured NIL contract templates",
    description: "Athlete representation agreements, brand partnership contracts, content licenses, minor guardian consent forms, and revenue disclosure templates.",
    href: "/nil/agreements",
    icon: FileText,
    color: "from-uc-cyan to-blue-500",
    accent: "text-uc-cyan",
  },
  {
    title: "Education & Resources",
    subtitle: "NIL knowledge base for athletes & families",
    description: "How NIL works, tax implications, violation prevention, school compliance, and strategic monetization guidance for quarterbacks and their families.",
    href: "/nil/resources",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    accent: "text-purple-400",
  },
  {
    title: "NIL Marketplace",
    subtitle: "Athlete valuations & deal intelligence",
    description: "Real-time NIL valuations, athlete tier rankings, simulated deal feeds, and market intelligence powered by verified performance data.",
    href: "/nil/marketplace",
    icon: TrendingUp,
    color: "from-uc-green to-emerald-500",
    accent: "text-uc-green",
  },
];

function StatusBadge({ status }: { status: string }) {
  const live = status === "Live";
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${live ? "bg-uc-green/10 text-uc-green" : "bg-yellow-400/10 text-yellow-400"}`}>
      {status}
    </span>
  );
}

export default function NilPage() {
  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ═══ HERO ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.4em] uppercase text-uc-green mb-6">
            <DollarSign size={12} /> NIL Infrastructure
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            NIL Compliance &<br />
            <span className="gradient-text-dna">Deal Infrastructure</span>
          </h1>
          <p className="text-lg text-uc-gray-400 max-w-2xl mx-auto mb-8">
            Structured agreements. Location-aware compliance. Scalable athlete monetization.
            Under Center provides the infrastructure layer — not the hype.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/nil/compliance" className="px-6 py-3 rounded-xl bg-gradient-to-r from-uc-green to-emerald-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-uc-green/25 transition-all">
              View State Laws
            </Link>
            <Link href="/nil/agreements" className="px-6 py-3 rounded-xl glass border border-white/10 text-white font-bold text-sm hover:border-uc-cyan/30 transition-all">
              View Agreement Structures
            </Link>
          </div>
        </motion.section>

        {/* ═══ PLATFORM ROLE NOTICE ═══ */}
        <div className="glass rounded-xl p-4 border border-uc-cyan/10 mb-20 flex items-start gap-3">
          <Shield size={16} className="text-uc-cyan shrink-0 mt-0.5" />
          <div className="text-[11px] text-uc-gray-400 leading-relaxed">
            <strong className="text-uc-cyan">Platform Role:</strong>{" "}
            Under Center is a technology platform that provides educational resources, workflow tools, and data infrastructure.
            We are not a law firm, brokerage, athlete agency, or compliance authority. All content is designed to assist — not replace — independent professional counsel.
            See our <Link href="/legal/disclaimer" className="text-uc-cyan underline underline-offset-2">Disclaimer</Link>{" "}
            and <Link href="/legal/terms" className="text-uc-cyan underline underline-offset-2">Terms of Service</Link>.
          </div>
        </div>

        {/* ═══ WHAT NIL MEANS INSIDE UC ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What NIL Means Inside Under Center</h2>
            <p className="text-sm text-uc-gray-400 max-w-xl mx-auto">Not a broker. Not a marketplace. A structured infrastructure layer.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Standardized Templates", desc: "Contract templates built for athlete-brand deals, compliant across jurisdictions.", color: "#00C2FF" },
              { icon: Scale, title: "Compliance Engine", desc: "State-aware rules that flag disclosure requirements, conflict restrictions, and minor protections.", color: "#00FF88" },
              { icon: BarChart3, title: "Revenue Tracking", desc: "Deal logging, payment status, and tax documentation — all structured and auditable.", color: "#A855F7" },
              { icon: Lock, title: "Identity Protection", desc: "Athletes own their data. No exploitation. Clear liability separation between platform and deals.", color: "#FF3B5C" },
              { icon: Globe, title: "State Law Matrix", desc: "50-state compliance database covering NIL rules, disclosure requirements, and agent registration.", color: "#FFB800" },
              { icon: Users, title: "Guardian Controls", desc: "Built-in minor consent workflows. No deal executes without guardian approval for athletes under 18.", color: "#00C2FF" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-2xl p-5 border border-white/[0.04] hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}12` }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ═══ NAV CARDS TO SUB-PAGES ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">NIL Infrastructure Suite</h2>
            <p className="text-sm text-uc-gray-400">Four pillars of the compliance and monetization layer.</p>
          </div>
          <div className="grid gap-4">
            {SECTIONS.map((doc, i) => {
              const Icon = doc.icon;
              return (
                <motion.div key={doc.href} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link href={doc.href} className="block glass rounded-2xl p-6 sm:p-8 hover:border-white/10 border border-white/[0.04] transition-all group">
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-uc-cyan transition-colors">{doc.title}</h3>
                        <p className={`text-xs font-semibold tracking-wider uppercase mb-2 ${doc.accent}`}>{doc.subtitle}</p>
                        <p className="text-sm text-uc-gray-400 leading-relaxed">{doc.description}</p>
                      </div>
                      <ArrowRight size={16} className="text-uc-gray-400 group-hover:text-uc-cyan group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ═══ STATE LAW MATRIX PREVIEW ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">State Law Intelligence</h2>
              <p className="text-sm text-uc-gray-400">Preview — 8 of 50 states shown</p>
            </div>
            <Link href="/nil/compliance" className="text-xs text-uc-cyan hover:underline flex items-center gap-1">
              View all states <ArrowRight size={12} />
            </Link>
          </div>
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">State</th>
                    <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">NIL</th>
                    <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Disclosure</th>
                    <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Minor</th>
                    <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Agent Reg.</th>
                    <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Institutional</th>
                    <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {STATE_MATRIX.map((s) => (
                    <tr key={s.code} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 text-xs font-bold text-white">{s.state}</td>
                      <td className="text-center px-3 py-3"><CheckCircle2 size={14} className="text-uc-green mx-auto" /></td>
                      <td className="text-center px-3 py-3">{s.disclosure ? <CheckCircle2 size={14} className="text-uc-green mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                      <td className="text-center px-3 py-3">{s.minor ? <AlertTriangle size={14} className="text-yellow-400 mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                      <td className="text-center px-3 py-3">{s.agent ? <CheckCircle2 size={14} className="text-uc-cyan mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                      <td className="text-center px-3 py-3">{s.institutional ? <AlertTriangle size={14} className="text-orange-400 mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                      <td className="px-4 py-3 text-[11px] text-uc-gray-400 hidden lg:table-cell">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ═══ DEAL FLOW ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">NIL Deal Flow</h2>
            <p className="text-sm text-uc-gray-400 max-w-lg mx-auto">From brand offer to revenue logged — every step is structured, compliant, and auditable.</p>
          </div>
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.04]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEAL_FLOW.map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-uc-green/20 to-uc-panel flex items-center justify-center shrink-0 text-uc-green font-bold text-sm border border-uc-green/20">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-xs text-uc-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══ REVENUE MODEL ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Revenue Architecture</h2>
            <p className="text-sm text-uc-gray-400">Multiple revenue streams built into the infrastructure.</p>
          </div>
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.04]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Stream</th>
                  <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {REVENUE.map((r) => (
                  <tr key={r.stream} className="border-b border-white/[0.03]">
                    <td className="px-6 py-3 text-xs font-bold text-white">{r.stream}</td>
                    <td className="px-4 py-3 text-xs text-uc-green font-mono">{r.price}</td>
                    <td className="px-4 py-3 text-xs text-uc-gray-300">{r.model}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ═══ PLATFORM ROLE ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-uc-red/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-uc-red/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-uc-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Platform Role & Legal Position</h3>
                <p className="text-xs text-uc-gray-400">Clear liability separation between infrastructure and deals</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-uc-green/5 rounded-xl p-4 border border-uc-green/10">
                <p className="text-[10px] text-uc-green font-bold uppercase tracking-wider mb-3">Under Center Provides</p>
                <ul className="space-y-2">
                  {["Draft agreement structures for reference", "Compliance education & state law data", "Deal logging & revenue tracking", "Disclosure form generation", "Guardian consent workflows", "Audit trail documentation"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-xs text-uc-gray-300">
                      <CheckCircle2 size={12} className="text-uc-green mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-uc-red/5 rounded-xl p-4 border border-uc-red/10">
                <p className="text-[10px] text-uc-red font-bold uppercase tracking-wider mb-3">Under Center Does NOT</p>
                <ul className="space-y-2">
                  {["Guarantee NIL deals or compensation", "Broker pay-for-play arrangements", "Act as athlete agent or representative", "Control athlete earnings or payments", "Provide legal advice or counsel", "Enforce institutional compliance"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-xs text-uc-gray-300">
                      <AlertTriangle size={12} className="text-uc-red mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.04]">
              <p className="text-[11px] text-uc-gray-400 leading-relaxed">
                <strong className="text-white">Legal Disclaimer:</strong> This platform provides educational resources, draft agreement structures, and compliance tooling. It does not constitute legal advice. 
                Under Center is not a law firm, athlete agency, or compliance authority. Athletes are responsible for compliance with their institution and applicable state law. 
                Under Center recommends consulting with a qualified attorney for specific legal questions regarding NIL agreements. 
                See our{" "}
                <Link href="/legal/disclaimer" className="text-uc-cyan underline underline-offset-2">Disclaimer</Link>,{" "}
                <Link href="/legal/terms" className="text-uc-cyan underline underline-offset-2">Terms of Service</Link>, and{" "}
                <Link href="/legal/privacy" className="text-uc-cyan underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ═══ SCALING PATH ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Infrastructure Roadmap</h2>
            <p className="text-sm text-uc-gray-400">Controlled evolution from education to execution.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { phase: "Phase 1", title: "Documentation", items: ["Agreement library", "Compliance guide", "State law matrix", "Education hub"], status: "Live", color: "#00FF88" },
              { phase: "Phase 2", title: "Deal Management", items: ["Contract processing", "Digital signatures", "Document vault", "Revenue logging"], status: "Building", color: "#00C2FF" },
              { phase: "Phase 3", title: "Intelligence", items: ["Market trends", "Valuation engine", "Scraping feeds", "Coach analytics"], status: "Planned", color: "#A855F7" },
              { phase: "Phase 4", title: "Marketplace", items: ["Brand matching", "Open listings", "Smart payouts", "On-chain receipts"], status: "Future", color: "#FFB800" },
            ].map((p) => (
              <div key={p.phase} className="glass rounded-2xl p-5 border border-white/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.phase}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: `${p.color}15`, color: p.color }}>{p.status}</span>
                </div>
                <h3 className="text-sm font-bold mb-3">{p.title}</h3>
                <ul className="space-y-1.5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[11px] text-uc-gray-400">
                      <Zap size={8} style={{ color: p.color }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ BOTTOM PLATFORM ROLE NOTICE ═══ */}
        <div className="glass rounded-xl p-4 border border-white/[0.06] mb-12 flex items-start gap-3">
          <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-uc-gray-500 leading-relaxed">
            This platform provides educational resources and workflow tools only. Under Center is not a law firm, athlete agency, or compliance authority.
            All NIL content is for informational purposes and does not constitute legal, tax, or financial advice.
            Users are responsible for engaging qualified professionals for their specific needs.
          </p>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="text-center border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">NIL Infrastructure & Compliance Center</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <Link href="/legal/terms" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Terms</Link>
            <span className="text-uc-gray-700">·</span>
            <Link href="/legal/privacy" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Privacy</Link>
            <span className="text-uc-gray-700">·</span>
            <Link href="/legal/disclaimer" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Disclaimer</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
