"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, FileText, Download, Eye, Shield, Users,
  Camera, DollarSign, Dna, ExternalLink, AlertTriangle,
  CheckCircle2, BookOpen
} from "lucide-react";

/* ── Agreement Templates ── */
const AGREEMENTS = [
  {
    id: "athlete-representation",
    title: "Athlete NIL Representation Agreement",
    category: "Representation",
    description:
      "Defines the scope of representation between an athlete and their NIL representative. Covers services provided, compensation structure, term length, responsibilities of both parties, and termination clauses.",
    icon: Users,
    color: "#00C2FF",
    sections: [
      "Scope of Representation — Services, territory, exclusivity",
      "Compensation — Commission rates (10-15%), payment schedule",
      "Term & Duration — Start date, end date, auto-renewal clause",
      "Responsibilities — Athlete obligations, representative obligations",
      "Termination — Notice period, cause-based exit, assignment of deals",
      "Confidentiality — Deal terms, financial information, competitive landscape",
      "Dispute Resolution — Arbitration vs. litigation, jurisdiction",
    ],
    keyTerms: ["Commission Rate", "Exclusivity", "Term Length", "Territory", "Termination Notice"],
    forWhom: "Athletes, NIL Agents, Parents/Guardians",
    legalNote: "Must be reviewed by a licensed attorney in the athlete's state of residence.",
  },
  {
    id: "brand-partnership",
    title: "Brand Partnership Agreement",
    category: "Sponsorship",
    description:
      "Governs the relationship between an athlete and a brand for sponsored content, appearances, or endorsements. Covers deliverables, compensation, usage rights, and compliance with NCAA/institutional policy.",
    icon: DollarSign,
    color: "#00FF88",
    sections: [
      "Deliverables — Content type, quantity, timeline, quality standards",
      "Compensation — Payment structure, bonuses, royalties, equity",
      "Usage Rights — Platforms, duration, territory, sublicensing",
      "Compliance Clause — NCAA disclosure, institutional approval, state law",
      "Exclusivity — Category exclusivity, competitive restrictions, duration",
      "Performance Metrics — Engagement minimums, impression guarantees",
      "Morals Clause — Conduct standards, termination triggers",
    ],
    keyTerms: ["Deliverables", "Usage Rights", "Category Exclusivity", "Compliance Clause", "Morals Clause"],
    forWhom: "Athletes, Brands, Marketing Agencies",
    legalNote: "Must comply with FTC endorsement guidelines and state NIL disclosure requirements.",
  },
  {
    id: "content-license",
    title: "Content Usage License",
    category: "Licensing",
    description:
      "Licenses an athlete's name, image, and likeness for specific commercial purposes. Defines ownership, duration, territory, exclusivity scope, and revocation terms.",
    icon: Camera,
    color: "#A855F7",
    sections: [
      "Licensed Content — Specific assets (photos, video, name, signature)",
      "Grant of License — Exclusive vs. non-exclusive, sublicensable or not",
      "Duration — Fixed term, perpetual with revocation, renewal options",
      "Territory — Geographic scope (state, national, global)",
      "Compensation — Flat fee, royalty, hybrid, payment milestones",
      "Restrictions — Platform limitations, modification rights, adjacent use",
      "Revocation — Conditions, notice period, post-revocation obligations",
    ],
    keyTerms: ["License Scope", "Territory", "Duration", "Revocation Rights", "Sublicensing"],
    forWhom: "Athletes, Brands, Content Platforms, Media Companies",
    legalNote: "License scope must be clearly defined to prevent unauthorized use beyond agreement terms.",
  },
  {
    id: "guardian-consent",
    title: "Minor Guardian Consent Form",
    category: "Guardian",
    description:
      "Required for all NIL agreements involving athletes under 18. Establishes legal authority, ensures tax-aware consent, defines approval requirements, and specifies custodial banking arrangements.",
    icon: Shield,
    color: "#FFB800",
    sections: [
      "Guardian Identity — Legal authority verification, relationship to minor",
      "Deal Approval — Per-deal approval vs. blanket authorization, value thresholds",
      "Tax Awareness — Filing responsibility, estimated tax obligation disclosure",
      "Custodial Account — Required banking arrangement, access restrictions",
      "Revenue Protection — Escrow for deals over $10,000, earning caps if applicable",
      "Exit Rights — Guardian right to terminate on behalf of minor",
      "Reporting — Periodic financial summaries, annual reconciliation",
    ],
    keyTerms: ["Legal Authority", "Custodial Account", "Escrow", "Tax Responsibility", "Per-Deal Approval"],
    forWhom: "Parents, Legal Guardians, Minor Athletes, NIL Representatives",
    legalNote: "State laws vary significantly on contracts with minors — some require court approval.",
  },
  {
    id: "revenue-disclosure",
    title: "NIL Revenue Disclosure Form",
    category: "Compliance",
    description:
      "Standard disclosure form for reporting NIL deal details to institutions and compliance offices. Captures deal date, brand identity, compensation, deliverables, and completion status.",
    icon: FileText,
    color: "#FF3B5C",
    sections: [
      "Deal Identification — Deal ID, date executed, parties involved",
      "Brand Information — Company name, contact, industry category",
      "Compensation — Cash, product, equity, estimated fair market value",
      "Deliverables — Type (social media, appearance, licensing), quantity, deadline",
      "Duration — Start date, end date, ongoing vs. one-time",
      "Conflict Check — Institutional sponsor conflicts, restricted categories",
      "Completion Status — Active, completed, cancelled, in dispute",
    ],
    keyTerms: ["Compensation Type", "Deliverables", "Conflict Check", "Completion Status", "Fair Market Value"],
    forWhom: "Athletes, Compliance Officers, Institutions",
    legalNote: "Must be filed within the state-mandated reporting window (typically 7-14 days).",
  },
];

