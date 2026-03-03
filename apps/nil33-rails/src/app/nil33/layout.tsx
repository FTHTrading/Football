import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";

const NAV = [
  { href: "/nil33", label: "Dashboard", icon: "▦" },
  { href: "/nil33/genome", label: "Genome Console", icon: "⧬" },
  { href: "/nil33/evaluation", label: "Eval Pipeline", icon: "◈" },
  { href: "/nil33/market", label: "Market Board", icon: "⊞" },
  { href: "/nil33/capital", label: "Capital Lifecycle", icon: "⟐" },
  { href: "/nil33/underwriting", label: "Underwriting", icon: "◆" },
  { href: "/nil33/portfolio", label: "Portfolio Intel", icon: "◇" },
  { href: "/nil33/issuers", label: "Issuers / SPVs", icon: "⬡" },
  { href: "/nil33/instruments", label: "Instruments", icon: "⬢" },
  { href: "/nil33/investors", label: "Investors", icon: "◉" },
  { href: "/nil33/distributions", label: "Distributions", icon: "⋮⋮" },
  { href: "/nil33/audit", label: "Audit Ledger", icon: "⌇" },
];

export default async function RailsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-surface-border bg-surface-card">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-surface-border">
          <span className="font-mono text-xl font-bold tracking-tighter text-rails-green">
            NIL<span className="text-rails-text">33</span>
          </span>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-rails-text-dim">
            Institutional Rails
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rails-text-dim transition-colors hover:bg-surface-muted hover:text-rails-text"
                >
                  <span className="font-mono text-xs text-rails-green">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User / sign out */}
        <div className="border-t border-surface-border px-4 py-4">
          <p className="truncate text-xs text-rails-text-dim">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="mt-2 text-xs text-rails-muted hover:text-rails-red transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
