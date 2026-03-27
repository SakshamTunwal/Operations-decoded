import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Operations Decoded — Supply Chain Learning Platform",
  description:
    "The only interactive platform where ops professionals and industrial SME owners learn how supply chains actually break — and how to fix them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning prevents false positives from browser extensions
          (e.g. password managers injecting fdprocessedid onto inputs/buttons) */}
      <body className="min-h-full flex flex-col bg-[#080808] text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
