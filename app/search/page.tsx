"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import VerifiedBadge from "@/components/VerifiedBadge";
import StarRating from "@/components/StarRating";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react";
import { formatVelocity } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [gradYear, setGradYear] = useState<string>("");
  const [velocityMin, setVelocityMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return PLACEHOLDER_ATHLETES.filter((a) => {
      if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (verifiedOnly && !a.verified) return false;
      if (gradYear && a.gradYear !== parseInt(gradYear)) return false;
      if (velocityMin && a.metrics.velocity < velocityMin) return false;
      return true;
    });
  }, [query, verifiedOnly, gradYear, velocityMin]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-3">
            Discover
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Verified QB Index</span>
          </h1>
          <p className="text-uc-gray-400">
            Filter and discover verified quarterbacks by metrics, class, and state.
          </p>
        </motion.div>

        {/* Search + Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-8"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-uc-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full bg-uc-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-uc-gray-600 focus:outline-none focus:border-uc-cyan/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                showFilters
                  ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                  : "bg-uc-surface text-uc-gray-400 border border-white/10 hover:border-white/20"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5"
            >
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-uc-gray-400 block mb-1.5">
                  Grad Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-uc-cyan/50"
                >
                  <option value="">All</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-uc-gray-400 block mb-1.5">
                  Min Velocity
                </label>
                <input
                  type="number"
                  value={velocityMin || ""}
                  onChange={(e) => setVelocityMin(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-uc-cyan/50"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-uc-surface accent-uc-cyan"
                  />
                  <span className="text-sm text-uc-gray-400">Verified Only</span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setQuery("");
                    setVerifiedOnly(false);
                    setGradYear("");
                    setVelocityMin(0);
                  }}
                  className="text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <p className="text-xs text-uc-gray-400 mb-4">
          {filtered.length} quarterback{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((athlete, i) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/athlete/${athlete.id}`}>
                <div className="glass rounded-xl p-5 hover:border-uc-cyan/20 border border-transparent transition-all duration-250 group cursor-pointer hover:shadow-[0_0_20px_rgba(0,194,255,0.1)]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-uc-cyan transition-colors">
                        {athlete.name}
                      </h3>
                      <p className="text-xs text-uc-gray-400">
                        {athlete.qbClass} &middot; {athlete.school}
                      </p>
                    </div>
                    {athlete.verified && <VerifiedBadge size="sm" />}
                  </div>

                  <StarRating rating={athlete.rating} />

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-uc-gray-400">Velocity</p>
                      <p className="text-sm font-bold font-mono text-uc-cyan">
                        {formatVelocity(athlete.metrics.velocity)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-uc-gray-400">Class</p>
                      <p className="text-sm font-bold">{athlete.gradYear}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-uc-gray-400">State</p>
                      <p className="text-sm font-bold">{athlete.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-4 text-xs text-uc-gray-400 group-hover:text-uc-cyan transition-colors">
                    View Profile
                    <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-uc-gray-400 text-lg">No quarterbacks match your filters.</p>
            <button
              onClick={() => {
                setQuery("");
                setVerifiedOnly(false);
                setGradYear("");
                setVelocityMin(0);
              }}
              className="mt-4 text-uc-cyan text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
