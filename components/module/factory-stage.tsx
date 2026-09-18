"use client";

/**
 * FactoryStage — the living top half of every module.
 * Renders the current step's location as an illustrated scene, keeps the
 * cast physically present across steps, speaks dialogue as in-scene
 * bubbles (click the stage to advance lines), pans the camera between
 * locations, and narrates in the caption strip below.
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Company, Module, Step } from "../../lib/module-schema";
import { FLOOR_Y, PersonSprite, SceneArt, sceneForLocation, spriteExists, type SceneId } from "./scenes";

const serif = "'Fraunces', Georgia, serif";
const sans = "'Inter', system-ui, sans-serif";

const SLOTS = [210, 480, 700, 330]; // stage x positions, filled in order

interface StagePerson { id: string; x: number; flip: boolean }

/** Who stands on stage at step i: dialogue speakers, else carried over. */
export function castOnStage(mod: Module, idx: number): string[] {
  let present: string[] = [];
  for (let i = 0; i <= idx; i++) {
    const p = mod.steps[i].payload;
    if (p.type === "dialogue") {
      const speakers = [...new Set(p.lines.map((l) => l.characterId))];
      present = speakers.slice(0, 3);
    }
  }
  if (present.length === 0) present = mod.cast.slice(0, 2).map((c) => c.characterId);
  return present.filter(spriteExists);
}

function bubbleCue(step: Step): string | null {
  const p = step.payload;
  const cut = (s: string) => (s.length > 92 ? s.slice(0, 89).trimEnd() + "…" : s);
  switch (p.type) {
    case "compare": case "calc": return cut(p.prompt);
    case "form": case "diagnose": return cut(p.intro);
    case "sequence": return cut(p.prompt);
    case "quiz": return "Quick check — prove it stuck.";
    case "summary": return "That's the whole chain. Take it with you.";
    default: return null;
  }
}

