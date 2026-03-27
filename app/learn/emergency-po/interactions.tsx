"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  PROCUREMENT_CHOICES,
  EMERGENCY_SCENARIOS,
  JUSTIFICATION_FIELDS,
  RECEIPT_ITEMS,
  AUDIT_DOCUMENTS,
  FRAMEWORK_ELEMENTS,
} from "./constants";

// Re-export for optional use in page
export { DocumentFlyAnimation } from "../procure-to-pay/interactions";

// ─── ProcurementChoiceCard ─────────────────────────────────────────────────────

interface ProcurementChoiceCardProps {
  onDone: (correct: boolean, choiceId: string) => void;
}

export function ProcurementChoiceCard({ onDone }: ProcurementChoiceCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const choice = PROCUREMENT_CHOICES.find((c) => c.id === selected);
  const correct = choice?.correct ?? false;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  if (submitted && choice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className={`rounded-2xl border-2 p-5 ${correct ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-start gap-3">
            {correct
              ? <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              : <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-bold ${correct ? "text-green-800" : "text-red-800"}`}>
                {correct ? "Correct decision." : `You chose: ${choice.label}`}
              </p>
              <p className={`text-xs mt-1.5 leading-relaxed ${correct ? "text-green-700" : "text-red-700"}`}>
                {choice.feedback}
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(correct, selected!)}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {correct ? "Issue the PO →" : "See the right approach →"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        What should Ryan do?
      </p>
      <div className="flex flex-col gap-2">
        {PROCUREMENT_CHOICES.map((c) => {
          const isSelected = selected === c.id;
          return (
            <motion.button
              key={c.id}
              suppressHydrationWarning
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(c.id)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#f59e0b] bg-[#FEF3C7]"
                  : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{c.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{c.sublabel}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        suppressHydrationWarning
        disabled={!selected}
        onClick={handleSubmit}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          selected
            ? "bg-[#f59e0b] hover:bg-[#D97706] text-black cursor-pointer"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Confirm decision →
      </button>
    </div>
  );
}

// ─── EmergencyClassifier ───────────────────────────────────────────────────────

interface EmergencyClassifierProps {
  onDone: (score: number, firstCorrect: boolean) => void;
}

export function EmergencyClassifier({ onDone }: EmergencyClassifierProps) {
  const [idx, setIdx]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealedState] = useState(false);
  const [score, setScore]   = useState(0);

  const scenario = EMERGENCY_SCENARIOS[idx];
  const selected = answers[scenario.id];
  const isCorrect = selected === scenario.classification;

  const handleAnswer = (ans: string) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [scenario.id]: ans }));
    setRevealedState(true);
    if (ans === scenario.classification) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (idx < EMERGENCY_SCENARIOS.length - 1) {
      setIdx((i) => i + 1);
      setRevealedState(false);
    } else {
      const firstCorrect = answers[EMERGENCY_SCENARIOS[0].id] === EMERGENCY_SCENARIOS[0].classification;
      onDone(score + (isCorrect ? 0 : 0), answers[EMERGENCY_SCENARIOS[0].id] === "genuine");
    }
  };

  // Fix: compute final score correctly
  const handleNextFinal = useCallback(() => {
    const finalScore = Object.entries(answers).filter(([id, ans]) => {
      const s = EMERGENCY_SCENARIOS.find((sc) => sc.id === id);
      return s?.classification === ans;
    }).length + (isCorrect ? 1 : 0);

    const firstScenarioAnswer = idx === 0 ? selected : answers[EMERGENCY_SCENARIOS[0].id];
    const firstCorrect = firstScenarioAnswer === EMERGENCY_SCENARIOS[0].classification;
    onDone(finalScore, firstCorrect);
  }, [answers, idx, isCorrect, selected, onDone]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Emergency Classification
        </p>
        <span className="text-[10px] bg-[#F5F0E8] border border-[#E8E4DD] px-2 py-0.5 rounded-full text-[#9CA3AF] font-mono">
          {idx + 1}/{EMERGENCY_SCENARIOS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#E8E4DD] rounded-xl p-4"
        >
          <p className="text-sm text-[#1A1A1A] leading-relaxed mb-4">{scenario.description}</p>

          <div className="flex gap-3 flex-wrap">
            {[
              { value: "genuine",          label: "Genuine Emergency",  color: "border-green-300 bg-green-50 text-green-800",  activeColor: "border-green-500 bg-green-100" },
              { value: "planning-failure", label: "Planning Failure",   color: "border-red-200 bg-red-50 text-red-700",        activeColor: "border-red-400 bg-red-100" },
            ].map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  suppressHydrationWarning
                  onClick={() => handleAnswer(opt.value)}
                  disabled={revealed}
                  className={`px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                    isSelected ? opt.activeColor : `${opt.color} hover:opacity-80`
                  } ${revealed ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden mt-3"
              >
                <div className={`rounded-lg px-4 py-3 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
                  <p className={`text-xs font-bold mb-1 ${isCorrect ? "text-green-800" : "text-[#92400E]"}`}>
                    {isCorrect ? "✓ Correct" : `✗ This is: ${scenario.classification === "genuine" ? "Genuine Emergency" : "Planning Failure"}`}
                  </p>
                  <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-700" : "text-[#92400E]"}`}>
                    {scenario.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          suppressHydrationWarning
          onClick={idx < EMERGENCY_SCENARIOS.length - 1 ? handleNext : handleNextFinal}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {idx < EMERGENCY_SCENARIOS.length - 1 ? "Next scenario →" : "See PO authorization →"}
        </motion.button>
      )}
    </div>
  );
}

// ─── JustificationBuilder ──────────────────────────────────────────────────────

interface JustificationBuilderProps {
  onDone: (score: number) => void;
}

export function JustificationBuilder({ onDone }: JustificationBuilderProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [showHint, setShowHint] = useState<string | null>(null);

  const handleSubmit = () => {
    const res: Record<string, boolean> = {};
    JUSTIFICATION_FIELDS.forEach((f) => {
      const answer = (values[f.id] ?? "").toLowerCase();
      const matched = f.correctKeywords.filter((kw) => answer.includes(kw)).length;
      res[f.id] = matched >= 2;
    });
    setResults(res);
  };

  const score = results ? Object.values(results).filter(Boolean).length : 0;

  if (results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-sm font-bold text-[#1A1A1A]">
            Justification scored: <span className={score >= 3 ? "text-green-600" : score >= 2 ? "text-amber-600" : "text-red-500"}>{score}/4 fields</span>
          </p>
          {JUSTIFICATION_FIELDS.map((f) => (
            <div key={f.id} className="flex items-start gap-2.5">
              {results[f.id]
                ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                : <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">{f.question}</p>
                {!results[f.id] && (
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Hint: {f.hint}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(score)}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          File the justification →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Single-Source Justification — EP-2024-009
      </p>
      {JUSTIFICATION_FIELDS.map((f) => (
        <div key={f.id} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1A1A1A]">{f.question}</label>
            <button
              suppressHydrationWarning
              onClick={() => setShowHint(showHint === f.id ? null : f.id)}
              className="text-[10px] text-[#9CA3AF] hover:text-[#D97706] cursor-pointer transition-colors"
            >
              {showHint === f.id ? "Hide hint" : "Need a hint?"}
            </button>
          </div>
          <AnimatePresence>
            {showHint === f.id && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] text-[#D97706] bg-[#FEF3C7] px-3 py-1.5 rounded-lg overflow-hidden"
              >
                {f.hint}
              </motion.p>
            )}
          </AnimatePresence>
          <textarea
            suppressHydrationWarning
            value={values[f.id] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
            placeholder={f.placeholder}
            rows={2}
            className="w-full rounded-xl border border-[#E8E4DD] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] placeholder-[#C4BDB5] resize-none focus:outline-none focus:border-[#f59e0b] transition-colors"
          />
        </div>
      ))}
      <button
        suppressHydrationWarning
        onClick={handleSubmit}
        className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
      >
        Score justification →
      </button>
    </div>
  );
}

// ─── ReceiptVerifier ───────────────────────────────────────────────────────────

interface ReceiptVerifierProps {
  onDone: (score: number) => void;
}

export function ReceiptVerifier({ onDone }: ReceiptVerifierProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (submitted) {
    const score = checked.size;
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div className={`rounded-2xl border-2 p-5 ${score === 3 ? "border-green-300 bg-green-50" : "border-amber-200 bg-[#FEF3C7]"}`}>
          <p className={`text-sm font-bold ${score === 3 ? "text-green-800" : "text-[#92400E]"}`}>
            {score === 3 ? "All three items verified. Receipt accepted." : `${score}/3 items verified. Check the receipt carefully.`}
          </p>
          {score < 3 && (
            <p className="text-xs text-[#92400E] mt-1">
              Every item matters. A missing PO number or individual-name invoice creates an audit gap.
            </p>
          )}
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(score)}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Part secured →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stylized receipt */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
        {/* Receipt header */}
        <div className="bg-[#1E3A5F] text-white px-5 py-3">
          <p className="text-xs font-bold tracking-wider">FASTPARTS CO. — RECEIPT</p>
          <p className="text-[10px] opacity-70">14 Industrial Boulevard · Friday 5:18 PM</p>
        </div>
        <div className="px-5 py-4 border-b border-dashed border-[#E8E4DD]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-[#9CA3AF]">Part No.</p>
              <p className="text-sm font-bold text-[#1C1917]">HDS-4420-R</p>
              <p className="text-[11px] text-[#6B7280]">Kessler Hydraulic Seal Assembly</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#9CA3AF]">Amount</p>
              <p className="text-lg font-black text-[#1C1917]">$4,200.00</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-[#6B7280]">
            <div className="flex justify-between">
              <span>Bill To:</span>
              <span className="font-semibold text-[#1C1917]">Nexara Industrial Ltd.</span>
            </div>
            <div className="flex justify-between">
              <span>PO Reference:</span>
              <span className="font-semibold text-[#1C1917]">EP-2024-009</span>
            </div>
            <div className="flex justify-between">
              <span>Terms:</span>
              <span className="font-semibold text-[#1C1917]">Net-15</span>
            </div>
          </div>
        </div>
        <div className="px-5 py-3">
          <p className="text-[10px] text-[#9CA3AF]">Verify before leaving the counter:</p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-2">
        {RECEIPT_ITEMS.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <motion.button
              key={item.id}
              suppressHydrationWarning
              whileTap={{ scale: 0.99 }}
              onClick={() => toggle(item.id)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all cursor-pointer ${
                isChecked ? "border-green-300 bg-green-50" : "border-[#E8E4DD] bg-white hover:border-[#f59e0b]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 mt-0.5 ${
                  isChecked ? "bg-green-500 border-green-500" : "border-[#E8E4DD]"
                }`}>
                  {isChecked && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{item.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        suppressHydrationWarning
        onClick={() => setSubmitted(true)}
        className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
      >
        Confirm verification →
      </button>
    </div>
  );
}

// ─── AuditDocumentAssembler ────────────────────────────────────────────────────

interface AuditDocumentAssemblerProps {
  onDone: () => void;
}

export function AuditDocumentAssembler({ onDone }: AuditDocumentAssemblerProps) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [allDone, setAllDone] = useState(false);

  const markReviewed = (id: string) => {
    const next = new Set(reviewed);
    next.add(id);
    setReviewed(next);
    if (next.size === AUDIT_DOCUMENTS.length) setAllDone(true);
  };

  if (allDone) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Audit Complete — EP-2024-009: Clean Pass</p>
              <p className="text-xs text-green-700 mt-1">
                All 6 documents reviewed. Complete, consistent, chronological. Diane's review closed in under one business day.
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={onDone}
          className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Proceed →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Review Audit Folder</p>
        <span className="text-[10px] bg-[#F5F0E8] border border-[#E8E4DD] px-2 py-0.5 rounded-full text-[#9CA3AF] font-mono">
          {reviewed.size}/{AUDIT_DOCUMENTS.length} reviewed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {AUDIT_DOCUMENTS.map((doc) => {
          const isReviewed = reviewed.has(doc.id);
          return (
            <motion.button
              key={doc.id}
              suppressHydrationWarning
              whileHover={!isReviewed ? { scale: 1.01 } : {}}
              whileTap={!isReviewed ? { scale: 0.99 } : {}}
              onClick={() => !isReviewed && markReviewed(doc.id)}
              className={`text-left rounded-xl border-2 px-4 py-3 transition-all ${
                isReviewed
                  ? "border-green-200 bg-green-50 cursor-default"
                  : "border-[#E8E4DD] bg-white hover:border-[#f59e0b]/50 cursor-pointer"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">{doc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#1A1A1A] truncate">{doc.title}</p>
                    {isReviewed && <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{doc.timestamp}</p>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-tight">{doc.role}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {reviewed.size < AUDIT_DOCUMENTS.length && (
        <p className="text-[11px] text-[#9CA3AF]">Click each document card to mark as reviewed.</p>
      )}
    </div>
  );
}

// ─── FrameworkBuilder ──────────────────────────────────────────────────────────

interface FrameworkBuilderProps {
  onDone: (score: number) => void;
}

export function FrameworkBuilder({ onDone }: FrameworkBuilderProps) {
  // Match descriptions to titles
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeDesc, setActiveDesc] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleTitleClick = (titleId: string) => {
    if (!activeDesc || submitted) return;
    setMatches((prev) => ({ ...prev, [activeDesc]: titleId }));
    setActiveDesc(null);
  };

  const handleDescClick = (descId: string) => {
    if (submitted) return;
    setActiveDesc(activeDesc === descId ? null : descId);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = FRAMEWORK_ELEMENTS.filter((el) => matches[el.id] === el.id).length;
    setTimeout(() => onDone(score), 800);
  };

  const allMatched = FRAMEWORK_ELEMENTS.every((el) => matches[el.id]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Build the Framework — match each description to its pillar
        {activeDesc && <span className="ml-2 text-[#D97706] normal-case">Click a pillar to match →</span>}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Descriptions */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase">Descriptions</p>
          {FRAMEWORK_ELEMENTS.map((el) => {
            const isMatched = !!matches[el.id];
            const isActive  = activeDesc === el.id;
            return (
              <motion.button
                key={el.id}
                suppressHydrationWarning
                whileTap={!isMatched ? { scale: 0.99 } : {}}
                onClick={() => !isMatched && handleDescClick(el.id)}
                className={`text-left rounded-xl border-2 px-3 py-2.5 transition-all text-xs leading-relaxed ${
                  isMatched
                    ? "border-green-200 bg-green-50 text-green-800 cursor-default opacity-70"
                    : isActive
                    ? "border-[#f59e0b] bg-[#FEF3C7] text-[#1A1A1A] cursor-pointer"
                    : "border-[#E8E4DD] bg-white text-[#4B5563] hover:border-[#D97706]/40 cursor-pointer"
                }`}
              >
                {isMatched ? `✓ Matched: ${FRAMEWORK_ELEMENTS.find(e => e.id === el.id)?.title}` : el.description}
              </motion.button>
            );
          })}
        </div>

        {/* Titles */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase">Framework Pillars</p>
          {FRAMEWORK_ELEMENTS.map((el) => {
            const isMatched = Object.values(matches).includes(el.id);
            const correct   = submitted && matches[Object.keys(matches).find(k => matches[k] === el.id) ?? ""] === el.id;
            return (
              <motion.button
                key={el.id}
                suppressHydrationWarning
                whileTap={!isMatched && activeDesc ? { scale: 0.99 } : {}}
                onClick={() => handleTitleClick(el.id)}
                className={`text-left rounded-xl border-2 px-3 py-2.5 transition-all ${
                  submitted && isMatched
                    ? correct
                      ? "border-green-300 bg-green-50"
                      : "border-red-200 bg-red-50"
                    : isMatched
                    ? "border-green-200 bg-green-50 cursor-default"
                    : activeDesc
                    ? "border-[#f59e0b]/60 bg-[#FEF3C7]/50 cursor-pointer hover:border-[#f59e0b]"
                    : "border-[#E8E4DD] bg-[#F5F0E8] cursor-default"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{el.icon}</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">{el.title}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          suppressHydrationWarning
          disabled={!allMatched}
          onClick={handleSubmit}
          className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
            allMatched
              ? "bg-[#f59e0b] hover:bg-[#D97706] text-black cursor-pointer"
              : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
          }`}
        >
          Score framework →
        </button>
      )}

      {submitted && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[#9CA3AF]">
          Scoring and advancing...
        </motion.p>
      )}
    </div>
  );
}

// ─── CautionaryTale ────────────────────────────────────────────────────────────

interface CautionaryTaleProps {
  onDone: () => void;
}

export function CautionaryTale({ onDone }: CautionaryTaleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800 mb-2">What happens when controls are absent</p>
            <p className="text-xs text-red-700 leading-relaxed mb-3">
              A competitor in the same industry faced a similar emergency six months earlier. Their plant manager had a personal card with a high limit. No one said "don't." Eighteen months later, their internal audit found 23 transactions totalling <strong>$87,000</strong> — all coded as emergency maintenance.
            </p>
            <p className="text-xs text-red-700 leading-relaxed mb-3">
              The vendor was a sole trader registered to a relative's address. The parts were occasionally real. But the markups were 300–600% above market. No competitive quotes. No POs. No paper trail — just expense reimbursements that individually fell below the materiality threshold for finance review.
            </p>
            <p className="text-xs text-red-700 leading-relaxed">
              The plant manager hadn't planned a fraud. They'd just found a convenient shortcut. And the shortcut had been left open. <strong>The absence of a control is an invitation — not always accepted dishonestly, but always unprotected.</strong>
            </p>
          </div>
        </div>
      </div>
      <button
        suppressHydrationWarning
        onClick={onDone}
        className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
      >
        Noted — review the EP folder →
      </button>
    </motion.div>
  );
}
