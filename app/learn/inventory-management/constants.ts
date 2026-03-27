import type { GlossaryTerm, GameState, StepConfig } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "The Handover",    icon: "🏭", location: "Warehouse",        time: "Monday 8:30am"  },
  { num: 2, label: "The Count",       icon: "📋", location: "Warehouse Floor",   time: "Thursday PM"    },
  { num: 3, label: "The Stockout",    icon: "🚫", location: "ERP System",        time: "Thursday 2:15pm"},
  { num: 4, label: "The Overstock",   icon: "📦", location: "Aisle 14–17",       time: "Friday Morning" },
  { num: 5, label: "Reorder Formula", icon: "📐", location: "Zara's Office",     time: "Week 2"         },
  { num: 6, label: "ABC Analysis",    icon: "🅰️", location: "Conference Room",   time: "Week 2"         },
  { num: 7, label: "Recovery Plan",   icon: "✅", location: "Conference Room",   time: "3 Months Later" },
];

// ─── Audit data ────────────────────────────────────────────────────────────────

export interface AuditRow {
  sku: string;
  name: string;
  system: number;
  physical: number;
  variance: number;
}

export const AUDIT_DATA: AuditRow[] = [
  { sku: "AP-7200",  name: "Air Purifier Pro",        system: 340,  physical: 287,  variance: -53 },
  { sku: "WH-5100",  name: "Water Heater Standard",   system: 1200, physical: 1247, variance: +47 },
  { sku: "KA-3300",  name: "Kitchen Appliance Hub",   system: 85,   physical: 83,   variance: -2  },
  { sku: "AP-3100",  name: "Air Purifier Compact",    system: 210,  physical: 210,  variance: 0   },
  { sku: "WH-3050",  name: "Water Heater Basic",      system: 45,   physical: 44,   variance: -1  },
  { sku: "KA-7700",  name: "Premium Blender",         system: 18,   physical: 12,   variance: -6  },
  { sku: "AP-9900",  name: "Air Purifier Industrial", system: 4,    physical: 4,    variance: 0   },
  { sku: "WH-8800",  name: "Smart Water Heater",      system: 67,   physical: 79,   variance: +12 },
];

// These three have variances significant enough (>5) to require flagging
export const SIGNIFICANT_SKUS = ["AP-7200", "KA-7700", "WH-8800"];

// ─── Stockout data ─────────────────────────────────────────────────────────────

export const STOCKOUT = {
  sku: "AP-7200",
  systemCount: 340,
  physicalCount: 287,
  gap: 53,
  alreadyCommitted: 260,
  availableToSell: 27,
  retailPrice: 340,
  landedCost: 195,
};

export interface StockoutOrder {
  id: string;
  qty: number;
  label: string;
  consequence: string;
}

export const STOCKOUT_ORDERS: StockoutOrder[] = [
  { id: "ORD-2847", qty: 3, label: "Online customer — silent cancellation", consequence: "Lost revenue: $1,020. Customer received refund with no explanation." },
  { id: "ORD-2851", qty: 2, label: "Recurring customer — left a review",    consequence: "\"Ordered an air purifier, got told it's out of stock AFTER I paid.\" — 1-star review visible to all future customers." },
  { id: "ORD-2856", qty: 3, label: "High-value customer — switched brand",  consequence: "Bought the equivalent from a competitor. Estimated CLV lost: $3,000–5,000 in future purchases." },
];

// ─── Overstock data ────────────────────────────────────────────────────────────

export const OVERSTOCK = {
  sku: "WH-5100",
  unitsOnHand: 1200,
  monthlyDemand: 38,
  monthsSupply: 31.6,
  landedCost: 130,
  totalValue: 156_000,
  carryingRateMin: 20,
  carryingRateMax: 30,
  carryingRateCorrect: 25,
  annualCostAtCorrectRate: 39_000,
};

// ─── ROP data ─────────────────────────────────────────────────────────────────

export const ROP_DATA = {
  sku: "AP-7200",
  dailyDemand: 4,
  leadTimeDays: 45,
  safetyStock: 30,
  rop: 210, // 4 × 45 + 30
};

// ─── Bullwhip data ─────────────────────────────────────────────────────────────

export interface BullwhipMonth {
  month: string;
  demand: number;
  orders: number;
  annotation: string;
}

export const BULLWHIP_DATA: BullwhipMonth[] = [
  { month: "Jan", demand: 92,  orders: 90,  annotation: "Stable"       },
  { month: "Feb", demand: 88,  orders: 50,  annotation: "Under-ordered"},
  { month: "Mar", demand: 108, orders: 420, annotation: "Panic buy"    },
  { month: "Apr", demand: 95,  orders: 380, annotation: "Still hoarding"},
  { month: "May", demand: 85,  orders: 50,  annotation: "Stopped cold" },
  { month: "Jun", demand: 100, orders: 310, annotation: "Panic again"  },
];

