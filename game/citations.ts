import type { CaseAction, CaseDef, Citation, ValidationResult } from "@/types";

/**
 * Valutazione PROCEDURALE di una decisione (separata dalla conseguenza
 * politico-morale, che è autoriale nella Consequence). Se l'azione contraddice
 * il regolamento o la validazione, genera una citazione con multa.
 * Nei primi giorni la citazione è leggibile; più avanti diventa opaca.
 */
export function computeCitation(
  caseDef: CaseDef,
  action: CaseAction,
  validation: ValidationResult,
  day: number,
): Citation | null {
  // solo i verdetti formali (approva/respingi) sono soggetti a procedura
  if (action.kind !== "approva" && action.kind !== "respingi") return null;

  const regV = caseDef.regulationVerdict;
  let reason: string | null = null;
  let severity: Citation["severity"] = "lieve";
  let fine = 0;
  let ruleId: string | undefined;

  if (action.kind === "approva") {
    if (regV === "respingi" || !validation.inRegola) {
      reason = "Approvata una pratica che andava respinta.";
      severity = "grave";
      fine = 20000;
      ruleId = validation.violations[0]?.ruleId;
    }
  } else if (action.kind === "respingi") {
    if (regV === "approva" && validation.inRegola) {
      reason = "Respinta una pratica in regola.";
      severity = "lieve";
      fine = 8000;
    }
  }

  if (!reason) return null;

  return {
    id: `cit_${day}_${caseDef.id}`,
    day,
    caseId: caseDef.id,
    reason,
    severity,
    fine,
    ruleId,
    visibleToPlayer: day <= 2 || severity === "grave",
  };
}
