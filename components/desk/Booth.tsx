"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseDef, DayDef, GameState } from "@/types";
import { FACTIONS } from "@/data/factions";
import { pickAmbient, type AmbientEvent } from "@/data/ambient";
import { playThud, playTelex, playPaper, playRing, playDrawer } from "@/lib/sfx";
import { portraitSeed } from "./ApplicantPortrait";
import { NpcSprite } from "./NpcSprite";
import { WorldScene } from "./WorldScene";
import { AmbientVisual } from "./AmbientVisual";
import { Typewriter } from "@/components/ui/Typewriter";
import { voiceForFaction, type VoiceProfileId } from "@/lib/voice";

const AMB_SOUND: Record<string, () => void> = {
  thud: playThud,
  telex: playTelex,
  paper: playPaper,
  ring: playRing,
  drawer: playDrawer,
};

export function Booth({
  game,
  dayDef,
  caseDef,
  reaction,
}: {
  game: GameState;
  dayDef: DayDef;
  caseDef?: CaseDef;
  /** battuta di reazione dell'NPC alla decisione appena presa (con voce) */
  reaction?: { line: string; voice: VoiceProfileId } | null;
}) {
  const sospetto = game.player.sospetto;
  const caos = game.country.caos;
  const alarm = caos >= 68 || game.flags["attentato"] === true;
  const fac = caseDef?.faction ? FACTIONS[caseDef.faction] : undefined;

  // ticker degli eventi ambientali del corridoio
  const ctxRef = useRef({ suspicion: sospetto, caos, day: game.day });
  ctxRef.current = { suspicion: sospetto, caos, day: game.day };
  const [amb, setAmb] = useState<AmbientEvent | null>(null);
  const [ambOn, setAmbOn] = useState(false);
  const [ambKey, setAmbKey] = useState(0);
  const lastId = useRef<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    let next: ReturnType<typeof setTimeout>;
    let hide: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(() => {
        if (!alive) return;
        const e = pickAmbient(ctxRef.current, Math.random(), lastId.current);
        if (e) {
          lastId.current = e.id;
          setAmb(e);
          setAmbOn(true);
          setAmbKey((k) => k + 1);
          if (e.sound) AMB_SOUND[e.sound]?.();
          hide = setTimeout(() => setAmbOn(false), 5000);
        }
        schedule();
      }, 6500 + Math.random() * 6000);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(next);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="relative shrink-0 h-[34%] min-h-[176px] overflow-hidden border-b-4 border-black tex-wall">
      <WorldScene suspicion={sospetto} caos={caos} alarm={alarm} />

      {/* evento ambientale ANIMATO (si vede, non è solo testo) */}
      {ambOn && amb && <AmbientVisual key={`${amb.id}-${ambKey}`} visual={amb.visual} />}

      {/* manifesto a parete */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[3] rds-panel px-2.5 py-0.5 max-w-[46%]">
        <div className="font-pixel uppercase text-[9px] leading-tight text-paper-cream truncate">{dayDef.headline}</div>
      </div>

      {/* SPORTELLO — il richiedente */}
      <div className="absolute left-2 top-2 bottom-2 w-[228px] z-[3] border-4 border-env-0 bg-black/35 overflow-hidden flex flex-col items-center justify-end">
        <div className="absolute top-1 left-0 right-0 text-center rds-label text-[7px]">Sportello 7 · Ammissione</div>
        {caseDef ? (
          <div className="flex flex-col items-center">
            <NpcSprite key={caseDef.id} seed={portraitSeed(caseDef.id)} width={140} />
            <div className="rds-nameplate px-2 py-1 text-center w-full">
              <div className="font-pixel uppercase text-[11px] leading-tight">{caseDef.subject}</div>
              <div className="font-read text-[11px] uppercase tracking-wide text-paper/70">
                {fac ? `${fac.name} · ${fac.sigla}` : "pratica in entrata"}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="font-pixel uppercase tracking-[0.2em] text-paper/40 text-[10px] border-2 border-paper/30 px-2 py-1 rotate-[-4deg]">
              Sportello chiuso
            </div>
          </div>
        )}
      </div>

      {/* VOCE — fumetto del richiedente (o la sua REAZIONE alla decisione) */}
      {reaction ? (
        <div className="absolute left-[238px] top-3 z-[4] max-w-[330px] rds-paper p-2.5 border-stamp-red">
          <div className="font-pixel text-[8px] uppercase tracking-wider text-stamp-red mb-0.5">Reazione · sportello</div>
          <Typewriter key={reaction.line} lines={[reaction.line]} speed={14} voice={reaction.voice} className="font-read text-[15px] text-ink leading-snug" />
        </div>
      ) : (
        caseDef?.intro && (
          <div className="absolute left-[238px] top-3 z-[3] max-w-[330px] rds-paper p-2.5">
            <div className="font-pixel text-[8px] uppercase tracking-wider text-ink/55 mb-0.5">Voce · sportello</div>
            <Typewriter key={caseDef.id} lines={caseDef.intro} speed={18} voice={voiceForFaction(caseDef.faction)} className="font-read text-[15px] text-ink leading-snug" />
          </div>
        )
      )}

      {/* allarme (l'unico strumento qui: il resto è nella barra di stato) */}
      {alarm && (
        <div className="absolute right-2 top-2 z-[4] rds-panel px-2 py-1 border-stamp-red animate-blink">
          <div className="font-pixel text-[8px] uppercase tracking-widest text-stamp-redhi text-center">● Allarme al piano</div>
        </div>
      )}

      {/* vignetta ambientale — il corridoio racconta */}
      <div
        className="absolute bottom-1.5 left-[238px] z-[4] max-w-[58%] rds-panel px-2.5 py-1 transition-opacity duration-500"
        style={{ opacity: ambOn && amb ? 1 : 0 }}
      >
        <span className="font-pixel text-[7px] uppercase tracking-widest text-olive-hi mr-1">▸ dal corridoio</span>
        <span className="font-read text-[13.5px] text-paper-cream/90 leading-snug">{amb?.caption}</span>
      </div>
    </div>
  );
}
