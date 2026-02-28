"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Filter,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Star,
  Dna,
  Zap,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete, AthleteMetrics } from "@/lib/store";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── State Coordinates (approximate center of state) ── */
const STATE_COORDS: Record<string, { x: number; y: number }> = {
  "Alabama": { x: 610, y: 420 },
  "Alaska": { x: 130, y: 520 },
  "Arizona": { x: 195, y: 400 },
  "Arkansas": { x: 530, y: 390 },
  "California": { x: 100, y: 320 },
  "Colorado": { x: 290, y: 300 },
  "Connecticut": { x: 780, y: 195 },
  "Delaware": { x: 755, y: 260 },
  "Florida": { x: 700, y: 480 },
  "Georgia": { x: 670, y: 410 },
  "Hawaii": { x: 250, y: 530 },
  "Idaho": { x: 195, y: 185 },
  "Illinois": { x: 570, y: 275 },
  "Indiana": { x: 600, y: 270 },
  "Iowa": { x: 500, y: 230 },
  "Kansas": { x: 420, y: 310 },
  "Kentucky": { x: 640, y: 320 },
  "Louisiana": { x: 530, y: 450 },
  "Maine": { x: 810, y: 120 },
  "Maryland": { x: 740, y: 260 },
  "Massachusetts": { x: 790, y: 180 },
  "Michigan": { x: 600, y: 200 },
  "Minnesota": { x: 470, y: 160 },
  "Mississippi": { x: 570, y: 420 },
  "Missouri": { x: 510, y: 320 },
  "Montana": { x: 265, y: 140 },
  "Nebraska": { x: 400, y: 250 },
  "Nevada": { x: 155, y: 290 },
  "New Hampshire": { x: 790, y: 155 },
  "New Jersey": { x: 765, y: 240 },
  "New Mexico": { x: 260, y: 400 },
  "New York": { x: 745, y: 185 },
  "North Carolina": { x: 720, y: 340 },
  "North Dakota": { x: 400, y: 140 },
  "Ohio": { x: 640, y: 255 },
  "Oklahoma": { x: 430, y: 370 },
  "Oregon": { x: 120, y: 170 },
  "Pennsylvania": { x: 720, y: 230 },
  "Rhode Island": { x: 795, y: 195 },
  "South Carolina": { x: 700, y: 370 },
  "South Dakota": { x: 400, y: 190 },
  "Tennessee": { x: 620, y: 350 },
  "Texas": { x: 390, y: 440 },
  "Utah": { x: 225, y: 290 },
  "Vermont": { x: 775, y: 145 },
  "Virginia": { x: 720, y: 300 },
  "Washington": { x: 140, y: 115 },
  "West Virginia": { x: 690, y: 290 },
  "Wisconsin": { x: 530, y: 175 },
  "Wyoming": { x: 285, y: 220 },
};

/* ── Hotbed scoring ───────────────────── */
interface StateData {
  state: string;
  athletes: (Athlete & { gs: number; gaiTierColor: string })[];
  avgGenome: number;
  topAthlete: Athlete;
  coords: { x: number; y: number };
}

