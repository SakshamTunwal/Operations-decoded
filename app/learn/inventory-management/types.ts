export type Character = "zara" | "kwame" | "isabelle" | "margaret" | "patrick" | "narrator";

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
  icon: string;
  location: string;
  time: string;
}

export interface GameState {
  auditFlagged: string[];
  stockoutUnderstood: boolean;
  carryingCostCalculated: boolean;
  ropBuilt: boolean;
  bullwhipAnswers: Record<string, string>;
  abcAnswers: Record<string, string>;
  dashboardReviewed: boolean;
  quizScore: number;
}
