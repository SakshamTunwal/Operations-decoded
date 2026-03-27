"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  ATP_BATCHES,
  ACKNOWLEDGEMENT_OPTIONS,
  QUALITY_CHOICES,
  INVOICE_FIELDS,
  AR_ESCALATION_STEPS,
  CREDIT_TERMS_OPTIONS,
} from "./constants";

// ─── SalesOrderBuilder ─────────────────────────────────────────────────────────

interface SalesOrderBuilderProps {
  onDone: () => void;
}

const SO_FIELDS = [
  {
    id: "customer",
    label: "Customer",
    correctValue: "Meridian Commerce",
    options: ["Meridian Commerce", "Brendan Holdings", "MER Industries", "Commerce Group Ltd"],
  },
  {
    id: "po-ref",
    label: "Customer PO Reference",
    correctValue: "MER-2024-1183",
    options: ["MER-2024-1183", "SO-7841", "PO-4412", "MER-2024-0091"],
  },
  {
    id: "quantity",
    label: "Total Quantity",
    correctValue: "50,000 units",
    options: ["50,000 units", "17,000 units", "175,000 units", "16,800 units"],
  },
  {
    id: "unit-price",
    label: "Unit Price",
    correctValue: "$3.50",
    options: ["$3.50", "$4.00", "$3.25", "$3.75"],
  },
  {
    id: "total",
    label: "Order Total",
    correctValue: "$175,000",
    options: ["$175,000", "$59,500", "$168,000", "$187,500"],
  },
];

