# DAY-BY-DAY EXPERIENCE — *Ragion di Stato*

> Ogni giornata ha una FUNZIONE precisa e introduce **una cosa nuova**. Tabella
> operativa: per ogni giorno, la regola/meccanica nuova, il documento, il
> rischio, il frammento di lore, la fazione, la scelta significativa, la
> conseguenza immediata e futura, la reazione del mondo. Mappa su `data/days.ts`,
> `data/cases/*`, `data/events.ts`, `data/newspapers.ts`.

Curva: **burocrazia (G1–3) → sospetto (G4–6) → paura (G7–8) → compromesso (G9–10)**.

| G | Nuovo (regola/mecc.) | Documento | Rischio | Lore | Fazione | Scelta | Conseguenza subito | Conseguenza futura | Reazione mondo |
|---|---|---|---|---|---|---|---|---|---|
| **1** | nomi/tessere/protocollo; timbro | permesso, tessera, fascicolo | imparare a respingere | il predecessore «trasferito»; prima telefonata | Brigate, Governo, Anello | segnalare/proteggere Renzo | reputazione BP/SIR | Renzo/Giulia tornano a G2 | giornale: «retata, duro colpo» |
| **2** | RISERVATO/SEGRETO, nulla osta, firme | rapporto, ordine, lettera, foto | la prima ispezione | Cardo e l'attentato; appalto Bramante | SIR, Procura, Stampa | coprire Cardo / dare la foto | verità ±, sospetto | scandalo/edizione straordinaria | giornale: «magistrato sotto scorta» |
| **3** | **richiedi verifica** (gated) | allegato mancante | timbrare al buio | la routine come potere | (stato) | chiedere l'allegato vs timbrare | flag sabelli | carico ignoto a valle | giornale: «code agli sportelli» |
| **4** | **foto/identità** deve combaciare | tessera di servizio + nota | far passare chi «non esiste» | **R-0455**, «il Ragioniere» | **Anello** (entra) | far passare / segnalare il Ragioniere | reputazione Anello, sospetto | favore o ritorsione dell'Anello | cresta+leitmotiv Anello; giornale: «uomini senza nome» |
| **5** | **trattieni** (firma assente) | nulla osta col sigillo dell'anello | obbedire a una firma che non c'è | il sigillo dell'Anello; area Bramante | Anello, Salotto | obbedire / trattenere | reputazione Anello | porta che si chiude su di te | giornale: «via libera alla riconversione» |
| **6** | telefonata ≠ atto | fascicolo Cardo (agg.) | farsi ricattare | **fondo R** a fuoco | Anello, SIR | occultare / dare a Procura | verità ±, sospetto | finale procura/insabbiamento | **ev_telefonata_fondo** (voce + blip) |
| **7** | coincidenze di recapito | elenco riservato, poligono | la paura entra dal vetro | depositi della Rete | **Rete**, Cupola | segnalare il deposito / occultare | verità ±, famiglia − | scoperta_rete; ritorsione | **ev_scorta_g7** (animato): prelievo nel corridoio |
| **8** | conflitto ordine/informativa | ordine firmato vs informativa | la firma si vendica | il maestro Conti | Rete, SIR | eseguire / soprassedere il fermo | repressione, sospetto | Conti arrestato/salvato | **giornale = specchio**: ieri è prima pagina |
| **9** | **l'NPC RITORNA** (variante per flag) + scelta morale piena | **faldone «fondo R»** + biglietto/volantino | non c'è scelta pulita | il predecessore stava chiudendo questo; Renzo/Giulia reagiscono a G1–G2 | Brigate, Governo, Procura, Anello | testimone di Renzo / distruggi / Procura / copia | verità, sospetto, famiglia | **finale** impostato; testimone o minaccia BP | **ev_busta** (tangente) + giornale sul teste/schedature |
| **10** | reckoning | **dossier «Ragion di Stato»** | sparire | tutto pesa insieme | tutte | stampa / procura / brucia / fuga | — | **FINALE** (somma dei flag) | edizione straordinaria annunciata e ritirata |

## Funzioni minime per ogni giornata (checklist)
- [ ] una regola/meccanica nuova **o** un nuovo tipo di documento;
- [ ] un nuovo rischio percepibile;
- [ ] un frammento di lore che **ricorre** (non isolato);
- [ ] una fazione che **agisce** (non è citata: chiede/minaccia/offre);
- [ ] una scelta che cambia almeno un flag a valle;
- [ ] una conseguenza immediata (ammenda/sospetto/log);
- [ ] una conseguenza futura (giornale/evento/caso-ritorno/finale);
- [ ] una reazione del mondo (giornale o evento animato).

## Densità — FATTO
G3–G6 infoltite con pratiche di TESSITURA collegate (data/cases/texture.ts):
- **G3** `t3_visto_stampa` (Stampa): il visto sul trafiletto del porto — la
  censura come pratica; 3 esiti, 3 prime pagine diverse il giorno dopo.
- **G4** `t4_pensionato` (Sindacato): la tessera scaduta di Baldan — la regola
  contro la pietà; l'ammenda arriva davvero se timbri in deroga.
- **G5** `t5_velina` (Governo): l'ordine di non nominare il «fondo R» — puoi
  trasmetterla, trattenerla (regola firma) o passarla a Bechis.
- **G6** `t6_intercettazione` (SIR): il nastro 44-B contro l'appunto di
  massima — la contraddizione a verbale apre il ritorno della Procura.
Beat cinematici fissi: **attentato a G7**, **rivelazione del fondo R a G9**.
