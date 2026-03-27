import type { StepConfig, GlossaryTerm, GameState } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "The Call",       doc: "Breakdown Report",      location: "Ryan's Office",  time: "Friday 4:32 PM",  icon: "📞" },
  { num: 2, label: "The Decision",   doc: "Procurement Choice",    location: "Ryan's Office",  time: "Friday 4:38 PM",  icon: "🚫" },
  { num: 3, label: "Emergency PO",   doc: "Verbal Auth EP-2024-009", location: "Phone with Victor", time: "Friday 4:41 PM", icon: "📋" },
  { num: 4, label: "Justification",  doc: "Single-Source Note",    location: "Ryan's Office",  time: "Friday 4:56 PM",  icon: "📝" },
  { num: 5, label: "The Pickup",     doc: "FastParts Invoice",      location: "FastParts Co.",  time: "Friday 5:18 PM",  icon: "🔧" },
  { num: 6, label: "The Audit",      doc: "Audit Folder",           location: "Ryan's Office",  time: "3 Weeks Later",   icon: "🔍" },
  { num: 7, label: "The Framework",  doc: "EPF Document",           location: "Conference Room", time: "Tuesday Debrief", icon: "🏗️" },
];

export const STEP_TIMES: Record<number, string> = {
  1: "4:32 PM",
  2: "4:38 PM",
  3: "4:41 PM",
  4: "4:56 PM",
  5: "5:18 PM",
  6: "3 Weeks Later",
  7: "Tuesday",
};

export const PROCUREMENT_CHOICES = [
  {
    id: "personal-card",
    label: "Let Helen buy it on her personal card",
    sublabel: "$4,200 · Fastest path · Sort paperwork Monday",
    icon: "💳",
    correct: false,
    feedback: "This bypasses every procurement control. No PO, no tax invoice in the company's name, no audit trail. When auditors ask why a $4,200 industrial part was purchased outside the system, the answer becomes 'the plant manager bought it on her personal card on a Friday afternoon.' That's not defensible — even if the intent was honest.",
  },
  {
    id: "emergency-po",
    label: "Issue an emergency PO with verbal authorization",
    sublabel: "Call Victor · Get auth · Buy with PO number",
    icon: "📋",
    correct: true,
    feedback: "Correct. An emergency PO preserves every control — authorization chain, spend visibility, audit trail, tax invoice in the company's name — while moving just as fast as a personal card purchase. Ryan had the part on Helen's dock in 80 minutes. The process didn't slow anything down.",
  },
  {
    id: "wait-monday",
    label: "Tell Helen to wait for Monday's normal cycle",
    sublabel: "Standard PO process · 3-5 business days",
    icon: "⏳",
    correct: false,
    feedback: "The Monday process would miss the deadline. A $600,000 order would fail delivery. Emergency procurement exists precisely for situations like this — where a genuine unforeseeable event demands urgent action. Defaulting to the standard cycle here isn't caution, it's avoidance.",
  },
];

export const EMERGENCY_SCENARIOS = [
  {
    id: "s1",
    description: "A hydraulic seal on the main packaging line fails unexpectedly at 4:30 PM Friday. No spare in stock. Part not on standard spares list. $600K order at risk.",
    classification: "genuine",
    explanation: "Unforeseeable failure, no reasonable way to have had the part on hand, material business risk. This is a genuine emergency.",
  },
  {
    id: "s2",
    description: "A department realises on Thursday they need speciality packaging materials by Monday. They forgot to order them three weeks ago.",
    classification: "planning-failure",
    explanation: "A foreseeable need neglected until it became urgent. This is poor planning wearing an emergency's clothes.",
  },
  {
    id: "s3",
    description: "A critical software licence expires overnight — IT didn't track the renewal date and the system is down at 8 AM Monday.",
    classification: "genuine",
    explanation: "While ideally renewals would be tracked, an overnight expiry with immediate business impact qualifies as an unforeseeable disruption requiring urgent action.",
  },
];

