"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Share2,
  Film,
} from "lucide-react";
import SocialGraphic, {
  type GraphicTemplate,
} from "@/components/SocialGraphic";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import { computeGAI } from "@/lib/genome-activation-index";

// ─── Template Options ─────────────────────────────

const TEMPLATES: {
  key: GraphicTemplate;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    key: "commitment",
    label: "Commitment",
    icon: <Trophy size={16} />,
    description: "Announce a college commitment",
  },
  {
    key: "offer",
    label: "Offer",
    icon: <Star size={16} />,
    description: "Showcase a new offer",
  },
  {
    key: "ranking",
    label: "Ranking",
    icon: <TrendingUp size={16} />,
    description: "National or state ranking",
  },
  {
    key: "verified",
    label: "Verified Card",
    icon: <Shield size={16} />,
    description: "Verified prospect badge",
  },
  {
    key: "gameday",
    label: "Game Day",
    icon: <Zap size={16} />,
    description: "Friday night lights hype",
  },
  {
    key: "stat-showcase",
    label: "Stat Showcase",
    icon: <TrendingUp size={16} />,
    description: "Full metric breakdown",
  },
  {
    key: "story",
    label: "IG Story",
    icon: <Film size={16} />,
    description: "Vertical story format",
  },
];

export default function GraphicsPage() {
  const [template, setTemplate] = useState<GraphicTemplate>("verified");
  const [selectedAthleteId, setSelectedAthleteId] = useState("1");
  const [committedTo, setCommittedTo] = useState("University of Texas");
  const [offerFrom, setOfferFrom] = useState("Ohio State University");
  const [rank, setRank] = useState(12);
  const [totalRanked, setTotalRanked] = useState(250);
  const [subtitle, setSubtitle] = useState("");

  const currentAthlete =
    PLACEHOLDER_ATHLETES.find((a) => a.id === selectedAthleteId) ||
    PLACEHOLDER_ATHLETES[0];

  const gaiResult = computeGAI(currentAthlete.metrics);

  const metrics = {
    Velocity: `${currentAthlete.metrics.velocity} mph`,
    Release: `${currentAthlete.metrics.releaseTime}s`,
    Accuracy: `${currentAthlete.metrics.accuracy}%`,
    Mechanics: `${currentAthlete.metrics.mechanics}/100`,
    "Decision Spd": `${currentAthlete.metrics.decisionSpeed}/100`,
    Poise: `${currentAthlete.metrics.poise}/100`,
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4">
            <Share2 size={12} />
            Social Identity
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Shareable Graphics</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Generate commitment announcements, offer graphics, ranking cards,
            and Instagram stories that kids actually want to post.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* ─── Controls ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full lg:w-72 flex flex-col gap-5"
          >
            {/* Athlete Selector */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                Select Athlete
              </label>
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors"
              >
                {PLACEHOLDER_ATHLETES.filter((a) => a.verified).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Selector */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                <Sparkles size={10} className="inline mr-1" />
                Graphic Template
              </label>
              <div className="flex flex-col gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTemplate(t.key)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all ${
                      template === t.key
                        ? "bg-uc-cyan/15 border border-uc-cyan/30"
                        : "bg-uc-surface border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span
                      className={
                        template === t.key
                          ? "text-uc-cyan"
                          : "text-uc-gray-400"
                      }
                    >
                      {t.icon}
                    </span>
                    <div>
                      <span
                        className={`text-xs font-semibold ${template === t.key ? "text-uc-cyan" : "text-white"}`}
                      >
                        {t.label}
                      </span>
                      <p className="text-[10px] text-uc-gray-400">
                        {t.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Fields */}
            {template === "commitment" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                  Committed To
                </label>
                <input
                  type="text"
                  value={committedTo}
                  onChange={(e) => setCommittedTo(e.target.value)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors"
                  placeholder="University name"
                />
              </motion.div>
            )}

            {template === "offer" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                  Offer From
                </label>
                <input
                  type="text"
                  value={offerFrom}
                  onChange={(e) => setOfferFrom(e.target.value)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors"
                  placeholder="University name"
                />
              </motion.div>
            )}

            {template === "ranking" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                  Ranking
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] text-uc-gray-400 block mb-1">
                      Rank
                    </label>
                    <input
                      type="number"
                      value={rank}
                      onChange={(e) => setRank(Number(e.target.value))}
                      className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-uc-cyan/50"
                      min={1}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-uc-gray-400 block mb-1">
                      Of
                    </label>
                    <input
                      type="number"
                      value={totalRanked}
                      onChange={(e) => setTotalRanked(Number(e.target.value))}
                      className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-uc-cyan/50"
                      min={1}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {(template === "gameday" || template === "story") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors"
                  placeholder={
                    template === "gameday"
                      ? "vs. Rival High School"
                      : "Verified Prospect"
                  }
                />
              </motion.div>
            )}

            {/* Info */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs tracking-[0.15em] uppercase text-uc-gray-400 mb-3">
                How It Works
              </h3>
              <ul className="text-xs text-uc-gray-400 space-y-2 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-uc-cyan">1.</span>
                  Pick an athlete
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">2.</span>
                  Choose a graphic template
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">3.</span>
                  Customize details
                </li>
                <li className="flex gap-2">
                  <span className="text-uc-cyan">4.</span>
                  Download as high-res PNG
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ─── Preview ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <SocialGraphic
              template={template}
              athleteName={currentAthlete.name}
              school={currentAthlete.school}
              position="QB"
              committedTo={committedTo}
              offerFrom={offerFrom}
              rank={rank}
              totalRanked={totalRanked}
              rating={currentAthlete.rating}
              metrics={metrics}
              genomeScore={gaiResult.gai}
              subtitle={subtitle}
              verified={currentAthlete.verified}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
