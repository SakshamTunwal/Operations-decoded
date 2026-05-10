"use client";

import React from "react";
import { motion } from "framer-motion";
import { STEPS } from "./constants";

// ─── Scene transition variants ────────────────────────────────────────────────

export const sceneVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -14, scale: 0.97, transition: { duration: 0.28, ease: "easeIn" as const } },
};

// ─── SVG Backgrounds ──────────────────────────────────────────────────────────

function Scene1Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s1g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s1g)" />
      {/* Desk surface */}
      <rect x="50" y="320" width="700" height="12" rx="4" fill="#D97706" opacity="0.15" />
      {/* Monitor */}
      <rect x="290" y="160" width="220" height="150" rx="8" fill="#1C1917" opacity="0.12" />
      <rect x="298" y="168" width="204" height="134" rx="5" fill="#FEF3C7" opacity="0.8" />
      <rect x="310" y="310" width="180" height="10" rx="3" fill="#1C1917" opacity="0.08" />
      {/* Document on desk */}
      <rect x="100" y="270" width="120" height="50" rx="4" fill="white" opacity="0.7" />
      <line x1="112" y1="285" x2="208" y2="285" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
      <line x1="112" y1="295" x2="185" y2="295" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.8" />
      <line x1="112" y1="305" x2="200" y2="305" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.8" />
      {/* EXW badge on screen */}
      <rect x="330" y="200" width="60" height="24" rx="6" fill="#FEE2E2" opacity="0.9" />
      <text x="360" y="216" textAnchor="middle" fontSize="11" fontWeight="700" fill="#DC2626" opacity="0.9">EXW</text>
      {/* Coffee cup */}
      <rect x="580" y="288" width="36" height="32" rx="4" fill="#D97706" opacity="0.2" />
      <path d="M616 296 Q626 302 616 308" stroke="#D97706" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Decorative dots */}
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={650 + i*20} cy={80 + (i%3)*30} r="3" fill="#f59e0b" opacity="0.12" />
      ))}
    </svg>
  );
}

function Scene2Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s2g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#CCFBF1" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s2g)" />
      {/* 4 Incoterm cards suggestion */}
      {["EXW","FOB","CIF","DDP"].map((term, i) => (
        <g key={term}>
          <rect x={100 + i * 160} y="180" width="130" height="90" rx="10"
            fill={i===1 ? "#D1FAE5" : "white"} opacity="0.6"
            stroke={i===1 ? "#10B981" : "#E8E4DD"} strokeWidth={i===1 ? 2 : 1}
          />
          <text x={165 + i * 160} y="232" textAnchor="middle" fontSize="16" fontWeight="800"
            fill={i===1 ? "#065F46" : "#9CA3AF"} opacity="0.8">{term}</text>
        </g>
      ))}
      {/* Phone/call visual */}
      <circle cx="680" cy="100" r="40" fill="#0D9488" opacity="0.08" />
      <circle cx="680" cy="100" r="25" fill="#0D9488" opacity="0.12" />
      <text x="680" y="107" textAnchor="middle" fontSize="20">📞</text>
      {/* Connecting lines */}
      {[0,1,2].map(i => (
        <line key={i} x1={230 + i*160} y1="225" x2={260 + i*160} y2="225"
          stroke="#E8E4DD" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
      ))}
    </svg>
  );
}

function Scene3Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s3g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="100%" stopColor="#DCFCE7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s3g)" />
      {/* Ship silhouette */}
      <ellipse cx="600" cy="370" rx="160" ry="25" fill="#0F766E" opacity="0.08" />
      <rect x="460" y="300" width="280" height="70" rx="8" fill="#0F766E" opacity="0.1" />
      <rect x="520" y="250" width="120" height="55" rx="6" fill="#0F766E" opacity="0.1" />
      <rect x="560" y="210" width="40" height="45" rx="3" fill="#0F766E" opacity="0.12" />
      {/* Containers on ship */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={475 + i*62} y="305" width="55" height="35" rx="3"
          fill={["#10B981","#F59E0B","#3B82F6","#10B981"][i]} opacity="0.15" />
      ))}
      {/* FOB handoff line */}
      <line x1="400" y1="150" x2="400" y2="420" stroke="#10B981" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
      <text x="400" y="140" textAnchor="middle" fontSize="10" fill="#065F46" opacity="0.5" fontWeight="600">SHIP'S RAIL</text>
      <text x="300" y="200" textAnchor="middle" fontSize="11" fill="#0F766E" opacity="0.4" fontWeight="600">JINSHEN →</text>
      <text x="500" y="200" textAnchor="middle" fontSize="11" fill="#10B981" opacity="0.4" fontWeight="600">← NEXARA</text>
      {/* Check mark */}
      <circle cx="680" cy="100" r="35" fill="#DCFCE7" opacity="0.8" />
      <text x="680" y="112" textAnchor="middle" fontSize="24">✅</text>
    </svg>
  );
}

