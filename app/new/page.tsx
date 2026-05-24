"use client";

import React, { useCallback, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Disclaimer from "../../components/Disclaimer";

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
    tagline: "Limited to 1 audit/month. No narrative.",
    features: ["1 audit/month", "7 scores", "Session breakdown", "3 behavioral flags"],
    popular: false,
    disabled: true,
    accent: "var(--text-muted)",
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
    features: ["10 audits/month", "AI diagnosis", "Prop firm mode", "DNA profile", "Pre-mortem"],
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

const PROCESSING_STAGES = [
  { label: "Parsing trades...", ms: 2000 },
  { label: "Detecting behavioral patterns...", ms: 2000 },
  { label: "Scoring 7 dimensions...", ms: 1500 },
  { label: "Generating forensic report...", ms: 1500 },
];

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Context", "Tier", "Upload"];
  const symbols = ["①", "②", "③"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  lineHeight: 1,
                  color: done ? "var(--profit)" : active ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                {done ? "✓" : symbols[i]}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: done ? "var(--profit)" : active ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ color: "var(--border-subtle)", fontSize: 14, margin: "0 2px" }}>→</span>
            )}
          </React.Fragment>
        );
      })}
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
  selectedTier: TierName | null;
  setSelectedTier: (t: TierName) => void;
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
                  href="mailto:your-email@example.com"
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

function Step3() {
  // TODO: replace mock processing with actual POST to FastAPI /analyze endpoint,
  // then redirect to /report/:id instead of /sample.

  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stageIdx, setStageIdx] = useState(-1);
  const [progress, setProgress] = useState(0);

  const startProcessing = useCallback(() => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setStageIdx(0);

    const total = PROCESSING_STAGES.reduce((s, p) => s + p.ms, 0);
    let accumulated = 0;

    PROCESSING_STAGES.forEach((stage, i) => {
      const at = accumulated;
      setTimeout(() => {
        setStageIdx(i);
        setProgress(Math.round(((at + stage.ms) / total) * 100));
      }, at);
      accumulated += stage.ms;
    });

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => router.push("/sample"), 500);
    }, total);
  }, [file, router]);

  if (processing) {
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Analyzing…</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
          Do not close this tab.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "40px 36px" }}>
          <div style={{ marginBottom: 28 }}>
            <div className="progress-bar" style={{ marginBottom: 10 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)" }}>
                {stageIdx >= 0 && stageIdx < PROCESSING_STAGES.length ? PROCESSING_STAGES[stageIdx].label : "Complete"}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)" }}>{progress}%</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROCESSING_STAGES.map((stage, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: i <= stageIdx ? "var(--profit)" : "var(--text-muted)" }}>
                  {i < stageIdx ? "✓" : i === stageIdx ? "›" : "·"}
                </span>
                <span style={{ fontSize: 13, color: i <= stageIdx ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
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
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 36px" }}>
        Export your MT5 history as CSV or HTML and drop it here.
      </p>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) setFile(f);
        }}
        style={{
          border: `1.5px dashed ${dragOver ? "var(--accent-primary)" : file ? "var(--profit)" : "var(--border-subtle)"}`,
          borderRadius: 10,
          padding: "56px 40px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "rgba(88,166,255,0.04)" : file ? "rgba(63,185,80,0.04)" : "transparent",
          transition: "border-color 0.15s, background 0.15s",
          marginBottom: 24,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.htm,.html"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <>
            <p style={{ fontFamily: MONO, fontSize: 20, margin: "0 0 4px" }}>↑</p>
            <p style={{ fontSize: 14, color: "var(--profit)", margin: "0 0 4px", fontWeight: 500 }}>{file.name}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              {(file.size / 1024).toFixed(0)} KB — click to change
            </p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: MONO, fontSize: 28, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1 }}>↑</p>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 8px", fontWeight: 500 }}>
              Drop your MT5 trade history here
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
              CSV or HTM export from MetaTrader 5
            </p>
            <span style={{ fontSize: 13, color: "var(--accent-primary)", textDecoration: "underline", cursor: "pointer" }}>
              Browse files
            </span>
          </>
        )}
      </div>

      <button
        onClick={startProcessing}
        disabled={!file}
        className="btn btn-primary"
        style={{ width: "100%", padding: "14px", fontSize: 15, opacity: file ? 1 : 0.4, cursor: file ? "pointer" : "not-allowed" }}
      >
        Analyze
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function NewPage() {
  const [step, setStep] = useState(0);
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
  const [selectedTier, setSelectedTier] = useState<TierName | null>("FORENSIC");
  const [selectedOneTime, setSelectedOneTime] = useState<OneTime>(null);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <nav style={{ borderBottom: "1px solid var(--border-subtle)", padding: "16px 40px", display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
          ← X-Ray
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>
        <StepIndicator step={step} />
        {step === 0 && (
          <Step1 profile={profile} setProfile={setProfile} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <Step2
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            selectedOneTime={selectedOneTime}
            setSelectedOneTime={setSelectedOneTime}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && <Step3 />}
      </div>
    </main>
  );
}
