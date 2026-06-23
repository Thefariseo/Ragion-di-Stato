/**
 * MusicManager — colonna sonora procedurale (WebAudio, nessun asset).
 * NON horror: un INNO STATALE DEFORMATO. Minimale, marziale, freddo,
 * burocratico, solenne. Pad d'organo filtrato + un motivo ricorrente in scala
 * minore, percussioni asciutte, drone basso "oppressivo".
 *
 * Regola d'uso (vedi components/Game.tsx): la MUSICA accompagna menu, intro,
 * cutscene, presentazione fazioni, crisi e finali. Durante il gameplay alla
 * scrivania domina invece il SOUND DESIGN ambientale (lib/ambient.ts).
 */

type Osc = OscillatorType;

interface Theme {
  bpm: number;
  root: number;
  gain: number;
  /** passi (0..15) su cui batte la grancassa marziale */
  kick: number[];
  snare: number[];
  bass: (number | null)[];
  lead: (number | null)[];
  /** accordo d'organo sostenuto (semitoni) battuto sui passi `chordOn` */
  chord?: number[];
  chordOn?: number[];
  bassType: Osc;
  leadType: Osc;
  drone: number;
  /** taglio del filtro passa-basso del mix (freddo = più basso) */
  cutoff: number;
}

const N: (number | null)[] = Array(16).fill(null);
const put = (arr: (number | null)[], map: Record<number, number>) => {
  const a = [...arr];
  for (const k of Object.keys(map)) a[+k] = map[+k] as number;
  return a;
};

