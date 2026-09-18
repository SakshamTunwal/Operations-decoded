"use client";

/**
 * Module Player — Phase 2: the Workshop Premium visual language.
 *
 * Design tokens: paper / ink / wood / steel / brass. Serif display
 * (Fraunces) over readable sans (Inter), loaded at runtime via React 19
 * hoisted <link> so builds never fetch fonts.
 *
 * Motion vocabulary (framer-motion, honors prefers-reduced-motion):
 *  - The journey strip is the factory floor; a truck DRIVES between
 *    stations (layoutId spring) when you advance.
 *  - Step content slides in directionally — the camera pans, the
 *    screen never hard-switches.
 *  - Choices are springy; correct answers burst sparks; documents get
 *    STAMPED when they check out; dialogue walks in line by line.
 *
 * Wiring, props and schema are unchanged from Phase 1.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Company, Module, Step } from "../../lib/module-schema";
import FactoryStage from "./factory-stage";

/* ----------------------------- tokens ------------------------------------ */

const T = {
  paper: "#FAF6EF",
  paperDeep: "#F1EADC",
  ink: "#2B2620",
  inkSoft: "#6B6257",
  wood: "#8B5E3C",
  woodDeep: "#6E4A2F",
  steel: "#5B6670",
  brass: "#B97E2C",
  brassSoft: "#F3E4C8",
  green: "#3E7A4E",
  greenSoft: "#E7F0E5",
  red: "#A8402F",
  redSoft: "#F7E6E1",
  blue: "#3E5F8A",
  blueSoft: "#E7EDF5",
  line: "#E2D8C6",
};

const toneStyle: Record<string, { border: string; bg: string; color: string }> = {
  positive: { border: T.green, bg: T.greenSoft, color: T.green },
  danger: { border: T.red, bg: T.redSoft, color: T.red },
  caution: { border: T.brass, bg: T.brassSoft, color: "#7A5217" },
  info: { border: T.blue, bg: T.blueSoft, color: T.blue },
  neutral: { border: T.line, bg: T.paperDeep, color: T.inkSoft },
};

const serif = "'Fraunces', Georgia, serif";
const sans = "'Inter', system-ui, sans-serif";

const fmt = new Intl.NumberFormat("en-US");
const fmtNum = (n: number) => fmt.format(n);

/* --------------------------- motion helpers ------------------------------ */

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;

function LiveDate({ dayOffset }: { dayOffset: number }) {
  const [s, setS] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    setS(d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  }, [dayOffset]);
  return s ? <span style={{ color: T.inkSoft }}> · {s}</span> : null;
}

/** Little celebration: sparks fly out from the center of the element. */
function SparkBurst({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  if (!play || reduce) return null;
  const sparks = Array.from({ length: 9 }, (_, i) => (i / 9) * Math.PI * 2);
  return (
    <span aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      {sparks.map((a, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: Math.cos(a) * 46, y: Math.sin(a) * 34, scale: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute", left: "50%", top: "50%", width: 7, height: 7,
            borderRadius: 999, background: i % 3 === 0 ? T.brass : i % 3 === 1 ? T.green : T.wood,
          }}
        />
      ))}
    </span>
  );
}

