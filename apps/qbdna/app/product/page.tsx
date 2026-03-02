"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Zap,
  Target,
  BarChart3,
  Eye,
  Activity,
  Video,
  Users,
  TrendingUp,
  Crown,
  Check,
  ArrowRight,
  Star,
  Dna,
  DollarSign,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

/* ── Feature data ── */
const ATHLETE_FEATURES = [
  { icon: Target, label: "Verified throwing metrics" },
  { icon: BarChart3, label: "Percentile rankings" },
  { icon: Activity, label: "Mechanics grading" },
  { icon: Video, label: "Film integration" },
  { icon: TrendingUp, label: "Recruiting timeline" },
  { icon: Users, label: "Comparison modules" },
  { icon: Shield, label: "Shareable verified card" },
];

const COACH_FEATURES = [
  { icon: Eye, label: "Filterable QB discovery" },
  { icon: Shield, label: "Verified data transparency" },
  { icon: BarChart3, label: "Performance benchmarking" },
  { icon: Zap, label: "Recruitability signals" },
];

const EXPANSION = [
  "NIL deal tracking",
  "Athlete value indexing",
  "Coach analytics dashboards",
  "AI recruiting assistance",
];

const TAGS = [
  "quarterback",
  "recruiting",
  "sports tech",
  "NIL",
  "athlete branding",
  "football training",
  "web platform",
  "data analytics",
  "youth sports",
  "college recruiting",
];

const FAQ = [
  {
    q: "What do I get with verification?",
    a: "A professionally captured metrics session, verified badge on your profile, shareable card with QR code, and full coach visibility in our discovery engine.",
  },
  {
    q: "Who is this for?",
    a: "High school quarterbacks (and their families) who want verified, objective data to stand out in recruiting. Also built for college coaches who want real signal, not highlight reels.",
  },
  {
    q: "What happens after purchase?",
    a: "Access instructions are emailed immediately. You'll receive an athlete onboarding guide and can begin building your profile within minutes.",
  },
  {
    q: "Is parental consent required?",
    a: "Yes. Parent or guardian consent is required for athletes under 18, in compliance with COPPA and platform policy.",
  },
  {
    q: "What's the refund policy?",
    a: "Full refund within 7 days if no profile has been activated. Once your verified session is scheduled, the purchase is final.",
  },
  {
    q: "Can coaches access this for free?",
    a: "Yes. All verified athlete profiles are visible to college coaches at no cost. Coaches can filter, compare, and benchmark quarterbacks directly.",
  },
];

