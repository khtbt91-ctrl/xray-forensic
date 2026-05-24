import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
