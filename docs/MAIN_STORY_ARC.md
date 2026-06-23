# MAIN STORY ARC — *Ragion di Stato*

> L'arco principale. **Non** si racconta a blocchi di testo: emerge da giornali,
> documenti, telefonate, NPC ricorrenti, omissis, ordini contraddittori,
> fazioni, eventi animati, cutscene e **conseguenze delle scelte**.
> Tutto è finzione (vedi LORE_BIBLE.md).

## Logline
Sei il nuovo addetto all'**UVAC** (Ufficio Validazione e Archivio Centrale).
Il tuo predecessore è stato «trasferito». Ti accorgi presto del perché: tra le
pratiche di routine continua a riaffiorare **un fascicolo** che non dovrebbe
esistere — quello che lui stava per archiviare quando è sparito. Decidi tu
quale verità entra negli archivi dello Stato. E quale sparisce.

## Il MacGuffin — il «Fascicolo Velardi / fondo R»
Un dossier che lega un **fondo nero** del partito di governo (Democrazia
Solidale) a conti che transitano per strutture dei servizi deviati (**l'Anello**)
e a un attentato «di matrice incerta». Prova che lo Stato ha pagato chi lo
colpiva. Lo vogliono tutti, per ragioni opposte:
- **l'Anello**: che sparisca (te lo chiede al telefono, con cortesia);
- la **Procura** (Giudice Ardenti): che diventi prova;
- la **Stampa** (cronista Bechis): che diventi scandalo;
- il **Governo** (Sottosegretario Velardi): che resti «in lavorazione» per sempre;
- il **SIR** (Col. Beraldo): che resti loro, come merce di scambio.

Le tue decisioni quotidiane (cosa convalidi, segnali, occulti, trasmetti,
distruggi) spostano il fascicolo verso uno di questi destini → **finali**.

## I tre movimenti (prima burocrazia, poi sospetto, poi paura, poi compromesso)
1. **Burocrazia (G1–G3)** — impari il lavoro. Conformità, date, protocolli, un
   primo documento mancante. Il mondo è ancora «solo carta».
2. **Sospetto (G4–G6)** — la prima incongruenza seria; un nome che ricorre
   («il Ragioniere»); un riferimento indiretto a una fazione; **la telefonata**
   dell'Anello. Capisci di essere osservato.
3. **Paura (G7–G8)** — il mondo entra nell'ufficio: un evento animato fuori dal
   vetro (scorta/attentato), e per la prima volta **una tua scelta finisce sul
   giornale**. Le conseguenze diventano pubbliche.
4. **Compromesso (G9–G10)** — la prima vera **scelta morale** sul fascicolo, e
   la **presentazione piena di una fazione** (cresta + leitmotiv): da qui non
   sei più un timbro neutro. Sei una pedina che ha scelto un lato.

## NPC ricorrenti (i volti che tornano)
- **Renzo Calabro** (sospetto BP) e **la sorella, Giulia** — il costo umano.
- **Giudice Ardenti** (Procura) — la legge ostinata.
- **Cronista Bechis** (Stampa) — la verità con un prezzo.
- **Col. Beraldo** (SIR) / **la Voce al telefono** (Anello) — gli apparati.
- **Sottosegretario Velardi** (Governo) — il potere cortese.
- **Il predecessore** — assente, presente in ogni omissis.

## Come emerge (medium → funzione)
| Medium | Cosa veicola |
| --- | --- |
| Giornali del mattino | clima, reazioni alle tue scelte, versioni ufficiali/manipolate |
| Documenti / omissis | la trama nascosta, protocolli ricorrenti, righe oscurate |
| Telefonate | pressione dell'Anello, avvertimenti, ricatti cortesi |
| NPC ricorrenti | il costo morale, i fili che si ritrovano |
| Ordini contraddittori | il conflitto tra apparati scaricato sulla tua scrivania |
| Eventi animati | la paura resa visibile (scorte, ispezioni, attentati) |
| Cutscene + leitmotiv | l'ingresso in campo di una fazione |
| Conseguenze | reputazione/sospetto/Paese/giornale/finali |

## Stato di implementazione
Arco **giocabile per intero (G1–G10)**. Il «fondo R» si assembla per gradi:
protocollo `R-0455` (G4), sigillo dell'Anello (G5), telefonata (G6), riscontro
Cardo (G6), deposito Rete (G7), faldone a nudo (G9), reckoning finale (G10). Il
predecessore «trasferito» è il filo: a G9 ti arriva ciò che lui stava chiudendo.
Le scelte impostano i flag che i finali valutano alla decima giornata.

## Finali (destino del Fascicolo + tuo)
- **Insabbiato** (Anello/Governo): sopravvivi, complice. Verità sepolta.
- **In tribunale** (Procura): processo, scorta, rischio. Verità parziale.
- **Sui giornali** (Stampa): scandalo, governo che barcolla, tu bruciato.
- **Distrutto**: nessuno saprà mai. Paghi dentro.
- **Schedato/eliminato**: hai osato troppo, troppo presto.
(Allinea a `data/endings` + flag `end:*`.)
