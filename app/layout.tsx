import type { Metadata } from "next";
import Script from 'next/script'
import "./globals.css";
import AnimationInit from "./components/AnimationInit";
import ReturnToReportBanner from "./components/ReturnToReportBanner";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xrayforensic.com"),
  title: {
    default: "X-Ray Forensic",
    template: "%s | X-Ray Forensic",
  },
  description:
    "Forensic trading diagnostic. Know exactly why you're losing — in dollars.",
  openGraph: {
    siteName: "X-Ray Forensic",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload the critical H1 weight so download starts at HTML-parse time,
            not after CSS is fetched and the @font-face rule is discovered.
            QA round 2 fix (2026-07-12): font-display: swap alone still left a
            3083ms render-delay repaint (87% of a 3.5s LCP) because the browser
            had no reason to fetch the woff2 until it found the @font-face rule
            in globals.css. Extrabold (800) is the H1 weight — the LCP element. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/CabinetGrotesk-Extrabold.woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <AnimationInit />
          {children}
          <ReturnToReportBanner />
        </AuthProvider>
        <Script
          id="crisp-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="3471724e-3960-445d-9555-7d4f2c2b4d31";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0]
                  .appendChild(s);
              })();
              window.$crisp.push(["set",
                "session:segments",
                [["xray-forensic"]]
              ]);
              window.$crisp.push(["set", "message:text",
                [""]
              ]);
              window.$crisp.push(["config", "color:theme",
                ["amber"]
              ]);
              window.$crisp.push(["config", "color:scheme",
                ["dark"]
              ]);
            `,
          }}
        />
      </body>
    </html>
  );
}
