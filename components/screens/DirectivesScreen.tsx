"use client";

import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { RULES } from "@/data/rules";
import { Stamp } from "@/components/ui/Stamp";
import { playStamp } from "@/lib/sfx";

export function DirectivesScreen() {
  const game = useGameStore((s) => s.game);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const dayDef = getDay(game.day);
  if (!dayDef) return null;

  return (
    <div className="scrivania h-full w-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="paper paper-edge p-6 relative animate-slideIn">
          <div className="absolute -top-3 right-6">
            <Stamp label="MINISTERO DELL'INTERNO" rotate={-3} />
          </div>

          <div className="font-stencil uppercase tracking-widest text-rossomin text-lg border-b border-black/30 pb-1 mb-3">
            Circolare di servizio — Giorno {dayDef.day}
          </div>

          <ol className="font-doc text-[16px] text-inchiostro space-y-2 list-decimal list-inside mb-4">
            {dayDef.directives.map((d, i) => (
              <li
                key={i}
                className={d.startsWith("NUOVO") ? "text-rossomin font-semibold" : ""}
              >
                {d}
              </li>
            ))}
          </ol>

          <div className="bg-black/5 border border-black/20 p-3">
            <div className="text-[10px] uppercase tracking-widest text-inchiostro/60 mb-1">
              Regole di validazione in vigore
            </div>
            <ul className="font-typewriter text-[12px] text-inchiostro/80 space-y-1">
              {dayDef.ruleIds.map((id) => (
                <li key={id}>— {RULES[id]?.text ?? id}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <button
              onClick={() => goToPhase("briefing")}
              className="font-typewriter text-xs text-inchiostro/60 underline"
            >
              « torna al briefing
            </button>
            <button
              onClick={() => {
                playStamp();
                goToPhase("desk");
              }}
              className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-6 py-2 hover:bg-rossomin transition-colors"
            >
              Apri lo sportello »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
