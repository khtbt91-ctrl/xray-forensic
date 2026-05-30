import type { Metadata } from "next";
import "./globals.css";
import AnimationInit from "./components/AnimationInit";
import SupportButton from "./components/SupportButton";
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
          <SupportButton />
        </AuthProvider>
      </body>
    </html>
  );
}
