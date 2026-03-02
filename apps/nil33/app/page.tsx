"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════
   NIL33 — Product Demonstration Homepage
   
   This is not a pitch. This is what we built.
   Show the product. Show the engine. Show the output.
   ═══════════════════════════════════════════════════ */

/* ---------- Scroll Reveal Hook ---------- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6" };
}

function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  const reveal = useReveal();
  return (
    <section id={id} ref={reveal.ref} className={`transition-all duration-700 ease-out ${reveal.className} ${className}`}>
      {children}
    </section>
  );
}

/* ──────────────────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/[0.06] shadow-2xl" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between">
        <a href="#" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center">
            <span className="text-black font-black text-sm">33</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">NIL33</span>
        </a>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase">
          <a href="#valuation" className="text-gray-500 hover:text-white transition-colors duration-200">Valuation</a>
          <a href="#compliance" className="text-gray-500 hover:text-white transition-colors duration-200">Compliance</a>
          <a href="#receipts" className="text-gray-500 hover:text-white transition-colors duration-200">Receipts</a>
          <a href="#architecture" className="text-gray-500 hover:text-white transition-colors duration-200">Architecture</a>
        </div>

        <a
          href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request"
          className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
        >
          Request Demo
        </a>
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────
   HERO — Statement + Product Preview
   ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-32 px-8 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00ff88]/[0.04] rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Statement */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              Infrastructure — Not a Marketplace
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8">
              <span className="text-white">NIL valuation</span>
              <br />
              <span className="text-white">and compliance</span>
              <br />
              <span className="text-[#00ff88]">infrastructure.</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mb-12">
              33 measurable factors. 50-state compliance routing.
              Cryptographic deal receipts. Built for athletes, collectives, 
              and institutions that need real numbers — not guesswork.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="mailto:kevanbtc@gmail.com?subject=NIL33 — Early Access"
                className="bg-[#00ff88] text-black px-7 py-4 rounded-xl text-sm font-bold hover:bg-[#00ff88]/90 transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
              >
                Request Early Access
              </a>
              <a href="#valuation" className="text-gray-500 text-sm font-medium hover:text-white transition-colors duration-200">
                See the engine ↓
              </a>
            </div>
          </div>

          {/* Right — Mock Product UI */}
          <div className="relative">
            <div className="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0d0d0d]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-gray-600 font-mono">nil33 / valuation-engine</span>
              </div>

              {/* Mock scorecard */}
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Athlete Valuation Report</div>
                    <div className="text-xl font-bold text-white">Marcus Johnson</div>
                    <div className="text-sm text-gray-400">QB · Georgia · Class of 2027</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-[#00ff88]">84.7</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">NIL Score</div>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Factor bars */}
                <div className="space-y-3">
                  {[
                    { label: "On-Field Performance", value: 91, color: "#00ff88" },
                    { label: "Recruiting Interest", value: 87, color: "#00ff88" },
                    { label: "Social Reach", value: 72, color: "#f59e0b" },
                    { label: "Brand Safety", value: 95, color: "#00ff88" },
                    { label: "Compliance Status", value: 100, color: "#00d4ff" },
                    { label: "Deal History", value: 64, color: "#f59e0b" },
                  ].map((f, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{f.label}</span>
                        <span className="text-white font-mono font-bold">{f.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${f.value}%`, backgroundColor: f.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Estimated Range</div>
                    <div className="text-lg font-bold text-white">$185K — $340K</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    <span className="text-xs text-gray-400">All 33 factors computed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   SYSTEM STATS BAR
   ────────────────────────────────────────────────── */
function SystemStats() {
  return (
    <Section className="py-16 px-8 border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/[0.06]">
          {[
            { value: "33", label: "Measurable Factors", sub: "Six categories" },
            { value: "50", label: "States Covered", sub: "Compliance routing" },
            { value: "14", label: "Sports Supported", sub: "Revenue & Olympic" },
            { value: "< 200ms", label: "Valuation Speed", sub: "Per athlete" },
          ].map((stat, i) => (
            <div key={i} className="md:px-10 first:md:pl-0 last:md:pr-0">
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-sm text-gray-300 font-medium mt-1">{stat.label}</div>
              <div className="text-xs text-gray-600 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   VALUATION ENGINE — Show the product
   ────────────────────────────────────────────────── */
function ValuationEngine() {
  return (
    <Section id="valuation" className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — Explanation */}
          <div>
            <div className="text-[#00ff88] text-xs font-bold uppercase tracking-[0.2em] mb-6">Valuation Engine</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-8">
              33 factors.<br />
              <span className="text-gray-500">Not follower counts.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              Most platforms estimate NIL value from social media followers. 
              NIL33 computes a deterministic score from 33 measurable signals 
              across six weighted categories.
            </p>

            <div className="space-y-6">
              {[
                { cat: "Identity Verification", desc: "KYC, age, eligibility, school enrollment", weight: "12%" },
                { cat: "On-Field Performance", desc: "Game stats, film grades, seasonal trajectory", weight: "28%" },
                { cat: "Recruiting Interest", desc: "Rankings, offers, visit history, portal activity", weight: "22%" },
                { cat: "Social & Brand Reach", desc: "Followers, engagement rate, content quality, brand safety", weight: "18%" },
                { cat: "Compliance Status", desc: "State law, school rules, prior violations, active flags", weight: "12%" },
                { cat: "Deal History", desc: "Past contracts, fulfillment rate, dispute record", weight: "8%" },
              ].map((c, i) => (
                <div key={i} className="group">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-semibold text-white group-hover:text-[#00ff88] transition-colors duration-200">{c.cat}</span>
                    <span className="text-xs font-mono text-[#00ff88]/60">{c.weight}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mock 33-factor grid */}
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs text-gray-500 uppercase tracking-widest">33 Factor Heatmap</div>
              <div className="flex items-center gap-3 text-[10px] text-gray-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#00ff88]" /> Strong</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#f59e0b]" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ef4444]" /> Weak</span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {/* 33 cells + 3 empty for clean 6x6 grid */}
              {[
                "#00ff88","#00ff88","#00ff88","#f59e0b","#00ff88","#00ff88",
                "#00ff88","#f59e0b","#00ff88","#00ff88","#00ff88","#f59e0b",
                "#00ff88","#00ff88","#ef4444","#00ff88","#f59e0b","#00ff88",
                "#00ff88","#00ff88","#00ff88","#f59e0b","#00ff88","#00ff88",
                "#00ff88","#00d4ff","#00d4ff","#00ff88","#00ff88","#f59e0b",
                "#f59e0b","#00ff88","#00ff88","transparent","transparent","transparent",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md transition-all duration-300 ${color === "transparent" ? "" : "hover:scale-110 hover:shadow-lg cursor-default"}`}
                  style={{ backgroundColor: color === "transparent" ? "transparent" : color, opacity: color === "transparent" ? 0 : 0.7 }}
                  title={i < 33 ? `Factor ${i + 1}` : ""}
                />
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Composite Score</div>
                <div className="text-2xl font-black text-[#00ff88] font-mono">84.7 / 100</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="text-sm font-mono text-white">High — 31/33 verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   COMPLIANCE ENGINE — Show the system
   ────────────────────────────────────────────────── */
function ComplianceEngine() {
  return (
    <Section id="compliance" className="py-32 px-8 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — Mock compliance check UI */}
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden order-2 lg:order-1">
            <div className="px-6 py-4 border-b border-white/[0.06] bg-[#0d0d0d]">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Compliance Check — Real-Time</div>
            </div>
            <div className="p-6 space-y-4">
              {/* State check */}
              <div className="flex items-start gap-3 p-4 bg-[#00ff88]/[0.04] border border-[#00ff88]/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ff88] text-xs">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Georgia State Law — Passed</div>
                  <div className="text-xs text-gray-500 mt-0.5">SB 290 (2021) — No institutional involvement required. Agent disclosure required for deals &gt;$5,000.</div>
                </div>
              </div>

              {/* School check */}
              <div className="flex items-start gap-3 p-4 bg-[#00ff88]/[0.04] border border-[#00ff88]/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ff88] text-xs">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">University Policy — Passed</div>
                  <div className="text-xs text-gray-500 mt-0.5">72-hour disclosure window. No use of institutional marks without approval. Compliance office notified.</div>
                </div>
              </div>

              {/* NCAA check */}
              <div className="flex items-start gap-3 p-4 bg-[#00ff88]/[0.04] border border-[#00ff88]/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ff88] text-xs">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">NCAA Guidelines — Passed</div>
                  <div className="text-xs text-gray-500 mt-0.5">No pay-for-play indicators. No recruiting inducement flags. Deal structure compliant.</div>
                </div>
              </div>

              {/* Warning example */}
              <div className="flex items-start gap-3 p-4 bg-[#f59e0b]/[0.04] border border-[#f59e0b]/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#f59e0b] text-xs">!</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Agent Disclosure — Action Required</div>
                  <div className="text-xs text-gray-500 mt-0.5">Deal value exceeds $5,000. Georgia law requires agent disclosure filing within 7 days of execution.</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    <span className="text-xs text-gray-400">3 of 4 checks passed</span>
                  </div>
                  <span className="text-xs font-mono text-[#f59e0b]">1 action required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Explanation */}
          <div className="order-1 lg:order-2">
            <div className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.2em] mb-6">Compliance Engine</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-8">
              50-state<br />
              <span className="text-gray-500">compliance routing.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              Every state has different NIL laws. Every school has its own rules. 
              NIL33 checks every deal against all of them — automatically — and 
              flags issues before they become violations.
            </p>

            <div className="space-y-4">
              {[
                { label: "State Law Check", desc: "Automated match against current legislation in the athlete's home state and school state." },
                { label: "Institution Rules", desc: "Cross-reference with school-specific NIL policies, disclosure windows, and mark usage rules." },
                { label: "NCAA / Conference", desc: "Verify deal structure doesn't trigger pay-for-play or inducement flags." },
                { label: "Risk Scoring", desc: "Each deal receives a compliance risk score. High-risk deals are flagged before execution." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-white/[0.04] last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#00d4ff] text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   DEAL RECEIPTS — Show the output
   ────────────────────────────────────────────────── */
function DealReceipts() {
  return (
    <Section id="receipts" className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — Explanation */}
          <div>
            <div className="text-[#a855f7] text-xs font-bold uppercase tracking-[0.2em] mb-6">Deal Receipts</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-8">
              Verifiable proof.<br />
              <span className="text-gray-500">Every deal. Every time.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              Every NIL deal processed through NIL33 generates a cryptographic 
              receipt — timestamped, signed, and immutable. No more handshake deals. 
              No more he-said-she-said.
            </p>

            <div className="space-y-4">
              {[
                "Timestamped at execution with SHA-256 hash",
                "Both parties digitally sign the receipt",
                "Compliance status recorded at time of deal",
                "Immutable — cannot be altered after creation",
                "Exportable for audits, tax filings, and disputes",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mock receipt */}
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] bg-[#0d0d0d] flex items-center justify-between">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Deal Receipt</div>
              <div className="text-xs font-mono text-[#a855f7]">VERIFIED</div>
            </div>
            <div className="p-6 space-y-5 font-mono text-xs">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">Receipt ID</span><span className="text-white">NIL33-2026-00847</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Athlete</span><span className="text-white">Marcus Johnson</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Brand</span><span className="text-white">SportFuel Athletics</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Deal Type</span><span className="text-white">Social Media Campaign</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="text-[#00ff88] font-bold">$12,500.00</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="text-white">90 days</span></div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">Compliance</span><span className="text-[#00ff88]">PASSED — 4/4</span></div>
                <div className="flex justify-between"><span className="text-gray-500">NIL Score at Signing</span><span className="text-white">84.7</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Market Range</span><span className="text-white">$9,200 — $18,400</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fair Market</span><span className="text-[#00ff88]">WITHIN RANGE</span></div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="space-y-2">
                <div className="text-gray-500">Executed</div>
                <div className="text-white">2026-02-14T18:32:07Z</div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-500">SHA-256</div>
                <div className="text-[#a855f7]/60 break-all leading-relaxed">a7f3b2c1d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2</div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span className="text-gray-400">Digitally signed by both parties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   ARCHITECTURE — System diagram
   ────────────────────────────────────────────────── */
function Architecture() {
  return (
    <Section id="architecture" className="py-32 px-8 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.2em] mb-6">System Architecture</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-6">
            How it&apos;s built.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            NIL33 is a three-layer system: data ingestion, computation engine, 
            and output layer. Each layer is independently verifiable.
          </p>
        </div>

        {/* Architecture flow diagram */}
        <div className="grid md:grid-cols-3 gap-0">
          {[
            {
              layer: "Layer 1",
              title: "Data Ingestion",
              color: "#00ff88",
              items: ["Identity verification", "Performance data feeds", "Social media APIs", "Recruiting databases", "State law database", "School policy registry"],
            },
            {
              layer: "Layer 2",
              title: "Computation Engine",
              color: "#00d4ff",
              items: ["33-factor scoring model", "Weighted category analysis", "Compliance rule matching", "Fair market calculation", "Risk scoring algorithm", "Deal simulation engine"],
            },
            {
              layer: "Layer 3",
              title: "Output & Verification",
              color: "#a855f7",
              items: ["Valuation reports", "Compliance certificates", "Deal receipts (SHA-256)", "Audit logs", "API endpoints", "Institutional dashboards"],
            },
          ].map((layer, i) => (
            <div key={i} className="relative">
              <div className={`border border-white/[0.08] rounded-2xl p-8 mx-2 h-full ${i === 1 ? "bg-white/[0.02] border-white/[0.12]" : ""}`}>
                <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: layer.color }}>{layer.layer}</div>
                <h3 className="text-xl font-black text-white mb-6">{layer.title}</h3>
                <div className="space-y-3">
                  {layer.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3 group">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: layer.color }} />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Arrow between columns */}
              {i < 2 && (
                <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 bg-[#111] border border-white/[0.08] rounded-full items-center justify-center">
                  <span className="text-gray-500 text-xs">→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="mt-20 border border-white/[0.06] rounded-xl p-8 bg-[#111]">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-6">Technology Stack</div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { tech: "Next.js", role: "Frontend" },
              { tech: "TypeScript", role: "Type Safety" },
              { tech: "Prisma", role: "Data Layer" },
              { tech: "Rust", role: "Valuation Engine" },
              { tech: "PostgreSQL", role: "Storage" },
              { tech: "Tailwind", role: "Design System" },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-bold text-white">{t.tech}</div>
                <div className="text-xs text-gray-600 mt-0.5">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   WHO THIS IS FOR — Clear segmentation
   ────────────────────────────────────────────────── */
function WhoItsFor() {
  return (
    <Section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Built for the NIL ecosystem.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Athletes",
              desc: "Know your value. Verify compliance. Build a real track record of deals.",
              color: "#00ff88",
              items: ["Free valuation", "Compliance pre-check", "Deal receipts", "Score history"],
            },
            {
              title: "Collectives",
              desc: "Stop guessing. See data-backed valuations. Manage capital with discipline.",
              color: "#f59e0b",
              items: ["Roster valuations", "Deal simulation", "Spend tracking", "API access"],
            },
            {
              title: "Compliance",
              desc: "Audit trails. Risk flags. 50-state coverage. Protect your program.",
              color: "#00d4ff",
              items: ["Auto rule-check", "Violation prevention", "Audit export", "Risk scoring"],
            },
            {
              title: "Brands",
              desc: "Find the right athlete. Verify the value. Execute compliant deals.",
              color: "#a855f7",
              items: ["Athlete matching", "Value verification", "Risk screening", "Deal structure"],
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#111] border border-white/[0.08] rounded-2xl p-7 hover:border-white/[0.15] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${item.color}12` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors duration-200">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{item.desc}</p>
              <div className="space-y-2">
                {item.items.map((feat, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   CTA — One clear action
   ────────────────────────────────────────────────── */
function CTA() {
  return (
    <Section className="py-32 px-8 bg-[#0d0d0d]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          See it in action.
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-12 max-w-xl mx-auto">
          NIL33 is in early access. Request a demo to see the valuation engine, 
          compliance checks, and deal receipt system for yourself.
        </p>
        <a
          href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request"
          className="inline-flex items-center gap-3 bg-[#00ff88] text-black px-10 py-5 rounded-xl text-lg font-bold hover:bg-[#00ff88]/90 transition-all duration-200 hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]"
        >
          Request a Demo
          <span className="text-sm opacity-60">→</span>
        </a>
        <p className="text-xs text-gray-600 mt-6">
          Early access · No commitment · Response within 24 hours
        </p>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────
   FOOTER — Professional, complete
   ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-20 px-8 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-[#00ff88] flex items-center justify-center">
                <span className="text-black font-black text-[10px]">33</span>
              </div>
              <span className="text-base font-bold text-white">NIL33</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Deterministic NIL valuation and compliance infrastructure.
            </p>
            <p className="text-xs text-gray-600">
              Norcross, Georgia 30092<br />
              A UnyKorn Company
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#valuation" className="hover:text-white transition-colors duration-200">Valuation Engine</a></li>
              <li><a href="#compliance" className="hover:text-white transition-colors duration-200">Compliance Engine</a></li>
              <li><a href="#receipts" className="hover:text-white transition-colors duration-200">Deal Receipts</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors duration-200">Architecture</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="https://github.com/FTHTrading/nil33" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">GitHub</a></li>
              <li><a href="mailto:kevanbtc@gmail.com" className="hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request" className="hover:text-white transition-colors duration-200">Request Demo</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li className="text-gray-600">Privacy Policy — Coming Soon</li>
              <li className="text-gray-600">Terms of Service — Coming Soon</li>
              <li className="text-gray-600">Security — SOC 2 Planned</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 NIL33 — A UnyKorn Company. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Identity · Value · Legacy
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen antialiased">
      <Nav />
      <Hero />
      <SystemStats />
      <ValuationEngine />
      <ComplianceEngine />
      <DealReceipts />
      <Architecture />
      <WhoItsFor />
      <CTA />
      <Footer />
    </main>
  );
}
