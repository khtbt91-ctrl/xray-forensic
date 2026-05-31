"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const GOLD = "#C9A84C";
const MONO = "JetBrains Mono, monospace";

const TIER_MAP: Record<string, { name: string; amount: number }> = {
  forensic: { name: "Forensic", amount: 29 },
  operator: { name: "Operator", amount: 79 },
  elite:    { name: "Elite",    amount: 149 },
};

const CRYPTO_ADDRESSES = [
  {
    network: "BEP20",
    chain:   "BNB Smart Chain",
    address: "0x620869b71e673bFfeAc79420a7141fE8853ba67e",
  },
  {
    network: "TRC20",
    chain:   "Tron",
    address: "TYoZG5HUq8gVh2cgiarCDXV2rbdnetaZhs",
  },
];

function NavBar() {
  return (
    <nav style={{
      borderBottom: "1px solid var(--border-subtle)",
      padding: "16px 40px",
      display: "flex",
      alignItems: "center",
    }}>
      <Link
        href="/"
        style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}
      >
        ← X-Ray
      </Link>
    </nav>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const tierParam = (searchParams.get("tier") ?? "").toLowerCase();
  const tier = TIER_MAP[tierParam];
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(address);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // address is visible for manual copy
    }
  };

  if (!tier) {
    return (
      <main style={{ minHeight: "100vh", background: "#0A0A0A", color: "var(--text-primary)" }}>
        <NavBar />
        <div style={{ textAlign: "center", padding: "120px 24px" }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--loss)",
            marginBottom: 16,
          }}>
            INVALID TIER
          </p>
          <p style={{ fontSize: 18, color: "#E5E7EB", marginBottom: 32 }}>
            This payment link isn&apos;t valid.
          </p>
          <Link href="/pricing" style={{ fontFamily: MONO, fontSize: 13, color: GOLD, textDecoration: "none" }}>
            ← View pricing
          </Link>
        </div>
      </main>
    );
  }

  const { name, amount } = tier;

  const mailtoSubject = encodeURIComponent(`Payment sent — ${name} upgrade`);
  const mailtoBody = encodeURIComponent(
    `Account email: \nTier: ${name}\nAmount: $${amount} USDT\nNetwork used (BEP20 or TRC20): `
  );
  const mailtoHref = `mailto:support@xrayforensic.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A", color: "var(--text-primary)" }}>
      <NavBar />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            margin: "0 0 20px",
          }}>
            PAYMENT
          </p>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.2,
            margin: "0 0 12px",
          }}>
            Complete Your Upgrade
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 15, color: "#9CA3AF", margin: 0 }}>
            {name} — ${amount}/month
          </p>
        </div>

        {/* Warning — above addresses so it's read first */}
        <p style={{
          fontSize: 16,
          color: "#9CA3AF",
          textAlign: "center",
          lineHeight: 1.65,
          margin: "0 0 32px",
        }}>
          Double-check the address before sending.<br />
          Crypto transactions cannot be reversed.
        </p>

        {/* Crypto address cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
          {CRYPTO_ADDRESSES.map(({ network, chain, address }) => (
            <div
              key={network}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 10,
                padding: "20px 24px",
              }}
            >
              {/* Network label + copy button */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <div>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: GOLD,
                  }}>
                    {network}
                  </span>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: "#6B7280",
                    marginLeft: 8,
                  }}>
                    {chain}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(address)}
                  style={{
                    padding: "5px 14px",
                    background: copied === address ? "rgba(201,168,76,0.15)" : "transparent",
                    border: `1px solid ${copied === address ? GOLD : "rgba(201,168,76,0.4)"}`,
                    borderRadius: 5,
                    color: GOLD,
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied === address ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Address */}
              <p style={{
                fontFamily: MONO,
                fontSize: 13,
                color: "#E5E7EB",
                wordBreak: "break-all",
                lineHeight: 1.6,
                margin: 0,
                padding: "12px 14px",
                background: "var(--bg-elevated)",
                borderRadius: 6,
                border: "1px solid var(--border-subtle)",
              }}>
                {address}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          padding: "20px 24px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          marginBottom: 36,
        }}>
          <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.75, margin: 0 }}>
            Send exactly{" "}
            <span style={{ color: "#E5E7EB", fontFamily: MONO }}>${amount} USDT</span>
            {" "}to either address. Then click the button below to notify us. We verify and activate your tier within 24 hours.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={mailtoHref}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: GOLD,
              color: "#000000",
              fontFamily: MONO,
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 6,
              textDecoration: "none",
              letterSpacing: "0.06em",
              marginBottom: 20,
            }}
          >
            I&apos;ve sent payment — notify support →
          </a>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            Or email us directly:{" "}
            <span style={{ color: "#9CA3AF", fontFamily: MONO }}>
              support@xrayforensic.com
            </span>
          </p>
        </div>

      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0A0A0A", minHeight: "100vh" }} />}>
      <PaymentContent />
    </Suspense>
  );
}
