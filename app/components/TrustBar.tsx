"use client";

import { Fragment } from "react";

const items = [
  "🔒 No access to your MT5 password",
  "Reports accessible only to you",
  "No broker credentials required",
  "CSV processed and discarded",
  "Not financial advice",
];

export default function TrustBar() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "14px 40px",
      }}
    >
      <div className="trust-bar-row" style={{ maxWidth: 900, margin: "0 auto" }}>
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span
                className="trust-bar-dot"
                style={{ color: "var(--text-muted)", margin: "0 16px", fontSize: "0.75rem" }}
              >
                ·
              </span>
            )}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {item}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
