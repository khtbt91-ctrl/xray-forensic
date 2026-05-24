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
    a: "Yes. The SIGNAL tier is permanently free — one audit per month with 7 dimension scores and session breakdown.",
  },
  {
    q: "How fast do I get my report?",
    a: "SIGNAL and AUDIT reports process in under 30 seconds. FORENSIC AI diagnosis completes in under 2 minutes.",
  },
];

export default function FaqSection() {
  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px 100px" }}>
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
