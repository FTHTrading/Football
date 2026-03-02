"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function NILPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-uc-gray-400 hover:text-uc-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-3">
            NIL Hub
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Name, Image & Likeness</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            Your verified data powers your NIL potential. Brand deals, 
            collectibles, and marketplace — all connected to your performance.
          </p>
        </motion.div>

        {/* Preview Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Lock size={14} className="text-uc-gray-600" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <DollarSign size={22} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Brand Marketplace</h3>
            <p className="text-sm text-uc-gray-400 mb-4">
              Connect with brands looking for verified high school quarterback ambassadors.
            </p>
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-uc-gray-400">Brand Interest Score</span>
                <span className="text-sm font-bold text-green-400">87/100</span>
              </div>
              <div className="w-full h-1.5 bg-uc-surface rounded-full overflow-hidden">
                <div className="w-[87%] h-full bg-green-400 rounded-full" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Lock size={14} className="text-uc-gray-600" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Digital Collectibles</h3>
            <p className="text-sm text-uc-gray-400 mb-4">
              Drop limited-edition verified cards as digital collectibles. 
              Powered by your verified metrics.
            </p>
            <div className="text-xs text-uc-gray-600 italic">Coming Q3 2026</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Lock size={14} className="text-uc-gray-600" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-uc-cyan/10 flex items-center justify-center mb-4">
              <TrendingUp size={22} className="text-uc-cyan" />
            </div>
            <h3 className="text-xl font-bold mb-2">Engagement Analytics</h3>
            <p className="text-sm text-uc-gray-400 mb-4">
              Track how coaches, scouts, and brands engage with your profile 
              and card shares.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="glass rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-uc-cyan">342</p>
                <p className="text-[9px] text-uc-gray-400">Views</p>
              </div>
              <div className="glass rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-uc-cyan">56</p>
                <p className="text-[9px] text-uc-gray-400">Shares</p>
              </div>
              <div className="glass rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-uc-cyan">12</p>
                <p className="text-[9px] text-uc-gray-400">Saves</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Lock size={14} className="text-uc-gray-600" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-4">
              <Users size={22} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">NIL Valuation</h3>
            <p className="text-sm text-uc-gray-400 mb-4">
              AI-powered NIL valuation based on your metrics, social reach, 
              and recruiting tier.
            </p>
            <div className="glass rounded-lg p-4 text-center">
              <p className="text-[10px] tracking-wider uppercase text-uc-gray-400 mb-1">
                Estimated NIL Value
              </p>
              <p className="text-3xl font-bold gradient-text">$12,500</p>
              <p className="text-[9px] text-uc-gray-400 mt-1">Marketplace potential score</p>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-uc-gray-400 mb-4">
            NIL features unlock when you become verified.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all"
          >
            Get Verified to Unlock
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
