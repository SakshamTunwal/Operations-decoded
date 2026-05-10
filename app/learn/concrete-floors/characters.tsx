"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, DialogueLine } from "./types";

// ─── Colour & name maps ───────────────────────────────────────────────────────

export const CHAR_COLORS: Record<string, string> = {
  andre:    "#1E3A5F",
  fatima:   "#9333EA",
  chidi:    "#EA580C",
  priya:    "#0D9488",
  yuki:     "#BE185D",
  ben:      "#374151",
  narrator: "#6B7280",
};

export const CHAR_NAMES: Record<string, string> = {
  andre:    "Andre",
  fatima:   "Fatima",
  chidi:    "Chidi",
  priya:    "Priya",
  yuki:     "Yuki",
  ben:      "Ben",
  narrator: "Narrator",
};

// ─── SVG Avatars ──────────────────────────────────────────────────────────────

// Andre Osei — Warehouse Optimisation Lead
// Navy polo, dark skin, short cropped hair, calm expression
export const AndreAvatar = memo(function AndreAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#DBEAFE" />
      {/* Polo shirt */}
      <path d="M0 80 L0 64 Q0 58 10 58 L22 61 L34 65 L40 67 L46 65 L58 61 L70 58 Q80 58 80 64 L80 80Z" fill="#1E3A5F" />
      <path d="M34 65 L38 74 L40 67 L42 74 L46 65 L40 61Z" fill="#2D4F7A" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="11" rx="4" fill="#8B5E3C" />
      {/* Face */}
      <ellipse cx="40" cy="41" rx="17" ry="18" fill="#8B5E3C" />
      {/* Ears */}
      <ellipse cx="23" cy="41" rx="3" ry="4" fill="#8B5E3C" />
      <ellipse cx="57" cy="41" rx="3" ry="4" fill="#8B5E3C" />
      {/* Short cropped hair */}
      <ellipse cx="40" cy="26" rx="17" ry="8" fill="#0D0700" />
      <rect x="23" y="25" width="34" height="5" fill="#0D0700" />
      {/* Eyes */}
      <ellipse cx="33" cy="40" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="40" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="41" r="2.5" fill="#0D0700" />
      <circle cx="48" cy="41" r="2.5" fill="#0D0700" />
      <circle cx="34.8" cy="40.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="40.2" r="0.9" fill="white" />
      {/* Eyebrows — steady, confident */}
      <path d="M29 36 Q33 34 37 35.5" stroke="#0D0700" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M43 35.5 Q47 34 51 36" stroke="#0D0700" strokeWidth="1.6" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 46 Q37 49 38.5 50 Q40 51.5 41.5 50 Q43 49 41.5 46" stroke="#6B3A1F" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — calm, focused */}
      <path d="M35 53 Q40 55.5 45 53" stroke="#6B3A1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Fatima Al-Rashid — Deputy Warehouse Manager
// Purple blouse, warm tan skin, hijab
export const FatimaAvatar = memo(function FatimaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F3E8FF" />
      {/* Blouse */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#7C3AED" />
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#6D28D9" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#D4A574" />
      {/* Hijab */}
      <ellipse cx="40" cy="32" rx="22" ry="20" fill="#9333EA" />
      <ellipse cx="40" cy="35" rx="18" ry="16" fill="#A855F7" />
      {/* Face */}
      <ellipse cx="40" cy="40" rx="15" ry="16" fill="#D4A574" />
      {/* Eyes */}
      <ellipse cx="34" cy="39" rx="3.5" ry="4" fill="white" />
      <ellipse cx="46" cy="39" rx="3.5" ry="4" fill="white" />
      <circle cx="35" cy="40" r="2.2" fill="#1A0F00" />
      <circle cx="47" cy="40" r="2.2" fill="#1A0F00" />
      <circle cx="35.7" cy="39.3" r="0.8" fill="white" />
      <circle cx="47.7" cy="39.3" r="0.8" fill="white" />
      {/* Eyebrows — precise */}
      <path d="M30 36 Q34 34.5 37 35.5" stroke="#1A0F00" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 35.5 Q46 34.5 50 36" stroke="#1A0F00" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M39 44 Q38 46.5 39 47 Q40 48 41 47 Q42 46.5 41 44" stroke="#B8875A" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Mouth — composed */}
      <path d="M36 50 Q40 52 44 50" stroke="#B8875A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Chidi Nwosu — Lead Picker
// Orange safety vest, dark skin, strong build
export const ChidiAvatar = memo(function ChidiAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FFF7ED" />
      {/* Base shirt */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 64 L40 66 L46 64 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#374151" />
      {/* Safety vest */}
      <path d="M10 80 L10 65 L22 62 L34 66 L40 68 L46 66 L58 62 L70 65 L70 80Z" fill="#f97316" />
      <rect x="10" y="73" width="60" height="3" rx="1.5" fill="#FEF3C7" opacity="0.9" />
      <path d="M34 66 L38 76 L40 68 L42 76 L46 66 L40 63Z" fill="#374151" />
      {/* Neck */}
      <rect x="33" y="53" width="14" height="11" rx="4" fill="#6B3A1F" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="17" ry="19" fill="#6B3A1F" />
      {/* Ears */}
      <ellipse cx="23" cy="38" rx="3" ry="4" fill="#6B3A1F" />
      <ellipse cx="57" cy="38" rx="3" ry="4" fill="#6B3A1F" />
      {/* Short hair */}
      <ellipse cx="40" cy="22" rx="17" ry="9" fill="#0D0700" />
      <rect x="23" y="22" width="34" height="6" fill="#0D0700" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="38" r="2.5" fill="#0D0700" />
      <circle cx="48" cy="38" r="2.5" fill="#0D0700" />
      <circle cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows */}
      <path d="M29 33 Q33 31.5 37 33" stroke="#0D0700" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 33 Q47 31.5 51 33" stroke="#0D0700" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#4D2010" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — confident smile */}
      <path d="M33 50 Q40 55 47 50" stroke="#4D2010" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Priya Banerjee — WMS Implementation Specialist
// Teal top, South Asian skin, glasses
export const PriyaAvatar = memo(function PriyaAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F0FDFA" />
      {/* Top */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#0D9488" />
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#0F766E" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#C8965C" />
      {/* Hair */}
      <ellipse cx="40" cy="28" rx="19" ry="20" fill="#1A0F00" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="16" ry="17" fill="#C8965C" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#C8965C" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#C8965C" />
      {/* Glasses frames */}
      <rect x="27" y="34" rx="4" width="14" height="10" fill="none" stroke="#374151" strokeWidth="1.5" />
      <rect x="45" y="34" rx="4" width="14" height="10" fill="none" stroke="#374151" strokeWidth="1.5" />
      <line x1="41" y1="38" x2="45" y2="38" stroke="#374151" strokeWidth="1.5" />
      {/* Eyes behind glasses */}
      <ellipse cx="34" cy="38" rx="3" ry="3.5" fill="white" />
      <ellipse cx="52" cy="38" rx="3" ry="3.5" fill="white" />
      <circle cx="34.5" cy="38.5" r="2" fill="#1A0F00" />
      <circle cx="52.5" cy="38.5" r="2" fill="#1A0F00" />
      <circle cx="35" cy="38" r="0.7" fill="white" />
      <circle cx="53" cy="38" r="0.7" fill="white" />
      {/* Eyebrows */}
      <path d="M28 33 Q34 31 38 33" stroke="#1A0F00" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M46 33 Q50 31 56 33" stroke="#1A0F00" strokeWidth="1.3" strokeLinecap="round" />
      {/* Nose */}
      <path d="M39 44 Q38 46 39 47 Q40 48 41 47 Q42 46 41 44" stroke="#A07040" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Mouth — thoughtful */}
      <path d="M36 50 Q40 52 44 50" stroke="#A07040" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* Hair drape on sides */}
      <ellipse cx="22" cy="34" rx="4" ry="10" fill="#1A0F00" />
      <ellipse cx="58" cy="34" rx="4" ry="10" fill="#1A0F00" />
    </svg>
  );
});

// Yuki Tanaka — Returns Processing Lead
// Pink top, East Asian features, ponytail
export const YukiAvatar = memo(function YukiAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#FDF2F8" />
      {/* Top */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#BE185D" />
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#9D174D" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#F0D0B0" />
      {/* Hair */}
      <ellipse cx="40" cy="28" rx="18" ry="18" fill="#1A0F00" />
      {/* Ponytail */}
      <ellipse cx="58" cy="22" rx="6" ry="8" fill="#1A0F00" />
      <path d="M50 25 Q56 20 58 14" stroke="#1A0F00" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="15" ry="17" fill="#F0D0B0" />
      {/* Ears */}
      <ellipse cx="25" cy="38" rx="2.5" ry="3.5" fill="#F0D0B0" />
      <ellipse cx="55" cy="38" rx="2.5" ry="3.5" fill="#F0D0B0" />
      {/* Eyes */}
      <ellipse cx="34" cy="37" rx="3.5" ry="4" fill="white" />
      <ellipse cx="46" cy="37" rx="3.5" ry="4" fill="white" />
      <circle cx="34.5" cy="38" r="2.2" fill="#1A0F00" />
      <circle cx="46.5" cy="38" r="2.2" fill="#1A0F00" />
      <circle cx="35" cy="37.3" r="0.8" fill="white" />
      <circle cx="47" cy="37.3" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M30 34 Q34 32.5 37 34" stroke="#1A0F00" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M43 34 Q46 32.5 50 34" stroke="#1A0F00" strokeWidth="1.3" strokeLinecap="round" />
      {/* Nose */}
      <path d="M39 43 Q38 45 39 46 Q40 47 41 46 Q42 45 41 43" stroke="#C0A080" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Mouth — composed smile */}
      <path d="M36 50 Q40 52.5 44 50" stroke="#C0A080" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Ben Calloway — Operations Director
// Charcoal suit, fair skin, silver-gray hair
export const BenAvatar = memo(function BenAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#F3F4F6" />
      {/* Suit */}
      <path d="M0 80 L0 62 Q0 56 10 56 L22 60 L34 65 L40 67 L46 65 L58 60 L70 56 Q80 56 80 62 L80 80Z" fill="#374151" />
      <path d="M34 65 L38 76 L40 67 L42 76 L46 65" fill="#4B5563" />
      <path d="M38 76 L40 80 L42 76 L40 68Z" fill="#E5E7EB" />
      {/* Neck */}
      <rect x="33" y="54" width="14" height="10" rx="4" fill="#E8C8A8" />
      {/* Hair */}
      <ellipse cx="40" cy="26" rx="18" ry="10" fill="#9CA3AF" />
      <rect x="22" y="25" width="36" height="5" fill="#9CA3AF" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="16" ry="18" fill="#E8C8A8" />
      {/* Ears */}
      <ellipse cx="24" cy="38" rx="3" ry="4" fill="#E8C8A8" />
      <ellipse cx="56" cy="38" rx="3" ry="4" fill="#E8C8A8" />
      {/* Eyes */}
      <ellipse cx="33" cy="37" rx="4" ry="4.5" fill="white" />
      <ellipse cx="47" cy="37" rx="4" ry="4.5" fill="white" />
      <circle cx="34" cy="38" r="2.5" fill="#374151" />
      <circle cx="48" cy="38" r="2.5" fill="#374151" />
      <circle cx="34.8" cy="37.2" r="0.9" fill="white" />
      <circle cx="48.8" cy="37.2" r="0.9" fill="white" />
      {/* Eyebrows */}
      <path d="M29 33 Q33 31 37 33" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 33 Q47 31 51 33" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38.5 43 Q37 46 38.5 47 Q40 48.5 41.5 47 Q43 46 41.5 43" stroke="#C0A080" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Mouth — measured */}
      <path d="M35 51 Q40 53 45 51" stroke="#C0A080" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
});

// Selector
export function CharacterAvatar({ character, size = 80 }: { character: Character; size?: number }) {
  if (character === "andre")  return <AndreAvatar  size={size} />;
  if (character === "fatima") return <FatimaAvatar size={size} />;
  if (character === "chidi")  return <ChidiAvatar  size={size} />;
  if (character === "priya")  return <PriyaAvatar  size={size} />;
  if (character === "yuki")   return <YukiAvatar   size={size} />;
  if (character === "ben")    return <BenAvatar    size={size} />;
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

  const rightChars = ["chidi", "priya", "yuki", "ben"];

  return (
    <div className="flex flex-col gap-3 cursor-pointer select-none" onClick={handleClick}>
      <AnimatePresence mode="wait">
        <DialogueBubble
          key={idx}
          character={current.character}
          text={current.text}
          position={rightChars.includes(current.character) ? "right" : "left"}
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
