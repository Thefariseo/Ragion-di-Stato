"use client";

import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { Typewriter } from "@/components/ui/Typewriter";
import { playClick } from "@/lib/sfx";

export function BriefingScreen() {
  const game = useGameStore((s) => s.game);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const dayDef = getDay(game.day);
  if (!dayDef) return null;

  return (
    <div className="h-full w-full tex-felt flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* il quotidiano del mattino */}
        <div className="rds-paper p-6 animate-slideUp">
          <div className="flex items-baseline justify-between border-b-[3px] border-double border-ink/50 pb-1 mb-1">
            <span className="font-stencil uppercase tracking-[0.25em] text-ink text-xl">Il Mattino</span>
            <span className="font-pixel text-[8px] text-ink-soft/60">{dayDef.date} · Anno XXVI</span>
          </div>
          <div className="font-pixel text-[7px] uppercase tracking-widest text-ink-soft/50 mb-3">
            Edizione del mattino — una copia L. 150
          </div>

          <div className="font-stencil uppercase text-[26px] leading-[0.95] text-ink mb-4">
            {dayDef.headline}
          </div>

          <div className="rds-rule pt-3 bg-black/[0.04] border border-ink/15 p-4">
            <div className="font-pixel text-[8px] uppercase tracking-widest text-rosso mb-2">
              Comunicato interno
            </div>
            <Typewriter lines={dayDef.briefing} speed={16} className="font-type text-[15.5px] text-ink" />
          </div>

          <div className="mt-5 flex justify-end">
            <button onClick={() => { playClick(); goToPhase("directives"); }} className="rds-btn px-6 py-2 text-sm">
              Direttive del giorno »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
