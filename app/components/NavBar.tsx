"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavBar() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { id: "how-it-works",  label: "How It Works",  href: "/#how-it-works" },
    { id: "pricing",       label: "Pricing",        href: "/#pricing" },
    { id: "tools",         label: "Tools",          href: "/tools" },
    { id: "foundations",   label: "Foundations",    href: "/foundations" },
    { id: "roadmap",       label: "Roadmap",        href: "/roadmap" },
    { id: "about",         label: "About",          href: "/about" },
  ];
  // FAQ nav item removed 2026-07-12 — FaqSection killed from homepage per
  // structural-delta-spec-v1.md (not in the new 11-section map); no anchor to
  // point to. Replaced with /roadmap, which now carries the homepage's
  // "What's Live/What's Next" honesty-strip destination.

  return (
    <>
      <header
        className="site-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: scrolled ? "1px solid #26313F" : "1px solid transparent",
          padding: "14px 32px",
          background: "rgba(10, 14, 20,0.90)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "border-color 0.2s",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Brand ── */}
          <button
            onClick={() => { if (typeof window !== "undefined") window.location.href = "/"; }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "1.35rem",
                  color: "#38BDF8",
                  filter: "drop-shadow(0 0 8px rgba(56, 189, 248,0.4))",
                  letterSpacing: "0.04em",
                }}
              >
                X-RAY
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: "1.1rem",
                  letterSpacing: "0.18em",
                  color: "var(--text-primary)",
                }}
              >
                FORENSIC
              </span>
            </span>
          </button>

          {/* ── Center nav — desktop ── */}
          <nav
            className="nav-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={item.href.startsWith("/#") ? (e) => handleNavClick(e, item.id) : undefined}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8B98A9",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#E6EDF3"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#8B98A9"; }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* Auth status pill */}
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  className="nav-sample-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontSize: "0.7rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "rgba(56, 189, 248,0.08)",
                    border: "1px solid rgba(56, 189, 248,0.35)",
                    color: "#38BDF8",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Ping dot */}
                  <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", flexShrink: 0 }}>
                    <span style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      background: "#38BDF8", opacity: 0.75,
                      animation: "nav-ping 1s cubic-bezier(0,0,0.2,1) infinite",
                    }} />
                    <span style={{ position: "relative", borderRadius: "50%", background: "#38BDF8", width: "8px", height: "8px" }} />
                  </span>
                  <span>OPERATOR STATUS ACTIVE</span>
                </Link>
              ) : (
                <div
                  className="nav-sample-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontSize: "0.7rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "#0a1120",
                    border: "1px solid #26313F",
                    color: "#8B98A9",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#38BDF8", flexShrink: 0, display: "inline-block" }} />
                  <span>GUEST LICENSE</span>
                </div>
              )
            )}

            {/* Get Diagnosed CTA — ghost gold → fills on hover */}
            <Link
              href="/new"
              className="nav-cta-desktop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                background: "transparent",
                color: "#38BDF8",
                border: "1px solid #38BDF8",
                borderRadius: "4px",
                padding: "7px 14px",
                textDecoration: "none",
                transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
                boxShadow: "0 0 15px rgba(56, 189, 248,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#38BDF8";
                e.currentTarget.style.color = "#0A0E14";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(56, 189, 248,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#38BDF8";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(56, 189, 248,0.05)";
              }}
            >
              <span>Get Diagnosed</span>
              <span>&gt;</span>
            </Link>

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-close" onClick={close} aria-label="Close menu">✕</button>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="mobile-nav-link"
              onClick={(e) => {
                if (item.href.startsWith("/#")) handleNavClick(e, item.id);
                close();
              }}
            >
              {item.label}
            </Link>
          ))}
          {!loading && (user ? (
            <Link href="/dashboard" className="mobile-nav-link" onClick={close}>Dashboard</Link>
          ) : (
            <Link href="/login" className="mobile-nav-link" onClick={close}>Sign In</Link>
          ))}
          <div className="mobile-menu-divider" />
          <Link href="/new" className="btn btn-primary mobile-menu-cta" onClick={close}>
            Get Diagnosed
          </Link>
        </div>
      )}

      {/* Ping keyframe — scoped here, not in globals */}
      <style>{`
        @keyframes nav-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