function Scene4Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s4g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s4g)" />
      {/* Port ground */}
      <rect x="0" y="380" width="800" height="120" fill="#E8E4DD" opacity="0.4" />
      {/* Containers stacked */}
      {[0,1,2].map(col => [0,1].map(row => (
        <rect key={`${col}-${row}`}
          x={80 + col * 140} y={320 - row * 60} width="120" height="55" rx="4"
          fill={["#EF4444","#F59E0B","#3B82F6"][col]} opacity={row === 0 ? 0.2 : 0.12}
        />
      )))}
      {/* Crane */}
      <rect x="560" y="80" width="8" height="300" fill="#94A3B8" opacity="0.2" />
      <rect x="500" y="80" width="130" height="8" fill="#94A3B8" opacity="0.2" />
      <line x1="564" y1="88" x2="564" y2="240" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
      {/* Alert sign */}
      <circle cx="680" cy="120" r="38" fill="#FEE2E2" opacity="0.7" />
      <text x="680" y="115" textAnchor="middle" fontSize="22">⚠️</text>
      <text x="680" y="140" textAnchor="middle" fontSize="9" fill="#DC2626" opacity="0.8" fontWeight="700">NO ENTRY FILED</text>
      {/* Clock */}
      <circle cx="120" cy="100" r="30" fill="white" opacity="0.6" stroke="#E8E4DD" strokeWidth="1.5" />
      <text x="120" y="108" textAnchor="middle" fontSize="18">🕐</text>
    </svg>
  );
}

function Scene5Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s5g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s5g)" />
      {/* Documents stack */}
      {[0,1,2].map(i => (
        <rect key={i} x={120 + i*6} y={200 + i*6} width="180" height="240" rx="6"
          fill="white" opacity={0.5 + i*0.15} stroke="#E8E4DD" strokeWidth="1" />
      ))}
      <line x1="138" y1="230" x2="282" y2="230" stroke="#7C3AED" strokeWidth="2" opacity="0.3" />
      <line x1="138" y1="248" x2="260" y2="248" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.6" />
      <line x1="138" y1="264" x2="270" y2="264" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.6" />
      <rect x="138" y="278" width="60" height="18" rx="4" fill="#EDE9FE" opacity="0.8" />
      <text x="168" y="291" textAnchor="middle" fontSize="8" fill="#7C3AED" fontWeight="700" opacity="0.9">HS CODE</text>
      {/* Stamp */}
      <circle cx="640" cy="300" r="55" fill="none" stroke="#7C3AED" strokeWidth="3" opacity="0.15" />
      <circle cx="640" cy="300" r="45" fill="none" stroke="#7C3AED" strokeWidth="1" opacity="0.1" />
      <text x="640" y="296" textAnchor="middle" fontSize="11" fill="#7C3AED" fontWeight="800" opacity="0.3">CUSTOMS</text>
      <text x="640" y="312" textAnchor="middle" fontSize="11" fill="#7C3AED" fontWeight="800" opacity="0.3">REVIEW</text>
      {/* Checklist */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="450" y={180 + i*40} width="220" height="32" rx="6" fill="white" opacity="0.5" />
          <circle cx="470" cy={196 + i*40} r="8" fill="#EDE9FE" opacity="0.8" />
          <text x="470" y={200 + i*40} textAnchor="middle" fontSize="10" fill="#7C3AED" fontWeight="700" opacity="0.6">✓</text>
        </g>
      ))}
    </svg>
  );
}

