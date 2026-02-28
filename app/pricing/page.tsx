"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  Dna,
  Check,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  Star,
  Sparkles,
  Eye,
  BarChart3,
  Target,
  Activity,
  Trophy,
  Users,
  Video,
  FileText,
  TrendingUp,
} from "lucide-react";

/* ── Plan data ── */
interface Plan {
  id: string;
  name: string;
  code: string;
  tagline: string;
  price: number;
  period: string;
  icon: typeof Shield;
  color: string;
  borderColor: string;
  bgGlow: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "base",
    name: "Base Pair",
    code: "BP-01",
    tagline: "Start mapping your genome",
    price: 0,
    period: "Free forever",
    icon: Shield,
    color: "text-uc-gray-400",
    borderColor: "border-white/10",
    bgGlow: "",
    features: [
      "Basic athlete profile",
      "3 metric data points",
      "Public QB directory listing",
      "Community access",
      "1 shareable card design",
    ],
  },
  {
    id: "strand",
    name: "Single Strand",
    code: "SS-02",
    tagline: "Unlock your full sequence",
    price: 29,
    period: "/month",
    icon: Zap,
    color: "text-uc-cyan",
    borderColor: "border-uc-cyan/20",
    bgGlow: "shadow-[0_0_80px_rgba(0,194,255,0.06)]",
    features: [
      "Everything in Base Pair",
      "Full 6-metric genome decode",
      "QB Index ranking",
      "Recruiting activity dashboard",
      "Film upload (3 per month)",
      "Verified badge application",
      "Highlight reel builder",
    ],
  },
  {
    id: "helix",
    name: "Double Helix",
    code: "DH-03",
    tagline: "Complete DNA decode + NIL",
    price: 79,
    period: "/month",
    icon: Dna,
    color: "text-uc-green",
    borderColor: "border-uc-green/30",
    bgGlow: "shadow-[0_0_80px_rgba(0,255,136,0.08)]",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Single Strand",
      "Priority verification (48hr)",
      "NIL valuation + tracking",
      "Pro comparison engine",
      "Unlimited film uploads",
      "Custom card themes (5)",
      "Digital collectible minting",
      "Coach analytics dashboard",
      "Head-to-head genome compare",
    ],
  },
  {
    id: "genesis",
    name: "Genesis Sequence",
    code: "GS-04",
    tagline: "The ultimate quarterback identity",
    price: 149,
    period: "/month",
    icon: Crown,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/20",
    bgGlow: "shadow-[0_0_80px_rgba(250,204,21,0.06)]",
    badge: "Elite",
    features: [
      "Everything in Double Helix",
      "Instant verification",
      "1-on-1 genome analyst review",
      "Genesis collectible drop (1-of-1)",
      "Premium NIL marketplace access",
      "Private coach connect network",
      "Quarterly scouting report PDF",
      "API access for agents/trainers",
      "Custom branding & media kit",
      "Priority support (24hr SLA)",
    ],
  },
];

