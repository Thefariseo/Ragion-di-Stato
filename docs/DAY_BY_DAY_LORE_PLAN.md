# DAY-BY-DAY LORE PLAN — prime 10 giornate

> Piano operativo: per ogni giornata, la **nuova meccanica**, il **passo di
> lore** e **come** emerge (mai blocchi di testo). Allinea `data/days.ts`,
> `data/cases/*`, `data/events.ts`, `data/newspapers.ts`, `data/cutscenes.ts`.
> Vedi MAIN_STORY_ARC.md per il filo, PROGRESSION.md per la curva.

| G | Mecc. nuova | Passo di lore | Veicolo |
| --- | --- | --- | --- |
| **1** | Approva / Respingi. Onboarding diegetico. | Il predecessore è «trasferito». Il lavoro: decidi cosa entra in archivio. | briefing + prima pratica + headline |
| **2** | Date e **protocolli**. | Esistono carte RISERVATE e gli Affari Interni. Compare un **numero di protocollo** che tornerà: `R-0455`. | documento + direttiva |
| **3** | **Documento mancante** → *richiedi verifica*. | Una pratica è incompleta «per smarrimento». Smarrimento o omissis? | azione gated `inspected` + nota |
| **4** | **Prima incongruenza seria** (lente → discrepanza). | Renzo Calabro: il permesso dice «lavoro», l'intercettazione dice «il Ragioniere». Primo nome del fondo. | confronto + discrepanza + segnala gated |
| **5** | Conseguenza differita di G4. | **Riferimento indiretto a una fazione**: la sigla/sigillo dell'Anello su un nulla osta che non hai chiesto. | timbro/omissis + flag di lore |
| **6** | **Telefonata ambigua** (voice blip). | La **Voce** dell'Anello: «certe carte è meglio passarle a noi». Primo ricatto cortese. | evento `telefono` + voce banda stretta |
| **7** | **Primo evento animato** fuori dalla scrivania. | Una scorta preleva qualcuno nel corridoio mentre lavori. La paura entra nel vetro. | `AmbientVisual` scriptato + suono |
| **8** | **Prima conseguenza sul giornale**. | Quello che hai deciso ieri è in prima pagina — versione ufficiale o scandalo, a seconda della scelta. | newspaper reattivo (flag) |
| **9** | **Prima scelta morale vera** sul Fascicolo. | Ti arriva tra le mani il «fondo R»: occulti, trasmetti alla Procura, alla Stampa, o distruggi. | pratica-chiave + azioni gated + conseguenze |
| **10** | **Prima fazione presentata** (cresta + leitmotiv). | La fazione verso cui hai penduto si presenta davvero: dossier, stemma grande, motivo sonoro. Non sei più neutro. | cutscene `crest` + `playLeitmotif` |

## Regole di diluizione (Papers, Please)
- **Una cosa nuova per giornata.** Mai introdurre due sistemi insieme.
- Ogni regola nuova **prima si spiega** (direttiva), poi **si verifica** (caso che
  la richiede), poi **si complica** (caso che la usa contro di te).
- I **nomi/protocolli ricorrenti** (`R-0455`, «il Ragioniere», «fondo R») sono il
  collante: ricompaiono in medium diversi finché il giocatore li riconosce.
- La **paura** è regia (eventi animati, attentato), non aggettivi.
- Il **compromesso** è meccanico: a G9–G10 non esiste la scelta «pulita».

## Stato attuale — IMPLEMENTATO (G1–G10, `LAST_DAY = 10`)
Tutte e dieci le giornate sono giocabili (sim headless: la run raggiunge il
giorno 10 e quattro finali distinti, ~21 pratiche, nessun vicolo cieco).

Mappa giornata → casi / evento (file `data/days.ts`, `data/cases/*`, `data/events.ts`):
- **G1** d1_* (intro) · ev_telefono_anello
- **G2** d2_* (servizi/procura/stampa) · ev_ispezione, ev_grazie_renzo
- **G3** a3_pratica_incompleta, a3_tessera_doppia · *richiedi verifica*
- **G4** a4_doppia_identita · *foto/identità*, NPC «il Ragioniere», prot. R-0455
- **G5** a5_nulla_osta_anello · *trattieni*, sigillo dell'Anello
- **G6** a6_fascicolo_cardo2 · **ev_telefonata_fondo** (telefonata ambigua + voice blip)
- **G7** a7_porto_armi_rete, d3_documento_cupola · **ev_scorta_g7** (evento animato)
- **G8** d3_innocente_rete, d3_ordine_conflitto · **giornale reattivo** alle scelte
- **G9** a9_fondo_r, d3_politico_nota · **scelta morale** (fondo R) + ev_busta
- **G10** d3_dossier_finale · **reckoning** → finali

Le fazioni si presentano alla PRIMA comparsa (cresta + leitmotiv): Anello a G4,
SIR/Procura/Stampa già a G1–G2, Rete/Cupola a G7. Il giornale reagisce ai flag
(`data/newspapers.ts`). Le azioni gravi sono gated (`game/actions.ts`): denuncia
→ prova; trasmetti/occulta/distruggi → esame.

### Backlog (rifinitura, non bloccante)
- Più casi per le giornate "magre" (G4–G6 hanno 1 pratica: alzare la quota).
- Cue audio dedicati per ev_telefonata_fondo / ev_scorta_g7 (file esterni).
- Diluire ancora la presentazione fazioni (G1–G2 sono dense).
