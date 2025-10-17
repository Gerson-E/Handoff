import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans, Source_Sans_3 } from "next/font/google";

const heading = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-heading" });
const body = Source_Sans_3({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Handoff — AI Smart Request Routing for Healthcare",
  description:
    "Handoff is the identity-aware routing layer for healthcare. We read any clinical request and send it to the correct facility—instantly, with explainable AI.",
  openGraph: {
    title: "Handoff — AI Smart Request Routing for Healthcare",
    description:
      "Handoff is the identity-aware routing layer for healthcare. We read any clinical request and send it to the correct facility—instantly, with explainable AI.",
    url: "https://handoff.example.com",
    siteName: "Handoff",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${heading.variable} ${body.variable}`}>
      <body className="min-h-screen antialiased font-[var(--font-body)]">
        {children}
      </body>
    </html>
  );
}


