import { Section, MonoLabel } from "./primitives";

/**
 * Pricing — one comparison instrument, never four cards. AD ruling §8:
 * shared hairline rows, FORENSIC emphasized by a 1px accent border ONLY.
 * Spot Forensic $49 = quiet full-width footnote row. Prices hardcoded here
 * deliberately — NOT imported from lib/tiers.ts (unconfirmed SKUs live there);
 * canonical list = design_rules.md §7.
 * Mobile: horizontal scroll-snap rail, FORENSIC first-visible.
 */

const TIERS = [
  { name: "SIGNAL", price: "Free", per: "", cta: "Start Free", featured: false },
  { name: "FORENSIC", price: "$29", per: "/mo", cta: "Choose Forensic", featured: true },
  { name: "OPERATOR", price: "$79", per: "/mo", cta: "Choose Operator", featured: false },
  { name: "ELITE", price: "$149", per: "/mo", cta: "Choose Elite", featured: false },
];

const ROWS: { label: string; cells: string[] }[] = [
  { label: "Analyses per month", cells: ["1", "4", "Unlimited", "Unlimited"] },
  { label: "Seven-dimension scorecard", cells: ["Behavioral flags only", "Full scorecard, all 11 modules", "Full scorecard", "Full scorecard"] },
  { label: "Ranked prescriptions", cells: ["2", "5", "5", "5"] },
  { label: "Progress tracking across re-uploads", cells: ["—", "Yes", "Yes", "Yes"] },
  { label: "Benchmarking + compliance tracking", cells: ["—", "—", "Yes", "Yes"] },
  { label: "Prop-firm challenge readiness", cells: ["—", "—", "—", "Yes"] },
];

function TierCta({ label, featured }: { label: string; featured: boolean }) {
  return (
    <a
      href="/new"
      className={`inline-flex w-full items-center justify-center rounded-[3px] border px-4 py-2.5 font-sans text-[13.5px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent ${
        featured
          ? "border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-bg"
          : "border-brand-border text-[color:var(--text-secondary)] hover:border-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
      }`}
    >
      {label}
    </a>
  );
}

function TierHeader({ tier }: { tier: (typeof TIERS)[number] }) {
  return (
    <div>
      <MonoLabel className="text-[10.5px]">{tier.name}</MonoLabel>
      <p className="mt-2 font-mono text-[34px] font-bold tabular-nums leading-none text-[color:var(--text-primary)]">
        {tier.price}
        {tier.per ? (
          <span className="text-[15px] font-medium text-[color:var(--text-muted)]">{tier.per}</span>
        ) : null}
      </p>
    </div>
  );
}

export default function PricingTable() {
  return (
    <Section id="pricing" bg="slate">
      <MonoLabel>Pricing</MonoLabel>

      {/* Desktop: one ruled comparison table */}
      <div className="mt-10 hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <td className="w-[22%] border-b border-brand-border" />
              {TIERS.map((t) => (
                <th
                  key={t.name}
                  scope="col"
                  className={`border-b border-brand-border px-5 pb-6 text-left align-bottom ${
                    t.featured ? "border-x border-t border-x-brand-accent border-t-brand-accent" : ""
                  }`}
                >
                  <TierHeader tier={t} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="border-b border-brand-border py-4 pr-6 text-left font-sans text-[13.5px] font-medium text-[color:var(--text-secondary)]"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-brand-border px-5 py-4 font-sans text-[13.5px] ${
                      cell === "—"
                        ? "text-[color:var(--text-muted)]"
                        : "text-[color:var(--text-primary)]"
                    } ${TIERS[i].featured ? "border-x border-x-brand-accent" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-5 pr-6" />
              {TIERS.map((t) => (
                <td
                  key={t.name}
                  className={`px-5 py-5 ${
                    t.featured ? "border-x border-b border-x-brand-accent border-b-brand-accent" : ""
                  }`}
                >
                  <TierCta label={t.cta} featured={t.featured} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: scroll-snap rail, FORENSIC first-visible */}
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`w-[80vw] max-w-[320px] shrink-0 snap-center rounded-[4px] border p-5 ${
              t.featured ? "order-first border-brand-accent" : "border-brand-border"
            } bg-brand-card`}
          >
            <TierHeader tier={t} />
            <ul className="mt-5 list-none border-t border-brand-border p-0">
              {ROWS.map((row) => {
                const cell = row.cells[TIERS.indexOf(t)];
                return (
                  <li
                    key={row.label}
                    className="flex items-baseline justify-between gap-3 border-b border-brand-border py-2.5 font-sans text-[12.5px]"
                  >
                    <span className="text-[color:var(--text-muted)]">{row.label}</span>
                    <span
                      className={`text-right ${
                        cell === "—"
                          ? "text-[color:var(--text-muted)]"
                          : "text-[color:var(--text-primary)]"
                      }`}
                    >
                      {cell}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5">
              <TierCta label={t.cta} featured={t.featured} />
            </div>
          </div>
        ))}
      </div>

      {/* Spot Forensic — the quiet footnote SKU */}
      <div className="mt-10 flex flex-col gap-4 rounded-[4px] border border-brand-border bg-brand-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[13px] font-bold tracking-[0.08em] text-[color:var(--text-primary)]">
            SPOT FORENSIC &mdash; <span className="tabular-nums">$49</span> one-time
          </p>
          <p className="mt-1.5 max-w-[56ch] font-sans text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
            One full report. No subscription. For a trader who wants the
            diagnosis once before committing to anything.
          </p>
        </div>
        <a
          href="/new"
          className="inline-flex shrink-0 items-center justify-center rounded-[3px] border border-brand-border px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Get One Report
        </a>
      </div>
    </Section>
  );
}
