export type Character = "tom" | "isabelle" | "vanessa" | "chloe" | "omar" | "narrator";

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
  problemsIdentified: boolean;
  seasonalityBuilt: boolean;
  intelligenceGapAnalyzed: boolean;
  mapeCalculated: boolean;
  sopConsensusReached: boolean;
  assumptionsLogged: boolean;
  resultsReviewed: boolean;
  quizScore: number;
}
