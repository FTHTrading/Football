"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Download, Dna, Shield, Lock, AlertTriangle,
  Key, Server, BarChart3, Eye, FileText, CheckCircle2,
  Zap, Database, Globe
} from "lucide-react";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all"
    >
      <Download size={14} /> Download PDF
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 print-page-break">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-uc-gray-400">{subtitle}</p>
      <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent mt-4" />
    </div>
  );
}

function StatusBadge({ status, label }: { status: "active" | "ready" | "planned"; label: string }) {
  const colors = {
    active: "bg-uc-green/10 text-uc-green border-uc-green/20",
    ready: "bg-uc-cyan/10 text-uc-cyan border-uc-cyan/20",
    planned: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${colors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-uc-green" : status === "ready" ? "bg-uc-cyan" : "bg-yellow-400"}`} />
      {label}
    </span>
  );
}

const RATE_LIMITS = [
  { tier: "Standard", limit: "10 req / 10 sec", scope: "General API routes", status: "active" as const },
  { tier: "Strict", limit: "5 req / 60 sec", scope: "Auth + payment routes", status: "active" as const },
  { tier: "Webhook", limit: "Stripe-signed only", scope: "Webhook endpoint", status: "active" as const },
];

const SECURITY_LAYERS = [
  {
    icon: Lock,
    title: "Middleware Enforcement",
    desc: "Next.js middleware intercepts all requests to /admin/* and /dashboard/* routes. JWT validation occurs before any page or API logic executes.",
    status: "active" as const,
    details: ["Protects /admin/* (ADMIN role required)", "Protects /dashboard/* (ATHLETE role required)", "Redirects unauthorized users to /login", "Session validation on every request"],
  },
  {
    icon: Key,
    title: "Authentication (NextAuth.js)",
    desc: "JWT-based auth with credentials provider. Passwords hashed with bcrypt. Role-based access control across three tiers.",
    status: "active" as const,
    details: ["bcrypt password hashing", "JWT session strategy (no database sessions)", "Role enum: ATHLETE / COACH / ADMIN", "Configurable session expiry"],
  },
  {
    icon: Shield,
    title: "Stripe Webhook Verification",
    desc: "All incoming Stripe webhook events are verified against the signing secret using HMAC. Raw body parsing ensures signature integrity.",
    status: "active" as const,
    details: ["HMAC signature validation", "Raw body parsing (not JSON-parsed)", "Event type whitelist", "Idempotent event handling"],
  },
  {
    icon: FileText,
    title: "Input Validation (Zod)",
    desc: "Every critical POST endpoint validates request bodies against Zod schemas at runtime, ensuring type-safe data ingestion.",
    status: "active" as const,
    details: ["Schema validation on checkout creation", "Schema validation on athlete data", "Type-safe error responses", "Runtime type assertion"],
  },
  {
    icon: Server,
    title: "Rate Limiting (Upstash Redis)",
    desc: "Token-bucket rate limiting via Upstash Redis. Two tiers: standard for general routes, strict for auth and payment flows.",
    status: "active" as const,
    details: ["Standard: 10 requests / 10 seconds", "Strict: 5 requests / 60 seconds", "IP-based identification", "429 response with clear headers"],
  },
  {
    icon: Eye,
    title: "Structured Logging (Pino)",
    desc: "Domain-specific structured loggers provide audit-ready, JSON-formatted logs across all critical system boundaries.",
    status: "active" as const,
    details: ["authLogger — login attempts, failures", "stripeLogger — payment lifecycle", "adminLogger — verification changes", "analyticsLogger — event tracking"],
  },
  {
    icon: AlertTriangle,
    title: "Environment Validation",
    desc: "Fail-fast startup validation ensures all required environment variables are present and correctly typed before the application accepts traffic.",
    status: "active" as const,
    details: ["DATABASE_URL validation", "STRIPE keys validation", "NEXTAUTH_SECRET validation", "Graceful error messages on missing vars"],
  },
  {
    icon: Database,
    title: "Database Security",
    desc: "Connection pooling via Prisma with parameterized queries. No raw SQL injection surfaces. Schema-defined constraints.",
    status: "active" as const,
    details: ["Parameterized queries only (Prisma ORM)", "No raw SQL exposed", "Unique constraints on email, athlete IDs", "Relational integrity via foreign keys"],
  },
];

export default function SecurityHardeningDoc() {
  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="doc-container">
        {/* Nav */}
        <div className="flex items-center justify-between mb-12 no-print">
          <Link href="/docs" className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to Docs
          </Link>
          <PrintButton />
        </div>

        {/* Cover */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-red-500/20 text-[10px] tracking-[0.4em] uppercase text-red-400 mb-6">
            <Shield size={12} /> Security Report
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Security & <span className="text-red-400">Hardening</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto mb-2">
            Production-grade security implementation across authentication, authorization, payment processing, input validation, rate limiting, and observability.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">March 2026 · Confidential</p>
        </motion.div>

        {/* Executive Summary */}
        <SectionHeader title="Executive Summary" subtitle="Security posture at a glance" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Security Layers", value: "8", color: "text-red-400" },
              { label: "Rate Limit Tiers", value: "3", color: "text-uc-cyan" },
              { label: "Domain Loggers", value: "4", color: "text-uc-green" },
              { label: "Validation", value: "Zod", color: "text-purple-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-uc-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-uc-gray-300 leading-relaxed">
            Under Center implements defense-in-depth across 8 security layers. Every API route is rate-limited, every payment event is signature-verified, every admin action is role-checked, and every critical input is schema-validated. The system produces structured, audit-ready logs via domain-specific Pino loggers.
          </p>
        </div>

        {/* Rate Limiting */}
        <SectionHeader title="Rate Limiting Configuration" subtitle="Token-bucket limits via Upstash Redis" />
        <div className="glass rounded-2xl overflow-hidden mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Tier</th>
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Limit</th>
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Scope</th>
                <th className="text-left px-6 py-3 text-[10px] text-uc-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {RATE_LIMITS.map((r) => (
                <tr key={r.tier} className="border-b border-white/[0.03]">
                  <td className="px-6 py-3 font-bold text-white">{r.tier}</td>
                  <td className="px-6 py-3 font-mono text-uc-cyan">{r.limit}</td>
                  <td className="px-6 py-3 text-uc-gray-300">{r.scope}</td>
                  <td className="px-6 py-3"><StatusBadge status={r.status} label="Active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Layers */}
        <SectionHeader title="Security Layers" subtitle="8 layers of defense-in-depth" />
        <div className="space-y-4 mb-12">
          {SECURITY_LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-bold text-white">{layer.title}</h3>
                      <StatusBadge status={layer.status} label="Active" />
                    </div>
                    <p className="text-xs text-uc-gray-400 leading-relaxed mb-3">{layer.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-1.5">
                      {layer.details.map((d) => (
                        <div key={d} className="flex items-start gap-1.5 text-[11px] text-uc-gray-300">
                          <CheckCircle2 size={10} className="text-uc-green/60 mt-0.5 shrink-0" />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Auth Flow */}
        <SectionHeader title="Authentication Flow" subtitle="JWT-based auth with role-based access control" />
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <pre className="text-xs text-uc-gray-300 font-mono leading-relaxed overflow-x-auto">
{`User Login Request
│
├── Credentials Provider (email + password)
│   ├── bcrypt.compare(password, hash)
│   ├── Failure → 401 + authLogger.warn()
│   └── Success → JWT issued
│       ├── payload: { id, email, role }
│       └── Set-Cookie: next-auth.session-token
│
├── Protected Route Access
│   ├── middleware.ts intercepts request
│   ├── JWT decoded + validated
│   ├── Role check (ADMIN / ATHLETE / COACH)
│   ├── Unauthorized → redirect /login
│   └── Authorized → continue to page
│
└── Stripe Webhook
    ├── Raw body received
    ├── stripe.webhooks.constructEvent(body, sig, secret)
    ├── Invalid signature → 400 + stripeLogger.error()
    └── Valid → process event + stripeLogger.info()`}
          </pre>
        </div>

        {/* Compliance Ready */}
        <SectionHeader title="Compliance Readiness" subtitle="Architecture supports future compliance requirements" />
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "COPPA Awareness", desc: "Minor athlete data handling architecture supports parental consent flows", status: "ready" as const },
              { label: "Data Portability", desc: "Prisma schema supports full data export per athlete", status: "ready" as const },
              { label: "Audit Trail", desc: "Structured logging captures all state-changing operations", status: "active" as const },
              { label: "Access Control", desc: "Role-based middleware enforces least-privilege access", status: "active" as const },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="mt-1">
                  <StatusBadge status={item.status} label={item.status === "active" ? "Active" : "Ready"} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-uc-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8 mt-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">Security & Production Hardening Report · v1.0 · March 2026</p>
          <p className="text-[10px] text-uc-gray-600">Confidential — Under Center LLC</p>
        </div>
      </div>
    </main>
  );
}
