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
  openGraph: {
    title: "Operations Decoded - Learn Supply Chain & ERP by Doing",
    description:
      "Interactive modules for operations professionals. Learn procurement, logistics, and ERP through real-world scenarios.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
    url: "https://operationsdecoded.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operations Decoded - Learn Supply Chain & ERP by Doing",
    description:
      "Interactive modules for operations professionals. Learn procurement, logistics, and ERP through real-world scenarios.",
    images: ["/og-image.png"],
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
