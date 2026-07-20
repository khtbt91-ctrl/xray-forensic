import Link from "next/link";

/**
 * Homepage-specific nav (shared NavBar.tsx untouched — 8 other routes use it).
 * AD ruling: chrome row, 56-64px, wordmark cols 1-2, links right-weighted,
 * ghost accent-bordered CTA. Mobile: wordmark + <details> menu, no JS.
 */

const LINKS = [
  { href: "#evidence", label: "How it works" },
  { href: "#dimensions", label: "Dimensions" },
  { href: "/sample", label: "Sample report" },
  { href: "#pricing", label: "Pricing" },
];

function Wordmark() {
  return (
    <Link
      href="/"
      className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-primary)]"
    >
      X-Ray Forensic
    </Link>
  );
}

function GhostCta({ className = "" }: { className?: string }) {
  return (
    <a
      href="/new"
      className={`inline-flex items-center justify-center rounded-[3px] border border-brand-accent px-5 py-2 font-sans text-[14px] font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-brand-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent ${className}`}
    >
      Get diagnosed
    </a>
  );
}

export default function HomeNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg">
      <div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Wordmark />

        {/* Desktop */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-[14px] text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <GhostCta className="hidden md:inline-flex" />

        {/* Mobile — CSS-only disclosure, no client JS */}
        <details className="group relative md:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center font-mono text-[18px] text-[color:var(--text-primary)] [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <span className="group-open:hidden">&#9776;</span>
            <span className="hidden group-open:inline">&times;</span>
          </summary>
          <nav
            className="absolute right-0 top-12 flex w-64 flex-col gap-1 border border-brand-border bg-brand-card p-4"
            aria-label="Main"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2 font-sans text-[15px] text-[color:var(--text-secondary)]"
              >
                {l.label}
              </a>
            ))}
            <GhostCta className="mt-3 w-full" />
          </nav>
        </details>
      </div>
    </header>
  );
}
