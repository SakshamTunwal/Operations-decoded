"use client";

import { STEPS } from "./constants";

export function JourneyMap({ currentStep }: { currentStep: number }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-0 min-w-max">
        {STEPS.map((step, i) => {
          const done   = currentStep > step.num;
          const active = currentStep === step.num;
          return (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] border-2 transition-all ${
                  done   ? "bg-[#3B82F6] border-[#1D4ED8] text-white" :
                  active ? "bg-[#DBEAFE] border-[#3B82F6] text-[#1D4ED8] ring-2 ring-[#3B82F6]/30" :
                           "bg-white border-[#E8E4DD] text-[#9CA3AF]"
                }`}>
                  {done ? "✓" : step.icon}
                </div>
                <p className={`text-[8px] font-semibold max-w-[52px] text-center leading-tight ${active ? "text-[#1D4ED8]" : "text-[#9CA3AF]"}`}>
                  {step.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-5 h-0.5 mx-0.5 rounded-full mb-3 transition-all ${done ? "bg-[#3B82F6]" : "bg-[#E8E4DD]"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
