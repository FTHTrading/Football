"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Filter,
  ChevronDown,
  Star,
  Dna,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  Globe,
  Sparkles,
  Trophy,
  Users,
  Eye,
  Heart,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── Offer Types ── */
type OfferStatus = "committed" | "offered" | "interested" | "visited" | "declined";

interface Offer {
  id: string;
  school: string;
  conference: string;
  status: OfferStatus;
  date: string;
  scholarship: "Full" | "Partial" | "Walk-On" | "Preferred Walk-On";
  genomeFit: number;
  notes: string;
  logo?: string;
}

/* ── Generate offers for each athlete ── */
const D1_PROGRAMS: { school: string; conference: string }[] = [
  { school: "Alabama", conference: "SEC" },
  { school: "Ohio State", conference: "Big Ten" },
  { school: "Georgia", conference: "SEC" },
  { school: "Texas", conference: "SEC" },
  { school: "USC", conference: "Big Ten" },
  { school: "Oregon", conference: "Big Ten" },
  { school: "Michigan", conference: "Big Ten" },
  { school: "Penn State", conference: "Big Ten" },
  { school: "Clemson", conference: "ACC" },
  { school: "LSU", conference: "SEC" },
  { school: "Florida State", conference: "ACC" },
  { school: "Oklahoma", conference: "SEC" },
  { school: "Tennessee", conference: "SEC" },
  { school: "Notre Dame", conference: "Independent" },
  { school: "Miami", conference: "ACC" },
  { school: "Auburn", conference: "SEC" },
  { school: "Wisconsin", conference: "Big Ten" },
  { school: "UCLA", conference: "Big Ten" },
  { school: "Colorado", conference: "Big 12" },
  { school: "Texas A&M", conference: "SEC" },
];

function generateOffers(athlete: Athlete): Offer[] {
  const gs = computeGAI(athlete.metrics).gai;
  const offerCount = Math.min(D1_PROGRAMS.length, Math.max(3, Math.floor(gs / 10)));
  const statuses: OfferStatus[] = ["committed", "offered", "interested", "visited", "declined"];
  const scholarships: Offer["scholarship"][] = ["Full", "Full", "Full", "Partial", "Preferred Walk-On"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return D1_PROGRAMS.slice(0, offerCount).map((prog, i) => {
    const status = i === 0 && gs >= 80 ? "committed" as const :
      i < 3 ? "offered" as const :
      i < 5 ? "visited" as const :
      i < offerCount - 1 ? "interested" as const :
      "declined" as const;

    const month = months[(i * 2 + athlete.name.length) % 12];
    const genomeFit = Math.max(40, Math.min(99, gs + Math.floor(Math.sin(i * 2.7 + athlete.name.length) * 15)));

    return {
      id: `${athlete.id}-${prog.school.toLowerCase().replace(/ /g, "-")}`,
      school: prog.school,
      conference: prog.conference,
      status,
      date: `${month} 2025`,
      scholarship: scholarships[Math.min(i, scholarships.length - 1)],
      genomeFit,
      notes: status === "committed" ? "Verbal commitment" :
        status === "visited" ? "Official visit completed" :
        status === "offered" ? "Scholarship offer received" :
        status === "interested" ? "Mutual interest — evaluating" :
        "Declined offer",
    };
  });
}

const STATUS_CONFIG: Record<OfferStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  committed: { label: "Committed", icon: CheckCircle2, color: "text-uc-green", bg: "bg-uc-green/15" },
  offered: { label: "Offered", icon: Star, color: "text-uc-cyan", bg: "bg-uc-cyan/15" },
  visited: { label: "Visited", icon: Building2, color: "text-purple-400", bg: "bg-purple-400/15" },
  interested: { label: "Interested", icon: Heart, color: "text-yellow-400", bg: "bg-yellow-400/15" },
  declined: { label: "Declined", icon: XCircle, color: "text-red-400", bg: "bg-red-400/15" },
};

type FilterStatus = "all" | OfferStatus;

