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
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 40px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.2s, border-color 0.2s",
        background: scrolled ? "rgba(13,17,23,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: "0.12em",
          color: "var(--text-primary)",
          fontWeight: 500,
        }}
      >
        X-RAY
      </span>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Link
          href="/sample"
          style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}
        >
          Sample Report
        </Link>
        <Link href="/new" className="btn btn-primary" style={{ fontSize: 13, padding: "8px 18px" }}>
          Get Diagnosed
        </Link>
      </div>
    </nav>
  );
}