export default function ProductPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* ═══ HERO ═══ */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-6">
              <Dna size={12} />
              Official Product
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              <span className="gradient-text">UNDER CENTER</span>
            </h1>

            <p className="text-lg md:text-xl text-uc-gray-300 font-medium mb-2">
              The Verified Identity Standard for Quarterbacks
            </p>

            <p className="text-sm text-uc-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Objective throwing metrics. Real recruiting signal. A data-driven
              quarterback command center that makes a 15-year-old feel like a
              Division 1 prospect the moment he opens his page.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-black font-bold text-sm tracking-wide hover:bg-uc-cyan/90 transition-all shadow-[0_0_30px_rgba(0,194,255,0.3)]"
              >
                Get Verified — $149
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10 text-sm font-semibold text-white hover:border-white/20 transition-all"
              >
                Explore Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHAT THIS IS / WHAT THIS ISN'T ═══ */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-uc-red mb-4">
                This is NOT
              </h3>
              <ul className="space-y-3">
                {[
                  "A highlight page",
                  "A social profile",
                  "Another MaxPreps clone",
                  "Self-reported stats",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-uc-gray-400 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-uc-red/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-uc-green mb-4">
                This IS
              </h3>
              <ul className="space-y-3">
                {[
                  "A data-driven quarterback command center",
                  "Verified metrics captured by analysts",
                  "Real recruiting signal for coaches",
                  "The identity standard for elite QBs",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-uc-gray-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-uc-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ATHLETE FEATURES ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              Each athlete profile includes
            </h2>
            <p className="text-sm text-uc-gray-500 mb-10">
              Everything a quarterback needs to own his identity.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {ATHLETE_FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 glass rounded-xl px-5 py-4 border border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-uc-cyan/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-uc-cyan" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ COACH FEATURES ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              Coaches gain
            </h2>
            <p className="text-sm text-uc-gray-500 mb-10">
              Real signal. Zero noise.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {COACH_FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 glass rounded-xl px-5 py-4 border border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-uc-green/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-uc-green" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ NIL ERA EXPANSION ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 border border-yellow-400/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                <DollarSign size={20} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Built for the NIL era
                </h2>
                <p className="text-xs text-uc-gray-500">Expanding into</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {EXPANSION.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <Check size={14} className="text-yellow-400 shrink-0" />
                  <span className="text-uc-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-uc-gray-500 mt-6 italic">
              This is the next evolution of quarterback identity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              Simple. One-time. Verified.
            </h2>
            <p className="text-sm text-uc-gray-500">
              No subscriptions required to get started.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <div className="text-xs tracking-[0.2em] uppercase text-uc-gray-500 mb-1">
                Option A
              </div>
              <h3 className="text-xl font-bold mb-1">Free MVP Access</h3>
              <p className="text-3xl font-bold text-uc-gray-300 mb-4">
                $0{" "}
                <span className="text-xs font-normal text-uc-gray-500">
                  / invite-only beta
                </span>
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Basic athlete profile",
                  "Public directory listing",
                  "Community access",
                  "1 shareable card design",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-uc-gray-400">
                    <Check size={14} className="text-uc-gray-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-uc-gray-600 italic">
                Monetization via verification upgrade, NIL tracking, premium
                analytics
              </p>
            </motion.div>

            {/* Paid tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 border border-uc-cyan/20 shadow-[0_0_60px_rgba(0,194,255,0.08)] relative"
            >
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-uc-cyan text-black text-[10px] font-bold tracking-wider uppercase">
                Recommended
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-uc-cyan mb-1">
                Option B
              </div>
              <h3 className="text-xl font-bold mb-1">Verified QB Status</h3>
              <p className="text-3xl font-bold text-white mb-1">
                $149{" "}
                <span className="text-xs font-normal text-uc-gray-500">
                  / one-time
                </span>
              </p>
              <p className="text-xs text-uc-gray-500 mb-4">
                Verified badge + data + share card
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Pro-grade metric capture session",
                  "Verified badge on profile",
                  "Shareable card with QR code",
                  "Full coach visibility",
                  "Recruiting timeline access",
                  "NFL comparison engine",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-uc-gray-300">
                    <Check size={14} className="text-uc-cyan shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-uc-cyan text-black font-bold text-sm hover:bg-uc-cyan/90 transition-all"
              >
                Get Verified Now
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CHECKOUT INFO ═══ */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-white/5"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-uc-cyan" />
              After Purchase
            </h3>
            <ul className="space-y-3">
              {[
                "Access instructions emailed immediately after purchase",
                "Athlete onboarding guide included",
                "Parent/guardian consent required for minors",
                "Full refund within 7 days if no profile activation",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-uc-gray-400"
                >
                  <Check
                    size={14}
                    className="text-uc-green mt-0.5 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Questions
          </h2>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 glass rounded-xl px-5 py-4 border border-white/5 text-left hover:border-white/10 transition-colors"
                >
                  <span className="text-sm font-medium">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-uc-gray-500 shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-5 py-3 text-sm text-uc-gray-400 leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TAGS ═══ */}
      <section className="px-6 py-12 border-t border-white/5">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full glass border border-white/5 text-[10px] tracking-wider uppercase text-uc-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold mb-1">Kevan Burns</h2>
            <p className="text-sm text-uc-gray-500 mb-6">
              Founder — Under Center
            </p>

            <div className="space-y-3">
              <a
                href="mailto:kevan.burns@fthtrading.com"
                className="flex items-center justify-center gap-3 glass rounded-xl px-5 py-3.5 border border-white/5 text-sm text-uc-gray-300 hover:border-uc-cyan/20 hover:text-white transition-all"
              >
                <Mail size={16} className="text-uc-cyan" />
                kevan.burns@fthtrading.com
              </a>
              <a
                href="tel:+13212788323"
                className="flex items-center justify-center gap-3 glass rounded-xl px-5 py-3.5 border border-white/5 text-sm text-uc-gray-300 hover:border-uc-cyan/20 hover:text-white transition-all"
              >
                <Phone size={16} className="text-uc-cyan" />
                321-278-8323
              </a>
            </div>

            <p className="text-xs text-uc-gray-600 mt-6">
              For coach partnerships or NIL inquiries, email directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown size={32} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              You&apos;re not just listing a product.
            </h2>
            <p className="text-lg text-uc-gray-400 mb-8">
              You&apos;re positioning a platform.
            </p>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-black font-bold text-sm tracking-wide hover:bg-uc-cyan/90 transition-all shadow-[0_0_30px_rgba(0,194,255,0.3)]"
            >
              See All Plans
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
