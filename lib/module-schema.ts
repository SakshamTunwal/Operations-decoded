/**
 * Operations Decoded — Module Content Contract
 * --------------------------------------------
 * Single source of truth for what a module IS.
 * The engine renders only this. od-architect produces only this.
 * CI rejects anything that violates this.
 *
 * Derived from the working shapes in app/learn/procure-to-pay/{types,constants}.ts,
 * generalized per docs/architecture.md §3.
 *
 * Locked decisions encoded here:
 *  - Shared cast: characters live in content/company.json; modules reference them by id.
 *  - Content carries MEANING, not styling: `tone`, never Tailwind classes.
 *  - Currency/number formatting is the engine's job (USD, en-US). Content stores plain numbers.
 *  - Dates are relative day offsets, rendered live by the engine (the addDays pattern).
 *  - 5–9 steps, 7 is the convention, the last step MUST be a summary.
 *
 * Requires: zod v4  (npm install zod)
 */

import * as z from "zod";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase words separated by hyphens");

/** Semantic tone. The engine maps these to the design system. */
export const Tone = z.enum(["positive", "caution", "danger", "neutral", "info"]);

/** Stable id for anything referenced elsewhere in the module. */
const Id = z.string().min(1).max(40);

/* ------------------------------------------------------------------ */
/* Company bible (content/company.json) — the shared cast              */
/* ------------------------------------------------------------------ */

export const CharacterSchema = z.object({
  id: Id, //                e.g. "marcus"
  name: z.string().min(1), //     "Marcus Webb"
  role: z.string().min(1), //     "Production Supervisor"
  department: z.string().min(1),
  /** One-line personality note the writer/architect must stay true to. */
  persona: z.string().min(1),
  avatar: z.string().startsWith("/"), // e.g. "/company/marcus.png"
});

export const CompanySchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  industry: z.string().min(1),
  /** Short world description agents draw from for continuity. */
  background: z.string().min(1),
  characters: z.array(CharacterSchema).min(3).max(12),
});

/* ------------------------------------------------------------------ */
/* Pieces reused across step types                                     */
/* ------------------------------------------------------------------ */

/** Where/when a step happens — the journey spine (from StepConfig). */
export const JourneyPoint = z.object({
  location: z.string().min(1), //  "Receiving Bay 3"
  /** Narrative clock, free text: "Tuesday 8:14am", "Seven Days Later". */
  timeLabel: z.string().min(1),
  /** Days after the story starts; the engine renders a live calendar date. */
  dayOffset: z.number().int().min(0).max(365),
  /** Document at the center of this step: "PR", "PO", "GRN", "Invoice"… */
  doc: z.string().min(1).max(24),
  icon: z.string().min(1).max(8), // emoji
});

export const DialogueLine = z.object({
  characterId: Id, // must exist in company.json; cross-checked by the validator
  text: z.string().min(1),
});

export const TeachingPoint = z.string().min(1).max(280);

/* ------------------------------------------------------------------ */
/* Step payloads                                                       */
/* ------------------------------------------------------------------ */

/** Scene-setting conversation. */
const DialogueStep = z.object({
  type: z.literal("dialogue"),
  lines: z.array(DialogueLine).min(1).max(12),
});

/** Choose one option; every wrong option has a concrete consequence. */
const DecisionStep = z
  .object({
    type: z.literal("decision"),
    prompt: z.string().min(1),
    choices: z
      .array(
        z.object({
          id: Id,
          label: z.string().min(1),
          /** What this choice costs/means — shown up front (the QuantityOption pattern). */
          implication: z.string().min(1),
          correct: z.boolean(),
          /** Shown after picking: the consequence if wrong, the confirmation if right. */
          feedback: z.string().min(1),
          tone: Tone.optional(),
        })
      )
      .min(2)
      .max(4),
    teachingPoint: TeachingPoint,
  })
  .refine((s) => s.choices.filter((c) => c.correct).length === 1, {
    message: "decision must have exactly one correct choice",
    path: ["choices"],
  });

