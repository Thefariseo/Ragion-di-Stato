"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { getEvent } from "@/data/events";
import { Typewriter } from "@/components/ui/Typewriter";
import { OutcomeOverlay } from "@/components/ui/OutcomeOverlay";
import { EventScene } from "./EventScene";
import { playRing, playThud, playClick, playTelex } from "@/lib/sfx";

const CHANNEL_LABEL: Record<string, string> = {
  telefono: "TRASCRIZIONE TELEFONICA",
  telex: "DISPACCIO · TELEX",
  busta: "BUSTA RISERVATA",
  ispezione: "VERBALE D'ISPEZIONE",
  voce: "COMUNICAZIONE VERBALE",
};

/**
 * Un evento NON è un pop-up: è una piccola CUTSCENE. La scena animata (telefono
 * che squilla, agenti che entrano, busta che scivola sotto la porta) parte da
 * sola; il trascritto e le scelte salgono come sottotitolo dopo un istante di
 * messa in scena. Tono cupo, palette del prologo.
 */
export function EventModal() {
  const eventId = useGameStore((s) => s.game.activeEventId);
  const resolveEventOption = useGameStore((s) => s.resolveEventOption);
  const [pending, setPending] = useState<number | null>(null);
  const [staged, setStaged] = useState(false);
  const ev = eventId ? getEvent(eventId) : undefined;

  useEffect(() => {
    if (!ev) return;
    if (ev.channel === "telefono") playRing();
    else if (ev.channel === "telex") playTelex();
    else playThud();
    setStaged(false);
    const t = setTimeout(() => setStaged(true), 1100); // lascia "recitare" la scena
    return () => clearTimeout(t);
  }, [ev]);

  if (!ev) return null;

  return (
    <div className="absolute inset-0 z-30 bg-black select-none overflow-hidden">
      {/* la scena animata occupa tutto lo schermo */}
      <EventScene channel={ev.channel} />

      {/* vignetta del prologo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 38%, transparent 52%, rgba(0,0,0,0.72) 100%)" }}
      />

      {/* intestazione del canale */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2 text-center">
        <span className="font-pixel uppercase text-[13px] tracking-widest text-stamp-redhi">{ev.title}</span>
        <span className="rds-label text-[8px]">▸ {CHANNEL_LABEL[ev.channel] ?? ev.channel}</span>
      </div>

      {/* trascritto + scelte come pannello che sale */}
      <div
        className="absolute left-1/2 bottom-6 z-[6] w-[min(640px,86%)] transition-opacity duration-300"
        style={{ opacity: staged ? 1 : 0, transform: "translateX(-50%)" }}
      >
        <div className={`rds-paper p-4 ${staged ? "animate-slideUp" : ""}`}>
          {staged && (
            <Typewriter lines={ev.body} speed={16} className="font-read text-[16px] text-ink mb-3 leading-snug" />
          )}
          <div className="space-y-2 mt-1">
            {ev.options.map((o, i) => (
              <button
                key={i}
                onClick={() => { playClick(); setPending(i); }}
                className="rds-btn w-full text-left px-3 py-2.5 text-[15px] normal-case"
              >
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
