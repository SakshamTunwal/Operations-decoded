"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Colour & name maps ───────────────────────────────────────────────────────

export const CHAR_COLORS: Record<string, string> = {
  maya:     "#0F766E",
  anita:    "#DC2626",
  richard:  "#1E40AF",
  jerome:   "#EA580C",
  derek:    "#6B7280",
  narrator: "#6B7280",
};

export const CHAR_NAMES: Record<string, string> = {
  maya:     "Maya",
  anita:    "Anita",
  richard:  "Richard",
  jerome:   "Jerome",
  derek:    "Derek",
  narrator: "Narrator",
};

// ─── SVG Avatars ──────────────────────────────────────────────────────────────

// Maya Chatterjee — Logistics Manager
// Teal blazer, medium-dark skin, short natural hair, analytical expression
export const MayaAvatar = memo(function MayaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F0FDFA" />
      {/* Blazer */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#0F766E" />
      {/* Lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65 L40 61Z" fill="#0D9488" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#A0785A" />
      {/* Hair — short natural */}
      <ellipse cx="40" cy="22" rx="18" ry="12" fill="#1A0800" />
      <ellipse cx="25" cy="28" rx="5" ry="7" fill="#1A0800" />
      <ellipse cx="55" cy="28" rx="5" ry="7" fill="#1A0800" />
      <ellipse cx="40" cy="19" rx="16" ry="8" fill="#2D1400" />
      {/* Face */}
      <ellipse cx="40" cy="39" rx="16" ry="17" fill="#A0785A" />
      {/* Ears */}
      <ellipse cx="24" cy="39" rx="3" ry="4" fill="#A0785A" />
      <ellipse cx="56" cy="39" rx="3" ry="4" fill="#A0785A" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="48" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — focused, analytical */}
      <path d="M29 33 Q33 31 37 32.5" stroke="#1A0800" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 32.5 Q47 31 51 33"  stroke="#1A0800" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#7A5030" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — determined, slight smile */}
      <path d="M34 51 Q40 54 46 51" stroke="#7A5030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Small earrings — teal dots */}
      <circle cx="24" cy="43" r="1.8" fill="#0F766E" />
      <circle cx="56" cy="43" r="1.8" fill="#0F766E" />
    </svg>
  );
});

