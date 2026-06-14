"use client";

import { useGameStore } from "@/store/gameStore";
import { getEnding } from "@/data/endings";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import { Typewriter } from "@/components/ui/Typewriter";
import { Stamp } from "@/components/ui/Stamp";
import { playStamp } from "@/lib/sfx";

export function EndingScreen() {
  const game = useGameStore((s) => s.game);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const backToTitle = useGameStore((s) => s.backToTitle);

  const ending = game.endingId ? getEnding(game.endingId) : undefined;
  if (!ending) return null;

  const allies = CORE_FACTIONS.filter((id) => game.factions[id].reputation >= 20).map(
    (id) => FACTIONS[id].name,
  );
  const hostiles = CORE_FACTIONS.filter(
    (id) => game.factions[id].reputation <= -20 || game.factions[id].suspicion >= 50,
  ).map((id) => FACTIONS[id].name);

  return (
    <div className="scrivania h-full w-full flex items-center justify-center p-6 overflow-auto thin-scroll">
      <div className="max-w-2xl w-full my-6">
        <div className="paper paper-edge p-8 relative animate-slideIn">
          <div className="absolute -top-3 -right-2">
            <Stamp label="ARCHIVIATO" rotate={7} />
          </div>

          <div className="text-center mb-2 text-[11px] uppercase tracking-[0.3em] text-inchiostro/50">
            Esito della pratica
          </div>
          <h1 className="font-stencil uppercase tracking-wide text-4xl text-rossomin text-center leading-none mb-5">
            {ending.title}
          </h1>

          <Typewriter
            lines={ending.epitaph}
            speed={22}
            className="font-doc text-[17px] text-inchiostro leading-relaxed mb-6"
          />

          <div className="border-t border-black/20 pt-4 grid grid-cols-2 gap-3 font-typewriter text-[12px] text-inchiostro/80">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Giorni in servizio
              </div>
              <div>{game.day}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Sospetto finale
              </div>
              <div>{Math.round(game.player.sospetto)}/100</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Verità pubblica
              </div>
              <div>{Math.round(game.country.verita)}/100</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Seed della run
              </div>
              <div>{game.seed}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Chi ti era vicino
              </div>
              <div>{allies.length ? allies.join(", ") : "nessuno"}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/50">
                Chi ti voleva fermo
              </div>
              <div>{hostiles.length ? hostiles.join(", ") : "nessuno"}</div>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                playStamp();
                startNewGame();
              }}
              className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-6 py-3 hover:bg-rossomin transition-colors"
            >
              Nuova pratica »
            </button>
            <button
              onClick={() => backToTitle()}
              className="font-stencil uppercase tracking-widest text-sm border border-inchiostro/40 text-inchiostro px-6 py-3 hover:bg-black/10"
            >
              Torna al titolo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
