"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { randomSeed } from "@/lib/rng";
import { Stamp } from "@/components/ui/Stamp";
import { Emblem } from "@/components/desk/Emblem";
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
    <div className="h-full w-full tex-felt flex items-center justify-center p-6 relative">
      <div className="rds-lamp" />
      <div className="max-w-xl w-full">
        {/* cartellina */}
        <div className="rds-paper p-7 relative animate-slideUp">
          <div className="absolute -top-3 -right-2">
            <Stamp label="RISERVATO" rotate={7} />
          </div>
          <div className="absolute -top-3 left-8 h-6 w-24 bg-paper-lo border border-paper-edge rounded-t-md" />

          <div className="flex items-center justify-center gap-3 mb-1">
            <Emblem size={34} color="#7c241c" />
          </div>
          <div className="text-center font-stencil uppercase tracking-[0.18em] text-rosso text-5xl md:text-6xl leading-[0.95]">
            Ragion
            <br />
            di Stato
          </div>
          <div className="text-center font-pixel text-[9px] uppercase tracking-[0.2em] text-ink-soft/70 mt-3">
            Ufficio Validazione · Archivio Centrale
          </div>

          <div className="my-5 rds-rule border-b border-ink/20 py-4">
            <p className="font-type text-ink text-[16px] leading-relaxed text-center">
              «Sei un burocrate in un sistema opaco. Ogni giorno decidi quale
              verità entra negli archivi dello Stato, quale viene nascosta, quale
              manipolata e quale distrutta.»
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 justify-center">
            <label className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/70">
              Seed pratica
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ""))}
                className="block mt-1 w-44 bg-black/5 border-b-2 border-ink/40 px-2 py-1 font-type text-[15px] text-ink focus:outline-none focus:border-rosso"
              />
            </label>
            <button onClick={() => setSeed(String(randomSeed()))} className="rds-btn px-3 py-2 text-xs">
              ↻ Seed
            </button>
            <button onClick={start} className="rds-btn rds-btn--rosso px-6 py-3 text-sm">
              Prendi servizio »
            </button>
          </div>

          <div className="mt-6 text-center font-pixel text-[7px] uppercase tracking-wider text-ink-soft/50 leading-relaxed">
            Liberamente ispirato a Papers, Please.
            <br />
            Partiti, sigle, organizzazioni e persone sono finzione.
          </div>
        </div>
      </div>
    </div>
  );
}
