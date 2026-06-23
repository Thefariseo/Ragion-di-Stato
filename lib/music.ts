/**
 * MusicManager — riproduce i CUE musicali (vedi data/audioManifest.ts) sul bus
 * "music" del mixer (lib/audio/core). Se esiste il FILE esterno lo suona in loop
 * pulito con crossfade; altrimenti usa un FALLBACK procedurale DISCRETO (drone
 * + pulsazione lenta, nessuna melodia invadente, nessun earrape). Pensato per
 * sostituire facilmente le tracce: lascia cadere i file in /public/audio.
 *
 * API pubblica invariata: playMusic / stopMusic / setMusicEnabled /
 * isMusicEnabled / playLeitmotif.
 */
import { audioCtx, busNode, loadBuffer, fadeTo } from "@/lib/audio/core";
import { resolveCue, type TrackDef } from "@/data/audioManifest";

let enabled = true;
let currentId = "";

// sorgente attiva (file in loop) o fallback procedurale
let fileSource: AudioBufferSourceNode | null = null;
let fileGain: GainNode | null = null;
let proc: { stop: () => void } | null = null;

function musicBus(): GainNode | null {
  return busNode("music");
}

/* --------------------------- fallback procedurale -------------------------- */
/** Drone freddo + pulsazione lenta. Volutamente minimale e poco invasivo. */
const FALLBACK: Record<string, { root: number; pulse: number; gain: number } | null> = {
  solenne: { root: 55, pulse: 3.2, gain: 0.05 },
  tensione: { root: 58, pulse: 1.6, gain: 0.05 },
  finale: { root: 49, pulse: 4.4, gain: 0.06 },
  lavoro: { root: 49, pulse: 6, gain: 0.025 },
  silenzio: null,
};

function startProcedural(themeId: TrackDef["fallback"]) {
  stopProcedural();
  const cfg = FALLBACK[themeId];
  const c = audioCtx();
  const bus = musicBus();
  if (!cfg || !c || !bus) return;

  const g = c.createGain();
  g.gain.value = 0.0001;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  g.connect(lp).connect(bus);
  fadeTo(g, cfg.gain, 1.5);

  // drone: fondamentale + ottava bassa appena stonata
  const d1 = c.createOscillator();
  d1.type = "sine";
  d1.frequency.value = cfg.root;
  const d2 = c.createOscillator();
  d2.type = "sine";
  d2.frequency.value = cfg.root / 2;
  d2.detune.value = -5;
  d1.connect(g);
  d2.connect(g);
  d1.start();
  d2.start();

  // pulsazione lenta (un soffio d'organo sulla fondamentale)
  const timer = setInterval(() => {
    const cc = audioCtx();
    if (!cc) return;
    const t = cc.currentTime;
    const o = cc.createOscillator();
    const pg = cc.createGain();
    o.type = "sawtooth";
    o.frequency.value = cfg.root * 2;
    o.detune.value = -6;
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.exponentialRampToValueAtTime(cfg.gain * 0.5, t + cfg.pulse * 0.3);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + cfg.pulse * 0.95);
    const f = cc.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 500;
    o.connect(f).connect(g);
    o.start(t);
    o.stop(t + cfg.pulse);
  }, cfg.pulse * 1000);

  proc = {
    stop: () => {
      clearInterval(timer);
      fadeTo(g, 0, 0.6);
      setTimeout(() => { try { d1.stop(); d2.stop(); } catch { /* */ } }, 700);
    },
  };
}

function stopProcedural() {
  if (proc) { proc.stop(); proc = null; }
}

/* ------------------------------- file in loop ------------------------------ */
function startFile(buf: AudioBuffer, def: TrackDef) {
  const c = audioCtx();
  const bus = musicBus();
  if (!c || !bus) return;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = def.loop;
  const g = c.createGain();
  g.gain.value = 0.0001;
  src.connect(g).connect(bus);
  src.start();
  fadeTo(g, def.gain, def.fadeIn);
  fileSource = src;
  fileGain = g;
}

function stopFile(fade = 0.8) {
  const src = fileSource;
  const g = fileGain;
  fileSource = null;
  fileGain = null;
  if (g) fadeTo(g, 0, fade);
  if (src) setTimeout(() => { try { src.stop(); } catch { /* */ } }, fade * 1000 + 60);
}

/* --------------------------------- API ------------------------------------- */
export function playMusic(id: string) {
  if (!enabled) return;
  if (id === currentId) return;
  const resolved = resolveCue(id);
  if (!resolved) return;
  currentId = id;
  const { def } = resolved;

  // crossfade: spegni ciò che suona
  stopFile(def.fadeOut);
  stopProcedural();

  if (def.file) {
    void loadBuffer(def.file).then((buf) => {
      // potrebbe essere cambiato cue nel frattempo
      if (currentId !== id || !enabled) return;
      if (buf) startFile(buf, def);
      else startProcedural(def.fallback); // file assente → placeholder discreto
    });
  } else {
    startProcedural(def.fallback);
  }
}

export function stopMusic() {
  currentId = "";
  stopFile(0.5);
  stopProcedural();
}

export function setMusicEnabled(on: boolean) {
  enabled = on;
  if (!on) stopMusic();
}
export function isMusicEnabled() {
  return enabled;
}

/* ----------------------------- FactionLeitmotifSystem ---------------------- */
const LEITMOTIFS: Record<string, { root: number; notes: number[]; type: OscillatorType }> = {
  governo: { root: 131, notes: [0, 4, 7, 12], type: "sawtooth" },
  sir: { root: 110, notes: [0, 3, 0, -2], type: "square" },
  anello: { root: 98, notes: [0, 1, 0], type: "sine" },
  brigate: { root: 146, notes: [0, 5, 3, 8], type: "square" },
  procura: { root: 116, notes: [0, 5, 7], type: "triangle" },
  stampa: { root: 174, notes: [0, 2, 4, 5], type: "sawtooth" },
  avanguardia: { root: 92, notes: [0, -1, -3], type: "sawtooth" },
  cupola: { root: 87, notes: [0, 3, -2], type: "sawtooth" },
  salotto: { root: 138, notes: [0, 4, 9], type: "triangle" },
  loggia: { root: 103, notes: [0, 6, 0], type: "sine" },
  sindacato: { root: 123, notes: [0, 2, 4], type: "triangle" },
  rete: { root: 98, notes: [0, 5, 3], type: "square" },
};

const semis = (root: number, s: number) => root * Math.pow(2, s / 12);

/** Sound signature breve della fazione (sul bus music). */
export function playLeitmotif(faction: string) {
  if (!enabled) return;
  const c = audioCtx();
  const bus = musicBus();
  const m = LEITMOTIFS[faction];
  if (!c || !bus || !m) return;
  const t0 = c.currentTime;
  const step = 0.26;
  m.notes.forEach((n, i) => {
    const t = t0 + i * step;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = m.type;
    osc.frequency.value = semis(m.root, n);
    osc.detune.value = -5;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1100;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + step * 0.95);
    osc.connect(lp).connect(g).connect(bus);
    osc.start(t);
    osc.stop(t + step);
  });
}
