import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "./components/NavBar";
import StatusStrip from "./components/StatusStrip";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import RadarSection from "./components/RadarSection";
import LeakCalculatorGuide from "./components/LeakCalculatorGuide";
import AudienceSection from "./components/AudienceSection";
import HonestyGradient from "./components/HonestyGradient";
import SampleReportTeaser from "./components/SampleReportTeaser";
import WhatsLiveWhatsNext from "./components/WhatsLiveWhatsNext";
import TierCards from "./components/TierCards";
import FinalCta from "./components/FinalCta";

/**
 * HOMEPAGE — STRUCTURAL REDESIGN (2026-07-12)
 * Rebuilt per structural-delta-spec-v1.md (11 sections, down from 20) and
 * homepage-design-spec-FINAL.md. See build notes to QA Engineer for the
 * full section-by-section rationale and deviation log.
 *
 * KILLED from this page entirely: VerdictFeed, FrameworkSection,
 * PreChallengeSection (already removed same-day for compliance, a66ae04),
 * RecoveryPrograms, OneTimeProducts, CaseStudies, FaqSection, PainWall and
 * ActivityCounter as standalone sections (merged into LeakCalculatorGuide
 * and StatusStrip respectively).
 */

export const metadata: Metadata = {
  title: "Forensic Trade Diagnostic — Know Why You're Losing",
  description:
    "Upload your MT5 trade history. Get a forensic verdict on exactly which behaviors are costing you money — in dollars. Not financial advice.",
  openGraph: {
    title: "Forensic Trade Diagnostic — Know Why You're Losing | X-Ray Forensic",
    description:
      "Upload your MT5 trade history. Get a forensic verdict on exactly which behaviors are costing you money — in dollars. Not financial advice.",
    url: "https://www.xrayforensic.com",
    type: "website",
  },
  twitter: {
    title: "Forensic Trade Diagnostic — Know Why You're Losing | X-Ray Forensic",
    description:
      "Upload your MT5 trade history. Get a forensic verdict on exactly which behaviors are costing you money — in dollars. Not financial advice.",
  },
};

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Inter', sans-serif";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0A0E14", color: "#E6EDF3" }}>
      {/* 1. Nav + Status Strip */}
      <NavBar />
      <StatusStrip />

      {/* 2. Hero */}
      <HeroSection />

      {/* 3. Mechanism — 3-step */}
      <HowItWorks />

      {/* 4. The 7 Dimensions */}
      <RadarSection />

      {/* 5. The Leak Calculator (consolidated with PainWall) */}
      <LeakCalculatorGuide />

      {/* 6. Who This Is For */}
      <AudienceSection />

      {/* 7. Honesty Gradient */}
      <HonestyGradient />

      {/* 8. Sample Report Teaser (NEW) */}
      <SampleReportTeaser />

      {/* 9. What's Live / What's Next (NEW) */}
      <WhatsLiveWhatsNext />

      {/* 10. Pricing */}
      <TierCards />

      {/* 11. Final CTA + on-page disclaimer */}
      <FinalCta />

      <footer style={{ borderTop: "1px solid #26313F", background: "#0A0E14" }}>
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <p style={{ fontFamily: SPACE, fontSize: "1rem", fontWeight: 700, color: "#E6EDF3", letterSpacing: "0.04em", margin: "0 0 4px" }}>
                X-RAY FORENSIC
              </p>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 14px" }}>
                FORENSIC TRADE DIAGNOSTIC
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                Built on 15 years of institutional trading.
                <br />
                Not financial advice. Diagnostic analysis only.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                PLATFORM
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/#how-it-works" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>How It Works</Link>
                <Link href="/#pricing" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Pricing</Link>
                <Link href="/roadmap" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Roadmap</Link>
                <Link href="/sample" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Sample Report</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                LEGAL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/about" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>About</Link>
                <Link href="/privacy" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
                <Link href="/terms" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #26313F", paddingTop: 24, paddingBottom: 24, textAlign: "center" }}>
            <p style={{ fontFamily: MONO, fontSize: "9px", color: "#10b981", letterSpacing: "0.12em", marginBottom: "8px" }}>
              [SYSTEM STATUS: ONLINE]
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", margin: "0 0 8px" }}>
              For prop firms and institutional desks:{" "}
              <a href="mailto:admin@xrayforensic.com" style={{ color: "#38BDF8", textDecoration: "none" }}>
                admin@xrayforensic.com
              </a>
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
              &copy; 2026 X-Ray Forensic &middot; Not financial advice &middot; All trading involves risk
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
