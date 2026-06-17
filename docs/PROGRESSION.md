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

## Curva (stato attuale del prototipo — `data/days.ts`)

| Giorno | Cosa si impara | Regole attive | Fazioni introdotte | Evento |
| --- | --- | --- | --- | --- |
| 1 | Il lavoro: conforme vs. respinto. Nomi, tessere, protocollo. | 3 | la prima che bussa (es. Sindacato/Brigate) + contatto **Anello** | telefonata Anello |
| 2 | Il segreto: RISERVATO/SEGRETO, nulla osta, firme. Esistono gli Affari Interni. | 5 | SIR, Procura, Stampa | ispezione interna |
| 3 | Il peso: provenienza ignota, foto che deve corrispondere, divieti verso la Stampa. Cosa tieni tra le mani a fine giornata. | 7 | Cupola, Rete | busta sotto la porta |

> La struttura è data-driven: aggiungere giornate = aggiungere `DayDef` +
> `caseIds` + `events`, rispettando "una cosa nuova per volta".

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
