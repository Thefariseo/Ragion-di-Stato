import type { Cutscene } from "@/types";

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

export const CUTSCENES: Record<string, Cutscene> = {
  intro: INTRO,
};

export function getCutscene(id: string): Cutscene | undefined {
  return CUTSCENES[id];
}
