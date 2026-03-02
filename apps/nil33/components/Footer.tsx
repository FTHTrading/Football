import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "How it works" },
      { href: "/demo", label: "Live demo" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/collectives", label: "For collectives" },
      { href: "/developers", label: "For developers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "https://github.com/FTHTrading", label: "GitHub", external: true },
      { href: "mailto:partnerships@nil33.com", label: "Contact", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-nil-border/60 bg-nil-black">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
                <span className="text-nil-green font-bold text-xs font-mono">33</span>
              </div>
              <span className="text-nil-white font-semibold text-sm">NIL33</span>
            </div>
            <p className="text-nil-muted text-xs leading-relaxed max-w-[200px]">
              Capital discipline software for NIL collectives. Norcross, GA.
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

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-nil-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-nil-muted/60 text-xs">
            © {new Date().getFullYear()} NIL33 — A UnyKorn Company
          </p>
          <p className="text-nil-muted/40 text-[11px]">
            Built with Rust, Next.js, and Ed25519.
          </p>
        </div>
      </div>
    </footer>
  );
}