/* ── Main Component ───────────────────── */
export default function ProspectMapPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<number | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateData = useMemo(() => {
    const filtered = classFilter
      ? PLACEHOLDER_ATHLETES.filter((a) => a.gradYear === classFilter)
      : PLACEHOLDER_ATHLETES;

    const grouped: Record<string, (Athlete & { gs: number; gaiTierColor: string })[]> = {};
    for (const a of filtered) {
      const gaiResult = computeGAI(a.metrics);
      const gs = gaiResult.gai;
      if (!grouped[a.state]) grouped[a.state] = [];
      grouped[a.state].push({ ...a, gs, gaiTierColor: gaiResult.tierColor });
    }

    const result: StateData[] = [];
    for (const [state, athletes] of Object.entries(grouped)) {
      const coords = STATE_COORDS[state];
      if (!coords) continue;
      const avgGenome = Math.round(athletes.reduce((s, a) => s + a.gs, 0) / athletes.length);
      const topAthlete = athletes.sort((a, b) => b.gs - a.gs)[0];
      result.push({ state, athletes, avgGenome, topAthlete, coords });
    }
    return result.sort((a, b) => b.avgGenome - a.avgGenome);
  }, [classFilter]);

  const selectedData = selectedState ? stateData.find((s) => s.state === selectedState) : null;

  const nationwideStats = useMemo(() => {
    const all = PLACEHOLDER_ATHLETES.map((a) => ({ ...a, gs: computeGAI(a.metrics).gai }));
    return {
      totalProspects: all.length,
      statesCovered: new Set(all.map((a) => a.state)).size,
      avgGenome: Math.round(all.reduce((s, a) => s + a.gs, 0) / all.length),
      topState: stateData[0]?.state || "—",
    };
  }, [stateData]);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Prospect <span className="gradient-text-dna">Map</span>
            </h1>
          </div>
          <p className="text-uc-gray-400 text-sm max-w-xl">
            Geographic genome intelligence. Visualize QB talent hotbeds across the nation — see where elite DNA clusters and discover untapped talent pools.
          </p>
        </motion.div>

        {/* ── Nationwide Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Prospects", value: nationwideStats.totalProspects, icon: Users, color: "text-white" },
            { label: "States Covered", value: nationwideStats.statesCovered, icon: MapPin, color: "text-uc-cyan" },
            { label: "Avg Genome", value: nationwideStats.avgGenome, icon: Dna, color: "text-uc-green" },
            { label: "Top State", value: nationwideStats.topState, icon: Star, color: "text-yellow-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-uc-gray-400" />
                  <p className="text-[10px] uppercase tracking-widest text-uc-gray-400">{s.label}</p>
                </div>
                <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Class Filter ── */}
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap size={14} className="text-uc-gray-400" />
          <span className="text-[10px] text-uc-gray-400 uppercase tracking-widest">Class:</span>
          {[null, 2026, 2027].map((yr) => (
            <button
              key={yr ?? "all"}
              onClick={() => setClassFilter(yr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                classFilter === yr ? "bg-uc-cyan/20 text-uc-cyan" : "bg-white/5 text-uc-gray-400 hover:text-white"
              }`}
            >
              {yr || "All Classes"}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── MAP VISUALIZATION ── */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                <MapPin size={12} /> Talent Heatmap
              </h3>

              {/* SVG Map (simplified US outline with prospect dots) */}
              <div className="relative" style={{ paddingBottom: "62%" }}>
                <svg viewBox="0 0 900 580" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* US outline simplified */}
                  <path
                    d="M100,120 L200,100 L350,100 L400,115 L550,95 L650,105 L750,110 L800,130 L810,180 L795,200 L770,230 L760,270 L740,300 L720,340 L710,380 L700,420 L720,460 L680,500 L600,490 L530,470 L400,470 L350,480 L300,460 L250,440 L200,420 L170,400 L140,360 L110,310 L95,260 L90,200 Z"
                    fill="rgba(255,255,255,0.02)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />

                  {/* Grid lines */}
                  {[150, 300, 450, 600, 750].map((x) => (
                    <line key={`vl-${x}`} x1={x} y1={80} x2={x} y2={520} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  ))}
                  {[150, 250, 350, 450].map((y) => (
                    <line key={`hl-${y}`} x1={70} y1={y} x2={840} y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  ))}

                  {/* Prospect dots */}
                  {stateData.map((sd) => {
                    const isSelected = selectedState === sd.state;
                    const isHovered = hoveredState === sd.state;
                    const radius = Math.max(8, Math.min(22, sd.athletes.length * 10));
                    const color = sd.avgGenome >= 80 ? "#00FF88" : sd.avgGenome >= 65 ? "#00C2FF" : "#9CA3AF";

                    return (
                      <g key={sd.state}>
                        {/* Heatmap glow */}
                        <circle
                          cx={sd.coords.x}
                          cy={sd.coords.y}
                          r={radius + 12}
                          fill={color}
                          opacity={isSelected ? 0.15 : 0.06}
                        />
                        {/* Main dot */}
                        <circle
                          cx={sd.coords.x}
                          cy={sd.coords.y}
                          r={radius}
                          fill={color}
                          opacity={isSelected || isHovered ? 0.9 : 0.5}
                          stroke={isSelected ? "white" : "none"}
                          strokeWidth={2}
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredState(sd.state)}
                          onMouseLeave={() => setHoveredState(null)}
                          onClick={() => setSelectedState(isSelected ? null : sd.state)}
                        />
                        {/* Count label */}
                        <text
                          x={sd.coords.x}
                          y={sd.coords.y + 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="9"
                          fontWeight="bold"
                          fill="white"
                          className="pointer-events-none"
                        >
                          {sd.athletes.length}
                        </text>
                        {/* State label */}
                        <text
                          x={sd.coords.x}
                          y={sd.coords.y + radius + 12}
                          textAnchor="middle"
                          fontSize="8"
                          fill="rgba(255,255,255,0.4)"
                          className="pointer-events-none"
                        >
                          {sd.state}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Hover tooltip */}
              {hoveredState && !selectedState && (() => {
                const sd = stateData.find((s) => s.state === hoveredState);
                if (!sd) return null;
                return (
                  <div className="absolute bottom-4 left-4 bg-uc-panel border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-xs font-bold text-white">{sd.state}</p>
                    <p className="text-[10px] text-uc-gray-400">{sd.athletes.length} prospect{sd.athletes.length !== 1 ? "s" : ""} · Avg Genome: <span className="text-uc-cyan">{sd.avgGenome}</span></p>
                  </div>
                );
              })()}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4">
                {[
                  { color: "#00FF88", label: "Elite (80+)" },
                  { color: "#00C2FF", label: "Strong (65-79)" },
                  { color: "#9CA3AF", label: "Developing (<65)" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-[9px] text-uc-gray-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: State Details / Rankings ── */}
          <div className="space-y-6">
            {/* Selected State Detail */}
            {selectedData ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin size={16} className="text-uc-cyan" />
                    {selectedData.state}
                  </h3>
                  <button onClick={() => setSelectedState(null)} className="text-[10px] text-uc-gray-400 hover:text-white transition">Clear</button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.03] rounded-lg p-3">
                    <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Prospects</p>
                    <p className="text-xl font-black text-white">{selectedData.athletes.length}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3">
                    <p className="text-[9px] text-uc-gray-400 uppercase tracking-widest mb-0.5">Avg Genome</p>
                    <p className={`text-xl font-black ${selectedData.avgGenome >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>{selectedData.avgGenome}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedData.athletes.map((a) => (
                    <Link
                      key={a.id}
                      href={`/athlete/${a.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition"
                    >
                      <div className="w-7 h-7 rounded-full bg-uc-surface flex items-center justify-center text-[10px] font-bold text-uc-cyan">
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
                          {a.name}
                          {a.verified && <CheckCircle2 size={9} className="text-uc-cyan" />}
                        </p>
                        <p className="text-[9px] text-uc-gray-400">{a.school} · {a.qbClass}</p>
                      </div>
                      <span className="text-sm font-bold tabular-nums" style={{ color: a.gaiTierColor }}>{a.gs}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-1">Select a State</h3>
                <p className="text-[11px] text-uc-gray-400">Click a hotspot on the map to view prospects in that state.</p>
              </div>
            )}

            {/* State Rankings */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-4 flex items-center gap-1.5">
                <TrendingUp size={12} /> State Rankings by Genome
              </h3>
              <div className="space-y-2">
                {stateData.map((sd, i) => (
                  <button
                    key={sd.state}
                    onClick={() => setSelectedState(selectedState === sd.state ? null : sd.state)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left ${
                      selectedState === sd.state ? "bg-uc-cyan/10 border border-uc-cyan/20" : "bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`text-sm font-bold w-5 ${
                      i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-uc-gray-400"
                    }`}>{i + 1}</span>
                    <MapPin size={12} className="text-uc-gray-400" />
                    <span className="text-sm font-medium text-white flex-1">{sd.state}</span>
                    <span className="text-[10px] text-uc-gray-400">{sd.athletes.length} QB{sd.athletes.length > 1 ? "s" : ""}</span>
                    <span className={`text-sm font-bold tabular-nums ${sd.avgGenome >= 80 ? "text-uc-green" : "text-uc-cyan"}`}>{sd.avgGenome}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Prospect */}
            {stateData[0] && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-widest text-uc-gray-400 mb-3 flex items-center gap-1.5">
                  <Star size={12} className="text-yellow-400" /> #1 National Prospect
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-sm font-bold text-black">
                    {stateData[0].topAthlete.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{stateData[0].topAthlete.name}</p>
                    <p className="text-[10px] text-uc-gray-400">{stateData[0].topAthlete.school} · {stateData[0].topAthlete.state}</p>
                  </div>
                </div>
                <Link
                  href={`/athlete/${stateData[0].topAthlete.id}`}
                  className="mt-3 flex items-center gap-1.5 text-[10px] text-uc-cyan hover:underline"
                >
                  View Full Profile <ArrowRight size={10} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <p className="text-uc-gray-400 text-sm mb-4">Discover more prospects nationwide</p>
          <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            <Sparkles size={16} /> Discover QBs <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
