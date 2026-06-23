/**
 * AmbientLoopSystem — il SOUND DESIGN ambientale che domina durante il gameplay
 * alla scrivania (mentre la musica si ritira). Tutto sintetizzato via WebAudio,
 * nessun asset: ronzio del neon, brusio ministeriale lontano, e one-shot
 * diegetici sparsi (telex, macchina da scrivere, passi, porte, sirene lontane,
 * fruscio di carta). Volume basso: è un AMBIENTE, non un brano.
 */

let ctx: AudioContext | null = null;
let bed: GainNode | null = null;
let nodes: { stop: () => void }[] = [];
let scheduler: ReturnType<typeof setTimeout> | null = null;
let enabled = true;
let running = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined" || !enabled) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    bed = ctx.createGain();
    bed.gain.value = 0.0001;
    bed.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** ronzio del neon: due sinusoidi gravi + un 100 Hz con tremolo lento. */
function buildNeonHum(c: AudioContext, out: GainNode) {
  const g = c.createGain();
  g.gain.value = 0.05;
  g.connect(out);
  const a = c.createOscillator();
  a.type = "sine";
  a.frequency.value = 50;
  const b = c.createOscillator();
  b.type = "sine";
  b.frequency.value = 100;
  b.detune.value = 4;
  const buzz = c.createOscillator();
  buzz.type = "triangle";
  buzz.frequency.value = 120;
  const buzzG = c.createGain();
  buzzG.gain.value = 0.18;
  // tremolo lento (il neon che "respira")
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoG = c.createGain();
  lfoG.gain.value = 0.03;
  lfo.connect(lfoG).connect(g.gain);
  a.connect(g);
  b.connect(g);
  buzz.connect(buzzG).connect(g);
  [a, b, buzz, lfo].forEach((o) => o.start());
  nodes.push({ stop: () => [a, b, buzz, lfo].forEach((o) => { try { o.stop(); } catch { /* */ } }) });
}

/** brusio ministeriale: rumore filtrato a banda stretta con swell lentissimi. */
function buildMurmur(c: AudioContext, out: GainNode) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 4);
  src.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 420;
  bp.Q.value = 0.8;
  const g = c.createGain();
  g.gain.value = 0.012;
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoG = c.createGain();
  lfoG.gain.value = 0.01;
  lfo.connect(lfoG).connect(g.gain);
  src.connect(bp).connect(g).connect(out);
  src.start();
  lfo.start();
  nodes.push({ stop: () => { try { src.stop(); } catch { /* */ } try { lfo.stop(); } catch { /* */ } } });
}

/* ------------------------------- one-shot lontani ------------------------- */

function farTone(freq: number, type: OscillatorType, gain: number, dur: number, slideTo?: number) {
  const c = ctx;
  if (!c || !bed) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(lp).connect(g).connect(bed);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function farNoise(gain: number, dur: number, band: number, q = 1) {
  const c = ctx;
  if (!c || !bed) return;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur + 0.05);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = band;
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(bed);
  src.start(t);
}

const ONESHOTS: (() => void)[] = [
  () => { for (let i = 0; i < 5; i++) setTimeout(() => farTone(360 + (i % 2) * 60, "square", 0.03, 0.03), i * 70); }, // macchina da scrivere
  () => { for (let i = 0; i < 6; i++) setTimeout(() => farTone(300, "square", 0.025, 0.02), i * 55); }, // telex
  () => farTone(70, "sine", 0.05, 0.5, 42), // porta lontana (tonfo)
  () => { for (let i = 0; i < 4; i++) setTimeout(() => farNoise(0.04, 0.08, 250), i * 230); }, // passi
  () => farNoise(0.05, 0.5, 2400), // fruscio di carta
  () => { // sirena lontana
    const c = ctx; if (!c || !bed) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(620, t);
    o.frequency.linearRampToValueAtTime(720, t + 0.6);
    o.frequency.linearRampToValueAtTime(620, t + 1.2);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.025, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(lp).connect(g).connect(bed);
    o.start(t); o.stop(t + 1.35);
  },
];

function scheduleNext() {
  const delay = 4500 + Math.random() * 7000;
  scheduler = setTimeout(() => {
    if (running && ac()) ONESHOTS[Math.floor(Math.random() * ONESHOTS.length)]?.();
    scheduleNext();
  }, delay);
}

export function startAmbient() {
  if (running) return;
  const c = ac();
  if (!c || !bed) return;
  running = true;
  buildNeonHum(c, bed);
  buildMurmur(c, bed);
  bed.gain.cancelScheduledValues(c.currentTime);
  bed.gain.setValueAtTime(Math.max(0.0001, bed.gain.value), c.currentTime);
  bed.gain.exponentialRampToValueAtTime(0.9, c.currentTime + 1.2);
  scheduleNext();
}

export function stopAmbient() {
  if (!running) return;
  running = false;
  if (scheduler) clearTimeout(scheduler);
  scheduler = null;
  if (bed && ctx) {
    bed.gain.cancelScheduledValues(ctx.currentTime);
    bed.gain.setValueAtTime(bed.gain.value, ctx.currentTime);
    bed.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
  }
  const toStop = nodes;
  nodes = [];
  setTimeout(() => toStop.forEach((n) => n.stop()), 700);
}

export function setAmbientEnabled(on: boolean) {
  enabled = on;
  if (!on) stopAmbient();
}

export function isAmbientEnabled() {
  return enabled;
}
