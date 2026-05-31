"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavBar() {
  const { user, profile, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          transition: "background 0.2s, border-color 0.2s",
          background: scrolled ? "rgba(5,8,17,0.95)" : "rgba(5,8,17,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          {/* LEFT — Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Gold X icon */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                background: "var(--gold)",
                borderRadius: 4,
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2L14 14M14 2L2 14" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span
              className="nav-logo-text"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "0.04em",
              }}
            >
              X-RAY FORENSIC
            </span>
          </Link>

          {/* CENTER — Nav links */}
          <div
            className="nav-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 28,
              alignItems: "center",
            }}
          >
            <Link
              href="/#how-it-works"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "how-it-works")}
            >
              HOW IT WORKS
            </Link>
            <Link
              href="/#pricing"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "pricing")}
            >
              PRICING
            </Link>
            <Link href="/tools" className="nav-link">
              TOOLS
            </Link>
            <Link
              href="/#faq"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "faq")}
            >
              FAQ
            </Link>
            <Link href="/about" className="nav-link">
              ABOUT
            </Link>
            <a href="mailto:support@xrayforensic.com" className="nav-link">
              CONTACT
            </a>
          </div>

          {/* RIGHT — Actions */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="nav-sample-link"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "var(--gold)" }}>●</span>
                {profile?.tier_id
                  ? profile.tier_id.toUpperCase()
                  : "OPERATOR"}{" "}
                · {user.email?.split("@")[0]}
              </Link>
            ) : !loading ? (
              <Link
                href="/login"
                className="nav-link nav-sample-link"
                style={{ letterSpacing: "0.05em" }}
              >
                SIGN IN
              </Link>
            ) : null}

            <Link
              href="/new"
              className="nav-cta-desktop"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                background: "var(--gold)",
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                letterSpacing: "0.02em",
                transition: "background 0.15s",
              }}
            >
              Get Diagnosed
            </Link>

            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <button
            className="mobile-menu-close"
            onClick={close}
            aria-label="Close menu"
          >
            ✕
          </button>
          <Link
            href="/#how-it-works"
            className="mobile-nav-link"
            onClick={(e) => { handleNavClick(e, "how-it-works"); close(); }}
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="mobile-nav-link"
            onClick={(e) => { handleNavClick(e, "pricing"); close(); }}
          >
            Pricing
          </Link>
          <Link href="/tools" className="mobile-nav-link" onClick={close}>
            Tools
          </Link>
          <Link
            href="/#faq"
            className="mobile-nav-link"
            onClick={(e) => { handleNavClick(e, "faq"); close(); }}
          >
            FAQ
          </Link>
          <Link href="/about" className="mobile-nav-link" onClick={close}>
            About
          </Link>
          <a href="mailto:support@xrayforensic.com" className="mobile-nav-link" onClick={close}>
            Contact
          </a>
          {!loading && (user ? (
            <Link href="/dashboard" className="mobile-nav-link" onClick={close}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="mobile-nav-link" onClick={close}>
              Sign In
            </Link>
          ))}
          <div className="mobile-menu-divider" />
          <Link href="/new" className="btn btn-primary mobile-menu-cta" onClick={close}>
            Get Diagnosed
          </Link>
        </div>
      )}
    </>
  );
}
