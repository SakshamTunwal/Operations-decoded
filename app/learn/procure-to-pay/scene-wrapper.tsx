"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── Scene Backgrounds ────────────────────────────────────────────────────────

function FactoryFloorBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Floor grid lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 70} y1="0" x2={i * 70 + 200} y2="500" stroke="#E8E4DD" strokeWidth="1" opacity="0.5" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 70} x2="800" y2={i * 70} stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
      {/* Conveyor belt hint */}
      <rect x="100" y="320" width="500" height="30" rx="4" fill="#E8E4DD" opacity="0.5" />
      <rect x="100" y="324" width="500" height="4"  rx="2" fill="#D1CBC2" opacity="0.6" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={120 + i * 50} y="320" width="8" height="30" rx="4" fill="#D1CBC2" opacity="0.4" />
      ))}
      {/* Stock bin silhouette */}
      <rect x="580" y="200" width="80" height="100" rx="4" fill="#E8E4DD" opacity="0.4" />
      <rect x="585" y="205" width="70" height="6"   rx="2" fill="#D97706" opacity="0.3" />
      <text x="620" y="260" textAnchor="middle" fontSize="10" fill="#9CA3AF" opacity="0.8" fontFamily="sans-serif">Stn 4</text>
    </svg>
  );
}

function OfficeDesKBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk surface */}
      <rect x="80" y="340" width="640" height="12" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Monitor */}
      <rect x="300" y="200" width="200" height="130" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="310" y="210" width="180" height="110" rx="3" fill="#F5F0E8" opacity="0.6" />
      <rect x="388" y="330" width="24" height="14"  fill="#D1CBC2" opacity="0.5" />
      <rect x="370" y="343" width="60" height="5"   rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Papers */}
      <rect x="540" y="295" width="100" height="44" rx="3" fill="white" opacity="0.7" transform="rotate(-3 540 295)" />
      <rect x="545" y="302" width="90"  height="2"  rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-3 545 302)" />
      <rect x="545" y="308" width="80"  height="2"  rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-3 545 308)" />
      {/* Plant */}
      <rect  x="680" y="300" width="12" height="40" rx="3" fill="#D1CBC2" opacity="0.5" />
      <ellipse cx="686" cy="295" rx="18" ry="14" fill="#BDD9C0" opacity="0.35" />
      {/* Floor stripe */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function ProcurementScreenBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Grid lines - chart feel */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="60" y1={80 + i * 60} x2="740" y2={80 + i * 60} stroke="#E8E4DD" strokeWidth="1" opacity="0.6" />
      ))}
      {/* Bar chart hints */}
      {[140, 110, 165, 90, 155].map((h, i) => (
        <rect key={i} x={120 + i * 100} y={380 - h} width="50" height={h} rx="4" fill="#f59e0b" opacity="0.08" />
      ))}
      {/* Screen frame */}
      <rect x="50" y="50" width="700" height="400" rx="8" fill="none" stroke="#E8E4DD" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function PODispatchBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Center divider */}
      <line x1="400" y1="0" x2="400" y2="500" stroke="#E8E4DD" strokeWidth="2" strokeDasharray="8 6" opacity="0.5" />
      {/* Left side label – Nexara */}
      <text x="180" y="60" textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="sans-serif" opacity="0.7" fontWeight="600">NEXARA</text>
      {/* Right side label – Vendor */}
      <text x="620" y="60" textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="sans-serif" opacity="0.7" fontWeight="600">CRESTLINE</text>
      {/* Office hints left */}
      <rect x="60"  y="120" width="220" height="140" rx="6" fill="#F5F0E8" opacity="0.4" />
      {/* Warehouse hints right */}
      <rect x="520" y="120" width="220" height="140" rx="6" fill="#F0EBE0" opacity="0.4" />
      <rect x="530" y="130" width="200" height="8"  rx="2" fill="#E8E4DD" opacity="0.5" />
      {/* Dotted bridge line */}
      <path d="M 280 190 Q 400 140 520 190" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 5" fill="none" opacity="0.3" />
    </svg>
  );
}

function WarehouseBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Concrete floor lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={300 + i * 22} x2="800" y2={300 + i * 22} stroke="#E8E4DD" strokeWidth="1" opacity="0.5" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 60} y1="290" x2={i * 60 + 20} y2="500" stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
      {/* Roller shutter */}
      <rect x="520" y="80" width="220" height="240" rx="4" fill="#F0EBE0" opacity="0.5" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1="520" y1={80 + i * 24} x2="740" y2={80 + i * 24} stroke="#D1CBC2" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* Shelving */}
      <rect x="60"  y="100" width="30" height="200" rx="2" fill="#E8E4DD" opacity="0.4" />
      <rect x="60"  y="160" width="180" height="6"  rx="2" fill="#E8E4DD" opacity="0.5" />
      <rect x="60"  y="220" width="180" height="6"  rx="2" fill="#E8E4DD" opacity="0.5" />
    </svg>
  );
}

function AccountsDeskBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk */}
      <rect x="60" y="350" width="680" height="14" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Paper stacks */}
      {[200, 220, 240].map((y, i) => (
        <rect key={i} x={90 + i * 4} y={y} width="120" height="8" rx="2" fill="white" opacity="0.8" transform={`rotate(${(i - 1) * 3} 150 260)`} />
      ))}
      {/* Calculator hint */}
      <rect x="520" y="270" width="80" height="100" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="528" y="278" width="64" height="30"  rx="3" fill="#D1CBC2" opacity="0.6" />
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((j) => (
        <rect key={j} x={528 + (j % 3) * 23} y={318 + Math.floor(j / 3) * 16} width="16" height="12" rx="2" fill="white" opacity="0.7" />
      ))}
      {/* Filing cabinet */}
      <rect x="680" y="200" width="70" height="160" rx="4" fill="#E8E4DD" opacity="0.45" />
      <line x1="680" y1="280" x2="750" y2="280" stroke="#D1CBC2" strokeWidth="2" opacity="0.6" />
      <rect x="700" y="272" width="30" height="6" rx="3" fill="#D1CBC2" opacity="0.7" />
    </svg>
  );
}

function FinanceOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Warm radial gradient hint */}
      <defs>
        <radialGradient id="finGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#FEF3C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FAFAF7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="500" fill="url(#finGrad)" />
      {/* Clean desk */}
      <rect x="80" y="350" width="640" height="12" rx="4" fill="#E8E4DD" opacity="0.4" />
      {/* Bank icon hints */}
      <rect x="100" y="180" width="100" height="140" rx="6" fill="#F5F0E8" opacity="0.5" />
      <rect x="100" y="155" width="100" height="28"  rx="4" fill="#E8E4DD" opacity="0.5" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={112 + i * 22} y="185" width="12" height="130" rx="2" fill="#E8E4DD" opacity="0.5" />
      ))}
      {/* Arrow / transfer line */}
      <path d="M 260 250 Q 400 180 540 250" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 5" fill="none" opacity="0.25" />
      <polygon points="535,243 548,250 535,257" fill="#f59e0b" opacity="0.25" />
      {/* Second bank */}
      <rect x="600" y="180" width="100" height="140" rx="6" fill="#F5F0E8" opacity="0.5" />
      <rect x="600" y="155" width="100" height="28"  rx="4" fill="#E8E4DD" opacity="0.5" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={612 + i * 22} y="185" width="12" height="130" rx="2" fill="#E8E4DD" opacity="0.5" />
      ))}
    </svg>
  );
}

const BG_MAP: Record<number, React.FC> = {
  1: FactoryFloorBg,
  2: OfficeDesKBg,
  3: ProcurementScreenBg,
  4: PODispatchBg,
  5: WarehouseBg,
  6: AccountsDeskBg,
  7: FinanceOfficeBg,
};

const BG_GRADIENT: Record<number, string> = {
  1: "from-[#F5F0E8] to-[#FAFAF7]",
  2: "from-[#F0F2FA] to-[#FAFAF7]",
  3: "from-[#F5F0E8] to-[#FAFAF7]",
  4: "from-[#F5F0E8] to-[#FAFAF7]",
  5: "from-[#F0EBE0] to-[#FAFAF7]",
  6: "from-[#FAFAF7] to-[#F5F0E8]",
  7: "from-[#FFFBF0] to-[#FAFAF7]",
};

// ─── SceneWrapper ─────────────────────────────────────────────────────────────

export function SceneWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  const Bg = BG_MAP[step] ?? (() => null);
  const gradient = BG_GRADIENT[step] ?? "from-[#FAFAF7] to-[#FAFAF7]";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} min-h-[460px]`}>
      {/* Background illustration — slow breathing parallax */}
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
