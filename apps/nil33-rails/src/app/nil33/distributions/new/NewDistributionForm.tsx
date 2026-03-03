"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Instrument {
  id: string;
  name: string;
  spv: { legalName: string };
}

export default function NewDistributionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);

  const [form, setForm] = useState({
    instrumentId: "",
    periodStart: monthAgo,
    periodEnd: today,
    totalRevenueDollars: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/v1/instruments?pageSize=100")
      .then((r) => r.json())
      .then((d) => {
        const items = d.items ?? d;
        setInstruments(Array.isArray(items) ? items : []);
        if (items.length > 0 && !form.instrumentId) {
          setForm((f) => ({ ...f, instrumentId: items[0].id }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.instrumentId) return setError("Please select an instrument.");
    if (!form.totalRevenueDollars) return setError("Revenue amount is required.");
    if (!form.periodStart || !form.periodEnd) return setError("Period dates are required.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instrumentId: form.instrumentId,
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
          totalRevenueCents: Math.round(parseFloat(form.totalRevenueDollars) * 100),
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      router.push(`/nil33/distributions/${data.id}`);
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
          <label className="block text-xs text-rails-text-dim mb-1">
            Instrument *
          </label>
          <select
            className="input w-full"
            value={form.instrumentId}
            onChange={(e) => set("instrumentId", e.target.value)}
          >
            {instruments.length === 0 && <option value="">Loading…</option>}
            {instruments.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.name} — {ins.spv?.legalName ?? "Unknown SPV"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">
            Period Start *
          </label>
          <input
            className="input w-full"
            type="date"
            value={form.periodStart}
            onChange={(e) => set("periodStart", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">
            Period End *
          </label>
          <input
            className="input w-full"
            type="date"
            value={form.periodEnd}
            onChange={(e) => set("periodEnd", e.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-rails-text-dim mb-1">
            Total Revenue ($) *
          </label>
          <input
            className="input w-full"
            type="number"
            step="0.01"
            value={form.totalRevenueDollars}
            onChange={(e) => set("totalRevenueDollars", e.target.value)}
            placeholder="125000"
            required
          />
          <span className="text-[10px] text-rails-text-dim mt-0.5 block">
            The waterfall engine will compute participation, mgmt fee, and net distributable amounts automatically.
          </span>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-rails-text-dim mb-1">Notes</label>
          <textarea
            className="input w-full min-h-[80px]"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Q1 2026 revenue from NIL sponsorship deals..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? "Running Waterfall…" : "Create Distribution"}
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
