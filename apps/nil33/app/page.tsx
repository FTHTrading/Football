"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  ChevronRight,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Search,
  FileText,
  Scale,
  Trophy,
  Target,
  Layers,
  Database,
  Bot,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────── DATA ─────────────────────────── */

const SPORTS = [
  { name: "Football", icon: "🏈", athletes: "13,400+", deals: "4,200+", color: "#00ff88" },
  { name: "Basketball", icon: "🏀", athletes: "11,200+", deals: "5,800+", color: "#00d4ff" },
  { name: "Baseball", icon: "⚾", athletes: "8,600+", deals: "2,100+", color: "#f59e0b" },
  { name: "Soccer", icon: "⚽", athletes: "9,800+", deals: "1,900+", color: "#a855f7" },
  { name: "Softball", icon: "🥎", athletes: "6,400+", deals: "1,200+", color: "#f97316" },
  { name: "Volleyball", icon: "🏐", athletes: "7,100+", deals: "1,600+", color: "#ef4444" },
  { name: "Track & Field", icon: "🏃", athletes: "14,200+", deals: "800+", color: "#3b82f6" },
  { name: "Swimming", icon: "🏊", athletes: "5,300+", deals: "700+", color: "#06b6d4" },
  { name: "Golf", icon: "⛳", athletes: "3,100+", deals: "900+", color: "#10b981" },
  { name: "Tennis", icon: "🎾", athletes: "2,800+", deals: "600+", color: "#8b5cf6" },
  { name: "Lacrosse", icon: "🥍", athletes: "4,500+", deals: "500+", color: "#ec4899" },
  { name: "Hockey", icon: "🏒", athletes: "3,900+", deals: "400+", color: "#6366f1" },
  { name: "Wrestling", icon: "🤼", athletes: "5,700+", deals: "350+", color: "#d97706" },
  { name: "Gymnastics", icon: "🤸", athletes: "2,200+", deals: "1,100+", color: "#e11d48" },
];

const LIVE_DEALS = [
  { athlete: "Marcus Thompson", sport: "Basketball", school: "Duke", brand: "Nike", value: "$285,000", type: "Endorsement", date: "2h ago" },
  { athlete: "Sarah Chen", sport: "Gymnastics", school: "UCLA", brand: "Gatorade", value: "$190,000", type: "Brand Ambassador", date: "4h ago" },
  { athlete: "Jaylen Williams", sport: "Football", school: "Ohio State", brand: "Beats by Dre", value: "$340,000", type: "NIL Deal", date: "6h ago" },
  { athlete: "Alyssa Rodriguez", sport: "Softball", school: "Oklahoma", brand: "Under Armour", value: "$125,000", type: "Endorsement", date: "8h ago" },
  { athlete: "Tyler Brooks", sport: "Baseball", school: "Vanderbilt", brand: "New Balance", value: "$95,000", type: "NIL Deal", date: "12h ago" },
  { athlete: "Emma Wright", sport: "Volleyball", school: "Nebraska", brand: "Adidas", value: "$110,000", type: "Brand Ambassador", date: "1d ago" },
  { athlete: "Deshawn Harris", sport: "Track & Field", school: "LSU", brand: "Puma", value: "$78,000", type: "Endorsement", date: "1d ago" },
  { athlete: "Olivia Park", sport: "Tennis", school: "Stanford", brand: "Wilson", value: "$145,000", type: "NIL Deal", date: "2d ago" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Valuation",
    description: "Multi-model AI engine computes real-time athlete valuations using performance data, social reach, brand affinity, and market signals.",
    color: "#a855f7",
  },
  {
    icon: Globe,
    title: "National Deal Tracker",
    description: "Live feed of NIL deals across every NCAA sport. Scraped, verified, and indexed in real time from public filings, social posts, and brand announcements.",
    color: "#00d4ff",
  },
  {
    icon: Shield,
    title: "Compliance Engine",
    description: "50-state compliance mapping with institution-specific rule overlays. Automated eligibility checks before any deal is executed.",
    color: "#00ff88",
  },
  {
    icon: Scale,
    title: "Agreement Infrastructure",
    description: "Smart contract templates, version tracking, counterparty management, and audit trails for every NIL transaction.",
    color: "#f59e0b",
  },
  {
    icon: Bot,
    title: "Agentic Intelligence",
    description: "Autonomous AI agents monitor deal flow, flag compliance risks, identify valuation opportunities, and generate market reports.",
    color: "#ef4444",
  },
  {
    icon: Database,
    title: "RAG Knowledge Base",
    description: "Retrieval-augmented generation over NCAA bylaws, state legislation, institutional policies, and historical deal data.",
    color: "#3b82f6",
  },
];

