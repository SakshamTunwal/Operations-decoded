# **Operations Decoded — End-to-End Architecture**

**Written 2026-09-12.** Supersedes the "Content-to-Production Pipeline Plan" draft. Verified against the live repo, the live server, Hermes 0.18.2's actual CLI, GitHub's plan docs and Vercel's fair-use policy.

---

## **0\. The one-paragraph version**

An idea becomes a live module through five stages. Three agents you already own write and quality-check the *narrative*. Two new agents turn that narrative into a *scenario spec* — a JSON file describing every step, decision, number and answer. A script you run copies that JSON into the repo and opens a pull request. GitHub Actions proves the module builds, validates, renders and scores well. You look at the preview URL, and you press merge. No agent ever holds a GitHub token, and no agent can deploy.

---

## **1\. What is actually true today**

### **The repo**

Next.js 16.2.1 · React 19.2.4 · Tailwind 4 · framer-motion 12 · lucide-react · TypeScript 5\. Playwright and Lighthouse CI are already wired (`npm run audit`).

Ten modules live at `app/learn/<slug>/`. Every one contains the same nine files:

characters.tsx   constants.ts   interactions.tsx   journey-map.tsx  
micro-quiz.tsx   page.tsx       scene-wrapper.tsx  scorecard.tsx   types.ts

`procure-to-pay` additionally has `drag-drop-match.tsx` and `truck-scene.tsx` — evidence that bespoke scenes already happen when a module needs one.

**Read that structure again.** The data/code separation you were planning to invent is already half-built: `constants.ts` holds content, `types.ts` holds its shape, the rest renders it. The problem is not that modules are hand-coded. The problem is that the *renderer* was copied ten times instead of imported once. Fixing a bug today means fixing it ten times; that is the real tax you are paying.

### **The server**

`hermes-vps`: 3,819 MB RAM, 845 used, **2,974 available**. 38 GB disk, 30% used. Four gateway processes at roughly 135 MB each: `default`, `budget`, `fitness`, `od-cos`.

**This matters more than you'd think.** Only *gateways* hold memory permanently. Kanban workers are spawned per card and exit. So adding agent profiles that do not run gateways costs disk, not RAM. Agent count is not your constraint. Concurrent workers are.

### **Hermes 0.18.2 — confirmed present on your build**

`kanban` with `boards`, `swarm`, `notify-subscribe`, `runs`, `log`, `schedule`, `diagnostics`, `gc`. `webhook subscribe|list|remove|test`. `send` — pipes text to Telegram with **no LLM, no agent loop, and no running gateway required**.

Two consequences: the "approval bot agent" in your draft plan is unnecessary (`hermes send` does it from any script), and push notification — which three handoffs recorded as impossible — exists via `kanban notify-subscribe`.

### **Hosting**

Vercel connected to `main`, live at www.operationsdecoded.com, currently **Hobby**. No backend anywhere. Hetzner is agents-only.

---

## **2\. The three constraints that shape everything**

**Your bottleneck is code, not content.** You told me writing modules and correcting code is the pain; testing and deploying you can do yourself. So the automation should end at "a pull request that is ready to look at." Everything past that point stays in your hands, which is also where the security risk disappears.

**Three modules a week is real volume.** That justifies building the engine. It does not justify building eight agents.

**Budget is $50–60/month all-in, including your personal agents.** Two mandatory platform upgrades take roughly $24 of that. Plan the model spend around what's left.

---

## **3\. Core decision: one engine, modules as data**

One set of components in `components/module/` renders any module from a spec file. A module becomes:

content/modules/\<slug\>.json        the scenario spec  
content/registry.json              one entry: slug, title, domain, order, status  
public/modules/\<slug\>/             avatars, OG image  
app/learn/\[slug\]/page.tsx          one dynamic route replacing ten folders

Nav, the curriculum grid, sitemap and "next module" links all read the registry. Nothing is hand-registered.

**Why this is the whole project.** It converts "write a small React app each time" into "produce a JSON file that passes a schema." Validation becomes deterministic. Testing becomes one Playwright script instead of ten. An agent producing a bad module produces a failing schema check, not a broken site. And crucially: an agent writing JSON needs no ability to write code.

### **The escape hatch**

