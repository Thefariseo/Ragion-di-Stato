import type { NewspaperItem } from "@/types";

/**
 * Il giornale come strumento narrativo: mente, censura, è manipolato.
 * Trafiletti di base per giornata (worldbuilding) + trafiletti REATTIVI ai flag.
 * Vedi docs/WRITING_BIBLE.md (regole per i giornali).
 */
export const BASE_NEWS: Record<number, NewspaperItem[]> = {
  1: [
    { headline: "SCIOPERO GENERALE, TORINO FERMA", body: "Fabbriche bloccate, cortei nelle strade. Il prefetto invoca «senso di responsabilità». In serata, primi fermi." },
    { headline: "GLI INDUSTRIALI AL GOVERNO: «GARANTITE L'ORDINE»", body: "Dal Salotto buono un appello alla «stabilità». Non si parla di salari. Si parla di sicurezza." },
    { headline: "VISITA UFFICIALE, CENTRO BLINDATO", body: "Misure straordinarie «a tutela dei cittadini». I cittadini, per oggi, restano a casa." },
  ],
  2: [
    { headline: "MAGISTRATO SOTTO SCORTA DOPO LE MINACCE", body: "Solidarietà di rito da ogni parte. Il clima resta quello che è." },
    { headline: "MISURE D'EMERGENZA IN CONSIGLIO", body: "Il governo studia un pacchetto sull'ordine pubblico. L'opposizione: «Si svuota il Parlamento»." },
    { headline: "LA CAMERA CHIEDE STABILITÀ, LE FAMIGLIE CHIEDONO VERITÀ", body: "Due richieste che, da queste parti, non vanno quasi mai d'accordo." },
  ],
  3: [
    { headline: "POSTI DI BLOCCO E CONTROLLI A TAPPETO", body: "«Solo precauzione», ripetono al Viminale. Le pattuglie, intanto, raddoppiano." },
    { headline: "CGL IN PIAZZA: «NON CI FAREMO INTIMIDIRE»", body: "Nuove mobilitazioni mentre il Ministero dispone «controlli rafforzati»." },
    { headline: "LA LIRA SOTTO PRESSIONE", body: "Gli ambienti economici «seguono con apprensione». Tradotto: hanno già spostato i capitali." },
  ],
  4: [
    { headline: "CONSULENTI ESTERNI NEI MINISTERI: «PRASSI NORMALE»", body: "Cresce il numero dei «collaboratori a contratto» senza concorso. Nessun elenco è pubblico. Nessuno lo chiede." },
    { headline: "PORTO, LAVORI FERMI E SUBAPPALTI INTRECCIATI", body: "Una matassa di sigle e prestanome. Sul fondo, un nome che non compare mai." },
  ],
  5: [
    { headline: "AREA EX-DEPOSITO, VIA LIBERA ALLA RICONVERSIONE", body: "Pratica «snella», dicono in Comune. Più snella del solito. Qualcuno ha tolto i lacci, e non si firma." },
    { headline: "IL PARTITO: «NESSUN FONDO OCCULTO». L'OPPOSIZIONE INSISTE", body: "Smentite di rito. Più si smentisce, più la cifra di cui non si parla sembra precisa." },
  ],
  6: [
    { headline: "INTERCETTAZIONI, LA MAGISTRATURA CHIEDE PIÙ MEZZI", body: "Pochi giudici, molte carte, telefoni che squillano e tacciono. Il giudice Ardenti non rilascia dichiarazioni." },
    { headline: "ATTENTATO DI PIAZZA DEI TIGLI, INCHIESTA AL PALO", body: "A mesi di distanza, ancora «pista anarchica». Le presenze scomode sul luogo restano fuori dai verbali." },
  ],
  7: [
    { headline: "FERMI E PERQUISIZIONI, «COLPO ALLE STRUTTURE EVERSIVE»", body: "Prelevamenti all'alba. Gli inquirenti lodano «la collaborazione degli uffici». Non dicono quali uffici." },
    { headline: "ARMI IN UN MAGAZZINO? «FANTAPOLITICA», TAGLIA CORTO IL VIMINALE", body: "Voci di depositi «da attivare». Smentita immediata. Immediata come solo le cose vere sanno essere smentite." },
  ],
  8: [
    { headline: "MAESTRO ELEMENTARE FERMATO E RILASCIATO IN POCHE ORE", body: "«Errore di trascrizione», si apprende. Un errore che qualcuno aveva firmato. Un altro, no." },
    { headline: "IL MATTINO E LE «MANI INVISIBILI» DEGLI APPARATI", body: "Editoriale prudente, ma per la prima volta una parola: «deviazioni». Stasera, forse, una telefonata al direttore." },
  ],
  9: [
    { headline: "GIORNI DECISIVI PER IL GOVERNO. VELARDI: «PIENA SERENITÀ»", body: "La serenità ostentata di chi sa che una cartella, da qualche parte, può cambiargli la vita." },
    { headline: "«FONDO R»: TRE LETTERE CHE IL PALAZZO NON VUOLE SENTIRE", body: "Un sigla che circola tra i corridoi. Negata da tutti. Conosciuta da troppi." },
  ],
  10: [
    { headline: "ATTESA PER UNO SCOOP, POI IL SILENZIO. CHE COSA È SUCCESSO?", body: "Una redazione pronta a uscire, poi il vuoto. A volte la notizia più grande è quella che non leggerete." },
    { headline: "AVVICENDAMENTI NEGLI UFFICI RISERVATI", body: "Trasferimenti «tecnici», promozioni improvvise, una scrivania che cambia padrone. Come sempre. Come per il suo predecessore." },
  ],
};

