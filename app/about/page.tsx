"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About — Operations Decoded";
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#f59e0b] mb-6">
          About
        </span>

        <h1
          className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-8 leading-tight"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          About Operations Decoded
        </h1>

        <div className="space-y-5 mb-10">
          <p className="text-lg text-[#4B5563] leading-relaxed">
            Operations Decoded is an interactive learning platform built for
            supply chain professionals, operations managers, procurement teams,
            and industrial SME owners who want to understand how operations
            actually work — not how textbooks say they work.
          </p>

          <p className="text-lg text-[#4B5563] leading-relaxed">
            We build scenario-based modules that put you inside the operational
            problem. You make the decisions. You see the consequences. You leave
            with knowledge that sticks.
          </p>
        </div>

        {/* Mission box */}
        <div className="bg-[#FEF3C7] border border-[#f59e0b]/30 rounded-2xl px-6 py-5 mb-10">
          <p
            className="text-[#92400E] font-semibold text-base"
            style={{ fontFamily: "var(--font-syne),sans-serif" }}
          >
            Our mission: make operations knowledge accessible, practical, and
            free to start.
          </p>
        </div>

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
