"use client";

/**
 * Module Player — Phase 1 skeleton.
 *
 * Renders a validated module step by step: journey strip, one step at a
 * time, plain rendering for every payload type, basic interactivity
 * (choices reveal feedback, calc checks the answer, diagnose lets you
 * flag fields). Deliberately unstyled beyond basic readability —
 * Phase 2 replaces the look, not the wiring.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Company, Module, Step } from "../../lib/module-schema";

/* ---------- formatting (USD / en-US — the one formatting policy) ---------- */

const num = new Intl.NumberFormat("en-US");
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const fmtNum = (n: number) => num.format(n);
export const fmtUSD = (n: number) => usd.format(n);

/** Renders the story's live calendar date (the addDays pattern), client-side to avoid hydration mismatch. */
function LiveDate({ dayOffset }: { dayOffset: number }) {
  const [s, setS] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    setS(d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  }, [dayOffset]);
  return s ? <span className="text-gray-500"> · {s}</span> : null;
}

/* ------------------------------- pieces ---------------------------------- */

const toneClasses: Record<string, string> = {
  positive: "border-green-300 bg-green-50 text-green-900",
  caution: "border-amber-300 bg-amber-50 text-amber-900",
  danger: "border-red-300 bg-red-50 text-red-900",
  info: "border-blue-300 bg-blue-50 text-blue-900",
  neutral: "border-gray-300 bg-gray-50 text-gray-900",
};

function Teaching({ text }: { text: string }) {
  return (
    <p className="mt-4 border-l-4 border-blue-400 bg-blue-50 p-3 text-sm">
      <strong>Teaching point:</strong> {text}
    </p>
  );
}

function CharacterMap(company: Company) {
  return new Map(company.characters.map((c) => [c.id, c]));
}

/* ---------------------------- step renderers ------------------------------ */

