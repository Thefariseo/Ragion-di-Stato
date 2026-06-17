"use client";

import { useEffect, useState } from "react";
import type { Cutscene } from "@/types";
import { Typewriter } from "@/components/ui/Typewriter";
import { Stamp } from "@/components/ui/Stamp";
import { FactionEmblem } from "@/components/desk/FactionEmblem";
import { BoothScene } from "@/components/desk/BoothScene";
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

const BG: Record<string, string> = {
  black: "bg-[#0a0907]",
  corridor: "tex-wall",
  archive: "tex-panel",
  paper: "tex-wood",
  desk: "tex-wood",
};

export function CutsceneEngine({ cutscene, onDone }: { cutscene: Cutscene; onDone: () => void }) {
  const [i, setI] = useState(0);
  const beat = cutscene.beats[i];

  useEffect(() => {
    if (!beat) return;
    if (beat.sound && SOUND[beat.sound]) SOUND[beat.sound]();
    if (beat.music) playMusic(beat.music);
    if (beat.durationMs) {
      const t = setTimeout(advance, beat.durationMs);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  function advance() {
    if (i + 1 >= cutscene.beats.length) onDone();
    else setI((v) => v + 1);
  }

  if (!beat) return null;

  return (
    <div
      className={`h-full w-full relative overflow-hidden ${BG[beat.bg ?? "black"]} flex items-center justify-center p-8 select-none`}
      onClick={advance}
    >
      {beat.bg === "corridor" && <BoothScene />}
      {beat.bg === "corridor" && <div className="absolute inset-0 bg-black/55" />}
      {beat.bg === "archive" && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {Array.from({ length: 6 }).map((_, k) => (
            <div key={k} className="absolute left-0 right-0 h-px bg-black" style={{ top: `${12 + k * 14}%` }} />
          ))}
        </div>
      )}

      <div className="relative z-[2] max-w-2xl w-full">
        {beat.visual === "stamp" && beat.stampLabel && (
          <div className="flex justify-center mb-5">
            <div className="animate-stampSlam">
              <Stamp label={beat.stampLabel} big rotate={-7} solid />
            </div>
          </div>
        )}

        {beat.visual === "emblems" && beat.emblems && (
          <div className="rds-paper p-5 mb-3">
            {beat.title && <div className="font-pixel uppercase text-[12px] text-stamp-red mb-3 tracking-widest text-center">{beat.title}</div>}
            <div className="grid grid-cols-1 gap-2.5">
              {beat.emblems.map((e, k) => (
                <div key={k} className="flex items-center gap-3 animate-slideUp" style={{ animationDelay: `${k * 90}ms` }}>
                  <FactionEmblem faction={e.faction} size={30} />
                  <span className="font-read text-[13px] text-ink leading-snug">{e.caption}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(beat.visual === "letter" || (beat.visual !== "emblems" && (beat.title || beat.lines))) && (
          <div
            className={
              beat.visual === "letter"
                ? "rds-paper p-6"
                : "text-center"
            }
          >
            {beat.title && (
              <div
                className={
                  beat.visual === "letter"
                    ? "font-pixel uppercase text-[13px] text-stamp-red border-b-2 border-ink/30 pb-1 mb-3 tracking-wide"
                    : "font-pixel uppercase text-[16px] text-paper-cream tracking-[0.15em] mb-3"
                }
              >
                {beat.title}
              </div>
            )}
            {beat.lines && (
              <Typewriter
                key={i}
                lines={beat.lines}
                speed={18}
                className={
                  beat.visual === "letter"
                    ? "font-read text-[14px] text-ink leading-relaxed text-left"
                    : "font-read text-[16px] text-paper-cream/90 leading-relaxed"
                }
              />
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-3 right-3 z-[3] flex items-center gap-3">
        <span className="font-pixel text-[7px] uppercase tracking-widest text-paper/40 animate-blink">clicca per continuare</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDone();
          }}
          className="rds-btn text-[9px] px-3 py-1"
        >
          Salta »
        </button>
      </div>
    </div>
  );
}
