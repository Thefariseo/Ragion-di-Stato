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
    <div className="h-full w-full tex-wood flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="rds-paper p-6 animate-slideUp">
          <div className="flex items-baseline justify-between border-b-4 border-double border-ink/50 pb-1 mb-1">
            <span className="font-pixel uppercase tracking-[0.1em] text-ink text-lg">Il Mattino</span>
            <span className="font-read text-[10px] text-ink/60">{dayDef.date} · Anno XXVI</span>
          </div>
          <div className="font-read text-[8px] uppercase tracking-widest text-ink/50 mb-3">Edizione del mattino — una copia L. 150</div>

          <div className="font-pixel uppercase text-[20px] leading-tight text-ink mb-4">{dayDef.headline}</div>

          <div className="bg-black/[0.04] border-2 border-ink/15 p-3">
            <div className="font-pixel text-[7px] uppercase tracking-widest text-stamp-red mb-2">Comunicato interno</div>
            <Typewriter lines={dayDef.briefing} speed={16} className="font-read text-[15px] text-ink leading-snug" />
          </div>

          <div className="mt-5 flex justify-end">
            <button onClick={() => { playClick(); goToPhase("directives"); }} className="rds-btn px-5 py-2 text-[11px]">Direttive »</button>
          </div>
        </div>
      </div>
    </div>
  );
}
