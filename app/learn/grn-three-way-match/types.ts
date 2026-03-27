"use client";

export type Character = "neil" | "clara" | "otto" | "stefan" | "priya" | "narrator";

export interface DialogueLine {
  character: Character;
  text: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  unlocked: boolean;
}

export interface GameState {
  addedSpecialInstruction: boolean;
  poConfigCode: string;
  scanResult: { correct: number; wrong: number } | null;
  grnAccepted: number;
  grnRejected: number;
  disputeChoice: string;
  invoiceHeld: boolean;
  creditNoteApplied: boolean;
  partialPaymentReleased: boolean;
  replacementReceived: boolean;
  quizScore: number;
}
