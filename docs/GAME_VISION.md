# GAME VISION — *Ragion di Stato*

> La bussola. Tutto il resto (casi, regole, fazioni, eventi, giornali, audio,
> estetica) esiste per servire QUESTA esperienza. Se una feature non serve la
> visione, si taglia.

## 1. Core fantasy
**Sei un ingranaggio dello Stato profondo, e ogni timbro è una piccola
complicità.** Non spari, non insegui: *decidi quale verità entra negli archivi
e quale sparisce*. Il potere non ti minaccia con le armi ma con la cortesia, la
carriera, la famiglia. Il brivido è morale, non d'azione: «conforme» e «giusto»
portano timbri diversi, e tu li devi separare ogni giorno.

## 2. Cosa fa il giocatore, minuto per minuto
Il **loop** (vedi CORE_LOOP.md): ricevi un caso → osservi l'NPC e ascolti la sua
voce → leggi e trascini i documenti → confronti i campi con la lente → trovi la
discrepanza → applichi le regole del giorno → scegli un'azione *che il contesto
giustifica* → subisci la conseguenza (ammenda, sospetto) → la mattina dopo il
giornale, le fazioni e il mondo reagiscono. Ripeti, mentre la posta sale.

## 3. La curva (Papers, Please)
**Prima burocrazia, poi sospetto, poi paura, poi compromesso.**
Una cosa nuova per giornata; niente è gratis; nessuna scelta «pulita» nel
finale. Le 10 giornate sono una discesa: da «timbra ciò che è conforme» a «cosa
fai del fascicolo che può farti sparire». (Vedi DAY_BY_DAY_EXPERIENCE.md.)

## 4. Il principio di CONNESSIONE (il punto di tutto)
Niente comparti stagni. Ogni sistema **alimenta** gli altri:

```
   CASO ──azione──▶ CONSEGUENZA ──┬──▶ fazioni (reputazione/sospetto)
                                  ├──▶ NPC (salvato/arrestato/scomparso/torna)
                                  ├──▶ flag ──▶ GIORNALE del giorno dopo
                                  ├──▶ flag ──▶ EVENTO/telefonata futura
                                  ├──▶ flag ──▶ CASO futuro (NPC che torna)
                                  └──▶ flag ──▶ FINALE sbloccato/chiuso
   GIORNO N+1 parte da quei flag.
```

La **lore non si racconta**: emerge da documenti, omissis, telefonate, NPC
ricorrenti, ordini contraddittori, giornali, eventi animati e conseguenze.
(Filo: protocollo `R-0455` → «il Ragioniere» → «fondo R» → il predecessore.)

## 5. Le fazioni sono GAMEPLAY
Una fazione che non produce casi, favori, minacce, protezione, manipolazione di
documenti, articoli e finali **non serve**. Ognuna cambia *come* giochi.
(Vedi FACTION_GAMEPLAY_MAP.md.)

## 6. La prova del nove
Dopo 10 giorni il giocatore deve poter dire: **«questa run va così perché HO
deciso così».** Se non lo sente, abbiamo fallito. Operativamente significa:
- ogni scelta importante lascia una traccia visibile (giornale/evento/NPC);
- gli stessi volti tornano, cambiati da ciò che hai fatto;
- due run con scelte opposte divergono in eventi, giornali e finale.

## 7. Stato attuale e priorità
Impalcatura completa (10 giorni giocabili, gating azioni, discrepanze, voce,
eventi animati, giornale reattivo, audio a bus). Il lavoro vivo è la **densità
delle connessioni**: più casi-conseguenza che riportano NPC/fazioni, più
reazioni del mondo, audit delle scelte senza peso. Vedi CONSEQUENCE_PIPELINE.md.
