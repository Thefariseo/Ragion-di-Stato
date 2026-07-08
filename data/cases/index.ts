import type { CaseDef } from "@/types";
import { DAY1_CASES } from "./day1";
import { DAY2_CASES } from "./day2";
import { ARC_CASES } from "./arc";
import { TEXTURE_CASES } from "./texture";
import { CLIMAX_CASES } from "./climax";

const ALL: CaseDef[] = [...DAY1_CASES, ...DAY2_CASES, ...ARC_CASES, ...TEXTURE_CASES, ...CLIMAX_CASES];

/** Mappa id → caso. Unica fonte da cui il motore recupera i casi. */
export const CASES: Record<string, CaseDef> = Object.fromEntries(
  ALL.map((c) => [c.id, c]),
);

export function getCase(id: string): CaseDef | undefined {
  return CASES[id];
}
