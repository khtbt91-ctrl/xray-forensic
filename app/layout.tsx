import type { Metadata } from "next";
import "./globals.css";
import AnimationInit from "./components/AnimationInit";

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
        <AnimationInit />
        {children}
      </body>
    </html>
  );
}
