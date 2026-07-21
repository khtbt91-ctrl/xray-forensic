import Link from "next/link";
import { MonoLabel } from "./primitives";

/** copy-home-v3.md §8 FOOTER-LINKS/FOOTER-LEGAL, verbatim. Carries the
 *  /roadmap transparency link (structural-delta-spec-v2 §B row 6). */

const COLS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Platform",
    links: [
      { href: "/#pricing", label: "Pricing" },
      { href: "/sample", label: "Sample Report" },
      { href: "/foundations", label: "Foundations" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-border bg-brand-bg">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <p className="font-sans text-base font-bold tracking-[0.04em] text-[color:var(--text-primary)]">
              X-RAY FORENSIC
            </p>
            <MonoLabel className="mt-1 block text-[10px]">
              Forensic trade diagnostic
            </MonoLabel>
            <p className="mt-4 max-w-[40ch] font-sans text-[13px] leading-relaxed text-[color:var(--text-muted)]">
              Analytics and education only — not a broker, not a signal
              service, not financial advice.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.label} className="md:col-span-3">
              <MonoLabel className="mb-4 block text-[10px]">{col.label}</MonoLabel>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="font-mono text-[12px] text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-secondary)]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-border py-6">
          <p className="font-sans text-[12px] text-[color:var(--text-muted)]">
            For prop firms and institutional desks:{" "}
            <a
              href="mailto:admin@xrayforensic.com"
              className="text-[color:var(--text-secondary)] underline decoration-brand-border underline-offset-2 transition-colors hover:text-[color:var(--text-primary)]"
            >
              admin@xrayforensic.com
            </a>
          </p>
          <p className="mt-2 font-sans text-[12px] text-[color:var(--text-muted)]">
            &copy; 2026 X-Ray Forensic. Analytics and education only &mdash;
            not a broker, not a signal service, not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
