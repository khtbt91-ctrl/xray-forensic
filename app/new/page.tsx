"use client";

import React, { useCallback, useRef, useState, useEffect, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Disclaimer from "../../components/Disclaimer";
import { tierData } from "@/lib/tiers";

const MONO = "JetBrains Mono, monospace";

type AccountType = "personal" | "prop" | "funded" | "demo";

interface ContextProfile {
  accountType: AccountType;
  firm: string;
  challengeBalance: string;
  dailyDdLimit: string;
  maxDdLimit: string;
  profitTarget: string;
  minTradingDays: string;
  daysRemaining: string;
  accountBalance: string;
  clientName: string;
  email: string;
}

type TierName = "SIGNAL" | "AUDIT" | "FORENSIC" | "GUARDIAN" | "SOVEREIGN";
type OneTime = "spot" | "pre-challenge" | null;

const TIERS: {
  name: TierName;
  price: string;
  tagline: string;
  features: string[];
  popular: boolean;
  disabled: boolean;
  accent: string;
}[] = [
  {
    name: "SIGNAL",
    price: "Free",
    tagline: "Start free. One full diagnosis per month.",
    features: ["1 audit/month", "7 dimension scores", "Session P&L breakdown", "Top 3 behavioral flags"],
    popular: false,
    disabled: false,
    accent: "var(--text-secondary)",
  },
  {
    name: "AUDIT",
    price: "$29/mo",
    tagline: "Full forensic read. Your first real mirror.",
    features: ["3 audits/month", "Full narrative", "Ranked prescriptions", "Drill-down stats"],
    popular: false,
    disabled: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "FORENSIC",
    price: "$79/mo",
    tagline: "Institutional-grade behavioral intelligence.",
    features: ["10 audits/month", "Forensic AI narrative — full behavioral read", "Prop firm mode", "DNA profile", "Pre-mortem"],
    popular: true,
    disabled: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "GUARDIAN",
    price: "$149/mo",
    tagline: "The risk desk you never had.",
    features: ["Unlimited audits", "Live MT5 sync", "Telegram watchdog", "5 accounts", "Certification"],
    popular: false,
    disabled: false,
    accent: "var(--accent-secondary)",
  },
  {
    name: "SOVEREIGN",
    price: "$399/mo",
    tagline: "White-label intelligence for firms.",
    features: ["50 accounts", "Firm-wide analytics", "Custom rule engine", "API access", "White-label"],
    popular: false,
    disabled: false,
    accent: "var(--warning)",
  },
];


// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({
  steps,
  currentStepKey,
  selectedTier,
}: {
  steps: { label: string; key: string }[];
  currentStepKey: string;
  selectedTier: string | null;
}) {
  const currentIndex = steps.findIndex((s) => s.key === currentStepKey);
  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 100;

  const lockedTierInfo =
    selectedTier && tierData[selectedTier as keyof typeof tierData]
      ? tierData[selectedTier as keyof typeof tierData]
      : null;

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Step dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 16,
                    lineHeight: 1,
                    color: done ? "var(--profit)" : active ? "var(--accent-primary)" : "var(--border-subtle)",
                  }}
                >
                  {done ? "✓" : active ? "●" : "○"}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: done ? "var(--profit)" : active ? "var(--accent-primary)" : "var(--text-muted)",
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span style={{ color: "var(--border-subtle)", fontSize: 14, margin: "0 2px" }}>→</span>
              )}
            </React.Fragment>
          );
        })}

        {/* Tier badge — shown when a tier is known */}
        {lockedTierInfo && (
          <span style={{
            background: "rgba(88,166,255,0.1)",
            color: "var(--accent-primary)",
            padding: "2px 8px",
            borderRadius: 4,
            fontFamily: MONO,
            fontSize: "0.65rem",
            marginLeft: 8,
          }}>
            {lockedTierInfo.name} · {lockedTierInfo.price}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "var(--border-subtle)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent-primary)",
            borderRadius: 2,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
        {label}{required && <span style={{ color: "var(--loss)", marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 6,
          color: "var(--text-primary)",
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix = "$",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 6, overflow: "hidden" }}>
        <span style={{ padding: "10px 12px", fontFamily: MONO, fontSize: 13, color: "var(--text-muted)", borderRight: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: "10px 12px", background: "transparent", border: "none", outline: "none", fontFamily: MONO, fontSize: 13, color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}

// ── Step 1: Context Profile ───────────────────────────────────────────────────

function Step1({
  profile,
  setProfile,
  onNext,
}: {
  profile: ContextProfile;
  setProfile: (p: ContextProfile) => void;
  onNext: () => void;
}) {
  const ACCOUNT_TYPES: { type: AccountType; label: string; desc: string }[] = [
    { type: "personal", label: "Personal Account", desc: "Self-funded live account" },
    { type: "prop", label: "Prop Firm Challenge", desc: "Funded challenge in progress" },
    { type: "funded", label: "Funded Account", desc: "Already passed — now on funded" },
    { type: "demo", label: "Demo / Evaluation", desc: "Practice or evaluation account" },
  ];

  const FIRMS = ["FTMO", "Apex", "The5%ers", "Topstep", "Custom"];

  const isPropOrFunded = profile.accountType === "prop" || profile.accountType === "funded";

  const canNext = profile.clientName.trim() !== "" && profile.email.trim() !== "";

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Context Profile</h2>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
        More context → more precise diagnosis.
      </p>

      {/* Account type */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 14px" }}>Account type</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {ACCOUNT_TYPES.map((a) => {
            const sel = profile.accountType === a.type;
            return (
              <button
                key={a.type}
                onClick={() => setProfile({ ...profile, accountType: a.type, firm: "" })}
                style={{
                  background: sel ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: sel ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  padding: "20px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: sel ? "var(--accent-primary)" : "var(--text-primary)", margin: "0 0 5px" }}>{a.label}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prop / Funded fields */}
      {isPropOrFunded && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "24px", marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 16px" }}>Firm details</p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Firm</label>
            <select
              value={profile.firm}
              onChange={(e) => setProfile({ ...profile, firm: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 6, color: "var(--text-primary)", fontSize: 13, fontFamily: MONO, outline: "none" }}
            >
              <option value="">Select firm…</option>
              {FIRMS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumberField label="Challenge Balance" value={profile.challengeBalance} onChange={(v) => setProfile({ ...profile, challengeBalance: v })} />
            <NumberField label="Daily Drawdown Limit" value={profile.dailyDdLimit} onChange={(v) => setProfile({ ...profile, dailyDdLimit: v })} />
            <NumberField label="Max Drawdown Limit" value={profile.maxDdLimit} onChange={(v) => setProfile({ ...profile, maxDdLimit: v })} />
            <NumberField label="Profit Target" value={profile.profitTarget} onChange={(v) => setProfile({ ...profile, profitTarget: v })} />
            <NumberField label="Minimum Trading Days" prefix="#" value={profile.minTradingDays} onChange={(v) => setProfile({ ...profile, minTradingDays: v })} />
            <NumberField label="Days Remaining" prefix="#" value={profile.daysRemaining} onChange={(v) => setProfile({ ...profile, daysRemaining: v })} />
          </div>
        </div>
      )}

      {/* Personal balance */}
      {profile.accountType === "personal" && (
        <div style={{ marginBottom: 32 }}>
          <NumberField label="Account Balance (optional)" value={profile.accountBalance} onChange={(v) => setProfile({ ...profile, accountBalance: v })} />
        </div>
      )}

      {/* Client name + email */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
        <TextField
          label="Client name"
          value={profile.clientName}
          onChange={(v) => setProfile({ ...profile, clientName: v })}
          placeholder="e.g. Demo Trader"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={profile.email}
          onChange={(v) => setProfile({ ...profile, email: v })}
          placeholder="you@example.com"
          required
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="btn btn-primary"
          style={{ padding: "12px 28px", opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Tier Selection ────────────────────────────────────────────────────

function Step2({
  selectedTier,
  setSelectedTier,
  selectedOneTime,
  setSelectedOneTime,
  onNext,
}: {
  selectedTier: string | null;
  setSelectedTier: (t: string) => void;
  selectedOneTime: OneTime;
  setSelectedOneTime: (t: OneTime) => void;
  onNext: () => void;
}) {
  // TODO: integrate Stripe Checkout here — create a checkout session for the selected tier
  // and redirect to Stripe before proceeding to Step 3.

  const canNext = selectedTier !== null;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Select Tier</h2>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
        Choose your diagnostic depth. You can upgrade anytime.
      </p>

      {/* Tier cards — horizontal scroll matching landing page style */}
      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 16,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border-subtle) transparent",
          marginBottom: 32,
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {TIERS.map((tier) => {
          const sel = selectedTier === tier.name;
          const isPopular = tier.popular;
          return (
            <div
              key={tier.name}
              onClick={() => !tier.disabled && setSelectedTier(tier.name)}
              style={{
                flexShrink: 0,
                width: 220,
                background: sel ? "var(--bg-elevated)" : tier.disabled ? "var(--bg-base)" : "var(--bg-card)",
                border: sel
                  ? "1px solid var(--accent-primary)"
                  : isPopular
                  ? "1px solid var(--accent-primary)"
                  : "1px solid var(--border-subtle)",
                borderRadius: 10,
                padding: "24px 20px",
                position: "relative",
                cursor: tier.disabled ? "default" : "pointer",
                opacity: tier.disabled ? 0.5 : 1,
                transition: "border-color 0.15s, background 0.15s",
                boxShadow: (isPopular && !sel) ? "0 0 28px rgba(88,166,255,0.10)" : sel ? "0 0 28px rgba(88,166,255,0.18)" : "none",
              }}
            >
              {isPopular && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "var(--accent-primary)", color: "#0D1117", fontSize: 9, fontFamily: MONO, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: "0 0 5px 5px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: sel ? "var(--accent-primary)" : tier.accent, margin: `${isPopular ? "16px" : "0"} 0 4px` }}>
                {tier.name}
              </p>
              <p style={{ fontFamily: MONO, fontSize: 24, fontWeight: 500, margin: "0 0 6px", color: sel ? "var(--text-primary)" : tier.disabled ? "var(--text-muted)" : "var(--text-primary)" }}>
                {tier.price}
              </p>
              <p style={{ fontSize: 11, color: tier.disabled ? "var(--text-muted)" : "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.4, fontStyle: tier.disabled ? "italic" : "normal" }}>
                {tier.tagline}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ fontSize: 11, color: tier.disabled ? "var(--text-muted)" : "var(--text-secondary)", display: "flex", gap: 7, alignItems: "flex-start", lineHeight: 1.4 }}>
                    <span style={{ color: tier.disabled ? "var(--text-muted)" : tier.accent, flexShrink: 0 }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              {tier.name === "SOVEREIGN" ? (
                <a
                  href="mailto:hello@xrayforensic.com"
                  className="btn btn-ghost"
                  style={{ width: "100%", fontSize: 12, marginTop: 20, display: "inline-flex" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Contact
                </a>
              ) : !tier.disabled ? (
                <div
                  style={{
                    marginTop: 20,
                    padding: "8px",
                    borderRadius: 6,
                    border: sel ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                    background: sel ? "rgba(88,166,255,0.1)" : "transparent",
                    textAlign: "center",
                    fontFamily: MONO,
                    fontSize: 11,
                    color: sel ? "var(--accent-primary)" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {sel ? "✓ Selected" : "Select"}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* One-time options */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 14px" }}>
          Or — one-time options
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { id: "spot" as OneTime, label: "Spot Audit", price: "$49", desc: "Single forensic deep-dive" },
            { id: "pre-challenge" as OneTime, label: "Pre-Challenge Clearance", price: "$79", desc: "Before your next funded attempt" },
          ].map((opt) => {
            const sel = selectedOneTime === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedOneTime(sel ? null : opt.id);
                  if (!sel) setSelectedTier("AUDIT");
                }}
                style={{
                  background: sel ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: sel ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  padding: "16px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: sel ? "var(--accent-primary)" : "var(--text-primary)" }}>{opt.label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, color: sel ? "var(--accent-primary)" : "var(--text-primary)" }}>{opt.price}</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="btn btn-primary"
          style={{ padding: "12px 28px", opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Upload ────────────────────────────────────────────────────────────

const PROCESSING_STEPS = [
  { title: "Parsing your trades...", sub: "Reading every entry, exit, and timestamp." },
  { title: "Detecting behavioral patterns...", sub: "Looking for revenge sequences, tilt cascades, and session drift." },
  { title: "Scoring 7 dimensions...", sub: "HTF Bias, Liquidity, OTE, OB/FVG, Session, Risk, Behavioral Control." },
  { title: "Generating your verdict...", sub: "The numbers don't lie. Neither will we." },
  { title: "Report ready.", sub: "Brace yourself." },
];

function Step3({
  profile,
  selectedTier,
}: {
  profile: ContextProfile;
  selectedTier: string | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assetClass, setAssetClass] = useState<'forex' | 'crypto'>('forex');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [magicFile, setMagicFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const validateAndSetFile = (f: File | null) => {
    if (!f) return;
    const name = f.name.toLowerCase();
    if (assetClass === "crypto") {
      if (!name.endsWith(".csv")) {
        setFileError("⚠️ We need a .csv trade history export from your exchange.");
        setSelectedFile(null);
        return;
      }
    } else if (
      !name.endsWith(".csv") &&
      !name.endsWith(".htm") &&
      !name.endsWith(".html") &&
      !name.endsWith(".xml")
    ) {
      setFileError("⚠️ We need a .csv, .htm or .xml file from MT5. Try the export steps above.");
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile(f);
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);
    setTimedOut(false);
    setProcessingStepIndex(0);

    const controller = new AbortController();
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    stepTimers.push(setTimeout(() => setProcessingStepIndex(1), 1500));
    stepTimers.push(setTimeout(() => setProcessingStepIndex(2), 3500));
    stepTimers.push(setTimeout(() => setProcessingStepIndex(3), 6000));

    const timeoutTimer = setTimeout(() => {
      controller.abort();
      setTimedOut(true);
      setProcessing(false);
      stepTimers.forEach(clearTimeout);
    }, 120000);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const contextData: Record<string, unknown> = {
        client_name: profile.clientName || "Trader",
        email: profile.email || "",
        account_type: profile.accountType || "personal",
        tier_id: (selectedTier || "signal").toLowerCase(),
        firm: profile.firm || null,
        challenge_balance: parseFloat(profile.challengeBalance) || null,
        daily_dd: parseFloat(profile.dailyDdLimit) || null,
        max_dd: parseFloat(profile.maxDdLimit) || null,
        profit_target: parseFloat(profile.profitTarget) || null,
        min_days: parseInt(profile.minTradingDays) || null,
        days_remaining: parseInt(profile.daysRemaining) || null,
        asset_class: assetClass,
      };

      if (magicFile) {
        formData.append("magic_file", magicFile);
        contextData.ea_mode = true;
      }

      formData.append("context", JSON.stringify(contextData));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
        { method: "POST", body: formData, signal: controller.signal }
      );

      clearTimeout(timeoutTimer);
      stepTimers.forEach(clearTimeout);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Analysis failed");
      }

      const data = await response.json();

      setProcessingStepIndex(4);
      await new Promise((r) => setTimeout(r, 1200));
      router.push(`/report/${data.analysis_id}`);
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      stepTimers.forEach(clearTimeout);
      if (err.name !== "AbortError") {
        setError(err.message || "Analysis failed. Please try again.");
        setProcessing(false);
      }
    }
  }, [selectedFile, magicFile, profile, selectedTier, assetClass, router]);

  if (processing) {
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Analyzing…</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
          Do not close this tab.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "40px 36px" }}>
          {PROCESSING_STEPS.map((s, i) => {
            const done = i < processingStepIndex;
            const active = i === processingStepIndex;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  marginBottom: i < PROCESSING_STEPS.length - 1 ? 20 : 0,
                }}
              >
                <span style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  lineHeight: "1.4",
                  flexShrink: 0,
                  color: done ? "var(--profit)" : active ? "var(--accent-primary)" : "var(--text-muted)",
                }}>
                  {done ? "✓" : active ? "›" : "·"}
                </span>
                <div>
                  <p style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    fontWeight: active ? 700 : 400,
                    color: done ? "var(--profit)" : active ? "var(--text-primary)" : "var(--text-muted)",
                    margin: active ? "0 0 4px" : 0,
                  }}>
                    {s.title}
                  </p>
                  {active && (
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      {s.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Disclaimer />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Upload Trade History</h2>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
        Export your MT5 history and drop it below.
      </p>

      {selectedTier === 'ea-autopsy' && (
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--warning)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--warning)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            EA AUTOPSY — TWO FILES REQUIRED
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            marginBottom: '12px'
          }}>
            1. Standard MT5 history export (as usual)
            2. X-Ray Magic Export CSV (from{' '}
            <a href="/tools" target="_blank"
              style={{ color: 'var(--accent-primary)' }}>
              /tools
            </a>)
          </p>

          {/* Second file input for magic export */}
          <div
            onClick={() => document.getElementById(
              'magic-file-input')?.click()}
            style={{
              border: `2px dashed ${
                magicFile
                  ? 'var(--profit)'
                  : 'var(--warning)'}`,
              borderRadius: '6px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: magicFile
                ? 'rgba(63,185,80,0.05)'
                : 'var(--bg-card)',
              marginTop: '12px'
            }}
          >
            <input
              id="magic-file-input"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) setMagicFile(f)
              }}
            />
            {magicFile ? (
              <p style={{
                color: 'var(--profit)',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                margin: 0
              }}>
                ✓ {magicFile.name}
              </p>
            ) : (
              <p style={{
                color: 'var(--warning)',
                fontSize: '0.8rem',
                margin: 0
              }}>
                Drop Magic Export CSV here
              </p>
            )}
          </div>
        </div>
      )}

      {/* MT5 export guide */}
      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}>
        <p style={{
          fontFamily: MONO,
          fontSize: "0.85rem",
          textTransform: "uppercase" as const,
          color: "var(--text-primary)",
          letterSpacing: "0.05em",
          margin: "0 0 20px",
        }}>
          📂 How to export from MetaTrader 5
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              n: "01",
              title: "Open MT5",
              body: "Launch MetaTrader 5 on your computer. Make sure you're logged into the account you want to diagnose.",
            },
            {
              n: "02",
              title: "Find your history",
              body: "Click 'View' in the top menu → 'Terminal' → click the 'Account History' tab at the bottom of the screen.",
            },
            {
              n: "03",
              title: "Export it",
              body: "Right-click anywhere in the history → 'Save as Report' → choose the date range (all history recommended) → save as .htm or use 'Save as Detailed Report' for CSV.",
            },
          ].map((step) => (
            <div key={step.n}>
              <p style={{ fontFamily: MONO, fontSize: "1.6rem", color: "var(--text-muted)", margin: "0 0 8px", lineHeight: 1 }}>
                {step.n}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>
                {step.title}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <p style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
          margin: "16px 0 0",
          lineHeight: 1.5,
        }}>
          💬 No MT5? You can also export from cTrader, DXtrade, or any platform that gives you a trade history CSV. Same process, different menu.
        </p>
      </div>

      {/* Asset class selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {[
          {
            value: 'forex',
            label: 'MT5 / Forex',
            sub: 'MT5 .htm, .xml or .csv export',
            icon: '📊'
          },
          {
            value: 'crypto',
            label: 'Crypto Exchange',
            sub: 'Binance, Bybit, OKX, Bitget, BingX',
            icon: '₿'
          },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => {
              setAssetClass(opt.value as 'forex' | 'crypto');
              setSelectedFile(null);
              setFileError(null);
            }}
            style={{
              padding: '14px',
              background: assetClass === opt.value
                ? 'rgba(88,166,255,0.1)'
                : 'var(--bg-elevated)',
              border: `1px solid ${
                assetClass === opt.value
                ? 'var(--accent-primary)'
                : 'var(--border-subtle)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 150ms ease'
            }}
          >
            <div style={{
              fontSize: '1.1rem',
              marginBottom: '4px'
            }}>
              {opt.icon}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: assetClass === opt.value
                ? 'var(--accent-primary)'
                : 'var(--text-primary)',
              fontWeight: 600,
              marginBottom: '2px'
            }}>
              {opt.label}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)'
            }}>
              {opt.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) validateAndSetFile(f);
        }}
        style={{
          border: `1.5px dashed ${dragOver ? "var(--accent-primary)" : selectedFile ? "var(--profit)" : fileError ? "var(--warning)" : "var(--border-subtle)"}`,
          borderRadius: 10,
          padding: "56px 40px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "rgba(88,166,255,0.04)" : selectedFile ? "rgba(63,185,80,0.04)" : "transparent",
          transition: "border-color 0.15s, background 0.15s",
          marginBottom: 12,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={assetClass === "crypto" ? ".csv" : ".csv,.htm,.html,.xml"}
          style={{ display: "none" }}
          onChange={(e) => validateAndSetFile(e.target.files?.[0] || null)}
        />
        {selectedFile ? (
          <>
            <p style={{ fontSize: 20, margin: "0 0 8px", color: "var(--profit)" }}>✓</p>
            <p style={{ fontSize: 14, color: "var(--profit)", margin: "0 0 4px", fontWeight: 500 }}>{selectedFile.name}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 10px" }}>
              {(selectedFile.size / 1024).toFixed(0)} KB — click to change
            </p>
            <p style={{ fontSize: 13, color: "var(--profit)", margin: 0 }}>
              Looks good. Hit 'Analyze' when you're ready ↓
            </p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: MONO, fontSize: 28, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1 }}>↑</p>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 8px", fontWeight: 500 }}>
              Drop your trade history here
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
              {assetClass === "crypto"
                ? "Exchange trade history CSV · Any size · Fully encrypted"
                : "MT5 .htm, .xml or .csv · Any size · Fully encrypted"}
            </p>
            <span style={{ fontSize: 13, color: "var(--accent-primary)", textDecoration: "underline", cursor: "pointer" }}>
              Browse files
            </span>
          </>
        )}
      </div>

      {assetClass === 'crypto' ? (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          textAlign: 'center',
          margin: '0 0 12px',
          lineHeight: 1.6
        }}>
          Binance · Bybit · OKX · Bitget · BingX
          <br />
          Export: Account → Orders → Trade History → CSV
        </p>
      ) : (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          textAlign: 'center',
          margin: '0 0 12px'
        }}>
          MT5 .htm, .xml or .csv export
        </p>
      )}

      {fileError && (
        <p style={{ fontSize: 13, color: "var(--warning)", margin: "0 0 12px", fontFamily: MONO }}>
          {fileError}
        </p>
      )}

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", margin: "0 0 20px" }}>
        🔒 Your file is analyzed and immediately discarded. We never store your raw trade data.
      </p>

      {timedOut && (
        <div style={{ background: "rgba(88,166,255,0.06)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ color: "var(--text-secondary)", fontFamily: MONO, fontSize: "0.85rem", margin: "0 0 4px" }}>
            Analysis is taking longer than expected.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0 }}>
            Your report will be emailed when ready. You can close this tab.
          </p>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid var(--loss)", borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ color: "var(--loss)", fontFamily: "monospace", fontSize: "0.85rem", margin: 0 }}>
            Diagnosis failed. Evidence corrupted.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 8, marginBottom: 0 }}>
            This can happen with unsupported file formats or network issues. Try again or contact{" "}
            <a href="mailto:hello@xrayforensic.com" style={{ color: "var(--accent-primary)" }}>
              hello@xrayforensic.com
            </a>
          </p>
          <button
            onClick={() => setError(null)}
            style={{ marginTop: 12, background: "transparent", border: "1px solid var(--border-active)", color: "var(--text-secondary)", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}
          >
            Try Again
          </button>
        </div>
      )}

      {(() => {
        const eaReady = selectedTier !== 'ea-autopsy' || !!magicFile;
        const canAnalyze = !!selectedFile && eaReady && !processing;
        return (
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: 15, opacity: canAnalyze ? 1 : 0.4, cursor: canAnalyze ? "pointer" : "not-allowed" }}
          >
            {processing ? 'Processing...' : 'Analyze'}
          </button>
        );
      })()}
    </div>
  );
}

// ── CryptoAddress ─────────────────────────────────────────────────────────────

function CryptoAddress({
  label,
  color,
  address,
}: {
  label: string;
  color: string;
  address: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '12px 14px',
      background: 'var(--bg-card)',
      borderRadius: '6px',
      border: '1px solid var(--border-subtle)',
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: MONO,
          fontSize: '0.7rem',
          color: color,
          fontWeight: 600,
        }}>
          {label}
        </span>
        <button
          onClick={copy}
          style={{
            background: copied ? 'rgba(63,185,80,0.15)' : 'var(--bg-elevated)',
            border: `1px solid ${copied ? 'var(--profit)' : 'var(--border-active)'}`,
            borderRadius: '4px',
            color: copied ? 'var(--profit)' : 'var(--text-muted)',
            padding: '3px 10px',
            cursor: 'pointer',
            fontSize: '0.65rem',
            fontFamily: MONO,
            transition: 'all 150ms ease',
          }}
        >
          {copied ? 'COPIED ✓' : 'COPY'}
        </button>
      </div>
      <span style={{
        fontFamily: MONO,
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        wordBreak: 'break-all',
        lineHeight: 1.5,
      }}>
        {address}
      </span>
    </div>
  );
}

// ── Step Payment ─────────────────────────────────────────────────────────────

function StepPayment({
  selectedTier,
  profile,
  goNext,
}: {
  selectedTier: string | null;
  profile: ContextProfile;
  goNext: () => void;
}) {
  const tierInfo =
    selectedTier && tierData[selectedTier as keyof typeof tierData]
      ? tierData[selectedTier as keyof typeof tierData]
      : null;

  const [txHash, setTxHash] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<"idle" | "submitting" | "pending" | "error">("idle");
  const [payError, setPayError] = useState<string | null>(null);

  // Restore pending state from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem("xray_payment_id");
    const storedStatus = localStorage.getItem("xray_payment_status");
    if (storedId && storedStatus === "pending") {
      setPaymentId(storedId);
      setPayStatus("pending");
    }
  }, []);

  // Persist to localStorage when pending; clear on idle/error
  useEffect(() => {
    if (paymentId && payStatus === "pending") {
      localStorage.setItem("xray_payment_id", paymentId);
      localStorage.setItem("xray_payment_status", "pending");
    } else if (payStatus === "idle" || payStatus === "error") {
      localStorage.removeItem("xray_payment_id");
      localStorage.removeItem("xray_payment_status");
    }
  }, [paymentId, payStatus]);

  const submitPayment = async () => {
    if (!txHash.trim()) { setPayError("Paste your transaction hash first."); return; }
    setPayStatus("submitting");
    setPayError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_hash: txHash.trim(),
          email: profile.email,
          tier_id: (selectedTier || "audit").toLowerCase(),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Submit failed");
      const data = await res.json();
      setPaymentId(data.payment_id);
      if (data.status === "confirmed") { goNext(); return; }
      setPayStatus("pending");
    } catch (e: any) {
      setPayError(e.message || "Could not submit payment.");
      setPayStatus("error");
    }
  };

  // Poll while pending — auto-advance on confirm
  useEffect(() => {
    if (payStatus !== "pending" || !paymentId) return;
    const tick = async () => {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/status/${paymentId}`);
        if (!r.ok) return;
        const d = await r.json();
        if (d.status === "confirmed") { clearInterval(id); goNext(); }
      } catch { /* keep polling */ }
    };
    const id = setInterval(tick, 10000);
    tick();
    return () => clearInterval(id);
  }, [payStatus, paymentId, goNext]);

  // Pending state UI
  if (payStatus === "pending") {
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Awaiting Confirmation
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
          Keep this tab open — you&apos;ll be redirected automatically.
        </p>
        <style>{`
          @keyframes xray-pulse {
            0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(88,166,255,0.4); }
            50% { opacity: 0.6; transform: scale(1.3); box-shadow: 0 0 0 8px rgba(88,166,255,0); }
          }
        `}</style>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          padding: "40px 36px",
          textAlign: "center",
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "var(--accent-primary)",
            margin: "0 auto 24px",
            animation: "xray-pulse 2s ease-in-out infinite",
          }} />
          <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Payment submitted. Verifying on-chain.
          </p>
          <p style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            margin: "0 auto 24px",
            maxWidth: 360,
          }}>
            This can take up to 2 hours. Keep this tab open and you&apos;ll be redirected
            automatically the moment it clears.
          </p>
          <button
            onClick={async () => {
              if (!paymentId) return;
              try {
                const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/status/${paymentId}`);
                if (!r.ok) return;
                const d = await r.json();
                if (d.status === "confirmed") goNext();
              } catch {}
            }}
            style={{
              background: "transparent",
              border: "1px solid var(--border-active)",
              color: "var(--text-secondary)",
              padding: "8px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: MONO,
            }}
          >
            Check now
          </button>
        </div>
        <button
          onClick={() => window.history.back()}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.8rem",
            padding: "16px 0 0",
          }}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
        Complete Payment
      </h2>

      {/* Tier summary */}
      {tierInfo && (
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--accent-primary)",
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <span style={{
              fontFamily: MONO,
              fontSize: "0.85rem",
              color: "var(--accent-primary)",
              display: "block",
              letterSpacing: "0.06em",
            }}>
              {tierInfo.name}
            </span>
            {"tagline" in tierInfo && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {(tierInfo as { tagline: string }).tagline}
              </span>
            )}
          </div>
          <span style={{
            fontFamily: MONO,
            fontSize: "1.25rem",
            color: "var(--text-primary)",
            fontWeight: 700,
          }}>
            {tierInfo.price}
          </span>
        </div>
      )}

      {/* Card payments — coming soon */}
      <div style={{
        padding: 20,
        background: "var(--bg-elevated)",
        borderRadius: 8,
        border: "1px solid var(--border-subtle)",
        marginBottom: 16,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: MONO,
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}>
          CARD PAYMENTS
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
          Coming soon. Use crypto below or email us.
        </p>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PAY WITH CRYPTO</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      </div>

      {/* Warning */}
      <div style={{
        padding: "10px 14px",
        background: "rgba(210,153,34,0.08)",
        border: "1px solid rgba(210,153,34,0.3)",
        borderRadius: 6,
        marginBottom: 16,
      }}>
        <p style={{ fontFamily: MONO, fontSize: "0.7rem", color: "var(--warning)", margin: 0 }}>
          ⚠ USDT ONLY · Send exact amount · Wrong network = lost funds
        </p>
      </div>

      {/* Wallet addresses */}
      {[
        {
          network: "BEP20",
          label: "USDT · BEP20 (BNB Chain)",
          color: "var(--warning)",
          address: "0x620869b71e673bFfeAc79420a7141fE8853ba67e",
        },
        {
          network: "TRC20",
          label: "USDT · TRC20 (Tron)",
          color: "var(--accent-secondary)",
          address: "TYoZG5HUq8gVh2cgiarCDXV2rbdnetaZhs",
        },
      ].map((w) => (
        <CryptoAddress key={w.network} label={w.label} color={w.color} address={w.address} />
      ))}

      {/* TX hash input */}
      <div style={{ marginTop: 24, marginBottom: 8 }}>
        <label style={{
          display: "block",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 8,
        }}>
          Transaction Hash
        </label>
        <input
          type="text"
          value={txHash}
          onChange={(e) => { setTxHash(e.target.value); if (payError) setPayError(null); }}
          placeholder="0x… or TX hash from your wallet"
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--bg-elevated)",
            border: `1px solid ${payError ? "var(--loss)" : "var(--border-subtle)"}`,
            borderRadius: 6,
            color: "var(--text-primary)",
            fontSize: 13,
            fontFamily: MONO,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {payError && (
          <p style={{ fontSize: 12, color: "var(--loss)", margin: "6px 0 0", fontFamily: MONO }}>
            {payError}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={submitPayment}
        disabled={payStatus === "submitting"}
        style={{
          width: "100%",
          padding: 12,
          background: "var(--accent-primary)",
          color: "var(--bg-base)",
          border: "none",
          borderRadius: 6,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: payStatus === "submitting" ? "not-allowed" : "pointer",
          opacity: payStatus === "submitting" ? 0.6 : 1,
          marginTop: 16,
          marginBottom: 24,
        }}
      >
        {payStatus === "submitting" ? "Submitting…" : "I’ve Sent Payment — Submit for Verification"}
      </button>

      {/* Manual email fallback */}
      <div style={{
        padding: "16px 20px",
        background: "var(--bg-elevated)",
        borderRadius: 8,
        border: "1px solid var(--border-subtle)",
        marginBottom: 24,
      }}>
        <p style={{
          fontFamily: MONO,
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          ALTERNATIVELY
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.65, margin: 0 }}>
          Email your transaction hash to{" "}
          <a href="mailto:hello@xrayforensic.com" style={{ color: "var(--accent-primary)" }}>
            hello@xrayforensic.com
          </a>
          {" "}with the subject line{" "}
          <strong style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>
            PAYMENT — {tierInfo?.name}
          </strong>
          . Reports delivered within 2 hours of confirmed payment.
        </p>
      </div>

      {/* Back */}
      <button
        onClick={() => window.history.back()}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: "0.8rem",
          padding: 0,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function NewPageInner() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<ContextProfile>({
    accountType: "personal",
    firm: "",
    challengeBalance: "",
    dailyDdLimit: "",
    maxDdLimit: "",
    profitTarget: "",
    minTradingDays: "",
    daysRemaining: "",
    accountBalance: "",
    clientName: "",
    email: "",
  });
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [tierLocked, setTierLocked] = useState(false);
  const [tierResolved, setTierResolved] = useState(false);
  const [selectedOneTime, setSelectedOneTime] = useState<OneTime>(null);
  const [currentStepKey, setCurrentStepKey] = useState("context");

  useEffect(() => {
    const tier = searchParams.get("tier");
    if (tier && tier in tierData) {
      setSelectedTier(tier);
      setTierLocked(true);
    }
    setTierResolved(true);
  }, [searchParams]);

  const isFree = selectedTier?.toLowerCase() === "signal";
  const isPaid = selectedTier !== null && selectedTier.toLowerCase() !== "signal";

  // Dynamic step array — recomputed on every render
  const steps = (() => {
    if (tierLocked && isFree) {
      return [
        { label: "Context", key: "context" },
        { label: "Upload", key: "upload" },
      ];
    }
    if (tierLocked && isPaid) {
      return [
        { label: "Context", key: "context" },
        { label: "Payment", key: "payment" },
        { label: "Upload", key: "upload" },
      ];
    }
    // Unguided: user selected SIGNAL in Step 2 → no payment needed
    if (!tierLocked && isFree && selectedTier !== null) {
      return [
        { label: "Context", key: "context" },
        { label: "Tier", key: "tier" },
        { label: "Upload", key: "upload" },
      ];
    }
    // Unguided: paid selection or no tier yet → full 4-step
    return [
      { label: "Context", key: "context" },
      { label: "Tier", key: "tier" },
      { label: "Payment", key: "payment" },
      { label: "Upload", key: "upload" },
    ];
  })();

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === currentStepKey);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      // Safety net: skip payment if free tier
      if (nextStep.key === "payment" && isFree) {
        const afterPayment = steps[currentIndex + 2];
        if (afterPayment) {
          setCurrentStepKey(afterPayment.key);
          return;
        }
      }
      setCurrentStepKey(nextStep.key);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === currentStepKey);
    if (currentIndex > 0) {
      setCurrentStepKey(steps[currentIndex - 1].key);
    }
  };

  // Guard: don't render until URL params have been read.
  // Prevents step-count changing mid-render (e.g. 4-step flash before resolving to 2-step for ?tier=signal).
  if (!tierResolved) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <nav style={{ borderBottom: "1px solid var(--border-subtle)", padding: "16px 40px", display: "flex", alignItems: "center" }}>
          <a href="/" style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
            ← X-Ray
          </a>
        </nav>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <span style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-muted)" }}>Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <nav style={{ borderBottom: "1px solid var(--border-subtle)", padding: "16px 40px", display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
          ← X-Ray
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>
        <StepIndicator steps={steps} currentStepKey={currentStepKey} selectedTier={selectedTier} />

        {/* Tier confirmation card — shown when arriving from a pricing CTA */}
        {tierLocked && selectedTier && tierData[selectedTier as keyof typeof tierData] && (
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--accent-primary)",
            borderRadius: 8,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.08em" }}>
                {tierData[selectedTier as keyof typeof tierData].name}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 12 }}>
                {tierData[selectedTier as keyof typeof tierData].price}
              </span>
            </div>
            <button
              onClick={() => {
                setTierLocked(false);
                setSelectedTier(null);
                setCurrentStepKey("tier");
              }}
              style={{ background: "transparent", border: "1px solid var(--border-active)", color: "var(--text-secondary)", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem" }}
            >
              Change
            </button>
          </div>
        )}

        {currentStepKey === "context" && (
          <Step1 profile={profile} setProfile={setProfile} onNext={goToNextStep} />
        )}
        {currentStepKey === "tier" && (
          <Step2
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            selectedOneTime={selectedOneTime}
            setSelectedOneTime={setSelectedOneTime}
            onNext={goToNextStep}
          />
        )}
        {currentStepKey === "payment" && (
          <StepPayment selectedTier={selectedTier} profile={profile} goNext={goToNextStep} />
        )}
        {currentStepKey === "upload" && (
          <Step3 profile={profile} selectedTier={selectedTier} />
        )}
      </div>
    </main>
  );
}

export default function NewPage() {
  return (
    <Suspense>
      <NewPageInner />
    </Suspense>
  );
}
