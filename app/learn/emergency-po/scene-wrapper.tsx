"use client";

import React from "react";
import { motion } from "framer-motion";
import { STEPS } from "./constants";

// ─── Scene transition variants ─────────────────────────────────────────────────

export const sceneVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -14, scale: 0.97, transition: { duration: 0.28, ease: "easeIn" as const } },
};

// ─── SVG Backgrounds ───────────────────────────────────────────────────────────

function Scene1Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep1g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <radialGradient id="ep1phone" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep1g)" />
      {/* Desk */}
      <rect x="50" y="320" width="700" height="14" rx="4" fill="#D97706" opacity="0.15" />
      {/* Monitor */}
      <rect x="280" y="150" width="240" height="160" rx="8" fill="#1C1917" opacity="0.1" />
      <rect x="290" y="160" width="220" height="140" rx="5" fill="#FEF3C7" opacity="0.85" />
      {/* Monitor stand */}
      <rect x="385" y="310" width="30" height="12" rx="2" fill="#1C1917" opacity="0.08" />
      <rect x="360" y="320" width="80" height="8" rx="3" fill="#1C1917" opacity="0.08" />
      {/* Screen: HARTMANN LINE DOWN */}
      <rect x="298" y="180" width="204" height="30" rx="4" fill="#FEE2E2" opacity="0.8" />
      <text x="400" y="200" textAnchor="middle" fontSize="10" fontWeight="800" fill="#DC2626" opacity="0.9">⚠️ HARTMANN LINE DOWN</text>
      {/* Clock showing 4:32 */}
      <circle cx="130" cy="100" r="40" fill="white" opacity="0.6" stroke="#E8E4DD" strokeWidth="1.5" />
      <text x="130" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1917" opacity="0.7">4:32</text>
      <text x="130" y="108" textAnchor="middle" fontSize="8" fill="#9CA3AF" opacity="0.8">PM</text>
      {/* Clock hands */}
      <line x1="130" y1="100" x2="130" y2="72" stroke="#1C1917" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="130" y1="100" x2="148" y2="106" stroke="#1C1917" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      {/* Phone with amber glow */}
      <circle cx="650" cy="130" r="50" fill="url(#ep1phone)" />
      <circle cx="650" cy="130" r="32" fill="#F59E0B" opacity="0.15" />
      <text x="650" y="140" textAnchor="middle" fontSize="28">📞</text>
      {/* Ringing arcs */}
      <path d="M620 90 Q650 70 680 90" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="4 3" />
      <path d="M610 78 Q650 54 690 78" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="4 3" />
      {/* Desk items */}
      <rect x="100" y="270" width="130" height="50" rx="4" fill="white" opacity="0.7" />
      <line x1="114" y1="285" x2="218" y2="285" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
      <line x1="114" y1="297" x2="195" y2="297" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.7" />
      <line x1="114" y1="307" x2="210" y2="307" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

function Scene2Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep2g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F5F0E8" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep2g)" />
      {/* Desk */}
      <rect x="50" y="330" width="700" height="14" rx="4" fill="#D97706" opacity="0.12" />
      {/* Left: Credit card with red X */}
      <rect x="100" y="190" width="200" height="130" rx="14" fill="#FEE2E2" opacity="0.8" stroke="#EF4444" strokeWidth="1.5" />
      <rect x="110" y="220" width="180" height="24" rx="4" fill="#EF4444" opacity="0.2" />
      <text x="200" y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill="#DC2626" opacity="0.7">💳 PERSONAL CARD</text>
      {/* Red X */}
      <circle cx="200" cy="270" r="22" fill="#EF4444" opacity="0.15" />
      <line x1="186" y1="256" x2="214" y2="284" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <line x1="214" y1="256" x2="186" y2="284" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* Middle: Decision scales */}
      <line x1="400" y1="160" x2="400" y2="320" stroke="#E8E4DD" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
      <text x="400" y="155" textAnchor="middle" fontSize="11" fill="#9CA3AF" fontWeight="600" opacity="0.6">DECISION</text>
      {/* Right: PO form with green checkmark */}
      <rect x="500" y="190" width="200" height="130" rx="14" fill="#D1FAE5" opacity="0.8" stroke="#10B981" strokeWidth="1.5" />
      <rect x="510" y="210" width="180" height="16" rx="3" fill="#10B981" opacity="0.2" />
      <text x="600" y="224" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46" opacity="0.8">📋 EMERGENCY PO</text>
      <text x="600" y="244" textAnchor="middle" fontSize="9" fill="#065F46" opacity="0.6">EP-2024-009</text>
      {/* Green checkmark */}
      <circle cx="600" cy="278" r="22" fill="#10B981" opacity="0.15" />
      <path d="M588 278 L596 286 L614 268" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      {/* Decorative dots */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx={680 + i*18} cy={80 + (i%2)*28} r="3" fill="#f59e0b" opacity="0.12" />
      ))}
    </svg>
  );
}

