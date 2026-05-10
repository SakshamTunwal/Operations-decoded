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

function Scene1Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c1g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="100%" stopColor="#FCE7F3" />
        </linearGradient>
        <radialGradient id="o2c1glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#BE185D" stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c1g)" />
      {/* Desk surface */}
      <rect x="50" y="330" width="700" height="14" rx="4" fill="#BE185D" opacity="0.1" />
      {/* Monitor */}
      <rect x="270" y="130" width="260" height="180" rx="8" fill="#1C1917" opacity="0.08" />
      <rect x="282" y="142" width="236" height="156" rx="5" fill="#FFF1F2" opacity="0.85" />
      {/* Monitor stand */}
      <rect x="385" y="310" width="30" height="12" rx="2" fill="#1C1917" opacity="0.06" />
      <rect x="360" y="320" width="80" height="8" rx="3" fill="#1C1917" opacity="0.06" />
      {/* Screen: Meridian Commerce header */}
      <rect x="290" y="150" width="220" height="28" rx="4" fill="#FCE7F3" opacity="0.9" />
      <text x="400" y="169" textAnchor="middle" fontSize="10" fontWeight="800" fill="#BE185D" opacity="0.9">MERIDIAN COMMERCE</text>
      {/* Screen: SO form */}
      <rect x="290" y="186" width="220" height="16" rx="3" fill="#E8E4DD" opacity="0.5" />
      <text x="400" y="198" textAnchor="middle" fontSize="9" fill="#4B5563" opacity="0.7">Sales Order SO-7841</text>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="295" y={210 + i * 22} width="100" height="10" rx="2" fill="#E8E4DD" opacity="0.4" />
          <rect x="402" y={210 + i * 22} width="100" height="10" rx="2" fill="#FCE7F3" opacity="0.6" />
        </g>
      ))}
      {/* PO folder on desk */}
      <rect x="80" y="250" width="160" height="75" rx="6" fill="#FEF3C7" opacity="0.85" stroke="#D97706" strokeWidth="1" />
      <rect x="80" y="238" width="90" height="20" rx="5" fill="#D97706" opacity="0.3" />
      <text x="125" y="252" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400E" opacity="0.8">PURCHASE ORDER</text>
      <text x="160" y="280" textAnchor="middle" fontSize="9" fontWeight="800" fill="#D97706" opacity="0.9">MER-2024-1183</text>
      <text x="160" y="296" textAnchor="middle" fontSize="8" fill="#6B7280" opacity="0.7">50,000 units</text>
      <text x="160" y="310" textAnchor="middle" fontSize="8" fill="#6B7280" opacity="0.7">$175,000 · Net-30</text>
      {/* Decorative dots */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx={660 + i * 20} cy={80 + (i % 2) * 24} r="3" fill="#BE185D" opacity="0.1" />
      ))}
      {/* Small calendar showing Monday */}
      <rect x="620" y="200" width="100" height="80" rx="6" fill="white" opacity="0.6" stroke="#E8E4DD" strokeWidth="1" />
      <rect x="620" y="200" width="100" height="22" rx="6" fill="#BE185D" opacity="0.15" />
      <text x="670" y="215" textAnchor="middle" fontSize="9" fontWeight="700" fill="#BE185D" opacity="0.8">MONDAY AM</text>
      <text x="670" y="256" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1A1A1A" opacity="0.15">1</text>
    </svg>
  );
}

