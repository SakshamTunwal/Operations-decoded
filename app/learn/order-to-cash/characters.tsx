"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Avatar SVGs ───────────────────────────────────────────────────────────────

const NinaAvatar = memo(function NinaAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#FCE7F3" />
      {/* Dark hair */}
      <ellipse cx="18" cy="10" rx="9" ry="7" fill="#1C1917" />
      <rect x="9" y="10" width="18" height="4" fill="#1C1917" />
      {/* Hair sides */}
      <rect x="9" y="14" width="3" height="8" rx="2" fill="#1C1917" />
      <rect x="24" y="14" width="3" height="8" rx="2" fill="#1C1917" />
      {/* Face */}
      <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FBBF24" />
      {/* Eyes */}
      <ellipse cx="15" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
      <ellipse cx="21" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
      {/* Nose */}
      <ellipse cx="18" cy="22" rx="0.8" ry="0.5" fill="#D97706" />
      {/* Focused smile */}
      <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#9D174D" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Professional jacket — rose */}
      <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#BE185D" />
      {/* Collar */}
      <path d="M16 30 L18 33 L20 30" fill="#F472B6" />
    </svg>
  );
});

const CarlosAvatar = memo(function CarlosAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#FEF3C7" />
      {/* Brown hair */}
      <ellipse cx="18" cy="10" rx="9" ry="7" fill="#7C2D12" />
      <rect x="9" y="10" width="18" height="3" fill="#7C2D12" />
      {/* Face */}
      <ellipse cx="18" cy="20" rx="7" ry="8" fill="#FBBF24" />
      {/* Eyes — confident */}
      <ellipse cx="15" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
      <ellipse cx="21" cy="19" rx="1.2" ry="1.4" fill="#1C1917" />
      {/* Nose */}
      <ellipse cx="18" cy="22" rx="0.8" ry="0.5" fill="#D97706" />
      {/* Confident grin */}
      <path d="M15 24.5 Q18 27 21 24.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Sales look — amber */}
      <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#D97706" />
      {/* Tie */}
      <path d="M17 30 L18 35 L19 30" fill="#F59E0B" />
    </svg>
  );
});

const SamAvatar = memo(function SamAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#DBEAFE" />
      {/* Short neat hair — dark */}
      <ellipse cx="18" cy="10" rx="9" ry="6.5" fill="#1C1917" />
      <rect x="9" y="10" width="18" height="3" fill="#1C1917" />
      {/* Face — Black */}
      <ellipse cx="18" cy="20" rx="7" ry="8" fill="#92400E" />
      {/* Glasses frame */}
      <rect x="11" y="17" width="5" height="4" rx="1.5" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <rect x="20" y="17" width="5" height="4" rx="1.5" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <line x1="16" y1="19" x2="20" y2="19" stroke="#1C1917" strokeWidth="1" />
      {/* Eyes behind glasses */}
      <ellipse cx="13.5" cy="19" rx="1" ry="1.1" fill="#1C1917" />
      <ellipse cx="22.5" cy="19" rx="1" ry="1.1" fill="#1C1917" />
      {/* Nose */}
      <ellipse cx="18" cy="22.5" rx="0.7" ry="0.5" fill="#7C2D12" />
      {/* Thoughtful smile */}
      <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#7C2D12" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Blue professional */}
      <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#1D4ED8" />
      <path d="M16.5 30 L18 34 L19.5 30" fill="#3B82F6" />
    </svg>
  );
});

const LeoAvatar = memo(function LeoAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#D1FAE5" />
      {/* Dark hair — Latin */}
      <ellipse cx="18" cy="11" rx="9" ry="7" fill="#292524" />
      <rect x="9" y="11" width="18" height="3" fill="#292524" />
      {/* Face */}
      <ellipse cx="18" cy="20" rx="7" ry="8" fill="#D97706" />
      {/* Eyes */}
      <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
      <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
      {/* Nose */}
      <ellipse cx="18" cy="22" rx="0.8" ry="0.5" fill="#92400E" />
      {/* Practical smile */}
      <path d="M15.5 24.5 Q18 26.5 20.5 24.5" stroke="#92400E" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Green warehouse/ops vest */}
      <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#065F46" />
      {/* Hi-vis stripe */}
      <path d="M12 34 L24 34" stroke="#FCD34D" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
});

const GraceAvatar = memo(function GraceAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#EDE9FE" />
      {/* Hair — Black, neat bun */}
      <ellipse cx="18" cy="10" rx="9" ry="6.5" fill="#1C1917" />
      <rect x="9" y="10" width="18" height="3" fill="#1C1917" />
      <circle cx="26" cy="9" r="3.5" fill="#1C1917" />
      {/* Face — Black */}
      <ellipse cx="18" cy="20" rx="7" ry="8" fill="#7C3D12" />
      {/* Eyes — sharp */}
      <ellipse cx="15" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
      <ellipse cx="21" cy="19" rx="1.2" ry="1.3" fill="#1C1917" />
      {/* Nose */}
      <ellipse cx="18" cy="22.5" rx="0.8" ry="0.5" fill="#92400E" />
      {/* Composed expression */}
      <path d="M15.5 24.5 Q18 26 20.5 24.5" stroke="#7C2D12" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Violet finance jacket */}
      <path d="M11 36 Q14 30 18 30 Q22 30 25 36" fill="#6D28D9" />
      <path d="M16.5 30 L18 34 L19.5 30" fill="#8B5CF6" />
    </svg>
  );
});

