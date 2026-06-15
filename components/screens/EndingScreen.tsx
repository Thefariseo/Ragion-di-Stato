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

  const allies = CORE_FACTIONS.filter((id) => game.factions[id].reputation >= 20).map((id) => FACTIONS[id].name);
  const hostiles = CORE_FACTIONS.filter(
    (id) => game.factions[id].reputation <= -20 || game.factions[id].suspicion >= 50,
  ).map((id) => FACTIONS[id].name);

  return (
    <div className="h-full w-full tex-felt flex items-center justify-center p-6 overflow-auto thin-scroll relative">
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div className="max-w-2xl w-full my-6 relative">
        <div className="rds-paper p-8 relative animate-slideUp">
          <div className="absolute -top-3 -right-2">
            <Stamp label="ARCHIVIATO" rotate={7} />
          </div>

          <div className="text-center font-pixel text-[8px] uppercase tracking-[0.3em] text-ink-soft/50 mb-2">
            Esito della pratica
          </div>
          <h1 className="font-stencil uppercase tracking-wide text-4xl text-rosso text-center leading-none mb-5">
            {ending.title}
          </h1>

          <Typewriter lines={ending.epitaph} speed={22} className="font-type text-[16px] text-ink leading-relaxed mb-6" />

          <div className="border-t border-ink/20 pt-4 grid grid-cols-2 gap-3 font-type text-[12px] text-ink/80">
            <Stat label="Giorni in servizio" value={String(game.day)} />
            <Stat label="Sospetto finale" value={`${Math.round(game.player.sospetto)}/100`} />
            <Stat label="Verità pubblica" value={`${Math.round(game.country.verita)}/100`} />
            <Stat label="Seed della run" value={String(game.seed)} />
            <div className="col-span-2">
              <Lab>Chi ti era vicino</Lab>
              <div>{allies.length ? allies.join(", ") : "nessuno"}</div>
            </div>
            <div className="col-span-2">
              <Lab>Chi ti voleva fermo</Lab>
              <div>{hostiles.length ? hostiles.join(", ") : "nessuno"}</div>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { playStamp(); startNewGame(); }} className="rds-btn rds-btn--rosso px-6 py-3 text-sm">
              Nuova pratica »
            </button>
            <button onClick={() => backToTitle()} className="rds-btn px-6 py-3 text-sm">
              Torna al titolo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Lab>{label}</Lab>
      <div>{value}</div>
    </div>
  );
}
function Lab({ children }: { children: React.ReactNode }) {
  return <div className="font-pixel text-[7.5px] uppercase tracking-wider text-ink-soft/50">{children}</div>;
}
