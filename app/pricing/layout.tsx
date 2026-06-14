import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Forensic Trade Analysis Plans",
  description:
    "Signal (free), Forensic ($29), Operator ($79), Elite ($149). Forensic trade diagnosis for MT5 traders.",
  openGraph: {
    title: "Pricing — Forensic Trade Analysis Plans | X-Ray Forensic",
    description:
      "Signal (free), Forensic ($29), Operator ($79), Elite ($149). Forensic trade diagnosis for MT5 traders.",
    url: "https://www.xrayforensic.com/pricing",
    type: "website",
  },
  twitter: {
    title: "Pricing — Forensic Trade Analysis Plans | X-Ray Forensic",
    description:
      "Signal (free), Forensic ($29), Operator ($79), Elite ($149). Forensic trade diagnosis for MT5 traders.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
