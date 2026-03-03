import Link from "next/link";
import NewInstrumentForm from "./NewInstrumentForm";

export default function NewInstrumentPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/instruments" className="hover:text-rails-text">
          Instruments
        </Link>
        <span>/</span>
        <span className="text-rails-text">New Instrument</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-rails-text">
          Issue New Instrument
        </h1>
        <p className="text-sm text-rails-text-dim mt-1">
          Create a revenue participation note backed by an SPV
        </p>
      </div>

      <div className="card">
        <NewInstrumentForm />
      </div>
    </div>
  );
}