export const JUSTIFICATION_FIELDS = [
  {
    id: "emergency",
    question: "What was the emergency?",
    placeholder: "Describe the event that required immediate procurement action",
    correctKeywords: ["hartmann", "seal", "hydraulic", "failed", "packaging", "line"],
    hint: "Describe: what failed, when, and what business impact it created",
  },
  {
    id: "whyNoQuotes",
    question: "Why couldn't competitive quotes be obtained?",
    placeholder: "Explain why the standard quoting process was impractical",
    correctKeywords: ["time", "saturday", "deadline", "bradfield", "hours", "morning"],
    hint: "The delivery deadline made waiting for 3 quotes impossible",
  },
  {
    id: "whyVendor",
    question: "Why was FastParts selected?",
    placeholder: "State the specific reason this vendor was chosen",
    correctKeywords: ["stock", "available", "local", "only", "distributor", "confirmed"],
    hint: "They were the only local distributor with confirmed same-day stock",
  },
  {
    id: "authorization",
    question: "Who authorized the purchase?",
    placeholder: "Name, title, authorization reference",
    correctKeywords: ["victor", "laine", "ep-2024-009", "procurement", "head"],
    hint: "Include name, title, and the PO reference number",
  },
];

export const RECEIPT_ITEMS = [
  {
    id: "po-number",
    label: "PO number EP-2024-009 referenced on receipt",
    description: "The receipt must carry the PO number so it ties back to the authorized procurement record.",
    required: true,
  },
  {
    id: "company-name",
    label: "Receipt issued in the company's name (not Ryan's name)",
    description: "Tax invoices in an individual's name cannot be used for company tax reclaim and create personal liability.",
    required: true,
  },
  {
    id: "part-number",
    label: "Part number HDS-4420-R matches maintenance spec",
    description: "Physical part number on the box must match the specification. Wrong part = wasted purchase.",
    required: true,
  },
];

export const AUDIT_DOCUMENTS = [
  {
    id: "whatsapp",
    title: "Helen's WhatsApp Message",
    timestamp: "4:32 PM Friday",
    description: "Plant manager's original breakdown report with part number HDS-4420-R",
    icon: "💬",
    role: "Establishes the emergency — proof it happened and when",
  },
  {
    id: "victor-text",
    title: "Victor's Text Authorization",
    timestamp: "4:49 PM Friday",
    description: "Emergency PO EP-2024-009 authorized. Up to $5K. FastParts Co.",
    icon: "📱",
    role: "Proves verbal authorization was obtained before purchase",
  },
  {
    id: "justification",
    title: "Single-Source Justification Note",
    timestamp: "4:56 PM Friday",
    description: "Signed, time-stamped note explaining emergency, vendor selection, and authorization",
    icon: "📝",
    role: "Documents the reason for bypassing competitive bidding",
  },
  {
    id: "invoice",
    title: "FastParts Invoice",
    timestamp: "Friday 5:18 PM",
    description: "Tax invoice in company name, PO EP-2024-009 referenced, part HDS-4420-R, $4,200",
    icon: "🧾",
    role: "The financial record — company-name invoice with PO reference",
  },
  {
    id: "written-po",
    title: "Victor's Written PO Confirmation",
    timestamp: "Saturday AM",
    description: "Written follow-up confirming the verbal authorization from the night before",
    icon: "📧",
    role: "Converts verbal auth to formal written record within 24 hours",
  },
  {
    id: "delivery",
    title: "Helen's Delivery Confirmation",
    timestamp: "Saturday 8:02 AM",
    description: "Test cycle complete. Line back up. Full production resumes Sunday for Monday dispatch.",
    icon: "✅",
    role: "Confirms the part was used for its stated purpose",
  },
];

