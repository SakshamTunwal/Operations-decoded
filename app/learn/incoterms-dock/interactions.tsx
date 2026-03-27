"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import {
  INCOTERMS, FOB_STAGES, CUSTOMS_DOCUMENTS, DETENTION_DAYS,
  MATRIX_STAGES, MATRIX_INCOTERMS, CORRECT_MATRIX, fmt,
} from "./constants";
import type { GameState } from "./types";

// Re-export animations from P2P for consistency
export { DocumentFlyAnimation, StampAnimation } from "../procure-to-pay/interactions";

// ─── LearnMore ────────────────────────────────────────────────────────────────

interface LearnMoreProps {
  title: string;
  children: React.ReactNode;
}

export function LearnMore({ title, children }: LearnMoreProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-xl border border-[#E8E4DD] overflow-hidden">
      <button
        suppressHydrationWarning
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F0E8] hover:bg-[#EDE8DF] transition-colors cursor-pointer"
      >
        <span className="text-xs font-semibold text-[#92400E] flex items-center gap-2">
          <span>📖</span> {title}
        </span>
        {open ? <ChevronUp size={14} className="text-[#D97706]" /> : <ChevronDown size={14} className="text-[#D97706]" />}
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
            <div className="px-4 py-3 text-xs text-[#4B5563] leading-relaxed bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── IncotermSelector (Scene 2) ───────────────────────────────────────────────

interface IncotermSelectorProps {
  gs: GameState;
  onConfirm: (code: string) => void;
}

export function IncotermSelector({ gs, onConfirm }: IncotermSelectorProps) {
  const [selected, setSelected] = useState(gs.chosenIncoterm || "");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(!!gs.chosenIncoterm);

  if (confirmed && gs.chosenIncoterm) {
    const term = INCOTERMS.find((t) => t.code === gs.chosenIncoterm)!;
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">
              Delivery term confirmed: <span className="font-black">{term.code} — {term.name}</span>
            </p>
            <p className="text-xs text-green-700 mt-0.5">{term.tagline}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Which delivery term should Nexara request from Jinshen?
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {INCOTERMS.map((term) => {
          const isSelected = selected === term.code;
          const isExpanded = expanded === term.code;
          return (
            <div key={term.code} className="flex flex-col gap-1">
              <button
                suppressHydrationWarning
                onClick={() => {
                  setSelected(term.code);
                  setExpanded(isExpanded ? null : term.code);
                }}
                className={`relative rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#f59e0b] bg-[#FEF3C7] shadow-md"
                    : "border-[#E8E4DD] bg-white hover:border-[#f59e0b]/50"
                }`}
              >
                {term.recommended && (
                  <span className="absolute -top-2 left-3 text-[9px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <p className="text-lg font-black text-[#1A1A1A]">{term.code}</p>
                <p className="text-[10px] font-semibold text-[#6B7280] mt-0.5 leading-tight">{term.name}</p>
                <p className="text-[9px] text-[#9CA3AF] mt-1 leading-tight">{term.tagline}</p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence mode="wait">
        {expanded && (() => {
          const term = INCOTERMS.find((t) => t.code === expanded)!;
          return (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-[#E8E4DD] bg-white p-4 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
                      Jinshen (Seller) covers:
                    </p>
                    <ul className="flex flex-col gap-1">
                      {term.sellerCovers.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-[#374151]">
                          <CheckCircle2 size={11} className="text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {term.buyerCovers.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                        Nexara (Buyer) covers:
                      </p>
                      <ul className="flex flex-col gap-1">
                        {term.buyerCovers.map((item) => (
                          <li key={item} className="flex items-start gap-1.5 text-xs text-[#374151]">
                            <CheckCircle2 size={11} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {term.warning && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{term.warning}</p>
                </div>
              )}
              {term.caution && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{term.caution}</p>
                </div>
              )}
              {term.tip && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800">{term.tip}</p>
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {selected && (
        <motion.button
          suppressHydrationWarning
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => { setConfirmed(true); onConfirm(selected); }}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl transition-colors cursor-pointer"
        >
          Confirm {selected} Terms →
        </motion.button>
      )}
    </div>
  );
}

// ─── ResponsibilityMapper (Scene 3) ───────────────────────────────────────────

interface ResponsibilityMapperProps {
  gs: GameState;
  onComplete: (map: Record<string, string>) => void;
}

export function ResponsibilityMapper({ gs, onComplete }: ResponsibilityMapperProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(gs.responsibilityMap || {});
  const [submitted, setSubmitted] = useState(Object.keys(gs.responsibilityMap || {}).length === FOB_STAGES.length);
  const [score, setScore] = useState<number | null>(null);

  const allAnswered = FOB_STAGES.every((s) => answers[s.id]);

  const handleSubmit = () => {
    const correct = FOB_STAGES.filter((s) => answers[s.id] === s.correctAnswer).length;
    setScore(correct);
    setSubmitted(true);
    onComplete(answers);
  };

  if (submitted && score !== null) {
    return (
      <div className="flex flex-col gap-3">
        <div className={`rounded-xl border-2 p-4 ${score === FOB_STAGES.length ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          <p className={`text-sm font-bold ${score === FOB_STAGES.length ? "text-green-800" : "text-amber-800"}`}>
            {score === FOB_STAGES.length
              ? `Perfect! ${score}/${FOB_STAGES.length} — You understand the FOB split exactly.`
              : `${score}/${FOB_STAGES.length} correct. Review the stages below.`}
          </p>
        </div>
        <div className="grid gap-1.5">
          {FOB_STAGES.map((stage) => {
            const isCorrect = answers[stage.id] === stage.correctAnswer;
            const isJinshen = stage.correctAnswer === "S";
            return (
              <div key={stage.id} className="flex items-center justify-between rounded-lg border border-[#E8E4DD] px-3 py-2 bg-white">
                <span className="text-xs text-[#374151]">{stage.label}</span>
                <div className="flex items-center gap-2">
                  {!isCorrect && (
                    <span className="text-[10px] text-red-500 font-semibold">
                      (you: {answers[stage.id] === "S" ? "Jinshen" : "Nexara"})
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isJinshen ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {isJinshen ? "Jinshen" : "Nexara"}
                  </span>
                  {isCorrect
                    ? <CheckCircle2 size={13} className="text-green-500" />
                    : <XCircle size={13} className="text-red-400" />
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Under FOB — who handles each stage?
      </p>
      <div className="flex gap-3 text-[10px] font-bold">
        <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full">Jinshen (Seller)</span>
        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">Nexara (Buyer)</span>
      </div>
      <div className="grid gap-1.5">
        {FOB_STAGES.map((stage) => {
          const val = answers[stage.id];
          return (
            <div key={stage.id} className="flex items-center justify-between rounded-lg border border-[#E8E4DD] px-3 py-2 bg-white">
              <span className="text-xs text-[#374151]">{stage.label}</span>
              <div className="flex gap-1.5">
                <button
                  suppressHydrationWarning
                  onClick={() => setAnswers((prev) => ({ ...prev, [stage.id]: "S" }))}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    val === "S"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
                  }`}
                >
                  Jinshen
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setAnswers((prev) => ({ ...prev, [stage.id]: "B" }))}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    val === "B"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  Nexara
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        suppressHydrationWarning
        disabled={!allAnswered}
        onClick={handleSubmit}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
          allAnswered
            ? "bg-[#f59e0b] hover:bg-[#D97706] text-black"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Check FOB Assignment →
      </button>
    </div>
  );
}

// ─── DetentionMeter (Scene 4) ─────────────────────────────────────────────────

interface DetentionMeterProps {
  onComplete: () => void;
}

export function DetentionMeter({ onComplete }: DetentionMeterProps) {
  const [revealed, setRevealed] = useState(1);
  const [called, setCalled]     = useState(false);

  const totalDetention  = DETENTION_DAYS.slice(0, revealed).reduce((s, d) => s + d.detention, 0);
  const totalDemurrage  = DETENTION_DAYS.slice(0, revealed).reduce((s, d) => s + d.demurrage, 0);
  const total           = totalDetention + totalDemurrage;
  const allRevealed     = revealed === DETENTION_DAYS.length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Container sitting on the dock — costs mounting
      </p>

      <div className="grid gap-2">
        {DETENTION_DAYS.map((day, i) => {
          const isVisible = i < revealed;
          const dayTotal = day.detention + day.demurrage;
          return (
            <AnimatePresence key={day.day}>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className={`rounded-xl border p-3 ${
                    day.status === "free"
                      ? "border-amber-200 bg-amber-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          day.status === "free"
                            ? "bg-amber-200 text-amber-800"
                            : "bg-red-200 text-red-800"
                        }`}>
                          Day {day.day} — {day.label}
                        </span>
                        {day.status === "free" && (
                          <span className="text-[9px] text-green-700 font-semibold">FREE DAY</span>
                        )}
                      </div>
                      <p className="text-xs text-[#4B5563]">{day.event}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {day.detention > 0 && (
                        <p className="text-[10px] text-red-600">Detention: <span className="font-bold">${fmt(day.detention)}</span></p>
                      )}
                      {day.demurrage > 0 && (
                        <p className="text-[10px] text-red-600">Demurrage: <span className="font-bold">${fmt(day.demurrage)}</span></p>
                      )}
                      {dayTotal > 0 && (
                        <p className="text-xs font-black text-red-700 mt-0.5">${fmt(dayTotal)}</p>
                      )}
                      {day.status === "free" && (
                        <p className="text-xs font-bold text-green-600">$0</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Running total */}
      {revealed > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between rounded-xl bg-red-100 border border-red-200 px-4 py-2.5"
        >
          <span className="text-xs font-semibold text-red-700">Running total (avoidable costs)</span>
          <span className="text-lg font-black text-red-700">${fmt(total)}</span>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        {!allRevealed && (
          <button
            suppressHydrationWarning
            onClick={() => setRevealed((v) => Math.min(v + 1, DETENTION_DAYS.length))}
            className="px-4 py-2 text-xs font-semibold bg-[#E8E4DD] hover:bg-[#D5CFC7] text-[#1A1A1A] rounded-lg transition-colors cursor-pointer"
          >
            Next day →
          </button>
        )}
        {allRevealed && !called && (
          <motion.button
            suppressHydrationWarning
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => { setCalled(true); onComplete(); }}
            className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            📞 Call Hassan — emergency broker
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── DocumentChecker (Scene 5) ────────────────────────────────────────────────

interface DocumentCheckerProps {
  gs: GameState;
  onComplete: (docs: string[]) => void;
}

export function DocumentChecker({ gs, onComplete }: DocumentCheckerProps) {
  const [checked, setChecked]     = useState<Set<string>>(new Set(gs.documentsChecked));
  const [submitted, setSubmitted] = useState(gs.documentsChecked.length > 0);
  const [result, setResult]       = useState<{ missing: string[]; hasSpec: boolean } | null>(null);

  const toggle = (id: string) => {
    if (submitted) return;
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    const missing = CUSTOMS_DOCUMENTS.filter((d) => d.required && !checked.has(d.id)).map((d) => d.label);
    const hasSpec = checked.has("techspec");
    setResult({ missing, hasSpec });
    setSubmitted(true);
    onComplete(Array.from(checked));
  };

  if (submitted && result) {
    const allRequired = result.missing.length === 0;
    return (
      <div className="flex flex-col gap-3">
        <div className={`rounded-xl border-2 p-4 ${allRequired ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          {allRequired ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">All required documents sent to broker.</p>
                {result.hasSpec && (
                  <p className="text-xs text-green-700 mt-1">
                    ✓ Technical spec sheet included — HS code classification resolved within hours.
                  </p>
                )}
                {!result.hasSpec && (
                  <p className="text-xs text-amber-700 mt-1">
                    No tech spec sent — HS code dispute took longer to resolve. Included on second shipment.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800">Missing required documents:</p>
                <ul className="mt-1 flex flex-col gap-0.5">
                  {result.missing.map((m) => (
                    <li key={m} className="text-xs text-red-700">• {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-1.5">
          {CUSTOMS_DOCUMENTS.map((doc) => (
            <div key={doc.id} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 ${
              checked.has(doc.id) ? "border-green-200 bg-green-50" : "border-[#E8E4DD] bg-white"
            }`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                checked.has(doc.id) ? "bg-green-500" : "bg-[#E8E4DD]"
              }`}>
                {checked.has(doc.id) && <CheckCircle2 size={11} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#1A1A1A]">{doc.label}</span>
                  {doc.required && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Required</span>}
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Select documents to send to the customs broker
      </p>
      <div className="grid gap-1.5">
        {CUSTOMS_DOCUMENTS.map((doc) => {
          const isChecked = checked.has(doc.id);
          return (
            <button
              suppressHydrationWarning
              key={doc.id}
              onClick={() => toggle(doc.id)}
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-all cursor-pointer ${
                isChecked
                  ? "border-[#f59e0b] bg-[#FEF3C7]"
                  : "border-[#E8E4DD] bg-white hover:border-[#f59e0b]/40"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                isChecked ? "bg-[#f59e0b] border-[#f59e0b]" : "border-[#E8E4DD]"
              }`}>
                {isChecked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-[#1A1A1A]">{doc.label}</span>
                  {doc.required && (
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Required</span>
                  )}
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{doc.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        suppressHydrationWarning
        disabled={checked.size === 0}
        onClick={handleSubmit}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
          checked.size > 0
            ? "bg-[#f59e0b] hover:bg-[#D97706] text-black"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Send to Broker →
      </button>
    </div>
  );
}

// ─── CostBreakdown (Scene 6) ──────────────────────────────────────────────────

interface CostBreakdownProps {
  onComplete: () => void;
}

export function CostBreakdown({ onComplete }: CostBreakdownProps) {
  const [revealed, setRevealed] = useState(0);
  const [done, setDone]         = useState(false);

  const items = [
    { label: "Port detention",        detail: "$800/day × 4 days", amount: 3200, color: "text-red-700" },
    { label: "Demurrage charges",     detail: "Shipping line, $200/day × 3", amount: 600, color: "text-red-700" },
    { label: "Emergency brokerage",   detail: "Premium above pre-arranged rate", amount: 1400, color: "text-red-700" },
  ];
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Total cost of missing one operational step
      </p>

      <div className="rounded-xl border border-[#E8E4DD] bg-white overflow-hidden">
        {items.slice(0, revealed).map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between px-4 py-3 border-b border-[#E8E4DD] last:border-0"
          >
            <div>
              <p className="text-xs font-semibold text-[#1A1A1A]">{item.label}</p>
              <p className="text-[10px] text-[#9CA3AF]">{item.detail}</p>
            </div>
            <span className={`text-sm font-bold ${item.color}`}>${fmt(item.amount)}</span>
          </motion.div>
        ))}

        {revealed === items.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between px-4 py-3 bg-red-50"
          >
            <p className="text-sm font-black text-red-800">Total avoidable cost</p>
            <p className="text-xl font-black text-red-700">${fmt(total)}</p>
          </motion.div>
        )}
      </div>

      <div className="flex gap-2">
        {revealed < items.length && (
          <button
            suppressHydrationWarning
            onClick={() => setRevealed((v) => v + 1)}
            className="px-4 py-2 text-xs font-semibold bg-[#E8E4DD] hover:bg-[#D5CFC7] text-[#1A1A1A] rounded-lg transition-colors cursor-pointer"
          >
            Reveal next line →
          </button>
        )}
        {revealed === items.length && !done && (
          <motion.button
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setDone(true); onComplete(); }}
            className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Build the fix →
          </motion.button>
        )}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs text-amber-800">
          <span className="font-bold">The lesson:</span> The components arrived undamaged. Mei's team was flawless. Hassan's logistics were perfect. The $5,200 cost came entirely from one gap: no customs broker engaged before the vessel arrived.
        </p>
      </div>
    </div>
  );
}

// ─── MatrixBuilder (Scene 7) ──────────────────────────────────────────────────

interface MatrixBuilderProps {
  gs: GameState;
  onComplete: (answers: Record<string, string>) => void;
}

export function MatrixBuilder({ gs, onComplete }: MatrixBuilderProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(gs.matrixAnswers || {});
  const [submitted, setSubmitted] = useState(Object.keys(gs.matrixAnswers || {}).length === MATRIX_STAGES.length * MATRIX_INCOTERMS.length);
  const [score, setScore]         = useState<number | null>(null);

  const total = MATRIX_STAGES.length * MATRIX_INCOTERMS.length;
  const filled = Object.keys(answers).length;

  const toggle = (stageId: string, term: string) => {
    if (submitted) return;
    const key = `${stageId}-${term}`;
    setAnswers((prev) => {
      const next = { ...prev };
      if (!next[key]) next[key] = "S";
      else if (next[key] === "S") next[key] = "B";
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    const correct = Object.entries(CORRECT_MATRIX).filter(([k, v]) => answers[k] === v).length;
    setScore(correct);
    setSubmitted(true);
    onComplete(answers);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Incoterms Responsibility Matrix — click each cell to toggle S (Seller) / B (Buyer)
        </p>
        {!submitted && (
          <span className="text-[10px] text-[#9CA3AF]">{filled}/{total} filled</span>
        )}
        {submitted && score !== null && (
          <span className={`text-xs font-bold ${score === total ? "text-green-600" : "text-amber-600"}`}>
            {score}/{total} correct
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 pr-3 text-[10px] font-semibold text-[#9CA3AF] uppercase min-w-[120px]">
                Stage
              </th>
              {MATRIX_INCOTERMS.map((term) => (
                <th key={term} className="py-2 px-1 text-center font-black text-[#1A1A1A] w-[70px]">
                  {term}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_STAGES.map((stage, si) => (
              <tr key={stage.id} className={si % 2 === 0 ? "bg-[#FAFAF9]" : "bg-white"}>
                <td className="py-1.5 pr-3 text-[11px] text-[#374151] font-medium">{stage.label}</td>
                {MATRIX_INCOTERMS.map((term) => {
                  const key     = `${stage.id}-${term}`;
                  const val     = answers[key];
                  const correct = CORRECT_MATRIX[key];
                  const isRight = submitted ? val === correct : null;

                  return (
                    <td key={term} className="py-1 px-1 text-center">
                      <button
                        suppressHydrationWarning
                        onClick={() => toggle(stage.id, term)}
                        className={`w-14 h-7 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                          submitted
                            ? isRight
                              ? val === "S"
                                ? "bg-teal-100 text-teal-700 border-teal-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                              : val
                                ? "bg-red-100 text-red-700 border-red-200"
                                : correct === "S"
                                  ? "bg-teal-50 text-teal-400 border-teal-100"
                                  : "bg-blue-50 text-blue-400 border-blue-100"
                            : val === "S"
                              ? "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200"
                              : val === "B"
                                ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                                : "bg-[#E8E4DD] text-[#9CA3AF] border-[#E8E4DD] hover:bg-[#D5CFC7]"
                        }`}
                      >
                        {submitted && !val ? correct : val || "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-teal-100 inline-block border border-teal-200" /> S = Seller</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-blue-100 inline-block border border-blue-200" /> B = Buyer</span>
        {!submitted && <span className="text-[#9CA3AF]">Click to cycle: — → S → B → —</span>}
      </div>

      {!submitted && (
        <button
          suppressHydrationWarning
          disabled={filled < total}
          onClick={handleSubmit}
          className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
            filled === total
              ? "bg-[#f59e0b] hover:bg-[#D97706] text-black"
              : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
          }`}
        >
          Submit Matrix →
        </button>
      )}

      {submitted && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border-2 p-4 ${
            score === total ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className={`text-sm font-bold ${score === total ? "text-green-800" : "text-amber-800"}`}>
            {score === total
              ? "Perfect matrix! This is the reference Elena pinned to her wall."
              : `${score}/${total} — cells highlighted in red show where the correct answer differs.`}
          </p>
          <p className="text-xs mt-1 text-[#6B7280]">
            Pattern: EXW = all Buyer. FOB = first 4 Seller. CIF = first 6 Seller. DDP = all Seller.
          </p>
        </motion.div>
      )}
    </div>
  );
}
