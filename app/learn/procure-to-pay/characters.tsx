"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Colour & name maps ───────────────────────────────────────────────────────

export const CHAR_COLORS: Record<string, string> = {
  marcus:   "#D97706",
  diana:    "#1E3A5F",
  leon:     "#EA580C",
  narrator: "#6B7280",
};

export const CHAR_NAMES: Record<string, string> = {
  marcus:   "Marcus",
  diana:    "Diana",
  leon:     "Leon",
  narrator: "Narrator",
};

// ─── SVG Avatars ──────────────────────────────────────────────────────────────

// Marcus — Production Manager
// Hard hat (amber), dark work shirt, medium-brown skin
export const MarcusAvatar = memo(function MarcusAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background card */}
      <rect width="80" height="80" rx="12" fill="#FEF3C7" />
      {/* Work shirt */}
      <path d="M0 80 L0 64 Q0 58 10 58 L22 61 L34 65 L40 67 L46 65 L58 61 L70 58 Q80 58 80 64 L80 80Z" fill="#374151" />
      {/* Collar */}
      <path d="M34 65 L38 74 L40 67 L42 74 L46 65 L40 61Z" fill="#4B5563" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#C8845C" />
      {/* Face */}
      <ellipse cx="40" cy="41" rx="17" ry="18" fill="#C8845C" />
      {/* Ears */}
      <ellipse cx="23" cy="41" rx="3" ry="4" fill="#C8845C" />
      <ellipse cx="57" cy="41" rx="3" ry="4" fill="#C8845C" />
      {/* Hair under hat */}
      <ellipse cx="25" cy="29" rx="4" ry="5" fill="#1A0F00" />
      <ellipse cx="55" cy="29" rx="4" ry="5" fill="#1A0F00" />
      {/* Hard hat dome */}
      <ellipse cx="40" cy="23" rx="20" ry="10" fill="#f59e0b" />
      {/* Hard hat brim */}
      <rect x="18" y="22" width="44" height="5" rx="2.5" fill="#D97706" />
      {/* Hat shine */}
      <ellipse cx="34" cy="18" rx="6" ry="3" fill="white" opacity="0.2" />
      {/* Eyes */}
      <ellipse cx="33" cy="40" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="40" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="41" r="2.5"  fill="#1A0F00" />
      <circle  cx="48" cy="41" r="2.5"  fill="#1A0F00" />
      <circle  cx="34.8" cy="40.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="40.2" r="0.9" fill="white" />
      {/* Eyebrows – slightly furrowed */}
      <path d="M29 36 Q33 34 37 35.5" stroke="#1A0F00" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M43 35.5 Q47 34 51 36"  stroke="#1A0F00" strokeWidth="1.6" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 46 Q37 49 38.5 50 Q40 51.5 41.5 50 Q43 49 41.5 46" stroke="#A0603A" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth – concerned */}
      <path d="M35 53 Q40 55.5 45 53" stroke="#A0603A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Diana — Purchase Manager
// Navy blazer, warm-light skin, dark hair, amber earrings
export const DianaAvatar = memo(function DianaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background card */}
      <rect width="80" height="80" rx="12" fill="#EEF2FF" />
      {/* Blazer */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#1E3A5F" />
      {/* Blazer lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#2D4F7A" />
      {/* Blouse hint */}
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#F5F0E8" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#E8B98A" />
      {/* Hair behind face */}
      <ellipse cx="40" cy="30" rx="19" ry="22" fill="#1A0F00" />
      {/* Face */}
      <ellipse cx="40" cy="37" rx="16" ry="18" fill="#E8B98A" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#E8B98A" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#E8B98A" />
      {/* Amber earrings */}
      <circle cx="24" cy="42" r="2.2" fill="#f59e0b" />
      <circle cx="56" cy="42" r="2.2" fill="#f59e0b" />
      {/* Eyes */}
      <ellipse cx="33" cy="36" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="36" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="37" r="2.5"  fill="#1A0F00" />
      <circle  cx="48" cy="37" r="2.5"  fill="#1A0F00" />
      <circle  cx="34.8" cy="36.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="36.2" r="0.9" fill="white" />
      {/* Eyebrows – sharp, professional */}
      <path d="M29 32 Q33 30 37 31.5" stroke="#1A0F00" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 31.5 Q47 30 51 32"  stroke="#1A0F00" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 42 Q37 45 38.5 46 Q40 47.5 41.5 46 Q43 45 41.5 42" stroke="#C09060" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth – focused */}
      <path d="M34 50 Q40 52.5 46 50" stroke="#C09060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Hair bun suggestion */}
      <circle cx="40" cy="14" r="7" fill="#2D1800" />
      <path   d="M33 22 Q40 18 47 22" stroke="#1A0F00" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Leon — Crestline Materials Sales Coordinator
// Orange safety vest, dark skin, short hair, warm smile
export const LeonAvatar = memo(function LeonAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background card */}
      <rect width="80" height="80" rx="12" fill="#FFF7ED" />
      {/* Base shirt */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 64 L40 66 L46 64 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#374151" />
      {/* Safety vest */}
      <path d="M10 80 L10 65 L22 62 L34 66 L40 68 L46 66 L58 62 L70 65 L70 80Z" fill="#f97316" />
      {/* Reflective stripe */}
      <rect x="10" y="73" width="60" height="3" rx="1.5" fill="#FEF3C7" opacity="0.9" />
      {/* Vest V-opening */}
      <path d="M34 66 L38 76 L40 68 L42 76 L46 66 L40 63Z" fill="#374151" />
      {/* Neck */}
      <rect x="33" y="53" width="14" height="11" rx="4" fill="#8B5E3C" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="17" ry="19" fill="#8B5E3C" />
      {/* Ears */}
      <ellipse cx="23" cy="38" rx="3" ry="4" fill="#8B5E3C" />
      <ellipse cx="57" cy="38" rx="3" ry="4" fill="#8B5E3C" />
      {/* Short hair */}
      <ellipse cx="40" cy="22" rx="17" ry="9"  fill="#0D0700" />
      <rect    x="23"  y="22" width="34" height="6" fill="#0D0700" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="38" r="2.5"  fill="#0D0700" />
      <circle  cx="48" cy="38" r="2.5"  fill="#0D0700" />
      <circle  cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows – relaxed, friendly */}
      <path d="M29 33 Q33 31.5 37 33" stroke="#0D0700" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 33 Q47 31.5 51 33" stroke="#0D0700" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#6B3A1F" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth – friendly open smile */}
      <path d="M33 50 Q40 55 47 50" stroke="#6B3A1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 50.5 Q40 54 46 50.5" stroke="#6B3A1F" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
});

