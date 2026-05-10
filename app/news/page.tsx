"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NewsPage() {
  useEffect(() => {
    document.title = "Industry News — Coming Soon — Operations Decoded";
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "var(--font-dm-sans),sans-serif" }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] group-hover:scale-110 transition-transform" />
            <span
              className="text-[#1A1A1A] font-semibold text-sm tracking-tight"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              Operations Decoded
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24 flex flex-col items-center text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#f59e0b] mb-6 bg-[#FEF3C7] px-3 py-1.5 rounded-full border border-[#f59e0b]/30">
          Coming Soon
        </span>

        <h1
          className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Industry News
        </h1>

        <p className="text-lg text-[#6B7280] leading-relaxed mb-10 max-w-lg">
          Curated supply chain and ERP news, delivered with context. Coming soon.
        </p>

        <Link
          href="/learn"
          className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-150 text-base"
        >
          Browse Modules →
        </Link>
      </div>
    </div>
  );
}
