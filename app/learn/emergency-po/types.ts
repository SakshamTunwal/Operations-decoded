export type Character = "ryan" | "victor" | "helen" | "narrator";

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
  procurementDecision: string;       // "personal-card" | "emergency-po" | "wait-monday" | ""
  emergencyClassification: string;   // "genuine" | "planning-failure" | ""
  justificationScore: number;        // 0–4 correct fields
  receiptScore: number;              // 0–3 correct items
  auditComplete: boolean;
  frameworkScore: number;            // 0–4 correct matches
  quizScore: number;
}
