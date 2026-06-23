# Progressione dell'esperienza — la curva di "Ragion di Stato"

Ispirata a *Papers, Please*: il giocatore **non viene travolto**. Capisce prima
il lavoro, poi il sistema si complica, emergono anomalie, personaggi, fazioni,
minacce, pressioni morali e conseguenze. La complessità è **gated**: ogni
sistema entra quando il precedente è stato assorbito.

## Principi

1. **Una cosa nuova per volta.** Ogni giornata introduce *al massimo* uno o due
   nuovi concetti (una regola, un canale di evento, una fazione).
2. **Niente cruscotti in faccia.** Durante il turno la scrivania mostra solo
   l'essenziale (orologio, quota, sorveglianza). Famiglia, lucidità, bollettino
   del Paese e registro apparati **non** stanno sul banco: si leggono nel
   **resoconto**, e la *Scheda riservata* completa esce a cadenza (ogni 5 giorni
   o all'ultima giornata) così l'utente capisce com'è messo senza essere
   sommerso ogni minuto.
3. **Le fazioni si presentano, non si elencano.** Un ente compare con una
   **mini-cutscene** (cresta, leitmotiv, pattern) la *prima* volta che tocca il
   tuo sportello — mai come voce di menu.
4. **Gli eventi sono messe in scena.** Telefonata, ispezione, busta sotto la
   porta: piccole cutscene animate, non pop-up. L'inquietudine cresce con la
   regia, non con i numeri.
5. **La tensione sale con il Paese.** `caos` e `sospetto` rendono il corridoio
   più affollato/nervoso, le guardie più presenti, fino all'allarme rosso.

## Curva BERSAGLIO — prime 10 giornate (prima burocrazia, poi sospetto, poi paura, poi compromesso)

| Giorno | Si introduce | Meccanica nuova |
| --- | --- | --- |
| 1 | Controllo base: approva/respingi. Onboarding diegetico. | verdetto formale |
| 2 | Date e protocolli. | regola `protocollo` / scadenze |
| 3 | Documento mancante → **richiedi verifica**. | azione gated `inspected` |
| 4 | Primo **NPC sospetto** (discrepanza da lente). | loop confronto→segnala |
| 5 | Primo **riferimento indiretto** a una fazione. | flag di lore |
| 6 | **Telefonata ambigua** con voice blip. | evento `telefono` + voce |
| 7 | Primo **evento ambientale animato** rilevante. | `AmbientVisual` scriptato |
| 8 | Prima **conseguenza sul giornale**. | `newspaper` reattivo |
| 9 | Prima **scelta morale vera**. | bivio con conseguenze differite |
| 10 | Prima **fazione presentata** con dossier/cutscene. | `crest` + leitmotiv |

## Stato attuale (`data/days.ts`)

Implementati 3 giorni (1–3) con ramp di regole (3→5→7) e fazioni. Il prototipo
**comprime** già parte della curva (l'Anello arriva al G1). Per allinearsi al
bersaglio sopra va **diluito su 10 giornate**: è il principale lavoro di
contenuti rimasto (nuovi `DayDef` + `caseIds` + `events`, "una cosa nuova per
volta"). Le impalcature tecniche per ogni passo esistono già:

- gating azioni (`game/actions.ts`) per i giorni 3–4;
- voice blip (`lib/voice.ts`) per il giorno 6;
- eventi ambientali animati (`AmbientVisual`) per il giorno 7;
- giornale reattivo (`game/newspaper.ts`) per il giorno 8;
- cutscene di fazione (`crest`) per il giorno 10.

## Mappa dei meccanismi che servono la progressione

- **Onboarding morbido**: briefing d'apertura che spiega il ruolo; quota bassa;
  poche regole il primo giorno.
- **Rivelazione graduale dei sistemi**: stat e registro spostati nel resoconto
  (`DaySummaryScreen`, blocco *Scheda riservata*).
- **Introduzione delle fazioni**: `data/cutscenes.ts` → `facCs()` con scena
  `crest`; trigger in `DeskScreen` alla prima comparsa (flag `cs_fac_*`).
- **Eventi come scene**: `EventModal` + `EventScene` (telefono/ispezione/busta/
  telex/voce).
- **Mondo reattivo**: `WorldScene` (corridoio) e `data/ambient.ts` scalano con
  `caos`/`sospetto`.

## Prossimi passi (backlog)

- Estendere a ~10–14 giornate con ramp di regole/fazioni/eventi.
- Anomalie crescenti: documenti contraffatti più sottili, contraddizioni
  multi-foglio, deroghe "dall'alto".
- Archi di personaggi ricorrenti (lo stesso volto che ritorna).
- Pressioni morali con conseguenze differite (giorni dopo).