/** The rubber stamp — Nadia's gag as interface. */
function Stamp({ text, tone }: { text: string; tone: "positive" | "danger" }) {
  const reduce = useReducedMotion();
  const c = tone === "positive" ? T.green : T.red;
  return (
    <motion.div
      initial={reduce ? false : { scale: 2.6, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: -8 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      style={{
        display: "inline-block", padding: "4px 14px", border: `3px solid ${c}`, color: c,
        borderRadius: 6, fontFamily: sans, fontWeight: 800, letterSpacing: 2,
        textTransform: "uppercase", fontSize: 13, background: "rgba(255,255,255,0.6)",
      }}
    >
      {text}
    </motion.div>
  );
}

function Card({ children, tilt = 0 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <div
      style={{
        background: "#FFFDF8", border: `1px solid ${T.line}`, borderRadius: 12,
        boxShadow: "0 1px 2px rgba(43,38,32,0.06), 0 6px 18px rgba(43,38,32,0.07)",
        padding: 20, transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {children}
    </div>
  );
}

function Teaching({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      style={{
        marginTop: 16, borderLeft: `4px solid ${T.brass}`, background: T.brassSoft,
        padding: "10px 14px", borderRadius: "0 10px 10px 0", fontSize: 14.5, color: "#5C4218",
      }}
    >
      <strong style={{ fontFamily: serif }}>Teaching point&nbsp;·&nbsp;</strong>
      {text}
    </motion.p>
  );
}

const avatarPalette = [T.wood, T.steel, T.brass, T.blue, T.green, "#7A5217", T.woodDeep, "#4E5A47"];
function avatarColor(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return avatarPalette[h % avatarPalette.length];
}

/* --------------------------- step renderers ------------------------------ */

type Payload = Step["payload"];

function DialogueView({ step, company }: { step: Extract<Payload, { type: "dialogue" }>; company: Company }) {
  const chars = useMemo(() => new Map(company.characters.map((c) => [c.id, c])), [company]);
  const reduce = useReducedMotion();
  return (
    <div style={{ display: "grid", gap: 10, opacity: 0.92 }}>
      <p style={{ margin: 0, fontSize: 11.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: T.steel }}>Transcript</p>
      {step.lines.map((l, i) => {
        const c = chars.get(l.characterId);
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: reduce ? 0 : i * 0.28 }}
            style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: 999, flexShrink: 0, color: "#fff",
                background: avatarColor(l.characterId), display: "flex", alignItems: "center",
                justifyContent: "center", fontWeight: 700, fontFamily: sans, fontSize: 17,
                border: "2px solid #fff", boxShadow: "0 2px 6px rgba(43,38,32,0.25)",
              }}
            >
              {c?.name.charAt(0) ?? "?"}
            </div>
            <div style={{ background: "#FFFDF8", border: `1px solid ${T.line}`, borderRadius: "2px 14px 14px 14px", padding: "10px 14px", boxShadow: "0 2px 8px rgba(43,38,32,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.wood }}>
                {c?.name ?? l.characterId}
                <span style={{ fontWeight: 400, color: T.inkSoft }}> — {c?.role}</span>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 14.5, lineHeight: 1.5 }}>{l.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ChoiceButton({ label, sub, state, onClick }: { label: string; sub?: string; state: "idle" | "right" | "wrong"; onClick: () => void }) {
  const s = state === "right" ? toneStyle.positive : state === "wrong" ? toneStyle.danger : null;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.012, y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={spring}
      style={{
        position: "relative", display: "block", width: "100%", textAlign: "left", cursor: "pointer",
        border: `1.5px solid ${s ? s.border : T.line}`, background: s ? s.bg : "#FFFDF8",
        borderRadius: 12, padding: "12px 16px", fontFamily: sans,
        boxShadow: s ? "none" : "0 2px 6px rgba(43,38,32,0.05)",
      }}
    >
      <SparkBurst play={state === "right"} />
      <span style={{ fontWeight: 600, fontSize: 15.5, color: s ? s.color : T.ink }}>{label}</span>
      {sub && <span style={{ display: "block", fontSize: 13.5, color: T.inkSoft, marginTop: 2 }}>{sub}</span>}
    </motion.button>
  );
}

function DecisionView({ step, chosen }: { step: Extract<Payload, { type: "decision" }>; chosen: string | null }) {
  const pick = step.choices.find((c) => c.id === chosen);
  return (
    <div>
      {!pick && (
        <p style={{ fontSize: 14.5, color: T.inkSoft, margin: 0 }}>
          ☝ Make the call in the scene above — the panel is waiting.
        </p>
      )}
      <AnimatePresence>
        {pick && (
          <motion.div key={pick.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
            <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Stamp text={pick.correct ? "Good call" : "Costly"} tone={pick.correct ? "positive" : "danger"} />
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{pick.feedback}</p>
            </div>
            <Teaching text={step.teachingPoint} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompareView({ step }: { step: Extract<Payload, { type: "compare" }> }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const correct = chosen === step.correctOptionId;
  return (
    <div>
      <p style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, margin: "0 0 14px" }}>{step.prompt}</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        {step.options.map((o) => {
          const t = toneStyle[o.tone];
          const isPick = chosen === o.id;
          return (
            <motion.div key={o.id} whileHover={{ y: -3 }} transition={spring} style={{ position: "relative" }}>
              <Card>
                <SparkBurst play={isPick && correct} />
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 17 }}>{o.name}</div>
                <span style={{ display: "inline-block", margin: "6px 0 10px", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: t.color, background: t.bg, border: `1px solid ${t.border}`, padding: "2px 8px", borderRadius: 999 }}>
                  {o.tag}
                </span>
                <table style={{ width: "100%", fontSize: 13.5, borderCollapse: "collapse" }}>
                  <tbody>
                    {step.attributes.map((a) => (
                      <tr key={a}>
                        <td style={{ color: T.inkSoft, padding: "3px 0" }}>{a}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {typeof o.values[a] === "number" ? fmtNum(o.values[a] as number) : String(o.values[a])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {o.note && <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "8px 0 0" }}>{o.note}</p>}
                <motion.button
                  onClick={() => setChosen(o.id)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    marginTop: 12, width: "100%", padding: "8px 0", borderRadius: 9, cursor: "pointer",
                    fontWeight: 700, fontFamily: sans, fontSize: 14,
                    border: `1.5px solid ${isPick ? (correct ? T.green : T.red) : T.wood}`,
                    background: isPick ? (correct ? T.greenSoft : T.redSoft) : T.paper,
                    color: isPick ? (correct ? T.green : T.red) : T.woodDeep,
                  }}
                >
                  {isPick ? (correct ? "✓ Chosen" : "✗ Chosen") : "Award the order"}
                </motion.button>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {chosen && (
          <motion.div key={chosen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
            <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Stamp text={correct ? "Awarded" : "Risky"} tone={correct ? "positive" : "danger"} />
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{correct ? step.feedbackCorrect : step.feedbackWrong}</p>
            </div>
            <Teaching text={step.teachingPoint} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SequenceView({ step }: { step: Extract<Payload, { type: "sequence" }> }) {
  const [revealed, setRevealed] = useState(false);
  const byId = new Map(step.items.map((i) => [i.id, i.label]));
  return (
    <div>
      <p style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, margin: "0 0 14px" }}>{step.prompt}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {(revealed ? step.correctOrder.map((id) => ({ id, label: byId.get(id)! })) : step.items).map((it, i) => (
          <motion.div key={it.id} layout transition={spring}>
            <Card>
              <span style={{ fontFamily: serif, fontWeight: 700, color: T.brass, marginRight: 10 }}>{revealed ? i + 1 : "•"}</span>
              {it.label}
            </Card>
          </motion.div>
        ))}
      </div>
      {!revealed ? (
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setRevealed(true)} style={{ marginTop: 14, padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${T.wood}`, background: T.paper, color: T.woodDeep, fontWeight: 700, cursor: "pointer", fontFamily: sans }}>
          Show the right order
        </motion.button>
      ) : (
        <Teaching text={step.teachingPoint} />
      )}
      <p style={{ fontSize: 12, color: T.inkSoft, marginTop: 8 }}>(Drag-to-order lands with the interaction upgrade.)</p>
    </div>
  );
}

function DocumentFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFEFB", border: `1px solid ${T.line}`, borderRadius: 4, boxShadow: "0 10px 24px rgba(43,38,32,0.10)", overflow: "hidden", transform: "rotate(-0.35deg)" }}>
      <div style={{ background: T.paperDeep, borderBottom: `1px solid ${T.line}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 15 }}>{title}</span>
        <span style={{ fontSize: 11, letterSpacing: 1.5, color: T.inkSoft, textTransform: "uppercase" }}>Furniture Decoded · Internal</span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function FormView({ step }: { step: Extract<Payload, { type: "form" }> }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const ok = (id: string) => {
    const f = step.fields.find((x) => x.id === id)!;
    const v = (values[id] ?? "").trim();
    if (typeof f.expected === "number") {
      const n = Number(v.replace(/[$,]/g, ""));
      return Number.isFinite(n) && Math.abs(n - f.expected) <= (f.tolerance ?? 0);
    }
    return v.toLowerCase() === f.expected.toLowerCase();
  };
  const allOk = checked && step.fields.every((f) => ok(f.id));
  return (
    <div>
      <p style={{ fontSize: 15, color: T.inkSoft, margin: "0 0 14px" }}>{step.intro}</p>
      <DocumentFrame title={step.documentTitle}>
        <div style={{ display: "grid", gap: 10 }}>
          {step.fields.map((f) => (
            <label key={f.id} style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.4, color: T.inkSoft, textTransform: "uppercase" }}>{f.label}</span>
              <input
                value={values[f.id] ?? ""}
                onChange={(e) => { setValues({ ...values, [f.id]: e.target.value }); setChecked(false); }}
                style={{ padding: "8px 10px", borderRadius: 8, fontFamily: sans, fontSize: 15, border: `1.5px solid ${checked ? (ok(f.id) ? T.green : T.red) : T.line}`, background: "#fff", outlineColor: T.brass }}
              />
              {checked && !ok(f.id) && f.hint && <span style={{ fontSize: 13, color: T.red }}>Hint: {f.hint}</span>}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setChecked(true)} style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${T.wood}`, background: T.paper, color: T.woodDeep, fontWeight: 700, cursor: "pointer", fontFamily: sans }}>
            Check the document
          </motion.button>
          {allOk && <Stamp text="Verified" tone="positive" />}
        </div>
      </DocumentFrame>
      {allOk && <Teaching text={step.teachingPoint} />}
    </div>
  );
}

function CalcView({ step }: { step: Extract<Payload, { type: "calc" }> }) {
  const [v, setV] = useState("");
  const [checked, setChecked] = useState(false);
  const n = Number(v.replace(/[$,]/g, ""));
  const correct = Number.isFinite(n) && Math.abs(n - step.answer) <= step.tolerance;
  return (
    <div>
      <p style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, margin: "0 0 14px" }}>{step.prompt}</p>
      <Card>
        <table style={{ fontSize: 14.5, borderCollapse: "collapse" }}>
          <tbody>
            {step.given.map((g, i) => (
              <tr key={i}>
                <td style={{ color: T.inkSoft, paddingRight: 22, paddingBottom: 4 }}>{g.label}</td>
                <td style={{ fontWeight: 700 }}>{fmtNum(g.value)}{g.unit ? ` ${g.unit}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", position: "relative" }}>
          <input
            value={v}
            onChange={(e) => { setV(e.target.value); setChecked(false); }}
            placeholder="Your answer"
            style={{ padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${checked ? (correct ? T.green : T.red) : T.line}`, fontSize: 16, fontFamily: sans, width: 160 }}
          />
          {step.unit && <span style={{ color: T.inkSoft, fontWeight: 600 }}>{step.unit}</span>}
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setChecked(true)} style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${T.wood}`, background: T.paper, color: T.woodDeep, fontWeight: 700, cursor: "pointer", fontFamily: sans, position: "relative" }}>
            <SparkBurst play={checked && correct} />
            Check
          </motion.button>
          {checked && <Stamp text={correct ? "Matches" : "Off"} tone={correct ? "positive" : "danger"} />}
        </div>
        <AnimatePresence>
          {checked && correct && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 12, fontSize: 14.5, color: T.inkSoft }}>
              {step.formulaReveal}
            </motion.p>
          )}
        </AnimatePresence>
      </Card>
      {checked && correct && <Teaching text={step.teachingPoint} />}
      {checked && !correct && <p style={{ marginTop: 10, fontSize: 14.5, color: T.red }}>Not quite — check the arithmetic and try again.</p>}
    </div>
  );
}

function DiagnoseView({ step }: { step: Extract<Payload, { type: "diagnose" }> }) {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const toggle = (id: string) => {
    const next = new Set(flagged);
    next.has(id) ? next.delete(id) : next.add(id);
    setFlagged(next);
    setChecked(false);
  };
  const errors = step.fields.filter((f) => f.isError);
  const found = errors.filter((f) => flagged.has(f.id)).length;
  const done = checked && found === errors.length;
  return (
    <div>
      <p style={{ fontSize: 15, color: T.inkSoft, margin: "0 0 6px" }}>{step.intro}</p>
      <p style={{ fontSize: 13.5, color: T.brass, fontWeight: 700, margin: "0 0 14px" }}>Click any line that looks wrong.</p>
      <DocumentFrame title={step.documentTitle}>
        <div style={{ display: "grid", gap: 6 }}>
          {step.fields.map((f) => {
            const isFlag = flagged.has(f.id);
            const state = checked ? (f.isError && isFlag ? "right" : isFlag ? "wrong" : "idle") : isFlag ? "flag" : "idle";
            const border = state === "right" ? T.green : state === "wrong" ? T.red : state === "flag" ? T.brass : T.line;
            const bg = state === "right" ? T.greenSoft : state === "wrong" ? T.redSoft : state === "flag" ? T.brassSoft : "transparent";
            return (
              <motion.button key={f.id} whileTap={{ scale: 0.99 }} onClick={() => toggle(f.id)}
                style={{ display: "flex", justifyContent: "space-between", gap: 12, width: "100%", textAlign: "left", cursor: "pointer", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${border}`, background: bg, fontFamily: sans, fontSize: 14.5 }}>
                <span style={{ color: T.inkSoft }}>{f.label}</span>
                <span style={{ fontWeight: 700 }}>{f.shown}</span>
              </motion.button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setChecked(true)} style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${T.wood}`, background: T.paper, color: T.woodDeep, fontWeight: 700, cursor: "pointer", fontFamily: sans }}>
            Check my flags
          </motion.button>
          {checked && <Stamp text={done ? `${found}/${errors.length} found` : `${found}/${errors.length}`} tone={done ? "positive" : "danger"} />}
        </div>
      </DocumentFrame>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ul style={{ margin: "14px 0 0", paddingLeft: 22, fontSize: 14.5, lineHeight: 1.6 }}>
              {errors.map((f) => (
                <li key={f.id}>
                  <strong>{f.label}:</strong> shows “{f.shown}”, should be “{f.correct}”.{f.explanation ? ` ${f.explanation}` : ""}
                </li>
              ))}
            </ul>
            <Teaching text={step.teachingPoint} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizView({ step }: { step: Extract<Payload, { type: "quiz" }> }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {step.questions.map((q, qi) => {
        const chosen = answers[qi];
        const correct = chosen === q.correctId;
        return (
          <div key={qi}>
            <p style={{ fontFamily: serif, fontSize: 17.5, fontWeight: 600, margin: "0 0 10px" }}>
              {qi + 1}. {q.prompt}
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {q.options.map((o) => (
                <ChoiceButton key={o.id} label={o.text} state={chosen === o.id ? (o.id === q.correctId ? "right" : "wrong") : "idle"} onClick={() => setAnswers({ ...answers, [qi]: o.id })} />
              ))}
            </div>
            <AnimatePresence>
              {chosen && (
                <motion.p key={chosen} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: 10, borderRadius: 10, padding: "10px 14px", fontSize: 14.5, border: `1.5px solid ${correct ? T.green : T.red}`, background: correct ? T.greenSoft : T.redSoft }}>
                  <strong>{correct ? "Correct. " : "Not quite. "}</strong>
                  {q.explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function SceneView({ step }: { step: Extract<Payload, { type: "scene" }> }) {
  return (
    <div style={{ border: `2px dashed ${T.steel}`, borderRadius: 12, padding: 40, textAlign: "center", color: T.inkSoft, background: T.paperDeep }}>
      Scene “{step.component}” plays here — the scene registry arrives later in Phase 2.
    </div>
  );
}

function SummaryView({ step }: { step: Extract<Payload, { type: "summary" }> }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <h3 style={{ fontFamily: serif, fontSize: 22, margin: "0 0 14px" }}>What you take with you</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {step.takeaways.map((t, i) => (
          <motion.div key={i} initial={reduce ? false : { opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: reduce ? 0 : i * 0.15 }}>
            <Card>
              <span style={{ fontFamily: serif, fontWeight: 700, color: T.brass, marginRight: 10 }}>{i + 1}</span>
              {t}
            </Card>
          </motion.div>
        ))}
      </div>
      {step.nextSlug && (
        <Link href={`/learn/${step.nextSlug}`} style={{ display: "inline-block", marginTop: 18, padding: "10px 22px", borderRadius: 10, background: T.wood, color: "#fff", fontWeight: 700, textDecoration: "none", fontFamily: sans }}>
          Next module →
        </Link>
      )}
    </div>
  );
}

function StepBody({ step, company, decisionPick }: { step: Step; company: Company; decisionPick: string | null }) {
  const p = step.payload;
  switch (p.type) {
    case "dialogue": return <DialogueView step={p} company={company} />;
    case "decision": return <DecisionView step={p} chosen={decisionPick} />;
    case "compare": return <CompareView step={p} />;
    case "sequence": return <SequenceView step={p} />;
    case "form": return <FormView step={p} />;
    case "calc": return <CalcView step={p} />;
    case "diagnose": return <DiagnoseView step={p} />;
    case "quiz": return <QuizView step={p} />;
    case "scene": return <SceneView step={p} />;
    case "summary": return <SummaryView step={p} />;
  }
}

/* ------------------------------- player ---------------------------------- */

export default function ModulePlayer({ module: mod, company }: { module: Module; company: Company }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const reduce = useReducedMotion();
  const step = mod.steps[idx];
  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(Math.min(mod.steps.length - 1, Math.max(0, next)));
  };
  const unlockedTerms = useMemo(() => {
    const reached = new Set(mod.steps.slice(0, idx + 1).map((s) => s.id));
    return mod.glossary.filter((g) => reached.has(g.unlockAtStep));
  }, [mod, idx]);
  const progress = ((idx + 1) / mod.steps.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${T.paper} 0%, ${T.paperDeep} 100%)`, color: T.ink, fontFamily: sans }}>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* React 19 hoists these to <head>; fonts load at runtime, never at build */}
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap"
      />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <FactoryStage mod={mod} company={company} idx={idx} dir={dir}
          decisionPick={picks[step.id] ?? null}
          onDecide={(choiceId) => setPicks({ ...picks, [step.id]: choiceId })} />

        {/* Header — the brass plaque */}
        <header style={{ marginBottom: 26 }}>
          <h1 style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.15, margin: 0 }}>{mod.emoji} {mod.title}</h1>
          <p style={{ margin: "4px 0 0", color: T.inkSoft, fontSize: 14.5 }}>{mod.tagline}
            <span style={{ marginLeft: 10, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: T.steel, fontWeight: 700 }}>
              {mod.domain.replace("-", " ")} · {mod.difficulty} · ~{mod.durationMin} min
            </span>
          </p>
        </header>

        {/* The factory floor — journey strip with a driving truck */}
        <nav style={{ marginBottom: 8, overflowX: "auto", paddingBottom: 6 }}>
          <div style={{ display: "flex", gap: 8, minWidth: "max-content", borderBottom: `2px dashed ${T.line}`, paddingBottom: 14 }}>
            {mod.steps.map((s, i) => {
              const active = i === idx;
              const visited = i < idx;
              return (
                <motion.button key={s.id} onClick={() => go(i)} whileHover={{ y: -2 }} transition={spring}
                  title={s.journey.location}
                  style={{ position: "relative", cursor: "pointer", border: `1.5px solid ${active ? T.wood : visited ? T.line : T.line}`, background: active ? T.wood : visited ? "#FFFDF8" : T.paperDeep, color: active ? "#fff" : visited ? T.ink : T.inkSoft, borderRadius: 999, padding: "7px 14px", fontSize: 13.5, fontWeight: 600, fontFamily: sans, whiteSpace: "nowrap", boxShadow: active ? "0 4px 12px rgba(110,74,47,0.35)" : "none" }}>
                  <span style={{ marginRight: 6 }}>{s.journey.icon}</span>
                  {s.label}
                  {active && !reduce && (
                    <motion.span layoutId="truck" transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      style={{ position: "absolute", left: "50%", bottom: -21, transform: "translateX(-50%)", fontSize: 15 }}>
                      🚚
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Progress bar — brass fill on wood */}
        <div style={{ height: 6, borderRadius: 999, background: T.line, overflow: "hidden", marginBottom: 22 }}>
          <motion.div animate={{ width: `${progress}%` }} transition={spring} style={{ height: "100%", background: `linear-gradient(90deg, ${T.wood}, ${T.brass})`, borderRadius: 999 }} />
        </div>

        {/* Live date line */}
        <div style={{ marginBottom: 14, fontSize: 13.5, color: T.inkSoft }}>
          <LiveDate dayOffset={step.journey.dayOffset} />
        </div>

        {/* Step content — the camera pans, never hard-switches */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step.id}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <StepBody step={step} company={company} decisionPick={picks[step.id] ?? null} />
          </motion.section>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ marginTop: 34, paddingTop: 18, borderTop: `1px solid ${T.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => go(idx - 1)} disabled={idx === 0}
            style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#FFFDF8", fontWeight: 700, fontFamily: sans, cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}>
            ← Back
          </motion.button>
          <span style={{ fontSize: 13.5, color: T.inkSoft, fontWeight: 600 }}>
            Step {idx + 1} of {mod.steps.length}
          </span>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => go(idx + 1)} disabled={idx === mod.steps.length - 1}
            style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: idx === mod.steps.length - 1 ? T.line : T.wood, color: "#fff", fontWeight: 700, fontFamily: sans, cursor: idx === mod.steps.length - 1 ? "default" : "pointer", boxShadow: idx === mod.steps.length - 1 ? "none" : "0 4px 14px rgba(110,74,47,0.35)" }}>
            Continue →
          </motion.button>
        </div>

        {/* Glossary — the workshop logbook */}
        {unlockedTerms.length > 0 && (
          <aside style={{ marginTop: 34, background: "#FFFDF8", border: `1px solid ${T.line}`, borderLeft: `4px solid ${T.brass}`, borderRadius: 12, padding: 18 }}>
            <h2 style={{ margin: "0 0 10px", fontFamily: serif, fontSize: 16 }}>
              The logbook <span style={{ color: T.inkSoft, fontWeight: 400, fontSize: 13 }}>— terms unlocked {unlockedTerms.length}/{mod.glossary.length}</span>
            </h2>
            <dl style={{ margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              {unlockedTerms.map((g) => (
                <div key={g.term}>
                  <dt style={{ fontWeight: 700, color: T.woodDeep }}>{g.term}</dt>
                  <dd style={{ margin: "2px 0 0", color: T.inkSoft, lineHeight: 1.55 }}>{g.definition}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </main>
    </div>
  );
}
