"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Colour & name maps ───────────────────────────────────────────────────────

export const CHAR_COLORS: Record<string, string> = {
  sarah:    "#1E3A5F",
  james:    "#92400E",
  rachel:   "#5B21B6",
  marco:    "#065F46",
  narrator: "#6B7280",
};

export const CHAR_NAMES: Record<string, string> = {
  sarah:    "Sarah Chen",
  james:    "James Whitmore",
  rachel:   "Rachel Torres",
  marco:    "Marco DeSilva",
  narrator: "Narrator",
};

// ─── SVG Avatars ──────────────────────────────────────────────────────────────

// Sarah Chen — Procurement Manager
// Navy blazer, light indigo background, warm skin, dark straight hair
export const SarahAvatar = memo(function SarahAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#EEF2FF" />
      {/* Blazer body */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#1E3A5F" />
      {/* Blazer lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#2D4F7A" />
      {/* White blouse hint */}
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#F5F0E8" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#E8B98A" />
      {/* Hair behind face — shoulder length */}
      <ellipse cx="40" cy="34" rx="19" ry="22" fill="#2C1810" />
      {/* Hair sides hanging */}
      <rect x="21" y="36" width="8" height="20" rx="4" fill="#2C1810" />
      <rect x="51" y="36" width="8" height="20" rx="4" fill="#2C1810" />
      {/* Face */}
      <ellipse cx="40" cy="37" rx="16" ry="18" fill="#E8B98A" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#E8B98A" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#E8B98A" />
      {/* Eyes */}
      <ellipse cx="33" cy="36" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="36" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="37" r="2.5" fill="#1A0F00" />
      <circle cx="48" cy="37" r="2.5" fill="#1A0F00" />
      <circle cx="34.8" cy="36.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="36.2" r="0.9" fill="white" />
      {/* Eyebrows — sharp, professional */}
      <path d="M29 32 Q33 30 37 31.5" stroke="#2C1810" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 31.5 Q47 30 51 32" stroke="#2C1810" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 42 Q37 45 38.5 46 Q40 47.5 41.5 46 Q43 45 41.5 42" stroke="#C09060" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — slight professional smile */}
      <path d="M34 50 Q40 53 46 50" stroke="#C09060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M35 50.5 Q40 52.5 45 50.5" stroke="#C09060" strokeWidth="0.5" fill="none" opacity="0.35" />
    </svg>
  );
});

// James Whitmore — Operations Director
// Dark gray shirt, warm bg, medium-dark skin, dark hair with gray temples
export const JamesAvatar = memo(function JamesAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FFF7ED" />
      {/* Dark gray shirt */}
      <path d="M0 80 L0 63 Q0 57 10 57 L22 61 L34 65 L40 67 L46 65 L58 61 L70 57 Q80 57 80 63 L80 80Z" fill="#4B5563" />
      {/* Collar */}
      <path d="M34 65 L37 72 L40 67 L43 72 L46 65 L40 62Z" fill="#374151" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#C4905A" />
      {/* Hair — dark with gray temples */}
      <ellipse cx="40" cy="22" rx="18" ry="10" fill="#4A3728" />
      <rect x="22" y="22" width="36" height="8" fill="#4A3728" />
      {/* Gray temple patches */}
      <ellipse cx="24" cy="27" rx="4" ry="5" fill="#8A7A70" />
      <ellipse cx="56" cy="27" rx="4" ry="5" fill="#8A7A70" />
      {/* Face */}
      <ellipse cx="40" cy="39" rx="17" ry="18" fill="#C4905A" />
      {/* Ears */}
      <ellipse cx="23" cy="39" rx="3" ry="4" fill="#C4905A" />
      <ellipse cx="57" cy="39" rx="3" ry="4" fill="#C4905A" />
      {/* Eyes — serious, steady */}
      <ellipse cx="33" cy="37" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="38" r="2.5" fill="#2A1800" />
      <circle cx="48" cy="38" r="2.5" fill="#2A1800" />
      <circle cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — firm, slightly furrowed */}
      <path d="M28 32 Q33 30.5 37 32" stroke="#4A3728" strokeWidth="2" strokeLinecap="round" />
      <path d="M43 32 Q47 30.5 52 32" stroke="#4A3728" strokeWidth="2" strokeLinecap="round" />
      {/* Slight frown crease */}
      <path d="M31 33.5 Q33 32.5 35 33" stroke="#4A3728" strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M45 33 Q47 32.5 49 33.5" stroke="#4A3728" strokeWidth="0.7" fill="none" opacity="0.4" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#A0683A" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — authoritative, neutral */}
      <path d="M34 51 Q40 53 46 51" stroke="#A0683A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Rachel Torres — CFO
