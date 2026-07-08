import type { CaseDef } from "@/types";
import { approva, respingi, archivia, segnala, special } from "./helpers";

/**
 * GIORNO 2 — Giovedì 15 marzo.
 * Le regole si complicano (nulla osta, firme). Arrivano i poteri veri:
 * una fonte scomoda, un magistrato, un giornalista. E i ritorni del Giorno 1.
 */
export const DAY2_CASES: CaseDef[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: "d2_informatore",
    subject: "Fonte «Cardo»",
    faction: "sir",
    summary: "Richiesta di copertura per una fonte collegata a un attentato",
    intro: [
      "Un plico del SIR, classificato. Riguarda un informatore.",
      "E un foglietto anonimo che il plico vorrebbe non fosse mai arrivato.",
    ],
    documents: [
      {
        id: "d2c1_rapporto",
        kind: "rapporto",
        title: "Rapporto sulla fonte «Cardo»",
        issuer: "SIR — sezione II",
        authLevel: "segreto",
        protocollo: "S-0091/1974",
        fields: [
          { label: "Fonte", value: "Cardo", comparable: true },
          { label: "Nulla osta", value: "ASSENTE", comparable: true },
        ],
        body: [
          "La fonte ha fornito notizie utili sulla colonna cittadina.",
          "Si chiede di stralciare dagli atti ogni riferimento alla sua presenza in Piazza dei Tigli il giorno dell'ordigno.",
        ],
      },
      {
        id: "d2c1_anonima",
        kind: "informativa",
        title: "Informativa anonima",
        issuer: "—",
        authLevel: "libero",
        fields: [{ label: "Provenienza", value: "ignota", comparable: true }],
        body: [
          "«Cardo» era sul posto venti minuti prima dello scoppio. Parlava con due che non erano dei nostri.",
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      special("trasmetti_sir", "Copri la fonte (trasmetti al SIR)", "trasmetti", {
        text: "Stralci i riferimenti, copri Cardo. La fonte resta operativa. La piazza, e i suoi morti, restano senza una riga.",
        factions: {
          sir: { reputation: 12 },
          anello: { reputation: 6 },
          procura: { reputation: -6 },
        },
        country: { verita: -5, repressione: 2 },
        sospetto: -2,
        setFlags: ["coperto_cardo"],
        logTitle: "Coperta la fonte Cardo",
      }),
      special("trasmetti_procura", "Consegna alla Procura", "trasmetti", {
        text: "Trasmetti tutto alla Procura: il rapporto e il foglietto anonimo. Il collegamento tra una fonte di Stato e un attentato è ora agli atti.",
        factions: {
          procura: { reputation: 14 },
          sir: { reputation: -12, suspicion: 12 },
          anello: { suspicion: 8 },
        },
        country: { verita: 7 },
        sospetto: 10,
        setFlags: ["cardo_alla_procura"],
        logTitle: "Collegamento Cardo–attentato alla Procura",
      }),
      special("occulta", "Occulta l'informativa anonima", "occulta", {
        text: "Fai sparire il foglietto. Resta solo la versione ufficiale. È più ordinata. È più falsa.",
        factions: { anello: { reputation: 8 }, sir: { reputation: 4 } },
        country: { verita: -6 },
        sospetto: -3,
        setFlags: ["occultato_cardo"],
        logTitle: "Occultata l'informativa su Cardo",
      }),
      archivia({
        text: "Archivi entrambi i documenti senza toccarli. Restano lì, uno accanto all'altro, in attesa che qualcuno li trovi. O nessuno.",
        factions: { sir: { suspicion: 4 } },
        country: { verita: 2 },
        logTitle: "Pratica Cardo archiviata intatta",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: "d2_magistrato",
    subject: "Giudice Ardenti",
    faction: "procura",
    summary: "Richiesta di accesso agli atti — bloccata dall'alto",
    intro: [
      "Due carte che si contraddicono sulla tua scrivania.",
      "Un magistrato chiede. Un superiore vieta. Tu decidi quale delle due vince.",
    ],
    documents: [
      {
        id: "d2c2_ordine",
        kind: "ordine",
        title: "Ordine di non esibizione",
        issuer: "Gabinetto Velardi",
        authLevel: "riservato",
        protocollo: "R-0512/1974",
        fields: [
          { label: "Firma", value: "Velardi", comparable: true },
          { label: "Motivazione", value: "segreto istruttorio interno", comparable: true },
        ],
        body: ["Si nega l'accesso agli atti relativi all'appalto Bramante."],
      },
      {
        id: "d2c2_lettera",
        kind: "lettera",
        title: "Richiesta di accesso agli atti",
        issuer: "Procura della Repubblica",
        authLevel: "libero",
        protocollo: "PR-228/1974",
        fields: [{ label: "Firma", value: "Ardenti", comparable: true }],
        body: [
          "Nell'ambito di indagine su turbativa d'asta, si richiedono gli atti dell'appalto Bramante.",
        ],
      },
    ],
    discrepancies: [
      {
        aDocId: "d2c2_ordine",
        aField: "Motivazione",
        bDocId: "d2c2_lettera",
        bField: "Firma",
        note: "Il «segreto istruttorio interno» non esiste in alcun codice. È una formula inventata per coprire.",
      },
    ],
    actions: [
      special("trasmetti_procura", "Concedi l'accesso", "trasmetti", {
        text: "Trasmetti gli atti ad Ardenti. La macchina della giustizia ha quello che cerca. Velardi saprà chi gliel'ha dato.",
        factions: {
          procura: { reputation: 14 },
          governo: { reputation: -10 },
          anello: { suspicion: 6 },
        },
        country: { verita: 5 },
        sospetto: 8,
        setFlags: ["accesso_concesso"],
        logTitle: "Accesso concesso alla Procura",
      }),
      special(
        "nega",
        "Nega l'accesso (esegui l'ordine)",
        "occulta",
        {
          text: "Applichi l'ordine. La richiesta del giudice torna indietro con un timbro: «atti non esibibili». La giustizia aspetterà.",
          factions: {
            governo: { reputation: 8 },
            anello: { reputation: 4 },
            procura: { reputation: -10 },
          },
          country: { repressione: 3 },
          sospetto: -2,
          setFlags: ["accesso_negato"],
          logTitle: "Accesso negato alla Procura",
        },
        { needsStamp: true, stampLabel: "NON ESIBIBILE" },
      ),
      special("verifica", "Temporeggia (chiedi chiarimenti)", "verifica", {
        text: "Chiedi un chiarimento scritto a entrambi. Guadagni tempo. Perdi credibilità con tutti e due.",
        factions: { procura: { reputation: -3 }, governo: { reputation: -3 } },
        player: { lucidita: -3 },
        logTitle: "Richiesta atti rinviata",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: "d2_giornalista",
    subject: "Cronista Bechis",
    faction: "stampa",
    summary: "Una foto che può far esplodere tutto — o far uccidere qualcuno",
    intro: [
      "Una busta lasciata da un cronista che «passava per caso».",
      "Dentro, una fotografia e due righe scritte a mano.",
    ],
    documents: [
      {
        id: "d2c3_foto",
        kind: "fotografia",
        title: "Fotografia",
        issuer: "—",
        authLevel: "riservato",
        photo: { seed: 2025, label: "scambio" },
        fields: [{ label: "Soggetto", value: "due uomini, uno scambio", comparable: true }],
        body: [
          "Un uomo schedato «di sinistra» riceve un involucro da un agente in borghese.",
        ],
      },
      {
        id: "d2c3_nota",
        kind: "nota",
        title: "Biglietto del cronista",
        issuer: "La Stampa",
        fields: [{ label: "Firma", value: "Bechis", comparable: true }],
        body: ["Se me lo confermi, lo pubblico. Se no, lo brucio io. A te la scelta."],
      },
    ],
    actions: [
      special("trasmetti_stampa", "Conferma e passa alla stampa", "trasmetti", {
        text: "Confermi. La foto finirà in prima pagina. Lo Stato che arma i suoi nemici per poi arrestarli: ora lo sa anche la gente.",
        factions: {
          stampa: { reputation: 16 },
          anello: { reputation: -14, suspicion: 14 },
          sir: { suspicion: 8 },
        },
        country: { verita: 10, caos: 4 },
        sospetto: 12,
        setFlags: ["passato_stampa"],
        unlockEndings: ["scandalo"],
        logTitle: "Confermata la foto al cronista",
      }),
      special("occulta", "Blocca tutto (proteggi l'operazione)", "occulta", {
        text: "Neghi, depisti, fai sparire la copia. L'operazione prosegue al riparo. Bechis brucerà la foto, e con essa una verità.",
        factions: {
          anello: { reputation: 12 },
          sir: { reputation: 6 },
          stampa: { reputation: -10 },
        },
        country: { verita: -8, repressione: 2 },
        sospetto: -4,
        setFlags: ["protetta_operazione"],
        logTitle: "Bloccata la pubblicazione della foto",
      }),
      segnala({
        text: "Sequestri la foto e segnali Bechis come ricettatore di materiale riservato. Un cronista in meno tra i piedi. La stampa non lo dimentica.",
        factions: {
          sir: { reputation: 8 },
          anello: { reputation: 10 },
          stampa: { reputation: -16, suspicion: 12 },
        },
        country: { repressione: 5 },
        sospetto: -2,
        setFlags: ["bechis_segnalato"],
        logTitle: "Cronista Bechis segnalato",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: "d2_telex_routine",
    subject: "Registro centrale",
    summary: "Telex di routine — verifica protocolli",
    intro: [
      "Il telex sferraglia e sputa una striscia di carta.",
      "Verifica di routine: i protocolli del registro centrale.",
    ],
    documents: [
      {
        id: "d2c4_telex",
        kind: "telex",
        title: "Telex — registro protocolli",
        issuer: "Archivio Centrale",
        authLevel: "libero",
        fields: [
          { label: "Voce 1", value: "01142/1974 — OK", comparable: true },
          { label: "Voce 2", value: "0418 (senza anno) — IRREGOLARE", comparable: true },
          { label: "Voce 3", value: "S-0091/1974 — OK", comparable: true },
        ],
        body: ["Confermare o respingere la quadratura del registro."],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      respingi(
        {
          text: "Segnali la voce irregolare. Il registro andrà rifatto. Una piccola cosa giusta, in mezzo a tante storte.",
          factions: { governo: { reputation: 2 } },
          country: { verita: 1 },
          logTitle: "Registro: segnalata irregolarità",
        },
        "Una voce del registro è priva di anno: è irregolare.",
      ),
      approva({
        text: "Convalidi tutto in blocco, anche la voce irregolare. Più veloce. Meno tuo problema. Per ora.",
        sospetto: 3,
        logTitle: "Registro convalidato in blocco",
      }),
      archivia({
        text: "Rimandi la quadratura a domani. Il telex tace. Il registro non torna, e i registri che non tornano, qui, hanno la memoria lunga.",
        sospetto: 2,
        setFlags: ["registro_rinviato"],
        logTitle: "Quadratura registro rinviata",
      }),
    ],
  },

  /* ------------------------------------ INJECT: se hai segnalato Renzo (G1) */
  {
    id: "d2_sorella_renzo",
    arrestActionId: "segnala",
    specialActionId: "proteggi",
    subject: "Giulia Calabro",
    faction: "brigate",
    summary: "Istanza per il fratello arrestato",
    appearsIfFlag: "militante_segnalato",
    intro: [
      "Una ragazza con gli occhi rossi. La sorella di Renzo.",
      "«L'avete preso all'alba. Non ha fatto niente. Vi prego, una riga la potete scrivere.»",
    ],
    documents: [
      {
        id: "d2c5_istanza",
        kind: "lettera",
        title: "Istanza di scarcerazione",
        issuer: "Giulia Calabro",
        authLevel: "libero",
        fields: [
          { label: "Firma", value: "Giulia Calabro", comparable: true },
          { label: "Detenuto", value: "Renzo Calabro", comparable: true },
        ],
        body: ["Chiedo che sia riesaminata la posizione di mio fratello, incensurato."],
      },
      {
        id: "d2c5_nota",
        kind: "nota",
        title: "Nota interna",
        issuer: "SIR",
        authLevel: "riservato",
        protocollo: "R-0540/1974",
        fields: [{ label: "Stato", value: "trattenuto, nessun capo d'imputazione", comparable: true }],
        body: ["Trattenuto in via cautelare. Non emergono elementi nuovi."],
      },
    ],
    actions: [
      special("proteggi", "Annota la scarcerazione", "proteggi", {
        text: "Scrivi la riga che chiedeva. Renzo uscirà tra qualche giorno. Giulia non ti ringrazia: ti guarda soltanto, e va via.",
        factions: { brigate: { reputation: 8 }, sir: { reputation: -6 } },
        player: { lucidita: 3 },
        sospetto: 5,
        setFlags: ["renzo_aiutato"],
        logTitle: "Scarcerazione annotata per Renzo",
      }),
      respingi({
        text: "«La pratica segue il suo corso.» Giulia non grida. Annuisce, come chi se l'aspettava. Resta solo il rumore della sedia.",
        factions: { brigate: { reputation: -6 } },
        player: { lucidita: -5 },
        country: { repressione: 1 },
        setFlags: ["renzo_abbandonato"],
        logTitle: "Istanza per Renzo respinta",
      }),
      segnala({
        text: "Segnali anche Giulia: «contigua agli ambienti del fratello». Due Calabro in un colpo solo. Stanotte dormirai male, e lo sai.",
        factions: { sir: { reputation: 6 }, brigate: { reputation: -12, suspicion: 8 } },
        player: { lucidita: -8 },
        country: { repressione: 3 },
        sospetto: -2,
        setFlags: ["giulia_segnalata"],
        logTitle: "Segnalata anche Giulia Calabro",
      }),
    ],
  },
];
