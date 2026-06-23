/**
 * AudioSystem — il mixer centrale del gioco. Un solo AudioContext, un master e
 * quattro BUS separati (music / ambience / sfx / voice) con volume e mute
 * indipendenti, persistiti. Tutti i moduli audio (MusicManager, AmbientLoop,
 * VoiceBlip, SFXRegistry) si collegano a un bus invece che a destination, così
 * il bilanciamento è centralizzato (niente earrape) e regolabile dalle opzioni.
 *
 * Supporta il caricamento di FILE audio esterni (in /public/audio, vedi
 * data/audioManifest.ts) con decodifica in cache e FALLBACK procedurale pulito
 * quando il file non c'è: il gioco suona comunque, e basta lasciar cadere le
 * tracce nelle cartelle per sostituirle.
 */

export type Bus = "music" | "ambience" | "sfx" | "voice";
const BUSES: Bus[] = ["music", "ambience", "sfx", "voice"];

const DEFAULT_VOL: Record<Bus, number> = {
  music: 0.7,
  ambience: 0.85,
  sfx: 0.9,
  voice: 0.7,
};
const STORE_KEY = "rds/audio/v1";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const busGain: Partial<Record<Bus, GainNode>> = {};
let muted = false;
const volumes: Record<Bus, number> = { ...DEFAULT_VOL };
const bufferCache = new Map<string, AudioBuffer | null>();
let loaded = false;

function loadPrefs() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { muted?: boolean; volumes?: Partial<Record<Bus, number>> };
      if (typeof p.muted === "boolean") muted = p.muted;
      if (p.volumes) for (const b of BUSES) if (typeof p.volumes[b] === "number") volumes[b] = p.volumes[b] as number;
    }
  } catch { /* noop */ }
}

function savePrefs() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ muted, volumes })); } catch { /* noop */ }
}

/** Crea (una volta) il contesto, il master e i bus. */
export function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  loadPrefs();
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    for (const b of BUSES) {
      const g = ctx.createGain();
      g.gain.value = volumes[b];
      g.connect(master);
      busGain[b] = g;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Il nodo del bus a cui collegarsi (creando il contesto se serve). */
export function busNode(b: Bus): GainNode | null {
  if (!audioCtx()) return null;
  return busGain[b] ?? null;
}

export function resumeAudio() {
  if (ctx && ctx.state === "suspended") void ctx.resume();
  else audioCtx();
}

export function setVolume(b: Bus, v: number) {
  const vol = Math.max(0, Math.min(1, v));
  volumes[b] = vol;
  const g = busGain[b];
  if (g && ctx) g.gain.setTargetAtTime(vol, ctx.currentTime, 0.02);
  savePrefs();
}
export function getVolume(b: Bus): number {
  loadPrefs();
  return volumes[b];
}

export function setMuted(on: boolean) {
  muted = on;
  if (master && ctx) master.gain.setTargetAtTime(on ? 0 : 1, ctx.currentTime, 0.02);
  savePrefs();
}
export function isMuted(): boolean {
  loadPrefs();
  return muted;
}

/** rampa morbida di un gain verso un valore (fade in/out). */
export function fadeTo(node: GainNode, target: number, seconds: number) {
  const c = ctx;
  if (!c) { node.gain.value = target; return; }
  const t = c.currentTime;
  const cur = Math.max(0.0001, node.gain.value);
  node.gain.cancelScheduledValues(t);
  node.gain.setValueAtTime(cur, t);
  if (target <= 0.0001) node.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  else node.gain.exponentialRampToValueAtTime(target, t + seconds);
}

/**
 * Carica e decodifica un file audio (con cache). Ritorna null se il file non
 * esiste o non è decodificabile: chi chiama deve avere un FALLBACK procedurale.
 */
export async function loadBuffer(url: string): Promise<AudioBuffer | null> {
  if (bufferCache.has(url)) return bufferCache.get(url) ?? null;
  const c = audioCtx();
  if (!c) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) { bufferCache.set(url, null); return null; }
    const arr = await res.arrayBuffer();
    const buf = await c.decodeAudioData(arr);
    bufferCache.set(url, buf);
    return buf;
  } catch {
    bufferCache.set(url, null);
    return null;
  }
}
