# RAGION DI STATO — Game Design Document

> *Un thriller burocratico nell'Italia della Prima Repubblica.*
> Liberamente ispirato a **Papers, Please**. Tutto è romanzato: partiti, sigle,
> organizzazioni e persone sono finzione, anche se l'eco della realtà è voluta.

---

## 1. Pitch

> **Sei un burocrate in un sistema opaco. Ogni giorno decidi quale verità entra
> negli archivi dello Stato, quale viene nascosta, quale manipolata e quale
> distrutta.**

Anni Settanta. Una Repubblica logorata dalla tensione. Tu non sei un eroe, un
politico o un agente sul campo: sei un funzionario dell'**Ufficio Validazione e
Archivio Centrale (UVAC)** del Ministero dell'Interno. Dalla tua scrivania
passano fascicoli, informative, permessi, intercettazioni, tessere, ordini
riservati. Approvi, respingi, archivi, segnali, occulti, trasmetti, distruggi.

Ogni timbro sposta un equilibrio. Le fazioni ti osservano. Il sospetto cresce.
Il Paese può precipitare nella repressione, nel caos, nel compromesso o nella
verità pubblica — e la somma delle tue scelte decide come finisce.

---

## 2. Pilastri di design (cosa rende efficace Papers, Please e come lo reinterpretiamo)

| Pilastro PP | Reinterpretazione *Ragion di Stato* |
|---|---|
| Struttura a giornate | Giornate lavorative all'UVAC con briefing, direttive, sintesi |
| Routine che si complica | Le regole di validazione aumentano e si contraddicono |
| Controllo documentale | Confronto di nomi, date, foto, firme, timbri, protocolli, fonti |
| Regole che cambiano | Direttive ministeriali nuove ogni giorno, spesso *politiche* |
| Pressione del tempo | Orario d'ufficio + quota di pratiche da evadere |
| Strumenti limitati | Timbri, telefono, telex, schedario, regolamento, lente di confronto |
| Contraddizioni | Discrepanze tra fascicoli, dichiarazioni e rapporti |
| Dilemmi morali | "In regola" ≠ "giusto"; ogni azione ha un prezzo |
| Conseguenze narrative | Le scelte tornano nei giorni successivi e nei finali |
| Risorse limitate | Stipendio, sicurezza della famiglia, lucidità |
| Atmosfera oppressiva | Ministero, neon, telefono che squilla, sorveglianza interna |
| Interfaccia tattile | Carta, inchiostro, timbri sonori, scrivania fisica |
| Burocrazia disumana | Sei un numero che decide su altri numeri |
| Personaggi da interazioni brevi | Il latitante, il magistrato, il giornalista, la voce al telefono |
| Finali multipli | Determinati dalla *somma* delle scelte, non da un bivio finale |

**Differenza chiave dal modello:** in Papers, Please la tensione nasce dal
*valido/non valido*. Qui la tensione nasce dall'**ambiguità politica e morale**:
un documento può essere perfettamente in regola e moralmente devastante, oppure
falso ma vero nel contenuto. Il giocatore non valida persone: valida *verità di
Stato*.

---

## 3. Fantasy e tono

- Adulto, cupo, ambiguo, paranoico. Nessun manicheismo.
- Non è una ricostruzione storica scolastica: è un **thriller** romanzato.
- Il mondo esiste oltre la scrivania: lo si ricostruisce per **frammenti**
  (articoli, note anonime, intercettazioni, foto sgranate, dossier censurati).
- Il giocatore prova disagio: spesso la scelta "corretta per il regolamento" è
  quella che protegge i potenti.

---

## 4. Il giocatore

**Ruolo:** funzionario di validazione documentale all'UVAC, Ministero
dell'Interno. Apparentemente piccolo, di fatto uno snodo: decide cosa entra
nella memoria dello Stato.

**Vita privata (risorse personali):**
- **Stipendio** (lire): pagato a fine giornata in base alle pratiche evase e alle
  sanzioni. Serve per la famiglia.
- **Famiglia** (sicurezza 0–100): minacce, ritorsioni e protezioni la spostano.
- **Lucidità** (0–100): la pressione, le minacce e i compromessi la erodono.
- **Sospetto** (0–100): quanto l'Apparato (Affari Interni) sospetta di *te*.

---

## 5. Le fazioni (tutte romanzate)

Sistema con **reputazione** (−100…+100), **sospetto** (0…100) e reazioni a
catena: favorire una fazione insospettisce le rivali.

**Core (presenti nel prototipo):**
- **Democrazia Solidale (DS)** — partito di governo, centro cattolico. *Ordine,
  continuità, copertura.*
- **Servizio Informazioni e Riservatezza (SIR)** — i servizi ufficiali.
- **L'Anello** — i servizi *deviati*, struttura parallela dentro lo Stato.
- **Brigate Proletarie (BP)** — lotta armata di estrema sinistra.
- **La Procura** — magistratura che indaga sui poteri.
- **La Stampa** — giornalismo d'inchiesta.

**Estese (presenti nella lore, agganciabili):**
- **Avanguardia Nera (AN)** — lotta armata di estrema destra.
- **La Rete (Quercia)** — struttura clandestina "stay-behind".
- **La Cupola** — criminalità organizzata.
- **Il Sindacato** — conflitto operaio.
- **La Loggia** — rete parallela di potere.
- **Il Salotto** — poteri economici e industriali.

Ogni fazione ha: obiettivi, metodi, ideologia, risorse, personaggi chiave,
richieste al giocatore, segreti, contraddizioni interne, eventi dedicati, agganci
ai finali e rapporti dinamici con le altre.

---

