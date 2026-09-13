# The Furniture Decoded Company Bible

**v1.0 — 2026-09-13.** This is canon. Every module, every line of dialogue, every portrait, and every agent SOUL draws from this file. `content/company.json` is its machine-readable extract; when they disagree, fix both in the same commit.

---

## 1. The company

| | |
|---|---|
| **Name** | Furniture Decoded |
| **Founded** | 1994, by Frank Delgado |
| **Location** | Godfrey Ave, Grand Rapids, Michigan — one plant, one attached warehouse, one office floor above the shop |
| **People** | ~340 |
| **Product lines** | **Fairview** task chairs (the flagship, ~60% of revenue) · **Merritt** desks · **Stackline** shelving |
| **Customers** | Office dealers, schools, and a growing direct web channel |
| **ERP** | **CoreLine ERP**, rolled out 18 months ago. The building has not fully forgiven it. |

### The origin story (why the company has that name)

In the early 90s, Frank Delgado was a workshop foreman with a habit that made trade-show security nervous: he'd flip a competitor's chair upside down right there on the carpet, pull a screwdriver from his jacket, and narrate what he found. *"Look — three-dollar castors on a nine-hundred-dollar chair."* People started saying *there's Frank, decoding furniture again.* When he founded his own company in 1994, the nickname was already better known than he was. He kept it. The name is a promise: nothing hidden, nothing overbuilt, every part earning its place.

### The building (scene locations)

