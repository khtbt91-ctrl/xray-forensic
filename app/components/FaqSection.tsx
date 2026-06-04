"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { FadeInUp } from "./shared";

const FAQ = [
  {
    q: "What do I upload?",
    a: "Your MT5 trade history export as a CSV file. Most brokers let you export this in 3 clicks from the History tab.",
  },
  {
    q: "Does this work for prop firm challenges?",
    a: "Yes. Prop firm mode maps your trades against your challenge's daily drawdown, max drawdown, and profit target rules.",
  },
  {
    q: "How is this different from a trading journal?",
    a: "A journal records what happened. X-Ray diagnoses why — and attaches a dollar cost to every behavioral pattern it finds.",
  },
  {
    q: "Can I try it free?",
    a: "Yes. The SIGNAL tier is permanently free — one analysis per month with 7 dimension scores and session breakdown.",
  },
  {
    q: "How fast do I get my report?",
    a: "SIGNAL and FORENSIC reports process in under 30 seconds. Higher-tier forensic diagnosis (AI-assisted) completes in under 2 minutes.",
  },
  {
    q: "Do you support crypto exchanges?",
    a: "Yes. Upload your trade history CSV from Binance, Bybit, OKX, Bitget, or BingX. X-Ray auto-detects the exchange and applies the same 12-module forensic analysis used for forex.",
  },
  {
    q: "What about EA and automated trading?",
    a: "X-Ray includes an EA Autopsy product. Download the free Magic Export script from /tools, run it in MT5 to capture magic numbers, then upload both files. X-Ray separates each EA from your manual trades and analyzes them independently.",
  },
  {
    q: "Is my trade data stored or shared?",
    a: "Your CSV file is processed and immediately discarded. The diagnostic output (scores, metrics) is stored linked to your account so you can access past reports. Your raw trade data is never retained.",
  },
  {
    q: "How accurate is the prop firm pass probability?",
    a: "The Monte Carlo simulation runs 1,000 scenarios using your actual win rate, average loss, and behavioral patterns. It predicts drawdown breach probability based on your real data — not industry averages. The prediction is only as accurate as your historical consistency.",
  },
  {
    q: "What file formats do you accept?",
    a: "MT5 HTML report export (.htm), MT5 XML export, MT5 CSV export. For crypto: CSV exports from Binance, Bybit, OKX, Bitget, and BingX. No account connection required — just the exported file.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 48px",
          }}
        >
          Before you decide.
        </h2>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <Accordion.Root type="single" collapsible style={{ display: "flex", flexDirection: "column" }}>
          {FAQ.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`q${i}`}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <Accordion.Header style={{ margin: 0 }}>
                <Accordion.Trigger className="accordion-trigger">
                  <span>{item.q}</span>
                  <span className="accordion-chevron">+</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="accordion-content">
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, padding: "0 0 20px", margin: 0 }}>
                  {item.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </FadeInUp>
    </section>
  );
}
