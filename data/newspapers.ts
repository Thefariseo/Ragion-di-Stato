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
};

export const SIDEBARS: Record<number, { title: string; body: string }> = {
  1: { title: "IL COMMENTO", body: "«La fermezza dello Stato non è in discussione. Chi semina disordine troverà un argine. E una firma in calce.»" },
  2: { title: "NOTA AI DIRETTORI", body: "Si raccomanda alle testate «sobrietà» nel riferire i fatti di cronaca nera. Nell'interesse superiore di tutti." },
  3: { title: "ULTIM'ORA", body: "Movimenti negli apparati, secondo fonti riservate. Nessuna conferma. Nessuna smentita. Il che, di solito, è una conferma." },
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
];
