"use client";

import React, { useCallback, useRef, useState, useEffect, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "../components/NavBar";
import Disclaimer from "../../components/Disclaimer";
import { tierData } from "@/lib/tiers";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";
const GOLD = "#e5b83c";

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
    <div style={{ marginBottom: 40 }}>
      {/* Step breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {done && (
                  <span style={{ fontFamily: MONO, fontSize: 12, color: "#10b981" }}>✓</span>
                )}
                <span style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  color: done ? "#475569" : active ? GOLD : "#475569",
                  letterSpacing: "0.05em",
                  borderBottom: active ? `1px solid ${GOLD}` : "none",
                  paddingBottom: active ? 2 : 0,
                }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span style={{ color: "#1e293b", fontSize: 12 }}>→</span>
              )}
            </React.Fragment>
          );
        })}

        {/* Tier badge — shown when a tier is known */}
        {lockedTierInfo && (
          <span style={{
            background: "rgba(229,184,60,0.08)",
            color: GOLD,
            padding: "2px 8px",
            borderRadius: 4,
            fontFamily: MONO,
            fontSize: "0.65rem",
            marginLeft: 8,
            border: "1px solid rgba(229,184,60,0.2)",
          }}>
            {lockedTierInfo.name} · {lockedTierInfo.price}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: GOLD,
          borderRadius: 2,
          transition: "width 300ms ease",
        }} />
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
                  href="mailto:support@xrayforensic.com"
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
  accessToken,
  lastContextRestored,
  authProfile,
  onEditContext,
}: {
  profile: ContextProfile;
  selectedTier: string | null;
  accessToken?: string;
  lastContextRestored?: boolean;
  authProfile?: { tier_id?: string } | null;
  onEditContext?: () => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assetClass, setAssetClass] = useState<'forex' | 'crypto'>('forex');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [magicFile, setMagicFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [exportHelpOpen, setExportHelpOpen] = useState(false);
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
      !name.endsWith(".xml") &&
      !name.endsWith(".xlsx")
    ) {
      setFileError("⚠️ We need a .csv, .htm, .html, .xml, or .xlsx file from MT5. Try the export steps above.");
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile(f);
  };

  // Persist a compliance snapshot so the dashboard can show month-on-month progress.
  // NOTE: /analyze only returns analysis_id, report_url and summary_stats. The
  // behavioral counts (revenge, no-SL, kill-zone) and dimension scores live inside
  // the HTML report — until the API surfaces them as JSON they default to 0/{}.
  const savePrescriptions = async (analysisId: string, data: any) => {
    if (!user) return;
    const stats = data?.summary_stats || {};
    try {
      // Mark previous snapshot as not latest
      await supabase
        .from("prescriptions")
        .update({ is_latest: false })
        .eq("user_id", user.id)
        .eq("is_latest", true);

      // Save new snapshot
      await supabase.from("prescriptions").insert({
        user_id: user.id,
        analysis_id: analysisId,
        prescriptions: data.prescriptions || [],
        revenge_count: data.revenge_count || 0,
        no_sl_count: data.no_sl_count || 0,
        kill_zone_pct: data.kill_zone_pct || 0,
        win_rate: stats.win_rate || 0,
        profit_factor: stats.profit_factor || 0,
        net_pnl: stats.net_pnl || 0,
        scores: data.scores || {},
        is_latest: true,
      });
    } catch (e) {
      console.error("Failed to save prescriptions:", e);
    }
  };

  const handleAnalyze = useCallback(async () => {
    const isEaAutopsy = selectedTier === 'ea-autopsy';
    // For EA Autopsy: magic file alone is sufficient (it IS the full history with magic numbers)
    const mainFile = selectedFile || (isEaAutopsy ? magicFile : null);
    if (!mainFile) return;

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
      formData.append("file", mainFile);

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

      if (isEaAutopsy) {
        // Always run EA engine for this tier
        contextData.ea_mode = true;
        if (magicFile && selectedFile) {
          // Both files present: regular MT5 is main file, magic CSV sent separately for number merging
          formData.append("magic_file", magicFile);
        }
        // If only magic file: it's already the main file — its magic column is read directly
      } else if (magicFile) {
        // Non-EA tier but magic file present (edge case — pass through)
        formData.append("magic_file", magicFile);
        contextData.ea_mode = true;
      }

      formData.append("context", JSON.stringify(contextData));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        }
      );

      clearTimeout(timeoutTimer);
      stepTimers.forEach(clearTimeout);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Analysis failed");
      }

      const data = await response.json();

      // Save compliance snapshot for logged-in users (best-effort, non-blocking failure)
      await savePrescriptions(data.analysis_id, data);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, magicFile, selectedTier, profile, assetClass, accessToken, router, user]);

  if (processing) {
    const totalSteps = PROCESSING_STEPS.length;
    const progressPct = ((processingStepIndex) / (totalSteps - 1)) * 100;
    const isDone = processingStepIndex >= totalSteps - 1;

    return (
      <div>
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          color: GOLD,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}>
          X-RAY FORENSIC
        </p>
        <h2 style={{
          fontFamily: SPACE,
          fontSize: 24,
          fontWeight: 700,
          margin: "0 0 6px",
          color: "#f8fafc",
        }}>
          {isDone ? "Diagnosis Complete" : "Analyzing…"}
        </h2>
        <p style={{ fontFamily: MONO, fontSize: 12, color: "#94a3b8", margin: "0 0 32px" }}>
          Do not close this tab.
        </p>

        {/* Gold progress bar */}
        <div style={{ height: 2, background: "#1e293b", borderRadius: 2, overflow: "hidden", marginBottom: 32 }}>
          <div style={{
            height: "100%",
            width: `${progressPct}%`,
            background: GOLD,
            borderRadius: 2,
            transition: "width 600ms ease",
          }} />
        </div>

        <div style={{ background: "#0e1626", border: "1px solid #1e293b", borderRadius: 10, padding: "32px 28px" }}>
          {PROCESSING_STEPS.map((s, i) => {
            const done = i < processingStepIndex;
            const active = i === processingStepIndex;
            return (
              <div key={i} style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                marginBottom: i < PROCESSING_STEPS.length - 1 ? 18 : 0,
              }}>
                <span style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  lineHeight: "1.5",
                  flexShrink: 0,
                  color: done ? "#10b981" : active ? GOLD : "#1e293b",
                  transition: "color 0.3s",
                }}>
                  {done ? "✓" : active ? "›" : "·"}
                </span>
                <div>
                  <p style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    color: done ? "#10b981" : active ? "#f8fafc" : "#475569",
                    margin: active ? "0 0 4px" : 0,
                    transition: "color 0.3s",
                  }}>
                    {s.title}
                  </p>
                  {active && (
                    <p style={{ fontFamily: MONO, fontSize: 10, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                      {s.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {isDone && (
            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #1e293b",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: MONO,
                fontSize: 11,
                color: GOLD,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                [DIAGNOSIS COMPLETE]
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Rule 1 — Previous context banner: shown when context was restored from localStorage */}
      {lastContextRestored && onEditContext && (
        <div style={{
          background: "var(--bg-elevated)",
          borderLeft: `3px solid ${GOLD}`,
          borderRadius: 6,
          padding: "10px 16px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)" }}>
            Continuing as: {profile.accountType} · {(authProfile?.tier_id ?? "signal").toUpperCase()} · {profile.email}
          </span>
          <button
            onClick={onEditContext}
            style={{
              background: "transparent",
              border: "none",
              color: GOLD,
              fontFamily: MONO,
              fontSize: 11,
              cursor: "pointer",
              padding: 0,
              whiteSpace: "nowrap",
              marginLeft: 12,
            }}
          >
            Edit context →
          </button>
        </div>
      )}

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

      {/* MT5 export guide — collapsible */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setExportHelpOpen(!exportHelpOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: GOLD,
            fontFamily: MONO,
            fontSize: 12,
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.04em",
          }}
        >
          How to export from MT5 {exportHelpOpen ? "↑" : "→"}
        </button>
        {exportHelpOpen && (
          <div style={{
            marginTop: 12,
            padding: "16px 20px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
          }}>
            <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px" }}>
              How to export your MT5 history
            </p>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>
                Recommended
              </p>
              <p style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
                History tab → right-click → <span style={{ color: "var(--text-primary)" }}>Report</span> → saves as <span style={{ color: "var(--text-primary)" }}>.htm</span> (most reliable)
              </p>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>
                Also works
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  <>→ Right-click → <span style={{ color: "var(--text-secondary)" }}>Save as Report</span> → .csv</>,
                  <>→ Right-click → <span style={{ color: "var(--text-secondary)" }}>Report</span> → change type to .xlsx</>,
                  <>→ File → <span style={{ color: "var(--text-secondary)" }}>Export</span> → .xml</>,
                ].map((line, i) => (
                  <p key={i} style={{ fontFamily: MONO, fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.6 }}>
                    {line}
                  </p>
                ))}
              </div>
              <p style={{ fontFamily: MONO, fontSize: 11, color: "#475569", margin: "10px 0 0" }}>
                All four formats are accepted.
              </p>
            </div>
          </div>
        )}
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
            sub: 'MT5 .htm, .html, .xlsx, .xml or .csv',
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
          border: `2px dashed ${dragOver ? GOLD : selectedFile ? "#10b981" : fileError ? "#f59e0b" : "rgba(229,184,60,0.4)"}`,
          borderRadius: 12,
          padding: "52px 40px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "rgba(229,184,60,0.05)" : selectedFile ? "rgba(16,185,129,0.04)" : "#0e1626",
          transition: "border-color 0.15s, background 0.15s",
          marginBottom: 12,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={assetClass === "crypto" ? ".csv" : ".csv,.htm,.html,.xml,.xlsx"}
          style={{ display: "none" }}
          onChange={(e) => validateAndSetFile(e.target.files?.[0] || null)}
        />
        {selectedFile ? (
          <>
            <div style={{ fontSize: 28, marginBottom: 10, color: "#10b981" }}>✓</div>
            <p style={{ fontFamily: SPACE, fontSize: 16, color: "#10b981", margin: "0 0 4px", fontWeight: 600 }}>{selectedFile.name}</p>
            <p style={{ fontFamily: MONO, fontSize: 11, color: "#94a3b8", margin: "0 0 10px" }}>
              {(selectedFile.size / 1024).toFixed(0)} KB · click to change
            </p>
            <p style={{ fontFamily: MONO, fontSize: 12, color: "#10b981", margin: 0 }}>
              Ready. Hit Analyze ↓
            </p>
          </>
        ) : (
          <>
            {/* Upload icon */}
            <div style={{ marginBottom: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontFamily: SPACE, fontSize: 22, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px" }}>
              Drop your MT5 export here
            </p>
            <p style={{ fontFamily: MONO, fontSize: 11, color: "#94a3b8", margin: "0 0 16px", letterSpacing: "0.06em" }}>
              {assetClass === "crypto" ? ".csv accepted" : ".csv · .htm · .xlsx · .xml accepted"}
            </p>
            <span style={{ fontFamily: MONO, fontSize: 12, color: GOLD, cursor: "pointer", borderBottom: `1px solid ${GOLD}40` }}>
              or browse files
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
          MT5 .htm, .html, .xlsx, .xml or .csv
        </p>
      )}

      {fileError && (
        <p style={{ fontSize: 13, color: "var(--warning)", margin: "0 0 12px", fontFamily: MONO }}>
          {fileError}
        </p>
      )}

      <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "#475569", textAlign: "center", margin: "0 0 20px", letterSpacing: "0.04em" }}>
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
            <a href="mailto:support@xrayforensic.com" style={{ color: "var(--accent-primary)" }}>
              support@xrayforensic.com
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
        const isEaAutopsy = selectedTier === 'ea-autopsy';
        // EA Autopsy: can analyze if either the main file OR the magic file is present
        const canAnalyze = (isEaAutopsy ? (!!selectedFile || !!magicFile) : !!selectedFile) && !processing;
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
  onCopied,
}: {
  label: string;
  color: string;
  address: string;
  onCopied?: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    onCopied?.();
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
  const { profile: authProfile, user, session } = useAuth();
  const tierInfo =
    selectedTier && tierData[selectedTier as keyof typeof tierData]
      ? tierData[selectedTier as keyof typeof tierData]
      : null;

  const [txHash, setTxHash] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Admin bypass — skip payment step entirely
  useEffect(() => {
    if (authProfile?.subscription_status === "admin") goNext();
  }, [authProfile?.subscription_status, goNext]);

  if (authProfile?.subscription_status === "admin") return null;

  const tierAmount = tierInfo ? tierInfo.price.replace(/[^0-9]/g, "") : "";

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
          email: user?.email ?? profile.email ?? "",
          tier_id: (selectedTier ?? "").toLowerCase(),
          amount: parseInt(tierAmount, 10) || 0,
          wallet: selectedWallet ?? "unknown",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? "Submission failed");
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

  // Success state
  if (submitted) {
    return (
      <div style={{ textAlign: "center" }}>
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
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          We received your submission.
        </h2>
        <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 8px" }}>
          We&apos;ll email <span style={{ color: "var(--text-primary)" }}>{user?.email ?? profile.email}</span> once verified.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-muted)", margin: "0 0 32px" }}>
          Usually within a few hours.
        </p>
        <button
          onClick={goNext}
          style={{
            width: "100%",
            padding: 14,
            background: GOLD,
            color: "#000000",
            border: "none",
            borderRadius: 6,
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: MONO,
            letterSpacing: "0.05em",
          }}
        >
          Continue to Upload →
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
        <CryptoAddress
          key={w.network}
          label={w.label}
          color={w.color}
          address={w.address}
          onCopied={() => setSelectedWallet(w.network)}
        />
      ))}

      {/* Instructions */}
      <div style={{
        padding: "16px 20px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        margin: "20px 0",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
          Send exactly{" "}
          <span style={{ color: "var(--text-primary)", fontFamily: MONO }}>
            ${tierAmount} USDT
          </span>
          {" "}to either address. Then paste your transaction hash below and click the button to notify us.
          We verify and activate your tier within 24 hours.
        </p>
      </div>

      {/* TX hash input */}
      <div style={{ marginBottom: 28 }}>
        <label style={{
          display: "block",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 10,
        }}>
          TRANSACTION HASH
        </label>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Paste your transaction ID here"
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            border: `1px solid ${txHash.trim() ? GOLD : "var(--border-subtle)"}`,
            borderRadius: 8,
            color: "var(--text-primary)",
            fontFamily: MONO,
            fontSize: 12,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />
        <p style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-muted)", margin: "8px 0 0" }}>
          Find this in your Trust Wallet transaction history after sending.
        </p>
      </div>

      {/* Error state */}
      {submitError && (
        <div style={{
          background: "rgba(248,81,73,0.08)",
          border: "1px solid rgba(248,81,73,0.3)",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 20,
        }}>
          <p style={{ fontFamily: MONO, fontSize: 12, color: "var(--loss)", margin: "0 0 6px" }}>
            Submission failed. Please contact us directly.
          </p>
          <a
            href="mailto:admin@xrayforensic.com"
            style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}
          >
            admin@xrayforensic.com →
          </a>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => setModalOpen(true)}
        disabled={!txHash.trim()}
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          background: txHash.trim() ? GOLD : "var(--bg-elevated)",
          color: txHash.trim() ? "#000000" : "var(--text-muted)",
          border: "none",
          borderRadius: 6,
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: txHash.trim() ? "pointer" : "not-allowed",
          fontFamily: MONO,
          letterSpacing: "0.05em",
          marginBottom: 16,
          transition: "background 0.15s, color 0.15s",
          boxSizing: "border-box",
        }}
      >
        I&apos;ve Sent Payment — Notify Support →
      </button>

      {!txHash.trim() && (
        <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", margin: "0 0 16px", textAlign: "center" }}>
          Paste your transaction hash above to continue
        </p>
      )}

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

      {/* Confirmation modal */}
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
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
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
              color: "var(--text-primary)",
              margin: "0 0 20px",
              letterSpacing: "-0.01em",
            }}>
              Confirm Payment Submission
            </h3>
            <p style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)", margin: "0 0 12px" }}>
              Please confirm:
            </p>
            <ul style={{ margin: "0 0 20px", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "You sent the exact amount shown",
                "To the correct wallet address",
                "Transaction is complete (not pending)",
              ].map((item) => (
                <li key={item} style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
              Our team will verify and activate your account within a few hours.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 6,
                  color: "var(--text-secondary)",
                  fontFamily: MONO,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: submitting ? "var(--bg-elevated)" : GOLD,
                  border: "none",
                  borderRadius: 6,
                  color: submitting ? "var(--text-muted)" : "#000000",
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
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function NewPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, session, profile: authProfile, loading: authLoading } = useAuth();
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
  const [lastContextRestored, setLastContextRestored] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const tier = searchParams.get("tier");
    if (tier && tier in tierData) {
      setSelectedTier(tier);
      setTierLocked(true);
    }
    setTierResolved(true);
  }, [searchParams]);

  // Auth gate — small delay lets session load before treating user as anonymous.
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      const timer = setTimeout(() => {
        localStorage.setItem("xray_return_to", window.location.href);
        router.push("/login");
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router]);

  // Rule 4 — Pre-fill email + name from auth session as soon as auth resolves.
  useEffect(() => {
    if (authLoading || !user) return;
    setProfile(prev => ({
      ...prev,
      email: prev.email || user.email || "",
      clientName: prev.clientName || (user.user_metadata?.full_name as string) || "",
    }));
  }, [authLoading, user]);

  // Smart routing — runs once when auth + profile are both resolved.
  useEffect(() => {
    if (authLoading || !user || !authProfile || !tierResolved) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Rule 2 — Auto-set tier from profile (skip if URL param already locked it).
    if (!tierLocked && authProfile.tier_id) {
      setSelectedTier(authProfile.tier_id);
    }

    // Rule 1 — Skip context step for returning users that have a saved context.
    const isReturning = (authProfile.analyses_used ?? 0) > 0;
    if (isReturning) {
      try {
        const saved = localStorage.getItem("xray_last_context");
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(prev => ({
            ...prev,
            ...parsed,
            // Always override email from live session — never trust cached email.
            email: user.email || prev.email || "",
          }));
          setLastContextRestored(true);
          setCurrentStepKey("upload");
        }
      } catch {}
    }
  }, [authLoading, user, authProfile, tierResolved, tierLocked]);

  // Redirect to /pricing when monthly limit is exhausted (Rule 3 fallback).
  useEffect(() => {
    if (authLoading || !authProfile) return;
    if (!authProfile.can_analyze) {
      router.push("/pricing?reason=limit_reached");
    }
  }, [authLoading, authProfile, router]);

  // Dynamic step array — logged-in users never see Tier or Payment steps.
  // Returning users with saved context skip directly to Upload.
  const steps = lastContextRestored
    ? [{ label: "Upload", key: "upload" }]
    : [
        { label: "Context", key: "context" },
        { label: "Upload", key: "upload" },
      ];

  const goToNextStep = () => {
    // Save context profile to localStorage whenever leaving the context step
    // so returning users can skip it on their next visit.
    if (currentStepKey === "context") {
      try {
        localStorage.setItem("xray_last_context", JSON.stringify({
          accountType: profile.accountType,
          firm: profile.firm,
          challengeBalance: profile.challengeBalance,
          dailyDdLimit: profile.dailyDdLimit,
          maxDdLimit: profile.maxDdLimit,
          profitTarget: profile.profitTarget,
          minTradingDays: profile.minTradingDays,
          daysRemaining: profile.daysRemaining,
          accountBalance: profile.accountBalance,
          clientName: profile.clientName,
        }));
      } catch {}
    }
    const currentIndex = steps.findIndex((s) => s.key === currentStepKey);
    if (currentIndex < steps.length - 1) {
      setCurrentStepKey(steps[currentIndex + 1].key);
    }
  };

  // Guard: don't render until URL params + auth have resolved.
  // Also covers the brief window where an anonymous visitor is being redirected to /login.
  // Prevents step-count changing mid-render (e.g. 4-step flash before resolving to 2-step for ?tier=signal).
  if (!tierResolved || authLoading || !user) {
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

  // Monthly limit reached — redirect to /pricing with upgrade prompt.
  // The useEffect above fires router.push; return null to avoid a flash.
  if (authProfile && !authProfile.can_analyze) {
    return null;
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <NavBar />

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
                setSelectedTier(authProfile?.tier_id ?? null);
              }}
              style={{ background: "transparent", border: "1px solid var(--border-active)", color: "var(--text-secondary)", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem" }}
            >
              Remove
            </button>
          </div>
        )}

        {currentStepKey === "context" && (
          <Step1 profile={profile} setProfile={setProfile} onNext={goToNextStep} />
        )}
        {currentStepKey === "upload" && (
          <Step3
            profile={profile}
            selectedTier={selectedTier}
            accessToken={session?.access_token}
            lastContextRestored={lastContextRestored}
            authProfile={authProfile}
            onEditContext={() => {
              setLastContextRestored(false);
              setCurrentStepKey("context");
            }}
          />
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
