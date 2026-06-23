import type {
  ActionKind,
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
  inspected: "Esamina prima la pratica con la lente.",
  discrepancyFound: "Serve una contraddizione rilevata.",
  evidence: "Serve una prova: una contraddizione o un'irregolarità.",
  ruleViolation: "Serve un'irregolarità nei documenti.",
  noViolation: "La pratica deve essere in regola.",
  authLevel: "Serve un atto riservato in pratica.",
  hasDocKind: "Manca il documento richiesto.",
  flag: "Non ancora: manca un presupposto.",
  notFlag: "Non più disponibile.",
  fromDay: "Non previsto da questo ufficio. Per ora.",
};

/**
 * POLITICA DI DEFAULT dell'ActionEngine: anche senza `requires` esplicito, certe
 * azioni non sono mai "gratis". Denunciare/incastrare richiede una PROVA;
 * trasmettere/occultare/distruggere/censurare/scagionare richiede di aver prima
 * ESAMINATO la pratica. Così TUTTI i casi sono sistematici, non solo quelli
 * annotati a mano. Un caso può forzare la disponibilità con `requires: {}`.
 */
export function defaultRequirement(kind: ActionKind): ActionRequirement {
  switch (kind) {
    case "segnala":
    case "incastra":
      return { evidence: true };
    case "trasmetti":
    case "occulta":
    case "distruggi":
    case "censura":
    case "proteggi":
      return { inspected: true };
    default:
      return {};
  }
}

function hasAuthLevel(c: CaseDef, level: string): boolean {
  return c.documents.some((d) => d.authLevel === level);
}

export function actionAvailability(action: CaseAction, ctx: ActionContext): ActionAvailability {
  // requisito esplicito del caso, altrimenti la politica di default per tipo
  const r = action.requires ?? defaultRequirement(action.kind);

  const fail = (k: keyof ActionRequirement): ActionAvailability => ({
    available: false,
    reason: action.lockHint ?? REASON[k],
  });

  const hasEvidence = ctx.analysis.discrepanciesFound > 0 || !ctx.validation.inRegola;
  if (r.inspected && !ctx.analysis.inspected) return fail("inspected");
  if (r.discrepancyFound && ctx.analysis.discrepanciesFound <= 0) return fail("discrepancyFound");
  if (r.evidence && !hasEvidence) return fail("evidence");
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
