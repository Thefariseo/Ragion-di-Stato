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

export const CUTSCENES: Record<string, Cutscene> = {
  intro: INTRO,
  end_generic: END_GENERIC,
  ...FAC_CUTSCENES,
};

export function getCutscene(id: string): Cutscene | undefined {
  return CUTSCENES[id];
}
