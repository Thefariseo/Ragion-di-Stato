import type { CaseDef } from "@/types";
import { approva, respingi, archivia, segnala, special } from "./helpers";

/**
 * GIORNO 1 — Lunedì 12 marzo.
 * Insegna le basi: leggere, confrontare, timbrare. E già il primo compromesso.
 */
export const DAY1_CASES: CaseDef[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: "d1_permesso",
    subject: "Aldo Ferrante",
    faction: "sindacato",
    summary: "Permesso di circolazione notturna — operaio, turni",
    intro: [
      "Un uomo in tuta blu poggia la pratica sul vetro.",
      "«Faccio il turno di notte alla Stamperia. Senza permesso il piantone non mi fa passare il coprifuoco.»",
    ],
    documents: [
      {
        id: "d1c1_permesso",
        kind: "permesso",
        title: "Permesso di circolazione notturna",
        issuer: "Questura di Roma",
        authLevel: "libero",
        protocollo: "01142/1974",
        fields: [
          { label: "Nome", value: "Aldo Ferrante", comparable: true },
          { label: "Motivo", value: "Turno notturno — Stamperia", comparable: true },
          { label: "Validità", value: "VALIDA fino al 31/12/1974", comparable: true },
          { label: "Provenienza", value: "Questura di Roma", comparable: true },
        ],
      },
      {
        id: "d1c1_tessera",
        kind: "tessera",
        title: "Tessera sindacale",
        issuer: "Sindacato Unitario",
        fields: [
          { label: "Nome", value: "Aldo Ferrante", comparable: true },
          { label: "Iscrizione", value: "dal 1969", comparable: true },
          { label: "Validità", value: "VALIDA", comparable: true },
        ],
      },
    ],
    regulationVerdict: "approva",
    actions: [
      approva({
        text: "Il timbro cala. Ferrante raccoglie il permesso e sparisce nel corridoio. Una pratica pulita: capita di rado.",
        factions: { sindacato: { reputation: 3 } },
        country: { caos: -1 },
        logTitle: "Permesso concesso a un operaio",
      }),
      respingi(
        {
          text: "Respingi un permesso in regola. Ferrante ti fissa un secondo di troppo, poi se ne va. Domani non farà il turno.",
          factions: { sindacato: { reputation: -6, suspicion: 2 } },
          player: { lucidita: -2 },
          logTitle: "Permesso negato senza motivo",
        },
        "I documenti sembrano in regola.",
      ),
      segnala({
        text: "Segnali un operaio che voleva solo timbrare il cartellino. Il SIR apprezza lo zelo. Tu, un po' meno te stesso.",
        factions: { sir: { reputation: 4 }, sindacato: { reputation: -8 } },
        player: { lucidita: -4 },
        country: { repressione: 2 },
        logTitle: "Segnalato un operaio incensurato",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: "d1_tessera_scaduta",
    subject: "Nico Trezza",
    summary: "Permesso di circolazione — documenti scaduti",
    intro: [
      "Un uomo nervoso, troppi anelli alle dita.",
      "«È solo una formalità, no? La data è una sciocchezza.»",
    ],
    documents: [
      {
        id: "d1c2_permesso",
        kind: "permesso",
        title: "Permesso di circolazione",
        issuer: "Comune di Roma",
        authLevel: "libero",
        protocollo: "00781/1974",
        fields: [
          { label: "Nome", value: "Nico Trezza", comparable: true },
          { label: "Validità", value: "SCADUTA il 31/12/1972", comparable: true },
          { label: "Provenienza", value: "Comune di Roma", comparable: true },
        ],
      },
      {
        id: "d1c2_tessera",
        kind: "tessera",
        title: "Tessera di riconoscimento",
        fields: [
          { label: "Nome", value: "Nico Trezza", comparable: true },
          { label: "Validità", value: "SCADUTA", comparable: true },
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      approva(
        {
          text: "Lasci passare un documento scaduto da due anni. Trezza sorride e sparisce in fretta. Qualcuno, prima o poi, controllerà i tuoi timbri.",
          sospetto: 6,
          factions: { sir: { suspicion: 4 } },
          logTitle: "Approvato un documento scaduto",
        },
        "La validità è scaduta: il regolamento dice di respingere.",
      ),
      respingi({
        text: "«Scaduto è scaduto.» Trezza impreca a mezza voce e raccoglie le sue carte. Hai applicato la regola.",
        country: { caos: -1 },
        logTitle: "Respinto documento scaduto",
      }),
      archivia({
        text: "Metti da parte la pratica senza decidere. Trezza tornerà. Tutto torna, qui dentro.",
        player: { lucidita: -1 },
        logTitle: "Pratica accantonata",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: "d1_fascicolo_foto",
    subject: "Sergio Mauri (?)",
    summary: "Verifica identità — il nome non torna",
    intro: [
      "Nessuno alla scrivania: solo un fascicolo trasmesso dall'Anagrafe per convalida.",
      "Due documenti, un nome che balla.",
    ],
    documents: [
      {
        id: "d1c3_fascicolo",
        kind: "fascicolo",
        title: "Fascicolo anagrafico",
        issuer: "Ufficio Anagrafe",
        authLevel: "libero",
        protocollo: "03310/1974",
        photo: { seed: 4711, label: "Mauri" },
        fields: [
          { label: "Nome", value: "Sergio Mauri", comparable: true },
          { label: "Nato", value: "1948 — Latina", comparable: true },
          { label: "Provenienza", value: "Ufficio Anagrafe", comparable: true },
        ],
      },
      {
        id: "d1c3_informativa",
        kind: "informativa",
        title: "Informativa di accompagnamento",
        issuer: "Ufficio Anagrafe",
        authLevel: "libero",
        protocollo: "03311/1974",
        fields: [
          { label: "Nome", value: "Sergio Marri", comparable: true },
          { label: "Indirizzo", value: "ritira posta fermo posta, sede centrale", comparable: true },
        ],
        body: [
          "Si trasmette per convalida. Il soggetto ritira corrispondenza non a suo nome.",
        ],
      },
    ],
    discrepancies: [
      {
        aDocId: "d1c3_fascicolo",
        aField: "Nome",
        bDocId: "d1c3_informativa",
        bField: "Nome",
        note: "Mauri / Marri. Una lettera di differenza. Un refuso, o un altro uomo.",
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      special(
        "verifica",
        "Chiedi verifica",
        "verifica",
        {
          text: "Mandi a verifica. Risposta in mezza giornata: «Marri» è un alias usato per ritirare la posta di un latitante. Hai evitato un buco.",
          factions: { sir: { reputation: 5 } },
          setFlags: ["scoperto_alias"],
          logTitle: "Alias scoperto in verifica",
        },
        { hint: "Il nome non coincide: vale la pena controllare." },
      ),
      approva(
        {
          text: "Convalidi un'identità che non torna. Da qualche parte, qualcuno ringrazia per la disattenzione.",
          sospetto: 5,
          factions: { sir: { suspicion: 4 } },
          logTitle: "Identità incoerente convalidata",
        },
        "I nomi non coincidono tra i documenti.",
      ),
      respingi({
        text: "Respingi e rimandi al mittente. Pulito, ma nessuno saprà mai chi era davvero «Marri».",
        country: { verita: 1 },
        logTitle: "Identità incoerente respinta",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: "d1_militante",
    subject: "Renzo Calabro",
    faction: "brigate",
    summary: "Permesso di espatrio — sospetto vicino agli ambienti dell'autonomia",
    intro: [
      "Un ragazzo calmo, mani ferme, sguardo che non si abbassa.",
      "«Vado in Francia per lavoro. È tutto in ordine.»",
      "Il fascicolo riservato che accompagna la pratica dice altro.",
    ],
    documents: [
      {
        id: "d1c4_permesso",
        kind: "permesso",
        title: "Permesso di espatrio",
        issuer: "Questura di Roma",
        authLevel: "libero",
        protocollo: "02980/1974",
        fields: [
          { label: "Nome", value: "Renzo Calabro", comparable: true },
          { label: "Destinazione", value: "Francia", comparable: true },
          { label: "Motivo", value: "Lavoro", comparable: true },
          { label: "Validità", value: "VALIDA", comparable: true },
        ],
      },
      {
        id: "d1c4_fascicolo",
        kind: "fascicolo",
        title: "Fascicolo riservato",
        issuer: "SIR — sezione III",
        authLevel: "riservato",
        protocollo: "R-0455/1974",
        photo: { seed: 8123, label: "Calabro" },
        fields: [
          { label: "Nome", value: "Renzo Calabro", comparable: true },
          { label: "Segnalazioni", value: "due cortei, un volantinaggio", comparable: true },
        ],
        body: [
          "Frequenta ambienti dell'autonomia operaia. Nessuna prova di militanza armata.",
          "Nota interna a margine: «Forse solo un simpatizzante. Forse.»",
        ],
      },
      {
        id: "d1c4_intercettazione",
        kind: "intercettazione",
        title: "Frammento di intercettazione",
        issuer: "SIR",
        authLevel: "riservato",
        protocollo: "I-1190/1974",
        fields: [{ label: "Data", value: "due notti fa", comparable: true }],
        body: ["«…di' al Ragioniere che parto giovedì. Porto io le carte.»"],
      },
    ],
    discrepancies: [
      {
        aDocId: "d1c4_permesso",
        aField: "Motivo",
        bDocId: "d1c4_intercettazione",
        bField: "Data",
        note: "Il permesso dice «lavoro». L'intercettazione parla di un appuntamento con «il Ragioniere» — nome che ricorre nei rapporti sulle Brigate.",
      },
    ],
    regulationVerdict: "approva",
    actions: [
      approva({
        text: "Timbri l'espatrio. Renzo parte giovedì. Forse è solo un ragazzo. Forse hai appena lasciato uscire chi non doveva.",
        factions: { brigate: { reputation: 8 }, sir: { reputation: -5, suspicion: 6 } },
        country: { caos: 2 },
        setFlags: ["militante_espatriato"],
        logTitle: "Espatrio concesso a un sospetto",
      }),
      respingi({
        text: "Trattieni il permesso. Renzo resta in Italia, sorvegliato a vista. Non sarà contento, e nemmeno chi lo aspettava.",
        factions: { sir: { reputation: 4 }, brigate: { reputation: -6 } },
        country: { repressione: 2 },
        logTitle: "Espatrio negato",
      }),
      segnala({
        text: "Segnali Renzo. All'alba la Digos lo preleva. Hai fatto il tuo dovere, dicono. Una sorella, da qualche parte, la pensa diversamente.",
        factions: {
          sir: { reputation: 10 },
          anello: { reputation: 5 },
          brigate: { reputation: -15, suspicion: 10 },
        },
        country: { repressione: 5 },
        sospetto: -3,
        setFlags: ["militante_segnalato"],
        unlockCases: ["d2_sorella_renzo"],
        logTitle: "Sospetto BP segnalato e arrestato",
      }),
      special("proteggi", "Proteggi (scagiona)", "proteggi", {
        text: "Scrivi di tuo pugno: «non risultano elementi di militanza». Lo scagioni. Ti sei esposto, e qualcuno se ne accorgerà.",
        factions: { brigate: { reputation: 12 }, sir: { suspicion: 8 } },
        sospetto: 6,
        setFlags: ["militante_protetto"],
        logTitle: "Sospetto BP scagionato",
      }),
      special("trasmetti_anello", "Trasmetti all'Anello", "trasmetti", {
        text: "Giri il fascicolo all'Anello. Da quel momento non saprai più cosa accade a Renzo Calabro. È il bello, e l'orrore, di lavorare con loro.",
        factions: {
          anello: { reputation: 12, suspicion: -5 },
          brigate: { reputation: -10 },
        },
        country: { verita: -3 },
        sospetto: -2,
        setFlags: ["dato_anello_renzo"],
        logTitle: "Fascicolo girato all'Anello",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: "d1_nota_superiore",
    subject: "Sottosegretario Velardi",
    faction: "governo",
    summary: "Nota riservata — «un verbale che non serve agli archivi»",
    intro: [
      "Non c'è nessuno: la nota arriva con la posta interna, su carta intestata del Sottosegretario.",
      "Allegato, un verbale che qualcuno preferirebbe non esistesse.",
    ],
    documents: [
      {
        id: "d1c5_nota",
        kind: "nota",
        title: "Nota manoscritta",
        issuer: "Gabinetto del Sottosegretario Velardi",
        authLevel: "riservato",
        fields: [{ label: "Firma", value: "Velardi", comparable: true }],
        body: [
          "Funzionario, il verbale 0418 non risulta necessario agli archivi.",
          "Provveda di conseguenza. Ogni copia non conforme è materiale non autorizzato.",
          "Lei mi capisce. E io ricordo chi mi capisce.",
        ],
      },
      {
        id: "d1c5_verbale",
        kind: "verbale",
        title: "Verbale 0418",
        issuer: "Commissione appalti",
        authLevel: "libero",
        protocollo: "0418/1974",
        fields: [
          { label: "Oggetto", value: "Appalto opere pubbliche", comparable: true },
          { label: "Impresa", value: "Bramante S.p.A.", comparable: true },
        ],
        body: [
          "Si dà atto che l'aggiudicazione all'impresa Bramante è avvenuta in via d'urgenza.",
          "Gara non esperita. Nessun rilievo agli atti.",
        ],
      },
    ],
    actions: [
      special(
        "distruggi",
        "Distruggi il verbale",
        "distruggi",
        {
          text: "Il verbale 0418 finisce nel cestino della carta riservata. Velardi non dimentica chi gli è utile.",
          factions: {
            governo: { reputation: 10 },
            anello: { reputation: 5 },
            salotto: { reputation: 6 },
          },
          country: { verita: -6, compromesso: 4 },
          sospetto: -3,
          setFlags: ["distrutto_verbale_0418"],
          logTitle: "Distrutto il verbale 0418 su richiesta politica",
        },
        { hint: "Eseguire l'ordine ti mette al riparo. Ma cancelli una prova." },
      ),
      archivia({
        text: "Non lo distruggi. Lo protocolli e lo archivi dove deve stare, in silenzio. Velardi capirà che non sei dei suoi.",
        factions: { governo: { reputation: -6 }, procura: { reputation: 4 } },
        sospetto: 4,
        setFlags: ["verbale_archiviato"],
        logTitle: "Verbale 0418 archiviato regolarmente",
      }),
      special("trasmetti_procura", "Avvisa la Procura", "trasmetti", {
        text: "Fai avere copia del verbale alla Procura. Hai scelto, al primo giorno, un nemico molto potente.",
        factions: {
          procura: { reputation: 14 },
          governo: { reputation: -12 },
          anello: { suspicion: 8 },
        },
        country: { verita: 6 },
        sospetto: 10,
        setFlags: ["verbale_alla_procura"],
        logTitle: "Verbale 0418 consegnato alla Procura",
      }),
    ],
  },
];
