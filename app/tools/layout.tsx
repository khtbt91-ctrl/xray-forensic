import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MT5 Trade Analysis Tools — Free Export & Diagnostic",
  description:
    "Free MT5 export script + forensic trade diagnostic tools for serious traders.",
  openGraph: {
    title: "MT5 Trade Analysis Tools — Free Export & Diagnostic | X-Ray Forensic",
    description:
      "Free MT5 export script + forensic trade diagnostic tools for serious traders.",
    url: "https://www.xrayforensic.com/tools",
    type: "website",
  },
  twitter: {
    title: "MT5 Trade Analysis Tools — Free Export & Diagnostic | X-Ray Forensic",
    description:
      "Free MT5 export script + forensic trade diagnostic tools for serious traders.",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
