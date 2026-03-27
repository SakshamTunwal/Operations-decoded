import type { StepConfig, GlossaryTerm, GameState } from "./types";

export const STEPS: StepConfig[] = [
  { num: 1, label: "The Quote",      doc: "RFQ",    location: "Elena's Office",   time: "Monday 9:14am",          icon: "📄" },
  { num: 2, label: "Pick the Term",  doc: "Terms",  location: "Call with Hassan", time: "Monday 11:30am",         icon: "📋" },
  { num: 3, label: "FOB Confirmed",  doc: "PO",     location: "Virtual Meeting",  time: "Tuesday 2:00pm",         icon: "✅" },
  { num: 4, label: "Port Arrival",   doc: "BOL",    location: "Destination Port", time: "19 Days Later, Tuesday", icon: "🚢" },
  { num: 5, label: "Customs Rush",   doc: "Entry",  location: "Customs Office",   time: "Wednesday 8:00am",       icon: "🏛️" },
  { num: 6, label: "The Cost",       doc: "Report", location: "Frank's Office",   time: "Friday 3:00pm",          icon: "💸" },
  { num: 7, label: "The Matrix",     doc: "Ref.",   location: "Elena's Office",   time: "Saturday Morning",       icon: "📊" },
];

export interface IncotermOption {
  code: string;
  name: string;
  tagline: string;
  badgeColor: string;
  sellerCovers: string[];
  buyerCovers: string[];
  recommended?: boolean;
  warning?: string;
  caution?: string;
  tip?: string;
}

export const INCOTERMS: IncotermOption[] = [
  {
    code: "EXW",
    name: "Ex Works",
    tagline: "Seller's minimum obligation",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    sellerCovers: ["Pack goods at factory premises"],
    buyerCovers: [
      "Loading at factory",
      "Inland transport (origin country)",
      "Export customs clearance",
      "Vessel loading",
      "Ocean freight",
      "Marine insurance",
      "Import customs clearance",
      "Delivery to warehouse",
    ],
    warning:
      "You'd be arranging export customs clearance in Jinshen's country — a jurisdiction where Nexara has no presence, no local agent, and no experience. Not recommended for a first-time importer.",
  },
  {
    code: "FOB",
    name: "Free on Board",
    tagline: "Clean handoff at the ship's rail",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    sellerCovers: [
      "Pack goods at factory",
      "Inland transport to origin port",
      "Export customs clearance",
      "Vessel loading",
    ],
    buyerCovers: [
      "Ocean freight",
      "Marine insurance",
      "Import customs clearance",
      "Delivery to warehouse",
    ],
    recommended: true,
    tip: "Jinshen handles everything in their country. You handle everything in yours. Hassan books freight and Clause A insurance to your specification.",
  },
  {
    code: "CIF",
    name: "Cost, Insurance & Freight",
    tagline: "Seller pays freight & minimum insurance",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    sellerCovers: [
      "Pack goods at factory",
      "Inland transport to origin port",
      "Export customs clearance",
      "Vessel loading",
      "Ocean freight (paid by seller)",
      "Marine insurance — minimum Clause C only",
    ],
    buyerCovers: [
      "Import customs clearance",
      "Delivery to warehouse",
      "Risk from vessel loading onward (same as FOB)",
    ],
    caution:
      "Risk transfers at vessel loading — identical to FOB. Jinshen chooses the carrier and insurer. Minimum insurance (Clause C) covers only major casualties, not handling damage to precision components. Hassan can't control routing or coverage.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    tagline: "Seller handles everything door-to-door",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    sellerCovers: [
      "Pack goods at factory",
      "Inland transport to origin port",
      "Export customs clearance",
      "Vessel loading",
      "Ocean freight",
      "Marine insurance",
      "Import customs clearance",
      "Import duties & taxes",
      "Delivery to warehouse",
    ],
    buyerCovers: [],
    warning:
      "Jinshen must act as importer of record in your country — filing declarations, paying duties, assuming unknown regulatory risk. Mei already confirmed: DDP is not available for international orders.",
  },
];

export interface ResponsibilityStage {
  id: string;
  label: string;
  correctAnswer: "S" | "B";
}

export const FOB_STAGES: ResponsibilityStage[] = [
  { id: "factory",   label: "Factory pack & load",         correctAnswer: "S" },
  { id: "inland",    label: "Inland transport (origin)",   correctAnswer: "S" },
  { id: "export",    label: "Export customs clearance",    correctAnswer: "S" },
  { id: "loading",   label: "Vessel loading at port",      correctAnswer: "S" },
  { id: "freight",   label: "Ocean freight booking",       correctAnswer: "B" },
  { id: "insurance", label: "Marine insurance",            correctAnswer: "B" },
  { id: "import",    label: "Import customs clearance",    correctAnswer: "B" },
  { id: "delivery",  label: "Delivery to warehouse",       correctAnswer: "B" },
];

export interface CustomsDoc {
  id: string;
  label: string;
  required: boolean;
  description: string;
}

export const CUSTOMS_DOCUMENTS: CustomsDoc[] = [
  { id: "invoice",   label: "Commercial Invoice",     required: true,  description: "Declares the value, description, and quantity of goods." },
  { id: "packing",   label: "Packing List",           required: true,  description: "Details packages, weights, and dimensions per carton." },
  { id: "bol",       label: "Bill of Lading",         required: true,  description: "Carrier-issued title document — proof of shipment." },
  { id: "coo",       label: "Certificate of Origin",  required: true,  description: "Certifies where the goods were manufactured." },
  { id: "license",   label: "Import License",         required: true,  description: "Nexara's authorization to import these components." },
  { id: "techspec",  label: "Technical Spec Sheet",   required: false, description: "Product specifications — resolves HS code classification challenges." },
  { id: "warranty",  label: "Warranty Certificate",   required: false, description: "Manufacturer's warranty — not required for customs clearance." },
  { id: "bankdraft", label: "Bank Draft",             required: false, description: "Payment instrument — not a customs document." },
];

