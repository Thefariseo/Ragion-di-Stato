"use client";

import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { buildNewspaper } from "@/game/newspaper";
import { Typewriter } from "@/components/ui/Typewriter";
import { playClick } from "@/lib/sfx";

export function NewspaperScreen() {
  const game = useGameStore((s) => s.game);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const dayDef = getDay(game.day);
  if (!dayDef) return null;
  const paper = buildNewspaper(game, dayDef);

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-6 overflow-auto thin-scroll">
      <div className="max-w-2xl w-full my-4">
        <div className="rds-paper p-6 animate-slideUp">
          <div className="flex items-baseline justify-between border-b-4 border-double border-ink/60 pb-1">
            <span className="font-pixel uppercase tracking-[0.12em] text-ink text-2xl">{paper.masthead}</span>
            <span className="font-read text-[10px] text-ink/60">{paper.date} · L. 150</span>
          </div>
          <div className="font-read text-[8px] uppercase tracking-widest text-ink/50 mb-3 mt-0.5">
            Quotidiano della Capitale — Anno XXVI
          </div>

          <div className="font-pixel uppercase text-[22px] leading-tight text-ink border-b-2 border-ink/30 pb-3 mb-3">
            {paper.lead}
          </div>

          {paper.items.length > 0 ? (
            <div className="columns-2 gap-4 [column-rule:1px_solid_rgba(20,17,13,0.2)]">
              {paper.items.map((it, i) => (
                <div key={i} className="break-inside-avoid mb-3">
                  <div className="font-pixel uppercase text-[11px] text-ink leading-tight mb-1">{it.headline}</div>
                  {it.body && <p className="font-read text-[12px] text-ink/80 leading-snug">{it.body}</p>}
                </div>
              ))}
            </div>
          ) : (
            <Typewriter
              lines={["In cronaca, nulla che il palazzo non abbia già approvato. Le pagine interne parlano di calcio e di processioni."]}
              speed={14}
              className="font-read text-[13px] text-ink/80"
            />
          )}

          <div className="mt-5 flex justify-end">
            <button onClick={() => { playClick(); goToPhase("briefing"); }} className="rds-btn px-5 py-2 text-[11px]">
              Prendi servizio »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
