"use client";

import type { CaseDef, DayDef, GameState } from "@/types";
import { FACTIONS } from "@/data/factions";
import { formatClock } from "@/lib/format";
import { portraitSeed } from "./ApplicantPortrait";
import { NpcSprite } from "./NpcSprite";
import { WorldScene } from "./WorldScene";
import { Typewriter } from "@/components/ui/Typewriter";

export function Booth({ game, dayDef, caseDef }: { game: GameState; dayDef: DayDef; caseDef?: CaseDef }) {
  const sospetto = game.player.sospetto;
  const caos = game.country.caos;
  const alarm = caos >= 68 || game.flags["attentato"] === true;
  const fac = caseDef?.faction ? FACTIONS[caseDef.faction] : undefined;
  const sg = sospetto >= 70 ? "#b42b2b" : sospetto >= 40 ? "#9a6b30" : "#53701b";

  return (
    <div className="relative shrink-0 h-[40%] min-h-[210px] overflow-hidden border-b-4 border-black tex-wall">
      <WorldScene suspicion={sospetto} caos={caos} alarm={alarm} />

      {/* manifesto a parete */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[3] rds-panel px-2.5 py-0.5 max-w-[46%]">
        <div className="font-pixel uppercase text-[9px] leading-tight text-paper-cream truncate">{dayDef.headline}</div>
      </div>

      {/* SPORTELLO — il richiedente */}
      <div className="absolute left-2 top-2 bottom-2 w-[228px] z-[3] border-4 border-env-0 bg-black/35 overflow-hidden flex flex-col items-center justify-end">
        <div className="absolute top-1 left-0 right-0 text-center rds-label text-[7px]">Sportello 7 · Ammissione</div>
        {caseDef ? (
          <div className="flex flex-col items-center">
            <NpcSprite key={caseDef.id} seed={portraitSeed(caseDef.id)} />
            <div className="rds-nameplate px-2 py-1 text-center w-full">
              <div className="font-pixel uppercase text-[9px] leading-tight">{caseDef.subject}</div>
              <div className="font-read text-[9px] uppercase tracking-wide text-paper/70">
                {fac ? `${fac.name} · ${fac.sigla}` : "pratica in entrata"}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="font-pixel uppercase tracking-[0.2em] text-paper/40 text-[10px] border-2 border-paper/30 px-2 py-1 rotate-[-4deg]">
              Sportello chiuso
            </div>
          </div>
        )}
      </div>

      {/* VOCE — fumetto del richiedente */}
      {caseDef?.intro && (
        <div className="absolute left-[238px] top-3 z-[3] max-w-[320px] rds-paper p-2">
          <div className="font-pixel text-[6px] uppercase tracking-wider text-ink/55 mb-0.5">Voce · sportello</div>
          <Typewriter key={caseDef.id} lines={caseDef.intro} speed={18} className="font-read text-[12px] text-ink leading-snug" />
        </div>
      )}

      {/* STRUMENTI */}
      <div className="absolute right-2 top-2 z-[3] w-[150px] flex flex-col gap-1.5">
        <div className="rds-lcd px-2 py-0.5 flex items-baseline justify-between">
          <span className="text-2xl leading-none neon">{formatClock(game.clock)}</span>
          <span className="text-[11px]">G{game.day}</span>
        </div>
        <div className="rds-panel px-2 py-1">
          <div className="rds-label text-[7px] flex justify-between">
            <span>Pratiche</span>
            <span>{game.currentCaseIndex}/{game.queue.length}</span>
          </div>
          <div className="font-read text-[10px] text-paper/70">quota {dayDef.quota}</div>
        </div>
        <div className="rds-panel px-2 py-1.5">
          <div className="rds-label text-[7px] flex justify-between mb-1">
            <span>Sorveglianza</span>
            <span style={{ color: sg }}>{Math.round(sospetto)}</span>
          </div>
          <div className="rds-gauge h-2.5">
            <div className="rds-gauge__fill" style={{ width: `${sospetto}%`, backgroundColor: sg }} />
          </div>
        </div>
        {alarm && (
          <div className="rds-panel px-2 py-1 border-stamp-red animate-blink">
            <div className="font-pixel text-[8px] uppercase tracking-widest text-stamp-redhi text-center">● Allarme</div>
          </div>
        )}
      </div>
    </div>
  );
}
