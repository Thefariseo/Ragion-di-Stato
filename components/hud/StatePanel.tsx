"use client";

import { useGameStore } from "@/store/gameStore";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import type { FactionId } from "@/types";

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="rds-label text-[7.5px] flex justify-between">
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
  if (rep >= 25) return "#4a6b43";
  if (rep <= -25) return "#8e2c22";
  return "#8a7a52";
}

export function StatePanel() {
  const game = useGameStore((s) => s.game);

  return (
    <div className="rds-panel p-2.5 space-y-3">
      <div>
        <div className="rds-label text-[9px] border-b border-black/40 pb-1 mb-1.5">Scheda personale</div>
        <div className="space-y-1.5">
          <Gauge label="Famiglia" value={game.player.famiglia} color="#4a6b43" />
          <Gauge label="Lucidità" value={game.player.lucidita} color="#8fb9ad" />
        </div>
      </div>

      <div>
        <div className="rds-label text-[9px] border-b border-black/40 pb-1 mb-1.5">Stato del Paese</div>
        <div className="space-y-1.5">
          <Gauge label="Repressione" value={game.country.repressione} color="#8e2c22" />
          <Gauge label="Caos" value={game.country.caos} color="#9a6b30" />
          <Gauge label="Verità pubblica" value={game.country.verita} color="#8fb9ad" />
          <Gauge label="Compromesso" value={game.country.compromesso} color="#8a7a52" />
        </div>
      </div>

      <div>
        <div className="rds-label text-[9px] border-b border-black/40 pb-1 mb-1.5">Fazioni</div>
        <div className="space-y-1">
          {CORE_FACTIONS.map((id: FactionId) => {
            const f = FACTIONS[id];
            const st = game.factions[id];
            return (
              <div key={id} className="flex items-center gap-1.5 text-[10px]">
                <span className="inline-block w-2 h-2 shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-paper/80 w-[92px] truncate font-type" title={f.name}>
                  {f.name}
                </span>
                <div className="flex-1 h-1.5 bg-black/50 relative overflow-hidden">
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
                {st.suspicion >= 40 && (
                  <span className="text-rosso-hi animate-blink" title="ti sospetta">
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
