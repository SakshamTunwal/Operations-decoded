"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import {
  MONTHLY_DATA, OVERALL_MONTHLY_AVG, JULY_SI,
  INTELLIGENCE, ADJUSTMENT_OPTIONS,
  MAPE_DATA, PRIOR_YEAR_MAPE,
  STAKEHOLDERS, CONSENSUS_TARGET, CONSENSUS_TOLERANCE,
  ASSUMPTIONS, REFORECAST_FROM, REFORECAST_TO, TEMP_DEVIATION_PCT,
  RESULTS_METRICS,
} from "./constants";

function fmt(n: number) { return n.toLocaleString(); }

// ─── 1. ProblemIdentifier ────────────────────────────────────────────────────

export function ProblemIdentifier({ onComplete }: { onComplete: () => void }) {
  const [identified, setIdentified] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const toggle = (id: string) => {
    if (done) return;
    setIdentified(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit = () => {
    setDone(true);
    onComplete();
  };

  const problems = [
    {
      id: "stockout",
      title: "SPF 50 Sport Spray — Stockout",
      detail: "July 14th: zero units on shelf. Three pallets sold out. Retailers switched to competitor.",
      cost: "$340,000 in lost sales",
      icon: "🚫",
      color: "#EF4444",
      bg: "#FFF1F2",
      border: "#FECACA",
    },
    {
      id: "overstock",
      title: "SPF 30 Lotion — Overstock",
      detail: "Same summer, different product. Bought 8,000 units too many. Still in the warehouse at season end.",
      cost: "$89,000 written off",
      icon: "📦",
      color: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FDE68A",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">Tom found two photos on his desk from the prior season.</p>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Click each photo to understand what went wrong.</p>
      </div>
      <div className="flex flex-col gap-3">
        {problems.map(p => {
          const sel = identified.has(p.id);
          return (
            <button
              key={p.id}
              suppressHydrationWarning
              onClick={() => toggle(p.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all cursor-pointer ${sel ? "" : "hover:shadow-sm"}`}
              style={{
                background: sel ? p.bg : "white",
                borderColor: sel ? p.color : "#E8E4DD",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{p.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-[#1A1A1A]">{p.title}</p>
                    {sel && <CheckCircle2 size={14} style={{ color: p.color }} />}
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">{p.detail}</p>
                  <p className="text-xs font-bold mt-2" style={{ color: p.color }}>{p.cost}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {identified.size === 2 && !done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4 mb-3">
            <p className="text-xs font-bold text-[#1D4ED8] mb-1">The paradox — same company, same summer</p>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              ProShield ran out of their bestselling product while simultaneously holding $89,000 of a slow seller they couldn&apos;t move.
              Two separate people made two separate guesses. No shared process. No common number.
            </p>
            <p className="text-[11px] text-[#1D4ED8] font-semibold mt-2">
              Tom&apos;s job: build a forecasting process everyone can argue from — and trust.
            </p>
          </div>
          <button
            suppressHydrationWarning
            onClick={submit}
            className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
          >
            Understood — Let&apos;s Build the Process →
          </button>
        </motion.div>
      )}
      {done && (
        <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
          <p className="text-xs font-semibold text-[#065F46]">Both problems identified. Time to build a better system.</p>
        </div>
      )}
    </div>
  );
}

// ─── 2. SeasonalityIndexBuilder ──────────────────────────────────────────────

export function SeasonalityIndexBuilder({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"table" | "avg" | "july" | "done">("table");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">3-Year Average Monthly Sales — SPF 50 Sport Spray</p>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Isabelle built this from three years of weekly sales data.</p>
      </div>

      {/* Monthly table */}
      <div className="rounded-xl border border-[#E8E4DD] overflow-hidden bg-white">
        <div className="grid grid-cols-4 px-3 py-2 border-b border-[#E8E4DD] bg-[#F9FAFB]">
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase">Month</p>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase text-right">Avg Sales</p>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase text-right col-span-2">Seasonality Index</p>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {MONTHLY_DATA.map((row) => {
            const isJuly = row.abbrev === "Jul";
            const showIdx = phase === "july" || phase === "done";
            return (
              <div
                key={row.abbrev}
                className={`grid grid-cols-4 px-3 py-2 text-xs ${isJuly ? "bg-[#EFF6FF]" : ""}`}
              >
                <p className={`font-semibold ${isJuly ? "text-[#1D4ED8]" : "text-[#1A1A1A]"}`}>{row.month}</p>
                <p className="text-right text-[#374151]">{fmt(row.avgSales)}</p>
                <p className="text-right col-span-2">
                  {showIdx ? (
                    <span className={`font-bold ${isJuly ? "text-[#1D4ED8]" : "text-[#374151]"}`}>
                      {row.index.toFixed(2)}
                      {isJuly && <span className="ml-1 text-[9px] bg-[#1D4ED8] text-white px-1.5 py-0.5 rounded-full">peak</span>}
                    </span>
                  ) : isJuly && phase === "avg" ? (
                    <span className="text-[#9CA3AF]">?</span>
                  ) : phase === "avg" ? (
                    <span className="text-[#9CA3AF]">—</span>
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step controls */}
      {phase === "table" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          suppressHydrationWarning
          onClick={() => setPhase("avg")}
          className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
        >
          Step 1: Calculate the Overall Monthly Average →
        </motion.button>
      )}

      {phase === "avg" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
            <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wide mb-2">Overall Monthly Average</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-[#374151]">Sum of all monthly averages</p>
              <p className="text-xs text-[#9CA3AF]">÷ 12 months</p>
              <p className="text-xs font-bold text-[#1D4ED8]">= {fmt(OVERALL_MONTHLY_AVG)}</p>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-2">
              This is the baseline: an average month sells {fmt(OVERALL_MONTHLY_AVG)} units. July sells nearly twice that.
            </p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => setPhase("july")}
            className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
          >
            Step 2: Calculate the July Seasonality Index →
          </button>
        </motion.div>
      )}

      {(phase === "july" || phase === "done") && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#1D4ED8] bg-[#EFF6FF] p-4">
            <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wide mb-3">July Seasonality Index</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-center">
                <p className="text-[9px] text-[#6B7280]">July Avg Sales</p>
                <p className="text-lg font-black text-[#1A1A1A]">{fmt(189_000)}</p>
              </div>
              <p className="text-xl text-[#9CA3AF]">÷</p>
              <div className="text-center">
                <p className="text-[9px] text-[#6B7280]">Monthly Average</p>
                <p className="text-lg font-black text-[#1A1A1A]">{fmt(OVERALL_MONTHLY_AVG)}</p>
              </div>
              <p className="text-xl text-[#9CA3AF]">=</p>
              <div className="text-center">
                <p className="text-[9px] text-[#6B7280]">July Index</p>
                <p className="text-2xl font-black text-[#1D4ED8]">{JULY_SI}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-[#1D4ED8]">What does 1.78 mean?</p>
              <p className="text-[11px] text-[#4B5563] mt-1 leading-relaxed">
                July demand is <span className="font-bold text-[#1D4ED8]">78% above</span> the average month.
                When Tom applies this index to his baseline forecast, July gets a 1.78× multiplier — which is why
                getting July right is so critical. A miss of 10% in July is 10% of 189,000 units, not 10% of the annual total.
              </p>
            </div>
            <div className="mt-3 p-3 bg-[#DBEAFE] rounded-xl">
              <p className="text-xs font-semibold text-[#1D4ED8]">Statistical baseline this year: <span className="text-lg font-black">142,000 units</span></p>
              <p className="text-[10px] text-[#1D4ED8] mt-1">3-month moving average × seasonality indices × assumed market growth</p>
            </div>
          </div>
          {phase === "july" && (
            <button
              suppressHydrationWarning
              onClick={() => { setPhase("done"); onComplete(); }}
              className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Baseline Built — 142,000 Units →
            </button>
          )}
          {phase === "done" && (
            <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
              <p className="text-xs font-semibold text-[#065F46]">Seasonality index built. Statistical baseline locked at 142,000.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── 3. IntelligenceGapAnalyzer ──────────────────────────────────────────────

export function IntelligenceGapAnalyzer({ onComplete }: { onComplete: () => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (chosen === null) return;
    setSubmitted(true);
    if (ADJUSTMENT_OPTIONS[chosen].quality === "correct") onComplete();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">The statistical baseline says 142,000. Vanessa&apos;s field intelligence says 180,000.</p>
        <p className="text-[10px] text-[#6B7280] mt-1">How much should Tom adjust the forecast? Choose the most defensible approach.</p>
      </div>

      {/* Context */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-3">
          <p className="text-[9px] font-bold text-[#1D4ED8] uppercase">Statistical Model</p>
          <p className="text-xl font-black text-[#1D4ED8] mt-1">142,000</p>
          <p className="text-[9px] text-[#6B7280]">3yr moving avg + seasonality</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3">
          <p className="text-[9px] font-bold text-[#059669] uppercase">Vanessa (Sales)</p>
          <p className="text-xl font-black text-[#059669] mt-1">180,000</p>
          <p className="text-[9px] text-[#6B7280]">3 accounts committed + heat wave</p>
        </div>
      </div>

      {/* Evidence summary */}
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-3">
        <p className="text-[10px] font-bold text-[#1A1A1A] mb-2">Evidence available to Tom</p>
        {[
          { icon: "✅", text: "SunLife Sports verbal commitment — 8,000 units for new location rollout", strength: "Verified (verbal)" },
          { icon: "⚠️", text: "Two other retail accounts — 'feeling positive' about the season", strength: "Unverified" },
          { icon: "🌡️", text: "Long-range weather forecast — hot summer likely", strength: "Directional only" },
        ].map(e => (
          <div key={e.text} className="flex items-start gap-2 py-1.5 border-b border-[#F3F4F6] last:border-0">
            <span className="text-sm flex-shrink-0">{e.icon}</span>
            <div>
              <p className="text-[10px] text-[#374151]">{e.text}</p>
              <p className="text-[9px] font-bold text-[#9CA3AF]">{e.strength}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {ADJUSTMENT_OPTIONS.map((opt, i) => {
          const isSelected = chosen === i;
          const showResult = submitted;
          const isCorrect = opt.quality === "correct";
          return (
            <button
              key={i}
              suppressHydrationWarning
              onClick={() => { if (!submitted) setChosen(i); }}
              className={`text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
                showResult
                  ? isCorrect ? "border-green-400 bg-[#ECFDF5]"
                  : isSelected ? "border-red-300 bg-[#FFF1F2]"
                  : "border-[#E8E4DD] bg-white"
                  : isSelected ? "border-[#3B82F6] bg-[#EFF6FF]" : "border-[#E8E4DD] bg-white hover:border-[#93C5FD]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#1A1A1A]">{opt.label}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-sm font-black text-[#374151]">{fmt(opt.result)}</p>
                  {showResult && isCorrect && <CheckCircle2 size={14} className="text-[#059669]" />}
                </div>
              </div>
              {showResult && (isSelected || isCorrect) && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`text-[10px] mt-2 leading-relaxed ${isCorrect ? "text-[#065F46]" : "text-[#991B1B]"}`}
                >
                  {opt.rationale}
                </motion.p>
              )}
            </button>
          );
        })}
      </div>

      {!submitted && chosen !== null && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          suppressHydrationWarning
          onClick={submit}
          className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
        >
          Lock in Adjustment →
        </motion.button>
      )}

      {submitted && ADJUSTMENT_OPTIONS[chosen!].quality === "correct" && (
        <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
          <p className="text-xs font-semibold text-[#065F46]">Tom&apos;s adjusted forecast: <span className="font-black">152,000 units</span>. Evidence-based. Defensible.</p>
        </div>
      )}

      {submitted && ADJUSTMENT_OPTIONS[chosen!].quality !== "correct" && (
        <div className="flex flex-col gap-2">
          <div className="rounded-xl border border-amber-200 bg-[#FFFBEB] p-3">
            <p className="text-xs font-semibold text-[#92400E]">The right approach is: Stat + verified SunLife account = 152,000</p>
            <p className="text-[10px] text-[#92400E] mt-1">Only take verified, evidence-based upside into the model. Document every adjustment as an assumption.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => { setChosen(2); onComplete(); }}
            className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
          >
            Understood — Use 152,000 →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 4. MAPECalculator ───────────────────────────────────────────────────────

export function MAPECalculator({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showMAPE, setShowMAPE] = useState(false);
  const [done, setDone] = useState(false);

  const reveal = (i: number) => {
    setRevealed(prev => new Set([...prev, i]));
  };

  const allRevealed = revealed.size === MAPE_DATA.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">Prior Year Forecast Accuracy — SPF 50 Sport Spray</p>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Click each row to reveal the Absolute Percentage Error (APE). Then calculate the mean.</p>
      </div>

      <div className="rounded-xl border border-[#E8E4DD] overflow-hidden bg-white">
        <div className="grid grid-cols-4 px-3 py-2 border-b border-[#E8E4DD] bg-[#F9FAFB]">
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase">Month</p>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase text-right">Forecast</p>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase text-right">Actual</p>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase text-right">APE</p>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {MAPE_DATA.map((row, i) => {
            const isRevealed = revealed.has(i);
            const isBig = row.ape > 35;
            return (
              <button
                key={row.month}
                suppressHydrationWarning
                onClick={() => reveal(i)}
                className={`w-full text-left grid grid-cols-4 px-3 py-2.5 transition-all cursor-pointer hover:bg-[#F9FAFB] ${isBig && isRevealed ? "bg-[#FFF1F2]" : ""}`}
              >
                <p className="text-xs font-semibold text-[#1A1A1A]">{row.month}</p>
                <p className="text-xs text-right text-[#374151]">{fmt(row.forecast)}</p>
                <p className="text-xs text-right text-[#374151]">{fmt(row.actual)}</p>
                <div className="text-right">
                  {isRevealed ? (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-xs font-bold ${isBig ? "text-red-600" : row.ape < 20 ? "text-[#059669]" : "text-[#F59E0B]"}`}
                    >
                      {row.ape.toFixed(1)}%
                    </motion.p>
                  ) : (
                    <p className="text-[10px] text-[#3B82F6]">tap ▶</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {allRevealed && !showMAPE && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          suppressHydrationWarning
          onClick={() => setShowMAPE(true)}
          className="w-full py-3 bg-[#EF4444] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#DC2626] transition-colors"
        >
          Calculate MAPE (Mean of All APEs) →
        </motion.button>
      )}

      {showMAPE && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-red-200 bg-[#FFF1F2] p-4">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-2">Prior Year MAPE</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-[#6B7280]">Sum of APEs ÷ 6 months</p>
                <p className="text-xs text-[#374151] mt-0.5">
                  ({MAPE_DATA.map(r => r.ape.toFixed(1)).join(" + ")}) ÷ 6
                </p>
                <p className="text-xs text-[#374151] mt-0.5">
                  = {MAPE_DATA.reduce((a, b) => a + b.ape, 0).toFixed(1)}% ÷ 6
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-red-600">{PRIOR_YEAR_MAPE.toFixed(0)}%</p>
                <p className="text-[9px] text-red-400">MAPE</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-red-100 p-2 text-center">
                <p className="text-[9px] text-red-600">Prior year</p>
                <p className="text-lg font-black text-red-600">{PRIOR_YEAR_MAPE.toFixed(0)}%</p>
              </div>
              <div className="rounded-xl bg-[#ECFDF5] p-2 text-center">
                <p className="text-[9px] text-[#059669]">Tom&apos;s target</p>
                <p className="text-lg font-black text-[#059669]">15%</p>
              </div>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-3 leading-relaxed">
              A 31% MAPE means every number downstream — production, procurement, warehousing, working capital — was built on forecasts that were off by roughly a third. That&apos;s why there was both a stockout and an overstock in the same summer.
            </p>
          </div>
          {!done && (
            <button
              suppressHydrationWarning
              onClick={() => { setDone(true); onComplete(); }}
              className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Understood — Set Target at 15% →
            </button>
          )}
          {done && (
            <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
              <p className="text-xs font-semibold text-[#065F46]">MAPE calculated: 31%. Target set: ≤15%. Tom tracks this monthly from now on.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── 5. SOPNegotiator ────────────────────────────────────────────────────────

export function SOPNegotiator({ onComplete }: { onComplete: () => void }) {
  const [consensus, setConsensus] = useState(160_000);
  const [locked, setLocked] = useState(false);

  const min = 140_000;
  const max = 182_000;
  const range = max - min;
  const isNearTarget = Math.abs(consensus - CONSENSUS_TARGET) <= CONSENSUS_TOLERANCE;

  const lock = () => {
    if (!isNearTarget) return;
    setLocked(true);
    onComplete();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">ProShield S&OP Meeting — All numbers on the table.</p>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Four people, four positions. Drag the slider to find consensus. The process requires everyone to accept the same number.</p>
      </div>

      {/* Stakeholder positions */}
      <div className="grid grid-cols-2 gap-2">
        {STAKEHOLDERS.map(s => {
          const accepting = consensus >= s.acceptableRange[0] && consensus <= s.acceptableRange[1];
          return (
            <div
              key={s.name}
              className="rounded-xl border-2 p-3 transition-all"
              style={{
                borderColor: accepting ? s.color : "#E8E4DD",
                background: accepting ? s.bgColor : "white",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold" style={{ color: s.color }}>{s.name}</p>
                <p className="text-[9px] text-[#9CA3AF]">{s.role}</p>
              </div>
              <p className="text-lg font-black text-[#1A1A1A]">{fmt(s.forecast)}</p>
              <p className="text-[9px] text-[#9CA3AF] mt-1 leading-tight">{s.rationale.slice(0, 60)}...</p>
              <div className="mt-2 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${accepting ? "bg-[#10B981]" : "bg-[#D1D5DB]"}`} />
                <p className="text-[9px]" style={{ color: accepting ? "#059669" : "#9CA3AF" }}>
                  {accepting ? "Acceptable" : "Would push back"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus slider */}
      <div className="rounded-xl border border-[#E8E4DD] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#1A1A1A]">Consensus Forecast</p>
          <p className={`text-xl font-black ${isNearTarget ? "text-[#059669]" : "text-[#3B82F6]"}`}>{fmt(consensus)}</p>
        </div>
        <input
          suppressHydrationWarning
          type="range"
          min={min}
          max={max}
          step={1000}
          value={consensus}
          onChange={e => setConsensus(Number(e.target.value))}
          className="w-full accent-[#3B82F6] cursor-pointer"
          disabled={locked}
        />
        <div className="flex justify-between mt-1">
          <p className="text-[9px] text-[#9CA3AF]">{fmt(min)}</p>
          <p className="text-[9px] text-[#9CA3AF]">{fmt(max)}</p>
        </div>
        {isNearTarget && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl bg-[#ECFDF5] border border-green-200 p-3"
          >
            <p className="text-xs font-bold text-[#059669]">✓ All four stakeholders can accept this number</p>
            <p className="text-[10px] text-[#065F46] mt-1">
              Statistical anchor + verified SunLife uplift + conservative buffer for Vanessa&apos;s other accounts.
              Chloe&apos;s production budget can flex here. Omar confirms supply chain can support it.
            </p>
          </motion.div>
        )}
      </div>

      {isNearTarget && !locked && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          suppressHydrationWarning
          onClick={lock}
          className="w-full py-3 bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#047857] transition-colors"
        >
          Lock Consensus at {fmt(consensus)} →
        </motion.button>
      )}
      {locked && (
        <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
          <p className="text-xs font-semibold text-[#065F46]">
            S&OP consensus locked at {fmt(consensus)}. Everyone signed. Production schedule updated.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 6. AssumptionLogger ─────────────────────────────────────────────────────

export function AssumptionLogger({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"log" | "triggers" | "alert" | "reforecast" | "done">("log");
  const [triggerMarked, setTriggerMarked] = useState<Set<string>>(new Set());

  const toggleTrigger = (id: string) => {
    setTriggerMarked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const correctTriggers = ASSUMPTIONS.filter(a => a.isReforecastTrigger).map(a => a.id);
  const markedTriggers = ASSUMPTIONS.filter(a => a.isReforecastTrigger && triggerMarked.has(a.id));
  const allCorrect = correctTriggers.every(id => triggerMarked.has(id));

  return (
    <div className="flex flex-col gap-4">
      {phase === "log" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
            <p className="text-xs font-bold text-[#1A1A1A]">Tom logs every assumption behind the 158,000 forecast.</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">An assumption log is only useful if it&apos;s connected to action.</p>
          </div>
          <div className="flex flex-col gap-2">
            {ASSUMPTIONS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-[#E8E4DD] bg-white p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-[#9CA3AF] flex-shrink-0 mt-0.5">{a.id}</span>
                  <p className="text-xs text-[#1A1A1A]">{a.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            suppressHydrationWarning
            onClick={() => setPhase("triggers")}
            className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
          >
            Now Set the Reforecast Triggers →
          </button>
        </motion.div>
      )}

      {phase === "triggers" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
            <p className="text-xs font-bold text-[#1A1A1A]">Which assumptions, if wrong, should trigger an immediate reforecast?</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Select the assumptions with direct, measurable impact on volume.</p>
          </div>
          <div className="flex flex-col gap-2">
            {ASSUMPTIONS.map(a => {
              const marked = triggerMarked.has(a.id);
              return (
                <button
                  key={a.id}
                  suppressHydrationWarning
                  onClick={() => toggleTrigger(a.id)}
                  className={`text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
                    marked ? "border-[#EF4444] bg-[#FFF1F2]" : "border-[#E8E4DD] bg-white hover:border-[#93C5FD]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${marked ? "bg-[#EF4444] border-[#EF4444]" : "border-[#D1D5DB]"}`}>
                      {marked && <span className="text-white text-[8px]">✓</span>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">{a.id}: {a.text}</p>
                      <p className="text-[9px] text-[#9CA3AF] mt-0.5">{a.triggerThreshold}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {triggerMarked.size >= 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              suppressHydrationWarning
              onClick={() => setPhase("alert")}
              className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Lock Triggers — Fast Forward to Mid-Season →
            </motion.button>
          )}
          {triggerMarked.size >= 1 && !allCorrect && (
            <p className="text-[10px] text-[#6B7280] text-center">
              Hint: focus on assumptions with direct, measurable volume impact
            </p>
          )}
        </motion.div>
      )}

      {phase === "alert" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="rounded-xl border border-red-300 bg-[#FFF1F2] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌡️</span>
              <p className="text-sm font-bold text-red-600">Mid-Season Alert — Week 8</p>
            </div>
            <p className="text-xs text-[#374151] leading-relaxed">
              NOAA confirms: temperatures running <strong className="text-red-600">{TEMP_DEVIATION_PCT}% above seasonal baseline</strong> for 3 consecutive weeks.
              Your trigger threshold for assumption A1 was: temperatures &gt;1°C above baseline for 2 consecutive weeks.
            </p>
            <div className="mt-3 rounded-xl bg-red-100 p-3">
              <p className="text-xs font-bold text-red-700">Assumption A1 Trigger Fired</p>
              <p className="text-[10px] text-red-600 mt-1">
                The assumption &quot;average summer temperatures ≥ 2°C above seasonal baseline&quot; has been exceeded.
                {markedTriggers.find(t => t.id === "A1")
                  ? " You correctly flagged this as a reforecast trigger."
                  : " This assumption requires an immediate reforecast."}
              </p>
            </div>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => setPhase("reforecast")}
            className="w-full py-3 bg-[#EF4444] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#DC2626] transition-colors"
          >
            Trigger Reforecast →
          </button>
        </motion.div>
      )}

      {phase === "reforecast" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="rounded-xl border border-green-300 bg-[#ECFDF5] p-4">
            <p className="text-xs font-bold text-[#059669] mb-2">Mid-Season Reforecast</p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[9px] text-[#6B7280]">Consensus forecast</p>
                <p className="text-xl font-black text-[#D97706]">{fmt(REFORECAST_FROM)}</p>
              </div>
              <TrendingUp size={24} className="text-[#059669]" />
              <div className="text-center">
                <p className="text-[9px] text-[#6B7280]">Revised forecast</p>
                <p className="text-xl font-black text-[#059669]">{fmt(REFORECAST_TO)}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#374151] mt-3 leading-relaxed">
              Tom revised the forecast from {fmt(REFORECAST_FROM)} to {fmt(REFORECAST_TO)} based on confirmed temperature data.
              He notified Omar immediately — giving production 14 days to adjust the schedule before the peak window.
            </p>
            <p className="text-[11px] text-[#1D4ED8] font-semibold mt-2">
              Without the assumption log, this trigger would have been missed. The season would have looked like last year.
            </p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => { setPhase("done"); onComplete(); }}
            className="w-full py-3 bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#047857] transition-colors"
          >
            Reforecast Submitted — Head to Season End →
          </button>
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
          <p className="text-xs font-semibold text-[#065F46]">
            Assumption log complete. Reforecast triggered. Production adjusted. Forecast: {fmt(REFORECAST_TO)}.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 7. ResultsDashboard ─────────────────────────────────────────────────────

export function ResultsDashboard({ onComplete }: { onComplete: () => void }) {
  const [view, setView] = useState<"before" | "after">("before");
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF7] px-4 py-3">
        <p className="text-xs font-bold text-[#1A1A1A]">September — Season Close Results</p>
        <p className="text-[10px] text-[#6B7280] mt-0.5">ProShield SPF 50 Sport Spray. Before and after Tom&apos;s process.</p>
      </div>

      {/* Toggle */}
      <div className="flex rounded-xl border border-[#E8E4DD] overflow-hidden bg-white">
        {(["before", "after"] as const).map(v => (
          <button
            key={v}
            suppressHydrationWarning
            onClick={() => setView(v)}
            className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
              view === v
                ? v === "before" ? "bg-red-500 text-white" : "bg-[#059669] text-white"
                : "text-[#9CA3AF] hover:text-[#374151]"
            }`}
          >
            {v === "before" ? "Prior Year (Before)" : "This Year (After)"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="grid grid-cols-2 gap-3"
        >
          {RESULTS_METRICS.map(m => (
            <div
              key={m.label}
              className={`rounded-xl border p-3 ${
                view === "before" ? "border-red-200 bg-[#FFF1F2]" : "border-green-200 bg-[#ECFDF5]"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{m.icon}</span>
                <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wide">{m.label}</p>
              </div>
              <p className={`text-sm font-black ${view === "before" ? "text-red-600" : "text-[#059669]"}`}>
                {view === "before" ? m.before : m.after}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {view === "after" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#1D4ED8] bg-[#EFF6FF] p-4">
            <div className="flex items-start gap-3">
              <TrendingDown size={20} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#1D4ED8]">The number everyone argued about ended up at 169,400</p>
                <p className="text-[11px] text-[#374151] mt-1 leading-relaxed">
                  Consensus was 158,000. Reforecast to 172,000. Actual: 169,400. Miss of 2,600 units — or 1.5%.
                  Season MAPE: <strong className="text-[#059669]">14.2%</strong> (down from 31%).
                  They didn&apos;t argue about the number. They argued about the process — and the process worked.
                </p>
              </div>
            </div>
          </div>
          {!done && (
            <button
              suppressHydrationWarning
              onClick={() => { setDone(true); onComplete(); }}
              className="w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              View Final Score →
            </button>
          )}
          {done && (
            <div className="rounded-xl border border-green-200 bg-[#ECFDF5] p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#059669] flex-shrink-0" />
              <p className="text-xs font-semibold text-[#065F46]">Results reviewed. MAPE: 14.2%. Service level: 97%.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
