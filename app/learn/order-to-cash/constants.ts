import type { StepConfig, GlossaryTerm, GameState } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "The PO Arrives",  doc: "Sales Order SO-7841",         location: "Nina's Office",   time: "Monday AM",       icon: "📄" },
  { num: 2, label: "ATP Check",       doc: "Capacity Report",              location: "Sam's Office",    time: "Monday AM",       icon: "📊" },
  { num: 3, label: "Order Confirmed", doc: "Order Acknowledgement",        location: "Nina's Office",   time: "Monday PM",       icon: "✅" },
  { num: 4, label: "Dispatch & QC",   doc: "Delivery Challan DC-7841-01",  location: "Dispatch Floor",  time: "Week 2 Thursday", icon: "🚛" },
  { num: 5, label: "Invoicing",       doc: "Invoice INV-2024-3317",        location: "Finance Office",  time: "Week 2 Friday",   icon: "🧾" },
  { num: 6, label: "AR Aging",        doc: "AR Aging Report",              location: "Finance Office",  time: "Week 10",         icon: "⏰" },
  { num: 7, label: "The Debrief",     doc: "Credit Terms Adjustment",      location: "Nina's Office",   time: "Week 11",         icon: "🏦" },
];

export const STEP_TIMES: Record<number, string> = {
  1: "Monday AM",
  2: "Monday AM",
  3: "Monday PM",
  4: "Wk 2 Thu",
  5: "Wk 2 Fri",
  6: "Week 10",
  7: "Week 11",
};

export const ATP_BATCHES = [
  {
    id: "batch1",
    label: "Batch 1",
    qty: 17000,
    deadline: "End of Week 2",
    samReport: "Corrugating capacity confirmed. Print line open Tue–Thu next week. Kraft liner in stock. Pantone inks available.",
    correctStatus: "confirm" as const,
    statusOptions: ["confirm", "conditional", "at-risk"],
    explanation: "All resources available, no scheduling conflicts. Full confidence to confirm.",
  },
  {
    id: "batch2",
    label: "Batch 2",
    qty: 17000,
    deadline: "End of Week 4",
    samReport: "Maintenance window on corrugator Week 3 Monday–Tuesday. Starting Batch 2 on Wednesday, clearable by Friday Week 4. Tight but feasible.",
    correctStatus: "conditional" as const,
    statusOptions: ["confirm", "conditional", "at-risk"],
    explanation: "Feasible but depends on maintenance finishing on schedule. Should be flagged as conditional — not at full risk but not fully clean either.",
  },
  {
    id: "batch3",
    label: "Batch 3",
    qty: 16000,
    deadline: "End of Week 6",
    samReport: "Greenline Foods order on same print line in Week 5 — already confirmed. No buffer. If Batch 2 or Greenline slips, Batch 3 is at risk. Safe case is end of Week 7.",
    correctStatus: "at-risk" as const,
    statusOptions: ["confirm", "conditional", "at-risk"],
    explanation: "Two competing orders, no buffer. End of Week 6 is best case only. This must be flagged as at-risk so Nina can negotiate a buffer with the customer before confirming.",
  },
];

export const ACKNOWLEDGEMENT_OPTIONS = [
  {
    id: "opt-a",
    text: "Delivery by end of week six for all three batches, as requested.",
    correct: false,
    feedback: "This ignores the capacity risk Sam identified for Batch 3. Confirming end of Week 6 without caveat locks in a commitment the production team can't guarantee.",
  },
  {
    id: "opt-b",
    text: "Batch 3 delivery by end of week six, with extension to Wednesday of week seven if required, subject to advance notice of any scheduling constraint.",
    correct: true,
    feedback: "Correct. This is exactly what Nina negotiated with Brendan — an honest acknowledgement of the risk with a defined fallback window. It protects the company without surprising the customer.",
  },
  {
    id: "opt-c",
    text: "Batch 3 delivery cannot be confirmed at this time. We will advise closer to the date.",
    correct: false,
    feedback: "Too vague. The customer needs to plan their warehouse. 'We'll advise' is not a commitment — it's avoidance. The goal is to give a realistic range, not withhold the date entirely.",
  },
];