function Scene3Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep3g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep3g)" />
      {/* Left: Phone showing "Victor" */}
      <rect x="90" y="160" width="150" height="240" rx="18" fill="#1E3A5F" opacity="0.12" />
      <rect x="100" y="170" width="130" height="220" rx="14" fill="white" opacity="0.7" />
      <rect x="115" y="185" width="100" height="12" rx="4" fill="#94A3B8" opacity="0.3" />
      <circle cx="165" cy="240" r="30" fill="#E2E8F0" opacity="0.8" />
      <text x="165" y="248" textAnchor="middle" fontSize="18">👤</text>
      <text x="165" y="290" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1E3A5F" opacity="0.8">VICTOR</text>
      <text x="165" y="304" textAnchor="middle" fontSize="8" fill="#64748B" opacity="0.6">Calling...</text>
      {/* Signal bars */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={118 + i*12} y={355 - i*6} width="8" height={8 + i*6} rx="2"
          fill="#3B82F6" opacity={0.3 + i*0.15} />
      ))}
      {/* Right: PO form being drafted */}
      <rect x="470" y="150" width="260" height="200" rx="10" fill="white" opacity="0.7" stroke="#E8E4DD" strokeWidth="1" />
      <rect x="480" y="162" width="240" height="24" rx="5" fill="#FEF3C7" opacity="0.8" />
      <text x="600" y="179" textAnchor="middle" fontSize="10" fontWeight="800" fill="#D97706" opacity="0.9">EMERGENCY PURCHASE ORDER</text>
      <text x="600" y="210" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1C1917" opacity="0.7">EP-2024-009</text>
      <line x1="488" y1="228" x2="722" y2="228" stroke="#E8E4DD" strokeWidth="1" />
      <text x="488" y="246" fontSize="9" fill="#9CA3AF" opacity="0.8">Vendor: FastParts Co.</text>
      <text x="488" y="262" fontSize="9" fill="#9CA3AF" opacity="0.8">Amount: up to $5,000</text>
      <text x="488" y="278" fontSize="9" fill="#9CA3AF" opacity="0.8">Auth: Victor Laine — Verbal</text>
      <text x="488" y="294" fontSize="9" fill="#9CA3AF" opacity="0.8">Part: HDS-4420-R</text>
      {/* Connector arrow */}
      <path d="M250 255 Q360 180 460 220" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.2" strokeDasharray="6 4" />
      <polygon points="455,215 465,220 458,228" fill="#3B82F6" opacity="0.2" />
    </svg>
  );
}

