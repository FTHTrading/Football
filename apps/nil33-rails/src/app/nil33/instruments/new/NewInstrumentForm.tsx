"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  { value: "revenue_participation_note", label: "Revenue Participation Note" },
  { value: "portfolio_tranche_note", label: "Portfolio Tranche Note" },
] as const;

const ELIGIBILITY = [
  { value: "accredited_only", label: "Accredited Only" },
  { value: "qib_only", label: "QIB Only" },
  { value: "us_only", label: "US Only" },
  { value: "non_us_only", label: "Non-US Only" },
  { value: "open", label: "Open" },
] as const;

interface Spv {
  id: string;
  legalName: string;
}

export default function NewInstrumentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spvs, setSpvs] = useState<Spv[]>([]);

  const [form, setForm] = useState({
    spvId: "",
    name: "",
    type: "revenue_participation_note",
    offeringSizeCents: "",
    minTicketCents: "",
    holdingPeriodDays: "365",
    concentrationLimitPct: "2500",
    eligibilityRules: ["accredited_only"] as string[],
  });

  useEffect(() => {
    fetch("/api/v1/spvs")
      .then((r) => r.json())
      .then((d) => {
        const items = d.items ?? d;
        setSpvs(Array.isArray(items) ? items : []);
        if (items.length > 0 && !form.spvId) {
          setForm((f) => ({ ...f, spvId: items[0].id }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleEligibility(rule: string) {
    setForm((f) => {
      const rules = f.eligibilityRules.includes(rule)
        ? f.eligibilityRules.filter((r) => r !== rule)
        : [...f.eligibilityRules, rule];
      return { ...f, eligibilityRules: rules.length > 0 ? rules : [rule] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.spvId) return setError("Please select an SPV.");
    if (!form.offeringSizeCents) return setError("Offering size is required.");
    if (!form.minTicketCents) return setError("Min ticket is required.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/instruments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spvId: form.spvId,
          name: form.name,
          type: form.type,
          offeringSizeCents: Math.round(parseFloat(form.offeringSizeCents) * 100),
          minTicketCents: Math.round(parseFloat(form.minTicketCents) * 100),
          holdingPeriodDays: parseInt(form.holdingPeriodDays) || 365,
          concentrationLimitPct: parseInt(form.concentrationLimitPct) || 2500,
          eligibilityRules: form.eligibilityRules,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      router.push(`/nil33/instruments/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-rails-red/30 bg-rails-red/10 p-3 text-sm text-rails-red">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs text-rails-text-dim mb-1">Name *</label>
          <input
            className="input w-full"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="NIL33 Revenue Note I — Arch Manning"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-rails-text-dim mb-1">SPV / Issuer *</label>
          <select
            className="input w-full"
            value={form.spvId}
            onChange={(e) => set("spvId", e.target.value)}
          >
            {spvs.length === 0 && <option value="">Loading…</option>}
            {spvs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.legalName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Instrument Type</label>
          <select
            className="input w-full"
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Holding Period (days)</label>
          <input
            className="input w-full"
            type="number"
            value={form.holdingPeriodDays}
            onChange={(e) => set("holdingPeriodDays", e.target.value)}
            min={0}
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Offering Size ($) *</label>
          <input
            className="input w-full"
            type="number"
            step="0.01"
            value={form.offeringSizeCents}
            onChange={(e) => set("offeringSizeCents", e.target.value)}
            placeholder="500000"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Min Ticket ($) *</label>
          <input
            className="input w-full"
            type="number"
            step="0.01"
            value={form.minTicketCents}
            onChange={(e) => set("minTicketCents", e.target.value)}
            placeholder="10000"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">
            Concentration Limit (bps)
          </label>
          <input
            className="input w-full"
            type="number"
            value={form.concentrationLimitPct}
            onChange={(e) => set("concentrationLimitPct", e.target.value)}
            placeholder="2500"
            min={0}
            max={10000}
          />
          <span className="text-[10px] text-rails-text-dim mt-0.5 block">
            2500 = 25%
          </span>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">
            Eligibility Rules
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {ELIGIBILITY.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => toggleEligibility(e.value)}
                className={`px-2.5 py-1 text-xs rounded border transition ${
                  form.eligibilityRules.includes(e.value)
                    ? "bg-rails-green/20 border-rails-green text-rails-green"
                    : "border-surface-border text-rails-text-dim hover:border-rails-text-dim"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? "Creating…" : "Create Instrument"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-4"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
