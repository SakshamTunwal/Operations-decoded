import type { StepConfig, GlossaryTerm, TransportScenario, CostComponent, ScorecardMetric, PODRecord, EvidenceDocument } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "Delivery Landscape",  doc: "Analysis",   location: "Logistics Office",   time: "Monday 8:00am",          icon: "🚛" },
  { num: 2, label: "True Cost Model",     doc: "Costing",    location: "Finance Office",      time: "Week 1 — Tuesday",       icon: "💰" },
  { num: 3, label: "Carrier Scorecard",   doc: "Scorecard",  location: "Operations Room",     time: "Week 2 — Wednesday",     icon: "📊" },
  { num: 4, label: "POD Crisis",          doc: "Recovery",   location: "Systems Office",      time: "Week 3 — Thursday",      icon: "📋" },
  { num: 5, label: "Freight Claims",      doc: "Claims",     location: "Claims Desk",         time: "Week 3 — Friday",        icon: "🔍" },
  { num: 6, label: "3PL vs In-House",     doc: "Decision",   location: "Board Room",          time: "Week 4 — Monday",        icon: "⚖️" },
  { num: 7, label: "SLA & Dashboard",     doc: "Contract",   location: "Conference Room",     time: "Day 90",                 icon: "🎯" },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Full Truckload (FTL)", definition: "A shipment that fills an entire truck dedicated to a single destination. Used for high-volume, high-weight loads. The economics are straightforward: one truck, one site, one delivery.", unlocked: false },
  { term: "Less-Than-Truckload (LTL)", definition: "A shipping arrangement where a single vehicle carries deliveries for multiple stops on a route. Efficient for smaller orders, but routing complexity creates more points of failure.", unlocked: false },
  { term: "Detention Charge", definition: "A fee charged by carriers when a truck waits beyond the free time allowed at a loading or delivery point. A silent cost that can add 20-30% to expected freight spend.", unlocked: false },
  { term: "Proof of Delivery (POD)", definition: "A signed document confirming goods were received by the customer. The critical link in the revenue cycle — without a POD, invoices cannot be raised and cash doesn't flow.", unlocked: false },
  { term: "Carrier Performance SLA", definition: "A Service Level Agreement that defines measurable performance targets for a logistics provider: on-time rate, damage rate, POD completion, and complaint resolution time.", unlocked: false },
  { term: "Route Optimisation", definition: "Software-driven process of calculating the most efficient sequence of delivery stops, factoring in time windows, vehicle capacity, traffic patterns, and driver hours. Can reduce route distance by 15-20%.", unlocked: false },
  { term: "3PL (Third-Party Logistics)", definition: "Outsourcing logistics operations to a specialist provider who manages trucks, drivers, and routing. Lower fixed cost than in-house but less direct control over service quality.", unlocked: false },
  { term: "Last Mile", definition: "The final leg of a delivery journey — from the depot to the customer's door. Where most logistics costs accumulate and most service failures materialise. Subject to variables no route plan can fully control.", unlocked: false },
];

export const TRANSPORT_SCENARIOS: TransportScenario[] = [
  { id: "s1", description: "18 tonnes of cement to a construction site", weight: "18,000 kg", destination: "Single construction site", urgency: "Scheduled window", correctMode: "ftl" },
  { id: "s2", description: "Mixed pallet: 8 boxes tiles + 3 vanity units to a showroom", weight: "220 kg", destination: "Retail showroom", urgency: "Weekly scheduled", correctMode: "ltl" },
  { id: "s3", description: "1 replacement tap fitting for warranty claim", weight: "0.8 kg", destination: "Customer address", urgency: "Next-day urgent", correctMode: "express" },
  { id: "s4", description: "Bulk cement order: 20 tonnes to a large housing project", weight: "20,000 kg", destination: "Single project site", urgency: "Scheduled AM window", correctMode: "ftl" },
  { id: "s5", description: "6-stop suburban tile route: 8 stores, mixed pallets", weight: "1,400 kg", destination: "6 retail stops", urgency: "Daily scheduled", correctMode: "ltl" },
];

