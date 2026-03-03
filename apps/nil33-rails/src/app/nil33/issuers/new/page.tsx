import Link from "next/link";
import NewSpvForm from "./NewSpvForm";

export default function NewSpvPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/issuers" className="hover:text-rails-text">Issuers</Link>
        <span>/</span>
        <span className="text-rails-text">New SPV</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-rails-text">Create New SPV</h1>
        <p className="mt-1 text-sm text-rails-text-dim">Register a new special purpose vehicle for instrument issuance.</p>
      </div>

      <div className="card">
        <NewSpvForm />
      </div>
    </div>
  );
}
