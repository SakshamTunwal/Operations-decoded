"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS, STEP_TIMES } from "./constants";

interface JourneyMapProps {
  currentStep: number;
}

export function JourneyMap({ currentStep }: JourneyMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(`[data-step="${currentStep}"]`);
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentStep]);

  const timeLabel = STEP_TIMES[currentStep] ?? "";

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Step path */}
      <div
        ref={scrollRef}
        className="flex items-center overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {STEPS.map((step, i) => {
          const done   = step.num < currentStep;
          const active = step.num === currentStep;

          return (
            <div key={step.num} className="flex items-center flex-shrink-0" data-step={step.num}>
              {/* Node */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-9 h-9">
                  {active && (
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.45, 0, 0.45] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-[#BE185D]"
                    />
                  )}
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: done || active ? "#BE185D" : "#E8E4DD",
                      scale: active ? 1.08 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {done ? (
                      <motion.svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 12 }}
                      >
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    ) : (
                      <span className="text-sm">{step.icon}</span>
                    )}
                  </motion.div>
                </div>

                <div className="hidden sm:flex flex-col items-center gap-0.5" style={{ maxWidth: 56 }}>
                  <p
                    className={`text-[8px] font-semibold leading-tight text-center transition-colors duration-300 ${
                      active ? "text-[#BE185D]" : done ? "text-[#9CA3AF]" : "text-[#C4BDB5]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-[7px] leading-tight text-center transition-colors duration-300 ${
                      active ? "text-[#9D174D]" : "text-[#C4BDB5]"
                    }`}
                  >
                    {step.time}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]" />
                  {step.num < currentStep && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 origin-left"
                      style={{ background: "#BE185D", height: 2, top: 0 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timer pill */}
      <AnimatePresence mode="wait">
        {timeLabel && (
          <motion.div
            key={timeLabel}
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${
              currentStep <= 3
                ? "bg-[#FCE7F3] border-[#BE185D]/40 text-[#9D174D]"
                : currentStep <= 5
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : currentStep === 6
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              currentStep <= 3 ? "bg-[#BE185D]" : currentStep <= 5 ? "bg-amber-500" : currentStep === 6 ? "bg-purple-500" : "bg-green-500"
            }`} />
            {timeLabel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
