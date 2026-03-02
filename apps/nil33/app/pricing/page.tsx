"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /pricing
   
   ROI-anchored. Three tiers.
   "Prevent one $25K overpay, paid for the year."
   ═══════════════════════════════════════════════════ */

export default function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      desc: "Explore NIL33 with limited demo valuations. No credit card required.",
      cta: "Start Free",
      ctaHref: "/demo",
      highlight: false,
      features: [
        "5 demo valuations per month",
        "Composite score output (0–99)",
        "Basic compliance check (state law only)",
        "No deal receipts",
        "No deal history",
      ],
    },
    {
      name: "Pro",
      price: "$1,200",
      period: "/mo",
      desc: "Full capital discipline for active collectives. Unlimited valuations, full compliance, auditable receipts.",
      cta: "Get Pro Access",
      ctaHref: "mailto:partnerships@nil33.com?subject=NIL33%20Pro%20Access",
      highlight: true,
      features: [
        "Unlimited valuations",
        "Full 33-factor composite scoring",
        "3-layer compliance (state + conference + NCAA)",
        "Cryptographically signed deal receipts",
        "Searchable deal history",
        "Exportable reports (PDF + JSON)",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For multi-school collectives, conferences, and institutional buyers. Custom integrations, SLAs, dedicated support.",
      cta: "Talk to Sales",
      ctaHref:
        "mailto:partnerships@nil33.com?subject=NIL33%20Enterprise%20Inquiry",
      highlight: false,
      features: [
        "Everything in Pro",
        "Multi-school portfolio view",
        "API access for internal tools",
        "Custom compliance rulesets",
        "White-label receipts",
        "Dedicated account manager",
        "SLA and uptime guarantees",
      ],
    },
  ];

  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-6">
            Prevent one overpay.
            <br />
            <span className="text-nil-green">Paid for the year.</span>
          </h1>
          <p className="text-lg text-nil-muted max-w-md mx-auto">
            Pro costs $1,200/month. Most collectives recoup that on a
            single validated deal.
          </p>
        </div>
      </section>

      {/* ─── Tiers ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.highlight
                  ? "bg-nil-green/[0.05] border-2 border-nil-green/30 relative"
                  : "bg-nil-dark border border-nil-border"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nil-green text-nil-black text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-nil-white font-semibold text-lg mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-nil-white font-mono text-4xl font-extrabold">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-nil-muted text-sm">{tier.period}</span>
                  )}
                </div>
                <p className="text-nil-muted text-sm mt-3 leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-nil-green text-sm mt-0.5 shrink-0">
                      ✓
                    </span>
                    <span className="text-nil-text text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              {tier.ctaHref.startsWith("mailto:") ? (
                <a
                  href={tier.ctaHref}
                  className={`text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-nil-green text-nil-black hover:bg-nil-green/90"
                      : "bg-nil-gray border border-nil-border text-nil-white hover:border-nil-green/30"
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href={tier.ctaHref}
                  className={`text-center py-3 rounded-xl text-sm font-semibold transition-colors block ${
                    tier.highlight
                      ? "bg-nil-green text-nil-black hover:bg-nil-green/90"
                      : "bg-nil-gray border border-nil-border text-nil-white hover:border-nil-green/30"
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROI Calculator ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-10">
            The ROI math
          </h2>

          <div className="bg-nil-black border border-nil-border rounded-2xl p-8 text-left max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  Annual NIL budget (typical)
                </span>
                <span className="text-nil-white font-mono font-bold">
                  $1.5M
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  Average overpay rate (our data)
                </span>
                <span className="text-nil-red font-mono font-bold">18%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  Annual overpay (estimated)
                </span>
                <span className="text-nil-red font-mono font-bold">
                  $270,000
                </span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  NIL33 Pro (annual)
                </span>
                <span className="text-nil-green font-mono font-bold">
                  $14,400
                </span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted text-sm">
                  Even if NIL33 prevents 10% of overpay
                </span>
                <span className="text-nil-green font-mono font-bold text-xl">
                  $27,000 saved
                </span>
              </div>
              <p className="text-nil-muted text-xs pt-2">
                That&apos;s a 1.9x return at the most conservative estimate.
                Most collectives see 5x–10x.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-10 text-center">
            What you get at each tier
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nil-border">
                  <th className="text-left text-nil-muted py-3 pr-4">
                    Feature
                  </th>
                  <th className="text-center text-nil-muted py-3 px-4">
                    Starter
                  </th>
                  <th className="text-center text-nil-green py-3 px-4 font-semibold">
                    Pro
                  </th>
                  <th className="text-center text-nil-muted py-3 pl-4">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Valuations", "5/mo", "Unlimited", "Unlimited"],
                  ["33-Factor Scoring", "Basic", "Full", "Full + Custom"],
                  ["Compliance", "State only", "State + Conf + NCAA", "Custom rulesets"],
                  ["Deal Receipts", "—", "✓", "✓ White-label"],
                  ["Deal History", "—", "✓", "✓ Multi-school"],
                  ["Export (PDF/JSON)", "—", "✓", "✓"],
                  ["API Access", "—", "—", "✓"],
                  ["Support", "Community", "Priority", "Dedicated"],
                ].map(([feature, starter, pro, enterprise]) => (
                  <tr key={feature} className="border-b border-nil-border/50">
                    <td className="text-nil-text py-3 pr-4">{feature}</td>
                    <td className="text-nil-muted py-3 px-4 text-center">
                      {starter}
                    </td>
                    <td className="text-nil-white py-3 px-4 text-center font-medium">
                      {pro}
                    </td>
                    <td className="text-nil-muted py-3 pl-4 text-center">
                      {enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-nil-dark border-t border-nil-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-nil-white mb-4">
            Start with a free demo. Upgrade when you&apos;re ready.
          </h2>
          <p className="text-nil-muted mb-8">
            No credit card. No sales call required. Run your first
            valuation in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
            >
              Run Free Demo →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=NIL33%20Pricing%20Question"
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
          <Link href="/collectives" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">For Collectives</Link>
          <Link href="/pricing" className="text-sm text-nil-white transition-colors hidden sm:block">Pricing</Link>
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
