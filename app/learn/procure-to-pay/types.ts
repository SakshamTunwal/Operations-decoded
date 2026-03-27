export type Character = "marcus" | "diana" | "leon" | "narrator";

export interface GlossaryTerm {
  term: string;
  definition: string;
  unlocked: boolean;
}

export interface Vendor {
  name: string;
  price: number;
  lead: number;
  rating: number;
  stars: number;
  track: string;
  tag: string;
  tagColor: string;
  warning?: string;
  recall?: boolean;
}

export interface StepConfig {
  num: number;
  label: string;
  doc: string;
  location: string;
  time: string;
  icon: string;
}

export interface QuantityOption {
  value: number;
  label: string;
  implication: string;
  recommended?: boolean;
}

export interface UrgencyOption {
  value: string;
  label: string;
  days: string;
  color: string;
}

export interface POErrorField {
  field: string;
  label: string;
  wrong: string;
  correct: string;
}

export interface DialogueLine {
  character: Character;
  text: string;
}

export interface GameState {
  chosenQuantity: number;
  chosenUrgency: string;
  criteriaRanking: string[];
  selectedVendorIdx: number | null;
  poErrorsFound: number;
  grnQuantityReceived: number;
  quizScore: number;
  approvalChoice: string;
  prReason: string;
}