export const FRAMEWORK_ELEMENTS = [
  {
    id: "vendor-list",
    title: "Pre-Approved Emergency Vendor List",
    icon: "📋",
    description: "Six local distributors with critical maintenance parts, accessible outside business hours, company accounts pre-established",
    benefit: "When the next emergency comes, you call a vendor who already has your company on file — not a cold call at 5 PM Friday",
  },
  {
    id: "po-protocol",
    title: "Emergency PO Protocol",
    icon: "⚡",
    description: "Verbal authorization by designated approver, written confirmation within 24 hours, same PO number referenced throughout",
    benefit: "The non-negotiable line: no purchase can proceed without a PO number, even in an emergency",
  },
  {
    id: "justification-template",
    title: "Single-Source Justification Template",
    icon: "📝",
    description: "Fillable form: 4 questions, 1 page, 5 minutes — What was the emergency? Why no quotes? Why this vendor? Who authorized?",
    benefit: "If you can't answer all four questions, the purchase probably isn't a genuine emergency",
  },
  {
    id: "cultural-definition",
    title: "Emergency vs. Planning Failure Policy",
    icon: "🎯",
    description: "Formal definition sent to all department heads: genuine emergency = unforeseeable event. Planning failure = neglected need that became urgent.",
    benefit: "The emergency channel is monitored for frequency. Same department triggering repeated emergencies = a planning conversation, not more exceptions",
  },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Emergency PO", definition: "A purchase order issued outside the normal procurement cycle to address a genuine, unforeseeable urgent need. Requires verbal authorization with written confirmation within 24 hours.", unlocked: false },
  { term: "Maverick Spending", definition: "Purchases made outside approved procurement channels, bypassing controls such as purchase orders, approved vendor lists, and approval chains. Creates audit risk and enables fraud.", unlocked: false },
  { term: "Single-Source Justification", definition: "Documentation explaining why competitive bidding was impractical for a specific purchase. Must answer: what was the emergency, why no quotes, why this vendor, who authorized.", unlocked: false },
  { term: "Verbal Authorization", definition: "Oral approval for a procurement action, typically followed by written confirmation within an agreed timeframe (commonly 24 hours). The PO number must be established at the time of verbal auth.", unlocked: false },
  { term: "Audit Trail", definition: "A chronological set of documents and approvals that enables complete reconstruction of a procurement decision. The six documents in the FastParts folder are a model audit trail.", unlocked: false },
  { term: "Net-15 Terms", definition: "Payment due 15 days from invoice date. A vendor agreeing to Net-15 on an emergency purchase enables the company to buy on a PO rather than paying at point of sale.", unlocked: false },
  { term: "Vendor Concentration Risk", definition: "Financial and compliance exposure from over-reliance on a single unapproved supplier. The competitor case: one vendor receiving more annually than contracted suppliers — flagged by concentration analysis.", unlocked: false },
  { term: "Materiality Threshold", definition: "The minimum spend level that triggers mandatory financial review. Individual amounts below the threshold often pass unchecked — enabling gradual fraud through repeated small purchases.", unlocked: false },
  { term: "Procurement Fraud", definition: "Manipulation of the buying process for personal gain, most commonly enabled by absent controls. The competitor case: $87,000 across 23 transactions, vendor owned by a relative.", unlocked: false },
  { term: "Emergency Procurement Framework", definition: "A four-element policy: pre-approved vendor list, emergency PO protocol, single-source justification template, and cultural definition of genuine emergency vs. planning failure.", unlocked: false },
];

export const INITIAL_STATE: GameState = {
  procurementDecision: "",
  emergencyClassification: "",
  justificationScore: 0,
  receiptScore: 0,
  auditComplete: false,
  frameworkScore: 0,
  quizScore: 0,
};

export const QUIZ_DATA = [
  {
    question: "Ryan stops Helen from using her personal card. What is the primary procurement risk he's protecting against?",
    options: [
      { label: "Personal cards have insufficient spending limits", value: "limit" },
      { label: "No purchase order means no audit trail, no tax invoice in the company's name, and no approval chain", value: "control" },
      { label: "FastParts only accepts corporate payment methods", value: "vendor" },
      { label: "The amount exceeds Ryan's individual authorization limit", value: "auth" },
    ],
    correctValue: "control",
    explanation: "A personal card purchase creates no PO, no company-name tax invoice (losing the VAT/tax reclaim), no approval chain, and no spend visibility. When the auditor asks, there's nothing to show — and that's the problem.",
  },
  {
    question: "Victor asks: 'Is this a genuine emergency, or a failure to plan reclassified as one?' Why does this question matter?",
    options: [
      { label: "It determines who pays for the part", value: "cost" },
      { label: "It gates access to emergency procedures — only genuine emergencies qualify", value: "gate" },
      { label: "It decides how quickly FastParts will respond", value: "speed" },
      { label: "It affects the warranty on the purchased part", value: "warranty" },
    ],
    correctValue: "gate",
    explanation: "If every late requisition qualifies as an 'emergency', the emergency channel gets overused. Victor's question is the control that keeps the process honest — and trains the organization to plan properly because they know they can't bypass procurement by calling things emergencies.",
  },
  {
    question: "Diane's audit review of EP-2024-009 took less than one day. What made this possible?",
    options: [
      { label: "The purchase amount was below the materiality threshold", value: "amount" },
      { label: "Victor called Diane personally to explain the situation", value: "call" },
      { label: "Six time-stamped documents in one folder told a complete, consistent, chronological story", value: "docs" },
      { label: "FastParts was already on the approved vendor list", value: "vendor" },
    ],
    correctValue: "docs",
    explanation: "Twelve minutes of documentation on Friday afternoon produced six consistent, time-stamped records. When Diane asked for support, Ryan sent the folder. The story told itself — and it became a reference template for future emergency procurement documentation.",
  },
];
