import type { CaseDef } from "@/types";
import { approva, respingi, archivia, segnala, special, richiediVerifica } from "./helpers";

/**
 * ARCO PRINCIPALE — giorni 3–9 (vedi docs/DAY_BY_DAY_LORE_PLAN.md).
 * La lore emerge gradualmente: burocrazia → sospetto → paura → compromesso.
 * Filo conduttore: il protocollo R-0455, «il Ragioniere», il «fondo R».
 * Il gating delle azioni è procedurale (game/actions.ts): le azioni gravi
 * compaiono solo se giustificate da documenti, prove o regole.
 */
export const ARC_CASES: CaseDef[] = [
  /* ===================== GIORNO 3 — documento mancante ==================== */
  {
    id: "a3_pratica_incompleta",
    specialActionId: "richiedi_verifica",
    subject: "Ditta Sabelli",
    summary: "Permesso di trasporto — manca un allegato",
    intro: [
      "Un rappresentante in completo grigio. Parla in fretta, guarda l'orologio.",
      "«È tutto lì dentro. O quasi. L'allegato lo porto domani, mi creda.»",
    ],
    documents: [
      {
        id: "a3c1_permesso",
        kind: "permesso",
        title: "Permesso di trasporto merci",
        issuer: "Questura di Roma",
        authLevel: "libero",
        protocollo: "04880/1974",
        fields: [
          { label: "Ditta", value: "Sabelli & C.", comparable: true },
          { label: "Carico", value: "materiale edile — vedi allegato", comparable: true },
          { label: "Allegato", value: "MANCANTE", comparable: true },
          { label: "Validità", value: "VALIDA", comparable: true },
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      richiediVerifica({
        text: "Chiedi l'allegato mancante. Il rappresentante impallidisce: senza quel foglio, il «materiale edile» non si sa cos'è. Tornerà. Forse.",
        country: { verita: 2 },
        setFlags: ["sabelli_verifica"],
        logTitle: "Richiesto l'allegato mancante alla ditta Sabelli",
      }),
      approva({
        text: "Timbri lo stesso. Più veloce. Il carico parte senza che nessuno sappia davvero cosa contiene.",
        sospetto: 3,
        country: { verita: -2 },
        logTitle: "Permesso Sabelli convalidato senza allegato",
      }),
      respingi({
        text: "Respingi: pratica incompleta. Regola è regola. Il rappresentante se ne va sbattendo la porta a vetri.",
        factions: { governo: { reputation: -2 } },
        logTitle: "Permesso Sabelli respinto (incompleto)",
      }),
    ],
  },
  {
    id: "a3_tessera_doppia",
    subject: "Anna Ferri",
    summary: "Rinnovo tessera annonaria — un timbro di troppo",
    intro: ["Una donna anziana, le mani sul bastone.", "«Me l'hanno timbrata due volte, dicono. Io non capisco queste cose.»"],
    documents: [
      {
        id: "a3c2_tessera",
        kind: "tessera",
        title: "Tessera annonaria",
        issuer: "Comune di Roma",
        authLevel: "libero",
        fields: [
          { label: "Nome", value: "Anna Ferri", comparable: true },
          { label: "Validità", value: "VALIDA", comparable: true },
        ],
        stamps: ["VIDIMATO", "VIDIMATO"],
      },
    ],
    regulationVerdict: "approva",
    actions: [
      approva({
        text: "Il doppio timbro è un errore d'ufficio, non suo. Convalidi. Lei ti ringrazia come si ringrazia chi tiene in mano la tua cena.",
        player: { lucidita: 2 },
        logTitle: "Tessera Ferri rinnovata",
      }),
      respingi({
        text: "Doppia vidimazione: respingi per «irregolarità formale». Lei non protesta. Le persone come lei non protestano mai. È questo il punto.",
        player: { lucidita: -3 },
        country: { repressione: 1 },
        logTitle: "Tessera Ferri respinta per cavillo",
      }),
    ],
  },

  /* ============ GIORNO 4 — prima incongruenza seria (NPC ricorrente) ====== */
  {
    id: "a4_doppia_identita",
    arrestActionId: "segnala",
    specialActionId: "richiedi_verifica",
    subject: "«Marco Lendi»",
    faction: "anello",
    summary: "Due documenti, due uomini, una sola faccia",
    intro: [
      "Un uomo tranquillo, cappotto buono, una calma che non si impara da onesti.",
      "«Pratica ordinaria. Trasferimento d'ufficio.» Sorride appena. Troppo appena.",
    ],
    documents: [
      {
        id: "a4c1_tessera",
        kind: "tessera",
        title: "Tessera di servizio",
        issuer: "Ministero dell'Interno",
        authLevel: "riservato",
        protocollo: "R-0455/1974",
        photo: { seed: 7741, label: "Lendi" },
        fields: [
          { label: "Nome", value: "Marco Lendi", comparable: true },
          { label: "Qualifica", value: "consulente esterno", comparable: true },
        ],
      },
      {
        id: "a4c2_nota",
        kind: "nota",
        title: "Nota di accompagnamento",
        issuer: "—",
        authLevel: "riservato",
        photo: { seed: 7741, label: "il Ragioniere" },
        fields: [
          { label: "Nome", value: "—", comparable: true },
          { label: "In uso", value: "«il Ragioniere»", comparable: true },
        ],
        body: ["Si raccomanda la massima discrezione. Il soggetto «non risulta». La foto, sì."],
      },
    ],
    discrepancies: [
      {
        aDocId: "a4c1_tessera",
        aField: "Nome",
        bDocId: "a4c2_nota",
        bField: "In uso",
        note: "La tessera dice «Marco Lendi». La nota, stessa foto, dice «il Ragioniere» — il nome che ricorre nei rapporti sulle Brigate. Protocollo R-0455, il primo che hai imparato.",
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      approva({
        text: "Timbri. «Marco Lendi» ti ringrazia col mento e sparisce. Hai appena fatto passare un uomo che non esiste. Da qualche parte, qualcuno annota che sei collaborativo.",
        factions: { anello: { reputation: 8 } },
        country: { verita: -3 },
        sospetto: -2,
        setFlags: ["passato_ragioniere", "debito_anello"],
        unlockCases: ["ret_anello_favore"],
        logTitle: "Lasciato passare «il Ragioniere»",
      }),
      segnala(
        {
          text: "Segnali la doppia identità. Per qualche ora ti senti un funzionario vero. Poi il telefono inizia a squillare, e non rispondi.",
          factions: { anello: { reputation: -12, suspicion: 14 }, procura: { reputation: 8 } },
          country: { verita: 6 },
          sospetto: 10,
          setFlags: ["segnalato_ragioniere", "nemico_anello"],
          unlockCases: ["ret_anello_minaccia"],
          logTitle: "Segnalata la doppia identità del «Ragioniere»",
        },
        { lockHint: "Confronta tessera e nota: la contraddizione regge la segnalazione." },
      ),
      richiediVerifica({
        text: "Chiedi una verifica d'identità. La risposta arriva in dieci minuti, dall'alto: «Soggetto noto a quest'ufficio. Proceda.» Tradotto: non chiedere più.",
        factions: { anello: { suspicion: 4 } },
        setFlags: ["verifica_ragioniere"],
        logTitle: "Richiesta verifica sul «Ragioniere»",
      }),
    ],
  },

  /* ========= GIORNO 5 — primo riferimento indiretto a una fazione ========= */
  {
    id: "a5_nulla_osta_anello",
    specialActionId: "trattieni",
    subject: "Pratica edilizia 0418-bis",
    faction: "anello",
    summary: "Un nulla osta che non hai chiesto, da nessuno che si firmi",
    intro: [
      "Una pratica banale: una concessione edilizia. La apri e dentro trovi una cosa che non ci dovrebbe essere.",
      "Un nulla osta. Senza intestazione. Con un sigillo: un anello spezzato.",
    ],
    documents: [
      {
        id: "a5c1_concessione",
        kind: "permesso",
        title: "Concessione edilizia 0418-bis",
        issuer: "Comune di Roma",
        authLevel: "libero",
        protocollo: "0418-bis/1974",
        fields: [
          { label: "Richiedente", value: "Imm. Bramante S.r.l.", comparable: true },
          { label: "Area", value: "ex deposito portuale", comparable: true },
        ],
        body: ["Si autorizza la riconversione dell'area. Vedi nulla osta allegato."],
      },
      {
        id: "a5c2_nullaosta",
        kind: "nota",
        title: "Nulla osta (senza intestazione)",
        issuer: "—",
        authLevel: "segreto",
        fields: [
          { label: "Firma", value: "illeggibile", comparable: true },
          { label: "Sigillo", value: "anello spezzato", comparable: true },
        ],
        body: ["Si dispone che la pratica proceda senza ulteriori verifiche. Per conoscenza: nessuno."],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      approva({
        text: "Procedi come «dispone» il nulla osta. L'area Bramante cambia destinazione. Hai obbedito a una firma che non c'è. È così che ti tengono: facendoti abituare.",
        factions: { anello: { reputation: 10 }, governo: { reputation: 6 } },
        country: { verita: -4, compromesso: 4 },
        sospetto: -3,
        setFlags: ["obbedito_anello", "anello_riferimento", "debito_anello"],
        unlockCases: ["ret_anello_favore"],
        logTitle: "Concessione Bramante: obbedito al nulla osta dell'Anello",
      }),
      special(
        "trattieni",
        "Trattieni (manca la firma)",
        "trattieni",
        {
          text: "Trattieni la pratica: un nulla osta senza firma non è un atto. Per la prima volta dici di no all'anello spezzato. Per la prima volta, qualcuno lassù impara il tuo nome.",
          factions: { anello: { reputation: -8, suspicion: 10 } },
          country: { verita: 4 },
          sospetto: 8,
          setFlags: ["trattenuto_anello", "anello_riferimento", "nemico_anello"],
          unlockCases: ["ret_anello_minaccia"],
          logTitle: "Trattenuta la concessione Bramante (firma assente)",
        },
        { requires: { authLevel: "segreto" }, lockHint: "Serve un atto riservato/segreto da trattenere." },
      ),
      richiediVerifica({
        text: "Chiedi chi ha emesso il nulla osta. La domanda resta senza risposta, ma viene registrata. Ora sanno che hai notato il sigillo.",
        factions: { anello: { suspicion: 6 } },
        setFlags: ["anello_riferimento"],
        logTitle: "Richiesta sull'origine del nulla osta dell'Anello",
      }),
    ],
  },

  /* ============= GIORNO 6 — caso sotto la telefonata ambigua ============== */
  {
    id: "a6_fascicolo_cardo2",
    subject: "Fonte «Cardo» — seguito",
    faction: "sir",
    summary: "La fonte che avevi incrociato torna, e stavolta pesa di più",
    intro: [
      "Il nome «Cardo» riaffiora. Stavolta in un fascicolo più spesso.",
      "Mentre lo apri, il telefono comincia a squillare. Lo lasci squillare. Per ora.",
    ],
    documents: [
      {
        id: "a6c1_fascicolo",
        kind: "fascicolo",
        title: "Fascicolo fonte «Cardo» (agg.)",
        issuer: "SIR — sezione II",
        authLevel: "segreto",
        protocollo: "S-0188/1974",
        fields: [
          { label: "Fonte", value: "Cardo", comparable: true },
          { label: "Collegamento", value: "fondo R — versamenti", comparable: true },
          { label: "Nulla osta", value: "ASSENTE", comparable: true },
        ],
        body: [
          "La fonte ha movimentato denaro tra il fondo R e l'area Bramante.",
          "Si chiede, ancora una volta, di non lasciare traccia.",
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      special("occulta", "Non lasciare traccia (occulta)", "occulta", {
        text: "Stralci, come chiedono. Cardo resta un'ombra utile. Il «fondo R» guadagna un'altra notte di buio.",
        factions: { sir: { reputation: 8 }, anello: { reputation: 8 } },
        country: { verita: -5 },
        sospetto: -3,
        setFlags: ["fondoR_coperto"],
        logTitle: "Coperto di nuovo il collegamento Cardo–fondo R",
      }),
      special(
        "trasmetti_procura",
        "Trasmetti alla Procura",
        "trasmetti",
        {
          text: "Mandi il fascicolo ad Ardenti. Il «fondo R» ha ora un secondo riscontro agli atti. Il telefono, intanto, ha smesso di squillare. Non è un buon segno.",
          factions: { procura: { reputation: 12 }, sir: { reputation: -10, suspicion: 10 }, anello: { suspicion: 8 } },
          country: { verita: 8 },
          sospetto: 12,
          setFlags: ["fondoR_procura", "verbale_alla_procura", "amico_procura"],
          unlockCases: ["ret_procura_ancora"],
          logTitle: "Collegamento fondo R trasmesso alla Procura",
        },
        { target: "magistratura" },
      ),
      archivia({
        text: "Archivi senza decidere. Il fascicolo torna nel buio da cui è venuto. Hai solo rimandato la scelta. Le scelte rimandate, qui, tornano più pesanti.",
        factions: { sir: { suspicion: 4 } },
        logTitle: "Fascicolo Cardo (agg.) archiviato",
      }),
    ],
  },

  /* ============ GIORNO 7 — caso accanto all'evento animato (scorta) ======= */
  {
    id: "a7_porto_armi_rete",
    specialActionId: "trasmetti_procura",
    subject: "Tessera del poligono",
    faction: "rete",
    summary: "Un'altra tessera, lo stesso «deposito» che non dovrebbe esistere",
    intro: [
      "Fuori dal vetro, due guardie accompagnano via qualcuno. Tu hai una tessera da timbrare.",
      "Poligono di tiro, iscrizione annuale. Banale. Se non fosse per l'indirizzo.",
    ],
    documents: [
      {
        id: "a7c1_tessera",
        kind: "tessera",
        title: "Tessera poligono di tiro",
        issuer: "Questura di Roma",
        authLevel: "libero",
        fields: [
          { label: "Iscritto", value: "G. Maderna", comparable: true },
          { label: "Recapito", value: "via dei Magazzini 4", comparable: true },
        ],
      },
      {
        id: "a7c2_elenco",
        kind: "fascicolo",
        title: "Elenco riservato (estratto)",
        issuer: "—",
        authLevel: "segreto",
        censored: 4,
        fields: [
          { label: "Recapito", value: "via dei Magazzini 4 — deposito", comparable: true },
          { label: "Voce", value: "«da attivare» — [omissis]", comparable: true },
        ],
        body: ["Stesso indirizzo della tessera. Sotto, quattro righe nere. La struttura ha le sue scorte, e i suoi custodi inconsapevoli."],
      },
    ],
    discrepancies: [
      {
        aDocId: "a7c1_tessera",
        aField: "Recapito",
        bDocId: "a7c2_elenco",
        bField: "Recapito",
        note: "Il poligono e il «deposito da attivare» hanno lo stesso indirizzo. La Rete custodisce armi dietro un'iscrizione sportiva.",
      },
    ],
    regulationVerdict: "approva",
    actions: [
      approva({
        text: "Timbri e archivi la coincidenza. Maderna torna a casa, in via dei Magazzini 4, dove l'aspetta qualcosa che non sa di custodire.",
        factions: { rete: { reputation: 6 } },
        country: { verita: -2 },
        setFlags: ["rete_intatta"],
        logTitle: "Tessera poligono convalidata, indirizzo ignorato",
      }),
      special(
        "trasmetti_procura",
        "Segnala l'indirizzo alla Procura",
        "trasmetti",
        {
          text: "Fai uscire l'estratto. Un indirizzo, quattro righe nere: abbastanza perché qualcuno vada a guardare cosa c'è in via dei Magazzini 4.",
          factions: { procura: { reputation: 12 }, rete: { reputation: -12, suspicion: 12 }, anello: { suspicion: 8 } },
          player: { famiglia: -6 },
          country: { verita: 8 },
          sospetto: 12,
          setFlags: ["deposito_alla_procura", "scoperta_rete"],
          logTitle: "Deposito della Rete segnalato alla Procura",
        },
        { target: "magistratura" },
      ),
      special("occulta", "Fai sparire l'estratto", "occulta", {
        text: "L'estratto non è mai arrivato. Il deposito resta dov'è, paziente. Tu dormi peggio, ma dormi.",
        factions: { anello: { reputation: 8 }, rete: { reputation: 6 } },
        country: { verita: -5 },
        sospetto: -3,
        setFlags: ["occultata_rete"],
        logTitle: "Occultato l'estratto sul deposito della Rete",
      }),
    ],
  },

  /* ===================== GIORNO 9 — il «fondo R» a nudo =================== */
  {
    id: "a9_fondo_r",
    subject: "Faldone «fondo R»",
    faction: "governo",
    summary: "Tutti i fili del fondo nero, in una sola cartella, sulla tua scrivania",
    intro: [
      "Qualcuno ha commesso un errore: ha lasciato che tutto finisse insieme, qui, davanti a te.",
      "Il fondo del partito, l'area Bramante, la fonte Cardo, il protocollo R-0455. Il «fondo R».",
    ],
    documents: [
      {
        id: "a9c1_faldone",
        kind: "fascicolo",
        title: "Faldone «fondo R»",
        issuer: "Archivio Centrale",
        authLevel: "segreto",
        protocollo: "R-0455/1974",
        fields: [
          { label: "Contenuto", value: "versamenti, intestazioni, due firme di troppo", comparable: true },
          { label: "Esposizione", value: "governo, Anello, Cupola", comparable: true },
        ],
        body: [
          "La prova che lo Stato ha pagato chi lo colpiva, e chi lo ricattava.",
          "Il tuo predecessore lo stava chiudendo quando è stato «trasferito».",
        ],
      },
    ],
    actions: [
      special("distruggi", "Chiudi come ha tentato lui (distruggi)", "distruggi", {
        text: "Fai sparire il faldone, come stava per fare il tuo predecessore. A differenza sua, tu sai fermarti in tempo. Lunedì, forse, una porta migliore.",
        factions: { governo: { reputation: 16 }, anello: { reputation: 14 } },
        country: { verita: -12, compromesso: 8 },
        sospetto: -8,
        setFlags: ["fondoR_distrutto", "servito_crisanti"],
        logTitle: "Faldone «fondo R» distrutto",
      }),
      special(
        "trasmetti_procura",
        "Affida tutto ad Ardenti",
        "trasmetti",
        {
          text: "Consegni il «fondo R» alla Procura. Ardenti ora ha la prova. Tu hai un bersaglio sulla schiena, e da stanotte la macchina sotto casa non è la tua.",
          factions: { procura: { reputation: 18 }, governo: { reputation: -16 }, anello: { suspicion: 16 } },
          player: { famiglia: -10 },
          country: { verita: 14 },
          sospetto: 16,
          setFlags: ["fondoR_procura", "dossier_procura"],
          unlockEndings: ["collaboratore_procura"],
          logTitle: "«Fondo R» affidato alla Procura",
        },
        { target: "magistratura" },
      ),
      special("occulta", "Tienine una copia", "occulta", {
        text: "Fotocopi il faldone e rimetti l'originale dov'era. Una copia, da qualche parte, è un'assicurazione. O una condanna rimandata.",
        player: { lucidita: -4 },
        sospetto: 6,
        setFlags: ["copia_fondoR"],
        logTitle: "Copia del «fondo R» trafugata",
      }),
    ],
  },

  /* ================== CASI-RITORNO (conseguenze differite) ================
   * Iniettati dalla scelta precedente (unlockCases) e gated su flag: la fazione
   * TORNA in base a ciò che hai fatto. Chiudono il cerchio scelta→conseguenza.
   */

  // Hai SERVITO l'Anello (a4 approva / a5 approva) → ti chiedono un favore peggiore.
  {
    id: "ret_anello_favore",
    subject: "La cortesia dell'Anello",
    faction: "anello",
    appearsIfFlag: "debito_anello",
    summary: "Chi accetta un favore, prima o poi ne deve uno",
    intro: [
      "Niente telefono, stavolta. Un fascicolo sottile, lasciato sul bancone da nessuno.",
      "Dentro, un nome e una data. E un foglietto: «Quel verbale. Lo perda. Come l'altra volta. Grazie.»",
    ],
    documents: [
      {
        id: "reta_verbale",
        kind: "verbale",
        title: "Verbale da «smarrire»",
        issuer: "—",
        authLevel: "segreto",
        protocollo: "R-0712/1974",
        fields: [
          { label: "Oggetto", value: "testimone — fatti di Piazza dei Tigli", comparable: true },
          { label: "Sigillo", value: "anello spezzato", comparable: true },
        ],
        body: ["Un testimone scomodo ha parlato. Il verbale non deve esistere. L'Anello conta su di te. Di nuovo."],
      },
    ],
    actions: [
      special("occulta", "Smarrisci il verbale (come chiedono)", "occulta", {
        text: "Lo fai sparire. Il testimone non ha mai parlato. Sei sempre più utile, e sempre meno libero. La prossima volta non chiederanno: ordineranno.",
        factions: { anello: { reputation: 12 } },
        country: { verita: -6, compromesso: 6 },
        sospetto: -4,
        setFlags: ["servito_anello_2", "fondoR_coperto"],
        clearFlags: ["debito_anello"],
        logTitle: "Smarrito un verbale per l'Anello (secondo favore)",
      }, { requires: {} }),
      special("trasmetti_procura", "Rifiuta: manda il verbale alla Procura", "trasmetti", {
        text: "Stavolta dici no. E un no, all'Anello, vale come una dichiarazione di guerra. Da domani la macchina sotto casa potrebbe non essere la tua.",
        factions: { anello: { reputation: -18, suspicion: 16 }, procura: { reputation: 12 } },
        country: { verita: 8 },
        sospetto: 12,
        setFlags: ["nemico_anello", "verbale_alla_procura"],
        clearFlags: ["debito_anello"],
        unlockCases: ["ret_anello_minaccia"],
        logTitle: "Rifiutato il secondo favore all'Anello",
      }, { requires: {}, target: "magistratura" }),
    ],
  },

  // Hai INCRINATO l'Anello (a4 segnala / a5 trattieni / rifiuto) → ritorsione.
  {
    id: "ret_anello_minaccia",
    subject: "Un atto a tuo nome",
    faction: "anello",
    appearsIfFlag: "nemico_anello",
    summary: "Loro non minacciano. Ti incastrano.",
    intro: [
      "Tra le pratiche del mattino, una che non hai mai visto. Eppure porta la tua firma.",
      "È un nulla osta illecito, datato la settimana scorsa, intestato a te. Se resta agli atti, il prossimo fascicolo aperto sarà il tuo.",
    ],
    documents: [
      {
        id: "retm_nullaosta",
        kind: "nota",
        title: "Nulla osta «a tua firma»",
        issuer: "—",
        authLevel: "segreto",
        fields: [
          { label: "Firma", value: "(la tua, imitata)", comparable: true },
          { label: "Sigillo", value: "anello spezzato", comparable: true },
        ],
        body: ["Un falso costruito bene. Tanto bene che, davanti agli Affari Interni, dovresti dimostrare tu di non averlo scritto."],
      },
    ],
    actions: [
      special("distruggi", "Distruggi il falso (in silenzio)", "distruggi", {
        text: "Lo bruci nel posacenere. Nessuno saprà. Ma adesso sai cosa sanno fare, e che possono rifarlo quando vogliono. Dormi con la luce accesa.",
        player: { lucidita: -5 },
        sospetto: 4,
        setFlags: ["sopravvissuto_ricatto"],
        clearFlags: ["nemico_anello"],
        logTitle: "Distrutto un falso costruito a tuo nome",
      }, { requires: {} }),
      special("trasmetti_procura", "Denuncia il falso alla Procura", "trasmetti", {
        text: "Porti il falso ad Ardenti come prova del metodo. È coraggio, o incoscienza. Da stanotte, la tua famiglia dorme in casa di un'amica.",
        factions: { anello: { suspicion: 14 }, procura: { reputation: 14 } },
        player: { famiglia: -8 },
        country: { verita: 6 },
        sospetto: 14,
        setFlags: ["denunciato_anello", "dossier_procura"],
        clearFlags: ["nemico_anello"],
        logTitle: "Denunciato il falso dell'Anello alla Procura",
      }, { requires: {}, target: "magistratura" }),
    ],
  },

  // Hai AIUTATO la Procura → Ardenti torna e chiede di più (la posta sale).
  {
    id: "ret_procura_ancora",
    subject: "Giudice Ardenti — di nuovo",
    faction: "procura",
    appearsIfFlag: "amico_procura",
    summary: "Chi dà una carta al giudice, prima o poi gliene deve un'altra",
    intro: [
      "Una richiesta formale, e sotto, due righe a penna: «So che è lei. Mi serve l'ultimo tassello. Dopo, la proteggo. Se posso.»",
      "Ardenti non promette molto. Ma è l'unico, qui, che non mente.",
    ],
    documents: [
      {
        id: "retp_richiesta",
        kind: "lettera",
        title: "Richiesta integrativa di atti",
        issuer: "Procura della Repubblica",
        authLevel: "libero",
        protocollo: "PR-401/1974",
        fields: [{ label: "Firma", value: "Ardenti", comparable: true }],
        body: ["Per chiudere il quadro sul fondo R serve l'intestazione mancante. Senza, l'inchiesta si ferma."],
      },
    ],
    actions: [
      special("trasmetti_procura", "Dài ad Ardenti l'ultimo tassello", "trasmetti", {
        text: "Glielo procuri. Adesso il quadro è completo: il giudice può colpire in alto. E tu sei, ufficialmente, una fonte interna. Cioè un bersaglio.",
        factions: { procura: { reputation: 16 }, governo: { reputation: -10 }, anello: { suspicion: 12 } },
        player: { famiglia: -8 },
        country: { verita: 10 },
        sospetto: 14,
        setFlags: ["dossier_procura"],
        unlockEndings: ["collaboratore_procura"],
        logTitle: "Fornito ad Ardenti l'ultimo tassello",
      }, { requires: {}, target: "magistratura" }),
      special("trattieni", "Tirati indietro finché sei in tempo", "trattieni", {
        text: "Non rispondi alla richiesta. Ardenti capisce. «Ha ragione lei. Si salvi.» L'inchiesta si fermerà a un passo. La verità aspetterà un altro funzionario, un altro decennio.",
        factions: { procura: { reputation: -8 } },
        player: { lucidita: -3 },
        sospetto: -4,
        setFlags: ["procura_abbandonata"],
        clearFlags: ["amico_procura"],
        logTitle: "Tirato indietro con la Procura",
      }, { requires: {} }),
    ],
  },

  /* ============ GIORNO 9 — l'NPC RITORNA e reagisce alla tua scelta ========
   * Varianti mutuamente esclusive (appearsIfFlag su caseIds base): la giornata
   * cambia faccia a seconda di cosa hai fatto con Renzo Calabro al Giorno 1–2.
   */

  // L'hai SCAGIONATO (G1) → Renzo torna di persona, e stavolta è lui ad aiutare te.
  {
    id: "ret_renzo_torna",
    specialActionId: "proteggi",
    subject: "Renzo Calabro — di ritorno",
    faction: "brigate",
    appearsIfFlag: "militante_protetto",
    summary: "Il ragazzo che hai scagionato è davanti al vetro. E sa qualcosa.",
    intro: [
      "Lo riconosci subito: mani ferme, sguardo che non si abbassa. Renzo.",
      "«Lei mi ha tenuto fuori dal fascicolo. Non lo dimentico. Ho sentito un nome, nei posti che frequento: fondo R. Le interessa?»",
    ],
    documents: [
      {
        id: "ret9a_biglietto",
        kind: "nota",
        title: "Biglietto passato sotto il vetro",
        issuer: "—",
        authLevel: "libero",
        fields: [{ label: "Grafia", value: "minuta, di fretta", comparable: true }],
        body: [
          "«I versamenti partivano da un ufficio del porto. Il vostro 'consulente' li firmava con un nome falso.»",
          "«Se le serve, io questo l'ho visto. E lo posso ripetere.»",
        ],
      },
    ],
    actions: [
      special("proteggi", "Accetta la testimonianza (proteggilo)", "proteggi", {
        text: "Prendi il biglietto e gli dici di sparire per un po'. Ora hai un testimone sul fondo R. E un debito in più verso un ragazzo che doveva essere un nemico.",
        factions: { brigate: { reputation: 6 }, procura: { reputation: 8 } },
        country: { verita: 6 },
        sospetto: 5,
        setFlags: ["testimone_renzo", "amico_procura"],
        unlockCases: ["ret_procura_ancora"],
        logTitle: "Accettata la testimonianza di Renzo sul fondo R",
      }, { requires: {} }),
      respingi({
        text: "«Vada via. Non l'ho mai vista.» Renzo annuisce, piega il biglietto, sparisce. Ha capito. Certe gentilezze si fanno una volta sola.",
        factions: { brigate: { reputation: -4 } },
        player: { lucidita: -3 },
        setFlags: ["renzo_respinto_ritorno"],
        logTitle: "Rifiutata la testimonianza di Renzo",
      }),
    ],
  },

  // Hai fatto SCARCERARE Renzo su istanza di Giulia (G2) → Giulia torna a avvertirti.
  {
    id: "ret_giulia_torna",
    subject: "Giulia Calabro — di ritorno",
    faction: "brigate",
    appearsIfFlag: "renzo_aiutato",
    summary: "La ragazza che ti aveva implorato. Stavolta è lei che avverte te.",
    intro: [
      "Giulia. Gli occhi non sono più rossi: sono attenti.",
      "«Lei ha scritto quella riga per mio fratello. Ora ascolti me: fanno domande su di lei, negli ambienti sbagliati. Un uomo con una tessera da consulente. Stia attento.»",
    ],
    documents: [
      {
        id: "ret9b_avviso",
        kind: "nota",
        title: "Parole riferite a voce",
        issuer: "—",
        authLevel: "libero",
        fields: [{ label: "Fonte", value: "Giulia Calabro", comparable: true }],
        body: ["«Chiedevano dei suoi orari. Di che strada fa. Non è il modo in cui si chiede di un impiegato qualsiasi.»"],
      },
    ],
    actions: [
      archivia({
        text: "La ringrazi e mandi a mente ogni parola. Sapere prima è metà del vantaggio. L'altra metà è arrivare a stasera.",
        player: { lucidita: 3 },
        sospetto: -3,
        setFlags: ["avvisato_da_giulia"],
        logTitle: "Avvertimento di Giulia annotato",
      }, "Ascolta e registra l'avvertimento."),
      segnala({
        text: "La segnali: «contatti con ambienti dell'autonomia». Ti ha avvertito, e tu l'hai schedata. C'è una parola per questo, e la sai.",
        factions: { sir: { reputation: 4 }, brigate: { reputation: -14, suspicion: 10 } },
        player: { lucidita: -8 },
        country: { repressione: 2 },
        setFlags: ["giulia_segnalata"],
        logTitle: "Segnalata Giulia dopo l'avvertimento",
      }, { requires: {} }),
    ],
  },

  // Hai SEGNALATO anche Giulia (G2) → le Brigate presentano il conto.
  {
    id: "ret_conto_brigate",
    subject: "Volantino con il tuo nome",
    faction: "brigate",
    appearsIfFlag: "giulia_segnalata",
    summary: "Le Brigate non dimenticano chi ha schedato una dei loro",
    intro: [
      "Nessuno allo sportello. Solo un volantino ciclostilato, infilato sotto il vetro durante la notte.",
      "C'è una lista di «servi dello Stato». Il terzo nome è il tuo.",
    ],
    documents: [
      {
        id: "ret9c_volantino",
        kind: "lettera",
        title: "Volantino ciclostilato",
        issuer: "—",
        authLevel: "libero",
        fields: [
          { label: "Sigla", value: "stella a cinque punte", comparable: true },
          { label: "Voce 3", value: "il funzionario dello sportello 7", comparable: true },
        ],
        body: ["«Chi scheda i compagni risponderà ai compagni. Sappiamo dove timbra. Sappiamo dove torna.»"],
      },
    ],
    actions: [
      segnala({
        text: "Consegni il volantino agli Affari Interni e chiedi protezione. Te la concedono: una pattuglia sotto casa. Adesso ti proteggono gli stessi che ti sorvegliano.",
        factions: { sir: { reputation: 6 }, brigate: { suspicion: 8 } },
        player: { famiglia: -6 },
        country: { repressione: 3 },
        sospetto: 4,
        setFlags: ["protezione_richiesta"],
        logTitle: "Chiesta protezione per la minaccia BP",
      }, { requires: {}, hint: "Consegna la minaccia e chiedi protezione." }),
      special("distruggi", "Brucialo e non dirlo a nessuno", "distruggi", {
        text: "Lo bruci nel posacenere. Se lo Stato sapesse, ti «proteggerebbe»: cioè ti userebbe. Meglio la paura privata della custodia pubblica. Forse.",
        player: { lucidita: -6, famiglia: -4 },
        setFlags: ["minaccia_taciuta"],
        logTitle: "Minaccia delle BP taciuta",
      }, { requires: {} }),
    ],
  },
];

