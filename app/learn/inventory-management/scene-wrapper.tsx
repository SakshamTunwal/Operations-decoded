"use client";

import React from "react";
import { motion } from "framer-motion";
import { STEPS } from "./constants";

export const sceneVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -14, scale: 0.97, transition: { duration: 0.28, ease: "easeIn" as const } },
};

// ─── SVG Backgrounds ──────────────────────────────────────────────────────────

function Scene1Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="im1g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="100%" stopColor="#DCFCE7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#im1g)" />
      <rect x="0" y="360" width="800" height="140" fill="#D1FAE5" opacity="0.3" />
      {[80, 220, 360, 500, 640].map((x, i) => (
        <g key={i}>
          <rect x={x} y="200" width="4" height="160" fill="#9CA3AF" opacity="0.4" />
          <rect x={x + 100} y="200" width="4" height="160" fill="#9CA3AF" opacity="0.4" />
          <rect x={x} y="200" width="104" height="4" fill="#9CA3AF" opacity="0.4" />
          <rect x={x} y="260" width="104" height="4" fill="#9CA3AF" opacity="0.4" />
          <rect x={x} y="320" width="104" height="4" fill="#9CA3AF" opacity="0.4" />
          <rect x={x + 8} y="208" width="22" height="22" rx="2" fill="#A7F3D0" opacity="0.8" />
          <rect x={x + 34} y="208" width="22" height="22" rx="2" fill="#6EE7B7" opacity="0.7" />
          <rect x={x + 60} y="208" width="22" height="22" rx="2" fill="#A7F3D0" opacity="0.6" />
          <rect x={x + 8} y="268" width="22" height="22" rx="2" fill="#10B981" opacity="0.3" />
          <rect x={x + 34} y="268" width="22" height="22" rx="2" fill="#6EE7B7" opacity="0.4" />
        </g>
      ))}
      <rect x="280" y="80" width="240" height="100" rx="8" fill="#1C1917" opacity="0.08" />
      <rect x="288" y="88" width="224" height="84" rx="5" fill="#F0FDF4" opacity="0.95" />
      <text x="400" y="118" textAnchor="middle" fontSize="11" fill="#065F46" fontWeight="700">ERP SYSTEM</text>
      <text x="400" y="138" textAnchor="middle" fontSize="9" fill="#10B981">AP-7200: 340 units ✓</text>
      <text x="400" y="155" textAnchor="middle" fontSize="8" fill="#6B7280">Last physical count: 14 months ago</text>
    </svg>
  );
}

function Scene2Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#F9FAFB" />
      <rect x="0" y="380" width="800" height="120" fill="#F3F4F6" opacity="0.8" />
      <rect x="200" y="80" width="400" height="280" rx="8" fill="white" opacity="0.9" />
      <rect x="200" y="80" width="400" height="32" rx="8" fill="#10B981" opacity="0.8" />
      <text x="400" y="101" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">PHYSICAL AUDIT — IN PROGRESS</text>
      {[130, 158, 186, 214, 242, 270].map((y, i) => (
        <g key={i}>
          <rect x="210" y={y} width="380" height="22" rx="2" fill={i % 2 === 0 ? "#F0FDF4" : "white"} opacity="0.8" />
          <rect x="218" y={y + 4} width="70" height="14" rx="2" fill="#D1FAE5" />
          <rect x="300" y={y + 4} width="50" height="14" rx="2" fill="#FEF9C3" opacity="0.7" />
          <rect x="364" y={y + 4} width="50" height="14" rx="2" fill="#DCFCE7" opacity="0.7" />
          {i === 0 && <rect x="426" y={y + 4} width="50" height="14" rx="2" fill="#FEE2E2" opacity="0.8" />}
        </g>
      ))}
      <rect x="140" y="200" width="40" height="60" rx="4" fill="#374151" opacity="0.5" />
      <rect x="148" y="208" width="24" height="16" rx="2" fill="#D1FAE5" opacity="0.8" />
    </svg>
  );
}

