"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info } from "lucide-react";

import {
  VENDORS, STEPS, INITIAL_GLOSSARY, INITIAL_STATE, fmt,
} from "./constants";
import type { GameState, GlossaryTerm } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, LocationHeaderOverlay, sceneVariants } from "./scene-wrapper";
import {
  StockIndicator, RFQBuilder, QuoteCard, VendorScorecard,
  NegotiationChoice, ApprovalPanel, LearnMore,
} from "./interactions";
import { MicroQuiz } from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";
import { DocumentFlyAnimation, StampAnimation } from "../procure-to-pay/interactions";

// ─── Shared props for every scene ─────────────────────────────────────────────

interface SceneProps {
  gs:             GameState;
  advance:        (nextStep: number) => void;
  updateGs:       (patch: Partial<GameState>) => void;
  unlockGlossary: (idx: number) => void;
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
        <button onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0 cursor-pointer">
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

// ─── GlossaryDrawer ───────────────────────────────────────────────────────────

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
                <button onClick={onClose} className="p-1 text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer">
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

// ─── Scene 1 — Production Alert ──────────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"intro" | "brief" | "done">("intro");

  void gs; void updateGs; void showToast;

  const dialogueLines = [
    { character: "james" as const, text: "We're burning through palm oil faster than forecasted. Current stock covers nine production days. Need a PO raised for 40 metric tons by end of week." },
    { character: "james" as const, text: "No room for error — if the line stops, we lose the Greenfield Hotels contract." },
    { character: "sarah" as const, text: "Nine days sounds like breathing room. But subtract lead times, approvals, and receiving... we need to move fast. And move right." },
  ];

