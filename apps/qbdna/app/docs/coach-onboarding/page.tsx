"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Download, Dna, Users, Shield, Smartphone,
  CheckCircle2, ArrowRight, CreditCard, User, Camera,
  BarChart3, Share2, Award, Eye, Globe, Zap
} from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-uc-cyan text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all"
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

export default function CoachOnboardingDoc() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/20 text-[10px] tracking-[0.4em] uppercase text-purple-400 mb-6">
            <Users size={12} /> Coach & Athlete Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Coach & Athlete <span className="text-purple-400">Onboarding</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            How coaches discover talent and how athletes build their verified identity on Under Center. Two audiences, one system.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">March 2026 · Confidential</p>
        </motion.div>

        {/* ─── COACH SECTION ─── */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-uc-green/10 flex items-center justify-center">
              <Users size={18} className="text-uc-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Coach Platform Overview</h2>
              <p className="text-xs text-uc-gray-400">Discovery, evaluation, and recruiting intelligence tools</p>
            </div>
          </div>

          {/* Coach Value Prop */}
          <SectionHeader title="What Coaches Get" subtitle="The recruiting advantage" />
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Eye, title: "Verified Prospect Data", desc: "Every metric is captured under standardized conditions. No self-reported stats. Coaches see what's real.", color: "#00C2FF" },
              { icon: BarChart3, title: "Percentile Rankings", desc: "Compare athletes across the national cohort. Filter by metric, state, grad year. Find the athletes others miss.", color: "#00FF88" },
              { icon: Share2, title: "Film + Metric Overlay", desc: "Watch film with real-time velocity, release time, and accuracy data overlaid. Context coaches actually need.", color: "#A855F7" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}12` }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Coach Workflow */}
          <SectionHeader title="Coach Workflow" subtitle="From discovery to contact" />
          <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
            <div className="space-y-6">
              {[
                { step: "1", title: "Search & Filter", desc: "Navigate to /search. Filter by state, graduation year, velocity threshold, star rating, and verification status. Results update in real time.", icon: Eye },
                { step: "2", title: "Review Profile", desc: "Click into any athlete to see their full verified profile: radial gauges, percentile bars, recruiting timeline, and NFL comparison panel.", icon: BarChart3 },
                { step: "3", title: "Watch Film", desc: "Open the film overlay player. Metric HUD shows velocity, release time, and accuracy for each throw in context.", icon: Camera },
                { step: "4", title: "Compare Athletes", desc: "Use the /compare route to place two athletes side-by-side. Radar charts and metric deltas highlight strengths and gaps.", icon: Users },
                { step: "5", title: "Track on Board", desc: "Add prospects to your watchlist or evaluation board. Track across multiple athletes with custom tags and notes.", icon: Award },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-uc-green/10 flex items-center justify-center shrink-0 text-uc-green font-bold text-sm">
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

          {/* Coach Features Table */}
          <SectionHeader title="Coach Feature Matrix" subtitle="Current and planned capabilities" />
          <div className="glass rounded-2xl overflow-hidden mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Feature</th>
                  <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Access</th>
                  <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Prospect Search & Filter", access: "Public", status: "Live" },
                  { feature: "Full Verified Profiles", access: "Public", status: "Live" },
                  { feature: "Metric Radial Gauges", access: "Public", status: "Live" },
                  { feature: "Film Overlay Player", access: "Public", status: "Live" },
                  { feature: "NFL Pro Comparison", access: "Public", status: "Live" },
                  { feature: "Athlete Comparison Tool", access: "Public", status: "Live" },
                  { feature: "Leaderboard / Rankings", access: "Public", status: "Live" },
                  { feature: "Depth Chart Builder", access: "Coach Login", status: "Planned" },
                  { feature: "Contact / Messaging", access: "Premium", status: "Planned" },
                  { feature: "Data Export (CSV/PDF)", access: "Premium", status: "Planned" },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-white/[0.03]">
                    <td className="px-6 py-3 text-xs text-white font-bold">{row.feature}</td>
                    <td className="px-6 py-3 text-xs text-uc-gray-300">{row.access}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${row.status === "Live" ? "bg-uc-green/10 text-uc-green" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── ATHLETE SECTION ─── */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-uc-cyan/10 flex items-center justify-center">
              <User size={18} className="text-uc-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Athlete Onboarding Guide</h2>
              <p className="text-xs text-uc-gray-400">From account creation to verified identity</p>
            </div>
          </div>

          {/* Athlete Journey */}
          <SectionHeader title="Verification Journey" subtitle="5 steps from signup to verified status" />
          <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Create Account",
                  desc: "Sign up at /login with email and password. Account is created with ATHLETE role and UNVERIFIED status.",
                  details: ["Email + password registration", "Automatic ATHLETE role assignment", "UNVERIFIED status by default", "JWT session created immediately"],
                },
                {
                  step: "2",
                  title: "Complete Profile",
                  desc: "Fill in identity information: school, state, graduation year, height, weight, position variant, and upload profile photo.",
                  details: ["Biographical information", "Academic details (school, grad year)", "Physical measurements (height, weight)", "Position variant (Pro-Style, Dual-Threat, etc.)"],
                },
                {
                  step: "3",
                  title: "Schedule Evaluation",
                  desc: "Book a training session at one of 8 authorized locations across Florida and Wisconsin. Metrics will be captured using standardized QBX equipment.",
                  details: ["8 locations: Tampa, Orlando, Miami, Jacksonville, Fort Myers, Sarasota, Milwaukee, Madison", "Wilson QBX radar technology", "Former D1 coaching staff evaluation", "45-minute session includes all 6 metrics"],
                },
                {
                  step: "4",
                  title: "Purchase Verification ($149)",
                  desc: "Initiate Stripe checkout at /pricing. One-time payment unlocks verified status, premium profile features, and shareable card generation.",
                  details: ["Stripe-powered secure checkout", "One-time $149 payment", "Status moves to PENDING", "Admin notification triggered"],
                },
                {
                  step: "5",
                  title: "Receive Verified Badge",
                  desc: "Admin reviews metrics and activates verified status. Profile goes live with radial gauges, percentile rankings, and shareable card.",
                  details: ["Admin verification via /admin panel", "Status moves to VERIFIED", "Verified badge appears on profile", "Shareable card unlocked"],
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-uc-cyan/20 to-uc-panel flex items-center justify-center shrink-0 text-uc-cyan font-bold border border-uc-cyan/20">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-xs text-uc-gray-400 leading-relaxed mb-2">{s.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-1">
                      {s.details.map((d) => (
                        <div key={d} className="flex items-start gap-1.5 text-[11px] text-uc-gray-300">
                          <CheckCircle2 size={10} className="text-uc-cyan/60 mt-0.5 shrink-0" />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Athletes Get */}
          <SectionHeader title="What Athletes Receive" subtitle="The verified athlete experience" />
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {[
              { icon: Shield, title: "Verified Badge", desc: "Pulsing cyan checkmark badge visible on your profile, search results, and shared cards.", color: "#00C2FF" },
              { icon: BarChart3, title: "Radial Gauge Dashboard", desc: "6 animated radial gauges showing your metrics: Velocity, Release, Spin, Mechanics, Accuracy, Decision Speed.", color: "#00FF88" },
              { icon: Smartphone, title: "Shareable Card", desc: "Instagram-optimized (1080×1350) verified card with your metrics, QR code, and 3 theme options. Download as PNG.", color: "#A855F7" },
              { icon: Globe, title: "Recruiting Visibility", desc: "Your profile appears in coach search results, leaderboards, and scout feeds. Discoverable by any program.", color: "#FFB800" },
              { icon: Camera, title: "Film + Metric Overlay", desc: "Upload film and see your throws annotated with velocity, release, and accuracy overlays.", color: "#00C2FF" },
              { icon: Award, title: "NFL Pro Comparison", desc: "See which active NFL QB your metric profile most closely matches, with a side-by-side comparison panel.", color: "#00FF88" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold mb-0.5">{item.title}</h3>
                    <p className="text-[11px] text-uc-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sharing Guide */}
          <SectionHeader title="Sharing Your Profile" subtitle="How to maximize recruiting visibility" />
          <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { platform: "Instagram", tip: "Download your verified card (1080×1350) and post to your grid or stories. The QR code links coaches directly to your full profile." },
                { platform: "Twitter / X", tip: "Share your profile link with key metrics highlighted. Tag your target programs. The verified badge builds credibility." },
                { platform: "Direct to Coaches", tip: "Copy your profile URL and include it in emails to college coaches. The data speaks louder than highlight reels." },
              ].map((s) => (
                <div key={s.platform} className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs font-bold text-uc-cyan mb-2">{s.platform}</p>
                  <p className="text-[11px] text-uc-gray-400 leading-relaxed">{s.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">Coach & Athlete Onboarding Guide · v1.0 · March 2026</p>
          <p className="text-[10px] text-uc-gray-600">Confidential — Under Center LLC</p>
        </div>
      </div>
    </main>
  );
}
