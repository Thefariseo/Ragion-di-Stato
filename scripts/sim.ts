/**
 * Simulazione headless del motore: percorre più run automatiche per verificare
 * che il loop (caso → evento → cambio giornata → finale) non si rompa e che gli
 * inject cross-day funzionino. Eseguire con: `npm run sim`.
 */
import {
  createGame,
  chooseCaseAction,
  resolveEvent,
  continueFromSummary,
  resolveNight,
  endActiveCutscene,
} from "@/game/engine";
import { getCase } from "@/data/cases";
import { getEnding } from "@/data/endings";
import { buildDayQueue } from "@/game/narrative";
import type { GameState } from "@/types";

type Strategy = "prima" | "ultima" | { perCase: Record<string, string> };

function pickAction(s: GameState, strat: Strategy): string {
  const caseId = s.queue[s.currentCaseIndex];
  const def = getCase(caseId);
  if (!def) throw new Error(`caso mancante: ${caseId}`);
  if (typeof strat === "object" && strat.perCase[caseId]) return strat.perCase[caseId];
  const idx = strat === "ultima" ? def.actions.length - 1 : 0;
  return def.actions[idx].id;
}

function run(seed: number, strat: Strategy): GameState {
  let s: GameState = { ...createGame(seed), phase: "desk" };
  let guard = 0;
  const seenDays = new Set<number>();
  while (s.phase !== "ending" && guard++ < 500) {
    if (s.phase === "desk") {
      seenDays.add(s.day);
      s = chooseCaseAction(s, pickAction(s, strat));
    } else if (s.phase === "event") {
      s = resolveEvent(s, 0);
    } else if (s.phase === "daySummary") {
      s = continueFromSummary(s); // → night oppure ending
    } else if (s.phase === "night") {
      s = resolveNight(s, {}); // paga il pagabile → giornale del giorno dopo
    } else if (s.phase === "cutscene") {
      s = endActiveCutscene(s); // salta la cutscene → torna alla fase prevista
    } else {
      // title / newspaper / briefing / directives → alla scrivania
      s = { ...s, phase: "desk" };
    }
  }
  if (guard >= 500) throw new Error("loop non terminato (possibile ciclo)");
  return s;
}

function report(label: string, s: GameState) {
  const ending = s.endingId ? getEnding(s.endingId) : undefined;
  console.log(
    `• ${label.padEnd(22)} → finale: ${(ending?.title ?? "—").padEnd(26)} ` +
      `giorno ${s.day} · sospetto ${Math.round(s.player.sospetto)} · ` +
      `verità ${Math.round(s.country.verita)} · processati ${s.processed.length}`,
  );
}

console.log("=== Ragion di Stato — simulazione motore ===\n");

report("sempre prima azione", run(1001, "prima"));
report("sempre ultima azione", run(2002, "ultima"));

// percorso "ribelle": consegna tutto a Procura/Stampa
report(
  "ribelle/trasparenza",
  run(3003, {
    perCase: {
      d1_nota_superiore: "trasmetti_procura",
      d2_informatore: "trasmetti_procura",
      d2_magistrato: "trasmetti_procura",
      d2_giornalista: "trasmetti_stampa",
      d3_politico_nota: "trasmetti_procura",
      d3_innocente_rete: "trasmetti_procura",
      d3_documento_cupola: "trasmetti_procura",
      d3_dossier_finale: "trasmetti_stampa",
    },
  }),
);

// percorso "uomo dell'Anello"
report(
  "complice/insabbia",
  run(4004, {
    perCase: {
      d1_militante: "trasmetti_anello",
      d1_nota_superiore: "distruggi",
      d2_informatore: "occulta",
      d2_giornalista: "occulta",
      d3_politico_nota: "distruggi",
      d3_innocente_rete: "occulta",
      d3_documento_cupola: "occulta",
      d3_dossier_finale: "distruggi",
    },
  }),
);

// verifica inject cross-day: segnalando Renzo deve comparire la sorella al G2
const segnalaRenzo = run(5005, { perCase: { d1_militante: "segnala" } });
const q2 = buildDayQueue(2, { militante_segnalato: true }, ["d2_sorella_renzo"]);
console.log(
  `\n• inject d2_sorella_renzo presente in coda G2: ${q2.includes("d2_sorella_renzo")}`,
);
console.log(
  `• run con segnalazione completata, finale: ${
    getEnding(segnalaRenzo.endingId ?? "")?.title ?? "—"
  }`,
);

console.log("\n=== simulazione completata senza errori ===");
