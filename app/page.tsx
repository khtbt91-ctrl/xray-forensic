import Link from "next/link";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import TrustBar from "./components/TrustBar";
import PainWall from "./components/PainWall";
import RadarSection from "./components/RadarSection";
import FrameworkSection from "./components/FrameworkSection";
import MetricBar from "./components/MetricBar";
import HonestyGradient from "./components/HonestyGradient";
import AudienceSection from "./components/AudienceSection";
import ProtocolsSection from "./components/ProtocolsSection";
import TierCards from "./components/TierCards";
import OneTimeProducts from "./components/OneTimeProducts";
import LeakCalculator from "./components/LeakCalculator";
import SamplePreview from "./components/SamplePreview";
import FaqSection from "./components/FaqSection";
import FinalCta from "./components/FinalCta";

const MONO = "JetBrains Mono, monospace";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <NavBar />
      <HeroSection />
      <TrustBar />
      <PainWall />
      <RadarSection />
      <FrameworkSection />
      <MetricBar />
      <HonestyGradient />
      <AudienceSection />
      <ProtocolsSection />
      <TierCards />
      <OneTimeProducts />
      <LeakCalculator />
      <SamplePreview />
      <FaqSection />
      <FinalCta />
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "24px 40px",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", margin: "0 0 8px" }}>
          Built on 15 years of institutional trading. Not financial advice. Diagnostic analysis only.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <Link href="/about" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
            About
          </Link>
          <span style={{ color: "var(--border-subtle)", margin: "0 10px" }}>·</span>
          <Link href="/privacy" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
            Privacy Policy
          </Link>
          <span style={{ color: "var(--border-subtle)", margin: "0 10px" }}>·</span>
          <Link href="/terms" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
            Terms of Service
          </Link>
        </p>
        <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
          &copy; 2026 X-Ray &middot; Forensic trade diagnostic &middot; Not financial advice &middot; All trading involves risk
        </p>
      </footer>
    </main>
  );
}
