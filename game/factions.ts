import { FACTIONS } from "@/data/factions";
import type { Consequence, FactionId, FactionStanding } from "@/types";
import { clamp } from "@/lib/format";

export function initFactions(): Record<FactionId, FactionStanding> {
  const out = {} as Record<FactionId, FactionStanding>;
  for (const id of Object.keys(FACTIONS) as FactionId[]) {
    out[id] = { reputation: 0, suspicion: 0 };
  }
  // Il giocatore lavora per l'apparato di governo.
  out.governo.reputation = 5;
  out.sir.reputation = 3;
  return out;
}

/**
 * Applica i delta di fazione con clamp e, se richiesto, propaga sospetto alle
 * fazioni rivali di quelle che hai favorito (reazione a catena).
 */
export function applyFactionDeltas(
  factions: Record<FactionId, FactionStanding>,
  deltas: Consequence["factions"],
  rivalSpill?: boolean,
): Record<FactionId, FactionStanding> {
  const out: Record<FactionId, FactionStanding> = {} as Record<
    FactionId,
    FactionStanding
  >;
  for (const id of Object.keys(factions) as FactionId[]) {
    out[id] = { ...factions[id] };
  }
  if (!deltas) return out;

  for (const id of Object.keys(deltas) as FactionId[]) {
    const d = deltas[id];
    if (!d) continue;
    if (typeof d.reputation === "number") {
      out[id].reputation = clamp(out[id].reputation + d.reputation, -100, 100);
    }
    if (typeof d.suspicion === "number") {
      out[id].suspicion = clamp(out[id].suspicion + d.suspicion, 0, 100);
    }
    // reazione a catena: favorire una fazione insospettisce le rivali
    if (rivalSpill && (d.reputation ?? 0) > 0) {
      const spill = Math.round((d.reputation ?? 0) * 0.4);
      for (const rival of FACTIONS[id].rivals) {
        out[rival].suspicion = clamp(out[rival].suspicion + spill, 0, 100);
      }
    }
  }
  return out;
}
