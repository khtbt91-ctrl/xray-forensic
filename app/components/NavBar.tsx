"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MONO } from "./shared";

export default function NavBar() {
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
    // else: href="/#sectionId" navigates normally
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
          background: scrolled ? "rgba(13,17,23,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
        }}
      >
        {/* Inner width-constrained wrapper */}
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
          {/* LEFT — Stacked logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <span
              className="nav-logo-text"
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
              className="nav-descriptor"
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

          {/* CENTER — Absolutely centered nav links */}
          <div
            className="nav-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
          >
            <Link
              href="/#how-it-works"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "how-it-works")}
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "pricing")}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "faq")}
            >
              FAQ
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <a href="mailto:hello@xrayforensic.com" className="nav-link">
              Contact
            </a>
          </div>

          {/* RIGHT — Actions */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Link href="/sample" className="nav-link nav-sample-link" style={{ textAlign: "center", display: "block", marginLeft: "auto", marginRight: "auto" }}>
              Sample Report
            </Link>
            <Link
              href="/new"
              className="btn btn-primary nav-cta-desktop"
              style={{ fontSize: "0.85rem", padding: "8px 20px", borderRadius: 6 }}
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
            onClick={(e) => {
              handleNavClick(e, "how-it-works");
              close();
            }}
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="mobile-nav-link"
            onClick={(e) => {
              handleNavClick(e, "pricing");
              close();
            }}
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="mobile-nav-link"
            onClick={(e) => {
              handleNavClick(e, "faq");
              close();
            }}
          >
            FAQ
          </Link>
          <Link href="/about" className="mobile-nav-link" onClick={close}>
            About
          </Link>
          <a
            href="mailto:hello@xrayforensic.com"
            className="mobile-nav-link"
            onClick={close}
          >
            Contact
          </a>
          <Link href="/sample" className="mobile-nav-link" onClick={close} style={{ textAlign: "center", display: "block", marginLeft: "auto", marginRight: "auto" }}>
            Sample Report
          </Link>
          <div className="mobile-menu-divider" />
          <Link
            href="/new"
            className="btn btn-primary mobile-menu-cta"
            onClick={close}
          >
            Get Diagnosed
          </Link>
        </div>
      )}
    </>
  );
}
