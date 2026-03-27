"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DialogueLine, Character } from "./types";

// ─── Avatars ───────────────────────────────────────────────────────────────────

function ZaraAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#D1FAE5" rx="10" />
      <ellipse cx="24" cy="13" rx="10" ry="7" fill="#1C1917" />
      <circle cx="15" cy="16" r="4" fill="#1C1917" />
      <circle cx="33" cy="16" r="4" fill="#1C1917" />
      <circle cx="24" cy="19" r="8" fill="#78350F" />
      <circle cx="21" cy="19" r="1.2" fill="#1C1917" />
      <circle cx="27" cy="19" r="1.2" fill="#1C1917" />
      <path d="M21 23 Q24 25 27 23" stroke="#7C3AED" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M16 32 Q24 36 32 32 L28 48 L20 48 Z" fill="#059669" />
    </svg>
  );
}

function KwameAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#EFF6FF" rx="10" />
      <ellipse cx="24" cy="13" rx="8.5" ry="5" fill="#1C1917" />
      <circle cx="24" cy="19" r="8" fill="#78350F" />
      <circle cx="21" cy="19" r="1.2" fill="#1C1917" />
      <circle cx="27" cy="19" r="1.2" fill="#1C1917" />
      <path d="M21 23 Q24 25.5 27 23" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Hi-vis vest */}
      <path d="M16 32 Q24 36 32 32 L30 48 L18 48 Z" fill="#F59E0B" />
      <rect x="20" y="34" width="8" height="2" rx="1" fill="#1C1917" opacity="0.4" />
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

function MargaretAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#F9FAFB" rx="10" />
      <ellipse cx="24" cy="13" rx="9" ry="6" fill="#9CA3AF" />
      <rect x="15" y="13" width="18" height="8" fill="#9CA3AF" />
      <circle cx="24" cy="19" r="7" fill="#F3D5C0" />
      <circle cx="21.5" cy="18" r="1.2" fill="#374151" />
      <circle cx="26.5" cy="18" r="1.2" fill="#374151" />
      <path d="M21.5 22 Q24 23.5 26.5 22" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M15 32 Q24 35 33 32 L31 48 L17 48 Z" fill="#1F2937" />
      <path d="M22 32 L24 36 L26 32" fill="white" />
    </svg>
  );
}

function PatrickAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#FFF7ED" rx="10" />
      <ellipse cx="24" cy="12" rx="8" ry="4.5" fill="#92400E" />
      <circle cx="24" cy="19" r="7" fill="#FED7AA" />
      <circle cx="21.5" cy="18" r="1.2" fill="#374151" />
      <circle cx="26.5" cy="18" r="1.2" fill="#374151" />
      <path d="M21.5 22 Q24 24 26.5 22" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M15 32 Q24 36 33 32 L31 48 L17 48 Z" fill="#3B82F6" />
      <path d="M23 32 L24 38 L25 32" fill="#1E3A8A" />
    </svg>
  );
}

function NarratorIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#F0FDF4" />
      <circle cx="24" cy="24" r="13" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
      <text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="700" fill="#10B981">◈</text>
    </svg>
  );
}

function getAvatar(character: Character, size: number) {
  switch (character) {
    case "zara":     return <ZaraAvatar size={size} />;
    case "kwame":    return <KwameAvatar size={size} />;
    case "isabelle": return <IsabelleAvatar size={size} />;
    case "margaret": return <MargaretAvatar size={size} />;
    case "patrick":  return <PatrickAvatar size={size} />;
    case "narrator": return <NarratorIcon size={size} />;
  }
}

const CHARACTER_NAMES: Record<Character, string> = {
  zara:      "Zara Okafor",
  kwame:     "Kwame Asante",
  isabelle:  "Isabelle Renaud",
  margaret:  "Margaret Osei",
  patrick:   "Patrick Callahan",
  narrator:  "Narrator",
};

const CHARACTER_COLORS: Record<Character, string> = {
  zara:      "bg-[#D1FAE5] border-[#10B981]/30",
  kwame:     "bg-[#EFF6FF] border-blue-200",
  isabelle:  "bg-[#F5F3FF] border-purple-200",
  margaret:  "bg-[#F9FAFB] border-gray-200",
  patrick:   "bg-[#FFF7ED] border-orange-200",
  narrator:  "bg-[#F0FDF4] border-[#10B981]/20",
};

const LABEL_COLORS: Record<Character, string> = {
  zara:      "text-[#065F46]",
  kwame:     "text-blue-700",
  isabelle:  "text-purple-700",
  margaret:  "text-gray-700",
  patrick:   "text-orange-700",
  narrator:  "text-[#10B981]",
};

// ─── DialogueBubble ────────────────────────────────────────────────────────────

export function DialogueBubble({ line, onDone }: { line: DialogueLine; onDone: () => void }) {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = line.text.split(" ");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisibleWords(0);
    let i = 0;
    const tick = () => {
      i++;
      setVisibleWords(i);
      if (i < words.length) timerRef.current = setTimeout(tick, 48);
      else timerRef.current = null;
    };
    timerRef.current = setTimeout(tick, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [line.text]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = visibleWords >= words.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 flex items-start gap-3 ${CHARACTER_COLORS[line.character]}`}
    >
      <div className="flex-shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm">
        {getAvatar(line.character, 44)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${LABEL_COLORS[line.character]}`}>
          {CHARACTER_NAMES[line.character]}
        </p>
        <p className="text-sm text-[#1A1A1A] leading-relaxed">
          {words.slice(0, visibleWords).join(" ")}
          {!done && <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 animate-pulse align-middle" />}
        </p>
        {done && (
          <button
            suppressHydrationWarning
            onClick={onDone}
            className="mt-2 text-[10px] font-bold text-[#10B981] hover:text-[#065F46] transition-colors cursor-pointer"
          >
            Continue →
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── DialogueSequence ─────────────────────────────────────────────────────────

export function DialogueSequence({ lines, onComplete }: { lines: DialogueLine[]; onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const next = () => { if (idx + 1 < lines.length) setIdx(idx + 1); else onComplete(); };
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">
        <DialogueBubble key={idx} line={lines[idx]} onDone={next} />
      </AnimatePresence>
      <div className="flex items-center gap-1 mt-1">
        {lines.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-4 bg-[#10B981]" : i < idx ? "w-2 bg-[#A7F3D0]" : "w-2 bg-[#E8E4DD]"}`} />
        ))}
        <p className="text-[9px] text-[#9CA3AF] ml-1">{idx + 1}/{lines.length}</p>
      </div>
    </div>
  );
}

// ─── Character exports ─────────────────────────────────────────────────────────

export { ZaraAvatar, KwameAvatar, IsabelleAvatar, MargaretAvatar, PatrickAvatar };
