"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, INITIAL_STATE, CONTAINER_DAY_BY_STEP } from "./constants";
import type { GameState, GlossaryTerm } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, sceneVariants } from "./scene-wrapper";
import {
  IncotermSelector, ResponsibilityMapper, DetentionMeter,
  DocumentChecker, CostBreakdown, MatrixBuilder, LearnMore,
  DocumentFlyAnimation, StampAnimation,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Quiz data ─────────────────────────────────────────────────────────────────

const QUIZ_DATA = [
  {
    step: 2,
    question: "Under FOB, who is responsible for export customs clearance at the origin country?",
    options: [
      { label: "Nexara (buyer) — they're paying for the goods",  value: "buyer" },
      { label: "Jinshen (seller) — it's in their jurisdiction", value: "seller" },
      { label: "The freight forwarder — Hassan handles it",      value: "forwarder" },
    ],
    correctValue: "seller",
    explanation:
      "Under FOB, the seller handles everything up to and including loading on the vessel — which includes export customs in their own country. This is precisely why Hassan recommended FOB over EXW: Nexara had no way to manage customs in Jinshen's jurisdiction.",
  },
  {
    step: 5,
    question: "If Nexara had accepted CIF terms, what level of marine insurance would Jinshen have provided by default?",
    options: [
      { label: "Institute Cargo Clause A — all-risk coverage",                  value: "clauseA" },
      { label: "Institute Cargo Clause C — major casualties only",              value: "clauseC" },
      { label: "Full replacement value insurance, chosen by Hassan",            value: "replacement" },
    ],
    correctValue: "clauseC",
    explanation:
      "CIF only requires minimum insurance — Institute Cargo Clause C, which covers major casualties like sinking or fire, but not damage from rough handling or moisture. For precision machined components, Hassan arranged Clause A (all-risk) under FOB. Under CIF, Nexara would have had no say.",
  },
  {
    step: 6,
    question: "Why did Mei refuse DDP terms even though it would have been simplest for Nexara?",
    options: [
      { label: "DDP is too expensive for the seller to arrange",                value: "expensive" },
      { label: "DDP requires the seller to act as importer of record in the buyer's country", value: "importerOfRecord" },
      { label: "DDP terms aren't recognised in international trade law",         value: "notRecognised" },
    ],
    correctValue: "importerOfRecord",
    explanation:
      "DDP makes the seller responsible for import duties and customs clearance in the buyer's country — they'd need to register as importer of record in a foreign jurisdiction, pay unknown duties, and carry regulatory risk they can't price. Almost no overseas manufacturer will accept this exposure.",
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
  const bg = { success: "bg-[#ECFDF5] border-green-200 text-green-800", warning: "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]", error: "bg-red-50 border-red-200 text-red-800" }[type];
  const barColor = { success: "bg-green-400", warning: "bg-[#f59e0b]", error: "bg-red-400" }[type];
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
          {type === "success" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
        </span>
        <p className="text-xs leading-relaxed flex-1">{msg}</p>
        <button suppressHydrationWarning onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0 cursor-pointer"><X size={13} /></button>
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
              <button suppressHydrationWarning onClick={onClose} className="text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer"><X size={16} /></button>
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

// ─── Scene 1: The Jinshen Quote ────────────────────────────────────────────────

function Scene1({ gs, advance, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "doc" | "done">("dialogue");

  const lines = [
    { character: "narrator" as const, text: "Nexara Industrial has landed a $280,000 contract to retrofit a client's production line with precision CNC machining centres. The specialty components can't be sourced domestically at the required tolerances." },
    { character: "elena" as const,    text: "The Jinshen quote looks great. Unit prices, lead times, quality certifications — everything I need. But there's one term at the bottom I'm not sure I fully understand." },
    { character: "elena" as const,    text: "Three letters at the end of the pricing table: EXW. Ex Works. I know in general terms it means the supplier's responsibility ends at their factory. But what exactly does that mean operationally?" },
    { character: "narrator" as const, text: "Elena calls Hassan Khalil, the freight forwarder Frank Caruso has used for smaller international shipments." },
    { character: "hassan" as const,   text: "You said the quote came in EXW? Let me make sure you understand what that means operationally, because I've seen this trip up companies much larger than yours." },
    { character: "hassan" as const,   text: "EXW means Jinshen's obligation ends the moment those components are packed and sitting on their factory floor, ready for collection. Loading at their factory. Inland transport to port. Export customs clearance in their country. Ocean freight. Marine insurance. Import customs. Delivery. All of it is on you." },
    { character: "elena" as const,    text: "Including export customs clearance in their country?" },
    { character: "hassan" as const,   text: "Including export clearance. You'd need to arrange a customs broker in their jurisdiction, file export declarations in a foreign country, and deal with regulations you've never navigated. For a first-time import of this scale, I would strongly advise against EXW." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => {
          unlockGlossary(0); // Incoterms
          unlockGlossary(1); // EXW
          showToast("📖 Unlocked: Incoterms & EXW", "success");
          setPhase("doc");
        }} />
      )}

      {phase === "doc" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <DocumentFlyAnimation label="Jinshen Quote — $280,000" onDone={() => {}} />

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800">EXW: The cheapest-looking term — and the riskiest</p>
                <p className="text-xs text-red-700 mt-1">The EXW price looked attractively low compared to budget. But the price wasn't low — it was incomplete. Every logistics cost and risk was on Nexara's plate, including in a country they'd never operated in.</p>
              </div>
            </div>
          </div>

          <button
            suppressHydrationWarning
            onClick={() => { setPhase("done"); advance(2); }}
            className="self-start px-5 py-2.5 bg-[#f59e0b] hover:bg-[#D97706] text-black text-sm font-bold rounded-xl cursor-pointer transition-colors"
          >
            Call Hassan about alternatives →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 2: Choosing the Term ────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "select" | "quiz" | "done">(
    gs.chosenIncoterm ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[0];

  const lines = [
    { character: "hassan" as const, text: "For a first-time import of this value, I'd recommend FOB — Free on Board, named port of origin. Under FOB, Jinshen handles everything through export customs and loading onto the vessel." },
    { character: "hassan" as const, text: "The moment those components are on the ship, risk and cost transfer to you. You handle ocean freight, marine insurance, import customs, and inland delivery to your warehouse." },
    { character: "elena" as const,  text: "What about CIF — wouldn't it be simpler to have them arrange the freight and insurance?" },
    { character: "hassan" as const, text: "Under CIF, Jinshen chooses the carrier and the insurer. The insurance they're required to provide is minimum coverage — Clause C, which covers major casualties but not handling damage. For $280,000 of precision components, that's not adequate. With FOB, I book the freight. I choose the carrier. I arrange Clause A insurance, which covers everything." },
    { character: "elena" as const,  text: "And DDP? Could we have them handle everything door to door?" },
    { character: "hassan" as const, text: "Almost no overseas manufacturer will agree to DDP. It requires Jinshen to act as importer of record in your country — filing declarations, paying duties, assuming regulatory risk they can't price. Call Mei and you'll hear the same thing." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">
          Incoterm selected: <span className="font-black">{gs.chosenIncoterm}</span>
        </p>
        <p className="text-xs text-green-700 mt-1">Jinshen handles origin. Nexara handles destination. Clean handoff at the ship&apos;s rail.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("select")} />
      )}

      {phase === "select" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <IncotermSelector gs={gs} onConfirm={(code) => {
            updateGs({ chosenIncoterm: code });
            unlockGlossary(2); // FOB
            unlockGlossary(3); // CIF
            unlockGlossary(4); // DDP
            showToast(`📖 Unlocked: FOB, CIF, DDP definitions`, "success");
            setPhase("quiz");
          }} />
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

// ─── Scene 3: FOB Confirmed ────────────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "map" | "stamp" | "done">(
    Object.keys(gs.responsibilityMap).length > 0 ? "done" : "dialogue"
  );

  const lines = [
    { character: "mei" as const,     text: "We can certainly do FOB. Most of our overseas customers ask us to move off EXW once they understand the scope. FOB from our main port — we handle everything through export clearance and vessel loading." },
    { character: "elena" as const,   text: "That's the right split. You handle origin, we handle destination." },
    { character: "hassan" as const,  text: "I've booked the ocean freight and arranged marine insurance — Institute Cargo Clause A, all-risk coverage for $280,000 plus a 10% buffer for replacement costs. Policy is in Nexara's name." },
    { character: "mei" as const,     text: "Jinshen's team executed perfectly. Components manufactured to spec, packed in custom foam-lined crates rated for ocean freight, cleared for export. Container loaded Wednesday afternoon." },
    { character: "hassan" as const,  text: "Vessel confirmed. 19-day transit. Estimated arrival at destination port: Tuesday." },
    { character: "narrator" as const, text: "For 19 days, the shipment tracked across the ocean. The container arrived at the destination port on Tuesday morning — right on schedule, undamaged." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">FOB assignment confirmed — shipment en route.</p>
        <p className="text-xs text-green-700 mt-1">19-day voyage. All export documentation cleared. Hassan tracking vessel position.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("map")} />
      )}

      {phase === "map" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280] mb-3">Under the FOB terms just confirmed — assign responsibility for each stage:</p>
          <ResponsibilityMapper gs={gs} onComplete={(map) => {
            updateGs({ responsibilityMap: map });
            unlockGlossary(5); // BOL
            showToast("📖 Unlocked: Bill of Lading", "success");
            setPhase("stamp");
          }} />
        </motion.div>
      )}

      {phase === "stamp" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <StampAnimation
            text="FOB CONFIRMED"
            onStamped={() => { setPhase("done"); advance(4); }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 4: Four Days on the Dock ───────────────────────────────────────────

function Scene4({ gs, advance, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "meter" | "done">("dialogue");

  const lines = [
    { character: "narrator" as const, text: "The container arrives at the destination port on Tuesday morning — on schedule, undamaged, exactly as Hassan projected." },
    { character: "elena" as const,    text: "Hassan — the container is at port but nothing's moving. The status says: 'Awaiting clearance — no entry filed.' What's happening?" },
    { character: "hassan" as const,   text: "Elena, who arranged the import customs broker?" },
    { character: "elena" as const,    text: "[silence]" },
    { character: "hassan" as const,   text: "Under FOB, import customs clearance is the buyer's responsibility. I arranged freight and insurance because you asked me to. But no one instructed me to set up a customs broker at the destination port." },
    { character: "elena" as const,    text: "How much is this costing us every day?" },
    { character: "hassan" as const,   text: "Port detention is $800 per day after the first free day. You used that free day yesterday without knowing it. You're on the clock now." },
    { character: "frank" as const,    text: "What's the container costing us sitting there?" },
    { character: "elena" as const,    text: "$800 per day in detention. Plus $200 per day in demurrage to the shipping line for not returning the container on time." },
    { character: "frank" as const,    text: "Get Hassan on it. And Elena — this doesn't happen twice." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => {
          unlockGlossary(8); // Detention & Demurrage
          showToast("📖 Unlocked: Detention & Demurrage", "warning");
          setPhase("meter");
        }} />
      )}

      {phase === "meter" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <DetentionMeter onComplete={() => { setPhase("done"); advance(5); }} />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-800">Emergency broker engaged. Clock was already running.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 5: Emergency Clearance ─────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "docs" | "quiz" | "done">(
    gs.documentsChecked.length > 0 ? "done" : "dialogue"
  );
  const quiz = QUIZ_DATA[1];

  const lines = [
    { character: "hassan" as const,   text: "I have a broker at the destination port I can engage on an emergency basis. Send me: commercial invoice, packing list, bill of lading, certificate of origin, and Nexara's import license." },
    { character: "elena" as const,    text: "Sending everything within forty minutes." },
    { character: "narrator" as const, text: "The broker files the customs entry that afternoon. The next morning, customs flags it for a document review — not a physical inspection, but a classification challenge." },
    { character: "hassan" as const,   text: "Customs wants clarification on the HS code for the servo motor housings. They need the technical specification sheet to verify the correct tariff classification." },
    { character: "elena" as const,    text: "On it. I'll pull the spec sheet and have the broker file the classification before noon." },
    { character: "narrator" as const, text: "The response was filed. The container was released Friday afternoon — four days after the vessel arrived." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Documents filed. HS code resolved. Container released Friday.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => {
          unlockGlossary(6); // Customs Entry
          unlockGlossary(7); // HS Code
          showToast("📖 Unlocked: Customs Entry & HS Code", "success");
          setPhase("docs");
        }} />
      )}

      {phase === "docs" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <DocumentChecker gs={gs} onComplete={(docs) => {
            updateGs({ documentsChecked: docs });
            setPhase("quiz");
          }} />
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
    </div>
  );
}

// ─── Scene 6: The Cost ─────────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "costs" | "quiz" | "done">("dialogue");
  const quiz = QUIZ_DATA[2];

  const lines = [
    { character: "narrator" as const, text: "The truck pulled into Nexara's warehouse the following Monday. Total cost of the gap in Elena's customs planning: $5,200 in avoidable charges." },
    { character: "narrator" as const, text: "The components were perfect. Every spindle assembly, ball screw unit, and servo motor housing arrived to specification, undamaged. Mei's team had done everything right. Hassan's logistics were flawless." },
    { character: "narrator" as const, text: "The failure was entirely on the buyer's side — in the one area that FOB explicitly made the buyer's responsibility. Understanding an Incoterm and operationalising every obligation within it are two very different things." },
    { character: "frank" as const,    text: "This variance will show up in the logistics report. The explanation will be simple and uncomfortable. Make sure it doesn't happen on the next shipment." },
    { character: "elena" as const,    text: "It won't. Jinshen's second delivery is on the schedule for next quarter. The customs broker is already engaged — before the PO is even signed." },
  ];

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("costs")} />
      )}

      {phase === "costs" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CostBreakdown onComplete={() => setPhase("quiz")} />
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
              unlockGlossary(9); // Importer of Record
              showToast("📖 Unlocked: Importer of Record", "success");
              setPhase("done");
              advance(7);
            }}
          />
        </motion.div>
      )}

      {phase === "done" && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">Cost tallied. Lesson understood. Time to build the fix.</p>
        </div>
      )}
    </div>
  );
}

