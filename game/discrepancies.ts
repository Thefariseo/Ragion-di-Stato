import type { CaseDef, Discrepancy } from "@/types";

/**
 * DiscrepancyEngine — la verità di un caso sta nelle CONTRADDIZIONI tra i suoi
 * documenti. Qui si dichiarano (in data, per caso) e si verificano i confronti
 * fatti dal giocatore con la lente. Separato dalla UI (Dossier) e dalle regole.
 */

export interface FieldRef {
  docId: string;
  field: string;
}

/** Tutte le contraddizioni dichiarate per il caso. */
export function discrepanciesOf(caseDef: CaseDef): Discrepancy[] {
  return caseDef.discrepancies ?? [];
}

/** Quante contraddizioni esistono in totale (target del confronto). */
export function discrepancyCount(caseDef: CaseDef): number {
  return discrepanciesOf(caseDef).length;
}

/**
 * Verifica se la coppia di campi confrontata corrisponde a una contraddizione
 * dichiarata (in un verso o nell'altro). Restituisce la nota, o null.
 */
export function matchDiscrepancy(caseDef: CaseDef, a: FieldRef, b: FieldRef): Discrepancy | null {
  for (const d of discrepanciesOf(caseDef)) {
    const m1 = d.aDocId === a.docId && d.aField === a.field && d.bDocId === b.docId && d.bField === b.field;
    const m2 = d.aDocId === b.docId && d.aField === b.field && d.bDocId === a.docId && d.bField === a.field;
    if (m1 || m2) return d;
  }
  return null;
}

/** chiave stabile di una contraddizione trovata (per non contarla due volte). */
export function discrepancyKey(d: Discrepancy): string {
  return `${d.aField}|${d.bField}`;
}
