"use client";

// TODO: fetch analysis from Supabase by id, then load report_url in an iframe below.
// Replace this placeholder once the FastAPI backend is connected.

import Link from "next/link";
import { useParams } from "next/navigation";
import Disclaimer from "../../../components/Disclaimer";

const MONO = "JetBrains Mono, monospace";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Top bar */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
        <span style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)" }}>
          Analysis #{id}
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} disabled>
            Download PDF
          </button>
          <Link href="/new" className="btn btn-primary" style={{ fontSize: 13 }}>
            New Analysis
          </Link>
        </div>
      </div>

      {/* Placeholder content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 40px",
          gap: 32,
        }}
      >
        <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.7 }}>
          Report will load here when the backend is connected.
        </p>

        {/* Skeleton bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 560 }}>
          <div className="skeleton" style={{ height: 16, background: "var(--bg-elevated)", borderRadius: 4, width: "80%" }} />
          <div className="skeleton" style={{ height: 16, background: "var(--bg-elevated)", borderRadius: 4, width: "60%", animationDelay: "0.2s" }} />
          <div className="skeleton" style={{ height: 16, background: "var(--bg-elevated)", borderRadius: 4, width: "40%", animationDelay: "0.4s" }} />
        </div>

        <Link href="/sample" className="btn btn-ghost" style={{ fontSize: 13 }}>
          View sample report instead
        </Link>
      </div>

      <Disclaimer />
    </main>
  );
}
