"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  Zap,
  Globe,
  Shield,
  Dna,
} from "lucide-react";
import type { AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── NIL valuation model ── */
interface NILFactor {
  label: string;
  value: number;
  maxValue: number;
  weight: number;
  icon: typeof TrendingUp;
  color: string;
}

interface NILValuationProps {
  athleteName: string;
  velocity: number;
  mechanics: number;
  accuracy: number;
  offers: number;
  rating: number;
  verified: boolean;
  state: string;
  metrics?: AthleteMetrics;
}

function calculateNILValue(props: NILValuationProps): {
  total: number;
  factors: NILFactor[];
  percentile: number;
  trend: number;
  tier: string;
  gaiScore: number;
  gaiTier: string;
} {
  // ── GAI-driven Genome Score (THE core primitive) ──
  const gaiResult = props.metrics
    ? computeGAI(props.metrics)
    : null;
  const genomeScore = gaiResult ? gaiResult.gai : Math.round(
    (props.velocity / 70) * 30 +
    (props.mechanics / 100) * 35 +
    (props.accuracy / 100) * 35
  );

  // Athletic Performance Score (0-100)
  const perfScore = Math.round(
    (props.velocity / 70) * 30 +
    (props.mechanics / 100) * 35 +
    (props.accuracy / 100) * 35
  );

  // Recruiting Heat Score (0-100)
  const recruitScore = Math.min(100, Math.round(props.offers * 12 + (props.rating / 5) * 40));

  // Social Reach Score (simulated, 0-100)
  const socialScore = Math.round(Math.min(100, 30 + props.offers * 8 + (props.verified ? 15 : 0)));

  // Market Size (state-based multiplier)
  const bigMarkets = ["Texas", "California", "Florida", "Georgia", "Ohio"];
  const marketScore = bigMarkets.includes(props.state) ? 85 : 60;

  // Verification Premium
  const verifiedScore = props.verified ? 95 : 30;

  const factors: NILFactor[] = [
    { label: "Genome Score (GAI)", value: genomeScore, maxValue: 99, weight: 0.30, icon: Dna, color: "text-purple-400" },
    { label: "Athletic Performance", value: perfScore, maxValue: 100, weight: 0.20, icon: Zap, color: "text-uc-cyan" },
    { label: "Recruiting Heat", value: recruitScore, maxValue: 100, weight: 0.20, icon: TrendingUp, color: "text-uc-green" },
    { label: "Social Reach", value: socialScore, maxValue: 100, weight: 0.10, icon: Globe, color: "text-blue-400" },
    { label: "Market Size", value: marketScore, maxValue: 100, weight: 0.10, icon: Users, color: "text-purple-400" },
    { label: "Verified Status", value: verifiedScore, maxValue: 100, weight: 0.10, icon: Shield, color: "text-yellow-400" },
  ];

  const composite = factors.reduce((sum, f) => sum + f.value * f.weight, 0);
  const percentile = Math.round(composite);

  // Scale to dollar value: roughly $1K-$150K range for HS QBs
  const baseValue = composite * composite * 0.15;
  const total = Math.round(baseValue / 50) * 50;

  // Simulate trend
  const trend = Math.round((Math.random() * 20 - 5) * 10) / 10;

  const tier =
    total >= 50000
      ? "Elite"
      : total >= 20000
      ? "Premium"
      : total >= 8000
      ? "Rising"
      : total >= 3000
      ? "Emerging"
      : "Developing";

  return {
    total, factors, percentile, trend, tier,
    gaiScore: gaiResult?.gai ?? genomeScore,
    gaiTier: gaiResult?.tier ?? "Prospect",
  };
}

/* ── Animated Dollar Counter ── */
function AnimatedDollar({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    Math.round(v).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [count, value]);

  return (
    <motion.span className="text-5xl md:text-6xl font-bold text-uc-green font-mono">
      $<motion.span>{rounded}</motion.span>
    </motion.span>
  );
}

/* ── Factor Bar ── */
function FactorBar({ factor, delay }: { factor: NILFactor; delay: number }) {
  const Icon = factor.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <div className="w-8 flex-shrink-0">
        <Icon size={16} className={factor.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-uc-gray-400">{factor.label}</span>
          <span className={`text-xs font-bold ${factor.color}`}>
            {factor.value}/100
          </span>
        </div>
        <div className="w-full h-1.5 bg-uc-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${factor.value}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background:
                factor.value >= 80
                  ? "linear-gradient(90deg, #00FF88, #00C2FF)"
                  : factor.value >= 60
                  ? "linear-gradient(90deg, #00C2FF, #7C3AED)"
                  : "linear-gradient(90deg, #4B5563, #9CA3AF)",
            }}
          />
        </div>
      </div>
      <span className="text-[9px] text-uc-gray-600 w-8 text-right">
        {Math.round(factor.weight * 100)}%
      </span>
    </motion.div>
  );
}

/* ── Main NIL Valuation Component ── */
export default function NILValuation(props: NILValuationProps) {
  const { total, factors, percentile, trend, tier, gaiScore, gaiTier } = calculateNILValue(props);

  const tierColors: Record<string, string> = {
    Elite: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Premium: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Rising: "text-uc-cyan bg-uc-cyan/10 border-uc-cyan/20",
    Emerging: "text-uc-green bg-uc-green/10 border-uc-green/20",
    Developing: "text-uc-gray-400 bg-white/5 border-white/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-uc-green/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-uc-green" />
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-uc-green font-bold">
              NIL Valuation
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
              tierColors[tier] || tierColors.Developing
            }`}
          >
            {tier}
          </span>
        </div>

        {/* Big Value */}
        <div className="text-center mb-6">
          <AnimatedDollar value={total} />

          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20">
              <Dna size={10} className="text-purple-400" />
              <span className="text-[9px] font-bold text-purple-400 tracking-wider">GAI {gaiScore}</span>
              <span className="text-[8px] text-purple-400/60">{gaiTier}</span>
            </div>
            {trend >= 0 ? (
              <TrendingUp size={14} className="text-uc-green" />
            ) : (
              <TrendingDown size={14} className="text-uc-red" />
            )}
            <span
              className={`text-sm font-semibold ${
                trend >= 0 ? "text-uc-green" : "text-uc-red"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-xs text-uc-gray-400">vs. last month</span>
          </div>
        </div>

        {/* Percentile bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-uc-gray-400">NIL Percentile</span>
            <span className="text-sm font-bold text-uc-cyan">{percentile}th</span>
          </div>
          <div className="w-full h-2 bg-uc-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #00C2FF, #00FF88)",
              }}
            />
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={14} className="text-uc-gray-400" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400">
              Value Factors
            </span>
          </div>
          {factors.map((factor, i) => (
            <FactorBar key={factor.label} factor={factor} delay={0.3 + i * 0.1} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[9px] text-uc-gray-600 mt-6 text-center">
          Estimated value based on verified metrics, recruiting activity, and market signals.
          Not financial advice.
        </p>
      </div>
    </motion.div>
  );
}
