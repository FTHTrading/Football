"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import {
  Sparkles,
  Gem,
  Flame,
  Crown,
  Shield,
  ExternalLink,
  TrendingUp,
  Eye,
  Package,
  Zap,
  ArrowRight,
  Filter,
} from "lucide-react";

/* ── Rarity system ── */
type Rarity = "common" | "rare" | "legendary" | "genesis";

const RARITY_CONFIG: Record<
  Rarity,
  { label: string; color: string; bg: string; border: string; glow: string; icon: typeof Gem }
> = {
  common: {
    label: "Common",
    color: "text-uc-silver",
    bg: "bg-white/5",
    border: "border-white/10",
    glow: "",
    icon: Shield,
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-400/20",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    icon: Gem,
  },
  legendary: {
    label: "Legendary",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-400/20",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    icon: Flame,
  },
  genesis: {
    label: "1-of-1 Genesis",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-400/30",
    glow: "shadow-[0_0_40px_rgba(250,204,21,0.25)]",
    icon: Crown,
  },
};

/* ── Collectible data ── */
interface Collectible {
  id: string;
  athleteId: string;
  athleteName: string;
  school: string;
  rarity: Rarity;
  edition: number;
  totalEditions: number;
  price: number;
  velocity: number;
  mechanics: number;
  rating: number;
  verified: boolean;
  qbClass: string;
  state: string;
  bidCount: number;
  lastSale: number | null;
  mintDate: string;
}

const COLLECTIBLES: Collectible[] = [
  {
    id: "c1",
    athleteId: "6",
    athleteName: "Andre Mitchell",
    school: "IMG Academy",
    rarity: "genesis",
    edition: 1,
    totalEditions: 1,
    price: 2500,
    velocity: 63.4,
    mechanics: 95,
    rating: 5.0,
    verified: true,
    qbClass: "Pro-Style",
    state: "Florida",
    bidCount: 14,
    lastSale: null,
    mintDate: "2025-06-15",
  },
  {
    id: "c2",
    athleteId: "1",
    athleteName: "Jaxon Smith",
    school: "Westlake HS",
    rarity: "legendary",
    edition: 1,
    totalEditions: 10,
    price: 850,
    velocity: 61.8,
    mechanics: 92,
    rating: 4.5,
    verified: true,
    qbClass: "Pro-Style",
    state: "Texas",
    bidCount: 8,
    lastSale: 720,
    mintDate: "2025-06-10",
  },
  {
    id: "c3",
    athleteId: "4",
    athleteName: "Dylan Park",
    school: "Archbishop Moeller",
    rarity: "legendary",
    edition: 3,
    totalEditions: 10,
    price: 600,
    velocity: 60.1,
    mechanics: 89,
    rating: 4.0,
    verified: true,
    qbClass: "Pocket Passer",
    state: "Ohio",
    bidCount: 5,
    lastSale: 550,
    mintDate: "2025-06-08",
  },
  {
    id: "c4",
    athleteId: "2",
    athleteName: "Marcus Rivera",
    school: "Mater Dei HS",
    rarity: "rare",
    edition: 12,
    totalEditions: 50,
    price: 275,
    velocity: 58.2,
    mechanics: 85,
    rating: 4.0,
    verified: true,
    qbClass: "Dual-Threat",
    state: "California",
    bidCount: 3,
    lastSale: 250,
    mintDate: "2025-06-05",
  },
  {
    id: "c5",
    athleteId: "5",
    athleteName: "Kai Nakamura",
    school: "Saint Louis School",
    rarity: "rare",
    edition: 8,
    totalEditions: 50,
    price: 200,
    velocity: 56.5,
    mechanics: 81,
    rating: 3.5,
    verified: true,
    qbClass: "Dual-Threat",
    state: "Hawaii",
    bidCount: 2,
    lastSale: 175,
    mintDate: "2025-06-01",
  },
  {
    id: "c6",
    athleteId: "3",
    athleteName: "Tyler Washington",
    school: "Buford HS",
    rarity: "common",
    edition: 45,
    totalEditions: 100,
    price: 75,
    velocity: 55.0,
    mechanics: 78,
    rating: 3.5,
    verified: false,
    qbClass: "Pro-Style",
    state: "Georgia",
    bidCount: 0,
    lastSale: null,
    mintDate: "2025-05-28",
  },
];

/* ── Filter types ── */
type RarityFilter = "all" | Rarity;