// Selector
export function CharacterAvatar({ character, size = 80 }: { character: Character; size?: number }) {
  if (character === "marcus") return <MarcusAvatar size={size} />;
  if (character === "diana")  return <DianaAvatar  size={size} />;
  if (character === "leon")   return <LeonAvatar   size={size} />;
  return null;
}

// ─── DialogueBubble ───────────────────────────────────────────────────────────

interface DialogueBubbleProps {
  character: Character;
  text: string;
  position?: "left" | "right";
  forceReveal?: boolean;
  onRevealComplete?: () => void;
}

export const DialogueBubble = memo(function DialogueBubble({
  character,
  text,
  position = "left",
  forceReveal = false,
  onRevealComplete,
}: DialogueBubbleProps) {
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(forceReveal ? words.length : 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (forceReveal) {
      setVisibleCount(words.length);
      onRevealComplete?.();
      return;
    }
    setVisibleCount(0);
    let i = 0;
    function tick() {
      i++;
      setVisibleCount(i);
      if (i < words.length) {
        timerRef.current = setTimeout(tick, 55);
      } else {
        onRevealComplete?.();
      }
    }
    timerRef.current = setTimeout(tick, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, forceReveal]);

  if (character === "narrator") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full text-center py-3 px-4"
      >
        <p className="text-sm text-[#6B7280] italic leading-relaxed">{text}</p>
      </motion.div>
    );
  }

  const isRight = position === "right";
  const accentColor = CHAR_COLORS[character];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 ${isRight ? "flex-row-reverse" : "flex-row"} w-full max-w-lg`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
          className="rounded-xl overflow-hidden shadow-sm border-2"
          style={{ borderColor: accentColor }}
        >
          <CharacterAvatar character={character} size={64} />
        </motion.div>
        <p
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          {CHAR_NAMES[character]}
        </p>
      </div>

      {/* Bubble */}
      <motion.div
        initial={{ opacity: 0, x: isRight ? 24 : -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28, delay: 0.12 }}
        className="relative flex-1 min-w-0"
      >
        {/* Tail */}
        <div
          className={`absolute top-4 w-3 h-3 bg-white rotate-45 z-10 ${
            isRight
              ? "-right-1.5 border-r border-b border-[#E8E4DD]"
              : "-left-1.5 border-l border-t border-[#E8E4DD]"
          }`}
          style={{ borderWidth: "1px" }}
        />
        <div className="relative z-20 bg-white border border-[#E8E4DD] rounded-xl px-4 py-3 shadow-sm">
          <p className="text-sm text-[#1A1A1A] leading-relaxed min-h-[1.4em]">
            {words.slice(0, visibleCount).join(" ")}
            {visibleCount < words.length && (
              <span className="inline-block w-0.5 h-4 bg-[#9CA3AF] ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ─── DialogueSequence ─────────────────────────────────────────────────────────

interface DialogueSequenceProps {
  lines: DialogueLine[];
  onComplete: () => void;
}

export function DialogueSequence({ lines, onComplete }: DialogueSequenceProps) {
  const [idx, setIdx] = useState(0);
  const [revealing, setRevealing] = useState(true);
  const [force, setForce] = useState(false);

  const current = lines[idx];
  const isLast  = idx === lines.length - 1;

  // Keyboard: Space or Enter advances dialogue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, revealing, isLast]);

  const handleClick = () => {
    if (revealing) {
      setForce(true);
    } else if (!isLast) {
      setIdx((i) => i + 1);
      setRevealing(true);
      setForce(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer select-none" onClick={handleClick}>
      <AnimatePresence mode="wait">
        <DialogueBubble
          key={idx}
          character={current.character}
          text={current.text}
          position={current.character === "leon" ? "right" : "left"}
          forceReveal={force}
          onRevealComplete={() => setRevealing(false)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {!revealing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 1, 0.7, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, times: [0, 0.3, 0.5, 0.7, 1] }}
            className="text-xs text-[#9CA3AF] text-right pr-1 flex items-center justify-end gap-1"
          >
            Click to continue
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              ▸
            </motion.span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
