"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Download, Dna, Target, Eye, BarChart3,
  Users, CheckCircle2, Zap, Shield, Star,
  TrendingUp, Activity, Award, Filter, Search
} from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-uc-cyan to-blue-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-uc-cyan/25 transition-all"
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

const METRICS = [
  { name: "Velocity (MPH)", desc: "Peak and average ball velocity measured at release point using QBX radar technology", range: "40-68 MPH", elite: "60+" },
  { name: "Release Time (s)", desc: "Time from snap receipt to ball release. Lower is better. Measures processing and arm speed", range: "0.30-0.65s", elite: "< 0.40s" },
  { name: "Spin Rate (RPM)", desc: "Ball rotation speed in revolutions per minute. Indicates spiral tightness and throwability", range: "400-700 RPM", elite: "600+" },
  { name: "Accuracy (%)", desc: "Completion percentage under structured drill conditions with standardized targets", range: "55-98%", elite: "90%+" },
  { name: "Mechanics (0-100)", desc: "Composite score evaluating footwork, arm slot, follow-through, and kinetic chain efficiency", range: "40-98", elite: "85+" },
  { name: "Decision Speed (0-100)", desc: "Cognitive processing score measuring pre-snap read speed and post-snap decision quality", range: "50-97", elite: "82+" },
];

const PERCENTILE_TIERS = [
  { tier: "Elite", range: "90-100th", color: "#00FF88", desc: "Top 10% nationally — D1 caliber metrics" },
  { tier: "Above Average", range: "70-89th", color: "#00C2FF", desc: "Strong prospect — competitive at FBS level" },
  { tier: "Average", range: "40-69th", color: "#FFB800", desc: "Solid foundation with development potential" },
  { tier: "Below Average", range: "0-39th", color: "#FF3B5C", desc: "Developing — targeted training recommended" },
];

