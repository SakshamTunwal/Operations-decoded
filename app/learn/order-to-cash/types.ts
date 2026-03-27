export type Character = "nina" | "carlos" | "sam" | "leo" | "grace" | "narrator";

export interface DialogueLine {
  character: Character;
  text: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  unlocked: boolean;
}

export interface StepConfig {
  num: number;
  label: string;
  doc: string;
  location: string;
  time: string;
  icon: string;
}

export interface GameState {
  salesOrderBuilt: boolean;
  atpScore: number;           // 0–3 correct batch classifications
  acknowledgementCorrect: boolean;
  qualityDecision: string;    // "ship-all" | "pull-and-notify" | "ship-defects"
  invoiceScore: number;       // 0–5 correct invoice fields
  arEscalationScore: number;  // 0–4 correct escalation choices
  creditTermsCorrect: boolean;
  quizScore: number;
}
