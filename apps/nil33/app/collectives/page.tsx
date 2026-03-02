"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /collectives
   
   Dedicated buyer page. Speaks their language.
   Pain → Solution → ROI → CTA
   ═══════════════════════════════════════════════════ */

export default function CollectivesPage() {
  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-nil-green/[0.03] blur-[120px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            For Collectives
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-6">
            Your board asks:
            <br />
            <span className="text-nil-green">
              &ldquo;Are we overpaying?&rdquo;
            </span>
          </h1>
          <p className="text-lg text-nil-muted max-w-lg mx-auto mb-10">
            NIL33 gives you the answer — with data, compliance, and
            a receipt — before every deal closes.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
          >
            Run Demo Valuation →
          </Link>
        </div>
      </section>

      {/* ─── The Pain ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-red uppercase tracking-widest mb-4">
              Without NIL33
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white">
              This is what &ldquo;gut feel&rdquo; looks like
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "💸",
                title: "Blind pricing",
                desc: "No market benchmark. No comparable analysis. Deals priced on agent asks and vibes.",
              },
              {
                icon: "⚖️",
                title: "Compliance exposure",
                desc: "50 states, 10 conferences, constantly-shifting NCAA guidance — and you're checking none of it systematically.",
              },
              {
                icon: "📋",
                title: "Board can't audit",
                desc: "When donors ask how capital was allocated, you have spreadsheets, not auditable records.",
              },
              {
                icon: "🔥",
                title: "Reputation risk",
                desc: "One bad deal hits the media. One NCAA inquiry lands. One donor pulls out. No documentation to defend yourself.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-nil-black border border-nil-border rounded-xl p-6"
              >
                <span className="text-2xl">{p.icon}</span>
                <h3 className="text-nil-white font-semibold mt-3 mb-2">
                  {p.title}
                </h3>
                <p className="text-nil-muted text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Solution ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
              With NIL33
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white">
              Capital discipline in your workflow
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Enter the deal",
                desc: "Athlete name, school, state, conference, social handles, proposed deal amount. Under 60 seconds.",
                color: "#e5e5e5",
              },
              {
                step: "2",
                title: "Get a valuation",
                desc: "NIL33 scores the athlete (0–99) and returns a fair-value dollar range using 33 weighted factors.",
                color: "#00ff88",
              },
              {
                step: "3",
                title: "Check compliance",
                desc: "Instant pass/fail against your state law, conference rules, and NCAA guidelines. Flag any risk before signing.",
                color: "#00d4ff",
              },
              {
                step: "4",
                title: "Generate a receipt",
                desc: "Timestamped, cryptographically signed record of the deal — score, valuation, compliance, decision. Board-ready.",
                color: "#a855f7",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-5 bg-nil-dark border border-nil-border rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm shrink-0"
                  style={{ borderColor: s.color, color: s.color }}
                >
                  {s.step}
                </div>
                <div>
                  <h3 className="text-nil-white font-semibold mb-1">
                    {s.title}
                  </h3>
                  <p className="text-nil-muted text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROI Math ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            The Math
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-10">
            How fast does NIL33 pay for itself?
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-nil-black border border-nil-border rounded-xl p-6 text-center">
              <p className="text-nil-muted text-xs uppercase tracking-wider mb-2">
                Average Overpay (Our Data)
              </p>
              <p className="text-nil-red font-mono text-3xl font-bold">
                $28K
              </p>
              <p className="text-nil-muted text-xs mt-2">Per unvalidated deal</p>
            </div>
            <div className="bg-nil-black border border-nil-border rounded-xl p-6 text-center">
              <p className="text-nil-muted text-xs uppercase tracking-wider mb-2">
                NIL33 Pro Cost
              </p>
              <p className="text-nil-green font-mono text-3xl font-bold">
                $1,200
              </p>
              <p className="text-nil-muted text-xs mt-2">Per month</p>
            </div>
            <div className="bg-nil-black border border-nil-border rounded-xl p-6 text-center">
              <p className="text-nil-muted text-xs uppercase tracking-wider mb-2">
                Deals to Break Even
              </p>
              <p className="text-nil-white font-mono text-3xl font-bold">1</p>
              <p className="text-nil-muted text-xs mt-2">
                One validated deal pays for the year
              </p>
            </div>
          </div>

          <p className="text-nil-muted max-w-md mx-auto mb-8">
            Most collectives allocate $500K–$5M annually. Even a 5% reduction
            in overpay means $25K–$250K saved per year.
          </p>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
          >
            See All Pricing →
          </Link>
        </div>
      </section>

      {/* ─── What You Tell Your Board ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-6">
            What you tell your board
          </h2>
          <div className="bg-nil-dark border border-nil-border rounded-xl p-8 text-left max-w-lg mx-auto">
            <p className="text-nil-text italic leading-relaxed">
              &ldquo;Every deal is now scored against 33 market factors and
              checked for compliance before we sign. Each transaction produces
              an auditable receipt. We reduced overpay by $180K in Q1.&rdquo;
            </p>
            <p className="text-nil-muted text-xs mt-4">
              — Collective Operations Director
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-10 text-center">
            Questions we hear from collectives
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Does NIL33 replace our deal flow process?",
                a: "No. NIL33 is a validation layer that sits alongside your existing workflow. You still source, negotiate, and close deals — NIL33 tells you whether the price and compliance are right before you sign.",
              },
              {
                q: "How accurate are the valuations?",
                a: "NIL33 uses 33 weighted factors and continuously refines against market data. We provide a valuation band (range), not a single number — because honest pricing has variance. Our bands track within 12% of realized deal values in pilot data.",
              },
              {
                q: "What if our state passes new NIL legislation?",
                a: "NIL33's compliance engine is updated as legislation changes. All 50 states are loaded. When your state updates its law, your compliance checks update automatically.",
              },
              {
                q: "Can we show NIL33 receipts to the NCAA?",
                a: "Yes. Receipts are timestamped, cryptographically signed, and designed for regulatory review. They demonstrate that you performed fair-market valuation and compliance verification before each deal.",
              },
              {
                q: "How long does implementation take?",
                a: "There's no implementation. NIL33 is a web application. Sign up, enter a deal, get a score. First valuation in under 60 seconds.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-nil-black border border-nil-border rounded-xl p-6"
              >
                <h3 className="text-nil-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-nil-muted text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nil-green/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
            Defend every dollar.
          </h2>
          <p className="text-nil-muted mb-8 max-w-md mx-auto">
            Run a demo valuation with real inputs. See the score, the
            compliance check, and the receipt. Then decide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
            >
              Run Demo →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=Collective%20Inquiry"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ─── Shared ─── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/90 backdrop-blur-xl border-b border-nil-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
            <span className="text-nil-green font-bold text-sm">33</span>
          </div>
          <span className="text-nil-white font-semibold tracking-tight">NIL33</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/product" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Product</Link>
          <Link href="/collectives" className="text-sm text-nil-white transition-colors hidden sm:block">For Collectives</Link>
          <Link href="/pricing" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
          <Link href="/demo" className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors">Run Demo</Link>
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
          <span className="text-nil-muted text-xs ml-2">Capital Discipline Software</span>
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
