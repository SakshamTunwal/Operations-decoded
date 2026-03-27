"use client";

import React from "react";
import { motion } from "framer-motion";

export const sceneVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1,    transition: { duration: 0.45, ease: "easeOut" as const } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: "easeIn"  as const } },
};

// ─── Scene 1: Two Photos (The Problem) ──────────────────────────────────────

function Scene1() {
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      {/* Office wall */}
      <rect width="320" height="140" fill="#F8F7F4" />
      {/* Left photo — STOCKOUT */}
      <rect x="12" y="14" width="136" height="100" rx="6" fill="#FFF" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="18" y="20" width="124" height="66" rx="3" fill="#FFF1F2" />
      {/* Empty shelf */}
      <rect x="30" y="64" width="100" height="5" rx="1" fill="#FECACA" />
      <rect x="30" y="54" width="100" height="5" rx="1" fill="#FECACA" />
      <rect x="30" y="44" width="100" height="5" rx="1" fill="#FECACA" />
      {/* Empty shelf indicators */}
      <text x="80" y="38" textAnchor="middle" fontSize="10" fill="#F87171" fontFamily="sans-serif">— empty —</text>
      <text x="80" y="48" textAnchor="middle" fontSize="10" fill="#F87171" fontFamily="sans-serif">— empty —</text>
      <text x="80" y="58" textAnchor="middle" fontSize="10" fill="#F87171" fontFamily="sans-serif">— empty —</text>
      <rect x="18" y="90" width="124" height="18" rx="2" fill="#FEE2E2" />
      <text x="80" y="103" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#DC2626" fontFamily="sans-serif">STOCKOUT — SPF 50 Sport Spray</text>
      <text x="80" y="118" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">July 14th — $340,000 lost</text>
      <text x="80" y="128" textAnchor="middle" fontSize="7" fill="#EF4444" fontFamily="sans-serif">📸 Photo 1</text>
      {/* Right photo — OVERSTOCK */}
      <rect x="172" y="14" width="136" height="100" rx="6" fill="#FFF" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="178" y="20" width="124" height="66" rx="3" fill="#FFF7ED" />
      {/* Stacked boxes */}
      {[0,1,2,3].map(col => [0,1,2].map(row => (
        <rect key={`${col}-${row}`} x={188 + col*25} y={48 + row*(-12)} width="22" height="12" rx="2" fill={row===0?"#FED7AA":row===1?"#FDBA74":"#FB923C"} />
      )))}
      <text x="240" y="38" textAnchor="middle" fontSize="7" fill="#C2410C" fontFamily="sans-serif">1,200 units excess</text>
      <rect x="178" y="90" width="124" height="18" rx="2" fill="#FEF3C7" />
      <text x="240" y="103" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400E" fontFamily="sans-serif">OVERSTOCK — SPF 30 Lotion</text>
      <text x="240" y="118" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">Same summer — $89,000 write-off</text>
      <text x="240" y="128" textAnchor="middle" fontSize="7" fill="#F59E0B" fontFamily="sans-serif">📸 Photo 2</text>
    </svg>
  );
}

// ─── Scene 2: The Baseline (Bar Chart + Seasonality) ────────────────────────

