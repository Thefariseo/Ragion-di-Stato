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
        setFlags: ["passato_ragioniere"],
        logTitle: "Lasciato passare «il Ragioniere»",
      }),
      segnala(
        {
          text: "Segnali la doppia identità. Per qualche ora ti senti un funzionario vero. Poi il telefono inizia a squillare, e non rispondi.",
          factions: { anello: { reputation: -12, suspicion: 14 }, procura: { reputation: 8 } },
          country: { verita: 6 },
          sospetto: 10,
          setFlags: ["segnalato_ragioniere"],
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
        setFlags: ["obbedito_anello", "anello_riferimento"],
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
          setFlags: ["trattenuto_anello", "anello_riferimento"],
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
          setFlags: ["fondoR_procura", "verbale_alla_procura"],
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
];
