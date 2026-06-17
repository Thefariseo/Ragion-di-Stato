import type { ActionKind, FactionId } from "@/types";
import { FACTIONS } from "./factions";

/**
 * IDENTITÀ GRAFICA delle fazioni — il cuore visivo del mondo.
 * Ogni ente non è una voce di menu ma un POTERE riconoscibile: carta intestata
 * propria, fascia, colore istituzionale, pattern/filigrana, timbro dedicato,
 * trattamento tipografico, leitmotiv testuale e sonoro. Si deve capire da CHI
 * arriva un documento prima ancora di leggere il nome.
 *
 * Disegnata come asset ORIGINALE (palette desaturata, niente loghi reali).
 */
export interface FactionIdentity {
  /** carta del documento (sfondo) */
  paper: string;
  /** fascia della testata (carta intestata) */
  band: string;
  /** colore istituzionale: filo della testata, dettagli, sigillo */
  accent: string;
  /** inchiostro del corpo testo */
  ink: string;
  /** pattern/filigrana CSS (background-image) della testata o del foglio */
  pattern: string;
  /** dicitura del timbro dedicato */
  stampLabel: string;
  stampKind?: ActionKind;
  /** leitmotiv testuale: come "parla" l'ente */
  motto: string;
  /** trattamento tipografico del nome in testata */
  tone: "typed" | "stencil" | "press" | "plain";
  /** leitmotiv sonoro (tema musicale) */
  music: string;
}

const DEFAULT: FactionIdentity = {
  paper: "#e6e0c8",
  band: "#574848",
  accent: "#b3a37a",
  ink: "#3a332b",
  pattern: "none",
  stampLabel: "ATTI",
  motto: "—",
  tone: "plain",
  music: "lavoro",
};

export const FACTION_IDENTITY: Record<FactionId, FactionIdentity> = {
  governo: {
    paper: "#efe9d4",
    band: "#2a2c44",
    accent: "#b89a64",
    ink: "#322c22",
    pattern:
      "repeating-linear-gradient(90deg, rgba(42,44,68,0.06) 0 1px, transparent 1px 7px)",
    stampLabel: "VISTO · GOVERNO",
    motto: "Continuità. Ordine. Discrezione.",
    tone: "typed",
    music: "solenne",
  },
  sir: {
    paper: "#e3e6cf",
    band: "#3d4232",
    accent: "#848a6b",
    ink: "#2c2f22",
    pattern:
      "repeating-linear-gradient(45deg, rgba(61,66,50,0.12) 0 2px, transparent 2px 9px)",
    stampLabel: "S.I.R. · NULLA OSTA",
    stampKind: "approva",
    motto: "Sicurezza dello Stato, sopra ogni cosa.",
    tone: "stencil",
    music: "tensione",
  },
  anello: {
    // l'identità dell'Anello è l'ASSENZA di identità: carta grigia, niente fregi
    paper: "#dad6cb",
    band: "#1b1b17",
    accent: "#7c241c",
    ink: "#23201b",
    pattern:
      "radial-gradient(circle at 82% 62%, rgba(124,36,28,0.10) 0 7px, transparent 8px)",
    stampLabel: "○",
    motto: "Noi non esistiamo. Eppure decidiamo.",
    tone: "plain",
    music: "tensione",
  },
  brigate: {
    // volantino ciclostilato, inchiostro che sbava
    paper: "#e7e2d0",
    band: "#5e1b15",
    accent: "#b42b2b",
    ink: "#2a1410",
    pattern:
      "repeating-linear-gradient(0deg, rgba(180,43,43,0.07) 0 2px, transparent 2px 10px)",
    stampLabel: "★ B.P.",
    stampKind: "segnala",
    motto: "Colpirne uno per educarne cento.",
    tone: "stencil",
    music: "tensione",
  },
  procura: {
    paper: "#dde2dd",
    band: "#243039",
    accent: "#6f8c84",
    ink: "#222a28",
    pattern:
      "repeating-linear-gradient(90deg, rgba(36,48,57,0.08) 0 1px, transparent 1px 11px)",
    stampLabel: "PROCURA · ACQUISITO",
    motto: "La legge è uguale per tutti. Anche per lo Stato.",
    tone: "typed",
    music: "solenne",
  },
  stampa: {
    // carta di giornale, mezzatinta
    paper: "#dedbce",
    band: "#1b1712",
    accent: "#8a8276",
    ink: "#1b1712",
    pattern:
      "radial-gradient(rgba(20,17,13,0.12) 1px, transparent 1.5px) 0 0 / 5px 5px",
    stampLabel: "VISTO, SI STAMPI",
    motto: "Pubblicare è un atto politico.",
    tone: "press",
    music: "solenne",
  },

  /* ---- lore: identità più leggere, derivate dal colore ---- */
  avanguardia: { ...DEFAULT, paper: "#dcd9cf", band: "#26241f", accent: "#6a3a30", ink: "#211f1a", stampLabel: "▲", motto: "Caos utile all'ordine nuovo.", tone: "stencil", music: "tensione" },
  rete: { ...DEFAULT, paper: "#d9ddc9", band: "#28321f", accent: "#5d6b45", ink: "#23271a", stampLabel: "STAY-BEHIND", motto: "Restare pronti. Restare invisibili.", music: "tensione" },
  cupola: { ...DEFAULT, paper: "#e3dccb", band: "#3a1410", accent: "#8a3a2e", ink: "#2a1814", stampLabel: "PER CONOSCENZA", motto: "Affari e onore.", music: "tensione" },
  sindacato: { ...DEFAULT, paper: "#e6e1cd", band: "#7a3a18", accent: "#b07d3a", ink: "#2c2117", stampLabel: "DELIBERA", motto: "Salari, diritti, fabbriche.", tone: "press", music: "lavoro" },
  loggia: { ...DEFAULT, paper: "#ddd9cf", band: "#3a382f", accent: "#8c887c", ink: "#26241d", stampLabel: "△ R∴L∴", motto: "Il potere si esercita meglio se non si vede.", music: "solenne" },
  salotto: { ...DEFAULT, paper: "#ece4d0", band: "#5a4422", accent: "#b08a48", ink: "#2e2519", stampLabel: "CON OSSEQUI", motto: "Stabilità per gli affari.", tone: "typed", music: "solenne" },
};