## 6. Loop di gioco (alto livello)

Struttura a **giornate lavorative**. Ogni giornata:

1. **Briefing** — clima del Paese, eventi notturni, morale.
2. **Direttive** — nuove regole/ordini (spesso politici) che aggiornano il
   regolamento attivo.
3. **Coda pratiche** — fascicoli/casi da processare sotto pressione di tempo.
4. **Eventi** — imprevisti (telefono, ispezione, busta sotto la porta).
5. **Conseguenze** — ritorni delle scelte dei giorni precedenti.
6. **Sintesi** — bilancio: stipendio, sospetto, fazioni, stato del Paese.

Vedi `CORE_LOOP.md` per il dettaglio minuto-per-minuto.

---

## 7. Verifica documentale

Il giocatore confronta tra documenti dello stesso caso:
nomi · date · fotografie · firme · timbri · codici/protocolli · affiliazioni ·
provenienza · livelli di autorizzazione · contraddizioni tra fascicoli ·
discrepanze dichiarazioni/rapporti · parti censurate · note interne · catene di
comando · attendibilità delle fonti.

**Motore regole (separato dalla UI):** ogni giornata attiva un set di `Rule`.
`validateCase(caso, regole)` produce `{ inRegola, violazioni[] }`. La UI offre
una **modalità Confronto** (lente): selezionando due campi in conflitto si rivela
la discrepanza. L'azione resta sempre del giocatore: *in regola* e *giusto* non
coincidono.

**Esempi di caso** (vedi `DATA_MODEL.md`):
- militante BP che chiede un permesso, ma il fascicolo ha incongruenze;
- informatore del SIR collegato a un attentato mai chiarito;
- magistrato che chiede atti che un superiore vuole bloccare;
- giornalista con prove che però mettono a rischio un'operazione;
- politico che chiede di far sparire una nota;
- innocente legato indirettamente a una rete clandestina;
- documento della Cupola che sembra falso ma è vero nel contenuto;
- ordine ufficiale in conflitto con un'informativa riservata;
- NPC che chiede aiuto personale, ma aiutarlo ti compromette.

---

## 8. Azioni del giocatore

Approva · Respingi · Archivia · Segnala (sorveglianza) · Trasmetti dossier
(a una fazione) · Occulta informazione · Altera documento · Ignora anomalia ·
Chiedi verifica · Interroga fonte · Confronta documenti · Collega indizi ·
Invia informativa a una fazione · Distruggi fascicolo · Proteggi NPC ·
Incastra NPC · Favorisci/Ostacola una fazione.

Nel prototipo: azioni **comuni** (Approva/Respingi/Archivia/Segnala/Confronta) +
azioni **speciali per caso** (es. *Trasmetti all'Anello*, *Avvisa la Procura*,
*Distruggi il fascicolo*, *Proteggi*). Ogni azione porta una `Consequence`.

---

## 9. Scelte e conseguenze

Le scelte non sono cosmetiche. Modificano: NPC che compaiono, fiducia/sospetto
delle fazioni, documenti dei giorni successivi, eventi sbloccati, casi nascosti,
minacce ricevute, finali disponibili, verità scopribili, destino dei personaggi
(vivi/spariti/arrestati/morti), sospetto del sistema verso di te, e i quattro
**indicatori di Paese**: Repressione, Caos, Verità pubblica, Compromesso.

---

## 10. Finali multipli

Non un bivio finale ma la **somma** della run. Condizioni valutate da
`evaluateEndings(state)`. Esempi:
promosso/assorbito · arrestato · fuga · prove alla stampa (scandalo) · una
fazione prende il sopravvento · scandalo insabbiato · attentato evitato/avvenuto ·
complice dell'Anello · collaboratore della Procura · salvi la famiglia ma
sacrifichi la verità · scopri la Rete ma vieni eliminato politicamente · il Paese
si fa più repressivo · il sistema sopravvive immutato (default).

---

## 11. Estetica (direzione artistica)

- Pixel/analogico cupo, palette desaturata.
- Colori: **carta ingiallita**, **rosso ministeriale**, **verde militare**,
  **grigio cemento**, **nero inchiostro**, ocra.
- Interfaccia *sporca, consumata, fisica*: la UI è parte del mondo, non un
  overlay moderno. Grana, vignetta, scanline, neon tremolante.
- Font: macchina da scrivere (timbri/voce), stencil condensato (intestazioni),
  serif da stampa (corpo documenti).
- Animazioni minime ma espressive; timbri visivi **e sonori** soddisfacenti
  (WebAudio, niente asset pesanti); foto sgranate; texture da archivio.

---

## 12. Rigiocabilità

Ogni run differisce per: casi generati, NPC, fazioni favorite, "boss"
politico-narrativi, eventi casuali, documenti trovati, scelte, percorsi
sbloccati, sospetto, alleanze, finali. **Seed riproducibile** per debugging e
condivisione delle run.

---

## 13. Ambito del prototipo (questa build)

1. Schermata iniziale · 2. Estetica base coerente · 3. Scrivania interattiva ·
4. ≥3 giornate · 5. ≥10 casi/documenti · 6. ≥4 fazioni · 7. reputazione/sospetto ·
8. approva/respingi/archivia/segnala · 9. ≥2 eventi casuali · 10. ≥2 conseguenze
cross-giornata · 11. ≥2 finali · 12. salvataggio locale · 13. deploy Vercel.

Stato: **13 giornate-contenuto coperte da 3 giorni**, 13+ casi, 6 fazioni core
(+6 lore), 3 eventi, conseguenze cross-day, 6 finali, salvataggio `localStorage`,
pannello debug, build statica deployabile.