const STATS = [
  { label: "Sports Covered", value: "14", suffix: "+" },
  { label: "Active Athletes", value: "97,000", suffix: "+" },
  { label: "NIL Deals Tracked", value: "21,000", suffix: "+" },
  { label: "States Mapped", value: "50", suffix: "" },
  { label: "Institutions", value: "1,100", suffix: "+" },
  { label: "AI Models Active", value: "6", suffix: "" },
];

const VERTICALS = [
  {
    name: "QB DNA",
    sport: "Football — Quarterback",
    domain: "qbdna.nil33.com",
    description: "Verified quarterback identity system with 8-input QB Index, 6-gene GAI, and position-specific NIL valuation. The original Under Center platform.",
    status: "Live",
    color: "#00ff88",
  },
  {
    name: "Court IQ",
    sport: "Basketball",
    domain: "courtiq.nil33.com",
    description: "Basketball analytics with shot charts, player efficiency ratings, combine metrics, and basketball-specific NIL deal intelligence.",
    status: "Coming Soon",
    color: "#00d4ff",
  },
  {
    name: "Diamond Edge",
    sport: "Baseball / Softball",
    domain: "diamond.nil33.com",
    description: "Pitching velocity, exit velocity, sprint speed, and defensive metrics. Covers both baseball and softball with shared analytics.",
    status: "Coming Soon",
    color: "#f59e0b",
  },
  {
    name: "Pitch Control",
    sport: "Soccer",
    domain: "pitch.nil33.com",
    description: "Expected goals, pass completion mapping, sprint data, and positional heat maps. Global scouting integration.",
    status: "Coming Soon",
    color: "#a855f7",
  },
];