function Scene3Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#FFF1F2" />
      <rect x="100" y="160" width="600" height="220" rx="4" fill="#FEE2E2" opacity="0.3" />
      <rect x="280" y="180" width="240" height="110" rx="10" fill="white" opacity="0.95" />
      <text x="400" y="216" textAnchor="middle" fontSize="13" fill="#DC2626" fontWeight="800">AP-7200 — EMPTY</text>
      <text x="400" y="238" textAnchor="middle" fontSize="10" fill="#EF4444">System shows: 340 units</text>
      <text x="400" y="258" textAnchor="middle" fontSize="10" fill="#9CA3AF">Physical count: 287 units</text>
      <text x="400" y="278" textAnchor="middle" fontSize="10" fill="#DC2626" fontWeight="600">Available to sell: 0</text>
      <path d="M390 148 L410 148 L400 128 Z" fill="#EF4444" opacity="0.8" />
      <text x="400" y="146" textAnchor="middle" fontSize="9" fill="white" fontWeight="800">!</text>
      {[160, 310, 460].map((x, i) => (
        <g key={i}>
          <rect x={x} y="390" width="80" height="50" rx="6" fill="#FEE2E2" />
          <text x={x + 40} y="410" textAnchor="middle" fontSize="8" fill="#DC2626" fontWeight="700">ORD-{2847 + i * 4}</text>
          <text x={x + 40} y="428" textAnchor="middle" fontSize="7" fill="#9CA3AF">CANCELLED</text>
        </g>
      ))}
    </svg>
  );
}

function Scene4Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="im4g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#im4g)" />
      {[60, 195, 330, 465].map((x, ai) => (
        <g key={ai}>
          <rect x={x} y="150" width="110" height="260" rx="4" fill="#FEF9C3" opacity="0.5" />
          {[160, 205, 250, 295, 340].map((y, ri) => (
            <rect key={ri} x={x + 8} y={y} width="94" height="36" rx="3" fill="#F59E0B" opacity={0.25 + ri * 0.06} />
          ))}
          <text x={x + 55} y="425" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="700">AISLE {ai + 14}</text>
          <text x={x + 55} y="440" textAnchor="middle" fontSize="8" fill="#D97706">WH-5100</text>
        </g>
      ))}
      <rect x="590" y="130" width="170" height="90" rx="8" fill="white" opacity="0.95" />
      <text x="675" y="158" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontWeight="600">TIED-UP CAPITAL</text>
      <text x="675" y="188" textAnchor="middle" fontSize="20" fill="#DC2626" fontWeight="800">$156,000</text>
      <text x="675" y="210" textAnchor="middle" fontSize="9" fill="#D97706">32 months of supply</text>
    </svg>
  );
}

function Scene5Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#F5F3FF" />
      <rect x="80" y="70" width="640" height="310" rx="10" fill="white" opacity="0.8" />
      <text x="400" y="100" textAnchor="middle" fontSize="11" fill="#7C3AED" fontWeight="700">AP-7200: Customer Demand vs Purchase Orders</text>
      {/* Demand bars blue */}
      {[92, 88, 108, 95, 85, 100].map((v, i) => {
        const h = (v / 130) * 160;
        return <rect key={i} x={110 + i * 92} y={260 - h} width="28" height={h} rx="3" fill="#3B82F6" opacity="0.6" />;
      })}
      {/* Order bars red */}
      {[90, 50, 420, 380, 50, 310].map((v, i) => {
        const h = Math.min((v / 440) * 200, 200);
        return <rect key={i} x={140 + i * 92} y={260 - h} width="28" height={h} rx="3" fill="#EF4444" opacity="0.5" />;
      })}
      <line x1="100" y1="260" x2="730" y2="260" stroke="#E5E7EB" strokeWidth="2" />
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
        <text key={m} x={125 + i * 92} y="280" textAnchor="middle" fontSize="9" fill="#6B7280">{m}</text>
      ))}
      <rect x="560" y="90" width="12" height="12" fill="#3B82F6" opacity="0.7" />
      <text x="578" y="101" fontSize="9" fill="#6B7280">Demand</text>
      <rect x="560" y="110" width="12" height="12" fill="#EF4444" opacity="0.6" />
      <text x="578" y="121" fontSize="9" fill="#6B7280">Orders</text>
    </svg>
  );
}

