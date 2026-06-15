"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { TitleScreen } from "./screens/TitleScreen";
import { BriefingScreen } from "./screens/BriefingScreen";
import { DirectivesScreen } from "./screens/DirectivesScreen";
import { DeskScreen } from "./screens/DeskScreen";
import { DaySummaryScreen } from "./screens/DaySummaryScreen";
import { EndingScreen } from "./screens/EndingScreen";
import { DebugPanel } from "./debug/DebugPanel";

export default function Game() {
  const hydrated = useGameStore((s) => s.hydrated);
  const phase = useGameStore((s) => s.game.phase);
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`") {
        e.preventDefault();
        setDebugOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="rds-stage">
      {!hydrated ? (
        <div className="h-full w-full tex-wall flex items-center justify-center">
          <div className="font-pixel uppercase tracking-[0.3em] text-olive-hi animate-flicker text-sm">
            Archivio Centrale…
          </div>
        </div>
      ) : (
        <>
          {phase === "title" && <TitleScreen />}
          {phase === "briefing" && <BriefingScreen />}
          {phase === "directives" && <DirectivesScreen />}
          {(phase === "desk" || phase === "event") && <DeskScreen />}
          {phase === "daySummary" && <DaySummaryScreen />}
          {phase === "ending" && <EndingScreen />}
        </>
      )}

      <button
        onClick={() => setDebugOpen((v) => !v)}
        title="Debug (`)"
        className="fixed bottom-1 right-1 z-[65] font-pixel text-[7px] uppercase px-1.5 py-0.5 bg-black/70 text-olive-hi hover:text-neon border border-black"
      >
        DBG
      </button>

      <DebugPanel open={debugOpen} onClose={() => setDebugOpen(false)} />
    </div>
  );
}