/* ────────────────────────── COMPONENTS ─────────────────────── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-nil-border bg-nil-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nil-green/10 border border-nil-green/20">
            <Zap className="h-5 w-5 text-nil-green" />
          </div>
          <span className="text-xl font-bold tracking-tight text-nil-white">
            NIL<span className="text-nil-green">33</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#sports" className="text-nil-muted hover:text-nil-white transition-colors">Sports</a>
          <a href="#deals" className="text-nil-muted hover:text-nil-white transition-colors">Live Deals</a>
          <a href="#intelligence" className="text-nil-muted hover:text-nil-white transition-colors">Intelligence</a>
          <a href="#verticals" className="text-nil-muted hover:text-nil-white transition-colors">Verticals</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://qbdna.nil33.com" className="hidden sm:block rounded-lg border border-nil-border px-4 py-2 text-sm text-nil-muted hover:text-nil-white hover:border-nil-green/50 transition-all">
            QB DNA
          </a>
          <button className="rounded-lg bg-nil-green px-5 py-2 text-sm font-semibold text-nil-black hover:bg-nil-green/90 transition-colors">
            Get Access
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-nil-black via-transparent to-nil-black" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-nil-green/20 bg-nil-green/5 px-4 py-2 text-sm text-nil-green">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nil-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-nil-green" />
          </span>
          Live — Tracking {STATS[2].value}+ NIL deals across {STATS[0].value}+ sports
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
          <span className="text-nil-white">THE ATHLETE</span>
          <br />
          <span className="bg-gradient-to-r from-nil-green via-nil-cyan to-nil-purple bg-clip-text text-transparent animate-gradient">
            INTELLIGENCE
          </span>
          <br />
          <span className="text-nil-white">PLATFORM</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-nil-muted leading-relaxed mb-10">
          AI-powered NIL valuations, national deal tracking, compliance intelligence, and verified athlete analytics.{" "}
          <span className="text-nil-white">Every sport. Every state. Real time.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group flex items-center gap-2 rounded-xl bg-nil-green px-8 py-4 text-base font-bold text-nil-black hover:bg-nil-green/90 transition-all">
            Explore Live Deals
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-nil-border px-8 py-4 text-base font-semibold text-nil-white hover:border-nil-green/50 transition-all">
            <Brain className="h-5 w-5 text-nil-purple" />
            Try AI Valuation
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-nil-border bg-nil-dark/50 p-4">
              <div className="text-2xl font-black text-nil-white">
                {stat.value}
                <span className="text-nil-green">{stat.suffix}</span>
              </div>
              <div className="text-xs text-nil-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportsGrid() {
  return (
    <section id="sports" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">All Sports Coverage</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            14 Sports. One Platform.
          </h2>
          <p className="text-nil-muted text-lg max-w-2xl mx-auto">
            From football to gymnastics — every NCAA sport with active NIL markets, tracked and analyzed in real time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {SPORTS.map((sport) => (
            <div
              key={sport.name}
              className="group rounded-xl border border-nil-border bg-nil-dark/50 p-4 hover:border-nil-green/30 hover:bg-nil-gray/50 transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3">{sport.icon}</div>
              <div className="text-sm font-bold text-nil-white mb-2">{sport.name}</div>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-nil-muted">
                  <span className="text-nil-text">{sport.athletes}</span> athletes
                </div>
                <div className="text-xs text-nil-muted">
                  <span style={{ color: sport.color }}>{sport.deals}</span> deals
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDeals() {
  return (
    <section id="deals" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <p className="text-nil-cyan text-sm font-semibold tracking-widest uppercase mb-3">National Deal Feed</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white">
              Live NIL Deals
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-nil-green">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nil-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-nil-green" />
            </span>
            Updating in real time
          </div>
        </div>

        <div className="grid gap-3">
          {LIVE_DEALS.map((deal, i) => (
            <div
              key={i}
              className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-nil-border bg-nil-dark/50 px-6 py-4 hover:border-nil-green/20 hover:bg-nil-gray/30 transition-all"
            >
              <div className="col-span-3 sm:col-span-3">
                <div className="text-sm font-bold text-nil-white">{deal.athlete}</div>
                <div className="text-xs text-nil-muted">{deal.sport} · {deal.school}</div>
              </div>
              <div className="col-span-2 hidden sm:block">
                <div className="text-sm text-nil-text">{deal.brand}</div>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <span className="inline-flex items-center rounded-full bg-nil-green/10 px-3 py-1 text-xs font-medium text-nil-green">
                  {deal.type}
                </span>
              </div>
              <div className="col-span-3 sm:col-span-3 text-right">
                <div className="text-lg font-black text-nil-white">{deal.value}</div>
                <div className="text-xs text-nil-muted">{deal.date}</div>
              </div>
              <div className="col-span-3 sm:col-span-2 flex justify-end">
                <ChevronRight className="h-4 w-4 text-nil-muted group-hover:text-nil-green transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 rounded-xl border border-nil-border px-6 py-3 text-sm font-semibold text-nil-white hover:border-nil-cyan/50 transition-all">
            <Search className="h-4 w-4 text-nil-cyan" />
            Search All Deals
          </button>
        </div>
      </div>
    </section>
  );
}

function IntelligenceSection() {
  return (
    <section id="intelligence" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-purple text-sm font-semibold tracking-widest uppercase mb-3">AI + Agentic Architecture</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            Intelligence Layer
          </h2>
          <p className="text-nil-muted text-lg max-w-2xl mx-auto">
            Multi-provider AI, autonomous agents, retrieval-augmented generation, and real-time scraping — all built into the platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-nil-border bg-nil-dark/50 p-8 hover:border-nil-green/20 transition-all"
            >
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${feature.color}10`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-bold text-nil-white mb-3">{feature.title}</h3>
              <p className="text-sm text-nil-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-16 rounded-2xl border border-nil-border bg-nil-dark/50 p-8">
          <h3 className="text-lg font-bold text-nil-white mb-6">System Architecture</h3>
          <div className="grid sm:grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-nil-border bg-nil-gray/50 p-6">
              <Sparkles className="h-8 w-8 text-nil-purple mx-auto mb-3" />
              <div className="text-sm font-bold text-nil-white mb-1">Multi-Provider AI</div>
              <div className="text-xs text-nil-muted">OpenAI · Claude · Gemini</div>
            </div>
            <div className="rounded-xl border border-nil-border bg-nil-gray/50 p-6">
              <Bot className="h-8 w-8 text-nil-green mx-auto mb-3" />
              <div className="text-sm font-bold text-nil-white mb-1">Agentic Framework</div>
              <div className="text-xs text-nil-muted">MCP · Tool Use · Chains</div>
            </div>
            <div className="rounded-xl border border-nil-border bg-nil-gray/50 p-6">
              <Database className="h-8 w-8 text-nil-cyan mx-auto mb-3" />
              <div className="text-sm font-bold text-nil-white mb-1">RAG Pipeline</div>
              <div className="text-xs text-nil-muted">Embeddings · Vector DB</div>
            </div>
            <div className="rounded-xl border border-nil-border bg-nil-gray/50 p-6">
              <Globe className="h-8 w-8 text-nil-orange mx-auto mb-3" />
              <div className="text-sm font-bold text-nil-white mb-1">Live Scraping</div>
              <div className="text-xs text-nil-muted">Deals · Social · News</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Verticals() {
  return (
    <section id="verticals" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-gold text-sm font-semibold tracking-widest uppercase mb-3">Sport-Specific Platforms</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            Verticals
          </h2>
          <p className="text-nil-muted text-lg max-w-2xl mx-auto">
            Each sport gets a dedicated subdomain with position-specific analytics, metrics, and NIL intelligence tailored to that discipline.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {VERTICALS.map((v) => (
            <div
              key={v.name}
              className="group rounded-2xl border border-nil-border bg-nil-dark/50 p-8 hover:border-nil-green/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-nil-white">{v.name}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    v.status === "Live"
                      ? "bg-nil-green/10 text-nil-green border border-nil-green/20"
                      : "bg-nil-border text-nil-muted"
                  }`}
                >
                  {v.status}
                </span>
              </div>
              <div className="text-sm text-nil-cyan mb-1 font-mono">{v.domain}</div>
              <div className="text-xs text-nil-muted mb-4">{v.sport}</div>
              <p className="text-sm text-nil-muted leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceSection() {
  const states = [
    { state: "California", status: "Active", laws: 3, restrictions: "Low" },
    { state: "Texas", status: "Active", laws: 2, restrictions: "Medium" },
    { state: "Florida", status: "Active", laws: 4, restrictions: "Low" },
    { state: "New York", status: "Active", laws: 2, restrictions: "Medium" },
    { state: "Ohio", status: "Active", laws: 3, restrictions: "Low" },
    { state: "Alabama", status: "Active", laws: 2, restrictions: "High" },
  ];

  return (
    <section className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">50-State Coverage</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-6">
              Compliance Intelligence
            </h2>
            <p className="text-nil-muted text-lg leading-relaxed mb-8">
              Every NIL deal passes through our compliance engine. State laws, institutional policies, and NCAA bylaws — all cross-referenced in real time before any agreement is executed.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-nil-green" />
                <span className="text-sm text-nil-text">50-state law database with automatic updates</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-nil-cyan" />
                <span className="text-sm text-nil-text">Institution-specific rule overlays (1,100+ schools)</span>
              </div>
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-nil-purple" />
                <span className="text-sm text-nil-text">Pre-deal eligibility verification</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-nil-gold" />
                <span className="text-sm text-nil-text">Audit trail for every compliance check</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-6">
            <div className="text-sm font-bold text-nil-white mb-4">State Compliance Map</div>
            <div className="space-y-3">
              {states.map((s) => (
                <div key={s.state} className="flex items-center justify-between rounded-lg bg-nil-gray/50 px-4 py-3">
                  <div>
                    <div className="text-sm font-bold text-nil-white">{s.state}</div>
                    <div className="text-xs text-nil-muted">{s.laws} active laws</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s.restrictions === "Low" ? "bg-nil-green/10 text-nil-green" :
                    s.restrictions === "Medium" ? "bg-nil-gold/10 text-nil-gold" :
                    "bg-nil-red/10 text-nil-red"
                  }`}>
                    {s.restrictions} Restriction
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-nil-border py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid sm:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-nil-green" />
              <span className="text-lg font-bold text-nil-white">NIL<span className="text-nil-green">33</span></span>
            </div>
            <p className="text-sm text-nil-muted leading-relaxed">
              The athlete intelligence platform. AI-powered NIL tracking, compliance, and analytics across every sport.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Platform</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <a href="#deals" className="hover:text-nil-white transition-colors">Live Deals</a>
              <a href="#sports" className="hover:text-nil-white transition-colors">Sports</a>
              <a href="#intelligence" className="hover:text-nil-white transition-colors">AI Engine</a>
              <a href="#verticals" className="hover:text-nil-white transition-colors">Verticals</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Verticals</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <a href="https://qbdna.nil33.com" className="hover:text-nil-white transition-colors">QB DNA</a>
              <span className="text-nil-border">Court IQ (Soon)</span>
              <span className="text-nil-border">Diamond Edge (Soon)</span>
              <span className="text-nil-border">Pitch Control (Soon)</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <span>UnyKorn</span>
              <span>Norcross, Georgia</span>
              <a href="mailto:kevanbtc@gmail.com" className="hover:text-nil-white transition-colors">kevanbtc@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="border-t border-nil-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-nil-muted">© 2026 NIL33. All rights reserved. A UnyKorn company.</div>
          <div className="text-xs text-nil-muted">nil33.com · Cloudflare DNS · Built with Next.js</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nil-black">
      <Nav />
      <Hero />
      <SportsGrid />
      <LiveDeals />
      <IntelligenceSection />
      <Verticals />
      <ComplianceSection />
      <Footer />
    </main>
  );
}
