"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { getEvent } from "@/data/events";
import { Typewriter } from "@/components/ui/Typewriter";
import { OutcomeOverlay } from "@/components/ui/OutcomeOverlay";
import { playRing, playThud, playClick } from "@/lib/sfx";

const CHANNEL_LABEL: Record<string, string> = {
  telefono: "TELEFONO",
  telex: "TELEX",
  busta: "BUSTA",
  ispezione: "ISPEZIONE",
  voce: "VOCE",
};

export function EventModal() {
  const eventId = useGameStore((s) => s.game.activeEventId);
  const resolveEventOption = useGameStore((s) => s.resolveEventOption);
  const [pending, setPending] = useState<number | null>(null);
  const ev = eventId ? getEvent(eventId) : undefined;

  useEffect(() => {
    if (!ev) return;
    if (ev.channel === "telefono") playRing();
    else playThud();
  }, [ev]);

  if (!ev) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 p-6">
      <div className={`rds-panel max-w-lg w-full p-1.5 animate-slideUp ${ev.channel === "telefono" ? "animate-flicker" : ""}`}>
        <div className="flex items-center justify-between px-2 py-1">
          <span className="font-pixel uppercase text-[11px] text-stamp-redhi">{ev.title}</span>
          <span className="rds-label text-[7px]">▸ {CHANNEL_LABEL[ev.channel] ?? ev.channel}</span>
        </div>
        <div className="rds-paper p-3">
          <Typewriter lines={ev.body} speed={14} className="font-read text-[14px] text-ink mb-3 leading-snug" />
          <div className="space-y-2">
            {ev.options.map((o, i) => (
              <button key={i} onClick={() => { playClick(); setPending(i); }} className="rds-btn w-full text-left px-2.5 py-2 text-[11px] normal-case">
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pending !== null && ev.options[pending] && (
        <OutcomeOverlay
          text={ev.options[pending].consequence.text}
          onContinue={() => {
            const i = pending;
            setPending(null);
            resolveEventOption(i);
          }}
        />
      )}
    </div>
  );
}
