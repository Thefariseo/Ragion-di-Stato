"use client";

import type { DayDef, GameState } from "@/types";
import { formatClock, formatLire } from "@/lib/format";

/**
 * Barra di stato sempre presente sul banco: il giocatore VEDE muoversi la posta
 * a ogni decisione — quota che si riempie, compenso che sale, orologio che
 * avanza, sorveglianza che cresce. Niente cruscotti profondi (quelli nel
 * resoconto): solo ciò che pesa nel turno, grande e leggibile.
 */
export function TopBar({ game, dayDef }: { game: GameState; dayDef: DayDef }) {
  const doneToday = game.processed.filter((p) => p.day === game.day).length;
  const quota = dayDef.quota;
  const earned = doneToday * dayDef.payPerCase;
  const sosp = Math.round(game.player.sospetto);
  const sospColor = sosp >= 70 ? "#b42b2b" : sosp >= 40 ? "#c9882f" : "#6c8f3a";
  const metQuota = doneToday >= quota;

  return (
    <div className="shrink-0 h-11 bg-env-0 border-b-4 border-black flex items-stretch text-paper-cream relative z-[5]">
      {/* sigla ufficio + giornata */}
      <div className="flex flex-col justify-center px-3 border-r-2 border-black/60">
        <span className="font-pixel text-[10px] tracking-widest text-olive-hi leading-none">U.V.A.C. · SPORTELLO 7</span>
        <span className="font-read text-[11px] uppercase tracking-wide text-paper/70 leading-tight">
          Giorno {game.day} · {dayDef.date}
        </span>
      </div>

      {/* QUOTA a pip — si riempie a ogni pratica */}
      <div className="flex flex-col justify-center px-3 border-r-2 border-black/60">
        <span className="font-pixel text-[8px] uppercase tracking-widest text-paper/55 leading-none mb-1">Pratiche · quota {quota}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.max(quota, doneToday) }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-3 h-3 border-2"
              style={{
                borderColor: "#000",
                backgroundColor: i < doneToday ? (i < quota ? "#6c8f3a" : "#c9882f") : "#15140f",
              }}
            />
          ))}
          <span className={`ml-1 font-term text-[15px] leading-none ${metQuota ? "text-stamp-greenhi" : "text-paper/80"}`}>
            {doneToday}/{quota}
          </span>
        </div>
      </div>

      {/* COMPENSO oggi — sale a ogni pratica (pop sul cambio) */}
      <div className="flex flex-col justify-center px-3 border-r-2 border-black/60">
        <span className="font-pixel text-[8px] uppercase tracking-widest text-paper/55 leading-none mb-0.5">Compenso oggi</span>
        <span key={earned} className="font-term text-[18px] leading-none text-tan-hi animate-hudPop">₤ {formatLire(earned)}</span>
      </div>

      {/* orologio LCD grande */}
      <div className="flex-1 flex items-center justify-center">
        <div className="rds-lcd px-4 py-1 flex items-baseline gap-2">
          <span key={game.clock} className="text-3xl leading-none neon animate-hudTick">{formatClock(game.clock)}</span>
        </div>
      </div>

      {/* SORVEGLIANZA — meter che cresce */}
      <div className="flex flex-col justify-center px-3 border-l-2 border-black/60 w-[180px]">
        <div className="flex justify-between font-pixel text-[8px] uppercase tracking-widest text-paper/55 leading-none mb-1">
          <span>Sorveglianza</span>
          <span style={{ color: sospColor }}>{sosp}</span>
        </div>
        <div className="h-3 bg-[#0a0a08] border-2 border-black overflow-hidden">
          <div className="h-full transition-[width] duration-500" style={{ width: `${sosp}%`, backgroundColor: sospColor }} />
        </div>
      </div>
    </div>
  );
}
