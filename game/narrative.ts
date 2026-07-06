import { getDay } from "@/data/days";
import { CASES } from "@/data/cases";
import type { GameState } from "@/types";

/**
 * Costruisce la coda della giornata: casi base della giornata + inject sbloccati
 * dalle scelte precedenti (pendingInjects), filtrati per flag.
 */
export function buildDayQueue(
  day: number,
  flags: Record<string, boolean>,
  pendingInjects: string[],
): string[] {
  const dayDef = getDay(day);
  // anche i casi BASE della giornata rispettano appearsIfFlag: così una
  // giornata può avere VARIANTI in base alle scelte passate (NPC che tornano
  // riconoscenti o ostili a seconda di cosa hai fatto).
  const base = (dayDef ? [...dayDef.caseIds] : []).filter((id) => {
    const c = CASES[id];
    if (!c) return false;
    return !c.appearsIfFlag || flags[c.appearsIfFlag] === true;
  });

  for (const id of pendingInjects) {
    const c = CASES[id];
    if (!c) continue;
    if (base.includes(id)) continue;
    if (c.appearsIfFlag && !flags[c.appearsIfFlag]) continue;
    // inject dopo il primo caso, per dargli risalto senza aprire la giornata
    base.splice(Math.min(1, base.length), 0, id);
  }
  return base;
}

export function currentCaseId(s: GameState): string | undefined {
  return s.queue[s.currentCaseIndex];
}
