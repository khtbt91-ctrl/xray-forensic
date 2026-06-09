import Link from "next/link";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ActivityCounter from "./components/ActivityCounter";
import HowItWorks from "./components/HowItWorks";
import VerdictFeed from "./components/VerdictFeed";
import PainWall from "./components/PainWall";
import PreChallengeSection from "./components/PreChallengeSection";
import RadarSection from "./components/RadarSection";
import FrameworkSection from "./components/FrameworkSection";
import HonestyGradient from "./components/HonestyGradient";
import CaseStudies from "./components/CaseStudies";
import TestimonialsSection from "./components/TestimonialsSection";
import AudienceSection from "./components/AudienceSection";
import LeakCalculator from "./components/LeakCalculator";
import LeakCalculatorGuide from "./components/LeakCalculatorGuide";
import TierCards from "./components/TierCards";
import OneTimeProducts from "./components/OneTimeProducts";
import RecoveryPrograms from "./components/RecoveryPrograms";
import FaqSection from "./components/FaqSection";
import FinalCta from "./components/FinalCta";

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050811", color: "#f8fafc" }}>
      <NavBar />
      <HeroSection />
      <ActivityCounter />
      <HowItWorks />
      <VerdictFeed />
      <PainWall />
      <PreChallengeSection />
      <RadarSection />
      <FrameworkSection />
      <HonestyGradient />
      <CaseStudies />
      <TestimonialsSection />
      <AudienceSection />
      <LeakCalculator />
      <LeakCalculatorGuide />
      <TierCards />
      <OneTimeProducts />
      <RecoveryPrograms />
      <FaqSection />
      <FinalCta />
      <footer style={{ borderTop: "1px solid #1e293b", background: "#050811" }}>
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <p style={{ fontFamily: SPACE, fontSize: "1rem", fontWeight: 700, color: "#f8fafc", letterSpacing: "0.04em", margin: "0 0 4px" }}>
                X-RAY FORENSIC
              </p>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 14px" }}>
                FORENSIC TRADE DIAGNOSTIC
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                Built on 15 years of institutional trading.
                <br />
                Not financial advice. Diagnostic analysis only.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                PLATFORM
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/#how-it-works" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>How It Works</Link>
                <Link href="/#pricing" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>Pricing</Link>
                <Link href="/#faq" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>FAQ</Link>
                <Link href="/sample" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>Sample Report</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                LEGAL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/about" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>About</Link>
                <Link href="/privacy" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>Privacy Policy</Link>
                <Link href="/terms" style={{ fontFamily: MONO, fontSize: 11, color: "#475569", textDecoration: "none" }}>Terms of Service</Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, paddingBottom: 24, textAlign: "center" }}>
            <p style={{ fontFamily: MONO, fontSize: "9px", color: "#10b981", letterSpacing: "0.12em", marginBottom: "8px" }}>
              [SYSTEM STATUS: ONLINE]
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#475569", margin: "0 0 8px" }}>
              For prop firms and institutional desks:{" "}
              <a href="mailto:admin@xrayforensic.com" style={{ color: "#e5b83c", textDecoration: "none" }}>
                admin@xrayforensic.com
              </a>
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#475569", margin: 0 }}>
              &copy; 2026 X-Ray Forensic &middot; Not financial advice &middot; All trading involves risk
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
