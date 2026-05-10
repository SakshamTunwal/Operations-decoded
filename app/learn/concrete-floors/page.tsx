"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info } from "lucide-react";

import { STEPS, INITIAL_GLOSSARY, SLOTTING_ITEMS, PICK_METHODS, ERROR_LOG, RETURN_ITEMS } from "./constants";
import type { GameState } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, LocationHeaderOverlay, sceneVariants } from "./scene-wrapper";
import {
  LearnMore, WalkingDistanceGauge, SlottingGame, PickMethodSelector,
  WMSDiscrepancyGame, ErrorFixGame, ReturnsGradingGame,
  ConveyorFixDecision, DocumentFlyAnimation, StampAnimation,
} from "./interactions";
import { MicroQuiz }        from "./micro-quiz";
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

// ─── Scene 1 — Warehouse Floor Walk ──────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "gauge" | "slotting" | "done">("dialogue");

  const dialogueLines = [
    { character: "andre" as const, text: "First day as Operations Manager. The flash sale is in seven weeks. Let me see what we're working with." },
    { character: "fatima" as const, text: "I'll give you the tour. Fair warning — the warehouse layout was set up in 2019 and hasn't been touched since." },
    { character: "andre" as const, text: "How far does a picker walk per order?" },
    { character: "fatima" as const, text: "Around 380 metres. Our bestselling leggings are all the way at the back of aisle five." },
  ];

  return (
    <SceneWrapper step={1}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("gauge")} />
      )}

      {phase === "gauge" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <WalkingDistanceGauge before={380} after={140} />
          <LearnMore title="What is ABC Slotting?">
            ABC slotting organises warehouse locations so the fastest-moving SKUs (A items) are closest to packing, medium-velocity items (B) in the middle, and slow-movers (C) furthest away. Moving a high-velocity SKU 30 metres closer to packing saves that distance on every single order it appears in.
          </LearnMore>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("slotting")}
            className="self-start px-5 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Redesign the Layout →
          </motion.button>
        </motion.div>
      )}

      {phase === "slotting" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <SlottingGame
            items={SLOTTING_ITEMS}
            onComplete={() => {
              updateGs({ slottingCompleted: true });
              unlockGlossary(0);
              showToast("Perfect layout! All SKUs correctly slotted.", "success");
              setTimeout(() => { setPhase("done"); advance(2); }, 800);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 2 — Receiving Dock ─────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "decision" | "stamping" | "done">("dialogue");
  const [windowChoice, setWindowChoice] = useState<"morning" | "afternoon" | null>(null);

  const dialogueLines = [
    { character: "fatima" as const, text: "Yesterday a truck arrived at 11am and we had five pickers waiting at the dock. Three more trucks at 2pm." },
    { character: "andre" as const, text: "So trucks are blocking aisles and pickers are dodging forklifts all afternoon?" },
    { character: "fatima" as const, text: "Exactly. We've had two near-misses this month. And every delivery interrupts the pick wave." },
    { character: "andre" as const, text: "We need a dedicated receiving window. Deliveries only happen in a fixed time block." },
  ];

  const handleChoose = (choice: "morning" | "afternoon") => {
    setWindowChoice(choice);
    updateGs({ receivingWindowSet: true });
    unlockGlossary(1);
    setPhase("stamping");
  };

  return (
    <SceneWrapper step={2}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("decision")} />
      )}

      {phase === "decision" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Set the Receiving Window
              </h3>
              <p className="text-sm text-[#4B5563]">
                Deliveries will only be accepted during this window. All other times, the dock is closed for inbound.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    key: "morning" as const,
                    label: "6:00am – 9:00am",
                    sub: "Before the first pick wave. Dock clear before pickers start.",
                    icon: "🌅",
                    recommended: true,
                  },
                  {
                    key: "afternoon" as const,
                    label: "12:00pm – 2:00pm",
                    sub: "During lunch break. Reduces risk of dock conflicts.",
                    icon: "🌤",
                    recommended: false,
                  },
                ].map((opt) => (
                  <motion.button
                    key={opt.key}
                    whileHover={{ x: 6, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChoose(opt.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#E8E4DD] rounded-xl cursor-pointer hover:border-[#D97706]/40 transition-colors text-left"
                  >
                    <span className="text-xl flex-shrink-0">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                        {opt.recommended && (
                          <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full">RECOMMENDED</span>
                        )}
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{opt.sub}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <LearnMore title="Why do receiving windows matter?">
            When trucks arrive unpredictably, they block aisles and force pickers to wait or reroute. A fixed receiving window separates inbound logistics from outbound picking — two operations that physically cannot share the same space safely.
          </LearnMore>
        </motion.div>
      )}

      {phase === "stamping" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
            Receiving window set: <span className="text-[#D97706]">{windowChoice === "morning" ? "6:00am – 9:00am" : "12:00pm – 2:00pm"}</span>
          </p>
          <StampAnimation
            text="POLICY SET"
            color="#16a34a"
            onStamped={() => {
              showToast("Receiving window confirmed. Dock conflicts eliminated.", "success");
              setTimeout(() => { setPhase("done"); advance(3); }, 900);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 3 — Pick Operations ────────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "method" | "zones" | "done">("dialogue");
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const dialogueLines = [
    { character: "chidi" as const, text: "Right now I'm doing single-order picking. One order at a time, full floor walk each time. It's killing me." },
    { character: "andre" as const, text: "What's your throughput per hour?" },
    { character: "chidi" as const, text: "About 22 orders. For the flash sale we'll need at least 60." },
    { character: "priya" as const, text: "If we switch to zone picking with the new slotting, I can set up the WMS to generate optimised pick paths by zone." },
  ];

  const handleMethodChosen = (method: string) => {
    updateGs({ pickMethodChosen: method });
    unlockGlossary(2);
    if (method === "zone") {
      showToast("Zone picking selected. Chidi will own Zones 1–3.", "success");
      setPhase("zones");
    } else {
      showToast("Pick method noted — but zone picking is the standard for flash sales.", "warning");
      setPhase("zones");
    }
  };

  const handleZoneApproved = () => {
    updateGs({ zoneDesignApproved: true });
    showToast("Zone design approved. WMS will generate zone-optimised pick paths.", "success");
    setTimeout(() => { setPhase("done"); advance(4); }, 800);
  };

  return (
    <SceneWrapper step={3}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("method")} />
      )}

      {phase === "method" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <PickMethodSelector
            methods={PICK_METHODS}
            selected={selectedMethod}
            onChange={setSelectedMethod}
          />
          {selectedMethod && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleMethodChosen(selectedMethod)}
              className="w-full py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Confirm Pick Method →
            </motion.button>
          )}
          <LearnMore title="Why does pick method matter for a flash sale?">
            During a flash sale you might go from 200 orders/day to 4,200. The pick method is the single biggest throughput lever. Zone picking distributes the work across multiple pickers simultaneously — if zones are well-designed, no single picker becomes the bottleneck.
          </LearnMore>
        </motion.div>
      )}

      {phase === "zones" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Zone Design — Review & Approve
              </h3>
              <p className="text-xs text-[#6B7280]">Priya has configured 5 zones in the WMS. Each picker owns one zone.</p>
              <div className="space-y-2">
                {[
                  { zone: "Zone 1", owner: "Chidi",   skus: "Activewear Leggings, Sports Bras",  color: "bg-red-50 border-red-200 text-red-800" },
                  { zone: "Zone 2", owner: "Fatima",  skus: "Accessories, Gym Bags",              color: "bg-blue-50 border-blue-200 text-blue-800" },
                  { zone: "Zone 3", owner: "Reuben",  skus: "Running Shoes, Trainers",            color: "bg-green-50 border-green-200 text-green-800" },
                  { zone: "Zone 4", owner: "Bisi",    skus: "General SKUs, Mixed Categories",     color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
                  { zone: "Zone 5", owner: "Temp 1",  skus: "Outerwear, Clearance",               color: "bg-purple-50 border-purple-200 text-purple-800" },
                ].map((z) => (
                  <div key={z.zone} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${z.color}`}>
                    <span className="text-xs font-bold w-14 flex-shrink-0">{z.zone}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold">{z.skus}</p>
                      <p className="text-[10px] opacity-70">Assigned: {z.owner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleZoneApproved}
              className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Approve Zone Design →
            </motion.button>
          </div>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 4 — WMS & Data ─────────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "discrepancies" | "done">("dialogue");

  const dialogueLines = [
    { character: "priya" as const, text: "I ran a full location audit. We have 47 discrepancies between physical stock and the WMS." },
    { character: "andre" as const, text: "Forty-seven. During a flash sale that's 47 potential mis-picks or stockouts." },
    { character: "priya" as const, text: "Exactly. The WMS thinks we have 340 pairs of leggings in Aisle 5, Row 3. There are actually 181." },
    { character: "andre" as const, text: "Let's go through the critical ones now and fix them before we go live." },
  ];

  return (
    <SceneWrapper step={4}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("discrepancies")} />
      )}

      {phase === "discrepancies" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <WMSDiscrepancyGame
            onFixed={(fixed: number) => {
              updateGs({ wmsDiscrepanciesFixed: fixed });
              unlockGlossary(3);
              showToast(`${fixed} discrepancies resolved. WMS accuracy restored.`, "success");
              setTimeout(() => { setPhase("done"); advance(5); }, 800);
            }}
          />
          <LearnMore title="Why does WMS accuracy matter?">
            When a picker arrives at a location the WMS says has stock, but the shelf is empty, they either waste time hunting or — worse — skip the item and ship an incomplete order. A 99%+ location accuracy is the foundation every other warehouse improvement sits on.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 5 — Error Reduction ────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "errors" | "done">("dialogue");

  const dialogueLines = [
    { character: "yuki" as const, text: "I pulled three months of returns data. 96.6% pick accuracy sounds fine until you realise that's 293 wrong orders last month." },
    { character: "andre" as const, text: "What are the top error types?" },
    { character: "yuki" as const, text: "Wrong colourways on leggings — 156 errors. Wrong half-size on shoes — 89. Wrong item grabbed from multi-SKU bins — 48." },
    { character: "andre" as const, text: "These are all fixable with visual controls. Low cost, high impact." },
  ];

  return (
    <SceneWrapper step={5}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("errors")} />
      )}

      {phase === "errors" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <ErrorFixGame
            errors={ERROR_LOG}
            onFixed={(applied: number) => {
              updateGs({ errorFixesApplied: applied });
              unlockGlossary(4);
              showToast(`${applied} error fixes deployed. Pick accuracy should jump to 98%+.`, "success");
              setTimeout(() => { setPhase("done"); advance(6); }, 800);
            }}
          />
          <LearnMore title="Visual controls vs technology fixes">
            Before reaching for expensive software, look at visual controls. Colour-coded bin dividers, large-format labels, and bin spacing are cheap, immediate, and often more effective than a system change. Pickers process visual information faster than screen prompts.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 6 — Returns Bay ────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "grading" | "done">("dialogue");

  const dialogueLines = [
    { character: "yuki" as const, text: "Returns are currently sitting in a corner until someone has time to deal with them. We've got £18,000 of stock in limbo." },
    { character: "andre" as const, text: "Why isn't it being processed faster?" },
    { character: "yuki" as const, text: "No system. Each person grades differently. Grade A goes back to stock, Grade D gets written off — but nobody agrees on what's Grade B or C." },
    { character: "andre" as const, text: "We need a single grading standard. Let me show you how it should work." },
  ];

  return (
    <SceneWrapper step={6}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("grading")} />
      )}

      {phase === "grading" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <ReturnsGradingGame
            items={RETURN_ITEMS}
            onComplete={(correct) => {
              updateGs({ returnsProcessed: correct });
              unlockGlossary(6);
              showToast(
                correct >= 5
                  ? `${correct}/6 returns graded correctly. Excellent!`
                  : `${correct}/6 — review the grading guide and you'll get it.`,
                correct >= 5 ? "success" : "warning"
              );
              setTimeout(() => { setPhase("done"); advance(7); }, 800);
            }}
          />
          <LearnMore title="The economics of returns grading">
            Grade A items recovered at full value. Grade B at 70–80% after reprocessing. Grade C at 20–30% via outlet channels. Grade D is a write-off. The faster you grade, the faster you recover cash — every day in limbo is lost margin.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 7 — Flash Sale Execution ──────────────────────────────────────────

interface Scene7Props extends SceneProps {
  restart: () => void;
  setGlossaryOpen: (v: boolean) => void;
}

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast, restart, setGlossaryOpen }: Scene7Props) {
  const [phase, setPhase] = useState<"rehearsal" | "day1" | "day2_crisis" | "day2_resolve" | "day3" | "complete">("rehearsal");
  const [day1Count, setDay1Count] = useState(0);
  const [conveyorRerouted, setConveyorRerouted] = useState(false);

  const handleRehearsalDone = () => {
    updateGs({ dressRehearsalRun: true });
    showToast("Dress rehearsal complete. Team is ready.", "success");
    setPhase("day1");
  };

  const handleDay1Orders = () => {
    const orders = 3840;
    setDay1Count(orders);
    updateGs({ day1Orders: orders });
    unlockGlossary(5);
    showToast(`Day 1 complete: ${orders.toLocaleString()} orders. 98.8% accuracy.`, "success");
    setTimeout(() => setPhase("day2_crisis"), 900);
  };

  const handleConveyorDecision = (rerouted: boolean) => {
    setConveyorRerouted(rerouted);
    updateGs({ day2ConveyorFixed: rerouted });
    if (rerouted) {
      showToast("Smart call. Manual sort table absorbed the overflow.", "success");
    } else {
      showToast("Risky wait — but the belt came back up in 22 minutes.", "warning");
    }
    setPhase("day2_resolve");
  };

  const handleDay3Decision = (tempsCalled: boolean) => {
    updateGs({ day3TempsCalled: tempsCalled });
    unlockGlossary(7);
    if (tempsCalled) {
      showToast("Temp team on-floor. Day 3 volume absorbed without a slip.", "success");
    } else {
      showToast("Permanent team pushed hard — 98.1% accuracy under pressure.", "warning");
    }
    setPhase("complete");
  };

  return (
    <SceneWrapper step={7}>
      {phase === "rehearsal" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                    Flash Sale Eve — Dress Rehearsal
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Andre has called the full team in for a dry run. Seven weeks of preparation comes down to tonight.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Zone Design", status: gs.zoneDesignApproved ? "✅ Ready" : "⚠ Pending", ok: gs.zoneDesignApproved },
                  { label: "WMS Accuracy", status: gs.wmsDiscrepanciesFixed >= 3 ? "✅ 99.2%" : "⚠ Check", ok: gs.wmsDiscrepanciesFixed >= 3 },
                  { label: "Visual Controls", status: gs.errorFixesApplied >= 3 ? "✅ Deployed" : "⚠ Pending", ok: gs.errorFixesApplied >= 3 },
                  { label: "ABC Slotting", status: gs.slottingCompleted ? "✅ Done" : "⚠ Pending", ok: gs.slottingCompleted },
                ].map((item) => (
                  <div key={item.label} className={`px-3 py-2.5 rounded-xl border ${item.ok ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"}`}>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">{item.label}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${item.ok ? "text-green-800" : "text-[#92400E]"}`}>{item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DocumentFlyAnimation
            label="Rehearsal"
            onDone={handleRehearsalDone}
          />
        </motion.div>
      )}

      {phase === "day1" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest">Flash Sale — Day 1 — LIVE</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Orders / Hour", value: "480", highlight: true },
                  { label: "Pick Accuracy", value: "98.8%", highlight: true },
                  { label: "Dispatch On Time", value: "99.1%", highlight: false },
                ].map((stat) => (
                  <div key={stat.label} className={`px-3 py-3 rounded-xl border text-center ${stat.highlight ? "bg-[#FEF3C7] border-[#f59e0b]/40" : "bg-[#F5F0E8] border-[#E8E4DD]"}`}>
                    <p className="text-xs text-[#9CA3AF] mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs text-green-800 font-semibold">
                  Andre to Ben (Finance): &quot;3,840 orders shipped. 98.8% accuracy. We&apos;re on track.&quot;
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleDay1Orders}
            className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            End of Day 1 — Advance to Day 2 →
          </motion.button>
        </motion.div>
      )}

      {phase === "day2_crisis" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-red-500" />
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl"
                >
                  🚨
                </motion.span>
                <p className="font-bold text-red-800 text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  Day 2 — Crisis: Conveyor Belt Failure
                </p>
              </div>
              <p className="text-sm text-red-700">
                11:47am. The main packing conveyor has jammed. Estimated downtime: 30–45 minutes.
                560 picked orders are backed up at the packing station.
              </p>
              <p className="text-xs font-semibold text-red-600">
                You have two options. You have 90 seconds to decide.
              </p>
            </div>
          </div>
          <ConveyorFixDecision onDecision={handleConveyorDecision} />
        </motion.div>
      )}

      {phase === "day2_resolve" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest mb-1">Flash Sale — Day 2 — Resolved</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Orders / Hour", value: "390", note: "down from 480" },
                  { label: "Downtime", value: "38 min", note: "belt repaired" },
                  { label: "Backlog Cleared", value: "100%", note: "by 2:30pm" },
                ].map((s) => (
                  <div key={s.label} className="px-3 py-3 rounded-xl border border-[#E8E4DD] bg-[#F5F0E8] text-center">
                    <p className="text-xs text-[#9CA3AF] mb-1">{s.label}</p>
                    <p className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{s.value}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.note}</p>
                  </div>
                ))}
              </div>
              <p className={`text-xs p-3 rounded-xl border ${conveyorRerouted ? "bg-green-50 border-green-200 text-green-800" : "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]"}`}>
                {conveyorRerouted
                  ? "Manual sort table absorbed the overflow. Smart contingency planning."
                  : "Waited for belt repair. Risky but worked this time. Have a manual backup plan for Day 3."}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("day3")}
            className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Day 3 — Final Push →
          </motion.button>
        </motion.div>
      )}

      {phase === "day3" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest">Flash Sale — Day 3 — 8:00am</p>
              <p className="text-sm text-[#4B5563]">
                Marketing just extended the flash sale by 24 hours. Volume is forecast to spike 40% above Day 1.
                The permanent team is already fatigued from two days of intensity.
              </p>
              <div className="bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl p-3">
                <p className="text-xs font-semibold text-[#92400E]">
                  ⚠ Ben (Finance): &quot;Calling in the temp agency costs £2,400. We&apos;re already beating forecast by 18%.&quot;
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold text-[#1A1A1A]">What do you do?</p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-2"
          >
            {[
              {
                key: true,
                icon: "📞",
                label: "Call in the temp agency",
                sub: "£2,400 cost, but team stays fresh. Accuracy protected.",
              },
              {
                key: false,
                icon: "💪",
                label: "Push through with the permanent team",
                sub: "No extra cost, but fatigue may hit accuracy on long shifts.",
              },
            ].map((opt) => (
              <motion.button
                key={String(opt.key)}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 340, damping: 26 } } }}
                whileHover={{ x: 6, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDay3Decision(opt.key)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#E8E4DD] rounded-xl cursor-pointer hover:border-[#D97706]/40 transition-colors text-left"
              >
                <span className="text-xl flex-shrink-0">{opt.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{opt.sub}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {phase === "complete" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DynamicScorecard
            gameState={gs}
            onRestart={restart}
            onGlossary={() => setGlossaryOpen(true)}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ══════════════════════════════════════════════════════════════════════════════

const QUIZ_DATA = [
  {
    step: 1,
    question: "Why does moving high-velocity SKUs closer to packing reduce picking time?",
    options: [
      { label: "It reduces the weight pickers carry", value: "weight" },
      { label: "It shortens the walking distance per pick", value: "distance" },
      { label: "It makes the WMS faster", value: "wms" },
    ],
    correctValue: "distance",
    explanation: "Walking distance is the biggest time cost in warehouse picking. A-items appear in many orders — every metre saved on an A-item multiplies across thousands of picks.",
  },
  {
    step: 3,
    question: "In zone picking, what happens after each zone picker completes their portion of an order?",
    options: [
      { label: "The order ships immediately from each zone", value: "ships" },
      { label: "Items consolidate at the packing station", value: "consolidate" },
      { label: "The order goes back to the start of the queue", value: "queue" },
    ],
    correctValue: "consolidate",
    explanation: "Zone picking works in parallel — each picker handles their zone simultaneously, then all items for an order meet at the packing station for final assembly and dispatch.",
  },
  {
    step: 5,
    question: "A 96.6% pick accuracy rate means how many wrong orders per 10,000 shipped?",
    options: [
      { label: "34 wrong orders", value: "34" },
      { label: "340 wrong orders", value: "340" },
      { label: "3,400 wrong orders", value: "3400" },
    ],
    correctValue: "340",
    explanation: "96.6% accuracy = 3.4% error rate. On 10,000 orders that's 340 wrong items — returns, refunds, and customer complaints. The closer you get to 99.9%, the more each decimal point is worth.",
  },
];

const FLASH_SALE_BY_STEP: Record<number, number | null> = {
  1: 7, 2: 6, 3: 5, 4: 3, 5: 2, 6: 1, 7: 0,
};

const INITIAL_STATE: GameState = {
  slottingCompleted:     false,
  receivingWindowSet:    false,
  pickMethodChosen:      "",
  zoneDesignApproved:    false,
  wmsDiscrepanciesFixed: 0,
  errorFixesApplied:     0,
  returnsProcessed:      0,
  dressRehearsalRun:     false,
  day1Orders:            0,
  day2ConveyorFixed:     false,
  day3TempsCalled:       false,
  quizScore:             0,
  scorecardViewed:       false,
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function ConcreteFloorsPage() {
  // ── Navigation state ──
  const [step, setStep]                   = useState(1);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [headerData, setHeaderData]       = useState({ location: "", time: "" });
  const [quizStep, setQuizStep]           = useState<number | null>(null);
  const pendingStep                       = useRef<number>(1);

  // ── Game state ──
  const [gs, setGs]                     = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary]         = useState(INITIAL_GLOSSARY);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const updateGs = useCallback((patch: Partial<GameState>) => setGs((s) => ({ ...s, ...patch })), []);

  const unlockGlossary = useCallback((idx: number) =>
    setGlossary((g) => g.map((t, i) => (i === idx ? { ...t, unlocked: true } : t))), []);

  // ── localStorage persistence ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cf-progress");
      if (saved) {
        const { step: s, gs: g, glossary: gl } = JSON.parse(saved);
        if (typeof s === "number" && s >= 1 && s <= 7 && g && gl) {
          setStep(s);
          setGs(g);
          setGlossary(gl);
        }
      }
    } catch {
      // ignore corrupt saves
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cf-progress", JSON.stringify({ step, gs, glossary }));
    } catch {}
  }, [step, gs, glossary]);

  // ── Glossary unlock notification ──
  const prevGlossaryRef = useRef<boolean[]>(INITIAL_GLOSSARY.map(() => false));
  useEffect(() => {
    glossary.forEach((term, i) => {
      if (term.unlocked && !prevGlossaryRef.current[i]) {
        prevGlossaryRef.current[i] = true;
        const shortName = term.term.split("(")[0].trim();
        setTimeout(() => showToast(`📖 Unlocked: ${shortName}`, "success"), 400);
      }
    });
  }, [glossary, showToast]);

  // ── Advance to next step (with optional quiz + location header) ──
  const triggerTransition = useCallback((nextStep: number) => {
    const cfg = STEPS[nextStep - 1];
    setHeaderData({ location: cfg.location, time: cfg.time });
    pendingStep.current = nextStep;
    setHeaderVisible(true);
    setTimeout(() => setHeaderVisible(false), 1100);
  }, []);

  const handleHeaderDone = useCallback(() => {
    setStep(pendingStep.current);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const advance = useCallback((nextStep: number) => {
    const quiz = QUIZ_DATA.find((q) => q.step === step && nextStep === step + 1);
    if (quiz) {
      setQuizStep(step);
      return;
    }
    triggerTransition(nextStep);
  }, [step, triggerTransition]);

  const handleQuizDone = (correct: boolean) => {
    if (correct) updateGs({ quizScore: gs.quizScore + 1 });
    setQuizStep(null);
    triggerTransition(step + 1);
  };

  const restart = useCallback(() => {
    setGs(INITIAL_STATE);
    setGlossary(INITIAL_GLOSSARY);
    setStep(1);
    try { localStorage.removeItem("cf-progress"); } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  const flashSaleDay = FLASH_SALE_BY_STEP[step] ?? null;

  // ── Shared props passed down to every scene ──
  const sceneProps: SceneProps = { gs, advance, updateGs, unlockGlossary, showToast };

  const SCENE_MAP: Record<number, () => React.ReactNode> = {
    1: () => <Scene1 {...sceneProps} />,
    2: () => <Scene2 {...sceneProps} />,
    3: () => <Scene3 {...sceneProps} />,
    4: () => <Scene4 {...sceneProps} />,
    5: () => <Scene5 {...sceneProps} />,
    6: () => <Scene6 {...sceneProps} />,
    7: () => <Scene7 {...sceneProps} restart={restart} setGlossaryOpen={setGlossaryOpen} />,
  };

  const activeQuiz = QUIZ_DATA.find((q) => q.step === quizStep);

  return (
    <div
      className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]"
      style={{ fontFamily: "var(--font-dm-sans),system-ui,sans-serif" }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 bg-[#f59e0b] rounded-sm" />
            <span
              className="text-[#1A1A1A] text-sm font-bold hidden sm:block"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              Operations Decoded
            </span>
          </a>
          <div className="flex-1 overflow-hidden">
            <JourneyMap currentStep={step} flashSaleDay={flashSaleDay} />
          </div>
          <button
            onClick={() => setGlossaryOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E4DD] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#D97706] hover:border-[#D97706]/40 transition-colors cursor-pointer"
          >
            <Info size={12} />
            <span className="hidden sm:inline">Glossary</span>
            <span className="text-[#D97706] text-[10px]">
              {glossary.filter((g) => g.unlocked).length}/{glossary.length}
            </span>
          </button>
        </div>
      </div>

      {/* Scene */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest mb-1">
            Interactive Module · Step {step}/7
          </p>
          <h1
            className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-syne),sans-serif" }}
          >
            Concrete Floors — {STEPS[step - 1].location}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            {SCENE_MAP[step]?.()}
          </motion.div>
        </AnimatePresence>

        {/* Mid-transition quiz overlay */}
        <AnimatePresence>
          {quizStep !== null && activeQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
              <div className="w-full max-w-md">
                <MicroQuiz
                  question={activeQuiz.question}
                  options={activeQuiz.options}
                  correctValue={activeQuiz.correctValue}
                  explanation={activeQuiz.explanation}
                  onDone={handleQuizDone}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Location header overlay */}
      <LocationHeaderOverlay
        visible={headerVisible}
        location={headerData.location}
        time={headerData.time}
        onDone={handleHeaderDone}
      />

      {/* Glossary drawer */}
      <GlossaryDrawer terms={glossary} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
