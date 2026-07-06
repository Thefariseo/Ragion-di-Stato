# CORE LOOP — minuto per minuto

L'unità è la **giornata lavorativa**. Una run = 10 giornate finché non scatta un
finale. Macchina a stati:
`TITLE → INTRO → NEWSPAPER → BRIEFING → DIRECTIVES → DESK ⇄ EVENT → DAY_SUMMARY →
NIGHT → (giorno dopo) … → ENDING` (+ `CUTSCENE` in overlay).

## Il loop del singolo CASO (il cuore)
1. **Ricevi un caso** (`DeskScreen` → coda della giornata).
2. **Osservi l'NPC e il contesto**: figura allo sportello (`NpcSprite`), voce con
   **voice blip** (`Typewriter` + `lib/voice`), nameplate, fazione, carta intestata.
3. **Controlli i documenti**: li trascini (`Draggable`), leggi campi/omissis/timbri.
4. **Confronti le informazioni**: lente «Confronta» (`Dossier`), selezioni due campi.
5. **Trovi le discrepanze** (`game/discrepancies` → `DiscrepancyEngine`): la nota
   spiega la contraddizione; sblocca le azioni che richiedono una prova.
6. **Applichi le regole** del giorno (`game/rules` → `RuleEngine`): conforme o no.
7. **Scegli un'azione coerente**: l'`ActionEngine` (`game/actions`) mostra solo le
   azioni **giustificate** (denuncia→prova; trasmetti/occulta/distruggi→esame);
   le altre restano visibili ma **bloccate col motivo**.
8. **Ricevi conseguenze**: timbro animato + (su errore grave) **ammenda a
   scontrino**; `Consequence` applicata (`applyConsequence`).
9. **Il mondo reagisce**: fazioni (reputazione/sospetto), NPC, **flag** che il
   giorno dopo muovono **giornale**, **eventi**, **casi-ritorno**, **finali**.

## Il TEMPO (la pressione)
Alla scrivania **il tempo scorre da solo** (1 minuto di gioco al secondo);
ogni pratica evasa costa +40', ogni evento +15'. **Alle 18:00 l'ufficio chiude**
comunque: le pratiche non evase sono quota mancata, e la quota mancata si paga.
Leggere tutto, confrontare tutto, ha un costo. È il trade-off centrale del turno.

## Il loop della GIORNATA
`NEWSPAPER` (specchio delle scelte di ieri) → `BRIEFING`/`DIRECTIVES` (la regola
nuova) → `DESK` (i casi, gli eventi gated) → `DAY_SUMMARY` (compenso, ammende,
note del superiore; ogni 5 giorni/ultima la *Scheda riservata*) → `NIGHT`
(economia familiare) → giorno dopo, che **parte da quei flag**.

## La connessione (vedi CONSEQUENCE_PIPELINE.md)
Ogni passo 8–9 scrive **flag** che alimentano i passi 1–2 dei giorni successivi:
un NPC torna, una fazione chiede o minaccia, il giornale titola, un finale si
apre o si chiude. Niente comparti stagni: il giorno N+1 è la conseguenza del N.

## Regia / audio
Musica solo fuori dal banco (menu/cutscene/crisi/finali); sul banco domina il
**sound design ambientale** (`lib/ambientAudio`). Transizioni a serranda tra fasi.
