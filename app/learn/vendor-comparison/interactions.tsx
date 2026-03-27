"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import type { VendorQuote, GameState } from "./types";
import { RFQ_ITEMS, SCORECARD_CRITERIA, NEGOTIATION_OPTIONS, VENDORS } from "./constants";

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

// ─── StockIndicator ───────────────────────────────────────────────────────────

export function StockIndicator() {
  const totalDays = 30;
  const remainingDays = 9;
  const pct = remainingDays / totalDays;

  return (
    <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1 bg-gradient-to-r from-red-500 to-red-400" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">
            CRITICAL STOCK ALERT
          </p>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-2xl font-black text-red-600" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              {remainingDays} days
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">Palm Oil stock remaining</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[#9CA3AF]">Need: 40 MT</p>
            <p className="text-xs text-[#9CA3AF]">Before line stops</p>
          </div>
        </div>
        {/* Bar */}
        <div className="h-4 bg-[#F3EFE8] rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full relative"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute right-0 top-0 bottom-0 w-3 bg-red-300 rounded-full"
            />
          </motion.div>
        </div>
        <div className="flex justify-between text-[9px] text-[#9CA3AF] mb-3">
          <span>0</span>
          <span>15 days</span>
          <span>30 days</span>
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
          <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">
            <strong>Production line stops if oil runs out.</strong> Greenfield Hotels contract at risk.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── RFQBuilder ───────────────────────────────────────────────────────────────

interface RFQBuilderProps {
  selected: string[];
  onChange: (items: string[]) => void;
  onComplete: () => void;
}

export function RFQBuilder({ selected, onChange, onComplete }: RFQBuilderProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const requiredItems = RFQ_ITEMS.filter((i) => i.required);
  const correctSelected = selected.filter((k) => requiredItems.some((i) => i.key === k));
  const allRequired = correctSelected.length === 7;

  const handleToggle = useCallback((key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
      setRevealed((r) => ({ ...r, [key]: true }));
    }
  }, [selected, onChange]);

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[#F5F0E8] border-b border-[#E8E4DD] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📋</span>
          <p className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Build Your RFQ</p>
        </div>
        <span className="text-xs font-semibold text-[#6B7280]">
          {correctSelected.length}/7 required items
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
          Select every item that should be included in an RFQ for a spot purchase of 40 metric tons of palm oil.
        </p>
        <div className="space-y-2 mb-5">
          {RFQ_ITEMS.map((item) => {
            const isChecked = selected.includes(item.key);
            const isRevealed = revealed[item.key];
            const isRequired = item.required;
            const isWrong = isChecked && !isRequired;

            return (
              <div key={item.key}>
                <motion.button
                  suppressHydrationWarning
                  onClick={() => handleToggle(item.key)}
                  animate={{ scale: isChecked ? 1 : 1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer ${
                    isChecked && isRequired
                      ? "border-green-400 bg-green-50"
                      : isChecked && !isRequired
                      ? "border-amber-300 bg-amber-50"
                      : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 ${
                    isChecked && isRequired ? "border-green-500 bg-green-500" : isChecked ? "border-amber-400 bg-amber-100" : "border-[#D1CBC2]"
                  }`}>
                    {isChecked && isRequired && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 12 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                    {isChecked && !isRequired && (
                      <span className="text-amber-600 text-[10px] font-bold">!</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isChecked && isRequired ? "text-green-800" : isChecked ? "text-amber-800" : "text-[#1A1A1A]"}`}>
                    {item.label}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isRevealed && isChecked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mx-4 mt-1 mb-1 px-3 py-2 rounded-lg text-xs leading-relaxed ${
                        isRequired ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-800 border border-amber-100"
                      }`}>
                        {isRequired ? (
                          <><strong>✓ Good call.</strong> {item.reason}</>
                        ) : (
                          <><strong>Not typically included.</strong> {item.reason}</>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-[#F3EFE8] rounded-full overflow-hidden mb-4">
          <motion.div
            animate={{ width: `${(correctSelected.length / 7) * 100}%` }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="h-full bg-green-400 rounded-full"
          />
        </div>

        <AnimatePresence>
          {allRequired && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={14} className="text-green-600" />
                <p className="text-xs font-semibold text-green-700">All 7 required items selected. Your RFQ is complete.</p>
              </div>
              {selected.some((k) => !RFQ_ITEMS.find((i) => i.key === k)?.required) && (
                <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Tip: You included {selected.filter((k) => !RFQ_ITEMS.find((i) => i.key === k)?.required).length} non-standard item(s). These aren&apos;t wrong — just unnecessary for a spot purchase.
                </p>
              )}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={onComplete}
                  suppressHydrationWarning
                  className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
                >
                  Send RFQ to 3 Vendors →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// ─── QuoteCard ────────────────────────────────────────────────────────────────

interface QuoteCardProps {
  vendor: VendorQuote;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function QuoteCard({ vendor, index, selected, onSelect }: QuoteCardProps) {
  const [expanded, setExpanded] = useState(false);

  const responseLabel = vendor.responseHours <= 20 ? "Fast" : vendor.responseHours <= 30 ? "Good" : "Slow";
  const responseColor = vendor.responseHours <= 20
    ? "bg-green-100 text-green-700 border-green-200"
    : vendor.responseHours <= 30
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-700 border-red-200";

  return (
    <motion.div
      layout
      animate={{
        boxShadow: selected
          ? "0 8px 32px rgba(245,158,11,0.22)"
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`bg-white border-2 rounded-2xl overflow-hidden cursor-pointer transition-colors ${
        selected ? "border-[#f59e0b]" : "border-[#E8E4DD] hover:border-[#D97706]/40"
      }`}
      onClick={() => { setExpanded(true); onSelect(); }}
    >
      {/* Highlight accent */}
      {vendor.highlight && (
        <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-[#1A1A1A]">{vendor.name}</h3>
              {selected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 14 }}>
                  <CheckCircle2 size={14} className="text-[#f59e0b]" />
                </motion.div>
              )}
            </div>
            <p className="text-[10px] text-[#9CA3AF]">{vendor.contact} · {vendor.contactRole}</p>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${vendor.tagColor}`}>
            {vendor.tag}
          </span>
        </div>

        {/* Price highlight */}
        <div className="flex items-center justify-between bg-[#FAFAF7] border border-[#E8E4DD] rounded-xl px-4 py-2.5 mb-3">
          <div>
            <p className="text-[9px] text-[#9CA3AF] uppercase font-semibold tracking-wide">Price / MT</p>
            <p className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              ${vendor.pricePerTon.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-[#9CA3AF] uppercase font-semibold tracking-wide">Total (40MT)</p>
            <p className="text-sm font-bold text-[#D97706]">${vendor.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide font-semibold">Lead Time</p>
            <p className={`text-sm font-bold ${vendor.leadDays <= 10 ? "text-green-600" : vendor.leadDays <= 12 ? "text-[#D97706]" : "text-red-500"}`}>
              {vendor.leadDays}d
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide font-semibold">Terms</p>
            <p className="text-sm font-bold text-[#1A1A1A]">{vendor.paymentTerms}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide font-semibold">Response</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${responseColor}`}>
              {responseLabel}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${vendor.hasCOA ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
            CoA: {vendor.hasCOA ? "✓ Included" : "✗ Missing"}
          </span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${vendor.hasRefs ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
            Refs: {vendor.hasRefs ? "✓ Provided" : "None"}
          </span>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border bg-[#F5F0E8] border-[#E8E4DD] text-[#6B7280]">
            {vendor.responseHours}h response
          </span>
        </div>

        {/* Warning */}
        {vendor.warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <AlertTriangle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed">{vendor.warning}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── VendorScorecard ──────────────────────────────────────────────────────────

interface VendorScorecardProps {
  onComplete: (selectedIdx: number) => void;
}

export function VendorScorecard({ onComplete }: VendorScorecardProps) {
  const [revealed, setRevealed] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totals = SCORECARD_CRITERIA.reduce(
    (acc, c) => {
      acc[0] += c.col0;
      acc[1] += c.col1;
      acc[2] += c.col2;
      return acc;
    },
    [0, 0, 0]
  );

  const revealNext = useCallback(() => {
    if (revealed < SCORECARD_CRITERIA.length) {
      setRevealed((r) => r + 1);
    }
  }, [revealed]);

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[#F5F0E8] border-b border-[#E8E4DD] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <p className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Vendor Evaluation Scorecard</p>
        </div>
        <p className="text-[10px] text-[#9CA3AF]">Scored 1–5 per criterion</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E8E4DD]">
              <th className="text-left px-4 py-3 font-semibold text-[#6B7280] text-[10px] uppercase tracking-wide">Criterion</th>
              {VENDORS.map((v, i) => (
                <th key={i} className="px-3 py-3 font-bold text-[10px] uppercase tracking-wide text-center" style={{ color: i === 0 ? "#065F46" : i === 1 ? "#92400E" : "#6B7280" }}>
                  {v.name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCORECARD_CRITERIA.map((c, i) => {
              const isVisible = i < revealed;
              const scores = [c.col0, c.col1, c.col2];
              const maxScore = Math.max(...scores);

              return (
                <motion.tr
                  key={c.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.3, delay: 0 }}
                  className="border-b border-[#F3EFE8] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">{c.label}</td>
                  {scores.map((score, si) => (
                    <td key={si} className="px-3 py-3 text-center">
                      {isVisible ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18, delay: si * 0.06 }}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold ${
                            score === maxScore
                              ? "bg-[#FEF3C7] text-[#D97706] border border-[#f59e0b]/40"
                              : "bg-[#F5F0E8] text-[#9CA3AF]"
                          }`}
                        >
                          {score}
                        </motion.div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F3EFE8]" />
                      )}
                    </td>
                  ))}
                </motion.tr>
              );
            })}

            {/* Totals row */}
            {revealed === SCORECARD_CRITERIA.length && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#FAFAF7] border-t-2 border-[#E8E4DD]"
              >
                <td className="px-4 py-3 font-bold text-[#1A1A1A] text-xs uppercase tracking-wide">Total</td>
                {totals.map((t, i) => (
                  <td key={i} className="px-3 py-3 text-center">
                    <span className={`text-base font-black ${i === 0 ? "text-green-700" : "text-[#9CA3AF]"}`}>
                      {t}
                    </span>
                  </td>
                ))}
              </motion.tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-[#E8E4DD]">
        {revealed < SCORECARD_CRITERIA.length ? (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={revealNext}
            suppressHydrationWarning
            className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#E8E4DD] text-sm font-semibold text-[#6B7280] rounded-xl cursor-pointer hover:bg-[#E8E4DD] transition-colors"
          >
            Reveal next criterion ({revealed}/{SCORECARD_CRITERIA.length}) →
          </motion.button>
        ) : !answered ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <p className="text-sm font-semibold text-[#1A1A1A]">Which vendor won the most evaluation categories?</p>
            <div className="flex flex-wrap gap-2">
              {VENDORS.map((v, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setAnswered(i);
                    setShowResult(true);
                  }}
                  suppressHydrationWarning
                  className="px-4 py-2 border-2 border-[#E8E4DD] bg-white text-sm font-medium text-[#1A1A1A] rounded-xl cursor-pointer hover:border-[#D97706]/40 transition-colors"
                >
                  {v.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`rounded-xl px-4 py-3 border ${answered === 0 ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
                  <p className={`text-xs font-semibold mb-1 ${answered === 0 ? "text-green-800" : "text-[#92400E]"}`}>
                    {answered === 0 ? "✓ Correct!" : "Not quite —"}
                  </p>
                  <p className={`text-xs leading-relaxed ${answered === 0 ? "text-green-700" : "text-[#92400E]"}`}>
                    {answered === 0
                      ? `SunPalm leads in 5 of 7 categories with a total score of ${totals[0]}. Price is the one area where they're weakest — but that's one criterion out of seven.`
                      : `SunPalm Commodities scores ${totals[0]} total — highest across 5 of 7 criteria. Price is the one area where they score lowest, but risk, quality, and reliability all point to SunPalm.`}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => onComplete(0)}
                  suppressHydrationWarning
                  className="w-full px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
                >
                  Proceed with SunPalm →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── NegotiationChoice ────────────────────────────────────────────────────────

interface NegotiationChoiceProps {
  onChoose: (key: string, priceResult: number) => void;
}

export function NegotiationChoice({ onChoose }: NegotiationChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (key: string) => {
    if (confirmed) return;
    setSelected(key);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    const price = selected === "reasonable" ? 985 : selected === "match" ? 1040 : 1040;
    setTimeout(() => onChoose(selected, price), 800);
  };

  const selectedOption = NEGOTIATION_OPTIONS.find((o) => o.key === selected);

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">How do you approach Marco?</p>
      <div className="space-y-3">
        {NEGOTIATION_OPTIONS.map((opt) => {
          const isSelected = selected === opt.key;
          const borderColor =
            isSelected && opt.outcome === "good" ? "border-green-400 bg-green-50"
            : isSelected && opt.outcome === "bad" ? "border-red-300 bg-red-50"
            : isSelected ? "border-[#D1CBC2] bg-[#F5F0E8]"
            : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40";

          return (
            <motion.button
              key={opt.key}
              suppressHydrationWarning
              onClick={() => handleSelect(opt.key)}
              animate={{ scale: isSelected ? 1.01 : 1 }}
              whileHover={!confirmed ? { scale: 1.01 } : {}}
              whileTap={!confirmed ? { scale: 0.98 } : {}}
              disabled={confirmed}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className={`w-full text-left p-4 rounded-xl border-2 cursor-pointer transition-colors ${borderColor}`}
            >
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{opt.label}</p>
              <p className="text-xs text-[#6B7280] italic">{opt.sub}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Response bubble */}
      <AnimatePresence>
        {selected && selectedOption && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl p-4 border ${
              selectedOption.outcome === "good" ? "bg-green-50 border-green-200"
              : selectedOption.outcome === "bad" ? "bg-red-50 border-red-200"
              : "bg-[#F5F0E8] border-[#E8E4DD]"
            }`}>
              <p className={`text-xs leading-relaxed ${
                selectedOption.outcome === "good" ? "text-green-800"
                : selectedOption.outcome === "bad" ? "text-red-800"
                : "text-[#4B5563]"
              }`}>
                {selectedOption.response}
              </p>
              {selectedOption.outcome === "good" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5">$985/MT (was $1,040)</span>
                  <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5">9 days (was 10)</span>
                  <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5">120-day price lock</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected && !confirmed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            suppressHydrationWarning
            className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Confirm terms →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─── ApprovalPanel ────────────────────────────────────────────────────────────

interface ApprovalPanelProps {
  approver: "james" | "rachel";
  onApprove: () => void;
  gs: GameState;
}

export function ApprovalPanel({ approver, onApprove, gs }: ApprovalPanelProps) {
  const [rachelQ1, setRachelQ1] = useState<string | null>(null);
  const [rachelQ2, setRachelQ2] = useState<string | null>(null);
  const [jamesReviewing, setJamesReviewing] = useState(true);
  const [approved, setApproved] = useState(false);

  const finalPrice = gs.finalPricePerTon;
  const total = finalPrice * 40;
  const deliveryDays = gs.negotiationChoice === "reasonable" ? 9 : 10;

  const rachelCanApprove = rachelQ1 === "35800" && rachelQ2 === "scorecard";

  const handleJamesReview = useCallback(() => {
    setJamesReviewing(false);
  }, []);

  const handleApprove = useCallback(() => {
    if (approved) return;
    setApproved(true);
    setTimeout(onApprove, 600);
  }, [approved, onApprove]);

  if (approver === "james") {
    return (
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#FFF7ED] border-b border-[#E8E4DD] px-5 py-3 flex items-center gap-2">
          <span className="text-sm">👤</span>
          <p className="text-xs font-bold text-[#92400E] uppercase tracking-widest">James Whitmore — Operations Director</p>
        </div>
        <div className="p-5 space-y-4">
          {/* PR Summary */}
          <div className="bg-[#FAFAF7] border border-[#E8E4DD] rounded-xl p-4">
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Purchase Summary</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Item", "RBD Palm Oil"],
                ["Quantity", "40 metric tons"],
                ["Vendor", "SunPalm Commodities"],
                ["Unit Price", `$${finalPrice.toLocaleString()}/MT`],
                ["Total Value", `$${total.toLocaleString()}`],
                ["Delivery", `${deliveryDays} calendar days`],
                ["Terms", "Net-30"],
                ["Price Lock", "120 days"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[9px] text-[#9CA3AF] uppercase font-semibold tracking-wide">{l}</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {jamesReviewing ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2 text-xs text-[#6B7280]"
            >
              <div className="w-3 h-3 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin" />
              James is reviewing the numbers…
            </motion.div>
          ) : null}

          {!jamesReviewing && !approved && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={13} className="text-green-600" />
                <p className="text-xs text-green-700 font-medium">Numbers check out. SunPalm track record is solid. Recommend proceeding.</p>
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleApprove}
                  suppressHydrationWarning
                  className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
                >
                  James stamps APPROVED →
                </motion.button>
              </div>
            </motion.div>
          )}

          {jamesReviewing && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                suppressHydrationWarning
                onClick={handleJamesReview}
                className="px-5 py-2 bg-[#F5F0E8] border border-[#E8E4DD] text-xs font-semibold text-[#6B7280] rounded-xl cursor-pointer hover:bg-[#E8E4DD] transition-colors"
              >
                Wait for James to finish…
              </motion.button>
            </div>
          )}

          {approved && (
            <motion.div initial={{ scale: 0, rotate: -8 }} animate={{ scale: 1, rotate: -3 }} transition={{ type: "spring", stiffness: 280, damping: 14 }} className="flex justify-center py-2">
              <div className="px-8 py-3 border-4 border-green-500 rounded-lg">
                <p className="text-2xl font-black text-green-600 tracking-widest" style={{ fontFamily: "var(--font-syne),sans-serif" }}>APPROVED</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Rachel panel
  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[#F5F3FF] border-b border-[#E8E4DD] px-5 py-3 flex items-center gap-2">
        <span className="text-sm">👤</span>
        <p className="text-xs font-bold text-[#5B21B6] uppercase tracking-widest">Rachel Torres — CFO</p>
      </div>
      <div className="p-5 space-y-5">
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Rachel reviews every order above $25,000. She asks pointed questions. Answer them correctly to get her sign-off.
        </p>

        {/* Q1 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#1A1A1A]">Q1: What was the lowest quote received?</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "$35,800 — PureOil Direct", value: "35800" },
              { label: "$38,400 — GlobalFats Trading", value: "38400" },
              { label: "$39,400 — SunPalm (negotiated)", value: "39400" },
            ].map((opt) => {
              const isSelected = rachelQ1 === opt.value;
              const isCorrect = opt.value === "35800";
              const showResult = rachelQ1 !== null;
              let style = "border-[#E8E4DD] bg-white hover:border-[#D97706]/40";
              if (showResult && isSelected && isCorrect) style = "border-green-400 bg-green-50";
              if (showResult && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
              if (showResult && !isSelected && isCorrect) style = "border-green-400 bg-green-50";

              return (
                <motion.button
                  key={opt.value}
                  suppressHydrationWarning
                  onClick={() => !rachelQ1 && setRachelQ1(opt.value)}
                  disabled={rachelQ1 !== null}
                  whileHover={!rachelQ1 ? { scale: 1.02 } : {}}
                  whileTap={!rachelQ1 ? { scale: 0.97 } : {}}
                  className={`px-4 py-2 border-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${style}`}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
          {rachelQ1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs ${rachelQ1 === "35800" ? "text-green-700" : "text-red-600"}`}>
              {rachelQ1 === "35800" ? "✓ Correct. PureOil quoted $35,800." : "✗ PureOil Direct quoted $35,800 — the lowest of the three."}
            </motion.p>
          )}
        </div>

        {/* Q2 */}
        {rachelQ1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-sm font-semibold text-[#1A1A1A]">Q2: Why wasn&apos;t the lowest quote selected?</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "SunPalm leads in 5 of 7 evaluation categories", value: "scorecard" },
                { label: "SunPalm is our preferred vendor", value: "preferred" },
                { label: "GlobalFats had issues last quarter", value: "globalfats" },
              ].map((opt) => {
                const isSelected = rachelQ2 === opt.value;
                const isCorrect = opt.value === "scorecard";
                const showResult = rachelQ2 !== null;
                let style = "border-[#E8E4DD] bg-white hover:border-[#D97706]/40";
                if (showResult && isSelected && isCorrect) style = "border-green-400 bg-green-50";
                if (showResult && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
                if (showResult && !isSelected && isCorrect) style = "border-green-400 bg-green-50";

                return (
                  <motion.button
                    key={opt.value}
                    suppressHydrationWarning
                    onClick={() => !rachelQ2 && setRachelQ2(opt.value)}
                    disabled={rachelQ2 !== null}
                    whileHover={!rachelQ2 ? { scale: 1.01 } : {}}
                    whileTap={!rachelQ2 ? { scale: 0.98 } : {}}
                    className={`w-full text-left px-4 py-2.5 border-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${style}`}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
            {rachelQ2 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs ${rachelQ2 === "scorecard" ? "text-green-700" : "text-red-600"}`}>
                {rachelQ2 === "scorecard"
                  ? "✓ Correct. The scorecard is the audit trail — not preference."
                  : "✗ The correct answer is the scorecard result. SunPalm wins 5 of 7 criteria — that's the defensible business reason."}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Rachel approve button */}
        {rachelCanApprove && !approved && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleApprove}
              suppressHydrationWarning
              className="px-6 py-2.5 bg-[#5B21B6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#6D28D9] transition-colors"
            >
              Rachel stamps APPROVED →
            </motion.button>
          </motion.div>
        )}

        {approved && (
          <motion.div initial={{ scale: 0, rotate: -8 }} animate={{ scale: 1, rotate: -3 }} transition={{ type: "spring", stiffness: 280, damping: 14 }} className="flex justify-center py-2">
            <div className="px-8 py-3 border-4 border-[#5B21B6] rounded-lg">
              <p className="text-2xl font-black text-[#5B21B6] tracking-widest" style={{ fontFamily: "var(--font-syne),sans-serif" }}>APPROVED</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
