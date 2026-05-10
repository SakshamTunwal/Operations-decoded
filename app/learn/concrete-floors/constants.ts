import type {
  StepConfig,
  GlossaryTerm,
  SlottingItem,
  PickMethod,
  ErrorLogEntry,
  ReturnItem,
} from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "Warehouse Floor",   doc: "Layout",     location: "Main Warehouse Floor",     time: "Monday 8:00am",        icon: "🏭" },
  { num: 2, label: "Receiving Dock",     doc: "Receiving",  location: "Receiving Dock",           time: "Monday 10:30am",       icon: "🚛" },
  { num: 3, label: "Pick Operations",    doc: "Picking",    location: "Pick Aisles",              time: "Tuesday 9:00am",       icon: "📦" },
  { num: 4, label: "WMS & Data",         doc: "WMS",        location: "Systems Office",           time: "Wednesday 2:00pm",     icon: "💻" },
  { num: 5, label: "Error Reduction",    doc: "Quality",    location: "Quality Station",          time: "Thursday 8:30am",      icon: "🔍" },
  { num: 6, label: "Returns Bay",        doc: "Returns",    location: "Returns Processing Bay",   time: "Thursday 3:00pm",      icon: "📋" },
  { num: 7, label: "Flash Sale",         doc: "Execution",  location: "Full Warehouse Operations", time: "Flash Sale — Day 1",  icon: "⚡" },
];

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "ABC Slotting", definition: "Organising warehouse locations so the fastest-moving SKUs (A items) are nearest the packing area, medium-velocity (B) in the middle, and slow-movers (C) at the back. Reduces pick distance dramatically.", unlocked: false },
  { term: "Receiving Window", definition: "A dedicated time block for unloading supplier deliveries. Separating receiving from picking prevents traffic conflicts in the aisles and improves safety.", unlocked: false },
  { term: "Zone Picking", definition: "Each picker owns a specific zone of the warehouse. Orders are split by zone, picked in parallel, then consolidated at the packing station. Faster and more accurate than single-order picking.", unlocked: false },
  { term: "WMS (Warehouse Management System)", definition: "Software that maps every physical location to a digital coordinate. It tracks stock movement, generates optimised pick paths, and automates dispatch documentation.", unlocked: false },
  { term: "Pick Accuracy", definition: "The percentage of orders shipped with the correct items in the correct quantities. The warehouse went from 96.6% to 98.8% during the flash sale through better slotting, zone picking, and visual aids.", unlocked: false },
  { term: "Dispatch Documentation", definition: "The packing slip, courier manifest, and digital proof of dispatch that accompany every outbound order. The boundary line where warehouse responsibility ends and carrier responsibility begins.", unlocked: false },
  { term: "Returns Grading (A/B/C/D)", definition: "A four-tier system for classifying returned items: Grade A (resaleable as-is), Grade B (needs repackaging), Grade C (damaged but salvageable for outlet), Grade D (write-off). Determines routing and recovery value.", unlocked: false },
  { term: "Warehouse Health Scorecard", definition: "Four key metrics that tell you if a warehouse is working: Pick Accuracy, Dispatch On Time, Returns Processing Time, and Location Accuracy. Everything else is noise.", unlocked: false },
];

export const SLOTTING_ITEMS: SlottingItem[] = [
  { sku: "Activewear Leggings (8 colours)", category: "Activewear", velocity: "A", currentAisle: 5, correctZone: "front" },
  { sku: "Sports Bras (4 styles)",          category: "Activewear", velocity: "A", currentAisle: 4, correctZone: "front" },
  { sku: "Running Shoes (12 sizes)",        category: "Footwear",   velocity: "A", currentAisle: 3, correctZone: "front" },
  { sku: "Yoga Mats",                       category: "Accessories", velocity: "B", currentAisle: 7, correctZone: "middle" },
  { sku: "Gym Bags",                        category: "Accessories", velocity: "B", currentAisle: 7, correctZone: "middle" },
  { sku: "Winter Coats (bulky)",            category: "Outerwear",  velocity: "C", currentAisle: 1, correctZone: "back" },
  { sku: "Clearance Accessories",           category: "Clearance",  velocity: "C", currentAisle: 8, correctZone: "back" },
];

export const PICK_METHODS: PickMethod[] = [
  {
    id: "single",
    label: "Single Order Picking",
    desc: "One order at a time. Walk the full warehouse for each order.",
    icon: "🚶",
    pros: "Simple, accurate",
    cons: "Incredibly slow — full-floor walk per order",
  },
  {
    id: "batch",
    label: "Batch Picking",
    desc: "Take 5-6 orders at once, sort by aisle, pick in a single pass.",
    icon: "📋",
    pros: "Faster than single",
    cons: "Sorting errors → wrong items in wrong totes",
  },
  {
    id: "zone",
    label: "Zone Picking with Consolidation",
    desc: "Each picker owns a zone. Orders split by zone, then consolidated at packing.",
    icon: "🎯",
    pros: "Fastest, most accurate, scalable",
    cons: "Needs WMS support and zone design",
  },
];

export const ERROR_LOG: ErrorLogEntry[] = [
  { skuGroup: "Activewear Leggings", errorType: "Wrong colourway picked", count: 156, fix: "Colour-coded bin dividers", fixId: "dividers" },
  { skuGroup: "Running Shoes",       errorType: "Wrong half-size picked",  count: 89,  fix: "Large-format size labels", fixId: "labels" },
  { skuGroup: "Accessories",         errorType: "Wrong item grabbed",      count: 48,  fix: "Wider bin spacing",        fixId: "spacing" },
];

export const RETURN_ITEMS: ReturnItem[] = [
  { id: 1, label: "Leggings — Midnight Black, Size M",  condition: "Tags intact, unworn, original packaging",          grade: "A" },
  { id: 2, label: "Running Shoes — Size 9",             condition: "Box opened, shoes unworn, box slightly crushed",   grade: "B" },
  { id: 3, label: "Sports Bra — Size S",                condition: "Minor pull in fabric, tags removed",               grade: "C" },
  { id: 4, label: "Yoga Mat — Blue",                    condition: "Torn seam, material peeling",                      grade: "D" },
  { id: 5, label: "Gym Bag — Grey",                     condition: "Tags intact, original packaging, perfect",         grade: "A" },
  { id: 6, label: "Leggings — Ocean Blue, Size L",      condition: "Packaging opened, item perfect, needs rebagging",  grade: "B" },
];

export const ZONE_COLORS: Record<number, { label: string; color: string; border: string; bg: string }> = {
  1: { label: "Zone 1 — Activewear", color: "text-red-700",    border: "border-red-400",    bg: "bg-red-50" },
  2: { label: "Zone 2 — Accessories", color: "text-blue-700",   border: "border-blue-400",   bg: "bg-blue-50" },
  3: { label: "Zone 3 — Footwear",    color: "text-green-700",  border: "border-green-400",  bg: "bg-green-50" },
  4: { label: "Zone 4 — General",     color: "text-yellow-700", border: "border-yellow-400", bg: "bg-yellow-50" },
  5: { label: "Zone 5 — Outerwear",   color: "text-purple-700", border: "border-purple-400", bg: "bg-purple-50" },
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function pct(n: number, d: number): string {
  return `${((n / d) * 100).toFixed(1)}%`;
}
