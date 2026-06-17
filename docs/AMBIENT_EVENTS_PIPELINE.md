# AMBIENT EVENTS PIPELINE — il mondo fuori dalla scrivania

Il corridoio ministeriale è **vivo e reattivo**, non una scena statica.

## Implementato — `WorldScene` (corridoio animato reattivo) ✅
Canvas a risoluzione nativa bassa (pixelated), `requestAnimationFrame`, attori
pixel con ciclo di camminata a 2 frame, profondità prospettica, porta illuminata,
manifesto, bandiera, flicker delle luci. **Reattivo allo stato**:
- **caos** ↑ → coda più affollata, agitazione;
- **sospetto** ↑ → più **guardie** in pattuglia, compare un **ispettore** che
  osserva lo sportello (≥42);
- **allarme** (caos alto / flag `attentato`) → tinta rossa, luci nervose,
  bandiera che vira al rosso, pannello "● ALLARME" nello sportello;
- **funzionario che corre** (runner) attraversa il corridoio a intervalli.
Il **richiedente** entra allo sportello (`NpcSprite`, `npcEnter`+`idleBob`).

## Roadmap — `AmbientEvent` (eventi animati con conseguenze) 🔜
Struttura dati estendibile:
```ts
AmbientEvent {
  id; title;
  trigger: { day?; afterCaseIndex?; requiresFlag?; minSospetto?; minCaos? };
  location: "corridor"|"booth"|"desk"|"window"|"telex"|"phone";
  animationId; durationMs; soundIds[];
  involvedFactions[]; involvedNPCs[]; generatedDocuments[];
  dialogue?; consequences[]; flagsSet[];
}
```
Eventi previsti (sprite + suono + conseguenza, non solo testo):
- guardia che **accompagna via** un sospetto (dopo una segnalazione);
- **ispettore** che entra e ti osserva (ispezione → sospetto);
- **busta/pacco** lasciato sotto la porta (→ scelta);
- **telex** che stampa un dispaccio urgente (animazione `telexFeed`);
- **telefono** che squilla → evento;
- corridoio **evacuato** / **serranda** che scende durante una crisi;
- **irruzione** / **fuga** di un militante / qualcuno **portato via**;
- **fascicolo** che cade dallo schedario.

Gli eventi sono **legati a fazioni, lore e scelte precedenti** (vedi
`LORE_BIBLE.md`), mai decorazione casuale. Si integrano con il sistema eventi
esistente (`data/events.ts`, `game/events.ts`) aggiungendo il livello **visivo**.

## World reactivity (regola)
Le conseguenze devono **vedersi**, non essere solo numeri: più servizi = più
omissis e uomini anonimi; più stampa = più giornali/foto; più mafia = minacce e
silenzi; rete attiva = simboli ricorrenti e dossier scomparsi.
