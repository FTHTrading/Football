import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/80 backdrop-blur-md border-b border-nil-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-nil-white font-bold tracking-tight">
            NIL<span className="text-nil-green">33</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/collectives" className="text-[13px] text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Collectives</Link>
            <Link href="/product" className="text-[13px] text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Product</Link>
            <Link href="/pricing" className="text-[13px] text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/demo" className="text-[13px] text-nil-black bg-nil-green font-semibold px-4 py-1.5 rounded-md hover:bg-nil-green/90 transition-colors">Try Demo</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[2.75rem] sm:text-[3.5rem] font-bold text-nil-white leading-[1.1] tracking-tight">
            Know what an athlete is worth before you sign.
          </h1>
          <p className="mt-6 text-lg text-nil-muted leading-relaxed max-w-xl">
            NIL33 scores athlete deals across 33 factors, checks compliance against 50 state laws, and generates a signed receipt — so your collective never overpays.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/demo" className="bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-lg text-sm hover:bg-nil-green/90 transition-colors">
              Try a Valuation
            </Link>
            <Link href="/product" className="text-nil-muted text-sm hover:text-nil-white transition-colors">
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* What you get — 3 columns, minimal */}
      <section className="py-24 px-6 border-t border-nil-border/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-nil-muted text-sm mb-12">Every deal runs through three checks.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-nil-green font-mono text-sm mb-3">01</p>
              <h3 className="text-nil-white font-semibold text-xl mb-3">Valuation</h3>
              <p className="text-nil-muted text-sm leading-relaxed">
                33 weighted factors — social reach, athletic performance, conference market,
                brand alignment — produce a composite score and dollar range.
              </p>
              <p className="mt-4 font-mono text-sm text-nil-text/60">
                Score: 74/99 → $48K–$62K
              </p>
            </div>
            <div>
              <p className="text-nil-cyan font-mono text-sm mb-3">02</p>
              <h3 className="text-nil-white font-semibold text-xl mb-3">Compliance</h3>
              <p className="text-nil-muted text-sm leading-relaxed">
                Instant check against the athlete&apos;s state NIL law, conference rules,
                and current NCAA guidelines. Pass, review, or fail — with citations.
              </p>
              <p className="mt-4 font-mono text-sm text-nil-text/60">
                GA: Pass · SEC: Pass · NCAA: Review
              </p>
            </div>
            <div>
              <p className="text-nil-purple font-mono text-sm mb-3">03</p>
              <h3 className="text-nil-white font-semibold text-xl mb-3">Receipt</h3>
              <p className="text-nil-muted text-sm leading-relaxed">
                Every deal gets a timestamped, cryptographically signed record.
                Show your board, your donors, or the NCAA exactly what you evaluated.
              </p>
              <p className="mt-4 font-mono text-sm text-nil-text/60">
                NIL33-2026-00847 · Ed25519
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this matters — single block, no cards */}
      <section className="py-24 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-6">The problem is simple.</h2>
          <p className="text-nil-muted leading-relaxed mb-4">
            Collectives spend $500K–$5M per cycle on athlete deals with no fair-market reference.
            Agents set the price. Collectives pay it. Nobody documents whether it was right.
          </p>
          <p className="text-nil-muted leading-relaxed mb-4">
            When the board asks how the money was spent, you pull up a spreadsheet.
            When the NCAA asks for deal documentation, you don&apos;t have any.
          </p>
          <p className="text-nil-white leading-relaxed">
            NIL33 gives you the number, the compliance check, and the paper trail — before you wire the money.
          </p>
        </div>
      </section>

      {/* Simple ROI */}
      <section className="py-24 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-nil-muted text-sm">NIL33 Pro</span>
            <span className="text-nil-white font-mono">$1,200/mo</span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-nil-muted text-sm">Average overpay caught</span>
            <span className="text-nil-green font-mono">$28,000</span>
          </div>
          <div className="h-px bg-nil-border/50 my-4" />
          <div className="flex items-baseline justify-between">
            <span className="text-nil-white text-sm font-medium">Deals to break even</span>
            <span className="text-nil-green font-mono text-3xl font-bold">1</span>
          </div>
          <div className="mt-8">
            <Link href="/pricing" className="text-nil-green text-sm hover:underline">
              See all pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-4">
            Run your first valuation.
          </h2>
          <p className="text-nil-muted mb-8">Free. No sign-up. Takes 30 seconds.</p>
          <Link href="/demo" className="inline-block bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-lg text-sm hover:bg-nil-green/90 transition-colors">
            Open Demo →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-nil-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-nil-muted text-xs">© 2026 NIL33 · Norcross, GA</span>
          <div className="flex items-center gap-6">
            <Link href="/product" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Product</Link>
            <Link href="/collectives" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Collectives</Link>
            <Link href="/pricing" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Pricing</Link>
            <Link href="/demo" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Demo</Link>
            <Link href="/developers" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Developers</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
