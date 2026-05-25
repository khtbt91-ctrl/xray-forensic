"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MONO } from "./shared";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        transition: "background 0.2s, border-color 0.2s",
        background: scrolled ? "rgba(13,17,23,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      {/* LEFT — Stacked logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 3, lineHeight: 1 }}>
        <span
          style={{
            fontFamily: MONO,
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "0.06em",
          }}
        >
          X-RAY
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.6rem",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          FORENSIC TRADE DIAGNOSTIC
        </span>
      </Link>

      {/* CENTER — Nav links */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <Link href="/#how-it-works" className="nav-link">How It Works</Link>
        <Link href="/#pricing" className="nav-link">Pricing</Link>
        <Link href="/#faq" className="nav-link">FAQ</Link>
        <a href="mailto:hello@xrayforensic.com" className="nav-link">Contact</a>
      </div>

      {/* RIGHT — Actions */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/sample" className="nav-link">Sample Report</Link>
        <Link
          href="/new"
          className="btn btn-primary"
          style={{ fontSize: "0.85rem", padding: "8px 20px", borderRadius: 6 }}
        >
          Get Diagnosed
        </Link>
      </div>
    </nav>
  );
}