function Scene2() {
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const vals   = [60, 68, 85, 103, 134, 168, 189, 154, 93, 51, 39, 71];
  const maxVal = 189;
  const chartH = 70;
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#EFF6FF" />
      {/* Grid lines */}
      {[0,25,50,75,100].map(pct => {
        const y = 110 - (pct/100)*chartH;
        return <line key={pct} x1="24" y1={y} x2="306" y2={y} stroke="#BFDBFE" strokeWidth="0.5" strokeDasharray="3 2" />;
      })}
      {/* Bars */}
      {vals.map((v, i) => {
        const barH = (v / maxVal) * chartH;
        const x = 28 + i * 23;
        const isJuly = i === 6;
        return (
          <g key={i}>
            <rect x={x} y={110 - barH} width="16" height={barH} rx="2"
              fill={isJuly ? "#1D4ED8" : "#93C5FD"} />
            <text x={x + 8} y="123" textAnchor="middle" fontSize="6" fill="#6B7280" fontFamily="sans-serif">{months[i]}</text>
          </g>
        );
      })}
      {/* July label */}
      <rect x="143" y="18" width="52" height="14" rx="3" fill="#1D4ED8" />
      <text x="169" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">SI = 1.78</text>
      <line x1="161" y1="32" x2="161" y2="40" stroke="#1D4ED8" strokeWidth="1.5" />
      {/* Avg line */}
      <line x1="24" y1={110 - (106/maxVal)*chartH} x2="306" y2={110 - (106/maxVal)*chartH} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="308" y={110 - (106/maxVal)*chartH + 3} fontSize="6" fill="#F59E0B" fontFamily="sans-serif">avg</text>
      {/* Title */}
      <text x="160" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E3A5F" fontFamily="sans-serif">SPF 50 — 3-Year Monthly Average (units, 000s)</text>
      {/* Baseline badge */}
      <rect x="6" y="126" width="180" height="12" rx="3" fill="#DBEAFE" />
      <text x="96" y="135" textAnchor="middle" fontSize="7" fill="#1D4ED8" fontFamily="sans-serif">Statistical baseline this year: 142,000 units</text>
    </svg>
  );
}

// ─── Scene 3: The Intelligence Gap ──────────────────────────────────────────

function Scene3() {
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#F8F7F4" />
      {/* Statistical bubble */}
      <rect x="10" y="28" width="118" height="70" rx="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      <text x="69" y="55" textAnchor="middle" fontSize="9" fill="#1D4ED8" fontFamily="sans-serif" fontWeight="bold">Statistical</text>
      <text x="69" y="70" textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="sans-serif">Model says:</text>
      <text x="69" y="88" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1D4ED8" fontFamily="sans-serif">142k</text>
      <text x="69" y="105" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">3yr historical baseline</text>
      {/* VS */}
      <rect x="138" y="57" width="44" height="24" rx="8" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
      <text x="160" y="73" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400E" fontFamily="sans-serif">GAP</text>
      {/* Vanessa bubble */}
      <rect x="192" y="28" width="118" height="70" rx="10" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
      <text x="251" y="55" textAnchor="middle" fontSize="9" fill="#065F46" fontFamily="sans-serif" fontWeight="bold">Vanessa says:</text>
      <text x="251" y="70" textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="sans-serif">Field intelligence:</text>
      <text x="251" y="88" textAnchor="middle" fontSize="18" fontWeight="800" fill="#059669" fontFamily="sans-serif">180k</text>
      <text x="251" y="105" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">3 major retail accounts</text>
      {/* Gap annotation */}
      <line x1="128" y1="63" x2="140" y2="69" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="180" y1="69" x2="192" y2="63" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="160" y="120" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400E" fontFamily="sans-serif">38,000 unit gap — which number wins?</text>
      <text x="160" y="133" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="sans-serif">Tom needs to decide how much to trust each signal</text>
    </svg>
  );
}

// ─── Scene 4: MAPE Measurement ──────────────────────────────────────────────

