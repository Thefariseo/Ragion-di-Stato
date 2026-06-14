import type { CaseAction, Consequence } from "@/types";

/**
 * Factory per le azioni comuni: riducono la ripetizione nei file dei casi.
 * La `consequence` resta sempre specifica del caso.
 */

export function approva(consequence: Consequence, hint?: string): CaseAction {
  return {
    id: "approva",
    label: "Approva",
    kind: "approva",
    needsStamp: true,
    stampLabel: "APPROVATO",
    consequence,
    hint,
  };
}

export function respingi(consequence: Consequence, hint?: string): CaseAction {
  return {
    id: "respingi",
    label: "Respingi",
    kind: "respingi",
    needsStamp: true,
    stampLabel: "RESPINTO",
    consequence,
    hint,
  };
}

export function archivia(consequence: Consequence, hint?: string): CaseAction {
  return {
    id: "archivia",
    label: "Archivia",
    kind: "archivia",
    consequence,
    hint,
  };
}

export function segnala(consequence: Consequence, hint?: string): CaseAction {
  return {
    id: "segnala",
    label: "Segnala",
    kind: "segnala",
    needsStamp: true,
    stampLabel: "SEGNALATO",
    consequence,
    hint,
  };
}

/** Azione speciale del caso (trasmetti, occulta, distruggi, proteggi, verifica…). */
export function special(
  id: string,
  label: string,
  kind: CaseAction["kind"],
  consequence: Consequence,
  opts?: { needsStamp?: boolean; stampLabel?: string; hint?: string },
): CaseAction {
  return {
    id,
    label,
    kind,
    needsStamp: opts?.needsStamp,
    stampLabel: opts?.stampLabel,
    consequence,
    hint: opts?.hint,
  };
}
