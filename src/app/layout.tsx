import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://start-solopreneur.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Start Solopreneur — Claude Code × 一人会社",
    template: "%s | Start Solopreneur",
  },
  description: "Claude Codeを使いながらゼロからソロアントレを始める実験記録。エンジニアリング・経営・マーケの学びをすべて公開。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "Start Solopreneur",
    title: "Start Solopreneur — Claude Code × 一人会社",
    description: "Claude Codeを使いながらゼロからソロアントレを始める実験記録。エンジニアリング・経営・マーケの学びをすべて公開。",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bensolopreneur",
    creator: "@bensolopreneur",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
