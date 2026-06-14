import type { CaseDef } from "@/types";
import { DAY1_CASES } from "./day1";
import { DAY2_CASES } from "./day2";
import { DAY3_CASES } from "./day3";

const ALL: CaseDef[] = [...DAY1_CASES, ...DAY2_CASES, ...DAY3_CASES];

/** Mappa id → caso. Unica fonte da cui il motore recupera i casi. */
export const CASES: Record<string, CaseDef> = Object.fromEntries(
  ALL.map((c) => [c.id, c]),
);

export function getCase(id: string): CaseDef | undefined {
  return CASES[id];
}
