# PIPELINE.md — la macchina burocratica narrativa di *Ragion di Stato*

> Pipeline ispirata a **Papers, Please** (struttura a giornate, controllo
> documentale, regole progressive, errori, conseguenze, fazioni, finali),
> adattata a un thriller burocratico-politico della **Prima Repubblica**.
> Principio: **logica separata dal rendering** (motore puro in `game/`, React
> visualizza). Legenda stato: ✅ implementato · 🟡 parziale · 🔜 roadmap.

---

## 1. Macchina a stati della run

Stati logici (mappati su `GamePhase` in `types/`):

```
TITLE ─▶ MORNING_NEWSPAPER ─▶ DAILY_BRIEFING ─▶ RULE_UPDATE(directives)
      ─▶ WORK_DESK ⇄ SPECIAL_EVENT ─▶ (coda esaurita) ─▶ END_OF_DAY_REPORT
      ─▶ NIGHT_MANAGEMENT ─▶ (advanceDay) ─▶ MORNING_NEWSPAPER …
END_OF_DAY_REPORT ─▶ ENDING_CHECK ─▶ ENDING (se scatta) | NIGHT (altrimenti)
```

`GamePhase = title | newspaper | briefing | directives | desk | event |
daySummary | night | ending`. Le transizioni vivono **solo** nel motore
(`game/engine.ts`): `createGame`, `chooseCaseAction`, `resolveEvent`, `endDay`,
`continueFromSummary`, `resolveNight`, `advanceDay`. La UI invoca azioni dello
store e legge lo stato; non contiene transizioni. ✅

Flusso di una giornata (engine):
`advanceDay → newspaper → briefing → directives → desk(↻ casi+eventi) → endDay →
daySummary → (ending? ending : night) → advanceDay`.

## 2. Pipeline della giornata — `DayDef` (`data/days.ts`) ✅🟡

Campi attuali: `day, date, headline, briefing[], directives[], ruleIds[],
caseIds[], events[], quota, payPerCase`. Estensioni 🔜: `removedRules[]`,
`randomCasePools[]`, `timeLimitSeconds`, `factionPressure[]`, `endingChecks[]`.
Le **conseguenze cross-day** sono già gestite via `flags` + `pendingInjects`
(inject di casi sbloccati). ✅

## 3. Pipeline del caso — `CaseDef` (`data/cases/*`) ✅

`pesca/script → documenti → discrepanze → scrivania → lettura/confronto →
decisione → valutazione procedurale (citazione) + politica/morale (Consequence) →
update fazioni/sospetto/Paese/flag/NPC → archivio (`processed[]`)`. Azioni:
approva/respingi/archivia/segnala + speciali per caso (trasmetti a
SIR/Procura/Stampa/Anello, occulta, distruggi, proteggi, incastra, verifica). ✅

## 4. Pipeline documentale — `GameDocument` (`types/`) ✅🟡

Documento = oggetto di gameplay **e** frammento narrativo: campi confrontabili
(`comparable`), corpo, foto procedurale, timbri, righe censurate, protocollo,
livello di autorizzazione. Resa: carta intestata per ente, righe, filigrana,
firma, bordo perforato (`DocumentCard`). 🔜 marche a coordinate su sfondi-sprite
per tipo; stato chiuso/aperto.

## 5. Pipeline regole — `Rule` + `data/rules.ts` ✅

Regole progressive per giornata (`DayDef.ruleIds`), motore `validateCase` →
`{inRegola, violations[]}`. Regolamento diegetico (`Rulebook`). **Inspection
mode** 🟡: confronto di due campi → rivela discrepanza (lente). 🔜 correlazione
campo↔regola e accettazione di più percorsi logici.

## 6. Pipeline tempo/pressione ✅🟡

Orologio d'ufficio (`clock`), **quota** minima, paga per pratica, **penalità**
sotto quota. 🔜 timer reale opzionale, casi pagati/non pagati oltre tempo.

## 7. Pipeline errori/citazioni — `Citation` (`game/citations.ts`) ✅ (NUOVO)