function DialogueView({ step, company }: { step: Extract<Step["payload"], { type: "dialogue" }>; company: Company }) {
  const chars = useMemo(() => CharacterMap(company), [company]);
  return (
    <div className="space-y-3">
      {step.lines.map((l, i) => {
        const c = chars.get(l.characterId);
        return (
          <div key={i} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold">
              {c?.name.charAt(0) ?? "?"}
            </div>
            <div>
              <div className="text-sm font-semibold">
                {c?.name ?? l.characterId} <span className="font-normal text-gray-500">— {c?.role}</span>
              </div>
              <p>{l.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DecisionView({ step }: { step: Extract<Step["payload"], { type: "decision" }> }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const pick = step.choices.find((c) => c.id === chosen);
  return (
    <div>
      <p className="mb-3 font-medium">{step.prompt}</p>
      <div className="space-y-2">
        {step.choices.map((c) => (
          <button
            key={c.id}
            onClick={() => setChosen(c.id)}
            className={`block w-full rounded border p-3 text-left ${
              chosen === c.id ? (c.correct ? toneClasses.positive : toneClasses.danger) : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">{c.label}</span>
            <span className="block text-sm text-gray-600">{c.implication}</span>
          </button>
        ))}
      </div>
      {pick && (
        <div className="mt-3">
          <p className={`rounded border p-3 ${pick.correct ? toneClasses.positive : toneClasses.danger}`}>
            <strong>{pick.correct ? "Right call. " : "Not this one. "}</strong>
            {pick.feedback}
          </p>
          <Teaching text={step.teachingPoint} />
        </div>
      )}
    </div>
  );
}

function CompareView({ step }: { step: Extract<Step["payload"], { type: "compare" }> }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const correct = chosen === step.correctOptionId;
  return (
    <div>
      <p className="mb-3 font-medium">{step.prompt}</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-2 text-left">Option</th>
              {step.attributes.map((a) => (
                <th key={a} className="border p-2 text-left">{a}</th>
              ))}
              <th className="border p-2" />
            </tr>
          </thead>
          <tbody>
            {step.options.map((o) => (
              <tr key={o.id} className={chosen === o.id ? "bg-gray-100" : ""}>
                <td className="border p-2">
                  <div className="font-medium">{o.name}</div>
                  <span className={`inline-block rounded border px-2 py-0.5 text-xs ${toneClasses[o.tone]}`}>{o.tag}</span>
                  {o.note && <div className="mt-1 text-xs text-gray-500">{o.note}</div>}
                </td>
                {step.attributes.map((a) => (
                  <td key={a} className="border p-2">
                    {typeof o.values[a] === "number" ? fmtNum(o.values[a] as number) : String(o.values[a])}
                  </td>
                ))}
                <td className="border p-2">
                  <button onClick={() => setChosen(o.id)} className="rounded border border-gray-400 px-3 py-1 hover:bg-gray-50">
                    Choose
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {chosen && (
        <div className="mt-3">
          <p className={`rounded border p-3 ${correct ? toneClasses.positive : toneClasses.danger}`}>
            {correct ? step.feedbackCorrect : step.feedbackWrong}
          </p>
          <Teaching text={step.teachingPoint} />
        </div>
      )}
    </div>
  );
}

function SequenceView({ step }: { step: Extract<Step["payload"], { type: "sequence" }> }) {
  const [revealed, setRevealed] = useState(false);
  const byId = new Map(step.items.map((i) => [i.id, i.label]));
  return (
    <div>
      <p className="mb-3 font-medium">{step.prompt}</p>
      <ul className="list-disc pl-6">
        {step.items.map((i) => (
          <li key={i.id}>{i.label}</li>
        ))}
      </ul>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="mt-3 rounded border border-gray-400 px-3 py-1 hover:bg-gray-50">
          Reveal correct order
        </button>
      ) : (
        <div className="mt-3">
          <ol className="list-decimal pl-6 font-medium">
            {step.correctOrder.map((id) => (
              <li key={id}>{byId.get(id)}</li>
            ))}
          </ol>
          <Teaching text={step.teachingPoint} />
        </div>
      )}
      <p className="mt-2 text-xs text-gray-400">(Drag-to-order arrives with the Phase 2 design.)</p>
    </div>
  );
}

function FormView({ step }: { step: Extract<Step["payload"], { type: "form" }> }) {
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
  return (
    <div>
      <h3 className="font-semibold">{step.documentTitle}</h3>
      <p className="mb-3 text-sm text-gray-600">{step.intro}</p>
      <div className="space-y-2">
        {step.fields.map((f) => (
          <label key={f.id} className="block">
            <span className="text-sm font-medium">{f.label}</span>
            <input
              value={values[f.id] ?? ""}
              onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
              className={`mt-1 block w-full rounded border p-2 ${
                checked ? (ok(f.id) ? "border-green-500" : "border-red-500") : "border-gray-300"
              }`}
            />
            {checked && !ok(f.id) && f.hint && <span className="text-sm text-red-700">Hint: {f.hint}</span>}
          </label>
        ))}
      </div>
      <button onClick={() => setChecked(true)} className="mt-3 rounded border border-gray-400 px-3 py-1 hover:bg-gray-50">
        Check the document
      </button>
      {checked && step.fields.every((f) => ok(f.id)) && <Teaching text={step.teachingPoint} />}
    </div>
  );
}

function CalcView({ step }: { step: Extract<Step["payload"], { type: "calc" }> }) {
  const [v, setV] = useState("");
  const [checked, setChecked] = useState(false);
  const n = Number(v.replace(/[$,]/g, ""));
  const correct = Number.isFinite(n) && Math.abs(n - step.answer) <= step.tolerance;
  return (
    <div>
      <p className="mb-3 font-medium">{step.prompt}</p>
      <table className="mb-3 text-sm">
        <tbody>
          {step.given.map((g, i) => (
            <tr key={i}>
              <td className="pr-4 text-gray-600">{g.label}</td>
              <td className="font-medium">
                {fmtNum(g.value)}
                {g.unit ? ` ${g.unit}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
        <input
          value={v}
          onChange={(e) => { setV(e.target.value); setChecked(false); }}
          placeholder="Your answer"
          className="rounded border border-gray-300 p-2"
        />
        {step.unit && <span className="text-gray-500">{step.unit}</span>}
        <button onClick={() => setChecked(true)} className="rounded border border-gray-400 px-3 py-1 hover:bg-gray-50">
          Check
        </button>
      </div>
      {checked && (
        <div className="mt-3">
          <p className={`rounded border p-3 ${correct ? toneClasses.positive : toneClasses.danger}`}>
            {correct ? "Correct." : "Not quite — try once more, or reveal the working."}
          </p>
          {correct && (
            <>
              <p className="mt-2 text-sm text-gray-700">{step.formulaReveal}</p>
              <Teaching text={step.teachingPoint} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DiagnoseView({ step }: { step: Extract<Step["payload"], { type: "diagnose" }> }) {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const toggle = (id: string) => {
    const next = new Set(flagged);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFlagged(next);
    setChecked(false);
  };
  const errors = step.fields.filter((f) => f.isError);
  const found = errors.filter((f) => flagged.has(f.id)).length;
  return (
    <div>
      <h3 className="font-semibold">{step.documentTitle}</h3>
      <p className="mb-3 text-sm text-gray-600">{step.intro} Click any line that looks wrong.</p>
      <div className="space-y-1">
        {step.fields.map((f) => (
          <button
            key={f.id}
            onClick={() => toggle(f.id)}
            className={`flex w-full justify-between rounded border p-2 text-left text-sm ${
              checked && f.isError && flagged.has(f.id)
                ? toneClasses.positive
                : checked && flagged.has(f.id)
                ? toneClasses.danger
                : flagged.has(f.id)
                ? "border-amber-400 bg-amber-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="text-gray-600">{f.label}</span>
            <span className="font-medium">{f.shown}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setChecked(true)} className="mt-3 rounded border border-gray-400 px-3 py-1 hover:bg-gray-50">
        Check my flags
      </button>
      {checked && (
        <div className="mt-3 text-sm">
          <p className="font-medium">
            Found {found} of {errors.length} error{errors.length > 1 ? "s" : ""}.
          </p>
          {found === errors.length && (
            <>
              <ul className="mt-2 list-disc pl-6">
                {errors.map((f) => (
                  <li key={f.id}>
                    <strong>{f.label}:</strong> shows “{f.shown}”, should be “{f.correct}”.
                    {f.explanation ? ` ${f.explanation}` : ""}
                  </li>
                ))}
              </ul>
              <Teaching text={step.teachingPoint} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuizView({ step }: { step: Extract<Step["payload"], { type: "quiz" }> }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  return (
    <div className="space-y-5">
      {step.questions.map((q, qi) => {
        const chosen = answers[qi];
        const correct = chosen === q.correctId;
        return (
          <div key={qi}>
            <p className="mb-2 font-medium">
              {qi + 1}. {q.prompt}
            </p>
            <div className="space-y-1">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setAnswers({ ...answers, [qi]: o.id })}
                  className={`block w-full rounded border p-2 text-left text-sm ${
                    chosen === o.id ? (o.id === q.correctId ? toneClasses.positive : toneClasses.danger) : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {o.text}
                </button>
              ))}
            </div>
            {chosen && (
              <p className={`mt-2 rounded border p-2 text-sm ${correct ? toneClasses.positive : toneClasses.danger}`}>
                {correct ? "Correct. " : "Not quite. "}
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SceneView({ step }: { step: Extract<Step["payload"], { type: "scene" }> }) {
  return (
    <div className="rounded border-2 border-dashed border-gray-400 p-8 text-center text-gray-500">
      Scene component “{step.component}” renders here (scene registry arrives with Phase 2).
    </div>
  );
}

function SummaryView({ step }: { step: Extract<Step["payload"], { type: "summary" }> }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">What you take with you</h3>
      <ul className="list-disc space-y-1 pl-6">
        {step.takeaways.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      {step.nextSlug && (
        <Link href={`/learn/${step.nextSlug}`} className="mt-4 inline-block rounded border border-gray-400 px-4 py-2 hover:bg-gray-50">
          Next module →
        </Link>
      )}
    </div>
  );
}

function StepBody({ step, company }: { step: Step; company: Company }) {
  const p = step.payload;
  switch (p.type) {
    case "dialogue":
      return <DialogueView step={p} company={company} />;
    case "decision":
      return <DecisionView step={p} />;
    case "compare":
      return <CompareView step={p} />;
    case "sequence":
      return <SequenceView step={p} />;
    case "form":
      return <FormView step={p} />;
    case "calc":
      return <CalcView step={p} />;
    case "diagnose":
      return <DiagnoseView step={p} />;
    case "quiz":
      return <QuizView step={p} />;
    case "scene":
      return <SceneView step={p} />;
    case "summary":
      return <SummaryView step={p} />;
  }
}

/* ------------------------------- player ---------------------------------- */

export default function ModulePlayer({ module: mod, company }: { module: Module; company: Company }) {
  const [idx, setIdx] = useState(0);
  const step = mod.steps[idx];
  const unlockedTerms = useMemo(() => {
    const reached = new Set(mod.steps.slice(0, idx + 1).map((s) => s.id));
    return mod.glossary.filter((g) => reached.has(g.unlockAtStep));
  }, [mod, idx]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <div className="text-3xl">{mod.emoji}</div>
        <h1 className="text-2xl font-bold">{mod.title}</h1>
        <p className="text-gray-600">{mod.tagline}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
          {mod.domain} · {mod.difficulty} · ~{mod.durationMin} min · {company.name}, {company.city}
        </p>
      </header>

      {/* Journey strip */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {mod.steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            title={s.journey.location}
            className={`rounded-full border px-3 py-1 text-sm ${
              i === idx ? "border-black bg-black text-white" : i < idx ? "border-gray-400 bg-gray-100" : "border-gray-300 text-gray-500"
            }`}
          >
            {s.journey.icon} {s.label}
          </button>
        ))}
      </nav>

      {/* Step header */}
      <div className="mb-4 border-b pb-2 text-sm text-gray-600">
        <strong>{step.journey.location}</strong> · {step.journey.timeLabel}
        <LiveDate dayOffset={step.journey.dayOffset} />
        <span className="float-right rounded bg-gray-100 px-2 py-0.5 text-xs">Document: {step.journey.doc}</span>
      </div>

      <StepBody step={step} company={company} />

      {/* Prev / next */}
      <div className="mt-8 flex justify-between border-t pt-4">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="rounded border border-gray-400 px-4 py-2 disabled:opacity-40"
        >
          ← Back
        </button>
        <span className="self-center text-sm text-gray-500">
          Step {idx + 1} of {mod.steps.length}
        </span>
        <button
          onClick={() => setIdx(Math.min(mod.steps.length - 1, idx + 1))}
          disabled={idx === mod.steps.length - 1}
          className="rounded border border-gray-400 px-4 py-2 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>

      {/* Glossary */}
      {unlockedTerms.length > 0 && (
        <aside className="mt-8 rounded border bg-gray-50 p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Glossary — unlocked so far ({unlockedTerms.length}/{mod.glossary.length})
          </h2>
          <dl className="space-y-2 text-sm">
            {unlockedTerms.map((g) => (
              <div key={g.term}>
                <dt className="font-medium">{g.term}</dt>
                <dd className="text-gray-600">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </main>
  );
}
