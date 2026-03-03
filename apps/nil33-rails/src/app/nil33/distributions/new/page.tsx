import Link from "next/link";
import NewDistributionForm from "./NewDistributionForm";

export default function NewDistributionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/distributions" className="hover:text-rails-text">
          Distributions
        </Link>
        <span>/</span>
        <span className="text-rails-text">New Distribution</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-rails-text">
          Run Distribution Waterfall
        </h1>
        <p className="text-sm text-rails-text-dim mt-1">
          Compute and allocate net distributable revenue across funded subscriptions
        </p>
      </div>

      <div className="card">
        <NewDistributionForm />
      </div>
    </div>
  );
}
