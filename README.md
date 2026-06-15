# Ragion di Stato

> Un thriller burocratico nell'Italia della Prima Repubblica.
> Web game liberamente ispirato a **Papers, Please**. Tutto è romanzato:
> partiti, sigle, organizzazioni e persone sono finzione.

Sei un funzionario dell'**Ufficio Validazione e Archivio Centrale** del Ministero
dell'Interno. Dalla tua scrivania passano fascicoli, informative, permessi,
intercettazioni, tessere, ordini riservati. Approvi, respingi, archivi, segnali,
occulti, trasmetti, distruggi. Ogni timbro sposta un equilibrio politico, le
fazioni ti osservano, il sospetto cresce — e la somma delle tue scelte decide
come finisce.

> **«Ogni giorno decidi quale verità entra negli archivi dello Stato, quale
> viene nascosta, quale manipolata e quale distrutta.»**

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS** + CSS globale per la materia analogica (grana, scanline,
  vignetta, carta, timbri)
- **Zustand** (+ `persist`) per stato e salvataggio in `localStorage`
- RNG deterministico (`mulberry32`) per run riproducibili da **seed**
- Effetti sonori sintetizzati via **WebAudio** (nessun asset)
- Interamente client-side → **deploy zero-config su Vercel**

## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build di produzione (statica)
npm run typecheck  # controllo tipi
npm run sim        # simulazione headless del motore (test del core loop)
```

Premi il tasto **`` ` ``** (backtick) o l'ingranaggio ⚙ in alto per aprire il
**pannello di debug** (salta fase/giornata, modifica sospetto/verità/fazioni,
forza un finale).

## Architettura

Principio cardine: **il motore di gioco è separato dalla UI**. La logica vive in
funzioni pure in `game/` che operano su `GameState`; i componenti React leggono
lo stato dallo store e lanciano azioni, senza contenere regole.

```
app/         routing Next.js, layout, CSS globale
components/   UI (screens, desk, hud, ui, debug) — nessuna regola di gioco
game/         MOTORE puro: engine, rules, factions, events, narrative, endings
data/         CONTENUTI tipizzati: factions, rules, cases (g1-3), events, endings, days
types/        tipi condivisi (unica fonte di verità)
lib/          utility pure: rng, format, sfx
store/        Zustand store (+ persist)
docs/         GDD, core loop, architettura, data model, roadmap
scripts/      sim.ts — simulazione headless del motore
```

Documentazione di design completa in [`docs/`](./docs):
[GDD](./docs/GDD.md) · [Core loop](./docs/CORE_LOOP.md) ·
[Architettura](./docs/ARCHITECTURE.md) · [Data model](./docs/DATA_MODEL.md) ·
[Roadmap](./docs/ROADMAP.md) ·
**[Direzione artistica](./docs/VISUAL_DIRECTION.md)**.

## Estetica (design system)

La UI è **diegetica**: console metallica, sportello con il richiedente, scrivania
in feltro/legno, documenti di carta trascinabili, timbri in gomma che colpiscono.
Palette desaturata da archivio (carta, grigio ministeriale, verde militare,
rosso timbro, blu notte, nero inchiostro) e font istituzionali (pixel, terminale
LCD, dattiloscritto, stencil). I token sono in `app/globals.css` (`--rds-*`) con
classi di sistema riusabili (`.rds-*`, `.tex-*`). Le regole sono in
[`docs/VISUAL_DIRECTION.md`](./docs/VISUAL_DIRECTION.md) e ogni nuova feature deve
rispettarle.

## Estendere i contenuti (senza toccare il motore)

- **Fazione** → `data/factions.ts` (+ `FactionId` in `types/`)
- **Caso/documento** → un `CaseDef` in `data/cases/*`
- **Regola di validazione** → una `Rule` in `data/rules.ts`, referenziata nel day
- **Evento** → un `GameEvent` in `data/events.ts`
- **Finale** → un `EndingDef` con `condition(state)` in `data/endings.ts`
- **Giornata** → un `DayDef` in `data/days.ts`

## Contenuto del prototipo

3 giornate · 14+ casi · 6 fazioni core (+6 di lore) · ~7 regole introdotte
progressivamente · 3 eventi · conseguenze cross-day · 6 finali (+ fallback) ·
salvataggio locale · seed riproducibile · pannello debug.

## Deploy su Vercel

Importa il repository su Vercel (preset **Next.js**, nessuna configurazione né
variabile d'ambiente). `next build` produce output statico lato client.
