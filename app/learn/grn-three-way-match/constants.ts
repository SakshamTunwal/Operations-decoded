import type { GlossaryTerm, GameState } from "./types";

export interface StepConfig {
  num: number;
  label: string;
  location: string;
  time: string;
  icon: string;
}

export const STEPS: StepConfig[] = [
  { num: 1, label: "The Brief",     location: "Clara's Office",    time: "Tuesday, 2:15pm",       icon: "🏢" },
  { num: 2, label: "Build PO",      location: "Neil's Desk",       time: "Tuesday, 3:30pm",       icon: "📄" },
  { num: 3, label: "Delivery",      location: "Receiving Dock",    time: "Thursday, 8:40am",      icon: "🚚" },
  { num: 4, label: "Mismatch",      location: "Warehouse Bay",     time: "Thursday, 10:47am",     icon: "⚠️" },
  { num: 5, label: "GRN & Dispute", location: "Neil's Office",     time: "Thursday, 11:00am",     icon: "📋" },
  { num: 6, label: "3-Way Match",   location: "Finance Dept",      time: "Thursday, 11:15am",     icon: "💰" },
  { num: 7, label: "Resolution",    location: "All Locations",     time: "Following Week",        icon: "✅" },
];

export const DEADLINE_BY_STEP: Record<number, number | null> = {
  1: 21, 2: 19, 3: 9, 4: 9, 5: 9, 6: 9, 7: null,
};

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  {
    term: "Goods Receipt Note (GRN)",
    definition: "A warehouse document confirming what was physically received and accepted. The GRN reflects reality — not the delivery note, not the invoice. Otto's GRN said 138 accepted, which is what mattered for payment.",
    unlocked: false,
  },
  {
    term: "3-Way Match",
    definition: "Comparing PO (what you agreed to buy), GRN (what you actually received), and Invoice (what the vendor wants to be paid). All three must agree on quantity, specification, and price before payment releases.",
    unlocked: false,
  },
  {
    term: "Credit Note",
    definition: "A vendor-issued document that reduces an outstanding invoice. CoreTech issued CT-CN-4417 for $8,220, reducing the $102,750 invoice to $94,530 — the value of what was actually accepted.",
    unlocked: false,
  },
  {
    term: "Configuration Code",
    definition: "A unique identifier for an exact product specification. CT-T14-i7-16-512-W11P means: T14 model, Intel i7, 16GB RAM, 512GB SSD, Windows 11 Pro. One digit different is a completely different machine.",
    unlocked: false,
  },
  {
    term: "Quarantine Area",
    definition: "A designated holding zone in the warehouse for rejected or disputed goods. Segregating rejected units (dock bay 4B) prevents them from accidentally entering inventory and creating downstream problems.",
    unlocked: false,
  },
  {
    term: "FOB Destination",
    definition: "Shipping terms meaning the vendor retains risk until goods reach the buyer's location. Any damage or loss in transit is the vendor's problem. The buyer only accepts risk once the goods arrive and are inspected.",
    unlocked: false,
  },
  {
    term: "Partial Payment",
    definition: "Releasing payment only for the quantity and value of goods accepted. Paying $94,530 for 138 units while holding $8,220 pending replacement keeps financial pressure on the vendor to resolve the issue.",
    unlocked: false,
  },
  {
    term: "Dispute Documentation",
    definition: "A formal written record of a supplier discrepancy — what was ordered, what arrived, what was wrong, what was agreed to fix it. Verbal agreements with vendors are worth nothing without documentation.",
    unlocked: false,
  },
];

export const PO_FIELDS = [
  { key: "vendor",   label: "Vendor",         placeholder: "CoreTech Supplies",            correct: "CoreTech Supplies",            locked: true  },
  { key: "config",   label: "Configuration",  placeholder: "Select config code…",          correct: "CT-T14-i7-16-512-W11P",        locked: false, isSelect: true },
  { key: "qty",      label: "Quantity",        placeholder: "e.g. 150",                     correct: "150",                          locked: false },
  { key: "price",    label: "Unit Price",      placeholder: "e.g. $685.00",                 correct: "$685.00",                      locked: true  },
  { key: "delivery", label: "Delivery Terms",  placeholder: "FOB Destination, 12 biz days", correct: "FOB Destination, 12 biz days", locked: true  },
  { key: "payment",  label: "Payment Terms",   placeholder: "Net-30",                       correct: "Net-30",                       locked: true  },
];

export const CONFIG_OPTIONS = [
  { value: "CT-T14-i5-8-256-W11H",  label: "CT-T14-i5-8-256-W11H  —  i5 / 8GB / 256GB / Win11 Home" },
  { value: "CT-T14-i5-8-256-W11P",  label: "CT-T14-i5-8-256-W11P  —  i5 / 8GB / 256GB / Win11 Pro" },
  { value: "CT-T14-i7-16-512-W11P", label: "CT-T14-i7-16-512-W11P  —  i7 / 16GB / 512GB / Win11 Pro  ✓" },
  { value: "CT-T14-i7-32-1TB-W11P", label: "CT-T14-i7-32-1TB-W11P  —  i7 / 32GB / 1TB / Win11 Pro" },
];

export const DISPUTE_OPTIONS = [
  {
    key: "aggressive",
    label: "Demand immediate replacement or cancel the order",
    sub: '"This is unacceptable. Send replacements today or we cancel."',
    outcome: "bad",
    response:
      "Stefan goes defensive. He promises to escalate but gives no timeline. The conversation ends without a firm commitment.",
  },
  {
    key: "factual",
    label: "State facts clearly, ask for a firm resolution timeline",
    sub: '"We have 138 correct units and 12 wrong ones. I need replacements in 3 days and a credit note for the 12 rejected units."',
    outcome: "good",
    response:
      "Stefan acknowledges the pick error immediately and commits: replacement shipment in 3 business days, credit note by EOD tomorrow, return pickup at their cost.",
  },
  {
    key: "passive",
    label: "Ask them to investigate and get back to you",
    sub: '"Let me know what you find out and we can figure out next steps."',
    outcome: "neutral",
    response:
      "Stefan promises to look into it. He calls back hours later with a resolution, but the delay costs half a day of urgency.",
  },
];

export const THREE_WAY_DATA = {
  po:      { qty: 150, spec: "CT-T14-i7-16-512-W11P", unit: 685, total: 102750 },
  grn:     { accepted: 138, rejected: 12, spec: "138 × CT-T14-i7, 12 × CT-T14-i5" },
  invoice: { qty: 150, spec: "CT-T14-i7-16-512-W11P", unit: 685, total: 102750 },
  creditNote: { qty: 12, amount: 8220 },
  netPayable: 94530,
};

export const INITIAL_STATE: GameState = {
  addedSpecialInstruction: false,
  poConfigCode: "",
  scanResult: null,
  grnAccepted: 0,
  grnRejected: 0,
  disputeChoice: "",
  invoiceHeld: false,
  creditNoteApplied: false,
  partialPaymentReleased: false,
  replacementReceived: false,
  quizScore: 0,
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
