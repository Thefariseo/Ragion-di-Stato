"use client";

import { useEffect, useState } from "react";
import type { Cutscene, CutsceneBeat } from "@/types";
import { Typewriter } from "@/components/ui/Typewriter";
import { CutsceneStage } from "./CutsceneStage";
import { playStamp, playTelex, playPaper, playRing, playThud } from "@/lib/sfx";
import { playMusic } from "@/lib/music";

const SOUND: Record<string, () => void> = {
  stamp: playStamp,
  telex: playTelex,
  paper: playPaper,
  ring: playRing,
  thud: playThud,
  type: playPaper,
};

function duration(beat: CutsceneBeat): number {
  if (beat.durationMs) return beat.durationMs;
  const typing = (beat.lines ?? []).join(" ").length * 22;
  let base = 2200;
  if (beat.scene === "corridor" || beat.scene === "archive") base = 3600;
  else if (beat.scene === "letter") base = 2600;
  else if (beat.scene === "office_open") base = 2800;
  else if (beat.scene === "attentato") base = 3400;
  else if (beat.scene === "emblems") base = 1200 + (beat.emblems?.length ?? 1) * 1100;
  return Math.max(base, typing + 1600);
}

/**
 * Riproduce una cutscene come SEQUENZA: ogni beat è una scena animata che parte
 * da sola e avanza dopo `durationMs` (auto-play). Il testo compare a ritmo come
 * sottotitolo. Click per accelerare, "Salta" per uscire.
 */
export function CutsceneEngine({ cutscene, onDone }: { cutscene: Cutscene; onDone: () => void }) {
  const [i, setI] = useState(0);
  const beat = cutscene.beats[i];

  useEffect(() => {
    if (!beat) return;
    if (beat.sound && SOUND[beat.sound]) SOUND[beat.sound]();
    if (beat.music) playMusic(beat.music);
    const t = setTimeout(advance, duration(beat));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  function advance() {
    if (i + 1 >= cutscene.beats.length) onDone();
    else setI((v) => v + 1);
  }

  if (!beat) return null;

  return (
    <div
      className="h-full w-full relative overflow-hidden select-none bg-[#0a0907]"
      onClick={advance}
      style={{ background: "radial-gradient(ellipse at 50% 35%, #1a1813 0%, #0a0907 75%)" }}
    >
      <CutsceneStage key={i} beat={beat} />

      {/* sottotitolo a ritmo */}
      {(beat.title || beat.lines) && (
        <div className="absolute left-0 right-0 bottom-10 px-10 z-[5] flex flex-col items-center">
          <div className="max-w-2xl w-full bg-black/55 px-4 py-2 border-t-2 border-b-2 border-black">
            {beat.title && beat.scene !== "letter" && beat.scene !== "emblems" && (
              <div className="font-pixel uppercase text-[11px] tracking-[0.18em] text-olive-hi mb-1">{beat.title}</div>
            )}
            {beat.lines && (
              <Typewriter key={i} lines={beat.lines} speed={20} className="font-read text-[16px] text-paper-cream/95 leading-relaxed text-center" />
            )}
          </div>
        </div>
      )}

      {/* controlli */}
      <div className="absolute bottom-3 right-3 z-[6] flex items-center gap-3">
        <div className="flex gap-1">
          {cutscene.beats.map((_, k) => (
            <span key={k} className="w-1.5 h-1.5" style={{ backgroundColor: k <= i ? "#8fb9ad" : "#3d4232" }} />
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDone(); }}
          className="rds-btn text-[10px] px-3 py-1"
        >
          Salta »
        </button>
      </div>
      <span className="absolute bottom-3 left-3 z-[6] font-pixel text-[7px] uppercase tracking-widest text-paper/40 animate-blink">
        clicca per accelerare
      </span>
    </div>
  );
}
