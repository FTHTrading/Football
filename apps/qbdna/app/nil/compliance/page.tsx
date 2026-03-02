"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Shield, CheckCircle2, AlertTriangle, Search,
  MapPin, Scale, Users, FileText, Dna, ChevronDown,
  Info, BookOpen, Globe, ArrowRight
} from "lucide-react";

/* ── Full 50-State NIL Law Matrix ── */
const STATES = [
  { state: "Alabama", code: "AL", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "School may restrict sponsor categories. Institutional review required." },
  { state: "Alaska", code: "AK", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline. Limited state-specific legislation." },
  { state: "Arizona", code: "AZ", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Athletes must disclose within 14 days. No institutional block." },
  { state: "Arkansas", code: "AR", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "Institutional can restrict certain deal categories." },
  { state: "California", code: "CA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "First state to pass NIL law. Athlete-friendly, broad NIL rights." },
  { state: "Colorado", code: "CO", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "Strong athlete protections. Early adopter." },
  { state: "Connecticut", code: "CT", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline policy." },
  { state: "Delaware", code: "DE", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "No specific NIL statute; follows NCAA interim policy." },
  { state: "Florida", code: "FL", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 7, notes: "Cannot conflict with school sponsors. Strong early legislation." },
  { state: "Georgia", code: "GA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Broad protections for athletes. Agent registration enforced." },
  { state: "Hawaii", code: "HI", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline. Limited NIL activity." },
  { state: "Idaho", code: "ID", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Illinois", code: "IL", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Comprehensive NIL legislation. Agent registration required." },
  { state: "Indiana", code: "IN", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline. No standalone statute." },
  { state: "Iowa", code: "IA", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Limited state legislation. NCAA policy applies." },
  { state: "Kansas", code: "KS", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Kentucky", code: "KY", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "Institutional restrictions apply. UK/U of L specific rules." },
  { state: "Louisiana", code: "LA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Active NIL market. LSU-driven legislative interest." },
  { state: "Maine", code: "ME", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Maryland", code: "MD", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "State law protects athlete NIL rights broadly." },
  { state: "Massachusetts", code: "MA", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "No standalone statute. Follows NCAA." },
  { state: "Michigan", code: "MI", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Strong protections. Big Ten conference school rules also apply." },
  { state: "Minnesota", code: "MN", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Mississippi", code: "MS", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "Ole Miss and MSU specific institutional rules." },
  { state: "Missouri", code: "MO", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "Comprehensive NIL bill passed 2021." },
  { state: "Montana", code: "MT", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Nebraska", code: "NE", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "Nebraska-specific institutional compliance." },
  { state: "Nevada", code: "NV", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "Active NIL market. UNLV involvement." },
  { state: "New Hampshire", code: "NH", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "New Jersey", code: "NJ", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Rutgers institutional rules may also apply." },
  { state: "New Mexico", code: "NM", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "State legislation in development." },
  { state: "New York", code: "NY", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "Large market state. Active legislative environment." },
  { state: "North Carolina", code: "NC", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "UNC, Duke, NC State specific considerations." },
  { state: "North Dakota", code: "ND", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Ohio", code: "OH", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "School reporting required. OSU institutional rules." },
  { state: "Oklahoma", code: "OK", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "OU/OSU drive active NIL market." },
  { state: "Oregon", code: "OR", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "Oregon Ducks NIL activity significant." },
  { state: "Pennsylvania", code: "PA", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline. Penn State/Pitt rules." },
  { state: "Rhode Island", code: "RI", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "South Carolina", code: "SC", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "Clemson/USC drive NIL activity." },
  { state: "South Dakota", code: "SD", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Tennessee", code: "TN", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 7, notes: "Active NIL market. Tennessee and Vandy." },
  { state: "Texas", code: "TX", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "No institutional approval needed. Massive NIL market." },
  { state: "Utah", code: "UT", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "BYU institutional rules apply." },
  { state: "Vermont", code: "VT", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "Virginia", code: "VA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: 14, notes: "UVA, VT, JMU NIL activity." },
  { state: "Washington", code: "WA", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "UW and WSU NIL considerations." },
  { state: "West Virginia", code: "WV", nil: true, disclosure: true, minor: true, agent: true, institutional: false, reportingDays: null, notes: "WVU-focused NIL activity." },
  { state: "Wisconsin", code: "WI", nil: true, disclosure: true, minor: true, agent: true, institutional: true, reportingDays: 7, notes: "Institutional restrictions apply. UW compliance." },
  { state: "Wyoming", code: "WY", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline." },
  { state: "District of Columbia", code: "DC", nil: true, disclosure: true, minor: true, agent: false, institutional: false, reportingDays: null, notes: "Follows NCAA baseline. Georgetown rules." },
];

/* ── Compliance Guide Sections ── */
const COMPLIANCE_SECTIONS = [
  {
    title: "Legal Framework",
    icon: Scale,
    color: "#00C2FF",
    items: [
      "NIL is governed by state law plus institutional policy.",
      "Athletes must disclose deals where required by their state and institution.",
      "Schools cannot directly broker compensation for athletes.",
      "Athletes cannot accept pay-for-play compensation — NIL deals must be for legitimate services.",
      "Federal legislation is pending but not yet enacted as of March 2026.",
    ],
  },
  {
    title: "Minor Athletes (Under 18)",
    icon: Users,
    color: "#FFB800",
    items: [
      "Parent or guardian signature is required on all NIL agreements.",
      "Revenue custodian clause is recommended for deals over $5,000.",
      "Escrow is recommended for deals over $10,000 to protect minor's interests.",
      "Tax filing responsibility falls on the parent/guardian until athlete turns 18.",
      "Some states require additional court approval for contracts with minors.",
    ],
  },
  {
    title: "Disclosure Requirements",
    icon: FileText,
    color: "#00FF88",
    items: [
      "Athlete must disclose: brand name, compensation amount, deliverables, and duration.",
      "Disclosure must be filed with the institution within the state-mandated reporting window.",
      "Conflicts with institutional sponsors must be identified and resolved before deal execution.",
      "Revenue from NIL activities must be disclosed for tax purposes.",
      "Platform-generated disclosure forms auto-populate from deal records.",
    ],
  },
  {
    title: "Tax Responsibility",
    icon: FileText,
    color: "#A855F7",
    items: [
      "NIL income is classified as self-employment income under IRS rules.",
      "Athletes receive 1099 forms for compensation over $600 in a calendar year.",
      "Federal income tax, state income tax, and self-employment tax all apply.",
      "Athletes should set aside 25-30% of NIL income for tax obligations.",
      "Under Center does not provide tax advice — consultation with a CPA is recommended.",
    ],
  },
  {
    title: "Restricted Categories",
    icon: Shield,
    color: "#FF3B5C",
    items: [
      "Alcohol brands — prohibited or restricted in most states for minor athletes.",
      "Gambling and sports betting — universally restricted for student athletes.",
      "Tobacco and nicotine products — prohibited across all states.",
      "Adult entertainment — prohibited across all states.",
      "Institutional sponsor conflicts — varies by school policy.",
      "Under Center's conflict check engine flags restricted categories automatically.",
    ],
  },
];

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInstitutional, setFilterInstitutional] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = [...STATES];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.state.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    }
    if (filterInstitutional === "yes") list = list.filter((s) => s.institutional);
    if (filterInstitutional === "no") list = list.filter((s) => !s.institutional);
    return list;
  }, [searchQuery, filterInstitutional]);

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-red/20 text-[10px] tracking-[0.4em] uppercase text-uc-red mb-6">
            <Shield size={12} /> Compliance & Governance
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            NIL State Law <span className="text-uc-red">Intelligence</span>
          </h1>
          <p className="text-uc-gray-400 max-w-2xl mx-auto mb-2">
            50-state compliance matrix covering NIL rules, disclosure requirements, minor protections, agent registration, and institutional restrictions. Updated March 2026.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">Educational reference · Not legal advice</p>
        </motion.div>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-4 border border-yellow-400/10 mb-12 flex items-start gap-3">
          <Info size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-uc-gray-400 leading-relaxed">
            <strong className="text-yellow-400">Important:</strong> This matrix is an educational reference compiled from publicly available state legislation and NCAA guidelines. Laws change frequently. Athletes should consult with a qualified attorney and their institution's compliance office before entering NIL agreements. Under Center does not provide legal advice.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="glass rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <input
              type="text"
              placeholder="Search by state name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-uc-gray-500 focus:outline-none focus:border-uc-red/50 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={filterInstitutional}
              onChange={(e) => setFilterInstitutional(e.target.value)}
              className="bg-uc-surface border border-white/10 rounded-lg px-4 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-red/50"
            >
              <option value="all">All States</option>
              <option value="yes">Institutional Restrictions</option>
              <option value="no">No Institutional Restrictions</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>
          <div className="text-xs text-uc-gray-400 shrink-0">
            {filtered.length} of {STATES.length} states
          </div>
        </div>

        {/* Full State Matrix */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.04] mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider sticky left-0 bg-uc-panel z-10">State</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">NIL</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Disclosure</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Minor Prot.</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Agent Reg.</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Institutional</th>
                  <th className="text-center px-3 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Report Window</th>
                  <th className="text-left px-4 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider min-w-[200px]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.code} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                    <td className="px-4 py-2.5 text-xs font-bold text-white sticky left-0 bg-uc-panel z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-uc-gray-500 font-mono w-5">{s.code}</span>
                        {s.state}
                      </div>
                    </td>
                    <td className="text-center px-3 py-2.5"><CheckCircle2 size={14} className="text-uc-green mx-auto" /></td>
                    <td className="text-center px-3 py-2.5">{s.disclosure ? <CheckCircle2 size={14} className="text-uc-green mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                    <td className="text-center px-3 py-2.5">{s.minor ? <AlertTriangle size={14} className="text-yellow-400 mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                    <td className="text-center px-3 py-2.5">{s.agent ? <CheckCircle2 size={14} className="text-uc-cyan mx-auto" /> : <span className="text-uc-gray-600">—</span>}</td>
                    <td className="text-center px-3 py-2.5">{s.institutional ? <AlertTriangle size={14} className="text-orange-400 mx-auto" /> : <CheckCircle2 size={14} className="text-uc-green/40 mx-auto" />}</td>
                    <td className="text-center px-3 py-2.5 text-xs text-uc-gray-300 font-mono">{s.reportingDays ? `${s.reportingDays}d` : "—"}</td>
                    <td className="px-4 py-2.5 text-[11px] text-uc-gray-400 leading-relaxed">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="glass rounded-xl p-4 mb-16 flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2 text-[10px] text-uc-gray-400">
            <CheckCircle2 size={12} className="text-uc-green" /> Required / Allowed
          </div>
          <div className="flex items-center gap-2 text-[10px] text-uc-gray-400">
            <AlertTriangle size={12} className="text-yellow-400" /> Caution / Special Requirements
          </div>
          <div className="flex items-center gap-2 text-[10px] text-uc-gray-400">
            <AlertTriangle size={12} className="text-orange-400" /> Institutional Restrictions Apply
          </div>
          <div className="flex items-center gap-2 text-[10px] text-uc-gray-400">
            <span className="text-uc-gray-600">—</span> Not Required / Not Specified
          </div>
        </div>

        {/* Compliance Guide */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Quarterback NIL Compliance Guide</h2>
            <p className="text-sm text-uc-gray-400">Governance framework for athletes, parents, and coaches</p>
          </div>
          <div className="space-y-6">
            {COMPLIANCE_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="glass rounded-2xl p-6 border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}12` }}>
                      <Icon size={18} style={{ color: section.color }} />
                    </div>
                    <h3 className="text-lg font-bold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-uc-gray-300 leading-relaxed">
                        <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: section.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Protection Statement */}
        <div className="glass rounded-2xl p-6 border border-white/[0.04] mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-uc-cyan/10 flex items-center justify-center">
              <Globe size={18} className="text-uc-cyan" />
            </div>
            <h3 className="text-lg font-bold">Data Protection & Platform Role</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-uc-cyan font-bold uppercase tracking-wider mb-2">Under Center&apos;s Role</p>
              <ul className="space-y-1.5">
                {[
                  "Documentation and structure provider",
                  "Compliance education and awareness",
                  "Template and workflow tooling",
                  "Audit trail generation",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-uc-gray-300">
                    <CheckCircle2 size={10} className="text-uc-cyan mt-0.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-uc-red font-bold uppercase tracking-wider mb-2">Not Provided</p>
              <ul className="space-y-1.5">
                {[
                  "Legal advice or counsel",
                  "Guaranteed NIL deal outcomes",
                  "Brokered compensation",
                  "Control over athlete earnings",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-uc-gray-300">
                    <AlertTriangle size={10} className="text-uc-red mt-0.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">NIL Compliance & State Law Intelligence · Updated March 2026</p>
          <p className="text-[10px] text-uc-gray-600">Educational reference only — not legal advice</p>
        </div>
      </div>
    </main>
  );
}