function Scene4Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep4g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep4g)" />
      {/* Desk */}
      <rect x="50" y="330" width="700" height="14" rx="4" fill="#D97706" opacity="0.12" />
      {/* Clipboard/notepad */}
      <rect x="240" y="130" width="320" height="220" rx="8" fill="#F5F0E8" opacity="0.9" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="355" y="118" width="90" height="24" rx="5" fill="#D97706" opacity="0.3" />
      {/* Notepad lines — 4 questions */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <text x="260" y={172 + i * 46} fontSize="8" fill="#9CA3AF" opacity="0.6" fontWeight="600">
            {["What was the emergency?", "Why no competitive quotes?", "Why FastParts?", "Who authorized?"][i]}
          </text>
          <line x1="260" y1={182 + i * 46} x2="540" y2={182 + i * 46} stroke="#E8E4DD" strokeWidth="1" opacity="0.8" />
        </g>
      ))}
      {/* Timestamp */}
      <rect x="430" y="362" width="110" height="22" rx="6" fill="#FEF3C7" opacity="0.8" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="485" y="377" textAnchor="middle" fontSize="9" fill="#D97706" fontWeight="700" opacity="0.9">4:56 PM</text>
      {/* Folder icon */}
      <rect x="620" y="200" width="110" height="80" rx="6" fill="#F59E0B" opacity="0.1" stroke="#f59e0b" strokeWidth="1" />
      <rect x="620" y="190" width="60" height="16" rx="4" fill="#F59E0B" opacity="0.15" />
      <text x="675" y="248" textAnchor="middle" fontSize="10" fill="#D97706" fontWeight="700" opacity="0.7">Emergency</text>
      <text x="675" y="263" textAnchor="middle" fontSize="10" fill="#D97706" fontWeight="700" opacity="0.7">Docs 📁</text>
      {/* Pen */}
      <rect x="570" y="340" width="100" height="12" rx="6" fill="#1C1917" opacity="0.15" transform="rotate(-30 570 340)" />
    </svg>
  );
}

function Scene5Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep5g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep5g)" />
      {/* Industrial floor */}
      <rect x="0" y="380" width="800" height="120" fill="#E2E8F0" opacity="0.4" />
      {/* Shelving unit */}
      {[0,1,2].map(row => (
        <g key={row}>
          <rect x="80" y={160 + row * 70} width="300" height="10" rx="2" fill="#94A3B8" opacity="0.3" />
          {[0,1,2].map(col => (
            <rect key={col} x={90 + col * 95} y={170 + row * 70} width="80" height="55" rx="3"
              fill="#CBD5E1" opacity="0.25" />
          ))}
        </g>
      ))}
      {/* FastParts counter */}
      <rect x="480" y="240" width="270" height="140" rx="8" fill="white" opacity="0.7" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="480" y="240" width="270" height="36" rx="8" fill="#1E3A5F" opacity="0.12" />
      <text x="615" y="263" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1E3A5F" opacity="0.7">FASTPARTS CO.</text>
      {/* Box labeled HDS-4420-R */}
      <rect x="530" y="300" width="90" height="60" rx="4" fill="#FEF3C7" opacity="0.9" stroke="#D97706" strokeWidth="1.5" />
      <text x="575" y="326" textAnchor="middle" fontSize="8" fontWeight="700" fill="#D97706" opacity="0.9">HDS-4420-R</text>
      <text x="575" y="340" textAnchor="middle" fontSize="7" fill="#9CA3AF" opacity="0.7">Hydraulic Seal</text>
      <text x="575" y="353" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1C1917" opacity="0.6">$4,200</text>
      {/* Clock 5:18 */}
      <circle cx="690" cy="90" r="36" fill="white" opacity="0.6" stroke="#E8E4DD" strokeWidth="1.5" />
      <text x="690" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1917" opacity="0.7">5:18</text>
      <text x="690" y="98" textAnchor="middle" fontSize="8" fill="#9CA3AF" opacity="0.8">PM</text>
      {/* Checkmark overlay */}
      <circle cx="100" cy="100" r="28" fill="#D1FAE5" opacity="0.6" />
      <path d="M88 100 L96 108 L114 90" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function Scene6Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep6g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="100%" stopColor="#F3E8FF" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep6g)" />
      {/* Desk */}
      <rect x="50" y="340" width="700" height="14" rx="4" fill="#7C3AED" opacity="0.1" />
      {/* Manila folder */}
      <rect x="220" y="200" width="360" height="220" rx="8" fill="#FEF3C7" opacity="0.8" stroke="#F59E0B" strokeWidth="1.5" />
      <rect x="220" y="188" width="140" height="22" rx="6" fill="#F59E0B" opacity="0.3" />
      <text x="290" y="215" fontSize="10" fontWeight="700" fill="#92400E" opacity="0.8">AUDIT FOLDER</text>
      {/* 6 document cards fanned */}
      {[0,1,2,3,4,5].map(i => (
        <g key={i} transform={`rotate(${-10 + i * 4}, 400, 310)`}>
          <rect x={255 + i * 2} y={220 + i} width="140" height="90" rx="5"
            fill="white" opacity={0.4 + i * 0.1} stroke="#E8E4DD" strokeWidth="1" />
        </g>
      ))}
      {/* AUDIT REVIEW header */}
      <rect x="160" y="120" width="200" height="36" rx="8" fill="#7C3AED" opacity="0.1" />
      <text x="260" y="143" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6D28D9" opacity="0.7">AUDIT REVIEW</text>
      {/* Magnifying glass */}
      <circle cx="620" cy="140" r="40" fill="white" opacity="0.5" />
      <circle cx="610" cy="130" r="22" fill="none" stroke="#7C3AED" strokeWidth="3" opacity="0.3" />
      <line x1="626" y1="146" x2="645" y2="165" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <text x="610" y="138" textAnchor="middle" fontSize="16" opacity="0.5">🔍</text>
      {/* EP-2024-009 tag */}
      <rect x="480" y="360" width="160" height="28" rx="6" fill="#D1FAE5" opacity="0.8" stroke="#10B981" strokeWidth="1" />
      <text x="560" y="379" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46" opacity="0.9">EP-2024-009 ✓ CLEAN</text>
    </svg>
  );
}

