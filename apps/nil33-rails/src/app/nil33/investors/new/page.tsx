import Link from "next/link";
import NewInvestorForm from "./NewInvestorForm";

export default function NewInvestorPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/investors" className="hover:text-rails-text">
          Investors
        </Link>
        <span>/</span>
        <span className="text-rails-text">New Investor</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-rails-text">
          Onboard New Investor
        </h1>
        <p className="text-sm text-rails-text-dim mt-1">
          Register an accredited investor for KYC/AML processing
        </p>
      </div>

      <div className="card">
        <NewInvestorForm />
      </div>
    </div>
  );
}
