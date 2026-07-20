import type { ReactNode } from "react";

/**
 * Homepage v3 primitives — server components only.
 * Constraints: design_rules.md — no raw hex (tokens/vars only), no opacity:0
 * base states, hairlines over boxed cards, 12-col grid inside a 1400px frame.
 */

const SECTION_BG = {
  bg: "bg-brand-bg",
  slate: "bg-brand-slate",
  card: "bg-brand-card",
} as const;

export function Section({
  id,
  bg = "bg",
  className = "",
  children,
}: {
  id?: string;
  bg?: keyof typeof SECTION_BG;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${SECTION_BG[bg]} ${className}`}>
      <div className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-32">
        {children}
      </div>
    </section>
  );
}

/** 12-col grid frame. Children place themselves with col-start/col-span utilities. */
export function Grid({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8 ${className}`}>
      {children}
    </div>
  );
}

/** Mono uppercase micro-label — the ledger voice. */
export function MonoLabel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  );
}

/** Compliance tag that must sit adjacent to every figure. */
export function DemoTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--text-muted)] ${className}`}
    >
      Example — demo account
    </span>
  );
}

export function RuledDivider({ className = "" }: { className?: string }) {
  return <div className={`border-t border-brand-border ${className}`} aria-hidden="true" />;
}

/** Primary CTA — solid accent fill, brand-bg text (never pure black/white). */
export function CtaPrimary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-[3px] bg-brand-accent px-7 py-3.5 font-sans text-[15px] font-semibold text-brand-bg transition-colors hover:bg-brand-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      {children}
    </a>
  );
}

/** Light-filled CTA — for the hero, where the accent budget is spent on the
 *  headline word (AD ruling §2: nothing else in the hero is accent-colored). */
export function CtaLight({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-[3px] bg-[color:var(--text-primary)] px-7 py-3.5 font-sans text-[15px] font-semibold text-brand-bg transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      {children}
    </a>
  );
}

/** Secondary CTA — quiet text link with arrow, hairline underline on hover. */
export function CtaSecondary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 border-b border-transparent font-sans text-[15px] font-medium text-[color:var(--text-secondary)] transition-colors hover:border-brand-border hover:text-[color:var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      {children}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}
