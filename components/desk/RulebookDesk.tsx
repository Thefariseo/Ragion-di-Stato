"use client";

import { useState } from "react";
import type { DayDef } from "@/types";
import { RULES } from "@/data/rules";
import { playPaper } from "@/lib/sfx";

/**
 * Il REGOLAMENTO è un libretto sul tavolo (come in Papers, Please), non un
 * pannello: chiuso mostra la copertina; aperto, le direttive del giorno e le
 * regole attive su carta.
 */
export function RulebookDesk({ dayDef }: { dayDef: DayDef }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* libretto chiuso, in basso a sinistra */}
      <button
        onClick={() => {
          playPaper();
          setOpen((v) => !v);
        }}
        className="absolute bottom-3 left-3 z-[24] group"
        title="Regolamento del giorno"
      >
        <div className="w-28 h-16 bg-[#3d4232] border-2 border-black shadow-[3px_4px_0_rgba(0,0,0,0.55)] relative group-hover:-translate-y-0.5 transition-transform">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#2a2e23]" />
          <div className="absolute left-1 top-1 bottom-1 w-1 bg-black/40" />
          <div className="h-full flex flex-col items-center justify-center gap-0.5 pl-1">
            <span className="font-pixel text-[8px] uppercase tracking-widest text-paper-cream/90">Regolamento</span>
            <span className="font-term text-[12px] text-olive-hi leading-none">Giorno {dayDef.day}</span>
          </div>
        </div>
      </button>

      {/* libretto aperto */}
      {open && (
        <div className="absolute inset-0 z-[32] flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="rds-paper w-[560px] max-h-[86%] overflow-auto thin-scroll p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-ink/30 pb-1.5 mb-2.5">
              <span className="font-pixel text-[10px] uppercase tracking-widest text-ink">Regolamento · Giorno {dayDef.day}</span>
              <button onClick={() => setOpen(false)} className="font-pixel text-[11px] text-ink/70 px-1 hover:text-stamp-red">✕ chiudi</button>
            </div>
            <div className="font-pixel text-[8px] uppercase tracking-wider text-stamp-red mb-1">Direttive</div>
            <ul className="font-read text-[14px] text-ink space-y-1.5 mb-3 list-disc list-inside leading-snug">
              {dayDef.directives.map((d, i) => (
                <li key={i} className={d.startsWith("NUOVO") ? "text-stamp-red" : ""}>{d}</li>
              ))}
            </ul>
            <div className="font-pixel text-[8px] uppercase tracking-wider text-stamp-red mb-1">Regole attive</div>
            <ul className="font-read text-[13px] text-ink/85 space-y-1 leading-snug">
              {dayDef.ruleIds.map((id) => (
                <li key={id}>— {RULES[id]?.text ?? id}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
