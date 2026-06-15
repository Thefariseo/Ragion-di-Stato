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
    <div className="h-full w-full tex-felt flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="rds-paper p-6 relative animate-slideUp">
          <div className="absolute -top-3 right-6">
            <Stamp label="MINISTERO DELL'INTERNO" rotate={-3} />
          </div>

          <div className="flex items-center gap-2 border-b border-ink/30 pb-1 mb-3">
            <Emblem size={22} />
            <span className="font-stencil uppercase tracking-widest text-rosso text-lg">
              Circolare di servizio — Giorno {dayDef.day}
            </span>
          </div>

          <ol className="font-type text-[15.5px] text-ink space-y-2 list-decimal list-inside mb-4">
            {dayDef.directives.map((d, i) => (
              <li key={i} className={d.startsWith("NUOVO") ? "text-rosso font-bold" : ""}>
                {d}
              </li>
            ))}
          </ol>

          <div className="bg-black/[0.04] border border-ink/20 p-3">
            <div className="font-pixel text-[8px] uppercase tracking-widest text-ink-soft/60 mb-1">
              Regole di validazione in vigore
            </div>
            <ul className="font-type text-[12px] text-ink/80 space-y-1">
              {dayDef.ruleIds.map((id) => (
                <li key={id}>— {RULES[id]?.text ?? id}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <button onClick={() => goToPhase("briefing")} className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/60 underline">
              « briefing
            </button>
            <button onClick={() => { playStamp(); goToPhase("desk"); }} className="rds-btn rds-btn--rosso px-6 py-2 text-sm">
              Apri lo sportello »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
