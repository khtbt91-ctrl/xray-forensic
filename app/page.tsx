import Link from "next/link";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PainWall from "./components/PainWall";
import PreChallengeSection from "./components/PreChallengeSection";
import RadarSection from "./components/RadarSection";
import FrameworkSection from "./components/FrameworkSection";
import HonestyGradient from "./components/HonestyGradient";
import CaseStudies from "./components/CaseStudies";
import TestimonialsSection from "./components/TestimonialsSection";
import AudienceSection from "./components/AudienceSection";
import LeakCalculator from "./components/LeakCalculator";
import TierCards from "./components/TierCards";
import OneTimeProducts from "./components/OneTimeProducts";
import FaqSection from "./components/FaqSection";
import FinalCta from "./components/FinalCta";

const MONO = "JetBrains Mono, monospace";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <PainWall />
      <PreChallengeSection />
      <RadarSection />
      <FrameworkSection />
      <HonestyGradient />
      <CaseStudies />
      <TestimonialsSection />
      <AudienceSection />
      <LeakCalculator />
      <TierCards />
      <OneTimeProducts />
      <FaqSection />
      <FinalCta />
      <footer style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          {/* Three-column grid */}
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "0.06em",
                  margin: "0 0 6px",
                }}
              >
                X-RAY
              </p>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                FORENSIC TRADE DIAGNOSTIC
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Built on 15 years of institutional trading.
                <br />
                Not financial advice. Diagnostic analysis only.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                }}
              >
                PLATFORM
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "center", width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                <Link href="/#how-it-works" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  How It Works
                </Link>
                <Link href="/#pricing" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  Pricing
                </Link>
                <Link href="/#faq" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  FAQ
                </Link>
                <Link href="/sample" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none", textAlign: "center", width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
                  Sample Report
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                }}
              >
                LEGAL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/about" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  About
                </Link>
                <Link href="/privacy" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
                <Link href="/terms" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: 24,
              paddingBottom: 24,
              textAlign: "center",
              marginTop: 0,
              width: "100%",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                margin: "0 0 8px",
                textAlign: "center",
                width: "100%",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              For prop firms and institutional desks:{" "}
              <a
                href="mailto:support@xrayforensic.com"
                style={{ color: "var(--accent-primary)", textDecoration: "none" }}
              >
                support@xrayforensic.com
              </a>
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
              &copy; 2026 X-Ray &middot; Forensic trade diagnostic &middot; Not financial advice &middot; All trading involves risk
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
