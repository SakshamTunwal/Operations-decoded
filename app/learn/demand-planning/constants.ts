import type { GlossaryTerm, GameState, StepConfig } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "Two Photos",       icon: "📸", location: "Tom's Office",     time: "Monday Jan 6"    },
  { num: 2, label: "The Baseline",     icon: "📊", location: "Conference Room",  time: "Wednesday Jan 8" },
  { num: 3, label: "The Gap",          icon: "🔍", location: "Tom's Office",     time: "Friday Jan 10"   },
  { num: 4, label: "MAPE",             icon: "📐", location: "Analytics Desk",   time: "Monday Jan 13"   },
  { num: 5, label: "S&OP Meeting",     icon: "🤝", location: "Boardroom",        time: "Friday Jan 17"   },
  { num: 6, label: "Assumption Log",   icon: "📋", location: "Tom's Desk",       time: "Feb → Mid-season" },
  { num: 7, label: "The Results",      icon: "🏆", location: "All-Hands",        time: "September"       },
];

// ─── Monthly historical data ────────────────────────────────────────────────

export interface MonthlyRow {
  month: string;
  abbrev: string;
  avgSales: number;
  index: number; // seasonality index (rounded to 2dp)
}

export const MONTHLY_DATA: MonthlyRow[] = [
  { month: "January",   abbrev: "Jan", avgSales: 64_000,  index: 0.60 },
  { month: "February",  abbrev: "Feb", avgSales: 72_000,  index: 0.68 },
  { month: "March",     abbrev: "Mar", avgSales: 90_000,  index: 0.85 },
  { month: "April",     abbrev: "Apr", avgSales: 109_000, index: 1.03 },
  { month: "May",       abbrev: "May", avgSales: 142_000, index: 1.34 },
  { month: "June",      abbrev: "Jun", avgSales: 178_000, index: 1.68 },
  { month: "July",      abbrev: "Jul", avgSales: 189_000, index: 1.78 },
  { month: "August",    abbrev: "Aug", avgSales: 163_000, index: 1.53 },
  { month: "September", abbrev: "Sep", avgSales: 99_000,  index: 0.93 },
  { month: "October",   abbrev: "Oct", avgSales: 54_000,  index: 0.51 },
  { month: "November",  abbrev: "Nov", avgSales: 41_000,  index: 0.39 },
  { month: "December",  abbrev: "Dec", avgSales: 75_000,  index: 0.71 },
];

// Overall monthly average = 1,276,000 / 12 = 106,333
export const OVERALL_MONTHLY_AVG = 106_333;
export const JULY_SI = 1.78;
export const STATISTICAL_BASELINE = 142_000;

// ─── Intelligence gap ───────────────────────────────────────────────────────

export const INTELLIGENCE = {
  statisticalBaseline: 142_000,
  vanessaEstimate:     180_000,
  gap:                  38_000,
  verifiedUplift:       10_000, // SunLife verified account uplift
  tomAdjusted:         152_000, // stat + verified accounts only
};

export const ADJUSTMENT_OPTIONS = [
  { label: "Take Vanessa at face value",          value: 38, result: 180_000, quality: "risky",   rationale: "Verbal commitments from 3 accounts, unverified market 'feel'. No evidence trail."         },
  { label: "Split the difference",                value: 19, result: 161_000, quality: "weak",    rationale: "Splitting with no underlying logic. You'd need to justify this to finance and production."  },
  { label: "Stat + verified SunLife account",     value: 10, result: 152_000, quality: "correct", rationale: "SunLife's 8,000-unit verbal commitment + buffer = defensible uplift. Document as assumption." },
  { label: "Stick with statistical baseline",     value: 0,  result: 142_000, quality: "risky",   rationale: "Ignores field intelligence entirely. If SunLife activates, you're short from day one."      },
];

// ─── MAPE data ──────────────────────────────────────────────────────────────

export interface MapeRow {
  month: string;
  forecast: number;
  actual: number;
  ape: number; // |f - a| / a * 100, rounded to 1dp
}

export const MAPE_DATA: MapeRow[] = [
  { month: "May", forecast: 108_000, actual: 142_000, ape: 23.9 },
  { month: "Jun", forecast: 140_000, actual: 178_000, ape: 21.3 },
  { month: "Jul", forecast: 118_000, actual: 189_000, ape: 37.6 },
  { month: "Aug", forecast: 190_000, actual: 163_000, ape: 16.6 },
  { month: "Sep", forecast: 150_000, actual:  99_000, ape: 51.5 },
  { month: "Oct", forecast:  75_000, actual:  54_000, ape: 38.9 },
];

// MAPE = mean of APEs = (23.9+21.3+37.6+16.6+51.5+38.9)/6 = 189.8/6 = 31.6% ≈ 31%
export const PRIOR_YEAR_MAPE = 31.6;

// ─── S&OP stakeholders ──────────────────────────────────────────────────────

export interface Stakeholder {
  name: string;
  role: string;
  forecast: number;
  color: string;
  bgColor: string;
  rationale: string;
  acceptableRange: [number, number]; // min, max they'd accept
}

