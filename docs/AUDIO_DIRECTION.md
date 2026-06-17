# AUDIO DIRECTION

Audio come parte dell'immaginario. Funzione vicina a Papers, Please — **emulata,
non copiata** (nessuna melodia/traccia proprietaria). Tono: **marziale, minimale,
burocratico, cupo, solenne, freddo, oppressivo, memorabile.** Niente horror
generico, niente earrape, niente loop fastidiosi, niente clipping.

## Sistema (`lib/music.ts` + `lib/sfx.ts`) ✅
Tutto **procedurale WebAudio**, zero asset. Master gain basso, lowpass per
oscurità, drone basso continuo. Parte dopo il primo gesto utente (policy browser).
Toggle audio (♪) globale (musica + sfx).

## Musica — temi (✅ 4 di base)
| Tema | Uso | Carattere |
|---|---|---|
| `solenne` | titolo, intro, cutscene, finali | marziale, lento, minore, ottoni scuri + kick |
| `lavoro` | scrivania | **quasi solo ambiente**, drone + tick, non invasivo |
| `tensione` | eventi, crisi, presentazioni servizi/anello/brigate | minore dissonante, pulsante |
| `finale` | epilogo | grave, lento, pesante |
Legati alla **fase** (`Game` → `THEME_FOR`); le cutscene impongono il loro cue.

## SFX (✅) — secchi, analogici
`stamp` (timbro), `click`, `paper` (carta in entrata), `telex`, `drawer`
(cassetto), `ring` (telefono), `thud`. Collegati: timbro, carta all'arrivo del
caso, telex negli eventi telex, cassetto nell'archivio.

## Roadmap (🔜)
1. **Leitmotiv per fazione** (4–8 battute): DS marcia istituzionale, SIR/Anello
   minore freddo, BP ritmo cospirativo, Procura tema sobrio, Stampa motivo
   nervoso. Suonati nelle cutscene di presentazione e quando la fazione domina.
2. **Ambiente sonoro d'ufficio** in loop morbido durante il lavoro: ronzio del
   **neon**, **pioggia**, **sirene lontane**, macchina da scrivere, passi, brusio,
   ventilatore. Da miscelare sotto `lavoro` (volume bassissimo).
3. **One-shot** per eventi ambientali (serranda, allarme, porta, irruzione).
4. **AudioSystem** con: tracks, ambient loops, one-shot, leitmotiv, fade in/out,
   ducking (abbassa la musica quando parte un suono importante), bilanciamento.

## Regole
- Durante il lavoro: **soprattutto ambiente**; la musica vera entra nei momenti
  chiave (intro, cutscene, presentazioni, crisi, finali).
- Volumi controllati, nessuna frequenza acuta aggressiva, fade per i cambi.
