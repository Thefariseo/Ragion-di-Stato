"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CaseAction, Citation } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { getDay } from "@/data/days";
import { getCase } from "@/data/cases";
import { getCutscene } from "@/data/cutscenes";
import { validateCase } from "@/game/rules";
import { computeCitation } from "@/game/citations";
import { actionAvailability, simplifyActions, type CaseAnalysis } from "@/game/actions";
import { TopBar } from "@/components/hud/TopBar";
import { Booth } from "@/components/desk/Booth";
import { DeskProps } from "@/components/desk/DeskProps";
import { Dossier } from "@/components/desk/Dossier";
import { StampTray } from "@/components/desk/StampTray";
import { ProtocolFolder } from "@/components/desk/ProtocolFolder";
import { RulebookDesk } from "@/components/desk/RulebookDesk";
import { EventModal } from "@/components/desk/EventModal";
import { FineReceipt } from "@/components/desk/FineReceipt";
import { Stamp } from "@/components/ui/Stamp";
import { playStamp, playClick } from "@/lib/sfx";
import { voiceForFaction, type VoiceProfileId } from "@/lib/voice";

const DEFAULT_STAMP: Record<string, string> = {
  approva: "APPROVATO",
  respingi: "RESPINTO",
  segnala: "SEGNALATO",
  archivia: "ARCHIVIATO",
};

/**
 * La decisione CADE su una persona: reazione dell'NPC al timbro, con voce.
 * Solo per le azioni che l'interessato percepisce allo sportello.
 */
const NPC_REACTIONS: Partial<Record<CaseAction["kind"], string[]>> = {
  approva: ["«Grazie. Grazie davvero.»", "«Lo sapevo che era tutto in ordine.»", "«Buona giornata a lei.»"],
  respingi: ["«Non può farmi questo...»", "«E adesso io cosa faccio? Me lo dica lei.»", "«C'è un errore. Ci DEV'ESSERE un errore.»"],
  segnala: ["«Cosa ha scritto?! Cosa ha scritto lì sopra?»", "«Ve ne pentirete. Tutti quanti.»", "«Io non ho fatto niente. NIENTE.»"],
  verifica: ["«Va bene. Torno domani. Di nuovo.»", "«Un altro giorno perso. Contento lei...»"],
  trattieni: ["«Non può trattenerla, è mia!»", "«Voglio parlare con un suo superiore.»"],
};

function reactionFor(kind: CaseAction["kind"], caseId: string): string | null {
  const pool = NPC_REACTIONS[kind];
  if (!pool || pool.length === 0) return null;
  let h = 0;
  for (let i = 0; i < caseId.length; i++) h = (h * 31 + caseId.charCodeAt(i)) >>> 0;
  return pool[h % pool.length] ?? null;
}

