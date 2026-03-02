"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — Homepage (Conversion-Optimized)
   
   Single buyer: Collectives.
   Leads with urgency, not explanation.
   Interactive valuation in hero.
   ROI inline. Proof with narrative.
   ═══════════════════════════════════════════════════ */

/* ─── Quick-score logic (hero form) ─── */
function quickScore(followers: number, conference: string, proposed: number) {
  const confMultiplier: Record<string, number> = {
    SEC: 1.15, "Big Ten": 1.12, "Big 12": 1.08, ACC: 1.06,
    "Pac-12": 1.04, AAC: 0.92, "Sun Belt": 0.88, Other: 0.85,
  };
  const socialScore = Math.min(99, Math.round(
    (Math.log10(Math.max(followers, 100)) / Math.log10(5000000)) * 65 + 15
  ));
  const mult = confMultiplier[conference] || 0.95;
  const composite = Math.min(99, Math.round(socialScore * mult));
  const baseDollar = composite * 780;
  const low = Math.round((baseDollar * 0.85) / 1000) * 1000;
  const high = Math.round((baseDollar * 1.15) / 1000) * 1000;
  const overpay = Math.max(0, proposed - high);
  return { composite, low, high, overpay, socialScore };
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  /* Hero form state */
  const [followers, setFollowers] = useState("");
  const [conference, setConference] = useState("SEC");
  const [proposed, setProposed] = useState("");
  const [verdict, setVerdict] = useState<{
    composite: number;
    low: number;
    high: number;
    overpay: number;
  } | null>(null);
  const [scoring, setScoring] = useState(false);
  const verdictRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  function handleQuickScore() {
    const f = parseInt(followers) || 0;
    const p = parseInt(proposed) || 0;
    if (!f || !p) return;
    setScoring(true);
    setTimeout(() => {
      const result = quickScore(f, conference, p);
      setVerdict(result);
      setScoring(false);
      setTimeout(() => {
        verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }, 900);
  }

  function resetForm() {
    setVerdict(null);
    setFollowers("");
    setProposed("");
  }

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
            <Link href="/product" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Product</Link>
            <Link href="/collectives" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">For Collectives</Link>
            <Link href="/pricing" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
            <Link
              href="/demo"
              className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors"
            >
              Full Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 pb-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-nil-green/[0.03] blur-[140px]" />

        <div className="relative max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-nil-red/10 border border-nil-red/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-nil-red animate-pulse" />
              <span className="text-xs text-nil-red font-medium uppercase tracking-widest">
                Your next deal might be a $30K mistake
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-nil-white leading-[1.08] tracking-tight mb-5">
              Know the real number
              <br />
              <span className="text-nil-green">before you sign.</span>
            </h1>

            <p className="text-lg sm:text-xl text-nil-muted max-w-xl mx-auto leading-relaxed">
              NIL33 tells collectives exactly what an athlete is worth,
              whether the deal is compliant, and if you&apos;re overpaying.
              <span className="text-nil-white font-medium"> In seconds.</span>
            </p>
          </div>

          {/* ─── Quick Try (inline hero form) ─── */}
          {!verdict ? (
            <div className="max-w-lg mx-auto bg-nil-dark border border-nil-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-nil-white font-semibold">
                  Try it now — 3 inputs, instant verdict
                </h2>
                <span className="text-xs text-nil-muted bg-nil-gray px-2 py-0.5 rounded">
                  Free
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Athlete&apos;s Followers
                    </label>
                    <input
                      type="number"
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Conference
                    </label>
                    <select
                      value={conference}
                      onChange={(e) => setConference(e.target.value)}
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50 transition-colors"
                    >
                      {["SEC", "Big Ten", "Big 12", "ACC", "Pac-12", "AAC", "Sun Belt", "Other"].map(
                        (c) => <option key={c} value={c}>{c}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                    Proposed Deal Amount ($)
                  </label>
                  <input
                    type="number"
                    value={proposed}
                    onChange={(e) => setProposed(e.target.value)}
                    placeholder="e.g. 85000"
                    className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors"
                  />
                </div>

                <button
                  onClick={handleQuickScore}
                  disabled={!followers || !proposed || scoring}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    followers && proposed && !scoring
                      ? "bg-nil-green text-nil-black hover:bg-nil-green/90 cursor-pointer shadow-lg shadow-nil-green/20"
                      : "bg-nil-gray text-nil-muted cursor-not-allowed"
                  }`}
                >
                  {scoring ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-nil-black/30 border-t-nil-black rounded-full animate-spin" />
                      Scoring…
                    </span>
                  ) : (
                    "Check This Deal →"
                  )}
                </button>
              </div>
              <p className="text-nil-muted text-[11px] mt-3 text-center">
                Quick estimate. <Link href="/demo" className="text-nil-green hover:underline">Full 33-factor demo →</Link>
              </p>
            </div>
          ) : (
            /* ─── Verdict Card ─── */
            <div ref={verdictRef} className="max-w-lg mx-auto">
              <div
                className={`rounded-2xl p-6 sm:p-8 border-2 ${
                  verdict.overpay > 0
                    ? "bg-nil-red/[0.06] border-nil-red/30"
                    : "bg-nil-green/[0.06] border-nil-green/30"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      verdict.overpay > 0 ? "text-nil-red" : "text-nil-green"
                    }`}
                  >
                    {verdict.overpay > 0 ? "⚠ Overpay Detected" : "✓ Fair Deal"}
                  </span>
                  <span className="text-nil-muted text-xs font-mono">
                    Score: {verdict.composite}/99
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-nil-muted text-sm">Fair value range</span>
                    <span className="text-nil-white font-mono font-bold text-lg">
                      ${verdict.low.toLocaleString()}–${verdict.high.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-nil-muted text-sm">Your proposed deal</span>
                    <span
                      className={`font-mono font-bold text-lg ${
                        verdict.overpay > 0 ? "text-nil-red" : "text-nil-green"
                      }`}
                    >
                      ${parseInt(proposed).toLocaleString()}
                    </span>
                  </div>
                  {verdict.overpay > 0 && (
                    <>
                      <div className="h-px bg-nil-border" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-nil-muted text-sm font-medium">
                          You&apos;re overpaying by
                        </span>
                        <span className="text-nil-red font-mono font-extrabold text-2xl">
                          ${verdict.overpay.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {verdict.overpay > 0 ? (
                  <p className="text-nil-red/80 text-sm mb-6">
                    This deal exceeds the fair market range. Without validation,
                    this overpay goes straight to your balance sheet — and potentially
                    triggers NCAA scrutiny.
                  </p>
                ) : (
                  <p className="text-nil-green/80 text-sm mb-6">
                    This deal falls within the estimated fair market range.
                    Run the full 33-factor analysis for a complete compliance check.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/demo"
                    className="flex-1 text-center bg-nil-green text-nil-black font-semibold py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
                  >
                    Run Full Valuation →
                  </Link>
                  <button
                    onClick={resetForm}
                    className="flex-1 text-center bg-nil-dark border border-nil-border text-nil-muted font-medium py-3 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm cursor-pointer"
                  >
                    Try Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Urgency Strip ─── */}
      <section className="py-16 px-6 bg-nil-red/[0.04] border-y border-nil-red/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-nil-white mb-4">
            Every week, a collective signs a deal they shouldn&apos;t.
          </h2>
          <p className="text-nil-muted text-lg max-w-lg mx-auto">
            No fair market reference. No compliance check. No paper trail.
            Just a handshake and a wire transfer. <span className="text-nil-red font-medium">That&apos;s how you end up in headlines.</span>
          </p>
        </div>
      </section>

      {/* ─── What You Get (not how it works) ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
              What you get
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white">
              Three things. Before every deal.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "A fair market number",
                desc: "Not a guess. A scored valuation based on social reach, athletic performance, market demand, and brand fit — weighted across 33 factors.",
                example: "\"This QB is worth $48K–$62K. You offered $85K.\"",
                color: "#00ff88",
              },
              {
                title: "A compliance verdict",
                desc: "Instant pass/fail against your state's NIL law, conference rules, and NCAA guidelines. You'll know if the deal is safe before you sign it.",
                example: "\"Georgia state law: Pass. SEC rules: Pass. NCAA: Review — overpay exceeds 37%.\"",
                color: "#00d4ff",
              },
              {
                title: "A signed receipt",
                desc: "Every deal generates a timestamped, tamper-proof record. When your board asks — or the NCAA asks — you have documentation.",
                example: "\"Receipt NIL33-2025-00847: Scored, compliant, signed.\"",
                color: "#a855f7",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-nil-dark border border-nil-border rounded-xl p-6 flex flex-col"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg font-bold"
                  style={{ backgroundColor: `${item.color}10`, color: item.color }}
                >
                  {item.title === "A fair market number" ? "$" : item.title === "A compliance verdict" ? "✓" : "■"}
                </div>
                <h3 className="text-nil-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-nil-muted text-sm leading-relaxed mb-4 flex-1">
                  {item.desc}
                </p>
                <div className="bg-nil-gray border border-nil-border rounded-lg p-3">
                  <p className="text-xs italic" style={{ color: item.color }}>
                    {item.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/product" className="text-sm text-nil-green hover:underline">
              See the full product →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Real Overpay Scenarios ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-nil-red uppercase tracking-widest mb-3">
              Real scenarios
            </p>
            <h2 className="text-3xl font-bold text-nil-white">
              These overpays happen every month.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                position: "QB — SEC",
                signed: 85000,
                fair: 52000,
                overpay: 33000,
                note: "Agent inflated ask. No market reference available.",
              },
              {
                position: "WR — Big Ten",
                signed: 42000,
                fair: 28000,
                overpay: 14000,
                note: "Social following was bot-inflated. Engagement rate was 0.4%.",
              },
              {
                position: "RB — Big 12",
                signed: 110000,
                fair: 71000,
                overpay: 39000,
                note: "Portal hype. Three collectives bidding blind against each other.",
              },
            ].map((deal) => (
              <div
                key={deal.position}
                className="bg-nil-black border border-nil-border rounded-xl p-6"
              >
                <p className="text-nil-white font-semibold text-sm mb-4">
                  {deal.position}
                </p>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-nil-muted text-sm">Signed for</span>
                    <span className="text-nil-white font-mono font-bold">
                      ${deal.signed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nil-muted text-sm">Fair value</span>
                    <span className="text-nil-green font-mono font-bold">
                      ${deal.fair.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-nil-border" />
                  <div className="flex justify-between">
                    <span className="text-nil-muted text-sm">Overpay</span>
                    <span className="text-nil-red font-mono font-bold text-lg">
                      ${deal.overpay.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-nil-muted text-xs italic">{deal.note}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-nil-muted text-sm mt-8">
            Combined overpay in these 3 deals alone: <span className="text-nil-red font-mono font-bold">$86,000</span>.
            That&apos;s 6 years of NIL33 Pro.
          </p>
        </div>
      </section>

      {/* ─── ROI (inline, concrete) ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-nil-dark border border-nil-border rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-nil-white mb-2">
                The math is simple.
              </h2>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted">NIL33 Pro</span>
                <span className="text-nil-white font-mono font-bold">$1,200/mo</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted">Annual cost</span>
                <span className="text-nil-white font-mono font-bold">$14,400</span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted">Average overpay caught</span>
                <span className="text-nil-green font-mono font-bold">$28,000</span>
              </div>
              <div className="h-px bg-nil-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-nil-muted font-medium">Deals to break even</span>
                <span className="text-nil-green font-mono font-extrabold text-3xl">1</span>
              </div>
            </div>

            <p className="text-center text-nil-muted text-sm mt-8 max-w-md mx-auto">
              Catch one bad deal and you&apos;ve paid for the year.
              Most collectives are signing 20–50 deals per cycle.
            </p>

            <div className="text-center mt-8">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
              >
                See All Pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof With Narrative ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
              Early traction
            </p>
            <h2 className="text-3xl font-bold text-nil-white">
              Built by operators. Tested with real deals.
            </h2>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 mb-12">
            {[
              { value: "240+", label: "Deals scored in demo", context: "from pilot collectives and operators" },
              { value: "12", label: "Athletes in pilot", context: "across SEC, Big Ten, and Big 12" },
              { value: "50", label: "State rulesets", context: "loaded and compliance-tested" },
              { value: "<1s", label: "Score generation", context: "from input to verdict" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-mono font-bold text-nil-white mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-nil-muted uppercase tracking-wider mb-1">
                  {s.label}
                </div>
                <div className="text-[11px] text-nil-muted/60">{s.context}</div>
              </div>
            ))}
          </div>

          {/* Anonymized case snapshots */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <p className="text-nil-green text-xs uppercase tracking-widest mb-3">
                Pilot Snapshot
              </p>
              <p className="text-nil-text text-sm leading-relaxed mb-3">
                &ldquo;We ran 14 pending deals through NIL33 in one afternoon.
                Three were significantly above fair market. We renegotiated
                two and walked from one. <span className="text-nil-white font-medium">Total saved: $47K.</span>&rdquo;
              </p>
              <p className="text-nil-muted text-xs">
                — Operations lead, SEC collective (anonymized)
              </p>
            </div>
            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <p className="text-nil-green text-xs uppercase tracking-widest mb-3">
                Pilot Snapshot
              </p>
              <p className="text-nil-text text-sm leading-relaxed mb-3">
                &ldquo;Our board wanted documentation that we weren&apos;t just
                guessing. NIL33 receipts gave us exactly that — scored,
                timestamped, defensible. <span className="text-nil-white font-medium">First time we had real answers.</span>&rdquo;
              </p>
              <p className="text-nil-muted text-xs">
                — Board member, Big Ten collective (anonymized)
              </p>
            </div>
          </div>

          <p className="text-center text-nil-muted text-xs mt-8">
            Built by former QB development operators who watched
            millions move without a single valuation reference.
          </p>
        </div>
      </section>

      {/* ─── Urgency CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nil-green/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
            The next bad deal is already in your inbox.
          </h2>
          <p className="text-nil-muted mb-8 max-w-md mx-auto text-lg">
            You can sign it blind. Or you can check it first.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-nil-green text-nil-black font-bold px-8 py-4 rounded-xl hover:bg-nil-green/90 transition-all shadow-lg shadow-nil-green/20 text-sm"
            >
              Run Full Valuation →
            </Link>
            <a
              href="mailto:partnerships@nil33.com?subject=NIL33%20Collective%20Access"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-8 py-4 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Talk to Our Team
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
              <span className="text-nil-muted text-xs ml-2">Capital Discipline Software</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <Link href="/product" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Product</Link>
              <Link href="/collectives" className="text-xs text-nil-muted hover:text-nil-white transition-colors">For Collectives</Link>
              <Link href="/pricing" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Pricing</Link>
              <Link href="/demo" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Demo</Link>
              <Link href="/developers" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Developers</Link>
              <a href="https://under-center.netlify.app" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Under Center</a>
            </div>
            <p className="text-xs text-nil-muted">© {new Date().getFullYear()} NIL33</p>
          </div>
        </div>
      </footer>
    </>
  );
}