export const COST_COMPONENTS: CostComponent[] = [
  { id: "base",      label: "Base Freight Rate",        amount: 142.00, description: "What's on the invoice — Atlas Freight monthly charge per delivery", category: "base" },
  { id: "fuel",      label: "Fuel Surcharge",            amount: 18.00,  description: "Variable charge indexed to diesel price — rarely shown prominently", category: "surcharge" },
  { id: "detention", label: "Detention Charges",          amount: 11.00,  description: "Avg across portfolio. Construction FTL sites: $34/delivery", category: "hidden" },
  { id: "damage",    label: "Damage Claims",              amount: 2.30,   description: "Avg cost of damage claims per delivery across all shipments", category: "hidden" },
  { id: "admin",     label: "Admin Overhead",             amount: 4.50,   description: "Your team's time: scheduling, disputes, POD chasing, complaints", category: "hidden" },
];

export const SCORECARD_METRICS: ScorecardMetric[] = [
  { id: "ontime",    label: "On-Time Delivery Rate",    current: 81,  unit: "%",     benchmark: 95,   direction: "higher", description: "1 in 5 deliveries arriving outside the scheduled window. Industry standard: 93-95%." },
  { id: "damage",    label: "Damage Rate",              current: 2.8, unit: "%",     benchmark: 0.5,  direction: "lower",  description: "More than 5× over target for fragile goods like tiles and sanitary ware." },
  { id: "pod",       label: "POD Completion",           current: 76,  unit: "%",     benchmark: 100,  direction: "higher", description: "24% of deliveries have no signed POD in the system — blocking invoicing." },
  { id: "complaint", label: "Complaint Resolution",     current: 8,   unit: " days", benchmark: 2,    direction: "lower",  description: "Anita wants 48 hours. Jerome's team takes 8 days — relationships get damaged." },
];

export const POD_RECORDS: PODRecord[] = [
  { id: 1,  delivery: "Atlas FTL-0881 — Cement, Construction Site A", date: "15 Mar", value: 4200,  status: "paper",   actionable: true },
  { id: 2,  delivery: "Atlas LTL-0442 — Tiles, Showroom District",    date: "14 Mar", value: 890,   status: "missing", actionable: true },
  { id: 3,  delivery: "Atlas LTL-0443 — Sanitary Ware, Store 4",      date: "14 Mar", value: 1340,  status: "paper",   actionable: true },
  { id: 4,  delivery: "Atlas FTL-0879 — Cement, Housing Project B",   date: "13 Mar", value: 8700,  status: "paper",   actionable: true },
  { id: 5,  delivery: "Atlas EXP-0201 — Replacement Parts, urgent",   date: "13 Mar", value: 340,   status: "digital", actionable: false },
  { id: 6,  delivery: "Atlas LTL-0438 — Tiles, Gloria's Store",       date: "12 Mar", value: 2100,  status: "missing", actionable: true },
];

export const EVIDENCE_DOCS: EvidenceDocument[] = [
  { id: "dispatch",    label: "Warehouse Dispatch Record",   icon: "📦", stage: 1, description: "Outbound quality check showing all cartons inspected and cleared at carrier pickup" },
  { id: "manifest",    label: "Carrier Loading Manifest",    icon: "📋", stage: 2, description: "Kenji's signed confirmation of goods received in acceptable condition at depot loading" },
  { id: "photo_outer", label: "Damage Photo — Outer Carton", icon: "📷", stage: 3, description: "Gloria's timestamped photo of crushed carton corner at point of delivery" },
  { id: "photo_tiles", label: "Damage Photo — Broken Tiles", icon: "🔍", stage: 4, description: "Itemised photo of 18 broken decorative tiles after opening damaged carton" },
  { id: "pod_note",    label: "Signed Delivery Receipt",     icon: "✍️", stage: 5, description: "POD with damage noted before signature — Kenji countersigned acknowledging condition" },
];

export const SLA_TARGETS = {
  ontime:    { current: 81,  target: 95,   result: 93,   unit: "%" },
  damage:    { current: 2.8, target: 0.5,  result: 0.9,  unit: "%" },
  pod:       { current: 76,  target: 100,  result: 98,   unit: "%" },
  complaint: { current: 8,   target: 2,    result: 3.5,  unit: " days" },
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function pct(n: number, d: number): string {
  return `${((n / d) * 100).toFixed(1)}%`;
}