export function factionIdentity(id?: FactionId): FactionIdentity {
  if (!id) return DEFAULT;
  return FACTION_IDENTITY[id] ?? DEFAULT;
}

/**
 * Deduce l'ente EMITTENTE di un documento dalla sua dicitura. Così la carta
 * intestata segue CHI l'ha prodotta (un dossier del SIR ha carta del SIR anche
 * se riguarda un brigatista). "state" = ufficio neutro dello Stato (nessuna
 * identità di fazione); undefined = ignoto (ricade sull'affiliazione del caso).
 */
export function factionFromIssuer(issuer?: string): FactionId | "state" | undefined {
  if (!issuer) return undefined;
  const s = issuer.toLowerCase();
  if (/\bsir\b|servizio informazioni|beraldo/.test(s)) return "sir";
  if (/procura|tribunale|giudice|magistrat|ardenti|vitale/.test(s)) return "procura";
  if (/stampa|mattino|cronista|bechis|ferro|redazione|testata/.test(s)) return "stampa";
  if (/sindacat|lonardi|delegat/.test(s)) return "sindacato";
  if (/brigate|b\.p\.|ragioniere|compagn/.test(s)) return "brigate";
  if (/anello|manni/.test(s)) return "anello";
  if (/appalti|bramante|salotto|editore/.test(s)) return "salotto";
  if (/avanguardia|biondo/.test(s)) return "avanguardia";
  if (/cupola|scal[iì]a|don /.test(s)) return "cupola";
  if (/loggia|venerabile/.test(s)) return "loggia";
  if (/crisanti|velardi|sottosegretario|gabinetto|segreteria|on\.|ministero|partito|democrazia solidale/.test(s)) return "governo";
  if (/questura|comune|anagrafe|archivio|prefettura|catasto|motorizzazione|ufficio/.test(s)) return "state";
  return undefined;
}

/** colore identificativo (dal registro fazioni), con fallback. */
export function factionColor(id?: FactionId): string {
  if (!id) return DEFAULT.accent;
  return FACTIONS[id]?.color ?? DEFAULT.accent;
}
