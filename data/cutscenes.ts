import type { Cutscene, FactionId } from "@/types";

/**
 * Cutscene data-driven (motore in components/cutscene/CutsceneEngine).
 * INTRO: presenta ruolo, mondo, fazioni e tono prima del Giorno 1.
 * Beat senza durationMs attendono il click; quelli con durationMs avanzano soli.
 */
export const INTRO: Cutscene = {
  id: "intro",
  beats: [
    {
      bg: "black",
      scene: "stampfall",
      stampLabel: "RISERVATO",
      title: "MINISTERO DELL'INTERNO",
      lines: ["Repubblica Italiana. Anno XXVI.", "Su questo fascicolo, finora, c'era un altro nome."],
      sound: "stamp",
      music: "solenne",
    },
    {
      bg: "paper",
      scene: "letter",
      title: "Lettera di nomina — copia unica",
      lines: [
        "Si comunica la Sua assegnazione all'Ufficio Validazione e",
        "Archivio Centrale, con effetto immediato.",
        "",
        "Da oggi la Sua firma vale come quella dello Stato.",
        "Ogni copia non conforme è materiale non autorizzato.",
        "",
        "Il precedente titolare è stato trasferito.",
      ],
      sound: "type",
    },
    {
      bg: "desk",
      scene: "office_open",
      lines: ["Le sei del mattino. La lampada esita, poi tiene.", "L'ufficio si apre. Sei solo, con la tua firma."],
      sound: "thud",
      music: "solenne",
    },
    {
      bg: "corridor",
      scene: "corridor",
      lines: [
        "Fuori, un Paese che trema: scioperi, ordigni, governi di mesi.",
        "Qui dentro, solo carta. Ma la carta, a volte, pesa più dei morti.",
      ],
      sound: "thud",
      music: "tensione",
    },
    {
      bg: "archive",
      scene: "emblems",
      title: "Schedario — i poteri in campo",
      emblems: [
        { faction: "governo", caption: "DEMOCRAZIA SOLIDALE — il partito che governa. Ordine, continuità, coperture." },
        { faction: "sir", caption: "S.I.R. — i servizi ufficiali. Sorvegliano tutto. Anche te." },
        { faction: "anello", caption: "L'ANELLO — i servizi che non esistono. Decidono chi fa carriera." },
        { faction: "brigate", caption: "BRIGATE PROLETARIE — la lotta armata. Vogliono colpire il cuore dello Stato." },
        { faction: "procura", caption: "LA PROCURA — la legge. Pochi giudici ostinati, molti nemici." },
        { faction: "stampa", caption: "LA STAMPA — la verità. O almeno la tiratura." },
      ],
      sound: "paper",
    },
    {
      bg: "black",
      scene: "stampfall",
      stampLabel: "ASSEGNATO",
      lines: [
        "Da oggi, firma lei.",
        "",
        "Quale verità entra negli archivi dello Stato,",
        "e quale sparisce, lo decide questa scrivania.",
      ],
      sound: "ring",
      music: "solenne",
    },
  ],
};

/** Presentazione animata di una fazione alla sua prima comparsa nella run. */
function facCs(
  faction: FactionId,
  name: string,
  lines: string[],
  music: string,
): Cutscene {
  return {
    id: `fac_${faction}`,
    beats: [
      {
        bg: "black",
        scene: "crest",
        faction,
        title: "Nuovo soggetto in campo",
        lines: [name],
        sound: "telex",
        music,
        durationMs: 3200,
      },
      { bg: "black", scene: "telex", faction, lines, sound: "telex", music },
    ],
  };
}

export const FAC_CUTSCENES: Record<string, Cutscene> = {
  fac_governo: facCs(
    "governo",
    "DEMOCRAZIA SOLIDALE — il partito che governa",
    ["«Continuità. Ordine. Discrezione.»", "Dal Partito arrivano richieste cortesi.", "Rifiutarle costa la carriera. O peggio."],
    "solenne",
  ),
  fac_sir: facCs(
    "sir",
    "S.I.R. — i servizi ufficiali",
    ["«Collaborazione richiesta. Discrezione obbligatoria.»", "I servizi vogliono i tuoi occhi.", "E, soprattutto, i tuoi silenzi."],
    "tensione",
  ),
  fac_anello: facCs(
    "anello",
    "L'ANELLO — i servizi che non esistono",
    ["«Noi non esistiamo. Eppure decidiamo.»", "Un fascicolo senza intestazione. Una firma che non c'è.", "È l'Anello. Da oggi, ti conosce."],
    "tensione",
  ),
  fac_brigate: facCs(
    "brigate",
    "BRIGATE PROLETARIE — la lotta armata",
    ["«Colpirne uno per educarne cento.»", "Volantini ciclostilati, sigle, una stella a cinque punte.", "La clandestinità bussa anche al tuo sportello."],
    "tensione",
  ),
  fac_procura: facCs(
    "procura",
    "LA PROCURA — la magistratura",
    ["«La legge è uguale per tutti. Anche per lo Stato.»", "Un giudice ostinato chiede gli atti", "che qualcuno, in alto, vuole sepolti."],
    "solenne",
  ),
  fac_stampa: facCs(
    "stampa",
    "LA STAMPA — il giornalismo d'inchiesta",
    ["«La verità ha sempre un prezzo. Di solito lo paga qualcun altro.»", "Un cronista ti porta una foto che scotta.", "Pubblicarla può far cadere un governo. O te."],
    "solenne",
  ),
};

