"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── Scene Backgrounds ────────────────────────────────────────────────────────

function WarehouseFloorBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Aisle lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`v${i}`} x1={100 + i * 90} y1="80" x2={100 + i * 90} y2="420" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.5" />
      ))}
      {/* Shelving racks */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={`shelf${i}`} x={110 + i * 90} y="100" width="70" height="300" rx="3" fill="#F0EBE0" opacity="0.35" />
      ))}
      {/* Cross aisle */}
      <rect x="80" y="240" width="640" height="20" rx="2" fill="#E8E4DD" opacity="0.4" />
      {/* Packing station hint */}
      <rect x="600" y="380" width="140" height="60" rx="6" fill="#E8E4DD" opacity="0.4" />
      <text x="670" y="415" textAnchor="middle" fontSize="10" fill="#9CA3AF" opacity="0.7" fontFamily="sans-serif">PACKING</text>
    </svg>
  );
}

function ReceivingDockBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Dock doors */}
      {[200, 400, 600].map((x) => (
        <g key={x}>
          <rect x={x - 50} y="80" width="100" height="160" rx="4" fill="#F0EBE0" opacity="0.5" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={x - 50} y1={80 + i * 26} x2={x + 50} y2={80 + i * 26} stroke="#D1CBC2" strokeWidth="1.5" opacity="0.6" />
          ))}
        </g>
      ))}
      {/* Staging area */}
      <rect x="80" y="300" width="640" height="100" rx="6" fill="#E8E4DD" opacity="0.3" />
      <text x="400" y="355" textAnchor="middle" fontSize="11" fill="#9CA3AF" opacity="0.6" fontFamily="sans-serif">STAGING AREA</text>
      {/* Floor lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={400 + i * 18} x2="800" y2={400 + i * 18} stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
    </svg>
  );
}

function PickAislesBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Five zone columns */}
      {["#FEE2E2", "#DBEAFE", "#DCFCE7", "#FEF9C3", "#F3E8FF"].map((c, i) => (
        <rect key={i} x={60 + i * 140} y="60" width="120" height="380" rx="6" fill={c} opacity="0.3" />
      ))}
      {/* Zone labels */}
      {["Z1", "Z2", "Z3", "Z4", "Z5"].map((z, i) => (
        <text key={z} x={120 + i * 140} y="90" textAnchor="middle" fontSize="12" fill="#9CA3AF" opacity="0.5" fontFamily="sans-serif" fontWeight="600">{z}</text>
      ))}
      {/* Pick cart hint */}
      <rect x="350" y="300" width="40" height="50" rx="4" fill="#E8E4DD" opacity="0.5" />
      <circle cx="358" cy="358" r="6" fill="#D1CBC2" opacity="0.5" />
      <circle cx="382" cy="358" r="6" fill="#D1CBC2" opacity="0.5" />
    </svg>
  );
}

function SystemsOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk */}
      <rect x="80" y="340" width="640" height="12" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Multiple monitors */}
      {[250, 400, 550].map((x) => (
        <g key={x}>
          <rect x={x - 60} y="180" width="120" height="90" rx="5" fill="#E8E4DD" opacity="0.5" />
          <rect x={x - 52} y="188" width="104" height="74" rx="3" fill="#F5F0E8" opacity="0.6" />
          <rect x={x - 8} y="270" width="16" height="12" fill="#D1CBC2" opacity="0.5" />
          <rect x={x - 24} y="282" width="48" height="4" rx="2" fill="#D1CBC2" opacity="0.5" />
        </g>
      ))}
      {/* Data grid lines inside screens */}
      {[258, 408, 558].map((x) => (
        <g key={x}>
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={i} x1={x - 44} y1={200 + i * 14} x2={x + 44} y2={200 + i * 14} stroke="#E8E4DD" strokeWidth="1" opacity="0.7" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function QualityStationBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Inspection table */}
      <rect x="120" y="280" width="560" height="16" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Magnifying glass */}
      <circle cx="400" cy="200" r="60" fill="none" stroke="#E8E4DD" strokeWidth="3" opacity="0.4" />
      <line x1="442" y1="242" x2="480" y2="280" stroke="#E8E4DD" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
      {/* Bins */}
      {["#DCFCE7", "#FEF3C7", "#FEE2E2"].map((c, i) => (
        <rect key={i} x={180 + i * 160} y="320" width="100" height="80" rx="6" fill={c} opacity="0.4" />
      ))}
      <text x="230" y="365" textAnchor="middle" fontSize="9" fill="#9CA3AF" opacity="0.6" fontFamily="sans-serif">PASS</text>
      <text x="390" y="365" textAnchor="middle" fontSize="9" fill="#9CA3AF" opacity="0.6" fontFamily="sans-serif">FLAG</text>
      <text x="550" y="365" textAnchor="middle" fontSize="9" fill="#9CA3AF" opacity="0.6" fontFamily="sans-serif">REJECT</text>
    </svg>
  );
}

function ReturnsBayBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Processing tables */}
      <rect x="100" y="300" width="200" height="12" rx="4" fill="#D1CBC2" opacity="0.4" />
      <rect x="500" y="300" width="200" height="12" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Grading bins */}
      {["#DCFCE7", "#DBEAFE", "#FEF3C7", "#FEE2E2"].map((c, i) => (
        <g key={i}>
          <rect x={120 + i * 160} y="340" width="100" height="70" rx="6" fill={c} opacity="0.4" />
          <text x={170 + i * 160} y="380" textAnchor="middle" fontSize="14" fill="#9CA3AF" opacity="0.5" fontFamily="sans-serif" fontWeight="700">
            {["A", "B", "C", "D"][i]}
          </text>
        </g>
      ))}
      {/* Return bags hint */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={140 + i * 80} y={180 + (i % 2) * 20} width="40" height="50" rx="4" fill="#F0EBE0" opacity="0.4" transform={`rotate(${(i - 2) * 3} ${160 + i * 80} 205)`} />
      ))}
    </svg>
  );
}

function FlashSaleBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      <defs>
        <radialGradient id="flashGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FAFAF7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="500" fill="url(#flashGrad)" />
      {/* Energy lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={400} y1={250} x2={50 + i * 100} y2={i % 2 === 0 ? 50 : 450} stroke="#f59e0b" strokeWidth="1" opacity="0.1" />
      ))}
      {/* Order count hint */}
      <text x="400" y="120" textAnchor="middle" fontSize="48" fill="#f59e0b" opacity="0.06" fontFamily="sans-serif" fontWeight="900">4,200</text>
      {/* Conveyor hint */}
      <rect x="100" y="380" width="600" height="20" rx="4" fill="#E8E4DD" opacity="0.35" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={115 + i * 50} y="380" width="6" height="20" rx="3" fill="#D1CBC2" opacity="0.4" />
      ))}
    </svg>
  );
}

const BG_MAP: Record<number, React.FC> = {
  1: WarehouseFloorBg,
  2: ReceivingDockBg,
  3: PickAislesBg,
  4: SystemsOfficeBg,
  5: QualityStationBg,
  6: ReturnsBayBg,
  7: FlashSaleBg,
};

const BG_GRADIENT: Record<number, string> = {
  1: "from-[#F5F0E8] to-[#FAFAF7]",
  2: "from-[#F0EBE0] to-[#FAFAF7]",
  3: "from-[#F5F0E8] to-[#FAFAF7]",
  4: "from-[#F0F2FA] to-[#FAFAF7]",
  5: "from-[#F5F0E8] to-[#FAFAF7]",
  6: "from-[#FAFAF7] to-[#F5F0E8]",
  7: "from-[#FFFBF0] to-[#FAFAF7]",
};

// ─── SceneWrapper ─────────────────────────────────────────────────────────────

export function SceneWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  const Bg = BG_MAP[step] ?? (() => null);
  const gradient = BG_GRADIENT[step] ?? "from-[#FAFAF7] to-[#FAFAF7]";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} min-h-[460px]`}>
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.55]"
        animate={{ scale: [1, 1.025, 1], x: [0, 4, 0], y: [0, -3, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bg />
      </motion.div>
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
