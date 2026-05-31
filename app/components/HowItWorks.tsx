"use client";

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "UPLOAD YOUR HISTORY",
      badge: "[DATA INGESTION]",
      badgeColor: "#e5b83c",
      iconBg: "rgba(229,184,60,0.1)",
      iconStroke: "#e5b83c",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5b83c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      ),
      body: "Export and upload your MT5 trade history (.htm, .csv or .xml). Secure browser-level processing ensures complete privacy.",
    },
    {
      num: "2",
      title: "DIAGNOSE WITH AI",
      badge: "[FORENSIC SCANNING]",
      badgeColor: "#3b82f6",
      iconBg: "rgba(59,130,246,0.1)",
      iconStroke: "#3b82f6",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      body: "The forensic engine scores behavior across 7 institutional dimensions. No opinions — only clinical data.",
    },
    {
      num: "3",
      title: "RECEIVE PRESCRIPTION",
      badge: "[OPTIMIZATION REPORT]",
      badgeColor: "#10b981",
      iconBg: "rgba(16,185,129,0.1)",
      iconStroke: "#10b981",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
      body: "Ranked protocols with estimated dollar impact per month. Follow them. Upload again. Track your improvement.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "96px 24px",
        background: "#050811",
        borderTop: "1px solid #1e293b",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Section label */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#e5b83c",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "12px",
        }}>
          THE PROCESS
        </p>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(1.75rem, 3vw, 2rem)",
          fontWeight: 700,
          color: "#f8fafc",
          textAlign: "center",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "56px",
        }}>
          HOW IT WORKS
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: "#0e1626",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                padding: "28px",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.background = "#141e35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e293b";
                e.currentTarget.style.background = "#0e1626";
              }}
            >
              {/* Icon */}
              <div style={{
                width: "44px",
                height: "44px",
                background: step.iconBg,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}>
                {step.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: "4px",
              }}>
                {step.num}. {step.title}
              </h3>

              {/* Badge */}
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: step.badgeColor,
                letterSpacing: "0.08em",
                marginBottom: "14px",
              }}>
                {step.badge}
              </p>

              {/* Body */}
              <p style={{
                fontSize: "14px",
                color: "#94a3b8",
                lineHeight: 1.7,
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
