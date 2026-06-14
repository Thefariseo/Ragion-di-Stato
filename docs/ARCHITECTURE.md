# Architettura tecnica (Next.js + Vercel)

## Stack
- **Next.js 15 (App Router)** — output statico/SSR-less: il gioco è interamente
  client-side, nessun dato server necessario in v1. Deploy zero-config su Vercel.
- **React 19 + TypeScript 5** (strict).
- **Tailwind CSS 3.4** per layout/utility + **CSS globale** per la materia
  analogica (grana, scanline, vignetta, texture carta, animazioni timbro).
- **Zustand 5** (+ `persist`) per lo stato globale della run e il salvataggio in
  `localStorage`. Leggero, niente boilerplate.
- **RNG deterministico** (`mulberry32`) per run riproducibili da seed.
- Nessuna dipendenza pesante. DB futuro (Supabase/Neon) opzionale, non in v1.

## Principio cardine: motore separato dalla UI
La **logica di gioco è composta da funzioni pure** in `/game` che operano su
`GameState` e restituiscono nuovo stato (stile reducer). I componenti React
leggono lo stato dallo store e invocano azioni; **non contengono regole**. Questo
rende il motore testabile, il rendering sostituibile, e il tutto facilmente
espandibile.

```
UI (components) ──dispatch──▶ store (zustand) ──chiama──▶ engine (/game, puro)
        ▲                                                      │
        └──────────────── nuovo GameState ◀────────────────────┘
data (/data) ─── contenuti tipizzati letti dall'engine
```

## Struttura cartelle
```
app/                 # routing Next.js (App Router)
  layout.tsx         # font, metadata, CSS globale
  page.tsx           # monta <Game/> (client)
  globals.css        # estetica analogica globale + Tailwind

components/          # UI e interfaccia (nessuna regola di gioco)
  Game.tsx           # macchina a stati delle schermate
  screens/           # Title, Briefing, Directives, Desk, DaySummary, Ending
  desk/              # Desk, Dossier, DocumentCard, StampTray, Rulebook, tools…
  hud/               # StatusBar, indicatori Paese, fazioni
  ui/                # primitive: PaperSheet, Stamp, InkButton, Typewriter…
  debug/             # DebugPanel

game/                # MOTORE (puro, niente React)
  engine.ts          # applyConsequence, deltas, advanceDay, init
  rules/             # validazione documenti (validateCase)
  factions/          # applicazione delta + reazioni a catena
  events/            # selezione eventi per giornata
  documents/         # helper/generatori documentali
  narrative/         # assemblaggio coda della giornata + inject cross-day
  endings/           # evaluateEndings

data/                # CONTENUTI tipizzati (TS data files)
  factions.ts  rules.ts  events.ts  endings.ts  days.ts
  cases/day1.ts day2.ts day3.ts  index.ts

types/               # tipi TypeScript condivisi (un solo punto di verità)
lib/                 # utility pure: rng, save, format, sfx, id
hooks/               # hook React (selettori, typewriter, sfx)
styles/              # token/temi addizionali se servono
docs/                # GDD, core loop, architettura, data model, roadmap
```

## Flusso dati di una decisione
1. `DeskScreen` mostra il caso corrente (da `selectCurrentCase`).
2. Il giocatore sceglie un'azione → `store.chooseAction(caseId, actionId)`.
3. Lo store chiama `engine.applyConsequence(state, consequence)` → nuovo stato
   (fazioni via `factions.applyFactionDeltas` con reazioni a catena; risorse;
   Paese; flag; sblocchi).
4. `persist` salva in `localStorage`. La UI si ri-renderizza dai selettori.
5. A coda esaurita → `engine.endDay` calcola la sintesi; `evaluateEndings`
   verifica se scatta un finale.

## Estendibilità (aggiungere contenuti senza toccare il motore)
- **Nuova fazione**: aggiungi a `data/factions.ts` (+ eventuale `id` nei tipi).
- **Nuovo documento/caso**: aggiungi un `CaseDef` in `data/cases/*`.
- **Nuova regola**: aggiungi una `Rule` in `data/rules.ts` e referenziala nel day.
- **Nuovo evento**: aggiungi un `GameEvent` in `data/events.ts`.
- **Nuovo finale**: aggiungi un `EndingDef` con `condition(state)` in
  `data/endings.ts`.
- **Nuova giornata**: aggiungi un `DayDef` in `data/days.ts` + file casi.

Il motore non conosce i contenuti specifici: itera su dati tipizzati.

## Salvataggio
- `persist` (Zustand) serializza `GameState` in `localStorage`
  (`ragion-di-stato/save`). Export/import JSON via `lib/save.ts`.
- Versione dello schema `SAVE_VERSION` per migrazioni future.

## Debug
- `DebugPanel`: salta giornata, forza flag, modifica indicatori/fazioni/sospetto,
  rigenera coda, anteprima finali, reimposta seed. Attivabile in dev o con tasto.

## Deploy su Vercel
- Repo → import su Vercel → preset **Next.js**, zero config.
- Build `next build`; nessuna env var richiesta in v1.
- `next/font/google` per i font (risolti a build-time).
- Output completamente statico lato client: ottimo TTFB e costi nulli.