// ─── Scene 7: The Matrix ───────────────────────────────────────────────────────

function Scene7({ gs, advance, updateGs, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "matrix" | "done">(
    Object.keys(gs.matrixAnswers).length > 0 ? "done" : "dialogue"
  );

  const lines = [
    { character: "elena" as const,    text: "I spent Saturday building what I now call the Nexara Incoterms Responsibility Matrix. Eight stages. Four Incoterms. For each intersection: buyer or seller?" },
    { character: "elena" as const,    text: "Before we confirm any international delivery term, every box in our column has a name, a broker, and a timeline attached. That's the reference we use from now on." },
    { character: "narrator" as const, text: "The second container cleared customs in fourteen hours. Elena checked the port tracking system that evening, saw the status change to 'Released,' and allowed herself a small moment of satisfaction." },
    { character: "narrator" as const, text: "Not because the system had worked — the system was supposed to work. But because this time, she had made sure every piece of the system was actually in place before the goods were on the water." },
  ];

  if (phase === "done") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Matrix complete. Second shipment cleared in 14 hours. ✓</p>
        <p className="text-xs text-green-700 mt-1">Three letters on a contract are a definition. A name on every line of the matrix is an operation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "dialogue" && (
        <DialogueSequence lines={lines} onComplete={() => setPhase("matrix")} />
      )}

      {phase === "matrix" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <MatrixBuilder gs={gs} onComplete={(answers) => {
            updateGs({ matrixAnswers: answers });
            showToast("📊 Matrix complete — the Nexara reference is built.", "success");
            setPhase("done");
            advance(8); // signals scorecard
          }} />

          <LearnMore title="Why does the CIF risk transfer at the same point as FOB?">
            Under CIF, the seller pays for ocean freight and minimum insurance — but risk still transfers at vessel loading, the same as FOB. This is counterintuitive: the seller is paying for the voyage but the buyer bears the risk during it. The difference is cost allocation, not risk. Under FOB, the buyer explicitly books and controls their own freight and insurance. Under CIF, the seller bundles these services at minimum standard — which is why Hassan preferred FOB for precision components.
          </LearnMore>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function IncotermsPage() {
  const [step, setStep]           = useState(1);
  const [gs, setGs]               = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary]   = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);
  const [showScorecard, setShowScorecard] = useState(false);

  const prevGlossaryRef = useRef<boolean[]>(INITIAL_GLOSSARY.map(() => false));

  // ── localStorage restore ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("incoterms-dock-progress");
      if (saved) {
        const { step: s, gs: g, glossary: gl } = JSON.parse(saved);
        if (typeof s === "number" && s >= 1 && s <= 7 && g && gl) {
          setStep(s); setGs(g); setGlossary(gl);
          if (s === 8) setShowScorecard(true);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("incoterms-dock-progress", JSON.stringify({ step, gs, glossary })); }
    catch {}
  }, [step, gs, glossary]);

  // ── glossary unlock notifications ──
  useEffect(() => {
    glossary.forEach((term, i) => {
      if (term.unlocked && !prevGlossaryRef.current[i]) {
        prevGlossaryRef.current[i] = true;
      }
    });
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
    if (nextStep === 8) {
      setShowScorecard(true);
      setStep(8);
    } else {
      setStep(nextStep);
    }
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem("incoterms-dock-progress");
    setStep(1);
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setShowScorecard(false);
    prevGlossaryRef.current = INITIAL_GLOSSARY.map(() => false);
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

  const containerDay = CONTAINER_DAY_BY_STEP[step] ?? null;
  const unlockedCount = glossary.filter((t) => t.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col" style={{ fontFamily: "var(--font-dm-sans),sans-serif" }}>
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
                <a href="/" className="text-[10px] text-[#9CA3AF] hover:text-[#D97706] transition-colors">← Home</a>
                <span className="text-[#E8E4DD]">/</span>
                <span className="text-[10px] text-[#9CA3AF]">Module 4</span>
              </div>
              <h1 className="text-base font-black text-[#1A1A1A] leading-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Four Days on the Dock
              </h1>
              <p className="text-[10px] text-[#9CA3AF]">Incoterms & International Procurement</p>
            </div>
            <button
              suppressHydrationWarning
              onClick={() => setGlossaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E4DD] bg-white hover:border-[#D97706] transition-colors cursor-pointer text-xs font-semibold text-[#6B7280]"
            >
              <BookOpen size={13} className="text-[#D97706]" />
              <span>Glossary</span>
              {unlockedCount > 0 && (
                <span className="bg-[#FEF3C7] text-[#D97706] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unlockedCount}
                </span>
              )}
            </button>
          </div>

          {/* Journey Map */}
          {!showScorecard && (
            <JourneyMap currentStep={Math.min(step, 7)} containerDay={containerDay} />
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {showScorecard ? (
            <motion.div key="scorecard" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
              <DynamicScorecard gs={gs} onRestart={restart} />
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
          Operations Decoded · Module 4 · Incoterms & International Procurement
        </p>
      </footer>
    </div>
  );
}
