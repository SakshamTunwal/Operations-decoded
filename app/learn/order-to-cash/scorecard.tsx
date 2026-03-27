"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import type { GameState } from "./types";
import { STEPS, QUALITY_CHOICES } from "./constants";

interface ScorecardProps {
  gs: GameState;
  onRestart: () => void;
}

function calcScore(gs: GameState) {
  const salesOrderPts = gs.salesOrderBuilt ? 15 : 0;

  const atpPts =
    gs.atpScore === 3 ? 15 :
    gs.atpScore === 2 ? 10 :
    gs.atpScore === 1 ? 5 : 0;

  const ackPts = gs.acknowledgementCorrect ? 15 : 0;

  const qualityPts =
    gs.qualityDecision === "pull-and-notify" ? 20 :
    gs.qualityDecision === "delay-batch" ? 5 : 0;

  const invoicePts =
    gs.invoiceScore === 5 ? 15 :
    gs.invoiceScore >= 3 ? 8 :
    gs.invoiceScore >= 1 ? 4 : 0;

  const arPts =
    gs.arEscalationScore === 4 ? 10 :
    gs.arEscalationScore === 3 ? 7 :
    gs.arEscalationScore === 2 ? 4 : 0;

  const creditPts = gs.creditTermsCorrect ? 5 : 0;

  const quizPts = gs.quizScore * 5; // max 15

  const total = Math.min(100, salesOrderPts + atpPts + ackPts + qualityPts + invoicePts + arPts + creditPts + quizPts);

  return { salesOrderPts, atpPts, ackPts, qualityPts, invoicePts, arPts, creditPts, quizPts, total };
}

function getRating(total: number): { label: string; color: string; stars: number } {
  if (total >= 88) return { label: "O2C Professional",   color: "text-[#BE185D]",  stars: 5 };
  if (total >= 72) return { label: "Sell-Side Ready",    color: "text-[#065F46]",  stars: 4 };
  if (total >= 55) return { label: "Developing",         color: "text-[#6D28D9]",  stars: 3 };
  return              { label: "Buy-Side Mindset",       color: "text-[#6B7280]",  stars: 2 };
}

interface BreakdownRowProps {
  label: string;
  pts: number;
  max: number;
  delay: number;
}

function BreakdownRow({ label, pts, max, delay }: BreakdownRowProps) {
  const pct    = max > 0 ? (pts / max) * 100 : 0;
  const isGood = pct >= 80;
  const isMid  = pct >= 50;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#4B5563]">{label}</span>
        <span className={`font-bold ${isGood ? "text-green-600" : isMid ? "text-amber-600" : "text-red-500"}`}>
          {pts}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-[#E8E4DD] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${isGood ? "bg-green-400" : isMid ? "bg-[#BE185D]" : "bg-red-400"}`}
        />
      </div>
    </div>
  );
}

// ─── Character row ─────────────────────────────────────────────────────────────