export function DeskScreen() {
  const game = useGameStore((s) => s.game);
  const chooseAction = useGameStore((s) => s.chooseAction);
  const playCutscene = useGameStore((s) => s.playCutscene);
  const tickClock = useGameStore((s) => s.tickClock);

  const dayDef = getDay(game.day);
  const caseId = game.queue[game.currentCaseIndex];
  const caseDef = caseId ? getCase(caseId) : undefined;

  const [stamping, setStamping] = useState<{ label: string; kind: CaseAction["kind"] } | null>(null);
  const [receipt, setReceipt] = useState<Citation | null>(null);
  const [reaction, setReaction] = useState<{ line: string; voice: VoiceProfileId } | null>(null);
  const [analysis, setAnalysis] = useState<CaseAnalysis>({ inspected: false, discrepanciesFound: 0 });
  const onAnalysis = useCallback((a: CaseAnalysis) => setAnalysis(a), []);

  // COME IN PAPERS, PLEASE: il prossimo non entra da solo. Sportello vuoto,
  // coda che aspetta, e sei TU a suonare il campanello («Avanti!»).
  const [awaitingCall, setAwaitingCall] = useState(true);
  useEffect(() => {
    if (caseId) setAwaitingCall(true);
  }, [caseId]);
  const callNext = useCallback(() => setAwaitingCall(false), []);

  // IL TEMPO SCORRE: 1 minuto di gioco al secondo, solo alla scrivania —
  // anche mentre esiti a chiamare il prossimo. Alle 18:00 l'ufficio chiude.
  // In pausa durante eventi, timbrata e ammenda (niente chiusure a tradimento).
  const paused = game.phase !== "desk" || !!stamping || !!receipt;
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => tickClock(1), 1000);
    return () => clearInterval(t);
  }, [paused, tickClock]);

  // valutazione procedurale del caso corrente (per gating azioni + ammenda)
  const validation = useMemo(
    () => (caseDef ? validateCase(caseDef, dayDef?.ruleIds ?? [], { day: game.day, flags: game.flags }) : null),
    [caseDef, dayDef?.ruleIds, game.day, game.flags],
  );

  // PRESENTAZIONE SEMPLIFICATA: la procedura è ACCETTA/RIFIUTA. ARRESTA e
  // l'unica azione speciale compaiono solo se il caso le dichiara; un caso
  // senza verdetto è un NODO della trama. Tutto il resto non si vede.
  const { trayItems, folderItems, folderTitle } = useMemo(() => {
    if (!caseDef || !validation) return { trayItems: [], folderItems: [], folderTitle: "" };
    const ctx = { caseDef, validation, analysis, flags: game.flags, day: game.day };
    const items = caseDef.actions.map((a) => ({ action: a, ...actionAvailability(a, ctx) }));
    const s = simplifyActions(caseDef, items);
    const tray = s.tray.map(({ item, display }) => ({ ...item, display }));
    const folder = s.crossroads.length > 0 ? s.crossroads : s.speciale ? [s.speciale] : [];
    // fail-safe sui soli elementi VISIBILI: niente pratiche irrisolvibili
    const visible = [...tray, ...folder];
    if (visible.length > 0 && !visible.some((it) => it.available)) {
      return {
        trayItems: tray.map((it) => ({ ...it, available: true, reason: undefined })),
        folderItems: folder.map((it) => ({ ...it, available: true, reason: undefined })),
        folderTitle: s.crossroads.length > 0 ? "Decisione straordinaria" : "Azione speciale",
      };
    }
    return {
      trayItems: tray,
      folderItems: folder,
      folderTitle: s.crossroads.length > 0 ? "Decisione straordinaria" : "Azione speciale",
    };
  }, [caseDef, validation, analysis, game.flags, game.day]);

  // L'ATTENTATO: il movimento della "paura" entra a G7 (o prima, se il caos
  // precipita). Una sola volta per run.
  const crisis = game.day >= 7 || game.country.caos >= 68 || game.flags["attentato"] === true;
  useEffect(() => {
    if (game.phase !== "desk") return;
    if (!crisis) return;
    if (game.flags["cs_attentato"]) return;
    if (game.activeCutscene) return;
    playCutscene("attentato", "desk");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crisis, game.phase]);

  // LA RIVELAZIONE del fondo R: quando il faldone arriva sul banco (G9)
  useEffect(() => {
    if (game.phase !== "desk" || awaitingCall) return;
    if (caseDef?.id !== "a9_fondo_r") return;
    if (game.flags["cs_fondoR_reveal"]) return;
    if (game.activeCutscene) return;
    playCutscene("fondoR_reveal", "desk");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDef?.id, awaitingCall, game.phase]);

  // presentazione di una fazione alla sua prima comparsa (dopo la chiamata)
  useEffect(() => {
    if (game.phase !== "desk" || awaitingCall) return;
    if (crisis && !game.flags["cs_attentato"]) return; // prima l'attentato
    const f = caseDef?.faction;
    if (!f) return;
    const id = `fac_${f}`;
    if (game.flags[`cs_${id}`]) return;
    if (!getCutscene(id)) return;
    playCutscene(id, "desk");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDef?.id, awaitingCall]);

  if (!dayDef) return null;

  function handleAction(a: CaseAction) {
    if (stamping || receipt || !caseDef || !validation) return;
    // un'azione bloccata non si può eseguire
    if (!actionAvailability(a, { caseDef, validation, analysis, flags: game.flags, day: game.day }).available) return;

    // valutazione procedurale: l'ammenda esce solo per un errore GRAVE
    const cit = computeCitation(caseDef, a, validation, game.day);
    const fine = cit && cit.severity === "grave" && cit.visibleToPlayer ? cit : null;

    // la decisione cade su una PERSONA: reagisce prima di uscire
    const line = reactionFor(a.kind, caseDef.id);
    if (line) {
      setReaction({ line, voice: voiceForFaction(caseDef.faction) });
      window.setTimeout(() => setReaction(null), 2400);
    }

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
  const caseVisible = !!caseDef && !awaitingCall;

  return (
    <div className="h-full w-full flex flex-col relative">
      <TopBar game={game} dayDef={dayDef} />
      <Booth
        game={game}
        dayDef={dayDef}
        caseDef={caseVisible ? caseDef : undefined}
        reaction={reaction}
        awaitingCall={!!caseDef && awaitingCall}
        onCall={callNext}
      />

      {/* bancone */}
      <div className="h-2 bg-env-0 border-y-2 border-black shadow-[0_5px_10px_rgba(0,0,0,0.6)] relative z-[3]" />

      {/* SCRIVANIA a tutto schermo: solo oggetti fisici, nessun pannello web */}
      <div className={`flex-1 min-h-0 relative ${stamping ? "animate-deskShake" : ""}`}>
        <div className="tex-wood absolute inset-0 overflow-hidden">
          <DeskProps day={game.day} />
          {/* velo del prologo: vignettatura fredda, sempre presente */}
          <div className="rds-prologue-veil" />

          {!caseDef && (
            <div className="h-full flex items-center justify-center text-paper/60 font-pixel uppercase tracking-widest text-sm">
              Coda esaurita. Chiusura giornata…
            </div>
          )}
          {caseDef && awaitingCall && (
            <div className="h-full flex flex-col items-center justify-center gap-2 pointer-events-none">
              <span className="font-pixel uppercase tracking-[0.25em] text-paper/45 text-sm">Il banco è sgombro</span>
              <span className="font-read text-[14px] text-paper/35">Suona il campanello per chiamare il prossimo. Il tempo, intanto, passa.</span>
            </div>
          )}
          {caseVisible && <Dossier caseDef={caseDef} onAnalysis={onAnalysis} />}

          {/* oggetti fisici del banco */}
          {caseVisible && (
            <StampTray items={trayItems} disabled={!!stamping || eventActive || !!receipt} onStamp={handleAction} />
          )}
          {caseVisible && (
            <ProtocolFolder items={folderItems} title={folderTitle} disabled={!!stamping || eventActive || !!receipt} onAction={handleAction} />
          )}
          <RulebookDesk dayDef={dayDef} />

          {stamping && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="animate-stampSlam">
                <Stamp label={stamping.label} kind={stamping.kind} big rotate={-9} solid />
              </div>
            </div>
          )}

          {receipt && <FineReceipt citation={receipt} onClose={() => setReceipt(null)} />}
        </div>
      </div>

      {eventActive && <EventModal />}
    </div>
  );
}
