"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { playMusic, setMusicEnabled, isMusicEnabled } from "@/lib/music";
import { setSfxEnabled, isSfxEnabled } from "@/lib/sfx";
import type { GamePhase } from "@/types";
import { GameViewport } from "./GameViewport";
import { TitleScreen } from "./screens/TitleScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { NewspaperScreen } from "./screens/NewspaperScreen";
import { BriefingScreen } from "./screens/BriefingScreen";
import { DirectivesScreen } from "./screens/DirectivesScreen";
import { DeskScreen } from "./screens/DeskScreen";
import { DaySummaryScreen } from "./screens/DaySummaryScreen";
import { NightScreen } from "./screens/NightScreen";
import { EndingScreen } from "./screens/EndingScreen";
import { DebugPanel } from "./debug/DebugPanel";

const THEME_FOR: Record<GamePhase, string> = {
  title: "solenne",
  intro: "solenne",
  newspaper: "lavoro",
  briefing: "lavoro",
  directives: "lavoro",
  desk: "lavoro",
  event: "tensione",
  daySummary: "lavoro",
  night: "lavoro",
  ending: "finale",
};

export default function Game() {
  const hydrated = useGameStore((s) => s.hydrated);
  const phase = useGameStore((s) => s.game.phase);
  const [debugOpen, setDebugOpen] = useState(false);
  const [audio, setAudio] = useState(true);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

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

  // colonna sonora legata alla fase
  useEffect(() => {
    if (audio) playMusic(THEME_FOR[phase] ?? "lavoro");
  }, [phase, audio]);

  // l'audio parte solo dopo il primo gesto utente (policy del browser)
  useEffect(() => {
    const kick = () => {
      if (audio) playMusic(THEME_FOR[phaseRef.current] ?? "lavoro");
    };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, [audio]);

  function toggleAudio() {
    const v = !audio;
    setAudio(v);
    setMusicEnabled(v);
    setSfxEnabled(v);
    if (v) playMusic(THEME_FOR[phaseRef.current] ?? "lavoro");
    void isMusicEnabled;
    void isSfxEnabled;
  }

  return (
    <>
      <GameViewport>
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
              {phase === "intro" && <IntroScreen />}
              {phase === "newspaper" && <NewspaperScreen />}
              {phase === "briefing" && <BriefingScreen />}
              {phase === "directives" && <DirectivesScreen />}
              {(phase === "desk" || phase === "event") && <DeskScreen />}
              {phase === "daySummary" && <DaySummaryScreen />}
              {phase === "night" && <NightScreen />}
              {phase === "ending" && <EndingScreen />}
            </>
          )}
        </div>
      </GameViewport>

      <button
        onClick={toggleAudio}
        title="Audio"
        className="fixed bottom-1 right-9 z-[80] font-pixel text-[8px] uppercase px-1.5 py-0.5 bg-black/70 text-olive-hi hover:text-neon border border-black"
      >
        {audio ? "♪" : "×"}
      </button>
      <button
        onClick={() => setDebugOpen((v) => !v)}
        title="Debug (`)"
        className="fixed bottom-1 right-1 z-[80] font-pixel text-[7px] uppercase px-1.5 py-0.5 bg-black/70 text-olive-hi hover:text-neon border border-black"
      >
        DBG
      </button>

      <DebugPanel open={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  );
}