const NarratorIcon = memo(function NarratorIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#E8E4DD" />
      <circle cx="18" cy="18" r="10" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="18" y="23" textAnchor="middle" fontSize="12">📖</text>
    </svg>
  );
});

function getAvatar(character: Character) {
  switch (character) {
    case "nina":     return <NinaAvatar />;
    case "carlos":   return <CarlosAvatar />;
    case "sam":      return <SamAvatar />;
    case "leo":      return <LeoAvatar />;
    case "grace":    return <GraceAvatar />;
    default:         return <NarratorIcon />;
  }
}

function getCharacterName(character: Character): string {
  switch (character) {
    case "nina":     return "Nina Rao";
    case "carlos":   return "Carlos Reyes";
    case "sam":      return "Sam Achebe";
    case "leo":      return "Leo Varela";
    case "grace":    return "Grace Okonkwo";
    default:         return "Narrator";
  }
}

function getCharacterRole(character: Character): string {
  switch (character) {
    case "nina":     return "Order Manager";
    case "carlos":   return "Sales";
    case "sam":      return "Production Planner";
    case "leo":      return "Warehouse & Dispatch";
    case "grace":    return "Finance / AR";
    default:         return "";
  }
}

function getNameColor(character: Character): string {
  switch (character) {
    case "nina":     return "text-[#BE185D]";
    case "carlos":   return "text-[#D97706]";
    case "sam":      return "text-[#1D4ED8]";
    case "leo":      return "text-[#065F46]";
    case "grace":    return "text-[#6D28D9]";
    default:         return "text-[#9CA3AF]";
  }
}

function getBubbleStyle(character: Character): string {
  if (character === "narrator") {
    return "bg-[#F5F0E8] border border-[#E8E4DD] text-[#6B7280] italic";
  }
  return "bg-white border border-[#E8E4DD] text-[#1A1A1A]";
}

// ─── Word-by-word reveal ───────────────────────────────────────────────────────

interface DialogueBubbleProps {
  line: DialogueLine;
  forceReveal: boolean;
  onRevealComplete: () => void;
}

function DialogueBubble({ line, forceReveal, onRevealComplete }: DialogueBubbleProps) {
  const words = line.text.split(" ");
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRevealed(0);
    let i = 0;
    const tick = () => {
      i++;
      setRevealed(i);
      if (i < words.length) timerRef.current = setTimeout(tick, 48);
      else onRevealComplete();
    };
    timerRef.current = setTimeout(tick, 60);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.text]);

  useEffect(() => {
    if (forceReveal && revealed < words.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRevealed(words.length);
      onRevealComplete();
    }
  }, [forceReveal, revealed, words.length, onRevealComplete]);

  const visibleText = words.slice(0, revealed).join(" ");

  return (
    <motion.div
      key={line.text}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed min-h-[48px] ${getBubbleStyle(line.character)}`}
    >
      {visibleText}
      {revealed < words.length && (
        <span className="inline-block w-1 h-3.5 bg-current opacity-60 ml-0.5 align-middle animate-pulse" />
      )}
    </motion.div>
  );
}

// ─── DialogueSequence ──────────────────────────────────────────────────────────

interface DialogueSequenceProps {
  lines: DialogueLine[];
  onComplete: () => void;
}

export function DialogueSequence({ lines, onComplete }: DialogueSequenceProps) {
  const [idx, setIdx]             = useState(0);
  const [revealing, setRevealing] = useState(true);
  const isLast = idx === lines.length - 1;

  const handleClick = () => {
    if (revealing) {
      setRevealing(false);
      return;
    }
    if (!isLast) {
      setIdx((i) => i + 1);
      setRevealing(true);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleClick(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, revealing, isLast]);

  const line = lines[idx];

  return (
    <div className="flex flex-col gap-3 cursor-pointer select-none" onClick={handleClick}>
      <AnimatePresence mode="wait">
        <DialogueBubble
          key={idx}
          line={line}
          forceReveal={!revealing}
          onRevealComplete={() => setRevealing(false)}
        />
      </AnimatePresence>

      {/* Speaker row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
            {getAvatar(line.character)}
          </div>
          <div>
            <p className={`text-xs font-bold leading-tight ${getNameColor(line.character)}`}>
              {getCharacterName(line.character)}
            </p>
            {getCharacterRole(line.character) && (
              <p className="text-[10px] text-[#9CA3AF] leading-tight">{getCharacterRole(line.character)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
          <span className="hidden sm:inline">{isLast && !revealing ? "Click to proceed" : "Click to continue"}</span>
          <span className="text-[8px] font-mono bg-[#F5F0E8] border border-[#E8E4DD] px-1.5 py-0.5 rounded text-[#9CA3AF]">
            {idx + 1}/{lines.length}
          </span>
        </div>
      </div>
    </div>
  );
}
