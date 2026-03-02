"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /demo
   
   Interactive valuation demo.
   Input → Score → Compliance → Receipt
   All client-side with realistic mock logic.
   ═══════════════════════════════════════════════════ */

/* ─── Mock scoring engine ─── */
type DemoResult = {
  athleteName: string;
  position: string;
  school: string;
  state: string;
  conference: string;
  social: number;
  athletic: number;
  market: number;
  brand: number;
  composite: number;
  valuationLow: number;
  valuationHigh: number;
  proposedAmount: number;
  overpay: number;
  compliance: {
    stateLaw: "pass" | "fail" | "review";
    conferenceRules: "pass" | "fail" | "review";
    ncaa: "pass" | "fail" | "review";
    notes: string[];
  };
  receiptId: string;
  timestamp: string;
};

function scoreDeal(
  name: string,
  position: string,
  school: string,
  state: string,
  conference: string,
  followers: number,
  engagement: number,
  proposed: number
): DemoResult {
  // Deterministic-ish mock scoring based on inputs
  const seed = (name + position + school).length;

  const social = Math.min(
    99,
    Math.max(
      20,
      Math.round(
        (Math.log10(Math.max(followers, 100)) / Math.log10(10000000)) * 70 +
          engagement * 200 +
          ((seed % 7) - 3)
      )
    )
  );

  const positionBoost: Record<string, number> = {
    QB: 15,
    WR: 8,
    RB: 6,
    TE: 4,
    OL: 2,
    DL: 5,
    LB: 6,
    DB: 7,
    K: 1,
    P: 1,
  };
  const confBoost: Record<string, number> = {
    SEC: 12,
    "Big Ten": 10,
    "Big 12": 8,
    ACC: 7,
    "Pac-12": 6,
    AAC: 3,
    "Sun Belt": 2,
    "Conf USA": 2,
    MAC: 1,
    MWC: 2,
    Independent: 4,
  };

  const athletic = Math.min(
    99,
    Math.max(
      25,
      50 + (positionBoost[position] || 5) + (confBoost[conference] || 3) + ((seed % 11) - 5)
    )
  );
  const market = Math.min(
    99,
    Math.max(
      20,
      40 + (confBoost[conference] || 3) * 1.5 + (positionBoost[position] || 3) * 0.8 + ((seed % 9) - 4)
    )
  );
  const brand = Math.min(
    99,
    Math.max(20, Math.round(social * 0.4 + athletic * 0.2 + market * 0.3 + ((seed % 13) - 6)))
  );

  const composite = Math.round(
    social * 0.25 + athletic * 0.30 + market * 0.25 + brand * 0.20
  );

  // Valuation band: composite → dollar range
  const baseDollar = composite * 800;
  const valuationLow = Math.round(baseDollar * 0.85 / 1000) * 1000;
  const valuationHigh = Math.round(baseDollar * 1.15 / 1000) * 1000;

  const overpay = Math.max(0, proposed - valuationHigh);

  // Compliance logic
  const overFairValue = proposed > valuationHigh * 1.2;
  const notes: string[] = [];
  let ncaaStatus: "pass" | "fail" | "review" = "pass";
  if (overFairValue) {
    ncaaStatus = "review";
    notes.push(
      `Proposed amount ($${proposed.toLocaleString()}) exceeds NIL33 fair value band by ${Math.round(
        ((proposed - valuationHigh) / valuationHigh) * 100
      )}%. This gap may trigger NCAA pay-for-play scrutiny.`
    );
  }
  if (proposed > valuationHigh) {
    notes.push(
      `Consider negotiating within the $${valuationLow.toLocaleString()}–$${valuationHigh.toLocaleString()} range.`
    );
  }

  const receiptId = `NIL33-${new Date().getFullYear()}-${String(
    Math.floor(Math.random() * 99999)
  ).padStart(5, "0")}`;

  return {
    athleteName: name,
    position,
    school,
    state,
    conference,
    social,
    athletic,
    market,
    brand,
    composite,
    valuationLow,
    valuationHigh,
    proposedAmount: proposed,
    overpay,
    compliance: {
      stateLaw: "pass",
      conferenceRules: "pass",
      ncaa: ncaaStatus,
      notes,
    },
    receiptId,
    timestamp: new Date().toISOString(),
  };
}

