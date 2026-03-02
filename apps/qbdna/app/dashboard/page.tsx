"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  Film,
  CreditCard,
  BarChart3,
  Share2,
  ShieldCheck,
  ChevronRight,
  Bell,
} from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";

/* Placeholder user state */
const user = {
  name: "Jaxon Smith",
  email: "jaxon@email.com",
  role: "ATHLETE" as const,
  verified: false,
  profileComplete: 72,
};

const dashboardCards = [
  {
    icon: Upload,
    title: "Upload Film",
    desc: "Add your latest game or practice film for review",
    href: "#",
    color: "#00C2FF",
  },
  {
    icon: BarChart3,
    title: "View Metrics",
    desc: "See your verified performance data and percentiles",
    href: "/athlete/1",
    color: "#00FF88",
  },
  {
    icon: Share2,
    title: "Share Card",
    desc: "Generate and share your verified quarterback card",
    href: "/card-generator?athlete=1",
    color: "#FFD700",
  },
  {
    icon: Film,
    title: "Highlight Reel",
    desc: "AI-generated highlight clips from your film",
    href: "#",
    color: "#C0C0C0",
    comingSoon: true,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-2">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, <span className="gradient-text">{user.name}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-lg glass border border-white/5 hover:border-white/10 transition-colors">
              <Bell size={18} className="text-uc-gray-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-uc-red rounded-full" />
            </button>
            {user.verified ? (
              <VerifiedBadge size="md" />
            ) : (
              <Link
                href="#verify"
                className="px-5 py-2 rounded-lg bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,194,255,0.3)] transition-all"
              >
                Get Verified
              </Link>
            )}
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Profile Completion</h2>
            <span className="text-sm font-bold text-uc-cyan font-mono">{user.profileComplete}%</span>
          </div>
          <div className="w-full h-2.5 bg-uc-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${user.profileComplete}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-uc-cyan/60 to-uc-cyan"
              style={{ boxShadow: "0 0 12px rgba(0,194,255,0.3)" }}
            />
          </div>
          <p className="text-xs text-uc-gray-400 mt-2">
            Complete your profile to increase visibility to college coaches.
          </p>
        </motion.div>

        {/* Verification Status */}
        {!user.verified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            id="verify"
            className="glass rounded-xl p-6 mb-8 border border-uc-cyan/10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-uc-cyan/10 flex items-center justify-center">
                  <ShieldCheck size={22} className="text-uc-cyan" />
                </div>
                <div>
                  <h3 className="font-bold">Get Verified</h3>
                  <p className="text-sm text-uc-gray-400">
                    Complete your Wilson QBX session to unlock verified status
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="glass rounded-lg px-4 py-2 text-center">
                  <p className="text-[10px] tracking-wider uppercase text-uc-gray-400">Status</p>
                  <p className="text-sm font-bold text-yellow-400">PENDING</p>
                </div>
                <Link
                  href="#"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 text-sm font-semibold tracking-wider uppercase transition-all"
                >
                  <CreditCard size={14} />
                  Pay & Schedule
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {dashboardCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link href={card.href}>
                <div className="glass rounded-xl p-5 group hover:border-white/10 border border-transparent transition-all duration-250 cursor-pointer hover:shadow-[0_0_20px_rgba(0,194,255,0.08)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${card.color}15` }}
                      >
                        <card.icon size={18} style={{ color: card.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-uc-cyan transition-colors flex items-center gap-2">
                          {card.title}
                          {card.comingSoon && (
                            <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-uc-gray-400">
                              Soon
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-uc-gray-400 mt-1">{card.desc}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-uc-gray-600 group-hover:text-uc-cyan group-hover:translate-x-1 transition-all mt-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* NIL Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-8 text-center border border-white/5"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-3">Coming Soon</p>
          <h2 className="text-2xl font-bold mb-2">NIL Marketplace</h2>
          <p className="text-sm text-uc-gray-400 max-w-md mx-auto mb-6">
            Brand deals, digital collectibles, and NIL valuation — all powered by your verified data.
          </p>
          <Link
            href="/dashboard/nil"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg glass border border-white/10 text-sm text-uc-gray-400 hover:text-uc-cyan hover:border-uc-cyan/20 transition-all"
          >
            Preview NIL Hub
            <ChevronRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