/** Options side by side (the Vendor-table pattern); pick one, defend on criteria. */
const CompareStep = z
  .object({
    type: z.literal("compare"),
    prompt: z.string().min(1),
    /** Attribute labels every option must provide, in display order. */
    attributes: z.array(z.string().min(1)).min(2).max(6),
    options: z
      .array(
        z.object({
          id: Id,
          name: z.string().min(1),
          /** label -> value; keys must match `attributes`. */
          values: z.record(z.string(), z.union([z.string(), z.number()])),
          tag: z.string().min(1).max(30), // "Preferred Vendor", "Unverified"
          tone: Tone,
          note: z.string().optional(), // the warning/track-record line
        })
      )
      .min(2)
      .max(4),
    correctOptionId: Id,
    feedbackCorrect: z.string().min(1),
    feedbackWrong: z.string().min(1),
    teachingPoint: TeachingPoint,
  })
  .refine((s) => s.options.some((o) => o.id === s.correctOptionId), {
    message: "correctOptionId must match one of the options",
    path: ["correctOptionId"],
  })
  .refine(
    (s) => s.options.every((o) => s.attributes.every((a) => a in o.values)),
    { message: "every option must provide a value for every attribute", path: ["options"] }
  );

/** Put items in the right order (the criteria-ranking pattern). */
const SequenceStep = z
  .object({
    type: z.literal("sequence"),
    prompt: z.string().min(1),
    items: z
      .array(z.object({ id: Id, label: z.string().min(1) }))
      .min(3)
      .max(8),
    correctOrder: z.array(Id).min(3).max(8),
    teachingPoint: TeachingPoint,
  })
  .refine(
    (s) =>
      s.correctOrder.length === s.items.length &&
      new Set(s.correctOrder).size === s.correctOrder.length &&
      s.items.every((i) => s.correctOrder.includes(i.id)),
    { message: "correctOrder must be a permutation of item ids", path: ["correctOrder"] }
  );

/** Fill a business document (the GRN-entry pattern). */
const FormStep = z.object({
  type: z.literal("form"),
  documentTitle: z.string().min(1), // "Goods Receipt Note"
  intro: z.string().min(1),
  fields: z
    .array(
      z.object({
        id: Id,
        label: z.string().min(1),
        expected: z.union([z.string().min(1), z.number()]),
        /** For numeric fields: acceptable ± range. Omit for exact match. */
        tolerance: z.number().min(0).optional(),
        hint: z.string().optional(),
      })
    )
    .min(1)
    .max(8),
  teachingPoint: TeachingPoint,
});

/** Numeric problem with a formula reveal. */
const CalcStep = z.object({
  type: z.literal("calc"),
  prompt: z.string().min(1),
  /** The inputs the learner needs, stated explicitly so they're checkable. */
  given: z
    .array(z.object({ label: z.string().min(1), value: z.number(), unit: z.string().optional() }))
    .min(1)
    .max(8),
  answer: z.number(),
  tolerance: z.number().min(0),
  unit: z.string().optional(),
  formulaReveal: z.string().min(1),
  teachingPoint: TeachingPoint,
});

/** Find the error(s) in a shown document (the PO-error-hunt pattern). */
const DiagnoseStep = z
  .object({
    type: z.literal("diagnose"),
    documentTitle: z.string().min(1), // "Purchase Order #4471"
    intro: z.string().min(1),
    fields: z
      .array(
        z.object({
          id: Id,
          label: z.string().min(1),
          shown: z.string().min(1), //   what the document displays
          correct: z.string().min(1), // what it should say (equal to `shown` when not an error)
          isError: z.boolean(),
          explanation: z.string().optional(), // shown when found
        })
      )
      .min(3)
      .max(12),
    teachingPoint: TeachingPoint,
  })
  .refine((s) => s.fields.some((f) => f.isError), {
    message: "diagnose needs at least one error field",
    path: ["fields"],
  })
  .refine(
    (s) => s.fields.every((f) => (f.isError ? f.shown !== f.correct : f.shown === f.correct)),
    { message: "error fields must differ shown vs correct; non-error fields must match", path: ["fields"] }
  );

/** Quick recall check (the micro-quiz pattern). */
const QuizStep = z.object({
  type: z.literal("quiz"),
  questions: z
    .array(
      z
        .object({
          prompt: z.string().min(1),
          options: z.array(z.object({ id: Id, text: z.string().min(1) })).min(2).max(4),
          correctId: Id,
          explanation: z.string().min(1),
        })
        .refine((q) => q.options.some((o) => o.id === q.correctId), {
          message: "correctId must match an option",
          path: ["correctId"],
        })
    )
    .min(2)
    .max(6),
});

/** Bespoke hand-written showpiece (the truck-scene escape hatch). */
const SceneStep = z.object({
  type: z.literal("scene"),
  /** Must exist in the engine's scene registry; the validator cross-checks. */
  component: Slug,
  props: z.record(z.string(), z.unknown()).default({}),
});

/** Mandatory closer. */
const SummaryStep = z.object({
  type: z.literal("summary"),
  takeaways: z.array(z.string().min(1)).min(3).max(6),
  nextSlug: Slug.optional(),
});

