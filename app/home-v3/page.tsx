import type { Metadata } from "next";
import HomeNav from "../components/home/HomeNav";
import Hero from "../components/home/Hero";
import EvidenceTrail from "../components/home/EvidenceTrail";
import SevenDimensions from "../components/home/SevenDimensions";
import ArchetypeExhibit from "../components/home/ArchetypeExhibit";
import ReportTeaser from "../components/home/ReportTeaser";
import HonestyLedger from "../components/home/HonestyLedger";
import PricingTable from "../components/home/PricingTable";
import FinalCta from "../components/home/FinalCta";
import SiteFooter from "../components/home/SiteFooter";

/**
 * HOMEPAGE V3 — TEMP BUILD ROUTE (redesign/home-v3 branch)
 * Full concept restart per structural-delta-spec-v2.md +
 * art-direction-rulings-v2.md. Approved at Checkpoint 1, 2026-07-20.
 * This route exists so previews render old `/` and new `/home-v3`
 * side-by-side; the final swap commit moves this into app/page.tsx
 * and deletes this directory.
 *
 * Concept: the homepage is a case file; the product is the evidence.
 * Sections land here in build order — see design_rules.md for constraints.
 */

export const metadata: Metadata = {
  title: "Homepage v3 preview",
  robots: { index: false, follow: false },
};

export default function HomeV3() {
  return (
    <main className="min-h-screen bg-brand-bg text-[color:var(--text-primary)]">
      <HomeNav />
      <Hero />
      <EvidenceTrail />
      <SevenDimensions />
      <ArchetypeExhibit />
      <ReportTeaser />
      <HonestyLedger />
      <PricingTable />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
