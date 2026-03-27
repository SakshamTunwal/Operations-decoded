import type { VendorQuote, GlossaryTerm, GameState } from "./types";

export const VENDORS: VendorQuote[] = [
  {
    name: "SunPalm Commodities",
    contact: "Marco DeSilva",
    contactRole: "Account Manager",
    pricePerTon: 1040,
    leadDays: 10,
    paymentTerms: "Net-30",
    total: 41600,
    responseHours: 18,
    hasCOA: true,
    hasRefs: true,
    tag: "Preferred Vendor",
    tagColor: "bg-green-100 text-green-700 border-green-200",
    highlight: true,
  },
  {
    name: "PureOil Direct",
    contact: "Anika Patel",
    contactRole: "Sales Lead",
    pricePerTon: 895,
    leadDays: 12,
    paymentTerms: "Net-45",
    total: 35800,
    responseHours: 22,
    hasCOA: true,
    hasRefs: false,
    tag: "New Supplier",
    tagColor: "bg-amber-100 text-amber-700 border-amber-200",
    warning:
      "No delivery history in your system. First-time supplier risk on production-critical material.",
  },
  {
    name: "GlobalFats Trading",
    contact: "David Reeves",
    contactRole: "Regional Manager",
    pricePerTon: 960,
    leadDays: 14,
    paymentTerms: "Net-30",
    total: 38400,
    responseHours: 47,
    hasCOA: false,
    hasRefs: false,
    tag: "Known Supplier",
    tagColor: "bg-gray-100 text-gray-600 border-gray-200",
    warning:
      "Previous late delivery (2 days) and storage concern flagged in your notes from last quarter.",
  },
];

export interface StepConfig {
  num: number;
  label: string;
  location: string;
  time: string;
  icon: string;
}

export const STEPS: StepConfig[] = [
  { num: 1, label: "Alert",     location: "Production Floor",  time: "Monday, 7:43am",     icon: "🏭" },
  { num: 2, label: "RFQ",       location: "Sarah's Office",    time: "Monday, 9:15am",     icon: "📋" },
  { num: 3, label: "Quotes In", location: "Sarah's Office",    time: "Wednesday, 11:00am", icon: "📬" },
  { num: 4, label: "Score",     location: "Evaluation Desk",   time: "Wednesday, 2:30pm",  icon: "📊" },
  { num: 5, label: "Negotiate", location: "Sarah's Office",    time: "Thursday, 10:00am",  icon: "📞" },
  { num: 6, label: "Approvals", location: "Directors' Floor",  time: "Thursday, 3:00pm",   icon: "✅" },
  { num: 7, label: "PO Raised", location: "Sarah's Office",    time: "Thursday, 4:17pm",   icon: "📄" },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  {
    term: "Request for Quotation (RFQ)",
    definition:
      "A formal document sent to potential suppliers asking them to quote a price and terms for specific goods or services. A well-crafted RFQ specifies exactly what you need — quantity, quality, delivery date, packaging, payment terms — so vendors can respond accurately.",
    unlocked: false,
  },
  {
    term: "Vendor Evaluation Scorecard",
    definition:
      "A structured tool for comparing suppliers across multiple criteria — not just price. Typical criteria include quality consistency, delivery reliability, documentation, responsiveness, certifications, and risk profile. Scoring removes gut-feel bias.",
    unlocked: false,
  },
  {
    term: "Certificate of Analysis (CoA)",
    definition:
      "A document from the supplier confirming that a specific batch of material has been tested and meets the required quality specifications. Essential for food-grade and industrial materials.",
    unlocked: false,
  },
  {
    term: "Lead Time",
    definition:
      "The total time from placing an order to receiving the goods. For production planning, lead time must fit within your remaining stock buffer — or you risk the line stopping.",
    unlocked: false,
  },
  {
    term: "Payment Terms (Net-30/45)",
    definition:
      "The number of days after delivery by which you must pay the invoice. Net-30 = 30 days. Net-45 = 45 days. Longer terms improve your cash flow but may narrow your supplier options.",
    unlocked: false,
  },
  {
    term: "Price Lock",
    definition:
      "An agreement with a supplier that fixes the unit price for a defined period (e.g., 120 days). Protects you from commodity price spikes and gives budget predictability.",
    unlocked: false,
  },
  {
    term: "Supplier Risk Profile",
    definition:
      "An assessment of how likely a supplier is to cause disruption — late deliveries, quality failures, or unexpected price changes. A new supplier with no track record carries more risk than a proven one, regardless of price.",
    unlocked: false,
  },
  {
    term: "Dual Approval Threshold",
    definition:
      "A spend control mechanism: purchases above a set value require sign-off from more than one person (e.g., Operations Manager + CFO). At this company, any order over $25,000 requires both James's and Rachel's approval.",
    unlocked: false,
  },
];

