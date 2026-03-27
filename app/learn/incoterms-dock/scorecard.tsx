"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import type { GameState } from "./types";
import { CORRECT_MATRIX, MATRIX_STAGES, MATRIX_INCOTERMS, FOB_STAGES, CUSTOMS_DOCUMENTS, fmt } from "./constants";

interface ScorecardProps {
  gs: GameState;
  onRestart: () => void;
}

function calcScore(gs: GameState) {
  // 1. Incoterm choice — 25 pts
  const incotermPts = gs.chosenIncoterm === "FOB" ? 25 : gs.chosenIncoterm === "CIF" ? 10 : 5;

  // 2. FOB Responsibility mapping — 20 pts
  const correctResponsibility = FOB_STAGES.filter(
    (s) => gs.responsibilityMap[s.id] === s.correctAnswer
  ).length;
  const responsibilityPts = Math.round((correctResponsibility / FOB_STAGES.length) * 20);

  // 3. Documents — 20 pts: 15 for all required, +5 if tech spec included
  const requiredDocs    = CUSTOMS_DOCUMENTS.filter((d) => d.required).map((d) => d.id);
  const allRequired     = requiredDocs.every((id) => gs.documentsChecked.includes(id));
  const hasSpec         = gs.documentsChecked.includes("techspec");
  const documentsPts    = allRequired ? (hasSpec ? 20 : 15) : Math.round(
    (gs.documentsChecked.filter((id) => requiredDocs.includes(id)).length / requiredDocs.length) * 15
  );

  // 4. Matrix accuracy — 25 pts
  const totalCells    = MATRIX_STAGES.length * MATRIX_INCOTERMS.length;
  const correctCells  = Object.entries(CORRECT_MATRIX).filter(([k, v]) => gs.matrixAnswers[k] === v).length;
  const matrixPts     = Math.round((correctCells / totalCells) * 25);

  // 5. Quiz — 10 pts (gs.quizScore is out of 3)
  const quizPts = Math.round((gs.quizScore / 3) * 10);

  const total = incotermPts + responsibilityPts + documentsPts + matrixPts + quizPts;
  return { incotermPts, responsibilityPts, documentsPts, matrixPts, quizPts, total };
}

function getRating(total: number): { label: string; color: string; stars: number } {
  if (total >= 90) return { label: "Trade Operations Expert",    color: "text-[#D97706]",  stars: 5 };
  if (total >= 75) return { label: "Incoterms Practitioner",     color: "text-[#0F766E]",  stars: 4 };
  if (total >= 60) return { label: "International Buyer",        color: "text-[#7C3AED]",  stars: 3 };
  return              { label: "Learning the Ropes",             color: "text-[#6B7280]",  stars: 2 };
}

interface BreakdownRowProps {
  label: string;
  pts: number;
  max: number;
  delay: number;
}

function BreakdownRow({ label, pts, max, delay }: BreakdownRowProps) {
  const pct = max > 0 ? (pts / max) * 100 : 0;
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

export function DynamicScorecard({ gs, onRestart }: ScorecardProps) {
  const { incotermPts, responsibilityPts, documentsPts, matrixPts, quizPts, total } = calcScore(gs);
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
        <h2 className="text-3xl font-black text-[#1A1A1A]">{total}<span className="text-lg font-semibold text-[#9CA3AF]">/100</span></h2>
        <p className={`text-sm font-bold ${rating.color}`}>{rating.label}</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Try different choices to improve your score</p>
      </div>

      {/* Score breakdown */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Score Breakdown</p>
        <BreakdownRow label="Incoterm selection"          pts={incotermPts}      max={25} delay={0.1} />
        <BreakdownRow label="FOB responsibility mapping"  pts={responsibilityPts} max={20} delay={0.2} />
        <BreakdownRow label="Customs documents"           pts={documentsPts}     max={20} delay={0.3} />
        <BreakdownRow label="Incoterms matrix accuracy"   pts={matrixPts}        max={25} delay={0.4} />
        <BreakdownRow label="Quiz"                        pts={quizPts}          max={10} delay={0.5} />
      </div>

      {/* Key lesson */}
      <div className="bg-[#FEF3C7] border border-[#f59e0b]/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#92400E]">The real lesson from four days on the dock</p>
            <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
              Elena chose FOB correctly. The failure wasn't in selecting the wrong Incoterm — it was in understanding a term in principle without operationalising every obligation within it.
              Three letters on a contract are a definition. A name on every line of the responsibility matrix is an operation.
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
          href="/learn/emergency-po"
          className="px-6 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors"
        >
          Next Module →
        </a>
      </div>
    </motion.div>
  );
}
