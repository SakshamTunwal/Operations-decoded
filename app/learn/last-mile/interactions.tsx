"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  TRANSPORT_SCENARIOS,
  COST_COMPONENTS,
  SCORECARD_METRICS,
  POD_RECORDS,
  EVIDENCE_DOCS,
  SLA_TARGETS,
  fmt,
} from "./constants";

// ─── LearnMore ────────────────────────────────────────────────────────────────

export function LearnMore({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="rounded-xl border border-[#E8E4DD] bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-[#FAFAF7] transition-colors"
      >
        <Info size={13} className="text-[#f59e0b] flex-shrink-0" />
        <span className="text-xs font-semibold text-[#4B5563] flex-1">{title}</span>
        {open ? <ChevronUp size={13} className="text-[#9CA3AF]" /> : <ChevronDown size={13} className="text-[#9CA3AF]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[#F0EDE8]">
              <p className="text-xs text-[#6B7280] leading-relaxed">{children}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TransportModeMatcher ─────────────────────────────────────────────────────

const MODE_CONFIG = {
  ftl:     { label: "Full Truckload (FTL)", icon: "🚚", color: "border-blue-400 bg-blue-50 text-blue-800",   badge: "bg-blue-100 text-blue-700" },
  ltl:     { label: "Less-Than-Truckload (LTL)", icon: "📦", color: "border-[#f59e0b] bg-[#FEF3C7] text-[#92400E]", badge: "bg-[#FEF3C7] text-[#D97706]" },
  express: { label: "Express Courier", icon: "✈️", color: "border-green-400 bg-green-50 text-green-800",    badge: "bg-green-100 text-green-700" },
};

export function TransportModeMatcher({ onComplete }: { onComplete: (correct: number) => void }) {
  const [idx, setIdx]           = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shake, setShake]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const scenario = TRANSPORT_SCENARIOS[idx];

  const handleMode = (mode: "ftl" | "ltl" | "express") => {
    if (feedback !== null) return;
    const isCorrect = mode === scenario.correctMode;
    if (isCorrect) {
      setFeedback("correct");
      setCorrect((c) => c + 1);
      timerRef.current = setTimeout(() => {
        setFeedback(null);
        if (idx + 1 >= TRANSPORT_SCENARIOS.length) {
          setDone(true);
          onComplete(correct + 1);
        } else {
          setIdx((i) => i + 1);
        }
      }, 900);
    } else {
      setFeedback("wrong");
      setShake(mode);
      timerRef.current = setTimeout(() => {
        setFeedback(null);
        setShake(null);
      }, 700);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-6"
      >
        <div className="w-14 h-14 rounded-full bg-[#FEF3C7] border-2 border-[#f59e0b] flex items-center justify-center text-2xl">
          🚛
        </div>
        <p className="text-sm font-bold text-[#1A1A1A]">Transport modes mapped!</p>
        <p className="text-xs text-[#6B7280]">{correct}/{TRANSPORT_SCENARIOS.length} correctly assigned</p>
      </motion.div>
    );
  }

  const progress = (idx / TRANSPORT_SCENARIOS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#E8E4DD] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-[#f59e0b] rounded-full"
          />
        </div>
        <span className="text-[10px] font-bold text-[#9CA3AF] flex-shrink-0">{idx}/{TRANSPORT_SCENARIOS.length}</span>
      </div>

      {/* Scenario card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Delivery Scenario {idx + 1}</p>
            <p className="text-sm font-semibold text-[#1A1A1A] leading-snug">{scenario.description}</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Weight", scenario.weight],
                ["Destination", scenario.destination],
                ["Urgency", scenario.urgency],
              ].map(([l, v]) => (
                <div key={l} className="bg-[#F5F0E8] rounded-lg p-2">
                  <p className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mode buttons */}
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Choose the correct transport mode:</p>
      <div className="grid grid-cols-3 gap-3">
        {(["ftl", "ltl", "express"] as const).map((mode) => {
          const cfg = MODE_CONFIG[mode];
          const isWrong  = shake === mode;
          const isCorrect = feedback === "correct" && mode === scenario.correctMode;
          return (
            <motion.button
              key={mode}
              animate={{
                x: isWrong ? [-5, 5, -4, 4, -2, 0] : 0,
                scale: isCorrect ? 1.05 : 1,
              }}
              transition={{ x: { duration: 0.35, ease: "easeOut" }, scale: { type: "spring", stiffness: 400, damping: 14 } }}
              whileHover={!feedback ? { y: -3, boxShadow: "0 6px 16px rgba(0,0,0,0.1)" } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => handleMode(mode)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                isCorrect
                  ? "border-green-400 bg-green-50"
                  : isWrong
                  ? "border-red-400 bg-red-50"
                  : "border-[#E8E4DD] bg-white hover:border-[#D97706]/50"
              }`}
            >
              <span className="text-xl">{cfg.icon}</span>
              <span className="text-[10px] font-bold text-[#1A1A1A] text-center leading-tight">{cfg.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl"
          >
            <CheckCircle2 size={14} className="text-green-600" />
            <p className="text-xs font-semibold text-green-800">
              Correct — {MODE_CONFIG[scenario.correctMode].label} is right for this shipment.
            </p>
          </motion.div>
        )}
        {feedback === "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl"
          >
            <AlertTriangle size={14} className="text-red-600" />
            <p className="text-xs font-semibold text-red-800">Not quite — think about volume, weight, and destination count.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── CostCalculator ───────────────────────────────────────────────────────────

export function CostCalculator({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [revealIdx, setRevealIdx] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    const hidden = COST_COMPONENTS.filter((c) => c.category !== "base");
    hidden.forEach((_, i) => {
      timerRef.current = setTimeout(() => setRevealIdx(i + 1), 350 + i * 500);
    });
    timerRef.current = setTimeout(() => setDone(true), 350 + hidden.length * 500 + 200);
  };

  const visibleTotal = COST_COMPONENTS.slice(0, 1 + revealIdx).reduce((s, c) => s + c.amount, 0);
  const trueTotal = COST_COMPONENTS.reduce((s, c) => s + c.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
        <div className="px-5 py-3 border-b border-[#E8E4DD] bg-[#FAFAF7]">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Atlas Freight — True Cost Analysis</p>
        </div>
        <div className="divide-y divide-[#F0EDE8]">
          {COST_COMPONENTS.map((comp, i) => {
            const isVisible = i === 0 || (revealed && i <= revealIdx);
            const isHidden = i > 0 && !isVisible;
            return (
              <motion.div
                key={comp.id}
                initial={i > 0 ? { opacity: 0, x: -10 } : false}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className={`flex items-center gap-3 px-5 py-3 ${isHidden ? "opacity-30" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#1A1A1A]">{comp.label}</p>
                    {comp.category === "hidden" && isVisible && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full"
                      >
                        HIDDEN
                      </motion.span>
                    )}
                  </div>
                  {isVisible && <p className="text-[10px] text-[#9CA3AF] mt-0.5">{comp.description}</p>}
                </div>
                <motion.p
                  className={`text-sm font-bold flex-shrink-0 ${
                    comp.category === "base" ? "text-[#1A1A1A]" :
                    comp.category === "surcharge" ? "text-[#D97706]" : "text-red-600"
                  }`}
                  animate={isVisible ? { scale: [1.2, 1] } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  {isVisible ? `$${comp.amount.toFixed(2)}` : "—"}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
        {/* Running total */}
        <div className={`px-5 py-4 border-t-2 border-[#E8E4DD] flex items-center justify-between ${
          done ? "bg-[#FEF3C7]" : "bg-[#FAFAF7]"
        } transition-colors duration-500`}>
          <div>
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">True Cost Per Delivery</p>
            {done && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-red-600 font-semibold mt-0.5"
              >
                +${(trueTotal - COST_COMPONENTS[0].amount).toFixed(2)} above invoiced rate (+{(((trueTotal - COST_COMPONENTS[0].amount) / COST_COMPONENTS[0].amount) * 100).toFixed(0)}%)
              </motion.p>
            )}
          </div>
          <motion.p
            className="text-xl font-black"
            style={{ fontFamily: "var(--font-syne),sans-serif", color: done ? "#D97706" : "#1A1A1A" }}
            animate={{ scale: done ? [1.1, 1] : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ${visibleTotal.toFixed(2)}
          </motion.p>
        </div>
      </div>

      {!revealed && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReveal}
          className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#333] transition-colors"
        >
          🔍 Reveal Hidden Costs
        </motion.button>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-start gap-3 p-4 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl">
            <AlertTriangle size={14} className="text-[#D97706] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#92400E] mb-1">Richard was using $142. The real number is $177.80 — 25% higher.</p>
              <p className="text-xs text-[#92400E]">
                The monthly invoice had a single line total. No breakdown by type, route, or mode. It was, in Maya&apos;s words, &ldquo;the logistics equivalent of a restaurant bill that said &lsquo;Food: $847&rsquo; without listing what you ordered.&rdquo;
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Present Findings to Richard →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── ScorecardBuilder ─────────────────────────────────────────────────────────

export function ScorecardBuilder({ onComplete }: { onComplete: () => void }) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const handleReview = (id: string) => {
    setReviewed((prev) => new Set([...prev, id]));
  };

  const allReviewed = reviewed.size === SCORECARD_METRICS.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCORECARD_METRICS.map((metric, i) => {
          const isReviewed = reviewed.has(metric.id);
          const isBad =
            metric.direction === "higher"
              ? metric.current < metric.benchmark
              : metric.current > metric.benchmark;
          const barPct = metric.direction === "higher"
            ? (metric.current / metric.benchmark) * 100
            : (metric.benchmark / metric.current) * 100;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white border-2 rounded-2xl overflow-hidden transition-colors ${
                isReviewed ? "border-[#f59e0b]" : "border-[#E8E4DD]"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-bold text-[#1A1A1A] leading-tight">{metric.label}</p>
                  {isReviewed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 14 }}
                      className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0"
                    >
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </div>
                {/* Metric value */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-2xl font-black ${isBad ? "text-red-600" : "text-green-600"}`}
                    style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                    {metric.current}{metric.unit}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">current</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(barPct, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${isBad ? "bg-red-400" : "bg-green-400"}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#9CA3AF]">
                  <span>Benchmark: <strong className="text-[#1A1A1A]">{metric.benchmark}{metric.unit}</strong></span>
                  <span className={`font-bold ${isBad ? "text-red-600" : "text-green-600"}`}>
                    {isBad
                      ? metric.direction === "higher"
                        ? `${(metric.benchmark - metric.current).toFixed(1)}${metric.unit} below`
                        : `${(metric.current - metric.benchmark).toFixed(1)}${metric.unit} above`
                      : "On target"}
                  </span>
                </div>
                {isReviewed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[10px] text-[#6B7280] mt-2 leading-relaxed border-t border-[#F0EDE8] pt-2"
                  >
                    {metric.description}
                  </motion.p>
                )}
              </div>
              {!isReviewed && (
                <div className="px-4 pb-3">
                  <button
                    onClick={() => handleReview(metric.id)}
                    className="w-full py-2 text-xs font-bold text-[#D97706] border border-[#f59e0b]/40 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] transition-colors cursor-pointer"
                  >
                    Review Metric →
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allReviewed && !done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-[#F5F0E8] border border-[#E8E4DD] rounded-xl">
              <p className="text-xs font-bold text-[#1A1A1A] mb-1">Scorecard complete.</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Four metrics. Atlas Freight is below benchmark on every one. But the scorecard can&apos;t tell Maya whether this is a bad carrier or an unmanaged one. Only the next 90 days can answer that.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setDone(true); onComplete(); }}
              className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Complete Scorecard →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── PODRecoveryGame ──────────────────────────────────────────────────────────

export function PODRecoveryGame({ onComplete }: { onComplete: (recovered: number) => void }) {
  const [statuses, setStatuses] = useState<Record<number, "pending" | "actioning" | "done">>(
    Object.fromEntries(POD_RECORDS.map((r) => [r.id, r.status === "digital" ? "done" : "pending"]))
  );
  const [done, setDone] = useState(false);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);

  const action = (id: number) => {
    setStatuses((prev) => ({ ...prev, [id]: "actioning" }));
    timers.current[id] = setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: "done" }));
    }, 1000);
  };

  const actionableCount = POD_RECORDS.filter((r) => r.actionable).length;
  const doneCount = Object.values(statuses).filter((s) => s === "done").length - 1; // minus the pre-done digital one
  const totalRecovered = POD_RECORDS.filter((r, i) => statuses[r.id] === "done" && r.actionable).reduce((s, r) => s + r.value, 0);
  const allDone = doneCount >= actionableCount;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl">
        <p className="text-xs font-bold text-[#92400E]">POD Backlog Recovery</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#D97706]">{doneCount}/{actionableCount} actioned</span>
          {allDone && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full"
            >
              ✓ Complete
            </motion.span>
          )}
        </div>
      </div>

      {/* Records */}
      <div className="space-y-2">
        {POD_RECORDS.map((record) => {
          const status = statuses[record.id];
          return (
            <motion.div
              key={record.id}
              layout
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                status === "done"
                  ? "bg-green-50 border-green-200"
                  : status === "actioning"
                  ? "bg-[#FEF3C7] border-[#f59e0b]/40"
                  : "bg-white border-[#E8E4DD]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A] truncate">{record.delivery}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-[#9CA3AF]">{record.date}</span>
                  <span className="text-[9px] font-bold text-[#D97706]">${fmt(record.value)}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    record.status === "digital"
                      ? "bg-green-100 text-green-700"
                      : record.status === "paper"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {record.status === "digital" ? "Digital" : record.status === "paper" ? "Paper" : "Missing"}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {status === "done" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-700 text-[10px] font-bold"
                  >
                    <CheckCircle2 size={14} />
                    {record.status === "digital" ? "Complete" : "Uploaded ✓"}
                  </motion.div>
                ) : status === "actioning" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#f59e0b] border-t-transparent rounded-full"
                  />
                ) : (
                  <button
                    onClick={() => action(record.id)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      record.status === "paper"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {record.status === "paper" ? "Request Scan →" : "Contact Customer →"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && !done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-bold text-green-800 mb-1">
                ${fmt(totalRecovered)} in invoicing unlocked.
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                Goods delivered. Revenue earned. The chain of evidence was always complete — it just wasn&apos;t digital. The accounts team can now raise invoices within 48 hours of delivery.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setDone(true); onComplete(doneCount); }}
              className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Report to Finance →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── EvidenceChainBuilder ─────────────────────────────────────────────────────

export function EvidenceChainBuilder({ onComplete }: { onComplete: () => void }) {
  const [order, setOrder] = useState<typeof EVIDENCE_DOCS>(() => [...EVIDENCE_DOCS].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);

  const moveItem = (fromIdx: number, dir: -1 | 1) => {
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= order.length) return;
    const newOrder = [...order];
    [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];
    setOrder(newOrder);
  };

  const isCorrect = order.every((doc, i) => doc.stage === i + 1);

  const handleSubmit = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (isCorrect) {
        setSubmitted(true);
      }
    }, 600);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-bold text-green-800 mb-1">✓ Evidence chain complete</p>
          <p className="text-xs text-green-700 leading-relaxed">
            Jerome approved the claim within 24 hours. $890 credited. Without Gloria&apos;s photographs and the documented chain, this becomes an unresolvable dispute — the cost absorbed by the company or the customer, neither of whom caused it.
          </p>
        </div>
        {/* Chain display */}
        <div className="flex items-start gap-1 overflow-x-auto pb-2">
          {EVIDENCE_DOCS.sort((a, b) => a.stage - b.stage).map((doc, i) => (
            <div key={doc.id} className="flex items-center gap-1 flex-shrink-0">
              <div className="flex flex-col items-center gap-1 w-20">
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#f59e0b] flex items-center justify-center text-lg">
                  {doc.icon}
                </div>
                <p className="text-[8px] font-bold text-[#1A1A1A] text-center leading-tight">{doc.label}</p>
              </div>
              {i < EVIDENCE_DOCS.length - 1 && (
                <span className="text-[#f59e0b] font-bold text-sm flex-shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
          className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
        >
          Claim Approved — Continue →
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="p-3 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl">
        <p className="text-xs font-semibold text-[#92400E]">
          Arrange the 5 evidence documents in the correct chronological order to build a defensible freight claim.
        </p>
      </div>

      <div className="space-y-2">
        {order.map((doc, i) => {
          const stageOk = doc.stage === i + 1;
          return (
            <motion.div
              key={doc.id}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                checking
                  ? stageOk
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : "border-[#E8E4DD] bg-white"
              }`}
            >
              <span className="text-xs font-bold text-[#9CA3AF] w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-lg flex-shrink-0">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A]">{doc.label}</p>
                <p className="text-[9px] text-[#9CA3AF] mt-0.5 leading-tight">{doc.description}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  className="p-1 rounded text-[#9CA3AF] hover:text-[#1A1A1A] disabled:opacity-20 cursor-pointer hover:bg-[#F5F0E8] transition-colors"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => moveItem(i, 1)}
                  disabled={i === order.length - 1}
                  className="p-1 rounded text-[#9CA3AF] hover:text-[#1A1A1A] disabled:opacity-20 cursor-pointer hover:bg-[#F5F0E8] transition-colors"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {checking && !isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-xs font-semibold text-red-700">
            The order isn&apos;t right yet. Think: what exists before a delivery happens, and what&apos;s captured at each stage?
          </p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#333] transition-colors"
      >
        Submit Evidence Chain →
      </motion.button>
    </motion.div>
  );
}

// ─── FleetModeller ────────────────────────────────────────────────────────────

function calcCosts(deliveries: number) {
  const tplPerDelivery = 177.80;
  // In-house: high fixed cost amortised over volume, variable cost lower
  // At 3200, costs equalise. Below: 3PL cheaper. Above: in-house cheaper.
  const inHouseFixed = 1840000 / 12; // monthly fixed
  const inHouseVariable = 71;
  const inHouseMonthly = inHouseFixed + inHouseVariable * deliveries;
  const inHousePerDelivery = inHouseMonthly / deliveries;
  const tplMonthly = tplPerDelivery * deliveries;
  return {
    tplPerDelivery,
    inHousePerDelivery: Math.round(inHousePerDelivery * 100) / 100,
    tplMonthly,
    inHouseMonthly,
  };
}

export function FleetModeller({ onComplete }: { onComplete: (choice: string) => void }) {
  const [deliveries, setDeliveries] = useState(2800);
  const [choice, setChoice] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const costs = calcCosts(deliveries);
  const crossover = 3200;
  const inHouseCheaper = deliveries >= crossover;

  const options = [
    {
      id: "3pl",
      label: "Full 3PL",
      icon: "🤝",
      desc: "Renew Atlas Freight contract as-is",
      pros: "Low fixed cost, flexible capacity, existing network",
      cons: "No direct service control, performance problems persist",
      recommended: false,
    },
    {
      id: "hybrid",
      label: "Hybrid Model",
      icon: "⚖️",
      desc: "In-house FTL core routes + 3PL for LTL & overflow",
      pros: "Best of both: control on key routes, flex on the rest",
      cons: "Requires fleet investment and management overhead",
      recommended: true,
    },
    {
      id: "inhouse",
      label: "Full In-House",
      icon: "🏭",
      desc: "Buy trucks, hire drivers, run all routes in-house",
      pros: "Full control, real-time visibility, direct service quality",
      cons: "Needs 3,200+ monthly deliveries to be cost-effective",
      recommended: false,
    },
  ];

  const handleChoice = (id: string) => {
    if (id !== "hybrid") {
      setShowWarning(id);
      setChoice(id);
    } else {
      setChoice("hybrid");
      setShowWarning(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Crossover chart */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-[#E8E4DD] bg-[#FAFAF7]">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Cost Per Delivery — Volume Crossover Model</p>
        </div>
        <div className="p-5 space-y-4">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#4B5563]">Monthly Deliveries</p>
              <span className="text-sm font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                {fmt(deliveries)}
                {deliveries === 2800 && <span className="text-[9px] text-[#f59e0b] ml-1 font-bold">(Current)</span>}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={4000}
              step={50}
              value={deliveries}
              onChange={(e) => setDeliveries(Number(e.target.value))}
              className="w-full accent-[#f59e0b]"
            />
            <div className="flex justify-between text-[9px] text-[#9CA3AF] mt-1">
              <span>1,000</span>
              <span className="text-[#f59e0b] font-bold">Crossover: 3,200</span>
              <span>4,000</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "3PL Cost/Delivery", value: `$${costs.tplPerDelivery.toFixed(2)}`, sub: `$${fmt(Math.round(costs.tplMonthly))} / month`, color: inHouseCheaper ? "text-red-600" : "text-green-600" },
              { label: "In-House Cost/Delivery", value: `$${costs.inHousePerDelivery.toFixed(2)}`, sub: `$${fmt(Math.round(costs.inHouseMonthly))} / month`, color: inHouseCheaper ? "text-green-600" : "text-red-600" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F5F0E8] rounded-xl p-3 text-center">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">{item.label}</p>
                <p className={`text-xl font-black ${item.color}`} style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  {item.value}
                </p>
                <p className="text-[9px] text-[#9CA3AF]">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className={`flex items-start gap-2 p-3 rounded-xl border ${
            inHouseCheaper ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"
          }`}>
            <span className="text-sm">{inHouseCheaper ? "✅" : "⚠️"}</span>
            <p className="text-xs text-[#1A1A1A]">
              {inHouseCheaper
                ? `At ${fmt(deliveries)} deliveries/month, in-house is the cheaper option.`
                : `At ${fmt(deliveries)} deliveries/month, 3PL is still cheaper. Crossover is at 3,200.`}
              {deliveries === 2800 && " Maya's company is currently here — below the crossover point."}
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Choose your recommendation:</p>
      <div className="space-y-3">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice(opt.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer text-left transition-colors ${
              choice === opt.id
                ? opt.recommended
                  ? "border-[#f59e0b] bg-[#FFFBF0]"
                  : "border-red-300 bg-red-50"
                : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
            }`}
          >
            <span className="text-2xl flex-shrink-0">{opt.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[#1A1A1A]">{opt.label}</p>
                {opt.recommended && (
                  <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#f59e0b]/40">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4B5563] mb-2">{opt.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[8px] font-bold text-green-700 mb-0.5">✓ Pros</p>
                  <p className="text-[9px] text-[#6B7280]">{opt.pros}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-red-600 mb-0.5">✗ Cons</p>
                  <p className="text-[9px] text-[#6B7280]">{opt.cons}</p>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showWarning && choice !== "hybrid" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-xs font-bold text-red-800 mb-1">
              {choice === "3pl"
                ? "Full 3PL: the status quo. No structural improvement, same unmanaged performance."
                : "Full In-House: volumes are below crossover point. Higher cost, and no flex capacity during construction season peaks."}
            </p>
            <p className="text-xs text-red-700">
              Derek&apos;s recommendation: the structurally correct answer isn&apos;t binary. Select Hybrid to see why.
            </p>
          </motion.div>
        )}
        {choice === "hybrid" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl">
              <p className="text-xs font-bold text-[#92400E] mb-1">Hybrid Model — Maya&apos;s Recommendation</p>
              <p className="text-xs text-[#92400E] leading-relaxed">
                8 in-house FTL routes (40% of volume, 55% of spend) at $131/delivery. Atlas Freight retained for LTL, express, and peak overflow. New SLA with accountability. Annual saving on FTL alone: ~$76,000.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete("hybrid")}
              className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Present Recommendation to Board →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SLADashboard ─────────────────────────────────────────────────────────────

export function SLADashboard({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"negotiate" | "results">("negotiate");
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [signed, setSigned] = useState(false);

  const metrics = [
    { key: "ontime",    label: "On-Time Delivery",     ...SLA_TARGETS.ontime,    improvement: true },
    { key: "damage",    label: "Damage Rate",           ...SLA_TARGETS.damage,    improvement: false },
    { key: "pod",       label: "POD Completion",        ...SLA_TARGETS.pod,       improvement: true },
    { key: "complaint", label: "Complaint Resolution",  ...SLA_TARGETS.complaint, improvement: false },
  ];

  const allAgreed = agreed.size === metrics.length;

  if (phase === "results") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="p-4 bg-[#F0FDFA] border border-teal-200 rounded-xl">
          <p className="text-sm font-bold text-teal-900 mb-1">90 days later — the trajectory is unmistakable.</p>
          <p className="text-xs text-teal-700 leading-relaxed">
            In-house FTL fleet operational for six weeks. Jerome&apos;s team has deployed digital POD across all LTL routes. Detention events down 54%. Gloria&apos;s tiles arrive on time, intact.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => {
            const improved = m.improvement
              ? m.result > m.current
              : m.result < m.current;
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#E8E4DD] rounded-xl p-3"
              >
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">{m.label}</p>
                <div className="flex items-end gap-2">
                  <div className="text-center">
                    <p className="text-[8px] text-[#9CA3AF]">Before</p>
                    <p className="text-sm font-bold text-red-500">{m.current}{m.unit}</p>
                  </div>
                  <span className="text-[#f59e0b] font-bold pb-1">→</span>
                  <div className="text-center">
                    <p className="text-[8px] text-[#9CA3AF]">After</p>
                    <motion.p
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className={`text-sm font-bold ${improved ? "text-green-600" : "text-[#D97706]"}`}
                    >
                      {m.result}{m.unit}
                    </motion.p>
                  </div>
                  <div className="text-center ml-auto">
                    <p className="text-[8px] text-[#9CA3AF]">Target</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{m.target}{m.unit}</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${(m.current / m.target) * 100}%` }}
                    animate={{ width: `${Math.min((m.result / m.target) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${improved ? "bg-green-400" : "bg-[#f59e0b]"}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="border-l-4 border-[#0F766E] bg-[#F0FDFA] rounded-r-2xl p-4">
          <p className="text-xs italic text-teal-800 leading-relaxed">
            &ldquo;Blended cost per delivery: $158.30 — down from $177.80. Annual logistics spend projected $112,000 below prior year despite 4% volume increase. The scorecard is the mechanism that keeps it honest.&rdquo;
          </p>
          <p className="text-[10px] text-teal-600 mt-1 font-semibold">— Maya, presenting to the board</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
          className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
        >
          View Final Scorecard →
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="p-4 bg-[#F5F0E8] border border-[#E8E4DD] rounded-xl">
        <p className="text-xs font-bold text-[#1A1A1A] mb-1">Thursday morning — Jerome&apos;s office.</p>
        <p className="text-xs text-[#6B7280] italic leading-relaxed">
          &ldquo;I&apos;m going to be direct. We&apos;re bringing the core FTL routes in-house. That&apos;s a decision, not a discussion point. For the LTL routes, express, and peak overflow — I want to continue with Atlas. But the terms need to change.&rdquo;
        </p>
      </div>

      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Set SLA targets — click each to agree with Jerome:</p>

      <div className="space-y-2">
        {metrics.map((m) => {
          const isAgreed = agreed.has(m.key);
          return (
            <motion.button
              key={m.key}
              whileHover={!isAgreed ? { x: 4 } : {}}
              whileTap={!isAgreed ? { scale: 0.98 } : {}}
              onClick={() => !isAgreed && setAgreed((prev) => new Set([...prev, m.key]))}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl border-2 text-left cursor-pointer transition-colors ${
                isAgreed ? "border-[#f59e0b] bg-[#FFFBF0]" : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A] mb-1">{m.label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#9CA3AF]">Current: <strong className="text-red-500">{m.current}{m.unit}</strong></span>
                  <span className="text-[#E8E4DD]">→</span>
                  <span className="text-[10px] text-[#9CA3AF]">Target: <strong className="text-[#1A1A1A]">{m.target}{m.unit}</strong></span>
                </div>
              </div>
              {isAgreed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-7 h-7 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              ) : (
                <span className="text-[10px] font-bold text-[#D97706] border border-[#f59e0b]/40 px-2 py-1 rounded-lg bg-[#FEF3C7] flex-shrink-0">
                  Agree →
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {allAgreed && !signed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="border-l-4 border-[#EA580C] bg-[#FFF7ED] rounded-r-xl p-4">
              <p className="text-xs italic text-[#92400E] leading-relaxed">
                &ldquo;This is the first time in three years your company has told me what good looks like. I can&apos;t hit a target I&apos;ve never been given.&rdquo;
              </p>
              <p className="text-[10px] text-[#EA580C] mt-1 font-semibold">— Jerome Vasquez, Atlas Freight</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSigned(true); setTimeout(() => setPhase("results"), 600); }}
              className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#333] transition-colors"
            >
              ✍️ Sign 2-Year Contract →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
