/**
 * Micro-eventi ambientali del corridoio: brevi vignette che raccontano il mondo
 * fuori dalla scrivania anche mentre il giocatore legge. Scritti come frammenti
 * (vedi docs/WRITING_BIBLE.md). Alcuni dipendono dallo stato della run.
 */
export interface AmbientCtx {
  suspicion: number;
  caos: number;
  day: number;
}

/** animazione associata al vignette (renderizzata da AmbientVisual). */
export type AmbientVisualId =
  | "scorta"
  | "plico"
  | "telex"
  | "passi"
  | "porta"
  | "neon"
  | "spioncino"
  | "fascicolo"
  | "ispettore"
  | "sirena"
  | "allarme"
  | "convoglio";

export interface AmbientEvent {
  id: string;
  caption: string;
  /** animazione visiva: l'evento si VEDE, non è solo testo */
  visual: AmbientVisualId;
  sound?: "thud" | "telex" | "paper" | "ring" | "drawer";
  weight?: number;
  requires?: (c: AmbientCtx) => boolean;
}

export const AMBIENT_EVENTS: AmbientEvent[] = [
  { id: "scorta", visual: "scorta", caption: "Due guardie accompagnano via un uomo. Non oppone resistenza.", sound: "thud", weight: 3 },
  { id: "usciere", visual: "plico", caption: "Un usciere lascia un plico sul bancone e sparisce senza una parola.", sound: "paper", weight: 3 },
  { id: "telex", visual: "telex", caption: "Il telex sferraglia. Batte un dispaccio che nessuno verrà a ritirare.", sound: "telex", weight: 3 },
  { id: "passi", visual: "passi", caption: "Passi nel corridoio. Si fermano davanti al vetro. Poi ripartono.", sound: "thud", weight: 4 },
  { id: "porta", visual: "porta", caption: "Una porta sbatte, due piani più in alto. Cala di nuovo il silenzio.", sound: "thud", weight: 3 },
  { id: "neon", visual: "neon", caption: "Il neon ha un sussulto. Per un attimo, buio. Poi riprende a ronzare.", weight: 3 },
  { id: "protesta", visual: "porta", caption: "Qualcuno protesta, in fondo. Viene zittito in fretta.", sound: "thud", weight: 2 },
  { id: "spioncino", visual: "spioncino", caption: "Un superiore osserva dallo spioncino. Conta i fascicoli. Non entra.", weight: 2 },
  { id: "fascicolo", visual: "fascicolo", caption: "Un fascicolo scivola da uno schedario. Resta a terra. Nessuno si abbassa.", sound: "drawer", weight: 2 },
  {
    id: "ispettore",
    visual: "ispettore",
    caption: "Un uomo in grigio si ferma al vetro. Annota qualcosa sul suo taccuino. Va via.",
    sound: "thud",
    weight: 4,
    requires: (c) => c.suspicion >= 45,
  },
  {
    id: "sirena",
    visual: "sirena",
    caption: "Una sirena attraversa la strada e si spegne in lontananza.",
    sound: "thud",
    weight: 4,
    requires: (c) => c.caos >= 55,
  },
  {
    id: "allarme",
    visual: "allarme",
    caption: "Allarme al piano. Si raccomanda di non lasciare l'ufficio. La pratica, però, resta lì.",
    sound: "thud",
    weight: 5,
    requires: (c) => c.caos >= 68,
  },
  {
    id: "convoglio",
    visual: "convoglio",
    caption: "Sotto le finestre, un convoglio di camionette. Diretto dove non è dato sapere.",
    sound: "thud",
    weight: 3,
    requires: (c) => c.caos >= 60 || c.suspicion >= 55,
  },
];

export function pickAmbient(ctx: AmbientCtx, rnd: number, avoid?: string): AmbientEvent | undefined {
  const pool = AMBIENT_EVENTS.filter((e) => (!e.requires || e.requires(ctx)) && e.id !== avoid);
  if (pool.length === 0) return undefined;
  const total = pool.reduce((s, e) => s + (e.weight ?? 1), 0);
  let r = rnd * total;
  for (const e of pool) {
    r -= e.weight ?? 1;
    if (r <= 0) return e;
  }
  return pool[pool.length - 1];
}
