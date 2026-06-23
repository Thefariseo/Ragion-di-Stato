"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { playMusic, stopMusic, setMusicEnabled, isMusicEnabled } from "@/lib/music";
import { setSfxEnabled, isSfxEnabled } from "@/lib/sfx";
import { setVoiceEnabled, playBlip } from "@/lib/voice";
import { startAmbient, stopAmbient, setAmbientEnabled } from "@/lib/ambientAudio";
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
  const [audio, setAudio] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
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

  // audio legato alla fase (musica vs ambiente)
  useEffect(() => {
    if (audio) routeAudio(phase);
  }, [phase, audio]);

  // l'audio parte solo dopo il primo gesto utente (policy del browser)
  useEffect(() => {
    const kick = () => {
      if (audio) routeAudio(phaseRef.current);
    };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, [audio]);

  function toggleAudio() {
    const v = !audio;
    setAudio(v);
    setMusicEnabled(v);
    setSfxEnabled(v);
    setAmbientEnabled(v);
    setVoiceEnabled(v && voiceOn);
    if (v) routeAudio(phaseRef.current);
    void isMusicEnabled;
    void isSfxEnabled;
  }

  function toggleVoice() {
    const v = !voiceOn;
    setVoiceOn(v);
    setVoiceEnabled(v && audio);
    if (v && audio) playBlip("comune");
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

      <button
        onClick={toggleVoice}
        title="Voce (mormorio dei dialoghi)"
        className="fixed bottom-1 right-[68px] z-[80] font-pixel text-[8px] uppercase px-1.5 py-0.5 bg-black/70 text-olive-hi hover:text-neon border border-black"
      >
        {voiceOn ? "VOCE" : "voce ×"}
      </button>
      <button
        onClick={toggleAudio}
        title="Audio (musica + effetti)"
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
