"use client";

import { useEffect, useState } from "react";
import type { CaseAction, Citation } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { getCase } from "@/data/cases";
import { getCutscene } from "@/data/cutscenes";
import { validateCase } from "@/game/rules";
import { computeCitation } from "@/game/citations";
import { Booth } from "@/components/desk/Booth";
import { DeskProps } from "@/components/desk/DeskProps";
import { Dossier } from "@/components/desk/Dossier";
import { ActionBar } from "@/components/desk/ActionBar";
import { Rulebook } from "@/components/desk/Rulebook";
import { StatePanel } from "@/components/hud/StatePanel";
import { EventModal } from "@/components/desk/EventModal";
import { FineReceipt } from "@/components/desk/FineReceipt";
import { Stamp } from "@/components/ui/Stamp";
import { playStamp, playClick } from "@/lib/sfx";

const DEFAULT_STAMP: Record<string, string> = {
  approva: "APPROVATO",
  respingi: "RESPINTO",
  segnala: "SEGNALATO",
  archivia: "ARCHIVIATO",
};

export function DeskScreen() {
  const game = useGameStore((s) => s.game);
  const chooseAction = useGameStore((s) => s.chooseAction);
  const playCutscene = useGameStore((s) => s.playCutscene);

  const dayDef = getDay(game.day);
  const caseId = game.queue[game.currentCaseIndex];
  const caseDef = caseId ? getCase(caseId) : undefined;

  const [stamping, setStamping] = useState<{ label: string; kind: CaseAction["kind"] } | null>(null);
  const [receipt, setReceipt] = useState<Citation | null>(null);

  // presentazione di una fazione alla sua prima comparsa
  useEffect(() => {
    if (game.phase !== "desk") return;
    const f = caseDef?.faction;
    if (!f) return;
    const id = `fac_${f}`;
    if (game.flags[`cs_${id}`]) return;
    if (!getCutscene(id)) return;
    playCutscene(id, "desk");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDef?.id]);

  if (!dayDef) return null;

  function handleAction(a: CaseAction) {
    if (stamping || receipt || !caseDef) return;

    // valutazione procedurale: l'ammenda esce solo per un errore GRAVE
    const validation = validateCase(caseDef, dayDef?.ruleIds ?? [], { day: game.day, flags: game.flags });
    const cit = computeCitation(caseDef, a, validation, game.day);
    const fine = cit && cit.severity === "grave" && cit.visibleToPlayer ? cit : null;

    const dispatch = () => {
      chooseAction(a.id);
      if (fine) setReceipt(fine);
    };

    if (a.needsStamp) {
      playStamp();
      const label = a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label.toUpperCase();
      setStamping({ label, kind: a.kind });
      window.setTimeout(() => {
        setStamping(null);
        dispatch();
      }, 460);
    } else {
      playClick();
      dispatch();
    }
  }

  const eventActive = game.phase === "event";

  return (
    <div className="h-full w-full flex flex-col relative">
      <Booth game={game} dayDef={dayDef} caseDef={caseDef} />

      {/* bancone */}
      <div className="h-2 bg-env-0 border-y-2 border-black shadow-[0_5px_10px_rgba(0,0,0,0.6)] relative z-[3]" />

      <div className={`flex-1 min-h-0 flex ${stamping ? "animate-deskShake" : ""}`}>
        {/* scrivania (legno cupo, palette del prologo) */}
        <div className="tex-wood flex-1 relative overflow-hidden">
          <DeskProps day={game.day} />
          {/* velo del prologo: vignettatura fredda, sempre presente */}
          <div className="rds-prologue-veil" />
          {!caseDef && (
            <div className="h-full flex items-center justify-center text-paper/60 font-pixel uppercase tracking-widest text-sm">
              Coda esaurita. Chiusura giornata…
            </div>
          )}
          {caseDef && <Dossier caseDef={caseDef} />}

          {stamping && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="animate-stampSlam">
                <Stamp label={stamping.label} kind={stamping.kind} big rotate={-9} solid />
              </div>
            </div>
          )}

          {receipt && <FineReceipt citation={receipt} onClose={() => setReceipt(null)} />}
        </div>

        {/* console destra */}
        <aside className="w-[320px] shrink-0 tex-panel border-l-4 border-black p-2 flex flex-col gap-2 overflow-auto thin-scroll">
          {caseDef && (
            <ActionBar caseDef={caseDef} onAction={handleAction} disabled={!!stamping || eventActive || !!receipt} />
          )}
          <Rulebook dayDef={dayDef} />
          <StatePanel />
        </aside>
      </div>

      {eventActive && <EventModal />}
    </div>
  );
}
