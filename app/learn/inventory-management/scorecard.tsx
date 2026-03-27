"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { STEPS, SIGNIFICANT_SKUS, ABC_SKUS } from "./constants";
import type { GameState } from "./types";
import { ZaraAvatar, KwameAvatar, IsabelleAvatar, MargaretAvatar } from "./characters";

function fmt(n: number) { return n.toLocaleString(); }

function calcScore(gs: GameState): { score: number; grade: string; color: string; breakdown: { label: string; pts: number; max: number; detail: string }[] } {
  let s = 0;

  // Audit: flagged all 3 significant SKUs = 20
  const correctFlags = gs.auditFlagged.filter((f) => SIGNIFICANT_SKUS.includes(f)).length;
  const falsePos = gs.auditFlagged.filter((f) => !SIGNIFICANT_SKUS.includes(f)).length;
  const auditPts = Math.max(0, Math.round((correctFlags / SIGNIFICANT_SKUS.length) * 20) - falsePos * 3);
  s += auditPts;

  // Stockout understood = 15
  const stockoutPts = gs.stockoutUnderstood ? 15 : 0;
  s += stockoutPts;

  // Carrying cost calculated = 15
  const carryingPts = gs.carryingCostCalculated ? 15 : 0;
  s += carryingPts;

  // ROP built = 20
  const ropPts = gs.ropBuilt ? 20 : 0;
  s += ropPts;

  // ABC analysis: correct SKUs / total * 20
  const abcCorrect = ABC_SKUS.filter((sk) => gs.abcAnswers[sk.sku] === sk.correct).length;
  const abcPts = Math.round((abcCorrect / ABC_SKUS.length) * 20);
  s += abcPts;

  // Quiz: 3 questions × ~3.33 pts, capped at 10
  const quizPts = Math.min(10, Math.round(gs.quizScore * (10 / 3)));
  s += quizPts;

  const capped = Math.min(s, 100);

  const breakdown = [
    { label: "Audit Accuracy",     pts: auditPts,    max: 20, detail: `${correctFlags}/${SIGNIFICANT_SKUS.length} significant discrepancies flagged` },
    { label: "Stockout Analysis",  pts: stockoutPts, max: 15, detail: gs.stockoutUnderstood ? "Full impact analysed" : "Not completed" },
    { label: "Carrying Cost",      pts: carryingPts, max: 15, detail: gs.carryingCostCalculated ? "WH-5100 carrying cost calculated" : "Not completed" },
    { label: "ROP Formula",        pts: ropPts,      max: 20, detail: gs.ropBuilt ? "AP-7200 reorder point built correctly" : "Not completed" },
    { label: "ABC Classification", pts: abcPts,      max: 20, detail: `${abcCorrect}/${ABC_SKUS.length} SKUs correctly classified` },
    { label: "Quiz Score",         pts: quizPts,     max: 10, detail: `${gs.quizScore}/3 correct` },
  ];

  if (capped >= 88) return { score: capped, grade: "Inventory Expert",     color: "text-[#10B981]", breakdown };
  if (capped >= 72) return { score: capped, grade: "Operations Practitioner", color: "text-[#3B82F6]", breakdown };
  if (capped >= 55) return { score: capped, grade: "On the Right Track",   color: "text-[#D97706]", breakdown };
  return                { score: capped, grade: "Learning the Ropes",    color: "text-red-500",   breakdown };
}

