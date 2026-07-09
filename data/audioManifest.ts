import type { Bus } from "@/lib/audio/core";

/**
 * MANIFEST audio — la mappa dei CUE musicali del gioco verso i FILE esterni in
 * /public/audio. Ogni cue ha un fallback procedurale, così il gioco suona anche
 * senza file: per sostituire una traccia basta lasciar cadere l'audio nella
 * cartella indicata e (se serve) aggiornare `file` qui. Vedi docs/AUDIO_DIRECTION.md.
 */
export interface TrackDef {
  /** percorso del file in /public/audio (se assente o mancante → fallback). */
  file?: string;
  bus: Bus;
  loop: boolean;
  /** guadagno relativo del cue (0..1) */
  gain: number;
  fadeIn: number;
  fadeOut: number;
  /** id del tema PROCEDURALE di riserva (lib/music.ts) se il file manca. */
  fallback: "solenne" | "tensione" | "finale" | "lavoro" | "silenzio";
  priority: number;
}

const T = (p: Partial<TrackDef> & Pick<TrackDef, "fallback">): TrackDef => ({
  bus: "music",
  loop: true,
  gain: 0.8,
  fadeIn: 1.2,
  fadeOut: 1.0,
  priority: 1,
  ...p,
});

export const AUDIO_MANIFEST: Record<string, TrackDef> = {
  // —— musica principale / contesti ——
  // TRACCIA REALE: tema principale minimale/marziale/istituzionale (mp3 in repo)
  main_theme: T({ file: "/audio/music/main-theme/main-theme.mp3", fallback: "solenne", gain: 0.8, priority: 5 }),
  intro: T({ file: "/audio/music/intro/intro-ministero.ogg", fallback: "solenne", loop: false, gain: 0.85, priority: 5 }),
  gameplay_ambient: T({ file: "/audio/music/gameplay-ambient/gameplay-ambient.ogg", fallback: "lavoro", gain: 0.4, fadeIn: 2.5, fadeOut: 2.0 }),
  tension: T({ file: "/audio/music/tension/tension.ogg", fallback: "tensione", loop: false, gain: 0.8, fadeIn: 0.4, priority: 6 }),
  newspaper: T({ file: "/audio/music/newspaper/newspaper.ogg", fallback: "solenne", loop: false, gain: 0.7 }),

  // —— cue di fazione (corte, sound signature) ——
  faction_governo: T({ file: "/audio/music/factions/ministero.ogg", fallback: "solenne", loop: false, gain: 0.8, priority: 4 }),
  faction_sir: T({ file: "/audio/music/factions/servizi.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),
  faction_anello: T({ file: "/audio/music/factions/servizi.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),
  faction_stampa: T({ file: "/audio/music/factions/stampa.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),
  faction_procura: T({ file: "/audio/music/factions/magistratura.ogg", fallback: "solenne", loop: false, gain: 0.8, priority: 4 }),
  faction_brigate: T({ file: "/audio/music/factions/armati.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),
  faction_cupola: T({ file: "/audio/music/factions/criminalita.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),
  faction_rete: T({ file: "/audio/music/factions/rete.ogg", fallback: "tensione", loop: false, gain: 0.8, priority: 4 }),

  // —— finali (trattamento sonoro dedicato) ——
  ending_system: T({ file: "/audio/music/endings/system.ogg", fallback: "finale", loop: false, gain: 0.85, priority: 7 }),
  // TRACCIA REALE: marcia lenta, funebre, istituzionale — il BAD ENDING (mp3 in repo)
  ending_arrest: T({ file: "/audio/music/endings/negative-ending.mp3", fallback: "finale", loop: true, gain: 0.85, priority: 7 }),
  ending_scandal: T({ file: "/audio/music/endings/scandal.ogg", fallback: "tensione", loop: false, gain: 0.85, priority: 7 }),
  ending_secret: T({ file: "/audio/music/endings/secret.ogg", fallback: "finale", loop: false, gain: 0.8, priority: 7 }),
  ending_magistratura: T({ file: "/audio/music/endings/magistratura.ogg", fallback: "finale", loop: false, gain: 0.85, priority: 7 }),
  ending_servizi: T({ file: "/audio/music/endings/servizi.ogg", fallback: "finale", loop: false, gain: 0.85, priority: 7 }),
};

/** Alias retro-compatibili: vecchi id tema → cue del manifest. */
export const CUE_ALIAS: Record<string, string> = {
  solenne: "main_theme",
  tensione: "tension",
  finale: "ending_system",
  lavoro: "gameplay_ambient",
};

export function resolveCue(id: string): { cue: string; def: TrackDef } | null {
  const cue = AUDIO_MANIFEST[id] ? id : CUE_ALIAS[id];
  const def = cue ? AUDIO_MANIFEST[cue] : undefined;
  return def ? { cue, def } : null;
}
