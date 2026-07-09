# ASSET TODO (master)

Stato: ✅ fatto · 🟡 base/da rifinire · 🔜 da fare. Tutto ricreato originale.
Dettaglio tabellare storico anche in `ART_ASSETS_TODO.md`.

## Mondo fuori dalla scrivania
- ✅ `WorldScene`: corridoio animato reattivo (coda, guardie, ispettore, runner,
  porta, manifesto, bandiera, flicker, allarme).
- ✅ Booth ristrutturato: sportello a sinistra, mondo prominente, HUD compatto,
  fumetto "Voce".
- 🔜 `AmbientEvent` con sprite dedicati (guardia che scorta, ispettore che entra,
  busta/pacco, telex che stampa, serranda, irruzione, fascicolo che cade).
- 🔜 stati corridoio: normale/affollato/vuoto/allarme/ispezione come asset distinti.

## NPC
- ✅ `NpcSprite` (busto, varianti) con entrata + idle.
- 🔜 stati: walk-in/out, talk, nervous, hand-document, detained, threatened.
- 🔜 sprite per guardia / ispettore / superiore / agente dei servizi.

## Cutscene
- ✅ `CutsceneEngine` + intro + 6 presentazioni fazione + `end_generic`.
- 🔜 cutscene per ogni finale; cutscene per eventi gravi (attentato, crisi, Rete).

## Fazioni / documenti
- ✅ stemmi (`FactionEmblem`), carta intestata per ente, archivio fazioni.
- 🔜 **stili documentali per ente** (servizi/stampa/mafia/gruppi armati/loggia).
- 🔜 timbri dedicati per ente; glifi lore rifiniti.
- 🟡 documenti: chiuso/aperto/timbrato/censurato; 🔜 archiviato/respinto/strappato.

## Giornale / schermate
- ✅ giornale multi-colonna reattivo; ✅ fine giornata diegetica (fazioni + nota
  superiore); ✅ notte/economia; ✅ titolo cartellina RISERVATO.
- 🔜 edizione straordinaria del giornale; rettifiche/censure visibili.

## Audio
- ✅ musica procedurale (4 temi) + sfx (7) + toggle.
- 🔜 leitmotiv per fazione; ambiente d'ufficio in loop; one-shot eventi; AudioSystem.

## Strumenti
- ✅ Debug gallery (stemmi/timbri/volti/palette/musica/sfx).
- 🔜 gallery cutscene + eventi ambientali; cursore pixel custom.

## Priorità prossimo giro
1. Stili documentali per ente. 2. `AmbientEvent` con sprite. 3. Cutscene dei
finali. 4. Leitmotiv + ambiente d'ufficio. 5. NPC: uscita/scortato/fuga.
