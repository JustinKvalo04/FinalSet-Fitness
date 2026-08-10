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

export const metadata: Metadata = {
  title: "FinalSet Fitness - Data-Driven Workout Tracking",
  description: "The premium workout, macro, and weight tracker built for serious lifters. Log every set with zero friction and monitor your progress automatically.",
  keywords: ["workout tracker", "macro tracker", "fitness app", "bodybuilding", "hypertrophy", "FinalSet Fitness", "iOS fitness app"],
  authors: [{ name: "FinalSet Fitness" }],
  openGraph: {
    title: "FinalSet Fitness",
    description: "Data-Driven Fitness, Automated for You.",
    url: "https://finalset.app",
    siteName: "FinalSet Fitness",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-100 selection:bg-blue-500/30 selection:text-blue-200`}
      >
        {children}
      </body>
    </html>
  );
}
