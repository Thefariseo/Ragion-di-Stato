"use client";

import { useState } from "react";
import type { DayDef } from "@/types";
import { RULES } from "@/data/rules";
import { playClick } from "@/lib/sfx";

export function Rulebook({ dayDef }: { dayDef: DayDef }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-carta/20">
      <button
        onClick={() => {
          playClick();
          setOpen((v) => !v);
        }}
        className="w-full flex items-center justify-between px-3 py-2 bg-black/40 hover:bg-black/60"
      >
        <span className="font-stencil uppercase tracking-widest text-carta/80 text-[11px]">
          Regolamento — Giorno {dayDef.day}
        </span>
        <span className="text-carta/60 text-xs">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="p-3 bg-black/20 max-h-64 overflow-auto thin-scroll">
          <div className="text-[10px] uppercase tracking-wider text-ocra mb-1">
            Direttive del giorno
          </div>
          <ul className="font-doc text-[14px] text-carta/90 space-y-1 mb-3 list-disc list-inside">
            {dayDef.directives.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div className="text-[10px] uppercase tracking-wider text-ocra mb-1">
            Regole di validazione attive
          </div>
          <ul className="font-typewriter text-[12px] text-carta/70 space-y-1">
            {dayDef.ruleIds.map((id) => (
              <li key={id}>— {RULES[id]?.text ?? id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
