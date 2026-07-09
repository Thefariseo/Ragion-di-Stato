import { NEWS_ITEMS, BASE_NEWS, SIDEBARS } from "@/data/newspapers";
import { hashStr } from "@/lib/rng";
import type { DayDef, GameState, NewspaperView } from "@/types";

/**
 * Costruisce il giornale del mattino, reattivo ai flag: lo Stato che reagisce
 * (o tace, o manipola) in base a ciò che hai fatto passare dalla tua scrivania.
 * Trafiletti reattivi in testa, poi base di giornata; box laterale di regime.
 */
export function buildNewspaper(state: GameState, dayDef: DayDef): NewspaperView {
  const reactive = NEWS_ITEMS.filter((it) => {
    if (it.requiresFlag && !state.flags[it.requiresFlag]) return false;
    if (it.forbidsFlag && state.flags[it.forbidsFlag]) return false;
    return true;
  });
  const base = BASE_NEWS[dayDef.day] ?? [];
  const merged = [...reactive, ...base];

  const lead = merged[0]?.headline ?? dayDef.headline;
  const leadBody =
    merged[0]?.body ??
    "In cronaca, nulla che il palazzo non abbia già approvato. Le pagine interne parlano di calcio e di processioni.";
  const items = merged.slice(1, 5).map((it) => ({ headline: it.headline, body: it.body }));

  return {
    masthead: "Il Mattino",
    date: dayDef.date,
    lead,
    leadBody,
    photoSeed: hashStr(lead),
    items,
    sidebar: SIDEBARS[dayDef.day] ?? { title: "IL COMMENTO", body: "La macchina dello Stato prosegue, imperturbabile." },
  };
}
