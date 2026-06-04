"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import NavBar from "../components/NavBar";

const GOLD = "#e5b83c";
const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";

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

function PaymentContent() {
  const router = useRouter();
  const { profile } = useAuth();

  if (profile?.subscription_status === "admin") {
    router.push("/dashboard");
    return null;
  }

  const searchParams = useSearchParams();
  const tierParam = (searchParams.get("tier") ?? "").toLowerCase();
  const typeParam = searchParams.get("type") ?? "";
  const amountParam = searchParams.get("amount");
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
      <main style={{ minHeight: "100vh", background: "#050811", color: "#f8fafc" }}>
        <NavBar />
        <div style={{ textAlign: "center", padding: "120px 24px" }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#ef4444",
            marginBottom: 16,
          }}>
            INVALID TIER
          </p>
          <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>
            This payment link isn&apos;t valid.
          </p>
          <Link href="/pricing" style={{ fontFamily: MONO, fontSize: 13, color: GOLD, textDecoration: "none" }}>
            ← View pricing
          </Link>
        </div>
      </main>
    );
  }

  const { name } = tier;
  const amount = amountParam ? parseInt(amountParam, 10) : tier.amount;
  const isOneTime = typeParam === "one-time";

  const mailtoSubject = encodeURIComponent(`Payment sent — ${name} upgrade`);
  const mailtoBody = encodeURIComponent(
    `Account email: \nTier: ${name}\nAmount: $${amount} USDT\nNetwork used (BEP20 or TRC20): `
  );
  const mailtoHref = `mailto:support@xrayforensic.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <main style={{ minHeight: "100vh", background: "#050811", color: "#f8fafc" }}>
      <NavBar />

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "calc(64px + 64px) 24px 96px" }}>

        {/* Back link */}
        <Link
          href="/pricing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: MONO,
            fontSize: "12px",
            color: "#94a3b8",
            textDecoration: "none",
            marginBottom: "32px",
            letterSpacing: "0.05em",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = GOLD }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8" }}
        >
          ← Back
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: GOLD,
            margin: "0 0 16px",
          }}>
            X-RAY FORENSIC
          </p>
          <h1 style={{
            fontFamily: SPACE,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#f8fafc",
            lineHeight: 1.1,
            textAlign: "center",
            margin: "0 0 12px",
          }}>
            Complete Your Upgrade
          </h1>
          <p style={{
            fontFamily: MONO,
            fontSize: 14,
            color: GOLD,
            letterSpacing: "0.08em",
            margin: 0,
          }}>
            {name.toUpperCase()} TIER — ${amount}{isOneTime ? " · One-time payment — no subscription" : "/month"}
          </p>
        </div>

        {/* Warning banner */}
        <div style={{
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 28,
        }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#f59e0b",
            letterSpacing: "0.05em",
            lineHeight: 1.6,
            margin: 0,
          }}>
            ⚠ Double-check the address before sending. Crypto transactions cannot be reversed.
          </p>
        </div>

        {/* Crypto address cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {CRYPTO_ADDRESSES.map(({ network, chain, address }) => (
            <div
              key={network}
              style={{
                background: "#0e1626",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: "18px 20px",
              }}
            >
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
                    color: "#475569",
                    marginLeft: 8,
                  }}>
                    {chain}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(address)}
                  style={{
                    padding: "5px 14px",
                    background: copied === address ? "rgba(229,184,60,0.12)" : "transparent",
                    border: `1px solid ${copied === address ? GOLD : "rgba(229,184,60,0.35)"}`,
                    borderRadius: 5,
                    color: GOLD,
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied === address ? "Copied!" : "COPY"}
                </button>
              </div>

              <p style={{
                fontFamily: MONO,
                fontSize: 12,
                color: "#94a3b8",
                wordBreak: "break-all",
                lineHeight: 1.6,
                margin: 0,
                padding: "10px 12px",
                background: "#0b1220",
                borderRadius: 6,
                border: "1px solid #1e293b",
              }}>
                {address}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          padding: "16px 20px",
          background: "#0e1626",
          border: "1px solid #1e293b",
          borderRadius: 8,
          marginBottom: 32,
        }}>
          <p style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", lineHeight: 1.75, margin: 0 }}>
            Send exactly{" "}
            <span style={{ color: GOLD }}>${amount} USDT</span>
            {" "}to either address. Then click the button below to notify us.
            We verify and activate your tier within 24 hours.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={mailtoHref}
            style={{
              display: "block",
              padding: "16px 32px",
              background: GOLD,
              color: "#000000",
              fontFamily: SPACE,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 6,
              textDecoration: "none",
              marginBottom: 16,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#b88d1d" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
          >
            I&apos;ve Sent Payment →
          </a>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            Or email us:{" "}
            <a
              href="mailto:support@xrayforensic.com"
              style={{ color: "#94a3b8", fontFamily: MONO, textDecoration: "none" }}
            >
              support@xrayforensic.com
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ background: "#050811", minHeight: "100vh" }} />}>
      <PaymentContent />
    </Suspense>
  );
}
