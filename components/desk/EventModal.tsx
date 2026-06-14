"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { getEvent } from "@/data/events";
import { Typewriter } from "@/components/ui/Typewriter";
import { OutcomeOverlay } from "@/components/ui/OutcomeOverlay";
import { playRing, playThud, playClick } from "@/lib/sfx";

const CHANNEL_LABEL: Record<string, string> = {
  telefono: "☎ Telefono",
  telex: "⌨ Telex",
  busta: "✉ Busta",
  ispezione: "⚑ Ispezione",
  voce: "● Voce",
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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-6">
      <div
        className={`paper paper-edge max-w-lg w-full p-6 animate-slideIn ${
          ev.channel === "telefono" ? "animate-flickr" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/30 pb-1 mb-3">
          <span className="font-stencil uppercase tracking-widest text-rossomin text-sm">
            {ev.title}
          </span>
          <span className="font-typewriter text-xs text-inchiostro/60">
            {CHANNEL_LABEL[ev.channel] ?? ev.channel}
          </span>
        </div>

        <Typewriter
          lines={ev.body}
          speed={14}
          className="font-doc text-[16px] text-inchiostro mb-4"
        />

        <div className="space-y-2">
          {ev.options.map((o, i) => (
            <button
              key={i}
              onClick={() => {
                playClick();
                setPending(i);
              }}
              className="w-full text-left font-stencil uppercase tracking-wide text-sm border border-inchiostro/40 px-3 py-2 text-inchiostro hover:bg-inchiostro hover:text-carta transition-colors"
            >
              {o.label}
            </button>
          ))}
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
