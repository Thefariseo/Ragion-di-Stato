"use client";

import { useGameStore } from "@/store/gameStore";
import { CutsceneEngine } from "@/components/cutscene/CutsceneEngine";
import { getCutscene } from "@/data/cutscenes";

export function IntroScreen() {
  const goToPhase = useGameStore((s) => s.goToPhase);
  const cs = getCutscene("intro");
  if (!cs) {
    goToPhase("newspaper");
    return null;
  }
  return <CutsceneEngine cutscene={cs} onDone={() => goToPhase("newspaper")} />;
}