function CharacterRow() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Nina */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#FCE7F3" />
          <ellipse cx="18" cy="10" rx="9" ry="7" fill="#1C1917" />
          <rect x="9" y="10" width="18" height="4" fill="#1C1917" />
          <rect x="9" y="14" width="3" height="8" rx="2" fill="#1C1917" />
          <rect x="24" y="14" width="3" height="8" rx="2" fill="#1C1917" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FBBF24" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#9D174D" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#BE185D" />
          <path d="M16 30 L18 33 L20 30" fill="#F472B6" />
        </svg>
        <p className="text-[10px] font-semibold text-[#BE185D]">Nina</p>
        <p className="text-[9px] text-[#9CA3AF]">Order Manager</p>
      </div>
      {/* Carlos */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#FEF3C7" />
          <ellipse cx="18" cy="10" rx="9" ry="7" fill="#7C2D12" />
          <rect x="9" y="10" width="18" height="3" fill="#7C2D12" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FBBF24" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <path d="M15 24.5 Q18 27 21 24.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#D97706" />
          <path d="M17 30 L18 35 L19 30" fill="#F59E0B" />
        </svg>
        <p className="text-[10px] font-semibold text-[#D97706]">Carlos</p>
        <p className="text-[9px] text-[#9CA3AF]">Sales</p>
      </div>
      {/* Sam */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#DBEAFE" />
          <ellipse cx="18" cy="10" rx="9" ry="6.5" fill="#1C1917" />
          <rect x="9" y="10" width="18" height="3" fill="#1C1917" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#92400E" />
          <rect x="11" y="17" width="5" height="4" rx="1.5" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <rect x="20" y="17" width="5" height="4" rx="1.5" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="16" y1="19" x2="20" y2="19" stroke="#1C1917" strokeWidth="1" />
          <ellipse cx="13.5" cy="19" rx="1" ry="1.1" fill="#1C1917" />
          <ellipse cx="22.5" cy="19" rx="1" ry="1.1" fill="#1C1917" />
          <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#7C2D12" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#1D4ED8" />
        </svg>
        <p className="text-[10px] font-semibold text-[#1D4ED8]">Sam</p>
        <p className="text-[9px] text-[#9CA3AF]">Production</p>
      </div>
      {/* Leo */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#D1FAE5" />
          <ellipse cx="18" cy="11" rx="9" ry="7" fill="#292524" />
          <rect x="9" y="11" width="18" height="3" fill="#292524" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#D97706" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#92400E" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#065F46" />
          <path d="M12 34 L24 34" stroke="#FCD34D" strokeWidth="1.5" opacity="0.8" />
        </svg>
        <p className="text-[10px] font-semibold text-[#065F46]">Leo</p>
        <p className="text-[9px] text-[#9CA3AF]">Warehouse</p>
      </div>
      {/* Grace */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#EDE9FE" />
          <ellipse cx="18" cy="10" rx="9" ry="6.5" fill="#1C1917" />
          <rect x="9" y="10" width="18" height="3" fill="#1C1917" />
          <circle cx="26" cy="9" r="3.5" fill="#1C1917" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#7C3D12" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <path d="M15.5 24.5 Q18 26 20.5 24.5" stroke="#7C2D12" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#6D28D9" />
          <path d="M16.5 30 L18 34 L19.5 30" fill="#8B5CF6" />
        </svg>
        <p className="text-[10px] font-semibold text-[#6D28D9]">Grace</p>
        <p className="text-[9px] text-[#9CA3AF]">Finance / AR</p>
      </div>
    </div>
  );
}

// ─── Journey timeline ──────────────────────────────────────────────────────────

function JourneyTimeline() {
  return (
    <div className="flex flex-col gap-2">
      {STEPS.map((step) => (
        <div key={step.num} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#BE185D] flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
            {step.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#1A1A1A] truncate">{step.label}</p>
              <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{step.time}</span>
            </div>
            <p className="text-[10px] text-[#9CA3AF] truncate">{step.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DynamicScorecard ──────────────────────────────────────────────────────────

export function DynamicScorecard({ gs, onRestart }: ScorecardProps) {
  const { salesOrderPts, atpPts, ackPts, qualityPts, invoicePts, arPts, creditPts, quizPts, total } = calcScore(gs);
  const rating = getRating(total);

  const qualityLabel = QUALITY_CHOICES.find((c) => c.id === gs.qualityDecision)?.label ?? "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto flex flex-col gap-6 py-8 px-4"
    >
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <div className="flex justify-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={20}
              className={s <= rating.stars ? "text-[#BE185D] fill-[#BE185D]" : "text-[#E8E4DD]"}
            />
          ))}
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A]">
          {total}<span className="text-lg font-semibold text-[#9CA3AF]">/100</span>
        </h2>
        <p className={`text-sm font-bold ${rating.color}`}>{rating.label}</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Try different choices to improve your score</p>
      </div>

      {/* Character row */}
      <CharacterRow />

      {/* Score breakdown */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Score Breakdown</p>
        <BreakdownRow label="Sales order built"        pts={salesOrderPts} max={15} delay={0.1} />
        <BreakdownRow label="ATP check (3 batches)"   pts={atpPts}        max={15} delay={0.2} />
        <BreakdownRow label="Order acknowledgement"   pts={ackPts}        max={15} delay={0.3} />
        <BreakdownRow label="Quality decision"        pts={qualityPts}    max={20} delay={0.4} />
        <BreakdownRow label="Invoice accuracy"        pts={invoicePts}    max={15} delay={0.5} />
        <BreakdownRow label="AR escalation ladder"    pts={arPts}         max={10} delay={0.6} />
        <BreakdownRow label="Credit terms"            pts={creditPts}     max={5}  delay={0.7} />
        <BreakdownRow label="Quiz"                    pts={Math.min(quizPts, 15)} max={15} delay={0.8} />
      </div>

      {/* Stats panel */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Your Decisions</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Sales Order</p>
            <p className={`text-xs font-bold mt-0.5 ${gs.salesOrderBuilt ? "text-green-600" : "text-[#9CA3AF]"}`}>
              {gs.salesOrderBuilt ? "Built ✓" : "Not built"}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">ATP Score</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{gs.atpScore}/3 correct</p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Quality Decision</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5 leading-tight" style={{ fontSize: "9px" }}>
              {gs.qualityDecision ? qualityLabel.slice(0, 40) + (qualityLabel.length > 40 ? "…" : "") : "—"}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Invoice Score</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{gs.invoiceScore}/5 fields</p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">AR Escalation</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{gs.arEscalationScore}/4 correct</p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Quiz Score</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{gs.quizScore}/3 correct</p>
          </div>
        </div>
      </div>

      {/* Journey timeline */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">The O2C Journey</p>
        <JourneyTimeline />
      </div>

      {/* Closing quote */}
      <div className="bg-[#FCE7F3] border border-[#BE185D]/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-[#BE185D] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#BE185D]">Nina Rao — End of Module</p>
            <p className="text-sm text-[#9D174D] mt-1.5 leading-relaxed italic">
              &ldquo;Every PO someone sends you is someone else&apos;s Sales Order. Now you know both sides.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <button
          suppressHydrationWarning
          onClick={onRestart}
          className="px-6 py-3 border-2 border-[#E8E4DD] text-[#6B7280] text-sm font-semibold rounded-xl cursor-pointer hover:border-[#BE185D] hover:text-[#BE185D] transition-colors"
        >
          Try Again
        </button>
        <a
          href="/learn/inventory-management"
          className="px-6 py-3 bg-[#10B981] text-white text-sm font-bold rounded-xl hover:bg-[#059669] transition-colors"
        >
          Next Module →
        </a>
      </div>
    </motion.div>
  );
}
