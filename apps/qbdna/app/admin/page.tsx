"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import { formatVelocity, getMechanicsGrade } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldX,
  Users,
  BarChart3,
  Eye,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [athletes, setAthletes] = useState(
    PLACEHOLDER_ATHLETES.map((a) => ({ ...a }))
  );

  const toggleVerification = (id: string) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, verified: !a.verified } : a))
    );
  };

  const verifiedCount = athletes.filter((a) => a.verified).length;
  const pendingCount = athletes.filter((a) => !a.verified).length;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-2">
            Admin Panel
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Verification Control</span>
          </h1>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total QBs", value: athletes.length, color: "#00C2FF" },
            { icon: ShieldCheck, label: "Verified", value: verifiedCount, color: "#00FF88" },
            { icon: ShieldX, label: "Pending", value: pendingCount, color: "#FFD700" },
            { icon: Eye, label: "Total Views", value: "2.4K", color: "#C0C0C0" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5"
            >
              <stat.icon size={18} style={{ color: stat.color }} className="mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[10px] tracking-wider uppercase text-uc-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Athletes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_80px_80px_80px_80px_120px] gap-4 px-6 py-3 border-b border-white/5 text-[10px] tracking-[0.2em] uppercase text-uc-gray-400">
            <span>Athlete</span>
            <span>Class</span>
            <span>Velocity</span>
            <span>Grade</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {athletes.map((athlete, i) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.03 }}
              className="grid grid-cols-[1fr_80px_80px_80px_80px_120px] gap-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors"
            >
              {/* Name */}
              <div>
                <p className="font-semibold text-sm">{athlete.name}</p>
                <p className="text-xs text-uc-gray-400">{athlete.school}</p>
              </div>

              {/* Class */}
              <span className="text-sm font-mono">{athlete.gradYear}</span>

              {/* Velocity */}
              <span className="text-sm font-mono text-uc-cyan">
                {formatVelocity(athlete.metrics.velocity)}
              </span>

              {/* Grade */}
              <span className="text-sm font-mono">
                {getMechanicsGrade(athlete.metrics.mechanics)}
              </span>

              {/* Status */}
              <div>
                {athlete.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold tracking-wider uppercase">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[10px] font-bold tracking-wider uppercase">
                    Pending
                  </span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => toggleVerification(athlete.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                  athlete.verified
                    ? "bg-uc-red/10 text-uc-red border border-uc-red/20 hover:bg-uc-red/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                }`}
              >
                {athlete.verified ? "Revoke" : "Approve"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
