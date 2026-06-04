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
    qrSrc:   "/qr-bep20.png",
  },
  {
    network: "TRC20",
    chain:   "Tron",
    address: "TYoZG5HUq8gVh2cgiarCDXV2rbdnetaZhs",
    qrSrc:   "/qr-trc20.png",
  },
];

function PaymentContent() {
  const router = useRouter();
  const { profile, user, session } = useAuth();

  // ── All hooks must come before any conditional return ──────────────────────
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Admin bypass
  if (profile?.subscription_status === "admin") {
    router.push("/dashboard");
    return null;
  }

  const tierParam = (searchParams.get("tier") ?? "").toLowerCase();
  const typeParam = searchParams.get("type") ?? "";
  const amountParam = searchParams.get("amount");
  const tier = TIER_MAP[tierParam];

  const handleCopy = async (address: string, network: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(address);
      setSelectedNetwork(network);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // address is visible for manual copy
    }
  };

  const handleSubmitPayment = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tx_hash: txHash.trim(),
          email: user?.email ?? "",
          tier_id: tierParam,
          amount: amount,
          wallet: selectedNetwork ?? "unknown",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Submission failed");
      }
      setSubmitted(true);
      setModalOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      setSubmitError(msg);
      setModalOpen(false);
    } finally {
      setSubmitting(false);
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

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main style={{ minHeight: "100vh", background: "#050811", color: "#f8fafc" }}>
        <NavBar />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "calc(64px + 80px) 24px 96px", textAlign: "center" }}>
          <div style={{ fontSize: 52, color: GOLD, marginBottom: 20, lineHeight: 1 }}>✓</div>
          <p style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            margin: "0 0 16px",
          }}>
            PAYMENT NOTIFICATION SENT
          </p>
          <h2 style={{
            fontFamily: SPACE,
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#f8fafc",
            margin: "0 0 20px",
            letterSpacing: "-0.02em",
          }}>
            We received your submission.
          </h2>
          <p style={{ fontFamily: MONO, fontSize: 13, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 8px" }}>
            We&apos;ll email <span style={{ color: "#f8fafc" }}>{user?.email}</span> once verified.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 13, color: "#475569", margin: 0 }}>
            Usually within a few hours.
          </p>
        </div>
      </main>
    );
  }

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
          {CRYPTO_ADDRESSES.map(({ network, chain, address, qrSrc }) => (
            <div
              key={network}
              style={{
                background: "#0e1626",
                border: `1px solid ${selectedNetwork === network ? GOLD : "#1e293b"}`,
                borderRadius: 10,
                padding: "18px 20px",
                transition: "border-color 0.15s",
              }}
            >
              {/* Network label */}
              <div style={{ marginBottom: 12 }}>
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

              {/* Address */}
              <p style={{
                fontFamily: MONO,
                fontSize: 12,
                color: "#94a3b8",
                wordBreak: "break-all",
                lineHeight: 1.6,
                margin: "0 0 14px",
                padding: "10px 12px",
                background: "#0b1220",
                borderRadius: 6,
                border: "1px solid #1e293b",
              }}>
                {address}
              </p>

              {/* QR code */}
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <div style={{
                  display: "inline-block",
                  padding: 8,
                  background: "#ffffff",
                  borderRadius: 6,
                  lineHeight: 0,
                }}>
                  <img src={qrSrc} width={120} height={120} alt={`${network} QR`} />
                </div>
                <p style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: "#475569",
                  margin: "6px 0 0",
                  letterSpacing: "0.05em",
                }}>
                  Scan with Trust Wallet
                </p>
              </div>

              {/* COPY button */}
              <button
                onClick={() => handleCopy(address, network)}
                style={{
                  width: "100%",
                  padding: "8px 14px",
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
                }}
              >
                {copied === address ? "✓ Copied!" : "COPY ADDRESS"}
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          padding: "16px 20px",
          background: "#0e1626",
          border: "1px solid #1e293b",
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <p style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", lineHeight: 1.75, margin: 0 }}>
            Send exactly{" "}
            <span style={{ color: GOLD }}>${amount} USDT</span>
            {" "}to either address above. Copy an address to select your wallet, then notify us below.
          </p>
        </div>

        {/* TX hash input — shown after wallet selected */}
        {selectedNetwork && (
        <div style={{ marginBottom: 32 }}>
          <label style={{
            display: "block",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#94a3b8",
            marginBottom: 4,
          }}>
            TRANSACTION ID
          </label>
          <p style={{ fontFamily: MONO, fontSize: 10, color: "#475569", margin: "0 0 10px" }}>
            Optional — speeds up activation
          </p>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Paste your transaction ID here (optional)"
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "#0b1220",
              border: `1px solid ${txHash.trim() ? GOLD : "#1e293b"}`,
              borderRadius: 8,
              color: "#f8fafc",
              fontFamily: MONO,
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
          />
          <p style={{ fontFamily: MONO, fontSize: 10, color: "#334155", margin: "8px 0 0", lineHeight: 1.8 }}>
            Find in your wallet → Transaction History → tap the transaction → copy the ID<br />
            Without it: activated within 24h<br />
            With it: activated within 1–2h
          </p>
        </div>
        )}

        {/* Error state */}
        {submitError && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: MONO, fontSize: 12, color: "#ef4444", margin: "0 0 6px" }}>
              Submission failed. Please contact us directly.
            </p>
            <a
              href="mailto:admin@xrayforensic.com"
              style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", textDecoration: "none" }}
            >
              admin@xrayforensic.com →
            </a>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!selectedNetwork}
            style={{
              display: "block",
              width: "100%",
              padding: "16px 32px",
              background: selectedNetwork ? GOLD : "#1e293b",
              color: selectedNetwork ? "#000000" : "#475569",
              fontFamily: SPACE,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              cursor: selectedNetwork ? "pointer" : "not-allowed",
              marginBottom: 16,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (selectedNetwork) e.currentTarget.style.background = "#b88d1d" }}
            onMouseLeave={(e) => { if (selectedNetwork) e.currentTarget.style.background = GOLD }}
          >
            I&apos;ve Paid — Notify Team →
          </button>
          {!selectedNetwork && (
            <p style={{ fontFamily: MONO, fontSize: 11, color: "#334155", margin: 0 }}>
              Copy a wallet address above to continue
            </p>
          )}
        </div>

      </div>

      {/* ── Confirmation modal ────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.80)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e1626",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: "32px 28px",
              maxWidth: 440,
              width: "100%",
            }}
          >
            <p style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 12px",
            }}>
              CONFIRM SUBMISSION
            </p>
            <h3 style={{
              fontFamily: SPACE,
              fontSize: 18,
              fontWeight: 700,
              color: "#f8fafc",
              margin: "0 0 20px",
              letterSpacing: "-0.01em",
            }}>
              Confirm Payment Submission
            </h3>
            <p style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>
              Please confirm:
            </p>
            <ul style={{ margin: "0 0 20px", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "You sent the exact amount shown",
                "To the correct wallet address",
                "Transaction is complete (not pending)",
              ].map((item) => (
                <li key={item} style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontFamily: MONO, fontSize: 11, color: "#475569", margin: "0 0 28px", lineHeight: 1.6 }}>
              Our team will verify and activate your account within a few hours.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  color: "#94a3b8",
                  fontFamily: MONO,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#334155" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e293b" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: submitting ? "#1e293b" : GOLD,
                  border: "none",
                  borderRadius: 6,
                  color: submitting ? "#475569" : "#000000",
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                  transition: "background 0.15s",
                }}
              >
                {submitting ? "Submitting…" : "Yes, I've Paid — Notify Team"}
              </button>
            </div>
          </div>
        </div>
      )}

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
