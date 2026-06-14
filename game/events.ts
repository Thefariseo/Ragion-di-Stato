import { getDay } from "@/data/days";
import { EVENTS } from "@/data/events";
import type { GameState } from "@/types";

/**
 * Sceglie l'eventuale evento da far scattare dopo aver processato `processed`
 * casi della giornata. Rispetta requiresFlag/forbidsFlag e non ripete eventi.
 * Gli eventi scriptati hanno `afterCaseIndex` fisso; i candidati casuali
 * vengono pesati altrove (estensione futura).
 */
export function pickEventAfter(
  s: GameState,
  processed: number,
): string | undefined {
  const dayDef = getDay(s.day);
  if (!dayDef) return undefined;

  for (const id of dayDef.events) {
    const ev = EVENTS[id];
    if (!ev) continue;
    if (s.firedEvents.includes(id)) continue;
    if (ev.afterCaseIndex !== processed) continue;
    if (ev.requiresFlag && !s.flags[ev.requiresFlag]) continue;
    if (ev.forbidsFlag && s.flags[ev.forbidsFlag]) continue;
    return id;
  }
  return undefined;
}