You want modules that are visually richer, not more uniform. So the spec allows an optional bespoke scene:

{ "type": "scene", "component": "truck-scene", "props": { ... } }

The engine looks that component up in a registry of hand-written scenes. Ninety percent of a module is data. The showpiece moment is code, written deliberately, by you or by an agent under review. `truck-scene.tsx` proves you already work this way.

### **Step vocabulary (the "advanced version" you asked for)**

Your existing modules vary in step count, so the schema takes 5–9 steps with 7 as the convention, and the final step must be `summary`.

| Type | What it does |
| ----- | ----- |
| `dialogue` | Characters speak; sets the situation |
| `decision` | 2–4 choices, exactly one correct, every wrong one has a concrete consequence |
| `calc` | Numeric answer with tolerance, units, and a formula reveal |
| `form` | Fill a real document (PO, GRN, invoice) with expected values and hints |
| `sequence` | Order steps of a process correctly |
| `diagnose` | **New.** Show a document containing an error; the learner finds it. This is the closest thing to the actual job. |
| `compare` | **New.** Two options side by side; pick one and defend it on a stated criterion |
| `scene` | Bespoke animated component |
| `summary` | 3–6 takeaways, optional next module |

Every non-dialogue step carries a one-sentence `teachingPoint`. Every `calc` and `form` carries the numbers it asserts, so they can be machine-checked against the source narrative.

---

## **4\. The agent roster — five, not eight**

| \# | Agent | Status | Input → Output | Tools it needs |
| ----- | ----- | ----- | ----- | ----- |
| 1 | **od-modulewriter** | exists | brief → narrative `.md` | file (workspace only) |
| 2 | **od-reviewer** | exists | narrative → PASS / NEEDS WORK | file (read) |
| 3 | **od-humanizer** | exists | reviewed narrative → `-humanized.md` | file |
| 4 | **od-architect** | **new** | humanized `.md` → `<slug>.json` spec | file (workspace only) |
| 5 | **od-verifier** | **new** | spec \+ source `.md` → PASS / NEEDS WORK | file (read) |
| — | **od-cos** | exists | orchestration only | kanban, memory |

### **What is deliberately *not* an agent**

**Builder.** Once the engine exists, moving a validated JSON into the repo and opening a PR is mechanical. A script does it. No LLM, no token in an agent's environment.

**Tester.** GitHub Actions runs Playwright and Lighthouse on the Vercel preview. Deterministic, free, already half-configured in your `package.json`, and it keeps Chromium off a 4 GB box that is also running your agent fleet.

**Approval bot.** `hermes send --to telegram` from a CI step.

**DevOps.** You. You said you'd rather do the deploy, and that instinct is correct — it's the one place where a mistake is public.

### **od-verifier is the most important new agent, and here is why**

od-architect has to *invent* things the narrative does not contain: decision prompts, wrong-answer consequences, `calc` answers, `form` expected values. Your existing reviewer has found real arithmetic errors in **every module it has ever checked** — three Blockers in M12 including ₹18.14L that should have been ₹19.14L, two in M15 including a 45-vs-60-day lead-time mismatch.

A `calc` step with a wrong answer passes schema validation, passes `next build`, passes Playwright, and ships. A learner then does the arithmetic correctly and the site tells them they are wrong. That is worse than no module.

od-verifier exists to check invented numbers against the source narrative and against each other. It is a separate profile rather than a second hat on od-reviewer, because a SOUL holding two different jobs is exactly what jammed your board in August.

---

