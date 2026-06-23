"use client";

import { useState } from "react";
import { getVolume, setVolume, isMuted, setMuted, resumeAudio, type Bus } from "@/lib/audio/core";
import { playBlip } from "@/lib/voice";
import { playClick } from "@/lib/sfx";

const ROWS: { bus: Bus; label: string }[] = [
  { bus: "music", label: "Musica" },
  { bus: "ambience", label: "Ambiente" },
  { bus: "sfx", label: "Effetti" },
  { bus: "voice", label: "Voce" },
];

/**
 * Pannello opzioni audio: mute generale + volumi SEPARATI per musica, ambiente,
 * effetti e voce (mixer lib/audio/core). Stile pixel, niente UI moderna.
 */
export function AudioSettings() {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);
  const [mute, setMute] = useState(() => isMuted());

  const toggleMute = () => {
    resumeAudio();
    const v = !mute;
    setMute(v);
    setMuted(v);
    if (!v) playClick();
  };

  const onSlide = (bus: Bus, v: number) => {
    resumeAudio();
    setVolume(bus, v / 100);
    force((n) => n + 1);
    if (bus === "voice") playBlip("comune");
    else if (bus === "sfx") playClick();
  };

  return (
    <div className="fixed bottom-1 right-9 z-[80]">
      {open && (
        <div className="absolute bottom-7 right-0 w-44 rds-panel p-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rds-label text-[8px]">Audio</span>
            <button
              onClick={toggleMute}
              className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border border-black ${mute ? "text-stamp-redhi" : "text-olive-hi"}`}
            >
              {mute ? "Muto" : "Attivo"}
            </button>
          </div>
          {ROWS.map(({ bus, label }) => (
            <label key={bus} className="block">
              <span className="font-pixel text-[7px] uppercase tracking-wider text-paper/70">{label}</span>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={Math.round(getVolume(bus) * 100)}
                onChange={(e) => onSlide(bus, Number(e.target.value))}
                className="rds-slider w-full"
                disabled={mute}
              />
            </label>
          ))}
        </div>
      )}
      <button
        onClick={() => { resumeAudio(); setOpen((v) => !v); }}
        title="Opzioni audio"
        className="font-pixel text-[8px] uppercase px-1.5 py-0.5 bg-black/70 text-olive-hi hover:text-neon border border-black"
      >
        {mute ? "♪ ×" : "♪"}
      </button>
    </div>
  );
}
