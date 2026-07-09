"use client";

import { useEffect, useRef, useState } from "react";
import type { GamePhase } from "@/types";
import { playThud } from "@/lib/sfx";

/**
 * Transizione cinematografica tra fasi: una serranda ministeriale cala e si
 * rialza. Niente transizione verso/da cutscene (hanno già una loro regia) né
 * sul primo montaggio. pointer-events: none, sopra tutto.
 */
const SKIP: GamePhase[] = ["cutscene", "intro"];

export function PhaseTransition({ phase }: { phase: GamePhase }) {
  const [tick, setTick] = useState(0);
  const prev = useRef<GamePhase | null>(null);

  useEffect(() => {
    const from = prev.current;
    prev.current = phase;
    if (from === null) return; // primo montaggio: niente serranda
    if (SKIP.includes(phase) || SKIP.includes(from)) return;
    setTick((t) => t + 1);
    playThud();
  }, [phase]);

  if (tick === 0) return null;

  return (
    <div key={tick} className="absolute inset-0 z-[70] pointer-events-none overflow-hidden">
      <div className="rds-shutter-top absolute top-0 left-0 right-0 h-1/2 bg-env-0 border-b-2 border-black">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 7px)" }} />
      </div>
      <div className="rds-shutter-bottom absolute bottom-0 left-0 right-0 h-1/2 bg-env-0 border-t-2 border-black">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 7px)" }} />
      </div>
      <div className="rds-shutter-seam absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neon/70" />
    </div>
  );
}