export const SIDEBARS: Record<number, { title: string; body: string }> = {
  1: { title: "IL COMMENTO", body: "«La fermezza dello Stato non è in discussione. Chi semina disordine troverà un argine. E una firma in calce.»" },
  2: { title: "NOTA AI DIRETTORI", body: "Si raccomanda alle testate «sobrietà» nel riferire i fatti di cronaca nera. Nell'interesse superiore di tutti." },
  3: { title: "ULTIM'ORA", body: "Movimenti negli apparati, secondo fonti riservate. Nessuna conferma. Nessuna smentita. Il che, di solito, è una conferma." },
  4: { title: "IL COMMENTO", body: "«Lo Stato moderno ha bisogno di flessibilità. Anche nei nomi. Soprattutto nei nomi.»" },
  5: { title: "NOTA AI DIRETTORI", body: "Si invita a non dare credito a «sigle di fantasia» circolanti su presunti fondi. Nell'interesse della piazza finanziaria." },
  6: { title: "ULTIM'ORA", body: "Un funzionario, secondo voci, avrebbe ricevuto «cortesi raccomandazioni» telefoniche. Le voci, qui, non si verbalizzano." },
  7: { title: "IL COMMENTO", body: "«La sicurezza ha un prezzo, e si paga in domande non fatte. Chi le fa, di solito, viene accompagnato.»" },
  8: { title: "NOTA AI DIRETTORI", body: "La parola «deviazioni» è apparsa in un editoriale. Si raccomanda, d'ora in poi, maggiore «equilibrio»." },
  9: { title: "ULTIM'ORA", body: "Si conferma che nulla è da confermare. Si smentisce che ci sia qualcosa da smentire. Buona giornata." },
  10: { title: "IL COMMENTO", body: "«La macchina dello Stato non si ferma per un fascicolo. Si ferma, semmai, chi lo tiene in mano.»" },
};