## **5\. The flow, end to end**

 YOU ──▶ brief to od-cos on Telegram  
              │  
              ▼  
  ┌─────────────────────── HETZNER (Kanban, one linear chain) ──────────────────────┐  
  │  od-modulewriter ──▶ od-reviewer ──▶ \[revision loop, max 2\] ──▶ od-humanizer    │  
  │            │                                                                     │  
  │            ▼                                                                     │  
  │  od-architect ──▶ od-verifier ──▶ \[revision loop, max 2\]                        │  
  │                                                                                  │  
  │  output: /root/od-content/module-NN/{narrative.md, \<slug\>.json}                 │  
  └──────────────────────────────────────┬───────────────────────────────────────────┘  
                                         │  od-cos → Telegram: "spec ready" \+ MEDIA:  
                                         ▼  
  YOU ──▶ run  ./od-publish \<slug\>     (copies JSON \+ images into repo, branch, push, PR)  
                                         │  
                                         ▼  
  ┌──────────────────────── GITHUB ACTIONS (on every PR) ───────────────────────────┐  
  │  1\. Zod schema validation      2\. Path allowlist (content/\*\* \+ public/modules/\*\*)│  
  │  3\. next build \+ eslint        4\. Registry & link integrity                      │  
  │  5\. Number reconciliation: every figure in the JSON vs the source .md            │  
  │  6\. Playwright: play all steps, both viewports, every wrong answer               │  
  │  7\. Lighthouse: perf ≥85, a11y ≥90, SEO ≥95                                      │  
  │  8\. hermes send → Telegram: pass/fail summary \+ preview URL                      │  
  └──────────────────────────────────────┬───────────────────────────────────────────┘  
                                         ▼  
  YOU ──▶ open the Vercel preview, read it, press Merge ──▶ production

**One human gate, before production only.** Preview deploys are automatic because a broken preview costs nothing. If production breaks, you promote the previous Vercel deployment — one click, no script, no agent.

---

## **6\. Where everything runs**

| Concern | Where | Why |
| ----- | ----- | ----- |
| Hermes fleet, narrative \+ spec generation | Hetzner | Long-running, holds model keys, already there |
| Schema validation, build, lint, Playwright, Lighthouse | GitHub Actions | Free runners, deterministic, keeps Chromium off a 4 GB box |
| Preview \+ production hosting | Vercel Pro | Per-PR preview URLs, one-click rollback |
| Publishing the PR | Your laptop, one script | No GitHub token in any agent environment |
| Backend (auth, community, progress) | **Later, separate project** | Not coupled to this pipeline |

---

## **7\. Security model**

The August incident happened because a wall that was documented did not exist. The design principle here is to need fewer walls.

* **No agent holds a GitHub token.** The publish script runs as you, with your credentials. This removes the entire class of risk your draft plan tried to manage with four scoped tokens.  
* **Content agents write only to `/root/od-content/`** via Kanban's `--workspace dir:` and keep `file` but not `terminal`.  
* **od-cos keeps `[kanban, memory]`** plus its verified 13-entry `disabled_toolsets` list.  
* **`kanban.auto_decompose: false` set on od-cos's own profile**, not inherited from root. Still outstanding.  
* **Before any future automation of the publish step**: switch to `terminal.backend: docker` and a non-root user, per the official Hermes production checklist. Not needed while you publish by hand.

---

## **8\. Things I recommend against**

**Frappe — no.** Frappe is a full-stack Python app platform (the base of ERPNext) with its own ORM, its own UI layer, and a MariaDB \+ Redis \+ worker deployment. Adopting it means abandoning the Next.js app that is already live and rewriting everything. It is the right tool for *being* an ERP, not for *teaching* one. When you need a backend, use managed Postgres with auth (Supabase, Neon with Auth.js, or similar) or self-host Postgres on the Hetzner box you already pay for. Either integrates with Next.js in an afternoon.

**Generated video — not in v1.** Three modules a week means 150 videos a year. You cannot diff a video, cannot version it meaningfully, cannot get an agent to fix one line of it, and a wrong number in a rendered video means regenerating the whole thing. It also destroys your Lighthouse performance score and eats Vercel bandwidth. And for an ESL audience, video without transcripts is *worse* than text, not better.

Use framer-motion instead — already a dependency, already proven in `truck-scene.tsx`. Animated SVG scenes are diffable, testable, free, instant, and version-controlled. Generate images for two things only: character avatars (once per character) and the OG image. Revisit video when a module is stable and popular enough to deserve one.

**Migrating the old ten now — no,** and you already said this. New modules go through the engine from Module 12 onward. The old ten stay exactly as they are, untouched, until the new format has proven itself over several modules. Then migrate or retire them deliberately. This is the single biggest scoping decision in the project and you made the right call.

---

## **9\. Blockers to clear before building**

| Item | Current | Needed | Cost |
| ----- | ----- | ----- | ----- |
| Vercel | Hobby | **Pro** | $20/mo |
| GitHub | Free, private repo | **Pro** | \~$4/mo |

