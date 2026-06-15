"use client";

import type { CaseDef, DayDef, GameState } from "@/types";
import { FACTIONS } from "@/data/factions";
import { formatClock } from "@/lib/format";
import { portraitSeed } from "./ApplicantPortrait";
import { NpcSprite } from "./NpcSprite";
import { BoothScene } from "./BoothScene";
import { Typewriter } from "@/components/ui/Typewriter";

export function Booth({ game, dayDef, caseDef }: { game: GameState; dayDef: DayDef; caseDef?: CaseDef }) {
  const sospetto = game.player.sospetto;
  const fac = caseDef?.faction ? FACTIONS[caseDef.faction] : undefined;
  const sg = sospetto >= 70 ? "#b42b2b" : sospetto >= 40 ? "#9a6b30" : "#53701b";

  return (
    <div className="tex-wall relative shrink-0 h-[38%] min-h-[198px] overflow-hidden border-b-4 border-black">
      <BoothScene />
      {/* ambient: una sagoma attraversa il corridoio */}
      <div className="absolute top-7 left-2 z-[1] animate-walkby pointer-events-none">
        <div className="w-2.5 h-2.5 bg-[#0e0f0a] mx-auto" />
        <div className="w-3.5 h-9 bg-[#0e0f0a]" />
      </div>
      {/* ambient: il neon trema */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-1 bg-neon/70 animate-lampFlick z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 pointer-events-none" />

      <div className="h-full flex gap-2.5 p-2.5 relative z-[2]">
        {/* SPORTELLO */}
        <div className="w-[252px] shrink-0 border-4 border-env-0 bg-black/25 flex flex-col items-center justify-end relative overflow-hidden">
          <div className="absolute top-1 left-0 right-0 text-center rds-label text-[7px]">Sportello 7 · Ammissione</div>
          {caseDef ? (
            <div className="flex flex-col items-center">
              <NpcSprite key={caseDef.id} seed={portraitSeed(caseDef.id)} />
              <div className="rds-nameplate px-2 py-1 text-center min-w-[200px]">
                <div className="font-pixel uppercase text-[10px] leading-tight">{caseDef.subject}</div>
                <div className="font-read text-[10px] uppercase tracking-wide text-paper/70 mt-0.5">
                  {fac ? `${fac.name} · ${fac.sigla}` : "pratica in entrata"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="font-pixel uppercase tracking-[0.2em] text-paper/40 text-[11px] border-2 border-paper/30 px-2 py-1 rotate-[-4deg]">
                Sportello chiuso
              </div>
            </div>
          )}
        </div>

        {/* VOCE */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="rds-panel px-2.5 py-1.5">
            <div className="rds-label text-[7px] mb-0.5">Manifesto · {dayDef.date}</div>
            <div className="font-pixel uppercase text-[12px] leading-tight text-paper-cream">{dayDef.headline}</div>
          </div>
          {caseDef?.intro && (
            <div className="rds-paper flex-1 min-h-0 p-2.5 overflow-auto thin-scroll">
              <div className="font-pixel text-[7px] uppercase tracking-wider text-ink/60 mb-1">Voce</div>
              <Typewriter key={caseDef.id} lines={caseDef.intro} speed={16} className="font-read text-[14px] text-ink leading-snug" />
            </div>
          )}
        </div>

        {/* STRUMENTI */}
        <div className="w-[190px] shrink-0 flex flex-col gap-2">
          <div className="rds-lcd px-2.5 py-1 flex items-baseline justify-between">
            <span className="text-3xl leading-none neon">{formatClock(game.clock)}</span>
            <span className="text-[13px]">G{game.day}</span>
          </div>
          <div className="rds-panel px-2.5 py-1.5">
            <div className="rds-label text-[7px] flex justify-between">
              <span>Pratiche</span>
              <span>{game.currentCaseIndex}/{game.queue.length}</span>
            </div>
            <div className="font-read text-[11px] text-paper/70">quota minima {dayDef.quota}</div>
          </div>
          <div className="rds-panel px-2.5 py-2">
            <div className="rds-label text-[7px] flex justify-between mb-1">
              <span>Sorveglianza</span>
              <span style={{ color: sg }}>{Math.round(sospetto)}</span>
            </div>
            <div className="rds-gauge h-3">
              <div className="rds-gauge__fill" style={{ width: `${sospetto}%`, backgroundColor: sg }} />
            </div>
            <div className="font-pixel text-[6px] uppercase tracking-wider text-paper/40 mt-1">Affari Interni</div>
          </div>
        </div>
      </div>
    </div>
  );
}