export const END_GENERIC: Cutscene = {
  id: "end_generic",
  beats: [
    {
      bg: "black",
      scene: "stampfall",
      stampLabel: "ARCHIVIATO",
      lines: ["Il fascicolo si chiude."],
      sound: "stamp",
      music: "finale",
    },
    {
      bg: "archive",
      scene: "archive",
      lines: [
        "Le luci dell'Archivio si spengono, una fila dopo l'altra.",
        "Quel che hai deciso, ormai, appartiene allo Stato.",
      ],
      sound: "thud",
      durationMs: 4200,
    },
  ],
};

/** Sequenza d'attentato: scatta quando il Paese precipita nella crisi. */
export const ATTENTATO: Cutscene = {
  id: "attentato",
  beats: [
    {
      bg: "black",
      scene: "attentato",
      headline: "ORDIGNO IN CITTÀ — È STRAGE",
      lines: ["Un boato, poi le sirene.", "La radio gracchia un numero che cambierà ancora."],
      sound: "thud",
      music: "tensione",
      durationMs: 3600,
    },
    {
      bg: "corridor",
      scene: "corridor",
      lines: [
        "In corridoio si corre. Le direttive cambieranno entro sera.",
        "Sul tuo banco, intanto, la coda non si ferma.",
      ],
      sound: "telex",
      music: "tensione",
    },
  ],
};

/**
 * LA RIVELAZIONE del «fondo R»: scatta quando il faldone arriva sul banco (G9).
 * I fili raccolti in nove giorni si ricompongono in sequenza — dossier che si
 * apre, telex che batte, timbro. La lore si mostra, non si spiega.
 */
export const FONDO_R_REVEAL: Cutscene = {
  id: "fondoR_reveal",
  beats: [
    {
      bg: "black",
      scene: "dossier",
      emblems: [{ faction: "governo", caption: "" }],
      lines: ["Protocollo R-0455. Lo conosci da nove giorni.", "Adesso sai anche cosa contiene."],
      sound: "paper",
      music: "tensione",
      durationMs: 3400,
    },
    {
      bg: "black",
      scene: "telex",
      lines: [
        "I versamenti del partito. L'area Bramante. La fonte Cardo.",
        "Il Ragioniere che «paga in anticipo. Come per la piazza.»",
      ],
      sound: "telex",
      durationMs: 4200,
    },
    {
      bg: "black",
      scene: "stampfall",
      stampLabel: "FONDO R",
      lines: ["Il tuo predecessore lo stava chiudendo, quando è stato «trasferito».", "Ora è sulla tua scrivania."],
      sound: "stamp",
    },
  ],
};

/* ------------------------- FINALI ANIMATI ---------------------------------
 * Ogni finale ha la SUA sequenza (id: end_<endingId>): il giocatore VEDE cosa
 * gli succede — porta, scorta, rotative, treno, archivio. Il testo (epitaffio)
 * arriva dopo, nella schermata di chiusura. I cue audio vengono dal manifest
 * (ending_arrest = la marcia funebre reale).
 */