export default function CollectiblesPage() {
  const [filter, setFilter] = useState<RarityFilter>("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filtered =
    filter === "all" ? COLLECTIBLES : COLLECTIBLES.filter((c) => c.rarity === filter);

  const totalVolume = COLLECTIBLES.reduce((sum, c) => sum + c.price, 0);
  const totalBids = COLLECTIBLES.reduce((sum, c) => sum + c.bidCount, 0);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ═══════════ HERO ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 relative"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] tracking-[0.3em] uppercase text-purple-400 border border-purple-400/20 mb-6"
          >
            <Sparkles size={12} />
            Digital Collectibles — Powered by Verified Data
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 relative z-10">
            <span className="gradient-text">Collect.</span>{" "}
            <span className="text-purple-400">Own.</span>{" "}
            <span className="text-uc-gray-400">Prove.</span>
          </h1>

          <p className="text-uc-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Every verified QB card is a digital collectible backed by decoded performance DNA.
            Mint, collect, and trade the next generation of quarterback genomes.
          </p>

          {/* Marketplace stats */}
          <div className="flex flex-wrap justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-uc-white">{COLLECTIBLES.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
                Active Cards
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-uc-green">
                ${totalVolume.toLocaleString()}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
                Total Volume
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-purple-400">{totalBids}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
                Active Bids
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-yellow-400">1</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
                Genesis Cards
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════ RARITY FILTER ═══════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <Filter size={14} className="text-uc-gray-400" />
          {(["all", "genesis", "legendary", "rare", "common"] as RarityFilter[]).map(
            (r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  filter === r
                    ? r === "all"
                      ? "bg-uc-cyan/20 text-uc-cyan border border-uc-cyan/30"
                      : r === "genesis"
                      ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                      : r === "legendary"
                      ? "bg-purple-400/20 text-purple-400 border border-purple-400/30"
                      : r === "rare"
                      ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                      : "bg-white/10 text-uc-silver border border-white/20"
                    : "glass text-uc-gray-400 border border-transparent hover:border-white/10"
                }`}
              >
                {r === "all" ? "All Cards" : RARITY_CONFIG[r as Rarity].label}
              </button>
            )
          )}
        </motion.div>

        {/* ═══════════ CARD GRID ═══════════ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((card, i) => {
              const config = RARITY_CONFIG[card.rarity];
              const RarityIcon = config.icon;
              const isHovered = hoveredCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-500 group cursor-pointer ${config.border} ${config.glow} ${
                    isHovered ? "scale-[1.02]" : ""
                  }`}
                >
                  {/* Holographic shimmer overlay */}
                  <div
                    className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(0,194,255,0.05) 40%, rgba(168,85,247,0.08) 50%, rgba(250,204,21,0.05) 60%, transparent 70%)",
                      backgroundSize: "200% 200%",
                      animation: isHovered ? "holographic-shift 3s ease infinite" : "none",
                    }}
                  />

                  {/* Card body */}
                  <div className="relative z-20 p-6">
                    {/* Header: Rarity + Edition */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`flex items-center gap-2 ${config.color}`}>
                        <RarityIcon size={14} />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                          {config.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-uc-gray-400">
                        #{card.edition}/{card.totalEditions}
                      </span>
                    </div>

                    {/* Athlete identity */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center border ${config.border} ${config.bg}`}
                      >
                        <span className={`text-2xl font-black ${config.color}`}>
                          {card.athleteName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold truncate">
                            {card.athleteName}
                          </h3>
                          {card.verified && <VerifiedBadge size="sm" />}
                        </div>
                        <p className="text-xs text-uc-gray-400">{card.school}</p>
                        <p className="text-[10px] text-uc-gray-600 mt-0.5">
                          {card.qbClass} • {card.state}
                        </p>
                      </div>
                    </div>

                    {/* Metrics strip */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-lg font-bold font-mono text-uc-cyan">
                          {card.velocity}
                        </p>
                        <p className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                          MPH
                        </p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-lg font-bold font-mono text-uc-cyan">
                          {card.mechanics}
                        </p>
                        <p className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                          Mech
                        </p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <p className="text-lg font-bold font-mono text-yellow-400">
                          {"★".repeat(Math.floor(card.rating))}
                          {card.rating % 1 !== 0 ? "½" : ""}
                        </p>
                        <p className="text-[8px] tracking-wider uppercase text-uc-gray-400">
                          Rating
                        </p>
                      </div>
                    </div>

                    {/* Price + action */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] tracking-wider uppercase text-uc-gray-400 mb-1">
                          Current Price
                        </p>
                        <p className="text-2xl font-bold text-uc-green">
                          ${card.price.toLocaleString()}
                        </p>
                        {card.lastSale && (
                          <p className="text-[9px] text-uc-gray-600 mt-0.5">
                            Last sale: ${card.lastSale.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {card.bidCount > 0 && (
                          <span className="text-[9px] text-uc-gray-400">
                            {card.bidCount} bid{card.bidCount !== 1 ? "s" : ""}
                          </span>
                        )}
                        <button
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                            card.rarity === "genesis"
                              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/30 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                              : "bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.2)]"
                          }`}
                        >
                          {card.rarity === "genesis" ? "Place Bid" : "Collect"}
                        </button>
                      </div>
                    </div>

                    {/* Mint date footer */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <span className="text-[9px] text-uc-gray-600">
                        Minted {new Date(card.mintDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <Link
                        href={`/athlete/${card.athleteId}`}
                        className="inline-flex items-center gap-1 text-[9px] text-uc-gray-400 hover:text-uc-cyan transition-colors"
                      >
                        View Profile
                        <ExternalLink size={9} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-purple-400 mb-4 text-center">
            How It Works
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Data-Backed Digital Cards</span>
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Shield,
                title: "Get Verified",
                desc: "Complete the QB verification process with objective throwing metrics.",
                color: "text-uc-cyan",
              },
              {
                step: "02",
                icon: Zap,
                title: "Card Minted",
                desc: "Your verified data generates a unique digital collectible card with rarity tier.",
                color: "text-blue-400",
              },
              {
                step: "03",
                icon: Package,
                title: "Collect & Trade",
                desc: "Coaches, fans, and collectors can bid on and collect verified QB cards.",
                color: "text-purple-400",
              },
              {
                step: "04",
                icon: TrendingUp,
                title: "Value Grows",
                desc: "As your metrics improve and offers increase, your card value rises.",
                color: "text-yellow-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center relative overflow-hidden group"
              >
                <span className="absolute top-3 right-4 text-5xl font-black text-white/[0.03] select-none">
                  {item.step}
                </span>
                <div
                  className={`w-12 h-12 rounded-xl ${item.color} bg-current/10 flex items-center justify-center mx-auto mb-4`}
                  style={{ backgroundColor: `color-mix(in srgb, currentColor 10%, transparent)` }}
                >
                  <item.icon size={22} className={item.color} />
                </div>
                <h4 className="text-sm font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-uc-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ FEATURED DROP ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
                  <Crown size={12} />
                  Genesis Drop
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Andre Mitchell
                </h3>
                <p className="text-uc-gray-400 mb-4 max-w-md">
                  The #1 ranked QB in the Under Center Index. 5-star recruit, 
                  63.4 MPH velocity, 95 mechanics grade. This 1-of-1 Genesis card 
                  is the first ever minted on the platform.
                </p>
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <p className="text-[9px] tracking-wider uppercase text-uc-gray-400">
                      Current Bid
                    </p>
                    <p className="text-3xl font-bold text-uc-green">$2,500</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider uppercase text-uc-gray-400">
                      Bidders
                    </p>
                    <p className="text-3xl font-bold text-yellow-400">14</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider uppercase text-uc-gray-400">
                      Time Left
                    </p>
                    <p className="text-3xl font-bold text-uc-red">2d 14h</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-yellow-400/20 text-yellow-400 font-bold text-sm tracking-wider uppercase border border-yellow-400/30 hover:bg-yellow-400/30 hover:shadow-[0_0_30px_rgba(250,204,21,0.25)] transition-all duration-300">
                  Place Bid
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Genesis card preview */}
              <div className="flex-shrink-0">
                <div className="w-64 h-80 rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-uc-panel to-purple-500/10 p-6 flex flex-col justify-between shadow-[0_0_60px_rgba(250,204,21,0.15)] animate-pulse-glow relative overflow-hidden">
                  {/* Holographic pattern */}
                  <div className="absolute inset-0 holographic-bg opacity-30 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Crown size={16} className="text-yellow-400" />
                      <span className="text-[8px] font-mono text-yellow-400/70">
                        #1/1
                      </span>
                    </div>
                    <div className="w-20 h-20 rounded-xl bg-yellow-400/10 flex items-center justify-center mx-auto mb-3 border border-yellow-400/20">
                      <span className="text-3xl font-black text-yellow-400">A</span>
                    </div>
                    <p className="text-center text-sm font-bold">Andre Mitchell</p>
                    <p className="text-center text-[9px] text-uc-gray-400">
                      IMG Academy • FL
                    </p>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between text-[9px] text-uc-gray-400 mb-1">
                      <span>VEL</span>
                      <span>MECH</span>
                      <span>ACC</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold font-mono text-yellow-400">
                      <span>63.4</span>
                      <span>95</span>
                      <span>93</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════ CTA ═══════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Your data. Your card. Your value.</span>
          </h2>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-8">
            Every verified metric you earn turns into collectible value.
            Get verified to mint your first digital card.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_40px_rgba(0,194,255,0.4)] transition-all duration-300"
          >
            Get Verified & Mint
            <Sparkles size={16} />
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
