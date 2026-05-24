import Link from "next/link";

const MONO = "JetBrains Mono, monospace";

function Section({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-primary)",
        margin: "48px 0 16px",
        paddingBottom: 10,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {title}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        color: "var(--text-secondary)",
        lineHeight: 1.75,
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            paddingLeft: 20,
            position: "relative",
          }}
        >
          <span
            style={{ position: "absolute", left: 0, color: "var(--text-muted)" }}
          >
            —
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      <nav
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          ← X-Ray
        </Link>
      </nav>

      <article
        style={{ maxWidth: 720, margin: "0 auto", padding: "60px 32px 120px" }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 12,
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 10px",
          }}
        >
          Terms of Service
        </h1>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "var(--text-muted)",
            margin: "0 0 56px",
          }}
        >
          Last updated: May 25, 2026
        </p>

        {/* 1 */}
        <Section title="1. Service Description" />
        <Body>
          X-Ray is a forensic trade diagnostic platform that analyzes historical
          trading data to identify behavioral patterns, quantify performance leaks,
          and generate actionable prescriptions. The service provides statistical
          analysis and behavioral scoring — not trading signals, investment
          recommendations, or financial advice.
        </Body>

        {/* 2 */}
        <Section title="2. Not Financial Advice" />
        <Body>
          X-Ray is a diagnostic and analytical tool. Nothing on this platform
          constitutes financial advice, investment recommendation, trading signal,
          or solicitation to buy or sell any financial instrument.
        </Body>
        <Body>
          All analysis is based on historical data you provide. Past performance
          does not guarantee future results. Trading foreign exchange, contracts
          for difference (CFDs), and other leveraged instruments involves
          substantial risk and may not be suitable for all investors.
        </Body>
        <Body>
          You are solely responsible for your trading decisions. X-Ray&apos;s
          prescriptions are behavioral recommendations based on statistical
          analysis — not guarantees of future profitability.
        </Body>

        {/* 3 */}
        <Section title="3. Accuracy and Limitations" />
        <Body>
          While we strive for accuracy in our diagnostic analysis:
        </Body>
        <ListItems
          items={[
            "Scores and verdicts are based on the data you provide. Incomplete or inaccurate trade data will produce incomplete or inaccurate diagnoses.",
            "Monte Carlo simulations and pass probability projections are statistical estimates, not predictions.",
            "Benchmarking percentiles reflect the current platform user base and may not represent the broader trading population.",
            "AI-powered analysis (FORENSIC tier and above) uses large language models which may occasionally produce imprecise interpretations.",
          ]}
        />

        {/* 4 */}
        <Section title="4. Account Security" />
        <Body>
          You are responsible for maintaining the security of your account
          credentials. Do not share your login information. Notify us immediately
          at{" "}
          <a
            href="mailto:hello@xray.trade"
            style={{ color: "var(--accent-primary)", textDecoration: "none" }}
          >
            hello@xray.trade
          </a>{" "}
          if you suspect unauthorized access.
        </Body>
        <Body>
          We will never ask for your MetaTrader password, broker credentials, or
          bank details via email, chat, or any other channel. Any communication
          requesting such information is fraudulent and should be reported.
        </Body>

        {/* 5 */}
        <Section title="5. Acceptable Use" />
        <Body>You agree not to:</Body>
        <ListItems
          items={[
            "Upload fabricated or manipulated trade data",
            "Attempt to reverse-engineer the diagnostic algorithms",
            "Use the platform to manipulate or misrepresent trading performance to third parties",
            "Share or redistribute reports generated for other traders",
            "Use the API (SOVEREIGN tier) to build competing services",
            "Circumvent usage limits or access controls",
          ]}
        />

        {/* 6 */}
        <Section title="6. Intellectual Property" />
        <Body>
          The diagnostic framework, scoring algorithms, verdict system, Trader DNA
          profiles, and all associated methodologies are proprietary to X-Ray.
          Reports generated for you are licensed for your personal use. You may
          share your own reports but may not remove attribution or watermarks.
        </Body>

        {/* 7 */}
        <Section title="7. Payment and Refunds" />
        <ListItems
          items={[
            "Subscription payments are processed monthly via Stripe",
            "One-time products are non-refundable after report delivery",
            "Subscriptions can be cancelled at any time; access continues until the end of the billing period",
            "If a report fails to generate due to a technical error, you will receive a full refund or replacement analysis",
            "Free tier (SIGNAL) requires no payment and may be modified or discontinued at our discretion",
          ]}
        />

        {/* 8 */}
        <Section title="8. Service Availability" />
        <Body>
          We aim for continuous availability but do not guarantee uptime.
          Scheduled maintenance, infrastructure issues, or third-party service
          disruptions may cause temporary unavailability. We are not liable for
          losses resulting from service interruptions.
        </Body>

        {/* 9 */}
        <Section title="9. Limitation of Liability" />
        <Body>
          To the maximum extent permitted by law, X-Ray and its operators shall
          not be liable for:
        </Body>
        <ListItems
          items={[
            "Any trading losses incurred before, during, or after using the platform",
            "Decisions made based on diagnostic reports, prescriptions, or verdicts",
            "Inaccuracies in analysis resulting from incomplete or corrupted input data",
            "Service interruptions or data loss",
            "Third-party actions or security breaches beyond our reasonable control",
          ]}
        />
        <Body>
          Total liability shall not exceed the amount paid by you for the specific
          service giving rise to the claim.
        </Body>

        {/* 10 */}
        <Section title="10. Prop Firm Disclaimer" />
        <Body>
          X-Ray&apos;s Challenge Pre-Mortem, pass probability projections, and prop
          firm mode are analytical tools based on your historical data. We are not
          affiliated with, endorsed by, or partnered with any proprietary trading
          firm including but not limited to FTMO, Apex Trader Funding, The5%ers,
          Topstep, or any other firm.
        </Body>
        <Body>
          Prop firm names are used solely to identify the rule sets applied to your
          analysis. Compliance with any prop firm&apos;s specific rules is your
          responsibility.
        </Body>

        {/* 11 */}
        <Section title="11. Termination" />
        <Body>
          We reserve the right to suspend or terminate your account if you violate
          these terms, engage in fraudulent activity, or abuse the platform. Upon
          termination, your data will be handled per the Privacy Policy retention
          schedule.
        </Body>

        {/* 12 */}
        <Section title="12. Governing Law" />
        <Body>
          These terms are governed by the laws of Lebanon. Any disputes shall be
          resolved through good-faith negotiation first, and if necessary, through
          the competent courts of Beirut, Lebanon.
        </Body>

        {/* 13 */}
        <Section title="13. Contact" />
        <Body>
          For questions, concerns, or data requests:{" "}
          <a
            href="mailto:hello@xray.trade"
            style={{ color: "var(--accent-primary)", textDecoration: "none" }}
          >
            hello@xray.trade
          </a>
        </Body>

        {/* Footer nav */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/privacy"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Privacy Policy →
          </Link>
          <Link
            href="/"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Back to X-Ray →
          </Link>
        </div>
      </article>
    </main>
  );
}