function Scene4() {
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#FFF7ED" />
      {/* Left: big MAPE gauge */}
      <circle cx="80" cy="72" r="52" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      {/* Gauge arc background */}
      <path d="M32 72 A48 48 0 0 1 128 72" stroke="#E5E7EB" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Red filled arc - 31% of semicircle */}
      <path d="M32 72 A48 48 0 0 1 97 30" stroke="#EF4444" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Target marker at 15% */}
      <circle cx="61" cy="34" r="4" fill="#10B981" />
      <text x="48" y="28" fontSize="7" fill="#10B981" fontFamily="sans-serif">target</text>
      <text x="48" y="36" fontSize="7" fill="#10B981" fontFamily="sans-serif">15%</text>
      {/* Center text */}
      <text x="80" y="66" textAnchor="middle" fontSize="22" fontWeight="800" fill="#EF4444" fontFamily="sans-serif">31%</text>
      <text x="80" y="80" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Prior Year MAPE</text>
      <text x="80" y="92" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="sans-serif">industry best: 10–15%</text>
      {/* Right: formula box */}
      <rect x="145" y="18" width="162" height="106" rx="8" fill="white" stroke="#FED7AA" strokeWidth="1.5" />
      <text x="226" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400E" fontFamily="sans-serif">MAPE Formula</text>
      <rect x="153" y="42" width="146" height="22" rx="4" fill="#FEF3C7" />
      <text x="226" y="55" textAnchor="middle" fontSize="8" fill="#92400E" fontFamily="sans-serif">|Forecast − Actual| / Actual × 100</text>
      <text x="226" y="72" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">Then average across all periods</text>
      <line x1="153" y1="80" x2="291" y2="80" stroke="#FDE68A" strokeWidth="1" />
      <text x="155" y="93" fontSize="8" fill="#EF4444" fontFamily="sans-serif" fontWeight="bold">Jul miss: |118k−189k|/189k = 37.6%</text>
      <text x="155" y="107" fontSize="8" fill="#EF4444" fontFamily="sans-serif">Sep miss: |150k−99k|/99k = 51.5%</text>
      <text x="155" y="120" fontSize="7" fill="#9CA3AF" fontFamily="sans-serif">These two months drove the 31% average</text>
    </svg>
  );
}

// ─── Scene 5: S&OP Meeting ───────────────────────────────────────────────────

function Scene5() {
  const seats = [
    { x: 62,  y: 52, name: "Tom",    num: "152k", color: "#3B82F6", bg: "#EFF6FF" },
    { x: 166, y: 52, name: "Vanessa",num: "180k", color: "#10B981", bg: "#ECFDF5" },
    { x: 62,  y: 100,name: "Chloe",  num: "150k", color: "#F59E0B", bg: "#FFFBEB" },
    { x: 166, y: 100,name: "Omar",   num: "160k", color: "#8B5CF6", bg: "#F5F3FF" },
  ];
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#F0F9FF" />
      {/* Table */}
      <rect x="44" y="40" width="172" height="80" rx="8" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="2" />
      {/* Seats */}
      {seats.map(s => (
        <g key={s.name}>
          <rect x={s.x - 28} y={s.y - 16} width="56" height="32" rx="6" fill={s.bg} stroke={s.color} strokeWidth="1.5" />
          <text x={s.x} y={s.y - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill={s.color} fontFamily="sans-serif">{s.name}</text>
          <text x={s.x} y={s.y + 9} textAnchor="middle" fontSize="11" fontWeight="800" fill={s.color} fontFamily="sans-serif">{s.num}</text>
        </g>
      ))}
      {/* Consensus arrow */}
      <rect x="240" y="52" width="72" height="36" rx="8" fill="#1D4ED8" />
      <text x="276" y="68" textAnchor="middle" fontSize="8" fill="white" fontFamily="sans-serif" fontWeight="bold">Consensus</text>
      <text x="276" y="83" textAnchor="middle" fontSize="16" fontWeight="800" fill="white" fontFamily="sans-serif">158k</text>
      <line x1="220" y1="70" x2="238" y2="70" stroke="#1D4ED8" strokeWidth="2" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#1D4ED8" />
        </marker>
      </defs>
      <text x="160" y="132" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="sans-serif">ProShield — First S&amp;OP Consensus Meeting</text>
    </svg>
  );
}

// ─── Scene 6: Assumption Log ─────────────────────────────────────────────────

