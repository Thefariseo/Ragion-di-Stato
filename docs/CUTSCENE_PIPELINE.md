# CUTSCENE PIPELINE

Cutscene **data-driven** (in-engine, sprite + testo + suono + musica + timeline),
non hardcoded. Stile 8/16-bit: pochi frame, transizioni secche, testo
dattiloscritto, timbri che cadono, stemmi che compaiono. Skippabili.

## Modello dati (`types/`, `data/cutscenes.ts`)
```ts
Cutscene { id; beats: CutsceneBeat[] }
CutsceneBeat {
  bg?: "black"|"corridor"|"archive"|"paper"|"desk";
  visual?: "none"|"letter"|"stamp"|"newspaper"|"emblems"|"telex"|"folder";
  emblems?: { faction; caption }[];   // presentazione fazione
  title?; lines?: string[];           // testo battuto (Typewriter)
  stampLabel?;                         // timbro che cala (slam)
  sound?: "type"|"stamp"|"telex"|"thud"|"paper"|"ring";
  music?: string;                     // cue colonna sonora
  durationMs?;                        // se assente, avanza al click
}
```

## Motore (`components/cutscene/CutsceneEngine.tsx`)
Riproduce i beat in sequenza: sfondo + visual + testo battuto, suono e musica per
beat, avanzamento a click (o auto con `durationMs`), pulsante **Salta**. A fine
sequenza chiama `onDone`.

## Fase & trigger (`game/engine.ts`, store)
- Fase dedicata `cutscene` + `GameState.activeCutscene` + `cutsceneReturn`.
- `playCutscene(id, ret)` → entra in cutscene; `endActiveCutscene()` → torna alla
  fase `ret` e segna il flag `cs_<id>` (vista una sola volta).
- **Trigger fazione**: in `DeskScreen`, alla prima comparsa di un caso di una
  fazione (`fac_<id>` non ancora visto) parte la sua cutscene, poi si torna al caso.
- **Trigger finale**: `continueFromSummary` instrada il finale attraverso
  `end_generic` prima dell'epilogo.

## Implementate
`intro` (nomina → Paese → schedario fazioni → ruolo) · `fac_governo/sir/anello/
brigate/procura/stampa` (presentazione alla prima comparsa) · `end_generic`.

## Roadmap (🔜)
- Cutscene per **ogni finale** (assorbito/arresto/fuga/scandalo/servizi/procura/
  rete/segreto) con documento conclusivo + timbro + giornale.
- Cutscene per **eventi gravi** (attentato, crisi nazionale, scoperta della Rete,
  tradimento) con trigger su flag/stato.
- `type: "video"` opzionale (WebM) se serviranno sequenze più ricche.
- `CutsceneScene` con timeline a `startMs`/`durationMs`, sprite multipli e camera.