function Scene2Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c2g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c2g)" />
      {/* Whiteboard — Production Capacity */}
      <rect x="80" y="100" width="640" height="280" rx="10" fill="white" opacity="0.65" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="80" y="100" width="640" height="34" rx="10" fill="#DBEAFE" opacity="0.8" />
      <text x="400" y="122" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1D4ED8" opacity="0.8">PRODUCTION CAPACITY — SAM ACHEBE</text>
      {/* Gantt chart rows — 3 batches */}
      {[
        { label: "Batch 1", color: "#22C55E", offset: 0, width: 120, week: "Wk 1–2" },
        { label: "Batch 2", color: "#F59E0B", offset: 130, width: 120, week: "Wk 3–4" },
        { label: "Batch 3", color: "#EF4444", offset: 270, width: 130, week: "Wk 5–6" },
      ].map((b, i) => (
        <g key={b.label}>
          {/* Row label */}
          <text x="105" y={168 + i * 65} fontSize="10" fontWeight="700" fill="#1D4ED8" opacity="0.8">{b.label}</text>
          <text x="105" y={182 + i * 65} fontSize="8" fill="#6B7280" opacity="0.6">{i === 0 ? "17,000 units" : i === 1 ? "17,000 units" : "16,000 units"}</text>
          {/* Timeline bar background */}
          <rect x="210" y={155 + i * 65} width="460" height="22" rx="4" fill="#F1F5F9" opacity="0.8" />
          {/* Week labels */}
          {[1,2,3,4,5,6].map(w => (
            <text key={w} x={210 + (w - 1) * 76 + 38} y={192 + i * 65} textAnchor="middle" fontSize="7" fill="#9CA3AF" opacity="0.6">W{w}</text>
          ))}
          {/* Capacity bar */}
          <rect x={210 + b.offset} y={156 + i * 65} width={b.width} height="20" rx="4" fill={b.color} opacity="0.45" />
          {/* Week label on bar */}
          <text x={210 + b.offset + b.width / 2} y={170 + i * 65} textAnchor="middle" fontSize="8" fontWeight="700" fill={b.color} opacity="0.9">{b.week}</text>
        </g>
      ))}
      {/* Status indicators */}
      <rect x="100" y="360" width="90" height="22" rx="6" fill="#D1FAE5" opacity="0.9" stroke="#22C55E" strokeWidth="1" />
      <text x="145" y="375" textAnchor="middle" fontSize="8" fontWeight="700" fill="#065F46" opacity="0.9">✓ CONFIRM</text>
      <rect x="200" y="360" width="110" height="22" rx="6" fill="#FEF3C7" opacity="0.9" stroke="#F59E0B" strokeWidth="1" />
      <text x="255" y="375" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400E" opacity="0.9">⚠ CONDITIONAL</text>
      <rect x="322" y="360" width="90" height="22" rx="6" fill="#FEE2E2" opacity="0.9" stroke="#EF4444" strokeWidth="1" />
      <text x="367" y="375" textAnchor="middle" fontSize="8" fontWeight="700" fill="#DC2626" opacity="0.9">⚡ AT-RISK</text>
    </svg>
  );
}