/* ── FAQ ── */
const FAQ = [
  {
    q: "What is QB genome decoding?",
    a: "Genome decoding is our proprietary process of measuring 6 core performance metrics — velocity, release time, spin rate, mechanics, accuracy, and processing speed — to create your unique quarterback identity blueprint.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. All plans are month-to-month with no contracts. Upgrade to unlock more features or downgrade whenever you want. Your data is always preserved.",
  },
  {
    q: "What does verified status mean?",
    a: "Verified means your genome data has been captured and validated by a QBDNA analyst using standardized testing protocols. It's the gold standard in quarterback evaluation.",
  },
  {
    q: "Do coaches see my profile for free?",
    a: "Yes. All verified profiles are visible to college coaches on our platform at no cost. Higher tiers give you more visibility, analytics, and direct coach connect features.",
  },
  {
    q: "What's included in the Genesis collectible?",
    a: "Genesis Sequence members receive a 1-of-1 digital collectible card backed by their real performance data. These are the rarest cards in the marketplace and can be collected or traded.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Dna size={12} />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text-dna">Choose your sequence.</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-8">
            From discovery to draft day. Pick the plan that matches your commitment
            to decoding your quarterback DNA.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-full px-4 py-2">
            <span className={`text-xs font-bold tracking-wider ${!annual ? "text-white" : "text-uc-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full bg-uc-surface border border-white/10 transition-colors"
            >
              <motion.div
                layout
                className="absolute top-0.5 w-5 h-5 rounded-full bg-uc-cyan"
                style={{ left: annual ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
            <span className={`text-xs font-bold tracking-wider ${annual ? "text-white" : "text-uc-gray-500"}`}>
              Annual
            </span>
            {annual && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 rounded-full bg-uc-green/10 text-uc-green text-[9px] font-bold tracking-wider"
              >
                SAVE 20%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* ── Plan Cards ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const displayPrice = annual ? Math.round(plan.price * 0.8) : plan.price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative glass rounded-2xl p-6 flex flex-col border ${plan.borderColor} ${plan.bgGlow} transition-all duration-300 hover:translate-y-[-4px] ${
                  plan.highlighted ? "ring-1 ring-uc-green/30" : ""
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                    plan.id === "genesis"
                      ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                      : "bg-uc-green/10 text-uc-green border border-uc-green/20"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg ${plan.color.replace("text-", "bg-")}/10 flex items-center justify-center`}>
                      <Icon size={18} className={plan.color} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${plan.color}`}>{plan.name}</h3>
                      <span className="text-[8px] font-mono text-uc-gray-600">{plan.code}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-uc-gray-400">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {displayPrice === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">Free</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-uc-gray-400">$</span>
                      <span className="text-4xl font-black">{displayPrice}</span>
                      <span className="text-xs text-uc-gray-400">{plan.period}</span>
                    </div>
                  )}
                  {annual && plan.price > 0 && (
                    <p className="text-[10px] text-uc-gray-500 mt-1 line-through">
                      ${plan.price}/mo
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={12} className={`${plan.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-xs text-uc-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-uc-green text-uc-black hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                      : plan.id === "genesis"
                      ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20"
                      : plan.id === "strand"
                      ? "bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20"
                      : "bg-white/5 text-uc-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {plan.price === 0 ? "Get Started" : "Start Decoding"}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Feature Comparison Table ── */}
        <DNAStrandDivider className="mb-16 opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="gradient-text-dna">Full Feature Matrix</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-uc-gray-400 font-normal tracking-wider uppercase text-[9px]">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className={`text-center py-3 px-4 ${p.color} font-bold tracking-wider uppercase text-[9px]`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Athlete Profile", values: ["✓", "✓", "✓", "✓"] },
                  { feature: "Metric Data Points", values: ["3", "6", "6", "6"] },
                  { feature: "QB Index Ranking", values: ["—", "✓", "✓", "✓"] },
                  { feature: "Verification", values: ["—", "Standard", "Priority 48hr", "Instant"] },
                  { feature: "Film Uploads", values: ["—", "3/mo", "Unlimited", "Unlimited"] },
                  { feature: "NIL Valuation", values: ["—", "—", "✓", "✓"] },
                  { feature: "Pro Comparison", values: ["—", "—", "✓", "✓"] },
                  { feature: "Collectible Minting", values: ["—", "—", "✓", "Genesis 1-of-1"] },
                  { feature: "Head-to-Head Compare", values: ["—", "—", "✓", "✓"] },
                  { feature: "Custom Card Themes", values: ["1", "2", "5", "Unlimited"] },
                  { feature: "Coach Connect", values: ["—", "—", "—", "✓"] },
                  { feature: "Scouting Report PDF", values: ["—", "—", "—", "Quarterly"] },
                  { feature: "API Access", values: ["—", "—", "—", "✓"] },
                  { feature: "Support", values: ["Community", "Email", "Priority", "24hr SLA"] },
                ].map((row, i) => (
                  <tr key={row.feature} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="py-3 px-4 text-uc-gray-400 font-medium">{row.feature}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className={`text-center py-3 px-4 ${
                        v === "✓" ? PLANS[j].color : v === "—" ? "text-uc-gray-600" : "text-white"
                      }`}>
                        {v === "✓" ? <Check size={14} className="mx-auto" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="glass rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-bold">{item.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={14} className="text-uc-cyan rotate-90" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-6 pb-4"
                  >
                    <p className="text-xs text-uc-gray-400 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Ready to decode your quarterback DNA?
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.4)] transition-all"
          >
            Start Your Sequence
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
