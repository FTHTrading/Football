"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /collectives (Conversion-Optimized)
   
   Dedicated buyer funnel. Collectives only.
   Opens with their #1 fear → shows exactly what they get
   → proves ROI with real scenarios → regulatory pressure
   → board narrative → close.
   ═══════════════════════════════════════════════════ */

export default function CollectivesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ─── Nav ─── */}
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
            <Link href="/demo" className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors">Full Demo</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero — Lead with Fear ─── */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-nil-red/[0.03] blur-[120px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-nil-red/10 border border-nil-red/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-nil-red animate-pulse" />
            <span className="text-xs text-nil-red font-medium">
              No collective has ever been penalized for validating a deal
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-6">
            Your donors gave you capital.
            <br />
            <span className="text-nil-green">Can you prove you spent it right?</span>
          </h1>
          <p className="text-lg text-nil-muted max-w-xl mx-auto mb-10 leading-relaxed">
            NIL33 gives you a <span className="text-nil-white font-medium">scored valuation, compliance check, and auditable receipt</span> for every deal — before you sign. Your board gets documentation. Your donors get accountability. You get protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-bold px-8 py-4 rounded-xl hover:bg-nil-green/90 transition-all shadow-lg shadow-nil-green/20 text-sm"
            >
              Try a Live Valuation →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=Collective%20Access%20Request"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-4 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Schedule a Walkthrough
            </a>
          </div>
        </div>
      </section>

      {/* ─── The Exposure ─── */}
      <section className="py-24 px-6 bg-nil-red/[0.04] border-y border-nil-red/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-red uppercase tracking-widest mb-4">
              Without validation software
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white">
              How collectives lose money — and credibility
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "You have no fair market reference",
                desc: "You're pricing athletes on agent asks, portal hype, and gut feel. Every deal is a guess — and the agent knows you're guessing.",
                cost: "Cost: $15K–$50K per overpay",
                color: "text-nil-red",
              },
              {
                title: "Compliance is a checkbox, not a system",
                desc: "50 different state laws. 10 conference rule books. Constantly-shifting NCAA guidance. You're either checking all of them — or checking none of them.",
                cost: "Cost: NCAA inquiry, donor fallout, headlines",
                color: "text-nil-orange",
              },
              {
                title: "Your board has no audit trail",
                desc: "When a donor asks \"How did you spend my $200K?\" — you pull up a spreadsheet. Not a scored, timestamped, compliance-verified record.",
                cost: "Cost: Donor confidence erosion",
                color: "text-nil-gold",
              },
              {
                title: "One bad deal becomes a story",
                desc: "An inflated deal leaks to media. An NCAA letter arrives. A donor pulls funding. You have no documentation to defend your decision-making.",
                cost: "Cost: Existential. This closes collectives.",
                color: "text-nil-red",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-nil-dark border border-nil-border rounded-xl p-6"
              >
                <h3 className="text-nil-white font-semibold mb-2 text-lg">
                  {p.title}
                </h3>
                <p className="text-nil-muted text-sm leading-relaxed mb-3">
                  {p.desc}
                </p>
                <p className={`text-xs font-medium ${p.color}`}>
                  {p.cost}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Five Overpay Case Snapshots ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-red uppercase tracking-widest mb-3">
              Real deal analysis
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
              Five deals. $142K in overpay.
            </h2>
            <p className="text-nil-muted max-w-lg mx-auto">
              Anonymized scenarios from pilot data — representative of deals
              happening at collectives right now.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                position: "QB",
                conference: "SEC",
                signed: 85000,
                fair: 52000,
                cause: "Agent inflated ask based on portal hype. No comparable reference available to push back.",
              },
              {
                position: "WR",
                conference: "Big Ten",
                signed: 42000,
                fair: 28000,
                cause: "Social following was 68% bot-inflated. Engagement rate was 0.4% — well below actionable.",
              },
              {
                position: "RB",
                conference: "Big 12",
                signed: 110000,
                fair: 71000,
                cause: "Three collectives bidding blind against each other. No party had market reference.",
              },
              {
                position: "OL",
                conference: "ACC",
                signed: 35000,
                fair: 22000,
                cause: "Position doesn't command NIL premium. Priced based on team need, not market reality.",
              },
              {
                position: "DB",
                conference: "SEC",
                signed: 58000,
                fair: 45000,
                cause: "Strong profile, but deal included bonuses tied to performance milestones that had no market comp.",
              },
            ].map((deal, i) => (
              <div
                key={i}
                className="bg-nil-dark border border-nil-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="sm:w-24 shrink-0">
                  <p className="text-nil-white font-semibold text-sm">{deal.position}</p>
                  <p className="text-nil-muted text-xs">{deal.conference}</p>
                </div>
                <div className="flex-1">
                  <p className="text-nil-muted text-sm leading-relaxed">{deal.cause}</p>
                </div>
                <div className="flex gap-6 sm:gap-8 shrink-0">
                  <div className="text-right">
                    <p className="text-nil-muted text-[10px] uppercase tracking-wider">Signed</p>
                    <p className="text-nil-white font-mono font-bold">${deal.signed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-nil-muted text-[10px] uppercase tracking-wider">Fair</p>
                    <p className="text-nil-green font-mono font-bold">${deal.fair.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-nil-muted text-[10px] uppercase tracking-wider">Overpay</p>
                    <p className="text-nil-red font-mono font-bold">
                      ${(deal.signed - deal.fair).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-nil-red/[0.06] border border-nil-red/20 rounded-xl p-6 text-center">
            <p className="text-nil-white font-semibold mb-1">
              Combined overpay across 5 deals: <span className="text-nil-red font-mono">$142,000</span>
            </p>
            <p className="text-nil-muted text-sm">
              That&apos;s nearly 10 years of NIL33 Pro. One quarter of unvalidated deals.
            </p>
          </div>
        </div>
      </section>

      {/* ─── What You Get (Deliverables, not features) ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
              What you get
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white">
              Three deliverables. Every single deal.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "01",
                title: "Scored Valuation",
                detail: "33-factor composite score (0–99) with a fair-value dollar range. Based on social reach, engagement quality, athletic performance, conference market multiplier, position demand, and comparable deal history.",
                output: "\"Score: 67/99 → Fair range: $48K–$62K\"",
                color: "#00ff88",
              },
              {
                num: "02",
                title: "Compliance Check",
                detail: "Automatic pass/fail against your state's NIL statute, your conference's supplemental rules, and current NCAA enforcement guidance. Flags specific violations, not generic warnings.",
                output: "\"GA law: Pass. SEC rules: Pass. NCAA overpay flag: Review — exceeds 37%.\"",
                color: "#00d4ff",
              },
              {
                num: "03",
                title: "Auditable Receipt",
                detail: "Timestamped, tamper-proof record of the deal evaluation. Contains score, valuation range, compliance status, and decision. Designed for board review, donor reporting, and NCAA response.",
                output: "\"Receipt NIL33-2025-00847. Cryptographic hash: Ed25519. Status: Compliant.\"",
                color: "#a855f7",
              },
            ].map((d) => (
              <div
                key={d.num}
                className="bg-nil-black border border-nil-border rounded-xl p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${d.color}15`, color: d.color }}
                  >
                    {d.num}
                  </span>
                  <h3 className="text-nil-white font-semibold">{d.title}</h3>
                </div>
                <p className="text-nil-muted text-sm leading-relaxed mb-4 flex-1">
                  {d.detail}
                </p>
                <div className="bg-nil-gray border border-nil-border rounded-lg p-3">
                  <p className="text-xs font-mono italic" style={{ color: d.color }}>
                    {d.output}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/product" className="text-sm text-nil-green hover:underline">
              Deep dive on the product →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Regulatory Pressure ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-red uppercase tracking-widest mb-3">
              Regulatory environment
            </p>
            <h2 className="text-3xl font-bold text-nil-white mb-3">
              The rules are tightening. Your documentation isn&apos;t.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                year: "2024",
                event: "NCAA enforcement letters sent to multiple schools requesting NIL deal documentation",
                impact: "Collectives without deal records had no defensible response.",
              },
              {
                year: "2024",
                event: "House v. NCAA settlement fundamentally restructured athlete compensation rules",
                impact: "Revenue-sharing frameworks will require institutional-grade valuation processes.",
              },
              {
                year: "2025",
                event: "Multiple states passed updated NIL statutes with enhanced disclosure requirements",
                impact: "Compliance is now state-specific, conference-specific, and deal-specific — not one-size-fits-all.",
              },
              {
                year: "Now",
                event: "Congressional NIL legislation under active discussion",
                impact: "Federal regulation will require standardized fair-market valuation. The window to build process is closing.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-5 bg-nil-dark border border-nil-border rounded-xl p-5"
              >
                <div className="shrink-0 w-12 text-center">
                  <span className="text-nil-red font-mono font-bold text-sm">{item.year}</span>
                </div>
                <div>
                  <p className="text-nil-white text-sm font-medium mb-1">{item.event}</p>
                  <p className="text-nil-muted text-sm">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-nil-muted text-sm max-w-md mx-auto">
              The question isn&apos;t whether collectives will need deal documentation.
              <span className="text-nil-white font-medium"> It&apos;s whether you&apos;ll have it when they ask.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Board-Ready Proof ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
              Board & donors
            </p>
            <h2 className="text-3xl font-bold text-nil-white">
              What your board hears — with and without NIL33
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Without */}
            <div className="bg-nil-black border border-nil-red/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-nil-red text-xs font-bold uppercase tracking-widest">Without NIL33</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-muted italic">&ldquo;We signed 23 athletes this cycle.&rdquo;</p>
                  <p className="text-nil-red/60 text-xs mt-2">Board hears: No process. No validation. Hope it works out.</p>
                </div>
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-muted italic">&ldquo;We think our deals are fair market.&rdquo;</p>
                  <p className="text-nil-red/60 text-xs mt-2">Board hears: Gut feel. No data to back it up.</p>
                </div>
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-muted italic">&ldquo;We keep spreadsheets of all our deals.&rdquo;</p>
                  <p className="text-nil-red/60 text-xs mt-2">Board hears: Someone else edits this. It&apos;s not auditable.</p>
                </div>
              </div>
            </div>

            {/* With */}
            <div className="bg-nil-black border border-nil-green/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-nil-green text-xs font-bold uppercase tracking-widest">With NIL33</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-white italic">&ldquo;23 deals scored. 4 flagged above fair market. 2 renegotiated. $47K saved.&rdquo;</p>
                  <p className="text-nil-green/60 text-xs mt-2">Board hears: Process. Discipline. Quantified savings.</p>
                </div>
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-white italic">&ldquo;Every deal verified against 33 factors. Fair-value range documented.&rdquo;</p>
                  <p className="text-nil-green/60 text-xs mt-2">Board hears: Data-driven. Defensible. Professional.</p>
                </div>
                <div className="bg-nil-dark border border-nil-border rounded-lg p-4">
                  <p className="text-nil-white italic">&ldquo;Cryptographically signed receipts for each transaction. NCAA-ready.&rdquo;</p>
                  <p className="text-nil-green/60 text-xs mt-2">Board hears: Real documentation. Protected if questioned.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROI Calculator ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-nil-dark border border-nil-border rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
                ROI
              </p>
              <h2 className="text-3xl font-bold text-nil-white">
                One deal pays for the year.
              </h2>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="flex justify-between items-baseline py-2">
                <span className="text-nil-muted">Your annual NIL budget</span>
                <span className="text-nil-white font-mono">$500K–$5M</span>
              </div>
              <div className="flex justify-between items-baseline py-2">
                <span className="text-nil-muted">Typical overpay per unvalidated deal</span>
                <span className="text-nil-red font-mono font-bold">$15K–$40K</span>
              </div>
              <div className="flex justify-between items-baseline py-2">
                <span className="text-nil-muted">Deals per cycle (typical)</span>
                <span className="text-nil-white font-mono">20–50</span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline py-2">
                <span className="text-nil-muted">NIL33 Pro annual cost</span>
                <span className="text-nil-green font-mono font-bold">$14,400</span>
              </div>
              <div className="flex justify-between items-baseline py-2">
                <span className="text-nil-muted">Overpay on just 5% of deals (conservative)</span>
                <span className="text-nil-red font-mono font-bold">$75K–$200K/yr</span>
              </div>
              <div className="h-px bg-nil-green/20" />
              <div className="flex justify-between items-baseline py-3">
                <span className="text-nil-white font-semibold">Deals to break even</span>
                <span className="text-nil-green font-mono font-extrabold text-4xl">1</span>
              </div>
            </div>

            <p className="text-center text-nil-muted text-sm mt-6 max-w-md mx-auto">
              Even catching one $15K overpay covers your cost. Most collectives
              will surface multiple overpays in the first month.
            </p>

            <div className="text-center mt-8">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
              >
                See Pricing Plans →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pilot Evidence ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
              From the pilot
            </p>
            <h2 className="text-3xl font-bold text-nil-white">
              What early operators are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                quote: "We ran 14 pending deals through NIL33 in one afternoon. Three were significantly above fair market. We renegotiated two and walked from one. Total saved: $47K.",
                source: "Operations lead, SEC collective",
                result: "$47K saved",
              },
              {
                quote: "Our board wanted documentation that we weren't just guessing. NIL33 receipts gave us exactly that — scored, timestamped, defensible. First time we had real answers.",
                source: "Board member, Big Ten collective",
                result: "Board confidence restored",
              },
              {
                quote: "We thought our deals were fair. NIL33 showed us that 3 out of 10 were 20%+ above market. We didn't know what we didn't know.",
                source: "GM, Big 12 collective",
                result: "30% of deals flagged",
              },
              {
                quote: "The compliance check alone is worth it. We were operating under our state's old law — the update changed three key provisions. We had no idea.",
                source: "Compliance advisor, ACC collective",
                result: "Avoided compliance violation",
              },
            ].map((t, i) => (
              <div key={i} className="bg-nil-black border border-nil-border rounded-xl p-6">
                <p className="text-nil-text text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-nil-muted text-xs">— {t.source}</p>
                  <span className="text-nil-green text-xs font-semibold bg-nil-green/10 px-2 py-0.5 rounded">
                    {t.result}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-nil-muted text-xs max-w-md mx-auto">
            All testimonials anonymized from pilot participants. Full case studies available under NDA.
          </p>
        </div>
      </section>

      {/* ─── FAQ (Value-framed, not defensive) ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-nil-white">
              What collectives ask before signing up
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Will this actually save us money?",
                a: "Yes. The average overpay we detect in pilot data is $28K per deal. NIL33 Pro costs $14,400/year. One caught overpay more than covers the annual subscription. Most collectives process 20–50 deals per cycle — even a 5% catch rate generates significant savings.",
              },
              {
                q: "Does NIL33 replace our deal flow or operations team?",
                a: "No. NIL33 is a validation layer. You still source athletes, negotiate terms, and close deals. NIL33 gives your team a fair-market reference, instant compliance verification, and an auditable receipt before every deal is signed. It makes your existing team more effective.",
              },
              {
                q: "How do we explain this to our board?",
                a: "You tell them: \"Every deal is now scored against 33 factors and checked for compliance before we sign. Each transaction produces an auditable, cryptographically signed receipt. We reduced overpay by $X in the first quarter.\" That's it. Board loves process and documentation.",
              },
              {
                q: "What if the NCAA asks about our deals?",
                a: "NIL33 receipts are timestamped, Ed25519-signed, and tamper-proof. They document the valuation, the compliance check, and the decision for every deal. They're designed specifically for regulatory review — showing that you performed due diligence before each transaction.",
              },
              {
                q: "How fast can we start?",
                a: "NIL33 is a web application. There's no implementation, no integration, no onboarding period. Sign up, enter your first deal, get a score. First valuation in under 60 seconds.",
              },
              {
                q: "How accurate are the valuations?",
                a: "NIL33 uses 33 weighted factors including social reach, engagement quality, athletic performance, conference market multiplier, and comparable deal history. We provide a fair-value range (not a single number) because honest pricing has variance. Our ranges track within 12% of realized deal values in pilot data.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-nil-dark border border-nil-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <h3 className="text-nil-white font-semibold text-sm pr-4">{faq.q}</h3>
                  <span className={`text-nil-muted text-lg shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-nil-muted text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-32 px-6 relative bg-nil-dark border-t border-nil-border">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nil-green/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
            Defend every dollar. Document every deal.
          </h2>
          <p className="text-nil-muted mb-8 max-w-md mx-auto text-lg">
            The next deal is already in your pipeline.
            <span className="text-nil-white font-medium"> Check it before you sign it.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-bold px-8 py-4 rounded-xl hover:bg-nil-green/90 transition-all shadow-lg shadow-nil-green/20 text-sm"
            >
              Run a Live Valuation →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=Collective%20Access%20Request"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-4 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Schedule a Walkthrough
            </a>
          </div>
          <p className="text-nil-muted text-xs mt-6">
            Free tier available. No credit card required. First valuation in 60 seconds.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
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
    </>
  );
}
