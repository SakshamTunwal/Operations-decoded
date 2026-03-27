"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Info, BookOpen } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, INITIAL_STATE, QUIZ_DATA } from "./constants";
import type { GameState, GlossaryTerm } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, sceneVariants } from "./scene-wrapper";
import {
  SalesOrderBuilder,
  ATPChecker,
  AcknowledgementDrafter,
  QualityDecisionCard,
  InvoiceBuilder,
  ARAgingTracker,
  CreditAdjustment,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── SceneProps ────────────────────────────────────────────────────────────────

interface SceneProps {
  gs: GameState;
  advance: (nextStep: number) => void;
  updateGs: (partial: Partial<GameState>) => void;
  unlockGlossary: (idx: number) => void;
  showToast: (msg: string, type?: "success" | "info") => void;
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "info"; onClose: () => void }) {
  const bg = {
    success: "bg-[#ECFDF5] border-green-200 text-green-800",
    info:    "bg-[#FCE7F3] border-[#BE185D]/30 text-[#9D174D]",
  }[type];
  const barColor = {
    success: "bg-green-400",
    info:    "bg-[#BE185D]",
  }[type];

  return (
    <motion.div
      initial={{ x: "calc(100% + 2rem)", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "calc(100% + 2rem)", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`fixed top-6 right-4 z-[60] max-w-sm rounded-xl border shadow-xl overflow-hidden flex flex-col ${bg}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="mt-0.5 flex-shrink-0">
          {type === "success" ? <CheckCircle2 size={15} /> : <Info size={15} />}
        </span>
        <p className="text-xs leading-relaxed flex-1">{msg}</p>
        <button suppressHydrationWarning onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0 cursor-pointer">
          <X size={13} />
        </button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 2.5, ease: "linear" }}
        onAnimationComplete={onClose}
        className={`h-0.5 origin-left ${barColor}`}
      />
    </motion.div>
  );
}

// ─── GlossaryDrawer ────────────────────────────────────────────────────────────

function GlossaryDrawer({ terms, open, onClose }: { terms: GlossaryTerm[]; open: boolean; onClose: () => void }) {
  const unlockedTerms = terms.filter((t) => t.unlocked);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#BE185D]" />
                <h3 className="font-bold text-[#1A1A1A] text-sm">Glossary</h3>
                <span className="text-[10px] bg-[#FCE7F3] text-[#BE185D] px-2 py-0.5 rounded-full font-semibold">
                  {unlockedTerms.length}/{terms.length}
                </span>
              </div>
              <button suppressHydrationWarning onClick={onClose} className="text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {terms.map((term, i) => (
                <div key={i} className={`rounded-xl p-3 border transition-all ${
                  term.unlocked ? "border-[#BE185D]/30 bg-[#FCE7F3]" : "border-[#E8E4DD] bg-[#FAFAF9] opacity-50"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {term.unlocked
                      ? <CheckCircle2 size={11} className="text-[#BE185D]" />
                      : <span className="w-2.5 h-2.5 rounded-full border border-[#E8E4DD] inline-block" />
                    }
                    <p className="text-xs font-bold text-[#1A1A1A]">{term.term}</p>
                  </div>
                  {term.unlocked && <p className="text-[11px] text-[#4B5563] leading-relaxed">{term.definition}</p>}
                  {!term.unlocked && <p className="text-[10px] text-[#9CA3AF]">Complete this stage to unlock</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Scene 1: The PO Arrives ───────────────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "build" | "done">(
    gs.salesOrderBuilt ? "done" : "dialogue"
  );

  const lines = [
    { character: "carlos" as const, text: "Welcome to the big leagues, Nina. Fifty thousand custom branded boxes for Meridian Commerce. A hundred and seventy-five grand. Three batches over six weeks. Brendan Holt is the buyer — great guy, very reasonable, just don't be late." },
    { character: "nina" as const, text: "Is there anything I should know about this order that isn't in the paperwork?" },
    { character: "narrator" as const, text: "On the buy side, you controlled the timeline because you were the one spending money. On the sell side, you manufacture, you ship, you invoice — and then you wait. That was the Order-to-Cash cycle." },
    { character: "nina" as const, text: "PO number MER-2024-1183. Fifty thousand units. $175,000. Net-30 terms. Time to convert this into a sales order." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Sales Order SO-7841 created.</p>
        <p className="text-xs text-green-700 mt-1">50,000 units · $175,000 · Net-30 · Meridian Commerce.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("build")} />
      )}

      {phase === "build" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <SalesOrderBuilder
            onDone={() => {
              updateGs({ salesOrderBuilt: true });
              unlockGlossary(0); // O2C
              unlockGlossary(1); // Sales Order
              showToast("📄 Sales Order SO-7841 created", "success");
              setPhase("done");
              advance(2);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 2: ATP Check ────────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "atp" | "quiz" | "done">(
    gs.atpScore > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[0];

  const lines = [
    { character: "nina" as const, text: "Sam, I need an ATP check on fifty thousand units. E-flute, four-colour print, three batches over six weeks." },
    { character: "sam" as const, text: "Let me pull up the production board. I'll go through each batch." },
    { character: "narrator" as const, text: "Available to Promise — the check that separates order confirmation from order fiction." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">ATP check complete — {gs.atpScore}/3 batches classified correctly.</p>
        <p className="text-xs text-green-700 mt-1">Batch 1: Confirm · Batch 2: Conditional · Batch 3: At-Risk.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("atp")} />
      )}

      {phase === "atp" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ATPChecker
            onDone={(score) => {
              updateGs({ atpScore: score });
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
              unlockGlossary(2); // ATP
              showToast("📊 ATP check complete — Sam's report filed.", "success");
              setPhase("done");
              advance(3);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 3: Order Confirmed ──────────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "acknowledge" | "done">(
    gs.acknowledgementCorrect || gs.atpScore > 0 && gs.acknowledgementCorrect !== undefined && gs.acknowledgementCorrect === false && gs.qualityDecision !== "" ? "done" : "dialogue"
  );

  // More robust: only treat as done if we've actually passed this scene
  const [localDone, setLocalDone] = useState(false);

  const lines = [
    { character: "nina" as const, text: "Brendan, this is Nina Rao. I've reviewed the PO. Batches 1 and 2 we can confirm. Batch 3 — I want to be transparent about a scheduling constraint." },
    { character: "narrator" as const, text: "Brendan Holt, Meridian Commerce: 'I appreciate the honesty. Most suppliers just confirm everything and then call me two days before delivery with an excuse.'" },
    { character: "nina" as const, text: "How should I word the Batch 3 commitment in the order acknowledgement?" },
  ];

  if (localDone) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">
          {gs.acknowledgementCorrect ? "Acknowledgement signed by Brendan ✓" : "Order acknowledgement sent to Brendan."}
        </p>
        <p className="text-xs text-green-700 mt-1">
          Batch 3 wording confirmed. Order acknowledgement on file.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("acknowledge")} />
      )}

      {phase === "acknowledge" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AcknowledgementDrafter
            onDone={(correct) => {
              updateGs({ acknowledgementCorrect: correct });
              unlockGlossary(3); // Order Acknowledgement
              showToast(
                correct ? "✅ Acknowledgement signed by Brendan" : "📋 Acknowledgement sent",
                correct ? "success" : "info"
              );
              setLocalDone(true);
              advance(4);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 4: Dispatch & QC ────────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "quality" | "done">(
    gs.qualityDecision ? "done" : "dialogue"
  );

  const lines = [
    { character: "leo" as const, text: "Nina, I'm pulling two hundred units from Batch 1. Print registration is off — logo shifted four millimetres. We're ready to ship the other 16,800. What's the call?" },
    { character: "nina" as const, text: "What are our options?" },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Dispatch decision made.</p>
        <p className="text-xs text-green-700 mt-1">
          {gs.qualityDecision === "pull-and-notify"
            ? "16,800 units dispatched clean. Brendan notified of the 200-unit pull."
            : "Dispatch decision recorded."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("quality")} />
      )}

      {phase === "quality" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <QualityDecisionCard
            onDone={(choice) => {
              updateGs({ qualityDecision: choice });
              unlockGlossary(4); // Delivery Challan
              if (choice === "pull-and-notify") {
                showToast("✅ Brendan notified. 16,800 units dispatched clean.", "success");
              } else {
                showToast("📋 Dispatch decision recorded.", "info");
              }
              setPhase("done");
              advance(5);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 5: Invoicing ────────────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "invoice" | "quiz" | "done">(
    gs.invoiceScore > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[1];

  const lines = [
    { character: "grace" as const, text: "Batch 1 dispatched. Time to raise the invoice. Let me walk you through what every field on this invoice needs to reference — because a single missing link means Brendan's AP team can hold payment legitimately." },
    { character: "narrator" as const, text: "Invoice INV-2024-3317. The moment the sell side's effort converts to a financial claim." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Invoice INV-2024-3317 raised — {gs.invoiceScore}/5 fields correct.</p>
        <p className="text-xs text-green-700 mt-1">Sent to Brendan's AP team. Net-30 clock starts now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("invoice")} />
      )}

      {phase === "invoice" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <InvoiceBuilder
            onDone={(score) => {
              updateGs({ invoiceScore: score });
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
              unlockGlossary(5); // AR
              unlockGlossary(6); // AR Aging Report
              showToast("🧾 Invoice INV-2024-3317 sent to Meridian AP.", "success");
              setPhase("done");
              advance(6);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 6: AR Aging ─────────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "ar" | "quiz" | "done">(
    gs.arEscalationScore > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[2];

  const lines = [
    { character: "grace" as const, text: "Invoices 1 and 2 — paid on time. Invoice 3, $56,000 — due Thursday. Thursday came and went." },
    { character: "nina" as const, text: "How bad is it?" },
    { character: "grace" as const, text: "It's $56,000 that's now one day overdue. Our cost of capital on outstanding receivables is roughly 0.04% per day. Every day this doesn't clear costs us roughly $22 in interest — and I've already allocated this cash against a kraft liner purchase next week." },
    { character: "narrator" as const, text: "Accounts receivable was not abstract money on a ledger. It was cash the company had earned — cash that needed to flow back to fund the next production run." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">AR escalation handled — {gs.arEscalationScore}/4 steps correct.</p>
        <p className="text-xs text-green-700 mt-1">
          Payment received Day 22. $56,000 cleared. Working capital restored.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("ar")} />
      )}

      {phase === "ar" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ARAgingTracker
            onDone={(score) => {
              updateGs({ arEscalationScore: score });
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
              unlockGlossary(7); // Working Capital
              unlockGlossary(8); // Credit Terms
              showToast("⏰ Payment received Day 22. AR closed.", "success");
              setPhase("done");
              advance(7);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 7: The Debrief ──────────────────────────────────────────────────────

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "credit" | "done">(
    gs.creditTermsCorrect || gs.quizScore >= 0 && gs.arEscalationScore > 0 && gs.creditTermsCorrect !== undefined ? "dialogue" : "dialogue"
  );
  const [localDone, setLocalDone] = useState(false);

  const lines = [
    { character: "carlos" as const, text: "Brendan wants to double the volume for Q2. Hundred thousand units, same spec, twelve weeks. But... he pushed back on advance payment." },
    { character: "grace" as const, text: "Carlos, telling a client something can't happen again is a sales conversation. What I need is a mechanism that changes the incentive structure — not just the conversation." },
    { character: "carlos" as const, text: "I got him to agree to Net-20 on all invoices plus 50% advance on Batch 1." },
    { character: "nina" as const, text: "That's a good compromise. What payment terms should we apply to the next order?" },
  ];

  if (localDone) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Credit terms updated for Meridian Commerce.</p>
        <p className="text-xs text-green-700 mt-1">
          {gs.creditTermsCorrect
            ? "B+ · Net-20 · 50% advance on Batch 1. Working capital protected."
            : "Terms noted. Module complete."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("credit")} />
      )}

      {phase === "credit" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CreditAdjustment
            onDone={(correct) => {
              updateGs({ creditTermsCorrect: correct });
              unlockGlossary(9); // Cash-to-Delivery Gap
              showToast(
                correct ? "🏦 Credit terms updated — B+ · Net-20 · 50% advance" : "📋 Terms noted",
                correct ? "success" : "info"
              );
              setLocalDone(true);
              advance(8); // triggers scorecard
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Page (root orchestrator) ──────────────────────────────────────────────────

const LS_KEY = "order-to-cash-progress";

export default function OrderToCashPage() {
  const [step,     setStep]     = useState(1);
  const [gs,       setGs]       = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; type: "success" | "info" } | null>(null);
  const [showScorecard, setShowScorecard] = useState(false);
  const [mounted, setMounted]   = useState(false);

  // Hydration guard
  useEffect(() => { setMounted(true); }, []);

  // Restore progress
  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { step: s, gs: g, glossary: gl, showScorecard: sc } = JSON.parse(saved);
        if (s) setStep(s);
        if (g) setGs(g);
        if (gl) setGlossary(gl);
        if (sc) setShowScorecard(sc);
      }
    } catch {}
  }, [mounted]);

  // Save progress
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ step, gs, glossary, showScorecard }));
    } catch {}
  }, [step, gs, glossary, showScorecard, mounted]);

  const advance = useCallback((nextStep: number) => {
    if (nextStep >= 8) {
      setShowScorecard(true);
    } else {
      setStep(nextStep);
    }
  }, []);

  const updateGs = useCallback((partial: Partial<GameState>) => {
    setGs((prev) => ({ ...prev, ...partial }));
  }, []);

  const unlockGlossary = useCallback((idx: number) => {
    setGlossary((prev) => {
      const next = [...prev];
      if (next[idx]) next[idx] = { ...next[idx], unlocked: true };
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "info" = "success") => {
    setToast({ msg, type });
  }, []);

  const handleRestart = () => {
    setStep(1);
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setShowScorecard(false);
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  const unlockedCount = glossary.filter((t) => t.unlocked).length;

  const sceneProps: SceneProps = { gs, advance, updateGs, unlockGlossary, showToast };

  const currentStepConfig = STEPS.find((s) => s.num === step);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#BE185D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.msg}
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Glossary drawer */}
      <GlossaryDrawer
        terms={glossary}
        open={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E8E4DD]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#FCE7F3] text-[#BE185D] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                Module 6
              </span>
              <h1 className="text-sm font-bold text-[#1A1A1A] truncate">The Other Side of the Table</h1>
            </div>
            {!showScorecard && currentStepConfig && (
              <p className="text-[10px] text-[#9CA3AF] mt-0.5 hidden sm:block">
                Step {step} of {STEPS.length} — {currentStepConfig.label}
              </p>
            )}
          </div>

          <button
            suppressHydrationWarning
            onClick={() => setGlossaryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F0E8] border border-[#E8E4DD] text-xs font-semibold text-[#6B7280] hover:border-[#BE185D]/40 hover:text-[#BE185D] transition-colors cursor-pointer flex-shrink-0"
          >
            <BookOpen size={12} />
            <span className="hidden sm:inline">Glossary</span>
            {unlockedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#BE185D] text-white text-[9px] font-bold flex items-center justify-center">
                {unlockedCount}
              </span>
            )}
          </button>
        </div>

        {/* Journey Map */}
        {!showScorecard && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <JourneyMap currentStep={step} />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {showScorecard ? (
          <DynamicScorecard gs={gs} onRestart={handleRestart} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SceneWrapper step={step}>
                {step === 1 && <Scene1 {...sceneProps} />}
                {step === 2 && <Scene2 {...sceneProps} />}
                {step === 3 && <Scene3 {...sceneProps} />}
                {step === 4 && <Scene4 {...sceneProps} />}
                {step === 5 && <Scene5 {...sceneProps} />}
                {step === 6 && <Scene6 {...sceneProps} />}
                {step === 7 && <Scene7 {...sceneProps} />}
              </SceneWrapper>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DD] mt-12 py-4">
        <p className="text-center text-[10px] text-[#C4BDB5]">
          Operations Decoded · Module 6 · Order-to-Cash
        </p>
      </footer>
    </div>
  );
}
