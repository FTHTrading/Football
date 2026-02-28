"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Dynamic import to avoid SSR issues
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-uc-cyan" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase gradient-text">
              Under Center
            </span>
          </Link>
          <p className="text-xs tracking-[0.3em] uppercase text-uc-gray-400">
            Athlete Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2.5 rounded-lg bg-uc-red/10 border border-uc-red/20 text-uc-red text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-uc-gray-600 focus:border-uc-cyan/50 focus:outline-none focus:ring-1 focus:ring-uc-cyan/20 transition-colors"
              placeholder="qb1@undercenter.com"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-uc-gray-600 focus:border-uc-cyan/50 focus:outline-none focus:ring-1 focus:ring-uc-cyan/20 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-uc-cyan text-uc-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(0,194,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-uc-black/30 border-t-uc-black rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>

          <p className="text-center text-xs text-uc-gray-500">
            Demo: admin@undercenter.com / admin123
          </p>
        </form>
      </motion.div>
    </main>
  );
}
