import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OBLIQ — AI Compliance Orchestration for Indian CA Firms",
    template: "%s | OBLIQ",
  },
  description:
    "AI-driven compliance orchestration platform for Chartered Accountant firms. Manage deadlines, collect documents, and automate compliance workflows across your practice.",
  keywords: [
    "CA firm software",
    "compliance management India",
    "GST filing software",
    "ITR compliance tool",
    "Chartered Accountant practice management",
    "TDS return filing",
    "compliance orchestration",
    "CA firm automation",
    "Indian tax compliance",
    "ROC filing software",
  ],
  authors: [{ name: "OBLIQ" }],
  creator: "OBLIQ",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://obliq.io",
    siteName: "OBLIQ",
    title: "OBLIQ — AI Compliance Orchestration for Indian CA Firms",
    description:
      "Run compliance operations instead of chasing them. AI-driven deadline tracking, document collection, and workflow automation for CA firms.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OBLIQ — Compliance Orchestration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OBLIQ — AI Compliance Orchestration for Indian CA Firms",
    description:
      "Run compliance operations instead of chasing them.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
