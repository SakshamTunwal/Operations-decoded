"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizProps {
  question: string;
  options: { label: string; value: string }[];
  correctValue: string;
  explanation: string;
  onDone: (correct: boolean) => void;
}

export function MicroQuiz({ question, options, correctValue, explanation, onDone }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongShake, setWrongShake] = useState<string | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (value: string) => {
    if (revealed) return;
    setSelected(value);
    setRevealed(true);
    if (value !== correctValue) {
      setWrongShake(value);
      shakeTimer.current = setTimeout(() => setWrongShake(null), 500);
    }
  };

  useEffect(() => () => { if (shakeTimer.current) clearTimeout(shakeTimer.current); }, []);

  const isCorrect = selected === correctValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="bg-white border border-[#E8E4DD] rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E4DD] px-5 py-3 flex items-center gap-2">
        <span className="text-sm">🧠</span>
        <p className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Quick Check</p>
        <span className="ml-auto text-xs text-[#9CA3AF]">optional</span>
      </div>

      <div className="p-5">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-4 leading-relaxed">{question}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {options.map((opt) => {
            const isSelected = selected === opt.value;
            const correct = opt.value === correctValue;
            let style = "border-[#E8E4DD] bg-white text-[#1A1A1A] hover:border-[#D97706]/40";
            if (revealed && isSelected && isCorrect)  style = "border-green-400 bg-green-50 text-green-800";
            if (revealed && isSelected && !isCorrect) style = "border-red-400 bg-red-50 text-red-800";
            if (revealed && !isSelected && correct)   style = "border-green-400 bg-green-50 text-green-800";

            const isWrong = revealed && selected === opt.value && !isCorrect;
            const isRight = revealed && opt.value === correctValue;
            return (
              <motion.button
                key={opt.value}
                animate={{
                  x: wrongShake === opt.value ? [-6, 6, -5, 5, -3, 0] : 0,
                  scale: isRight && revealed ? 1.05 : 1,
                }}
                transition={{
                  x: { duration: 0.4, ease: "easeOut" },
                  scale: { type: "spring", stiffness: 380, damping: 18, delay: isRight && revealed ? 0.08 : 0 },
                }}
                whileHover={!revealed ? { scale: 1.03, y: -1 } : {}}
                whileTap={!revealed ? { scale: 0.96 } : {}}
                onClick={() => handleSelect(opt.value)}
                disabled={revealed}
                className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium cursor-pointer transition-colors ${style}`}
              >
                <span className="flex items-center gap-2">
                  {isRight && revealed && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 10 }}>
                      ✓
                    </motion.span>
                  )}
                  {isWrong && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 10 }}>
                      ✗
                    </motion.span>
                  )}
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <div className={`rounded-xl px-4 py-3 mb-4 border ${
                isCorrect ? "bg-green-50 border-green-200" : "bg-[#FEF3C7] border-[#f59e0b]/40"
              }`}>
                <p className={`text-xs font-semibold mb-1 ${isCorrect ? "text-green-800" : "text-[#92400E]"}`}>
                  {isCorrect ? "✓ Correct!" : "Not quite —"}
                </p>
                <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-700" : "text-[#92400E]"}`}>
                  {explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onDone(false)}
            className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
          >
            Skip
          </button>
          {revealed && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onDone(isCorrect)}
              className="px-4 py-2 bg-[#f59e0b] text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-[#D97706] transition-colors"
            >
              Continue →
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