export const QUALITY_CHOICES = [
  {
    id: "ship-all",
    label: "Ship all 17,000 units including the 200 defective ones",
    sublabel: "Fastest dispatch · Customer can sort it on receipt",
    icon: "📦",
    correct: false,
    feedback: "Shipping known defects is never the right call. Meridian Commerce's packaging is the first physical touchpoint their customers have with the brand — a misaligned logo is a brand quality failure they'll trace back to you. And returning defective goods costs everyone more than replacing them before dispatch.",
  },
  {
    id: "pull-and-notify",
    label: "Pull the 200 defective units, notify Brendan, ship 16,800 today",
    sublabel: "Partial dispatch · Transparent communication · Replace in Batch 2",
    icon: "✅",
    correct: true,
    feedback: "Correct. Catch the defect, pull it, tell the customer proactively, and commit to replacing the units in the next batch. Brendan's exact words: 'I'd rather receive 16,800 correct than 17,000 with a defect I have to sort out on my end.' This is the professional standard.",
  },
  {
    id: "delay-batch",
    label: "Hold the entire Batch 1 shipment until the 200 are reprinted",
    sublabel: "No partial dispatch · Full quantity shipped together",
    icon: "⏳",
    correct: false,
    feedback: "Holding 16,800 good units hostage to 200 bad ones causes an unnecessary delay and disrupts the customer's warehouse intake planning. The defects are a small fraction of the batch — the right move is a partial dispatch with transparent communication, not a full hold.",
  },
];

export const INVOICE_FIELDS = [
  {
    id: "po-ref",
    label: "Customer PO Reference",
    correctValue: "MER-2024-1183",
    options: ["MER-2024-1183", "SO-7841", "INV-2024-3317", "DC-7841-01"],
    hint: "Brendan's AP team will match this against their own purchase order before approving payment.",
  },
  {
    id: "so-ref",
    label: "Internal Sales Order Reference",
    correctValue: "SO-7841",
    options: ["MER-2024-1183", "SO-7841", "INV-2024-3317", "DC-7841-01"],
    hint: "Your company's internal tracking ID — connects the invoice back to the original order.",
  },
  {
    id: "challan-ref",
    label: "Delivery Challan Reference",
    correctValue: "DC-7841-01",
    options: ["MER-2024-1183", "SO-7841", "INV-2024-3317", "DC-7841-01"],
    hint: "Proves the goods actually shipped. Without this link, the invoice is unsubstantiated.",
  },
  {
    id: "quantity",
    label: "Quantity Invoiced (Batch 1)",
    correctValue: "16,800 units",
    options: ["17,000 units", "16,800 units", "50,000 units", "16,000 units"],
    hint: "Invoice only what was actually shipped — the 200 defective units were pulled.",
  },
  {
    id: "amount",
    label: "Invoice Total",
    correctValue: "$58,800",
    options: ["$59,500", "$58,800", "$60,200", "$56,000"],
    hint: "16,800 units × $3.50 = $58,800. Not $59,500 (that would be 17,000 × $3.50).",
  },
];

