"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Info } from "lucide-react";

import {
  VENDORS, STEPS, INITIAL_GLOSSARY, QUANTITY_OPTIONS, URGENCY_OPTIONS, PO_ERRORS,
  addDays, todayStr, fmt,
} from "./constants";
import type { GameState } from "./types";

import { DialogueSequence } from "./characters";
import { JourneyMap } from "./journey-map";
import { SceneWrapper, LocationHeaderOverlay, sceneVariants } from "./scene-wrapper";
import {
  LearnMore, StockGauge, QuantitySelector, UrgencySelector,
  DocumentFlyAnimation, StampAnimation, CriteriaRanker, POErrorGame,
  ClipboardInspection,
} from "./interactions";
import { DragDropMatch }    from "./drag-drop-match";
import { TruckScene }       from "./truck-scene";
import { MicroQuiz }        from "./micro-quiz";
import { DynamicScorecard } from "./scorecard";

// ─── Shared props for every scene ─────────────────────────────────────────────

interface SceneProps {
  gs:              GameState;
  advance:         (n: number) => void;
  updateGs:        (p: Partial<GameState>) => void;
  unlockGlossary:  (i: number) => void;
  showToast:       (msg: string, type?: "success" | "warning" | "error") => void;
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
      className={`fixed top-6 right-4 z-[60] max-w-sm rounded-xl border shadow-xl overflow-hidden flex flex-col ${bg}`}
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
      {/* Progress bar */}
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
// SCENE COMPONENTS  (module-level — never redefined on parent re-render)
// ══════════════════════════════════════════════════════════════════════════════

// ─── Scene 1 — Purchase Requisition ──────────────────────────────────────────

function Scene1({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase]       = useState<"dialogue" | "gauge" | "form" | "flying" | "done">("dialogue");
  const [localQty, setLocalQty] = useState(gs.chosenQuantity);
  const [urgency, setUrgency]   = useState(gs.chosenUrgency);
  const [reason, setReason]     = useState(gs.prReason);
  const [flyDone, setFlyDone]   = useState(false);

  const dialogueLines = [
    { character: "marcus" as const, text: "The titanium dioxide bin at Station 4 is almost empty. Three days of supply left." },
    { character: "marcus" as const, text: "Lead time from Crestline is seven days. The math is not good. I need to raise a PR now." },
  ];

  const canSubmit = urgency.length > 0 && reason.trim().length >= 10;

  const handleSubmit = () => {
    updateGs({ chosenQuantity: localQty, chosenUrgency: urgency, prReason: reason });
    unlockGlossary(0);
    setPhase("flying");
  };

  const handleFlyDone = () => {
    showToast("PR submitted to Diana's inbox.", "success");
    setFlyDone(true);
    setTimeout(() => { setPhase("done"); advance(2); }, 600);
  };

  return (
    <SceneWrapper step={1}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("gauge")} />
      )}

      {phase === "gauge" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <StockGauge />
          <LearnMore title="What's a Purchase Requisition?">
            A PR is an internal request to buy something. It authorises the procurement team to source and commit funds — but on its own it&apos;s not a commitment to any vendor. Think of it as raising your hand before signing a cheque.
          </LearnMore>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("form")}
            className="self-start px-5 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Fill Out PR →
          </motion.button>
        </motion.div>
      )}

      {phase === "form" && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  Purchase Requisition
                </h3>
                <span className="text-[9px] font-bold text-[#9CA3AF] bg-[#F5F0E8] px-2 py-1 rounded">INTERNAL ONLY</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Item", "Titanium Dioxide"],
                  ["Department", "Production"],
                  ["Estimated Price", "$185 / kg"],
                  ["Required By", addDays(7)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{l}</p>
                    <div className="px-3 py-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg text-sm text-[#4B5563]">{v}</div>
                  </div>
                ))}
              </div>
              <QuantitySelector options={QUANTITY_OPTIONS} value={localQty} onChange={setLocalQty} vendorPrice={185} />
              <UrgencySelector options={URGENCY_OPTIONS} value={urgency} onChange={setUrgency} />
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
                  Reason <span className="text-red-500">*</span>
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Current stock critically low — 3 days remaining, 7-day lead time"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent resize-none placeholder:text-[#C4BDB5]"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[#FEF3C7] border border-[#f59e0b]/30 rounded-xl">
                <span className="text-xs font-semibold text-[#6B7280]">Estimated Total</span>
                <span className="text-lg font-black text-[#D97706]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  ${fmt(localQty * 185)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Submit PR to Diana →
            </motion.button>
          </div>
        </motion.div>
      )}

      {phase === "flying" && !flyDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">Sending PR to Diana&apos;s inbox…</p>
          <DocumentFlyAnimation label="PR" onDone={handleFlyDone} />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 2 — PR Approval ────────────────────────────────────────────────────

function Scene2({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase]           = useState<"dialogue" | "review" | "stamping" | "done">("dialogue");
  const [decision, setDecision]     = useState<"approve" | "note" | "reject" | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const dialogueLines = [
    { character: "diana" as const, text: "New PR from Marcus. Let me check the details before I sign off." },
    { character: "diana" as const, text: "The price is 7.6% above last quarter's average. And there's already an open order for TiO₂." },
  ];

  const handleDecision = (d: "approve" | "note" | "reject") => {
    setDecision(d);
    if (d === "reject") {
      setShowRejectModal(true);
      return;
    }
    updateGs({ approvalChoice: d });
    unlockGlossary(1);
    setPhase("stamping");
  };

  const handleStamped = () => {
    showToast("PR approved. Diana has authorised the search for a vendor.", "success");
    setTimeout(() => { setPhase("done"); advance(3); }, 900);
  };

  return (
    <SceneWrapper step={2}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("review")} />
      )}

      {phase === "review" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5 space-y-4">
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                PR from Marcus — {todayStr()}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  ["Raised By", "Marcus, Production"],
                  ["Item", "Titanium Dioxide"],
                  ["Quantity", `${fmt(gs.chosenQuantity)} kg`],
                  ["Est. Cost", `$${fmt(gs.chosenQuantity * 185)}`],
                  ["Urgency", URGENCY_OPTIONS.find((u) => u.value === gs.chosenUrgency)?.label ?? gs.chosenUrgency],
                  ["Required By", addDays(7)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide">{l}</p>
                    <p className="text-sm font-medium text-[#1A1A1A] mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              {gs.prReason && (
                <div className="pt-3 border-t border-[#E8E4DD]">
                  <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Reason</p>
                  <p className="text-sm text-[#4B5563]">{gs.prReason}</p>
                </div>
              )}
              <div className="pt-3 border-t border-[#E8E4DD]">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">Q3 Procurement Budget</p>
                <div className="h-2 bg-[#E8E4DD] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: "77%" }} transition={{ duration: 0.8 }}
                    className="h-full bg-[#f59e0b] rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#9CA3AF] mt-1">
                  <span>$2.4M spent</span><span>$3.1M total</span>
                </div>
              </div>
              <div className="bg-[#FEF3C7]/60 border border-[#f59e0b]/30 rounded-xl p-3">
                <p className="text-xs text-[#92400E]">
                  ⚠ Price benchmark: Last Q avg $172/kg · PR estimate $185/kg{" "}
                  <span className="font-bold">(+7.6%)</span>
                </p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Open order: 1 PO for TiO₂ — 500 kg arriving next week</p>
              </div>
            </div>
          </div>

          <LearnMore title="What does an approver check?">
            Budget headroom, open orders for the same item, price benchmarks against previous purchases, and whether the urgency justifies the cost. Diana is the company&apos;s financial gatekeeper at the pre-commit stage.
          </LearnMore>

          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { key: "approve", icon: "✅", label: "Approve as-is",          sub: "Trust Marcus's assessment, proceed at $185/kg" },
              { key: "note",    icon: "⚠️", label: "Approve with note",       sub: "Proceed but flag the price variance for negotiation" },
              { key: "reject",  icon: "❌", label: "Send back for revision",  sub: "Ask Marcus to get a competing quote first" },
            ].map((opt) => (
              <motion.button
                key={opt.key}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 340, damping: 26 } } }}
                whileHover={{ x: 6, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDecision(opt.key as "approve" | "note" | "reject")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#E8E4DD] rounded-xl cursor-pointer hover:border-[#D97706]/40 transition-colors text-left"
              >
                <motion.span
                  className="text-xl flex-shrink-0"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                >
                  {opt.icon}
                </motion.span>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{opt.sub}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {phase === "stamping" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Diana approves the PR.</p>
          <StampAnimation text="APPROVED" color="#16a34a" onStamped={handleStamped} />
        </motion.div>
      )}

      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowRejectModal(false); setDecision(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-[#E8E4DD] p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-[#D97706]" />
                <h3 className="font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  Diana&apos;s Feedback
                </h3>
              </div>
              <div className="border-l-4 border-[#f59e0b] bg-[#FFFDF5] rounded-r-xl p-4 mb-4">
                <p className="text-sm text-[#4B5563] italic">
                  &quot;Estimated price of $185/kg is above last quarter&apos;s benchmark. Please verify with at least one alternate quote before I approve.&quot;
                </p>
              </div>
              <p className="text-xs font-semibold text-[#6B7280] mb-2">PRs are typically rejected for:</p>
              <ol className="text-xs text-[#4B5563] space-y-1 mb-5 list-decimal list-inside">
                <li>Price seems off — no benchmark provided</li>
                <li>Budget exhausted for the category</li>
                <li>Wrong department or approver tagged</li>
              </ol>
              <button
                onClick={() => { setShowRejectModal(false); setDecision(null); setPhase("dialogue"); }}
                className="w-full py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
              >
                Revise and Resubmit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneWrapper>
  );
}

// ─── Scene 3 — Vendor Selection ───────────────────────────────────────────────

function Scene3({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase]           = useState<"dialogue" | "rank" | "select" | "done">("dialogue");
  const [ranking, setRanking]       = useState<string[]>(gs.criteriaRanking);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const dialogueLines = [
    { character: "diana" as const, text: "Three vendors in the system for titanium dioxide. Price matters — but it's not everything." },
    { character: "diana" as const, text: "Note: Crestline had a minor quality recall last week. Batch #B2024-0891, investigation ongoing." },
  ];

  const handleVendorSelect = (idx: number) => {
    setSelectedIdx(idx);
    const v = VENDORS[idx];
    updateGs({ selectedVendorIdx: idx, criteriaRanking: ranking });
    unlockGlossary(2);
    if (v.warning) {
      showToast(v.warning, "warning");
      setTimeout(() => { setPhase("done"); advance(4); }, 1800);
    } else {
      showToast(`${v.name} selected.`, "success");
      setTimeout(() => { setPhase("done"); advance(4); }, 800);
    }
  };

  return (
    <SceneWrapper step={3}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("rank")} />
      )}

      {(phase === "rank" || phase === "select" || phase === "done") && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-start gap-2 p-3 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl">
            <AlertTriangle size={14} className="text-[#D97706] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#92400E]">
              <span className="font-bold">Recall notice:</span> Crestline Materials — Batch #B2024-0891 under investigation (non-critical, cosmetic grade only). Ongoing.
            </p>
          </div>

          <CriteriaRanker ranking={ranking} onChange={setRanking} />

          <LearnMore title="Why does vendor selection matter?">
            A bad vendor choice costs more than money — it costs time, quality, and credibility. The cheapest option isn&apos;t always the right one, especially for critical raw materials on a tight timeline.
          </LearnMore>

          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Select a vendor to proceed</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {VENDORS.map((v, i) => {
                const sel = selectedIdx === i;
                const anySelected = selectedIdx !== null;
                return (
                  <motion.div
                    key={v.name}
                    animate={{
                      scale: sel ? 1.04 : anySelected ? 0.97 : 1,
                      opacity: anySelected && !sel ? 0.6 : 1,
                      boxShadow: sel
                        ? "0 8px 28px rgba(245,158,11,0.28)"
                        : "0 1px 4px rgba(0,0,0,0.07)",
                    }}
                    whileHover={{ y: anySelected ? 0 : -4, scale: sel ? 1.04 : anySelected ? 0.97 : 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 360, damping: 26 }}
                    onClick={() => handleVendorSelect(i)}
                    className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer ${
                      sel ? "border-[#f59e0b]" : "border-[#E8E4DD] hover:border-[#D97706]/40"
                    }`}
                  >
                    {/* Selected checkmark overlay */}
                    <AnimatePresence>
                      {sel && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 14 }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center shadow-md"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {v.recall && (
                      <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#f59e0b]/40 px-1.5 py-0.5 rounded-full">
                        ⚠ Recall
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-[#1A1A1A] leading-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                        {v.name}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${v.tagColor}`}>{v.tag}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-[#6B7280]">Unit Price</span>
                        <span className="text-xs font-bold text-[#1A1A1A]">${v.price}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-[#6B7280]">Lead Time</span>
                        <span className="text-xs font-semibold text-[#1A1A1A]">{v.lead} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-[#6B7280]">Total ({fmt(gs.chosenQuantity)} kg)</span>
                        <span className="text-xs font-bold text-[#D97706]">${fmt(v.price * gs.chosenQuantity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <span key={si} className={`text-xs ${si < v.stars ? "text-[#f59e0b]" : "text-[#E8E4DD]"}`}>★</span>
                      ))}
                      <span className="text-[9px] text-[#9CA3AF] ml-1">{v.rating}</span>
                    </div>
                    <p className="text-[9px] text-[#9CA3AF] leading-relaxed">{v.track}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 4 — Purchase Order ─────────────────────────────────────────────────

function Scene4({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const vendor = gs.selectedVendorIdx !== null ? VENDORS[gs.selectedVendorIdx] : null;
  if (!vendor) return null;

  const [phase, setPhase]       = useState<"dialogue" | "errors" | "flying" | "acknowledged" | "done">("dialogue");
  const [errorsFound, setErrors] = useState(gs.poErrorsFound);
  const [allFixed, setAllFixed] = useState(false);
  const [flyDone, setFlyDone]   = useState(false);

  const dialogueLines = [
    { character: "diana" as const, text: "A PO is legally binding. Once Crestline acknowledges it, both sides are committed. Review it carefully." },
    { character: "diana" as const, text: "I've spotted a few issues in this draft. Can you catch them before we send?" },
  ];

  const poFields = [
    { key: "item",            label: "Item",             value: "Titanium Dioxide — Industrial Grade", isError: false, wrongVal: "", correctVal: "" },
    { key: "quantity",        label: "Quantity",         value: `${fmt(gs.chosenQuantity)} kg`, isError: false, wrongVal: "", correctVal: "" },
    { key: "unitOfMeasure",   label: "Unit of Measure",  value: "liters",          isError: true, wrongVal: "liters", correctVal: "kg" },
    { key: "unitPrice",       label: "Unit Price",       value: `$${vendor.price}/kg`, isError: false, wrongVal: "", correctVal: "" },
    { key: "deliveryAddress", label: "Delivery Address", value: "Receiving Bay 5", isError: true, wrongVal: "Receiving Bay 5", correctVal: "Receiving Bay 3" },
    { key: "paymentTerms",    label: "Payment Terms",    value: "(blank)",         isError: true, wrongVal: "(blank)", correctVal: "Net 30" },
    { key: "deliveryDate",    label: "Required By",      value: addDays(vendor.lead), isError: false, wrongVal: "", correctVal: "" },
  ];

  const handleFlyDone = () => {
    setFlyDone(true);
    setPhase("acknowledged");
    showToast(`PO acknowledged by Leon at ${vendor.name}.`, "success");
  };

  return (
    <SceneWrapper step={4}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("errors")} />
      )}

      {phase === "errors" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <POErrorGame
            poFields={poFields}
            errors={PO_ERRORS}
            onErrorsFound={(n) => { setErrors(n); updateGs({ poErrorsFound: n }); }}
            onAllFound={() => setAllFixed(true)}
          />
          <LearnMore title="Why does a PO matter legally?">
            Unlike a PR (internal), a PO is an external document. Once accepted by the vendor, it forms a binding contract — the quantity, price, and delivery date all carry legal weight.
          </LearnMore>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!allFixed) { showToast(`${3 - errorsFound} error${3 - errorsFound !== 1 ? "s" : ""} still uncorrected. Review carefully.`, "warning"); return; }
                unlockGlossary(3);
                setPhase("flying");
              }}
              className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors flex items-center gap-2"
            >
              Send PO to {vendor.name} →
            </motion.button>
          </div>
        </motion.div>
      )}

      {phase === "flying" && !flyDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">Sending PO to {vendor.name}…</p>
          <DocumentFlyAnimation label="PO" onDone={handleFlyDone} />
        </motion.div>
      )}

      {phase === "acknowledged" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <DialogueSequence
            lines={[
              { character: "leon" as const, text: `PO received. 2,000 kg of titanium dioxide for Nexara — we'll have it ready by ${addDays(vendor.lead)}.` },
              { character: "leon" as const, text: "I'll send you a dispatch confirmation once it leaves our warehouse. Thanks for the order." },
            ]}
            onComplete={() => advance(5)}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 5 — Goods Receipt ──────────────────────────────────────────────────

function Scene5({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const [phase, setPhase] = useState<"dialogue" | "truck" | "inspect" | "done">("dialogue");

  const dialogueLines = [
    { character: "marcus" as const, text: "Crestline's truck just pulled into Receiving Bay 3. Seven days exactly." },
    { character: "marcus" as const, text: "Don't just wave it through. Count the bags. Check the cert. This is how we protect ourselves." },
  ];

  return (
    <SceneWrapper step={5}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("truck")} />
      )}

      {phase === "truck" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <TruckScene onUnloaded={() => setPhase("inspect")} />
        </motion.div>
      )}

      {phase === "inspect" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <LearnMore title="What's a Goods Receipt Note (GRN)?">
            A GRN is your proof that goods were physically received and verified. Without it, you can&apos;t complete the 3-way match in the next step — and you can&apos;t authorise payment. It&apos;s the company&apos;s protection against paying for things never received.
          </LearnMore>
          <ClipboardInspection
            poQty={gs.chosenQuantity}
            onComplete={(result) => {
              updateGs({ grnQuantityReceived: result.qty });
              unlockGlossary(4);
              showToast(`GRN raised — ${fmt(result.qty)} kg confirmed.`, "success");
              setTimeout(() => advance(6), 1000);
            }}
          />
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 6 — 3-Way Match ────────────────────────────────────────────────────

function Scene6({ gs, advance, updateGs, unlockGlossary, showToast }: SceneProps) {
  const vendor = gs.selectedVendorIdx !== null ? VENDORS[gs.selectedVendorIdx] : null;
  if (!vendor) return null;

  const [phase, setPhase]     = useState<"dialogue" | "match" | "done">("dialogue");
  const [matched, setMatched] = useState(false);

  const dialogueLines = [
    { character: "diana" as const, text: `${vendor.name}'s invoice just arrived. Time to run the 3-way match.` },
    { character: "diana" as const, text: "Does the invoice match what we ordered and what we actually received? That's the question." },
  ];

  return (
    <SceneWrapper step={6}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("match")} />
      )}

      {(phase === "match" || phase === "done") && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <LearnMore title="How does 3-way matching work?">
            You compare three documents: the Purchase Order (what you agreed to pay), the GRN (what you actually received), and the Invoice (what the vendor is asking to be paid). All three must align — quantity, price, and vendor — before any payment is released.
          </LearnMore>
          <DragDropMatch
            vendor={vendor.name}
            vendorPrice={vendor.price}
            grnQty={gs.grnQuantityReceived}
            poQty={gs.chosenQuantity}
            onMatchComplete={(success) => {
              setMatched(true);
              unlockGlossary(5);
              unlockGlossary(6);
              if (success) {
                showToast("3-way match passed. Invoice approved for payment queue.", "success");
              } else {
                showToast(
                  `Quantity mismatch flagged. Invoice on hold for ${fmt(gs.chosenQuantity - gs.grnQuantityReceived)} kg discrepancy.`,
                  "warning",
                );
              }
            }}
          />
          {matched && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
              <button
                onClick={() => advance(7)}
                className="px-6 py-2.5 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
              >
                Proceed to Payment →
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </SceneWrapper>
  );
}

// ─── Scene 7 — Payment ────────────────────────────────────────────────────────

interface Scene7Props extends SceneProps {
  restart:         () => void;
  setGlossaryOpen: (v: boolean) => void;
}

function Scene7({ gs, advance, updateGs, unlockGlossary, showToast, restart, setGlossaryOpen }: Scene7Props) {
  const vendor = gs.selectedVendorIdx !== null ? VENDORS[gs.selectedVendorIdx] : null;
  if (!vendor) return null;

  const [phase, setPhase] = useState<"dialogue" | "stamp" | "complete">("dialogue");
  const total = vendor.price * gs.grnQuantityReceived;

  const dialogueLines = [
    { character: "diana" as const, text: "3-way match cleared. It's Day 30 — payment terms are up." },
    { character: "diana" as const, text: "Think about everything that had to happen before this one bank transfer. PR → PO → GRN → Match → Payment." },
  ];

  return (
    <SceneWrapper step={7}>
      {phase === "dialogue" && (
        <DialogueSequence lines={dialogueLines} onComplete={() => setPhase("stamp")} />
      )}

      {phase === "stamp" && (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            <div className="p-5">
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider mb-4">Payment Summary</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {[
                  ["Vendor", vendor.name],
                  ["Invoice Ref", "INV-CL-8841"],
                  ["Payment Terms", "Net 30"],
                  ["Due Date", addDays(37)],
                  ["Method", "Bank Transfer"],
                  ["GRN Qty", `${fmt(gs.grnQuantityReceived)} kg`],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide">{l}</p>
                    <p className="text-sm font-medium text-[#1A1A1A] mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DD]">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">Total to Release</p>
                <p className="text-2xl font-black text-[#D97706]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  ${fmt(total)}
                </p>
              </div>
            </div>
          </div>

          <LearnMore title="What is Net 30?">
            Net 30 means payment is due 30 days after the invoice date. It&apos;s a common trade credit term. The vendor extends you 30 days of credit; you&apos;re expected to pay by then to maintain the relationship and avoid late payment charges.
          </LearnMore>

          <div className="flex flex-col items-center py-4">
            <StampAnimation
              text="PAID"
              color="#D97706"
              onStamped={() => {
                unlockGlossary(7);
                showToast(`$${fmt(total)} released to ${vendor.name}. Bank transfer initiated.`, "success");
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
    step: 1,
    question: "At this point, has Nexara committed to buying anything?",
    options: [
      { label: "Yes — the PR is a commitment", value: "yes" },
      { label: "No — it's an internal request",  value: "no" },
    ],
    correctValue: "no",
    explanation: "A PR is internal — no vendor is involved yet. It's a raised hand that requires approval before any commitment is made.",
  },
  {
    step: 3,
    question: "If Crestline delivers defective material, can Nexara return it based on vendor selection alone?",
    options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }],
    correctValue: "no",
    explanation: "Vendor selection isn't a contract. The PO is what creates legal obligations — terms, warranties, and recourse live in the PO.",
  },
  {
    step: 5,
    question: "The GRN shows 1,950 kg received. Can Crestline invoice for 2,000 kg?",
    options: [{ label: "They can try", value: "try" }, { label: "No way", value: "no" }],
    correctValue: "try",
    explanation: "They can invoice for anything — the 3-way match is what catches the discrepancy and blocks payment on the disputed quantity.",
  },
];

const TiO2_BY_STEP: Record<number, number | null> = {
  1: 3, 2: 3, 3: 2, 4: 1, 5: 0, 6: null, 7: null,
};

const INITIAL_STATE: GameState = {
  chosenQuantity:      2000,
  chosenUrgency:       "",
  criteriaRanking:     [],
  selectedVendorIdx:   null,
  poErrorsFound:       0,
  grnQuantityReceived: 2000,
  quizScore:           0,
  approvalChoice:      "",
  prReason:            "",
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function ProcureToPayPage() {
  // ── Navigation state ──
  const [step, setStep]               = useState(1);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [headerData, setHeaderData]   = useState({ location: "", time: "" });
  const [quizStep, setQuizStep]       = useState<number | null>(null);
  const pendingStep                   = useRef<number>(1);

  // ── Game state ──
  const [gs, setGs]           = useState<GameState>(INITIAL_STATE);
  const [glossary, setGlossary] = useState(INITIAL_GLOSSARY);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning" | "error" } | null>(null);
  // Toast auto-close is handled by the progress bar animation in the Toast component
  const showToast = useCallback((msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const updateGs = useCallback((patch: Partial<GameState>) => setGs((s) => ({ ...s, ...patch })), []);

  const unlockGlossary = useCallback((idx: number) =>
    setGlossary((g) => g.map((t, i) => (i === idx ? { ...t, unlocked: true } : t))), []);

  // ── localStorage persistence ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("p2p-progress");
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
      localStorage.setItem("p2p-progress", JSON.stringify({ step, gs, glossary }));
    } catch {}
  }, [step, gs, glossary]);

  // ── Glossary unlock notification ──
  const prevGlossaryRef = useRef<boolean[]>(INITIAL_GLOSSARY.map(() => false));
  useEffect(() => {
    glossary.forEach((term, i) => {
      if (term.unlocked && !prevGlossaryRef.current[i]) {
        prevGlossaryRef.current[i] = true;
        // Slight delay so the toast doesn't fire immediately on page load restore
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
    unlockGlossary(nextStep - 2 >= 0 ? nextStep - 2 : 0);
    setHeaderVisible(true);
    setTimeout(() => setHeaderVisible(false), 1100);
  }, [unlockGlossary]);

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
    try { localStorage.removeItem("p2p-progress"); } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  const tiO2 = TiO2_BY_STEP[step] ?? null;

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
            <JourneyMap currentStep={step} tiO2Days={tiO2} />
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
            Procure-to-Pay — {STEPS[step - 1].location}
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
