"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const JURISDICTIONS = ["DE", "CA", "NY", "WY", "FL", "OTHER"] as const;
const FORMATION_TYPES = ["LLC", "LP", "CORP", "TRUST"] as const;

export default function NewSpvForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    legalName: "",
    ein: "",
    jurisdiction: "DE",
    formationType: "LLC",
    registeredAgentName: "",
    custodianName: "",
    bankAccountLast4: "",
    notes: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.legalName.trim()) {
      setError("Legal name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/spvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.legalName,
          legalName: form.legalName,
          jurisdiction: form.jurisdiction,
          taxId: form.ein || null,
          managerName: form.registeredAgentName || form.legalName,
          managerEmail: "ops@nil33.com",
          bankName: form.custodianName || null,
          custodianName: form.custodianName || null,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      router.push(`/nil33/issuers/${data.id}`);
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
          <label className="block text-xs text-rails-text-dim mb-1">Legal Name *</label>
          <input
            className="input w-full"
            value={form.legalName}
            onChange={(e) => set("legalName", e.target.value)}
            placeholder="NIL33 SPV I, LLC"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">EIN</label>
          <input
            className="input w-full"
            value={form.ein}
            onChange={(e) => set("ein", e.target.value)}
            placeholder="XX-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Jurisdiction</label>
          <select
            className="input w-full"
            value={form.jurisdiction}
            onChange={(e) => set("jurisdiction", e.target.value)}
          >
            {JURISDICTIONS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Formation Type</label>
          <select
            className="input w-full"
            value={form.formationType}
            onChange={(e) => set("formationType", e.target.value)}
          >
            {FORMATION_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Registered Agent</label>
          <input
            className="input w-full"
            value={form.registeredAgentName}
            onChange={(e) => set("registeredAgentName", e.target.value)}
            placeholder="Agent name"
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Custodian</label>
          <input
            className="input w-full"
            value={form.custodianName}
            onChange={(e) => set("custodianName", e.target.value)}
            placeholder="Bank / custodian name"
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Bank Account (last 4)</label>
          <input
            className="input w-full"
            value={form.bankAccountLast4}
            onChange={(e) => set("bankAccountLast4", e.target.value)}
            placeholder="1234"
            maxLength={4}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-rails-text-dim mb-1">Notes</label>
          <textarea
            className="input w-full min-h-[80px]"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Internal notes…"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating…" : "Create SPV"}
        </button>
        <a href="/nil33/issuers" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
