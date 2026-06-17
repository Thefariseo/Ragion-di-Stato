"use client";

import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { buildNewspaper } from "@/game/newspaper";
import { Photo } from "@/components/desk/Photo";
import { playClick } from "@/lib/sfx";

export function NewspaperScreen() {
  const game = useGameStore((s) => s.game);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const dayDef = getDay(game.day);
  if (!dayDef) return null;
  const p = buildNewspaper(game, dayDef);

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-5 overflow-auto thin-scroll">
      <div className="max-w-3xl w-full my-3">
        <div className="rds-paper p-5 animate-slideUp">
          {/* testata */}
          <div className="flex items-end justify-between border-b-4 border-double border-ink/60 pb-1">
            <span className="font-pixel uppercase tracking-[0.1em] text-ink text-3xl leading-none">{p.masthead}</span>
            <span className="font-read text-[10px] text-ink/60 mb-0.5">{p.date} · L. 150 · Anno XXVI</span>
          </div>
          <div className="flex justify-between font-read text-[8px] uppercase tracking-widest text-ink/50 border-b border-ink/30 py-0.5 mb-2">
            <span>Quotidiano della Capitale</span>
            <span>Edizione del mattino</span>
            <span>«Per un'Italia che lavora»</span>
          </div>

          <div className="grid grid-cols-[1.6fr_1fr] gap-4">
            {/* colonna principale */}
            <div>
              <div className="font-pixel uppercase text-[21px] leading-[1.05] text-ink mb-2">{p.lead}</div>
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="border-2 border-ink/40 p-0.5 bg-black/10">
                    <Photo seed={p.photoSeed} width={84} />
                  </div>
                  <div className="font-read text-[8px] text-ink/50 text-center mt-0.5 italic">[foto d'archivio]</div>
                </div>
                <p className="font-read text-[13px] text-ink/85 leading-snug">{p.leadBody}</p>
              </div>

              <div className="columns-2 gap-3 mt-3 [column-rule:1px_solid_rgba(20,17,13,0.2)]">
                {p.items.map((it, i) => (
                  <div key={i} className="break-inside-avoid mb-2.5 border-t border-ink/20 pt-1.5">
                    <div className="font-pixel uppercase text-[10px] text-ink leading-tight mb-0.5">{it.headline}</div>
                    {it.body && <p className="font-read text-[12px] text-ink/75 leading-snug">{it.body}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* colonna laterale */}
            <div className="border-l-2 border-ink/30 pl-3">
              <div className="bg-ink/[0.06] border-2 border-ink/20 p-2 mb-3">
                <div className="font-pixel uppercase text-[8px] tracking-widest text-stamp-red mb-1">{p.sidebar.title}</div>
                <p className="font-read text-[13px] text-ink/85 leading-snug italic">{p.sidebar.body}</p>
              </div>
              <div className="space-y-1.5 font-read text-[12px] text-ink/70 leading-snug">
                <div className="font-pixel uppercase text-[8px] tracking-widest text-ink/50">In breve</div>
                <p>— Listini: la lira ancora debole sul marco.</p>
                <p>— Meteo: nebbia in pianura, freddo sulle valli.</p>
                <p>— Necrologi: si è spento in tarda età l'avv. R. Persichetti.</p>
                <p>— Cinema: tutto esaurito per la prima al Supercinema.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end border-t border-ink/30 pt-2">
            <button onClick={() => { playClick(); goToPhase("briefing"); }} className="rds-btn px-5 py-2 text-[12px]">
              Prendi servizio »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
