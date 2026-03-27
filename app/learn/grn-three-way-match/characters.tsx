"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Colour & name maps ───────────────────────────────────────────────────────

export const CHAR_COLORS: Record<string, string> = {
  neil:     "#1D4ED8",
  clara:    "#7C3AED",
  otto:     "#B45309",
  stefan:   "#065F46",
  priya:    "#BE185D",
  narrator: "#6B7280",
};

export const CHAR_NAMES: Record<string, string> = {
  neil:     "Neil Kapoor",
  clara:    "Clara Mendes",
  otto:     "Otto Fischer",
  stefan:   "Stefan Vogt",
  priya:    "Priya Chandran",
  narrator: "Narrator",
};

// ─── SVG Avatars ──────────────────────────────────────────────────────────────

// Neil Kapoor — South Asian man, blue dress shirt, professional
export const NeilAvatar = memo(function NeilAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#EFF6FF" />
      {/* Dress shirt body */}
      <path d="M0 80 L0 63 Q0 57 10 57 L22 61 L34 65 L40 67 L46 65 L58 61 L70 57 Q80 57 80 63 L80 80Z" fill="#1D4ED8" />
      {/* Collar / tie area */}
      <path d="M34 65 L38 75 L40 67 L42 75 L46 65 L40 62Z" fill="#1E40AF" />
      {/* Tie */}
      <path d="M38 65 L40 78 L42 65 L41 62 L39 62Z" fill="#F59E0B" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#C2956B" />
      {/* Face */}
      <ellipse cx="40" cy="40" rx="17" ry="18" fill="#C2956B" />
      {/* Ears */}
      <ellipse cx="23" cy="40" rx="3" ry="4" fill="#C2956B" />
      <ellipse cx="57" cy="40" rx="3" ry="4" fill="#C2956B" />
      {/* Hair — dark, neat, short */}
      <ellipse cx="40" cy="24" rx="17" ry="9" fill="#1A0A00" />
      <rect x="23" y="24" width="34" height="8" fill="#1A0A00" />
      {/* Eyes */}
      <ellipse cx="33" cy="39" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="39" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="40" r="2.5" fill="#1A0A00" />
      <circle cx="48" cy="40" r="2.5" fill="#1A0A00" />
      <circle cx="34.8" cy="39.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="39.2" r="0.9" fill="white" />
      {/* Eyebrows — focused */}
      <path d="M29 35 Q33 33 37 34.5" stroke="#1A0A00" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M43 34.5 Q47 33 51 35" stroke="#1A0A00" strokeWidth="1.6" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 45 Q37 48 38.5 49 Q40 50.5 41.5 49 Q43 48 41.5 45" stroke="#9B6A3E" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — composed */}
      <path d="M35 53 Q40 55 45 53" stroke="#9B6A3E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Clara Mendes — Woman, purple blazer, dark hair in ponytail
export const ClaraAvatar = memo(function ClaraAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F5F3FF" />
      {/* Blazer */}
      <path d="M0 80 L0 61 Q0 55 10 55 L22 59 L34 64 L40 66 L46 64 L58 59 L70 55 Q80 55 80 61 L80 80Z" fill="#7C3AED" />
      {/* Lapels */}
      <path d="M34 64 L38 76 L40 66 L42 76 L46 64" fill="#6D28D9" />
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#F5F0E8" />
      {/* Neck */}
      <rect x="33" y="53" width="14" height="10" rx="4" fill="#D4A070" />
      {/* Hair body — behind face */}
      <ellipse cx="40" cy="30" rx="18" ry="22" fill="#1A0A00" />
      {/* Face */}
      <ellipse cx="40" cy="37" rx="16" ry="18" fill="#D4A070" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#D4A070" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#D4A070" />
      {/* Earrings */}
      <circle cx="24" cy="42" r="2" fill="#7C3AED" />
      <circle cx="56" cy="42" r="2" fill="#7C3AED" />
      {/* Ponytail */}
      <ellipse cx="40" cy="13" rx="6" ry="5" fill="#2D1800" />
      <path d="M40 18 Q44 10 42 5" stroke="#1A0A00" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="33" cy="36" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="36" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="37" r="2.5" fill="#1A0A00" />
      <circle cx="48" cy="37" r="2.5" fill="#1A0A00" />
      <circle cx="34.8" cy="36.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="36.2" r="0.9" fill="white" />
      {/* Eyebrows — sharp, authoritative */}
      <path d="M29 32 Q33 30 37 31" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 31 Q47 30 51 32" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 42 Q37 45 38.5 46 Q40 47.5 41.5 46 Q43 45 41.5 42" stroke="#A07040" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — confident */}
      <path d="M34 50 Q40 52.5 46 50" stroke="#A07040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Otto Fischer — Older European man, gray work shirt, reading glasses on forehead
export const OttoAvatar = memo(function OttoAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FFFBEB" />
      {/* Work shirt */}
      <path d="M0 80 L0 63 Q0 57 10 57 L22 61 L34 65 L40 67 L46 65 L58 61 L70 57 Q80 57 80 63 L80 80Z" fill="#6B7280" />
      {/* Shirt collar */}
      <path d="M34 65 L37 72 L40 67 L43 72 L46 65 L40 62Z" fill="#4B5563" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#D4A87A" />
      {/* Face — older, wider */}
      <ellipse cx="40" cy="41" rx="18" ry="17" fill="#D4A87A" />
      {/* Ears */}
      <ellipse cx="22" cy="41" rx="3.5" ry="4.5" fill="#D4A87A" />
      <ellipse cx="58" cy="41" rx="3.5" ry="4.5" fill="#D4A87A" />
      {/* Hair — short, gray, thinning */}
      <path d="M24 30 Q40 22 56 30" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="27" rx="16" ry="6" fill="#9CA3AF" opacity="0.7" />
      {/* Reading glasses pushed up on forehead */}
      <rect x="27" y="28" width="11" height="7" rx="3" fill="none" stroke="#374151" strokeWidth="1.5" />
      <rect x="42" y="28" width="11" height="7" rx="3" fill="none" stroke="#374151" strokeWidth="1.5" />
      <line x1="38" y1="31.5" x2="42" y2="31.5" stroke="#374151" strokeWidth="1.5" />
      <line x1="24" y1="31.5" x2="27" y2="31.5" stroke="#374151" strokeWidth="1" />
      <line x1="53" y1="31.5" x2="57" y2="31.5" stroke="#374151" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="33" cy="40" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="40" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="41" r="2.5" fill="#374151" />
      <circle cx="48" cy="41" r="2.5" fill="#374151" />
      <circle cx="34.8" cy="40.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="40.2" r="0.9" fill="white" />
      {/* Eyebrows — bushy, gray */}
      <path d="M28 36 Q33 34 37 35" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M43 35 Q47 34 52 36" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" />
      {/* Wrinkle lines */}
      <path d="M24 42 Q22 44 24 46" stroke="#B8906A" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M56 42 Q58 44 56 46" stroke="#B8906A" strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Nose */}
      <path d="M38 46 Q36.5 49 38 50.5 Q40 52 42 50.5 Q43.5 49 42 46" stroke="#A07040" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Mouth — measured, experienced */}
      <path d="M34 54 Q40 56 46 54" stroke="#A07040" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Stefan Vogt — vendor, dark green button-up, slightly casual (voice-only/Marco style)
export const StefanAvatar = memo(function StefanAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#ECFDF5" />
      {/* Casual button-up */}
      <path d="M0 80 L0 63 Q0 57 10 57 L22 61 L34 65 L40 67 L46 65 L58 61 L70 57 Q80 57 80 63 L80 80Z" fill="#065F46" />
      {/* Collar open casual */}
      <path d="M34 65 L36 70 L40 67 L44 70 L46 65 L40 62Z" fill="#064E3B" />
      <path d="M36 70 L40 80 L44 70 L40 68Z" fill="#D1FAE5" opacity="0.6" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#E8C99A" />
      {/* Face */}
      <ellipse cx="40" cy="40" rx="17" ry="18" fill="#E8C99A" />
      {/* Ears */}
      <ellipse cx="23" cy="40" rx="3" ry="4" fill="#E8C99A" />
      <ellipse cx="57" cy="40" rx="3" ry="4" fill="#E8C99A" />
      {/* Hair — medium brown, slightly informal */}
      <ellipse cx="40" cy="24" rx="18" ry="10" fill="#5C3A1E" />
      <rect x="22" y="24" width="36" height="8" fill="#5C3A1E" />
      {/* Side parting */}
      <path d="M26 23 Q36 20 40 24" stroke="#3D200A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="33" cy="39" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="39" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="40" r="2.5" fill="#3D200A" />
      <circle cx="48" cy="40" r="2.5" fill="#3D200A" />
      <circle cx="34.8" cy="39.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="39.2" r="0.9" fill="white" />
      {/* Eyebrows — relaxed */}
      <path d="M29 35 Q33 33.5 37 34.5" stroke="#3D200A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 34.5 Q47 33.5 51 35" stroke="#3D200A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 45 Q37 48 38.5 49.5 Q40 51 41.5 49.5 Q43 48 41.5 45" stroke="#B08040" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Mouth — slightly cheerful */}
      <path d="M34 53 Q40 56.5 46 53" stroke="#B08040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Priya Chandran — South Asian woman, rose-colored top, focused finance expression
export const PriyaAvatar = memo(function PriyaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FFF1F2" />
      {/* Rose top */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#BE185D" />
      {/* Blouse neckline */}
      <path d="M34 65 L38 73 L40 67 L42 73 L46 65 L40 62Z" fill="#9D174D" />
      <path d="M38 73 L40 80 L42 73 L40 68Z" fill="#FECDD3" opacity="0.6" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#C2906A" />
      {/* Hair — dark, long, loose */}
      <ellipse cx="40" cy="30" rx="20" ry="23" fill="#1A0A00" />
      {/* Face */}
      <ellipse cx="40" cy="37" rx="16" ry="18" fill="#C2906A" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#C2906A" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#C2906A" />
      {/* Small earrings */}
      <circle cx="24" cy="40" r="2" fill="#BE185D" />
      <circle cx="56" cy="40" r="2" fill="#BE185D" />
      {/* Hair highlights / parting */}
      <path d="M40 14 Q42 22 41 27" stroke="#2D1800" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Eyes — sharp, focused */}
      <ellipse cx="33" cy="36" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="36" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="37" r="2.5" fill="#1A0A00" />
      <circle cx="48" cy="37" r="2.5" fill="#1A0A00" />
      <circle cx="34.8" cy="36.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="36.2" r="0.9" fill="white" />
      {/* Eyebrows — precise */}
      <path d="M29 32 Q33 30 37 31" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 31 Q47 30 51 32" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 42 Q37 45 38.5 46 Q40 47.5 41.5 46 Q43 45 41.5 42" stroke="#9B5A30" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — focused, tight */}
      <path d="M35 50 Q40 52 45 50" stroke="#9B5A30" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Selector
export function CharacterAvatar({ character, size = 80 }: { character: Character; size?: number }) {
  if (character === "neil")  return <NeilAvatar  size={size} />;
  if (character === "clara") return <ClaraAvatar size={size} />;
  if (character === "otto")  return <OttoAvatar  size={size} />;
  if (character === "stefan") return <StefanAvatar size={size} />;
  if (character === "priya") return <PriyaAvatar size={size} />;
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
          position={current.character === "stefan" ? "right" : "left"}
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