// minore naturale: 0 2 3 5 7 8 10. Intervalli da inno: quarte/quinte vuote.
const THEMES: Record<string, Theme> = {
  // titolo / intro / momenti solenni — inno lento, organo + ottoni cupi
  solenne: {
    bpm: 50,
    root: 98,
    gain: 0.085,
    kick: [0],
    snare: [],
    bass: put(N, { 0: -12, 8: -7 }),
    lead: put(N, { 0: 0, 4: 3, 8: 7, 12: 5 }), // i - III - V - IV (modale)
    chord: [0, 7, 12], // quinte vuote: severo, "statale"
    chordOn: [0, 8],
    bassType: "sawtooth",
    leadType: "sawtooth",
    drone: 49,
    cutoff: 950,
  },
  // alla scrivania — quasi muto: la musica si ritira, parla l'ambiente
  lavoro: {
    bpm: 72,
    root: 98,
    gain: 0.022,
    kick: [],
    snare: [],
    bass: put(N, { 0: -12 }),
    lead: put(N, {}),
    bassType: "sine",
    leadType: "sine",
    drone: 49,
    cutoff: 700,
  },
  // tensione / crisi — marcia che stringe
  tensione: {
    bpm: 100,
    root: 104,
    gain: 0.08,
    kick: [0, 4, 8, 12],
    snare: [10],
    bass: put(N, { 0: -12, 4: -12, 6: -10, 8: -12, 12: -12, 14: -10 }),
    lead: put(N, { 2: 0, 7: -2, 11: 0, 15: 1 }),
    chord: [0, 3, 7], // triade minore
    chordOn: [0, 8],
    bassType: "square",
    leadType: "sawtooth",
    drone: 52,
    cutoff: 1200,
  },
  // finale — inno che si spegne
  finale: {
    bpm: 46,
    root: 87,
    gain: 0.1,
    kick: [0, 8],
    snare: [],
    bass: put(N, { 0: -12, 8: -5 }),
    lead: put(N, { 0: 0, 6: 3, 10: 7, 14: 3 }),
    chord: [0, 7, 12],
    chordOn: [0, 8],
    bassType: "sawtooth",
    leadType: "sawtooth",
    drone: 43,
    cutoff: 820,
  },
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lp: BiquadFilterNode | null = null;
let droneOsc: OscillatorNode | null = null;
let droneSub: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let theme: Theme | null = null;
let currentId = "";
let step = 0;
let enabled = true;

function ac(): AudioContext | null {
  if (typeof window === "undefined" || !enabled) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1000;
    lp.Q.value = 0.4;
    lp.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function semis(root: number, s: number): number {
  return root * Math.pow(2, s / 12);
}

function tone(freq: number, type: Osc, gain: number, dur: number, attack = 0.02) {
  const c = ctx;
  if (!c || !lp) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  // leggera stonatura per il timbro "deformato"
  osc.detune.value = (Math.random() * 2 - 1) * 6;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(lp);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

/** accordo d'organo sostenuto, filtrato e freddo. */
function chordHit(root: number, offsets: number[], gain: number, dur: number) {
  for (const o of offsets) tone(semis(root, o - 12), "sawtooth", gain * 0.5, dur, 0.08);
}

function kick() {
  const c = ctx;
  if (!c || !master) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.13);
  g.gain.setValueAtTime(0.55, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.22);
}

function snare() {
  const c = ctx;
  if (!c || !master) return;
  const t = c.currentTime;
  const len = Math.floor(c.sampleRate * 0.1);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;
  const g = c.createGain();
  g.gain.setValueAtTime(0.14, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  src.connect(hp).connect(g).connect(master);
  src.start(t);
}

function playStep() {
  if (!theme || !ac()) return;
  const th = theme;
  if (th.kick.includes(step)) kick();
  if (th.snare.includes(step)) snare();
  if (th.chord && th.chordOn?.includes(step)) chordHit(th.root, th.chord, th.gain, (60 / th.bpm / 4) * 8);
  const b = th.bass[step];
  if (b != null) tone(semis(th.root, b), th.bassType, th.gain, 0.5);
  const l = th.lead[step];
  if (l != null) tone(semis(th.root, l + 12), th.leadType, th.gain * 0.55, 0.6, 0.05);
  step = (step + 1) % 16;
}

function startDrone() {
  const c = ac();
  if (!c || !lp || droneOsc || !theme) return;
  droneOsc = c.createOscillator();
  droneSub = c.createOscillator();
  droneGain = c.createGain();
  droneOsc.type = "sine";
  droneSub.type = "sine";
  droneOsc.frequency.value = theme.drone;
  droneSub.frequency.value = theme.drone / 2;
  droneSub.detune.value = -4;
  droneGain.gain.value = 0.06;
  droneOsc.connect(droneGain);
  droneSub.connect(droneGain);
  droneGain.connect(lp);
  droneOsc.start();
  droneSub.start();
}

export function playMusic(id: string) {
  if (id === currentId && timer) return;
  const th = THEMES[id] ?? THEMES[id.startsWith("leit") ? "solenne" : id];
  if (!th) return;
  currentId = id;
  theme = th;
  step = 0;
  const c = ac();
  if (!c) return;
  if (lp) lp.frequency.setValueAtTime(th.cutoff, c.currentTime);
  startDrone();
  if (droneOsc) droneOsc.frequency.setValueAtTime(th.drone, c.currentTime);
  if (droneSub) droneSub.frequency.setValueAtTime(th.drone / 2, c.currentTime);
  if (timer) clearInterval(timer);
  const stepMs = (60 / th.bpm / 4) * 1000;
  timer = setInterval(playStep, stepMs);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
  currentId = "";
  if (droneGain && ctx) droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  for (const o of [droneOsc, droneSub]) {
    if (o) {
      try { o.stop((ctx?.currentTime ?? 0) + 0.5); } catch { /* noop */ }
    }
  }
  droneOsc = null;
  droneSub = null;
  droneGain = null;
}

export function setMusicEnabled(on: boolean) {
  enabled = on;
  if (!on) stopMusic();
}

export function isMusicEnabled() {
  return enabled;
}

/* ----------------------------- FactionLeitmotifSystem ---------------------- */

/** motivo breve e riconoscibile per fazione (semitoni dal root). */
const LEITMOTIFS: Record<string, { root: number; notes: number[]; type: Osc }> = {
  governo: { root: 131, notes: [0, 4, 7, 12], type: "sawtooth" }, // ascendente, "ufficiale"
  sir: { root: 110, notes: [0, 3, 0, -2], type: "square" }, // freddo, sorvegliante
  anello: { root: 98, notes: [0, 1, 0], type: "sine" }, // due note, assenza
  brigate: { root: 146, notes: [0, 5, 3, 8], type: "square" }, // teso, militante
  procura: { root: 116, notes: [0, 5, 7], type: "triangle" }, // sobrio, fermo
  stampa: { root: 174, notes: [0, 2, 4, 5], type: "sawtooth" }, // nervoso, rapido
  avanguardia: { root: 92, notes: [0, -1, -3], type: "sawtooth" },
  cupola: { root: 87, notes: [0, 3, -2], type: "sawtooth" },
  salotto: { root: 138, notes: [0, 4, 9], type: "triangle" },
  loggia: { root: 103, notes: [0, 6, 0], type: "sine" },
  sindacato: { root: 123, notes: [0, 2, 4], type: "triangle" },
  rete: { root: 98, notes: [0, 5, 3], type: "square" },
};

/** Suona il leitmotiv di una fazione (presentazione/dossier). */
export function playLeitmotif(faction: string) {
  const c = ac();
  const m = LEITMOTIFS[faction];
  if (!c || !m || !lp) return;
  const t0 = c.currentTime;
  const step = 0.26;
  m.notes.forEach((n, i) => {
    const t = t0 + i * step;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = m.type;
    osc.frequency.value = semis(m.root, n);
    osc.detune.value = -5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + step * 0.95);
    osc.connect(g).connect(lp!);
    osc.start(t);
    osc.stop(t + step);
  });
}
