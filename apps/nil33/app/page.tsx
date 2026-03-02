"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Briefcase,
  GraduationCap,
  Trophy,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   NIL33 — Plain-English Homepage
   Problem → Solution → How It Works → Who → CTA
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
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#who" className="hover:text-white transition-colors">Who It&apos;s For</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <a
          href="#get-started"
          className="bg-[#00ff88] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#00ff88]/90 transition-colors"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full px-4 py-1.5 text-sm text-[#00ff88] mb-8">
          <span>Now available for athletes &amp; collectives</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Know your NIL value.
          <br />
          <span className="text-[#00ff88]">Stay compliant.</span>
          <br />
          Get paid with confidence.
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          NIL33 helps athletes, coaches, collectives, and brands understand, 
          track, and validate NIL deals — simply and clearly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#get-started"
            className="w-full sm:w-auto bg-[#00ff88] text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#00ff88]/90 transition-colors flex items-center justify-center gap-2"
          >
            See How It Works <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#who"
            className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white/40 transition-colors"
          >
            Is This For Me?
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
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
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */
function Problem() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          The Problem
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          NIL is a mess right now.
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              problem: "Athletes don't know what they're worth",
              detail: "Most NIL valuations are guesswork — based on followers, not real performance data.",
            },
            {
              problem: "Collectives are overpaying",
              detail: "Without a standard framework, collectives spend blindly and waste capital.",
            },
            {
              problem: "Compliance is confusing",
              detail: "Every state has different NIL laws. Every school has different rules. One mistake can cost eligibility.",
            },
            {
              problem: "There's no proof anything happened",
              detail: "Deals are made on handshakes and text messages. No receipts. No paper trail. No protection.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.problem}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Solution ---------- */
function Solution() {
  return (
    <section className="py-24 px-6 bg-[#00ff88]/[0.03] border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          The Solution
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          NIL33 brings clarity to NIL.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          One platform that answers three questions every athlete, coach, and brand needs answered:
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[#00ff88]/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              What am I worth?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We measure 33 real factors — performance, recruiting interest, social reach, 
              compliance status — and calculate a clear, defensible value.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[#00d4ff]/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#00d4ff]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Am I allowed to do this deal?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              NIL33 automatically checks your state&apos;s laws and your school&apos;s rules 
              before any deal moves forward. No surprises.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[#a855f7]/10 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-[#a855f7]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Can I prove the deal happened?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every deal gets a digital receipt — timestamped, signed, and stored. 
              Real proof that protects everyone involved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create your profile",
      desc: "Enter basic info — name, sport, school, position. Takes 2 minutes.",
    },
    {
      num: "02",
      title: "We calculate your value",
      desc: "NIL33 analyzes 33 measurable factors across performance, reach, recruiting, and compliance to generate your score.",
    },
    {
      num: "03",
      title: "See your NIL snapshot",
      desc: "Get a clear breakdown: your value range, your strengths, what's helping your score, and what's holding it back.",
    },
    {
      num: "04",
      title: "Move forward with confidence",
      desc: "Use your score to negotiate deals, stay compliant, and build a real NIL track record over time.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          How It Works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Simple. Clear. Four steps.
        </h2>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-6 items-start bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-[#00ff88]/30 min-w-[48px]">
                {step.num}
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

/* ---------- Who It's For ---------- */
function WhoItsFor() {
  const audiences = [
    {
      icon: Trophy,
      title: "Athletes",
      color: "#00ff88",
      benefits: [
        "Know your NIL value before you negotiate",
        "See exactly what factors drive your worth",
        "Stay compliant with your state and school rules",
        "Build a verifiable track record of deals",
      ],
    },
    {
      icon: GraduationCap,
      title: "Coaches & Compliance Staff",
      color: "#00d4ff",
      benefits: [
        "See which athletes are deal-ready",
        "Automatic state law and school rule checks",
        "Audit trail for every NIL activity",
        "Protect your program from violations",
      ],
    },
    {
      icon: Briefcase,
      title: "Collectives & Brands",
      color: "#f59e0b",
      benefits: [
        "Stop overpaying — see data-backed valuations",
        "Find athletes that match your brand",
        "Run deal simulations before committing",
        "Get compliance clearance before signing",
      ],
    },
    {
      icon: Users,
      title: "Parents & Families",
      color: "#a855f7",
      benefits: [
        "Understand what your athlete is worth",
        "Make sure deals are legal and safe",
        "See clear, simple reports — no jargon",
        "Protect your child's eligibility",
      ],
    },
  ];

  return (
    <section id="who" className="py-24 px-6 bg-[#00ff88]/[0.03] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
            Who It&apos;s For
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for everyone in the NIL ecosystem.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {audiences.map((a, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${a.color}15` }}
                >
                  <a.icon className="w-5 h-5" style={{ color: a.color }} />
                </div>
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
              </div>
              <ul className="space-y-2">
                {a.benefits.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: a.color }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features (plain language) ---------- */
function Features() {
  const features = [
    {
      title: "33 real value factors",
      desc: "Not just followers. We look at game performance, recruiting interest, brand safety, compliance status, and 29 other measurable data points.",
    },
    {
      title: "Automatic compliance checks",
      desc: "Every state has different NIL laws. Every school has its own rules. NIL33 checks all of them automatically — so you never accidentally break a rule.",
    },
    {
      title: "Digital deal receipts",
      desc: "Every NIL deal gets a timestamped, signed receipt. It's proof the deal happened, what was agreed, and that everyone was compliant.",
    },
    {
      title: "Works for 14 sports",
      desc: "Football, basketball, baseball, soccer, softball, volleyball, track, swimming, golf, tennis, lacrosse, hockey, wrestling, and gymnastics.",
    },
    {
      title: "Brand matching",
      desc: "We help brands find athletes who actually fit — based on value, audience, sport, and risk profile. Not just follower counts.",
    },
    {
      title: "Built for institutions",
      desc: "Compliance officers get audit trails, risk flags, and reporting. Designed for the people who need to keep programs clean.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#00ff88] text-sm font-semibold uppercase tracking-widest mb-4">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          What NIL33 actually does.
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="border-l-2 border-[#00ff88]/30 pl-5 py-1">
              <h3 className="text-base font-semibold text-white mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Simple FAQ ---------- */
function FAQ() {
  const faqs = [
    {
      q: "What is NIL?",
      a: "NIL stands for Name, Image, and Likeness. Since 2021, college athletes can earn money from their personal brand — through endorsements, appearances, social media, and more.",
    },
    {
      q: "How does NIL33 calculate my value?",
      a: "We look at 33 measurable factors across six categories: identity verification, on-field performance, recruiting interest, social reach, compliance status, and deal history. No guesswork — just data.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. We use bank-level security to protect your information. Your data is never sold, and you control who sees your profile.",
    },
    {
      q: "Does this cost money?",
      a: "Basic valuation is free. Pro features (deal simulation, compliance reports, API access) are available on paid plans starting at $500/month for collectives.",
    },
    {
      q: "What states does this work in?",
      a: "All 50. Every state has different NIL laws, and we track all of them. NIL33 automatically applies the right rules based on your school's location.",
    },
    {
      q: "I'm a parent. Is this safe for my kid?",
      a: "Absolutely. NIL33 includes guardian consent workflows for athletes under 18, and every deal is checked against state and school compliance rules before it moves forward.",
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

/* ---------- CTA ---------- */
function CallToAction() {
  return (
    <section
      id="get-started"
      className="py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to know your real NIL value?
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
          Whether you&apos;re an athlete, a collective, or a brand — NIL33 gives you 
          the clarity you need to make smart NIL decisions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="mailto:kevanbtc@gmail.com?subject=NIL33 Early Access"
            className="w-full sm:w-auto bg-[#00ff88] text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#00ff88]/90 transition-colors flex items-center justify-center gap-2"
          >
            Request Early Access <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="mailto:kevanbtc@gmail.com?subject=NIL33 Demo Request"
            className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white/40 transition-colors"
          >
            Schedule a Demo
          </a>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#00ff88]" /> 60-day pilot
          </span>
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
          {/* Brand */}
          <div>
            <div className="text-xl font-bold mb-3">
              <span className="text-[#00ff88]">NIL</span>
              <span className="text-white">33</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The clear, simple way to understand and manage NIL value and compliance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#who" className="hover:text-white transition-colors">Who It&apos;s For</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#get-started" className="hover:text-white transition-colors">Get Started</a></li>
            </ul>
          </div>

          {/* Contact */}
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

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <WhoItsFor />
      <Features />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  );
}
