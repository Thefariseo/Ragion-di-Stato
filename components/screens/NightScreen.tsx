"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { buildNightNeeds } from "@/game/night";
import { buildNpcViews } from "@/game/npc";
import { formatLire } from "@/lib/format";
import type { NightDecision } from "@/types";
import { playClick, playStamp } from "@/lib/sfx";

const TONE: Record<string, string> = {
  buono: "text-stamp-greenhi",
  cattivo: "text-stamp-redhi",
  neutro: "text-paper/70",
};

export function NightScreen() {
  const game = useGameStore((s) => s.game);
  const resolveNightChoices = useGameStore((s) => s.resolveNightChoices);

  const needs = useMemo(() => buildNightNeeds(game), [game]);
  const npcs = useMemo(() => buildNpcViews(game.flags), [game.flags]);
  const [decisions, setDecisions] = useState<Record<string, NightDecision>>({});

  const get = (id: string): NightDecision => decisions[id] ?? "paga";

  // costo cumulato dei "paga" che il giocatore può permettersi, in ordine
  let running = 0;
  const afford: Record<string, boolean> = {};
  for (const n of needs) {
    const ok = game.player.stipendio - running >= n.cost;
    afford[n.id] = ok;
    if (get(n.id) === "paga" && ok) running += n.cost;
  }
  const totalPaga = needs.filter((n) => get(n.id) === "paga" && afford[n.id]).reduce((s, n) => s + n.cost, 0);

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-6 relative overflow-auto thin-scroll">
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div className="max-w-3xl w-full my-4 relative grid md:grid-cols-[1.4fr_1fr] gap-3">
        {/* bilancio familiare */}
        <div className="rds-paper p-5 animate-slideUp">
          <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-3">
            LA NOTTE · GIORNO {game.day}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 font-read text-[12px]">
            <div className="bg-black/[0.05] border-2 border-ink/20 p-2">
              <div className="font-pixel text-[7px] uppercase text-ink/60">In cassa</div>
              <div className="font-term text-lg text-ink">₤ {formatLire(game.player.stipendio)}</div>
            </div>
            <div className="bg-black/[0.05] border-2 border-ink/20 p-2">
              <div className="font-pixel text-[7px] uppercase text-ink/60">Debiti</div>
              <div className="font-term text-lg text-stamp-red">₤ {formatLire(game.player.debiti)}</div>
            </div>
            <div className="bg-black/[0.05] border-2 border-ink/20 p-2">
              <div className="font-pixel text-[7px] uppercase text-ink/60">Famiglia</div>
              <div className="font-term text-lg text-ink">{Math.round(game.player.famiglia)}/100</div>
            </div>
          </div>

          <div className="space-y-2">
            {needs.map((n) => {
              const dec = get(n.id);
              const canPay = afford[n.id];
              return (
                <div key={n.id} className="border-2 border-ink/20 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-pixel uppercase text-[10px] text-ink leading-tight">{n.label}</div>
                      <div className="font-read text-[11px] text-ink/70 leading-snug">{n.desc}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-term text-[15px] text-ink">₤ {formatLire(n.cost)}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => { playClick(); setDecisions((d) => ({ ...d, [n.id]: "paga" })); }}
                      disabled={!canPay}
                      className={`rds-btn text-[9px] px-3 py-1 ${dec === "paga" && canPay ? "rds-btn--approvato" : ""}`}
                    >
                      Paga
                    </button>
                    <button
                      onClick={() => { playClick(); setDecisions((d) => ({ ...d, [n.id]: "salta" })); }}
                      className={`rds-btn text-[9px] px-3 py-1 ${dec === "salta" || !canPay ? "rds-btn--respinto" : ""}`}
                    >
                      Salta
                    </button>
                    {!canPay && <span className="font-read text-[10px] text-stamp-red self-center">non puoi permettertelo</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="font-read text-[12px] text-ink/80">
              Spesa: <span className="font-term">₤ {formatLire(totalPaga)}</span>
            </div>
            <button onClick={() => { playStamp(); resolveNightChoices(decisions); }} className="rds-btn rds-btn--respinto px-5 py-2 text-[11px]">
              Vai a dormire »
            </button>
          </div>
        </div>

        {/* rubrica NPC */}
        <div className="rds-panel p-3 animate-slideUp self-start">
          <div className="rds-label text-[9px] border-b-2 border-black/50 pb-1 mb-2">Rubrica</div>
          <div className="space-y-2">
            {npcs.map((n) => (
              <div key={n.id} className="border-b border-black/30 pb-1.5">
                <div className="font-pixel uppercase text-[9px] text-paper-cream leading-tight">{n.name}</div>
                <div className="font-read text-[10px] text-paper/60 leading-tight">{n.role}</div>
                <div className={`font-read text-[11px] leading-snug ${TONE[n.tone]}`}>{n.status}</div>
              </div>
            ))}
          </div>
          <div className="font-read text-[10px] text-paper/50 mt-2 italic">
            Domani altre carte, altre facce. La macchina gira.
          </div>
        </div>
      </div>
    </div>
  );
}
