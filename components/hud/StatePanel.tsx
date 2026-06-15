"use client";

import { useGameStore } from "@/store/gameStore";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import type { FactionId } from "@/types";

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="rds-label text-[7px] flex justify-between">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="rds-gauge h-1.5 mt-0.5">
        <div className="rds-gauge__fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function repColor(rep: number): string {
  if (rep >= 25) return "#86b42b";
  if (rep <= -25) return "#b42b2b";
  return "#9c7f4f";
}

export function StatePanel() {
  const game = useGameStore((s) => s.game);

  return (
    <div className="rds-panel p-2 space-y-2.5">
      <div>
        <div className="rds-label text-[8px] border-b-2 border-black/50 pb-1 mb-1.5">Scheda personale</div>
        <div className="space-y-1.5">
          <Gauge label="Famiglia" value={game.player.famiglia} color="#53701b" />
          <Gauge label="Lucidità" value={game.player.lucidita} color="#8fb9ad" />
        </div>
      </div>

      <div>
        <div className="rds-label text-[8px] border-b-2 border-black/50 pb-1 mb-1.5">Stato del Paese</div>
        <div className="space-y-1.5">
          <Gauge label="Repressione" value={game.country.repressione} color="#b42b2b" />
          <Gauge label="Caos" value={game.country.caos} color="#9a6b30" />
          <Gauge label="Verità pubblica" value={game.country.verita} color="#8fb9ad" />
          <Gauge label="Compromesso" value={game.country.compromesso} color="#9c7f4f" />
        </div>
      </div>

      <div>
        <div className="rds-label text-[8px] border-b-2 border-black/50 pb-1 mb-1.5">Fazioni</div>
        <div className="space-y-1">
          {CORE_FACTIONS.map((id: FactionId) => {
            const f = FACTIONS[id];
            const st = game.factions[id];
            return (
              <div key={id} className="flex items-center gap-1.5 text-[10px]">
                <span className="inline-block w-2 h-2 shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-paper/80 w-[88px] truncate font-read" title={f.name}>{f.name}</span>
                <div className="flex-1 h-1.5 bg-black/60 relative overflow-hidden">
                  <span className="absolute top-0 bottom-0 left-1/2 w-px bg-paper/30" />
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
                {st.suspicion >= 40 && <span className="text-stamp-redhi animate-blink">◉</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
