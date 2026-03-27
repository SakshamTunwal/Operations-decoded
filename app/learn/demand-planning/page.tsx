"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, INITIAL_STATE } from "./constants";
import type { GameState, GlossaryTerm } from "./types";
import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, sceneVariants } from "./scene-wrapper";
import {
  ProblemIdentifier, SeasonalityIndexBuilder, IntelligenceGapAnalyzer,
  MAPECalculator, SOPNegotiator, AssumptionLogger, ResultsDashboard,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Quiz data ───────────────────────────────────────────────────────────────

const QUIZ_DATA = [
  {
    step: 2,
    question: "What does a seasonality index of 1.78 in July mean for ProShield's SPF 50 forecast?",
    options: [
      { label: "July accounts for 1.78% of the annual total",              value: "pct" },
      { label: "July demand is 78% above the monthly average",             value: "above" },
      { label: "We should carry 1.78 months of safety stock in July",      value: "safety" },
      { label: "July prices should be 78% higher than other months",       value: "price" },
    ],
    correctValue: "above",
    explanation: "A seasonality index of 1.78 means July sales are 178% of the average month — or 78% above it. Indices above 1.0 indicate above-average months; below 1.0 means below-average. These indices are multiplied against the smoothed baseline to project each month's volume. Getting July right matters disproportionately because it's the highest-volume month.",
  },
  {
    step: 4,
    question: "Tom's MAPE dropped from 31% to 14.2% in one season. What does MAPE measure?",
    options: [
      { label: "The percentage of inventory that goes unsold",                                        value: "unsold" },
      { label: "The average absolute percentage difference between forecast and actual demand",        value: "mape" },
      { label: "The profit margin earned on each unit sold",                                          value: "margin" },
      { label: "The percentage of customer orders fulfilled on time",                                 value: "service" },
    ],
    correctValue: "mape",
    explanation: "MAPE = mean of |Forecast − Actual| / Actual × 100. A 14.2% MAPE means Tom's monthly forecasts are off by an average of 14.2% of actual demand — whether too high or too low. For seasonal consumer goods, best-in-class MAPE is 10–15%. At 31%, every downstream decision (production, procurement, warehousing) absorbed the cost of systematic over- or under-forecasting.",
  },
  {
    step: 6,
    question: "Mid-season temperatures ran 12% above forecast. What should Tom do?",
    options: [
      { label: "Wait until year-end and incorporate it into next year's model",   value: "wait" },
      { label: "Trigger a mid-season reforecast and alert production immediately",value: "trigger" },
      { label: "Increase safety stock by 12% across all SKUs",                   value: "stock" },
      { label: "Inform the sales team but hold the production schedule steady",   value: "hold" },
    ],
    correctValue: "trigger",
    explanation: "An assumption log only works if it's connected to action. When a pre-defined trigger fires — temperatures running 12% above seasonal baseline — the process requires an immediate reforecast. Tom revised from 158k to 172k and notified Omar right away. This gave production 14 days to adjust the schedule. Waiting until year-end would have meant running short again — the same mistake as the prior year.",
  },
];

// ─── Shared scene props ──────────────────────────────────────────────────────

interface SceneProps {
  gs: GameState;
  advance: (n: number) => void;
  updateGs: (p: Partial<GameState>) => void;
  unlockGlossary: (i: number) => void;
  showToast: (msg: string, type?: "success" | "warning" | "error") => void;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "warning" | "error"; onClose: () => void }) {
  const bg = {
    success: "bg-[#EFF6FF] border-blue-200 text-blue-800",
    warning: "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]",
    error:   "bg-red-50 border-red-200 text-red-800",
  }[type];
  const barColor = { success: "bg-[#3B82F6]", warning: "bg-[#f59e0b]", error: "bg-red-400" }[type];
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ x: "calc(100% + 2rem)", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "calc(100% + 2rem)", opacity: 0 }}
      className={`fixed top-4 right-4 z-50 max-w-xs rounded-xl border shadow-lg overflow-hidden ${bg}`}
    >
      <div className="px-4 py-3 flex items-start gap-2">
        <p className="text-xs font-semibold flex-1">{msg}</p>
        <button suppressHydrationWarning onClick={onClose} className="cursor-pointer flex-shrink-0 opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`h-0.5 ${barColor}`}
      />
    </motion.div>
  );
}

