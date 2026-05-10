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
  AuditReconciler, StockoutSimulator, CarryingCostCalculator,
  ROPBuilder, BullwhipAnalyzer, ABCClassifier, InventoryDashboard,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Quiz data ─────────────────────────────────────────────────────────────────

const QUIZ_DATA = [
  {
    step: 2,
    question: "The ERP system shows 340 units of AP-7200. A physical count finds 287. What is the most likely explanation for the 53-unit gap?",
    options: [
      { label: "Normal shrinkage — all warehouses have this",              value: "normal"   },
      { label: "Accumulated errors: receiving, picking, and return scan failures", value: "accumulated" },
      { label: "The physical count team made mistakes",                    value: "countError" },
    ],
    correctValue: "accumulated",
    explanation: "Inventory gaps rarely result from a single event. They compound over time from small, repeated failures: goods received without proper scanning, units picked and dispatched without system update, returns not scanned back in. Darren accelerated this by 'smoothing' the numbers — adjusting the system to match the story he wanted to tell rather than reconciling actual gaps.",
  },
  {
    step: 5,
    question: "The AP-7200 has an average daily demand of 4 units and a 45-day supplier lead time. Safety stock is 30 units. What is the correct reorder point?",
    options: [
      { label: "150 units (4 × 45 only, no safety stock)", value: "180" },
      { label: "210 units (4 × 45 + 30 safety stock)",     value: "210" },
      { label: "240 units (45 + 30 × 4, different formula)", value: "240" },
    ],
    correctValue: "210",
    explanation: "ROP = (Average Daily Demand × Lead Time) + Safety Stock = (4 × 45) + 30 = 180 + 30 = 210. The 180-unit floor represents consumption during the replenishment window. The 30-unit safety stock buffer protects against demand spikes or supplier delays. Without safety stock, any above-average demand period during the 45-day window would cause a stockout.",
  },
  {
    step: 6,
    question: "In ABC analysis, a SKU generating 3% of annual revenue should be classified as:",
    options: [
      { label: "A — it still generates revenue and should be managed tightly", value: "A" },
      { label: "B — mid-range revenue warrants mid-range attention",            value: "B" },
      { label: "C — low revenue contribution; use simple min-max controls",    value: "C" },
    ],
    correctValue: "C",
    explanation: "A SKU contributing 3% of revenue falls into the C category — the bottom 50% of SKUs that collectively generate only ~5% of revenue. These items don't warrant the same weekly cycle counts and tight ROP monitoring as A items. Simple min-max inventory levels and quarterly review is sufficient. Over-managing C items wastes time better spent on the 20% of SKUs driving 80% of revenue.",
  },
];

// ─── Shared scene props ────────────────────────────────────────────────────────

