"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "idle" | "driving" | "braking" | "stopped" | "opening" | "unloading" | "done";

interface TruckSceneProps {
  onUnloaded: () => void;
}

export function TruckScene({ onUnloaded }: TruckSceneProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const seq: [Stage, number][] = [
      ["driving",   50],
      ["braking",   1800],
      ["stopped",   2400],
      ["opening",   3100],
      ["unloading", 3800],
      ["done",      5200],
    ];
    const timers = seq.map(([s, t]) => setTimeout(() => setStage(s), t));
    return () => timers.forEach(clearTimeout);
  }, [started]);

  useEffect(() => {
    if (stage === "done") onUnloaded();
  }, [stage, onUnloaded]);

  const truckX =
    stage === "idle"     ? -160 :
    stage === "driving"  ? -160 :
    stage === "braking"  ? 300  :
    300;

  const BOXES = [0, 1, 2, 3];

  return (
    <div className="relative h-36 rounded-2xl overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-[#EBE5DB] border border-[#E8E4DD] select-none mb-5">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D1CBC2]" />
      {/* Dashed road */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-4 h-1 w-8 bg-[#D1CBC2] rounded-sm"
          style={{ left: i * 80 }}
          animate={started && stage === "driving" ? { x: [0, -80] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear", delay: i * 0.075 }}
        />
      ))}

      {/* Warehouse dock */}
      <div className="absolute right-8 top-4 flex flex-col items-center">
        <div className="relative w-24 h-20 bg-[#E8E4DD] rounded-t-sm">
          {/* Roller shutter lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-[#D1CBC2]" style={{ top: 4 + i * 7 }} />
          ))}
          {/* Shutter – slides up when opening */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#D1CBC2] origin-bottom rounded-b-sm overflow-hidden"
            initial={{ height: "70%" }}
            animate={stage === "opening" || stage === "unloading" || stage === "done" ? { height: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-px bg-[#C4BDB5] mt-3" />
            ))}
          </motion.div>
          {/* Dock label */}
          <p className="absolute -bottom-5 left-0 right-0 text-center text-[8px] text-[#9CA3AF] font-medium">
            BAY 3
          </p>
        </div>
      </div>

      {/* Dust particles */}
      <AnimatePresence>
        {(stage === "driving" || stage === "braking") && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.7, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: -20 - i * 5, y: -(i * 4), scale: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.06, repeat: Infinity, repeatDelay: 0.3 }}
                className="absolute bottom-5 rounded-full bg-[#D1CBC2]"
                style={{
                  left: truckX + 20 + i * 4,
                  width: 4 + i,
                  height: 4 + i,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Truck */}
      <motion.div
        className="absolute bottom-1 flex items-end"
        initial={{ x: -160 }}
        animate={{ x: truckX }}
        transition={
          stage === "driving"
            ? { duration: 1.6, ease: "easeIn" }
            : stage === "braking"
            ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.01 }
        }
      >
        {/* Truck body */}
        <div className="relative">
          {/* Cab */}
          <div className="relative flex">
            {/* Cargo box */}
            <div className="w-28 h-14 bg-[#f59e0b] rounded-l-sm flex items-center justify-center">
              <p className="text-[8px] font-black text-black tracking-wider">CRESTLINE</p>
            </div>
            {/* Cab front */}
            <div className="w-12 h-14 bg-[#D97706] rounded-r-lg flex flex-col items-center justify-center gap-1 relative">
              {/* Windshield */}
              <div className="w-8 h-5 bg-[#BFDBFE] rounded-sm opacity-80" />
              {/* Brake lights */}
              <motion.div
                className="absolute left-0 top-2 w-1.5 h-3 rounded-sm"
                animate={stage === "braking" ? { backgroundColor: ["#ef4444", "#fca5a5", "#ef4444"] } : { backgroundColor: "#7f1d1d" }}
                transition={{ duration: 0.3, repeat: stage === "braking" ? 3 : 0 }}
              />
            </div>
          </div>

          {/* Wheels */}
          {[8, 100].map((xOffset, wi) => (
            <motion.div
              key={wi}
              className="absolute -bottom-3.5 rounded-full border-4 border-[#1A1A1A] bg-[#374151] flex items-center justify-center"
              style={{ left: xOffset, width: 22, height: 22 }}
              animate={stage === "driving" || stage === "braking" ? { rotate: 360 } : {}}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-3 h-3 rounded-full bg-[#9CA3AF]" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Unloading boxes */}
      <AnimatePresence>
        {(stage === "unloading" || stage === "done") &&
          BOXES.map((i) => (
            <motion.div
              key={i}
              initial={{ x: truckX + 20, y: 0, opacity: 0 }}
              animate={{ x: 580 + i * 18, y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2, duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-1 w-10 h-10 bg-white border-2 border-[#E8E4DD] rounded-lg flex items-center justify-center shadow-sm"
            >
              <p className="text-[8px] font-black text-[#D97706]">TiO₂</p>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Start trigger */}
      {!started && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setStarted(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/5 cursor-pointer hover:bg-black/10 transition-colors"
        >
          <div className="bg-white border border-[#E8E4DD] rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="text-base">🚚</span>
            <p className="text-xs font-semibold text-[#1A1A1A]">Click to receive delivery</p>
          </div>
        </motion.button>
      )}
    </div>
  );
}
