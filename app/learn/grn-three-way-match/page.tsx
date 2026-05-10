"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, DEADLINE_BY_STEP, INITIAL_STATE, fmt } from "./constants";
import type { GameState, GlossaryTerm } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, LocationHeaderOverlay, sceneVariants } from "./scene-wrapper";
import {
  POBuilder, BarcodeScanGame, GRNForm, DisputeCall, ThreeWayMatch,
  LearnMore, DocumentFlyAnimation, StampAnimation,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const QUIZ_DATA = [
  {
    step: 2,
    question:
      "Neil adds 'Partial substitutions will not be accepted' as a special instruction on the PO. Why does this matter?",
    options: [
      { label: "It's standard procurement practice", value: "standard" },
      { label: "It removes vendor ambiguity and gives legal grounds to reject wrong specs", value: "legal" },
      { label: "It speeds up delivery", value: "speed" },
    ],
    correctValue: "legal",
    explanation:
      "Without explicit PO language, a vendor could argue they shipped 'equivalent' units. The special instruction closes that loophole — the PO becomes the legal standard for acceptance.",
  },
  {
    step: 4,
    question:
      "The delivery receipt says 150 units. Otto's GRN says 138 accepted. Which number matters for payment?",
    options: [
      { label: "150 — the carrier confirmed delivery", value: "150" },
      { label: "138 — what Otto verified against the PO spec", value: "138" },
    ],
    correctValue: "138",
    explanation:
      "The GRN reflects physical inspection against specification — not just a box count. The carrier confirmed boxes arrived. Otto confirmed 138 were correct. Payment follows the GRN.",
  },
  {
    step: 6,
    question: "Why should Priya hold the FULL invoice, not just the $8,220 portion?",
    options: [
      { label: "Release $94,530 now and dispute the $8,220 separately", value: "partial_now" },
      { label: "Hold everything until a credit note formally resolves the mismatch", value: "hold_all" },
    ],
    correctValue: "hold_all",
    explanation:
      "Releasing part of a mismatched invoice signals acceptance and weakens your position. The credit note creates the clean paper trail that makes the 3-way match work. Pay after documentation, not before.",
  },
];

// ─── Shared props ──────────────────────────────────────────────────────────────

interface SceneProps {
  gs: GameState;
  advance: (n: number) => void;
  updateGs: (p: Partial<GameState>) => void;
  unlockGlossary: (i: number) => void;
  showToast: (msg: string, type?: "success" | "warning" | "error") => void;
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

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
        <button onClick={onClose} suppressHydrationWarning aria-label="Close" className="opacity-60 hover:opacity-100 flex-shrink-0 cursor-pointer">
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

// ─── Glossary Drawer ────────────────────────────────────────────────────────────

function GlossaryDrawer({
  terms, open, onClose,
}: { terms: GlossaryTerm[]; open: boolean; onClose: () => void }) {
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
                <button onClick={onClose} suppressHydrationWarning aria-label="Close" className="p-1 text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer">
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
                    <Info size={11} className={`mt-0.5 flex-shrink-0 ${g.unlocked ? "text-[#f59e0b]" : "text-[#C4BDB5]"}`} />
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
// SCENE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ─── Scene 1 — The Brief ──────────────────────────────────────────────────────

function Scene1({ advance, unlockGlossary }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "brief" | "done">("dialogue");

  const dialogueLines = [
    {
      character: "clara" as const,
      text: "Hartwell & Briggs. 150 business laptops, three weeks. Sales promised fast turnaround — now it's our problem.",
    },
    {
      character: "clara" as const,
      text: "ProBook T14s, all identical. Their IT team is imaging from a single master. If even a handful come in with different specs, their entire deployment breaks.",
    },
    {
      character: "neil" as const,
      text: "Uniformity isn't a preference here — it's a hard requirement. I need to build this PO with the precision of a legal document. Because it is one.",
    },
  ];

  return (
    <SceneWrapper step={1}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("brief")} />
      )}

      {phase === "brief" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#7C3AED] to-[#1D4ED8]" />
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  Client Requirements Brief
                </h3>
                <span className="text-[9px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-1 rounded border border-purple-200">
                  HARTWELL &amp; BRIGGS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Units Required", "150 laptops"],
                  ["Timeline", "3 weeks (21 days)"],
                  ["Vendor", "CoreTech Supplies"],
                  ["Unit Price", "$685.00"],
                  ["Total Value", `$${fmt(102750)}`],
                  ["Payment Terms", "Net-30"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{l}</p>
                    <div className="px-3 py-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg text-sm text-[#4B5563]">{v}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-bold text-amber-800 mb-1">⚠ Critical: Uniformity Required</p>
                <p className="text-xs text-amber-700">
                  All 150 units must be identical configuration. Hartwell&apos;s IT team uses a single deployment image. A single wrong unit breaks the entire rollout.
                </p>
              </div>
              <LearnMore title="Why does specification uniformity matter in bulk orders?">
                When IT teams deploy at scale, they&apos;re often using a single OS image configured for specific hardware. One machine with different RAM or a different processor may fail to boot from that image — causing delays and re-imaging costs. The procurement team&apos;s job is to ensure the PO prevents substitution before it happens.
              </LearnMore>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { unlockGlossary(3); setPhase("done"); advance(2); }}
            suppressHydrationWarning
            className="self-start px-5 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Build the PO →
          </motion.button>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 2 — Build PO ───────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "build" | "flying" | "done">("dialogue");
  const [flyDone, setFlyDone] = useState(false);

  const dialogueLines = [
    {
      character: "neil" as const,
      text: "A sloppy PO is how you end up in a dispute with no ground to stand on. Every field matters — especially the configuration code.",
    },
    {
      character: "neil" as const,
      text: "I'm adding a special instruction. 'All units must match configuration code exactly. Partial substitutions will not be accepted.' Clara insisted on it. She was right.",
    },
  ];

  const handlePOComplete = useCallback((configCode: string, hasSpecialInstruction: boolean) => {
    updateGs({ poConfigCode: configCode, addedSpecialInstruction: hasSpecialInstruction });
    if (configCode === "CT-T14-i7-16-512-W11P") unlockGlossary(3);
    if (hasSpecialInstruction) unlockGlossary(5);
    setPhase("flying");
  }, [updateGs, unlockGlossary]);

  const handleFlyDone = useCallback(() => {
    showToast("PO# 2024-3175 sent to CoreTech Supplies (Stefan Vogt).", "success");
    setFlyDone(true);
    setTimeout(() => { setPhase("done"); advance(3); }, 600);
  }, [showToast, advance]);

  return (
    <SceneWrapper step={2}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("build")} />
      )}

      {phase === "build" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <POBuilder onComplete={handlePOComplete} />
          <LearnMore title="What makes a configuration code important?">
            A configuration code like CT-T14-i7-16-512-W11P encodes every hardware specification. When a vendor receives this code on a PO, there is no ambiguity about what was ordered — and no legal room to substitute. Without it, &quot;similar&quot; becomes a grey area that costs you.
          </LearnMore>
        </motion.div>
      )}

      {phase === "flying" && !flyDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">Sending PO to CoreTech&apos;s inbox…</p>
          <DocumentFlyAnimation label="PO" onDone={handleFlyDone} />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 3 — Delivery & Scanning ────────────────────────────────────────────

function Scene3({ advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "scan" | "done">("dialogue");

  const dialogueLines = [
    {
      character: "otto" as const,
      text: "Every delivery gets the same treatment. Nineteen years in warehouses has taught me one thing: the paperwork always says one thing. The pallet always says another.",
    },
    {
      character: "otto" as const,
      text: "We scan every unit against the PO spec. Not just a box count — a configuration verification. Everything gets scanned.",
    },
  ];

  const handleScanComplete = useCallback((result: { correct: number; wrong: number }) => {
    updateGs({ scanResult: result });
    unlockGlossary(0);
    showToast(`Scan complete: ${result.correct} correct, ${result.wrong} mismatches detected.`, result.wrong > 0 ? "warning" : "success");
    setTimeout(() => { advance(4); }, 1200);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={3}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("scan")} />
      )}

      {phase === "scan" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1A1A1A]">Scan All Pallets</h3>
            <span className="text-[10px] text-[#9CA3AF] bg-[#F5F0E8] px-2 py-1 rounded">150 units across 6 pallets</span>
          </div>
          <BarcodeScanGame onScanComplete={handleScanComplete} />
          <LearnMore title="What is a configuration verification scan?">
            A barcode scan confirms a box arrived. A configuration verification scan reads the device&apos;s identifier or label against the PO spec. Otto&apos;s process catches specification mismatches that a simple unit count would miss entirely.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 4 — Mismatch Found ─────────────────────────────────────────────────

function Scene4({ advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "grn" | "done">("dialogue");

  const dialogueLines = [
    {
      character: "otto" as const,
      text: "The fifth pallet. The scanner beeped differently. Not an error tone — a mismatch tone. Twelve units. Wrong processor, wrong RAM, wrong storage. Same brand label, completely different machine.",
    },
    {
      character: "otto" as const,
      text: "I set them aside, photographed every label and barcode, and sat down to write the GRN. My signature on this document will be referenced for months.",
    },
  ];

  const handleGRNSubmit = useCallback((accepted: number, rejected: number) => {
    updateGs({ grnAccepted: accepted, grnRejected: rejected });
    unlockGlossary(4);
    showToast(`GRN# WH-2024-0891 signed. ${accepted} accepted, ${rejected} quarantined.`, "success");
    setTimeout(() => { advance(5); }, 1000);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={4}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("grn")} />
      )}

      {phase === "grn" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <GRNForm onSubmit={handleGRNSubmit} />
          <LearnMore title="Why does the GRN matter more than the delivery note?">
            The delivery note records what the carrier dropped off. The GRN records what your warehouse inspector physically verified against the PO specification. In a payment dispute, the GRN wins — it&apos;s your internal document, signed by your employee.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 5 — GRN & Dispute ──────────────────────────────────────────────────

function Scene5({ advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "dispute" | "done">("dialogue");

  const dialogueLines = [
    {
      character: "neil" as const,
      text: "Stefan sounded cheerful when he picked up. He was expecting a routine confirmation. He was about to have a different kind of conversation.",
    },
    {
      character: "neil" as const,
      text: "I'm not going to be angry. I'm going to be precise. Facts, resolution, timeline. In that order.",
    },
  ];

  const handleDisputeChoose = useCallback((key: string) => {
    updateGs({ disputeChoice: key });
    unlockGlossary(7);
    showToast("Dispute documented. CoreTech committed to resolution.", "success");
    setTimeout(() => { advance(6); }, 800);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={5}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("dispute")} />
      )}

      {phase === "dispute" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <DisputeCall onChoose={handleDisputeChoose} />
          <LearnMore title="Why does tone matter in vendor disputes?">
            Aggressive demands put vendors on the defensive — they protect themselves rather than solve your problem. A factual approach gives them a clear problem to fix and a clear commitment to make. You get a better outcome faster, and the vendor relationship survives.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 6 — 3-Way Match ────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "match" | "done">("dialogue");

  const dialogueLines = [
    {
      character: "priya" as const,
      text: "I pull up three documents before I process a single payment. PO, GRN, Invoice. If they don't agree — quantity, specification, price — the invoice doesn't move.",
    },
    {
      character: "priya" as const,
      text: "CoreTech's invoice just arrived. One hundred and fifty units, full amount. Let's see what the GRN says.",
    },
  ];

  const handleHoldInvoice = useCallback(() => {
    updateGs({ invoiceHeld: true });
    unlockGlossary(1);
    showToast("Invoice CT-INV-88921 placed on hold.", "warning");
  }, [updateGs, unlockGlossary, showToast]);

  const handleMatchComplete = useCallback(() => {
    updateGs({ creditNoteApplied: true, partialPaymentReleased: true });
    unlockGlossary(2);
    unlockGlossary(6);
    showToast(`$${fmt(94530)} partial payment released to CoreTech.`, "success");
    setTimeout(() => { advance(7); }, 1200);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={6}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("match")} />
      )}

      {phase === "match" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <ThreeWayMatch
            grnAccepted={gs.grnAccepted || 138}
            onHoldInvoice={handleHoldInvoice}
            onMatchComplete={handleMatchComplete}
          />
          <LearnMore title="What is 3-way matching and why is it a control?">
            3-way matching prevents overpayment, fraud, and errors by requiring three independent documents to agree before money moves. The PO captures what you agreed to pay. The GRN captures what you actually received. The invoice captures what the vendor claims. All three must align.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 7 — Resolution ─────────────────────────────────────────────────────

function Scene7({ gs, updateGs, unlockGlossary, showToast, onShowScorecard }: Omit<SceneProps, "advance"> & { onShowScorecard: () => void }) {
  const [phase, setPhase] = useState<"dialogue" | "timeline" | "stamp" | "complete">("dialogue");

  const dialogueLines = [
    {
      character: "neil" as const,
      text: "Tuesday of the following week. Twelve replacement units. Otto scanned every one individually. All twelve read CT-T14-i7-16-512-W11P. He opened two at random and powered them on to verify.",
    },
    {
      character: "neil" as const,
      text: "Priya released the final $8,220. Invoice fully paid. PO closed. Hartwell & Briggs never knew any of this happened. That's what good controls look like from the outside.",
    },
    {
      character: "clara" as const,
      text: "Document this one as a reference for the team. Not as a failure — as a case where the controls worked exactly as designed.",
    },
  ];

  const resolutionSteps = [
    { label: "PO# 2024-3175 issued", time: "Tue 3:30pm", icon: "📄" },
    { label: "150 units delivered", time: "Thu 8:40am", icon: "🚚" },
    { label: "12 wrong units found", time: "Thu 10:47am", icon: "⚠️" },
    { label: "GRN# WH-2024-0891 signed", time: "Thu 11:00am", icon: "📋" },
    { label: "Stefan: credit note & replacement", time: "Thu 11:15am", icon: "📞" },
    { label: "Invoice held, credit applied", time: "Thu 11:30am", icon: "🔒" },
    { label: "$94,530 partial payment", time: "Thu 11:45am", icon: "💳" },
    { label: "12 replacements received", time: "Following Tue", icon: "✅" },
    { label: "$8,220 final payment", time: "Following Tue", icon: "💰" },
  ];

  return (
    <SceneWrapper step={7}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("timeline")} />
      )}

      {phase === "timeline" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <h3 className="text-sm font-bold text-[#1A1A1A]">What happened — start to finish</h3>
          <div className="space-y-2">
            {resolutionSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 px-3 py-2.5 bg-white border border-[#E8E4DD] rounded-xl"
              >
                <span className="text-base">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A1A]">{step.label}</p>
                </div>
                <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{step.time}</span>
              </motion.div>
            ))}
          </div>

          {/* Final numbers */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Invoice", value: `$${fmt(102750)}`, sub: "CT-INV-88921" },
              { label: "Credit Note", value: `-$${fmt(8220)}`, sub: "CT-CN-4417" },
              { label: "Net Paid", value: `$${fmt(102750)}`, sub: "PO closed" },
            ].map((item) => (
              <div key={item.label} className="px-3 py-3 bg-[#ECFDF5] border border-green-200 rounded-xl text-center">
                <p className="text-[10px] text-[#9CA3AF] mb-1">{item.label}</p>
                <p className="text-sm font-black text-green-700">{item.value}</p>
                <p className="text-[9px] text-[#9CA3AF]">{item.sub}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("stamp")}
            suppressHydrationWarning
            className="w-full px-5 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Close the case →
          </motion.button>
        </motion.div>
      )}

      {phase === "stamp" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 py-8">
          <p className="text-sm font-semibold text-[#1A1A1A]">All documents verified. PO closed.</p>
          <StampAnimation
            text="CASE CLOSED"
            color="#16a34a"
            onStamped={() => {
              updateGs({ replacementReceived: true });
              unlockGlossary(0);
              showToast("Module complete! All controls worked as designed.", "success");
              setTimeout(() => setPhase("complete"), 900);
            }}
          />
        </motion.div>
      )}

      {phase === "complete" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-4">
          {/* Scorecard rendered in parent via onShowScorecard */}
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

const LS_KEY = "grn-matching-progress";

export default function GRNThreeWayMatchPage() {
  const [step, setStep]         = useState(1);
  const [gs, setGs]             = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  // Location header overlay
  const [showLocHeader, setShowLocHeader]   = useState(true);
  const [locHeaderDone, setLocHeaderDone]   = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);

  // Quiz overlay
  const [quizData, setQuizData] = useState<(typeof QUIZ_DATA)[0] | null>(null);

  // Pending step after quiz
  const pendingStep = useRef<number | null>(null);

  // Auto-dismiss loc header after 2s
  useEffect(() => {
    const t = setTimeout(() => setShowLocHeader(false), 2200);
    return () => clearTimeout(t);
  }, [step]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { step: s, gs: g, glossary: gl } = JSON.parse(saved);
        if (s) setStep(s);
        if (g) setGs(g);
        if (gl) setGlossary(gl);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ step, gs, glossary }));
    } catch {
      // ignore
    }
  }, [step, gs, glossary]);

  const updateGs = useCallback((partial: Partial<GameState>) => {
    setGs((prev) => ({ ...prev, ...partial }));
  }, []);

  const unlockGlossary = useCallback((i: number) => {
    setGlossary((prev) => {
      if (prev[i]?.unlocked) return prev;
      const next = [...prev];
      next[i] = { ...next[i], unlocked: true };
      return next;
    });
    showToast(`Unlocked: ${INITIAL_GLOSSARY[i]?.term}`, "success");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = useCallback((msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const advance = useCallback((nextStep: number) => {
    // Check if there's a quiz at the boundary
    const quiz = QUIZ_DATA.find((q) => q.step === step);
    if (quiz) {
      pendingStep.current = nextStep;
      setQuizData(quiz);
    } else {
      setStep(nextStep);
      setShowLocHeader(true);
      setLocHeaderDone(false);
      if (nextStep === 8) setShowScorecard(true);
    }
  }, [step]);

  const handleQuizDone = useCallback((correct: boolean) => {
    if (correct) {
      updateGs({ quizScore: gs.quizScore + 1 });
    }
    setQuizData(null);
    const next = pendingStep.current ?? step + 1;
    pendingStep.current = null;
    setStep(next);
    setShowLocHeader(true);
    setLocHeaderDone(false);
    if (next === 8) setShowScorecard(true);
  }, [gs.quizScore, step, updateGs]);

  const handleRestart = useCallback(() => {
    setStep(1);
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setShowScorecard(false);
    setShowLocHeader(true);
    setLocHeaderDone(false);
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  const currentStepConfig = STEPS.find((s) => s.num === step) ?? STEPS[0];
  const hartwellDays = DEADLINE_BY_STEP[step] ?? null;

  const sceneProps: SceneProps = {
    gs,
    advance,
    updateGs,
    unlockGlossary,
    showToast,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
      {/* Location header overlay */}
      <LocationHeaderOverlay
        location={currentStepConfig.location}
        time={currentStepConfig.time}
        visible={showLocHeader && !locHeaderDone}
        onDone={() => setLocHeaderDone(true)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Glossary drawer */}
      <GlossaryDrawer terms={glossary} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Quiz overlay */}
      <AnimatePresence>
        {quizData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/70 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-lg">
              <MicroQuiz
                question={quizData.question}
                options={quizData.options}
                correctValue={quizData.correctValue}
                explanation={quizData.explanation}
                onDone={handleQuizDone}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Module header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <a
              href="/learn"
              className="text-xs text-[#9CA3AF] hover:text-[#D97706] transition-colors flex items-center gap-1 mb-2"
            >
              ← Back to modules
            </a>
            <h1
              className="text-xl font-black text-[#1A1A1A] leading-tight"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              Twelve Wrong Laptops
            </h1>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Module 3 · GRN &amp; 3-Way Match</p>
          </div>
          <button
            onClick={() => setGlossaryOpen(true)}
            suppressHydrationWarning
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E4DD] bg-white text-xs font-semibold text-[#6B7280] hover:border-[#D97706] hover:text-[#D97706] transition-colors cursor-pointer shadow-sm"
          >
            <span className="text-[#f59e0b]">📖</span>
            Glossary
            <span className="bg-[#FEF3C7] text-[#D97706] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {glossary.filter((g) => g.unlocked).length}/{glossary.length}
            </span>
          </button>
        </div>

        {/* Journey map */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl px-4 py-3 shadow-sm">
          <JourneyMap currentStep={Math.min(step, 7)} hartwellDays={hartwellDays} />
        </div>

        {/* Scene */}
        <AnimatePresence mode="wait">
          {!showScorecard && (
            <motion.div
              key={step}
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {step === 1 && <Scene1 {...sceneProps} />}
              {step === 2 && <Scene2 {...sceneProps} />}
              {step === 3 && <Scene3 {...sceneProps} />}
              {step === 4 && <Scene4 {...sceneProps} />}
              {step === 5 && <Scene5 {...sceneProps} />}
              {step === 6 && <Scene6 {...sceneProps} />}
              {step === 7 && (
                <Scene7
                  gs={gs}
                  updateGs={updateGs}
                  unlockGlossary={unlockGlossary}
                  showToast={showToast}
                  onShowScorecard={() => setShowScorecard(true)}
                />
              )}
            </motion.div>
          )}

          {showScorecard && (
            <motion.div
              key="scorecard"
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white border border-[#E8E4DD] rounded-2xl p-6 shadow-sm">
                <DynamicScorecard
                  gameState={gs}
                  onRestart={handleRestart}
                  onGlossary={() => setGlossaryOpen(true)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