export function SalesOrderBuilder({ onDone }: SalesOrderBuilderProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const handleSelect = (fieldId: string, value: string) => {
    if (confirmed.has(fieldId)) return;
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleConfirm = (fieldId: string) => {
    if (!selections[fieldId]) return;
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.add(fieldId);
      if (next.size === SO_FIELDS.length) {
        setTimeout(() => setDone(true), 400);
      }
      return next;
    });
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Sales Order SO-7841 Created ✓</p>
              <p className="text-xs text-green-700 mt-1">
                50,000 units · $175,000 · Net-30 · Meridian Commerce · PO MER-2024-1183
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={onDone}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Proceed to ATP check →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PO card — source */}
        <div className="bg-[#FEF3C7] border border-[#D97706]/40 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Brendan&apos;s Purchase Order</p>
          <p className="text-xs font-bold text-[#1A1A1A]">MER-2024-1183</p>
          <div className="text-xs text-[#4B5563] flex flex-col gap-1 mt-1">
            <span>Customer: Meridian Commerce</span>
            <span>Item: E-flute corrugated boxes, 4-colour print</span>
            <span>Qty: 50,000 units total (3 batches)</span>
            <span>Unit price: $3.50</span>
            <span>Total: $175,000</span>
            <span>Terms: Net-30</span>
            <span>Delivery: 3 batches over 6 weeks</span>
          </div>
        </div>

        {/* SO form — target */}
        <div className="bg-white border border-[#E8E4DD] rounded-xl p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-[#BE185D] uppercase tracking-wider">Sales Order Form SO-7841</p>
          {SO_FIELDS.map((field) => {
            const isConfirmed = confirmed.has(field.id);
            const selected = selections[field.id];
            return (
              <div key={field.id} className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-[#6B7280]">{field.label}</label>
                <div className="flex gap-2">
                  <select
                    suppressHydrationWarning
                    value={selected ?? ""}
                    onChange={(e) => handleSelect(field.id, e.target.value)}
                    disabled={isConfirmed}
                    className={`flex-1 rounded-lg border px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none transition-colors ${
                      isConfirmed
                        ? "border-green-200 bg-green-50 cursor-not-allowed"
                        : "border-[#E8E4DD] bg-white cursor-pointer focus:border-[#BE185D]"
                    }`}
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!isConfirmed ? (
                    <button
                      suppressHydrationWarning
                      disabled={!selected}
                      onClick={() => handleConfirm(field.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-shrink-0 ${
                        selected
                          ? "bg-[#BE185D] text-white cursor-pointer hover:bg-[#9D174D]"
                          : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                    >
                      ✓
                    </button>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-[#9CA3AF]">
        {confirmed.size}/{SO_FIELDS.length} fields confirmed. Select a value and click ✓ to confirm each field.
      </p>
    </div>
  );
}

// ─── ATPChecker ────────────────────────────────────────────────────────────────

interface ATPCheckerProps {
  onDone: (score: number) => void;
}

export function ATPChecker({ onDone }: ATPCheckerProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const batch = ATP_BATCHES[idx];
  const selected = answers[batch.id];
  const isCorrect = selected === batch.correctStatus;

  const handleAnswer = (status: string) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [batch.id]: status }));
    setRevealed(true);
    if (status === batch.correctStatus) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (idx < ATP_BATCHES.length - 1) {
      setIdx((i) => i + 1);
      setRevealed(false);
    } else {
      const finalScore = score + (isCorrect ? 0 : 0);
      // recalculate correctly
      const total = ATP_BATCHES.filter((b, i) => {
        const ans = i < idx ? answers[b.id] : i === idx ? selected : undefined;
        return ans === b.correctStatus;
      }).length;
      onDone(total);
    }
  };

  const handleFinalNext = () => {
    const total = ATP_BATCHES.filter((b) => {
      const ans = answers[b.id] ?? (b.id === batch.id ? selected : undefined);
      return ans === b.correctStatus;
    }).length;
    onDone(total);
  };

  const STATUS_CONFIG = [
    { value: "confirm",     label: "✓ Confirm",     className: "border-green-300 bg-green-50 text-green-800 hover:bg-green-100" },
    { value: "conditional", label: "⚠ Conditional", className: "border-amber-300 bg-[#FEF3C7] text-[#92400E] hover:bg-amber-100" },
    { value: "at-risk",     label: "⚡ At Risk",     className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">ATP Check</p>
        <span className="text-[10px] bg-[#F5F0E8] border border-[#E8E4DD] px-2 py-0.5 rounded-full text-[#9CA3AF] font-mono">
          {idx + 1}/{ATP_BATCHES.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#E8E4DD] rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#1A1A1A]">{batch.label} — {batch.qty.toLocaleString()} units</p>
              <p className="text-xs text-[#9CA3AF]">Deadline: {batch.deadline}</p>
            </div>
          </div>

          <div className="bg-[#F5F0E8] rounded-lg p-3 border border-[#E8E4DD]">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Sam&apos;s Report</p>
            <p className="text-xs text-[#4B5563] leading-relaxed">{batch.samReport}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUS_CONFIG.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  suppressHydrationWarning
                  onClick={() => handleAnswer(opt.value)}
                  disabled={revealed}
                  className={`px-4 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer ${opt.className} ${
                    isSelected ? "ring-2 ring-offset-1 ring-current" : ""
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
                className="overflow-hidden"
              >
                <div className={`rounded-lg px-4 py-3 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
                  <p className={`text-xs font-bold mb-1 ${isCorrect ? "text-green-800" : "text-[#92400E]"}`}>
                    {isCorrect
                      ? `✓ Correct — ${batch.correctStatus}`
                      : `✗ Should be: ${batch.correctStatus}`}
                  </p>
                  <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-700" : "text-[#92400E]"}`}>
                    {batch.explanation}
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
          onClick={idx < ATP_BATCHES.length - 1 ? handleNext : handleFinalNext}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {idx < ATP_BATCHES.length - 1 ? "Next batch →" : "Complete ATP check →"}
        </motion.button>
      )}
    </div>
  );
}

// ─── AcknowledgementDrafter ────────────────────────────────────────────────────

interface AcknowledgementDrafterProps {
  onDone: (correct: boolean) => void;
}

export function AcknowledgementDrafter({ onDone }: AcknowledgementDrafterProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const choice = ACKNOWLEDGEMENT_OPTIONS.find((o) => o.id === selected);
  const correct = choice?.correct ?? false;

  if (submitted && choice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className={`rounded-2xl border-2 p-5 ${correct ? "border-green-300 bg-green-50" : "border-amber-200 bg-[#FEF3C7]"}`}>
          <div className="flex items-start gap-3">
            {correct
              ? <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              : <XCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-bold ${correct ? "text-green-800" : "text-[#92400E]"}`}>
                {correct ? "Correct acknowledgement wording." : "Not quite right."}
              </p>
              <p className={`text-xs mt-1.5 leading-relaxed ${correct ? "text-green-700" : "text-[#92400E]"}`}>
                {choice.feedback}
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(correct)}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {correct ? "Send acknowledgement →" : "Continue →"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        How should Batch 3 be worded in the order acknowledgement?
      </p>
      <div className="flex flex-col gap-2">
        {ACKNOWLEDGEMENT_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              suppressHydrationWarning
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#BE185D] bg-[#FCE7F3]"
                  : "border-[#E8E4DD] bg-white hover:border-[#BE185D]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  isSelected ? "border-[#BE185D] bg-[#BE185D]" : "border-[#E8E4DD]"
                }`} />
                <p className="text-sm text-[#1A1A1A] leading-relaxed">{opt.text}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <button
        suppressHydrationWarning
        disabled={!selected}
        onClick={() => setSubmitted(true)}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          selected
            ? "bg-[#BE185D] hover:bg-[#9D174D] text-white cursor-pointer"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Use this wording →
      </button>
    </div>
  );
}

// ─── QualityDecisionCard ───────────────────────────────────────────────────────

interface QualityDecisionCardProps {
  onDone: (choice: string) => void;
}

export function QualityDecisionCard({ onDone }: QualityDecisionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const choice = QUALITY_CHOICES.find((c) => c.id === selected);
  const correct = choice?.correct ?? false;

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
                {correct ? "Correct call." : `You chose: ${choice.label}`}
              </p>
              <p className={`text-xs mt-1.5 leading-relaxed ${correct ? "text-green-700" : "text-red-700"}`}>
                {choice.feedback}
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(selected!)}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {correct ? "Dispatch confirmed →" : "See next step →"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        What&apos;s the call on Batch 1?
      </p>
      <div className="flex flex-col gap-2">
        {QUALITY_CHOICES.map((c) => {
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
                  ? "border-[#BE185D] bg-[#FCE7F3]"
                  : "border-[#E8E4DD] bg-white hover:border-[#BE185D]/40"
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
                    className="ml-auto w-5 h-5 rounded-full bg-[#BE185D] flex items-center justify-center flex-shrink-0"
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
        onClick={() => setSubmitted(true)}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          selected
            ? "bg-[#BE185D] hover:bg-[#9D174D] text-white cursor-pointer"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Make the call →
      </button>
    </div>
  );
}

// ─── InvoiceBuilder ────────────────────────────────────────────────────────────

interface InvoiceBuilderProps {
  onDone: (score: number) => void;
}

export function InvoiceBuilder({ onDone }: InvoiceBuilderProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);

  const handleSubmit = () => {
    const res: Record<string, boolean> = {};
    INVOICE_FIELDS.forEach((f) => {
      res[f.id] = selections[f.id] === f.correctValue;
    });
    setResults(res);
  };

  const score = results ? Object.values(results).filter(Boolean).length : 0;
  const allSelected = INVOICE_FIELDS.every((f) => selections[f.id]);

  if (results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-sm font-bold text-[#1A1A1A]">
            Invoice accuracy:{" "}
            <span className={score === 5 ? "text-green-600" : score >= 3 ? "text-amber-600" : "text-red-500"}>
              {score}/5 fields correct
            </span>
          </p>
          {INVOICE_FIELDS.map((f) => (
            <div key={f.id} className="flex items-start gap-2.5">
              {results[f.id]
                ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                : <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">{f.label}</p>
                <p className="text-[11px] text-[#9CA3AF]">
                  {results[f.id]
                    ? `✓ ${f.correctValue}`
                    : `Correct: ${f.correctValue}`
                  }
                </p>
                {!results[f.id] && (
                  <p className="text-[11px] text-[#D97706] mt-0.5">{f.hint}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(score)}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Raise invoice →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        Build Invoice INV-2024-3317 — select the correct value for each field
      </p>
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden">
        <div className="bg-[#6D28D9] px-5 py-3">
          <p className="text-xs font-bold text-white tracking-wider">TAX INVOICE — INV-2024-3317</p>
          <p className="text-[10px] text-purple-200">Batch 1 · Week 2 Friday</p>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {INVOICE_FIELDS.map((f) => (
            <div key={f.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1A1A1A]">{f.label}</label>
                <span className="text-[10px] text-[#9CA3AF] max-w-[200px] text-right leading-tight">{f.hint}</span>
              </div>
              <select
                suppressHydrationWarning
                value={selections[f.id] ?? ""}
                onChange={(e) => setSelections((prev) => ({ ...prev, [f.id]: e.target.value }))}
                className="w-full rounded-lg border border-[#E8E4DD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#6D28D9] transition-colors cursor-pointer"
              >
                <option value="">Select correct value...</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      <button
        suppressHydrationWarning
        disabled={!allSelected}
        onClick={handleSubmit}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          allSelected
            ? "bg-[#BE185D] hover:bg-[#9D174D] text-white cursor-pointer"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Validate invoice →
      </button>
    </div>
  );
}

// ─── ARAgingTracker ────────────────────────────────────────────────────────────

interface ARAgingTrackerProps {
  onDone: (score: number) => void;
}

export function ARAgingTracker({ onDone }: ARAgingTrackerProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const step = AR_ESCALATION_STEPS[idx];
  const selected = answers[idx];
  const isCorrect = selected === step.correctId;

  const handleAnswer = (optId: string) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [idx]: optId }));
    setRevealed(true);
    if (optId === step.correctId) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (idx < AR_ESCALATION_STEPS.length - 1) {
      setIdx((i) => i + 1);
      setRevealed(false);
    } else {
      const finalScore = Object.entries(answers).filter(([i, ans]) => {
        const s = AR_ESCALATION_STEPS[Number(i)];
        return s && ans === s.correctId;
      }).length + (isCorrect ? 0 : 0);
      // Recount properly
      const total = AR_ESCALATION_STEPS.filter((s, i) => {
        const ans = i === idx ? selected : answers[i];
        return ans === s.correctId;
      }).length;
      onDone(total);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">AR Escalation Ladder</p>
        <span className="text-[10px] bg-[#F5F0E8] border border-[#E8E4DD] px-2 py-0.5 rounded-full text-[#9CA3AF] font-mono">
          Day {step.day} · {idx + 1}/{AR_ESCALATION_STEPS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-3"
        >
          <div className="bg-white border border-[#E8E4DD] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                step.day <= 1 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                step.day <= 7 ? "bg-orange-50 text-orange-700 border border-orange-200" :
                "bg-red-50 text-red-700 border border-red-200"
              }`}>
                Day {step.day} overdue
              </div>
            </div>
            <p className="text-sm text-[#1A1A1A] leading-relaxed">{step.situation}</p>
          </div>

          <div className="flex flex-col gap-2">
            {step.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrectOpt = opt.id === step.correctId;
              let className = "border-[#E8E4DD] bg-white hover:border-[#BE185D]/40 cursor-pointer";
              if (revealed && isSelected && isCorrect) className = "border-green-300 bg-green-50 cursor-not-allowed";
              if (revealed && isSelected && !isCorrect) className = "border-red-200 bg-red-50 cursor-not-allowed";
              if (revealed && !isSelected && isCorrectOpt) className = "border-green-200 bg-green-50 cursor-not-allowed";
              if (revealed && !isSelected && !isCorrectOpt) className = "border-[#E8E4DD] bg-white opacity-50 cursor-not-allowed";

              return (
                <button
                  key={opt.id}
                  suppressHydrationWarning
                  onClick={() => handleAnswer(opt.id)}
                  disabled={revealed}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all ${className}`}
                >
                  <div className="flex items-center gap-2">
                    {revealed && isCorrectOpt && <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                    <span className={revealed && isCorrectOpt ? "font-semibold text-green-800" : "text-[#1A1A1A]"}>
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className={`rounded-lg px-4 py-3 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
                  <p className={`text-xs font-bold mb-1 ${isCorrect ? "text-green-800" : "text-[#92400E]"}`}>
                    {isCorrect ? "✓ Correct escalation" : `✗ Correct action: ${step.options.find(o => o.id === step.correctId)?.label}`}
                  </p>
                  <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-700" : "text-[#92400E]"}`}>
                    {step.explanation}
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
          onClick={handleNext}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {idx < AR_ESCALATION_STEPS.length - 1 ? `Day ${AR_ESCALATION_STEPS[idx + 1].day} →` : "See final score →"}
        </motion.button>
      )}
    </div>
  );
}

// ─── CreditAdjustment ─────────────────────────────────────────────────────────

interface CreditAdjustmentProps {
  onDone: (correct: boolean) => void;
}

export function CreditAdjustment({ onDone }: CreditAdjustmentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const choice = CREDIT_TERMS_OPTIONS.find((c) => c.id === selected);
  const correct = choice?.correct ?? false;

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
                {correct ? "Correct terms." : `You chose: ${choice.label}`}
              </p>
              <p className={`text-xs mt-1.5 leading-relaxed ${correct ? "text-green-700" : "text-red-700"}`}>
                {choice.feedback}
              </p>
            </div>
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onDone(correct)}
          className="self-start px-5 py-2.5 bg-[#BE185D] hover:bg-[#9D174D] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          {correct ? "Terms confirmed →" : "Continue →"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
        What credit terms should apply to Meridian&apos;s next order?
      </p>
      <div className="flex flex-col gap-2">
        {CREDIT_TERMS_OPTIONS.map((c) => {
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
                  ? "border-[#BE185D] bg-[#FCE7F3]"
                  : "border-[#E8E4DD] bg-white hover:border-[#BE185D]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  isSelected ? "border-[#BE185D] bg-[#BE185D]" : "border-[#E8E4DD]"
                }`} />
                <p className="text-sm text-[#1A1A1A] leading-relaxed">{c.label}</p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-5 h-5 rounded-full bg-[#BE185D] flex items-center justify-center flex-shrink-0"
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
        onClick={() => setSubmitted(true)}
        className={`self-start px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          selected
            ? "bg-[#BE185D] hover:bg-[#9D174D] text-white cursor-pointer"
            : "bg-[#E8E4DD] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        Apply terms →
      </button>
    </div>
  );
}