export default function DemoPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("QB");
  const [school, setSchool] = useState("");
  const [state, setState] = useState("Georgia");
  const [conference, setConference] = useState("SEC");
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [proposed, setProposed] = useState("");
  const [result, setResult] = useState<DemoResult | null>(null);
  const [running, setRunning] = useState(false);

  const canRun =
    name.trim() && school.trim() && followers && proposed;

  function runDemo() {
    if (!canRun) return;
    setRunning(true);
    // simulate processing delay
    setTimeout(() => {
      const r = scoreDeal(
        name,
        position,
        school,
        state,
        conference,
        parseInt(followers) || 0,
        parseFloat(engagement) || 0.03,
        parseInt(proposed) || 0
      );
      setResult(r);
      setRunning(false);
    }, 1200);
  }

  function reset() {
    setResult(null);
    setName("");
    setSchool("");
    setFollowers("");
    setEngagement("");
    setProposed("");
  }

  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            Demo
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-4">
            Run a valuation.
          </h1>
          <p className="text-lg text-nil-muted max-w-md mx-auto">
            Enter an athlete&apos;s details below. NIL33 will score them,
            check compliance, and show you whether the deal is fair.
          </p>
        </div>
      </section>

      {/* ─── Demo UI ─── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {!result ? (
            /* ─── Input Form ─── */
            <div className="max-w-lg mx-auto bg-nil-dark border border-nil-border rounded-2xl p-8">
              <h2 className="text-nil-white font-semibold text-lg mb-6">
                Deal Details
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                    Athlete Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Williams"
                    className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Position
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50"
                    >
                      {["QB", "WR", "RB", "TE", "OL", "DL", "LB", "DB", "K", "P"].map(
                        (p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      School
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g. Georgia"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50"
                    >
                      {[
                        "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
                        "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
                        "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
                        "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
                        "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
                        "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
                        "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
                        "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Conference
                    </label>
                    <select
                      value={conference}
                      onChange={(e) => setConference(e.target.value)}
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50"
                    >
                      {[
                        "SEC","Big Ten","Big 12","ACC","Pac-12","AAC","Sun Belt",
                        "Conf USA","MAC","MWC","Independent",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Social Followers
                    </label>
                    <input
                      type="number"
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50"
                    />
                  </div>
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">
                      Engagement Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={engagement}
                      onChange={(e) => setEngagement(e.target.value)}
                      placeholder="e.g. 0.04"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50"
                    />
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
                    className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50"
                  />
                </div>

                <button
                  onClick={runDemo}
                  disabled={!canRun || running}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                    canRun && !running
                      ? "bg-nil-green text-nil-black hover:bg-nil-green/90 cursor-pointer"
                      : "bg-nil-gray text-nil-muted cursor-not-allowed"
                  }`}
                >
                  {running ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-nil-black/30 border-t-nil-black rounded-full animate-spin" />
                      Scoring...
                    </span>
                  ) : (
                    "Run Valuation →"
                  )}
                </button>
              </div>

              <p className="text-nil-muted text-xs mt-4 text-center">
                Demo uses mock scoring. Production uses the full 33-factor engine.
              </p>
            </div>
          ) : (
            /* ─── Results ─── */
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Score + Valuation */}
                <div className="space-y-6">
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                      Athlete Profile
                    </p>
                    <h3 className="text-nil-white font-bold text-xl mb-1">
                      {result.athleteName}
                    </h3>
                    <p className="text-nil-muted text-sm">
                      {result.position} · {result.school} · {result.conference}
                    </p>
                    <p className="text-nil-muted text-sm">{result.state}</p>
                  </div>

                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                      Composite Score
                    </p>
                    <div className="flex items-end gap-4 mb-4">
                      <span className="text-nil-green font-mono text-6xl font-extrabold leading-none">
                        {result.composite}
                      </span>
                      <span className="text-nil-muted text-sm mb-1">/99</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Social", value: result.social, color: "#00ff88" },
                        { label: "Athletic", value: result.athletic, color: "#00d4ff" },
                        { label: "Market", value: result.market, color: "#a855f7" },
                        { label: "Brand", value: result.brand, color: "#f59e0b" },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p
                            className="font-mono font-bold text-lg"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </p>
                          <p className="text-nil-muted text-[10px] uppercase tracking-wider">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                      Valuation
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-nil-muted text-sm">
                          Fair Value Band
                        </span>
                        <span className="text-nil-white font-mono font-bold">
                          ${result.valuationLow.toLocaleString()}–$
                          {result.valuationHigh.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-nil-muted text-sm">
                          Proposed Amount
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            result.overpay > 0
                              ? "text-nil-red"
                              : "text-nil-green"
                          }`}
                        >
                          ${result.proposedAmount.toLocaleString()}
                        </span>
                      </div>
                      {result.overpay > 0 && (
                        <>
                          <div className="h-px bg-nil-border" />
                          <div className="flex justify-between items-baseline">
                            <span className="text-nil-muted text-sm">
                              Overpay
                            </span>
                            <span className="text-nil-red font-mono font-bold text-xl">
                              ${result.overpay.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Compliance + Receipt */}
                <div className="space-y-6">
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                      Compliance Check
                    </p>
                    <div className="space-y-3">
                      {[
                        {
                          label: "State NIL Law",
                          status: result.compliance.stateLaw,
                        },
                        {
                          label: "Conference Rules",
                          status: result.compliance.conferenceRules,
                        },
                        {
                          label: "NCAA Guidelines",
                          status: result.compliance.ncaa,
                        },
                      ].map((c) => (
                        <div
                          key={c.label}
                          className="flex justify-between items-center"
                        >
                          <span className="text-nil-muted text-sm">
                            {c.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                c.status === "pass"
                                  ? "bg-nil-green"
                                  : c.status === "review"
                                  ? "bg-nil-gold"
                                  : "bg-nil-red"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium capitalize ${
                                c.status === "pass"
                                  ? "text-nil-green"
                                  : c.status === "review"
                                  ? "text-nil-gold"
                                  : "text-nil-red"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {result.compliance.notes.length > 0 && (
                      <div className="mt-4 bg-nil-gray border border-nil-border rounded-lg p-3">
                        {result.compliance.notes.map((note, i) => (
                          <p key={i} className="text-nil-gold text-xs mb-1 last:mb-0">
                            ⚠ {note}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">
                      Deal Receipt
                    </p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Receipt ID</span>
                        <span className="text-nil-white font-mono text-xs">
                          {result.receiptId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Athlete</span>
                        <span className="text-nil-white">
                          {result.athleteName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Score</span>
                        <span className="text-nil-green font-mono">
                          {result.composite}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Fair Value</span>
                        <span className="text-nil-white font-mono">
                          ${result.valuationLow.toLocaleString()}–$
                          {result.valuationHigh.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Proposed</span>
                        <span
                          className={`font-mono ${
                            result.overpay > 0
                              ? "text-nil-red"
                              : "text-nil-green"
                          }`}
                        >
                          ${result.proposedAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Compliance</span>
                        <span
                          className={
                            result.compliance.ncaa === "pass"
                              ? "text-nil-green"
                              : "text-nil-gold"
                          }
                        >
                          {result.compliance.ncaa === "pass"
                            ? "All Clear"
                            : "Review Required"}
                        </span>
                      </div>
                      <div className="h-px bg-nil-border" />
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Generated</span>
                        <span className="text-nil-muted font-mono text-xs">
                          {result.timestamp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Signature</span>
                        <span className="text-nil-purple font-mono text-xs">
                          ed25519:
                          {Array.from({ length: 8 }, () =>
                            Math.floor(Math.random() * 16).toString(16)
                          ).join("")}
                          …
                          {Array.from({ length: 4 }, () =>
                            Math.floor(Math.random() * 16).toString(16)
                          ).join("")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div
                    className={`rounded-2xl p-6 border ${
                      result.overpay > 0
                        ? "bg-nil-red/5 border-nil-red/20"
                        : "bg-nil-green/5 border-nil-green/20"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest mb-2 text-nil-muted">
                      Verdict
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        result.overpay > 0 ? "text-nil-red" : "text-nil-green"
                      }`}
                    >
                      {result.overpay > 0
                        ? `Overpaying by $${result.overpay.toLocaleString()}`
                        : "Deal is within fair value range"}
                    </p>
                    <p className="text-nil-muted text-sm mt-1">
                      {result.overpay > 0
                        ? `Consider negotiating within the $${result.valuationLow.toLocaleString()}–$${result.valuationHigh.toLocaleString()} range.`
                        : "This deal aligns with NIL33's composite valuation."}
                    </p>
                  </div>

                  <button
                    onClick={reset}
                    className="w-full py-3 bg-nil-gray border border-nil-border text-nil-white rounded-xl text-sm font-medium hover:border-nil-green/30 transition-colors cursor-pointer"
                  >
                    Run Another Valuation
                  </button>
                </div>
              </div>

              <div className="text-center mt-10">
                <p className="text-nil-muted text-xs mb-4">
                  This is a demo with mock scoring. The production engine uses
                  the full 33-factor model with real-time data feeds.
                </p>
                <a
                  href="mailto:partnerships@nil33.com?subject=NIL33%20Access"
                  className="text-nil-green text-sm hover:underline"
                >
                  Ready for real valuations? Talk to us →
                </a>
              </div>
            </div>
          )}
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