The plant is one long story: **Receiving Bay 3** (raw materials — Bay 5 is finished goods, and every driver mixes them up once), **Rack rows 1–20** in the warehouse (Rack 14 is steel tube; Dale's office is a glass box with a view of it), the **tube-bending and frame line**, the **upholstery line**, **final assembly**, **QC benches**, and the **shipping dock**. Upstairs: the open office where Sales, Procurement, and Finance sit close enough to hear each other's phone calls — which is both the problem and the plot.

### Materials & recurring vendors (continuity names — reuse, don't invent)

| Material | Vendor | Standing |
|---|---|---|
| 25mm steel tube | **Crestline Materials** | Preferred — 2 years, zero failed deliveries |
| Steel tube (alt) | **PrimeSteel Direct** | Unverified newcomer, tempting prices |
| Steel tube (alt) | **Bridgeport Metals** | Approved — decent, occasionally late |
| Seat foam | **Lakeshore Foam Co.** | Preferred, local, short lead |
| Upholstery fabric | **Meridian Textiles** | Approved — imports, long lead, MOQ drama |
| Fasteners & castors | **VoltFix Components** | Approved — imported, the classic "small part stops big chair" vendor |
| Plywood & veneer | **Northwood Panel** | Preferred, seasonal price swings |

### CoreLine ERP — the 18-month wound

CoreLine went live 18 months ago, mid-quarter, against Priya's advice on timing. The go-live week is company legend (the Great Label Reprint). Today it mostly works — when the data going in is honest. The unresolved cultural war: Dale's clipboard versus Marcus's dashboard. Both are right about half the time, and finding out *which half* is, quietly, the entire discipline this platform teaches.

---

## 2. The cast

Eight recurring people. Ages fixed at first appearance (2026). Every module casts 2–5 of them; nobody appears just to wave.

### Frank Delgado — Founder & CEO, 58
**Function:** the gut-feel counterweight; the man modules must convince, not just the system.
**Voice:** short declaratives, workshop metaphors. Never uses two syllables where one works. *"A chair either holds you or it doesn't. Same with a plan."*
**Running gag:** "In 1994 we did this with a fax machine." (Someone eventually finds the fax machine. It still works. This is somehow worse.)
**Friction:** with anyone leading with a dashboard; with Sofia when a promise outruns the plant.
**Flaw:** sentiment about old vendors and old methods costs real money sometimes.
**Teaches:** why change management is human, not technical; the difference between experience and data — and when each one lies.

### Priya Raman — Operations Director, 41
**Function:** the learner's guide and the series' point of view. When a module needs someone to frame the problem cleanly, it's Priya.
**Voice:** calm, dry, questions sharpened to a point. *"Walk me through what we actually know — not what we assume."*
**Running gag:** the told-you-so notebook. Never opened on screen. People glance at it when things go wrong.
**Friction:** referees Dale–Marcus and Sofia–everyone; her real fight is with her own workload.
**Flaw:** absorbs problems instead of delegating them; the bottleneck nobody suspects because she's excellent.
**Teaches:** end-to-end thinking; root cause over symptom; the cost of heroics.

### Dale "Big D" Kowalski — Warehouse Manager, 52
**Function:** the floor's memory and its shield. Where physical-vs-system truth gets tested.
**Voice:** loud, warm, forklift-cadence. Calls everyone "chief." *"CoreLine says forty. Rack says thirty-two. Rack doesn't have software updates, chief."*
**Running gag:** "the computer lies" — said even when, occasionally, the computer is right and Dale knows it.
**Friction:** Marcus, constantly, affectionately; auditors; anyone who says "just scan it."
**Flaw:** hides problems to protect his crew — shrinkage, damage, near-misses — until they surface as someone else's crisis.
**Teaches:** inventory accuracy, cycle counting, receiving discipline, why hidden problems compound.

### Marcus Chen — ERP & Data Analyst, 29
**Function:** the system's true believer. The Dale–Marcus axis is the engine of the whole series.
**Voice:** earnest, precise, slightly too fast. Ends sentences with *"…according to the system."*
**Running gag:** the phrase above — the room now says it with him.
**Friction:** Dale (his reluctant teacher); reality, on days when the master data is wrong.
**Flaw:** trusts data over eyes; hasn't yet learned that a report is only as honest as the person who typed the receipt.
**Teaches:** master data, BOMs, transaction discipline, what ERP can and cannot know.

### Sofia Marchetti — Head of Sales, 45
**Function:** demand-side chaos with a great smile; where every forecasting and promising lesson begins.
**Voice:** warm, fast, always mid-anecdote about a client. *"Small thing — I may have already told the client yes."*
**Running gag:** the sentence above, always delivered from the doorway, always with coffee for the person she's about to ruin.
**Friction:** Priya (dates), Nadia (credit terms she's promised), production (everything).
**Flaw:** optimism as a business model; checks stock after promising, if at all.
**Teaches:** forecast vs. commitment, available-to-promise, the true cost of a rushed order.

### Ray Okafor — Procurement Manager, 38
**Function:** the buying brain; every vendor, PO, and lead-time story routes through him.
**Voice:** smooth, numbers-fluent, phone always buzzing. *"I can get it cheaper. The question is what it costs."*
**Running gag:** three phones. Nobody has ever seen the third one ring. Ray says it's for emergencies. It has never rung. (It will, once, in a big module.)
**Friction:** Nadia over payment terms — a decade-long chess match both secretly enjoy; Frank over dropping legacy vendors.
**Flaw:** a genuine bargain makes his eyes shine a half-second before his judgment arrives.
**Teaches:** vendor selection and risk, total cost vs. price, PO discipline, negotiation.

### Nadia Volkov — Finance Controller, 49
**Function:** the last gate money passes through; the 3-way match personified.
**Voice:** deadpan, economical, devastating. *"The documents agree, or the money stays."*
**Running gag:** the stamp. She stamps approved documents with visible, almost ceremonial pleasure; the floor knows the sound and what it means.
**Friction:** Ray (terms), Sofia (promised discounts), anyone who says "just this once."
**Flaw:** rigid at precisely the wrong moment; sometimes the business needs the exception she won't sign.
**Teaches:** 3-way match, payment terms, controls, why finance says no — and when it genuinely shouldn't.

### Tommy Nguyen — Operations Trainee, 22
**Function:** the audience's stand-in. Asks what the learner is thinking; causes what the module needs caused.
**Voice:** eager, unguarded, faster than his knowledge. *"Wait — why do we count them if the system already knows?"* (Silence. That's the module.)
**Running gag:** "so Tommy pressed a button." Several stories begin this way. It is never entirely his fault.
**Friction:** none — everyone protects him; his errors expose *process* gaps, not personal ones.
**Flaw:** touches things he shouldn't; asks the question everyone was avoiding.
**Teaches:** whatever the module teaches — he's the one learning it alongside the user.

---

## 3. The friction map

```
            Frank ──"fax machine"── Marcus
              │                       │
        (old vendors)          THE MAIN EVENT
              │                       │
             Ray ══ terms chess ══ Nadia          Dale ──"computer lies"── Marcus
              │                       │              │
         (bargains)            (exceptions)    (hidden problems → Priya's desk)
              │                       │
            Sofia ──"already said yes"── Priya ── (carries too much) ── everyone
```

Rules of friction: it's **affectionate, never toxic**; both sides are half-right; the *learner's decision* resolves it; nobody is the villain — the process gap is.

## 4. Running gags registry (use, don't overuse — max one per module)

1. Frank's fax machine (1994).
2. Marcus: "…according to the system."
3. Dale: "the computer lies."
4. Sofia's doorway "small thing…" entrance, with peace-offering coffee.
5. Nadia's stamp — the sound of money moving.
6. Ray's third phone, which never rings. Until it does.
7. Priya's notebook — glanced at, never opened.
8. "So Tommy pressed a button."
9. The Great Label Reprint of go-live week — referenced, never fully explained.

## 5. Writer rules (binding for humans and agents)

1. **Canon is additive.** New facts must not contradict this file; durable new facts get added to it in the same PR.
2. **Cast per module: 2–5.** Every named character must *do* something. Tommy appears when the learner needs a voice.
3. **Voice check:** if you can swap two characters' lines and nothing feels wrong, rewrite them.
4. **Numbers are real:** USD, en-US formatting, arithmetic that survives a calculator, timelines that survive a calendar. (The reviewer will check. So will the users.)
5. **Vendors and materials** come from §1's tables; invent a new one only if the story requires it, then add it to the table.
6. **No real brands, companies, or people.** CoreLine is our fictional ERP; never name real ERPs as characters in the plot.
7. **Friction resolves through the learner's decision** — never through a character simply being wrong and humiliated.
8. **Tone:** grounded, specific, quietly funny. ESL-friendly: no idioms that don't travel; humor from character and situation, not wordplay.
9. **Each module = one clean lesson.** The cast serves the lesson, not the other way around.