export const AR_ESCALATION_STEPS = [
  {
    day: 1,
    situation: "Invoice INV-2024-3488 ($56,000) is one day overdue. No payment received. No prior contact from Meridian's AP team.",
    options: [
      { id: "ignore", label: "Wait another week before doing anything" },
      { id: "reminder", label: "Send a polite payment reminder to AP" },
      { id: "legal", label: "Issue a formal legal demand immediately" },
      { id: "carlos", label: "Call Carlos to escalate right away" },
    ],
    correctId: "reminder",
    explanation: "Day 1 is too early for escalation. A polite, templated reminder to the AP department is the right first step — professional, documented, and proportionate.",
  },
  {
    day: 7,
    situation: "Seven days overdue. The Day 1 reminder got no response. Grace left a voicemail with the AP contact — no callback.",
    options: [
      { id: "wait", label: "Send another email reminder and wait" },
      { id: "phone", label: "Call the AP contact directly again, leave detailed message" },
      { id: "formal", label: "Escalate to formal overdue notice" },
      { id: "carlos", label: "Escalate to Carlos now" },
    ],
    correctId: "phone",
    explanation: "A second direct call at Day 7 is appropriate — more urgent than an email, but still not a formal escalation. The goal is to make contact and get a commitment, not to threaten.",
  },
  {
    day: 15,
    situation: "Fifteen days overdue. Two reminders, one voicemail, zero responses from Meridian's AP. Working capital impact: ~$336 in carrying cost. Grace has flagged it to Nina.",
    options: [
      { id: "reminder", label: "Send another reminder email" },
      { id: "formal", label: "Send formal overdue notice on company letterhead, copy Nina" },
      { id: "carlos", label: "Escalate to Carlos before sending formal notice" },
      { id: "cfoCopy", label: "Send formal notice and copy CFO immediately" },
    ],
    correctId: "formal",
    explanation: "Fifteen days with no response warrants a formal overdue notice — on letterhead, firm in tone, referencing the possibility of credit term review. Copy Nina but not the CFO yet — that's Day 21.",
  },
  {
    day: 18,
    situation: "Day 18. Formal notice sent. Still no payment or confirmation from Meridian AP. Grace's cash forecast is now affected. CFO escalation threshold is Day 21.",
    options: [
      { id: "wait", label: "Wait for Day 21 before any further action" },
      { id: "carlos", label: "Escalate to Carlos — his client, his call to make" },
      { id: "cfoDirect", label: "Go directly to CFO, skip Carlos" },
      { id: "legal", label: "Issue a formal legal payment demand" },
    ],
    correctId: "carlos",
    explanation: "Day 18 is exactly the right moment to bring in the account owner — Carlos. He has the relationship. He can call Brendan directly and resolve what has become a relationship issue, not just a finance issue. CFO escalation follows at Day 21 if unresolved.",
  },
];

export const CREDIT_TERMS_OPTIONS = [
  {
    id: "same-terms",
    label: "Keep Net-30 — Brendan promised it won't happen again",
    correct: false,
    feedback: "A promise without a mechanism changes nothing. The payment was 22 days late because of a process failure inside Meridian's AP system, not bad faith. The same process will produce the same result unless something structural changes.",
  },
  {
    id: "net-20-advance",
    label: "Net-20 on all invoices + 50% advance payment on Batch 1",
    correct: true,
    feedback: "This is exactly what Carlos negotiated. Net-20 shortens the payment window on all invoices. The 50% advance on Batch 1 reduces working capital exposure before a single box is produced. Both measures address the root cause — timing mismatch between spend and receipt.",
  },
  {
    id: "full-advance",
    label: "Require 100% advance payment on the entire order before production starts",
    correct: false,
    feedback: "This would likely lose the account — it's punitive for a single late payment that turned out to be an internal error. Escalation should be proportionate. The goal is better terms, not a test of the relationship.",
  },
  {
    id: "penalty-clause",
    label: "Add a 2% per month late payment penalty clause to the contract",
    correct: false,
    feedback: "A penalty clause is a legal protection, not a cash flow solution — you still don't get paid faster, you just get paid more eventually. And enforcing it damages the relationship. Better terms upfront are more effective than penalties downstream.",
  },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Order-to-Cash (O2C)", definition: "The end-to-end process from receiving a customer's purchase order to collecting the final payment. Covers sales order, production, dispatch, invoicing, and AR collection.", unlocked: false },
  { term: "Sales Order", definition: "The seller's internal record triggered by a customer's PO. It authorises production, schedules delivery, and drives all downstream documents — challan, invoice, AR entry.", unlocked: false },
  { term: "Available to Promise (ATP)", definition: "A production planning check that confirms whether capacity, materials, and scheduling allow a committed delivery date. Must be done before order confirmation, not after.", unlocked: false },
  { term: "Order Acknowledgement", definition: "The seller's formal written response to a customer PO — confirming specifications, pricing, delivery schedule, and terms. Once signed by both parties, it is the mutual reference for the entire order.", unlocked: false },
  { term: "Delivery Challan", definition: "A document that travels with the shipped goods. Lists sales order number, batch, quantity, item description, and delivery address. Does not include pricing — that is the invoice's job.", unlocked: false },
  { term: "Accounts Receivable (AR)", definition: "Money owed to the company by customers for goods or services already delivered. A current asset on the balance sheet — but only valuable when it converts to cash.", unlocked: false },
  { term: "AR Aging Report", definition: "A report listing outstanding invoices by customer, grouped by days overdue: Current, 1–30, 31–60, 61–90, 90+. Grace's primary tool for monitoring collections and triggering escalation.", unlocked: false },
  { term: "Working Capital", definition: "Current assets minus current liabilities — the cash available for day-to-day operations. Every day a receivable stays unpaid, working capital shrinks and the business's operational flexibility narrows.", unlocked: false },
  { term: "Credit Terms", definition: "The payment conditions offered to a customer: timing (Net-30), advances, penalties. Adjusted based on payment history — a customer who pays late gets shorter terms or advance requirements on the next order.", unlocked: false },
  { term: "Cash-to-Delivery Gap", definition: "The time between spending cash (raw materials, labour, freight) and receiving payment from the customer. The fundamental tension of the sell side — you spend first and get paid later.", unlocked: false },
];

