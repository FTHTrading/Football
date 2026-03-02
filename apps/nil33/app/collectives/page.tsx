import Link from "next/link";

export default function CollectivesPage() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/80 backdrop-blur-md border-b border-nil-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-nil-white font-bold tracking-tight">
            NIL<span className="text-nil-green">33</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/collectives" className="text-[13px] text-nil-white transition-colors hidden sm:block">Collectives</Link>
            <Link href="/product" className="text-[13px] text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Product</Link>
            <Link href="/pricing" className="text-[13px] text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/demo" className="text-[13px] text-nil-black bg-nil-green font-semibold px-4 py-1.5 rounded-md hover:bg-nil-green/90 transition-colors">Try Demo</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-nil-green text-sm font-medium mb-4">For Collectives</p>
          <h1 className="text-[2.75rem] sm:text-[3.25rem] font-bold text-nil-white leading-[1.1] tracking-tight">
            Stop guessing what athletes are worth.
          </h1>
          <p className="mt-6 text-lg text-nil-muted leading-relaxed max-w-xl">
            Your donors gave you capital. NIL33 makes sure you can account for every dollar — with scored valuations, compliance verification, and signed receipts for every deal.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/demo" className="bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-lg text-sm hover:bg-nil-green/90 transition-colors">
              Try a Valuation
            </Link>
            <a href="mailto:partnerships@nil33.com?subject=Collective%20Inquiry" className="text-nil-muted text-sm hover:text-nil-white transition-colors">
              Talk to us →
            </a>
          </div>
        </div>
      </section>

      {/* What changes */}
      <section className="py-20 px-6 border-t border-nil-border/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-nil-white mb-10">Before and after NIL33</h2>
          <div className="space-y-6">
            {[
              {
                before: "Agent quotes $85K for a portal QB. You have no reference to push back.",
                after: "NIL33 scores the athlete at 67/99 with a fair range of $48K–$62K. You negotiate from data.",
              },
              {
                before: "Board asks how you allocated $1.2M this cycle. You show a spreadsheet.",
                after: "Every deal has a signed receipt with score, valuation, and compliance status. Export the full report.",
              },
              {
                before: "NCAA sends an enforcement letter requesting deal documentation. You scramble.",
                after: "Each transaction is time-stamped, cryptographically signed, and audit-ready. You send the file.",
              },
            ].map((item, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4">
                <div className="bg-nil-dark rounded-lg p-5 border-l-2 border-nil-red/40">
                  <p className="text-[11px] text-nil-red/70 uppercase tracking-wider mb-2">Without NIL33</p>
                  <p className="text-nil-muted text-sm leading-relaxed">{item.before}</p>
                </div>
                <div className="bg-nil-dark rounded-lg p-5 border-l-2 border-nil-green/40">
                  <p className="text-[11px] text-nil-green/70 uppercase tracking-wider mb-2">With NIL33</p>
                  <p className="text-nil-text text-sm leading-relaxed">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory pressure — brief */}
      <section className="py-20 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-nil-white mb-6">Compliance is getting harder, not easier.</h2>
          <div className="space-y-4 text-sm text-nil-muted leading-relaxed">
            <p>
              50 states have distinct NIL statutes. Conferences layer on supplemental rules.
              The NCAA is actively investigating deal structures. The House v. NCAA settlement
              will introduce revenue-sharing frameworks that require institutional-grade valuation.
            </p>
            <p>
              If you&apos;re still relying on a spreadsheet and a handshake, the regulatory environment
              has already passed you by.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/product" className="text-nil-green text-sm hover:underline">
              See how the compliance engine works →
            </Link>
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="py-20 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-nil-white mb-6">The math</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-nil-muted">NIL33 Pro</span>
              <span className="text-nil-white font-mono">$14,400/yr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-nil-muted">Typical overpay on one unvalidated deal</span>
              <span className="text-nil-red font-mono">$15K–$40K</span>
            </div>
            <div className="h-px bg-nil-border/50 my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-nil-white">Catch one. Paid for the year.</span>
              <span className="text-nil-green font-mono font-bold">→</span>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/pricing" className="text-nil-green text-sm hover:underline">
              See pricing →
            </Link>
            <Link href="/demo" className="text-nil-muted text-sm hover:text-nil-white transition-colors">
              Run a free valuation →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t border-nil-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            See it work on a real deal.
          </h2>
          <p className="text-nil-muted mb-8">
            Enter an athlete&apos;s details. Get a score, compliance check, and receipt in 30 seconds.
          </p>
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
