"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import type { GameState } from "./types";
import { STEPS } from "./constants";

interface ScorecardProps {
  gs: GameState;
  onRestart: () => void;
}

function calcScore(gs: GameState) {
  // 1. Procurement decision — 25 pts
  const decisionPts = gs.procurementDecision === "emergency-po" ? 25 : 0;

  // 2. Emergency classification — 15 pts
  const classificationPts = gs.emergencyClassification === "genuine" ? 15 : 0;

  // 3. Justification score — max 20 pts
  const justificationPts = Math.round((gs.justificationScore / 4) * 20);

  // 4. Receipt score — max 15 pts
  const receiptPts = Math.round((gs.receiptScore / 3) * 15);

  // 5. Audit complete — 15 pts
  const auditPts = gs.auditComplete ? 15 : 0;

  // 6. Quiz — max ~10 pts
  const quizPts = Math.floor((gs.quizScore * 10) / 3);

  const total = Math.min(100, decisionPts + classificationPts + justificationPts + receiptPts + auditPts + quizPts);
  return { decisionPts, classificationPts, justificationPts, receiptPts, auditPts, quizPts, total };
}

function getRating(total: number): { label: string; color: string; stars: number } {
  if (total >= 88) return { label: "Procurement Professional", color: "text-[#D97706]",  stars: 5 };
  if (total >= 72) return { label: "Controls-Aware",           color: "text-[#0F766E]",  stars: 4 };
  if (total >= 55) return { label: "Developing",               color: "text-[#7C3AED]",  stars: 3 };
  return              { label: "Process Gap",                  color: "text-[#6B7280]",  stars: 2 };
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
          className={`h-full rounded-full ${isGood ? "bg-green-400" : isMid ? "bg-[#f59e0b]" : "bg-red-400"}`}
        />
      </div>
    </div>
  );
}

// ─── Avatar row ────────────────────────────────────────────────────────────────

function CharacterRow() {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Ryan */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#FEF3C7" />
          <ellipse cx="18" cy="11" rx="9" ry="7" fill="#292524" />
          <rect x="9" y="11" width="18" height="3" fill="#292524" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FBBF24" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
          <path d="M15 24.5 Q18 27 21 24.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#D97706" />
          <path d="M17 30 L18 35 L19 30" fill="#F59E0B" />
        </svg>
        <p className="text-[10px] font-semibold text-[#D97706]">Ryan</p>
        <p className="text-[9px] text-[#9CA3AF]">Procurement Officer</p>
      </div>
      {/* Victor */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#E2E8F0" />
          <ellipse cx="18" cy="10" rx="9" ry="7" fill="#94A3B8" />
          <rect x="9" y="10" width="18" height="4" fill="#94A3B8" />
          <rect x="9" y="14" width="3" height="6" rx="1.5" fill="#94A3B8" />
          <rect x="24" y="14" width="3" height="6" rx="1.5" fill="#94A3B8" />
          <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FDE68A" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#334155" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#334155" />
          <path d="M15.5 24.5 Q18 26 20.5 24.5" stroke="#78350F" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M10 36 Q13 30 18 30 Q23 30 26 36" fill="#1E3A5F" />
          <path d="M16.5 30 L18 35 L19.5 30" fill="#475569" />
        </svg>
        <p className="text-[10px] font-semibold text-[#1E3A5F]">Victor</p>
        <p className="text-[9px] text-[#9CA3AF]">Procurement Head</p>
      </div>
      {/* Helen */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="18" fill="#D1FAE5" />
          <ellipse cx="18" cy="11" rx="9" ry="7" fill="#9A3412" />
          <ellipse cx="18" cy="13" rx="7.5" ry="5" fill="#B45309" />
          <rect x="9" y="13" width="3" height="10" rx="2" fill="#9A3412" />
          <rect x="24" y="13" width="3" height="10" rx="2" fill="#9A3412" />
          <ellipse cx="18" cy="20" rx="7" ry="7.5" fill="#FBBF24" />
          <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
          <path d="M15 24.5 Q18 26.5 21 24.5" stroke="#92400E" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M11 36 Q14 31 18 31 Q22 31 25 36" fill="#059669" />
        </svg>
        <p className="text-[10px] font-semibold text-[#059669]">Helen</p>
        <p className="text-[9px] text-[#9CA3AF]">Plant Manager</p>
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
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
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
  const { decisionPts, classificationPts, justificationPts, receiptPts, auditPts, quizPts, total } = calcScore(gs);
  const rating = getRating(total);

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
              className={s <= rating.stars ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#E8E4DD]"}
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
        <BreakdownRow label="Procurement decision"      pts={decisionPts}       max={25} delay={0.1} />
        <BreakdownRow label="Emergency classification"  pts={classificationPts} max={15} delay={0.2} />
        <BreakdownRow label="Justification quality"     pts={justificationPts}  max={20} delay={0.3} />
        <BreakdownRow label="Receipt verification"      pts={receiptPts}        max={15} delay={0.4} />
        <BreakdownRow label="Audit documentation"       pts={auditPts}          max={15} delay={0.5} />
        <BreakdownRow label="Quiz"                      pts={quizPts}           max={10} delay={0.6} />
      </div>

      {/* Stats panel */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Your Decisions</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Procurement Choice</p>
            <p className="text-xs font-bold text-[#1A1A1A] capitalize mt-0.5">
              {gs.procurementDecision
                ? gs.procurementDecision.replace("-", " ")
                : "—"}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Classification</p>
            <p className="text-xs font-bold text-[#1A1A1A] capitalize mt-0.5">
              {gs.emergencyClassification || "—"}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Justification</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
              {gs.justificationScore}/4 fields
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Audit Complete</p>
            <p className={`text-xs font-bold mt-0.5 ${gs.auditComplete ? "text-green-600" : "text-[#9CA3AF]"}`}>
              {gs.auditComplete ? "Yes ✓" : "No"}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
            <p className="text-[10px] text-[#9CA3AF]">Quiz Score</p>
            <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{gs.quizScore}/3 correct</p>
          </div>
        </div>
      </div>

      {/* Journey timeline */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Friday&apos;s Timeline</p>
        <JourneyTimeline />
      </div>

      {/* Closing quote */}
      <div className="bg-[#E2E8F0] border border-[#CBD5E1] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-[#1E3A5F] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#1E3A5F]">Victor Laine — Tuesday Debrief</p>
            <p className="text-sm text-[#334155] mt-1.5 leading-relaxed italic">
              &ldquo;That&apos;s why we don&apos;t skip the PO. Not because we think our people are dishonest. Because the PO is the control that makes it irrelevant whether they are or not.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <button
          suppressHydrationWarning
          onClick={onRestart}
          className="px-6 py-3 border-2 border-[#E8E4DD] text-[#6B7280] text-sm font-semibold rounded-xl cursor-pointer hover:border-[#D97706] hover:text-[#D97706] transition-colors"
        >
          Try Again
        </button>
        <a
          href="/learn/order-to-cash"
          className="px-6 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors"
        >
          Next Module →
        </a>
      </div>
    </motion.div>
  );
}
