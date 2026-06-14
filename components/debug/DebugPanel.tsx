"use client";

import { useGameStore } from "@/store/gameStore";
import { ENDINGS } from "@/data/endings";
import { CORE_FACTIONS, FACTIONS } from "@/data/factions";
import { clamp } from "@/lib/format";
import type { FactionId, GamePhase } from "@/types";

export function DebugPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const game = useGameStore((s) => s.game);
  const debugPatch = useGameStore((s) => s.debugPatch);
  const debugAdvanceDay = useGameStore((s) => s.debugAdvanceDay);
  const goToPhase = useGameStore((s) => s.goToPhase);
  const startNewGame = useGameStore((s) => s.startNewGame);

  if (!open) return null;

  const setSospetto = (d: number) =>
    debugPatch({
      player: { ...game.player, sospetto: clamp(game.player.sospetto + d, 0, 100) },
    });
  const setVerita = (d: number) =>
    debugPatch({
      country: { ...game.country, verita: clamp(game.country.verita + d, 0, 100) },
    });
  const bumpFaction = (id: FactionId, d: number) =>
    debugPatch({
      factions: {
        ...game.factions,
        [id]: {
          ...game.factions[id],
          reputation: clamp(game.factions[id].reputation + d, -100, 100),
        },
      },
    });
  const forceEnding = (id: string) =>
    debugPatch({ endingId: id, phase: "ending" });

  const activeFlags = Object.keys(game.flags).filter((k) => game.flags[k]);

  return (
    <div className="fixed top-0 right-0 z-[70] w-[330px] h-full bg-black/92 border-l border-neon/40 text-carta p-3 overflow-auto thin-scroll font-typewriter text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-stencil uppercase tracking-widest text-neon">
          Debug
        </span>
        <button onClick={onClose} className="border border-carta/30 px-2">
          ✕
        </button>
      </div>

      <div className="text-carta/60 mb-2">
        Giorno {game.day} · fase {game.phase} · caso {game.currentCaseIndex}/
        {game.queue.length} · seed {game.seed}
      </div>

      <Section title="Fase">
        {(["briefing", "directives", "desk", "daySummary"] as GamePhase[]).map((p) => (
          <Btn key={p} onClick={() => goToPhase(p)}>
            {p}
          </Btn>
        ))}
        <Btn onClick={() => debugAdvanceDay()}>avanza giorno »</Btn>
        <Btn onClick={() => startNewGame()}>nuova run</Btn>
      </Section>

      <Section title={`Sospetto: ${Math.round(game.player.sospetto)}`}>
        <Btn onClick={() => setSospetto(-10)}>−10</Btn>
        <Btn onClick={() => setSospetto(10)}>+10</Btn>
        <Btn onClick={() => setSospetto(80 - game.player.sospetto)}>→ 80 (arresto)</Btn>
      </Section>

      <Section title={`Verità pubblica: ${Math.round(game.country.verita)}`}>
        <Btn onClick={() => setVerita(-10)}>−10</Btn>
        <Btn onClick={() => setVerita(10)}>+10</Btn>
      </Section>

      <Section title="Fazioni (reputazione)">
        {CORE_FACTIONS.map((id) => (
          <div key={id} className="flex items-center gap-1 mb-0.5">
            <span className="w-24 truncate">{FACTIONS[id].sigla}·{FACTIONS[id].name}</span>
            <span className="w-8 text-right">{game.factions[id].reputation}</span>
            <button onClick={() => bumpFaction(id, -10)} className="border border-carta/30 px-1">−</button>
            <button onClick={() => bumpFaction(id, 10)} className="border border-carta/30 px-1">+</button>
          </div>
        ))}
      </Section>

      <Section title="Forza finale">
        {ENDINGS.map((e) => (
          <Btn key={e.id} onClick={() => forceEnding(e.id)}>
            {e.title}
          </Btn>
        ))}
      </Section>

      <Section title={`Flag attivi (${activeFlags.length})`}>
        <div className="text-carta/60 leading-relaxed break-words">
          {activeFlags.length ? activeFlags.join(", ") : "—"}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 border-t border-carta/15 pt-2">
      <div className="text-neon/80 uppercase tracking-wider text-[10px] mb-1">
        {title}
      </div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="border border-carta/30 px-2 py-0.5 hover:bg-neon hover:text-inchiostro"
    >
      {children}
    </button>
  );
}
