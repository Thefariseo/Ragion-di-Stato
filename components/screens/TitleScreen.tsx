"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { randomSeed } from "@/lib/rng";
import { Stamp } from "@/components/ui/Stamp";
import { playStamp } from "@/lib/sfx";

export function TitleScreen() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [seed, setSeed] = useState<string>(() => String(randomSeed()));

  function start() {
    playStamp();
    const n = Number(seed);
    startNewGame(Number.isFinite(n) && seed.trim() !== "" ? n : undefined);
  }

  return (
    <div className="scrivania h-full w-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="paper paper-edge p-8 relative animate-slideIn">
          <div className="absolute -top-3 -right-2 rotate-6">
            <Stamp label="RISERVATO" rotate={6} />
          </div>

          <div className="text-center">
            <div className="font-stencil uppercase tracking-[0.2em] text-rossomin text-5xl md:text-6xl leading-none">
              Ragion
              <br />
              di Stato
            </div>
            <div className="mt-3 font-typewriter text-inchiostro/70 text-sm tracking-wide">
              Un thriller burocratico nell'Italia della Prima Repubblica
            </div>
          </div>

          <div className="my-6 border-t border-b border-black/20 py-4">
            <p className="font-doc text-inchiostro text-lg italic leading-relaxed text-center">
              «Sei un burocrate in un sistema opaco. Ogni giorno decidi quale
              verità entra negli archivi dello Stato, quale viene nascosta, quale
              manipolata e quale distrutta.»
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 justify-center">
            <label className="text-inchiostro/70 text-xs uppercase tracking-wider">
              Seed della pratica
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ""))}
                className="block mt-1 w-44 bg-black/5 border border-black/30 px-2 py-1 font-typewriter text-inchiostro focus:outline-none focus:border-rossomin"
              />
            </label>
            <button
              onClick={() => setSeed(String(randomSeed()))}
              className="font-stencil uppercase tracking-wider text-xs border border-black/40 px-3 py-2 text-inchiostro/80 hover:bg-black/10"
            >
              ↻ seed
            </button>
            <button
              onClick={start}
              className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-6 py-3 hover:bg-rossomin transition-colors"
            >
              Prendi servizio »
            </button>
          </div>

          <div className="mt-6 text-center text-inchiostro/50 text-[11px] font-typewriter">
            Liberamente ispirato a <em>Papers, Please</em>. Partiti, sigle,
            organizzazioni e persone sono finzione.
          </div>
        </div>
      </div>
    </div>
  );
}
