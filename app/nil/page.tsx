"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Users,
  Globe,
  ArrowRight,
  Search,
  Filter,
  BarChart3,
  Sparkles,
  Dna,
  ChevronDown,
  ExternalLink,
  Star,
} from "lucide-react";

/* ── NIL Value Calculator (simplified from component) ── */
function calculateNILValue(a: Athlete) {
  const perfScore = Math.round((a.metrics.velocity / 70) * 30 + (a.metrics.mechanics / 100) * 35 + (a.metrics.accuracy / 100) * 35);
  const recruitScore = Math.min(100, Math.round(a.offers.length * 12 + (a.rating / 5) * 40));
  const socialScore = Math.round(Math.min(100, 30 + a.offers.length * 8 + (a.verified ? 15 : 0)));
  const bigMarkets = ["Texas", "California", "Florida", "Georgia", "Ohio"];
  const marketScore = bigMarkets.includes(a.state) ? 85 : 60;
  const verifiedScore = a.verified ? 95 : 30;

  const composite = perfScore * 0.35 + recruitScore * 0.25 + socialScore * 0.15 + marketScore * 0.15 + verifiedScore * 0.10;
  const total = Math.round((composite * composite * 0.15) / 50) * 50;
  const tier = total >= 50000 ? "Elite" : total >= 20000 ? "Premium" : total >= 8000 ? "Rising" : total >= 3000 ? "Emerging" : "Developing";
  const trend = +(Math.random() * 18 - 3).toFixed(1);

  return { total, composite, tier, trend, perfScore, recruitScore, socialScore, marketScore, verifiedScore };
}

/* ── Deal Types ── */
const DEAL_CATEGORIES = [
  { key: "all", label: "All Deals" },
  { key: "social", label: "Social Media" },
  { key: "appearance", label: "Appearances" },
  { key: "merch", label: "Merchandise" },
  { key: "camp", label: "Camps & Clinics" },
  { key: "licensing", label: "Licensing" },
] as const;

/* ── Simulated NIL deals for athletes ── */
function generateDeals(a: Athlete) {
  const nil = calculateNILValue(a);
  const dealTypes = [
    { category: "social", title: "Instagram Partnership", brand: "NOCTA Training", value: Math.round(nil.total * 0.08), status: "active" as const },
    { category: "appearance", title: "Youth QB Camp", brand: "Elite 11 Regional", value: Math.round(nil.total * 0.12), status: "active" as const },
    { category: "merch", title: "Custom Gloves Collab", brand: "Cutters Sports", value: Math.round(nil.total * 0.06), status: "pending" as const },
    { category: "camp", title: "Summer Training Camp", brand: `${a.state} QB Academy`, value: Math.round(nil.total * 0.1), status: "active" as const },
    { category: "licensing", title: "Digital Collectible Rights", brand: "Under Center NFT", value: Math.round(nil.total * 0.15), status: "active" as const },
    { category: "social", title: "TikTok Brand Deal", brand: "Gatorade", value: Math.round(nil.total * 0.05), status: "completed" as const },
  ];
  return dealTypes.filter((_, i) => {
    // Higher-value athletes get more deals
    if (nil.total >= 50000) return true;
    if (nil.total >= 20000) return i < 5;
    if (nil.total >= 8000) return i < 3;
    return i < 2;
  });
}