export const ENDING_CUTSCENES: Record<string, Cutscene> = {
  // RADIATO — il bad ending: bussano che è ancora buio.
  end_arrestato: {
    id: "end_arrestato",
    beats: [
      {
        bg: "black",
        scene: "door",
        lines: ["Bussano che è ancora buio.", "Due uomini, una formula: «verifica preventiva»."],
        sound: "thud",
        music: "ending_arrest",
        durationMs: 3600,
      },
      {
        bg: "black",
        scene: "door",
        stampLabel: "RADIATO",
        lines: ["Sul tuo fascicolo, l'unico che non hai potuto toccare,", "cala un timbro rosso."],
        sound: "stamp",
        durationMs: 3400,
      },
      { bg: "archive", scene: "archive", lines: ["L'Archivio continua senza di te. Come sempre. Come con il tuo predecessore."], sound: "thud", durationMs: 3800 },
    ],
  },
  // EDIZIONE STRAORDINARIA — lo scandalo pubblico.
  end_scandalo: {
    id: "end_scandalo",
    beats: [
      { bg: "black", scene: "telex", lines: ["Le rotative girano tre ore prima del sequestro.", "Abbastanza per uscire in quattro città."], sound: "telex", music: "ending_scandal", durationMs: 3600 },
      { bg: "black", scene: "newspaper", headline: "«LO STATO CONTRO SÉ STESSO»", lines: ["Il Paese vede in faccia un pezzo di sé."], sound: "paper", durationMs: 3600 },
      { bg: "corridor", scene: "corridor", lines: ["Cadono due sottosegretari e un editore.", "Di te scrivono: «una fonte interna». È un onore. È una condanna."], sound: "thud", durationMs: 4000 },
    ],
  },
  // IL TESTIMONE — collaborazione con la Procura.
  end_collaboratore_procura: {
    id: "end_collaboratore_procura",
    beats: [
      { bg: "black", scene: "dossier", emblems: [{ faction: "procura", caption: "" }], lines: ["Una stanza senza finestre. Verbali su verbali.", "Accanto, un giudice che non si arrende."], sound: "paper", music: "ending_magistratura", durationMs: 3600 },
      { bg: "black", scene: "stampfall", stampLabel: "AGLI ATTI", lines: ["Le tue carte diventano capi d'imputazione.", "Qualcuno, stavolta, cade davvero."], sound: "stamp", durationMs: 3400 },
      { bg: "black", scene: "door", variant: "solo", lines: ["Per la famiglia, un nome nuovo e una città di provincia.", "Per te, la luce sempre accesa."], sound: "thud", durationMs: 3600 },
    ],
  },
  // LA QUERCIA — la rete scoperta (finale segreto).
  end_scoperta_rete: {
    id: "end_scoperta_rete",
    beats: [
      { bg: "black", scene: "telex", lines: ["La lista esisteva. Nomi, depositi, recapiti «da attivare»."], sound: "telex", music: "ending_secret", durationMs: 3400 },
      { bg: "archive", scene: "archive", lines: ["Per qualche settimana pare che il velo cada.", "Poi cadono, invece, le inchieste."], sound: "thud", durationMs: 3800 },
      { bg: "black", scene: "stampfall", stampLabel: "OMISSIS", lines: ["Sai una cosa che non puoi dire.", "È il modo più sicuro perché tu non la dica mai più."], sound: "stamp", durationMs: 3400 },
    ],
  },
  // LA LUCE ACCESA — la fuga.
  end_fuga: {
    id: "end_fuga",
    beats: [
      { bg: "black", scene: "office_open", lines: ["Lasci la lampada accesa e la giacca sulla sedia.", "Che credano che ci sei."], sound: "thud", music: "ending_secret", durationMs: 3400 },
      { bg: "black", scene: "door", variant: "solo", lines: ["Un treno notturno. Una frontiera distratta.", "Una copia cucita nella fodera del cappotto."], sound: "thud", durationMs: 3600 },
      { bg: "corridor", scene: "corridor", lines: ["Non un eroe, non un traditore:", "un uomo che ha deciso di restare vivo."], durationMs: 3600 },
    ],
  },
  // UNO DI LORO — complice dell'Anello.
  end_complice_anello: {
    id: "end_complice_anello",
    beats: [
      { bg: "black", scene: "crest", faction: "anello", lines: ["Smettono di chiamarti al telefono.", "Cominciano a invitarti a pranzo."], sound: "ring", music: "ending_servizi", durationMs: 3600 },
      { bg: "black", scene: "dossier", emblems: [{ faction: "anello", caption: "" }], lines: ["Impari a far sparire le cose prima che diventino un problema.", "«Conservi solo la copia conforme.»"], sound: "paper", durationMs: 3800 },
      { bg: "black", scene: "stampfall", stampLabel: "CONFORME", lines: ["Dormi bene.", "È la cosa più inquietante di tutte."], sound: "stamp", durationMs: 3200 },
    ],
  },
  // IL PIANO SUPERIORE — assorbito dal sistema.
  end_assorbito: {
    id: "end_assorbito",
    beats: [
      { bg: "black", scene: "stampfall", stampLabel: "PROMOSSO", lines: ["Il fascicolo si chiude con firma conforme.", "Nessuno lo cercherà più."], sound: "stamp", music: "ending_system", durationMs: 3400 },
      { bg: "black", scene: "office_open", lines: ["Stessa scrivania, porta migliore, una pianta finta.", "Da lassù i corridoi sembrano più silenziosi."], sound: "thud", durationMs: 3600 },
      { bg: "archive", scene: "archive", lines: ["La verità è una pratica come le altre.", "E si archivia."], sound: "thud", durationMs: 3600 },
    ],
  },
  // LA MACCHINA GIRA — il finale neutro.
  end_sistema_immutato: {
    id: "end_sistema_immutato",
    beats: [
      { bg: "black", scene: "stampfall", stampLabel: "ARCHIVIATO", lines: ["Pratiche evase, pratiche arretrate.", "Domani altre carte, altre facce allo sportello."], sound: "stamp", music: "ending_system", durationMs: 3400 },
      { bg: "archive", scene: "archive", lines: ["Un altro funzionario, un giorno, siederà a questa scrivania.", "E non saprà nulla di te.", "La macchina gira. La macchina gira sempre."], sound: "thud", durationMs: 4400 },
    ],
  },
};

export const CUTSCENES: Record<string, Cutscene> = {
  intro: INTRO,
  end_generic: END_GENERIC,
  attentato: ATTENTATO,
  fondoR_reveal: FONDO_R_REVEAL,
  ...ENDING_CUTSCENES,
  ...FAC_CUTSCENES,
};

export function getCutscene(id: string): Cutscene | undefined {
  return CUTSCENES[id];
}
