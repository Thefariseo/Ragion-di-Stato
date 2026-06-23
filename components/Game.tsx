"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { playMusic, stopMusic } from "@/lib/music";
import { startAmbient, stopAmbient } from "@/lib/ambientAudio";
import { resumeAudio } from "@/lib/audio/core";
import { AudioSettings } from "./ui/AudioSettings";
import type { GamePhase } from "@/types";
import { GameViewport } from "./GameViewport";
import { TitleScreen } from "./screens/TitleScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { CutsceneScreen } from "./screens/CutsceneScreen";
import { NewspaperScreen } from "./screens/NewspaperScreen";
import { BriefingScreen } from "./screens/BriefingScreen";
import { DirectivesScreen } from "./screens/DirectivesScreen";
import { DeskScreen } from "./screens/DeskScreen";
import { DaySummaryScreen } from "./screens/DaySummaryScreen";
import { NightScreen } from "./screens/NightScreen";
import { EndingScreen } from "./screens/EndingScreen";
import { PhaseTransition } from "./ui/PhaseTransition";
import { DebugPanel } from "./debug/DebugPanel";

// Le fasi che usano la MUSICA (inno istituzionale). Il gameplay (desk/event)
// invece NON ha musica: domina il sound design ambientale (lib/ambientAudio).
const THEME_FOR: Partial<Record<GamePhase, string>> = {
  title: "solenne",
  intro: "solenne",
  cutscene: "solenne",
  newspaper: "solenne",
  briefing: "solenne",
  directives: "solenne",
  daySummary: "solenne",
  night: "solenne",
  ending: "finale",
};

/** instrada l'audio in base alla fase: ambiente sul banco, musica altrove. */
function routeAudio(phase: GamePhase) {
  if (phase === "desk" || phase === "event") {
    stopMusic();
    startAmbient();
  } else {
    stopAmbient();
    playMusic(THEME_FOR[phase] ?? "solenne");
  }
}

export default function Game() {
  const hydrated = useGameStore((s) => s.hydrated);
  const phase = useGameStore((s) => s.game.phase);
  const [debugOpen, setDebugOpen] = useState(false);
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

  // audio legato alla fase (musica vs ambiente). Il volume/mute è nel mixer.
  useEffect(() => {
    routeAudio(phase);
  }, [phase]);

  // il contesto audio parte/riprende solo dopo il primo gesto (policy browser)
  useEffect(() => {
    const kick = () => {
      resumeAudio();
      routeAudio(phaseRef.current);
    };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, []);

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
              {phase === "cutscene" && <CutsceneScreen />}
              {phase === "newspaper" && <NewspaperScreen />}
              {phase === "briefing" && <BriefingScreen />}
              {phase === "directives" && <DirectivesScreen />}
              {(phase === "desk" || phase === "event") && <DeskScreen />}
              {phase === "daySummary" && <DaySummaryScreen />}
              {phase === "night" && <NightScreen />}
              {phase === "ending" && <EndingScreen />}
            </>
          )}
          {hydrated && <PhaseTransition phase={phase} />}
        </div>
      </GameViewport>

      <AudioSettings />
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
