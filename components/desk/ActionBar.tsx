"use client";

import type { CaseAction } from "@/types";

const DEFAULT_STAMP: Record<string, string> = {
  approva: "APPROVATO",
  respingi: "RESPINTO",
  segnala: "SEGNALATO",
  archivia: "ARCHIVIATO",
};

function stampColor(a: CaseAction): string {
  const l = (a.stampLabel ?? a.kind).toUpperCase();
  if (a.kind === "approva" || l.includes("APPROV")) return "#86b42b";
  if (a.kind === "respingi" || a.kind === "distruggi" || l.includes("RESPINT") || l.includes("NON ESIB"))
    return "#b42b2b";
  if (a.kind === "segnala" || l.includes("SEGNAL")) return "#ca9038";
  return "#9aa6c4";
}

function btnMod(kind: string): string {
  if (kind === "trasmetti" || kind === "proteggi" || kind === "verifica" || kind === "convoca") return "rds-btn--neon";
  if (kind === "distruggi" || kind === "incastra" || kind === "censura") return "rds-btn--respinto";
  if (kind === "segnala" || kind === "trattieni" || kind === "occulta") return "rds-btn--ochre";
  return "";
}

export interface ActionItem {
  action: CaseAction;
  available: boolean;
  reason?: string;
}

export function ActionBar({
  items,
  onAction,
  disabled,
}: {
  items: ActionItem[];
  onAction: (action: CaseAction) => void;
  disabled?: boolean;
}) {
  // i timbri (verdetto formale) restano in cima; le altre azioni sotto.
  const stampItems = items.filter((it) => it.action.needsStamp);
  const otherItems = items.filter((it) => !it.action.needsStamp);

  return (
    <div className="rds-panel p-2">
      <div className="rds-label text-[8px] border-b-2 border-black/50 pb-1 mb-2">Registro decisioni</div>

      {stampItems.length > 0 && (
        <div className="tex-wood p-2 mb-2 flex flex-wrap gap-1.5 justify-center border-2 border-wood-lo">
          {stampItems.map(({ action: a, available, reason }) => (
            <button
              key={a.id}
              disabled={disabled || !available}
              onClick={() => onAction(a)}
              className="rds-stamp-tool w-[84px] px-1 py-1.5 disabled:opacity-40"
              title={available ? a.hint : reason}
            >
              <span
                className="block text-center font-pixel text-[12px] leading-tight"
                style={{ color: available ? stampColor(a) : "#6b675c" }}
              >
                {a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label}
              </span>
              <span className="block text-center font-read text-[8px] uppercase text-paper/70 mt-0.5 leading-none">
                {available ? a.label : "bloccato"}
              </span>
            </button>
          ))}
        </div>
      )}

      {otherItems.length > 0 && (
        <div className="space-y-1.5">
          {otherItems.map(({ action: a, available, reason }) =>
            available ? (
              <button
                key={a.id}
                disabled={disabled}
                onClick={() => onAction(a)}
                className={`rds-btn w-full text-left px-2 py-1.5 ${btnMod(a.kind)}`}
              >
                <span className="block text-[12px] leading-tight">{a.label}</span>
                {a.hint && (
                  <span className="block font-read text-[12px] normal-case opacity-75 mt-0.5">{a.hint}</span>
                )}
              </button>
            ) : (
              // azione BLOCCATA: visibile ma non eseguibile, col motivo (insegna il loop)
              <div
                key={a.id}
                className="w-full text-left px-2 py-1.5 border-2 border-dashed border-black/40 bg-black/20 opacity-70 cursor-not-allowed"
                title={reason}
              >
                <span className="flex items-center gap-1.5">
                  <span className="font-pixel text-[9px] text-paper/40">▣</span>
                  <span className="font-pixel uppercase text-[11px] text-paper/45 leading-tight">{a.label}</span>
                </span>
                {reason && (
                  <span className="block font-read text-[11px] normal-case text-ochre/80 mt-0.5 leading-snug">
                    {reason}
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
