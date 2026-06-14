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
    <div className="scrivania h-full w-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* "giornale" del mattino */}
        <div className="paper paper-edge p-6 animate-slideIn">
          <div className="flex items-baseline justify-between border-b-2 border-black/40 pb-1 mb-3">
            <span className="font-stencil uppercase tracking-widest text-inchiostro">
              Il Mattino
            </span>
            <span className="font-typewriter text-xs text-inchiostro/60">
              {dayDef.date}
            </span>
          </div>
          <div className="font-stencil uppercase text-2xl leading-tight text-inchiostro mb-4">
            {dayDef.headline}
          </div>

          <div className="bg-black/5 border border-black/20 p-4">
            <div className="text-[10px] uppercase tracking-widest text-rossomin mb-2">
              Comunicato interno
            </div>
            <Typewriter
              lines={dayDef.briefing}
              speed={16}
              className="font-doc text-[16px] text-inchiostro"
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => {
                playClick();
                goToPhase("directives");
              }}
              className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-6 py-2 hover:bg-rossomin transition-colors"
            >
              Direttive del giorno »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
