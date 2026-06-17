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
      visual: "stamp",
      stampLabel: "RISERVATO",
      title: "MINISTERO DELL'INTERNO",
      lines: ["Repubblica Italiana — Anni di piombo.", "Fascicolo personale: APERTO."],
      sound: "stamp",
      music: "solenne",
    },
    {
      bg: "paper",
      visual: "letter",
      title: "Lettera di nomina",
      lines: [
        "Si comunica la Sua assegnazione all'Ufficio Validazione e",
        "Archivio Centrale, presso questo Dicastero.",
        "",
        "Dalla Sua scrivania transiteranno fascicoli, informative,",
        "permessi e atti riservati. Lei convalida. Nulla di più.",
        "",
        "Il suo predecessore è stato trasferito. Non chieda dove.",
      ],
      sound: "type",
    },
    {
      bg: "corridor",
      visual: "none",
      lines: [
        "Prende servizio in un Paese che trema.",
        "Scioperi, ordigni, governi che cadono. E ovunque, fazioni.",
      ],
      sound: "thud",
      music: "tensione",
    },
    {
      bg: "archive",
      visual: "emblems",
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
      visual: "stamp",
      stampLabel: "APPROVATO",
      lines: [
        "Da domani, ogni giorno, dalla Sua scrivania passerà",
        "la verità dello Stato.",
        "",
        "Quale verità entra negli archivi — e quale sparisce —",
        "lo decide Lei.",
      ],
      sound: "stamp",
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
        bg: "archive",
        visual: "emblems",
        title: "Dossier riservato — nuovo soggetto in campo",
        emblems: [{ faction, caption: name }],
        sound: "telex",
        music,
      },
      { bg: "black", visual: "none", lines, sound: "thud" },
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
      visual: "stamp",
      stampLabel: "ARCHIVIATO",
      lines: ["Il fascicolo si chiude."],
      sound: "stamp",
      music: "finale",
    },
    {
      bg: "archive",
      visual: "none",
      lines: [
        "Le luci dell'Archivio si spengono, una fila dopo l'altra.",
        "Quel che hai deciso, ormai, appartiene allo Stato.",
      ],
      sound: "thud",
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
