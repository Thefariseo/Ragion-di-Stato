"use client";

import { useState } from "react";
import type { DayDef } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { formatClock, formatLire } from "@/lib/format";
import { isSfxEnabled, setSfxEnabled } from "@/lib/sfx";

export function StatusBar({
  dayDef,
  onToggleDebug,
}: {
  dayDef: DayDef;
  onToggleDebug: () => void;
}) {
  const game = useGameStore((s) => s.game);
  const [audio, setAudio] = useState(isSfxEnabled());

  const processedToday = game.currentCaseIndex;
  const total = game.queue.length;
  const sospetto = game.player.sospetto;

  return (
    <header className="feltro border-b border-black/60 px-4 py-2 flex items-center justify-between gap-4 shrink-0">
      <div className="min-w-0">
        <div className="font-stencil uppercase tracking-widest text-carta text-sm truncate">
          Ufficio Validazione · Archivio Centrale
        </div>
        <div className="text-carta/60 text-[11px] truncate">
          {dayDef.date} — Giorno {dayDef.day} · «{dayDef.headline}»
        </div>
      </div>

      <div className="text-center shrink-0">
        <div className="font-stencil neon text-carta text-2xl leading-none">
          {formatClock(game.clock)}
        </div>
        <div className="text-carta/60 text-[10px] uppercase tracking-wider">
          Pratiche {processedToday}/{total} · quota {dayDef.quota}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="text-carta/60 text-[10px] uppercase tracking-wider">
            Stipendio
          </div>
          <div className="font-typewriter text-carta text-sm">
            ₤ {formatLire(game.player.stipendio)}
          </div>
        </div>
        <div className="text-right w-28">
          <div className="text-carta/60 text-[10px] uppercase tracking-wider flex justify-between">
            <span>Sospetto</span>
            <span>{Math.round(sospetto)}</span>
          </div>
          <div className="h-2 bg-black/50 border border-black/60 mt-0.5">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${sospetto}%`,
                backgroundColor:
                  sospetto >= 70 ? "#7c241c" : sospetto >= 40 ? "#b07d3a" : "#55663f",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            const v = !audio;
            setAudio(v);
            setSfxEnabled(v);
          }}
          title="Audio"
          className="text-carta/70 hover:text-carta border border-carta/30 px-2 py-1 text-xs"
        >
          {audio ? "♪" : "—"}
        </button>
        <button
          onClick={onToggleDebug}
          title="Debug"
          className="text-carta/70 hover:text-carta border border-carta/30 px-2 py-1 text-xs"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
