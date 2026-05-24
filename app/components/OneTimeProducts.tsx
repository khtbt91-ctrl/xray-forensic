"use client";

import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

const products = [
  {
    name: "Spot Audit",
    price: "$49",
    tagline: "Single full forensic diagnosis. No subscription.",
    cta: "Get Audit",
  },
  {
    name: "Pre-Challenge Clearance",
    price: "$79",
    tagline: "Monte Carlo simulation before you fund. Know your pass probability.",
    cta: "Get Clearance",
  },
  {
    name: "Failure Autopsy",
    price: "$99",
    tagline: "Complete forensic reconstruction of a blown account or failed challenge. Pinpoints the exact trade where recovery became impossible.",
    cta: "Get Autopsy",
  },
];

export default function OneTimeProducts() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <div className="one-time-products">
          {products.map((product, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)", margin: 0, letterSpacing: "0.06em" }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: MONO, fontSize: 16, fontWeight: 500, color: "var(--accent-primary)", margin: 0, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {product.price}{" "}
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>one-time</span>
                </p>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: "0 0 16px" }}>
                {product.tagline}
              </p>
              <Link href="/new" className="btn btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }}>
                {product.cta}
              </Link>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
