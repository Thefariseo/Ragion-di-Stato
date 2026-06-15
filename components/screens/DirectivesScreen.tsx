"use client";

import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { RULES } from "@/data/rules";
import { Stamp } from "@/components/ui/Stamp";
import { Emblem } from "@/components/desk/Emblem";
import { playStamp } from "@/lib/sfx";

export function DirectivesScreen() {
  const game = useGameStore((s) => s.game);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const dayDef = getDay(game.day);
  if (!dayDef) return null;

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="rds-paper p-6 relative animate-slideUp">
          <div className="absolute -top-3 right-6"><Stamp label="MINISTERO DELL'INTERNO" rotate={-3} /></div>

          <div className="flex items-center gap-2 border-b-2 border-ink/30 pb-1 mb-3">
            <Emblem size={20} color="#574848" />
            <span className="font-pixel uppercase text-stamp-red text-base">Circolare di servizio — Giorno {dayDef.day}</span>
          </div>

          <ol className="font-read text-[15px] text-ink space-y-2 list-decimal list-inside mb-4 leading-snug">
            {dayDef.directives.map((d, i) => (
              <li key={i} className={d.startsWith("NUOVO") ? "text-stamp-red" : ""}>{d}</li>
            ))}
          </ol>

          <div className="bg-black/[0.04] border-2 border-ink/20 p-3">
            <div className="font-pixel text-[7px] uppercase tracking-widest text-ink/60 mb-1">Regole di validazione in vigore</div>
            <ul className="font-read text-[12px] text-ink/80 space-y-1 leading-snug">
              {dayDef.ruleIds.map((id) => (<li key={id}>— {RULES[id]?.text ?? id}</li>))}
            </ul>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <button onClick={() => goToPhase("briefing")} className="font-pixel text-[7px] uppercase tracking-wider text-ink/60 underline">« briefing</button>
            <button onClick={() => { playStamp(); goToPhase("desk"); }} className="rds-btn rds-btn--respinto px-5 py-2 text-[11px]">Apri lo sportello »</button>
          </div>
        </div>
      </div>
    </div>
  );
}