export default function RecruitingIntelligenceDoc() {
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
            <Target size={12} /> Recruiting Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Recruiting <span className="gradient-text-dna">Intelligence</span> Guide
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            How Under Center evaluates quarterbacks, structures performance data, and provides actionable recruiting signals for college coaches and programs.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">March 2026 · Confidential</p>
        </motion.div>

        {/* Why Verified Data Matters */}
        <SectionHeader title="Why Verified Data Matters" subtitle="The signal-to-noise problem in QB recruiting" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <Eye size={14} /> Current Problem
              </h3>
              <ul className="space-y-2">
                {[
                  "Self-reported metrics on social media",
                  "No standardized measurement across camps",
                  "Film grading is subjective and inconsistent",
                  "Star ratings are influenced by exposure, not data",
                  "Coaches can\u2019t compare athletes across regions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-uc-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-uc-green mb-3 flex items-center gap-2">
                <Shield size={14} /> Under Center Solution
              </h3>
              <ul className="space-y-2">
                {[
                  "Verified metrics captured with standardized equipment (QBX)",
                  "Objective evaluation by former D1 coaching staff",
                  "Percentile ranking across national cohort",
                  "Consistent measurement methodology at every location",
                  "Structured, filterable profiles accessible to every coach",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-uc-gray-300">
                    <CheckCircle2 size={10} className="text-uc-green/60 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Metric Definitions */}
        <SectionHeader title="Metric Definitions" subtitle="The 6 core performance metrics" />
        <div className="glass rounded-2xl overflow-hidden mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 sm:px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Metric</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Range</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Elite</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => (
                <tr key={m.name} className="border-b border-white/[0.03]">
                  <td className="px-4 sm:px-6 py-3 font-bold text-white text-xs">{m.name}</td>
                  <td className="px-4 sm:px-6 py-3 text-xs text-uc-gray-400 hidden sm:table-cell">{m.desc}</td>
                  <td className="px-4 sm:px-6 py-3 font-mono text-xs text-uc-gray-300">{m.range}</td>
                  <td className="px-4 sm:px-6 py-3 font-mono text-xs text-uc-green font-bold">{m.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Percentile Tiers */}
        <SectionHeader title="Percentile Tier System" subtitle="How athletes are ranked nationally" />
        <div className="grid sm:grid-cols-4 gap-3 mb-12">
          {PERCENTILE_TIERS.map((t) => (
            <div key={t.tier} className="glass rounded-xl p-4 text-center">
              <div
                className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${t.color}15` }}
              >
                <Star size={14} style={{ color: t.color }} />
              </div>
              <p className="text-sm font-bold" style={{ color: t.color }}>{t.tier}</p>
              <p className="text-xs font-mono text-uc-gray-300 mb-1">{t.range}</p>
              <p className="text-[10px] text-uc-gray-400">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Evaluation Process */}
        <SectionHeader title="Evaluation Process" subtitle="How an athlete goes from unknown to verified" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="space-y-6">
            {[
              { step: "1", title: "Schedule Session", desc: "Athlete books a training/evaluation session at one of 8 authorized locations across Florida and Wisconsin.", icon: Users },
              { step: "2", title: "Metric Capture", desc: "Standardized measurement using QBX radar technology and evaluation rubrics. Six core metrics recorded under controlled conditions.", icon: Activity },
              { step: "3", title: "D1 Coach Evaluation", desc: "Former Division 1 coaching staff provides mechanics and decision-speed assessment. Qualitative grading mapped to quantitative scores.", icon: Award },
              { step: "4", title: "Percentile Computation", desc: "Raw metrics are compared against the national cohort database. Percentile rankings assigned per metric and aggregate.", icon: BarChart3 },
              { step: "5", title: "Profile Activation", desc: "Verified profile goes live with radial gauges, percentile bars, recruiting timeline, and shareable card. Athlete gains verified badge.", icon: Shield },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-uc-cyan/10 flex items-center justify-center shrink-0 text-uc-cyan font-bold text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      {s.title}
                      <Icon size={12} className="text-uc-gray-400" />
                    </h3>
                    <p className="text-xs text-uc-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NFL Comparison Model */}
        <SectionHeader title="NFL Pro Comparison Model" subtitle="How athlete metrics map to professional benchmarks" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <p className="text-sm text-uc-gray-300 leading-relaxed mb-4">
            Each verified athlete is matched against an active NFL quarterback whose metric profile most closely aligns. The comparison uses a weighted similarity score across all six core metrics, adjusted for age, position variant, and physical profile (height, weight).
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { archetype: "Pro-Style", example: "Patrick Mahomes", traits: "High velocity, creative release angles, elite decision speed" },
              { archetype: "Dual-Threat", example: "Lamar Jackson", traits: "Athletic mobility, above-average arm, unconventional mechanics" },
              { archetype: "Pocket Passer", example: "Joe Burrow", traits: "Elite accuracy, quick release, superior processing" },
            ].map((a) => (
              <div key={a.archetype} className="bg-white/[0.02] rounded-lg p-4">
                <p className="text-xs font-bold text-uc-cyan mb-1">{a.archetype}</p>
                <p className="text-sm font-bold text-white mb-1">{a.example}</p>
                <p className="text-[10px] text-uc-gray-400">{a.traits}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Discovery */}
        <SectionHeader title="Coach Discovery Tools" subtitle="How coaches find and evaluate prospects" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Filter size={14} className="text-uc-cyan" /> Search & Filter
              </h3>
              <ul className="space-y-2">
                {[
                  "Filter by state, school, graduation year",
                  "Filter by minimum velocity, accuracy, mechanics",
                  "Filter by verification status",
                  "Filter by star rating (1-5)",
                  "Sort by any metric ascending/descending",
                  "Full-text name search",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-uc-gray-300">
                    <CheckCircle2 size={10} className="text-uc-cyan/60 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Search size={14} className="text-uc-green" /> Profile Intelligence
              </h3>
              <ul className="space-y-2">
                {[
                  "Radial gauges for visual metric comparison",
                  "Percentile bars against national average",
                  "Recruiting timeline with offer history",
                  "Film with metric overlay HUD",
                  "NFL pro comparison panel",
                  "Shareable verified card with QR code",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-uc-gray-300">
                    <CheckCircle2 size={10} className="text-uc-green/60 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recruiting Signal */}
        <SectionHeader title="Recruiting Signal vs. Noise" subtitle="What coaches can trust" />
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { type: "SIGNAL", items: ["Verified velocity reading (QBX)", "Standardized accuracy test results", "Percentile rank against cohort", "Verified badge on profile"], color: "#00FF88" },
              { type: "NOISE", items: ["Self-reported combine stats", "Unverified social media claims", "Camp hype without data backing", "Highlight reels without context"], color: "#FF3B5C" },
            ].map((col) => (
              <div key={col.type} className="rounded-xl p-4" style={{ backgroundColor: `${col.color}08` }}>
                <p className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: col.color }}>{col.type}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-uc-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: col.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">Recruiting Workflow & Signal System · v1.0 · March 2026</p>
          <p className="text-[10px] text-uc-gray-600">Confidential — Under Center LLC</p>
        </div>
      </div>
    </main>
  );
}
