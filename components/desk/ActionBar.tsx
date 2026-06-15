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
  if (a.kind === "approva" || l.includes("APPROV")) return "#4a6b43";
  if (a.kind === "respingi" || a.kind === "distruggi" || l.includes("RESPINT") || l.includes("NON ESIB"))
    return "#b03a2c";
  if (a.kind === "segnala" || l.includes("SEGNAL")) return "#9a6b30";
  return "#3a536e";
}

function btnMod(kind: string): string {
  if (kind === "trasmetti" || kind === "proteggi" || kind === "verifica") return "rds-btn--neon";
  if (kind === "distruggi" || kind === "incastra") return "rds-btn--rosso";
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
    <div className="rds-panel p-2.5">
      <div className="rds-label text-[9px] border-b border-black/40 pb-1 mb-2">
        Quadro decisioni
      </div>

      {/* portatimbri */}
      {stamps.length > 0 && (
        <div className="tex-wood rounded-sm p-2 mb-2 flex flex-wrap gap-2 justify-center border border-black/50">
          {stamps.map((a) => (
            <button
              key={a.id}
              disabled={disabled}
              onClick={() => onAction(a)}
              className="rds-stamp-tool w-[88px] px-1 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              title={a.hint}
            >
              <span
                className="rds-stamp-tool__cap block text-center text-[12px] leading-tight"
                style={{ color: stampColor(a) }}
              >
                {a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label}
              </span>
              <span className="block text-center font-pixel text-[6.5px] uppercase tracking-wider text-paper/60 mt-0.5 leading-none">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* azioni d'ufficio */}
      {others.length > 0 && (
        <div className="space-y-1.5">
          {others.map((a) => (
            <button
              key={a.id}
              disabled={disabled}
              onClick={() => onAction(a)}
              className={`rds-btn w-full text-left px-2.5 py-1.5 ${btnMod(a.kind)}`}
            >
              <span className="block text-[12px] leading-tight">{a.label}</span>
              {a.hint && (
                <span className="block font-type text-[10.5px] normal-case tracking-normal opacity-70 mt-0.5">
                  {a.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
