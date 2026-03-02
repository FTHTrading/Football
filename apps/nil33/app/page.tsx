"use client";

import {
  ArrowRight,
  Check,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Briefcase,
  GraduationCap,
  Trophy,
  BarChart3,
  FileCheck,
  Lock,
  Zap,
  Building2,
  DollarSign,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   NIL33 — Homepage
   Structure: Give them what they came for FIRST,
   then introduce the scaled version.

   TOP HALF  → Athlete / Parent / Individual
   BOTTOM HALF → Collectives / Institutions / Scale
   ═══════════════════════════════════════════════════ */

/* ---------- Navigation ---------- */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-[#00ff88]">NIL</span>
          <span className="text-white">33</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#your-value" className="hover:text-white transition-colors">Your Value</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#for-collectives" className="hover:text-white transition-colors">For Collectives</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <a
          href="#get-started"
          className="bg-[#00ff88] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#00ff88]/90 transition-colors"
        >
          Get My Value
        </a>
      </div>
    </nav>
  );
}

/* ====================================================
   PART 1 — WHAT YOU CAME HERE FOR
   (Athletes, Parents, anyone asking "What am I worth?")
   ==================================================== */

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full px-4 py-1.5 text-sm text-[#00ff88] mb-8">
          <span>Free for athletes — get your value now</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          What&apos;s your
          <br />
          <span className="text-[#00ff88]">NIL value?</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Find out in 2 minutes. NIL33 looks at 33 real factors — not just your 
          follower count — and gives you a clear, honest number.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#get-started"
            className="w-full sm:w-auto bg-[#00ff88] text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#00ff88]/90 transition-colors flex items-center justify-center gap-2"
          >
            Get My NIL Value <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#for-collectives"
            className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white/40 transition-colors"
          >
            I Run a Collective
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Your Value (what the athlete gets) ---------- */
function YourValue() {
  return (
    <section id="your-value" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          For Athletes &amp; Parents
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Here&apos;s what you get.
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl">
          No guesswork. No jargon. Just a clear picture of what you&apos;re worth 
          and whether a deal is safe.
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Your NIL number</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A clear value based on 33 real factors — game stats, recruiting interest, 
              social reach, and more. Not a guess. A number you can use.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Am I allowed?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Before any deal, we check your state&apos;s laws and your school&apos;s 
              rules. If something&apos;s off, we tell you before it becomes a problem.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#a855f7]/10 rounded-xl flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-[#a855f7]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Proof it happened</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every deal gets a digital receipt — timestamped and signed. 
              Real proof that protects you, the brand, and your eligibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works (athlete perspective) ---------- */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Enter your info",
      desc: "Name, sport, school, position. That's it. Takes 2 minutes.",
      icon: Users,
    },
    {
      num: "02",
      title: "We crunch the numbers",
      desc: "NIL33 looks at 33 factors: game performance, recruiting rankings, social following, compliance status, and more.",
      icon: BarChart3,
    },
    {
      num: "03",
      title: "See your value",
      desc: "Get your NIL score, your value range, what's helping you, and what's holding you back. Plain English — no jargon.",
      icon: TrendingUp,
    },
    {
      num: "04",
      title: "Negotiate with confidence",
      desc: "Walk into any deal knowing exactly what you're worth. Stay compliant. Keep a record of everything.",
      icon: DollarSign,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#00ff88]/[0.03] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          How It Works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Four steps. Two minutes. One clear answer.
        </h2>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-6 items-start bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex flex-col items-center gap-2 min-w-[48px]">
                <div className="text-2xl font-bold text-[#00ff88]/40">{step.num}</div>
                <step.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- For Parents ---------- */
function ForParents() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-4">
              For Parents &amp; Families
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Protect your kid.<br />Understand the deal.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              NIL can feel overwhelming as a parent. You want your athlete to benefit, 
              but you also want to make sure nothing jeopardizes their eligibility or future.
            </p>
            <p className="text-gray-400 leading-relaxed">
              NIL33 gives you clear, simple reports. You&apos;ll see exactly what your 
              athlete is worth, whether a deal is legal in your state, and what the 
              school allows — all in plain language you can actually understand.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { text: "See your child's NIL value in clear terms", icon: TrendingUp },
              { text: "Know if a deal is legal before they sign", icon: Shield },
              { text: "Guardian consent built in for athletes under 18", icon: Lock },
              { text: "No jargon — reports a parent can actually read", icon: FileCheck },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                <item.icon className="w-5 h-5 text-[#a855f7] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Athlete CTA (mid-page) ---------- */
function AthleteCTA() {
  return (
    <section id="get-started" className="py-20 px-6 bg-gradient-to-b from-[#00ff88]/[0.06] to-transparent border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to find out what you&apos;re worth?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          It&apos;s free. It takes 2 minutes. And you&apos;ll walk away with a real number.
        </p>
        <a
          href="mailto:kevanbtc@gmail.com?subject=NIL33 Early Access — Athlete"
          className="inline-flex items-center gap-2 bg-[#00ff88] text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#00ff88]/90 transition-colors"
        >
          Request Early Access <ArrowRight className="w-5 h-5" />
        </a>
        <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-6">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> Free for athletes
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> 50 states
          </span>
        </div>
      </div>
    </section>
  );
}

/* ====================================================
   PART 2 — THE SCALED VERSION
   (Collectives, Compliance, Institutions, Brands)
   ==================================================== */

/* ---------- Divider ---------- */
function ScaleDivider() {
  return (
    <section className="py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-2 text-sm text-gray-400">
          <Building2 className="w-4 h-4 text-[#00d4ff]" />
          <span>Running a collective, compliance program, or brand?</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}

/* ---------- For Collectives & Institutions ---------- */
function ForCollectives() {
  return (
    <section id="for-collectives" className="py-24 px-6 bg-[#00d4ff]/[0.03] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-4">
          For Collectives, Brands &amp; Compliance
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Stop guessing. Start managing.
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl">
          NIL33 gives collectives and institutions the same valuation engine athletes 
          use — plus capital management, compliance automation, and deal infrastructure 
          built for scale.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-bold text-white">Capital Discipline</h3>
            </div>
            <ul className="space-y-2">
              {[
                "See data-backed valuations before writing checks",
                "Simulate deals before committing capital",
                "Track spend across your entire roster",
                "Know exactly where your money is going",
              ].map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#f59e0b]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <h3 className="text-lg font-bold text-white">Compliance Automation</h3>
            </div>
            <ul className="space-y-2">
              {[
                "Auto-check every deal against state and school rules",
                "Flag risks before they become violations",
                "Full audit trail for every NIL activity",
                "50-state law coverage — always current",
              ].map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00d4ff]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#00ff88]" />
              </div>
              <h3 className="text-lg font-bold text-white">Valuation API</h3>
            </div>
            <ul className="space-y-2">
              {[
                "Plug NIL33 valuations into your own systems",
                "Bulk-value entire rosters in seconds",
                "Real-time compliance checks via API",
                "Built for developers and ops teams",
              ].map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00ff88]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#a855f7]/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#a855f7]" />
              </div>
              <h3 className="text-lg font-bold text-white">Brand Matching</h3>
            </div>
            <ul className="space-y-2">
              {[
                "Find athletes who actually fit your brand",
                "Match on value, audience, sport, and risk",
                "Pre-screen compliance before outreach",
                "Not just follower counts — real fit",
              ].map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#a855f7]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing (Collectives) ---------- */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$500",
      period: "/month",
      desc: "For small collectives getting started with structured NIL management.",
      features: [
        "Up to 50 athlete valuations/month",
        "State compliance checks",
        "Deal receipts",
        "Email support",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$1,200",
      period: "/month",
      desc: "For collectives and programs managing real NIL capital at scale.",
      features: [
        "Unlimited valuations",
        "Full 50-state compliance engine",
        "Deal simulation",
        "API access",
        "Roster-wide reporting",
        "Priority support",
      ],
      cta: "Start Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "$2,500",
      period: "/month",
      desc: "For conferences, multi-program institutions, and large collectives.",
      features: [
        "Everything in Pro",
        "Multi-program dashboards",
        "Custom compliance rules",
        "Dedicated account manager",
        "SLA-backed uptime",
        "White-label options",
      ],
      cta: "Talk to Us",
      highlight: false,
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Athletes are always free. Collectives and institutions pick the plan 
            that fits their roster size and needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 ${
                plan.highlight
                  ? "bg-[#00ff88]/10 border-2 border-[#00ff88]/40"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="text-[#00ff88] text-xs font-bold uppercase tracking-widest mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.desc}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00ff88]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:kevanbtc@gmail.com?subject=NIL33 — ${plan.name} Plan"
                className={`block text-center py-3 rounded-lg text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                    : "border border-white/20 text-white hover:border-white/40"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    {
      q: "What is NIL?",
      a: "NIL stands for Name, Image, and Likeness. Since 2021, college athletes can earn money from their personal brand — endorsements, appearances, social media, and more.",
    },
    {
      q: "Is NIL33 free for athletes?",
      a: "Yes. Athletes can get their NIL value and compliance checks for free. Paid plans are for collectives, institutions, and brands that need to manage NIL at scale.",
    },
    {
      q: "How is the value calculated?",
      a: "We measure 33 real factors across six categories: identity, on-field performance, recruiting interest, social reach, compliance status, and deal history. No guesswork — just data.",
    },
    {
      q: "What states does this work in?",
      a: "All 50. Every state has different NIL laws, and we track all of them. NIL33 automatically applies the right rules based on your school's location.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. Bank-level security. Your data is never sold. You control who sees your profile.",
    },
    {
      q: "I'm a parent. Is this safe for my kid?",
      a: "Absolutely. Guardian consent is built in for athletes under 18. Every deal is checked against state and school rules before it moves forward.",
    },
    {
      q: "Can I plug NIL33 into my own systems?",
      a: "Yes — Pro and Enterprise plans include API access. You can pull valuations, run compliance checks, and simulate deals programmatically.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#00ff88]/[0.03] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4 text-center">
          Questions
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Frequently asked questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/10 pb-6">
              <h3 className="text-base font-semibold text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA (dual-track) ---------- */
function FinalCTA() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Athlete Track */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <Trophy className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">I&apos;m an athlete</h3>
            <p className="text-sm text-gray-400 mb-6">
              Get your NIL value for free. See what you&apos;re worth, 
              check your compliance, and start building your record.
            </p>
            <a
              href="mailto:kevanbtc@gmail.com?subject=NIL33 Early Access — Athlete"
              className="inline-flex items-center gap-2 bg-[#00ff88] text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#00ff88]/90 transition-colors"
            >
              Get My Value <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Collective / Institution Track */}
          <div className="bg-white/5 border border-[#00d4ff]/20 rounded-xl p-8 text-center">
            <Building2 className="w-10 h-10 text-[#00d4ff] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">I manage NIL spend</h3>
            <p className="text-sm text-gray-400 mb-6">
              Get capital discipline, compliance automation, and valuation 
              infrastructure for your collective or program.
            </p>
            <a
              href="mailto:kevanbtc@gmail.com?subject=NIL33 Demo — Collective/Institution"
              className="inline-flex items-center gap-2 border border-[#00d4ff]/40 text-[#00d4ff] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#00d4ff]/10 transition-colors"
            >
              Schedule a Demo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer id="about" className="py-16 px-6 border-t border-white/10 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="text-xl font-bold mb-3">
              <span className="text-[#00ff88]">NIL</span>
              <span className="text-white">33</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Know your value. Stay compliant. Get paid with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#your-value" className="hover:text-white transition-colors">Your Value</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#for-collectives" className="hover:text-white transition-colors">For Collectives</a></li>
              <li><a href="#get-started" className="hover:text-white transition-colors">Get Started</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Norcross, Georgia
              </li>
              <li>
                <a href="mailto:kevanbtc@gmail.com" className="hover:text-white transition-colors">
                  kevanbtc@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/FTHTrading/nil33"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 NIL33 — A UnyKorn Company. All rights reserved.</p>
          <p>Identity · Value · Legacy</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Stats Bar ---------- */
function Stats() {
  return (
    <section className="py-12 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-white">33</div>
          <div className="text-sm text-gray-500 mt-1">Value Factors</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white">50</div>
          <div className="text-sm text-gray-500 mt-1">States Covered</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white">14</div>
          <div className="text-sm text-gray-500 mt-1">Sports</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Nav />

      {/* PART 1 — What you came here for */}
      <Hero />
      <Stats />
      <YourValue />
      <HowItWorks />
      <ForParents />
      <AthleteCTA />

      {/* PART 2 — The scaled version */}
      <ScaleDivider />
      <ForCollectives />
      <Pricing />

      {/* Shared */}
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