export default function AgreementsPage() {
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);

  const active = AGREEMENTS.find((a) => a.id === selectedAgreement);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/nil" className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to NIL
          </Link>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.4em] uppercase text-uc-green mb-6">
            <FileText size={12} /> Agreement Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            NIL Agreement <span className="text-uc-green">Templates</span>
          </h1>
          <p className="text-uc-gray-400 max-w-2xl mx-auto mb-2">
            Standardized agreement templates for athlete representation, brand partnerships, content licensing, guardian consent, and revenue disclosure.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">Templates only · Must be reviewed by a licensed attorney before signing</p>
        </motion.div>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-4 border border-yellow-400/10 mb-12 flex items-start gap-3">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-uc-gray-400 leading-relaxed">
            <strong className="text-yellow-400">Important:</strong> These templates are educational starting points. They do not constitute
            legal advice and must be reviewed, customized, and approved by a licensed attorney before execution. Under Center is not a law firm
            and does not provide legal services. Every deal has unique circumstances that require professional legal review.
          </p>
        </div>

        {/* Agreement Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {AGREEMENTS.map((agreement) => {
            const Icon = agreement.icon;
            const isOpen = selectedAgreement === agreement.id;
            return (
              <motion.button
                key={agreement.id}
                onClick={() => setSelectedAgreement(isOpen ? null : agreement.id)}
                className={`glass rounded-2xl p-5 border text-left transition-all duration-300 ${
                  isOpen ? "border-white/20 ring-1 ring-white/10" : "border-white/[0.04] hover:border-white/10"
                }`}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agreement.color}12` }}>
                    <Icon size={18} style={{ color: agreement.color }} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: agreement.color }}>{agreement.category}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{agreement.title}</h3>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed line-clamp-3">{agreement.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: agreement.color }}>
                  {isOpen ? "Viewing details ↑" : "View details →"}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Agreement Detail */}
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8 mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${active.color}12` }}>
                <active.icon size={22} style={{ color: active.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{active.title}</h2>
                <p className="text-[10px] text-uc-gray-400">{active.forWhom}</p>
              </div>
            </div>

            <p className="text-xs text-uc-gray-300 leading-relaxed mb-6">{active.description}</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {/* Sections */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-uc-gray-400 mb-3">Agreement Sections</h4>
                <ul className="space-y-2">
                  {active.sections.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-uc-gray-300 leading-relaxed">
                      <CheckCircle2 size={10} className="mt-0.5 shrink-0" style={{ color: active.color }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Terms & Meta */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-uc-gray-400 mb-3">Key Terms</h4>
                  <div className="flex flex-wrap gap-2">
                    {active.keyTerms.map((term) => (
                      <span key={term} className="text-[10px] px-2.5 py-1 rounded-full glass border border-white/10 text-white/70">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-uc-gray-400 mb-3">Legal Note</h4>
                  <p className="text-[11px] text-yellow-400/80 leading-relaxed flex items-start gap-2">
                    <AlertTriangle size={10} className="mt-0.5 shrink-0" /> {active.legalNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition" style={{ backgroundColor: active.color }}>
                <Download size={12} /> Download Template
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-xs text-white hover:border-white/20 transition">
                <Eye size={12} /> Preview Online
              </button>
            </div>
          </motion.div>
        )}

        {/* Process */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How Agreements Work on Under Center</h2>
            <p className="text-sm text-uc-gray-400">From template to executed deal</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Select Template", desc: "Choose the agreement type that matches your deal structure.", color: "#00C2FF" },
              { step: "02", title: "Customize Terms", desc: "Fill in deal-specific terms: parties, compensation, deliverables, dates.", color: "#00FF88" },
              { step: "03", title: "Legal Review", desc: "Have your attorney review and finalize. Required before execution.", color: "#FFB800" },
              { step: "04", title: "Execute & Track", desc: "Sign, upload to your profile, and track status through your dashboard.", color: "#A855F7" },
            ].map((s) => (
              <div key={s.step} className="glass rounded-xl p-5 border border-white/[0.04]">
                <span className="text-2xl font-black font-mono" style={{ color: s.color }}>{s.step}</span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1">{s.title}</h4>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">NIL Agreement Library · Templates for educational purposes only</p>
          <p className="text-[10px] text-uc-gray-600">Must be reviewed by a licensed attorney before execution</p>
        </div>
      </div>
    </main>
  );
}
