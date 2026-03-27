"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info, BookOpen } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, INITIAL_STATE, QUIZ_DATA } from "./constants";
import type { GameState, GlossaryTerm } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, sceneVariants } from "./scene-wrapper";
import {
  ProcurementChoiceCard,
  EmergencyClassifier,
  JustificationBuilder,
  ReceiptVerifier,
  AuditDocumentAssembler,
  FrameworkBuilder,
  CautionaryTale,
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
    info:    "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]",
  }[type];
  const barColor = {
    success: "bg-green-400",
    info:    "bg-[#f59e0b]",
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
                <BookOpen size={16} className="text-[#D97706]" />
                <h3 className="font-bold text-[#1A1A1A] text-sm">Glossary</h3>
                <span className="text-[10px] bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full font-semibold">
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
                  term.unlocked ? "border-[#f59e0b]/40 bg-[#FEF3C7]" : "border-[#E8E4DD] bg-[#FAFAF9] opacity-50"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {term.unlocked
                      ? <CheckCircle2 size={11} className="text-[#D97706]" />
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

// ─── Scene 1: The Call ─────────────────────────────────────────────────────────

function Scene1({ gs, advance, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "done">("dialogue");

  const lines = [
    { character: "narrator" as const, text: "The Hartmann line was the main packaging conveyor. Without it, nothing shipped. It was 4:32 PM on a Friday." },
    { character: "helen"    as const, text: "Ryan, the Hartmann line is down. The hydraulic seal assembly failed — part HDS-4420-R. We need it here by Saturday morning or the Bradfield dispatch is gone." },
    { character: "ryan"     as const, text: "How long to fix once we have the part?" },
    { character: "helen"    as const, text: "Four hours. FastParts on Industrial Boulevard has two units in stock. $4,200. I'm going to drive over there, put it on my personal card, and expense it Monday." },
    { character: "ryan"     as const, text: "Helen, don't do that." },
    { character: "helen"    as const, text: "Why not? It's the fastest way. The Bradfield order is $600,000." },
    { character: "ryan"     as const, text: "I know. That's exactly why we need to do this properly. Give me ten minutes." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence
          lines={lines}
          onComplete={() => {
            unlockGlossary(0); // Emergency PO
            unlockGlossary(1); // Maverick Spending
            showToast("📖 Unlocked: Emergency PO & Maverick Spending", "success");
            setPhase("done");
            advance(2);
          }}
        />
      )}
    </div>
  );
}

// ─── Scene 2: The Decision ─────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "choice" | "done">(
    gs.procurementDecision ? "done" : "dialogue"
  );

  const lines = [
    { character: "ryan"     as const, text: "If you buy that part on a personal card, there's no PO, no tax invoice in the company's name, no audit trail. Finance processes it as a reimbursement — bypassing every control we have." },
    { character: "helen"    as const, text: "Then what do you suggest? I need that part here by tomorrow morning." },
    { character: "narrator" as const, text: "Ryan had three options." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">
          Decision recorded: <span className="font-black capitalize">{gs.procurementDecision.replace(/-/g, " ")}</span>
        </p>
        <p className="text-xs text-green-700 mt-1">Proceeding to authorization.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("choice")} />
      )}

      {phase === "choice" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ProcurementChoiceCard
            onDone={(correct, choiceId) => {
              updateGs({ procurementDecision: choiceId });
              unlockGlossary(2); // Single-Source Justification
              showToast(
                correct
                  ? "✓ Correct — emergency PO preserves all controls"
                  : "📖 Unlocked: Single-Source Justification",
                correct ? "success" : "info"
              );
              setPhase("done");
              advance(3);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 3: Emergency PO ─────────────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "classify" | "done">(
    gs.emergencyClassification ? "done" : "dialogue"
  );

  const lines = [
    { character: "ryan"     as const, text: "Victor, the Hartmann line is down. Seal failure. Part at FastParts for $4,200. Helen wanted to use her personal card. I need authorization for an emergency PO." },
    { character: "victor"   as const, text: "First question: is this a genuine emergency, or a failure to plan that someone wants to reclassify as one?" },
    { character: "victor"   as const, text: "If it's genuine — unforeseeable failure, part not reasonably stockable, material business impact — I'll authorize right now. If it's not, we're having a different conversation." },
    { character: "ryan"     as const, text: "Unforeseeable failure. Part's not on the standard spares list. $600K order ships Monday." },
    { character: "victor"   as const, text: "Then let's test that. You tell me." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">
          EP-2024-009 verbally authorized — $5K limit · FastParts Co.
        </p>
        <p className="text-xs text-green-700 mt-1">Victor: &ldquo;Go. Get the part. Document everything.&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("classify")} />
      )}

      {phase === "classify" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <EmergencyClassifier
            onDone={(score, firstCorrect) => {
              updateGs({ emergencyClassification: firstCorrect ? "genuine" : "planning-failure" });
              unlockGlossary(3); // Verbal Authorization
              showToast(
                "📋 EP-2024-009 verbally authorized — $5K limit · FastParts Co.",
                "success"
              );
              setPhase("done");
              advance(4);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 4: Justification ────────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "build" | "done">(
    gs.justificationScore > 0 ? "done" : "dialogue"
  );

  const lines = [
    { character: "narrator" as const, text: "Ryan wrote the single-source justification before he did anything else." },
    { character: "victor"   as const, text: "Write a single paragraph: what happened, why you couldn't get three quotes, why FastParts, who authorized. Date it, sign it, file it. If this ever gets audited, that note is the difference between a clean exception and an unexplained policy violation." },
    { character: "ryan"     as const, text: "How long do I have?" },
    { character: "victor"   as const, text: "FastParts closes at 6. Drive after you file it. You have fifteen minutes." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">
          Justification filed — {gs.justificationScore}/4 fields complete.
        </p>
        <p className="text-xs text-green-700 mt-1">Time-stamped 4:56 PM, signed, filed in Emergency Docs folder.</p>
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
          <JustificationBuilder
            onDone={(score) => {
              updateGs({ justificationScore: score });
              unlockGlossary(4); // Audit Trail
              showToast(
                score >= 3
                  ? "✓ Strong justification — audit-ready documentation"
                  : "📝 Justification filed — consider completeness next time",
                score >= 3 ? "success" : "info"
              );
              setPhase("done");
              advance(5);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 5: The Pickup ───────────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "verify" | "quiz" | "done">(
    gs.receiptScore > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[0];

  const lines = [
    { character: "narrator" as const, text: "Ryan called FastParts at 4:55. Part confirmed in stock. He was there by 5:18." },
    { character: "ryan"     as const, text: "I have emergency PO EP-2024-009 from Nexara Industrial. I need part HDS-4420-R, Kessler hydraulic seal assembly." },
    { character: "narrator" as const, text: "The counter manager checked the system. Two units in stock. Ryan asked for a tax invoice — company name, PO reference on the face of the invoice." },
    { character: "ryan"     as const, text: "Can you do Net-15? PO EP-2024-009, Nexara Industrial — we have a company account." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Part secured. Receipt verified. Delivery en route.</p>
        <p className="text-xs text-green-700 mt-1">Helen confirmed delivery Saturday 7:14 AM. Line back up. Bradfield order on track.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("verify")} />
      )}

      {phase === "verify" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ReceiptVerifier
            onDone={(score) => {
              updateGs({ receiptScore: score });
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
              unlockGlossary(5); // Net-15
              showToast("🔧 Part secured. Helen confirms delivery Saturday 7:14 AM.", "success");
              setPhase("done");
              advance(6);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 6: The Audit ────────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "cautionary" | "assembly" | "quiz" | "done">(
    gs.auditComplete ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[1];

  const lines = [
    { character: "narrator" as const, text: "Three weeks later. Internal audit flagged EP-2024-009 — single-source purchase, $4,200, no competitive quotes." },
    { character: "narrator" as const, text: "Diane, the internal auditor, sent Ryan a request for supporting documentation. Ryan sent back a folder." },
    { character: "ryan"     as const, text: "Diane asked for supporting documentation. I sent her the folder." },
    { character: "narrator" as const, text: "First, though — the cautionary tale that made this situation feel urgent." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Audit closed — EP-2024-009: Clean Pass.</p>
        <p className="text-xs text-green-700 mt-1">
          Diane&apos;s review: &ldquo;Exemplary emergency procurement documentation. Recommended as template.&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("cautionary")} />
      )}

      {phase === "cautionary" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CautionaryTale onDone={() => setPhase("assembly")} />
        </motion.div>
      )}

      {phase === "assembly" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuditDocumentAssembler
            onDone={() => {
              updateGs({ auditComplete: true });
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
              unlockGlossary(6); // Vendor Concentration Risk
              unlockGlossary(7); // Materiality Threshold
              showToast("🔍 Audit complete — EP-2024-009 clean pass.", "success");
              setPhase("done");
              advance(7);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 7: The Framework ────────────────────────────────────────────────────

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "framework" | "quiz" | "done">(
    gs.frameworkScore > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[2];

  const lines = [
    { character: "victor"   as const, text: "We got this one right. But we got lucky. FastParts happened to be open. What if they'd been closed? We need a system, not a story." },
    { character: "narrator" as const, text: "Over two weeks, Ryan and Victor built the Emergency Procurement Framework — four elements, designed to work under pressure." },
    { character: "ryan"     as const, text: "The goal is: the next time this happens — and it will — anyone in procurement can handle it correctly, even if Victor and I are both unavailable." },
    { character: "victor"   as const, text: "Exactly. The process has to be stronger than any individual's judgment at 4:30 on a Friday." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Emergency Procurement Framework built.</p>
        <p className="text-xs text-green-700 mt-1">
          Four elements. Distributed to all department heads. Effective immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("framework")} />
      )}

      {phase === "framework" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <FrameworkBuilder
            onDone={(score) => {
              updateGs({ frameworkScore: score });
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
              unlockGlossary(8); // Procurement Fraud
              unlockGlossary(9); // Emergency Procurement Framework
              showToast("🏗️ Emergency Procurement Framework complete.", "success");
              setPhase("done");
              advance(8); // triggers scorecard
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Page (root orchestrator) ──────────────────────────────────────────────────

const LS_KEY = "emergency-po-progress";

export default function EmergencyPoPage() {
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
        <div className="w-8 h-8 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin" />
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
              <span className="text-[10px] bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                Module 5
              </span>
              <h1 className="text-sm font-bold text-[#1A1A1A] truncate">Friday at Four-Thirty</h1>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F0E8] border border-[#E8E4DD] text-xs font-semibold text-[#6B7280] hover:border-[#D97706]/40 hover:text-[#D97706] transition-colors cursor-pointer flex-shrink-0"
          >
            <BookOpen size={12} />
            <span className="hidden sm:inline">Glossary</span>
            {unlockedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#f59e0b] text-black text-[9px] font-bold flex items-center justify-center">
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
    </div>
  );
}
