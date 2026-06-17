"use client";

import { useState } from "react";
import type { DayDef } from "@/types";
import { RULES } from "@/data/rules";
import { playClick } from "@/lib/sfx";

export function Rulebook({ dayDef }: { dayDef: DayDef }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rds-panel">
      <button onClick={() => { playClick(); setOpen((v) => !v); }} className="w-full flex items-center justify-between px-2 py-1.5">
        <span className="rds-label text-[8px]">Regolamento · Giorno {dayDef.day}</span>
        <span className="font-pixel text-[7px] text-paper/60">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="rds-paper m-1.5 mt-0 p-2.5 max-h-64 overflow-auto thin-scroll">
          <div className="font-pixel text-[8px] uppercase tracking-wider text-stamp-red mb-1">Direttive</div>
          <ul className="font-read text-[13px] text-ink space-y-1 mb-2.5 list-disc list-inside leading-snug">
            {dayDef.directives.map((d, i) => (
              <li key={i} className={d.startsWith("NUOVO") ? "text-stamp-red" : ""}>{d}</li>
            ))}
          </ul>
          <div className="font-pixel text-[8px] uppercase tracking-wider text-stamp-red mb-1">Regole attive</div>
          <ul className="font-read text-[12px] text-ink/80 space-y-1 leading-snug">
            {dayDef.ruleIds.map((id) => (
              <li key={id}>— {RULES[id]?.text ?? id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