function Scene6() {
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#F0FDF4" />
      {/* Notebook */}
      <rect x="12" y="12" width="200" height="116" rx="6" fill="white" stroke="#BBF7D0" strokeWidth="1.5" />
      <rect x="12" y="12" width="16" height="116" rx="6" fill="#BBF7D0" />
      {/* Lines */}
      <text x="38" y="30" fontSize="9" fontWeight="bold" fill="#065F46" fontFamily="sans-serif">Assumption Log — SPF 50 Q3</text>
      {["Summer temps ≥ 2°C above norm", "SunLife order activates by Mar 31", "No competitor launch in Q2/Q3"].map((t, i) => (
        <g key={i}>
          <rect x="32" y={38 + i*22} width="8" height="8" rx="2" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
          <text x="46" y={47 + i*22} fontSize="7.5" fill="#374151" fontFamily="sans-serif">{t}</text>
          {i < 2 && <rect x="32" y={40 + i*22} width="4" height="4" rx="1" fill="#10B981" />}
        </g>
      ))}
      <line x1="28" y1="104" x2="200" y2="104" stroke="#D1FAE5" strokeWidth="1" />
      <text x="38" y="116" fontSize="7" fill="#9CA3AF" fontFamily="sans-serif">Forecast: 158,000 units — locked Jan 17</text>
      {/* Alert badge */}
      <rect x="222" y="18" width="90" height="70" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
      <text x="267" y="37" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#DC2626" fontFamily="sans-serif">⚠ TRIGGER</text>
      <text x="267" y="50" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">Temps running</text>
      <text x="267" y="62" textAnchor="middle" fontSize="14" fontWeight="800" fill="#DC2626" fontFamily="sans-serif">+12%</text>
      <text x="267" y="75" textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">above seasonal</text>
      {/* Reforecast arrow */}
      <rect x="222" y="96" width="90" height="34" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
      <text x="267" y="111" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#059669" fontFamily="sans-serif">REFORECAST</text>
      <text x="267" y="123" textAnchor="middle" fontSize="9" fontWeight="800" fill="#059669" fontFamily="sans-serif">158k → 172k</text>
    </svg>
  );
}

// ─── Scene 7: The Results Dashboard ─────────────────────────────────────────

function Scene7() {
  const panels = [
    { label: "Units Sold",    val: "169,400", color: "#3B82F6" },
    { label: "MAPE",          val: "14.2%",   color: "#10B981" },
    { label: "Service Level", val: "97%",      color: "#10B981" },
    { label: "Stockout",      val: "$0",       color: "#10B981" },
    { label: "Overstock",     val: "$18.4k",   color: "#F59E0B" },
    { label: "Rush Jobs",     val: "0",        color: "#10B981" },
  ];
  return (
    <svg width="100%" viewBox="0 0 320 140" fill="none">
      <rect width="320" height="140" fill="#ECFDF5" />
      <text x="160" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065F46" fontFamily="sans-serif">Season Results — ProShield SPF 50</text>
      {panels.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 8 + col * 103;
        const y = 24 + row * 52;
        return (
          <g key={p.label}>
            <rect x={x} y={y} width="98" height="42" rx="6" fill="white" stroke="#D1FAE5" strokeWidth="1.5" />
            <text x={x + 49} y={y + 16} textAnchor="middle" fontSize="7" fill="#6B7280" fontFamily="sans-serif">{p.label}</text>
            <text x={x + 49} y={y + 33} textAnchor="middle" fontSize="14" fontWeight="800" fill={p.color} fontFamily="sans-serif">{p.val}</text>
          </g>
        );
      })}
      {/* Footer */}
      <rect x="8" y="128" width="304" height="10" rx="3" fill="#D1FAE5" />
      <text x="160" y="136" textAnchor="middle" fontSize="7" fill="#065F46" fontFamily="sans-serif">Prior year: 31% MAPE · $340k stockout · $89k write-off → This year: 14.2% MAPE · $0 stockout · $18.4k overstock</text>
    </svg>
  );
}

// ─── SceneWrapper ────────────────────────────────────────────────────────────

export function SceneWrapper({ step }: { step: number }): React.ReactElement {
  const scenes: Record<number, React.ReactElement> = {
    1: <Scene1 />,
    2: <Scene2 />,
    3: <Scene3 />,
    4: <Scene4 />,
    5: <Scene5 />,
    6: <Scene6 />,
    7: <Scene7 />,
  };
  return (
    <motion.div
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-2xl overflow-hidden border border-[#E8E4DD] shadow-sm"
    >
      {scenes[step] ?? scenes[1]}
    </motion.div>
  );
}
