"use client";

import { useState } from "react";
import type { DayDef } from "@/types";
import { RULES } from "@/data/rules";
import { playClick } from "@/lib/sfx";

export function Rulebook({ dayDef }: { dayDef: DayDef }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rds-panel">
      <button
        onClick={() => {
          playClick();
          setOpen((v) => !v);
        }}
        className="w-full flex items-center justify-between px-2.5 py-1.5"
      >
        <span className="rds-label text-[9px]">Regolamento · Giorno {dayDef.day}</span>
        <span className="font-pixel text-[8px] text-paper/60">{open ? "▾ chiudi" : "▸ apri"}</span>
      </button>
      {open && (
        <div className="rds-paper m-1.5 mt-0 p-3 max-h-72 overflow-auto thin-scroll">
          <div className="font-pixel text-[8px] uppercase tracking-wider text-rosso mb-1">
            Direttive del giorno
          </div>
          <ul className="font-type text-[12.5px] text-ink space-y-1 mb-3 list-disc list-inside">
            {dayDef.directives.map((d, i) => (
              <li key={i} className={d.startsWith("NUOVO") ? "text-rosso" : ""}>
                {d}
              </li>
            ))}
          </ul>
          <div className="font-pixel text-[8px] uppercase tracking-wider text-rosso mb-1">
            Regole di validazione attive
          </div>
          <ul className="font-type text-[11.5px] text-ink/80 space-y-1">
            {dayDef.ruleIds.map((id) => (
              <li key={id}>— {RULES[id]?.text ?? id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
