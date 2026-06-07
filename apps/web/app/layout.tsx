import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ProjectPilot | AI-Powered Project Management",
  description: "Enterprise-grade AI-powered project management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
