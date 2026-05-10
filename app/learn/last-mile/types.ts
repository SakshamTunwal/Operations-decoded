export type Character = "maya" | "anita" | "richard" | "jerome" | "derek" | "narrator";

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

export interface DialogueLine {
  character: Character;
  text: string;
}

export interface TransportScenario {
  id: string;
  description: string;
  weight: string;
  destination: string;
  urgency: string;
  correctMode: "ftl" | "ltl" | "express";
}

export interface CostComponent {
  id: string;
  label: string;
  amount: number;
  description: string;
  category: "base" | "surcharge" | "hidden";
}

export interface ScorecardMetric {
  id: string;
  label: string;
  current: number;
  unit: string;
  benchmark: number;
  direction: "higher" | "lower";
  description: string;
}

export interface PODRecord {
  id: number;
  delivery: string;
  date: string;
  value: number;
  status: "paper" | "missing" | "digital";
  actionable: boolean;
}

export interface EvidenceDocument {
  id: string;
  label: string;
  icon: string;
  stage: number;
  description: string;
}

export interface GameState {
  transportModesDone: number;
  costModelBuilt: boolean;
  trueHiddenCostRevealed: boolean;
  scorecardBuilt: boolean;
  podRecovered: number;
  podBacklogCleared: boolean;
  claimApproved: boolean;
  evidenceChainComplete: boolean;
  hybridModelChosen: boolean;
  inHouseRoutesSelected: number;
  slaTargetsSet: boolean;
  contractNegotiated: boolean;
  quizScore: number;
  scorecardViewed: boolean;
}
