import type { Metadata } from "next";
import Script from 'next/script'
import "./globals.css";
import AnimationInit from "./components/AnimationInit";
import ReturnToReportBanner from "./components/ReturnToReportBanner";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Institutional X-Ray",
  description:
    "Forensic trading diagnostic. Know exactly why you're losing — in dollars.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
