"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, BookOpen, ArrowLeft } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY } from "./constants";
import type { GameState } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, LocationHeaderOverlay, sceneVariants } from "./scene-wrapper";
import {
  LearnMore,
  TransportModeMatcher,
  CostCalculator,
  ScorecardBuilder,
  PODRecoveryGame,
  EvidenceChainBuilder,
  FleetModeller,
  SLADashboard,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Shared props for every scene ─────────────────────────────────────────────

interface SceneProps {
  gs:             GameState;
  advance:        (n: number) => void;
  updateGs:       (p: Partial<GameState>) => void;
  unlockGlossary: (i: number) => void;
  showToast:      (msg: string, type?: "success" | "warning" | "error") => void;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  msg, type, onClose,
}: { msg: string; type: "success" | "warning" | "error"; onClose: () => void }) {
  const bg = {
    success: "bg-[#ECFDF5] border-green-200 text-green-800",
    warning: "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]",
    error:   "bg-red-50 border-red-200 text-red-800",
  }[type];
  const barColor = {
    success: "bg-green-400",
    warning: "bg-[#f59e0b]",
    error:   "bg-red-400",
  }[type];

  return (
    <motion.div
      initial={{ x: "calc(100% + 2rem)", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "calc(100% + 2rem)", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`fixed top-6 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm rounded-xl border shadow-xl overflow-hidden flex flex-col ${bg}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="mt-0.5 flex-shrink-0">
          {type === "success" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
        </span>
        <p className="text-xs leading-relaxed flex-1">{msg}</p>
        <button onClick={onClose} aria-label="Close" className="opacity-60 hover:opacity-100 flex-shrink-0 cursor-pointer">
          <X size={13} />
        </button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        onAnimationComplete={onClose}
        className={`h-0.5 origin-left ${barColor}`}
      />
    </motion.div>
  );
}

// ─── Glossary drawer ──────────────────────────────────────────────────────────

function GlossaryDrawer({
  terms, open, onClose,
}: { terms: typeof INITIAL_GLOSSARY; open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white border-l border-[#E8E4DD] shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-[#f59e0b]" />
                <p className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  Glossary
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full font-semibold">
                  {terms.filter((t) => t.unlocked).length}/{terms.length}
                </span>
                <button onClick={onClose} aria-label="Close" className="p-1 text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            </div>
            <motion.div
              className="flex-1 overflow-y-auto p-4 space-y-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {terms.map((g) => (
                <motion.div
                  key={g.term}
                  layout
                  variants={{
                    hidden: { opacity: 0, x: 18 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 340, damping: 28 } },
                  }}
                  className={`rounded-xl border overflow-hidden ${
                    g.unlocked ? "border-[#E8E4DD] bg-white" : "border-[#F0EDE8] bg-[#F5F0E8]"
                  }`}
                >
                  <div className="px-3 py-2.5 flex items-start gap-2">
                    <AlertTriangle size={11} className={`mt-0.5 flex-shrink-0 ${g.unlocked ? "text-[#f59e0b]" : "text-[#C4BDB5]"}`} />
                    <div>
                      <p className={`text-xs font-semibold leading-tight ${g.unlocked ? "text-[#1A1A1A]" : "text-[#C4BDB5]"}`}>
                        {g.term}
                      </p>
                      {g.unlocked && (
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-[10px] text-[#6B7280] mt-1.5 leading-relaxed"
                        >
                          {g.definition}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// QUIZ DATA
// ══════════════════════════════════════════════════════════════════════════════

const QUIZ_DATA = [
  {
    question: "Atlas Freight's base rate is $142/delivery. What is Maya's calculated TRUE cost per delivery?",
    options: [
      { label: "$142.00", value: "a" },
      { label: "$158.30", value: "b" },
      { label: "$177.80", value: "c" },
      { label: "$189.50", value: "d" },
    ],
    correctValue: "c",
    explanation: "The true cost is $177.80 — 25% above the invoiced rate. Hidden costs include fuel surcharges ($18), detention ($11), damage claims ($2.30), and admin overhead ($4.50). Richard had been using $142.",
  },
  {
    question: "Maya discovers $340,000 in uninvoiced deliveries. What is the root cause?",
    options: [
      { label: "Deliveries were never made", value: "a" },
      { label: "Paper PODs not scanned into the billing system", value: "b" },
      { label: "Customers refused to pay", value: "c" },
      { label: "Atlas Freight overcharged", value: "d" },
    ],
    correctValue: "b",
    explanation: "Completed deliveries with signed paper PODs were sitting in a depot filing cabinet — never scanned. No POD in the system = no invoice raised = $340K in earned revenue sitting dormant.",
  },
  {
    question: "At what monthly delivery volume does in-house fleet become cheaper than the 3PL arrangement?",
    options: [
      { label: "2,000 deliveries/month", value: "a" },
      { label: "2,800 deliveries/month", value: "b" },
      { label: "3,200 deliveries/month", value: "c" },
      { label: "4,000 deliveries/month", value: "d" },
    ],
    correctValue: "c",
    explanation: "Derek's crossover model shows in-house becomes cost-effective at approximately 3,200 deliveries/month. At the current 2,800, the 3PL is still cheaper — but a hybrid model brings the best of both.",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// SCENE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ─── Scene 1 — Delivery Landscape ────────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "learn" | "modes" | "done">("dialogue");

  const dialogueLines = [
    { character: "maya" as const, text: "Two complaints. First Monday. A cement delivery 90 minutes late — $1,400 idle crew. And 18 broken tiles to a retail store. Anita forwarded both with a note: 'fourth complaint this month.'" },
    { character: "maya" as const, text: "I have 87 days before Atlas Freight's contract comes up for renewal. The board wants a recommendation in 60 days. I need to understand what's actually happening before I recommend anything." },
    { character: "narrator" as const, text: "Maya pulls six months of delivery records. 2,800 deliveries per month. Three distinct modes. Time to map the picture." },
  ];

  return (
    <SceneWrapper step={1}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("learn")} />
      )}

      {phase === "learn" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Volume summary */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5">
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider mb-3">6-Month Delivery Analysis — 2,800 per month</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: "FTL", pct: "40%", desc: "Cement to construction sites", color: "bg-blue-50 border-blue-200", textColor: "text-blue-800", icon: "🚚" },
                  { mode: "LTL", pct: "52%", desc: "Tiles & sanitary ware, multi-stop", color: "bg-[#FEF3C7] border-[#f59e0b]/40", textColor: "text-[#92400E]", icon: "📦" },
                  { mode: "Express", pct: "8%", desc: "Urgent single items — up 30%", color: "bg-green-50 border-green-200", textColor: "text-green-800", icon: "✈️" },
                ].map((m) => (
                  <div key={m.mode} className={`border rounded-xl p-3 text-center ${m.color}`}>
                    <span className="text-xl">{m.icon}</span>
                    <p className={`text-lg font-black mt-1 ${m.textColor}`} style={{ fontFamily: "var(--font-syne),sans-serif" }}>{m.pct}</p>
                    <p className={`text-[9px] font-bold ${m.textColor}`}>{m.mode}</p>
                    <p className="text-[8px] text-[#6B7280] mt-1 leading-tight">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <LearnMore title="Why does transport mode selection matter?">
            Transport mode isn&apos;t a choice made once — it&apos;s embedded in every order. Using the wrong mode for any shipment is either ruinously expensive or physically impossible. Getting mode selection right is the foundation. Everything else — costing, routing, carrier performance — builds on top of it.
          </LearnMore>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("modes")}
            className="self-start px-5 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Assign Transport Modes →
          </motion.button>
        </motion.div>
      )}

      {phase === "modes" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#1A1A1A]">Transport Mode Challenge</p>
          </div>
          <TransportModeMatcher
            onComplete={(correct) => {
              updateGs({ transportModesDone: correct });
              unlockGlossary(0);
              unlockGlossary(1);
              showToast(`${correct}/5 modes correctly assigned. FTL and LTL unlocked in glossary.`, "success");
              setPhase("done");
              setTimeout(() => advance(2), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 2 — True Cost Discovery ───────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "calc" | "done">("dialogue");

  const dialogueLines = [
    { character: "richard" as const, text: "Simple brief, Maya. Tell me what we're paying per delivery and whether it's reasonable." },
    { character: "maya" as const, text: "I need two weeks to answer that, Richard. The invoice just says 'freight' with a single total. No breakdown by route, mode, or service level." },
    { character: "maya" as const, text: "I've requested a full six-month breakdown from Jerome. It arrived as a spreadsheet. Let me show you what we're actually paying." },
  ];

  return (
    <SceneWrapper step={2}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("calc")} />
      )}

      {phase === "calc" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <CostCalculator
            onComplete={() => {
              updateGs({ costModelBuilt: true, trueHiddenCostRevealed: true });
              unlockGlossary(2);
              showToast("Cost model complete. Detention charges unlocked in glossary.", "success");
              setPhase("done");
              setTimeout(() => advance(3), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 3 — Carrier Scorecard ─────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "build" | "done">("dialogue");

  const dialogueLines = [
    { character: "maya" as const, text: "I've built a carrier performance scorecard using six months of Atlas data. Four metrics. That's all you need to tell if a carrier is working." },
    { character: "anita" as const, text: "On-time at 81%? One in five deliveries late? That's why I have a wall of complaints. Gloria's tiles aren't an anomaly — they're a pattern." },
    { character: "maya" as const, text: "A carrier relationship without performance metrics is just a relationship. It has no accountability, no improvement trajectory, no mechanism to distinguish a bad quarter from a structural problem." },
  ];

  return (
    <SceneWrapper step={3}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("build")} />
      )}

      {phase === "build" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <ScorecardBuilder
            onComplete={() => {
              updateGs({ scorecardBuilt: true });
              unlockGlossary(4);
              showToast("Carrier scorecard complete. Performance SLA unlocked in glossary.", "success");
              setPhase("done");
              setTimeout(() => advance(4), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 4 — POD Crisis ─────────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "recover" | "done">("dialogue");

  const dialogueLines = [
    { character: "maya" as const, text: "POD completion rate: 76%. One in four deliveries — no signed proof of delivery in our system. I flagged it as a process issue. Then I sat with accounts receivable." },
    { character: "maya" as const, text: "The invoicing process requires a confirmed POD before an invoice can be raised. No POD, no invoice. Jerome's drivers are collecting paper slips and returning them in weekly batches. Many never get scanned at all." },
    { character: "narrator" as const, text: "Maya pulls the uninvoiced delivery report. The number is $340,000. Three hundred and forty thousand dollars of completed, delivered, signed-for goods — sitting uninvoiced because a piece of paper isn't in the right system." },
  ];

  return (
    <SceneWrapper step={4}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("recover")} />
      )}

      {phase === "recover" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <PODRecoveryGame
            onComplete={(recovered) => {
              updateGs({ podRecovered: recovered, podBacklogCleared: true });
              unlockGlossary(3);
              showToast(`${recovered} PODs actioned. Proof of Delivery unlocked in glossary.`, "success");
              setPhase("done");
              setTimeout(() => advance(5), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 5 — Freight Claims ─────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "evidence" | "done">("dialogue");

  const dialogueLines = [
    { character: "maya" as const, text: "Anita forwarded Gloria's formal damage complaint. 18 decorative wall tiles, valued at $890, arrived broken. Gloria wants a credit and an explanation." },
    { character: "maya" as const, text: "I know exactly where the damage happened — I was there on the ride-along. The raised kerb. Kenji's hand truck. A twelve-minute parking window. But knowing it happened isn't enough." },
    { character: "maya" as const, text: "Freight claims require evidence discipline. Timestamped photographs, signed delivery receipts, documented condition at each handoff point. Without the evidence chain, this becomes a he-said-she-said dispute with no resolution." },
  ];

  return (
    <SceneWrapper step={5}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("evidence")} />
      )}

      {phase === "evidence" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <EvidenceChainBuilder
            onComplete={() => {
              updateGs({ claimApproved: true, evidenceChainComplete: true });
              unlockGlossary(5);
              showToast("Claim approved — $890 credited to Gloria's account. Route Optimisation unlocked.", "success");
              setPhase("done");
              setTimeout(() => advance(6), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 6 — 3PL vs In-House ────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "model" | "done">("dialogue");

  const dialogueLines = [
    { character: "derek" as const, text: "Eighteen years in fleet logistics. I'll model in-house honestly, including its disadvantages. My reputation depends on good advice, not selling a particular outcome." },
    { character: "derek" as const, text: "At 2,800 deliveries per month you're below the crossover point. In-house doesn't save money at this volume — yet. But cost isn't the only variable." },
    { character: "maya" as const, text: "The right answer isn't 3PL or in-house. It's both. And I'll show the board exactly why." },
  ];

  return (
    <SceneWrapper step={6}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("model")} />
      )}

      {phase === "model" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <FleetModeller
            onComplete={(choice) => {
              updateGs({ hybridModelChosen: choice === "hybrid" });
              unlockGlossary(6);
              showToast(
                choice === "hybrid"
                  ? "Hybrid model — structurally correct. 3PL term unlocked in glossary."
                  : "Recommendation made. Proceeding to contract negotiation.",
                choice === "hybrid" ? "success" : "warning"
              );
              setPhase("done");
              setTimeout(() => advance(7), 700);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 7 — SLA & Dashboard ────────────────────────────────────────────────

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "sla" | "scorecard">("dialogue");

  const dialogueLines = [
    { character: "jerome" as const, text: "This is the first time in three years your company has told me what good looks like. I can't hit a target I've never been given." },
    { character: "maya" as const, text: "Two-year contract on LTL and overflow routes. Seven percent rate reduction. SLA targets are contractual, with service credits for sustained non-compliance." },
    { character: "narrator" as const, text: "Ninety days after Maya's first Monday, the transformation is not complete — logistics transformations are never complete in ninety days. But the trajectory is unmistakable." },
  ];

  return (
    <SceneWrapper step={7}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("sla")} />
      )}

      {phase === "sla" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <SLADashboard
            onComplete={() => {
              updateGs({ slaTargetsSet: true, contractNegotiated: true, scorecardViewed: true });
              unlockGlossary(7);
              showToast("Contract signed. Last Mile unlocked in glossary.", "success");
              setPhase("scorecard");
            }}
          />
        </motion.div>
      )}

      {phase === "scorecard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <DynamicScorecard
            gameState={gs}
            onRestart={() => {
              // handled by parent
              window.location.reload();
            }}
            onGlossary={() => {
              // handled by parent — just show a toast pointing to glossary
              showToast("Open the Glossary button in the header to review all terms.", "warning");
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

const SCENE_MAP: Record<number, React.ComponentType<SceneProps>> = {
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: Scene6,
  7: Scene7,
};

const INITIAL_STATE: GameState = {
  transportModesDone: 0,
  costModelBuilt: false,
  trueHiddenCostRevealed: false,
  scorecardBuilt: false,
  podRecovered: 0,
  podBacklogCleared: false,
  claimApproved: false,
  evidenceChainComplete: false,
  hybridModelChosen: false,
  inHouseRoutesSelected: 8,
  slaTargetsSet: false,
  contractNegotiated: false,
  quizScore: 0,
  scorecardViewed: false,
};

const LS_KEY = "lm-progress";

// Quiz fires at these step transitions
const QUIZ_AFTER_STEP: Record<number, number> = { 2: 0, 4: 1, 6: 2 };

export default function LastMilePage() {
  const [step, setStep]           = useState(1);
  const [gs, setGs]               = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary]   = useState(INITIAL_GLOSSARY);
  const [showLoc, setShowLoc]     = useState(false);
  const [pendingStep, setPending] = useState<number | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);
  const [quizStep, setQuizStep]   = useState<number | null>(null);
  const [contractDays, setContractDays] = useState<number | null>(87);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { step: s, gs: g, glossary: gl } = JSON.parse(saved);
        if (s) setStep(s);
        if (g) setGs({ ...INITIAL_STATE, ...g });
        if (gl) setGlossary(gl);
      }
    } catch { /* ignore */ }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ step, gs, glossary }));
    } catch { /* ignore */ }
  }, [step, gs, glossary]);

  // Update contract days counter based on step
  useEffect(() => {
    const days: Record<number, number | null> = {
      1: 87, 2: 73, 3: 59, 4: 45, 5: 38, 6: 25, 7: null,
    };
    setContractDays(days[step] ?? null);
  }, [step]);

  const showToast = useCallback((msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const unlockGlossary = useCallback((i: number) => {
    setGlossary((prev) => prev.map((g, idx) => idx === i ? { ...g, unlocked: true } : g));
  }, []);

  const updateGs = useCallback((patch: Partial<GameState>) => {
    setGs((prev) => ({ ...prev, ...patch }));
  }, []);

  const advance = useCallback((nextStep: number) => {
    const quizIdx = QUIZ_AFTER_STEP[step];
    if (quizIdx !== undefined) {
      setQuizStep(quizIdx);
      setPending(nextStep);
    } else {
      setPending(nextStep);
      setShowLoc(true);
    }
  }, [step]);

  const handleQuizDone = (correct: boolean) => {
    if (correct) updateGs({ quizScore: gs.quizScore + 1 });
    setQuizStep(null);
    setShowLoc(true);
  };

  const handleLocDone = () => {
    setShowLoc(false);
    if (pendingStep !== null) {
      setStep(pendingStep);
      setPending(null);
    }
  };

  const SceneComponent = SCENE_MAP[step];
  const stepConfig = STEPS.find((s) => s.num === step);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Top row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <a
                href="/learn"
                className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors flex-shrink-0 text-xs font-semibold"
              >
                <ArrowLeft size={13} />
                <span className="hidden sm:inline">All Modules</span>
              </a>
              <div className="w-px h-4 bg-white/10 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-[#f59e0b] uppercase tracking-widest">Module 10</p>
                <p className="text-sm font-bold text-white leading-tight truncate" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  The Last Mile
                </p>
              </div>
            </div>
            <button
              onClick={() => setGlossaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/20 transition-colors text-xs font-semibold flex-shrink-0 cursor-pointer"
            >
              <BookOpen size={12} />
              <span className="hidden sm:inline">Glossary</span>
              <span className="w-4 h-4 rounded-full bg-[#f59e0b] text-black text-[8px] font-black flex items-center justify-center">
                {glossary.filter((g) => g.unlocked).length}
              </span>
            </button>
          </div>

          {/* Journey map */}
          <JourneyMap currentStep={step} contractDays={contractDays} />
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 md:py-10">
        {/* Step context bar */}
        {stepConfig && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5"
          >
            <span className="text-lg">{stepConfig.icon}</span>
            <div>
              <p className="text-[9px] font-bold text-[#f59e0b] uppercase tracking-widest">{stepConfig.time} · {stepConfig.location}</p>
              <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                {stepConfig.label}
              </p>
            </div>
          </motion.div>
        )}

        {/* Scene */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {SceneComponent && (
              <SceneComponent
                gs={gs}
                advance={advance}
                updateGs={updateGs}
                unlockGlossary={unlockGlossary}
                showToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Location overlay ── */}
      {pendingStep !== null && STEPS[pendingStep - 1] && (
        <LocationHeaderOverlay
          location={STEPS[pendingStep - 1].location}
          time={STEPS[pendingStep - 1].time}
          visible={showLoc}
          onDone={handleLocDone}
        />
      )}

      {/* ── Quiz overlay ── */}
      <AnimatePresence>
        {quizStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <MicroQuiz
                {...QUIZ_DATA[quizStep]}
                onDone={handleQuizDone}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Glossary ── */}
      <GlossaryDrawer
        terms={glossary}
        open={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />
    </div>
  );
}
