import { NIGHT_NEEDS } from "@/data/night";
import type { GameState, NightNeed } from "@/types";

/**
 * Selezione delle spese della notte in base a giornata e stato.
 * Pura (state → bisogni); l'applicazione (resolveNight) è nel motore.
 */
export function buildNightNeeds(state: GameState): NightNeed[] {
  const needs: NightNeed[] = [NIGHT_NEEDS.cibo, NIGHT_NEEDS.affitto];
  if (state.player.famiglia < 60 || state.player.lucidita < 55) {
    needs.push(NIGHT_NEEDS.medicine);
  }
  if (state.day >= 2) {
    needs.push(NIGHT_NEEDS.riscaldamento);
  }
  return needs.filter(Boolean) as NightNeed[];
}
