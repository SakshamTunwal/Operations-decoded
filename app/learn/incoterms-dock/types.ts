export type Character = "elena" | "hassan" | "mei" | "frank" | "narrator";

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
  chosenIncoterm: string;
  responsibilityMap: Record<string, string>;
  documentsChecked: string[];
  matrixAnswers: Record<string, string>;
  quizScore: number;
}
