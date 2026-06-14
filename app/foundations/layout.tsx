import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMC Trading Guide — Kill Zones, Order Blocks, OTE Explained",
  description:
    "The complete SMC trading guide. Kill zones, order blocks, fair value gaps, OTE zones — explained with zero assumptions.",
  openGraph: {
    title:
      "SMC Trading Guide — Kill Zones, Order Blocks, OTE Explained | X-Ray Forensic",
    description:
      "The complete SMC trading guide. Kill zones, order blocks, fair value gaps, OTE zones — explained with zero assumptions.",
    url: "https://www.xrayforensic.com/foundations",
    type: "website",
  },
  twitter: {
    title:
      "SMC Trading Guide — Kill Zones, Order Blocks, OTE Explained | X-Ray Forensic",
    description:
      "The complete SMC trading guide. Kill zones, order blocks, fair value gaps, OTE zones — explained with zero assumptions.",
  },
};

export default function FoundationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
