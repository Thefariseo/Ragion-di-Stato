/**
 * RNG deterministico (mulberry32). Le run sono riproducibili da seed.
 * Lo stato di gioco conserva un `rngCursor`: ricreando il generatore con
 * (seed, cursor) si ottiene sempre la stessa sequenza.
 */

export interface Rng {
  next: () => number; // [0,1)
  int: (minInclusive: number, maxInclusive: number) => number;
  pick: <T>(arr: readonly T[]) => T;
  weighted: <T>(arr: readonly T[], weight: (item: T) => number) => T;
  cursor: () => number;
}

export function makeRng(seed: number, cursor = 0): Rng {
  let a = (seed + cursor * 0x9e3779b9) >>> 0;
  let calls = cursor;

  const next = () => {
    calls++;
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));

  const pick = <T>(arr: readonly T[]): T => arr[int(0, arr.length - 1)] as T;

  const weighted = <T>(arr: readonly T[], weight: (item: T) => number): T => {
    const total = arr.reduce((s, it) => s + Math.max(0, weight(it)), 0);
    if (total <= 0) return pick(arr);
    let r = next() * total;
    for (const it of arr) {
      r -= Math.max(0, weight(it));
      if (r <= 0) return it;
    }
    return arr[arr.length - 1] as T;
  };

  return { next, int, pick, weighted, cursor: () => calls };
}

/** Seed casuale leggibile (numerico). */
export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

/** Hash stabile stringa→numero (per foto procedurali, ecc.). */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