// ─── Glossary Panel ──────────────────────────────────────────────────────────

function GlossaryPanel({ glossary }: { glossary: GlossaryTerm[] }) {
  const [open, setOpen] = useState(false);
  const unlocked = glossary.filter(g => g.unlocked);
  return (
    <div className="rounded-2xl border border-[#E8E4DD] overflow-hidden bg-white shadow-sm">
      <button
        suppressHydrationWarning
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#FAFAF7] transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-[#3B82F6]" />
          <p className="text-xs font-bold text-[#1A1A1A]">Glossary</p>
          <span className="text-[9px] bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded-full font-semibold">
            {unlocked.length}/{glossary.length}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-[#9CA3AF]" /> : <ChevronDown size={14} className="text-[#9CA3AF]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              {glossary.map(g => (
                <div
                  key={g.term}
                  className={`rounded-xl px-3 py-2 border transition-all ${
                    g.unlocked ? "bg-[#EFF6FF] border-blue-200" : "bg-[#F9FAFB] border-[#E8E4DD] opacity-50"
                  }`}
                >
                  <p className={`text-xs font-bold ${g.unlocked ? "text-[#1D4ED8]" : "text-[#9CA3AF]"}`}>
                    {g.unlocked ? g.term : "???"}
                  </p>
                  {g.unlocked && <p className="text-[10px] text-[#6B7280] mt-0.5 leading-relaxed">{g.definition}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scene components ────────────────────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "done">("dialogue");

  const dialogues = [
    { character: "narrator" as const, text: "January. Tom Kessler's first week as Demand Planning Manager at ProShield." },
    { character: "tom"      as const, text: "Two photos. That's how my predecessor left it." },
    { character: "tom"      as const, text: "Left one: July 14th. Three pallets of SPF 50 Sport Spray. Right one: competitor's shelf. Fully stocked." },
    { character: "isabelle" as const, text: "That stockout cost us $340,000 in lost sales. Retailers switched to the competition the same week." },
    { character: "tom"      as const, text: "And the overstock?" },
    { character: "isabelle" as const, text: "SPF 30 Lotion. We over-bought by 8,000 units. Wrote off $89,000 at season end." },
    { character: "tom"      as const, text: "Same summer. Same company. How does that happen?" },
    { character: "isabelle" as const, text: "Two separate people. Two separate guesses. No shared process. No common number." },
    { character: "narrator" as const, text: "Tom's mission: build a forecasting process that everyone would trust — and argue from." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <ProblemIdentifier onComplete={() => {
              updateGs({ problemsIdentified: true });
              unlockGlossary(0);
              unlockGlossary(1);
              showToast("Two problems identified. Building the solution.", "success");
              setPhase("done");
            }} />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Root cause identified. Time to build the baseline forecast.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(2)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: Build the Baseline →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "quiz" | "done">("dialogue");

  const dialogues = [
    { character: "isabelle" as const, text: "Step one is a statistical baseline. We let the data tell us what to expect — without any human assumptions baked in." },
    { character: "tom"      as const, text: "Three years of monthly sales?" },
    { character: "isabelle" as const, text: "Exactly. Look at July — 189,000 units. The monthly average across the year is 106,300." },
    { character: "isabelle" as const, text: "Divide July by the average and you get the seasonality index: 1.78. July runs 78% above average." },
    { character: "tom"      as const, text: "And we use a 3-month moving average to smooth the baseline before applying indices." },
    { character: "isabelle" as const, text: "Right. The moving average removes noise. The indices give us the shape — the seasonal curve." },
    { character: "isabelle" as const, text: "Before adding any human judgement... the model says 142,000 units for this year's SPF 50." },
    { character: "tom"      as const, text: "That's the anchor. Everything else is an adjustment we have to justify — and document." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <SeasonalityIndexBuilder onComplete={() => {
              updateGs({ seasonalityBuilt: true });
              unlockGlossary(2);
              unlockGlossary(3);
              unlockGlossary(4);
              showToast("Baseline built. Statistical anchor: 142,000 units.", "success");
              setPhase("quiz");
            }} />
          </motion.div>
        )}
        {phase === "quiz" && (
          <motion.div key="quiz" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MicroQuiz
              question={QUIZ_DATA[0].question}
              options={QUIZ_DATA[0].options}
              correctValue={QUIZ_DATA[0].correctValue}
              explanation={QUIZ_DATA[0].explanation}
              onDone={(correct) => {
                if (correct) {
                  updateGs({ quizScore: gs.quizScore + 1 });
                  showToast("Correct! Seasonality index = demand relative to the average month.", "success");
                }
                setPhase("done");
              }}
            />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Statistical baseline: 142,000 units. Now Vanessa has different ideas.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(3)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: The Intelligence Gap →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "done">("dialogue");

  const dialogues = [
    { character: "tom"     as const, text: "I've built the statistical baseline. 142,000 units." },
    { character: "vanessa" as const, text: "142? Tom, I've got three major retail accounts telling me this is going to be a breakout year. I'm seeing 180,000." },
    { character: "tom"     as const, text: "That's a 38,000-unit gap." },
    { character: "vanessa" as const, text: "SunLife Sports is opening 200 new locations. They've verbally committed to a launch display. That's 8,000 units alone." },
    { character: "tom"     as const, text: "Can you get that in writing?" },
    { character: "vanessa" as const, text: "It's a verbal commitment right now. But I trust Maya on this." },
    { character: "tom"     as const, text: "I trust Maya too. But verbal commitments have a conversion rate. What about the other 30,000?" },
    { character: "vanessa" as const, text: "Market feel. Long-range forecast has a hot summer." },
    { character: "tom"     as const, text: "Market feel is real information. But I can't put it in the model at full weight — not without evidence." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <IntelligenceGapAnalyzer onComplete={() => {
              updateGs({ intelligenceGapAnalyzed: true });
              unlockGlossary(5);
              unlockGlossary(6);
              showToast("Tom's adjusted forecast: 152,000. Evidence-based.", "success");
              setPhase("done");
            }} />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Adjusted forecast: 152,000. Before the S&OP, Tom needs to measure how bad last year really was.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(4)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: Calculate the MAPE →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "quiz" | "done">("dialogue");

  const dialogues = [
    { character: "tom"      as const, text: "Before I build a new forecast, I need to understand how bad the old one was." },
    { character: "tom"      as const, text: "MAPE — Mean Absolute Percentage Error. It tells me how wrong we were, on average, as a percentage of actual demand." },
    { character: "isabelle" as const, text: "Last year's MAPE was 31%. Industry best practice for seasonal consumer goods is 10–15%." },
    { character: "tom"      as const, text: "31% means we were off by roughly a third. On average. That explains both problems." },
    { character: "isabelle" as const, text: "The July miss was 37.6%. The September overstock was 51.5%. Those two months alone tanked the average." },
    { character: "tom"      as const, text: "We're going to track MAPE every month going forward. Target: below 15% by year-end." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MAPECalculator onComplete={() => {
              updateGs({ mapeCalculated: true });
              unlockGlossary(4);
              showToast("MAPE calculated: 31%. Target: 15%. Tracking starts now.", "success");
              setPhase("quiz");
            }} />
          </motion.div>
        )}
        {phase === "quiz" && (
          <motion.div key="quiz" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MicroQuiz
              question={QUIZ_DATA[1].question}
              options={QUIZ_DATA[1].options}
              correctValue={QUIZ_DATA[1].correctValue}
              explanation={QUIZ_DATA[1].explanation}
              onDone={(correct) => {
                if (correct) {
                  updateGs({ quizScore: gs.quizScore + 1 });
                  showToast("Correct! MAPE measures average forecast error as % of actual.", "success");
                }
                setPhase("done");
              }}
            />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Baseline ready. MAPE documented. Time for the S&OP meeting.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(5)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: The S&OP Meeting →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "done">("dialogue");

  const dialogues = [
    { character: "narrator" as const, text: "January 17th. ProShield's first-ever S&OP consensus meeting." },
    { character: "omar"     as const, text: "Let's get all numbers on the table." },
    { character: "tom"      as const, text: "Statistical baseline: 142,000. My adjusted forecast with verified accounts: 152,000." },
    { character: "vanessa"  as const, text: "Sales field intelligence: 180,000. SunLife is real, and they're going to be big." },
    { character: "chloe"    as const, text: "Finance budget: 150,000. That's what we planned for production capacity." },
    { character: "omar"     as const, text: "Range is 142 to 180. That's not a forecast. That's four separate opinions." },
    { character: "tom"      as const, text: "The process is: start with the statistical anchor, layer in verified evidence, agree on risk." },
    { character: "vanessa"  as const, text: "I won't sign off on 142. The SunLife launch alone moves it above 150." },
    { character: "chloe"    as const, text: "I can flex to 158 if we agree on the production timeline with Omar." },
    { character: "omar"     as const, text: "158 works for supply chain. And we document why — so next year we have something to learn from." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <SOPNegotiator onComplete={() => {
              updateGs({ sopConsensusReached: true });
              unlockGlossary(5);
              showToast("Consensus locked. Production schedule confirmed.", "success");
              setPhase("done");
            }} />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Consensus: 158,000. Everyone signed. Now Tom needs to protect that number with an assumption log.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(6)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: Build the Assumption Log →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "quiz" | "done">("dialogue");

  const dialogues = [
    { character: "tom"      as const, text: "Every assumption behind 158,000 gets logged." },
    { character: "isabelle" as const, text: "And each assumption needs a trigger — a specific measurable condition that would fire a reforecast." },
    { character: "tom"      as const, text: "Temperature assumption: if summer temps run more than 1°C above baseline for two weeks, we reforecast." },
    { character: "tom"      as const, text: "SunLife assumption: if they confirm the PO by March 31, the number holds. If not, we revisit." },
    { character: "narrator" as const, text: "Six weeks later. Week of February 28." },
    { character: "tom"      as const, text: "NOAA confirms: temperatures running 12% above seasonal baseline for three consecutive weeks." },
    { character: "isabelle" as const, text: "Trigger fires. We reforecast." },
    { character: "tom"      as const, text: "From 158,000 to 172,000. And I'm calling Omar now so he can adjust the production schedule before the peak window closes." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <AssumptionLogger onComplete={() => {
              updateGs({ assumptionsLogged: true });
              unlockGlossary(7);
              unlockGlossary(8);
              showToast("Assumption log complete. Reforecast triggered: 172,000.", "success");
              setPhase("quiz");
            }} />
          </motion.div>
        )}
        {phase === "quiz" && (
          <motion.div key="quiz" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MicroQuiz
              question={QUIZ_DATA[2].question}
              options={QUIZ_DATA[2].options}
              correctValue={QUIZ_DATA[2].correctValue}
              explanation={QUIZ_DATA[2].explanation}
              onDone={(correct) => {
                if (correct) {
                  updateGs({ quizScore: gs.quizScore + 1 });
                  showToast("Correct! Mid-season triggers must connect to immediate action.", "success");
                }
                setPhase("done");
              }}
            />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">Assumption log live. Reforecast at 172,000. Fast forward to season close.</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(7)}
              className="mt-3 w-full py-3 bg-[#3B82F6] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#2563EB] transition-colors"
            >
              Next: The Results →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "interact" | "done">("dialogue");

  const dialogues = [
    { character: "narrator" as const, text: "September. Season close. ProShield's all-hands." },
    { character: "tom"      as const, text: "Final tally: 169,400 units sold." },
    { character: "vanessa"  as const, text: "We beat our reforecast — and we didn't run out once. Not once." },
    { character: "tom"      as const, text: "End-of-season inventory: 103 units. $18,400 value. Manageable, not a write-off." },
    { character: "chloe"    as const, text: "Versus $89,000 written off last year. That's a $70,600 improvement on one product line alone." },
    { character: "omar"     as const, text: "Production ran on schedule. Zero emergency line changeovers. The supply chain team actually had a calm summer." },
    { character: "tom"      as const, text: "The number everyone argued about ended up at 169. Our consensus was 158." },
    { character: "isabelle" as const, text: "Season MAPE: 14.2%. Down from 31% in one year." },
    { character: "tom"      as const, text: "We didn't get it perfect. We got better, together. Same time next January — and now we have a baseline to argue from." },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div key="dial" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <DialogueSequence lines={dialogues} onComplete={() => setPhase("interact")} />
          </motion.div>
        )}
        {phase === "interact" && (
          <motion.div key="int" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <ResultsDashboard onComplete={() => {
              updateGs({ resultsReviewed: true });
              unlockGlossary(9);
              showToast("Season complete. MAPE: 14.2%. Service level: 97%.", "success");
              setPhase("done");
            }} />
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div key="done" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold text-[#1D4ED8]">
                ProShield&apos;s first full demand planning cycle — complete.
              </p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => advance(8)}
              className="mt-3 w-full py-3 bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#047857] transition-colors"
            >
              View Your Score →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "demand-planning-progress";

export default function DemandPlanningPage() {
  const [step, setStep]       = useState(1);
  const [gs, setGs]           = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [toast, setToast]     = useState<{ msg: string; type: "success"|"warning"|"error"; id: number } | null>(null);
  const [showScorecard, setShowScorecard] = useState(false);
  const toastId = useRef(0);

  // Restore progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.step) setStep(saved.step);
        if (saved.gs)   setGs(saved.gs);
        if (saved.glossary) setGlossary(saved.glossary);
        if (saved.showScorecard) setShowScorecard(true);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, gs, glossary, showScorecard }));
    } catch { /* ignore */ }
  }, [step, gs, glossary, showScorecard]);

  const advance = useCallback((n: number) => {
    if (n > 7) {
      setShowScorecard(true);
    } else {
      setStep(n);
    }
  }, []);

  const updateGs = useCallback((p: Partial<GameState>) => {
    setGs(prev => ({ ...prev, ...p }));
  }, []);

  const unlockGlossary = useCallback((i: number) => {
    setGlossary(prev => prev.map((g, idx) => idx === i ? { ...g, unlocked: true } : g));
  }, []);

  const showToast = useCallback((msg: string, type: "success"|"warning"|"error" = "success") => {
    toastId.current += 1;
    setToast({ msg, type, id: toastId.current });
  }, []);

  const restart = useCallback(() => {
    setStep(1);
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setShowScorecard(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const sceneProps: SceneProps = { gs, advance, updateGs, unlockGlossary, showToast };

  const stepInfo = STEPS.find(s => s.num === step);

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center px-4 py-8">
      <AnimatePresence>
        {toast && (
          <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg flex flex-col gap-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 8 — Demand Planning</p>
              <h1 className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                The Number Everyone Argues About
              </h1>
            </div>
            {!showScorecard && (
              <div className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
                <AlertTriangle size={12} className="text-[#3B82F6]" />
                <span>ProShield</span>
              </div>
            )}
          </div>
          {!showScorecard && <JourneyMap currentStep={step} />}
        </motion.div>

        {/* Scene + content */}
        {!showScorecard ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-4"
            >
              {/* Scene visual */}
              <SceneWrapper step={step} />

              {/* Step label */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{stepInfo?.icon}</span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]">{stepInfo?.label}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{stepInfo?.location} · {stepInfo?.time}</p>
                </div>
              </div>

              {/* Scene component */}
              {step === 1 && <Scene1 {...sceneProps} />}
              {step === 2 && <Scene2 {...sceneProps} />}
              {step === 3 && <Scene3 {...sceneProps} />}
              {step === 4 && <Scene4 {...sceneProps} />}
              {step === 5 && <Scene5 {...sceneProps} />}
              {step === 6 && <Scene6 {...sceneProps} />}
              {step === 7 && <Scene7 {...sceneProps} />}

              {/* Glossary */}
              <GlossaryPanel glossary={glossary} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DynamicScorecard gameState={gs} onRestart={restart} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
