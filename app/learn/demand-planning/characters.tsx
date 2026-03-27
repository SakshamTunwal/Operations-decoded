"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DialogueLine, Character } from "./types";

// ─── Avatars ────────────────────────────────────────────────────────────────

function TomAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#EFF6FF" rx="10" />
      {/* Short dark hair */}
      <ellipse cx="24" cy="13" rx="8" ry="5" fill="#1C1917" />
      <circle cx="24" cy="19" r="8" fill="#FBBF24" />
      <circle cx="21.5" cy="18.5" r="1.2" fill="#1C1917" />
      <circle cx="26.5" cy="18.5" r="1.2" fill="#1C1917" />
      <path d="M21 22 Q24 24.5 27 22" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Business shirt + tie */}
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#3B82F6" />
      <path d="M24 32 L22 36 L24 34 L26 36 Z" fill="#1D4ED8" />
    </svg>
  );
}

function IsabelleAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#F5F3FF" rx="10" />
      <rect x="14" y="11" width="20" height="18" rx="4" fill="#92400E" />
      <rect x="14" y="17" width="3" height="14" rx="2" fill="#92400E" />
      <rect x="31" y="17" width="3" height="14" rx="2" fill="#92400E" />
      <circle cx="24" cy="19" r="7" fill="#FDE68A" />
      <circle cx="21.5" cy="18" r="1.2" fill="#1C1917" />
      <circle cx="26.5" cy="18" r="1.2" fill="#1C1917" />
      <path d="M21 22 Q24 24 27 22" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#7C3AED" />
    </svg>
  );
}

function VanessaAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#ECFDF5" rx="10" />
      {/* Curly hair */}
      <ellipse cx="24" cy="12" rx="9" ry="6" fill="#1C1917" />
      <circle cx="17" cy="15" r="4" fill="#1C1917" />
      <circle cx="31" cy="15" r="4" fill="#1C1917" />
      <circle cx="24" cy="19" r="7.5" fill="#78350F" />
      <circle cx="21.5" cy="18.5" r="1.2" fill="#1C1917" />
      <circle cx="26.5" cy="18.5" r="1.2" fill="#1C1917" />
      <path d="M21.5 22 Q24 24.5 26.5 22" stroke="#7C3AED" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#059669" />
    </svg>
  );
}

function ChloeAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#FFFBEB" rx="10" />
      {/* Straight medium brown hair */}
      <rect x="14" y="10" width="20" height="16" rx="3" fill="#92400E" />
      <rect x="14" y="14" width="4" height="18" rx="2" fill="#92400E" />
      <rect x="30" y="14" width="4" height="18" rx="2" fill="#92400E" />
      <circle cx="24" cy="20" r="7" fill="#FDE68A" />
      <circle cx="21.5" cy="19" r="1.2" fill="#1C1917" />
      <circle cx="26.5" cy="19" r="1.2" fill="#1C1917" />
      <path d="M21 22.5 Q24 24.5 27 22.5" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#D97706" />
    </svg>
  );
}

function OmarAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#F5F3FF" rx="10" />
      {/* Short tight hair */}
      <ellipse cx="24" cy="13" rx="8.5" ry="5.5" fill="#292524" />
      <circle cx="24" cy="19" r="7.5" fill="#92400E" />
      <circle cx="21.5" cy="18.5" r="1.2" fill="#1C1917" />
      <circle cx="26.5" cy="18.5" r="1.2" fill="#1C1917" />
      <path d="M21.5 22.5 Q24 24.5 26.5 22.5" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Supply chain blue vest */}
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#6D28D9" />
      <rect x="21" y="33" width="6" height="1.5" rx="0.75" fill="#A78BFA" />
    </svg>
  );
}

function NarratorIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="16" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 3" />
      <text x="18" y="23" textAnchor="middle" fontSize="14" fill="#3B82F6" fontFamily="sans-serif">✦</text>
    </svg>
  );
}

// Public exports
export { TomAvatar, IsabelleAvatar, VanessaAvatar, ChloeAvatar, OmarAvatar };

// ─── Avatar map ─────────────────────────────────────────────────────────────