  return (
    <SceneWrapper step={1}>
      {phase === "intro" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("brief")} />
      )}

      {phase === "brief" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <StockIndicator />

          <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5 shadow-sm">
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Requirements</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Material", "RBD Palm Oil (food-grade)"],
                ["Quantity", "40 metric tons"],
                ["Max Lead Time", "≤ 14 calendar days"],
                ["Budget Range", "~$38,000 – $42,000"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[9px] text-[#9CA3AF] uppercase font-semibold tracking-wide">{l}</p>
                  <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <LearnMore title="Why send an RFQ to multiple vendors?">
            A single vendor quote gives you no leverage and no comparison. Three vendors creates competition — which drives better pricing, terms, and responsiveness. Two gives binary choice with no pressure. Four or more creates analysis paralysis on a time-sensitive purchase.
          </LearnMore>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { unlockGlossary(0); advance(2); }}
            suppressHydrationWarning
            className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Draft RFQ →
          </motion.button>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 2 — Write RFQ ─────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "build" | "flying" | "done">("dialogue");
  const [flyDone, setFlyDone] = useState(false);

  void gs;

  const dialogueLines = [
    { character: "sarah" as const, text: "A sloppy RFQ attracts sloppy quotes. I need to be precise about exactly what I'm buying, how it's packaged, when it arrives, and what certifications are required." },
    { character: "sarah" as const, text: "I'm sending this to three vendors. Two gives binary choice with no leverage. Four creates analysis paralysis. Three is right." },
  ];

  const handleRFQComplete = useCallback(() => {
    unlockGlossary(0);
    setPhase("flying");
  }, [unlockGlossary]);

  const handleFlyDone = useCallback(() => {
    setFlyDone(true);
    showToast("RFQ sent to 3 vendors. Waiting on responses.", "success");
    setTimeout(() => { setPhase("done"); advance(3); }, 700);
  }, [showToast, advance]);

  return (
    <SceneWrapper step={2}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("build")} />
      )}

      {phase === "build" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <RFQBuilder
            selected={gs.rfqItems}
            onChange={(items) => updateGs({ rfqItems: items })}
            onComplete={handleRFQComplete}
          />
        </motion.div>
      )}

      {phase === "flying" && !flyDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">Sending RFQ to 3 vendors…</p>
          <DocumentFlyAnimation label="RFQ" onDone={handleFlyDone} />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 3 — Quotes Received ───────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "quotes" | "done">("dialogue");
  const [viewedVendors, setViewedVendors] = useState<Set<number>>(new Set());
  const allViewed = viewedVendors.size >= 3;

  void gs; void updateGs; void showToast;

  useEffect(() => {
    if (phase === "quotes") {
      unlockGlossary(3); // Lead Time
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const dialogueLines = [
    { character: "sarah" as const, text: "Forty-eight hours. That's how long it took to get all three quotes back. The response time itself was data." },
    { character: "sarah" as const, text: "Marco from SunPalm: eighteen hours, complete. Anika from PureOil: twenty-two hours, mostly complete. David from GlobalFats: forty-seven hours, a single page." },
  ];

  const handleVendorSelect = (i: number) => {
    setViewedVendors((v) => new Set([...v, i]));
    if (viewedVendors.size + 1 >= 3) {
      unlockGlossary(2); // CoA
    }
  };

  return (
    <SceneWrapper step={3}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("quotes")} />
      )}

      {phase === "quotes" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wide mb-3">
            Click each quote to review — {viewedVendors.size}/3 reviewed
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VENDORS.map((v, i) => (
              <QuoteCard
                key={v.name}
                vendor={v}
                index={i}
                selected={viewedVendors.has(i)}
                onSelect={() => handleVendorSelect(i)}
              />
            ))}
          </div>

          <LearnMore title="What makes a strong vendor response?">
            A strong vendor response arrives quickly (under 24 hours for urgent orders), includes a complete Certificate of Analysis, provides references or delivery history, and quotes clearly. Response quality often predicts execution quality.
          </LearnMore>

          <AnimatePresence>
            {allViewed && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  suppressHydrationWarning
                  onClick={() => advance(4)}
                  className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
                >
                  Build Scorecard →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 4 — Score Vendors ─────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "score" | "done">("dialogue");

  void gs; void showToast;

  const dialogueLines = [
    { character: "sarah" as const, text: "Price is one column. An important column. But it sits alongside six others: quality consistency, delivery reliability, documentation completeness, communication speed, certifications, and risk profile." },
    { character: "sarah" as const, text: "The cheapest quote and the best quote are rarely the same thing." },
  ];

  const handleScorecardComplete = useCallback((selectedIdx: number) => {
    updateGs({ selectedVendorIdx: selectedIdx, scorecardComplete: true });
    unlockGlossary(1); // Vendor Evaluation Scorecard
    showToast("Scorecard complete. SunPalm is the recommended vendor.", "success");
    setTimeout(() => advance(5), 800);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={4}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("score")} />
      )}

      {phase === "score" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <VendorScorecard onComplete={handleScorecardComplete} />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 5 — Negotiate ─────────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "negotiate" | "done">("dialogue");

  void gs;

  const dialogueLines = [
    { character: "sarah" as const, text: "SunPalm's quality is why I'm calling first. But the CFO will look at this number, and a $41,600 total on a single raw material order gets scrutiny." },
    { character: "sarah" as const, text: "I'm not going to ask them to match the cheapest bid. I'm going to ask for a meaningful move." },
  ];

  const handleChoose = useCallback((key: string, price: number) => {
    updateGs({ negotiationChoice: key, finalPricePerTon: price });
    unlockGlossary(5); // Price Lock
    showToast(
      key === "reasonable"
        ? "Negotiation successful. $985/MT agreed. $2,200 saved."
        : key === "accept"
        ? "Original terms accepted. $1,040/MT."
        : "SunPalm couldn't match that price.",
      key === "reasonable" ? "success" : "warning"
    );
    setTimeout(() => advance(6), 1000);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={5}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("negotiate")} />
      )}

      {phase === "negotiate" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <NegotiationChoice onChoose={handleChoose} />
          <LearnMore title="What makes a good negotiation ask?">
            Effective negotiation acknowledges the vendor&apos;s position while creating legitimate commercial pressure. &quot;Match the cheapest&quot; is rarely viable — it undermines the vendor and damages the relationship. &quot;Come down meaningfully&quot; creates space for a real agreement both sides can commit to.
          </LearnMore>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 6 — Approvals ─────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "james" | "rachel" | "done">("dialogue");

  const dialogueLines = [
    { character: "sarah" as const, text: "Two approvals needed. James first — he's familiar with the operational context. Then Rachel, the CFO. Rachel asks hard questions. Good questions." },
    { character: "sarah" as const, text: "I'm bringing the scorecard." },
  ];

  const handleJamesApprove = useCallback(() => {
    updateGs({ jamesApproved: true });
    unlockGlossary(7); // Dual Approval Threshold
    showToast("James approved the purchase order.", "success");
    setTimeout(() => setPhase("rachel"), 600);
  }, [updateGs, unlockGlossary, showToast]);

  const handleRachelApprove = useCallback(() => {
    updateGs({
      rachelApproved: true,
      rachelAnswer1: "35800",
      rachelAnswer2: "scorecard",
    });
    unlockGlossary(6); // Supplier Risk Profile
    showToast("Rachel approved. Dual sign-off complete.", "success");
    setTimeout(() => advance(7), 800);
  }, [updateGs, unlockGlossary, showToast, advance]);

  return (
    <SceneWrapper step={6}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("james")} />
      )}

      {phase === "james" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <ApprovalPanel approver="james" onApprove={handleJamesApprove} gs={gs} />
        </motion.div>
      )}

      {phase === "rachel" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <ApprovalPanel approver="rachel" onApprove={handleRachelApprove} gs={gs} />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 7 — PO Raised ─────────────────────────────────────────────────────

interface Scene7Props extends SceneProps {
  restart: () => void;
  setGlossaryOpen: (v: boolean) => void;
}

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast, restart, setGlossaryOpen }: Scene7Props) {
  const [phase, setPhase] = useState<"dialogue" | "po" | "stamp" | "complete">("dialogue");

  void advance; void updateGs; void unlockGlossary;

  const finalPrice = gs.finalPricePerTon;
  const total = finalPrice * 40;
  const deliveryDays = gs.negotiationChoice === "reasonable" ? 9 : 10;

  const dialogueLines = [
    { character: "sarah" as const, text: "PO number 2024-0847. Forty metric tons of RBD palm oil. SunPalm Commodities. Nine calendar days. Net-30 terms. 120-day price lock." },
    { character: "marco" as const, text: "Order confirmed. Production scheduled. You'll have tracking details within 48 hours. Thanks for the business, Sarah." },
  ];

  return (
    <SceneWrapper step={7}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("po")} />
      )}

      {phase === "po" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Purchase Order</p>
                  <h3 className="text-lg font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>PO-2024-0847</h3>
                </div>
                <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#f59e0b]/40 rounded-full px-3 py-1">PENDING DISPATCH</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {[
                  ["Vendor", "SunPalm Commodities"],
                  ["Contact", "Marco DeSilva"],
                  ["Item", "RBD Palm Oil (food-grade)"],
                  ["Quantity", "40 metric tons"],
                  ["Unit Price", `$${fmt(finalPrice)}/MT`],
                  ["Payment Terms", "Net-30"],
                  ["Delivery", `${deliveryDays} calendar days`],
                  ["Price Lock", "120 days from PO date"],
                  ["Certifications", "RSPO + CoA required"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide">{l}</p>
                    <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DD]">
                <div>
                  <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide">Total Order Value</p>
                  <p className="text-2xl font-black text-[#D97706]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                    ${fmt(total)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-[#9CA3AF]">Approved by</p>
                  <p className="text-xs font-semibold text-[#1A1A1A]">J. Whitmore + R. Torres</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              suppressHydrationWarning
              onClick={() => setPhase("stamp")}
              className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Confirm and send PO →
            </motion.button>
          </div>
        </motion.div>
      )}

      {phase === "stamp" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex flex-col items-center py-4">
            <StampAnimation
              text="PO CONFIRMED"
              color="#065F46"
              onStamped={() => {
                showToast("PO 2024-0847 confirmed. SunPalm will deliver in " + deliveryDays + " days.", "success");
                setTimeout(() => setPhase("complete"), 900);
              }}
            />
          </div>
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
    step: 2,
    question: "What is the PRIMARY goal of sending an RFQ to 3 vendors instead of just 1?",
    options: [
      { label: "Get the absolute lowest price", value: "price" },
      { label: "Create competition and comparison", value: "compare" },
      { label: "Follow company policy", value: "policy" },
    ],
    correctValue: "compare",
    explanation: "Three vendors gives you comparison, competition, and leverage. You're not just hunting price — you're gathering data to make a better decision.",
  },
  {
    step: 4,
    question: "SunPalm is $3,600 more expensive than PureOil. Is recommending SunPalm the right call?",
    options: [
      { label: "No — always go cheapest", value: "no" },
      { label: "Yes — risk-adjusted cost favors SunPalm", value: "yes" },
    ],
    correctValue: "yes",
    explanation: "A $3,600 premium buys 24 months of verified quality and zero first-time-supplier risk on production-critical material. That's not expensive — it's cheap for what you get.",
  },
  {
    step: 6,
    question: "Why does this $39,400 order need BOTH James's AND Rachel's sign-off?",
    options: [
      { label: "Rachel is always involved in vendor decisions", value: "always" },
      { label: "It exceeds the $25,000 dual-approval threshold", value: "threshold" },
    ],
    correctValue: "threshold",
    explanation: "Dual-approval thresholds are a spend control. Above a set value, a second sign-off catches errors and prevents maverick spending.",
  },
];

const PALM_OIL_BY_STEP: Record<number, number | null> = {
  1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: null,
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function VendorComparisonPage() {
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
      const saved = localStorage.getItem("vendor-comparison-progress");
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
      localStorage.setItem("vendor-comparison-progress", JSON.stringify({ step, gs, glossary }));
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

  // ── Advance to next step ──
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
    try { localStorage.removeItem("vendor-comparison-progress"); } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  const palmOilDays = PALM_OIL_BY_STEP[step] ?? null;

  // ── Shared props ──
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
            <JourneyMap currentStep={step} palmOilDays={palmOilDays} />
          </div>
          <button
            suppressHydrationWarning
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
            Vendor Comparison — {STEPS[step - 1].location}
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
        location={headerData.location}
        time={headerData.time}
        visible={headerVisible}
        onDone={handleHeaderDone}
      />

      {/* Glossary drawer */}
      <GlossaryDrawer terms={glossary} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

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
    </div>
  );
}
