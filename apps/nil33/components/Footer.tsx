import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/products", label: "Product families" },
      { href: "/underwriting", label: "33-signal engine" },
      { href: "/compliance", label: "Supervision & audit" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/partnership", label: "For agencies" },
      { href: "/partnership", label: "For broker-dealers" },
      { href: "/reporting", label: "Investor reporting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/developers", label: "API reference" },
      { href: "https://github.com/FTHTrading", label: "GitHub", external: true },
      { href: "mailto:partnerships@nil33.com", label: "Partnerships", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "mailto:partnerships@nil33.com", label: "Contact", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-nil-border/60 bg-nil-black">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-nil-gold/10 border border-nil-gold/20 flex items-center justify-center">
                <span className="text-nil-gold font-bold text-sm font-mono">33</span>
              </div>
              <div>
                <span className="text-nil-white font-bold text-sm block leading-tight">NIL33</span>
                <span className="text-nil-muted text-[9px] tracking-[0.1em] uppercase">Capital Intelligence</span>
              </div>
            </div>
            <p className="text-nil-muted text-xs leading-relaxed max-w-[220px] mb-5">
              Underwriting and compliance infrastructure for NIL-linked
              alternative investments. Institutional-grade capital rails
              for elite sports agencies and broker-dealers.
            </p>
            <p className="text-nil-muted/60 text-[10px]">
              5655 Peachtree Parkway<br />
              Norcross, GA 30092
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-nil-muted/80 text-[11px] font-semibold uppercase tracking-wider mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) =>
                  "external" in l ? (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-nil-muted text-[13px] hover:text-nil-white transition-colors"
                      >
                        {l.label}
                        {l.href.startsWith("http") && <span className="text-nil-muted/40 ml-1 text-[9px]">↗</span>}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link href={l.href} className="text-nil-muted text-[13px] hover:text-nil-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 pt-8 border-t border-nil-border/20">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-nil-muted/50 font-mono">
            <span className="flex items-center gap-1.5"><span className="text-nil-gold/60">◆</span> 33-Signal Underwriting</span>
            <span className="flex items-center gap-1.5"><span className="text-nil-blue/60">◆</span> Portfolio Intelligence</span>
            <span className="flex items-center gap-1.5"><span className="text-nil-purple/60">◆</span> 50-State Compliance</span>
            <span className="flex items-center gap-1.5"><span className="text-nil-gold/60">◆</span> Institutional Audit Trail</span>
            <span className="flex items-center gap-1.5"><span className="text-nil-emerald/60">◆</span> Agency-Grade Reporting</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-nil-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-nil-muted/50 text-xs">
            © {new Date().getFullYear()} NIL33 — A UnyKorn Company. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-nil-muted/40 text-[11px]">
            <span>Institutional infrastructure for athlete capital markets</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
