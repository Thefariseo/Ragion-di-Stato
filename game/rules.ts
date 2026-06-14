import { getRules } from "@/data/rules";
import type { CaseDef, RuleContext, ValidationResult } from "@/types";

/**
 * Valuta un caso contro le regole attive della giornata.
 * Usato dalla UI (lente/Confronto, feedback) e dal log delle decisioni.
 * Le conseguenze restano autoriali: questo non applica penalità da solo.
 */
export function validateCase(
  c: CaseDef,
  activeRuleIds: string[],
  ctx: RuleContext,
): ValidationResult {
  const rules = getRules(activeRuleIds);
  const violations = [];
  for (const r of rules) {
    const v = r.check(c, ctx);
    if (v) violations.push(v);
  }
  return { inRegola: violations.length === 0, violations };
}
