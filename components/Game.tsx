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

const CORNERS = [
  "top-1.5 left-1.5",
  "top-1.5 right-1.5",
  "bottom-1.5 left-1.5",
  "bottom-1.5 right-1.5",
];

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
      <div className="rds-console">
        {CORNERS.map((c) => (
          <span key={c} className={`rds-bolt ${c}`} />
        ))}

        <div className="rds-screen">
          {!hydrated ? (
            <div className="h-full w-full tex-felt flex items-center justify-center">
              <div className="font-stencil uppercase tracking-[0.4em] text-paper/40 animate-flicker">
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
        </div>

        {/* interruttore debug (non diegetico) */}
        <button
          onClick={() => setDebugOpen((v) => !v)}
          title="Debug (`)"
          className="absolute -bottom-0.5 right-7 rds-label text-[7px] px-1.5 py-0.5 bg-black/60 hover:text-neon"
        >
          DBG
        </button>
      </div>

      <DebugPanel open={debugOpen} onClose={() => setDebugOpen(false)} />
    </div>
  );
}