function CharacterAvatar({ character, size }: { character: Character; size: number }) {
  switch (character) {
    case "tom":      return <TomAvatar size={size} />;
    case "isabelle": return <IsabelleAvatar size={size} />;
    case "vanessa":  return <VanessaAvatar size={size} />;
    case "chloe":    return <ChloeAvatar size={size} />;
    case "omar":     return <OmarAvatar size={size} />;
    case "narrator": return <NarratorIcon size={size} />;
  }
}

const CHARACTER_NAMES: Record<Character, string> = {
  tom:      "Tom Kessler",
  isabelle: "Isabelle Cruz",
  vanessa:  "Vanessa Okafor",
  chloe:    "Chloe Brennan",
  omar:     "Omar Rahman",
  narrator: "Narrator",
};

const CHARACTER_ROLES: Record<Character, string> = {
  tom:      "Demand Planning Manager",
  isabelle: "Demand Planning Analyst",
  vanessa:  "Sales Director",
  chloe:    "Finance Director",
  omar:     "Supply Chain Director",
  narrator: "",
};

const BUBBLE_COLORS: Record<Character, { bg: string; border: string; nameColor: string }> = {
  tom:      { bg: "#EFF6FF", border: "#BFDBFE", nameColor: "#1D4ED8" },
  isabelle: { bg: "#F5F3FF", border: "#DDD6FE", nameColor: "#6D28D9" },
  vanessa:  { bg: "#ECFDF5", border: "#A7F3D0", nameColor: "#065F46" },
  chloe:    { bg: "#FFFBEB", border: "#FDE68A", nameColor: "#92400E" },
  omar:     { bg: "#F5F3FF", border: "#C4B5FD", nameColor: "#5B21B6" },
  narrator: { bg: "#F0F9FF", border: "#BAE6FD", nameColor: "#0369A1" },
};

// ─── DialogueBubble ──────────────────────────────────────────────────────────

function DialogueBubble({ line, onDone }: { line: DialogueLine; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bg, border, nameColor } = BUBBLE_COLORS[line.character];
  const isNarrator = line.character === "narrator";
  const words = line.text.split(" ");

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let idx = 0;
    function step() {
      idx++;
      setDisplayed(words.slice(0, idx).join(" "));
      if (idx < words.length) {
        timerRef.current = setTimeout(step, 48);
      } else {
        setDone(true);
      }
    }
    timerRef.current = setTimeout(step, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.text]);

  const skip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed(line.text);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isNarrator ? "justify-center" : "items-start gap-3"}`}
    >
      {!isNarrator && (
        <div className="flex-shrink-0 mt-1">
          <CharacterAvatar character={line.character} size={40} />
        </div>
      )}
      <div
        className="flex-1 rounded-2xl px-4 py-3 border cursor-pointer select-none"
        style={{ background: bg, borderColor: border }}
        onClick={done ? onDone : skip}
      >
        {!isNarrator && (
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] font-bold" style={{ color: nameColor }}>{CHARACTER_NAMES[line.character]}</p>
            <p className="text-[9px] text-[#9CA3AF]">{CHARACTER_ROLES[line.character]}</p>
          </div>
        )}
        <p className={`text-sm leading-relaxed text-[#374151] ${isNarrator ? "italic text-center text-[#6B7280]" : ""}`}>
          {displayed}
          {!done && <span className="animate-pulse ml-0.5 text-[#9CA3AF]">▋</span>}
        </p>
        {done && (
          <p className="text-[9px] text-[#9CA3AF] mt-1 text-right">{isNarrator ? "continue →" : "tap to continue →"}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── DialogueSequence ────────────────────────────────────────────────────────

export function DialogueSequence({
  lines,
  onComplete,
}: {
  lines: DialogueLine[];
  onComplete: () => void;
}) {
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < lines.length - 1) setIdx(idx + 1);
    else onComplete();
  };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="wait">
        <DialogueBubble key={idx} line={lines[idx]} onDone={next} />
      </AnimatePresence>
      <div className="flex items-center justify-center gap-1.5">
        {lines.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${
              i < idx ? "w-2 h-2 bg-[#3B82F6]" :
              i === idx ? "w-4 h-2 bg-[#3B82F6]" :
              "w-2 h-2 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
