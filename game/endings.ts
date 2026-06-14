import { ENDINGS } from "@/data/endings";
import { LAST_DAY } from "@/data/days";
import type { EndingDef, GameState } from "@/types";

/** Finale a priorità massima la cui condizione è vera (fallback compreso). */
export function evaluateEndings(s: GameState): EndingDef {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority);
  for (const e of sorted) {
    if (e.condition(s)) return e;
  }
  // sistema_immutato è sempre vero, ma per sicurezza:
  return sorted[sorted.length - 1] as EndingDef;
}

/**
 * Determina se a fine giornata scatta un finale.
 * - Ultima giornata: si valuta sempre (con fallback).
 * - Prima: solo i finali "anticipati" (arresto per sospetto eccessivo).
 */
export function resolveDayEnding(s: GameState): string | undefined {
  if (s.day >= LAST_DAY) {
    return evaluateEndings(s).id;
  }
  if (s.player.sospetto >= 75) return "arrestato";
  return undefined;
}
