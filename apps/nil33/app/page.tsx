"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — Homepage
   
   Role: Capital discipline software for collectives.
   This page declares. It does not justify.
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-nil-black/90 backdrop-blur-xl border-b border-nil-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
              <span className="text-nil-green font-bold text-sm">33</span>
            </div>
            <span className="text-nil-white font-semibold tracking-tight">
              NIL33
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/product"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              Product
            </Link>
            <Link
              href="/collectives"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              For Collectives
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/demo"
              className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors"
            >
              Run Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-nil-green/[0.03] blur-[120px]" />

        <div className="relative text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-nil-dark border border-nil-border rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
            <span className="text-xs text-nil-muted uppercase tracking-widest">
              Capital Discipline Software
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-nil-white leading-[1.08] tracking-tight mb-6">
            Stop overpaying.
            <br />
            <span className="text-nil-green">Start validating.</span>
          </h1>

          <p className="text-lg sm:text-xl text-nil-muted max-w-lg mx-auto mb-10 leading-relaxed">
            NIL33 shows you what a deal is worth — and whether it&apos;s
            compliant — before you sign it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
            >
              Run Demo Valuation
              <span className="text-base">→</span>
            </Link>
            <Link
              href="/collectives"
              className="inline-flex items-center gap-2 bg-nil-dark border border-nil-border text-nil-muted font-medium px-7 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              For Collectives
            </Link>
          </div>
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <section className="py-24 px-6 border-t border-nil-border bg-nil-dark">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-red uppercase tracking-widest mb-4">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-6">
            Collectives are allocating millions
            <br className="hidden sm:block" />
            without valuation discipline.
          </h2>
          <p className="text-nil-muted text-lg mb-12 max-w-lg mx-auto">
            No standardized pricing. No compliance verification.
            No audit trail. Just handshake math.
          </p>

          {/* Overpay example */}
          <div className="bg-nil-black border border-nil-border rounded-2xl p-8 max-w-md mx-auto text-left">
            <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
              Real Scenario
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">QB signed for</span>
                <span className="text-nil-white font-mono font-bold text-xl">
                  $85,000
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  NIL33 fair market value
                </span>
                <span className="text-nil-green font-mono font-bold text-xl">
                  $52,000
                </span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">Overpay</span>
                <span className="text-nil-red font-mono font-bold text-2xl">
                  $33,000
                </span>
              </div>
            </div>
            <p className="text-xs text-nil-muted mt-6">
              This happens every week. NIL33 catches it before you sign.
            </p>
          </div>
        </div>
      </section>

      {/* ─── What NIL33 Does (3 things, no more) ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
              One tool. Three answers.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "What is this athlete worth?",
                answer:
                  "A composite score and dollar range based on 33 real signals — social reach, athletic performance, market demand, and brand alignment.",
                color: "#00ff88",
              },
              {
                n: "02",
                title: "Is this deal compliant?",
                answer:
                  "Instant compliance check against your state law, conference rules, and NCAA guidelines. Pass or fail — before you sign.",
                color: "#00d4ff",
              },
              {
                n: "03",
                title: "Can we prove it?",
                answer:
                  "Every scored deal produces an auditable, timestamped receipt. Ready for board review, NCAA inquiry, or legal defense.",
                color: "#a855f7",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="bg-nil-dark border border-nil-border rounded-xl p-6 h-full"
              >
                <span
                  className="text-xs font-mono tracking-wider"
                  style={{ color: item.color }}
                >
                  {item.n}
                </span>
                <h3 className="text-nil-white font-semibold text-lg mt-3 mb-3">
                  {item.title}
                </h3>
                <p className="text-nil-muted text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/product"
              className="text-sm text-nil-green hover:underline"
            >
              See how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── For Collectives (teaser → full page) ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            Built for collectives
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-6">
            Your board asks: &ldquo;Are we overpaying?&rdquo;
            <br />
            Now you have the answer.
          </h2>
          <p className="text-nil-muted text-lg mb-10 max-w-lg mx-auto">
            NIL33 gives collectives standardized valuation, compliance
            verification, and auditable deal records — so every dollar
            is defensible.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
            {[
              "Stop overpaying on athlete deals",
              "Reduce legal and compliance risk",
              "Defend allocation decisions to your board",
              "Standardize valuation across your roster",
              "Audit any deal retroactively",
              "Generate receipts for every transaction",
            ].map((p) => (
              <div key={p} className="flex items-start gap-2.5">
                <span className="text-nil-green text-sm mt-0.5 shrink-0">
                  ✓
                </span>
                <span className="text-nil-text text-sm">{p}</span>
              </div>
            ))}
          </div>

          <Link
            href="/collectives"
            className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
          >
            See the Collective Product →
          </Link>
        </div>
      </section>

      {/* ─── ROI Anchor ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
            If you prevent one $25K overpay,
            <br />
            <span className="text-nil-green">
              you&apos;ve paid for the year.
            </span>
          </h2>
          <p className="text-nil-muted text-lg mb-10 max-w-md mx-auto">
            Pro starts at $1,200/month. Most collectives recoup that
            on a single validated deal.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-nil-dark border border-nil-border text-nil-white font-medium px-7 py-3 rounded-xl hover:border-nil-green/30 transition-colors text-sm"
          >
            See Pricing →
          </Link>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="py-20 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "240+", label: "Demo deals scored" },
              { value: "12", label: "Athletes in pilot" },
              { value: "50", label: "State rulesets loaded" },
              { value: "<1s", label: "Score generation" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-mono font-bold text-nil-white mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-nil-muted uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-nil-muted text-xs mt-8">
            Built by former QB development operators who understand the gap
            between what athletes are told and what they&apos;re worth.
          </p>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nil-green/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-nil-muted mb-8 max-w-md mx-auto">
            Run a demo valuation in 30 seconds. See the score.
            See the compliance status. Decide from data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
            >
              Run Demo →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=NIL33%20Access"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-nil-border py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
                <span className="text-nil-green font-bold text-xs">33</span>
              </div>
              <span className="text-nil-white font-medium text-sm">NIL33</span>
              <span className="text-nil-muted text-xs ml-2">
                Capital Discipline Software
              </span>
            </div>

            <div className="flex items-center gap-6 flex-wrap justify-center">
              <Link
                href="/product"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Product
              </Link>
              <Link
                href="/collectives"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                For Collectives
              </Link>
              <Link
                href="/pricing"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/demo"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/developers"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Developers
              </Link>
              <a
                href="https://under-center.netlify.app"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Under Center
              </a>
            </div>

            <p className="text-xs text-nil-muted">
              © {new Date().getFullYear()} NIL33
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