export const RFQ_ITEMS = [
  { key: "spec",     label: "Full technical specification sheet",  required: true,  reason: "Vendors must know exactly what grade and purity you need." },
  { key: "qty",      label: "Exact quantity: 40 metric tons",      required: true,  reason: "Quantity drives both pricing and production scheduling." },
  { key: "deadline", label: "Delivery deadline: 14 calendar days", required: true,  reason: "Vendors need to confirm their lead time against your constraint." },
  { key: "pack",     label: "Packaging requirements (200L drums)", required: true,  reason: "Non-standard packaging can delay receipt and handling." },
  { key: "payment",  label: "Payment terms (Net-30)",              required: true,  reason: "Payment terms are part of the total cost of buying." },
  { key: "cert",     label: "Quality certifications required",     required: true,  reason: "Food-grade certification is non-negotiable for this material." },
  { key: "batch",    label: "Batch traceability codes required",   required: true,  reason: "Traceability is essential for quality incidents and recalls." },
  { key: "finance",  label: "Vendor's latest financial statements",required: false, reason: "Relevant for long-term contracts — not a spot purchase." },
  { key: "history",  label: "Full company history document",       required: false, reason: "Irrelevant for this type of RFQ. Adds noise." },
  { key: "promo",    label: "Marketing brochures and case studies", required: false, reason: "You're buying palm oil, not engaging a consultant." },
];

export const SCORECARD_CRITERIA = [
  { key: "price",    label: "Price competitiveness",       col0: 2, col1: 5, col2: 3 },
  { key: "quality",  label: "Quality consistency",         col0: 5, col1: 2, col2: 3 },
  { key: "delivery", label: "Delivery reliability",        col0: 5, col1: 3, col2: 2 },
  { key: "docs",     label: "Documentation completeness",  col0: 5, col1: 4, col2: 1 },
  { key: "response", label: "Communication speed",         col0: 5, col1: 4, col2: 2 },
  { key: "certs",    label: "Certifications & compliance", col0: 5, col1: 4, col2: 2 },
  { key: "risk",     label: "Overall risk profile",        col0: 5, col1: 2, col2: 3 },
];

export const NEGOTIATION_OPTIONS = [
  {
    key: "match",
    label: "Match PureOil's price exactly",
    sub: '"I need you to match the $895/ton quote I received."',
    outcome: "bad",
    response:
      'Marco says: "Sarah, I can\'t match that number. Our quality and reliability cost more to deliver. I\'d be lying if I said I could hit $895."',
  },
  {
    key: "reasonable",
    label: "Ask for a meaningful discount — not a match",
    sub: '"I\'m not asking you to match it — but I need you to come down."',
    outcome: "good",
    response:
      'Marco says: "I hear you. I can do $985 per ton if we confirm this week, and I\'ll pull delivery to 9 days. I can also extend the price lock to 120 days."',
  },
  {
    key: "accept",
    label: "Accept SunPalm's quote as-is",
    sub: '"Your quality justifies the price. We\'ll take the original quote."',
    outcome: "neutral",
    response:
      "Marco confirms the original terms: $1,040/ton, 10 days, Net-30. No negotiation savings left on the table.",
  },
];

export const INITIAL_STATE: GameState = {
  selectedVendorIdx: null,
  negotiationChoice: "",
  finalPricePerTon: 1040,
  rfqItems: [],
  scorecardComplete: false,
  jamesApproved: false,
  rachelApproved: false,
  quizScore: 0,
  rachelAnswer1: "",
  rachelAnswer2: "",
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