// Anita Morales — Sales Director
// Red blazer, warm light skin, dark hair in ponytail, confident expression
export const AnitaAvatar = memo(function AnitaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FEF2F2" />
      {/* Red blazer */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#DC2626" />
      {/* Lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65 L40 61Z" fill="#EF4444" />
      {/* Blouse hint */}
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#FFF0F0" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#E8B08A" />
      {/* Hair — dark, long pulled back */}
      <ellipse cx="40" cy="26" rx="19" ry="20" fill="#1A0800" />
      {/* Ponytail */}
      <rect x="36" y="8"  width="8"  height="20" rx="4" fill="#1A0800" />
      <ellipse cx="40" cy="8" rx="5" ry="3" fill="#2D1400" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="16" ry="17" fill="#E8B08A" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#E8B08A" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#E8B08A" />
      {/* Small red earrings */}
      <circle cx="24" cy="42" r="2" fill="#DC2626" />
      <circle cx="56" cy="42" r="2" fill="#DC2626" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="48" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — strong, arched */}
      <path d="M29 33 Q33 30.5 37 32" stroke="#1A0800" strokeWidth="2" strokeLinecap="round" />
      <path d="M43 32 Q47 30.5 51 33" stroke="#1A0800" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#C07050" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — confident */}
      <path d="M34 51 Q40 54.5 46 51" stroke="#C07050" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Richard Keane — CFO
// Navy suit, glasses, light skin, silver-streaked hair, serious expression
export const RichardAvatar = memo(function RichardAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#EFF6FF" />
      {/* Navy suit */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#1E3A8A" />
      {/* Lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65 L40 61Z" fill="#2D4F9A" />
      {/* Tie */}
      <path d="M39 67 L37 72 L40 76 L43 72 L41 67Z" fill="#1E40AF" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#E0C0A8" />
      {/* Hair — silver-streaked, professional */}
      <ellipse cx="40" cy="24" rx="17" ry="11" fill="#8899AA" />
      <ellipse cx="40" cy="20" rx="14" ry="7" fill="#9BAABB" />
      {/* Silver streak */}
      <path d="M30 22 Q38 18 46 22" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <rect x="23" y="24" width="34" height="5" fill="#8899AA" />
      {/* Face */}
      <ellipse cx="40" cy="39" rx="16" ry="17" fill="#E0C0A8" />
      {/* Ears */}
      <ellipse cx="24" cy="39" rx="3" ry="4" fill="#E0C0A8" />
      <ellipse cx="56" cy="39" rx="3" ry="4" fill="#E0C0A8" />
      {/* Glasses */}
      <rect x="28" y="33" width="10" height="8" rx="3" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
      <rect x="42" y="33" width="10" height="8" rx="3" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
      <line x1="38" y1="37" x2="42" y2="37" stroke="#1E3A8A" strokeWidth="1.5" />
      <line x1="24" y1="37" x2="28" y2="37" stroke="#1E3A8A" strokeWidth="1.2" />
      <line x1="52" y1="37" x2="56" y2="37" stroke="#1E3A8A" strokeWidth="1.2" />
      {/* Eyes behind glasses */}
      <circle  cx="33" cy="37" r="2"  fill="#1A2030" />
      <circle  cx="47" cy="37" r="2"  fill="#1A2030" />
      <circle  cx="33.6" cy="36.4" r="0.7" fill="white" />
      <circle  cx="47.6" cy="36.4" r="0.7" fill="white" />
      {/* Eyebrows — stern */}
      <path d="M29 31.5 Q33 29.5 37 31" stroke="#506070" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 31 Q47 29.5 51 31.5" stroke="#506070" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 44 Q37 47 38.5 48 Q40 49.5 41.5 48 Q43 47 41.5 44" stroke="#B08060" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — serious, thin */}
      <path d="M34 52 Q40 53.5 46 52" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Jerome Vasquez — Atlas Freight account manager
// Orange vest/shirt, light-brown skin, short hair, professional smile
export const JeromeAvatar = memo(function JeromeAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FFF7ED" />
      {/* Base shirt */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 64 L40 66 L46 64 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#374151" />
      {/* Orange vest over shirt */}
      <path d="M10 80 L10 65 L22 62 L34 66 L40 68 L46 66 L58 62 L70 65 L70 80Z" fill="#EA580C" />
      {/* Vest reflective stripe */}
      <rect x="10" y="73" width="60" height="3" rx="1.5" fill="#FED7AA" opacity="0.9" />
      {/* Vest V-opening */}
      <path d="M34 66 L38 76 L40 68 L42 76 L46 66 L40 63Z" fill="#374151" />
      {/* Neck */}
      <rect x="33" y="53" width="14" height="11" rx="4" fill="#C09070" />
      {/* Short hair */}
      <ellipse cx="40" cy="22" rx="17" ry="9" fill="#2D1800" />
      <rect    x="23"  y="22" width="34" height="5" fill="#2D1800" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="17" ry="18" fill="#C09070" />
      {/* Ears */}
      <ellipse cx="23" cy="38" rx="3" ry="4" fill="#C09070" />
      <ellipse cx="57" cy="38" rx="3" ry="4" fill="#C09070" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="48" cy="38" r="2.5"  fill="#1A0800" />
      <circle  cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — relaxed, friendly */}
      <path d="M29 33 Q33 31.5 37 33" stroke="#1A0800" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 33 Q47 31.5 51 33" stroke="#1A0800" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#8B5020" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — professional smile */}
      <path d="M33 51 Q40 56 47 51" stroke="#8B5020" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 51.5 Q40 55 46 51.5" stroke="#8B5020" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
});

// Derek Hollis — Fleet logistics consultant (18 years)
// Grey jacket, medium skin, short grey-brown hair, pragmatic expression
export const DerekAvatar = memo(function DerekAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F9FAFB" />
      {/* Grey jacket */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#6B7280" />
      {/* Lapels */}
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65 L40 61Z" fill="#9CA3AF" />
      {/* Open collar shirt */}
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#F0F4F8" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#B89070" />
      {/* Hair — short grey-brown, receding slightly */}
      <ellipse cx="40" cy="25" rx="16" ry="9" fill="#808888" />
      <rect    x="24"  y="24" width="32" height="5" fill="#808888" />
      {/* Slight grey at temples */}
      <ellipse cx="26" cy="26" rx="4" ry="5" fill="#9AABAA" />
      <ellipse cx="54" cy="26" rx="4" ry="5" fill="#9AABAA" />
      {/* Face */}
      <ellipse cx="40" cy="39" rx="16" ry="17" fill="#B89070" />
      {/* Ears */}
      <ellipse cx="24" cy="39" rx="3" ry="4" fill="#B89070" />
      <ellipse cx="56" cy="39" rx="3" ry="4" fill="#B89070" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4"   ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4"   ry="4.5" fill="white" />
      <circle  cx="34" cy="38" r="2.5"  fill="#2D3030" />
      <circle  cx="48" cy="38" r="2.5"  fill="#2D3030" />
      <circle  cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle  cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows — pragmatic, slightly furrowed */}
      <path d="M29 33 Q33 31.5 37 32.5" stroke="#505858" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 32.5 Q47 31.5 51 33"  stroke="#505858" strokeWidth="1.8" strokeLinecap="round" />
      {/* Slight wrinkle lines */}
      <path d="M34 34.5 Q35 33.5 36 34.5" stroke="#A08060" strokeWidth="0.7" fill="none" opacity="0.5" />
      <path d="M44 34.5 Q45 33.5 46 34.5" stroke="#A08060" strokeWidth="0.7" fill="none" opacity="0.5" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#906040" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — measured, serious */}
      <path d="M34 51.5 Q40 53.5 46 51.5" stroke="#906040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Selector
export function CharacterAvatar({ character, size = 80 }: { character: Character; size?: number }) {
  if (character === "maya")    return <MayaAvatar    size={size} />;
  if (character === "anita")   return <AnitaAvatar   size={size} />;
  if (character === "richard") return <RichardAvatar size={size} />;
  if (character === "jerome")  return <JeromeAvatar  size={size} />;
  if (character === "derek")   return <DerekAvatar   size={size} />;
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
          position={current.character === "jerome" || current.character === "derek" ? "right" : "left"}
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