function Scene6Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="500" fill="#F0FDF4" />
      {(["A", "B", "C"] as const).map((cat, i) => {
        const x = 70 + i * 230;
        const colors = ["#10B981", "#F59E0B", "#9CA3AF"];
        const bgs = ["#ECFDF5", "#FEF3C7", "#F9FAFB"];
        return (
          <g key={cat}>
            <rect x={x} y="70" width="190" height="360" rx="10" fill={bgs[i]} opacity="0.9" />
            <rect x={x} y="70" width="190" height="42" rx="10" fill={colors[i]} opacity="0.7" />
            <text x={x + 95} y="97" textAnchor="middle" fontSize="16" fill="white" fontWeight="800">{cat} ITEMS</text>
            {[125, 165, 205, 245, 285, 325].map((y, ri) => (
              <rect key={ri} x={x + 14} y={y} width={164 - ri * 8} height="28" rx="5" fill={colors[i]} opacity={0.12 + ri * 0.02} />
            ))}
            <text x={x + 95} y="390" textAnchor="middle" fontSize="9" fill="#6B7280">
              {["20% SKUs → 80% Rev", "30% SKUs → 15% Rev", "50% SKUs → 5% Rev"][i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Scene7Bg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="im7g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="100%" stopColor="#ECFDF5" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#im7g)" />
      {[
        { x: 60,  y: 90,  label: "Inventory Accuracy", val: "97.6%",   color: "#10B981" },
        { x: 285, y: 90,  label: "AP-7200 Stockouts",  val: "0",       color: "#3B82F6" },
        { x: 510, y: 90,  label: "Cash Recovered",     val: "$59,200", color: "#F59E0B" },
        { x: 170, y: 270, label: "Bullwhip Reduction", val: "−61%",    color: "#7C3AED" },
        { x: 395, y: 270, label: "Inventory Turn",     val: "5.1×",    color: "#10B981" },
        { x: 620, y: 270, label: "Supplier Discount",  val: "2%",      color: "#059669" },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width="190" height="100" rx="10" fill="white" opacity="0.9" />
          <rect x={p.x} y={p.y} width="190" height="5" rx="10" fill={p.color} opacity="0.8" />
          <text x={p.x + 95} y={p.y + 38} textAnchor="middle" fontSize="9" fill="#6B7280" fontWeight="600">{p.label}</text>
          <text x={p.x + 95} y={p.y + 72} textAnchor="middle" fontSize="22" fill={p.color} fontWeight="800">{p.val}</text>
        </g>
      ))}
      <circle cx="720" cy="160" r="36" fill="#D1FAE5" opacity="0.5" />
      <path d="M705 160 L716 172 L740 146" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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

export function SceneWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  const stepCfg = STEPS.find((s) => s.num === step);
  const Bg = SCENE_BACKGROUNDS[step];

  return (
    <div className="flex flex-col gap-5">
      {stepCfg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[#E8E4DD] shadow-sm"
          style={{ minHeight: 100 }}
        >
          {Bg && <Bg />}
          <div className="relative z-10 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest">
                  Scene {stepCfg.num} of {STEPS.length}
                </span>
                <h2 className="text-lg font-black text-[#1A1A1A] mt-0.5 leading-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                  {stepCfg.label}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#9CA3AF]">{stepCfg.location}</p>
                <p className="text-[9px] font-semibold text-[#6B7280]">{stepCfg.time}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {children}
    </div>
  );
}