/* ── Athlete NIL Card ── */
function NILAthleteCard({ athlete, rank, delay }: { athlete: Athlete; rank: number; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const nil = calculateNILValue(athlete);
  const deals = generateDeals(athlete);
  const activeDeals = deals.filter((d) => d.status === "active");
  const totalDealValue = deals.reduce((s, d) => s + d.value, 0);

  const tierColors: Record<string, string> = {
    Elite: "text-yellow-400 bg-yellow-400/10",
    Premium: "text-purple-400 bg-purple-400/10",
    Rising: "text-uc-cyan bg-uc-cyan/10",
    Emerging: "text-uc-green bg-uc-green/10",
    Developing: "text-uc-gray-400 bg-white/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-7">
            <span className="text-base font-black font-mono text-uc-gray-500">#{rank}</span>
          </div>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-uc-green/15 to-uc-panel flex items-center justify-center flex-shrink-0 border border-white/5">
            <DollarSign size={18} className="text-uc-green/50" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Link href={`/athlete/${athlete.id}`} className="text-sm font-bold hover:text-uc-cyan transition-colors truncate">
                {athlete.name}
              </Link>
              {athlete.verified && (
                <span className="px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20">DNA</span>
              )}
            </div>
            <p className="text-[10px] text-uc-gray-400">{athlete.school} • {athlete.state}</p>
          </div>

          {/* Value */}
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-black font-mono text-uc-green">${nil.total.toLocaleString()}</p>
            <div className="flex items-center gap-1 justify-end">
              {nil.trend >= 0 ? (
                <TrendingUp size={10} className="text-uc-green" />
              ) : (
                <TrendingDown size={10} className="text-uc-red" />
              )}
              <span className={`text-[10px] font-bold ${nil.trend >= 0 ? "text-uc-green" : "text-uc-red"}`}>
                {nil.trend > 0 ? "+" : ""}{nil.trend}%
              </span>
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider ${tierColors[nil.tier]}`}>
                {nil.tier.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Active Deals", value: activeDeals.length.toString(), color: "text-uc-green" },
            { label: "Deal Value", value: `$${(totalDealValue / 1000).toFixed(1)}K`, color: "text-uc-cyan" },
            { label: "NIL Score", value: nil.composite.toFixed(0), color: "text-purple-400" },
            { label: "Offers", value: athlete.offers.length.toString(), color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-[8px] text-uc-gray-500 tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Star size={10} className="text-yellow-400" />
            <span className="text-[10px] text-uc-gray-400">{athlete.rating.toFixed(1)} rating</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[9px] text-uc-green tracking-wider uppercase font-bold hover:text-white transition-colors"
          >
            {expanded ? "Hide Deals" : "View Deals"}
            <ChevronDown size={10} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded deals */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <h4 className="text-[9px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold">Active & Pending Deals</h4>
              {deals.map((deal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${
                    deal.status === "active" ? "bg-uc-green" : deal.status === "pending" ? "bg-yellow-400" : "bg-uc-gray-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{deal.title}</p>
                    <p className="text-[10px] text-uc-gray-500">{deal.brand}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold font-mono text-uc-green">${deal.value.toLocaleString()}</p>
                    <p className="text-[8px] text-uc-gray-500 uppercase tracking-wider">{deal.status}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/athlete/${athlete.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uc-green/10 text-uc-green text-[9px] font-bold tracking-wider uppercase border border-uc-green/20 hover:bg-uc-green/20 transition-all"
                >
                  Full Profile <ExternalLink size={9} />
                </Link>
                <Link
                  href={`/card-generator?athlete=${athlete.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-uc-gray-400 text-[9px] font-bold tracking-wider uppercase border border-white/5 hover:bg-white/10 transition-all"
                >
                  Generate Card
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main NIL Marketplace Page ── */
export default function NILMarketplacePage() {
  const [sortBy, setSortBy] = useState<"value" | "trend" | "deals">("value");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const athletesWithNIL = useMemo(() => {
    return PLACEHOLDER_ATHLETES.map((a) => ({
      athlete: a,
      nil: calculateNILValue(a),
      deals: generateDeals(a),
    }));
  }, []);

  const filtered = useMemo(() => {
    let list = [...athletesWithNIL];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (x) =>
          x.athlete.name.toLowerCase().includes(q) ||
          x.athlete.school.toLowerCase().includes(q)
      );
    }
    if (tierFilter !== "all") {
      list = list.filter((x) => x.nil.tier === tierFilter);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "trend": return b.nil.trend - a.nil.trend;
        case "deals": return b.deals.length - a.deals.length;
        default: return b.nil.total - a.nil.total;
      }
    });

    return list;
  }, [athletesWithNIL, sortBy, tierFilter, searchQuery]);

  const totalMarketValue = athletesWithNIL.reduce((s, x) => s + x.nil.total, 0);
  const avgValue = totalMarketValue / athletesWithNIL.length;
  const eliteCount = athletesWithNIL.filter((x) => x.nil.tier === "Elite" || x.nil.tier === "Premium").length;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.3em] uppercase text-uc-green mb-4">
            <DollarSign size={12} />
            NIL Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">NIL Marketplace</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Real-time NIL valuations powered by genome-decoded performance data.
            Track deals, discover value, and maximize earning potential.
          </p>
        </motion.div>

        {/* Market Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Market Value", value: `$${(totalMarketValue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-uc-green" },
            { label: "Average NIL Value", value: `$${(avgValue / 1000).toFixed(1)}K`, icon: BarChart3, color: "text-uc-cyan" },
            { label: "Elite / Premium", value: eliteCount.toString(), icon: Sparkles, color: "text-yellow-400" },
            { label: "Active Athletes", value: athletesWithNIL.length.toString(), icon: Users, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.color.replace("text-", "bg-")}/10 flex items-center justify-center`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{s.value}</p>
                <p className="text-[9px] text-uc-gray-400 tracking-wider uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-1 w-full md:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
            <input
              type="text"
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-uc-surface border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-uc-gray-500 focus:outline-none focus:border-uc-green/50 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-uc-surface border border-white/10 rounded-lg px-4 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-green/50"
            >
              <option value="value">Sort by Value</option>
              <option value="trend">Sort by Trend</option>
              <option value="deals">Sort by Deals</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-uc-surface border border-white/10 rounded-lg px-4 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-uc-green/50"
            >
              <option value="all">All Tiers</option>
              <option value="Elite">Elite</option>
              <option value="Premium">Premium</option>
              <option value="Rising">Rising</option>
              <option value="Emerging">Emerging</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Athlete NIL Cards */}
        <div className="space-y-4 mb-12">
          {filtered.map((x, i) => (
            <NILAthleteCard key={x.athlete.id} athlete={x.athlete} rank={i + 1} delay={0.05 * i} />
          ))}
        </div>

        <DNAStrandDivider className="mb-8 opacity-30" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Unlock full NIL intelligence with a decoded profile.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-green text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all"
          >
            Unlock NIL Intelligence
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
