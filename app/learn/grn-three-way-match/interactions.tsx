"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { PO_FIELDS, CONFIG_OPTIONS, DISPUTE_OPTIONS, THREE_WAY_DATA, fmt } from "./constants";

// ─── Re-exports from P2P ──────────────────────────────────────────────────────
export { LearnMore, DocumentFlyAnimation, StampAnimation } from "../procure-to-pay/interactions";

// ─── POBuilder ────────────────────────────────────────────────────────────────

interface POBuilderProps {
  onComplete: (configCode: string, hasSpecialInstruction: boolean) => void;
}

export function POBuilder({ onComplete }: POBuilderProps) {
  const [config, setConfig] = useState("");
  const [qty, setQty] = useState("");
  const [specialInstruction, setSpecialInstruction] = useState(false);
  const [instructionAdded, setInstructionAdded] = useState(false);
  const [completed, setCompleted] = useState(false);

  const canComplete = config === "CT-T14-i7-16-512-W11P" && qty === "150";

  const handleAddInstruction = useCallback(() => {
    setSpecialInstruction(true);
    setInstructionAdded(true);
  }, []);

  const handleComplete = useCallback(() => {
    setCompleted(true);
    onComplete(config, specialInstruction);
  }, [config, specialInstruction, onComplete]);

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6]" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              Purchase Order
            </h3>
            <p className="text-[9px] text-[#9CA3AF] mt-0.5">PO# 2024-3175 — CoreTech Supplies</p>
          </div>
          <span className="text-[9px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-1 rounded border border-blue-200">DRAFT</span>
        </div>

        <div className="space-y-3">
          {PO_FIELDS.map((field) => (
            <div key={field.key}>
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
                {field.label}
                {!field.locked && <span className="text-red-400 ml-0.5">*</span>}
              </p>
              {field.locked ? (
                <div className="px-3 py-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg text-sm text-[#6B7280]">
                  {field.correct}
                </div>
              ) : field.isSelect ? (
                <div className="relative">
                  <select
                    value={config}
                    onChange={(e) => setConfig(e.target.value)}
                    disabled={completed}
                    suppressHydrationWarning
                    className={`w-full px-3 py-2 border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-colors ${
                      config === "CT-T14-i7-16-512-W11P"
                        ? "border-green-400 bg-green-50 text-green-800"
                        : config
                        ? "border-red-300 bg-red-50 text-red-800"
                        : "border-[#E8E4DD] bg-white text-[#6B7280]"
                    }`}
                  >
                    <option value="">Select config code…</option>
                    {CONFIG_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                </div>
              ) : (
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder={field.placeholder}
                  disabled={completed}
                  suppressHydrationWarning
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-colors ${
                    qty === "150"
                      ? "border-green-400 bg-green-50 text-green-800"
                      : qty
                      ? "border-red-300 bg-red-50 text-red-800"
                      : "border-[#E8E4DD] bg-white"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Special instruction */}
        <div className="pt-3 border-t border-[#E8E4DD]">
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Special Instructions</p>
          {!instructionAdded ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddInstruction}
              suppressHydrationWarning
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#E8E4DD] rounded-xl text-xs text-[#9CA3AF] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors cursor-pointer w-full"
            >
              <span className="text-base">+</span>
              Add specification enforcement clause
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-sm mt-0.5">✓</span>
                  <div>
                    <p className="text-xs font-semibold text-green-800 mb-0.5">Clause Added</p>
                    <p className="text-xs text-green-700 italic leading-relaxed">
                      &quot;All units must match configuration code exactly. Partial substitutions will not be accepted.&quot;
                    </p>
                    <p className="text-[10px] text-green-600 mt-1.5">
                      This removes vendor ambiguity and gives legal grounds to reject wrong specs.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Total */}
        {qty === "150" && config && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-4 py-3 bg-[#EFF6FF] border border-blue-200 rounded-xl"
          >
            <span className="text-xs font-semibold text-[#6B7280]">Order Total</span>
            <span className="text-lg font-black text-[#1D4ED8]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              ${fmt(150 * 685)}
            </span>
          </motion.div>
        )}

        {/* Complete button */}
        <AnimatePresence>
          {canComplete && !completed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                suppressHydrationWarning
                className="w-full px-5 py-2.5 bg-[#1D4ED8] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2"
              >
                Complete PO →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed state */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <span className="text-xl">✓</span>
            <div>
              <p className="text-xs font-bold text-green-800">PO# 2024-3175 Created</p>
              <p className="text-[10px] text-green-700">Sent to CoreTech Supplies (Stefan Vogt)</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── BarcodeScanGame ──────────────────────────────────────────────────────────

interface BarcodeScanGameProps {
  onScanComplete: (result: { correct: number; wrong: number }) => void;
}

interface PalletState {
  id: number;
  label: string;
  units: number;
  scanned: boolean;
  scanning: boolean;
  results: ("correct" | "wrong" | null)[];
}

export function BarcodeScanGame({ onScanComplete }: BarcodeScanGameProps) {
  const [pallets, setPallets] = useState<PalletState[]>([
    { id: 1, label: "Pallet 1", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
    { id: 2, label: "Pallet 2", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
    { id: 3, label: "Pallet 3", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
    { id: 4, label: "Pallet 4", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
    { id: 5, label: "Pallet 5", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
    { id: 6, label: "Pallet 6", units: 25, scanned: false, scanning: false, results: Array(25).fill(null) },
  ]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const scanTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scanPallet = useCallback((palletId: number) => {
    const pallet = pallets.find((p) => p.id === palletId);
    if (!pallet || pallet.scanned || pallet.scanning) return;

    // Mark scanning
    setPallets((prev) =>
      prev.map((p) => (p.id === palletId ? { ...p, scanning: true } : p))
    );

    const isMismatchPallet = palletId === 5;
    const correctInThis = isMismatchPallet ? 13 : 25;
    const wrongInThis = isMismatchPallet ? 12 : 0;

    // Animate units one by one
    for (let i = 0; i < 25; i++) {
      const delay = i * 60;
      const t = setTimeout(() => {
        const result: "correct" | "wrong" = isMismatchPallet && i >= 13 ? "wrong" : "correct";
        setPallets((prev) =>
          prev.map((p) => {
            if (p.id !== palletId) return p;
            const newResults = [...p.results];
            newResults[i] = result;
            return { ...p, results: newResults };
          })
        );

        // Last unit
        if (i === 24) {
          const doneTimer = setTimeout(() => {
            setPallets((prev) =>
              prev.map((p) => (p.id === palletId ? { ...p, scanned: true, scanning: false } : p))
            );
            setTotalCorrect((c) => {
              const newC = c + correctInThis;
              setTotalWrong((w) => {
                const newW = w + wrongInThis;
                // Check if all pallets done
                setPallets((prev) => {
                  const allScanned = prev.every((p) => p.id === palletId ? true : p.scanned);
                  if (allScanned && !allDone) {
                    setAllDone(true);
                    setTimeout(() => onScanComplete({ correct: newC, wrong: newW }), 400);
                  }
                  return prev;
                });
                return newW;
              });
              return newC;
            });
          }, 100);
          scanTimers.current.push(doneTimer);
        }
      }, delay);
      scanTimers.current.push(t);
    }
  }, [pallets, allDone, onScanComplete]);

  const scannedCount = pallets.filter((p) => p.scanned).length;

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#E8E4DD] rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-sm font-bold text-green-700">{totalCorrect} correct</span>
        </div>
        <div className="w-px h-4 bg-[#E8E4DD]" />
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-sm font-bold text-red-700">{totalWrong} wrong</span>
        </div>
        <div className="ml-auto text-xs text-[#9CA3AF]">{scannedCount}/6 pallets</div>
      </div>

      {/* Pallets grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {pallets.map((pallet) => {
          const isMismatch = pallet.id === 5 && pallet.scanned;
          return (
            <motion.div
              key={pallet.id}
              animate={{
                borderColor: isMismatch
                  ? "#ef4444"
                  : pallet.scanned
                  ? "#16a34a"
                  : pallet.scanning
                  ? "#f59e0b"
                  : "#E8E4DD",
              }}
              className="bg-white border-2 rounded-xl overflow-hidden"
            >
              <div className={`px-3 py-2 flex items-center justify-between ${
                isMismatch ? "bg-red-50" : pallet.scanned ? "bg-green-50" : "bg-[#FAFAF7]"
              }`}>
                <span className="text-xs font-bold text-[#1A1A1A]">{pallet.label}</span>
                <span className="text-[10px] text-[#9CA3AF]">25 units</span>
              </div>

              {/* Unit dots */}
              <div className="p-2.5">
                <div className="grid grid-cols-5 gap-0.5 mb-2.5">
                  {pallet.results.map((res, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: res !== null ? 1 : 0 }}
                      transition={{ delay: i * 0.02, type: "spring", stiffness: 400, damping: 14 }}
                      className={`w-4 h-4 rounded-sm ${
                        res === "correct" ? "bg-green-400" : res === "wrong" ? "bg-red-400" : "bg-[#F0EBE0]"
                      }`}
                    />
                  ))}
                </div>

                {/* Mismatch badge */}
                {isMismatch && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 text-center mb-2"
                  >
                    ⚠ MISMATCH: CT-T14-i5-8-256-W11P
                  </motion.div>
                )}

                {!pallet.scanned && !pallet.scanning && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scanPallet(pallet.id)}
                    suppressHydrationWarning
                    className="w-full px-2 py-1.5 bg-[#f59e0b] text-black text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#D97706] transition-colors"
                  >
                    Scan Pallet
                  </motion.button>
                )}
                {pallet.scanning && (
                  <div className="text-[10px] text-[#f59e0b] font-semibold text-center py-1">Scanning…</div>
                )}
                {pallet.scanned && !isMismatch && (
                  <div className="text-[10px] text-green-700 font-semibold text-center py-1">✓ 25/25 correct</div>
                )}
                {isMismatch && (
                  <div className="text-[10px] text-red-700 font-semibold text-center py-1">13 correct / 12 WRONG</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-4 bg-red-50 border-2 border-red-300 rounded-xl"
          >
            <p className="text-sm font-bold text-red-800 mb-1">⚠ DISCREPANCY DETECTED</p>
            <p className="text-xs text-red-700">
              138 correct (CT-T14-i7-16-512-W11P) | 12 wrong (CT-T14-i5-8-256-W11P) — Pallet 5, units 14–25
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GRNForm ──────────────────────────────────────────────────────────────────

interface GRNFormProps {
  onSubmit: (accepted: number, rejected: number) => void;
}

export function GRNForm({ onSubmit }: GRNFormProps) {
  const [delivered, setDelivered] = useState("");
  const [accepted, setAccepted] = useState("");
  const [rejected, setRejected] = useState("");
  const [reason, setReason] = useState("");
  const [quarantine, setQuarantine] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);

  const deliveredNum = parseInt(delivered) || 0;
  const acceptedNum = parseInt(accepted) || 0;
  const rejectedNum = parseInt(rejected) || 0;

  const sumOk = deliveredNum > 0 && acceptedNum + rejectedNum === deliveredNum;
  const valuesCorrect = deliveredNum === 150 && acceptedNum === 138 && rejectedNum === 12;
  const canSign = sumOk && reason !== "" && quarantine;

  const handleSign = useCallback(() => {
    if (!canSign) return;
    if (!valuesCorrect) {
      // Shake wrong fields
      if (deliveredNum !== 150) setShakeField("delivered");
      else if (acceptedNum !== 138) setShakeField("accepted");
      else if (rejectedNum !== 12) setShakeField("rejected");
      setTimeout(() => setShakeField(null), 500);
      return;
    }
    setSigned(true);
    onSubmit(138, 12);
  }, [canSign, valuesCorrect, deliveredNum, acceptedNum, rejectedNum, onSubmit]);

  const inputClass = (field: string, val: string, correct: string) => {
    const isWrong = shakeField === field;
    const isMatch = val === correct;
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-colors ${
      isMatch ? "border-green-400 bg-green-50 text-green-800" :
      val ? "border-[#E8E4DD] bg-white" :
      "border-[#E8E4DD] bg-white"
    } ${isWrong ? "border-red-400 bg-red-50" : ""}`;
  };

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1 bg-gradient-to-r from-[#B45309] to-[#D97706]" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              Goods Receipt Note
            </h3>
            <p className="text-[9px] text-[#9CA3AF] mt-0.5">GRN# WH-2024-0891 — Ref PO# 2024-3175</p>
          </div>
          {signed ? (
            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -8 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
              className="text-xs font-black text-red-600 border-2 border-red-500 px-2 py-1 rounded opacity-90 rotate-[-8deg]"
            >
              SIGNED
            </motion.span>
          ) : (
            <span className="text-[9px] font-bold text-[#B45309] bg-amber-50 px-2 py-1 rounded border border-amber-200">DRAFT</span>
          )}
        </div>

        {/* PO Reference — locked */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">PO Reference</p>
          <div className="px-3 py-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg text-sm text-[#6B7280]">
            2024-3175 (CoreTech Supplies)
          </div>
        </div>

        {/* Total Delivered */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
            Total Delivered <span className="text-red-400">*</span>
          </p>
          <motion.div
            animate={{ x: shakeField === "delivered" ? [-6, 6, -5, 5, -3, 0] : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <input
              type="number"
              value={delivered}
              onChange={(e) => setDelivered(e.target.value)}
              placeholder="e.g. 150"
              disabled={signed}
              suppressHydrationWarning
              className={inputClass("delivered", delivered, "150")}
            />
          </motion.div>
        </div>

        {/* Units Accepted */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
            Units Accepted <span className="text-red-400">*</span>
          </p>
          <motion.div
            animate={{ x: shakeField === "accepted" ? [-6, 6, -5, 5, -3, 0] : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <input
              type="number"
              value={accepted}
              onChange={(e) => setAccepted(e.target.value)}
              placeholder="e.g. 138"
              disabled={signed}
              suppressHydrationWarning
              className={inputClass("accepted", accepted, "138")}
            />
          </motion.div>
        </div>

        {/* Units Rejected */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
            Units Rejected <span className="text-red-400">*</span>
          </p>
          <motion.div
            animate={{ x: shakeField === "rejected" ? [-6, 6, -5, 5, -3, 0] : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <input
              type="number"
              value={rejected}
              onChange={(e) => setRejected(e.target.value)}
              placeholder="e.g. 12"
              disabled={signed}
              suppressHydrationWarning
              className={inputClass("rejected", rejected, "12")}
            />
          </motion.div>
        </div>

        {/* Validation sum */}
        {delivered && accepted && rejected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs px-3 py-1.5 rounded-lg ${
              sumOk ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {sumOk ? `✓ ${acceptedNum} + ${rejectedNum} = ${deliveredNum}` : `✗ ${acceptedNum} + ${rejectedNum} ≠ ${deliveredNum} — must total delivered units`}
          </motion.div>
        )}

        {/* Rejection Reason */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
            Rejection Reason <span className="text-red-400">*</span>
          </p>
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={signed}
              suppressHydrationWarning
              className="w-full px-3 py-2 border border-[#E8E4DD] rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white"
            >
              <option value="">Select reason…</option>
              <option value="wrong_config">Wrong configuration</option>
              <option value="damaged">Damaged</option>
              <option value="qty_short">Quantity short</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Quarantine checkbox */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Required Action</p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={quarantine}
              onChange={(e) => setQuarantine(e.target.checked)}
              disabled={signed}
              suppressHydrationWarning
              className="mt-0.5 w-4 h-4 rounded border-[#E8E4DD] accent-[#f59e0b] cursor-pointer"
            />
            <span className={`text-xs leading-relaxed ${quarantine ? "text-[#1A1A1A]" : "text-[#6B7280]"}`}>
              Segregate rejected units to quarantine bay 4B — prevent from entering inventory
            </span>
          </label>
          {quarantine && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden mt-2"
            >
              <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800">
                Quarantine area physically separates rejected goods from accepted inventory. Without this, 12 wrong laptops could accidentally be issued to Hartwell.
              </div>
            </motion.div>
          )}
        </div>

        {/* Sign button */}
        {!signed && (
          <motion.button
            whileHover={canSign ? { scale: 1.02 } : {}}
            whileTap={canSign ? { scale: 0.97 } : {}}
            onClick={handleSign}
            disabled={!canSign}
            suppressHydrationWarning
            className="w-full px-5 py-2.5 bg-[#B45309] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#92400E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sign GRN →
          </motion.button>
        )}

        {signed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl"
          >
            <p className="text-xs font-bold text-green-800">GRN# WH-2024-0891 — Signed by Otto Fischer</p>
            <p className="text-[10px] text-green-700 mt-0.5">138 accepted · 12 rejected (wrong config) · Quarantined to bay 4B</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── DisputeCall ──────────────────────────────────────────────────────────────

interface DisputeCallProps {
  onChoose: (key: string) => void;
}

export function DisputeCall({ onChoose }: DisputeCallProps) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [showResolution, setShowResolution] = useState(false);

  const handleChoose = useCallback((key: string) => {
    setChosen(key);
    setTimeout(() => setShowResolution(true), 600);
  }, []);

  const selectedOption = DISPUTE_OPTIONS.find((o) => o.key === chosen);

  const borderColor = (outcome: string) => {
    if (outcome === "good") return "border-green-400 bg-green-50";
    if (outcome === "bad") return "border-red-400 bg-red-50";
    return "border-amber-400 bg-amber-50";
  };

  const badgeColor = (outcome: string) => {
    if (outcome === "good") return "bg-green-100 text-green-800 border border-green-300";
    if (outcome === "bad") return "bg-red-100 text-red-800 border border-red-300";
    return "bg-amber-100 text-amber-800 border border-amber-300";
  };

  const outcomeLabel = (outcome: string) => {
    if (outcome === "good") return "Effective";
    if (outcome === "bad") return "Counterproductive";
    return "Neutral";
  };

  return (
    <div className="space-y-4">
      {!chosen && (
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            How do you approach Stefan?
          </p>
          <div className="space-y-3">
            {DISPUTE_OPTIONS.map((opt) => (
              <motion.button
                key={opt.key}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoose(opt.key)}
                suppressHydrationWarning
                className="w-full text-left px-4 py-4 bg-white border-2 border-[#E8E4DD] rounded-xl hover:border-[#f59e0b] transition-colors cursor-pointer group"
              >
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1 group-hover:text-[#D97706] transition-colors">
                  {opt.label}
                </p>
                <p className="text-xs text-[#6B7280] italic">{opt.sub}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {chosen && selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Chosen option */}
          <div className={`px-4 py-3 border-2 rounded-xl ${borderColor(selectedOption.outcome)}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-[#1A1A1A]">{selectedOption.label}</p>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor(selectedOption.outcome)}`}>
                {outcomeLabel(selectedOption.outcome)}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] italic mb-2">{selectedOption.sub}</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">{selectedOption.response}</p>
          </div>

          {/* Resolution card */}
          <AnimatePresence>
            {showResolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="px-4 py-4 bg-white border border-[#E8E4DD] rounded-xl">
                  <p className="text-xs font-bold text-[#1A1A1A] mb-3">Agreed Resolution (CoreTech, Stefan Vogt)</p>
                  <div className="space-y-2">
                    {[
                      "Replacement: 12 units (CT-T14-i7-16-512-W11P), 3 business days",
                      "Return pickup at CoreTech's cost — collection from bay 4B",
                      "Credit note CT-CN-4417: $8,220 (12 × $685) by EOD tomorrow",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="flex items-start gap-2 text-xs text-[#4B5563]"
                      >
                        <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                        {item}
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onChoose(chosen)}
                    suppressHydrationWarning
                    className="mt-4 w-full px-4 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
                  >
                    Document dispute →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ─── ThreeWayMatch ────────────────────────────────────────────────────────────

interface ThreeWayMatchProps {
  grnAccepted: number;
  onHoldInvoice: () => void;
  onMatchComplete: () => void;
}

type MatchPhase = "compare" | "held" | "credit" | "resolved" | "paid";

export function ThreeWayMatch({ grnAccepted, onHoldInvoice, onMatchComplete }: ThreeWayMatchProps) {
  const [phase, setPhase] = useState<MatchPhase>("compare");
  const [rowsRevealed, setRowsRevealed] = useState(0);

  const { po, grn, invoice, creditNote, netPayable } = THREE_WAY_DATA;

  const handleRevealRow = useCallback(() => {
    setRowsRevealed((r) => Math.min(r + 1, 3));
  }, []);

  const handleHold = useCallback(() => {
    setPhase("held");
    onHoldInvoice();
    setTimeout(() => setPhase("credit"), 800);
  }, [onHoldInvoice]);

  const handleApplyCredit = useCallback(() => {
    setPhase("resolved");
  }, []);

  const handleReleasePayment = useCallback(() => {
    setPhase("paid");
    onMatchComplete();
  }, [onMatchComplete]);

  const docCols = [
    {
      title: "Purchase Order",
      num: "PO# 2024-3175",
      color: "#1D4ED8",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      qty: phase === "resolved" || phase === "paid" ? `138 (partial)` : `${po.qty}`,
      spec: po.spec,
      unit: `$${po.unit}`,
      total: phase === "resolved" || phase === "paid" ? `$${fmt(netPayable)}` : `$${fmt(po.total)}`,
    },
    {
      title: "GRN",
      num: "GRN# WH-2024-0891",
      color: "#B45309",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      qty: `${grnAccepted > 0 ? grnAccepted : grn.accepted} accepted`,
      spec: grn.spec,
      unit: `$${po.unit}`,
      total: `$${fmt((grnAccepted > 0 ? grnAccepted : grn.accepted) * po.unit)}`,
    },
    {
      title: "Invoice",
      num: "CT-INV-88921",
      color: phase === "held" || phase === "credit" ? "#ef4444" : phase === "resolved" || phase === "paid" ? "#16a34a" : "#065F46",
      bgColor: phase === "held" || phase === "credit" ? "bg-red-50" : phase === "resolved" || phase === "paid" ? "bg-green-50" : "bg-emerald-50",
      borderColor: phase === "held" || phase === "credit" ? "border-red-200" : phase === "resolved" || phase === "paid" ? "border-green-200" : "border-emerald-200",
      qty: phase === "resolved" || phase === "paid" ? `138` : `${invoice.qty}`,
      spec: invoice.spec,
      unit: `$${invoice.unit}`,
      total: phase === "resolved" || phase === "paid" ? `$${fmt(netPayable)}` : `$${fmt(invoice.total)}`,
    },
  ];

  const rows = [
    { label: "Quantity", values: [docCols[0].qty, docCols[1].qty, docCols[2].qty], match: phase === "resolved" || phase === "paid" },
    { label: "Specification", values: [docCols[0].spec, "138 correct / 12 WRONG config", docCols[2].spec], match: false, specRow: true },
    { label: "Unit Price", values: [docCols[0].unit, docCols[1].unit, docCols[2].unit], match: true },
  ];

  return (
    <div className="space-y-4">
      {/* Document columns */}
      <div className="grid grid-cols-3 gap-2">
        {docCols.map((col, colIdx) => (
          <motion.div
            key={col.title}
            animate={{
              borderColor: col.color,
            }}
            className={`border-2 rounded-xl overflow-hidden ${col.bgColor} ${col.borderColor} relative`}
          >
            <div className="px-2 py-2 border-b border-[#E8E4DD]">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: col.color }}>
                {col.title}
              </p>
              <p className="text-[8px] text-[#9CA3AF]">{col.num}</p>
            </div>
            <div className="px-2 py-2 space-y-1.5">
              <div>
                <p className="text-[8px] text-[#9CA3AF]">Qty</p>
                <p className="text-[10px] font-bold text-[#1A1A1A]">{col.qty}</p>
              </div>
              <div>
                <p className="text-[8px] text-[#9CA3AF]">Spec</p>
                <p className="text-[8px] font-semibold text-[#1A1A1A] leading-tight break-all">{col.spec}</p>
              </div>
              <div>
                <p className="text-[8px] text-[#9CA3AF]">Unit $</p>
                <p className="text-[10px] font-bold text-[#1A1A1A]">{col.unit}</p>
              </div>
              <div className="pt-1 border-t border-[#E8E4DD]">
                <p className="text-[8px] text-[#9CA3AF]">Total</p>
                <p className="text-[11px] font-black" style={{ color: col.color }}>{col.total}</p>
              </div>
            </div>

            {/* HELD stamp */}
            {(phase === "held" || phase === "credit") && colIdx === 2 && (
              <motion.div
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: -15, opacity: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-lg font-black text-red-600 border-4 border-red-500 px-3 py-1 rounded rotate-[-15deg] bg-red-50/80">
                  HELD
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Row comparisons */}
      <div className="space-y-2">
        {rows.map((row, i) => {
          const isVisible = rowsRevealed > i;
          const isMismatch = !row.match && (phase === "compare" || phase === "held" || phase === "credit");
          const isMatch = row.match || (phase === "resolved" || phase === "paid");
          return (
            <AnimatePresence key={row.label}>
              {(isVisible || phase !== "compare") && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isMatch ? "bg-green-50 border-green-200" :
                    isMismatch ? "bg-red-50 border-red-200" :
                    "bg-[#FAFAF7] border-[#E8E4DD]"
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#6B7280] w-16 flex-shrink-0">{row.label}</span>
                  <div className="flex-1 flex items-center gap-1 flex-wrap">
                    {row.values.slice(0, 2).map((v, j) => (
                      <span key={j} className="text-[9px] text-[#4B5563] bg-white px-1.5 py-0.5 rounded border border-[#E8E4DD]">{v}</span>
                    ))}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isMatch ? "bg-green-200 text-green-800" :
                    isMismatch ? "bg-red-200 text-red-800" :
                    "bg-[#E8E4DD] text-[#6B7280]"
                  }`}>
                    {isMatch ? "✓ MATCH" : isMismatch ? "✗ MISMATCH" : "—"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {phase === "compare" && rowsRevealed < 3 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRevealRow}
            suppressHydrationWarning
            className="w-full px-4 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
          >
            Compare next row →
          </motion.button>
        )}

        {phase === "compare" && rowsRevealed === 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="px-3 py-3 bg-red-50 border border-red-300 rounded-xl">
              <p className="text-xs font-bold text-red-800 mb-1">⚠ 3-Way Match FAILS</p>
              <p className="text-xs text-red-700">Invoice claims 150 units. GRN confirms only 138 correct. Quantity and specification mismatches detected.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleHold}
              suppressHydrationWarning
              className="w-full px-4 py-3 bg-red-600 text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-red-700 transition-colors"
            >
              HOLD INVOICE
            </motion.button>
          </motion.div>
        )}

        {phase === "credit" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E8E4DD] rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 bg-[#ECFDF5] border-b border-green-200">
              <p className="text-xs font-bold text-green-800">Credit Note Received</p>
              <p className="text-[10px] text-green-700">CT-CN-4417 · CoreTech Supplies</p>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Quantity</span>
                <span className="font-bold text-[#1A1A1A]">12 units</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Unit price</span>
                <span className="font-bold text-[#1A1A1A]">$685.00</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-[#E8E4DD] pt-2">
                <span className="font-semibold text-[#6B7280]">Credit Amount</span>
                <span className="font-black text-green-700">-${fmt(creditNote.amount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#6B7280]">Invoice → Net Payable</span>
                <span className="font-black text-[#1D4ED8]">${fmt(netPayable)}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleApplyCredit}
                suppressHydrationWarning
                className="w-full px-4 py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-green-700 transition-colors mt-1"
              >
                Apply credit note →
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "resolved" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="px-3 py-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-xs font-bold text-green-800 mb-1">✓ 3-Way Match PASSES</p>
              <p className="text-xs text-green-700">
                PO (138 partial) = GRN (138 accepted) = Invoice (adjusted $94,530). All three documents agree.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReleasePayment}
              suppressHydrationWarning
              className="w-full px-4 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded-xl cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Release Partial Payment: ${fmt(netPayable)} →
            </motion.button>
          </motion.div>
        )}

        {phase === "paid" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <span className="text-xl">✓</span>
            <div>
              <p className="text-xs font-bold text-green-800">${fmt(netPayable)} released to CoreTech</p>
              <p className="text-[10px] text-green-700">Partial payment for 138 units · $8,220 held pending replacement</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── LearnMore (local export convenience) ────────────────────────────────────
// Already re-exported above from P2P. Keeping this comment for clarity.
