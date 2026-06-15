import type { NewspaperItem } from "@/types";

/**
 * Pool di trafiletti del giornale del mattino, reattivi ai flag della run.
 * La testata mostra quelli attivi: lo Stato che reagisce (o tace, o manipola)
 * in base a ciò che hai fatto passare dalla tua scrivania.
 */
export const NEWS_ITEMS: NewspaperItem[] = [
  {
    requiresFlag: "dossier_stampa",
    headline: "SCANDALO: «UN DOSSIER INCHIODA GLI APPARATI»",
    body: "Documenti riservati finiti in redazione travolgono ministeri e servizi. Si parla di una fonte interna.",
  },
  {
    requiresFlag: "passato_stampa",
    headline: "FOTO-CHOC: «LO STATO ARMAVA I SUOI NEMICI?»",
    body: "Un'immagine mostrerebbe uno scambio tra un agente e uno schedato. Smentite ufficiali.",
  },
  {
    requiresFlag: "verbale_alla_procura",
    headline: "LA PROCURA APRE UN FASCICOLO SUGLI APPALTI",
    body: "Il giudice Ardenti indaga su una gara mai bandita. «Atti coperti», replica il Ministero.",
  },
  {
    requiresFlag: "dossier_procura",
    headline: "INCHIESTA-BIS: «NUOVI ATTI ALLA MAGISTRATURA»",
    body: "Un faldone consegnato alla Procura riaccende lo scontro tra giudici e palazzo.",
  },
  {
    requiresFlag: "servito_crisanti",
    headline: "APPALTI, ARCHIVIATO TUTTO: «NESSUN ATTO RILEVANTE»",
    body: "La pratica più scomoda risulta «non reperibile». Soddisfazione negli ambienti di governo.",
  },
  {
    requiresFlag: "militante_segnalato",
    headline: "RETATA NELL'AUTONOMIA: «COLPO ALLE BRIGATE»",
    body: "Fermi all'alba. Gli inquirenti parlano di «ottima collaborazione degli uffici».",
  },
  {
    requiresFlag: "coperto_cardo",
    headline: "ORDIGNO DI PIAZZA DEI TIGLI: «PISTA ANARCHICA»",
    body: "La versione ufficiale regge. Nessun riferimento a presenze scomode sul luogo.",
  },
  {
    requiresFlag: "cardo_alla_procura",
    headline: "ATTENTATO, SPUNTA UN COLLEGAMENTO IMBARAZZANTE",
    body: "Una fonte dei servizi sarebbe stata sul posto. La Procura vuole vederci chiaro.",
  },
  {
    requiresFlag: "scoperta_rete",
    headline: "VOCI SU UNA «STRUTTURA PARALLELA»: SMENTITE",
    body: "Si parla di elenchi e depositi. Fonti istituzionali: «Fantasie».",
  },
  {
    requiresFlag: "bechis_segnalato",
    headline: "CRONISTA INDAGATO PER «RICETTAZIONE DI ATTI»",
    body: "La stampa parla di intimidazione. Il Viminale: «Atto dovuto».",
  },
];
