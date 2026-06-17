"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { CutsceneEngine } from "@/components/cutscene/CutsceneEngine";
import { getCutscene } from "@/data/cutscenes";

export function CutsceneScreen() {
  const id = useGameStore((s) => s.game.activeCutscene);
  const endCutscene = useGameStore((s) => s.endCutscene);
  const cs = id ? getCutscene(id) : undefined;

  useEffect(() => {
    if (!cs) endCutscene();
  }, [cs, endCutscene]);

  if (!cs) return null;
  return <CutsceneEngine key={cs.id} cutscene={cs} onDone={endCutscene} />;
}
