"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "./constants";

interface JourneyMapProps {
  currentStep: number;
  hartwellDays: number | null;
}

export function JourneyMap({ currentStep, hartwellDays }: JourneyMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(`[data-step="${currentStep}"]`);
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentStep]);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Path */}
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
                  {/* Active pulse ring */}
                  {active && (
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.45, 0, 0.45] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-[#f59e0b]"
                    />
                  )}
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: done || active ? "#f59e0b" : "#E8E4DD",
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

                <p
                  className={`text-[8px] font-semibold hidden sm:block leading-tight text-center transition-colors duration-300 ${
                    active ? "text-[#D97706]" : done ? "text-[#9CA3AF]" : "text-[#C4BDB5]"
                  }`}
                  style={{ maxWidth: 56 }}
                >
                  {step.label}
                </p>
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
                      style={{ background: "#f59e0b", height: 2, top: 0 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hartwell urgency pill */}
      <AnimatePresence mode="wait">
        {hartwellDays !== null && (
          <motion.div
            key={hartwellDays}
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${
              hartwellDays <= 5
                ? "bg-red-50 border-red-200 text-red-700"
                : hartwellDays <= 10
                ? "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <motion.span
              animate={hartwellDays <= 5 ? { opacity: [1, 0, 1] } : { opacity: 1 }}
              transition={{ duration: 1, repeat: hartwellDays <= 5 ? Infinity : 0 }}
              className={`w-1.5 h-1.5 rounded-full ${
                hartwellDays <= 5 ? "bg-red-500" : hartwellDays <= 10 ? "bg-[#f59e0b]" : "bg-green-500"
              }`}
            />
            {`Hartwell: ${hartwellDays}d left`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
