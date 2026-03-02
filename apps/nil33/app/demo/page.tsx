"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "../../components/Card";
import { ScoreBar } from "../../components/ScoreDisplay";
import Badge from "../../components/Badge";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import Button from "../../components/Button";

/* ═══ Scoring engine (deterministic — do not modify) ═══ */
function scoreDeal(
  name: string,
  pos: string,
  school: string,
  state: string,
  conference: string,
  followers: number,
  engagement: number,
  proposed: number
) {
  const seed = (name + pos + school).length;
  const posBoost: Record<string, number> = { QB: 15, WR: 8, RB: 6, TE: 4, OL: 2, DL: 5, LB: 6, DB: 7, K: 1, P: 1 };
  const confBoost: Record<string, number> = { SEC: 12, "Big Ten": 10, "Big 12": 8, ACC: 7, "Pac-12": 6, AAC: 3, "Sun Belt": 2, "Conf USA": 2, MAC: 1, MWC: 2, Independent: 4 };

  const social = Math.min(99, Math.max(15, Math.round((Math.log10(Math.max(followers, 100)) / Math.log10(10000000)) * 70 + engagement * 200 + ((seed % 7) - 3))));
  const athletic = Math.min(99, Math.max(25, 50 + (posBoost[pos] || 5) + (confBoost[conference] || 3) + ((seed % 11) - 5)));
  const market = Math.min(99, Math.max(20, Math.round(40 + (confBoost[conference] || 3) * 1.5 + (posBoost[pos] || 3) * 0.8 + ((seed % 9) - 4))));
  const brand = Math.min(99, Math.max(20, Math.round(social * 0.4 + athletic * 0.2 + market * 0.3 + ((seed % 13) - 6))));

  const composite = Math.round(social * 0.25 + athletic * 0.30 + market * 0.25 + brand * 0.20);
  const base = composite * 800;
  const low = Math.round(base * 0.85 / 1000) * 1000;
  const high = Math.round(base * 1.15 / 1000) * 1000;
  const overpay = Math.max(0, proposed - high);

  const overPct = high > 0 ? Math.round(((proposed - high) / high) * 100) : 0;

  type CS = "pass" | "review" | "fail";
  let ncaaStatus: CS = "pass";
  let ncaaNote = "";
  if (proposed > high * 1.2) {
    ncaaStatus = "review";
    ncaaNote = `Proposed exceeds fair value by ${overPct}%. May trigger scrutiny.`;
  } else if (proposed > high) {
    ncaaNote = `${overPct}% above fair value. Within tolerance.`;
  }

  const stateDetail: Record<string, string> = {
    Georgia: "GA Code § 20-3-681 — NIL permitted. Disclosure required >$600.",
    Texas: "TX Ed Code § 51.9246 — NIL rights protected. Annual disclosure.",
    California: "SB 206 — NIL permitted. Standard tax reporting.",
    Florida: "FL Stat § 1006.74 — NIL permitted with disclosure.",
    Alabama: "AL Code § 16-22-40 — NIL granted. Standard reporting.",
  };
  const confDetail: Record<string, string> = {
    SEC: "SEC NIL Policy § 4.2 — Disclosure within 30 days.",
    "Big Ten": "Big Ten Bylaw 12.1.2 — Registration recommended.",
    "Big 12": "Big 12 Framework — Quarterly disclosure required.",
    ACC: "ACC Policy — Notification within 14 days.",
  };

  const receiptId = `NIL33-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
  const sig = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  return {
    name, pos, school, state, conference,
    factors: { social, athletic, market, brand },
    composite, low, high, proposed, overpay,
    compliance: {
      state: { status: "pass" as CS, detail: stateDetail[state] || `${state} — NIL statute active. Standard disclosure.` },
      conference: { status: "pass" as CS, detail: confDetail[conference] || `${conference} — NIL framework active.` },
      ncaa: { status: ncaaStatus, detail: ncaaNote || "Within fair value. No flags." },
    },
    receiptId,
    timestamp: new Date().toISOString(),
    signature: `ed25519:${sig}`,
  };
}

type Result = ReturnType<typeof scoreDeal>;

const inputClass = "w-full bg-nil-dark border border-nil-border rounded-xl px-4 py-2.5 text-nil-white text-sm placeholder:text-nil-muted/50 focus:outline-none focus:border-nil-green/40 transition-colors";

export default function DemoPage() {
  const [name, setName] = useState("");
  const [pos, setPos] = useState("QB");
  const [school, setSchool] = useState("");
  const [state, setState] = useState("Georgia");
  const [conf, setConf] = useState("SEC");
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [proposed, setProposed] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const ready = name.trim() && school.trim() && followers && proposed;

  function run() {
    if (!ready) return;
    setLoading(true);
    setTimeout(() => {
      setResult(scoreDeal(
        name, pos, school, state, conf,
        parseInt(followers) || 0,
        parseFloat(engagement) || 0.03,
        parseInt(proposed) || 0,
      ));
      setLoading(false);
    }, 600);
  }

  function reset() {
    setResult(null);
    setName(""); setSchool(""); setFollowers(""); setEngagement(""); setProposed("");
  }

  function prefill(n: string, p: string, s: string, st: string, c: string, f: string, e: string, pr: string) {
    setName(n); setPos(p); setSchool(s); setState(st); setConf(c); setFollowers(f); setEngagement(e); setProposed(pr);
  }

  return (
    <section className="pt-32 sm:pt-40 pb-24 px-6">
      <div className="max-w-[1200px] mx-auto">

        {!result ? (
          <>
            {/* ═══ Form ═══ */}
            <div className="max-w-md mx-auto mb-10 text-center">
              <p className="text-overline mb-5">Live Demo</p>
              <h1 className="text-h1 text-nil-white mb-3">Run a valuation.</h1>
              <p className="text-body-lg text-nil-muted">
                Enter the deal details. Get a score, compliance check, and receipt.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <div className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Athlete name" className={inputClass} />

                <div className="grid grid-cols-2 gap-3">
                  <select value={pos} onChange={e => setPos(e.target.value)} className={inputClass}>
                    {["QB","WR","RB","TE","OL","DL","LB","DB","K","P"].map(p => <option key={p}>{p}</option>)}
                  </select>
                  <input value={school} onChange={e => setSchool(e.target.value)} placeholder="School" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select value={state} onChange={e => setState(e.target.value)} className={inputClass}>
                    {["Alabama","Arizona","Arkansas","California","Colorado","Connecticut","Florida","Georgia","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maryland","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Jersey","New York","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","South Carolina","Tennessee","Texas","Utah","Virginia","Washington","Wisconsin","Wyoming"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <select value={conf} onChange={e => setConf(e.target.value)} className={inputClass}>
                    {["SEC","Big Ten","Big 12","ACC","Pac-12","AAC","Sun Belt","Conf USA","MAC","MWC","Independent"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={followers} onChange={e => setFollowers(e.target.value)} placeholder="Followers (e.g. 45000)" className={inputClass} />
                  <input type="number" step="0.01" value={engagement} onChange={e => setEngagement(e.target.value)} placeholder="Engagement (e.g. 0.04)" className={inputClass} />
                </div>

                <input type="number" value={proposed} onChange={e => setProposed(e.target.value)} placeholder="Proposed deal amount ($)" className={inputClass} />

                <button onClick={run} disabled={!ready || loading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${ready && !loading ? "bg-nil-green text-nil-black hover:bg-nil-green/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] cursor-pointer" : "bg-nil-border/40 text-nil-muted cursor-not-allowed"}`}>
                  {loading ? "Scoring…" : "Score This Deal"}
                </button>

                <p className="text-nil-muted/50 text-[11px] text-center">Demo scoring engine. Production uses live data feeds.</p>
              </div>
            </Card>

            {/* Quick presets */}
            <div className="max-w-md mx-auto mt-6 flex gap-3">
              {[
                { label: "SEC QB · $95K", click: () => prefill("Jordan Mitchell","QB","Alabama","Alabama","SEC","125000","0.042","95000") },
                { label: "B10 WR · $42K", click: () => prefill("Darius Cole","WR","Ohio State","Ohio","Big Ten","78000","0.035","42000") },
                { label: "B12 RB · $68K", click: () => prefill("Tre Jackson","RB","Oklahoma State","Oklahoma","Big 12","45000","0.028","68000") },
              ].map(p => (
                <button key={p.label} onClick={p.click} className="flex-1 text-[11px] text-nil-muted bg-nil-dark/60 border border-nil-border/60 rounded-xl py-2.5 hover:border-nil-green/30 transition-colors cursor-pointer">
                  {p.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ═══ Results ═══ */
          <>
            {/* Verdict bar */}
            <div className={`rounded-2xl p-6 mb-8 border ${result.overpay > 0 ? "border-red-500/30 bg-red-500/[0.04]" : "border-nil-green/30 bg-nil-green/[0.04]"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-overline ${result.overpay > 0 ? "text-red-400" : "text-nil-green"}`}>
                    {result.overpay > 0 ? "Overpay detected" : "Within fair value"}
                  </p>
                  <p className="text-nil-white text-h3 mt-1">
                    {result.name} <span className="text-nil-muted font-normal text-base">· {result.pos} · {result.school}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-4xl font-bold ${result.overpay > 0 ? "text-red-400" : "text-nil-green"}`}>{result.composite}</p>
                  <p className="text-nil-muted text-xs">/99</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Valuation */}
              <Card>
                <p className="text-overline mb-5">Valuation</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-nil-muted">Fair range</span>
                    <span className="text-nil-white font-mono">${result.low.toLocaleString()}–${result.high.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nil-muted">Proposed</span>
                    <span className={`font-mono ${result.overpay > 0 ? "text-red-400" : "text-nil-green"}`}>${result.proposed.toLocaleString()}</span>
                  </div>
                  {result.overpay > 0 && (
                    <>
                      <div className="h-px bg-nil-border" />
                      <div className="flex justify-between">
                        <span className="text-nil-muted">Overpay</span>
                        <span className="text-red-400 font-mono font-bold">${result.overpay.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <ScoreBar label="Social" value={result.factors.social} color="var(--color-nil-green)" />
                  <ScoreBar label="Athletic" value={result.factors.athletic} color="var(--color-nil-cyan)" />
                  <ScoreBar label="Market" value={result.factors.market} color="var(--color-nil-purple)" />
                  <ScoreBar label="Brand" value={result.factors.brand} color="var(--color-nil-gold)" />
                </div>
              </Card>

              {/* Compliance */}
              <Card>
                <p className="text-overline mb-5">Compliance</p>
                <div className="space-y-4">
                  {([
                    { label: `${result.state} State Law`, ...result.compliance.state },
                    { label: `${result.conference} Rules`, ...result.compliance.conference },
                    { label: "NCAA Guidelines", ...result.compliance.ncaa },
                  ]).map(c => (
                    <div key={c.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-nil-muted text-sm">{c.label}</span>
                        <Badge status={c.status} label={c.status} />
                      </div>
                      <p className="text-nil-muted/60 text-xs leading-relaxed">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Receipt */}
              <Card>
                <p className="text-overline mb-5">Receipt</p>
                <CodePreview title={result.receiptId}>
                  <DataRow label="Score" value={`${result.composite}/99`} />
                  <DataRow label="Range" value={`$${result.low.toLocaleString()}–$${result.high.toLocaleString()}`} />
                  <DataRow label="Status" value={result.compliance.ncaa.status === "pass" ? "Clear" : "Review"} />
                  <DataDivider />
                  <DataRow label="Time" value={new Date(result.timestamp).toLocaleDateString()} />
                  <div className="px-4 py-1.5">
                    <span className="text-nil-muted text-xs">Sig</span>
                    <p className="text-nil-purple/70 text-xs font-mono break-all mt-0.5">{result.signature}</p>
                  </div>
                </CodePreview>
                <button onClick={() => {
                  const t = `NIL33 Receipt ${result.receiptId}\nAthlete: ${result.name} (${result.pos}, ${result.school})\nScore: ${result.composite}/99\nFair Value: $${result.low.toLocaleString()}–$${result.high.toLocaleString()}\nProposed: $${result.proposed.toLocaleString()}\n${result.overpay > 0 ? `Overpay: $${result.overpay.toLocaleString()}` : "Status: Within fair value"}\nCompliance: ${result.compliance.ncaa.status}\nSigned: ${result.signature}\nhttps://nil33.com/demo`;
                  navigator.clipboard.writeText(t);
                }} className="w-full mt-4 text-[11px] text-nil-muted bg-nil-border/20 border border-nil-border rounded-xl py-2.5 hover:text-nil-white transition-colors cursor-pointer">
                  Copy receipt
                </button>
              </Card>
            </div>

            {/* Actions */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button onClick={reset} variant="primary" size="lg">Score Another Deal</Button>
              <Button href="/pricing" variant="ghost">See pricing →</Button>
            </div>

            <p className="text-center text-nil-muted/40 text-[11px] mt-6">
              Demo engine. Production uses live data feeds, full 33-factor weighting, and real-time compliance updates.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
