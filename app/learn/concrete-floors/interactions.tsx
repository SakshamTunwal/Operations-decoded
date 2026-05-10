"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info, CheckCircle2 } from "lucide-react";
import type { SlottingItem, PickMethod, ErrorLogEntry, ReturnItem } from "./types";

// ─── LearnMore expandable ─────────────────────────────────────────────────────

export function LearnMore({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#D97706] transition-colors cursor-pointer group"
      >
        <Info size={11} className="group-hover:text-[#D97706]" />
        <span>{title}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg px-3 py-2.5 text-xs text-[#4B5563] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Walking Distance Calculator ──────────────────────────────────────────────

export function WalkingDistanceGauge({ before, after }: { before: number; after: number }) {
  const reduction = Math.round(((before - after) / before) * 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Daily Pick Distance</p>
      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 120 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-12 bg-red-200 rounded-t-lg relative overflow-hidden"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-red-400"
            />
          </motion.div>
          <p className="text-xs font-bold text-red-600">{before} mi</p>
          <p className="text-[9px] text-[#9CA3AF]">Before</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 120 * (after / before) }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-12 bg-green-200 rounded-t-lg relative overflow-hidden"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="absolute bottom-0 left-0 right-0 bg-green-400"
            />
          </motion.div>
          <p className="text-xs font-bold text-green-600">{after} mi</p>
          <p className="text-[9px] text-[#9CA3AF]">After</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1"
      >
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-semibold text-green-700">{reduction}% reduction in walking</span>
      </motion.div>
    </div>
  );
}

// ─── Slotting Game ────────────────────────────────────────────────────────────

export function SlottingGame({
  items,
  onComplete,
}: {
  items: SlottingItem[];
  onComplete: () => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const zones = [
    { id: "front", label: "Front (Near Packing)", desc: "A items — highest velocity", color: "border-green-400 bg-green-50" },
    { id: "middle", label: "Middle Zones", desc: "B items — medium velocity", color: "border-[#f59e0b] bg-[#FEF3C7]" },
    { id: "back", label: "Back of Warehouse", desc: "C items — slow movers", color: "border-[#E8E4DD] bg-[#F5F0E8]" },
  ];

  const handlePlace = (sku: string, zone: string) => {
    setPlacements((p) => ({ ...p, [sku]: zone }));
  };

  const allPlaced = items.every((item) => placements[item.sku]);
  const correctCount = items.filter((item) => placements[item.sku] === item.correctZone).length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (correctCount === items.length) {
      setTimeout(onComplete, 800);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Assign each SKU group to the correct zone
        </p>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          submitted ? (correctCount === items.length ? "bg-green-100 text-green-700" : "bg-[#FEF3C7] text-[#D97706]") : "bg-[#F5F0E8] text-[#9CA3AF]"
        }`}>
          {submitted ? `${correctCount}/${items.length} correct` : `${Object.keys(placements).length}/${items.length} placed`}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => {
          const placed = placements[item.sku];
          const isCorrect = submitted && placed === item.correctZone;
          const isWrong = submitted && placed && placed !== item.correctZone;
          return (
            <motion.div
              key={item.sku}
              animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-[#E8E4DD] bg-white"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A]">{item.sku}</p>
                <p className="text-[10px] text-[#9CA3AF]">
                  Velocity: <span className={`font-bold ${item.velocity === "A" ? "text-green-600" : item.velocity === "B" ? "text-[#D97706]" : "text-[#9CA3AF]"}`}>{item.velocity}</span>
                  {" · "}Currently Aisle {item.currentAisle}
                </p>
              </div>
              <div className="flex gap-1">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => !submitted && handlePlace(item.sku, z.id)}
                    disabled={submitted}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg border-2 cursor-pointer transition-all ${
                      placed === z.id ? z.color + " ring-1 ring-offset-1 ring-[#f59e0b]/50" : "border-[#E8E4DD] bg-white text-[#9CA3AF] hover:border-[#D97706]/40"
                    }`}
                  >
                    {z.id === "front" ? "Front" : z.id === "middle" ? "Mid" : "Back"}
                  </button>
                ))}
              </div>
              {isCorrect && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
              {isWrong && <span className="text-red-500 text-xs font-bold flex-shrink-0">→ {item.correctZone}</span>}
            </motion.div>
          );
        })}
      </div>

      {allPlaced && !submitted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
        >
          Confirm Slotting Plan
        </motion.button>
      )}

      {submitted && correctCount < items.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSubmitted(false); setPlacements({}); }}
          className="w-full py-2.5 border-2 border-[#E8E4DD] text-[#6B7280] text-sm font-semibold rounded-xl cursor-pointer hover:border-[#D97706] transition-colors"
        >
          Try Again
        </motion.button>
      )}

      {submitted && correctCount === items.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl"
        >
          <CheckCircle2 size={16} className="text-green-600" />
          <p className="text-sm font-semibold text-green-700">ABC Slotting complete — 41% pick distance reduction</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Pick Method Selector ─────────────────────────────────────────────────────

export function PickMethodSelector({
  methods,
  selected,
  onChange,
}: {
  methods: PickMethod[];
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
        Which picking method should the warehouse adopt for the flash sale?
      </p>
      <div className="space-y-2">
        {methods.map((m) => {
          const sel = selected === m.id;
          return (
            <motion.button
              key={m.id}
              animate={{ scale: sel ? 1.02 : 1, boxShadow: sel ? "0 4px 16px rgba(245,158,11,0.25)" : "0 1px 3px rgba(0,0,0,0.06)" }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(m.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer text-left ${
                sel ? "border-[#f59e0b] bg-[#FEF3C7]" : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
              }`}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${sel ? "text-[#D97706]" : "text-[#1A1A1A]"}`}>{m.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{m.desc}</p>
                <div className="flex gap-4 mt-1.5">
                  <p className="text-[10px] text-green-600"><span className="font-semibold">+</span> {m.pros}</p>
                  <p className="text-[10px] text-red-500"><span className="font-semibold">-</span> {m.cons}</p>
                </div>
              </div>
              {sel && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── WMS Discrepancy Fix ──────────────────────────────────────────────────────

const DISCREPANCY_TYPES = [
  { id: "transposition", label: "Data Entry Transposition", count: 289, fix: "Re-scan and correct location codes", icon: "🔢" },
  { id: "unscanmed",     label: "Picked but Not Scanned Out", count: 35,  fix: "Enforce scan-at-pick discipline", icon: "📱" },
  { id: "missing",       label: "Genuine Missing Stock",      count: 16,  fix: "Write off and investigate", icon: "❓" },
];

export function WMSDiscrepancyGame({
  onFixed,
}: {
  onFixed: (count: number) => void;
}) {
  const [fixed, setFixed] = useState<Set<string>>(new Set());

  const handleFix = (id: string) => {
    const next = new Set(fixed);
    next.add(id);
    setFixed(next);
    onFixed(next.size);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          340 WMS discrepancies found — resolve each type
        </p>
        <motion.span
          key={fixed.size}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            fixed.size === 3 ? "bg-green-100 text-green-700" : "bg-[#FEF3C7] text-[#D97706]"
          }`}
        >
          {fixed.size}/3 resolved
        </motion.span>
      </div>
      <div className="space-y-2">
        {DISCREPANCY_TYPES.map((d) => {
          const isFixed = fixed.has(d.id);
          return (
            <motion.div
              key={d.id}
              animate={{ opacity: isFixed ? 0.7 : 1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                isFixed ? "border-green-400 bg-green-50" : "border-[#E8E4DD] bg-white"
              }`}
            >
              <span className="text-xl flex-shrink-0">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A]">{d.label}</p>
                <p className="text-[10px] text-[#9CA3AF]">{d.count} locations · Fix: {d.fix}</p>
              </div>
              {isFixed ? (
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
              ) : (
                <button
                  onClick={() => handleFix(d.id)}
                  className="px-3 py-1.5 bg-[#f59e0b] text-black text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#D97706] transition-colors flex-shrink-0"
                >
                  Apply Fix
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Error Fix Game ───────────────────────────────────────────────────────────

export function ErrorFixGame({
  errors,
  onFixed,
}: {
  errors: ErrorLogEntry[];
  onFixed: (count: number) => void;
}) {
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const handleApply = (fixId: string) => {
    const next = new Set(applied);
    next.add(fixId);
    setApplied(next);
    onFixed(next.size);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Pick error log — apply the right fix for each
        </p>
        <motion.span
          key={applied.size}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            applied.size === errors.length ? "bg-green-100 text-green-700" : "bg-[#FEF3C7] text-[#D97706]"
          }`}
        >
          {applied.size}/{errors.length} fixed
        </motion.span>
      </div>
      <div className="space-y-2">
        {errors.map((err) => {
          const isFixed = applied.has(err.fixId);
          return (
            <motion.div
              key={err.fixId}
              animate={{ opacity: isFixed ? 0.7 : 1 }}
              className={`p-3 rounded-xl border-2 ${
                isFixed ? "border-green-400 bg-green-50" : "border-[#E8E4DD] bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-[#1A1A1A]">{err.skuGroup}</p>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{err.count} errors/month</span>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mb-2">Root cause: {err.errorType}</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[#6B7280]"><span className="font-semibold">Fix:</span> {err.fix}</p>
                {isFixed ? (
                  <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(err.fixId)}
                    className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#374151] transition-colors"
                  >
                    Install Fix
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Returns Grading Game ─────────────────────────────────────────────────────

const GRADE_OPTIONS = [
  { id: "A", label: "Grade A", desc: "Resaleable as-is", color: "border-green-400 bg-green-50 text-green-700" },
  { id: "B", label: "Grade B", desc: "Needs repackaging", color: "border-blue-400 bg-blue-50 text-blue-700" },
  { id: "C", label: "Grade C", desc: "Outlet channel", color: "border-[#f59e0b] bg-[#FEF3C7] text-[#92400E]" },
  { id: "D", label: "Grade D", desc: "Write-off", color: "border-red-400 bg-red-50 text-red-700" },
];

export function ReturnsGradingGame({
  items,
  onComplete,
}: {
  items: ReturnItem[];
  onComplete: (correctCount: number) => void;
}) {
  const [grades, setGrades] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const current = items[currentIdx];
  const allGraded = Object.keys(grades).length === items.length;
  const correctCount = items.filter((item) => grades[item.id] === item.grade).length;

  const handleGrade = (grade: string) => {
    setGrades((g) => ({ ...g, [current.id]: grade }));
    if (currentIdx < items.length - 1) {
      setTimeout(() => setCurrentIdx((i) => i + 1), 300);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(correctCount);
  };

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[#F5F0E8] border-b border-[#E8E4DD] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📋</span>
          <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Returns Grading Station
          </p>
        </div>
        <p className="text-xs text-[#9CA3AF]">{Object.keys(grades).length}/{items.length} graded</p>
      </div>

      <div className="p-5">
        {!submitted ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-4 p-4 border-2 border-[#E8E4DD] rounded-xl"
              >
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{current.label}</p>
                <p className="text-xs text-[#6B7280]">{current.condition}</p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {GRADE_OPTIONS.map((g) => {
                const sel = grades[current.id] === g.id;
                return (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGrade(g.id)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      sel ? g.color + " ring-1 ring-offset-1 ring-[#f59e0b]/50" : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
                    }`}
                  >
                    <p className="text-xs font-bold">{g.label}</p>
                    <p className="text-[9px] text-[#9CA3AF]">{g.desc}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  animate={{ backgroundColor: grades[item.id] ? "#f59e0b" : i === currentIdx ? "#D97706" : "#E8E4DD" }}
                  className="w-2 h-2 rounded-full cursor-pointer"
                  onClick={() => setCurrentIdx(i)}
                />
              ))}
            </div>

            {allGraded && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleSubmit}
                className="w-full py-2.5 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#374151] transition-colors"
              >
                Submit Grading →
              </motion.button>
            )}
          </>
        ) : (
          <div>
            <div className="space-y-1.5 mb-4">
              {items.map((item) => {
                const userGrade = grades[item.id];
                const correct = userGrade === item.grade;
                return (
                  <div key={item.id} className={`flex items-center justify-between p-2.5 rounded-lg border ${
                    correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}>
                    <p className="text-xs text-[#1A1A1A]">{item.label}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${correct ? "text-green-700" : "text-red-600 line-through"}`}>
                        {userGrade}
                      </span>
                      {!correct && <span className="text-[10px] font-bold text-green-700">{item.grade}</span>}
                      {correct && <CheckCircle2 size={12} className="text-green-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`p-3 rounded-xl text-center ${
              correctCount >= 5 ? "bg-green-50 border border-green-200" : "bg-[#FEF3C7] border border-[#f59e0b]/40"
            }`}>
              <p className={`text-sm font-bold ${correctCount >= 5 ? "text-green-700" : "text-[#92400E]"}`}>
                {correctCount}/{items.length} correctly graded
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Conveyor Belt Fix ────────────────────────────────────────────────────────

export function ConveyorFixDecision({ onDecision }: { onDecision: (rerouted: boolean) => void }) {
  const [decided, setDecided] = useState<boolean | null>(null);

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-2xl overflow-hidden">
      <div className="bg-red-100 border-b border-red-200 px-5 py-3 flex items-center gap-2">
        <span className="text-sm">🚨</span>
        <p className="text-xs font-bold text-red-700 uppercase tracking-widest">Equipment Failure — Day 2, 2:15 PM</p>
      </div>
      <div className="p-5">
        <p className="text-sm text-red-800 mb-4">
          The main conveyor belt has jammed. Packed orders have no path to dispatch staging. What do you do?
        </p>
        {decided === null ? (
          <div className="space-y-2">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setDecided(true); onDecision(true); }}
              className="w-full flex items-center gap-3 p-3 border-2 border-[#E8E4DD] rounded-xl cursor-pointer bg-white hover:border-green-400 text-left"
            >
              <span className="text-xl">🔄</span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Reroute to manual carry</p>
                <p className="text-xs text-[#6B7280]">Switch packing stations to hand carts via south cross-aisle</p>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setDecided(false); onDecision(false); }}
              className="w-full flex items-center gap-3 p-3 border-2 border-[#E8E4DD] rounded-xl cursor-pointer bg-white hover:border-red-400 text-left"
            >
              <span className="text-xl">⏸️</span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Wait for maintenance</p>
                <p className="text-xs text-[#6B7280]">Hold all pack confirmations until belt is repaired</p>
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${decided ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}
          >
            {decided ? (
              <>
                <p className="text-sm font-bold text-green-800 mb-1">Correct — Fatima&apos;s move.</p>
                <p className="text-xs text-green-700">The manual workaround kept 214 parcels moving during the 40-minute repair. Zero missed dispatches.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-[#92400E] mb-1">Risky choice.</p>
                <p className="text-xs text-[#92400E]">Waiting would have stalled dispatch for 40+ minutes. The better move was rerouting to manual carry immediately.</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Document Fly Animation ───────────────────────────────────────────────────

export function DocumentFlyAnimation({
  label = "DOC",
  onDone,
}: {
  label?: string;
  onDone: () => void;
}) {
  return (
    <div className="relative h-16 overflow-hidden pointer-events-none">
      {[0.18, 0.32].map((opacity, ti) => (
        <motion.div
          key={ti}
          className="absolute top-3 w-10 h-12 bg-white border border-[#f59e0b]/40 rounded-lg shadow-sm"
          initial={{ left: "8%" }}
          animate={{ left: ["8%", "45%", "82%"] }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: ti * 0.04 }}
          style={{ opacity }}
        />
      ))}
      <motion.div
        className="absolute top-2"
        initial={{ left: "8%" }}
        animate={{
          left:   ["8%",  "50%", "85%"],
          top:    ["8px", "-6px", "8px"],
          rotate: [0, -6, 2, 0],
          scale:  [1, 0.88, 1],
        }}
        transition={{ duration: 0.95, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      >
        <div className="w-10 h-12 bg-white border-2 border-[#f59e0b] rounded-lg shadow-md flex flex-col items-center justify-center gap-0.5 p-1.5">
          <div className="w-full h-0.5 bg-[#f59e0b] rounded" />
          <div className="w-3/4 h-0.5 bg-[#E8E4DD] rounded" />
          <div className="w-full h-0.5 bg-[#E8E4DD] rounded" />
          <div className="w-2/3 h-0.5 bg-[#E8E4DD] rounded" />
          <p className="text-[7px] font-bold text-[#D97706] mt-0.5">{label}</p>
        </div>
      </motion.div>
      <div className="absolute right-[6%] top-3 flex flex-col items-center gap-1 opacity-60">
        <div className="w-10 h-8 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg flex items-center justify-center">
          <span className="text-sm">📥</span>
        </div>
        <p className="text-[8px] text-[#9CA3AF] font-medium">Inbox</p>
      </div>
    </div>
  );
}

// ─── Stamp Animation ──────────────────────────────────────────────────────────

export function StampAnimation({
  text,
  color = "#16a34a",
  onStamped,
}: {
  text: string;
  color?: string;
  onStamped: () => void;
}) {
  const [stamped, setStamped] = useState(false);
  const [inked, setInked] = useState(false);
  const [paperShake, setPaperShake] = useState(false);

  const handleStamp = () => {
    if (stamped) return;
    setStamped(true);
    setTimeout(() => {
      setInked(true);
      setPaperShake(true);
      onStamped();
      setTimeout(() => setPaperShake(false), 450);
    }, 380);
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <motion.div
        onClick={handleStamp}
        animate={
          stamped
            ? { y: [0, 64, -10, 2, 0], scaleY: [1, 0.80, 1.12, 1], rotate: [0, -3, 1, 0] }
            : { y: [0, -5, 0] }
        }
        transition={
          stamped
            ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        className={`cursor-pointer ${stamped ? "" : "hover:scale-105 transition-transform"}`}
        title="Click to stamp"
      >
        <div className="flex flex-col items-center gap-0">
          <div className="w-14 h-10 rounded-t-xl bg-[#374151] flex items-center justify-center shadow-md">
            <div className="w-6 h-1.5 bg-[#4B5563] rounded" />
          </div>
          <div className="w-20 h-7 rounded-sm flex items-center justify-center" style={{ backgroundColor: color, opacity: 0.9 }}>
            <p className="text-white text-[10px] font-black tracking-[0.15em]">{text}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={paperShake ? { x: [-5, 5, -4, 4, -2, 2, 0], y: [0, -2, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="relative w-56 h-32 bg-white border border-[#E8E4DD] rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center gap-2 p-4"
      >
        <div className="w-full h-0.5 bg-[#E8E4DD]" />
        <p className="text-xs text-[#9CA3AF]">Click the stamp above</p>
        <div className="w-3/4 h-0.5 bg-[#E8E4DD]" />

        <AnimatePresence>
          {inked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="px-5 py-2.5 border-4 rounded-lg" style={{ borderColor: color, color }}>
                <p className="text-xl font-black tracking-widest" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                  {text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {!stamped ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
            className="text-xs text-[#9CA3AF]"
          >
            ↑ Click the stamp to proceed
          </motion.p>
        ) : (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-semibold text-green-600"
          >
            ✓ Stamped!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
