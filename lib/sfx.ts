/**
 * Effetti sonori sintetizzati via WebAudio: nessun asset, leggeri, "analogici".
 * Sicuri per SSR (guardano `window`). Disattivabili globalmente.
 */

let ctx: AudioContext | null = null;
let enabled = true;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!enabled) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

export function isSfxEnabled() {
  return enabled;
}

/** Tonfo del timbro: rumore filtrato + click secco. */
export function playStamp() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;

  // corpo del colpo
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.08);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.2);

  // schiocco della carta
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, 1024, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  noise.buffer = buf;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.25, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  noise.connect(ng).connect(c.destination);
  noise.start(t);
}

/** Click leggero (carte, pulsanti). */
export function playClick() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(420, t);
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}

/** Squillo del telefono (due colpi). */
export function playRing() {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  for (const off of [0, 0.18]) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, t0 + off);
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.setValueAtTime(40, t0 + off);
    lg.gain.setValueAtTime(400, t0 + off);
    lfo.connect(lg).connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, t0 + off);
    g.gain.exponentialRampToValueAtTime(0.22, t0 + off + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + off + 0.14);
    osc.connect(g).connect(c.destination);
    osc.start(t0 + off);
    lfo.start(t0 + off);
    osc.stop(t0 + off + 0.16);
    lfo.stop(t0 + off + 0.16);
  }
}

/** Campanello/segnale grave (eventi cupi). */
export function playThud() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(70, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.62);
}

/** Fruscio di carta (documento che scivola sulla scrivania). */
export function playPaper() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const noise = c.createBufferSource();
  const len = Math.floor(c.sampleRate * 0.22);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  noise.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;
  const g = c.createGain();
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  noise.connect(hp).connect(g).connect(c.destination);
  noise.start(t);
}

/** Telescrivente che batte (telex). */
export function playTelex() {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  for (let i = 0; i < 7; i++) {
    const t = t0 + i * 0.05;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(320 + (i % 2) * 80, t);
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }
}

/** Cassetto dello schedario. */
export function playDrawer() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.linearRampToValueAtTime(90, t + 0.18);
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.24);
}
