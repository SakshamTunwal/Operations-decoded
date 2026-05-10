"use client";

import Link from "next/link";
import { useEffect } from "react";

const modules = [
  {
    number: 1,
    slug: "procure-to-pay",
    emoji: "🏭",
    title: "The Titanium Dioxide Problem — Procure-to-Pay",
    description:
      "Follow Marcus, Diana and Leon through the full P2P cycle at Nexara Industrial Coatings.",
    difficulty: "Beginner" as const,
  },
  {
    number: 2,
    slug: "vendor-comparison",
    emoji: "🌴",
    title: "The Palm Oil Problem — Vendor Comparison",
    description:
      "Help Sarah Chen score three vendors using a structured RFQ and decision matrix.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 3,
    slug: "grn-three-way-match",
    emoji: "📦",
    title: "Twelve Wrong Laptops — GRN & 3-Way Match",
    description:
      "Neil Kapoor's delivery is wrong. Work through the GRN, dispute, and 3-way match.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 4,
    slug: "incoterms-dock",
    emoji: "🚢",
    title: "Four Days on the Dock — Incoterms & Trade",
    description:
      "Elena Vasquez navigates Incoterms, FOB, port handoffs, and customs clearance.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 5,
    slug: "emergency-po",
    emoji: "🚨",
    title: "Friday at Four-Thirty — Emergency Procurement",
    description:
      "Ryan Torres gets a critical call. 7 steps through emergency PO justification and audit trail.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 6,
    slug: "order-to-cash",
    emoji: "🔄",
    title: "The Other Side of the Table — Order-to-Cash",
    description:
      "Nina Rao works the seller side: sales order, ATP, dispatch, invoice, AR aging.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 7,
    slug: "inventory-management",
    emoji: "📊",
    title: "Counting What Counts — Inventory Management",
    description:
      "Zara Okafor tackles a stockout, overstock, ROP formula, and ABC analysis.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 8,
    slug: "demand-planning",
    emoji: "📈",
    title: "The Number Everyone Argues About — Demand Planning",
    description:
      "Tom Kessler builds a demand forecast through seasonality, MAPE, and S&OP.",
    difficulty: "Advanced" as const,
  },
  {
    number: 9,
    slug: "concrete-floors",
    emoji: "🏭",
    title: "Concrete Floors — Warehouse Operations",
    description:
      "Andre Osei optimises a warehouse for a flash sale: ABC slotting, zone picking, WMS accuracy.",
    difficulty: "Intermediate" as const,
  },
  {
    number: 10,
    slug: "last-mile",
    emoji: "🚛",
    title: "The Last Mile — Logistics & Delivery",
    description:
      "Maya Chatterjee inherits delivery chaos — broken tiles, blocked revenue, and 87 days to fix everything.",
    difficulty: "Intermediate" as const,
  },
];

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

function difficultyBadge(difficulty: Difficulty) {
  const styles: Record<Difficulty, string> = {
    Beginner:
      "bg-green-50 text-green-700 border border-green-200",
    Intermediate:
      "bg-[#FEF3C7] text-[#92400E] border border-[#f59e0b]/30",
    Advanced:
      "bg-red-50 text-red-700 border border-red-200",
  };
  return styles[difficulty];
}

export default function LearnIndexPage() {
  useEffect(() => {
    document.title = "All Modules — Operations Decoded";
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

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="mb-2">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#f59e0b] mb-4">
            Curriculum
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          All Modules
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl">
          9 interactive modules. Pick where you want to start.
        </p>
      </div>

      {/* Module grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <div
              key={mod.slug}
              className="bg-white border border-[#E8E4DD] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-[#f59e0b]/40 transition-all duration-200"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{mod.emoji}</span>
                  <span
                    className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-syne),sans-serif" }}
                  >
                    Module {mod.number}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${difficultyBadge(mod.difficulty)}`}
                >
                  {mod.difficulty}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-[#1A1A1A] font-bold text-base leading-snug"
                style={{ fontFamily: "var(--font-syne),sans-serif" }}
              >
                {mod.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1">
                {mod.description}
              </p>

              {/* CTA */}
              <Link
                href={`/learn/${mod.slug}`}
                className="mt-auto inline-flex items-center justify-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150"
              >
                Start Module →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
