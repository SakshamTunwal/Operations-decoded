"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { STEPS, fmt } from "./constants";
import type { GameState } from "./types";
import { NeilAvatar, ClaraAvatar, OttoAvatar } from "./characters";

function ScoreRow({
  label,
  value,
  subtext,
  color = "text-[#1A1A1A]",
  delay = 0,
}: {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center justify-between py-2.5 border-b border-[#E8E4DD] last:border-0"
    >
      <div>
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</p>
        {subtext && <p className="text-[10px] text-[#9CA3AF] mt-0.5">{subtext}</p>}
      </div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}

function calcScore(gs: GameState): { score: number; grade: string; color: string } {
  let s = 0;
  // PO config accuracy: correct config = 25
  if (gs.poConfigCode === "CT-T14-i7-16-512-W11P") s += 25;
  // Special instruction: +15
  if (gs.addedSpecialInstruction) s += 15;
  // GRN accuracy: correct 138/12 = 20
  if (gs.grnAccepted === 138 && gs.grnRejected === 12) s += 20;
  else if (gs.grnAccepted > 0) s += 5;
  // Dispute choice
  if (gs.disputeChoice === "factual")    s += 20;
  else if (gs.disputeChoice === "passive")    s += 10;
  else if (gs.disputeChoice === "aggressive") s += 5;
  // Invoice held: +10
  if (gs.invoiceHeld) s += 10;
  // Quiz: 3 × 4 = 12
  s += gs.quizScore * 4;

  const capped = Math.min(s, 100);
  if (capped >= 85) return { score: capped, grade: "Expert",          color: "text-green-600" };
  if (capped >= 65) return { score: capped, grade: "Competent",       color: "text-[#D97706]" };
  return                { score: capped, grade: "Needs Practice",  color: "text-red-500" };
}

function ScoreBreakdown({ gs }: { gs: GameState }) {
  const disputeLabel =
    gs.disputeChoice === "factual"
      ? "Facts-first — optimal"
      : gs.disputeChoice === "passive"
      ? "Passive — delayed resolution"
      : gs.disputeChoice === "aggressive"
      ? "Aggressive — counterproductive"
      : "Not attempted";

  const items = [
    {
      label: "PO Config Code",
      pts: gs.poConfigCode === "CT-T14-i7-16-512-W11P" ? 25 : 0,
      max: 25,
      detail: gs.poConfigCode === "CT-T14-i7-16-512-W11P" ? "Correct specification selected" : "Wrong or missing configuration",
    },
    {
      label: "Special Instruction",
      pts: gs.addedSpecialInstruction ? 15 : 0,
      max: 15,
      detail: gs.addedSpecialInstruction ? "Enforcement clause added" : "No enforcement clause",
    },
    {
      label: "GRN Accuracy",
      pts: gs.grnAccepted === 138 && gs.grnRejected === 12 ? 20 : gs.grnAccepted > 0 ? 5 : 0,
      max: 20,
      detail: `${gs.grnAccepted} accepted / ${gs.grnRejected} rejected`,
    },
    {
      label: "Dispute Handling",
      pts: gs.disputeChoice === "factual" ? 20 : gs.disputeChoice === "passive" ? 10 : gs.disputeChoice === "aggressive" ? 5 : 0,
      max: 20,
      detail: disputeLabel,
    },
    {
      label: "Invoice Control",
      pts: gs.invoiceHeld ? 10 : 0,
      max: 10,
      detail: gs.invoiceHeld ? "Invoice held until documentation complete" : "Invoice not held",
    },
    {
      label: "Quiz Score",
      pts: gs.quizScore * 4,
      max: 12,
      detail: `${gs.quizScore}/3 correct`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.4 }}
      className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden mb-6"
    >
      <div className="px-5 py-3 border-b border-[#E8E4DD] bg-[#FAFAF7]">
        <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Score Breakdown</p>
      </div>
      <div className="divide-y divide-[#E8E4DD]">
        {items.map((item, i) => {
          const pct = Math.round((item.pts / item.max) * 100);
          const barColor = pct >= 85 ? "bg-green-400" : pct >= 60 ? "bg-[#f59e0b]" : "bg-red-400";
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0 + i * 0.08 }}
              className="px-5 py-3 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function DynamicScorecard({
  gameState,
  onRestart,
  onGlossary,
}: {
  gameState: GameState;
  onRestart: () => void;
  onGlossary: () => void;
}) {
  const { score, grade, color } = calcScore(gameState);

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
    <div>
      {/* Confetti */}
      <div className="relative h-24 mb-4 overflow-hidden pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => {
          const colors = ["#f59e0b", "#D97706", "#1A1A1A", "#1D4ED8", "#16a34a", "#BE185D"];
          const shapes = ["rounded-sm", "rounded-full", ""];
          const w = i % 3 === 2 ? "w-1 h-3" : "w-2 h-2";
          return (
            <motion.div
              key={i}
              initial={{ y: -8, x: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: 130,
                x: [(i % 5 - 2) * 8, (i % 3 - 1) * 12, 0],
                opacity: [1, 1, 0],
                rotate: i % 2 === 0 ? 360 : -360,
              }}
              transition={{
                delay: i * 0.028,
                duration: 1.2 + (i % 5) * 0.18,
                ease: "easeIn",
              }}
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
            className="w-16 h-16 rounded-full bg-[#FEF3C7] border-4 border-[#f59e0b] flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">📦</span>
          </motion.div>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Case Closed.
        </motion.h2>
        <p className="text-[#6B7280] text-sm">
          You ran a complete GRN and 3-Way Match cycle for Hartwell &amp; Briggs&apos; laptop procurement.
        </p>
      </div>

      {/* Character row */}
      <div className="flex items-end justify-center gap-6 mb-8">
        {[
          { Av: NeilAvatar,  name: "Neil",  title: "Procurement" },
          { Av: ClaraAvatar, name: "Clara", title: "Procurement Head" },
          { Av: OttoAvatar,  name: "Otto",  title: "Warehouse" },
        ].map(({ Av, name, title }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-xl overflow-hidden border-2 border-[#f59e0b] shadow-sm">
              <Av size={56} />
            </div>
            <p className="text-xs font-semibold text-[#1A1A1A]">{name}</p>
            <p className="text-[9px] text-[#9CA3AF]">{title}</p>
          </motion.div>
        ))}
      </div>

      {/* Journey timeline */}
      <div className="overflow-x-auto pb-2 mb-8">
        <div className="flex items-start min-w-max mx-auto gap-0 justify-center">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-start">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 250 }}
                  className="w-10 h-10 rounded-full bg-[#f59e0b] border-2 border-[#D97706] flex items-center justify-center shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <p className="text-[8px] font-bold text-[#D97706]">{s.icon}</p>
                <p className="text-[7px] text-[#9CA3AF] text-center" style={{ maxWidth: 58 }}>{s.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.65 + i * 0.08 }}
                  className="w-6 h-0.5 bg-[#f59e0b] mt-5 origin-left flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stats */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Your Run</p>
          <ScoreRow
            label="Total Value Processed"
            value={`$${fmt(102750)}`}
            delay={0.1}
          />
          <ScoreRow
            label="PO Config Code"
            value={gameState.poConfigCode || "—"}
            color={gameState.poConfigCode === "CT-T14-i7-16-512-W11P" ? "text-green-600" : "text-red-500"}
            delay={0.15}
          />
          <ScoreRow
            label="GRN Accepted / Rejected"
            value={`${gameState.grnAccepted} / ${gameState.grnRejected}`}
            color={gameState.grnAccepted === 138 ? "text-green-600" : "text-[#D97706]"}
            delay={0.2}
          />
          <ScoreRow
            label="Dispute Approach"
            value={gameState.disputeChoice || "—"}
            color={gameState.disputeChoice === "factual" ? "text-green-600" : gameState.disputeChoice === "passive" ? "text-[#D97706]" : "text-red-500"}
            delay={0.25}
          />
          <ScoreRow
            label="Partial Payment Released"
            value={gameState.partialPaymentReleased ? `$${fmt(94530)}` : "Not released"}
            color={gameState.partialPaymentReleased ? "text-green-600" : "text-[#D97706]"}
            delay={0.3}
          />
          <ScoreRow label="People Involved" value="5" subtext="Neil, Clara, Otto, Stefan, Priya" delay={0.35} />
        </div>

        {/* Score card */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center gap-4">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Procurement Score</p>
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
                stroke={score >= 85 ? "#16a34a" : score >= 65 ? "#f59e0b" : "#ef4444"}
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
            {displayScore >= score && score > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-4 border-[#f59e0b] pointer-events-none"
              />
            )}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 400, damping: 14 }}
            className={`text-xl font-black ${color}`}
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            {grade}
          </motion.p>
          <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
            Based on PO accuracy, GRN quality, dispute handling, and invoice control.
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <ScoreBreakdown gs={gameState} />

      {/* Closing quote */}
      <div className="border-l-4 border-[#f59e0b] bg-[#FFFDF5] rounded-r-2xl p-5 mb-8">
        <p className="text-[#4B5563] text-sm italic leading-relaxed">
          &quot;Good procurement controls are invisible to the end customer. Hartwell &amp; Briggs never knew any of this happened. That&apos;s the point.&quot;
        </p>
        <p className="text-[10px] text-[#9CA3AF] mt-2">— Clara Mendes, Procurement Head</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onGlossary}
          suppressHydrationWarning
          className="px-6 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
        >
          Review Full Glossary
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={onRestart}
            suppressHydrationWarning
            className="px-6 py-3 border-2 border-[#E8E4DD] text-[#6B7280] text-sm font-semibold rounded-xl cursor-pointer hover:border-[#D97706] hover:text-[#D97706] transition-colors"
          >
            Try Again ↺
          </button>
          <p className="text-[10px] text-[#9CA3AF] text-center">Try different choices to change your score</p>
        </div>
        <a
          href="/learn/incoterms-dock"
          className="px-6 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors"
        >
          Next Module →
        </a>
      </div>
    </div>
  );
}
