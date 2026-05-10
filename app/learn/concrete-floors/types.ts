export type Character = "andre" | "fatima" | "chidi" | "priya" | "yuki" | "ben" | "narrator";

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

export interface SlottingItem {
  sku: string;
  category: string;
  velocity: "A" | "B" | "C";
  currentAisle: number;
  correctZone: "front" | "middle" | "back";
}

export interface PickMethod {
  id: string;
  label: string;
  desc: string;
  icon: string;
  pros: string;
  cons: string;
}

export interface ErrorLogEntry {
  skuGroup: string;
  errorType: string;
  count: number;
  fix: string;
  fixId: string;
}

export interface ReturnItem {
  id: number;
  label: string;
  condition: string;
  grade: "A" | "B" | "C" | "D";
}

export interface GameState {
  slottingCompleted: boolean;
  receivingWindowSet: boolean;
  pickMethodChosen: string;
  zoneDesignApproved: boolean;
  wmsDiscrepanciesFixed: number;
  errorFixesApplied: number;
  returnsProcessed: number;
  dressRehearsalRun: boolean;
  day1Orders: number;
  day2ConveyorFixed: boolean;
  day3TempsCalled: boolean;
  quizScore: number;
  scorecardViewed: boolean;
}
