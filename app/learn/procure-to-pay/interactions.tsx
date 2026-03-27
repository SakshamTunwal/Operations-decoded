"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Info, CheckCircle2 } from "lucide-react";
import type { QuantityOption, UrgencyOption, POErrorField } from "./types";

// ─── LearnMore expandable ─────────────────────────────────────────────────────

export function LearnMore({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#D97706] transition-colors cursor-pointer group"
      >
        <Info size={11} className="group-hover:text-[#D97706]" />
        <span>{title}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg px-3 py-2.5 text-xs text-[#4B5563] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stock Gauge ──────────────────────────────────────────────────────────────

export function StockGauge() {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const level = 0.12; // 12% remaining – critical

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Station 4 — TiO₂ Stock</p>
      <div className="relative">
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Track */}
          <circle cx="65" cy="65" r={r} fill="none" stroke="#E8E4DD" strokeWidth="10" />
          {/* Level arc */}
          {/* Green full ring that depletes */}
          <motion.circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
            animate={{ strokeDashoffset: circ, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeIn", delay: 0.3 }}
          />
          {/* Red critical ring that appears */}
          <motion.circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
            animate={{ strokeDashoffset: circ * (1 - level) }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 1.5 }}
          />
          {/* Center */}
          <text x="65" y="60" textAnchor="middle" fontSize="18" fontWeight="800" fill="#ef4444" fontFamily="sans-serif">12%</text>
          <text x="65" y="76" textAnchor="middle" fontSize="9"  fill="#9CA3AF" fontFamily="sans-serif">remaining</text>
        </svg>
        {/* Pulsing danger ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-red-400"
        />
      </div>
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-semibold text-red-700">3 days of supply remaining</span>
      </div>
      <p className="text-[10px] text-[#9CA3AF]">Lead time from Crestline: 7 days</p>
    </div>
  );
}

// ─── Quantity Selector ────────────────────────────────────────────────────────

export function QuantitySelector({
  options,
  value,
  onChange,
  vendorPrice,
}: {
  options: QuantityOption[];
  value: number;
  onChange: (v: number) => void;
  vendorPrice: number;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
        How much should Nexara order?
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          const anySelected = value !== 0;
          return (
            <motion.button
              key={opt.value}
              animate={{
                scale: selected ? 1.03 : 1,
                opacity: anySelected && !selected ? 0.65 : 1,
                boxShadow: selected
                  ? "0 4px 16px rgba(245,158,11,0.25)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
              }}
              whileHover={{ y: -3, scale: selected ? 1.03 : 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              onClick={() => onChange(opt.value)}
              className={`relative p-3 rounded-xl border-2 text-left cursor-pointer ${
                selected
                  ? "border-[#f59e0b] bg-[#FEF3C7]"
                  : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
              }`}
            >
              {opt.recommended && (
                <motion.span
                  initial={{ scale: 0, y: -8, rotate: -12 }}
                  animate={{ scale: [0, 1.25, 1], y: 0, rotate: 0 }}
                  transition={{ type: "tween", duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
                  className="absolute -top-2.5 left-2 text-[9px] font-black bg-[#f59e0b] text-black px-2 py-0.5 rounded-full shadow-sm"
                >
                  ✦ BEST CHOICE
                </motion.span>
              )}
              <p className={`text-sm font-bold mb-0.5 ${selected ? "text-[#D97706]" : "text-[#1A1A1A]"}`}>
                {opt.label}
              </p>
              <p className="text-[10px] text-[#6B7280]">{opt.implication}</p>
              <p className="text-[10px] font-semibold text-[#9CA3AF] mt-1">
                ${(vendorPrice * opt.value).toLocaleString()}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Urgency Selector ─────────────────────────────────────────────────────────

export function UrgencySelector({
  options,
  value,
  onChange,
}: {
  options: UrgencyOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
        Urgency level
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              animate={{ scale: selected ? 1.06 : 1 }}
              whileHover={{ scale: selected ? 1.06 : 1.03, y: -1 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className={`px-4 py-2 rounded-full border-2 text-xs font-semibold cursor-pointer transition-colors ${
                selected
                  ? opt.color + " ring-2 ring-offset-2 ring-[#f59e0b]/60 font-bold shadow-sm"
                  : "border-[#E8E4DD] bg-white text-[#6B7280] hover:border-[#D1CBC2]"
              }`}
            >
              {opt.label}{" "}
              <span className="opacity-70">({opt.days})</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Document Fly Animation ───────────────────────────────────────────────────

export function DocumentFlyAnimation({
  label = "PR",
  onDone,
}: {
  label?: string;
  onDone: () => void;
}) {
  return (
    <div className="relative h-16 overflow-hidden pointer-events-none">
      {/* Ghost trails */}
      {[0.18, 0.32].map((opacity, ti) => (
        <motion.div
          key={ti}
          className="absolute top-3 w-10 h-12 bg-white border border-[#f59e0b]/40 rounded-lg shadow-sm"
          initial={{ left: "8%" }}
          animate={{ left: ["8%", "45%", "82%"] }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: ti * 0.04 }}
          style={{ opacity }}
        />
      ))}
      {/* Main document */}
      <motion.div
        className="absolute top-2"
        initial={{ left: "8%" }}
        animate={{
          left:   ["8%",  "50%", "85%"],
          top:    ["8px", "-6px", "8px"],
          rotate: [0, -6, 2, 0],
          scale:  [1, 0.88, 1],
        }}
        transition={{ duration: 0.95, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      >
        <div className="w-10 h-12 bg-white border-2 border-[#f59e0b] rounded-lg shadow-md flex flex-col items-center justify-center gap-0.5 p-1.5">
          <div className="w-full h-0.5 bg-[#f59e0b] rounded" />
          <div className="w-3/4 h-0.5 bg-[#E8E4DD] rounded" />
          <div className="w-full h-0.5 bg-[#E8E4DD] rounded" />
          <div className="w-2/3 h-0.5 bg-[#E8E4DD] rounded" />
          <p className="text-[7px] font-bold text-[#D97706] mt-0.5">{label}</p>
        </div>
      </motion.div>
      {/* Mailbox destination */}
      <div className="absolute right-[6%] top-3 flex flex-col items-center gap-1 opacity-60">
        <div className="w-10 h-8 bg-[#F5F0E8] border border-[#E8E4DD] rounded-lg flex items-center justify-center">
          <span className="text-sm">📥</span>
        </div>
        <p className="text-[8px] text-[#9CA3AF] font-medium">Inbox</p>
      </div>
    </div>
  );
}

// ─── Stamp Animation ──────────────────────────────────────────────────────────

export function StampAnimation({
  text,
  color = "#16a34a",
  onStamped,
}: {
  text: string;
  color?: string;
  onStamped: () => void;
}) {
  const [stamped, setStamped] = useState(false);
  const [inked, setInked] = useState(false);
  const [paperShake, setPaperShake] = useState(false);

  const handleStamp = () => {
    if (stamped) return;
    setStamped(true);
    setTimeout(() => {
      setInked(true);
      setPaperShake(true);
      onStamped();
      setTimeout(() => setPaperShake(false), 450);
    }, 380);
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Stamp tool */}
      <motion.div
        onClick={handleStamp}
        animate={
          stamped
            ? { y: [0, 64, -10, 2, 0], scaleY: [1, 0.80, 1.12, 1], rotate: [0, -3, 1, 0] }
            : { y: [0, -5, 0] }
        }
        transition={
          stamped
            ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        className={`cursor-pointer ${stamped ? "" : "hover:scale-105 transition-transform"}`}
        title="Click to stamp"
      >
        <div className="flex flex-col items-center gap-0">
          {/* Handle */}
          <div className="w-14 h-10 rounded-t-xl bg-[#374151] flex items-center justify-center shadow-md">
            <div className="w-6 h-1.5 bg-[#4B5563] rounded" />
          </div>
          {/* Base */}
          <div
            className="w-20 h-7 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: color, opacity: 0.9 }}
          >
            <p className="text-white text-[10px] font-black tracking-[0.15em]">{text}</p>
          </div>
        </div>
      </motion.div>

      {/* Document card that gets stamped */}
      <motion.div
        animate={paperShake ? { x: [-5, 5, -4, 4, -2, 2, 0], y: [0, -2, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="relative w-56 h-32 bg-white border border-[#E8E4DD] rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center gap-2 p-4"
      >
        <div className="w-full h-0.5 bg-[#E8E4DD]" />
        <p className="text-xs text-[#9CA3AF]">Click the stamp above</p>
        <div className="w-3/4 h-0.5 bg-[#E8E4DD]" />

        {/* Ink overlay */}
        <AnimatePresence>
          {inked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="px-5 py-2.5 border-4 rounded-lg"
                style={{ borderColor: color, color }}
              >
                <p
                  className="text-xl font-black tracking-widest"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {!stamped ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
            className="text-xs text-[#9CA3AF]"
          >
            ↑ Click the stamp to proceed
          </motion.p>
        ) : (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-semibold text-green-600"
          >
            ✓ Stamped!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Criteria Ranker ──────────────────────────────────────────────────────────

const CRITERIA = [
  { id: "reliability", label: "Reliability", icon: "⭐", desc: "Track record & quality" },
  { id: "price",       label: "Price",       icon: "💰", desc: "Unit cost & total value" },
  { id: "speed",       label: "Speed",       icon: "⚡", desc: "Lead time & delivery" },
];

export function CriteriaRanker({
  ranking,
  onChange,
}: {
  ranking: string[];
  onChange: (r: string[]) => void;
}) {
  const handleClick = (id: string) => {
    if (ranking.includes(id)) {
      onChange(ranking.filter((r) => r !== id));
    } else if (ranking.length < 3) {
      onChange([...ranking, id]);
    }
  };

  const reset = () => onChange([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          What matters most? Click in priority order (1st → 3rd)
        </p>
        {ranking.length > 0 && (
          <button onClick={reset} className="text-xs text-[#9CA3AF] hover:text-[#D97706] transition-colors cursor-pointer">
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {CRITERIA.map((c) => {
          const rank = ranking.indexOf(c.id) + 1;
          const selected = rank > 0;
          return (
            <motion.button
              key={c.id}
              animate={{
                scale: selected ? 1.04 : 1,
                boxShadow: selected ? "0 4px 14px rgba(245,158,11,0.22)" : "none",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              onClick={() => handleClick(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer ${
                selected
                  ? "border-[#f59e0b] bg-[#FEF3C7]"
                  : ranking.length >= 3
                  ? "border-[#E8E4DD] bg-[#F5F0E8] opacity-50 cursor-not-allowed"
                  : "border-[#E8E4DD] bg-white hover:border-[#D97706]/40"
              }`}
            >
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.span
                    key={rank}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 600, damping: 14 }}
                    className="w-5 h-5 rounded-full bg-[#f59e0b] text-black text-[10px] font-black flex items-center justify-center flex-shrink-0"
                  >
                    {rank}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-base">{c.icon}</span>
              <div className="text-left">
                <p className={`text-xs font-semibold ${selected ? "text-[#D97706]" : "text-[#1A1A1A]"}`}>
                  {c.label}
                </p>
                <p className="text-[9px] text-[#9CA3AF]">{c.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      {ranking.length === 3 && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-[#D97706] font-semibold"
        >
          Priority set: {ranking.map((r) => CRITERIA.find((c) => c.id === r)?.label).join(" → ")}
        </motion.p>
      )}
    </div>
  );
}

// ─── PO Error Game ────────────────────────────────────────────────────────────

interface POField {
  key: string;
  label: string;
  value: string;
  isError: boolean;
  wrongVal: string;
  correctVal: string;
}

export function POErrorGame({
  poFields,
  errors,
  onErrorsFound,
  onAllFound,
}: {
  poFields: POField[];
  errors: POErrorField[];
  onErrorsFound: (count: number) => void;
  onAllFound: () => void;
}) {
  const [fieldStates, setFieldStates] = useState<Record<string, "idle" | "correct" | "error" | "fixed">>(
    () => Object.fromEntries(poFields.map((f) => [f.key, "idle"]))
  );
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [found, setFound] = useState(0);
  const [shakingKey, setShakingKey] = useState<string | null>(null);

  const handleFieldClick = (field: POField) => {
    if (fieldStates[field.key] !== "idle") return;
    if (field.isError) {
      setFieldStates((s) => ({ ...s, [field.key]: "error" }));
    } else {
      // Not an error — shake it to show it's correct
      setShakingKey(field.key);
      setTimeout(() => setShakingKey(null), 500);
      setFieldStates((s) => ({ ...s, [field.key]: "correct" }));
      setTimeout(() => setFieldStates((s) => ({ ...s, [field.key]: "idle" })), 1200);
    }
  };

  const handleCorrection = (field: POField, val: string) => {
    setCorrections((c) => ({ ...c, [field.key]: val }));
    if (val.toLowerCase() === field.correctVal.toLowerCase()) {
      setFieldStates((s) => ({ ...s, [field.key]: "fixed" }));
      const newFound = found + 1;
      setFound(newFound);
      onErrorsFound(newFound);
      if (newFound === errors.length) {
        setTimeout(onAllFound, 600);
      }
    }
  };

  const getBorderColor = (key: string) => {
    const s = fieldStates[key];
    if (s === "error")   return "border-red-400 bg-red-50";
    if (s === "correct") return "border-green-400 bg-green-50";
    if (s === "fixed")   return "border-green-400 bg-green-50";
    return "border-[#E8E4DD] bg-white hover:border-[#D97706]/40 cursor-pointer";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Click fields to inspect — find all errors
        </p>
        <motion.span
          key={found}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            found === errors.length ? "bg-green-100 text-green-700" : "bg-[#FEF3C7] text-[#D97706]"
          }`}
        >
          {found}/{errors.length} errors found
        </motion.span>
      </div>
      <div className="space-y-2">
        {poFields.map((field) => (
          <div key={field.key}>
            <motion.div
              onClick={() => handleFieldClick(field)}
              animate={
                shakingKey === field.key
                  ? { x: [-5, 5, -4, 4, -2, 0] }
                  : fieldStates[field.key] === "error"
                  ? { x: [-4, 4, -3, 3, -1, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-all duration-200 ${getBorderColor(field.key)}`}
            >
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-36 flex-shrink-0">
                {field.label}
              </span>
              <span className={`text-sm font-medium flex-1 ml-4 ${
                fieldStates[field.key] === "error" ? "text-red-600 line-through" :
                fieldStates[field.key] === "fixed" ? "text-green-700" : "text-[#1A1A1A]"
              }`}>
                {fieldStates[field.key] === "fixed" ? field.correctVal : field.value}
              </span>
              {fieldStates[field.key] === "correct" && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-lg">✓</motion.span>
              )}
              {fieldStates[field.key] === "fixed" && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 14 }}
                >
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                </motion.span>
              )}
            </motion.div>

            {/* Correction input */}
            <AnimatePresence>
              {fieldStates[field.key] === "error" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 ml-4 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-xs text-red-600 font-semibold">⚠ Error detected. What should it be?</span>
                    {field.key === "paymentTerms" ? (
                      <select
                        className="text-xs border border-red-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                        value={corrections[field.key] ?? ""}
                        onChange={(e) => handleCorrection(field, e.target.value)}
                      >
                        <option value="">Select…</option>
                        {["Net 30", "Net 60", "Net 15", "Immediate"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : field.key === "unitOfMeasure" ? (
                      <select
                        className="text-xs border border-red-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                        value={corrections[field.key] ?? ""}
                        onChange={(e) => handleCorrection(field, e.target.value)}
                      >
                        <option value="">Select…</option>
                        {["kg", "liters", "MT", "lbs"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : field.key === "deliveryAddress" ? (
                      <select
                        className="text-xs border border-red-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                        value={corrections[field.key] ?? ""}
                        onChange={(e) => handleCorrection(field, e.target.value)}
                      >
                        <option value="">Select bay…</option>
                        {["Receiving Bay 1", "Receiving Bay 2", "Receiving Bay 3", "Receiving Bay 4", "Receiving Bay 5"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={`e.g. ${field.correctVal}`}
                        className="text-xs border border-red-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                        value={corrections[field.key] ?? ""}
                        onChange={(e) => handleCorrection(field, e.target.value)}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Clipboard Inspection ─────────────────────────────────────────────────────

interface InspectionResult {
  damagedBag: boolean;
  qty: number;
  batchPurity: boolean;
  batchGrade: boolean;
}

export function ClipboardInspection({
  poQty,
  onComplete,
}: {
  poQty: number;
  onComplete: (result: InspectionResult) => void;
}) {
  const totalBags = poQty / 100; // 100 kg per bag
  const DAMAGED_BAG_IDX = 17; // bag index that's torn

  const [activeTab, setActiveTab] = useState<"bags" | "cert" | "summary">("bags");
  const [checkedBags, setCheckedBags] = useState<Set<number>>(new Set());
  const [damagedFlagged, setDamagedFlagged] = useState(false);
  const [certChecked, setCertChecked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const allBagsChecked = checkedBags.size === totalBags;
  const certFields = [
    { id: "purity", label: "Purity", value: "98.5%", spec: "≥98.0%", pass: true },
    { id: "grade",  label: "Grade",  value: "Industrial", spec: "Industrial", pass: true },
  ];
  const certDone = certChecked.size === certFields.length;

  const toggleBag = (idx: number) => {
    if (idx === DAMAGED_BAG_IDX && !damagedFlagged) setDamagedFlagged(true);
    setCheckedBags((s) => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  };

  const effectiveQty = damagedFlagged ? poQty - 100 : poQty;

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete({
      damagedBag: damagedFlagged,
      qty: effectiveQty,
      batchPurity: true,
      batchGrade: true,
    });
  };

  const tabs = ["bags", "cert", "summary"] as const;

  return (
    <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
      {/* Clipboard header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E4DD] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📋</span>
          <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Goods Inspection Clipboard
          </p>
        </div>
        <p className="text-xs text-[#9CA3AF]">PO-2024-0847</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8E4DD]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={tab === "cert" && !allBagsChecked || tab === "summary" && !certDone}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
              activeTab === tab
                ? "bg-white text-[#D97706] border-b-2 border-[#f59e0b]"
                : "bg-[#F5F0E8] text-[#9CA3AF] hover:text-[#6B7280] disabled:opacity-40"
            }`}
          >
            {tab === "bags" ? `Bag Count${allBagsChecked ? " ✓" : ""}` : tab === "cert" ? `Batch Cert${certDone ? " ✓" : ""}` : "Summary"}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* Bag count tab */}
        {activeTab === "bags" && (
          <div>
            <p className="text-xs text-[#6B7280] mb-3">
              Click each bag to count it. One bag may appear damaged — inspect carefully.
            </p>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              {Array.from({ length: totalBags }).map((_, i) => {
                const checked  = checkedBags.has(i);
                const isDamaged = i === DAMAGED_BAG_IDX;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleBag(i)}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-150 ${
                      checked
                        ? isDamaged
                          ? "border-red-400 bg-red-50"
                          : "border-green-400 bg-green-50"
                        : isDamaged
                        ? "border-dashed border-[#f59e0b] bg-[#FEF3C7]"
                        : "border-[#E8E4DD] bg-[#F5F0E8] hover:border-[#D97706]/40"
                    }`}
                  >
                    <span className="text-base">{isDamaged ? "📦" : "📦"}</span>
                    {isDamaged && !checked && (
                      <span className="text-[7px] text-[#D97706] font-bold">?</span>
                    )}
                    {checked && (
                      <span className="text-[8px] font-bold">{isDamaged ? "⚠" : "✓"}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-xs text-[#6B7280] mt-3">
              {checkedBags.size}/{totalBags} bags counted
              {damagedFlagged && " · 1 damaged bag flagged"}
            </p>
            {allBagsChecked && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTab("cert")}
                className="mt-3 px-4 py-2 bg-[#f59e0b] text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-[#D97706] transition-colors"
              >
                Next: Check Batch Certificate →
              </motion.button>
            )}
          </div>
        )}

        {/* Batch cert tab */}
        {activeTab === "cert" && (
          <div>
            <p className="text-xs text-[#6B7280] mb-3">
              Verify each spec against the PO requirement.
            </p>
            <div className="space-y-2">
              {certFields.map((cf) => {
                const verified = certChecked.has(cf.id);
                return (
                  <div
                    key={cf.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      verified ? "border-green-400 bg-green-50" : "border-[#E8E4DD] hover:border-[#D97706]/40"
                    }`}
                    onClick={() => setCertChecked((s) => { const n = new Set(s); n.add(cf.id); return n; })}
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">{cf.label}</p>
                      <p className="text-[10px] text-[#9CA3AF]">Spec: {cf.spec}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${verified ? "text-green-700" : "text-[#1A1A1A]"}`}>
                        {cf.value}
                      </p>
                      {verified && <p className="text-[10px] text-green-600 font-semibold">✓ PASS</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            {certDone && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTab("summary")}
                className="mt-3 px-4 py-2 bg-[#f59e0b] text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-[#D97706] transition-colors"
              >
                Next: Confirm Quantity →
              </motion.button>
            )}
          </div>
        )}

        {/* Summary tab */}
        {activeTab === "summary" && (
          <div>
            <div className="space-y-2 mb-4">
              {[
                { label: "PO Quantity", value: `${poQty.toLocaleString()} kg`, muted: false },
                {
                  label: "Quantity Received",
                  value: `${effectiveQty.toLocaleString()} kg${damagedFlagged ? " (1 bag damaged)" : ""}`,
                  muted: damagedFlagged,
                },
                { label: "Batch Purity", value: "98.5% — PASS ✓", muted: false },
                { label: "Batch Grade", value: "Industrial — PASS ✓", muted: false },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-[#E8E4DD]">
                  <span className="text-xs font-semibold text-[#6B7280]">{row.label}</span>
                  <span className={`text-sm font-medium ${row.muted ? "text-[#D97706]" : "text-[#1A1A1A]"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {damagedFlagged && (
              <div className="p-3 bg-[#FEF3C7] border border-[#f59e0b]/40 rounded-xl mb-4 text-xs text-[#92400E]">
                ⚠ Partial receipt noted. {(poQty - effectiveQty).toLocaleString()} kg will be flagged for follow-up with the vendor.
              </div>
            )}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-[#292524] transition-colors"
              >
                Confirm Receipt &amp; Raise GRN →
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-sm font-semibold text-green-700">GRN Raised — {effectiveQty.toLocaleString()} kg confirmed</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
