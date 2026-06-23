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

## Stato attuale
Implementati G1–G3 (compressi: l'Anello arriva già a G1). Da fare: estendere a
G4–G10 secondo la tabella, spostando la telefonata dell'Anello a G6 e l'arrivo
del «fondo R» a G9. Impalcature pronte: gating (`game/actions.ts`),
discrepanze (`game/discrepancies.ts`), voce (`lib/voice.ts`), eventi animati
(`AmbientVisual`), giornale reattivo (`game/newspaper.ts`), cresta+leitmotiv.