export default function FactoryStage({ mod, company, idx, dir, decisionPick, onDecide }: { mod: Module; company: Company; idx: number; dir: number; decisionPick?: string | null; onDecide?: (choiceId: string) => void }) {
  const reduce = useReducedMotion();
  const step = mod.steps[idx];
  const scene: SceneId = step.journey.scene ?? sceneForLocation(step.journey.location);
  const prevScene: SceneId | null = idx > 0 ? (mod.steps[idx - 1].journey.scene ?? sceneForLocation(mod.steps[idx - 1].journey.location)) : null;
  const sceneChanged = prevScene !== null && prevScene !== scene;

  const people: StagePerson[] = useMemo(() => {
    const ids = castOnStage(mod, idx);
    return ids.map((id, i) => ({ id, x: SLOTS[i % SLOTS.length], flip: i % 2 === 1 }));
  }, [mod, idx]);

  // dialogue line progression: click stage to advance
  const isDialogue = step.payload.type === "dialogue";
  const lines = isDialogue && step.payload.type === "dialogue" ? step.payload.lines : [];
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => setLineIdx(0), [step.id]);
  const line = isDialogue ? lines[Math.min(lineIdx, lines.length - 1)] : null;
  const cue = !isDialogue ? bubbleCue(step) : null;

  const speakerId = line ? line.characterId : people[0]?.id;
  const speaker = people.find((pp) => pp.id === speakerId) ?? people[0];
  const charByIdx = useMemo(() => new Map(company.characters.map((c) => [c.id, c])), [company]);

  const bubbleText = line ? line.text : cue;
  const bubbleLeftPct = speaker ? (speaker.x / 960) * 100 : 50;

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E2D8C6", boxShadow: "0 10px 30px rgba(43,38,32,0.12)", background: "#EFE7D6", marginBottom: 22 }}>
      {/* header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#2B2620", color: "#F5EFE4", padding: "9px 16px" }}>
        <span style={{ fontFamily: serif, fontWeight: 700, letterSpacing: 0.5, fontSize: 14.5 }}>
          FURNITURE DECODED <span style={{ opacity: 0.55, fontFamily: sans, fontWeight: 500 }}>· {mod.title}</span>
        </span>
        <AnimatePresence mode="wait">
          <motion.span key={step.journey.location} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            style={{ fontFamily: sans, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#D9B36A" }}>
            {step.journey.location}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* the stage: camera pans on scene change */}
      <div
        style={{ position: "relative", cursor: isDialogue && lineIdx < lines.length - 1 ? "pointer" : "default", userSelect: "none" }}
        onClick={() => { if (isDialogue && lineIdx < lines.length - 1) setLineIdx(lineIdx + 1); }}
        role={isDialogue ? "button" : undefined}
        aria-label={isDialogue ? "Advance dialogue" : undefined}
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={scene + (sceneChanged ? String(idx) : "")}
            custom={dir}
            initial={reduce || !sceneChanged ? { opacity: sceneChanged ? 0 : 1 } : { opacity: 0, x: dir * 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce || !sceneChanged ? { opacity: 0 } : { opacity: 0, x: dir * -120 }}
            transition={{ type: "spring", stiffness: 170, damping: 26 }}
          >
            <svg viewBox="0 0 960 420" style={{ display: "block", width: "100%", height: "auto" }} aria-hidden>
              <SceneArt scene={scene} datum={step.journey.sceneData} truckArrive={scene === "dock"} />
              {people.map((pp, i) => (
                <PersonSprite key={pp.id} id={pp.id} x={pp.x} flip={pp.flip} talking={!!bubbleText && pp.id === speaker?.id} entering={sceneChanged || i >= 2} />
              ))}
            </svg>
          </motion.div>
        </AnimatePresence>

        {/* in-scene decision panel */}
        <AnimatePresence>
          {step.payload.type === "decision" && onDecide && (
            <motion.div
              key={step.id + "-panel"}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.25 }}
              style={{
                position: "absolute", top: 10, right: 10, width: "min(330px, 52%)",
                background: "rgba(43,38,32,0.94)", borderRadius: 14, padding: "12px 12px 10px",
                boxShadow: "0 14px 34px rgba(43,38,32,0.4)", fontFamily: sans,
                maxHeight: "82%", overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ color: "#F5EFE4", fontFamily: serif, fontWeight: 700, fontSize: 14.5, lineHeight: 1.35, marginBottom: 10 }}>
                {step.payload.prompt}
              </div>
              <div style={{ display: "grid", gap: 7 }}>
                {step.payload.choices.map((c, ci) => {
                  const picked = decisionPick === c.id;
                  const done = decisionPick != null;
                  const border = picked ? (c.correct ? "#8FBF9A" : "#D98A7A") : "transparent";
                  return (
                    <motion.button
                      key={c.id}
                      whileHover={done ? undefined : { scale: 1.015 }}
                      whileTap={done ? undefined : { scale: 0.985 }}
                      onClick={() => !done && onDecide(c.id)}
                      style={{
                        display: "flex", gap: 9, alignItems: "baseline", textAlign: "left", width: "100%",
                        background: picked ? (c.correct ? "#E7F0E5" : "#F7E6E1") : "#FFFDF8",
                        border: `2px solid ${border}`, borderRadius: 9, padding: "8px 10px",
                        cursor: done ? "default" : "pointer", opacity: done && !picked ? 0.55 : 1,
                        fontFamily: sans,
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: 12, color: "#8B5E3C" }}>{String.fromCharCode(65 + ci)}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#2B2620", lineHeight: 1.35 }}>
                        {c.label}
                        <span style={{ display: "block", fontWeight: 400, fontSize: 12, color: "#6B6257" }}>{c.implication}</span>
                      </span>
                      {picked && <span style={{ marginLeft: "auto", fontWeight: 800, color: c.correct ? "#3E7A4E" : "#A8402F" }}>{c.correct ? "✓" : "✗"}</span>}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* speech bubble overlay */}
        <AnimatePresence mode="wait">
          {bubbleText && speaker && (
            <motion.div
              key={step.id + ":" + lineIdx}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              style={{
                position: "absolute", bottom: `${((420 - (FLOOR_Y - 150)) / 420) * 100}%`,
                left: `clamp(8px, calc(${bubbleLeftPct}% - 140px), calc(100% - 288px))`, width: 280,
                background: "#FFFDF8", border: "1px solid #E2D8C6", borderRadius: 12, padding: "10px 14px",
                boxShadow: "0 8px 22px rgba(43,38,32,0.18)", fontFamily: sans,
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8B5E3C", marginBottom: 2 }}>
                {charByIdx.get(speaker.id)?.name ?? speaker.id}
                <span style={{ fontWeight: 500, color: "#6B6257" }}> · {charByIdx.get(speaker.id)?.role}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: "#2B2620" }}>{bubbleText}</div>
              {isDialogue && lines.length > 1 && (
                <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: "#B97E2C" }}>
                  {lineIdx < lines.length - 1 ? "▸ tap to continue" : `${lines.length}/${lines.length}`}
                </div>
              )}
              <div style={{ position: "absolute", bottom: -8, left: `clamp(16px, calc(${bubbleLeftPct}% - (clamp(8px, ${bubbleLeftPct}% - 140px, 100%))), 240px)`, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "9px solid #FFFDF8", filter: "drop-shadow(0 1px 0 #E2D8C6)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* caption strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#2B2620", color: "#F5EFE4", padding: "8px 16px" }}>
        <AnimatePresence mode="wait">
          <motion.span key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontFamily: sans, fontSize: 12.5 }}>
            <strong style={{ fontFamily: serif, fontSize: 13.5 }}>{step.label}.</strong>{" "}
            <span style={{ opacity: 0.75 }}>{step.journey.timeLabel} · Document: {step.journey.doc}</span>
          </motion.span>
        </AnimatePresence>
        <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, opacity: 0.6 }}>
          STEP {idx + 1}/{mod.steps.length}
        </span>
      </div>
    </div>
  );
}
