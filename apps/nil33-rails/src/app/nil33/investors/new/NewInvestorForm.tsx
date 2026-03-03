"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ENTITY_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "entity", label: "Entity" },
  { value: "trust", label: "Trust" },
  { value: "fund", label: "Fund" },
] as const;

const JURISDICTIONS = [
  "US", "CA", "GB", "DE", "CH", "SG", "HK", "AE", "KY", "BM", "OTHER",
] as const;

export default function NewInvestorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    contactEmail: "",
    entityType: "individual",
    jurisdiction: "US",
    ein: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.legalName.trim()) return setError("Legal name is required.");
    if (!form.contactEmail.trim()) return setError("Contact email is required.");
    if (!form.contactName.trim()) return setError("Contact name is required.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalName: form.legalName,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          entityType: form.entityType,
          jurisdiction: form.jurisdiction,
          ein: form.ein || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      router.push(`/nil33/investors/${data.id}`);
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
            placeholder="Sovereign Wealth Partners, LLC"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Contact Name *</label>
          <input
            className="input w-full"
            value={form.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder="Jane Smith"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Contact Email *</label>
          <input
            className="input w-full"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            placeholder="jane@sovereignwealth.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Entity Type</label>
          <select
            className="input w-full"
            value={form.entityType}
            onChange={(e) => set("entityType", e.target.value)}
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">Jurisdiction</label>
          <select
            className="input w-full"
            value={form.jurisdiction}
            onChange={(e) => set("jurisdiction", e.target.value)}
          >
            {JURISDICTIONS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-rails-text-dim mb-1">EIN / Tax ID</label>
          <input
            className="input w-full"
            value={form.ein}
            onChange={(e) => set("ein", e.target.value)}
            placeholder="XX-XXXXXXX"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? "Creating…" : "Create Investor"}
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