**Vercel:** the fair-use policy restricts Hobby to non-commercial personal use, and defines commercial as any deployment producing financial gain for anyone involved in producing it. Operations Decoded is a commercial product. Separately, Hobby content may be used for model training under terms updated 2026-06-01 (there is an opt-out in team settings), and Hobby permits only one concurrent build — which will queue your previews the moment two PRs are open.

**GitHub:** protected branches and rulesets are available on private repositories only with Pro, Team or Enterprise. On Free with a private repo the API returns `403 Upgrade to GitHub Pro or make this repository public`. Without this there is no way to require CI to pass before merge — your quality gate would be a convention you could click past at 1am.

Roughly $24/month, against a $50–60 budget. Worth it: both are load-bearing, not conveniences.

---

## **10\. Build phases**

Each phase has a definition of done. Nothing starts until the previous one meets it.

### **Phase 0 — Foundations**

Upgrade Vercel to Pro and GitHub to Pro. Enable branch protection on `main`: require status checks, require a PR, no direct pushes. Set `kanban.auto_decompose: false` on od-cos. Read `constants.ts` and `types.ts` from the best existing module. **Done when:** a test PR cannot be merged with a failing check, and you have the existing content shape in front of you.

### **Phase 1 — The engine**

Write `module.schema.ts` (Zod). Build `components/module/` by extracting the shared components from the ten copies. Create the dynamic route `app/learn/[slug]/page.tsx` and `content/registry.json`. Port **one** existing module to JSON as proof and diff it against the live page. **Done when:** one module renders from JSON, is visually indistinguishable from the original, and `next build` passes. *This is the largest phase. Treat it as the project, not a step.*

### **Phase 2 — The new look**

Design the module visual language you actually want — the framer-motion scene vocabulary, the character treatment, the progress and scorecard design. Apply it to the engine, so every future module inherits it. **Done when:** the ported module looks like the product you want to sell.

### **Phase 3 — od-architect**

New Hermes profile. Its SOUL contains the schema, the step vocabulary, the teaching spine, and a worked example. Feed it Module 12's humanized narrative by hand; iterate on the SOUL until the output validates and reads well. **Done when:** it produces a schema-valid spec from a narrative with no human editing.

### **Phase 4 — od-verifier \+ CI**

New Hermes profile for scenario verification. In parallel, write the GitHub Actions workflow: schema, path allowlist, build, lint, registry integrity, number reconciliation, Playwright, Lighthouse, Telegram notify. **Done when:** a deliberately broken spec (wrong `calc` answer) is caught — by the agent, and independently by CI.

### **Phase 5 — Publish path**

Write `od-publish <slug>`: copies JSON and images into the repo, creates `module/<slug>`, commits, pushes, opens the PR with a templated description. **Done when:** one command takes a spec from `/root/od-content/` to an open PR with CI running.

### **Phase 6 — Module 12 end to end**

Chain the whole thing in Kanban: draft → review → humanize → architect → verify. Dispatch manually and watch every stage, exactly as you did for M15. **Done when:** Module 12 is live on operationsdecoded.com and you approved it once.

### **Phase 7 — Scale**

Modules 13, 14, 15 through the same chain. Turn autopilot back on only after two consecutive clean runs. **Done when:** three modules a week is routine.

### **Later**

Backend (auth, progress, community). Retire or migrate the old ten. Automate the publish step. The 16-post LinkedIn calendar, which reuses od-architect's pattern against a different output schema.

---

## **11\. Open items**

* **`constants.ts` / `types.ts` unread.** Phase 1's schema must be derived from what's really in there, not from this document's guess. This is the last discovery gap.  
* **Old modules stay live during all of this** — the engine must not break existing `app/learn/<slug>/` routes while the dynamic route is added alongside them.  
* **Character reuse** conflicts with your brand rule that every module gets a distinct company and cast. Decide before building a shared `characters.json`.  
* **od-cos has no continuity context.** It has never seen a module. Any "follow Module 12's structure" instruction has to be in the brief you send it.  
* **Reviewer and verifier are the same model family as the writer.** It has held up across M13–M15, but keep spot-checking arithmetic yourself rather than trusting a PASS.

