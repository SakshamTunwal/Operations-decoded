"use client";
export type Character = "sarah" | "james" | "rachel" | "marco" | "narrator";

export interface DialogueLine {
  character: Character;
  text: string;
}

export interface VendorQuote {
  name: string;
  contact: string;
  contactRole: string;
  pricePerTon: number;
  leadDays: number;
  paymentTerms: string;
  total: number;
  responseHours: number;
  hasCOA: boolean;
  hasRefs: boolean;
  tag: string;
  tagColor: string;
  warning?: string;
  highlight?: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  unlocked: boolean;
}

export interface GameState {
  selectedVendorIdx: number | null;
  negotiationChoice: string;
  finalPricePerTon: number;
  rfqItems: string[];
  scorecardComplete: boolean;
  jamesApproved: boolean;
  rachelApproved: boolean;
  quizScore: number;
  rachelAnswer1: string;
  rachelAnswer2: string;
}