Ogni decisione è valutata su due livelli: **procedurale** (genera `Citation` con
multa se l'azione contraddice il regolamento/validazione) e **politico-morale**
(la `Consequence` autoriale). Le multe si scalano dalla paga di fine giornata.
Nei primi giorni la citazione è leggibile; può diventare più opaca. `Citation {
id, day, caseId, reason, severity, fine, ruleId?, visibleToPlayer }`.

## 8. Pipeline fazioni — `FactionDef`/`FactionStanding` (`data/factions.ts`) ✅

6 core (+6 lore): reputazione, sospetto, **reazioni a catena** (favorire una
insospettisce le rivali). 🔜 influenza e matrice alleanze/ostilità esplicita.

## 9. Pipeline NPC — `data/npcs.ts` + `game/npc.ts` 🟡 (NUOVO scaffold)

NPC ricorrenti (Renzo Calabro, Giudice Ardenti, Cronista Bechis…) con **stato
derivato dai flag** (aiutato/segnalato/protetto/tradito). Mostrati nella
**Rubrica** della notte. 🔜 stato persistente dedicato + apparizioni condizionate
multi-giornata.

## 10. Pipeline eventi scripted+random — `GameEvent` (`data/events.ts`) ✅

Eventi scriptati (giorno/flag/`afterCaseIndex`) e candidati pesati. **Seed-based
riproducibile** (`lib/rng.ts`). 🔜 pool random di casi generati.

## 11. Pipeline giornale — `game/newspaper.ts` + `data/newspapers.ts` ✅ (NUOVO)

Ogni giornata apre col **giornale del mattino**, reattivo: la testata sceglie
titoli in base ai **flag** (scandalo se hai passato un dossier alla stampa,
versione manipolata se hai favorito l'Anello, silenzio se hai occultato). Dà
worldbuilding e anticipa tensioni.

## 12. Pipeline notte/risorse — `game/night.ts` + `NightScreen` ✅ (NUOVO)

Dopo il lavoro: **bilancio familiare**. Spese (affitto, cibo, medicine,
riscaldamento) generate da giorno+stato; il giocatore **paga o salta**. Pagare
deduce dallo stipendio; saltare colpisce famiglia/lucidità e genera **debiti**.
Pressione morale ed economica, non un secondo gioco. Risorse: `stipendio,
debiti, famiglia, lucidita, sospetto`.

## 13. Pipeline finali — `EndingDef` (`data/endings.ts`) ✅

I finali emergono dalla **somma** (flag + soglie fazioni + sospetto + stato del
Paese). `evaluateEndings` sceglie a priorità; fallback "sistema immutato".
`resolveDayEnding` valuta a fine giornata (arresto anticipato / valutazione
finale all'ultimo giorno). 🔜 `EndingCondition` dichiarativa (flags/soglie/NPC).

## 14. Pipeline estetica/UI ✅🟡

UI **diegetica** a tutto schermo: sportello (scena pixel) + scrivania (legno) +
console. Palette estratta, font pixel, `image-rendering: pixelated`, timbri
fisici con battuta+suono. 🔜 viewport a **risoluzione logica fissa** (~570×320)
con scaling intero; marche documentali a coordinate.

## 15. Architettura tecnica

```
game/        MOTORE puro: engine.ts, factions.ts, rules.ts, events.ts,
             narrative.ts, endings.ts, citations.ts(NUOVO), night.ts(NUOVO),
             newspaper.ts(NUOVO), npc.ts(NUOVO)
data/        days, rules, factions, cases/*, events, endings,
             newspapers(NUOVO), night(NUOVO), npcs(NUOVO)
types/       tipi condivisi (un solo punto di verità)
store/       Zustand + persist (localStorage), seed e stato salvati
components/  screens (newspaper, briefing, directives, desk, daySummary,
             night, ending), desk/*, hud/*, ui/*, debug/*
lib/         rng (seed), format, sfx
```

React **non** contiene logica profonda: chiama `store` → `engine` (puro) →
nuovo `GameState`. Salvataggio automatico (`persist`), `SAVE_VERSION` per reset
su cambio schema. Debug panel: salta fase/giorno, modifica fazioni/sospetto,
forza finale.

## 16. Vertical slice — stato

3 giornate · 14 casi · 6 fazioni · 13 tipi documento · discrepanze multiple ·
3 eventi (2 scripted +1) · reputazione+sospetto · **citazioni (NUOVO)** ·
**giornale del mattino (NUOVO)** · **notte/risorse (NUOVO)** · 6 finali · save ·
debug · Vercel. 🔜 prossimi: NPC persistenti, pool random, inspection campo↔regola,
viewport pixel fisso, più contenuti.

## 17. Principio guida

Ogni sistema deve aumentare **pressione, ambiguità, immersione, conseguenze o
rigiocabilità**. Altrimenti è decorazione e va tagliato. Il gioco: riceve casi →
applica regole → genera dubbi → forza decisioni → registra conseguenze → cambia
il mondo (giornale/fazioni/Paese) → prepara la giornata dopo.

## 18. Roadmap di build (ordine)

1. ✅ PIPELINE.md · 2. ✅ state machine (engine) · 3. ✅ tipi · 4. ✅ data ·
5. ✅ motore puro · 6. ✅ documenti · 7. 🟡 inspection/discrepanze ·
8. ✅ decisioni/conseguenze + **citazioni** · 9. ✅ fazioni/sospetto ·
10. ✅ UI scrivania · 11. ✅ **giornale/briefing/notte** · 12. ✅ salvataggio ·
13. ✅ debug · 14. 🔜 NPC persistenti, pool random, viewport pixel fisso, test
end-to-end esteso.
