# The Module Gold Standard

**v1.0 — 2026-09-13.** This defines what a finished Furniture Decoded module is. It binds everyone who makes modules: you, me, od-architect, od-verifier, and CI. A module ships when it meets this document, not when it feels done. Changes to the standard are deliberate commits, never drift.

---

## 0. The one-line test

**A module is a story at Furniture Decoded where the learner makes the decisions that matter.** If the learner could be removed and the story still resolves, it is a video, not a module — rewrite it.

---

## 1. Story architecture

- **One lesson per module.** Name it in one sentence before writing anything. Every step serves it; anything serving a second lesson gets cut and becomes its own module.
- **The teaching spine:** situation → hidden root cause → earned resolution. The learner *discovers* the cause by deciding, never by being told.
- **Seven steps is the convention** (5–9 legal). The default arc:
  1. **Hook** — a problem surfaces in a place (dialogue; something is visibly wrong in the scene)
  2. **Investigation** — establish the facts the decision needs
  3. **Decision** — the learner commits (decision/compare)
  4. **Execution** — the paperwork or process step (form/diagnose)
  5. **Consequence** — reality answers, numbers get checked (calc; the truck arrives)
  6. **Proof** — the quiz confirms it stuck
  7. **Summary** — 3–6 takeaways, next module
- **Time moves forward only**, and the timeline must survive a calendar: lead times, buffer days, and "X days later" labels must reconcile with the day offsets. (M15's blocker class. Checked by machine.)
- **Stakes are stated in dollars or stopped lines.** "This is bad" is not a stake; "$8,325 paid for tube we can't use" is.

## 2. The world (stage requirements)

- **Every step plays on a scene.** Minimum **two locations** per module; each location change is *motivated in the story* ("Ray needs this before lunch" → we go to Ray).
- **Cast 2–4** (5 hard max). Every named character does something; nobody stands around. Tommy appears when the learner needs a voice.
- **Live data in the world:** quantities, stock levels, and statuses that matter appear as labels *inside the scene* (the `RACK 14 · 25MM TUBE` pattern; the reference's `OAK BOARDS · 0 AVAILABLE`), not only in prose.
- **One scene event per module** — something *happens* in the world: the truck arrives, the rack visibly empties, the stamp comes down on screen. This is the moment learners remember.
- **Dialogue lives on the stage** as bubbles (tap to advance), with the transcript below for accessibility.

## 3. Interaction bar

- **Minimum 4 interactive steps** using **at least 3 different types** (from: decision, compare, sequence, form, calc, diagnose, quiz).
- **Every choice shows its implication before picking and its consequence after.** Wrong answers teach a concrete cost — a number, a delay, a stopped line — never "incorrect, try again."
- **Decisions render in-scene** (the floating panel from the reference), attached to the moment, not below the fold.
- **Every number the learner can check must check out.** Calc answers, cover-days, invoice totals: a calculator and a calendar are the first two reviewers.
- **Feedback is instant and physical:** stamp on verified documents, sparks on correct, red ink on costly. Nothing silently accepts input.

## 4. Writing bar

- Voice rules and cast voices per `docs/company-bible.md`; **the swap test applies**: if two characters' lines could trade owners unnoticed, rewrite.
- **Bubble lines ≤ 2 sentences.** Long exposition is a smell — turn it into something the learner inspects or decides.
- **ESL-safe:** no idioms that don't travel, no wordplay-dependent humor. Humor comes from character and situation. **Max one running gag per module.**
- USD, en-US numbers, real arithmetic. Vendor and material names come from the bible's tables.
- SEO description 50–160 chars, written for a search result, not a summary.

## 5. Motion & feel bar

- Camera **pans** between locations; nothing hard-switches. Characters persist and walk in; they never teleport.
- Motion has meaning: springs on choices, stamp on verification, spark on success. **Nothing loops loudly forever**; idle motion is breathing-subtle. All of it degrades to fades under `prefers-reduced-motion`.
- The fiftieth module a learner plays must feel as good as the first — playful, not noisy.

## 6. Performance & accessibility budgets (enforced in CI at Phase 4)

- Lighthouse on the module page: **performance ≥ 85, accessibility ≥ 90, SEO ≥ 95**.
- Fully usable at **390px** width and at **1440px**; no horizontal scroll of the page body.
- All interactions keyboard-reachable; images/SVG carry roles or are marked decorative; text contrast passes AA.
- No video files, no per-module image generation in the module path. The world is code; one-time ambient media, if ever adopted, is a shared asset with a measured budget.

## 7. The one-time asset ledger

The premium feel is bought once and reused forever. Status today:

| Asset | Scope | Status |
|---|---|---|
| Design tokens & type (Workshop Premium) | site-wide | ✅ v1 |
| Motion vocabulary (pan/stamp/spark/springs) | engine | ✅ v1 |
| Cast sprites (8 characters) | all modules | ✅ v1 — refine pass pending |
| Location scenes | ~10 rooms total; 4 built (warehouse, office, dock, finance) | 🔶 density pass next; floor/QC/shipping later |
| In-scene decision panel | engine | ⬜ next task |
| Live scene data labels (driven by module JSON) | engine + schema | ⬜ next task |
| Drag-to-order `sequence` | engine | ⬜ Phase 2 close |
| Bespoke `scene` registry | engine | ⬜ when first showpiece module needs it |
| Sound design | engine, optional | ⬜ parked — decide after first real module |

## 8. The acceptance checklist

A module ships when every line is true. (You and od-verifier walk this list; CI automates §6 and the arithmetic.)

```
STORY      [ ] One lesson, stated in one sentence          [ ] Spine: situation → root cause → earned resolution
           [ ] Learner's decisions drive the resolution    [ ] Timeline survives a calendar
WORLD      [ ] ≥2 locations, changes motivated             [ ] Cast 2–4, everyone acts
           [ ] Live data labels in-scene                   [ ] One scene event
INTERACT   [ ] ≥4 interactive steps, ≥3 types              [ ] Every wrong answer teaches a cost
           [ ] All checkable numbers check out             [ ] Decisions in-scene
WRITING    [ ] Swap test passes                            [ ] Bubbles ≤2 sentences; ESL-safe; ≤1 gag
           [ ] Bible canon respected (names, vendors)      [ ] SEO description in spec
FEEL       [ ] Pans, stamps, sparks present                [ ] Reduced-motion clean
BUDGETS    [ ] Lighthouse 85/90/95                         [ ] 390px & 1440px clean
```

## 9. The benchmark module

The **sample module, upgraded through the density pass, is the living benchmark** — the thing every checklist line points at. When the first real module (the M15 pilot, reborn as the new series' Module 1) is built, it must match or beat the benchmark on every line. From then on, the newest shipped module is the bar.