export const STAKEHOLDERS: Stakeholder[] = [
  {
    name: "Tom",
    role: "Demand Planning",
    forecast: 152_000,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    rationale: "Statistical baseline (142k) + verified SunLife account uplift (10k).",
    acceptableRange: [148_000, 162_000],
  },
  {
    name: "Vanessa",
    role: "Sales Director",
    forecast: 180_000,
    color: "#10B981",
    bgColor: "#ECFDF5",
    rationale: "Three major retail accounts committed. SunLife launch + competitor weakness + predicted heat wave.",
    acceptableRange: [155_000, 180_000],
  },
  {
    name: "Chloe",
    role: "Finance Director",
    forecast: 150_000,
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    rationale: "Approved production budget supports 150k units. Needs CFO sign-off for more capacity.",
    acceptableRange: [148_000, 165_000],
  },
  {
    name: "Omar",
    role: "Supply Chain",
    forecast: 160_000,
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    rationale: "Production capacity can flex to 165k with one week notice. 160k is a comfortable anchor.",
    acceptableRange: [150_000, 170_000],
  },
];

export const CONSENSUS_TARGET = 158_000;
export const CONSENSUS_TOLERANCE = 5_000;

// ─── Assumption log ─────────────────────────────────────────────────────────

export interface Assumption {
  id: string;
  text: string;
  triggerThreshold: string;
  isReforecastTrigger: boolean;
}

export const ASSUMPTIONS: Assumption[] = [
  {
    id: "A1",
    text: "Average summer temperatures ≥ 2°C above seasonal baseline",
    triggerThreshold: "If temps run >1°C above baseline for 2 consecutive weeks",
    isReforecastTrigger: true,
  },
  {
    id: "A2",
    text: "SunLife Sports activates their $1.2M retail launch order",
    triggerThreshold: "If SunLife confirms PO by March 31",
    isReforecastTrigger: true,
  },
  {
    id: "A3",
    text: "No major competitor SPF 50 launch in Q2 or Q3",
    triggerThreshold: "Monitor quarterly; low probability event",
    isReforecastTrigger: false,
  },
  {
    id: "A4",
    text: "Production ramp-up to full capacity complete by April 15",
    triggerThreshold: "Operations milestone — internal only",
    isReforecastTrigger: false,
  },
  {
    id: "A5",
    text: "Primary packaging supplier (AluPak) delivers on schedule",
    triggerThreshold: "Track 8-week lead time; contingency supplier identified",
    isReforecastTrigger: false,
  },
];

export const REFORECAST_FROM = 158_000;
export const REFORECAST_TO   = 172_000;
export const TEMP_DEVIATION_PCT = 12; // actual temps ran 12% above seasonal

// ─── Final results ──────────────────────────────────────────────────────────

export const RESULTS_METRICS = [
  { label: "Units Sold",          before: "Stockout at 189k demand",  after: "169,400",          icon: "📦", good: true  },
  { label: "Season MAPE",         before: "31%",                      after: "14.2%",             icon: "📐", good: true  },
  { label: "Service Level",       before: "~74%",                     after: "97%",               icon: "✅", good: true  },
  { label: "Stockout Loss",       before: "$340,000",                 after: "$0",                icon: "🚫", good: true  },
  { label: "End-of-Season Stock", before: "$89,000 write-off",        after: "$18,400 (managed)", icon: "📉", good: true  },
  { label: "Production Rush Jobs",before: "4 emergency runs",         after: "0",                 icon: "🏭", good: true  },
];

// ─── Glossary ────────────────────────────────────────────────────────────────

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Demand Planning",     definition: "The process of forecasting customer demand so that products can be produced, stored, and shipped efficiently. Good demand planning bridges sales intelligence and operational capacity.", unlocked: false },
  { term: "Baseline Forecast",   definition: "A statistical projection of future demand based solely on historical data — using tools like moving averages and seasonality indices — before any human judgement or market intelligence is applied.", unlocked: false },
  { term: "Moving Average",      definition: "A statistical smoothing technique that calculates the average of the most recent N data points, rolling forward as new data arrives. Eliminates noise from individual peaks and troughs.", unlocked: false },
  { term: "Seasonality Index",   definition: "A multiplier that captures how demand in a specific month compares to the annual average. Formula: Month Average ÷ Overall Monthly Average. July index of 1.78 = July demand is 78% above the average month.", unlocked: false },
  { term: "MAPE",                definition: "Mean Absolute Percentage Error — the average of |Forecast − Actual| / Actual × 100 across all periods. Measures forecast accuracy independent of volume. Industry best practice for seasonal consumer goods: 10–15%.", unlocked: false },
  { term: "S&OP",                definition: "Sales & Operations Planning — a cross-functional meeting process that aligns sales forecasts, production capacity, financial targets, and supply chain constraints into a single agreed operational plan.", unlocked: false },
  { term: "Qualitative Adjustment", definition: "A change to a statistical forecast based on human judgement, field intelligence, or market knowledge that the historical data cannot capture — such as a major new account, competitor weakness, or unusual weather forecast.", unlocked: false },
  { term: "Assumption Log",      definition: "A documented record of every key assumption that underpins a forecast — with explicit trigger conditions that would invalidate each assumption and require a reforecast.", unlocked: false },
  { term: "Reforecast",          definition: "An in-period revision of the annual forecast, triggered when a pre-defined assumption changes significantly. Mid-season reforecasting allows production and supply chain to adjust before it's too late.", unlocked: false },
  { term: "Service Level",       definition: "The percentage of customer demand that is fulfilled completely and on time from available stock. A 97% service level means 97% of units requested were delivered as promised.", unlocked: false },
];

export const INITIAL_STATE: GameState = {
  problemsIdentified:      false,
  seasonalityBuilt:        false,
  intelligenceGapAnalyzed: false,
  mapeCalculated:          false,
  sopConsensusReached:     false,
  assumptionsLogged:       false,
  resultsReviewed:         false,
  quizScore:               0,
};
