"use client";

import { useGameStore } from "@/store/gameStore";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import { MeterBar } from "@/components/ui/MeterBar";
import type { FactionId } from "@/types";

function repColor(rep: number): string {
  if (rep >= 25) return "#55663f";
  if (rep <= -25) return "#7c241c";
  return "#8a7a52";
}

export function StatePanel() {
  const game = useGameStore((s) => s.game);

  return (
    <div className="space-y-3">
      {/* vita privata */}
      <div>
        <div className="font-stencil uppercase tracking-widest text-carta/60 text-[11px] border-b border-carta/20 pb-1 mb-2">
          Vita privata
        </div>
        <div className="space-y-1.5">
          <MeterBar label="Famiglia" value={game.player.famiglia} color="#55663f" />
          <MeterBar label="Lucidità" value={game.player.lucidita} color="#9fd9c0" />
        </div>
      </div>

      {/* stato del Paese */}
      <div>
        <div className="font-stencil uppercase tracking-widest text-carta/60 text-[11px] border-b border-carta/20 pb-1 mb-2">
          Stato del Paese
        </div>
        <div className="space-y-1.5">
          <MeterBar label="Repressione" value={game.country.repressione} color="#7c241c" />
          <MeterBar label="Caos" value={game.country.caos} color="#b07d3a" />
          <MeterBar label="Verità pubblica" value={game.country.verita} color="#9fd9c0" />
          <MeterBar label="Compromesso" value={game.country.compromesso} color="#8a7a52" />
        </div>
      </div>

      {/* fazioni */}
      <div>
        <div className="font-stencil uppercase tracking-widest text-carta/60 text-[11px] border-b border-carta/20 pb-1 mb-2">
          Fazioni
        </div>
        <div className="space-y-1">
          {CORE_FACTIONS.map((id: FactionId) => {
            const f = FACTIONS[id];
            const st = game.factions[id];
            return (
              <div key={id} className="flex items-center gap-2 text-[11px]">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: f.color }}
                />
                <span className="text-carta/80 w-28 truncate" title={f.name}>
                  {f.name}
                </span>
                <div className="flex-1 h-1.5 bg-black/40 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: "50%",
                      width: `${Math.min(50, Math.abs(st.reputation) / 2)}%`,
                      transform: st.reputation < 0 ? "translateX(-100%)" : "none",
                      backgroundColor: repColor(st.reputation),
                    }}
                  />
                </div>
                {st.suspicion >= 40 && (
                  <span className="text-rossomin-chiaro" title="ti sospetta">
                    ◉
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