function Scene6Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s6g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="100%" stopColor="#FEE2E2" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s6g)" />
      {/* Meeting table */}
      <ellipse cx="400" cy="360" rx="280" ry="50" fill="#E8E4DD" opacity="0.3" />
      {/* Invoice/report paper */}
      <rect x="260" y="240" width="280" height="200" rx="8" fill="white" opacity="0.6" />
      <rect x="278" y="260" width="160" height="16" rx="3" fill="#EF4444" opacity="0.2" />
      <text x="358" y="273" textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="700" opacity="0.7">COST VARIANCE REPORT</text>
      {[0,1,2,3].map(i => (
        <line key={i} x1="278" y1={295 + i*22} x2="522" y2={295 + i*22}
          stroke="#E8E4DD" strokeWidth="1" opacity="0.8" />
      ))}
      <text x="522" y="310" textAnchor="end" fontSize="10" fill="#EF4444" fontWeight="700" opacity="0.6">$3,200</text>
      <text x="522" y="332" textAnchor="end" fontSize="10" fill="#EF4444" fontWeight="700" opacity="0.6">$800</text>
      <text x="522" y="354" textAnchor="end" fontSize="10" fill="#EF4444" fontWeight="700" opacity="0.6">$1,200</text>
      <line x1="278" y1="365" x2="522" y2="365" stroke="#EF4444" strokeWidth="1.5" opacity="0.3" />
      <text x="522" y="382" textAnchor="end" fontSize="12" fill="#DC2626" fontWeight="800" opacity="0.7">$5,200</text>
      {/* Dollar sign graphic */}
      <circle cx="660" cy="130" r="45" fill="#FEE2E2" opacity="0.5" />
      <text x="660" y="148" textAnchor="middle" fontSize="36" opacity="0.4">💸</text>
    </svg>
  );
}

function Scene7Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="s7g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#s7g)" />
      {/* Matrix grid on wall */}
      {["EXW","FOB","CIF","DDP"].map((term, col) => (
        <g key={term}>
          <text x={200 + col*110} y="135" textAnchor="middle" fontSize="12"
            fontWeight="800" fill={col===1 ? "#059669" : "#9CA3AF"} opacity="0.7">{term}</text>
          {[0,1,2,3,4,5,6,7].map(row => {
            const isS = (col === 0 && false) ||
                        (col === 1 && row < 4) ||
                        (col === 2 && row < 6) ||
                        (col === 3);
            const isBuyer = !isS;
            return (
              <rect key={row}
                x={155 + col*110} y={148 + row*28} width="90" height="22" rx="4"
                fill={isBuyer ? "#DBEAFE" : "#D1FAE5"} opacity="0.5"
              />
            );
          })}
        </g>
      ))}
      {/* Stage labels */}
      {["Factory","Inland","Export","Loading","Freight","Insurance","Import","Delivery"].map((label, i) => (
        <text key={label} x="148" y={163 + i*28} textAnchor="end" fontSize="9"
          fill="#6B7280" opacity="0.6">{label}</text>
      ))}
      {/* Pinned to wall visual */}
      <circle cx="400" cy="112" r="5" fill="#EF4444" opacity="0.4" />
      {/* Second shipment success */}
      <rect x="570" y="280" width="180" height="80" rx="10" fill="#D1FAE5" opacity="0.5" />
      <text x="660" y="316" textAnchor="middle" fontSize="12" fill="#065F46" fontWeight="700" opacity="0.7">2nd Shipment</text>
      <text x="660" y="336" textAnchor="middle" fontSize="11" fill="#059669" fontWeight="800" opacity="0.8">Cleared in 14h ✓</text>
    </svg>
  );
}

const SCENE_BACKGROUNDS: Record<number, () => React.ReactElement> = {
  1: Scene1Bg,
  2: Scene2Bg,
  3: Scene3Bg,
  4: Scene4Bg,
  5: Scene5Bg,
  6: Scene6Bg,
  7: Scene7Bg,
};

// ─── Location header overlay ──────────────────────────────────────────────────

interface LocationHeaderProps {
  step: number;
}

export function LocationHeaderOverlay({ step }: LocationHeaderProps) {
  const s = STEPS.find((s) => s.num === step);
  if (!s) return null;
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-0.5 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-sm border border-[#E8E4DD] rounded-lg px-3 py-1.5 shadow-sm">
        <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">{s.doc}</p>
        <p className="text-[11px] font-semibold text-[#1A1A1A] leading-tight">{s.location}</p>
        <p className="text-[9px] text-[#9CA3AF] leading-tight">{s.time}</p>
      </div>
    </div>
  );
}

// ─── SceneWrapper ─────────────────────────────────────────────────────────────

interface SceneWrapperProps {
  step: number;
  children: React.ReactNode;
}

export function SceneWrapper({ step, children }: SceneWrapperProps) {
  const Bg = SCENE_BACKGROUNDS[step] ?? Scene1Bg;

  return (
    <div className="relative isolate rounded-2xl overflow-hidden min-h-[340px] border border-[#E8E4DD] shadow-sm" style={{ zIndex: 0 }}>
      <Bg />
      <LocationHeaderOverlay step={step} />
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
