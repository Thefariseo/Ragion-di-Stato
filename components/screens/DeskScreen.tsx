"use client";

import { useState } from "react";
import type { CaseAction } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { getCase } from "@/data/cases";
import { StatusBar } from "@/components/hud/StatusBar";
import { StatePanel } from "@/components/hud/StatePanel";
import { Dossier } from "@/components/desk/Dossier";
import { ActionBar } from "@/components/desk/ActionBar";
import { Rulebook } from "@/components/desk/Rulebook";
import { EventModal } from "@/components/desk/EventModal";
import { Stamp } from "@/components/ui/Stamp";
import { OutcomeOverlay } from "@/components/ui/OutcomeOverlay";
import { playStamp, playClick } from "@/lib/sfx";

const DEFAULT_STAMP: Record<string, string> = {
  approva: "APPROVATO",
  respingi: "RESPINTO",
  segnala: "SEGNALATO",
  archivia: "ARCHIVIATO",
};

export function DeskScreen({ onToggleDebug }: { onToggleDebug: () => void }) {
  const game = useGameStore((s) => s.game);
  const chooseAction = useGameStore((s) => s.chooseAction);

  const dayDef = getDay(game.day);
  const caseId = game.queue[game.currentCaseIndex];
  const caseDef = caseId ? getCase(caseId) : undefined;

  const [stamping, setStamping] = useState<{ label: string; kind: string } | null>(
    null,
  );
  const [pending, setPending] = useState<CaseAction | null>(null);

  if (!dayDef) return null;

  function handleAction(a: CaseAction) {
    if (pending || stamping) return;
    if (a.needsStamp) {
      playStamp();
      const label = a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label.toUpperCase();
      setStamping({ label, kind: a.kind });
      window.setTimeout(() => {
        setStamping(null);
        setPending(a);
      }, 720);
    } else {
      playClick();
      setPending(a);
    }
  }

  function confirmPending() {
    if (!pending) return;
    const id = pending.id;
    setPending(null);
    chooseAction(id);
  }

  const eventActive = game.phase === "event";

  return (
    <div className="scrivania h-full w-full flex flex-col relative">
      <StatusBar dayDef={dayDef} onToggleDebug={onToggleDebug} />

      <div className="flex-1 flex overflow-hidden">
        {/* area documenti */}
        <main className="flex-1 p-5 overflow-hidden">
          {caseDef ? (
            <Dossier caseDef={caseDef} />
          ) : (
            <div className="h-full flex items-center justify-center text-carta/50 font-doc text-xl">
              La coda è esaurita. Chiusura della giornata…
            </div>
          )}
        </main>

        {/* colonna laterale */}
        <aside className="w-[380px] shrink-0 feltro border-l border-black/60 p-3 flex flex-col gap-3 overflow-auto thin-scroll">
          {caseDef && (
            <ActionBar
              caseDef={caseDef}
              onAction={handleAction}
              disabled={!!pending || !!stamping || eventActive}
            />
          )}
          <Rulebook dayDef={dayDef} />
          <StatePanel />
        </aside>
      </div>

      {/* animazione timbro */}
      {stamping && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="animate-stampDown">
            <Stamp label={stamping.label} big rotate={-9} />
          </div>
        </div>
      )}

      {/* esito della decisione */}
      {pending && (
        <OutcomeOverlay
          title={caseDef?.subject}
          text={pending.consequence.text}
          onContinue={confirmPending}
        />
      )}

      {/* evento */}
      {eventActive && <EventModal />}
    </div>
  );
}
