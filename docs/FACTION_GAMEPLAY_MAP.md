# FACTION GAMEPLAY MAP — *Ragion di Stato*

> Le fazioni come SISTEMI DI GIOCO, non come schede di lore. Ognuna deve:
> introdurre casi · chiedere favori · minacciare · offrire protezione ·
> manipolare documenti · influenzare giornali · avere NPC e finali collegati ·
> reagire alle tue scelte. Una fazione che non cambia *come* giochi va rifatta.

## Schema per fazione
`carta intestata` (DocumentCard) · `voce` (VoiceBlipSystem) · `cresta+leitmotiv`
(cutscene) · `NPC` · `casi` · `leva di gameplay` · `flag` · `finale`.

## Le sei fazioni-motore

### Governo — Democrazia Solidale (DS)
- **Leva**: ordini «dall'alto» che contraddicono il regolamento; il favore
  costa la verità, il rifiuto costa la carriera (sospetto).
- **NPC**: On. Crisanti, Sottosegr. Velardi.
- **Casi**: d1_nota_superiore, d2_magistrato (ordine di non esibizione),
  d3_politico_nota (distruggi 0418), a9_fondo_r.
- **Giornale**: insabbiamenti («tutto archiviato»), serenità ostentata.
- **Finale**: `assorbito` (promozione/silenzio).

### SIR — servizi ufficiali
- **Leva**: chiede di coprire fonti/stralciare; verifica preventiva = sorveglianza.
- **NPC**: Col. Beraldo, fonte «Cardo».
- **Casi**: d2_informatore (Cardo), a6_fascicolo_cardo2, d3_ordine_conflitto.
- **Giornale**: «pista anarchica» che regge, smentite.
- **Finale**: alimenta `complice_anello` / repressione.

### L'Anello — servizi deviati
- **Leva**: **telefonate** (favore cortese o minaccia) + documenti senza firma
  con sigillo dell'anello spezzato; ti *abitua* a obbedire.
- **NPC**: la Voce, Dott. Manni, «il Ragioniere».
- **Casi**: a4_doppia_identita, a5_nulla_osta_anello + eventi ev_telefono_anello,
  ev_telefonata_fondo → **casi-ritorno** (favore richiesto / ritorsione).
- **Giornale**: «uomini senza nome nei ministeri», nulla che li nomini.
- **Finale**: `complice_anello`.

### Procura — magistratura
- **Leva**: chiede atti; trasmettere = +verità ma **+sospetto** (ti esponi);
  se la aiuti, **torna a chiederti di più**.
- **NPC**: Giudice Ardenti.
- **Casi**: d2_magistrato, d3_documento_cupola, a9_fondo_r (trasmetti) + ritorno.
- **Giornale**: «la Procura chiede gli atti», indagini al palo.
- **Finale**: `collaboratore_procura`, concorre a `scoperta_rete`.

### Stampa — giornalismo
- **Leva**: una foto/un dossier da confermare o bruciare; pubblicare =
  **scandalo nazionale** ma bersaglio su di te.
- **NPC**: cronista Bechis, dir. Ferro.
- **Casi**: d2_giornalista, d3_dossier_finale (trasmetti_stampa).
- **Giornale**: **edizione straordinaria** vs «montatura»; è il loro campo.
- **Finale**: `scandalo`.

### Rete (Quercia) — stay-behind
- **Leva**: liste/depositi nascosti dietro carte banali (porto d'armi, poligono);
  scoprirla è il caso della vita / la fine della tua.
- **NPC**: maestro Elia Conti, «il Mandriano».
- **Casi**: d3_innocente_rete, a7_porto_armi_rete, d3_ordine_conflitto.
- **Giornale**: «liste e depositi: fantapolitica».
- **Finale**: `scoperta_rete`.

## Fazioni-pressione secondarie
Cupola (esposti anonimi veri, minaccia implicita → d3_documento_cupola),
Salotto (appalti/finanziamenti → Bramante), Brigate (Renzo/Giulia, costo umano),
Sindacato/Loggia/Avanguardia (sfondo, casi futuri).

## Regola di reattività (in implementazione)
Ogni fazione deve avere **almeno un caso-ritorno o evento gated** sulla tua
reputazione/flag con essa: se la servi → ti chiede un favore più sporco; se la
incrini → ti minaccia o ti incastra. Vedi CONSEQUENCE_PIPELINE.md.