export interface DetentionDay {
  day: number;
  label: string;
  detention: number;
  demurrage: number;
  event: string;
  status: "free" | "charged";
}

export const DETENTION_DAYS: DetentionDay[] = [
  { day: 1, label: "Tuesday",   status: "free",    detention: 0,   demurrage: 0,   event: "Vessel berthed. Container discharged to terminal. Free day begins — no charges yet." },
  { day: 2, label: "Wednesday", status: "charged", detention: 800, demurrage: 0,   event: "Elena discovers no customs entry has been filed. First charged day — clock is running." },
  { day: 3, label: "Thursday",  status: "charged", detention: 800, demurrage: 200, event: "Emergency broker engaged. Customs entry filed that afternoon. Document review triggered overnight." },
  { day: 4, label: "Friday",    status: "charged", detention: 800, demurrage: 200, event: "HS code resolved before noon. Container released. Truck booked for Monday delivery." },
];

export const MATRIX_STAGES = [
  { id: "factory",   label: "Factory pack & load" },
  { id: "inland",    label: "Origin inland transport" },
  { id: "export",    label: "Export customs" },
  { id: "loading",   label: "Vessel loading" },
  { id: "freight",   label: "Ocean freight" },
  { id: "insurance", label: "Marine insurance" },
  { id: "import",    label: "Import customs" },
  { id: "delivery",  label: "Delivery to door" },
];

export const MATRIX_INCOTERMS = ["EXW", "FOB", "CIF", "DDP"] as const;

export const CORRECT_MATRIX: Record<string, string> = {
  "factory-EXW": "B",   "factory-FOB": "S",   "factory-CIF": "S",   "factory-DDP": "S",
  "inland-EXW": "B",    "inland-FOB": "S",     "inland-CIF": "S",    "inland-DDP": "S",
  "export-EXW": "B",    "export-FOB": "S",     "export-CIF": "S",    "export-DDP": "S",
  "loading-EXW": "B",   "loading-FOB": "S",    "loading-CIF": "S",   "loading-DDP": "S",
  "freight-EXW": "B",   "freight-FOB": "B",    "freight-CIF": "S",   "freight-DDP": "S",
  "insurance-EXW": "B", "insurance-FOB": "B",  "insurance-CIF": "S", "insurance-DDP": "S",
  "import-EXW": "B",    "import-FOB": "B",     "import-CIF": "B",    "import-DDP": "S",
  "delivery-EXW": "B",  "delivery-FOB": "B",   "delivery-CIF": "B",  "delivery-DDP": "S",
};

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: "Incoterms", definition: "International Commercial Terms — 11 standardised trade terms published by the ICC defining who is responsible for each stage of an international shipment: loading, transport, customs, insurance, and delivery.", unlocked: false },
  { term: "EXW (Ex Works)", definition: "Minimum seller obligation. Goods are made available at the seller's premises. The buyer handles everything from that point: loading, transport, export customs, ocean freight, insurance, import customs, and delivery.", unlocked: false },
  { term: "FOB (Free on Board)", definition: "The seller loads goods onto the vessel at the named port of origin, covering inland transport and export customs. Risk and cost transfer to the buyer at the ship's rail — who then handles ocean freight, insurance, import customs, and delivery.", unlocked: false },
  { term: "CIF (Cost, Insurance & Freight)", definition: "The seller pays for ocean freight and minimum marine insurance (Clause C) to the destination port — but risk transfers at vessel loading, the same as FOB. The buyer handles import customs and delivery.", unlocked: false },
  { term: "DDP (Delivered Duty Paid)", definition: "Maximum seller obligation. The seller handles everything including import duties in the buyer's country. Rarely agreed to by overseas manufacturers because it requires them to act as importer of record in a foreign jurisdiction.", unlocked: false },
  { term: "Bill of Lading (BOL)", definition: "A legally binding document issued by the carrier serving as: (1) proof of the shipping contract, (2) proof the carrier received the goods, and (3) a title document that controls who can claim the cargo at the destination port.", unlocked: false },
  { term: "Customs Entry / Import Declaration", definition: "The formal document filed with customs authorities declaring the nature, value, quantity, and origin of imported goods. Required before goods can be released from port. Under FOB, this is the buyer's sole responsibility.", unlocked: false },
  { term: "HS Code (Harmonized System)", definition: "A standardised numerical classification used by customs authorities worldwide to categorise traded goods. The correct HS code determines the applicable duty rate. Classification disputes can trigger holds, delays, and penalties.", unlocked: false },
  { term: "Detention & Demurrage", definition: "Port charges for exceeding free time. Detention: charged by the terminal for keeping the container beyond the free period. Demurrage: charged by the shipping line for not returning the empty container within the agreed window.", unlocked: false },
  { term: "Importer of Record", definition: "The entity legally responsible for ensuring imported goods comply with all applicable laws and for paying duties and taxes. Under DDP, the seller becomes importer of record in the buyer's country — a risk most manufacturers refuse to accept.", unlocked: false },
];

export const INITIAL_STATE: GameState = {
  chosenIncoterm: "",
  responsibilityMap: {},
  documentsChecked: [],
  matrixAnswers: {},
  quizScore: 0,
};

export const CONTAINER_DAY_BY_STEP: Record<number, number | null> = {
  1: null,
  2: null,
  3: null,
  4: 1,
  5: 2,
  6: 4,
  7: null,
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
