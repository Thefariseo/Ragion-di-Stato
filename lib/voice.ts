/**
 * VoiceBlipSystem — mormorii vocali stilizzati, NON verbali, sincronizzati con la
 * comparsa del testo (come Papers, Please). Niente doppiaggio, niente TTS: solo
 * brevi blip sporchi sintetizzati via WebAudio, con profili diversi per chi parla.
 * Disattivabile e regolabile dalle opzioni audio (canale separato da musica/sfx).
 */

import { audioCtx, busNode } from "@/lib/audio/core";

let ctx: AudioContext | null = null;
let enabled = true;
let volume = 0.5;
let lastAt = 0;

function ac(): AudioContext | null {
  if (!enabled) return null;
  ctx = audioCtx();
  return ctx;
}
function out(): AudioNode | null {
  return busNode("voice");
}

export function setVoiceEnabled(on: boolean) {
  enabled = on;
}
export function isVoiceEnabled() {
  return enabled;
}
export function setVoiceVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
}
export function getVoiceVolume() {
  return volume;
}

export type VoiceProfileId =
  | "comune" // cittadino qualunque
  | "ministero" // funzionario ministeriale
  | "superiore" // il superiore
  | "servizi" // SIR / Anello
  | "stampa" // giornalista
  | "magistratura" // magistrato
  | "criminalita" // criminalità organizzata
  | "armati" // gruppi armati
  | "telefono"; // voce al telefono (banda stretta)

interface VoiceProfile {
  /** frequenza base del "formante" */
  freq: number;
  /** variazione casuale di pitch (Hz) */
  jitter: number;
  /** forma d'onda */
  wave: OscillatorType;
  /** quanti caratteri tra un blip e l'altro */
  every: number;
  /** durata del blip (s) */
  dur: number;
  /** quantità di grana/rumore (0..1) */
  grain: number;
  /** volume relativo del profilo */
  gain: number;
  /** filtro passa-banda centrale (Hz); per "telefono" stretta la voce */
  band?: number;
  /** larghezza banda (Q) */
  q?: number;
}

const PROFILES: Record<VoiceProfileId, VoiceProfile> = {
  comune: { freq: 230, jitter: 90, wave: "square", every: 2, dur: 0.055, grain: 0.25, gain: 0.5, band: 900, q: 2 },
  ministero: { freq: 160, jitter: 30, wave: "square", every: 3, dur: 0.05, grain: 0.12, gain: 0.45, band: 700, q: 3 },
  superiore: { freq: 110, jitter: 24, wave: "sawtooth", every: 3, dur: 0.07, grain: 0.18, gain: 0.55, band: 520, q: 3 },
  servizi: { freq: 130, jitter: 18, wave: "sine", every: 3, dur: 0.06, grain: 0.08, gain: 0.4, band: 600, q: 5 },
  stampa: { freq: 300, jitter: 120, wave: "sawtooth", every: 2, dur: 0.045, grain: 0.3, gain: 0.45, band: 1500, q: 2 },
  magistratura: { freq: 175, jitter: 30, wave: "triangle", every: 3, dur: 0.06, grain: 0.1, gain: 0.5, band: 800, q: 3 },
  criminalita: { freq: 95, jitter: 30, wave: "sawtooth", every: 3, dur: 0.08, grain: 0.45, gain: 0.55, band: 480, q: 2 },
  armati: { freq: 210, jitter: 70, wave: "square", every: 2, dur: 0.05, grain: 0.4, gain: 0.5, band: 1100, q: 2 },
  telefono: { freq: 240, jitter: 80, wave: "square", every: 2, dur: 0.05, grain: 0.35, gain: 0.4, band: 1600, q: 8 },
};

/** Un singolo blip. throttle interno per non sovrapporre troppi suoni. */
export function playBlip(profileId: VoiceProfileId = "comune") {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  if (t - lastAt < 0.028) return; // throttle
  lastAt = t;
  const p = PROFILES[profileId] ?? PROFILES.comune;

  const f = p.freq + (Math.random() * 2 - 1) * p.jitter;
  const osc = c.createOscillator();
  osc.type = p.wave;
  osc.frequency.setValueAtTime(f, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, f * 0.78), t + p.dur);

  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(p.band ?? 900, t);
  band.Q.setValueAtTime(p.q ?? 2, t);

  const g = c.createGain();
  const vol = p.gain * volume * 0.5;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);
  osc.connect(band).connect(g).connect(out() ?? c.destination);
  osc.start(t);
  osc.stop(t + p.dur + 0.01);

  // grana: pizzico di rumore sporco
  if (p.grain > 0.01) {
    const n = c.createBufferSource();
    const len = Math.max(64, Math.floor(c.sampleRate * p.dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    n.buffer = buf;
    const ng = c.createGain();
    ng.gain.setValueAtTime(p.grain * vol * 0.6, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);
    const hp = c.createBiquadFilter();
    hp.type = "bandpass";
    hp.frequency.value = p.band ?? 1000;
    n.connect(hp).connect(ng).connect(out() ?? c.destination);
    n.start(t);
  }
}

/** ogni quanti caratteri questo profilo emette un blip. */
export function voiceEvery(profileId: VoiceProfileId = "comune"): number {
  return PROFILES[profileId]?.every ?? 2;
}

/** Mappa una fazione al profilo vocale corrispondente. */
export function voiceForFaction(faction?: string): VoiceProfileId {
  switch (faction) {
    case "governo": return "ministero";
    case "sir":
    case "anello":
    case "rete": return "servizi";
    case "stampa": return "stampa";
    case "procura": return "magistratura";
    case "cupola":
    case "salotto":
    case "loggia": return "criminalita";
    case "brigate":
    case "avanguardia": return "armati";
    case "sindacato": return "comune";
    default: return "comune";
  }
}

/** Mappa il canale di un evento a un profilo vocale. */
export function voiceForChannel(channel: string, faction?: string): VoiceProfileId {
  if (channel === "telefono") return "telefono";
  if (channel === "ispezione") return "ministero";
  if (faction) return voiceForFaction(faction);
  return "ministero";
}
