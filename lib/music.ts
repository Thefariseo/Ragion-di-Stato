/**
 * Colonna sonora procedurale (WebAudio, nessun asset): cupa, marziale,
 * burocratica, minimale. Pochi motivi in scala minore, percussioni asciutte,
 * timbri scuri filtrati + un drone basso "oppressivo". Emula la FUNZIONE
 * musicale di Papers, Please senza copiarne le melodie.
 */

type Osc = OscillatorType;

interface Theme {
  bpm: number;
  root: number;
  gain: number;
  kick: number[];
  snare: number[];
  bass: (number | null)[];
  lead: (number | null)[];
  bassType: Osc;
  leadType: Osc;
  drone: number;
}

const N: (number | null)[] = Array(16).fill(null);
const put = (arr: (number | null)[], map: Record<number, number>) => {
  const a = [...arr];
  for (const k of Object.keys(map)) a[+k] = map[+k] as number;
  return a;
};

const THEMES: Record<string, Theme> = {
  // titolo / intro / momenti solenni — marziale, lento
  solenne: {
    bpm: 64,
    root: 110,
    gain: 0.09,
    kick: [0, 8],
    snare: [],
    bass: put(N, { 0: -12, 4: -5, 8: -7, 12: -5 }),
    lead: put(N, { 2: 12, 6: 10, 10: 8, 14: 7 }),
    bassType: "sawtooth",
    leadType: "triangle",
    drone: 55,
  },
  // lavoro alla scrivania — quasi solo ambiente, non invasivo
  lavoro: {
    bpm: 80,
    root: 110,
    gain: 0.045,
    kick: [0],
    snare: [],
    bass: put(N, { 0: -12, 8: -12 }),
    lead: put(N, { 12: 12 }),
    bassType: "sine",
    leadType: "sine",
    drone: 55,
  },
  // tensione — eventi, crisi
  tensione: {
    bpm: 104,
    root: 110,
    gain: 0.08,
    kick: [0, 4, 8, 12],
    snare: [6, 14],
    bass: put(N, { 0: -12, 2: -12, 4: -11, 6: -12, 8: -12, 10: -11, 12: -12, 14: -11 }),
    lead: put(N, { 3: 13, 11: 1 }),
    bassType: "square",
    leadType: "square",
    drone: 55,
  },
  // finale
  finale: {
    bpm: 54,
    root: 98,
    gain: 0.1,
    kick: [0, 8],
    snare: [12],
    bass: put(N, { 0: -12, 8: -7 }),
    lead: put(N, { 2: 12, 6: 11, 10: 10, 14: 8 }),
    bassType: "sawtooth",
    leadType: "triangle",
    drone: 49,
  },
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lp: BiquadFilterNode | null = null;
let droneOsc: OscillatorNode | null = null;
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
    master.gain.value = 0.6;
    lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    lp.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function semis(root: number, s: number): number {
  return root * Math.pow(2, s / 12);
}

function tone(freq: number, type: Osc, gain: number, dur: number) {
  const c = ctx;
  if (!c || !lp) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(lp);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function kick() {
  const c = ctx;
  if (!c || !master) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.2);
}

function snare() {
  const c = ctx;
  if (!c || !master) return;
  const t = c.currentTime;
  const len = Math.floor(c.sampleRate * 0.12);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  src.connect(g).connect(master);
  src.start(t);
}

function playStep() {
  if (!theme || !ac()) return;
  const th = theme;
  if (th.kick.includes(step)) kick();
  if (th.snare.includes(step)) snare();
  const b = th.bass[step];
  if (b != null) tone(semis(th.root, b), th.bassType, th.gain, 0.5);
  const l = th.lead[step];
  if (l != null) tone(semis(th.root, l), th.leadType, th.gain * 0.7, 0.4);
  step = (step + 1) % 16;
}

function startDrone() {
  const c = ac();
  if (!c || !lp || droneOsc || !theme) return;
  droneOsc = c.createOscillator();
  droneGain = c.createGain();
  droneOsc.type = "sine";
  droneOsc.frequency.value = theme.drone;
  droneGain.gain.value = 0.05;
  droneOsc.connect(droneGain).connect(lp);
  droneOsc.start();
}

export function playMusic(id: string) {
  if (id === currentId && timer) return;
  const th = THEMES[id];
  if (!th) return;
  currentId = id;
  theme = th;
  step = 0;
  if (!ac()) return;
  if (droneOsc && droneGain) droneGain.gain.value = 0.05;
  startDrone();
  if (droneOsc && theme) {
    const c = ctx!;
    droneOsc.frequency.setValueAtTime(theme.drone, c.currentTime);
  }
  if (timer) clearInterval(timer);
  const stepMs = (60 / th.bpm / 4) * 1000;
  timer = setInterval(playStep, stepMs);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
  currentId = "";
  if (droneGain && ctx) {
    droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  if (droneOsc) {
    try {
      droneOsc.stop((ctx?.currentTime ?? 0) + 0.5);
    } catch {
      /* noop */
    }
    droneOsc = null;
    droneGain = null;
  }
}

export function setMusicEnabled(on: boolean) {
  enabled = on;
  if (!on) stopMusic();
}

export function isMusicEnabled() {
  return enabled;
}
