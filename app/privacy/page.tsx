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

export default function PrivacyPage() {
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
          Privacy Policy
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

        <Body>
          X-Ray (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;the platform&rdquo;) is
          a forensic trade diagnostic service. This policy explains what data we
          collect, how we use it, and how we protect it.
        </Body>

        {/* 1 */}
        <Section title="1. What We Collect" />
        <Body>
          When you upload a trade history file (CSV or HTM), the file typically
          contains:
        </Body>
        <ListItems
          items={[
            "Trade ticket numbers",
            "Open and close timestamps",
            "Trading instrument (e.g., XAUUSD, NAS100)",
            "Trade direction (buy/sell)",
            "Lot size / volume",
            "Entry and exit prices",
            "Stop loss and take profit levels",
            "Profit/loss, swap, and commission values",
          ]}
        />
        <Body>We also collect:</Body>
        <ListItems
          items={[
            "Email address (for report delivery and account access)",
            "Account type selection (personal, prop firm, funded, demo)",
            "Challenge parameters you voluntarily provide (balance, drawdown limits, profit targets)",
            "Payment information (processed by Stripe — we never see or store your full card number)",
          ]}
        />

        {/* 2 */}
        <Section title="2. What We Never Collect" />
        <Body>
          X-Ray does not collect, request, store, or have access to:
        </Body>
        <ListItems
          items={[
            "Your MetaTrader 5 account password",
            "Your broker login credentials",
            "Your broker API keys or tokens",
            "Your bank account, withdrawal, or deposit information",
            "Your government-issued identification",
            "Your physical address",
            "Your account balance (unless you voluntarily provide it for context-aware analysis)",
          ]}
        />
        <Body>
          We have no ability to log into your trading account. We cannot place,
          modify, or close trades on your behalf. X-Ray is a read-only diagnostic
          tool that analyzes historical trade data you provide.
        </Body>

        {/* 3 */}
        <Section title="3. How We Use Your Data" />
        <Body>Your trade data is used exclusively to:</Body>
        <ListItems
          items={[
            "Generate your forensic diagnostic report",
            "Calculate your 7-dimension behavioral scores",
            "Produce prescriptions and compliance tracking",
            "Build your Trader DNA profile (if subscribed)",
            "Improve our diagnostic models through anonymized, aggregated statistical analysis",
          ]}
        />
        <Body>
          We do not sell, rent, license, or share your individual trade data with
          any third party. Ever.
        </Body>

        {/* 4 */}
        <Section title="4. Data Storage and Security" />
        <ListItems
          items={[
            "Trade history files (CSV/HTM) are processed in memory and may be temporarily stored during analysis. Original files are deleted after report generation.",
            "Generated reports are stored in encrypted cloud storage (Supabase) and accessible only to you via your account.",
            "All data transmission uses TLS 1.2+ encryption.",
            "Payment processing is handled entirely by Stripe, which is PCI DSS Level 1 certified. We never see or store your full payment card details.",
            "Database access is restricted to authenticated services with role-based access controls.",
          ]}
        />

        {/* 5 */}
        <Section title="5. Future Live Connector (Phase 3+)" />
        <Body>When the optional live MT5 connector becomes available:</Body>
        <ListItems
          items={[
            "A lightweight application runs on YOUR computer alongside your MetaTrader 5 terminal",
            "It reads trade data locally from your own MT5 installation",
            "Only trade event data (ticket, symbol, direction, P/L, timestamps) is transmitted to our servers",
            "Your MT5 login credentials are never transmitted to or stored on our servers",
            "The connection is strictly read-only — X-Ray cannot and will not place, modify, or close any trade",
            "You can disconnect the connector at any time",
          ]}
        />

        {/* 6 */}
        <Section title="6. Anonymized Aggregate Data" />
        <Body>We may use anonymized, non-identifiable aggregate data to:</Body>
        <ListItems
          items={[
            "Calculate platform-wide benchmarking percentiles",
            "Improve diagnostic model accuracy",
            "Generate platform statistics (e.g., \"2,400+ trades diagnosed\")",
            "Train proprietary diagnostic models",
          ]}
        />
        <Body>
          No individual trader can be identified from aggregate data.
        </Body>

        {/* 7 */}
        <Section title="7. Data Retention and Deletion" />
        <ListItems
          items={[
            "Free tier (SIGNAL): analysis data retained for 30 days, then automatically deleted",
            "Paid tiers: data retained for the duration of your subscription plus 90 days after cancellation",
            "You may request complete deletion of all your data at any time by contacting admin@xrayforensic.com",
            "Upon deletion request, all trade data, reports, and profile information are permanently removed within 14 business days",
          ]}
        />

        {/* 8 */}
        <Section title="8. Cookies and Tracking" />
        <ListItems
          items={[
            "We use essential cookies for authentication and session management only",
            "We do not use advertising cookies or tracking pixels",
            "We do not share data with advertising networks",
            "Basic analytics (page views, feature usage) may be collected to improve the platform",
          ]}
        />

        {/* 9 */}
        <Section title="9. Third-Party Services" />
        <Body>We use the following third-party services:</Body>
        <ListItems
          items={[
            "Stripe (payment processing) — stripe.com/privacy",
            "Supabase (database and authentication) — supabase.com/privacy",
            "Vercel (hosting) — vercel.com/legal/privacy-policy",
            "Anthropic Claude API (AI analysis) — anthropic.com/privacy",
          ]}
        />
        <Body>
          Note: trade data sent to the Claude API for analysis is not used by
          Anthropic to train their models per their API data policy.
        </Body>

        {/* 10 */}
        <Section title="10. Your Rights" />
        <Body>You have the right to:</Body>
        <ListItems
          items={[
            "Access all data we hold about you",
            "Request correction of inaccurate data",
            "Request complete deletion of your data",
            "Export your reports and analysis history",
            "Withdraw consent for data processing at any time",
          ]}
        />
        <Body>
          Contact:{" "}
          <a
            href="mailto:admin@xrayforensic.com"
            style={{ color: "var(--accent-primary)", textDecoration: "none" }}
          >
            admin@xrayforensic.com
          </a>
        </Body>

        {/* 11 */}
        <Section title="11. Changes to This Policy" />
        <Body>
          We may update this policy as the platform evolves. Material changes will
          be communicated via email to registered users. Continued use of the
          platform after changes constitutes acceptance.
        </Body>

        {/* 12 */}
        <Section title="12. Jurisdiction" />
        <Body>
          This platform is operated from Lebanon. By using X-Ray, you agree that
          any disputes will be governed by applicable Lebanese law, without
          prejudice to any mandatory consumer protection laws in your jurisdiction.
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
            href="/terms"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Terms of Service →
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
