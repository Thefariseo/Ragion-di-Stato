# Audit eventi / azioni / conseguenze

Stato dopo l'intervento "eventi animati + voice blip + gameplay sistematico".

## Eventi: solo testo → animati

| Evento | Prima | Ora |
| --- | --- | --- |
| `ev_telefono_anello` | popup testo | **scena**: telefono che squilla (onde) + voce telefonica (blip banda stretta) |
| `ev_ispezione` | popup testo | **scena**: porta che si apre, due agenti in controluce + voce ministero |
| `ev_busta` | popup testo | **scena**: busta che scivola sotto la porta |
| `ev_grazie_renzo` | popup testo | scena "busta" (biglietto) |
| Ambientali corridoio (13) | **solo didascalia** | **animati** (`AmbientVisual`): scorta, plico, telex, passi, porta, neon, spioncino, fascicolo, ispettore, sirena, allarme, convoglio |
| Crisi del Paese | nessuna | **cutscene `attentato`** (skyline, esplosione, allarme, headline) |
| Cambio fase | taglio secco | **serranda** (`PhaseTransition`) |

→ Criterio "nessun evento importante è solo testo": coperto per gli eventi
principali e per ≥8 ambientali animati. Il testo ACCOMPAGNA la scena.

## Dialoghi: voice blip

`VoiceBlipSystem` (`lib/voice.ts`) — mormorii non verbali sincronizzati col
`Typewriter`. 9 profili: comune, ministero, superiore, servizi, stampa,
magistratura, criminalità, armati, telefono (banda stretta). Mappati per
fazione (`voiceForFaction`) e canale (`voiceForChannel`). Toggle dedicato
"VOCE" nelle opzioni audio.

→ Criterio "i dialoghi hanno voice blip": coperto (intro casi, eventi, righe di
cutscene delle fazioni).

## Azioni: casuali → giustificate

`ActionEngine` (`game/actions.ts`) — ogni azione può dichiarare `requires`
(inspected / discrepancyFound / ruleViolation / noViolation / authLevel /
hasDocKind / flag / fromDay). `availableActions`/`actionAvailability` filtrano;
l'azione **bloccata resta visibile con il motivo** (insegna il loop).

Loop sistematico (10 passi) ora supportato:
1. ricevi caso → 2. osservi NPC (booth) → 3. analizzi documenti (drag) →
4. confronti (lente) → 5. trovi discrepanze → 6. regole/strumenti →
7. **azione coerente** (sbloccata da 4–6) → 8. ammenda/feedback →
9. giornale/fazioni/mondo reagiscono → 10. la run cambia (flag/unlockCases).

Esempio implementato — `d1_militante` (brigatista):
- `approva` / `respingi`: sempre (verdetto formale);
- `segnala`: **bloccato finché non trovi la contraddizione** (lente);
- `proteggi`: bloccato finché non esamini la pratica;
- `trasmetti all'Anello`: richiede un atto riservato in pratica.

Vocabolario azioni ampliato (type `ActionKind` + `ActionTarget`): approva,
respingi, archivia, segnala, verifica/richiedi verifica, trattieni, occulta,
censura, distruggi, proteggi, incastra, convoca, non_registra, trasmetti
(→ ministero/magistratura/stampa/servizi).

→ Resta da fare: applicare `requires` a TUTTI i casi (qui dimostrato su uno) e
authoring delle nuove azioni "trasmetti a…" dove ha senso.

## Conseguenze: tracciabilità

Già tracciate da `applyConsequence` → `log`, `processed`, `citations`,
`firedEvents`, flag, `unlockCases`. Reazione del giornale via flag
(`game/newspaper.ts`). Feedback visivo per scelta: timbro animato + ammenda a
scontrino sugli errori gravi; mancano feedback dedicati per le azioni speciali
(occulta/distruggi/trasmetti) → backlog.

## Eventi senza funzione chiara

`passi`, `porta`, `protesta`, `spioncino` sono puramente atmosferici: ora hanno
almeno una resa visiva. Valutare se collegarne alcuni a conseguenze leggere
(es. `spioncino` → +sospetto se quota bassa).
