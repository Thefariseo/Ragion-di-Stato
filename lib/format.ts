/** Utility di formattazione per l'estetica d'epoca. */

/** Lire con separatore di migliaia: 124000 -> "124.000". */
export function formatLire(n: number): string {
  const sign = n < 0 ? "−" : "";
  const s = Math.abs(Math.round(n)).toString();
  return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Minuti dall'apertura (0 = 09:00) -> "HH:MM". */
export function formatClock(minutesFromOpen: number): string {
  const total = 9 * 60 + minutesFromOpen;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Numero di protocollo in stile ministeriale. */
export function formatProtocollo(n: number): string {
  const year = 1970 + (n % 9);
  const serial = (n % 99999).toString().padStart(5, "0");
  return `${serial}/${year}`;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
