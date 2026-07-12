"use client";

import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

type Product = {
  name: string;
  price: string;
  tagline: string;
  reportLevel: string;
  cta: string;
  href: string;
  badge?: string;
  footnote?: boolean;
};

const products: Product[] = [
  {
    name: "Spot Forensic",
    price: "$49",
    tagline: "Single full forensic diagnosis. No subscription.",
    reportLevel: "FORENSIC-level report depth.",
    cta: "Get Spot Forensic",
    href: "/new?tier=spot-forensic",
  },
  {
    name: "Failure Autopsy",
    price: "$99",
    tagline: "Complete forensic reconstruction of a blown account or failed challenge. Pinpoints the exact trade where recovery became impossible.",
    reportLevel: "FORENSIC-level report + liquidation trace.",
    cta: "Get Autopsy",
    href: "/new?tier=failure-autopsy",
  },
  {
    name: "EA Autopsy",
    price: "$99",
    tagline: "Did your bot blow the account, or did you? Upload your magic export and get a full per-EA forensic analysis.",
    reportLevel: "FORENSIC-level report + per-EA verdict.",
    cta: "Get EA Autopsy",
    href: "/new?tier=ea-autopsy",
    badge: "EA TRADERS",
    footnote: true,
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
                display: "flex",
                flexDirection: "column",
              }}
            >
              {product.badge && (
                <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>
                  {product.badge}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)", margin: 0, letterSpacing: "0.06em" }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: MONO, fontSize: 16, fontWeight: 500, color: "var(--accent-primary)", margin: 0, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {product.price}{" "}
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>one-time</span>
                </p>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: "0 0 4px" }}>
                {product.tagline}
              </p>
              <p style={{ fontFamily: MONO, fontSize: "0.7rem", color: "var(--accent-primary)", margin: "0 0 16px" }}>
                {product.reportLevel}
              </p>
              {product.footnote && (
                <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic", margin: "0 0 16px", lineHeight: 1.5 }}>
                  Requires free Magic Export script from{" "}
                  <Link href="/tools" style={{ color: "var(--accent-primary)" }}>
                    /tools
                  </Link>
                </p>
              )}
              <Link href={product.href} className="btn btn-ghost" style={{ fontSize: 12, padding: "7px 14px", marginTop: "auto", alignSelf: "flex-start" }}>
                {product.cta}
              </Link>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
