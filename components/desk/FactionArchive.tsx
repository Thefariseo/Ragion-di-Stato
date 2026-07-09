"use client";

import { FACTIONS, ALL_FACTION_IDS } from "@/data/factions";
import { FactionEmblem } from "./FactionEmblem";
import { playDrawer } from "@/lib/sfx";
import { useEffect } from "react";

/** Schedario riservato delle fazioni: un archivio, non un menu. */
export function FactionArchive({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    playDrawer();
  }, []);

  return (
    <div className="absolute inset-0 z-50 tex-panel p-4 overflow-auto thin-scroll">
      <div className="flex items-center justify-between mb-3 border-b-2 border-black/50 pb-2">
        <div>
          <div className="font-pixel uppercase text-stamp-red text-base tracking-widest">Archivio riservato</div>
          <div className="font-read text-[11px] text-paper/60">Schedario fazioni — Ministero dell'Interno</div>
        </div>
        <button onClick={onClose} className="rds-btn px-3 py-1.5 text-[10px]">Chiudi »</button>
      </div>

      <div className="grid md:grid-cols-2 gap-2.5">
        {ALL_FACTION_IDS.map((id) => {
          const f = FACTIONS[id];
          return (
            <div key={id} className="rds-paper p-3">
              <div className="flex items-center gap-2 border-b border-ink/30 pb-1.5 mb-1.5">
                <FactionEmblem faction={id} size={26} />
                <div className="min-w-0 flex-1">
                  <div className="font-pixel uppercase text-[11px] text-ink leading-tight truncate">{f.name}</div>
                  <div className="font-read text-[10px] text-ink/60">
                    sigla {f.sigla} · {f.core ? "fazione attiva" : "scheda preliminare"}
                  </div>
                </div>
                <span className="inline-block w-3 h-3 border border-ink/50" style={{ backgroundColor: f.color }} />
              </div>
              <div className="font-read text-[11.5px] text-ink/85 leading-snug space-y-0.5">
                <p><span className="font-pixel text-[7px] uppercase text-ink/50">Ideologia</span> · {f.ideology}</p>
                <p><span className="font-pixel text-[7px] uppercase text-ink/50">Obiettivi</span> · {f.goals}</p>
                <p><span className="font-pixel text-[7px] uppercase text-ink/50">Metodi</span> · {f.methods}</p>
                <p><span className="font-pixel text-[7px] uppercase text-ink/50">Figure</span> · {f.keyFigures.join(", ")}</p>
              </div>
              <div className="mt-2 border-t border-ink/20 pt-1.5">
                <div className="font-pixel text-[7px] uppercase tracking-widest text-stamp-red mb-0.5">Segreto</div>
                <div className="relative">
                  <p className="font-read text-[11px] text-ink/80 leading-snug">{f.secret}</p>
                  <div className="absolute inset-0 bg-ink-dark/85 flex items-center justify-center">
                    <span className="font-pixel text-[8px] uppercase tracking-widest text-stamp-redhi">— omissis —</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