export const BULLWHIP_QUESTIONS: { month: string; options: string[]; correct: string }[] = [
  { month: "Mar", options: ["Demand spiked 280%", "Darren saw a small demand increase and panicked", "Supplier offered a bulk deal"], correct: "Darren saw a small demand increase and panicked" },
  { month: "May", options: ["Demand collapsed", "Darren stopped ordering because he was overstocked", "Supplier went on holiday"], correct: "Darren stopped ordering because he was overstocked" },
  { month: "Jun", options: ["New product launch", "Darren panicked again after seeing low stock", "Seasonal peak in summer"], correct: "Darren panicked again after seeing low stock" },
];

// ─── ABC data ─────────────────────────────────────────────────────────────────

export interface ABCSku {
  sku: string;
  name: string;
  annualRevenue: number;
  correct: "A" | "B" | "C";
}

// Total revenue = ~1,464,700 — A = ~1,181,000 (80.6%), B = ~249,600 (17%), C = ~34,100 (2.3%)
export const ABC_SKUS: ABCSku[] = [
  { sku: "AP-7200",  name: "Air Purifier Pro",         annualRevenue: 714_000, correct: "A" },
  { sku: "AP-3100",  name: "Air Purifier Compact",     annualRevenue: 289_000, correct: "A" },
  { sku: "KA-9900",  name: "Premium Stand Mixer",      annualRevenue: 178_000, correct: "A" },
  { sku: "WH-3050",  name: "Water Heater Basic",       annualRevenue: 98_000,  correct: "B" },
  { sku: "WH-5100",  name: "Water Heater Standard",    annualRevenue: 84_600,  correct: "B" },
  { sku: "KA-3300",  name: "Kitchen Appliance Hub",    annualRevenue: 67_000,  correct: "B" },
  { sku: "ACC-1100", name: "Filter Replacement Pack",  annualRevenue: 18_000,  correct: "C" },
  { sku: "ACC-2200", name: "Descaling Kit",            annualRevenue: 7_200,   correct: "C" },
  { sku: "ACC-3300", name: "Remote Control Unit",      annualRevenue: 4_800,   correct: "C" },
  { sku: "ACC-4400", name: "Installation Kit",         annualRevenue: 4_100,   correct: "C" },
];

// ─── Dashboard recovery metrics ────────────────────────────────────────────────

export const DASHBOARD_METRICS = [
  { label: "Inventory Accuracy",       before: "84%",   after: "97.6%",  icon: "📊", good: true  },
  { label: "AP-7200 Stockouts (90d)",  before: "3",     after: "0",      icon: "🚫", good: true  },
  { label: "Emergency Reorders/month", before: "2.3",   after: "0.1",    icon: "🆘", good: true  },
  { label: "Inventory Turn",           before: "4.2×",  after: "5.1×",   icon: "♻️", good: true  },
  { label: "WH-5100 Units Sold",       before: "0",     after: "640",    icon: "📦", good: true  },
  { label: "Bullwhip Variability",     before: "High",  after: "−61%",   icon: "📉", good: true  },
];

// ─── Glossary ──────────────────────────────────────────────────────────────────

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Inventory Accuracy",   definition: "The percentage match between ERP system stock counts and physical warehouse counts. 97–99% is considered high-performing; below 90% signals a broken counting process.", unlocked: false },
  { term: "Cycle Count",          definition: "Frequent, partial inventory verification on a rotating schedule. Instead of one annual count, specific SKUs are counted weekly or monthly — catching errors before they compound.", unlocked: false },
  { term: "Stockout",             definition: "Available inventory reaches zero while demand exists. Costs include immediate lost revenue, customer defection, negative reviews, and emergency procurement premiums.", unlocked: false },
  { term: "Overstock",            definition: "Holding significantly more inventory than current demand requires. Costs include carrying charges, tied-up working capital, obsolescence risk, and wasted warehouse space.", unlocked: false },
  { term: "Carrying Cost",        definition: "The total annual cost of holding inventory — typically 20–30% of inventory value. Includes warehousing, insurance, capital cost, depreciation, and shrinkage.", unlocked: false },
  { term: "Reorder Point (ROP)",  definition: "The inventory level that triggers a new purchase order. Formula: (Average Daily Demand × Lead Time in Days) + Safety Stock. Orders placed at this level arrive before safety stock is depleted.", unlocked: false },
  { term: "Safety Stock",         definition: "A buffer inventory held above the reorder point to absorb variability in demand or supply lead time. Too little = stockouts; too much = overstock.", unlocked: false },
  { term: "Lead Time",            definition: "The number of calendar days between placing a purchase order and receiving goods in the warehouse. AP-7200 lead time: 45 days. Must be factored into reorder point calculation.", unlocked: false },
  { term: "ABC Analysis",         definition: "Pareto-based SKU classification: A items (top 20% of SKUs = ~80% of revenue), B items (next 30% = ~15%), C items (bottom 50% = ~5%). Prioritises management effort where it matters most.", unlocked: false },
  { term: "Bullwhip Effect",      definition: "Demand variability amplification upstream in the supply chain. Small fluctuations in customer demand trigger disproportionately large swings in purchase orders — causing production and logistics instability.", unlocked: false },
];

export const INITIAL_STATE: GameState = {
  auditFlagged:           [],
  stockoutUnderstood:     false,
  carryingCostCalculated: false,
  ropBuilt:               false,
  bullwhipAnswers:        {},
  abcAnswers:             {},
  dashboardReviewed:      false,
  quizScore:              0,
};
