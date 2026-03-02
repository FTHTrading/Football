"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import type { Athlete } from "@/lib/store";
import { DNAStrandDivider } from "@/components/DNAHelix";
import {
  Columns3,
  Plus,
  X,
  GripVertical,
  Dna,
  Star,
  StarOff,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Filter,
  Search,
  Zap,
  Target,
  Shield,
  Clock,
  Eye,
  Activity,
} from "lucide-react";
import { computeGAI } from "@/lib/genome-activation-index";

/* ── Board lane definitions ── */
const DEFAULT_LANES = [
  { id: "watching", label: "Watching", color: "#C0C0C0", description: "On the radar" },
  { id: "evaluating", label: "Evaluating", color: "#00C2FF", description: "Active film review" },
  { id: "targeting", label: "Targeting", color: "#A855F7", description: "Priority prospect" },
  { id: "offering", label: "Offering", color: "#FACC15", description: "Scholarship extended" },
  { id: "committed", label: "Committed", color: "#00FF88", description: "Verbally committed" },
];

type Lane = typeof DEFAULT_LANES[number];

/* ── Prospect Card on the Board ── */
function ProspectCard({
  athlete,
  laneColor,
  starred,
  onToggleStar,
  onRemove,
  onMove,
  lanes,
}: {
  athlete: Athlete;
  laneColor: string;
  starred: boolean;
  onToggleStar: () => void;
  onRemove: () => void;
  onMove: (toLane: string) => void;
  lanes: Lane[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const gai = computeGAI(athlete.metrics);
  const score = gai.gai;

  const metrics = [
    { label: "VEL", value: athlete.metrics.velocity, color: "#00C2FF", icon: Zap },
    { label: "ACC", value: athlete.metrics.accuracy, color: "#00C2FF", icon: Target },
    { label: "MECH", value: athlete.metrics.mechanics, color: "#FACC15", icon: Shield },
    { label: "DEC", value: athlete.metrics.decisionSpeed, color: "#00FF88", icon: Eye },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-xl overflow-hidden group"
    >
      {/* Top stripe */}
      <div className="h-0.5" style={{ backgroundColor: laneColor }} />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-uc-surface border border-white/10 flex items-center justify-center text-xs font-black shrink-0"
            style={{ color: laneColor }}>
            {athlete.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/athlete/${athlete.id}`}
              className="text-xs font-bold hover:text-uc-cyan transition-colors truncate block"
            >
              {athlete.name}
            </Link>
            <p className="text-[8px] text-uc-gray-500 truncate">
              {athlete.position} • {athlete.school} • Class of {athlete.gradYear}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onToggleStar} className="p-1 hover:bg-white/5 rounded transition-colors">
              {starred ? <Star size={10} className="text-yellow-400 fill-yellow-400" /> : <StarOff size={10} className="text-uc-gray-500" />}
            </button>
            <button onClick={onRemove} className="p-1 hover:bg-white/5 rounded transition-colors opacity-0 group-hover:opacity-100">
              <X size={10} className="text-uc-gray-500 hover:text-uc-red" />
            </button>
          </div>
        </div>

        {/* Genome Score */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[7px] font-mono text-uc-gray-500 tracking-wider uppercase">Genome</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${laneColor}, #00FF88)` }}
            />
          </div>
          <span className="text-[10px] font-black font-mono" style={{ color: gai.tierColor }}>{score}</span>
        </div>

        {/* Quick metrics */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[6px] font-mono text-uc-gray-600 uppercase">{m.label}</p>
              <p className="text-[9px] font-bold font-mono" style={{ color: m.color }}>{m.value.toFixed(1)}</p>
            </div>
          ))}
        </div>

        {/* Star rating / offers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-uc-gray-500">{athlete.rating}★</span>
            <span className="text-[7px] text-uc-gray-600">|</span>
            <span className="text-[7px] text-uc-gray-500">{athlete.offers?.length || 0} offers</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMoveMenu(!showMoveMenu)}
              className="text-[7px] text-uc-cyan hover:text-white tracking-wider uppercase font-bold transition-colors flex items-center gap-0.5"
            >
              Move <ChevronDown size={8} />
            </button>
            <AnimatePresence>
              {showMoveMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 bottom-5 z-20 glass rounded-lg border border-white/10 py-1 min-w-[120px]"
                >
                  {lanes.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { onMove(l.id); setShowMoveMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-[9px] hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Board Page ── */
export default function BoardPage() {
  const allAthletes = PLACEHOLDER_ATHLETES;
  const [search, setSearch] = useState("");

  // Board state: mapping of laneId -> athleteId[]
  const [board, setBoard] = useState<Record<string, string[]>>(() => {
    // Seed some athletes into lanes
    const ids = allAthletes.map((a) => a.id);
    return {
      watching: ids.slice(0, 2),
      evaluating: ids.slice(2, 4),
      targeting: ids.slice(4, 5),
      offering: [],
      committed: ids.slice(5, 6),
    };
  });

  const [starred, setStarred] = useState<Set<string>>(new Set());

  // Available athletes not on any board lane
  const usedIds = useMemo(() => new Set(Object.values(board).flat()), [board]);
  const available = allAthletes.filter((a) => !usedIds.has(a.id) && a.name.toLowerCase().includes(search.toLowerCase()));

  // Move athlete between lanes
  const moveAthlete = (athleteId: string, toLaneId: string) => {
    setBoard((prev) => {
      const next = { ...prev };
      // Remove from current lane
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((id) => id !== athleteId);
      }
      // Add to target lane
      next[toLaneId] = [...(next[toLaneId] || []), athleteId];
      return next;
    });
  };

  const removeFromBoard = (athleteId: string) => {
    setBoard((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((id) => id !== athleteId);
      }
      return next;
    });
  };

  const addToBoard = (athleteId: string, laneId: string = "watching") => {
    setBoard((prev) => ({
      ...prev,
      [laneId]: [...(prev[laneId] || []), athleteId],
    }));
  };

  const toggleStar = (athleteId: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(athleteId)) next.delete(athleteId);
      else next.add(athleteId);
      return next;
    });
  };

  const totalOnBoard = Object.values(board).flat().length;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.3em] uppercase text-uc-cyan mb-4">
            <Columns3 size={12} />
            Recruit Board
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text-dna">Prospect Pipeline</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto text-sm">
            Organize and track your quarterback prospects through every stage of the recruiting pipeline.
          </p>
        </motion.div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold">{totalOnBoard} Prospects</span>
            <span className="text-[9px] text-uc-gray-500">on board</span>
          </div>
          {DEFAULT_LANES.map((lane) => (
            <div key={lane.id} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lane.color }} />
              <span className="text-[9px] text-uc-gray-400">{lane.label}</span>
              <span className="text-[9px] font-bold font-mono" style={{ color: lane.color }}>
                {board[lane.id]?.length || 0}
              </span>
            </div>
          ))}
          {starred.size > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[9px] text-yellow-400">{starred.size} starred</span>
            </div>
          )}
        </motion.div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {DEFAULT_LANES.map((lane, laneIdx) => {
            const laneAthletes = (board[lane.id] || [])
              .map((id) => allAthletes.find((a) => a.id === id))
              .filter(Boolean) as Athlete[];

            return (
              <motion.div
                key={lane.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * laneIdx }}
                className="flex flex-col"
              >
                {/* Lane header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lane.color }} />
                  <h3 className="text-xs font-bold uppercase tracking-wider">{lane.label}</h3>
                  <span className="text-[9px] font-mono text-uc-gray-500 ml-auto">{laneAthletes.length}</span>
                </div>
                <p className="text-[8px] text-uc-gray-600 px-1 mb-3">{lane.description}</p>

                {/* Cards */}
                <div className="flex-1 space-y-3 min-h-[200px] p-2 rounded-xl border border-white/[0.03] bg-white/[0.01]">
                  <AnimatePresence mode="popLayout">
                    {laneAthletes.map((athlete) => (
                      <ProspectCard
                        key={athlete.id}
                        athlete={athlete}
                        laneColor={lane.color}
                        starred={starred.has(athlete.id)}
                        onToggleStar={() => toggleStar(athlete.id)}
                        onRemove={() => removeFromBoard(athlete.id)}
                        onMove={(toLane) => moveAthlete(athlete.id, toLane)}
                        lanes={DEFAULT_LANES}
                      />
                    ))}
                  </AnimatePresence>

                  {laneAthletes.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-30">
                      <p className="text-[9px] text-uc-gray-500 text-center">
                        Drop prospects<br />into this lane
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Available Athletes (not on board) */}
        {available.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 font-bold mb-4 flex items-center gap-2">
              <Plus size={12} /> Available Prospects
            </h3>
            <div className="relative mb-4">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-500" />
              <input
                type="text"
                placeholder="Search athletes to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-uc-surface border border-white/10 rounded-lg pl-8 pr-4 py-2 text-xs text-white placeholder-uc-gray-600 focus:outline-none focus:border-uc-cyan/50 transition-colors"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {available.map((athlete) => {
                const score = computeGAI(athlete.metrics).gai;
                return (
                  <div key={athlete.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-uc-cyan/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-uc-surface flex items-center justify-center text-xs font-bold text-uc-gray-400">
                      {athlete.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{athlete.name}</p>
                      <p className="text-[8px] text-uc-gray-500">{athlete.position} • Score: {score}</p>
                    </div>
                    <button
                      onClick={() => addToBoard(athlete.id)}
                      className="px-3 py-1.5 rounded-lg bg-uc-cyan/10 text-uc-cyan text-[9px] font-bold tracking-wider uppercase hover:bg-uc-cyan/20 transition-colors flex items-center gap-1"
                    >
                      <Plus size={10} /> Add
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <DNAStrandDivider className="my-10 opacity-30" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-uc-gray-400 text-sm mb-4">
            Need deeper evaluation? Open the scout lab.
          </p>
          <Link
            href="/scout"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Scout Lab <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
