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

  // toggle debug con il tasto ` (backtick)
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

  // evita mismatch di idratazione: render solo dopo la reidratazione del save
  if (!hydrated) {
    return (
      <div className="crt scrivania h-screen w-screen flex items-center justify-center">
        <div className="font-stencil uppercase tracking-[0.4em] text-carta/40 animate-flickr">
          Archivio Centrale…
        </div>
      </div>
    );
  }

  return (
    <div className="crt h-screen w-screen overflow-hidden">
      {phase === "title" && <TitleScreen />}
      {phase === "briefing" && <BriefingScreen />}
      {phase === "directives" && <DirectivesScreen />}
      {(phase === "desk" || phase === "event") && (
        <DeskScreen onToggleDebug={() => setDebugOpen((v) => !v)} />
      )}
      {phase === "daySummary" && <DaySummaryScreen />}
      {phase === "ending" && <EndingScreen />}

      <DebugPanel open={debugOpen} onClose={() => setDebugOpen(false)} />
    </div>
  );
}
