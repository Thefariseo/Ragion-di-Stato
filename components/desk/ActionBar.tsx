"use client";

import type { CaseAction, CaseDef } from "@/types";

const KIND_STYLE: Record<string, string> = {
  approva: "border-verdemil-chiaro text-verdemil-chiaro hover:bg-verdemil-chiaro hover:text-inchiostro",
  respingi: "border-rossomin-chiaro text-rossomin-chiaro hover:bg-rossomin hover:text-carta",
  segnala: "border-ocra text-ocra hover:bg-ocra hover:text-inchiostro",
  archivia: "border-carta/40 text-carta/80 hover:bg-carta/20",
  trasmetti: "border-neon text-neon hover:bg-neon hover:text-inchiostro",
  occulta: "border-cemento text-carta/70 hover:bg-cemento",
  distruggi: "border-rossomin text-rossomin-chiaro hover:bg-rossomin hover:text-carta",
  proteggi: "border-neon text-neon hover:bg-neon hover:text-inchiostro",
  incastra: "border-rossomin text-rossomin-chiaro hover:bg-rossomin hover:text-carta",
  verifica: "border-carta/50 text-carta hover:bg-carta/20",
};

export function ActionBar({
  caseDef,
  onAction,
  disabled,
}: {
  caseDef: CaseDef;
  onAction: (action: CaseAction) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="font-stencil uppercase tracking-widest text-carta/60 text-[11px] border-b border-carta/20 pb-1">
        Decisione
      </div>
      {caseDef.actions.map((a) => (
        <button
          key={a.id}
          disabled={disabled}
          onClick={() => onAction(a)}
          className={`w-full text-left px-3 py-2 border bg-black/30 transition-colors disabled:opacity-40 ${
            KIND_STYLE[a.kind] ?? "border-carta/40 text-carta"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-stencil uppercase tracking-wide text-sm">
              {a.label}
            </span>
            {a.needsStamp && (
              <span className="text-[9px] uppercase opacity-60">timbro</span>
            )}
          </div>
          {a.hint && (
            <div className="text-[11px] font-doc opacity-70 mt-0.5 leading-tight">
              {a.hint}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