/** Reattivi ai flag della run: lo Stato che reagisce, tace o manipola. */
export const NEWS_ITEMS: NewspaperItem[] = [
  {
    requiresFlag: "dossier_stampa",
    headline: "EDIZIONE STRAORDINARIA: «LO STATO CONTRO SÉ STESSO»",
    body: "Documenti riservati in redazione. Copie sequestrate in tre città. Quattro le hanno già lette. Si parla di una fonte interna.",
  },
  {
    requiresFlag: "passato_stampa",
    headline: "FOTO-CHOC, IL VIMINALE: «MONTATURA»",
    body: "Un agente, uno schedato, uno scambio. Due periti su tre confermano. Il terzo, da ieri, è irreperibile.",
  },
  {
    requiresFlag: "verbale_alla_procura",
    headline: "APPALTI DEL PORTO, LA PROCURA CHIEDE GLI ATTI",
    body: "Il giudice Ardenti indaga su una gara mai bandita. «Avvicendamento tecnico» per il funzionario che li ha trasmessi.",
  },
  {
    requiresFlag: "dossier_procura",
    headline: "NUOVO FALDONE AL GIUDICE ARDENTI",
    body: "Fonti di governo: «Materiale privo di rilevanza». La Procura non commenta. È già qualcosa.",
  },
  {
    requiresFlag: "servito_crisanti",
    headline: "APPALTI, TUTTO ARCHIVIATO: «NESSUN ATTO RILEVANTE»",
    body: "La pratica più scomoda risulta «non reperibile». Negli ambienti di governo, soddisfazione misurata.",
  },
  {
    requiresFlag: "militante_segnalato",
    headline: "RETATA NELL'AUTONOMIA, «DURO COLPO ALLE BRIGATE»",
    body: "Fermi all'alba. Gli inquirenti lodano «l'ottima collaborazione degli uffici». Non dicono quali.",
  },
  {
    requiresFlag: "coperto_cardo",
    headline: "PIAZZA DEI TIGLI, RESTA LA PISTA ANARCHICA",
    body: "La versione ufficiale regge. Nessun riferimento a presenze scomode sul luogo dell'ordigno.",
  },
  {
    requiresFlag: "cardo_alla_procura",
    headline: "ATTENTATO, UN'OMBRA SUGLI APPARATI",
    body: "Una fonte confidenziale sul posto venti minuti prima dello scoppio. La Procura vuole vederci chiaro. Qualcuno, no.",
  },
  {
    requiresFlag: "scoperta_rete",
    headline: "SI PARLA DI «LISTE» E DEPOSITI. SMENTITA UFFICIALE",
    body: "Nomi, recapiti, armi «per il giorno dopo». Fonti istituzionali: «Fantapolitica». Lo ripetono in molti, e in fretta.",
  },
  {
    requiresFlag: "bechis_segnalato",
    headline: "CRONISTA INDAGATO PER RICETTAZIONE DI ATTI",
    body: "La testata parla di intimidazione. Il Viminale: «Atto dovuto». Il cronista, per ora, non risponde al telefono.",
  },
  {
    requiresFlag: "segnalato_ragioniere",
    headline: "«CONSULENTE FANTASMA» SEGNALATO, POI IL VUOTO",
    body: "Un nominativo con due identità sarebbe finito in una segnalazione interna. Della segnalazione, da ieri, non c'è più traccia. Del consulente, nemmeno.",
  },
  {
    requiresFlag: "passato_ragioniere",
    headline: "NEI MINISTERI ENTRANO ED ESCONO UOMINI SENZA NOME",
    body: "Tessere di servizio a chi «non risulta». Tutto regolare, assicurano. Regolare come un timbro su una pratica che nessuno rileggerà.",
  },
  {
    requiresFlag: "trattenuto_anello",
    headline: "PRATICA EDILIZIA BLOCCATA: «MANCA UNA FIRMA»",
    body: "Un funzionario avrebbe trattenuto una concessione priva di firma valida. In alto, qualcuno ha smesso di sorridere. Annotato, certamente, agli atti.",
  },
  {
    requiresFlag: "deposito_alla_procura",
    headline: "INDIRIZZO «SENSIBILE» AL VAGLIO DELLA PROCURA",
    body: "Un magazzino dietro un'iscrizione sportiva. Il giudice Ardenti dispone accertamenti. La struttura, intanto, sposta ciò che può.",
  },
  {
    requiresFlag: "fondoR_procura",
    headline: "«FONDO R», UN SECONDO RISCONTRO FINISCE AL GIUDICE",
    body: "Versamenti tra un fondo di partito e un'area in riconversione. La Procura non conferma. Il palazzo, stranamente, neppure smentisce.",
  },
  {
    requiresFlag: "fondoR_distrutto",
    headline: "«NESSUN FONDO, NESSUNA PRATICA»: IL CASO È CHIUSO",
    body: "La cartella più scomoda risulta «mai esistita». Negli ambienti di governo, una soddisfazione misurata, e una promozione in arrivo per qualcuno.",
  },
  {
    requiresFlag: "fondoR_coperto",
    headline: "ATTENTATO E APPALTI, NESSUN COLLEGAMENTO: PAROLA DEL VIMINALE",
    body: "La versione ufficiale tiene un altro giorno. Le carte che direbbero il contrario restano dove qualcuno le ha rimesse.",
  },
  {
    requiresFlag: "nemico_anello",
    headline: "FUNZIONARIO «POCO COLLABORATIVO» AL CENTRO DI VOCI",
    body: "Si mormora di un impiegato degli archivi che «fa troppe domande». Negli ambienti che non esistono, un nome è già su un foglio. Il suo.",
  },
  {
    requiresFlag: "denunciato_anello",
    headline: "DOCUMENTI FALSI NEGLI UFFICI? LA PROCURA APRE UN FASCICOLO",
    body: "Un atto contraffatto, una firma imitata, un metodo. Il giudice Ardenti indaga. Da qualche parte, qualcuno cambia i piani su un funzionario.",
  },
  {
    requiresFlag: "servito_anello_2",
    headline: "TESTIMONE SCOMPARSO, INCHIESTA SUBITO ARCHIVIATA",
    body: "Aveva visto, aveva parlato. Poi più nulla: né lui, né il verbale. «Non risulta», dicono gli uffici. E hanno ragione: non risulta più.",
  },
  {
    requiresFlag: "testimone_renzo",
    headline: "«C'È UN TESTE SUI VERSAMENTI», FILTRA DALLA PROCURA",
    body: "Un giovane «vicino agli ambienti dell'autonomia» avrebbe visto firmare i bonifici del porto. Se arriva vivo all'aula, cambia tutto.",
  },
  {
    requiresFlag: "protezione_richiesta",
    headline: "MINACCE A UN FUNZIONARIO, SCATTA LA VIGILANZA",
    body: "Un volantino, una lista, una pattuglia sotto casa. Il Viminale: «Atto dovuto». I vicini, intanto, hanno smesso di salutare.",
  },
  {
    requiresFlag: "giulia_segnalata",
    forbidsFlag: "protezione_richiesta",
    headline: "ALTRI NOMI NEGLI SCHEDARI. «PREVENZIONE», DICONO",
    body: "Una ragazza incensurata finisce agli atti per «contiguità». Il fratello era già passato di lì. Certe famiglie lo Stato le conosce una pratica alla volta.",
  },
  // —— tessitura G3–G6: il giornale rispecchia anche le pratiche minori ——
  {
    requiresFlag: "trafiletto_integrale",
    headline: "«PORTO, LA GARA CHE NON C'È MAI STATA»: IL PEZZO ESCE INTERO",
    body: "Compreso l'inciso su un «fondo di partito». Al Ministero, stamattina, i telefoni sono bollenti. In tipografia, invece, si stappa.",
  },
  {
    requiresFlag: "trafiletto_censurato",
    headline: "PORTO, UN TRAFILETTO «EQUILIBRATO». MANCA UNA RIGA",
    body: "Il pezzo esce pulito, senza l'inciso che tutti in redazione avevano letto. Il direttore non commenta. La matita rossa nemmeno.",
  },
  {
    requiresFlag: "trafiletto_bloccato",
    headline: "PAGINA TRE, UN BUCO BIANCO DOVE DOVEVA ESSERCI UN ARTICOLO",
    body: "Nessun visto, nessun pezzo. All'estero i buchi bianchi li chiamano notizie. Qui li chiamano «disguidi tipografici».",
  },
  {
    requiresFlag: "baldan_aiutato",
    headline: "LA PENSIONE DELLA VEDOVA BALDAN ARRIVA PUNTUALE",
    body: "Un funzionario ha rinnovato «in deroga» una tessera scaduta durante un ricovero. Nove giorni di ritardo, una firma, una cena calda. Non farà giurisprudenza. Farà cena.",
  },
  {
    requiresFlag: "velina_trasmessa",
    headline: "TUTTE LE TESTATE, OGGI, USANO LA STESSA PAROLA: «EQUILIBRIO»",
    body: "Identica, alla stessa ora, sulla stessa sigla che nessuno nomina. Le coincidenze editoriali, in questo Paese, hanno il protocollo.",
  },
  {
    requiresFlag: "velina_a_bechis",
    headline: "«ORDINE DI TACERE», UN DOCUMENTO IMBARAZZA IL GABINETTO",
    body: "Una nota di indirizzo senza firma finisce sul tavolo di un cronista. Il Gabinetto: «Falso grossolano». Il protocollo, però, è vero.",
  },
  {
    requiresFlag: "nastro_verbalizzato",
    headline: "UN NASTRO, DUE VERSIONI: APERTO UN FASCICOLO INTERNO",
    body: "Una trascrizione lega un «consulente» ai fondi di un attentato; un appunto ordinava di ignorarlo. Ora c'è un verbale che li mette a confronto. Firmato.",
  },
];