function Scene3Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c3g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c3g)" />
      {/* Phone icon — call in progress */}
      <circle cx="160" cy="160" r="60" fill="white" opacity="0.5" />
      <circle cx="160" cy="160" r="40" fill="#D1FAE5" opacity="0.7" />
      <text x="160" y="172" textAnchor="middle" fontSize="30">📞</text>
      {/* Call arcs */}
      <path d="M122 110 Q160 85 198 110" stroke="#059669" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5 3" />
      <path d="M108 92 Q160 62 212 92" stroke="#059669" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="5 3" />
      <text x="160" y="220" textAnchor="middle" fontSize="9" fontWeight="700" fill="#065F46" opacity="0.7">Brendan Holt</text>
      <text x="160" y="234" textAnchor="middle" fontSize="8" fill="#6B7280" opacity="0.6">Meridian Commerce</text>
      {/* Order Acknowledgement document */}
      <rect x="380" y="110" width="300" height="260" rx="10" fill="white" opacity="0.72" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="380" y="110" width="300" height="36" rx="10" fill="#D1FAE5" opacity="0.9" />
      <text x="530" y="133" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065F46" opacity="0.85">ORDER ACKNOWLEDGEMENT</text>
      <text x="530" y="162" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1A1A1A" opacity="0.6">SO-7841</text>
      <line x1="396" y1="178" x2="664" y2="178" stroke="#E8E4DD" strokeWidth="1" />
      {/* Doc fields */}
      {[
        ["Customer", "Meridian Commerce"],
        ["PO Ref", "MER-2024-1183"],
        ["Qty", "50,000 units"],
        ["Value", "$175,000"],
        ["Batch 1", "End Week 2 ✓"],
        ["Batch 2", "End Week 4 ✓"],
        ["Batch 3", "End Wk 6 / Wk 7 ⚠"],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x="396" y={196 + i * 22} fontSize="8" fill="#9CA3AF" opacity="0.7">{k}:</text>
          <text x="480" y={196 + i * 22} fontSize="8" fontWeight="600" fill="#1A1A1A" opacity="0.7">{v}</text>
        </g>
      ))}
      {/* Signature line */}
      <line x1="396" y1="350" x2="530" y2="350" stroke="#E8E4DD" strokeWidth="1" />
      <text x="396" y="364" fontSize="8" fill="#9CA3AF" opacity="0.6">Nina Rao — Order Manager</text>
      {/* Checkmark badge */}
      <circle cx="648" cy="340" r="22" fill="#D1FAE5" opacity="0.9" stroke="#22C55E" strokeWidth="1.5" />
      <path d="M636 340 L644 348 L662 330" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function Scene4Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c4g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c4g)" />
      {/* Warehouse floor */}
      <rect x="0" y="380" width="800" height="120" fill="#E2E8F0" opacity="0.35" />
      {/* Racking shelves */}
      {[0,1].map(row => (
        <g key={row}>
          <rect x="60" y={180 + row * 80} width="280" height="8" rx="2" fill="#94A3B8" opacity="0.25" />
          {[0,1,2].map(col => (
            <rect key={col} x={70 + col * 90} y={188 + row * 80} width="75" height="64" rx="3" fill="#CBD5E1" opacity="0.2" />
          ))}
        </g>
      ))}
      {/* Pallet stacks of boxes — Batch 1 ready */}
      {[0,1,2].map(col => (
        <g key={col}>
          {[0,1,2].map(row => (
            <rect key={row}
              x={450 + col * 72}
              y={260 - row * 28}
              width="64" height="24" rx="3"
              fill="#FCE7F3" opacity={0.7 - row * 0.1}
              stroke="#BE185D" strokeWidth="0.8"
            />
          ))}
          <text x={482 + col * 72} y={300} textAnchor="middle" fontSize="7" fill="#BE185D" opacity="0.7">BATCH 1</text>
        </g>
      ))}
      {/* Alert badge — 200 UNITS defect */}
      <rect x="180" y="110" width="220" height="64" rx="10" fill="#FEF3C7" opacity="0.95" stroke="#F59E0B" strokeWidth="2" />
      <text x="290" y="134" textAnchor="middle" fontSize="10" fontWeight="800" fill="#92400E" opacity="0.9">⚠ QC ALERT</text>
      <text x="290" y="152" textAnchor="middle" fontSize="9" fill="#92400E" opacity="0.8">200 UNITS — logo shifted 4mm</text>
      {/* Magnifying glass */}
      <circle cx="660" cy="150" r="44" fill="white" opacity="0.5" />
      <circle cx="648" cy="138" r="26" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.35" />
      <line x1="666" y1="156" x2="688" y2="178" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" opacity="0.35" />
      <text x="648" y="146" textAnchor="middle" fontSize="18" opacity="0.5">🔍</text>
      {/* Delivery challan */}
      <rect x="60" y="110" width="100" height="64" rx="6" fill="white" opacity="0.7" stroke="#E8E4DD" strokeWidth="1" />
      <text x="110" y="128" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6B7280" opacity="0.8">DELIVERY CHALLAN</text>
      <text x="110" y="142" textAnchor="middle" fontSize="8" fontWeight="800" fill="#1A1A1A" opacity="0.6">DC-7841-01</text>
      <text x="110" y="156" textAnchor="middle" fontSize="7" fill="#9CA3AF" opacity="0.6">16,800 units</text>
      <text x="110" y="168" textAnchor="middle" fontSize="7" fill="#9CA3AF" opacity="0.6">Wk 2 Thursday</text>
    </svg>
  );
}

