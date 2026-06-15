import { NEWS_ITEMS } from "@/data/newspapers";
import type { DayDef, GameState, NewspaperView } from "@/types";

/**
 * Costruisce il giornale del mattino, reattivo ai flag: lo Stato che reagisce
 * (o tace, o manipola) in base a ciò che hai fatto passare dalla tua scrivania.
 */
export function buildNewspaper(state: GameState, dayDef: DayDef): NewspaperView {
  const items = NEWS_ITEMS.filter((it) => {
    if (it.requiresFlag && !state.flags[it.requiresFlag]) return false;
    if (it.forbidsFlag && state.flags[it.forbidsFlag]) return false;
    return true;
  }).map((it) => ({ headline: it.headline, body: it.body }));

  return {
    masthead: "Il Mattino",
    date: dayDef.date,
    lead: dayDef.headline,
    items: items.slice(0, 4),
  };
}