/* ------------------------------------------------------------------ */
/* A step = journey envelope + one payload                             */
/* ------------------------------------------------------------------ */

const StepPayload = z.discriminatedUnion("type", [
  DialogueStep,
  DecisionStep,
  CompareStep,
  SequenceStep,
  FormStep,
  CalcStep,
  DiagnoseStep,
  QuizStep,
  SceneStep,
  SummaryStep,
]);

export const StepSchema = z.object({
  id: Id,
  /** Short label on the journey map: "Receiving Bay". */
  label: z.string().min(1).max(30),
  journey: JourneyPoint,
  payload: StepPayload,
});

/* ------------------------------------------------------------------ */
/* Glossary — unlocks as the story reaches each term                   */
/* ------------------------------------------------------------------ */

export const GlossaryEntry = z.object({
  term: z.string().min(1),
  /** Teach through the story, not like a dictionary. */
  definition: z.string().min(1),
  /** Step id at which the term unlocks. */
  unlockAtStep: Id,
});

/* ------------------------------------------------------------------ */
/* The module                                                          */
/* ------------------------------------------------------------------ */

export const ModuleSchema = z
  .object({
    schemaVersion: z.literal(1),
    slug: Slug,
    title: z.string().min(1).max(80),
    tagline: z.string().min(1).max(140),
    domain: z.enum(["core-concepts", "supply-chain", "erp-systems"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    durationMin: z.number().int().min(5).max(60),
    emoji: z.string().min(1).max(8),
    /** Cast in this story: character ids from company.json + role in this module. */
    cast: z
      .array(z.object({ characterId: Id, storyRole: z.string().min(1) }))
      .min(1)
      .max(8),
    seo: z.object({
      description: z.string().min(50).max(160),
      ogImage: z.string().startsWith("/").optional(),
    }),
    /** Path to the source narrative .md, for the fidelity/number checks. */
    narrativeSource: z.string().min(1),
    glossary: z.array(GlossaryEntry).max(12).default([]),
    steps: z.array(StepSchema).min(5).max(9),
  })
  .superRefine((m, ctx) => {
    // Last step must be the summary — and only the last.
    const last = m.steps[m.steps.length - 1];
    if (last.payload.type !== "summary") {
      ctx.addIssue({ code: "custom", message: "last step must be a summary", path: ["steps"] });
    }
    m.steps.slice(0, -1).forEach((s, i) => {
      if (s.payload.type === "summary") {
        ctx.addIssue({ code: "custom", message: "summary allowed only as the last step", path: ["steps", i] });
      }
    });
    // Unique step ids.
    if (new Set(m.steps.map((s) => s.id)).size !== m.steps.length) {
      ctx.addIssue({ code: "custom", message: "step ids must be unique", path: ["steps"] });
    }
    // Glossary unlock points must reference real steps.
    const stepIds = new Set(m.steps.map((s) => s.id));
    m.glossary.forEach((g, i) => {
      if (!stepIds.has(g.unlockAtStep)) {
        ctx.addIssue({
          code: "custom",
          message: `glossary term "${g.term}" unlocks at unknown step "${g.unlockAtStep}"`,
          path: ["glossary", i, "unlockAtStep"],
        });
      }
    });
    // Journey time never moves backwards.
    for (let i = 1; i < m.steps.length; i++) {
      if (m.steps[i].journey.dayOffset < m.steps[i - 1].journey.dayOffset) {
        ctx.addIssue({
          code: "custom",
          message: "journey dayOffset must not decrease between steps",
          path: ["steps", i, "journey", "dayOffset"],
        });
      }
    }
  });

/* ------------------------------------------------------------------ */
/* Registry (content/registry.json)                                    */
/* ------------------------------------------------------------------ */

export const RegistryEntry = z.object({
  slug: Slug,
  title: z.string().min(1),
  domain: z.enum(["core-concepts", "supply-chain", "erp-systems"]),
  /** Use gaps of 10 so inserting a module never renumbers the rest. */
  order: z.number().int().min(0),
  status: z.enum(["draft", "live", "hidden"]),
});

export const RegistrySchema = z
  .object({
    modules: z.array(RegistryEntry),
  })
  .refine((r) => new Set(r.modules.map((m) => m.slug)).size === r.modules.length, {
    message: "registry slugs must be unique",
    path: ["modules"],
  });

/* ------------------------------------------------------------------ */
/* Inferred TypeScript types — the engine imports these                */
/* ------------------------------------------------------------------ */

export type Character = z.infer<typeof CharacterSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Step = z.infer<typeof StepSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
export type ModuleStepPayload = Step["payload"];