function Scene5Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c5g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c5g)" />
      {/* Desk */}
      <rect x="50" y="340" width="700" height="14" rx="4" fill="#6D28D9" opacity="0.1" />
      {/* Finance office desk items — laptop */}
      <rect x="80" y="200" width="220" height="140" rx="8" fill="#1C1917" opacity="0.06" />
      <rect x="92" y="212" width="196" height="116" rx="5" fill="#FAF5FF" opacity="0.85" />
      <rect x="92" y="212" width="196" height="22" rx="5" fill="#EDE9FE" opacity="0.7" />
      <text x="190" y="226" textAnchor="middle" fontSize="8" fontWeight="700" fill="#6D28D9" opacity="0.8">AR SYSTEM</text>
      {[0,1,2].map(i => (
        <rect key={i} x={100} y={242 + i * 26} width={180} height={18} rx="3" fill="#EDE9FE" opacity={0.5 - i * 0.1} />
      ))}
      {/* Invoice document — center */}
      <rect x="330" y="100" width="310" height="280" rx="10" fill="white" opacity="0.75" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="330" y="100" width="310" height="38" rx="10" fill="#EDE9FE" opacity="0.9" />
      <text x="485" y="124" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6D28D9" opacity="0.85">TAX INVOICE</text>
      <text x="485" y="152" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1A1A1A" opacity="0.65">INV-2024-3317</text>
      <line x1="346" y1="168" x2="624" y2="168" stroke="#E8E4DD" strokeWidth="1" />
      {/* Three reference numbers highlighted */}
      <rect x="340" y="176" width="293" height="20" rx="4" fill="#EDE9FE" opacity="0.6" />
      <text x="346" y="190" fontSize="8" fontWeight="700" fill="#6D28D9" opacity="0.85">PO Ref: MER-2024-1183</text>
      <rect x="340" y="200" width="293" height="20" rx="4" fill="#DBEAFE" opacity="0.5" />
      <text x="346" y="214" fontSize="8" fontWeight="700" fill="#1D4ED8" opacity="0.85">SO Ref: SO-7841</text>
      <rect x="340" y="224" width="293" height="20" rx="4" fill="#D1FAE5" opacity="0.5" />
      <text x="346" y="238" fontSize="8" fontWeight="700" fill="#065F46" opacity="0.85">Challan Ref: DC-7841-01</text>
      <line x1="346" y1="250" x2="624" y2="250" stroke="#E8E4DD" strokeWidth="1" strokeDasharray="4 3" />
      {/* Line items */}
      {[
        ["E-flute boxes, 4-colour", "16,800 × $3.50"],
        ["Batch 1 only", "$58,800.00"],
      ].map(([desc, val], i) => (
        <g key={i}>
          <text x="346" y={268 + i * 22} fontSize="8" fill="#4B5563" opacity="0.75">{desc}</text>
          <text x="624" y={268 + i * 22} textAnchor="end" fontSize="8" fontWeight="700" fill="#1A1A1A" opacity="0.75">{val}</text>
        </g>
      ))}
      {/* Total line */}
      <line x1="346" y1="305" x2="624" y2="305" stroke="#E8E4DD" strokeWidth="1" />
      <text x="346" y="322" fontSize="9" fontWeight="700" fill="#1A1A1A" opacity="0.8">TOTAL DUE — Net-30</text>
      <text x="624" y="322" textAnchor="end" fontSize="12" fontWeight="900" fill="#6D28D9" opacity="0.85">$58,800</text>
    </svg>
  );
}

function Scene6Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c6g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c6g)" />
      {/* AR Aging Report spreadsheet */}
      <rect x="80" y="110" width="640" height="260" rx="10" fill="white" opacity="0.72" stroke="#E8E4DD" strokeWidth="1.5" />
      {/* Header row */}
      <rect x="80" y="110" width="640" height="32" rx="10" fill="#F5F0E8" opacity="0.9" />
      <text x="130" y="131" fontSize="9" fontWeight="700" fill="#9CA3AF" opacity="0.8">CUSTOMER</text>
      <text x="280" y="131" fontSize="9" fontWeight="700" fill="#9CA3AF" opacity="0.8">INVOICE</text>
      <text x="380" y="131" fontSize="9" fontWeight="700" fill="#9CA3AF" opacity="0.8">AMOUNT</text>
      <text x="460" y="131" fontSize="9" fontWeight="700" fill="#9CA3AF" opacity="0.8">DUE DATE</text>
      <text x="570" y="131" fontSize="9" fontWeight="700" fill="#9CA3AF" opacity="0.8">DAYS OVERDUE</text>
      {/* Invoice rows */}
      {[
        { customer: "Meridian Commerce", inv: "INV-2024-3315", amount: "$58,800", due: "Week 6", days: "0", color: "#D1FAE5", textColor: "#065F46", badge: "PAID ✓" },
        { customer: "Meridian Commerce", inv: "INV-2024-3401", amount: "$59,500", due: "Week 8", days: "0", color: "#D1FAE5", textColor: "#065F46", badge: "PAID ✓" },
        { customer: "Meridian Commerce", inv: "INV-2024-3488", amount: "$56,000", due: "Week 10", days: "1+", color: "#FEE2E2", textColor: "#DC2626", badge: "OVERDUE ⚠" },
      ].map((row, i) => (
        <g key={i}>
          <rect x="80" y={142 + i * 52} width="640" height="46" fill={row.color} opacity="0.25" />
          <text x="96" y={162 + i * 52} fontSize="9" fontWeight="700" fill="#1A1A1A" opacity="0.8">{row.customer}</text>
          <text x="96" y={178 + i * 52} fontSize="8" fill="#9CA3AF" opacity="0.6">Corrugated packaging</text>
          <text x="280" y={168 + i * 52} fontSize="9" fill="#4B5563" opacity="0.75">{row.inv}</text>
          <text x="380" y={168 + i * 52} fontSize="9" fontWeight="700" fill="#1A1A1A" opacity="0.8">{row.amount}</text>
          <text x="460" y={168 + i * 52} fontSize="9" fill="#4B5563" opacity="0.75">{row.due}</text>
          <rect x="555" y={155 + i * 52} width="140" height="20" rx="5" fill={row.color} opacity="0.7" stroke={row.textColor} strokeWidth="0.8" />
          <text x="625" y={168 + i * 52} textAnchor="middle" fontSize="8" fontWeight="700" fill={row.textColor} opacity="0.9">{row.badge}</text>
        </g>
      ))}
      {/* Clock icon — overdue */}
      <circle cx="680" cy="90" r="36" fill="white" opacity="0.55" stroke="#E8E4DD" strokeWidth="1.5" />
      <text x="680" y="100" textAnchor="middle" fontSize="22">⏰</text>
      <text x="680" y="118" textAnchor="middle" fontSize="9" fontWeight="700" fill="#DC2626" opacity="0.7">OVERDUE</text>
      {/* Summary box */}
      <rect x="80" y="390" width="300" height="40" rx="8" fill="#FEE2E2" opacity="0.6" stroke="#EF4444" strokeWidth="1" />
      <text x="96" y="408" fontSize="9" fontWeight="700" fill="#DC2626" opacity="0.85">AR at risk: $56,000 · Day 1 overdue</text>
      <text x="96" y="422" fontSize="8" fill="#EF4444" opacity="0.7">Working capital impact: ~$22/day carrying cost</text>
    </svg>
  );
}

