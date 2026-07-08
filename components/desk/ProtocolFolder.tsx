"use client";

import { useState } from "react";
import type { CaseAction } from "@/types";
import type { ActionItem } from "./ActionBar";
import { playPaper } from "@/lib/sfx";

function btnMod(kind: string): string {
  if (kind === "trasmetti" || kind === "proteggi" || kind === "verifica" || kind === "convoca") return "rds-btn--neon";
  if (kind === "distruggi" || kind === "incastra" || kind === "censura") return "rds-btn--respinto";
  if (kind === "segnala" || kind === "trattieni" || kind === "occulta") return "rds-btn--ochre";
  return "";
}

/**
 * La cartella «PROTOCOLLI SPECIALI» sul tavolo: le azioni fuori dal verdetto a
 * timbro (trasmetti, occulta, distruggi, verifica…) stanno DENTRO una cartella
 * di manila che si apre, non in un pannello web. Le azioni non giustificate
 * restano in vista, bloccate, col motivo: insegnano il loop.
 */
export function ProtocolFolder({
  items,
  title = "Azione speciale",
  disabled,
  onAction,
}: {
  items: ActionItem[];
  title?: string;
  disabled?: boolean;
  onAction: (a: CaseAction) => void;
}) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const availableCount = items.filter((i) => i.available).length;

  return (
    <>
      {/* la cartella chiusa, appoggiata sul bordo destro del tavolo */}
      <button
        onClick={() => {
          playPaper();
          setOpen((v) => !v);
        }}
        className="absolute bottom-3 right-3 z-[24] group"
        title="Protocolli speciali"
      >
        <div
          className="w-40 h-12 border-2 border-[#2c2417] shadow-[3px_4px_0_rgba(0,0,0,0.55)] relative group-hover:-translate-y-0.5 transition-transform"
          style={{ backgroundColor: "#9c8a5e", backgroundImage: "var(--noise)", backgroundSize: "140px 140px", backgroundBlendMode: "multiply" }}
        >
          <div className="absolute -top-2 left-3 w-14 h-2.5 bg-[#8a784e] border-2 border-[#2c2417]" />
          <div className="h-full flex flex-col items-center justify-center">
            <span className="font-pixel text-[8px] uppercase tracking-widest text-[#2c2417]">{title}</span>
            <span className="font-term text-[12px] text-[#4a3f2a] leading-none">{availableCount}/{items.length} disponibili</span>
          </div>
        </div>
      </button>

      {/* la cartella aperta */}
      {open && (
        <div className="absolute bottom-16 right-3 z-[30] w-[360px]">
          <div
            className="border-2 border-[#2c2417] shadow-[6px_8px_0_rgba(0,0,0,0.6)] p-3"
            style={{ backgroundColor: "#a7956a", backgroundImage: "var(--noise)", backgroundSize: "140px 140px", backgroundBlendMode: "multiply" }}
          >
            <div className="flex items-center justify-between mb-2 border-b-2 border-[#2c2417]/40 pb-1">
              <span className="font-pixel text-[9px] uppercase tracking-widest text-[#2c2417]">{title} · pratica corrente</span>
              <button onClick={() => setOpen(false)} className="font-pixel text-[10px] text-[#2c2417] px-1 hover:text-stamp-red">✕</button>
            </div>
            <div className="space-y-1.5">
              {items.map(({ action: a, available, reason }) =>
                available ? (
                  <button
                    key={a.id}
                    disabled={disabled}
                    onClick={() => {
                      setOpen(false);
                      onAction(a);
                    }}
                    className={`rds-btn w-full text-left px-2 py-1.5 ${btnMod(a.kind)}`}
                  >
                    <span className="block text-[12px] leading-tight">{a.label}</span>
                    {a.hint && <span className="block font-read text-[12px] normal-case opacity-75 mt-0.5">{a.hint}</span>}
                  </button>
                ) : (
                  <div
                    key={a.id}
                    className="w-full px-2 py-1.5 border-2 border-dashed border-[#2c2417]/50 bg-black/15 cursor-not-allowed"
                    title={reason}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="font-pixel text-[9px] text-[#2c2417]/60">▣</span>
                      <span className="font-pixel uppercase text-[11px] text-[#2c2417]/60 leading-tight">{a.label}</span>
                    </span>
                    {reason && <span className="block font-read text-[11px] text-[#6b3a1f] mt-0.5 leading-snug">{reason}</span>}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