export function DynamicScorecard({
  gameState,
  onRestart,
}: {
  gameState: GameState;
  onRestart: () => void;
}) {
  const gs = gameState;
  const { score, grade, color, breakdown } = calcScore(gs);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => requestAnimationFrame(tick), 600);
    return () => clearTimeout(delay);
  }, [score]);

  return (
    <div className="flex flex-col gap-6">
      {/* Confetti */}
      <div className="relative h-24 mb-2 overflow-hidden pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => {
          const colors = ["#10B981", "#059669", "#3B82F6", "#F59E0B", "#7C3AED", "#1A1A1A"];
          const shapes = ["rounded-sm", "rounded-full", ""];
          const w = i % 3 === 2 ? "w-1 h-3" : "w-2 h-2";
          return (
            <motion.div
              key={i}
              initial={{ y: -8, opacity: 1, rotate: 0 }}
              animate={{ y: 130, x: [(i % 5 - 2) * 8, (i % 3 - 1) * 12, 0], opacity: [1, 1, 0], rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ delay: i * 0.028, duration: 1.2 + (i % 5) * 0.18, ease: "easeIn" }}
              className={`absolute ${w} ${shapes[i % 3]}`}
              style={{ backgroundColor: colors[i % colors.length], left: `${(i / 48) * 100}%` }}
            />
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 12, delay: 0.25 }}
            className="w-16 h-16 rounded-full bg-[#D1FAE5] border-4 border-[#10B981] flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">📊</span>
          </motion.div>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Inventory Under Control.
        </motion.h2>
        <p className="text-[#6B7280] text-sm">
          You guided Zara through a broken warehouse to a working inventory system — audit, analysis, and all.
        </p>
      </div>

      {/* Character row */}
      <div className="flex items-end justify-center gap-6">
        {[
          { Av: ZaraAvatar,     name: "Zara",     title: "Inventory Manager"   },
          { Av: KwameAvatar,    name: "Kwame",    title: "Warehouse Supervisor" },
          { Av: IsabelleAvatar, name: "Isabelle", title: "Demand Planning"      },
          { Av: MargaretAvatar, name: "Margaret", title: "CFO"                  },
        ].map(({ Av, name, title }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-xl overflow-hidden border-2 border-[#10B981] shadow-sm">
              <Av size={52} />
            </div>
            <p className="text-xs font-semibold text-[#1A1A1A]">{name}</p>
            <p className="text-[9px] text-[#9CA3AF]">{title}</p>
          </motion.div>
        ))}
      </div>

      {/* Journey timeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start min-w-max mx-auto gap-0 justify-center">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-start">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 250 }}
                  className="w-10 h-10 rounded-full bg-[#10B981] border-2 border-[#065F46] flex items-center justify-center shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <p className="text-[8px] font-bold text-[#10B981]">{s.icon}</p>
                <p className="text-[7px] text-[#9CA3AF] text-center" style={{ maxWidth: 58 }}>{s.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.65 + i * 0.08 }}
                  className="w-6 h-0.5 bg-[#10B981] mt-5 origin-left flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">What You Fixed</p>
          {[
            { label: "SKUs audited",               val: "8 (sample of 340)",   good: true  },
            { label: "AP-7200 gap identified",      val: "−53 units",           good: false },
            { label: "WH-5100 overstock capital",   val: `$${fmt(156000)}`,     good: false },
            { label: "Reorder point established",   val: "210 units",           good: true  },
            { label: "Inventory turn improvement",  val: "4.2× → 5.1×",        good: true  },
            { label: "Bullwhip cost (18 months)",   val: "~$60,000",            good: false },
          ].map(({ label, val, good }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
              <p className="text-xs text-[#4B5563]">{label}</p>
              <p className={`text-xs font-bold ${good ? "text-[#10B981]" : "text-red-600"}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center gap-4">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Inventory Score</p>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 18 }}
            className="relative"
          >
            <svg width="130" height="130" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#E8E4DD" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke={score >= 88 ? "#10B981" : score >= 72 ? "#3B82F6" : score >= 55 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - score / 100) }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1A1A1A" fontFamily="sans-serif">{displayScore}</text>
              <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="sans-serif">out of 100</text>
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 400, damping: 14 }}
            className={`text-xl font-black ${color}`}
            style={{ fontFamily: "var(--font-syne),sans-serif" }}
          >
            {grade}
          </motion.p>
          <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
            Based on audit accuracy, formula building, ABC classification, and quiz performance.
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-[#E8E4DD] bg-[#FAFAF7]">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Score Breakdown</p>
        </div>
        <div className="divide-y divide-[#E8E4DD]">
          {breakdown.map((item, i) => {
            const pct = Math.round((item.pts / item.max) * 100);
            const barColor = pct >= 85 ? "bg-[#10B981]" : pct >= 60 ? "bg-[#f59e0b]" : "bg-red-400";
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0 + i * 0.08 }}
                className="px-5 py-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-[#1A1A1A]">{item.label}</p>
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    {item.pts}<span className="text-[#9CA3AF] font-normal">/{item.max}</span>
                  </p>
                </div>
                <div className="h-1.5 bg-[#F3EFE8] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 2.2 + i * 0.08, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Closing quote */}
      <div className="border-l-4 border-[#10B981] bg-[#F0FDF4] rounded-r-2xl p-5">
        <p className="text-[#4B5563] text-sm italic leading-relaxed">
          &quot;The inventory wasn&apos;t perfect. It wouldn&apos;t be perfect next month either. But it was counted, categorised, controlled, and improving. In inventory management, that&apos;s the whole job.&quot;
        </p>
        <p className="text-[10px] text-[#9CA3AF] mt-2">— Zara Okafor, Inventory Manager</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          suppressHydrationWarning
          onClick={onRestart}
          className="px-6 py-3 border-2 border-[#E8E4DD] text-[#6B7280] text-sm font-semibold rounded-xl cursor-pointer hover:border-[#10B981] hover:text-[#10B981] transition-colors"
        >
          Try Again ↺
        </button>
        <a
          href="/learn/demand-planning"
          className="px-6 py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl hover:bg-[#2563EB] transition-colors"
        >
          Next Module →
        </a>
      </div>
    </div>
  );
}
