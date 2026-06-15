"use client";

import type { CaseAction, CaseDef } from "@/types";

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
  if (kind === "trasmetti" || kind === "proteggi" || kind === "verifica") return "rds-btn--neon";
  if (kind === "distruggi" || kind === "incastra") return "rds-btn--respinto";
  if (kind === "segnala") return "rds-btn--ochre";
  return "";
}

export function ActionBar({
  caseDef,
  onAction,
  disabled,
}: {
  caseDef: CaseDef;
  onAction: (action: CaseAction) => void;
  disabled?: boolean;
}) {
  const stamps = caseDef.actions.filter((a) => a.needsStamp);
  const others = caseDef.actions.filter((a) => !a.needsStamp);

  return (
    <div className="rds-panel p-2">
      <div className="rds-label text-[8px] border-b-2 border-black/50 pb-1 mb-2">Quadro decisioni</div>

      {stamps.length > 0 && (
        <div className="tex-wood p-2 mb-2 flex flex-wrap gap-1.5 justify-center border-2 border-wood-lo">
          {stamps.map((a) => (
            <button
              key={a.id}
              disabled={disabled}
              onClick={() => onAction(a)}
              className="rds-stamp-tool w-[84px] px-1 py-1.5"
              title={a.hint}
            >
              <span
                className="block text-center font-pixel text-[10px] leading-tight"
                style={{ color: stampColor(a) }}
              >
                {a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label}
              </span>
              <span className="block text-center font-read text-[8px] uppercase text-paper/70 mt-0.5 leading-none">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-1.5">
          {others.map((a) => (
            <button
              key={a.id}
              disabled={disabled}
              onClick={() => onAction(a)}
              className={`rds-btn w-full text-left px-2 py-1.5 ${btnMod(a.kind)}`}
            >
              <span className="block text-[10px] leading-tight">{a.label}</span>
              {a.hint && (
                <span className="block font-read text-[11px] normal-case opacity-75 mt-0.5">{a.hint}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
