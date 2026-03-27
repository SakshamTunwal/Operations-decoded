"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ─── Scene Backgrounds ────────────────────────────────────────────────────────

function ClaraOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Executive desk */}
      <rect x="100" y="340" width="600" height="16" rx="5" fill="#D1CBC2" opacity="0.5" />
      <rect x="100" y="356" width="600" height="8" rx="2" fill="#C4BDB5" opacity="0.35" />
      {/* Monitor */}
      <rect x="320" y="200" width="180" height="125" rx="8" fill="#E8E4DD" opacity="0.55" />
      <rect x="330" y="210" width="160" height="100" rx="4" fill="#F5F0E8" opacity="0.6" />
      {/* Monitor stand */}
      <rect x="398" y="325" width="24" height="16" fill="#D1CBC2" opacity="0.5" />
      <rect x="378" y="340" width="64" height="5" rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Potted plant */}
      <rect x="660" y="290" width="18" height="50" rx="4" fill="#D1CBC2" opacity="0.5" />
      <ellipse cx="669" cy="285" rx="24" ry="18" fill="#A7C4A0" opacity="0.35" />
      <ellipse cx="655" cy="295" rx="14" ry="10" fill="#B5CEB0" opacity="0.3" />
      <ellipse cx="683" cy="292" rx="14" ry="10" fill="#A7C4A0" opacity="0.3" />
      {/* Framed certificates on wall */}
      <rect x="80" y="100" width="100" height="75" rx="4" fill="#F5F0E8" opacity="0.5" />
      <rect x="85" y="105" width="90" height="65" rx="2" fill="white" opacity="0.4" />
      <line x1="85" y1="118" x2="175" y2="118" stroke="#E8E4DD" strokeWidth="1" opacity="0.7" />
      <rect x="100" y="110" width="60" height="3" rx="1" fill="#D97706" opacity="0.3" />
      <rect x="200" y="90" width="100" height="75" rx="4" fill="#F5F0E8" opacity="0.5" />
      <rect x="205" y="95" width="90" height="65" rx="2" fill="white" opacity="0.4" />
      <rect x="220" y="100" width="60" height="3" rx="1" fill="#D97706" opacity="0.3" />
      {/* Papers on desk */}
      <rect x="510" y="290" width="110" height="50" rx="3" fill="white" opacity="0.7" transform="rotate(-2 510 290)" />
      <rect x="516" y="298" width="90" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-2 516 298)" />
      <rect x="516" y="305" width="80" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-2 516 305)" />
      {/* Floor line */}
      <line x1="0" y1="470" x2="800" y2="470" stroke="#E8E4DD" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function NeilDeskBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk surface */}
      <rect x="60" y="340" width="680" height="14" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Dual monitors */}
      <rect x="220" y="190" width="170" height="135" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="228" y="198" width="154" height="115" rx="3" fill="#F5F0E8" opacity="0.6" />
      <rect x="398" y="200" width="160" height="125" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="406" y="208" width="144" height="105" rx="3" fill="#F5F0E8" opacity="0.55" />
      {/* Monitor stands */}
      <rect x="294" y="325" width="22" height="16" fill="#D1CBC2" opacity="0.5" />
      <rect x="468" y="325" width="22" height="16" fill="#D1CBC2" opacity="0.5" />
      {/* Coffee cup */}
      <rect x="170" y="300" width="28" height="36" rx="4" fill="#D1CBC2" opacity="0.55" />
      <rect x="170" y="300" width="28" height="8" rx="4" fill="#C4BDB5" opacity="0.5" />
      <path d="M198 312 Q210 312 210 320 Q210 328 198 328" stroke="#C4BDB5" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Steam wisps */}
      <path d="M180 295 Q182 288 178 282" stroke="#D1CBC2" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M187 293 Q189 286 185 280" stroke="#D1CBC2" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* Sticky notes */}
      <rect x="600" y="260" width="50" height="50" rx="2" fill="#FEF3C7" opacity="0.7" transform="rotate(3 600 260)" />
      <rect x="655" y="265" width="50" height="50" rx="2" fill="#FEF3C7" opacity="0.6" transform="rotate(-2 655 265)" />
      <rect x="602" y="272" width="40" height="2" rx="1" fill="#D97706" opacity="0.3" transform="rotate(3 602 272)" />
      <rect x="602" y="278" width="34" height="2" rx="1" fill="#D97706" opacity="0.25" transform="rotate(3 602 278)" />
      {/* Scattered papers */}
      <rect x="90" y="275" width="110" height="60" rx="3" fill="white" opacity="0.7" transform="rotate(-4 90 275)" />
      <rect x="96" y="284" width="90" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-4 96 284)" />
      <rect x="96" y="290" width="80" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-4 96 290)" />
      {/* Floor */}
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function ReceivingDockBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Concrete floor grid */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={320 + i * 22} x2="800" y2={320 + i * 22} stroke="#E8E4DD" strokeWidth="1" opacity="0.5" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 60} y1="310" x2={i * 60 + 20} y2="500" stroke="#E8E4DD" strokeWidth="0.8" opacity="0.3" />
      ))}
      {/* Large roller doors */}
      <rect x="440" y="60" width="300" height="280" rx="4" fill="#F0EBE0" opacity="0.5" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`d${i}`} x1="440" y1={60 + i * 24} x2="740" y2={60 + i * 24} stroke="#D1CBC2" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* Pallets */}
      <rect x="80" y="280" width="100" height="40" rx="2" fill="#E8E4DD" opacity="0.5" />
      <rect x="82" y="284" width="96" height="4" rx="1" fill="#D1CBC2" opacity="0.6" />
      <rect x="82" y="292" width="96" height="4" rx="1" fill="#D1CBC2" opacity="0.6" />
      <rect x="200" y="280" width="100" height="40" rx="2" fill="#E8E4DD" opacity="0.45" />
      <rect x="202" y="284" width="96" height="4" rx="1" fill="#D1CBC2" opacity="0.6" />
      {/* Boxes on pallet */}
      <rect x="84" y="246" width="44" height="36" rx="2" fill="#F5F0E8" opacity="0.55" />
      <rect x="134" y="252" width="44" height="30" rx="2" fill="#F5F0E8" opacity="0.45" />
      {/* Forklift silhouette */}
      <rect x="620" y="230" width="110" height="80" rx="4" fill="#E8E4DD" opacity="0.4" />
      <rect x="620" y="310" width="110" height="14" rx="2" fill="#D1CBC2" opacity="0.5" />
      <rect x="652" y="190" width="12" height="80" rx="2" fill="#D1CBC2" opacity="0.45" />
      <rect x="668" y="190" width="12" height="80" rx="2" fill="#D1CBC2" opacity="0.45" />
      <circle cx="640" cy="330" r="14" fill="#D1CBC2" opacity="0.45" />
      <circle cx="710" cy="330" r="14" fill="#D1CBC2" opacity="0.45" />
    </svg>
  );
}

function WarehouseBayBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Fluorescent lights on ceiling */}
      {[100, 300, 500, 700].map((x, i) => (
        <rect key={`l${i}`} x={x - 30} y="20" width="60" height="8" rx="4" fill="#FEF3C7" opacity="0.5" />
      ))}
      {/* Shelving units */}
      <rect x="60" y="100" width="20" height="240" rx="2" fill="#E8E4DD" opacity="0.5" />
      <rect x="60" y="150" width="200" height="6" rx="2" fill="#E8E4DD" opacity="0.55" />
      <rect x="60" y="210" width="200" height="6" rx="2" fill="#E8E4DD" opacity="0.55" />
      <rect x="60" y="270" width="200" height="6" rx="2" fill="#E8E4DD" opacity="0.55" />
      <rect x="240" y="100" width="20" height="240" rx="2" fill="#E8E4DD" opacity="0.5" />
      {/* Shelf contents */}
      {[160, 220, 280].map((y, i) => (
        <rect key={`b${i}`} x={80 + i * 12} y={y - 38} width="38" height="36" rx="2" fill="#F5F0E8" opacity="0.45" />
      ))}
      {/* Second shelving unit */}
      <rect x="560" y="100" width="20" height="240" rx="2" fill="#E8E4DD" opacity="0.45" />
      <rect x="560" y="160" width="180" height="6" rx="2" fill="#E8E4DD" opacity="0.5" />
      <rect x="560" y="230" width="180" height="6" rx="2" fill="#E8E4DD" opacity="0.5" />
      <rect x="740" y="100" width="20" height="240" rx="2" fill="#E8E4DD" opacity="0.45" />
      {/* Barcode scanner station */}
      <rect x="330" y="300" width="140" height="8" rx="2" fill="#D1CBC2" opacity="0.55" />
      <rect x="370" y="200" width="60" height="100" rx="4" fill="#E8E4DD" opacity="0.5" />
      <rect x="378" y="208" width="44" height="30" rx="2" fill="#F5F0E8" opacity="0.6" />
      {/* Floor lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`f${i}`} x1="0" y1={360 + i * 18} x2="800" y2={360 + i * 18} stroke="#E8E4DD" strokeWidth="1" opacity="0.4" />
      ))}
    </svg>
  );
}

function NeilOfficeBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Desk */}
      <rect x="80" y="340" width="640" height="14" rx="4" fill="#D1CBC2" opacity="0.45" />
      {/* Phone */}
      <rect x="130" y="285" width="70" height="55" rx="6" fill="#E8E4DD" opacity="0.55" />
      <rect x="140" y="293" width="50" height="20" rx="2" fill="#D1CBC2" opacity="0.6" />
      <rect x="140" y="318" width="12" height="12" rx="2" fill="#D1CBC2" opacity="0.5" />
      <rect x="158" y="318" width="12" height="12" rx="2" fill="#D1CBC2" opacity="0.5" />
      <rect x="176" y="318" width="12" height="12" rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Documents / papers stressed look */}
      <rect x="320" y="250" width="130" height="90" rx="3" fill="white" opacity="0.75" transform="rotate(-6 320 250)" />
      <rect x="330" y="262" width="100" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-6 330 262)" />
      <rect x="330" y="270" width="90" height="2" rx="1" fill="#ef4444" opacity="0.3" transform="rotate(-6 330 270)" />
      <rect x="330" y="278" width="95" height="2" rx="1" fill="#E8E4DD" opacity="0.8" transform="rotate(-6 330 278)" />
      <rect x="460" y="265" width="120" height="80" rx="3" fill="white" opacity="0.65" transform="rotate(4 460 265)" />
      <rect x="468" y="276" width="95" height="2" rx="1" fill="#E8E4DD" opacity="0.7" transform="rotate(4 468 276)" />
      <rect x="468" y="284" width="80" height="2" rx="1" fill="#E8E4DD" opacity="0.7" transform="rotate(4 468 284)" />
      {/* Monitor with alert vibe */}
      <rect x="580" y="200" width="160" height="120" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="588" y="208" width="144" height="100" rx="3" fill="#FEF2F2" opacity="0.55" />
      {/* Post-it note */}
      <rect x="620" y="190" width="42" height="42" rx="2" fill="#FEF3C7" opacity="0.8" transform="rotate(8 620 190)" />
      <rect x="624" y="200" width="30" height="2" rx="1" fill="#D97706" opacity="0.35" transform="rotate(8 624 200)" />
      <rect x="624" y="207" width="24" height="2" rx="1" fill="#D97706" opacity="0.3" transform="rotate(8 624 207)" />
      <line x1="0" y1="460" x2="800" y2="460" stroke="#E8E4DD" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function FinanceDeskBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Clean desk */}
      <rect x="60" y="350" width="680" height="12" rx="4" fill="#E8E4DD" opacity="0.4" />
      {/* Monitor showing spreadsheet */}
      <rect x="280" y="180" width="240" height="158" rx="8" fill="#E8E4DD" opacity="0.55" />
      <rect x="290" y="190" width="220" height="135" rx="4" fill="#F5F0E8" opacity="0.65" />
      {/* Spreadsheet grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`sg${i}`} x1="290" y1={218 + i * 22} x2="510" y2={218 + i * 22} stroke="#E8E4DD" strokeWidth="1" opacity="0.7" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={`sc${i}`} x1={325 + i * 55} y1="190" x2={325 + i * 55} y2="325" stroke="#E8E4DD" strokeWidth="1" opacity="0.7" />
      ))}
      {/* Monitor stand */}
      <rect x="388" y="338" width="24" height="14" fill="#D1CBC2" opacity="0.5" />
      <rect x="370" y="350" width="60" height="5" rx="2" fill="#D1CBC2" opacity="0.5" />
      {/* Calculator */}
      <rect x="560" y="270" width="80" height="100" rx="6" fill="#E8E4DD" opacity="0.5" />
      <rect x="568" y="278" width="64" height="30" rx="3" fill="#D1CBC2" opacity="0.6" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((j) => (
        <rect key={j} x={568 + (j % 3) * 23} y={318 + Math.floor(j / 3) * 16} width="16" height="12" rx="2" fill="white" opacity="0.7" />
      ))}
      {/* Paper stacks */}
      {[0, 1, 2].map((i) => (
        <rect key={`p${i}`} x={90 + i * 4} y={280 + i * 3} width="120" height="8" rx="2" fill="white" opacity={0.8 - i * 0.1} transform={`rotate(${(i - 1) * 2} 150 280)`} />
      ))}
      {/* Filing cabinet */}
      <rect x="680" y="200" width="70" height="160" rx="4" fill="#E8E4DD" opacity="0.45" />
      <line x1="680" y1="280" x2="750" y2="280" stroke="#D1CBC2" strokeWidth="2" opacity="0.6" />
      <rect x="700" y="272" width="30" height="6" rx="3" fill="#D1CBC2" opacity="0.7" />
    </svg>
  );
}

function ResolutionBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500" aria-hidden>
      {/* Radial warm gradient hint */}
      <defs>
        <radialGradient id="resBg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FAFAF7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="500" fill="url(#resBg)" />
      {/* Documents neatly arranged */}
      <rect x="100" y="200" width="140" height="180" rx="6" fill="white" opacity="0.75" />
      <rect x="108" y="210" width="120" height="4" rx="2" fill="#16a34a" opacity="0.4" />
      <rect x="108" y="222" width="110" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <rect x="108" y="230" width="100" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <rect x="108" y="238" width="110" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      {/* Checkmark stamp on doc 1 */}
      <circle cx="170" cy="330" r="22" fill="#DCFCE7" opacity="0.8" />
      <path d="M158 330L166 338L182 322" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Doc 2 */}
      <rect x="270" y="180" width="140" height="180" rx="6" fill="white" opacity="0.7" />
      <rect x="278" y="190" width="120" height="4" rx="2" fill="#f59e0b" opacity="0.4" />
      <rect x="278" y="202" width="110" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <rect x="278" y="210" width="100" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <circle cx="340" cy="315" r="22" fill="#DCFCE7" opacity="0.8" />
      <path d="M328 315L336 323L352 307" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Doc 3 */}
      <rect x="440" y="200" width="140" height="180" rx="6" fill="white" opacity="0.65" />
      <rect x="448" y="210" width="120" height="4" rx="2" fill="#1D4ED8" opacity="0.3" />
      <rect x="448" y="222" width="110" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <rect x="448" y="230" width="100" height="2" rx="1" fill="#E8E4DD" opacity="0.7" />
      <circle cx="510" cy="330" r="22" fill="#DCFCE7" opacity="0.8" />
      <path d="M498 330L506 338L522 322" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Connection lines between docs */}
      <path d="M240 290 Q255 290 270 290" stroke="#E8E4DD" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      <path d="M410 290 Q425 290 440 290" stroke="#E8E4DD" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      {/* Bright floor */}
      <line x1="0" y1="470" x2="800" y2="470" stroke="#D1CBC2" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

const BG_MAP: Record<number, React.FC> = {
  1: ClaraOfficeBg,
  2: NeilDeskBg,
  3: ReceivingDockBg,
  4: WarehouseBayBg,
  5: NeilOfficeBg,
  6: FinanceDeskBg,
  7: ResolutionBg,
};

const BG_GRADIENT: Record<number, string> = {
  1: "from-[#F5F3FF] to-[#FAFAF7]",
  2: "from-[#EFF6FF] to-[#FAFAF7]",
  3: "from-[#F5F0E8] to-[#FAFAF7]",
  4: "from-[#FFFBEB] to-[#FAFAF7]",
  5: "from-[#FFF1F2] to-[#FAFAF7]",
  6: "from-[#FAFAF7] to-[#F5F0E8]",
  7: "from-[#ECFDF5] to-[#FAFAF7]",
};

// ─── SceneWrapper ─────────────────────────────────────────────────────────────

export function SceneWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  const Bg = BG_MAP[step] ?? (() => null);
  const gradient = BG_GRADIENT[step] ?? "from-[#FAFAF7] to-[#FAFAF7]";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} min-h-[460px]`}>
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
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