interface SceneProps {
  gs: GameState;
  advance: (n: number) => void;
  updateGs: (p: Partial<GameState>) => void;
  unlockGlossary: (i: number) => void;
  showToast: (msg: string, type?: "success" | "warning" | "error") => void;
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "warning" | "error"; onClose: () => void }) {
  const bg = {
    success: "bg-[#ECFDF5] border-green-200 text-green-800",
    warning: "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]",
    error:   "bg-red-50 border-red-200 text-red-800",
  }[type];
  const barColor = { success: "bg-[#10B981]", warning: "bg-[#f59e0b]", error: "bg-red-400" }[type];
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
        <button suppressHydrationWarning onClick={onClose} aria-label="Close" className="cursor-pointer flex-shrink-0 opacity-60 hover:opacity-100">
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

// ─── Glossary Drawer ──────────────────────────────────────────────────────────

function GlossaryDrawer({ terms, open, onClose }: { terms: GlossaryTerm[]; open: boolean; onClose: () => void }) {
  const unlocked = terms.filter((t) => t.unlocked);
  const locked   = terms.filter((t) => !t.unlocked);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-[#E8E4DD] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>Glossary</h3>
                <p className="text-[10px] text-[#9CA3AF]">{unlocked.length}/{terms.length} terms unlocked</p>
              </div>
              <button suppressHydrationWarning onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-[#F9FAFB] cursor-pointer">
                <X size={18} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {unlocked.map((term) => (
                <div key={term.term} className="rounded-xl bg-[#ECFDF5] border border-[#10B981]/20 p-3">
                  <p className="text-xs font-bold text-[#065F46] mb-1">{term.term}</p>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">{term.definition}</p>
                </div>
              ))}
              {locked.map((term) => (
                <div key={term.term} className="rounded-xl bg-[#F9FAFB] border border-[#E8E4DD] p-3 opacity-50">
                  <p className="text-xs font-bold text-[#9CA3AF]">{term.term}</p>
                  <p className="text-[11px] text-[#9CA3AF]">Unlock by progressing through the module.</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 1: The Handover That Wasn't ────────────────────────────────────────

function Scene1({ gs, advance, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "done">("dialogue");

  const lines = [
    { character: "narrator" as const, text: "Zara Okafor's first morning as Inventory Manager began with a handover that wasn't one. Her predecessor had left two weeks earlier. His desk was cleared, his laptop wiped. What he hadn't left behind was any form of documentation — no process notes, no reorder schedule, no supplier contacts. Four years of institutional knowledge had walked out the door." },
    { character: "zara" as const,     text: "Kwame, I want to start with a full physical stock count. Not a system pull — an actual walk-the-floor audit. Can we do it this week?" },
    { character: "kwame" as const,    text: "We can do it. But you should know — the last time someone did a full count was fourteen months ago, and Darren didn't like what came back. He adjusted the numbers in the system to match what he wanted and never reconciled the actual gaps." },
    { character: "zara" as const,     text: "He adjusted the system to match what he wanted?" },
    { character: "kwame" as const,    text: "He called it 'smoothing.' The system says what Darren told it to say. The shelves say what's actually there. I've been keeping my own paper notes because I stopped trusting the screen about two years ago." },
    { character: "zara" as const,     text: "We count everything. Starting tomorrow morning." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence
          lines={lines}
          onComplete={() => {
            unlockGlossary(0); // Inventory Accuracy
            unlockGlossary(1); // Cycle Count
            showToast("📖 Unlocked: Inventory Accuracy & Cycle Count", "success");
            setPhase("done");
          }}
        />
      )}
      {phase === "done" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
            <p className="text-sm font-bold text-[#065F46] mb-1">The system cannot be trusted. The shelves are the source of truth.</p>
            <p className="text-xs text-[#4B5563]">340 SKUs. $4.2 million in inventory. One ERP system that was supposed to be the single source of truth. And a two-year gap between what it said and what was actually there.</p>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => advance(2)}
            className="self-start px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Begin the audit →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 2: The Count ────────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "audit" | "quiz" | "done">(
    gs.auditFlagged.length > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[0];

  const lines = [
    { character: "narrator" as const, text: "The count took two full days. Zara, Kwame, and four warehouse staff worked aisle by aisle with handheld scanners and clipboards. Of 340 SKUs, 127 had discrepancies. Most were small — off by two or three units. But one stopped Zara cold." },
    { character: "narrator" as const, text: "The AP-7200 — their best-selling air purifier — showed 340 units in the system. The physical count found 287. Fifty-three units missing. Recounted twice. The gap was real." },
    { character: "kwame" as const,    text: "That's not a picking error. That's been building for months. The system's been telling Darren he had stock he didn't have. Every reorder decision, every sales promise — all based on a number that was wrong." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("audit")} />
      )}

      {phase === "audit" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280] mb-3">Review the audit results. Flag any SKUs where the discrepancy is large enough to require immediate investigation (≥5 units variance).</p>
          <AuditReconciler
            onComplete={(flagged) => {
              updateGs({ auditFlagged: flagged });
              unlockGlossary(2); // Stockout
              showToast("📖 Unlocked: Stockout", "success");
              setPhase("quiz");
            }}
          />
        </motion.div>
      )}

      {phase === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <MicroQuiz
            question={quiz.question}
            options={quiz.options}
            correctValue={quiz.correctValue}
            explanation={quiz.explanation}
            onDone={(correct) => {
              if (correct) updateGs({ quizScore: gs.quizScore + 1 });
              setPhase("done");
              advance(3);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 3: The Stockout ─────────────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "sim" | "done">(
    gs.stockoutUnderstood ? "done" : "dialogue"
  );

  const lines = [
    { character: "narrator" as const, text: "At 2:15 PM, while Zara was still tabulating the audit, the customer service team escalated three online orders for the AP-7200 that the system had accepted but the warehouse couldn't fulfil. The ERP had shown 340 units when the orders were placed. The shelf was empty. The system didn't know it yet." },
    { character: "zara" as const,     text: "I'm processing the cancellations myself. I want to feel the full weight of what a stockout actually costs." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("sim")} />
      )}

      {phase === "sim" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <StockoutSimulator
            onComplete={() => {
              updateGs({ stockoutUnderstood: true });
              unlockGlossary(3); // Overstock (unlocking for next scene preview)
              showToast("📖 Unlocked: Overstock", "success");
              setPhase("done");
              advance(4);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-800">Stockout documented. Total cost: incalculable.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 4: The Overstock ────────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "calc" | "done">(
    gs.carryingCostCalculated ? "done" : "dialogue"
  );

  const lines = [
    { character: "narrator" as const, text: "The stockout was bad. What Zara found on the other side of the warehouse was expensive in a different way. Aisle 14 through 17. Water heaters. Model WH-5100. Zara's audit count: 1,247 units. Monthly demand: 38 units." },
    { character: "zara" as const,     text: "1,200 units at 38 per month. That's 32 months of supply. Two and a half years of inventory, sitting on shelves, in a category where new models come out annually." },
    { character: "margaret" as const, text: "One hundred and fifty-six thousand dollars in water heaters we can't sell quickly. Do you know what carrying cost is on $156,000 of slow-moving stock?" },
    { character: "zara" as const,     text: "I calculated it before walking in. Twenty-five percent carrying cost: $39,000 annually. That doesn't account for obsolescence risk. If the WH-5200 launches in six months, these become even harder to move." },
    { character: "margaret" as const, text: "So we're paying $39,000 a year to store $156,000 of inventory that's actively losing value. How did we get here?" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("calc")} />
      )}

      {phase === "calc" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CarryingCostCalculator
            onComplete={(rate) => {
              updateGs({ carryingCostCalculated: true });
              unlockGlossary(4); // Carrying Cost
              showToast("📖 Unlocked: Carrying Cost", "success");
              setPhase("done");
              advance(5);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFDF5] p-4">
          <p className="text-sm font-bold text-[#92400E]">Overstock cost quantified. Time to fix the upstream system.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 5: The Reorder Formula ─────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "rop" | "bullwhip" | "quiz" | "done">(
    gs.ropBuilt ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[1];

  const lines = [
    { character: "isabelle" as const, text: "The AP-7200 is our highest-revenue SKU. Average daily demand: 3.8 units — I round to 4 for planning. Supplier lead time: 45 days, consistent across the last eight deliveries." },
    { character: "zara" as const,     text: "So if we know the demand and the lead time, why did we stock out?" },
    { character: "isabelle" as const, text: "Because there was no reorder point set in the system. Darren reordered manually, based on feel. Once he placed an order when we were at 88 units — three weeks of supply against a 45-day lead time. That order arrived with four days of stock remaining." },
    { character: "isabelle" as const, text: "The reorder point formula is straightforward. Daily demand times lead time, plus safety stock. For the AP-7200: 4 units/day × 45 days = 180 units consumed during replenishment. Add 30 units of safety stock — one week of coverage against variability. Reorder point: 210 units." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("rop")} />
      )}

      {phase === "rop" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280] mb-3">Build the reorder point formula for the AP-7200. Enter the correct values for each component.</p>
          <ROPBuilder
            onComplete={() => {
              updateGs({ ropBuilt: true });
              unlockGlossary(5); // ROP
              unlockGlossary(6); // Safety Stock
              unlockGlossary(7); // Lead Time
              showToast("📖 Unlocked: ROP, Safety Stock & Lead Time", "success");
              setPhase("bullwhip");
            }}
          />
        </motion.div>
      )}

      {phase === "bullwhip" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-[#F5F3FF] bg-[#FAF8FF] p-4 mb-3">
            <p className="text-xs font-bold text-purple-800 mb-1">Isabelle shows you something else — 18 months of order data.</p>
            <p className="text-xs text-[#6B7280]">Customer demand for the AP-7200 was stable — 80 to 110 units per month. Darren&apos;s purchase orders ranged from 50 to 420. The swings bore almost no relationship to the demand they were supposed to serve. This is the Bullwhip Effect.</p>
          </div>
          <BullwhipAnalyzer
            onComplete={(answers) => {
              updateGs({ bullwhipAnswers: answers });
              unlockGlossary(9); // Bullwhip
              showToast("📖 Unlocked: Bullwhip Effect", "success");
              setPhase("quiz");
            }}
          />
        </motion.div>
      )}

      {phase === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <MicroQuiz
            question={quiz.question}
            options={quiz.options}
            correctValue={quiz.correctValue}
            explanation={quiz.explanation}
            onDone={(correct) => {
              if (correct) updateGs({ quizScore: gs.quizScore + 1 });
              setPhase("done");
              advance(6);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-bold text-green-800">Reorder formula set. Bullwhip identified.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 6: ABC Analysis ─────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "abc" | "quiz" | "done">(
    Object.keys(gs.abcAnswers).length > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[2];

  const lines = [
    { character: "isabelle" as const, text: "We have 340 SKUs. We don't have the capacity to manage all of them with the same level of attention. We need to categorise them." },
    { character: "isabelle" as const, text: "ABC analysis. Pareto-based. Rank every SKU by annual revenue, then divide into three tiers. A items: top 20% of SKUs that generate 80% of revenue. B items: next 30%, contributing 15%. C items: the remaining 50%, contributing 5%." },
    { character: "zara" as const,     text: "68 A items. That's where my energy goes first. If I can get accurate counts, proper reorder points, and rational order quantities on those 68 SKUs, I'm managing 80% of the company's revenue risk." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("abc")} />
      )}

      {phase === "abc" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280] mb-3">Classify these 10 SKUs using ABC analysis. Use the annual revenue figures to determine the correct category for each.</p>
          <ABCClassifier
            onComplete={(answers) => {
              updateGs({ abcAnswers: answers });
              unlockGlossary(8); // ABC Analysis
              showToast("📖 Unlocked: ABC Analysis", "success");
              setPhase("quiz");
            }}
          />
        </motion.div>
      )}

      {phase === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <MicroQuiz
            question={quiz.question}
            options={quiz.options}
            correctValue={quiz.correctValue}
            explanation={quiz.explanation}
            onDone={(correct) => {
              if (correct) updateGs({ quizScore: gs.quizScore + 1 });
              setPhase("done");
              advance(7);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
          <p className="text-sm font-bold text-[#065F46]">Portfolio classified. A items prioritised. Time to execute.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 7: Recovery Plan ────────────────────────────────────────────────────

function Scene7({ gs, advance, updateGs, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "dashboard" | "done">(
    gs.dashboardReviewed ? "done" : "dialogue"
  );

  const lines = [
    { character: "narrator" as const, text: "Three months after her first day, Zara walked into the same conference room with a single printed page. She called it the Inventory Health Dashboard." },
    { character: "margaret" as const, text: "Inventory turn has improved from 4.2 to 5.1 in one quarter. That's material. Keep going." },
    { character: "kwame" as const,    text: "All A items counted and reconciled. Two discrepancies — both flagged, both investigated within the hour. First time in years the floor and the screen are saying the same thing." },
    { character: "margaret" as const, text: "The thing that actually changed was the culture. Kwame's team is counting every week. Isabelle's demand data is being used instead of filed. Patrick is asking questions instead of demanding stock builds. That's harder than any formula — and it's what makes the formula work." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("dashboard")} />
      )}

      {phase === "dashboard" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280] mb-3">Toggle between the before and after states to see what three months of disciplined inventory management achieved.</p>
          <InventoryDashboard
            onComplete={() => {
              updateGs({ dashboardReviewed: true });
              showToast("Module complete! Calculating your score...", "success");
              setPhase("done");
              advance(8);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
          <p className="text-sm font-bold text-[#065F46]">Inventory health restored. The warehouse knows what it holds.</p>
        </div>
      )}
    </div>
  );
}

// ─── Root page ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "inventory-management-progress";

export default function InventoryManagementPage() {
  const [step, setStep] = useState(1);
  const [gs, setGs] = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [showScorecard, setShowScorecard] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);
  const prevGlossaryRef = useRef(INITIAL_GLOSSARY.map(() => false));

  // Persist
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { step: s, gs: g, glossary: gl } = JSON.parse(saved);
        if (s) setStep(s);
        if (g) setGs(g);
        if (gl) setGlossary(gl);
        if (s >= 8) setShowScorecard(true);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, gs, glossary }));
    } catch { /* ignore */ }
  }, [step, gs, glossary]);

  // Auto-open glossary when new terms unlock
  const prevRef = useRef(glossary.map((t) => t.unlocked));
  useEffect(() => {
    const newUnlock = glossary.some((t, i) => t.unlocked && !prevRef.current[i]);
    prevRef.current = glossary.map((t) => t.unlocked);
    if (newUnlock) {
      const t = setTimeout(() => setGlossaryOpen(false), 0);
      return () => clearTimeout(t);
    }
  }, [glossary]);

  const showToast = useCallback((msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const unlockGlossary = useCallback((idx: number) => {
    setGlossary((prev) => prev.map((t, i) => i === idx ? { ...t, unlocked: true } : t));
  }, []);

  const updateGs = useCallback((patch: Partial<GameState>) => {
    setGs((prev) => ({ ...prev, ...patch }));
  }, []);

  const advance = useCallback((nextStep: number) => {
    if (nextStep >= 8) {
      setShowScorecard(true);
      setStep(8);
    } else {
      setStep(nextStep);
    }
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1);
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setShowScorecard(false);
    prevRef.current = INITIAL_GLOSSARY.map(() => false);
  }, []);

  const sceneProps: SceneProps = { gs, advance, updateGs, unlockGlossary, showToast };

  const SCENE_MAP: Record<number, () => React.ReactNode> = {
    1: () => <Scene1 {...sceneProps} />,
    2: () => <Scene2 {...sceneProps} />,
    3: () => <Scene3 {...sceneProps} />,
    4: () => <Scene4 {...sceneProps} />,
    5: () => <Scene5 {...sceneProps} />,
    6: () => <Scene6 {...sceneProps} />,
    7: () => <Scene7 {...sceneProps} />,
  };

  const unlockedCount = glossary.filter((t) => t.unlocked).length;

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col" style={{ fontFamily: "var(--font-dm-sans),sans-serif" }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.msg} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Glossary Drawer */}
      <GlossaryDrawer terms={glossary} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#E8E4DD] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <a href="/learn" className="text-[10px] text-[#9CA3AF] hover:text-[#10B981] transition-colors">← All Modules</a>
                <span className="text-[#E8E4DD]">/</span>
                <span className="text-[10px] text-[#9CA3AF]">Module 7</span>
              </div>
              <h1 className="text-base font-black text-[#1A1A1A] leading-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Counting What Counts
              </h1>
              <p className="text-[10px] text-[#9CA3AF]">Inventory Management & Control</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => setGlossaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E4DD] bg-white hover:border-[#10B981] transition-colors cursor-pointer text-xs font-semibold text-[#6B7280]"
            >
              <BookOpen size={13} className="text-[#10B981]" />
              <span>Glossary</span>
              {unlockedCount > 0 && (
                <span className="bg-[#D1FAE5] text-[#065F46] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unlockedCount}
                </span>
              )}
            </button>
          </div>

          {/* Journey Map */}
          {!showScorecard && (
            <JourneyMap currentStep={Math.min(step, 7)} />
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {showScorecard ? (
            <motion.div key="scorecard" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
              <DynamicScorecard gameState={gs} onRestart={restart} />
            </motion.div>
          ) : (
            <motion.div key={step} variants={sceneVariants} initial="initial" animate="animate" exit="exit">
              <SceneWrapper step={step}>
                {SCENE_MAP[step]?.()}
              </SceneWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DD] bg-white py-4 px-4 text-center">
        <p className="text-[10px] text-[#9CA3AF]">
          Operations Decoded · Module 7 · Inventory Management & Control
        </p>
      </footer>
    </div>
  );
}
