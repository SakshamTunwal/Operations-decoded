"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react";
import {
  AUDIT_DATA, SIGNIFICANT_SKUS, STOCKOUT_ORDERS, STOCKOUT,
  OVERSTOCK, ROP_DATA, BULLWHIP_DATA, BULLWHIP_QUESTIONS,
  ABC_SKUS, DASHBOARD_METRICS,
} from "./constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) { return n.toLocaleString(); }

// ─── AuditReconciler ──────────────────────────────────────────────────────────

export function AuditReconciler({ onComplete }: { onComplete: (flagged: string[]) => void }) {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: number; missed: string[]; falsePos: string[] } | null>(null);

  const toggle = (sku: string) => {
    if (submitted) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(sku) ? next.delete(sku) : next.add(sku);
      return next;
    });
  };

  const submit = () => {
    const flaggedArr = Array.from(flagged);
    const missed = SIGNIFICANT_SKUS.filter((s) => !flagged.has(s));
    const falsePos = flaggedArr.filter((s) => !SIGNIFICANT_SKUS.includes(s));
    const correct = SIGNIFICANT_SKUS.filter((s) => flagged.has(s)).length;
    setResult({ correct, missed, falsePos });
    setSubmitted(true);
  };

  const isCorrect = result !== null && result.correct === SIGNIFICANT_SKUS.length && result.falsePos.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E8E4DD] bg-[#F9FAFB] flex items-center justify-between">
          <p className="text-xs font-bold text-[#1A1A1A]">Physical Audit Results — 340 SKUs (sample of 8)</p>
          <p className="text-[10px] text-[#9CA3AF]">Flag discrepancies ≥ 5 units</p>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {AUDIT_DATA.map((row) => {
            const abs = Math.abs(row.variance);
            const isFlagged = flagged.has(row.sku);
            const isSignificant = SIGNIFICANT_SKUS.includes(row.sku);
            const rowBg = submitted
              ? isSignificant && isFlagged ? "bg-green-50"
              : isSignificant && !isFlagged ? "bg-red-50"
              : !isSignificant && isFlagged ? "bg-orange-50"
              : ""
              : isFlagged ? "bg-red-50" : "";

            return (
              <button
                key={row.sku}
                suppressHydrationWarning
                onClick={() => toggle(row.sku)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer hover:bg-[#F9FAFB] ${rowBg}`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isFlagged ? "bg-red-500 border-red-500" : "border-[#E8E4DD]"
                }`}>
                  {isFlagged && <X size={10} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1A1A1A]">{row.sku} — {row.name}</p>
                </div>
                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div>
                    <p className="text-[9px] text-[#9CA3AF]">System</p>
                    <p className="text-xs font-semibold text-[#1A1A1A]">{fmt(row.system)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#9CA3AF]">Physical</p>
                    <p className="text-xs font-semibold text-[#1A1A1A]">{fmt(row.physical)}</p>
                  </div>
                  <div className="w-16">
                    <p className="text-[9px] text-[#9CA3AF]">Variance</p>
                    <p className={`text-xs font-bold ${row.variance === 0 ? "text-[#9CA3AF]" : abs < 5 ? "text-[#D97706]" : "text-red-600"}`}>
                      {row.variance === 0 ? "—" : row.variance > 0 ? `+${row.variance}` : row.variance}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <button
          suppressHydrationWarning
          onClick={submit}
          disabled={flagged.size === 0}
          className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Audit Flags →
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`rounded-xl border p-4 ${isCorrect ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
            <div className="flex items-start gap-2">
              {isCorrect
                ? <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                : <AlertTriangle size={16} className="text-[#D97706] flex-shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={`text-sm font-bold ${isCorrect ? "text-green-800" : "text-[#92400E]"}`}>
                  {isCorrect ? `${result!.correct}/${SIGNIFICANT_SKUS.length} significant discrepancies flagged — well spotted.`
                  : `${result!.correct}/${SIGNIFICANT_SKUS.length} significant discrepancies found.`}
                </p>
                {result!.missed.length > 0 && (
                  <p className="text-xs text-red-700 mt-1">Missed: {result!.missed.join(", ")} — these had variances of 6+ units and warrant investigation.</p>
                )}
                {result!.falsePos.length > 0 && (
                  <p className="text-xs text-[#92400E] mt-1">Over-flagged: {result!.falsePos.join(", ")} — minor variances (&lt;5 units) can be within acceptable picking tolerance.</p>
                )}
                <p className="text-xs text-[#6B7280] mt-1.5">The AP-7200 variance of −53 units is the most critical. The system believes you have 53 more air purifiers than you actually do. Every downstream decision is wrong.</p>
              </div>
            </div>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => onComplete(Array.from(flagged))}
            className="mt-3 self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Investigate the AP-7200 gap →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── StockoutSimulator ────────────────────────────────────────────────────────

export function StockoutSimulator({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const available = STOCKOUT.physicalCount - STOCKOUT.alreadyCommitted;

  return (
    <div className="flex flex-col gap-4">
      {/* Inventory position */}
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-4">
        <p className="text-xs font-bold text-[#1A1A1A] mb-3">AP-7200 Inventory Position — Thursday 2:15 PM</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: "System count (ERP)",        val: fmt(STOCKOUT.systemCount),   color: "text-[#9CA3AF]" },
            { label: "Physical count (actual)",    val: fmt(STOCKOUT.physicalCount), color: "text-[#D97706]" },
            { label: "Already committed to orders",val: fmt(STOCKOUT.alreadyCommitted), color: "text-red-600" },
            { label: "Available to sell",          val: step >= 1 ? fmt(available) : "?", color: available > 0 ? "text-[#10B981]" : "text-red-600" },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-[#F9FAFB] rounded-lg p-3">
              <p className="text-[9px] text-[#9CA3AF] mb-0.5">{label}</p>
              <p className={`text-lg font-black ${color}`}>{val}</p>
            </div>
          ))}
        </div>
        {step === 0 && (
          <button
            suppressHydrationWarning
            onClick={() => setStep(1)}
            className="w-full py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Calculate available-to-sell →
          </button>
        )}
      </div>

      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-bold text-red-800 mb-2">
              Available-to-sell: {available} units — but all {available} were already picked for earlier orders.
            </p>
            <p className="text-xs text-red-700">The shelf is empty. Three new orders just came in. Walk through the consequences.</p>
          </div>
        </motion.div>
      )}

      {step >= 1 && (
        <div className="flex flex-col gap-2">
          {STOCKOUT_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: step >= 1 ? 1 : 0, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl border border-[#E8E4DD] bg-white p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{order.id}</span>
                    <span className="text-[9px] text-[#9CA3AF]">{order.qty} units × ${STOCKOUT.retailPrice}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#1A1A1A]">{order.label}</p>
                </div>
                <X size={16} className="text-red-500 flex-shrink-0" />
              </div>
              {step >= 2 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-[10px] text-red-700 mt-2 leading-relaxed border-t border-red-100 pt-2"
                >
                  {order.consequence}
                </motion.p>
              )}
            </motion.div>
          ))}
          {step === 1 && (
            <button
              suppressHydrationWarning
              onClick={() => setStep(2)}
              className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
            >
              See the full impact →
            </button>
          )}
        </div>
      )}

      {step >= 2 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-red-200 bg-[#FFF1F2] p-4">
            <p className="text-xs font-bold text-red-800 mb-1">Total immediate revenue loss: ${fmt(STOCKOUT_ORDERS.reduce((s, o) => s + o.qty * STOCKOUT.retailPrice, 0))}</p>
            <p className="text-xs text-red-700">But the true cost is incalculable — it includes the customer who never comes back, the review that pushes the next buyer to a competitor, and the emergency reorder you must now place at rush-surcharge rates.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={onComplete}
            className="mt-3 self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Investigate the other side of the warehouse →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── CarryingCostCalculator ───────────────────────────────────────────────────

export function CarryingCostCalculator({ onComplete }: { onComplete: (rate: number) => void }) {
  const [rate, setRate] = useState(25);
  const [calculated, setCalculated] = useState(false);
  const annualCost = Math.round(OVERSTOCK.totalValue * rate / 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-5">
        <p className="text-xs font-bold text-[#1A1A1A] mb-4">WH-5100 Carrying Cost Calculator</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Units on hand",      val: fmt(OVERSTOCK.unitsOnHand), sub: "physical count" },
            { label: "Monthly demand",     val: `${OVERSTOCK.monthlyDemand} units`, sub: "8-month average" },
            { label: "Months of supply",   val: `${OVERSTOCK.monthsSupply}`,        sub: "at current rate" },
            { label: "Total inventory $",  val: `$${fmt(OVERSTOCK.totalValue)}`,    sub: `@ $${OVERSTOCK.landedCost} landed` },
          ].map(({ label, val, sub }) => (
            <div key={label} className="bg-[#FEF9C3] rounded-lg p-3">
              <p className="text-[9px] text-[#D97706]">{label}</p>
              <p className="text-sm font-bold text-[#92400E]">{val}</p>
              <p className="text-[9px] text-[#9CA3AF]">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#1A1A1A]">Annual carrying rate</p>
            <p className="text-sm font-black text-[#D97706]">{rate}%</p>
          </div>
          <input
            suppressHydrationWarning
            type="range"
            min={20}
            max={30}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#10B981]"
          />
          <div className="flex justify-between text-[9px] text-[#9CA3AF] mt-1">
            <span>20% (conservative)</span>
            <span>25% (industry standard)</span>
            <span>30% (full cost)</span>
          </div>
        </div>

        <div className={`rounded-lg p-4 text-center transition-all ${calculated ? "bg-red-50 border border-red-200" : "bg-[#F9FAFB] border border-[#E8E4DD]"}`}>
          <p className="text-[9px] text-[#9CA3AF] mb-1">Annual cost to hold this inventory</p>
          {calculated ? (
            <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-black text-red-600"
            >
              ${fmt(annualCost)}
            </motion.p>
          ) : (
            <p className="text-3xl font-black text-[#E8E4DD]">$—</p>
          )}
          {calculated && (
            <p className="text-[10px] text-red-700 mt-1">Per year, just to keep it sitting on a shelf. Not to buy it. Not to sell it. Just to hold it.</p>
          )}
        </div>
      </div>

      {!calculated ? (
        <button
          suppressHydrationWarning
          onClick={() => setCalculated(true)}
          className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Calculate carrying cost →
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFDF5] p-4">
            <p className="text-xs font-bold text-[#92400E] mb-1">Margaret&apos;s question is now quantified</p>
            <p className="text-xs text-[#6B7280]">Patrick said stock builds are &quot;insurance.&quot; Insurance that costs ${fmt(annualCost)}/year. The real question is: what is the probability of needing that stock, and what would it cost if you didn&apos;t have it? If that number is less than ${fmt(annualCost)}, the insurance is more expensive than the risk.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => onComplete(rate)}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Build the fix with Isabelle →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── ROPBuilder ───────────────────────────────────────────────────────────────

export function ROPBuilder({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [inputs, setInputs] = useState({ demand: 0, leadTime: 0, safety: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { dailyDemand, leadTimeDays, safetyStock, rop } = ROP_DATA;
  const demandLeadProduct = inputs.demand * inputs.leadTime;
  const calculatedRop = demandLeadProduct + inputs.safety;

  const checkAndAdvance = () => {
    const errs: Record<string, string> = {};
    if (inputs.demand !== dailyDemand) errs.demand = `Try ${dailyDemand} — average daily demand from last 12 months`;
    if (inputs.leadTime !== leadTimeDays) errs.leadTime = `Try ${leadTimeDays} — the supplier's consistent lead time`;
    if (inputs.safety !== safetyStock) errs.safety = `Try ${safetyStock} — one week of additional demand coverage`;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setPhase(3);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Formula display */}
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-4">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Reorder Point Formula</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 bg-[#D1FAE5] rounded-lg text-sm font-bold text-[#065F46]">ROP</div>
          <span className="text-[#9CA3AF] font-bold">=</span>
          <div className="px-3 py-1.5 bg-[#EFF6FF] rounded-lg text-sm font-bold text-blue-700">
            {phase >= 1 ? `${inputs.demand || "?"} units/day` : "Daily Demand"}
          </div>
          <span className="text-[#9CA3AF] font-bold">×</span>
          <div className="px-3 py-1.5 bg-[#FEF3C7] rounded-lg text-sm font-bold text-[#D97706]">
            {phase >= 1 ? `${inputs.leadTime || "?"} days` : "Lead Time"}
          </div>
          <span className="text-[#9CA3AF] font-bold">+</span>
          <div className="px-3 py-1.5 bg-[#F5F3FF] rounded-lg text-sm font-bold text-purple-700">
            {phase >= 1 ? `${inputs.safety || "?"} units` : "Safety Stock"}
          </div>
          {phase >= 3 && (
            <>
              <span className="text-[#9CA3AF] font-bold">=</span>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1.5 bg-[#10B981] rounded-lg text-sm font-bold text-white"
              >
                {rop} units
              </motion.div>
            </>
          )}
        </div>
      </div>

      {phase === 0 && (
        <button
          suppressHydrationWarning
          onClick={() => setPhase(1)}
          className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
        >
          Build the formula for AP-7200 →
        </button>
      )}

      {phase >= 1 && phase < 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          {[
            { key: "demand",   label: "Average daily demand (units/day)", hint: "How many AP-7200s does Nexara sell per day on average?", max: 10 },
            { key: "leadTime", label: "Supplier lead time (days)",         hint: "How long does it take from order to warehouse receipt?", max: 60 },
            { key: "safety",   label: "Safety stock (units)",              hint: "How many extra units to buffer against variability?",   max: 60 },
          ].map(({ key, label, hint, max }) => (
            <div key={key} className="rounded-xl border border-[#E8E4DD] bg-white p-4">
              <p className="text-xs font-semibold text-[#1A1A1A] mb-0.5">{label}</p>
              <p className="text-[10px] text-[#9CA3AF] mb-2">{hint}</p>
              <div className="flex items-center gap-3">
                <input
                  suppressHydrationWarning
                  type="number"
                  min={0}
                  max={max}
                  value={inputs[key as keyof typeof inputs] || ""}
                  onChange={(e) => {
                    setInputs((p) => ({ ...p, [key]: Number(e.target.value) }));
                    setErrors((p) => ({ ...p, [key]: "" }));
                  }}
                  className="w-24 px-3 py-2 border-2 border-[#E8E4DD] rounded-lg text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#10B981]"
                />
                {errors[key] && (
                  <p className="text-[10px] text-[#D97706]">{errors[key]}</p>
                )}
              </div>
            </div>
          ))}
          <button
            suppressHydrationWarning
            onClick={checkAndAdvance}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Calculate ROP →
          </button>
        </motion.div>
      )}

      {phase >= 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-bold text-green-800 mb-2">
              Reorder Point for AP-7200: {rop} units
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <p>→ {dailyDemand} units/day × {leadTimeDays} days = {dailyDemand * leadTimeDays} units consumed during replenishment window</p>
              <p>→ + {safetyStock} units safety stock = <strong>{rop} total</strong></p>
              <p className="text-green-800 font-semibold mt-2">When AP-7200 hits 210 units on hand: a PO is auto-triggered. Every time. No exceptions.</p>
            </div>
          </div>
          <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFDF5] p-4">
            <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider mb-1">The $900 lesson</p>
            <p className="text-xs text-[#6B7280]">Darren once waited until 40 units before ordering — 3 weeks of supply against a 45-day lead time. He paid a 15% rush surcharge. At the new ROP of 210, the order arrives before safety stock is touched. The $900 difference was the price of not having this formula.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={onComplete}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            See the bullwhip effect →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── BullwhipAnalyzer ─────────────────────────────────────────────────────────

export function BullwhipAnalyzer({ onComplete }: { onComplete: (answers: Record<string, string>) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const maxDemand = Math.max(...BULLWHIP_DATA.map((d) => d.demand));
  const maxOrders = Math.max(...BULLWHIP_DATA.map((d) => d.orders));
  const chartMax = Math.max(maxDemand, maxOrders);

  const handleSubmit = () => {
    let s = 0;
    BULLWHIP_QUESTIONS.forEach((q) => {
      if (answers[q.month] === q.correct) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bar chart */}
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-4">
        <div className="flex items-center gap-4 mb-3">
          <p className="text-xs font-bold text-[#1A1A1A]">18-Month Demand vs Orders — AP-7200</p>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400 opacity-70" /><span className="text-[9px] text-[#6B7280]">Demand</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400 opacity-60" /><span className="text-[9px] text-[#6B7280]">Orders</span></div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-36 px-2">
          {BULLWHIP_DATA.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: 112 }}>
                <div
                  className="flex-1 bg-blue-400 opacity-70 rounded-t transition-all"
                  style={{ height: `${(d.demand / chartMax) * 100}%` }}
                />
                <div
                  className="flex-1 bg-red-400 opacity-60 rounded-t transition-all"
                  style={{ height: `${(d.orders / chartMax) * 100}%` }}
                />
              </div>
              <p className="text-[8px] text-[#9CA3AF]">{d.month}</p>
              <p className="text-[7px] text-red-500 font-semibold">{d.orders}u</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#9CA3AF] mt-2 text-center">
          Customer demand barely moved. Darren&apos;s orders were a rollercoaster. This is the Bullwhip Effect.
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {BULLWHIP_QUESTIONS.map((q) => (
          <div key={q.month} className="rounded-xl border border-[#E8E4DD] bg-white p-4">
            <p className="text-xs font-bold text-[#1A1A1A] mb-3">
              {q.month}: Orders jumped to {BULLWHIP_DATA.find((d) => d.month === q.month)?.orders} units. Why?
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => {
                const selected = answers[q.month] === opt;
                const isCorrect = opt === q.correct;
                const showResult = submitted;
                return (
                  <button
                    key={opt}
                    suppressHydrationWarning
                    onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.month]: opt }))}
                    className={`text-left px-4 py-2.5 rounded-lg text-xs font-medium border-2 transition-colors cursor-pointer ${
                      showResult
                        ? isCorrect ? "bg-green-50 border-green-400 text-green-800"
                          : selected ? "bg-red-50 border-red-300 text-red-700"
                          : "border-[#E8E4DD] text-[#9CA3AF]"
                        : selected ? "bg-[#D1FAE5] border-[#10B981] text-[#065F46]"
                          : "border-[#E8E4DD] text-[#4B5563] hover:border-[#10B981]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          suppressHydrationWarning
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < BULLWHIP_QUESTIONS.length}
          className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyse the pattern →
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className={`rounded-xl border p-4 ${score === 3 ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
            <p className={`text-sm font-bold ${score === 3 ? "text-green-800" : "text-[#92400E]"}`}>
              {score}/{BULLWHIP_QUESTIONS.length} patterns identified.
            </p>
            <p className="text-xs text-[#6B7280] mt-1">In 18 months, the bullwhip added $4,300 in rush surcharges, $2,800 in emergency freight, and ~$11,000 in overstock carrying costs on the AP-7200 alone. Discipline-based ordering eliminates this entirely.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => onComplete(answers)}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Classify the SKU portfolio →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── ABCClassifier ────────────────────────────────────────────────────────────

export function ABCClassifier({ onComplete }: { onComplete: (answers: Record<string, string>) => void }) {
  const [assignments, setAssignments] = useState<Record<string, "A" | "B" | "C">>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const totalRevenue = ABC_SKUS.reduce((s, sk) => s + sk.annualRevenue, 0);
  const sorted = [...ABC_SKUS].sort((a, b) => b.annualRevenue - a.annualRevenue);

  const assign = (sku: string, cat: "A" | "B" | "C") => {
    if (submitted) return;
    setAssignments((p) => ({ ...p, [sku]: cat }));
  };

  const handleSubmit = () => {
    let s = 0;
    ABC_SKUS.forEach((sk) => { if (assignments[sk.sku] === sk.correct) s++; });
    setScore(s);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#F9FAFB] p-3">
        <p className="text-[10px] font-bold text-[#6B7280] mb-1">Rule: Sort by annual revenue contribution</p>
        <div className="flex gap-2">
          {[
            { cat: "A", rule: "Top ~80% of revenue → A items", color: "bg-[#D1FAE5] text-[#065F46]" },
            { cat: "B", rule: "Next ~15% → B items",           color: "bg-[#FEF3C7] text-[#92400E]" },
            { cat: "C", rule: "Remaining ~5% → C items",       color: "bg-[#F9FAFB] text-[#6B7280] border border-[#E8E4DD]" },
          ].map(({ cat, rule, color }) => (
            <div key={cat} className={`flex-1 rounded-lg px-2 py-1.5 text-center ${color}`}>
              <p className="text-xs font-black">{cat}</p>
              <p className="text-[8px] leading-tight mt-0.5">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E8E4DD] bg-white overflow-hidden">
        <div className="divide-y divide-[#F3F4F6]">
          {sorted.map((sk) => {
            const pct = ((sk.annualRevenue / totalRevenue) * 100).toFixed(1);
            const assigned = assignments[sk.sku];
            const isWrong = submitted && assigned !== sk.correct;
            const isRight = submitted && assigned === sk.correct;

            return (
              <div key={sk.sku} className={`px-4 py-3 flex items-center gap-3 ${isRight ? "bg-green-50" : isWrong ? "bg-red-50" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1A1A1A]">{sk.name}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{sk.sku} · ${(sk.annualRevenue / 1000).toFixed(0)}k/yr · {pct}% of total</p>
                  {isWrong && <p className="text-[9px] text-red-600 font-semibold mt-0.5">Should be: {sk.correct}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {(["A", "B", "C"] as const).map((cat) => {
                    const active = assigned === cat;
                    const colors = { A: "bg-[#D1FAE5] border-[#10B981] text-[#065F46]", B: "bg-[#FEF3C7] border-[#f59e0b] text-[#92400E]", C: "bg-[#F9FAFB] border-[#E8E4DD] text-[#6B7280]" };
                    return (
                      <button
                        key={cat}
                        suppressHydrationWarning
                        onClick={() => assign(sk.sku, cat)}
                        className={`w-8 h-8 rounded-lg text-xs font-black border-2 cursor-pointer transition-all ${active ? colors[cat] : "border-[#E8E4DD] text-[#9CA3AF] hover:border-[#10B981]"}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <button
          suppressHydrationWarning
          onClick={handleSubmit}
          disabled={Object.keys(assignments).length < ABC_SKUS.length}
          className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Classify →
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className={`rounded-xl border p-4 ${score >= 8 ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
            <p className={`text-sm font-bold ${score >= 8 ? "text-green-800" : "text-[#92400E]"}`}>
              {score}/{ABC_SKUS.length} SKUs correctly classified.
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              The 3 A-items generate {((ABC_SKUS.filter(s => s.correct === "A").reduce((t, s) => t + s.annualRevenue, 0) / totalRevenue) * 100).toFixed(0)}% of revenue. These 68 SKUs (of 340 total) are where Zara focuses weekly cycle counts, tight ROP monitoring, and immediate stockout response.
            </p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => onComplete(assignments)}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            See the 3-month recovery →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── InventoryDashboard ───────────────────────────────────────────────────────

export function InventoryDashboard({ onComplete }: { onComplete: () => void }) {
  const [showAfter, setShowAfter] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 p-1 bg-[#F9FAFB] rounded-xl border border-[#E8E4DD] w-fit">
        <button
          suppressHydrationWarning
          onClick={() => setShowAfter(false)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${!showAfter ? "bg-red-500 text-white shadow" : "text-[#9CA3AF] hover:text-[#1A1A1A]"}`}
        >
          Before Zara
        </button>
        <button
          suppressHydrationWarning
          onClick={() => { setShowAfter(true); setReviewed(true); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${showAfter ? "bg-[#10B981] text-white shadow" : "text-[#9CA3AF] hover:text-[#1A1A1A]"}`}
        >
          3 Months Later
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="wait">
          {DASHBOARD_METRICS.map((m, i) => (
            <motion.div
              key={`${m.label}-${showAfter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${showAfter ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{m.icon}</span>
                <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wide">{m.label}</p>
              </div>
              <p className={`text-xl font-black ${showAfter ? "text-[#10B981]" : "text-red-600"}`}>
                {showAfter ? m.after : m.before}
              </p>
              {showAfter && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={10} className="text-[#10B981]" />
                  <p className="text-[9px] text-[#6B7280]">was: {m.before}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAfter && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-4">
            <p className="text-xs font-bold text-[#065F46] mb-1">Supplier noticed the change</p>
            <p className="text-xs text-[#4B5563]">The more predictable ordering pattern allowed the supplier to plan production efficiently. They offered a 2% volume discount on the next annual AP-7200 contract — worth $3,400 per year. Discipline paid for itself in a way that even Patrick couldn&apos;t argue with.</p>
          </div>
        </motion.div>
      )}

      {reviewed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            suppressHydrationWarning
            onClick={onComplete}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            See your scorecard →
          </button>
        </motion.div>
      )}
    </div>
  );
}
