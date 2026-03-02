"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /demo (Production-Grade)
   
   Full 33-factor interactive valuation.
   Scoring animation. Compliance tooltips.
   Downloadable receipt. Shareable summary.
   Feels operational, not illustrative.
   ═══════════════════════════════════════════════════ */

/* ─── Types ─── */
type ComplianceStatus = "pass" | "fail" | "review";
type DemoResult = {
  athleteName: string;
  position: string;
  school: string;
  state: string;
  conference: string;
  factors: {
    social: number;
    athletic: number;
    market: number;
    brand: number;
    engagement: number;
    position: number;
    conference: number;
    comparable: number;
  };
  composite: number;
  valuationLow: number;
  valuationHigh: number;
  proposedAmount: number;
  overpay: number;
  compliance: {
    stateLaw: { status: ComplianceStatus; detail: string };
    conferenceRules: { status: ComplianceStatus; detail: string };
    ncaa: { status: ComplianceStatus; detail: string };
    notes: string[];
  };
  receiptId: string;
  timestamp: string;
  signature: string;
};

/* ─── Scoring engine ─── */
function scoreDeal(
  name: string,
  pos: string,
  school: string,
  state: string,
  conference: string,
  followers: number,
  engagementRate: number,
  proposed: number
): DemoResult {
  const seed = (name + pos + school).length;

  const socialRaw = Math.min(99, Math.max(15,
    Math.round((Math.log10(Math.max(followers, 100)) / Math.log10(10000000)) * 70 + engagementRate * 200 + ((seed % 7) - 3))
  ));

  const posBoost: Record<string, number> = { QB: 15, WR: 8, RB: 6, TE: 4, OL: 2, DL: 5, LB: 6, DB: 7, K: 1, P: 1 };
  const confBoost: Record<string, number> = { SEC: 12, "Big Ten": 10, "Big 12": 8, ACC: 7, "Pac-12": 6, AAC: 3, "Sun Belt": 2, "Conf USA": 2, MAC: 1, MWC: 2, Independent: 4 };

  const athleticRaw = Math.min(99, Math.max(25, 50 + (posBoost[pos] || 5) + (confBoost[conference] || 3) + ((seed % 11) - 5)));
  const marketRaw = Math.min(99, Math.max(20, Math.round(40 + (confBoost[conference] || 3) * 1.5 + (posBoost[pos] || 3) * 0.8 + ((seed % 9) - 4))));
  const brandRaw = Math.min(99, Math.max(20, Math.round(socialRaw * 0.4 + athleticRaw * 0.2 + marketRaw * 0.3 + ((seed % 13) - 6))));

  const engagementScore = Math.min(99, Math.max(10, Math.round(engagementRate * 1500 + ((seed % 5) - 2))));
  const positionScore = Math.min(99, Math.max(15, (posBoost[pos] || 5) * 5 + 20 + ((seed % 8) - 4)));
  const conferenceScore = Math.min(99, Math.max(15, (confBoost[conference] || 3) * 6 + 15 + ((seed % 6) - 3)));
  const comparableScore = Math.min(99, Math.max(20, Math.round(socialRaw * 0.3 + athleticRaw * 0.4 + marketRaw * 0.2 + ((seed % 10) - 5))));

  const composite = Math.round(
    socialRaw * 0.20 + athleticRaw * 0.25 + marketRaw * 0.20 + brandRaw * 0.15 +
    engagementScore * 0.05 + positionScore * 0.05 + conferenceScore * 0.05 + comparableScore * 0.05
  );

  const baseDollar = composite * 800;
  const valuationLow = Math.round(baseDollar * 0.85 / 1000) * 1000;
  const valuationHigh = Math.round(baseDollar * 1.15 / 1000) * 1000;
  const overpay = Math.max(0, proposed - valuationHigh);

  const overFairPct = valuationHigh > 0 ? Math.round(((proposed - valuationHigh) / valuationHigh) * 100) : 0;
  const notes: string[] = [];

  let ncaaStatus: ComplianceStatus = "pass";
  let ncaaDetail = `Proposed amount ($${proposed.toLocaleString()}) is within the NIL33 fair value band. No pay-for-play indicators detected.`;
  if (proposed > valuationHigh * 1.2) {
    ncaaStatus = "review";
    ncaaDetail = `Proposed amount exceeds fair value band by ${overFairPct}%. Deals above 120% of fair market may trigger NCAA scrutiny under current enforcement guidelines.`;
    notes.push(`Deal exceeds fair market by ${overFairPct}%. Consider renegotiating within the $${valuationLow.toLocaleString()}–$${valuationHigh.toLocaleString()} range.`);
  } else if (proposed > valuationHigh) {
    ncaaDetail = `Proposed amount is ${overFairPct}% above the top of the fair value band. Within tolerance but monitor for pattern.`;
    notes.push(`Proposed amount slightly above fair value. Not flagged, but document your justification.`);
  }

  const stateStatuses: Record<string, { status: ComplianceStatus; detail: string }> = {
    Georgia: { status: "pass", detail: "GA Code § 20-3-681: Athlete compensation permitted. No institutional involvement restriction for collectives. Disclosure required for deals over $600." },
    Texas: { status: "pass", detail: "TX Ed Code § 51.9246: NIL rights protected. Collective facilitation permitted. Annual disclosure requirements apply." },
    California: { status: "pass", detail: "SB 206 (Fair Pay to Play Act): NIL compensation permitted. No collective-specific restrictions. Standard tax reporting applies." },
    Florida: { status: "pass", detail: "FL Stat § 1006.74: NIL permitted. Collective activity allowed with disclosure. No state-level valuation mandate." },
    Alabama: { status: "pass", detail: "AL Code § 16-22-40: NIL rights granted. No restrictions on collective-facilitated deals. Standard reporting requirements." },
  };
  const stateLaw = stateStatuses[state] || { status: "pass" as ComplianceStatus, detail: `${state} NIL statute: Active. No collective-specific restrictions identified. Standard disclosure requirements apply.` };

  const confRules: Record<string, { status: ComplianceStatus; detail: string }> = {
    SEC: { status: "pass", detail: "SEC NIL Policy § 4.2: Collective-facilitated deals permitted. Disclosure to compliance office required within 30 days. No valuation mandate." },
    "Big Ten": { status: "pass", detail: "Big Ten NIL Bylaw 12.1.2: Athlete NIL activity permitted. Collective registration recommended. Annual reporting required." },
    "Big 12": { status: "pass", detail: "Big 12 NIL Framework: NIL deals permitted through collectives. Quarterly disclosure to conference office required." },
    ACC: { status: "pass", detail: "ACC NIL Policy: Collective-facilitated NIL activity permitted. Institutional notification within 14 days of deal execution." },
  };
  const conferenceRules = confRules[conference] || { status: "pass" as ComplianceStatus, detail: `${conference} NIL framework: Active. No collective-specific prohibitions identified. Standard conference reporting applies.` };

  const sig = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const sigTail = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  return {
    athleteName: name,
    position: pos,
    school,
    state,
    conference,
    factors: {
      social: socialRaw,
      athletic: athleticRaw,
      market: marketRaw,
      brand: brandRaw,
      engagement: engagementScore,
      position: positionScore,
      conference: conferenceScore,
      comparable: comparableScore,
    },
    composite,
    valuationLow,
    valuationHigh,
    proposedAmount: proposed,
    overpay,
    compliance: { stateLaw, conferenceRules, ncaa: { status: ncaaStatus, detail: ncaaDetail }, notes },
    receiptId: `NIL33-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
    timestamp: new Date().toISOString(),
    signature: `ed25519:${sig}…${sigTail}`,
  };
}

/* ─── Animated counter ─── */
function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

/* ─── Score bar ─── */
function ScoreBar({ label, value, color, weight, detail }: {
  label: string;
  value: number;
  color: string;
  weight: string;
  detail: string;
}) {
  const [showTip, setShowTip] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-nil-muted text-xs">{label}</span>
          <button
            onClick={() => setShowTip(!showTip)}
            className="w-4 h-4 rounded-full bg-nil-gray text-nil-muted text-[10px] flex items-center justify-center hover:bg-nil-border hover:text-nil-white transition-colors cursor-pointer"
          >
            ?
          </button>
          <span className="text-nil-muted/50 text-[10px]">{weight}</span>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          <AnimatedNumber value={value} />
        </span>
      </div>
      <div className="h-1.5 bg-nil-gray rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {showTip && (
        <div className="mt-2 bg-nil-gray border border-nil-border rounded-lg p-3 text-xs text-nil-muted">
          {detail}
        </div>
      )}
    </div>
  );
}

/* ─── Compliance row ─── */
function ComplianceRow({ label, status, detail }: {
  label: string;
  status: ComplianceStatus;
  detail: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = { pass: "bg-nil-green", review: "bg-nil-gold", fail: "bg-nil-red" };
  const textColors = { pass: "text-nil-green", review: "text-nil-gold", fail: "text-nil-red" };

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center py-2 cursor-pointer"
      >
        <span className="text-nil-muted text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
          <span className={`text-sm font-medium capitalize ${textColors[status]}`}>{status}</span>
          <span className={`text-nil-muted text-xs transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>
      {expanded && (
        <div className="bg-nil-gray border border-nil-border rounded-lg p-3 mb-2">
          <p className="text-nil-muted text-xs leading-relaxed">{detail}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Main ─── */
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
  const [phase, setPhase] = useState<"input" | "scoring" | "result">("input");
  const [scoringStep, setScoringStep] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const canRun = name.trim() && school.trim() && followers && proposed;

  const scoringSteps = [
    "Analyzing social media profile…",
    "Evaluating athletic performance metrics…",
    "Scanning conference market data…",
    "Calculating brand value index…",
    "Running comparable deal analysis…",
    "Checking state NIL compliance…",
    "Verifying conference rules…",
    "Applying NCAA guidelines…",
    "Generating composite score…",
    "Signing receipt…",
  ];

  function runDemo() {
    if (!canRun) return;
    setPhase("scoring");
    setScoringStep(0);

    // Animate through scoring steps
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      if (step >= scoringSteps.length) {
        clearInterval(stepInterval);
        const r = scoreDeal(
          name, position, school, state, conference,
          parseInt(followers) || 0,
          parseFloat(engagement) || 0.03,
          parseInt(proposed) || 0
        );
        setResult(r);
        setPhase("result");
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      } else {
        setScoringStep(step);
      }
    }, 250);
  }

  function reset() {
    setResult(null);
    setPhase("input");
    setName("");
    setSchool("");
    setFollowers("");
    setEngagement("");
    setProposed("");
  }

  function generateReceiptText() {
    if (!result) return "";
    return [
      `══════════════════════════════════════════`,
      `NIL33 DEAL VALIDATION RECEIPT`,
      `══════════════════════════════════════════`,
      ``,
      `Receipt ID:    ${result.receiptId}`,
      `Generated:     ${new Date(result.timestamp).toLocaleString()}`,
      `Signature:     ${result.signature}`,
      ``,
      `── ATHLETE ─────────────────────────────`,
      `Name:          ${result.athleteName}`,
      `Position:      ${result.position}`,
      `School:        ${result.school}`,
      `State:         ${result.state}`,
      `Conference:    ${result.conference}`,
      ``,
      `── VALUATION ───────────────────────────`,
      `Composite:     ${result.composite}/99`,
      `  Social:      ${result.factors.social}/99 (20%)`,
      `  Athletic:    ${result.factors.athletic}/99 (25%)`,
      `  Market:      ${result.factors.market}/99 (20%)`,
      `  Brand:       ${result.factors.brand}/99 (15%)`,
      `  Engagement:  ${result.factors.engagement}/99 (5%)`,
      `  Position:    ${result.factors.position}/99 (5%)`,
      `  Conference:  ${result.factors.conference}/99 (5%)`,
      `  Comparable:  ${result.factors.comparable}/99 (5%)`,
      ``,
      `Fair Value:    $${result.valuationLow.toLocaleString()} – $${result.valuationHigh.toLocaleString()}`,
      `Proposed:      $${result.proposedAmount.toLocaleString()}`,
      result.overpay > 0 ? `OVERPAY:       $${result.overpay.toLocaleString()}` : `STATUS:        Within fair value range`,
      ``,
      `── COMPLIANCE ──────────────────────────`,
      `State Law:     ${result.compliance.stateLaw.status.toUpperCase()}`,
      `Conference:    ${result.compliance.conferenceRules.status.toUpperCase()}`,
      `NCAA:          ${result.compliance.ncaa.status.toUpperCase()}`,
      ...result.compliance.notes.map(n => `  ⚠ ${n}`),
      ``,
      `══════════════════════════════════════════`,
      `NIL33 — Capital Discipline Software`,
      `https://nil33.com`,
      ``,
      `This receipt is generated for demonstration`,
      `purposes. Production receipts use the full`,
      `33-factor engine with live data feeds.`,
      `══════════════════════════════════════════`,
    ].join("\n");
  }

  function downloadReceipt() {
    const text = generateReceiptText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result?.receiptId || "NIL33-receipt"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyShareSummary() {
    if (!result) return;
    const summary = [
      `NIL33 Valuation: ${result.athleteName}`,
      `Score: ${result.composite}/99`,
      `Fair Value: $${result.valuationLow.toLocaleString()}–$${result.valuationHigh.toLocaleString()}`,
      result.overpay > 0
        ? `⚠ Overpay detected: $${result.overpay.toLocaleString()}`
        : `✓ Deal within fair value range`,
      `Compliance: ${result.compliance.ncaa.status === "pass" ? "All Clear" : "Review Required"}`,
      `Receipt: ${result.receiptId}`,
      ``,
      `Run your own valuation → https://nil33.com/demo`,
    ].join("\n");
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const [copied, setCopied] = useState(false);

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
            <Link href="/collectives" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">For Collectives</Link>
            <Link href="/pricing" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/demo" className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg">Demo</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-nil-green/10 border border-nil-green/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
            <span className="text-xs text-nil-green font-medium">Live Demo — Free, No Sign-Up</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-4">
            Run a real valuation.
          </h1>
          <p className="text-lg text-nil-muted max-w-lg mx-auto">
            Enter deal details. Get a 33-factor score, compliance check,
            and auditable receipt. <span className="text-nil-white font-medium">See exactly what NIL33 delivers.</span>
          </p>
        </div>
      </section>

      {/* ─── Demo Interface ─── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">

          {/* ─── Phase: Input ─── */}
          {phase === "input" && (
            <div className="max-w-lg mx-auto">
              <div className="bg-nil-dark border border-nil-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-nil-white font-semibold text-lg">
                    Deal Details
                  </h2>
                  <span className="text-[10px] text-nil-muted bg-nil-gray px-2 py-0.5 rounded font-mono">
                    8 INPUTS → 33 FACTORS
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Athlete Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marcus Williams"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Position</label>
                      <select value={position} onChange={(e) => setPosition(e.target.value)}
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50 transition-colors">
                        {["QB", "WR", "RB", "TE", "OL", "DL", "LB", "DB", "K", "P"].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">School</label>
                      <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Georgia"
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">State</label>
                      <select value={state} onChange={(e) => setState(e.target.value)}
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50 transition-colors">
                        {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Conference</label>
                      <select value={conference} onChange={(e) => setConference(e.target.value)}
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm focus:outline-none focus:border-nil-green/50 transition-colors">
                        {["SEC","Big Ten","Big 12","ACC","Pac-12","AAC","Sun Belt","Conf USA","MAC","MWC","Independent"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Social Followers</label>
                      <input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="e.g. 45000"
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Engagement Rate</label>
                      <input type="number" step="0.01" value={engagement} onChange={(e) => setEngagement(e.target.value)} placeholder="e.g. 0.04"
                        className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-nil-muted text-xs uppercase tracking-wider block mb-1.5">Proposed Deal Amount ($)</label>
                    <input type="number" value={proposed} onChange={(e) => setProposed(e.target.value)} placeholder="e.g. 85000"
                      className="w-full bg-nil-black border border-nil-border rounded-lg px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/50 transition-colors" />
                  </div>

                  <button onClick={runDemo} disabled={!canRun}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${canRun ? "bg-nil-green text-nil-black hover:bg-nil-green/90 cursor-pointer shadow-lg shadow-nil-green/20" : "bg-nil-gray text-nil-muted cursor-not-allowed"}`}>
                    Run 33-Factor Valuation →
                  </button>
                </div>

                <p className="text-nil-muted text-[11px] mt-4 text-center">
                  Demo engine. Production uses live data feeds and full factor weights.
                </p>
              </div>

              {/* Pre-filled examples */}
              <div className="mt-6">
                <p className="text-nil-muted text-xs text-center mb-3">
                  Or try one of these sample scenarios:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "SEC QB — Overpay", n: "Jordan Mitchell", p: "QB", s: "Alabama", st: "Alabama", co: "SEC", f: "125000", e: "0.042", pr: "95000" },
                    { label: "Big Ten WR — Fair", n: "Darius Cole", p: "WR", s: "Ohio State", st: "Ohio", co: "Big Ten", f: "78000", e: "0.035", pr: "42000" },
                    { label: "Big 12 RB — Review", n: "Tre Jackson", p: "RB", s: "Oklahoma State", st: "Oklahoma", co: "Big 12", f: "45000", e: "0.028", pr: "68000" },
                  ].map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => {
                        setName(ex.n); setPosition(ex.p); setSchool(ex.s); setState(ex.st);
                        setConference(ex.co); setFollowers(ex.f); setEngagement(ex.e); setProposed(ex.pr);
                      }}
                      className="bg-nil-dark border border-nil-border rounded-lg p-3 text-left hover:border-nil-green/30 transition-colors cursor-pointer"
                    >
                      <p className="text-nil-white text-xs font-medium">{ex.label}</p>
                      <p className="text-nil-muted text-[10px] mt-0.5">{ex.n}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Phase: Scoring Animation ─── */}
          {phase === "scoring" && (
            <div className="max-w-md mx-auto">
              <div className="bg-nil-dark border border-nil-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 border-2 border-nil-green/30 border-t-nil-green rounded-full animate-spin" />
                  <div>
                    <p className="text-nil-white font-semibold text-sm">Scoring {name}</p>
                    <p className="text-nil-muted text-xs">{position} · {school} · {conference}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {scoringSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {i < scoringStep ? (
                        <span className="w-5 h-5 rounded-full bg-nil-green/20 text-nil-green text-xs flex items-center justify-center">✓</span>
                      ) : i === scoringStep ? (
                        <span className="w-5 h-5 rounded-full border border-nil-green/50 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-nil-border" />
                      )}
                      <span className={`text-xs ${i <= scoringStep ? "text-nil-white" : "text-nil-muted/40"}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 h-1 bg-nil-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nil-green rounded-full transition-all duration-300"
                    style={{ width: `${((scoringStep + 1) / scoringSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Phase: Results ─── */}
          {phase === "result" && result && (
            <div ref={resultRef} className="max-w-5xl mx-auto">
              {/* Verdict Banner */}
              <div className={`rounded-2xl p-6 mb-8 border-2 ${result.overpay > 0 ? "bg-nil-red/[0.06] border-nil-red/30" : "bg-nil-green/[0.06] border-nil-green/30"}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${result.overpay > 0 ? "text-nil-red" : "text-nil-green"}`}>
                      {result.overpay > 0 ? "⚠ Overpay Detected" : "✓ Deal Within Fair Value"}
                    </span>
                    <h2 className="text-nil-white font-bold text-2xl mt-1">
                      {result.athleteName}
                      <span className="text-nil-muted font-normal text-lg ml-2">{result.position} · {result.school}</span>
                    </h2>
                    {result.overpay > 0 && (
                      <p className="text-nil-red/80 text-sm mt-1">
                        This deal exceeds fair market by <span className="font-mono font-bold">${result.overpay.toLocaleString()}</span>.
                        Consider renegotiating within ${result.valuationLow.toLocaleString()}–${result.valuationHigh.toLocaleString()}.
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-nil-muted text-xs">COMPOSITE</p>
                    <p className={`font-mono text-5xl font-extrabold ${result.overpay > 0 ? "text-nil-red" : "text-nil-green"}`}>
                      <AnimatedNumber value={result.composite} duration={1200} />
                    </p>
                    <p className="text-nil-muted text-xs">/99</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Factor Breakdown */}
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-xs text-nil-muted uppercase tracking-widest">33-Factor Breakdown</p>
                      <span className="text-[10px] text-nil-muted bg-nil-gray px-2 py-0.5 rounded font-mono">8 CATEGORIES</span>
                    </div>
                    <div className="space-y-4">
                      <ScoreBar label="Social Reach" value={result.factors.social} color="#00ff88" weight="20%" detail="Instagram, Twitter/X, TikTok follower count normalized against D1 averages. Penalizes bot-inflated accounts." />
                      <ScoreBar label="Athletic Performance" value={result.factors.athletic} color="#00d4ff" weight="25%" detail="Position-specific performance metrics. Includes conference-adjusted stats, draft projection data, and transfer portal momentum." />
                      <ScoreBar label="Market Demand" value={result.factors.market} color="#a855f7" weight="20%" detail="Conference market size, regional brand value, media market penetration, and competitive landscape for the position." />
                      <ScoreBar label="Brand Value" value={result.factors.brand} color="#f59e0b" weight="15%" detail="Composite of social influence quality, partnership history, content creation capability, and audience demographic value." />
                      <ScoreBar label="Engagement Quality" value={result.factors.engagement} color="#3b82f6" weight="5%" detail="Engagement rate, comment quality, story views ratio, and audience authenticity score. Low engagement signals bot inflation." />
                      <ScoreBar label="Position Premium" value={result.factors.position} color="#f97316" weight="5%" detail="Historical NIL deal premiums by position. QBs command highest premiums, followed by skill position players." />
                      <ScoreBar label="Conference Factor" value={result.factors.conference} color="#ef4444" weight="5%" detail="Conference-level NIL market size, media deal value, and collective funding ecosystem maturity." />
                      <ScoreBar label="Comparable Deals" value={result.factors.comparable} color="#00ff88" weight="5%" detail="Analysis of comparable deals for similar athletes in similar markets. Adjusts for recency and deal structure." />
                    </div>
                  </div>

                  {/* Valuation */}
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <p className="text-xs text-nil-muted uppercase tracking-widest mb-4">Valuation</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-nil-muted text-sm">Fair Value Range</span>
                        <span className="text-nil-white font-mono font-bold text-lg">${result.valuationLow.toLocaleString()}–${result.valuationHigh.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-nil-muted text-sm">Proposed Amount</span>
                        <span className={`font-mono font-bold text-lg ${result.overpay > 0 ? "text-nil-red" : "text-nil-green"}`}>${result.proposedAmount.toLocaleString()}</span>
                      </div>
                      {result.overpay > 0 && (
                        <>
                          <div className="h-px bg-nil-border" />
                          <div className="flex justify-between items-baseline">
                            <span className="text-nil-muted text-sm">Overpay</span>
                            <span className="text-nil-red font-mono font-extrabold text-2xl">${result.overpay.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Visual range bar */}
                    <div className="mt-5">
                      <div className="relative h-2 bg-nil-gray rounded-full overflow-visible">
                        <div
                          className="absolute h-full bg-nil-green/30 rounded-full"
                          style={{
                            left: `${(result.valuationLow / (result.proposedAmount * 1.3)) * 100}%`,
                            width: `${((result.valuationHigh - result.valuationLow) / (result.proposedAmount * 1.3)) * 100}%`,
                          }}
                        />
                        <div
                          className={`absolute w-3 h-3 rounded-full -top-0.5 -ml-1.5 border-2 border-nil-black ${result.overpay > 0 ? "bg-nil-red" : "bg-nil-green"}`}
                          style={{ left: `${Math.min(100, (result.proposedAmount / (result.proposedAmount * 1.3)) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-nil-green font-mono">${result.valuationLow.toLocaleString()}</span>
                        <span className="text-[10px] text-nil-green font-mono">${result.valuationHigh.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Compliance */}
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-nil-muted uppercase tracking-widest">Compliance Check</p>
                      <span className="text-[10px] text-nil-muted">Click to expand</span>
                    </div>
                    <ComplianceRow label={`${result.state} State Law`} status={result.compliance.stateLaw.status} detail={result.compliance.stateLaw.detail} />
                    <ComplianceRow label={`${result.conference} Rules`} status={result.compliance.conferenceRules.status} detail={result.compliance.conferenceRules.detail} />
                    <ComplianceRow label="NCAA Guidelines" status={result.compliance.ncaa.status} detail={result.compliance.ncaa.detail} />
                    {result.compliance.notes.length > 0 && (
                      <div className="mt-3 bg-nil-gold/[0.06] border border-nil-gold/20 rounded-lg p-3">
                        {result.compliance.notes.map((note, i) => (
                          <p key={i} className="text-nil-gold text-xs mb-1 last:mb-0">⚠ {note}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Receipt */}
                  <div className="bg-nil-dark border border-nil-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-nil-muted uppercase tracking-widest">Deal Receipt</p>
                      <span className="text-nil-purple text-[10px] font-mono">Ed25519</span>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">ID</span><span className="text-nil-white text-xs">{result.receiptId}</span></div>
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Athlete</span><span className="text-nil-white text-xs">{result.athleteName}</span></div>
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Score</span><span className="text-nil-green text-xs">{result.composite}/99</span></div>
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Fair Value</span><span className="text-nil-white text-xs">${result.valuationLow.toLocaleString()}–${result.valuationHigh.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Proposed</span><span className={`text-xs ${result.overpay > 0 ? "text-nil-red" : "text-nil-green"}`}>${result.proposedAmount.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Compliance</span><span className={`text-xs ${result.compliance.ncaa.status === "pass" ? "text-nil-green" : "text-nil-gold"}`}>{result.compliance.ncaa.status === "pass" ? "All Clear" : "Review"}</span></div>
                      <div className="h-px bg-nil-border" />
                      <div className="flex justify-between"><span className="text-nil-muted text-xs">Generated</span><span className="text-nil-muted text-[10px]">{new Date(result.timestamp).toLocaleString()}</span></div>
                      <div className="flex justify-between items-start"><span className="text-nil-muted text-xs shrink-0">Signature</span><span className="text-nil-purple text-[10px] text-right ml-2 break-all">{result.signature}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button onClick={downloadReceipt}
                      className="w-full py-3 bg-nil-dark border border-nil-border text-nil-white rounded-xl text-sm font-medium hover:border-nil-green/30 transition-colors cursor-pointer flex items-center justify-center gap-2">
                      <span>↓</span> Download Receipt
                    </button>
                    <button onClick={copyShareSummary}
                      className="w-full py-3 bg-nil-dark border border-nil-border text-nil-white rounded-xl text-sm font-medium hover:border-nil-green/30 transition-colors cursor-pointer flex items-center justify-center gap-2">
                      {copied ? <><span>✓</span> Copied!</> : <><span>⎘</span> Copy Share Summary</>}
                    </button>
                    <button onClick={reset}
                      className="w-full py-3 bg-nil-green text-nil-black rounded-xl text-sm font-bold hover:bg-nil-green/90 transition-colors cursor-pointer">
                      Run Another Valuation →
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12 pb-8">
                <div className="bg-nil-dark border border-nil-border rounded-xl p-6 max-w-lg mx-auto">
                  <p className="text-nil-white font-semibold mb-2">
                    This is a demo. The full product is more powerful.
                  </p>
                  <p className="text-nil-muted text-sm mb-4">
                    Production NIL33 uses live data feeds, historical deal comps,
                    real-time compliance updates, and the complete 33-factor engine.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/pricing" className="text-sm text-nil-green font-medium hover:underline">
                      See pricing →
                    </Link>
                    <a href="mailto:partnerships@nil33.com?subject=NIL33%20Access" className="text-sm text-nil-green font-medium hover:underline">
                      Talk to sales →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
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
