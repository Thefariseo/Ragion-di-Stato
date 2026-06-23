import type {
  ActionRequirement,
  CaseAction,
  CaseDef,
  ValidationResult,
} from "@/types";

/**
 * ActionEngine — decide QUALI azioni sono disponibili su un caso e perché.
 * Un'azione compare solo se GIUSTIFICATA da documenti, prove, regole o contesto.
 * Questo rende il gameplay sistematico: prima osservi/analizzi/confronti, poi le
 * azioni coerenti si sbloccano. Le azioni senza `requires` restano sempre attive.
 */

/** ciò che il giocatore ha scoperto sul caso (lente, confronti). */
export interface CaseAnalysis {
  /** ha aperto la lente di confronto almeno una volta */
  inspected: boolean;
  /** numero di contraddizioni trovate */
  discrepanciesFound: number;
}

export interface ActionContext {
  caseDef: CaseDef;
  validation: ValidationResult;
  analysis: CaseAnalysis;
  flags: Record<string, boolean>;
  day: number;
}

export interface ActionAvailability {
  available: boolean;
  /** motivo del blocco, mostrato in UI (insegna il loop sistematico) */
  reason?: string;
}

const REASON: Record<keyof ActionRequirement, string> = {
  inspected: "Usa prima la lente di confronto.",
  discrepancyFound: "Serve una contraddizione rilevata.",
  ruleViolation: "Serve un'irregolarità nei documenti.",
  noViolation: "La pratica deve essere in regola.",
  authLevel: "Serve un atto riservato in pratica.",
  hasDocKind: "Manca il documento richiesto.",
  flag: "Non ancora: manca un presupposto.",
  notFlag: "Non più disponibile.",
  fromDay: "Non previsto da questo ufficio. Per ora.",
};

function hasAuthLevel(c: CaseDef, level: string): boolean {
  return c.documents.some((d) => d.authLevel === level);
}

export function actionAvailability(action: CaseAction, ctx: ActionContext): ActionAvailability {
  const r = action.requires;
  if (!r) return { available: true };

  const fail = (k: keyof ActionRequirement): ActionAvailability => ({
    available: false,
    reason: action.lockHint ?? REASON[k],
  });

  if (r.inspected && !ctx.analysis.inspected) return fail("inspected");
  if (r.discrepancyFound && ctx.analysis.discrepanciesFound <= 0) return fail("discrepancyFound");
  if (r.ruleViolation && ctx.validation.inRegola) return fail("ruleViolation");
  if (r.noViolation && !ctx.validation.inRegola) return fail("noViolation");
  if (r.authLevel && !hasAuthLevel(ctx.caseDef, r.authLevel)) return fail("authLevel");
  if (r.hasDocKind && !ctx.caseDef.documents.some((d) => d.kind === r.hasDocKind)) return fail("hasDocKind");
  if (r.flag && !ctx.flags[r.flag]) return fail("flag");
  if (r.notFlag && ctx.flags[r.notFlag]) return fail("notFlag");
  if (typeof r.fromDay === "number" && ctx.day < r.fromDay) return fail("fromDay");

  return { available: true };
}

/** Le azioni disponibili (giustificate) su un caso, nell'ordine dichiarato. */
export function availableActions(actions: CaseAction[], ctx: ActionContext): CaseAction[] {
  return actions.filter((a) => actionAvailability(a, ctx).available);
}
