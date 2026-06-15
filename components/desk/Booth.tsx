"use client";

import type { CaseDef, DayDef, GameState } from "@/types";
import { FACTIONS } from "@/data/factions";
import { formatClock } from "@/lib/format";
import { ApplicantPortrait, portraitSeed } from "./ApplicantPortrait";
import { Typewriter } from "@/components/ui/Typewriter";

function QueueSilhouettes() {
  const figs = Array.from({ length: 9 });
  return (
    <svg
      className="absolute top-1 left-2 right-2 h-10 w-[96%] opacity-25 pointer-events-none"
      viewBox="0 0 360 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      {figs.map((_, i) => {
        const x = 6 + i * 30 + ((i * 7) % 5);
        const h = 26 + ((i * 13) % 8);
        return (
          <g key={i} fill="#0c0f0b">
            <rect x={x} y={40 - h} width="12" height={h} rx="4" />
            <circle cx={x + 6} cy={40 - h - 3} r="5" />
          </g>
        );
      })}
    </svg>
  );
}

export function Booth({
  game,
  dayDef,
  caseDef,
}: {
  game: GameState;
  dayDef: DayDef;
  caseDef?: CaseDef;
}) {
  const sospetto = game.player.sospetto;
  const fac = caseDef?.faction ? FACTIONS[caseDef.faction] : undefined;
  const sgColor = sospetto >= 70 ? "#8e2c22" : sospetto >= 40 ? "#9a6b30" : "#4a6b43";

  return (
    <div className="rds-booth shrink-0 h-[38%] min-h-[210px] relative">
      <QueueSilhouettes />
      <div className="rds-lamp" />

      <div className="h-full flex gap-3 p-3 relative z-[2]">
        {/* SPORTELLO — il richiedente */}
        <div className="rds-window tex-glass w-[268px] shrink-0 flex flex-col items-center justify-end relative overflow-hidden">
          <div className="absolute top-1 left-0 right-0 text-center rds-label text-[8px]">
            Sportello 7 · Ammissione Pratiche
          </div>
          {caseDef ? (
            <div className="flex flex-col items-center pb-2">
              <ApplicantPortrait seed={portraitSeed(caseDef.id)} />
              <div className="rds-nameplate mt-1 px-3 py-1 text-center min-w-[200px]">
                <div className="font-stencil uppercase tracking-wide text-[13px] leading-none">
                  {caseDef.subject}
                </div>
                <div className="font-pixel text-[7px] uppercase tracking-wider text-paper/70 mt-1">
                  {fac ? `${fac.name} · ${fac.sigla}` : "pratica in entrata"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="font-stencil uppercase tracking-[0.3em] text-paper/40 text-sm rotate-[-4deg] border-2 border-paper/30 px-3 py-1">
                Sportello chiuso
              </div>
            </div>
          )}
        </div>

        {/* VOCE — ciò che dice / contesto */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="rds-panel px-3 py-1.5">
            <div className="rds-label text-[8px] mb-0.5">Manifesto · {dayDef.date}</div>
            <div className="font-stencil uppercase text-[15px] leading-tight text-paper-hi">
              {dayDef.headline}
            </div>
          </div>
          {caseDef?.intro && (
            <div className="rds-paper flex-1 min-h-0 p-3 overflow-auto thin-scroll">
              <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/60 mb-1">
                Voce
              </div>
              <Typewriter
                key={caseDef.id}
                lines={caseDef.intro}
                speed={16}
                className="font-type text-[14px] text-ink"
              />
            </div>
          )}
        </div>

        {/* STRUMENTI — orologio, quota, sorveglianza */}
        <div className="w-[206px] shrink-0 flex flex-col gap-2">
          <div className="rds-lcd px-3 py-1 flex items-baseline justify-between">
            <span className="text-3xl leading-none neon">{formatClock(game.clock)}</span>
            <span className="text-[11px]">G{game.day}</span>
          </div>
          <div className="rds-panel px-3 py-1.5">
            <div className="rds-label text-[8px] flex justify-between">
              <span>Pratiche</span>
              <span>
                {game.currentCaseIndex}/{game.queue.length}
              </span>
            </div>
            <div className="font-type text-[11px] text-paper/70">quota minima: {dayDef.quota}</div>
          </div>
          <div className="rds-panel px-3 py-2">
            <div className="rds-label text-[8px] flex justify-between mb-1">
              <span>Sorveglianza interna</span>
              <span style={{ color: sgColor }}>{Math.round(sospetto)}</span>
            </div>
            <div className="rds-gauge h-2.5">
              <div
                className="rds-gauge__fill"
                style={{ width: `${sospetto}%`, backgroundColor: sgColor }}
              />
            </div>
            <div className="font-pixel text-[7px] uppercase tracking-wider text-paper/40 mt-1">
              Affari Interni
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