export const INITIAL_STATE: GameState = {
  salesOrderBuilt: false,
  atpScore: 0,
  acknowledgementCorrect: false,
  qualityDecision: "",
  invoiceScore: 0,
  arEscalationScore: 0,
  creditTermsCorrect: false,
  quizScore: 0,
};

export const QUIZ_DATA = [
  {
    question: "Why does Nina check Available to Promise (ATP) with Sam before confirming the sales order?",
    options: [
      { label: "To get a discount on the production run", value: "discount" },
      { label: "To confirm the company can actually deliver what the sales team committed to", value: "confirm" },
      { label: "Because Carlos always gets the specs wrong", value: "carlos" },
      { label: "To increase the quoted price based on capacity constraints", value: "price" },
    ],
    correctValue: "confirm",
    explanation: "ATP separates order confirmation from order fiction. Confirming before checking capacity means making commitments based on sales targets, not production reality. When those diverge, the sell side loses twice: once in the missed delivery, again in lost trust.",
  },
  {
    question: "Grace structures every invoice with three reference numbers. Which combination is correct?",
    options: [
      { label: "Invoice number, customer name, and payment due date", value: "basic" },
      { label: "Customer PO number, internal Sales Order number, and Delivery Challan number", value: "triple" },
      { label: "Customer PO number, invoice number, and bank account details", value: "partial" },
      { label: "Production batch number, shipping carrier reference, and unit price", value: "wrong" },
    ],
    correctValue: "triple",
    explanation: "The three references — customer PO, internal SO, and delivery challan — link the invoice back to the authorised order AND prove the goods shipped. Brendan's AP team matches against their PO. Missing any reference gives them grounds to hold payment for 'clarification'.",
  },
  {
    question: "Grace adjusts Meridian's credit score from A to B+ after the late payment. What does this adjustment trigger for the next order?",
    options: [
      { label: "The order is declined until three clean payments are made", value: "decline" },
      { label: "A 50% advance payment requirement before production starts", value: "advance" },
      { label: "An automatic legal payment demand for any future lateness", value: "legal" },
      { label: "A 5% price premium on all future orders", value: "premium" },
    ],
    correctValue: "advance",
    explanation: "The credit downgrade triggers a 50% advance on the next order — reducing working capital exposure by half before a single unit is produced. It's not punitive; it's protective. And it's reversible: three clean payments and standard terms can be reinstated.",
  },
];
