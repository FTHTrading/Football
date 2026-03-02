"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /product
   
   Deep dive into what the software does.
   Three engines: Valuation, Compliance, Receipts.
   No architecture diagrams. Buyer-facing only.
   ═══════════════════════════════════════════════════ */

export default function ProductPage() {
  return (
    <>
      {/* ─── Nav ─── */}
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            Product
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-6">
            Three engines.
            <br />
            One decision layer.
          </h1>
          <p className="text-lg text-nil-muted max-w-lg mx-auto">
            NIL33 combines athlete valuation, regulatory compliance, and
            audit-ready deal documentation into a single workflow.
          </p>
        </div>
      </section>

      {/* ─── Engine 1: Valuation ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center text-nil-green font-mono text-sm font-bold">
                  01
                </span>
                <span className="text-xs text-nil-muted uppercase tracking-widest">
                  Valuation Engine
                </span>
              </div>
              <h2 className="text-3xl font-bold text-nil-white mb-4">
                What is this athlete actually worth?
              </h2>
              <p className="text-nil-muted mb-6 leading-relaxed">
                NIL33 scores every athlete using 33 weighted factors across four
                categories: social reach, athletic performance, market demand,
                and brand alignment. The result is a composite score (0–99) and
                a dollar-range valuation band.
              </p>
              <ul className="space-y-3">
                {[
                  "Social: followers, engagement rate, content frequency, platform diversity",
                  "Athletic: position stats, conference, team records, awards, draft stock",
                  "Market: media coverage, regional demand, NIL market maturity, sport premium",
                  "Brand: audience quality, brand safety, uniqueness, narrative value",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-nil-green text-sm mt-0.5 shrink-0">
                      ▸
                    </span>
                    <span className="text-nil-text text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example output */}
            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                Sample Output
              </p>
              <div className="space-y-4">
                <div>
                  <span className="text-nil-muted text-xs">Athlete</span>
                  <p className="text-nil-white font-semibold">
                    Marcus Williams — QB, SEC
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-nil-muted text-xs">
                      Composite Score
                    </span>
                    <p className="text-nil-green font-mono text-2xl font-bold">
                      74
                    </p>
                  </div>
                  <div>
                    <span className="text-nil-muted text-xs">
                      Valuation Band
                    </span>
                    <p className="text-nil-white font-mono text-xl font-bold">
                      $48K–$62K
                    </p>
                  </div>
                </div>
                <div className="h-px bg-nil-border" />
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Social", value: "68" },
                    { label: "Athletic", value: "81" },
                    { label: "Market", value: "72" },
                    { label: "Brand", value: "75" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-nil-white font-mono font-bold">
                        {s.value}
                      </p>
                      <p className="text-nil-muted text-[10px] uppercase">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-nil-border" />
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-xs">Confidence</span>
                  <span className="text-nil-green text-sm font-medium">
                    High (8 signals strong)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Engine 2: Compliance ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Example output */}
            <div className="bg-nil-dark border border-nil-border rounded-xl p-6 order-last md:order-first">
              <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                Compliance Check
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-sm">State</span>
                  <span className="text-nil-white text-sm font-medium">
                    Georgia
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-sm">Conference</span>
                  <span className="text-nil-white text-sm font-medium">
                    SEC
                  </span>
                </div>
                <div className="h-px bg-nil-border" />
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-sm">
                    State NIL Law
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nil-green" />
                    <span className="text-nil-green text-sm font-medium">
                      Pass
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-sm">
                    Conference Rules
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nil-green" />
                    <span className="text-nil-green text-sm font-medium">
                      Pass
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-nil-muted text-sm">
                    NCAA Guidelines
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nil-gold" />
                    <span className="text-nil-gold text-sm font-medium">
                      Review
                    </span>
                  </div>
                </div>
                <div className="h-px bg-nil-border" />
                <div className="bg-nil-gray border border-nil-border rounded-lg p-3">
                  <p className="text-nil-gold text-xs font-medium mb-1">
                    ⚠ NCAA Note
                  </p>
                  <p className="text-nil-muted text-xs">
                    Proposed deal amount ($85K) exceeds the NIL33 fair value
                    band ($48K–$62K) by 37%. This gap may trigger NCAA
                    pay-for-play scrutiny.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-nil-cyan/10 border border-nil-cyan/20 flex items-center justify-center text-nil-cyan font-mono text-sm font-bold">
                  02
                </span>
                <span className="text-xs text-nil-muted uppercase tracking-widest">
                  Compliance Engine
                </span>
              </div>
              <h2 className="text-3xl font-bold text-nil-white mb-4">
                Is this deal compliant?
              </h2>
              <p className="text-nil-muted mb-6 leading-relaxed">
                Every deal is checked against three layers of regulation:
                your state&apos;s NIL law, your conference&apos;s specific
                rules, and current NCAA guidelines. Results are instant.
              </p>
              <ul className="space-y-3">
                {[
                  "50-state NIL law database — updated as legislation changes",
                  "Conference-specific rulesets (SEC, Big Ten, Big 12, ACC, etc.)",
                  "NCAA guideline alignment and pay-for-play risk flags",
                  "Automated alerts when a deal falls outside safe parameters",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-nil-cyan text-sm mt-0.5 shrink-0">
                      ▸
                    </span>
                    <span className="text-nil-text text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Engine 3: Deal Receipts ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-nil-purple/10 border border-nil-purple/20 flex items-center justify-center text-nil-purple font-mono text-sm font-bold">
                  03
                </span>
                <span className="text-xs text-nil-muted uppercase tracking-widest">
                  Deal Receipts
                </span>
              </div>
              <h2 className="text-3xl font-bold text-nil-white mb-4">
                Can we prove it?
              </h2>
              <p className="text-nil-muted mb-6 leading-relaxed">
                Every scored deal produces a timestamped, cryptographically
                signed receipt. Each receipt captures the valuation inputs,
                compliance status, and final decision — ready for board
                review, NCAA inquiry, or legal defense.
              </p>
              <ul className="space-y-3">
                {[
                  "Tamper-evident — receipts cannot be altered after generation",
                  "Exportable PDF or JSON for record-keeping",
                  "Searchable deal history across your entire collective portfolio",
                  "Retroactive audit support — look up any past deal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-nil-purple text-sm mt-0.5 shrink-0">
                      ▸
                    </span>
                    <span className="text-nil-text text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Receipt sample */}
            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                Deal Receipt
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-nil-muted">Receipt ID</span>
                  <span className="text-nil-white font-mono text-xs">
                    NIL33-2025-00847
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Athlete</span>
                  <span className="text-nil-white">Marcus Williams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Composite Score</span>
                  <span className="text-nil-green font-mono">74</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Fair Value Band</span>
                  <span className="text-nil-white font-mono">$48K–$62K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Proposed Amount</span>
                  <span className="text-nil-red font-mono">$85,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Compliance</span>
                  <span className="text-nil-gold">Review Required</span>
                </div>
                <div className="h-px bg-nil-border" />
                <div className="flex justify-between">
                  <span className="text-nil-muted">Generated</span>
                  <span className="text-nil-muted font-mono text-xs">
                    2025-06-15T14:32:08Z
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nil-muted">Signature</span>
                  <span className="text-nil-purple font-mono text-xs truncate max-w-[180px]">
                    ed25519:7f3a…c91b
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Workflow ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-12">
            How a deal flows through NIL33
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {[
              { step: "1", label: "Enter deal details", color: "#e5e5e5" },
              { step: "2", label: "Score + Value", color: "#00ff88" },
              { step: "3", label: "Compliance check", color: "#00d4ff" },
              { step: "4", label: "Receipt generated", color: "#a855f7" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold mb-2"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {s.step}
                  </div>
                  <p className="text-nil-muted text-xs text-center w-28">
                    {s.label}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden sm:block w-16 h-px bg-nil-border mx-2 -mt-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-nil-dark border-t border-nil-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-4">
            See it in action.
          </h2>
          <p className="text-nil-muted mb-8">
            Run a demo valuation with real inputs. See how NIL33 scores,
            checks compliance, and generates a receipt — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
            >
              Run Demo →
            </Link>
            <Link
              href="/collectives"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              For Collectives →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <Footer />
    </>
  );
}

/* ─── Shared Components ─── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/90 backdrop-blur-xl border-b border-nil-border">
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
            className="text-sm text-nil-white transition-colors hidden sm:block"
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
  );
}

function Footer() {
  return (
    <footer className="border-t border-nil-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
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
          <Link href="/product" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Product</Link>
          <Link href="/collectives" className="text-xs text-nil-muted hover:text-nil-white transition-colors">For Collectives</Link>
          <Link href="/pricing" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Pricing</Link>
          <Link href="/demo" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Demo</Link>
          <Link href="/developers" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Developers</Link>
        </div>
        <p className="text-xs text-nil-muted">© {new Date().getFullYear()} NIL33</p>
      </div>
    </footer>
  );
}