function Scene7Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ep7g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#ep7g)" />
      {/* Conference room table */}
      <ellipse cx="400" cy="400" rx="300" ry="55" fill="#E8E4DD" opacity="0.35" />
      {/* Whiteboard */}
      <rect x="80" y="100" width="640" height="240" rx="10" fill="white" opacity="0.65" stroke="#E8E4DD" strokeWidth="2" />
      <rect x="80" y="100" width="640" height="30" rx="10" fill="#F5F0E8" opacity="0.8" />
      <text x="400" y="121" textAnchor="middle" fontSize="11" fontWeight="800" fill="#D97706" opacity="0.8">EMERGENCY PROCUREMENT FRAMEWORK</text>
      {/* 4 columns */}
      {["Vendor List", "PO Protocol", "Justification", "Culture"].map((label, i) => (
        <g key={label}>
          {/* Column dividers */}
          {i > 0 && <line x1={240 + i * 130} y1="138" x2={240 + i * 130} y2="332" stroke="#E8E4DD" strokeWidth="1.5" opacity="0.6" />}
          {/* Column headers */}
          <rect x={98 + i * 152} y="145" width="130" height="24" rx="5"
            fill={["#FEF3C7","#DBEAFE","#D1FAE5","#F3E8FF"][i]} opacity="0.8" />
          <text x={163 + i * 152} y="161" textAnchor="middle" fontSize="9" fontWeight="800"
            fill={["#D97706","#1E40AF","#065F46","#6D28D9"][i]} opacity="0.8">{label}</text>
          {/* Column content lines */}
          {[0,1,2].map(row => (
            <rect key={row} x={104 + i * 152} y={180 + row * 44} width="118" height="34" rx="5"
              fill={["#FEF3C7","#DBEAFE","#D1FAE5","#F3E8FF"][i]} opacity={0.3 + row * 0.1} />
          ))}
        </g>
      ))}
      {/* Pin at top */}
      <circle cx="400" cy="97" r="6" fill="#EF4444" opacity="0.4" />
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

// ─── Location header overlay ───────────────────────────────────────────────────

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

// ─── SceneWrapper ──────────────────────────────────────────────────────────────

interface SceneWrapperProps {
  step: number;
  children: React.ReactNode;
}

export function SceneWrapper({ step, children }: SceneWrapperProps) {
  const Bg = SCENE_BACKGROUNDS[step] ?? Scene1Bg;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[340px] border border-[#E8E4DD] shadow-sm">
      <Bg />
      <LocationHeaderOverlay step={step} />
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
