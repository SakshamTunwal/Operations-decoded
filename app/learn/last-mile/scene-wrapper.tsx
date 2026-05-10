"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── Scene Backgrounds ────────────────────────────────────────────────────────

function LogisticsOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk */}
      <rect x="80" y="350" width="640" height="14" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Monitor showing delivery map */}
      <rect x="300" y="200" width="200" height="130" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="310" y="210" width="180" height="110" rx="3" fill="#F0FDFA" opacity="0.5" />
      <rect x="388" y="330" width="24" height="14" fill="#D1CBC2" opacity="0.5" />
      <rect x="370" y="343" width="60" height="5" rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Route lines on screen */}
      <path d="M320 250 Q360 230 390 260 Q420 280 460 240 Q490 220 480 270" stroke="#0F766E" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4 3" />
      <circle cx="325" cy="252" r="3" fill="#0F766E" opacity="0.5" />
      <circle cx="460" cy="243" r="3" fill="#0F766E" opacity="0.5" />
      <circle cx="480" cy="270" r="3" fill="#EA580C" opacity="0.5" />
      {/* Complaint papers pinned to wall */}
      <rect x="80" y="100" width="80" height="110" rx="4" fill="#FAFAF7" opacity="0.7" transform="rotate(-2 80 100)" />
      <rect x="86" y="108" width="68" height="6" rx="2" fill="#E8E4DD" opacity="0.9" transform="rotate(-2 80 100)" />
      <rect x="86" y="118" width="50" height="4" rx="2" fill="#E8E4DD" opacity="0.7" transform="rotate(-2 80 100)" />
      <rect x="86" y="126" width="58" height="4" rx="2" fill="#E8E4DD" opacity="0.7" transform="rotate(-2 80 100)" />
      <circle cx="120" cy="104" r="3" fill="#EA580C" opacity="0.6" />
      <rect x="175" y="110" width="80" height="110" rx="4" fill="#FAFAF7" opacity="0.7" transform="rotate(1.5 175 110)" />
      <rect x="181" y="118" width="68" height="6" rx="2" fill="#E8E4DD" opacity="0.9" transform="rotate(1.5 175 110)" />
      <rect x="181" y="128" width="50" height="4" rx="2" fill="#E8E4DD" opacity="0.7" transform="rotate(1.5 175 110)" />
      <circle cx="215" cy="114" r="3" fill="#EA580C" opacity="0.6" />
      {/* Delivery trucks (icons) */}
      <rect x="560" y="250" width="60" height="30" rx="4" fill="#E8E4DD" opacity="0.4" />
      <rect x="555" y="265" width="20" height="15" rx="2" fill="#D1CBC2" opacity="0.5" />
      <circle cx="567" cy="283" r="5" fill="#C4BDB5" opacity="0.5" />
      <circle cx="605" cy="283" r="5" fill="#C4BDB5" opacity="0.5" />
      {/* Floor stripe */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function FinanceOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Grid lines — spreadsheet feel */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1="60" y1={80 + i * 60} x2="740" y2={80 + i * 60} stroke="#E8E4DD" strokeWidth="1" opacity="0.6" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`v${i}`} x1={60 + i * 100} y1="60" x2={60 + i * 100} y2="440" stroke="#E8E4DD" strokeWidth="0.8" opacity="0.4" />
      ))}
      {/* Bar chart — cost breakdown */}
      {[90, 130, 60, 110, 80].map((h, i) => (
        <rect key={i} x={110 + i * 110} y={380 - h} width="55" height={h} rx="4" fill="#f59e0b" opacity="0.09" />
      ))}
      {/* Big number display */}
      <text x="400" y="200" textAnchor="middle" fontSize="48" fontWeight="800" fill="#1E40AF" opacity="0.07" fontFamily="sans-serif">$177.80</text>
      {/* Invoice pile */}
      {[0, 1, 2].map((j) => (
        <rect key={j} x={560 + j * 4} y={260 + j * 3} width="110" height="70" rx="3" fill="white" opacity="0.7" transform={`rotate(${(j - 1) * 2} 615 295)`} />
      ))}
      <rect x="568" y="268" width="94" height="6" rx="2" fill="#E8E4DD" opacity="0.8" />
      <rect x="568" y="278" width="70" height="4" rx="2" fill="#E8E4DD" opacity="0.7" />
      {/* Calculator */}
      <rect x="90" y="270" width="75" height="95" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="98" y="278" width="59" height="28" rx="3" fill="#D1CBC2" opacity="0.6" />
      {[0,1,2,3,4,5,6,7,8].map((j) => (
        <rect key={j} x={98 + (j % 3) * 21} y={316 + Math.floor(j / 3) * 16} width="15" height="11" rx="2" fill="white" opacity="0.7" />
      ))}
      {/* Screen frame */}
      <rect x="50" y="50" width="700" height="400" rx="8" fill="none" stroke="#E8E4DD" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function OperationsRoomBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Whiteboard */}
      <rect x="60" y="80" width="480" height="300" rx="6" fill="#FAFAF7" opacity="0.6" />
      <rect x="60" y="80" width="480" height="300" rx="6" fill="none" stroke="#E8E4DD" strokeWidth="2" />
      {/* 4 metric boxes on whiteboard */}
      <rect x="80" y="110" width="200" height="110" rx="4" fill="#F0FDFA" opacity="0.7" />
      <text x="180" y="138" textAnchor="middle" fontSize="10" fill="#0F766E" opacity="0.7" fontFamily="sans-serif" fontWeight="600">On-Time Rate</text>
      <text x="180" y="162" textAnchor="middle" fontSize="22" fill="#0F766E" opacity="0.6" fontFamily="sans-serif" fontWeight="800">81%</text>
      <rect x="300" y="110" width="200" height="110" rx="4" fill="#FEF2F2" opacity="0.7" />
      <text x="400" y="138" textAnchor="middle" fontSize="10" fill="#DC2626" opacity="0.7" fontFamily="sans-serif" fontWeight="600">Damage Rate</text>
      <text x="400" y="162" textAnchor="middle" fontSize="22" fill="#DC2626" opacity="0.6" fontFamily="sans-serif" fontWeight="800">2.8%</text>
      <rect x="80" y="240" width="200" height="110" rx="4" fill="#FEF3C7" opacity="0.7" />
      <text x="180" y="268" textAnchor="middle" fontSize="10" fill="#D97706" opacity="0.7" fontFamily="sans-serif" fontWeight="600">POD Completion</text>
      <text x="180" y="292" textAnchor="middle" fontSize="22" fill="#D97706" opacity="0.6" fontFamily="sans-serif" fontWeight="800">76%</text>
      <rect x="300" y="240" width="200" height="110" rx="4" fill="#FEF2F2" opacity="0.7" />
      <text x="400" y="268" textAnchor="middle" fontSize="10" fill="#DC2626" opacity="0.7" fontFamily="sans-serif" fontWeight="600">Resolution Time</text>
      <text x="400" y="292" textAnchor="middle" fontSize="22" fill="#DC2626" opacity="0.6" fontFamily="sans-serif" fontWeight="800">8 days</text>
      {/* Flip chart to the right */}
      <rect x="600" y="100" width="140" height="200" rx="4" fill="#F5F0E8" opacity="0.5" />
      <line x1="600" y1="100" x2="670" y2="100" stroke="#D1CBC2" strokeWidth="3" opacity="0.5" />
      <line x1="670" y1="80" x2="670" y2="110" stroke="#D1CBC2" strokeWidth="2" opacity="0.6" />
      {Array.from({length: 5}).map((_,i) => (
        <line key={i} x1="615" y1={130 + i*22} x2="725" y2={130 + i*22} stroke="#D1CBC2" strokeWidth="1" opacity="0.5" />
      ))}
    </svg>
  );
}

function SystemsOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Server rack hint */}
      <rect x="60" y="100" width="80" height="260" rx="4" fill="#E8E4DD" opacity="0.45" />
      {Array.from({length: 8}).map((_,i) => (
        <rect key={i} x="70" y={115 + i * 30} width="60" height="18" rx="3" fill="#D1CBC2" opacity="0.5" />
      ))}
      {/* Blinking status lights */}
      <circle cx="120" cy="120" r="3" fill="#22c55e" opacity="0.6" />
      <circle cx="120" cy="150" r="3" fill="#22c55e" opacity="0.6" />
      <circle cx="120" cy="180" r="3" fill="#f59e0b" opacity="0.6" />
      {/* Computer screen */}
      <rect x="200" y="180" width="220" height="150" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="210" y="190" width="200" height="130" rx="3" fill="#F0FDFA" opacity="0.6" />
      {/* Screen data rows */}
      {Array.from({length: 6}).map((_,i) => (
        <rect key={i} x="220" y={200 + i * 18} width={i % 3 === 0 ? 180 : 120 + i * 10} height="6" rx="2" fill="#0F766E" opacity={0.15 + i * 0.05} />
      ))}
      {/* Filing cabinet */}
      <rect x="580" y="200" width="80" height="180" rx="4" fill="#E8E4DD" opacity="0.45" />
      <line x1="580" y1="260" x2="660" y2="260" stroke="#D1CBC2" strokeWidth="2" opacity="0.6" />
      <line x1="580" y1="320" x2="660" y2="320" stroke="#D1CBC2" strokeWidth="2" opacity="0.6" />
      <rect x="600" y="252" width="40" height="8" rx="4" fill="#D1CBC2" opacity="0.7" />
      <rect x="600" y="312" width="40" height="8" rx="4" fill="#D1CBC2" opacity="0.7" />
      {/* Inbox stacks — paper pile */}
      <rect x="490" y="310" width="80" height="8"  rx="2" fill="white" opacity="0.8" transform="rotate(-1 490 310)" />
      <rect x="490" y="318" width="80" height="8"  rx="2" fill="white" opacity="0.7" transform="rotate(0.5 490 318)" />
      <rect x="490" y="326" width="80" height="8"  rx="2" fill="white" opacity="0.6" transform="rotate(-0.5 490 326)" />
      {/* Floor */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function ClaimsDeskBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk surface */}
      <rect x="60" y="350" width="680" height="14" rx="4" fill="#D1CBC2" opacity="0.4" />
      {/* Damaged box outline */}
      <rect x="580" y="210" width="140" height="130" rx="4" fill="#FEF2F2" opacity="0.5" stroke="#DC2626" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M580 250 L640 250 L660 210" stroke="#DC2626" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M660 210 L720 210 L720 250" stroke="#E8E4DD" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Damage crack */}
      <path d="M605 220 L625 245 L615 265" stroke="#DC2626" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />
      {/* Evidence photos laid out */}
      {[0, 1, 2].map((j) => (
        <rect key={j} x={90 + j * 130} y={220 + j * 15} width="110" height="80" rx="4" fill="white" opacity="0.75" transform={`rotate(${(j - 1) * 3} ${145 + j * 130} 260)`} />
      ))}
      <rect x="100" y="230" width="90" height="60" rx="2" fill="#F0FDFA" opacity="0.5" />
      <rect x="230" y="240" width="90" height="60" rx="2" fill="#FEF2F2" opacity="0.5" />
      <rect x="360" y="250" width="90" height="60" rx="2" fill="#FEF3C7" opacity="0.5" />
      {/* File folders */}
      <rect x="480" y="240" width="80" height="100" rx="4" fill="#FEF3C7" opacity="0.6" />
      <rect x="480" y="230" width="50" height="18" rx="2" fill="#f59e0b" opacity="0.4" />
      <rect x="490" y="258" width="60" height="4" rx="2" fill="#D97706" opacity="0.4" />
      <rect x="490" y="268" width="50" height="4" rx="2" fill="#D97706" opacity="0.3" />
      <rect x="490" y="278" width="55" height="4" rx="2" fill="#D97706" opacity="0.3" />
      {/* Floor */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function BoardRoomBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Long conference table */}
      <rect x="80" y="260" width="640" height="60" rx="8" fill="#D1CBC2" opacity="0.4" />
      <rect x="80" y="260" width="640" height="8"  rx="4" fill="#E8E4DD" opacity="0.5" />
      {/* Chairs around table */}
      {[120, 220, 320, 420, 520, 620].map((x, i) => (
        <ellipse key={i} cx={x} cy={i % 2 === 0 ? 244 : 336} rx="28" ry="16" fill="#E8E4DD" opacity="0.45" />
      ))}
      {/* Presentation screen */}
      <rect x="300" y="60" width="200" height="140" rx="6" fill="#EFF6FF" opacity="0.6" />
      <rect x="310" y="70" width="180" height="120" rx="3" fill="#F5F0E8" opacity="0.5" />
      {/* Chart on screen */}
      {[60, 90, 45, 110, 75].map((h, i) => (
        <rect key={i} x={325 + i * 32} y={175 - h} width="20" height={h} rx="2" fill="#f59e0b" opacity="0.25" />
      ))}
      <line x1="318" y1="175" x2="480" y2="175" stroke="#E8E4DD" strokeWidth="1" opacity="0.6" />
      {/* Screen stand */}
      <rect x="388" y="200" width="24" height="14" fill="#D1CBC2" opacity="0.5" />
      <rect x="370" y="213" width="60" height="5"  rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Grid lines */}
      {Array.from({length: 5}).map((_,i) => (
        <line key={i} x1="60" y1={80 + i*70} x2="740" y2={80 + i*70} stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
    </svg>
  );
}

function ConferenceRoomBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Warm radial gradient hint */}
      <defs>
        <radialGradient id="confGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#FEF3C7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFBF0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="500" fill="url(#confGrad)" />
      {/* Dashboard on screen — big display */}
      <rect x="180" y="80" width="440" height="280" rx="8" fill="#FAFAF7" opacity="0.6" stroke="#E8E4DD" strokeWidth="1.5" />
      {/* 4 metric cards on dashboard */}
      <rect x="200" y="100" width="185" height="100" rx="4" fill="#F0FDFA" opacity="0.7" />
      <text x="292" y="130" textAnchor="middle" fontSize="9" fill="#0F766E" opacity="0.7" fontFamily="sans-serif" fontWeight="600">ON-TIME</text>
      <text x="292" y="155" textAnchor="middle" fontSize="20" fill="#0F766E" opacity="0.65" fontFamily="sans-serif" fontWeight="800">93%</text>
      <rect x="415" y="100" width="185" height="100" rx="4" fill="#F0FDFA" opacity="0.7" />
      <text x="507" y="130" textAnchor="middle" fontSize="9" fill="#0F766E" opacity="0.7" fontFamily="sans-serif" fontWeight="600">DAMAGE</text>
      <text x="507" y="155" textAnchor="middle" fontSize="20" fill="#0F766E" opacity="0.65" fontFamily="sans-serif" fontWeight="800">0.9%</text>
      <rect x="200" y="220" width="185" height="100" rx="4" fill="#F0FDFA" opacity="0.7" />
      <text x="292" y="250" textAnchor="middle" fontSize="9" fill="#0F766E" opacity="0.7" fontFamily="sans-serif" fontWeight="600">POD</text>
      <text x="292" y="275" textAnchor="middle" fontSize="20" fill="#0F766E" opacity="0.65" fontFamily="sans-serif" fontWeight="800">98%</text>
      <rect x="415" y="220" width="185" height="100" rx="4" fill="#F0FDFA" opacity="0.7" />
      <text x="507" y="250" textAnchor="middle" fontSize="9" fill="#0F766E" opacity="0.7" fontFamily="sans-serif" fontWeight="600">RESOLUTION</text>
      <text x="507" y="275" textAnchor="middle" fontSize="20" fill="#0F766E" opacity="0.65" fontFamily="sans-serif" fontWeight="800">3.5d</text>
      {/* Trend line — trending up */}
      <path d="M200 420 Q300 410 400 390 Q500 365 600 340" stroke="#0F766E" strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round" />
      <circle cx="600" cy="340" r="5" fill="#0F766E" opacity="0.3" />
      {/* Table */}
      <rect x="80" y="360" width="640" height="40" rx="6" fill="#D1CBC2" opacity="0.3" />
    </svg>
  );
}

const BG_MAP: Record<number, React.FC> = {
  1: LogisticsOfficeBg,
  2: FinanceOfficeBg,
  3: OperationsRoomBg,
  4: SystemsOfficeBg,
  5: ClaimsDeskBg,
  6: BoardRoomBg,
  7: ConferenceRoomBg,
};

const BG_GRADIENT: Record<number, string> = {
  1: "from-[#F0FDFA] to-[#FAFAF7]",
  2: "from-[#EFF6FF] to-[#FAFAF7]",
  3: "from-[#F5F0E8] to-[#FAFAF7]",
  4: "from-[#FAFAF7] to-[#F0FDFA]",
  5: "from-[#FEF2F2] to-[#FAFAF7]",
  6: "from-[#EFF6FF] to-[#FAFAF7]",
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