export default function OffersPage() {
  const [selectedAthlete, setSelectedAthlete] = useState(PLACEHOLDER_ATHLETES[0].id);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  const athlete = PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthlete) ?? PLACEHOLDER_ATHLETES[0];
  const allOffers = useMemo(() => generateOffers(athlete), [athlete]);
  const filtered = statusFilter === "all" ? allOffers : allOffers.filter((o) => o.status === statusFilter);
  const gaiResult = computeGAI(athlete.metrics);
  const gs = gaiResult.gai;

  const summaryStats = useMemo(() => ({
    total: allOffers.length,
    committed: allOffers.filter((o) => o.status === "committed").length,
    fullScholarships: allOffers.filter((o) => o.scholarship === "Full").length,
    avgGenomeFit: Math.round(allOffers.reduce((s, o) => s + o.genomeFit, 0) / allOffers.length),
    conferences: new Set(allOffers.map((o) => o.conference)).size,
    topFit: allOffers.sort((a, b) => b.genomeFit - a.genomeFit)[0],
  }), [allOffers]);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Offers <span className="gradient-text-dna">Tracker</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Track scholarship offers, official visits, and commitment status. Genome fit scoring reveals which programs align best with each QB&apos;s DNA.
          </p>
        </motion.div>

        {/* ── Athlete Selector ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Eye size={14} className="text-uc-gray-400" />
          {PLACEHOLDER_ATHLETES.map((a) => (
            <button
              key={a.id}
              onClick={() => { setSelectedAthlete(a.id); setStatusFilter("all"); setExpandedOffer(null); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedAthlete === a.id ? "bg-uc-cyan/20 text-uc-cyan border border-uc-cyan/30" : "bg-white/5 text-uc-gray-400 hover:text-white"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-uc-surface flex items-center justify-center text-[8px] font-bold">
                {a.name.split(" ").map((n) => n[0]).join("")}
              </span>
              {a.name.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* ── Overview Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total Offers", value: summaryStats.total, icon: Trophy, color: "text-white" },
            { label: "Committed", value: summaryStats.committed, icon: CheckCircle2, color: "text-uc-green" },
            { label: "Full Rides", value: summaryStats.fullScholarships, icon: Star, color: "text-yellow-400" },
            { label: "Conferences", value: summaryStats.conferences, icon: Globe, color: "text-uc-cyan" },
            { label: "Avg Fit", value: summaryStats.avgGenomeFit, icon: Dna, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-uc-gray-400" />
                  <p className="text-[9px] uppercase tracking-widest text-uc-gray-400">{s.label}</p>
                </div>
                <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Status Filter ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter size={12} className="text-uc-gray-400" />
          {(["all", "committed", "offered", "visited", "interested", "declined"] as FilterStatus[]).map((st) => {
            const count = st === "all" ? allOffers.length : allOffers.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  statusFilter === st ? "bg-uc-cyan/20 text-uc-cyan" : "bg-white/5 text-uc-gray-400 hover:text-white"
                }`}
              >
                {st === "all" ? "All" : STATUS_CONFIG[st].label}
                <span className="text-[9px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Offers List ── */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((offer, i) => {
              const config = STATUS_CONFIG[offer.status];
              const Icon = config.icon;
              const isExpanded = expandedOffer === offer.id;

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass rounded-xl overflow-hidden transition ${
                    isExpanded ? "ring-1 ring-uc-cyan/30" : ""
                  }`}
                >
                  {/* Main Row */}
                  <button
                    onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition"
                  >
                    {/* School Badge */}
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {offer.school.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{offer.school}</p>
                      <p className="text-[10px] text-uc-gray-400">{offer.conference} · {offer.date}</p>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg}`}>
                      <Icon size={10} className={config.color} />
                      <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
                    </div>

                    {/* Scholarship */}
                    <span className="hidden sm:block text-[10px] text-uc-gray-400 w-20 text-right">{offer.scholarship}</span>

                    {/* Genome Fit */}
                    <div className="hidden sm:flex items-center gap-1.5 w-24 justify-end">
                      <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${offer.genomeFit}%`,
                            background: offer.genomeFit >= 80 ? "linear-gradient(90deg, #00C2FF, #00FF88)" :
                              offer.genomeFit >= 60 ? "linear-gradient(90deg, #A855F7, #00C2FF)" :
                              "linear-gradient(90deg, #F59E0B, #EF4444)",
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold tabular-nums ${
                        offer.genomeFit >= 80 ? "text-uc-green" : offer.genomeFit >= 60 ? "text-uc-cyan" : "text-orange-400"
                      }`}>{offer.genomeFit}</span>
                    </div>

                    <ChevronDown
                      size={14}
                      className={`text-uc-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-white/[0.05]">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div className="bg-white/[0.03] rounded-lg p-3">
                              <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Conference</p>
                              <p className="text-sm font-bold text-white">{offer.conference}</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-lg p-3">
                              <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Scholarship</p>
                              <p className="text-sm font-bold text-white">{offer.scholarship}</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-lg p-3">
                              <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Genome Fit</p>
                              <p className={`text-sm font-bold ${offer.genomeFit >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>{offer.genomeFit}%</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-lg p-3">
                              <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                              <p className="text-sm font-bold text-white">{offer.date}</p>
                            </div>
                          </div>

                          {/* Genome Fit Breakdown */}
                          <div className="bg-white/[0.02] rounded-lg p-3 mb-3">
                            <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                              <Dna size={10} /> Genome Fit Analysis
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {[
                                { gene: "VEL-α", fit: Math.min(99, offer.genomeFit + 5), color: "#00C2FF" },
                                { gene: "ACC-γ", fit: Math.min(99, offer.genomeFit - 3), color: "#00FF88" },
                                { gene: "REL-β", fit: Math.min(99, offer.genomeFit + 8), color: "#A855F7" },
                                { gene: "MECH-δ", fit: Math.min(99, offer.genomeFit - 7), color: "#F59E0B" },
                                { gene: "DEC-ε", fit: Math.min(99, offer.genomeFit + 2), color: "#EC4899" },
                                { gene: "SPR-ζ", fit: Math.min(99, offer.genomeFit - 1), color: "#06B6D4" },
                              ].map((g) => (
                                <div key={g.gene} className="text-center">
                                  <div className="w-full h-1 bg-white/5 rounded-full mb-1 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${g.fit}%`, background: g.color }} />
                                  </div>
                                  <p className="text-[8px] font-mono text-uc-gray-400">{g.gene}</p>
                                  <p className="text-[9px] font-bold" style={{ color: g.color }}>{g.fit}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <p className="text-[10px] text-uc-gray-400 italic">{offer.notes}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-uc-gray-400 text-sm">No offers matching this filter.</p>
          </div>
        )}

        {/* ── Commitment Timeline ── */}
        {allOffers.some((o) => o.status === "committed") && (
          <div className="mt-12 glass rounded-xl p-6">
            <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-uc-green" /> Commitment
            </h3>
            {allOffers.filter((o) => o.status === "committed").map((o) => (
              <div key={o.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-uc-green/20 to-uc-cyan/20 border border-uc-green/30 flex items-center justify-center text-lg font-bold text-uc-green">
                  {o.school.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{athlete.name} → {o.school}</p>
                  <p className="text-xs text-uc-gray-400">{o.conference} · {o.scholarship} Scholarship · Genome Fit: <span className="text-uc-green font-bold">{o.genomeFit}%</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Best Fit Recommendation ── */}
        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
            <Dna size={12} className="text-purple-400" /> Top Genome Fit Programs
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {allOffers.sort((a, b) => b.genomeFit - a.genomeFit).slice(0, 3).map((o, i) => (
              <div key={o.id} className="bg-white/[0.03] rounded-lg p-4 flex items-center gap-3">
                <span className={`text-lg font-black ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-orange-400"}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{o.school}</p>
                  <p className="text-[10px] text-uc-gray-400">{o.conference}</p>
                </div>
                <span className={`text-lg font-black tabular-nums ${o.genomeFit >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>{o.genomeFit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <p className="text-uc-gray-400 text-sm mb-4">Explore more recruiting tools</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/portal" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition">
              <TrendingUp size={14} /> Transfer Portal
            </Link>
            <Link href="/map" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all">
              <MapPin size={14} /> Prospect Map <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
