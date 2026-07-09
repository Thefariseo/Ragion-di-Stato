import type { ActionRequirement, ActionTarget, CaseAction, Consequence } from "@/types";

/**
 * Factory per le azioni comuni: riducono la ripetizione nei file dei casi.
 * La `consequence` resta sempre specifica del caso. `opts.requires` rende
 * l'azione DISPONIBILE solo quando è giustificata (vedi game/actions.ts).
 */

interface ActOpts {
  hint?: string;
  requires?: ActionRequirement;
  lockHint?: string;
  target?: ActionTarget;
  needsStamp?: boolean;
  stampLabel?: string;
}

export function approva(consequence: Consequence, opts?: ActOpts | string): CaseAction {
  const o = typeof opts === "string" ? { hint: opts } : opts ?? {};
  return { id: "approva", label: "Approva", kind: "approva", needsStamp: true, stampLabel: "APPROVATO", consequence, ...o };
}

export function respingi(consequence: Consequence, opts?: ActOpts | string): CaseAction {
  const o = typeof opts === "string" ? { hint: opts } : opts ?? {};
  return { id: "respingi", label: "Respingi", kind: "respingi", needsStamp: true, stampLabel: "RESPINTO", consequence, ...o };
}

export function archivia(consequence: Consequence, opts?: ActOpts | string): CaseAction {
  const o = typeof opts === "string" ? { hint: opts } : opts ?? {};
  return { id: "archivia", label: "Archivia", kind: "archivia", consequence, ...o };
}

export function segnala(consequence: Consequence, opts?: ActOpts | string): CaseAction {
  const o = typeof opts === "string" ? { hint: opts } : opts ?? {};
  return { id: "segnala", label: "Segnala", kind: "segnala", needsStamp: true, stampLabel: "SEGNALATO", consequence, ...o };
}

/** Richiesta di verifica: disponibile dopo aver esaminato la pratica (lente). */
export function richiediVerifica(consequence: Consequence, opts?: ActOpts): CaseAction {
  return {
    id: "richiedi_verifica",
    label: "Richiedi verifica",
    kind: "verifica",
    consequence,
    requires: { inspected: true },
    lockHint: "Esamina prima la pratica con la lente.",
    ...opts,
  };
}

/** Azione speciale del caso (trasmetti, occulta, distruggi, proteggi, verifica…). */
export function special(
  id: string,
  label: string,
  kind: CaseAction["kind"],
  consequence: Consequence,
  opts?: ActOpts,
): CaseAction {
  return { id, label, kind, consequence, ...opts };
}