function Scene7Bg(): React.ReactElement {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="o2c7g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#F0FDF4" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#o2c7g)" />
      {/* Conference table */}
      <ellipse cx="400" cy="410" rx="310" ry="55" fill="#E8E4DD" opacity="0.3" />
      {/* Credit file document */}
      <rect x="80" y="130" width="240" height="220" rx="10" fill="white" opacity="0.72" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="80" y="130" width="240" height="34" rx="10" fill="#DBEAFE" opacity="0.8" />
      <text x="200" y="152" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1D4ED8" opacity="0.85">CUSTOMER CREDIT FILE</text>
      <text x="200" y="178" textAnchor="middle" fontSize="10" fill="#4B5563" opacity="0.7">Meridian Commerce</text>
      {/* B+ rating badge */}
      <circle cx="200" cy="250" r="36" fill="#FEF3C7" opacity="0.9" stroke="#F59E0B" strokeWidth="2" />
      <text x="200" y="259" textAnchor="middle" fontSize="22" fontWeight="900" fill="#D97706" opacity="0.9">B+</text>
      <text x="200" y="304" textAnchor="middle" fontSize="8" fill="#9CA3AF" opacity="0.7">was: A</text>
      {/* Payment terms document */}
      <rect x="380" y="130" width="280" height="220" rx="10" fill="white" opacity="0.72" stroke="#E8E4DD" strokeWidth="1.5" />
      <rect x="380" y="130" width="280" height="34" rx="10" fill="#D1FAE5" opacity="0.8" />
      <text x="520" y="152" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065F46" opacity="0.85">UPDATED CREDIT TERMS</text>
      {[
        ["Payment terms", "Net-20 (was Net-30)"],
        ["Advance payment", "50% on Batch 1"],
        ["Credit rating", "B+ (reviewed Q3)"],
        ["Next review", "3 clean payments"],
        ["Account status", "Active — watch"],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x="396" y={178 + i * 28} fontSize="8" fill="#9CA3AF" opacity="0.7">{k}:</text>
          <text x="396" y={192 + i * 28} fontSize="9" fontWeight="700" fill="#1A1A1A" opacity="0.75">{v}</text>
        </g>
      ))}
      {/* Checkmark */}
      <circle cx="640" cy="340" r="28" fill="#D1FAE5" opacity="0.9" stroke="#22C55E" strokeWidth="2" />
      <path d="M626 340 L636 350 L656 328" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
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
    <div className="relative isolate rounded-2xl overflow-hidden min-h-[340px] border border-[#E8E4DD] shadow-sm" style={{ zIndex: 0 }}>
      <Bg />
      <LocationHeaderOverlay step={step} />
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
