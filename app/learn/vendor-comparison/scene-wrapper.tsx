"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── Scene Backgrounds ────────────────────────────────────────────────────────

function ProductionFloorBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Floor grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 70} y1="0" x2={i * 70 + 200} y2="500" stroke="#E8E4DD" strokeWidth="1" opacity="0.5" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 70} x2="800" y2={i * 70} stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
      {/* Conveyor belt */}
      <rect x="100" y="320" width="500" height="30" rx="4" fill="#E8E4DD" opacity="0.5" />
      <rect x="100" y="324" width="500" height="4" rx="2" fill="#D1CBC2" opacity="0.6" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={120 + i * 50} y="320" width="8" height="30" rx="4" fill="#D1CBC2" opacity="0.4" />
      ))}
      {/* Oil drums */}
      <ellipse cx="600" cy="215" rx="20" ry="10" fill="#E8E4DD" opacity="0.5" />
      <rect x="580" y="215" width="40" height="60" rx="2" fill="#E8E4DD" opacity="0.4" />
      <ellipse cx="600" cy="275" rx="20" ry="10" fill="#D1CBC2" opacity="0.5" />
      <ellipse cx="640" cy="215" rx="20" ry="10" fill="#E8E4DD" opacity="0.5" />
      <rect x="620" y="215" width="40" height="60" rx="2" fill="#E8E4DD" opacity="0.4" />
      <ellipse cx="640" cy="275" rx="20" ry="10" fill="#D1CBC2" opacity="0.5" />
      {/* Critical low level bar */}
      <rect x="582" y="257" width="36" height="8" rx="2" fill="#ef4444" opacity="0.15" />
      <text x="600" y="250" textAnchor="middle" fontSize="8" fill="#9CA3AF" opacity="0.7" fontFamily="sans-serif">LOW</text>
    </svg>
  );
}

function OfficeDeskBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk surface */}
      <rect x="80" y="340" width="640" height="12" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Monitor */}
      <rect x="300" y="200" width="200" height="130" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="310" y="210" width="180" height="110" rx="3" fill="#F5F0E8" opacity="0.6" />
      <rect x="388" y="330" width="24" height="14" fill="#D1CBC2" opacity="0.5" />
      <rect x="370" y="343" width="60" height="5" rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Papers */}
      <rect x="540" y="295" width="100" height="44" rx="3" fill="white" opacity="0.7" transform="rotate(-3 540 295)" />
      <rect x="545" y="302" width="90" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-3 545 302)" />
      <rect x="545" y="308" width="80" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-3 545 308)" />
      {/* Coffee mug */}
      <rect x="155" y="305" width="28" height="30" rx="4" fill="#E8E4DD" opacity="0.5" />
      <path d="M183 315 Q195 315 195 322 Q195 330 183 330" stroke="#D1CBC2" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Plant */}
      <rect x="680" y="300" width="12" height="40" rx="3" fill="#D1CBC2" opacity="0.5" />
      <ellipse cx="686" cy="295" rx="18" ry="14" fill="#BDD9C0" opacity="0.35" />
      {/* Floor stripe */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function EmailInboxBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Screen frame */}
      <rect x="120" y="60" width="560" height="380" rx="10" fill="#F5F0E8" opacity="0.4" />
      <rect x="130" y="70" width="540" height="360" rx="6" fill="white" opacity="0.35" />
      {/* Inbox rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="140" y={90 + i * 85} width="520" height="70" rx="4" fill={i === 0 ? "#FEF3C7" : "white"} opacity={i === 0 ? "0.6" : "0.5"} />
          <rect x="155" y={105 + i * 85} width="80" height="8" rx="2" fill="#E8E4DD" opacity="0.8" />
          <rect x="155" y={120 + i * 85} width="200" height="6" rx="2" fill="#E8E4DD" opacity="0.5" />
          <rect x="155" y={133 + i * 85} width="150" height="5" rx="2" fill="#E8E4DD" opacity="0.35" />
          {i === 0 && <circle cx="635" cy={125 + i * 85} r="8" fill="#f59e0b" opacity="0.5" />}
        </g>
      ))}
    </svg>
  );
}

function ScorecardBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Table frame */}
      <rect x="80" y="80" width="640" height="340" rx="8" fill="white" opacity="0.3" stroke="#E8E4DD" strokeWidth="2" />
      {/* Header row */}
      <rect x="80" y="80" width="640" height="40" rx="8" fill="#F5F0E8" opacity="0.5" />
      {/* Column dividers */}
      {[240, 390, 540].map((x) => (
        <line key={x} x1={x} y1="80" x2={x} y2="420" stroke="#E8E4DD" strokeWidth="1" opacity="0.6" />
      ))}
      {/* Row dividers */}
      {[120, 160, 200, 240, 280, 320, 360].map((y) => (
        <line key={y} x1="80" y1={y} x2="720" y2={y} stroke="#E8E4DD" strokeWidth="0.8" opacity="0.5" />
      ))}
      {/* Score bar hints */}
      {[1, 2, 3, 4, 5, 6].map((r) => (
        <rect key={r} x="250" y={125 + r * 40 - 10} width={Math.random() * 80 + 20} height="8" rx="2" fill="#f59e0b" opacity="0.12" />
      ))}
    </svg>
  );
}

function PhoneCallBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Office desk */}
      <rect x="80" y="350" width="640" height="12" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Phone handset */}
      <rect x="180" y="220" width="60" height="120" rx="20" fill="#E8E4DD" opacity="0.4" />
      <rect x="185" y="235" width="50" height="40" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Cable */}
      <path d="M 210 340 Q 210 380 260 380" stroke="#D1CBC2" strokeWidth="3" fill="none" strokeDasharray="4 3" opacity="0.4" />
      {/* Notepad */}
      <rect x="400" y="240" width="150" height="100" rx="4" fill="white" opacity="0.6" />
      <rect x="415" y="258" width="120" height="2" rx="1" fill="#E8E4DD" opacity="0.8" />
      <rect x="415" y="268" width="100" height="2" rx="1" fill="#E8E4DD" opacity="0.8" />
      <rect x="415" y="278" width="90" height="2" rx="1" fill="#f59e0b" opacity="0.2" />
      <rect x="415" y="288" width="110" height="2" rx="1" fill="#E8E4DD" opacity="0.8" />
      {/* Monitor on desk */}
      <rect x="540" y="200" width="160" height="120" rx="6" fill="#E8E4DD" opacity="0.4" />
      <rect x="550" y="210" width="140" height="100" rx="3" fill="#F5F0E8" opacity="0.5" />
    </svg>
  );
}

function ConferenceRoomBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Conference table */}
      <ellipse cx="400" cy="330" rx="280" ry="80" fill="#E8E4DD" opacity="0.35" />
      <ellipse cx="400" cy="320" rx="280" ry="80" fill="#D1CBC2" opacity="0.3" />
      {/* Chairs around table */}
      {[-200, -120, -40, 40, 120, 200].map((offset) => (
        <rect key={offset} x={400 + offset - 18} y="285" width="36" height="30" rx="6" fill="#E8E4DD" opacity="0.4" />
      ))}
      {[-160, -60, 60, 160].map((offset) => (
        <rect key={offset} x={400 + offset - 18} y="375" width="36" height="30" rx="6" fill="#E8E4DD" opacity="0.4" />
      ))}
      {/* Presentation screen on wall */}
      <rect x="220" y="60" width="360" height="220" rx="8" fill="#F5F0E8" opacity="0.4" />
      <rect x="230" y="70" width="340" height="200" rx="4" fill="white" opacity="0.3" />
      {/* Chart hint on screen */}
      {[60, 100, 80, 120, 95].map((h, i) => (
        <rect key={i} x={270 + i * 60} y={250 - h} width="30" height={h} rx="2" fill="#f59e0b" opacity="0.1" />
      ))}
    </svg>
  );
}

function PODocumentBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Main document */}
      <rect x="220" y="60" width="360" height="380" rx="8" fill="white" opacity="0.5" />
      <rect x="220" y="60" width="360" height="8" rx="4" fill="#f59e0b" opacity="0.3" />
      {/* Document lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="250" y={90 + i * 30} width={200 + (i % 3) * 40} height="6" rx="2" fill="#E8E4DD" opacity="0.6" />
      ))}
      {/* Stamp area bottom right */}
      <rect x="460" y="360" width="100" height="50" rx="4" fill="#FEF3C7" opacity="0.4" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" />
      {/* Background doc stack */}
      <rect x="200" y="80" width="360" height="380" rx="8" fill="#F5F0E8" opacity="0.3" transform="rotate(-3 200 80)" />
      <rect x="215" y="70" width="360" height="380" rx="8" fill="#F5F0E8" opacity="0.25" transform="rotate(-1.5 215 70)" />
    </svg>
  );
}

const BG_MAP: Record<number, React.FC> = {
  1: ProductionFloorBg,
  2: OfficeDeskBg,
  3: EmailInboxBg,
  4: ScorecardBg,
  5: PhoneCallBg,
  6: ConferenceRoomBg,
  7: PODocumentBg,
};

const BG_GRADIENT: Record<number, string> = {
  1: "from-[#F5F0E8] to-[#FAFAF7]",
  2: "from-[#F0F2FA] to-[#FAFAF7]",
  3: "from-[#F5F0E8] to-[#FAFAF7]",
  4: "from-[#F5F0E8] to-[#FAFAF7]",
  5: "from-[#F0EBE0] to-[#FAFAF7]",
  6: "from-[#FAFAF7] to-[#F5F3FF]",
  7: "from-[#FFFBF0] to-[#FAFAF7]",
};

// ─── SceneWrapper ─────────────────────────────────────────────────────────────

export function SceneWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  const Bg = BG_MAP[step] ?? (() => null);
  const gradient = BG_GRADIENT[step] ?? "from-[#FAFAF7] to-[#FAFAF7]";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} min-h-[460px]`}>
      {/* Background illustration */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.55]"
        animate={{ scale: [1, 1.025, 1], x: [0, 4, 0], y: [0, -3, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bg />
      </motion.div>
      {/* Foreground content */}
      <div className="relative z-10 p-6 md:p-8">{children}</div>
    </div>
  );
}

// ─── LocationHeaderOverlay ────────────────────────────────────────────────────

interface LocationHeaderProps {
  location: string;
  time: string;
  visible: boolean;
  onDone: () => void;
}

export function LocationHeaderOverlay({ location, time, visible, onDone }: LocationHeaderProps) {
  const words = location.split(" ");
  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loc-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="text-center px-8"
          >
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#f59e0b] text-xs font-bold uppercase tracking-[0.3em] mb-3"
            >
              {time}
            </motion.p>
            <h2
              className="text-white text-3xl md:text-4xl font-bold tracking-tight flex flex-wrap justify-center gap-x-3"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.08, type: "spring", stiffness: 320, damping: 24 }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-0.5 bg-[#f59e0b] origin-center mx-auto"
              style={{ width: 64 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scene transition variants ────────────────────────────────────────────────

export const sceneVariants: Variants = {
  initial: {
    x: 60,
    opacity: 0,
    scale: 0.97,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    x: -60,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