// Purple blazer, light purple bg, warm skin, dark hair up in bun
export const RachelAvatar = memo(function RachelAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F5F3FF" />
      {/* Purple blazer */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#5B21B6" />
      {/* Lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#6D28D9" />
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#F5F0E8" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#D4956A" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="16" ry="18" fill="#D4956A" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#D4956A" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#D4956A" />
      {/* Small earrings */}
      <circle cx="24" cy="42" r="1.8" fill="#5B21B6" />
      <circle cx="56" cy="42" r="1.8" fill="#5B21B6" />
      {/* Hair bun — dark */}
      <ellipse cx="40" cy="22" rx="18" ry="8" fill="#1A1A1A" />
      <rect x="22" y="20" width="36" height="6" fill="#1A1A1A" />
      {/* Bun top */}
      <ellipse cx="40" cy="14" rx="9" ry="8" fill="#1A1A1A" />
      {/* Bun highlight */}
      <ellipse cx="37" cy="11" rx="3" ry="2" fill="#333" opacity="0.5" />
      {/* Eyes — sharp, analytical */}
      <ellipse cx="33" cy="37" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="38" r="2.5" fill="#1A0F00" />
      <circle cx="48" cy="38" r="2.5" fill="#1A0F00" />
      <circle cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — precise, sharp */}
      <path d="M29 32 Q33 30 37 31.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M43 31.5 Q47 30 51 32" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#B07040" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — focused, neutral */}
      <path d="M34 51 Q40 53 46 51" stroke="#B07040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Marco DeSilva — SunPalm Account Manager
// Dark green jacket, light green bg, Mediterranean skin, dark hair, friendly
export const MarcoAvatar = memo(function MarcoAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#ECFDF5" />
      {/* Dark green jacket */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#065F46" />
      {/* Collar */}
      <path d="M34 65 L38 74 L40 67 L42 74 L46 65 L40 62Z" fill="#047857" />
      <path d="M38 74 L40 80 L42 74 L40 68Z" fill="#F5F0E8" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#A0785A" />
      {/* Hair — dark */}
      <ellipse cx="40" cy="24" rx="18" ry="11" fill="#2C1810" />
      <rect x="22" y="24" width="36" height="7" fill="#2C1810" />
      {/* Face */}
      <ellipse cx="40" cy="40" rx="17" ry="18" fill="#A0785A" />
      {/* Ears */}
      <ellipse cx="23" cy="40" rx="3" ry="4" fill="#A0785A" />
      <ellipse cx="57" cy="40" rx="3" ry="4" fill="#A0785A" />
      {/* Eyes — friendly, warm */}
      <ellipse cx="33" cy="38" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="38" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="39" r="2.5" fill="#1A0F00" />
      <circle cx="48" cy="39" r="2.5" fill="#1A0F00" />
      <circle cx="34.8" cy="38.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="38.2" r="0.9" fill="white" />
      {/* Eyebrows — relaxed, friendly */}
      <path d="M29 33 Q33 31.5 37 33" stroke="#2C1810" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M43 33 Q47 31.5 51 33" stroke="#2C1810" strokeWidth="1.6" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 44 Q37 47 38.5 48 Q40 49.5 41.5 48 Q43 47 41.5 44" stroke="#7A5030" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — approachable open smile */}
      <path d="M33 51 Q40 55.5 47 51" stroke="#7A5030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 51.5 Q40 55 46 51.5" stroke="#7A5030" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
});

// Selector
export function CharacterAvatar({ character, size = 80 }: { character: Character; size?: number }) {
  if (character === "sarah")  return <SarahAvatar  size={size} />;
  if (character === "james")  return <JamesAvatar  size={size} />;
  if (character === "rachel") return <RachelAvatar size={size} />;
  if (character === "marco")  return <MarcoAvatar  size={size} />;
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
  const isLast = idx === lines.length - 1;

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

  const position = (c: Character): "left" | "right" => {
    if (c === "marco") return "right";
    return "left";
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer select-none" onClick={handleClick}>
      <AnimatePresence mode="wait">
        <DialogueBubble
          key={idx}
          character={current.character}
          text={current.text}
          position={position(current.character)}
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
