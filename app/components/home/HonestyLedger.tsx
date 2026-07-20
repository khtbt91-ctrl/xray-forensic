import { Section, MonoLabel } from "./primitives";

/**
 * Honesty Ledger — AD ruling §7: true 6/6 split ruled by a full-height
 * vertical hairline; serif pull-quote row with hanging quote mark bleeding
 * into the left margin. ZERO brand-accent. Compliance line inline, visible.
 */

const THIS_IS = [
  "A rule-based forensic engine. Deterministic — the same input always produces the same verdict.",
  "MT5 trade history only — .csv, .htm, .html, .xlsx, or .xml.",
  "One dollar-priced report per analysis, with a free tier to start on.",
  "Built from real institutional trading concepts (SMC/ICT), not folklore.",
  "A system that shows you what's destroying your edge — and holds you accountable to fixing it.",
];

const THIS_IS_NOT = [
  "Not a narrative generator. Not a chatbot. Not a black box.",
  "Not a signal service — it does not tell you what to trade next.",
  "Not multi-asset or multi-broker yet — MT5 / XAUUSD-and-forex-focused today.",
  "Not financial advice.",
  "Not a guarantee of profit. No system is.",
];

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <MonoLabel className="text-[color:var(--text-secondary)]">{label}</MonoLabel>
      <ul className="mt-5 list-none p-0">
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-brand-border py-4 font-sans text-[16px] leading-relaxed text-[color:var(--text-primary)] last:border-b-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HonestyLedger() {
  return (
    <Section bg="bg">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
        <div className="md:pr-12">
          <Column label="This is" items={THIS_IS} />
        </div>
        <div className="border-t border-brand-border pt-12 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <Column label="This is not" items={THIS_IS_NOT} />
        </div>
      </div>

      <p className="mt-10 border-t border-brand-border pt-6 font-mono text-[11.5px] leading-relaxed tracking-[0.06em] text-[color:var(--text-muted)]">
        Not financial advice. Trading involves risk. All figures on this page
        are examples from demo accounts.
      </p>

      <blockquote className="relative m-0 mt-16 md:ml-[16.666%]">
        <span
          aria-hidden="true"
          className="absolute -left-3 -top-5 select-none font-['IBM_Plex_Serif',serif] text-[80px] italic leading-none text-brand-border md:-left-16 md:text-[110px]"
        >
          &ldquo;
        </span>
        <p className="relative max-w-[30ch] font-['IBM_Plex_Serif',serif] text-[24px] italic leading-snug text-[color:var(--text-primary)] md:text-[30px]">
          It doesn&rsquo;t ask how you feel about your trading. It shows you
          what your trades already prove.
        </p>
      </blockquote>
    </Section>
  );
}
