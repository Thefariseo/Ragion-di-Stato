"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { randomSeed } from "@/lib/rng";
import { Stamp } from "@/components/ui/Stamp";
import { Emblem } from "@/components/desk/Emblem";
import { FactionArchive } from "@/components/desk/FactionArchive";
import { playStamp } from "@/lib/sfx";

export function TitleScreen() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [seed, setSeed] = useState<string>(() => String(randomSeed()));
  const [archive, setArchive] = useState(false);

  function start() {
    playStamp();
    const n = Number(seed);
    startNewGame(Number.isFinite(n) && seed.trim() !== "" ? n : undefined);
  }

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-6 relative">
      <div className="max-w-xl w-full">
        <div className="rds-paper p-6 relative animate-slideUp">
          <div className="absolute -top-3 -right-2"><Stamp label="RISERVATO" rotate={7} /></div>
          <div className="absolute -top-3 left-7 h-5 w-24 bg-paper-edge border-2 border-paper-edge" />

          <div className="flex items-center justify-center mb-1"><Emblem size={30} color="#701b1b" /></div>
          <div className="text-center font-pixel uppercase tracking-[0.05em] text-stamp-red text-4xl md:text-5xl leading-[1.05]">
            Ragion<br />di Stato
          </div>
          <div className="text-center font-pixel text-[8px] uppercase tracking-[0.18em] text-ink/70 mt-3">
            Ufficio Validazione · Archivio Centrale
          </div>

          <div className="my-5 border-y-2 border-ink/20 py-4">
            <p className="font-read text-ink text-[15px] leading-relaxed text-center">
              «Sei un burocrate in un sistema opaco. Ogni giorno decidi quale
              verità entra negli archivi dello Stato, quale viene nascosta, quale
              manipolata e quale distrutta.»
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 justify-center">
            <label className="font-pixel text-[7px] uppercase tracking-wider text-ink/70">
              Seed pratica
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ""))}
                className="block mt-1 w-40 bg-black/5 border-b-2 border-ink/40 px-2 py-1 font-term text-[16px] text-ink focus:outline-none focus:border-stamp-red"
              />
            </label>
            <button onClick={() => setSeed(String(randomSeed()))} className="rds-btn px-3 py-2 text-[9px]">↻ Seed</button>
            <button onClick={start} className="rds-btn rds-btn--respinto px-5 py-3 text-[11px]">Prendi servizio »</button>
          </div>

          <div className="mt-4 flex justify-center">
            <button onClick={() => setArchive(true)} className="font-pixel text-[8px] uppercase tracking-widest text-ink/60 underline hover:text-stamp-red">
              ▸ Archivio riservato — le fazioni
            </button>
          </div>

          <div className="mt-3 text-center font-pixel text-[6px] uppercase tracking-wider text-ink/50 leading-relaxed">
            Liberamente ispirato a Papers, Please.<br />Partiti, sigle e persone sono finzione.
          </div>
        </div>
      </div>

      {archive && <FactionArchive onClose={() => setArchive(false)} />}
    </div>
  );
}
