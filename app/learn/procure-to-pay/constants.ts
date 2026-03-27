import type {
  StepConfig,
  Vendor,
  GlossaryTerm,
  QuantityOption,
  UrgencyOption,
  POErrorField,
} from "./types";

export const VENDORS: Vendor[] = [
  {
    name: "Crestline Materials",
    price: 185,
    lead: 6,
    rating: 4.8,
    stars: 5,
    track: "2 years, zero failed deliveries",
    tag: "Preferred Vendor",
    tagColor: "bg-green-100 text-green-700 border-green-200",
    recall: true,
  },
  {
    name: "PrimeChem Direct",
    price: 162,
    lead: 4,
    rating: 3.0,
    stars: 3,
    track: "New vendor, 3 transactions only",
    tag: "Unverified",
    tagColor: "bg-red-100 text-red-700 border-red-200",
    warning:
      "Flagged: New vendor with limited history. Your quality team would normally run a vendor audit first for a critical raw material.",
  },
  {
    name: "ChemBridge Global",
    price: 174,
    lead: 5,
    rating: 4.3,
    stars: 4,
    track: "8 months, 2 minor delays",
    tag: "Approved",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
];

export const STEPS: StepConfig[] = [
  { num: 1, label: "Production Floor", doc: "PR", location: "Production Floor", time: "Tuesday 8:14am", icon: "🏭" },
  { num: 2, label: "Diana's Office",   doc: "Approval", location: "Purchase Department", time: "Tuesday 9:20am", icon: "🏢" },
  { num: 3, label: "Vendor Select",    doc: "Vendor", location: "Procurement System", time: "Tuesday 10:05am", icon: "📊" },
  { num: 4, label: "PO Dispatch",      doc: "PO", location: "Purchase Department", time: "Tuesday 11:30am", icon: "✉️" },
  { num: 5, label: "Receiving Bay",    doc: "GRN", location: "Receiving Bay 3", time: "Seven Days Later, 8:40am", icon: "🚚" },
  { num: 6, label: "Accounts Desk",    doc: "Invoice", location: "Accounts Payable", time: "Three Days After Delivery", icon: "📋" },
  { num: 7, label: "Finance Office",   doc: "Payment", location: "Finance Department", time: "Day 30", icon: "💰" },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Purchase Requisition (PR)", definition: "An internal document to request approval for a purchase. Marcus raised this when he saw the titanium dioxide bin was low. It's not sent to any vendor — it's an internal raised hand.", unlocked: false },
  { term: "Approval Workflow", definition: "The chain of sign-offs before money is committed. Diana approved Marcus's PR after checking stock, budget, and price benchmarks.", unlocked: false },
  { term: "Vendor / Supplier", definition: "The external company you're buying from. Nexara evaluated three vendors on price, lead time, and reliability before choosing.", unlocked: false },
  { term: "Purchase Order (PO)", definition: "A legally binding document sent to the vendor confirming what you're buying, at what price, and when. Once the vendor acknowledges it, both sides are committed.", unlocked: false },
  { term: "Goods Receipt Note (GRN)", definition: "Proof that goods were physically received and inspected. Raised after counting and verifying the delivery.", unlocked: false },
  { term: "Invoice", definition: "The vendor's bill requesting payment. It must match the PO and GRN before payment is released.", unlocked: false },
  { term: "3-Way Match", definition: "Comparing PO, GRN, and Invoice to make sure all three agree. Catches errors and prevents paying for goods never received.", unlocked: false },
  { term: "Procure-to-Pay (P2P)", definition: "The full cycle from identifying a need to making payment. PR → Approval → PO → GRN → Invoice Match → Payment. Every company runs this, for every purchase.", unlocked: false },
];

export const QUANTITY_OPTIONS: QuantityOption[] = [
  { value: 1000, label: "1,000 kg", implication: "~1.5 days supply buffer" },
  { value: 1500, label: "1,500 kg", implication: "~2.3 days supply buffer" },
  { value: 2000, label: "2,000 kg", implication: "~3 days supply buffer", recommended: true },
  { value: 2500, label: "2,500 kg", implication: "~3.8 days supply buffer" },
];

export const URGENCY_OPTIONS: UrgencyOption[] = [
  { value: "routine",   label: "Routine",   days: "14 days", color: "text-green-700 bg-green-50 border-green-200" },
  { value: "urgent",    label: "Urgent",    days: "7 days",  color: "text-[#D97706] bg-[#FEF3C7] border-[#f59e0b]/40" },
  { value: "emergency", label: "Emergency", days: "3 days",  color: "text-red-700 bg-red-50 border-red-200" },
];

export const PO_ERRORS: POErrorField[] = [
  { field: "deliveryAddress", label: "Delivery Address", wrong: "Receiving Bay 5", correct: "Receiving Bay 3" },
  { field: "unitOfMeasure",   label: "Unit of Measure",  wrong: "liters",          correct: "kg" },
  { field: "paymentTerms",    label: "Payment Terms",    wrong: "(blank)",          correct: "Net 30" },
];

export function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function todayStr(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
