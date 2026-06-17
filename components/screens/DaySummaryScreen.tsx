"use client";

import { useGameStore } from "@/store/gameStore";
import { formatLire } from "@/lib/format";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import { LAST_DAY } from "@/data/days";
import { FactionEmblem } from "@/components/desk/FactionEmblem";
import { Typewriter } from "@/components/ui/Typewriter";
import { playClick } from "@/lib/sfx";
import type { GameState } from "@/types";

/** barra su carta (inchiostro scuro su foglio chiaro) */
function PaperGauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between font-pixel text-[7px] uppercase tracking-wider text-ink/60">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-2 mt-0.5 bg-ink/15 border border-ink/20 overflow-hidden">
        <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function superiorNote(g: GameState, cits: number): string {
  if (g.player.sospetto >= 70) return "«Il suo nome ricorre troppo spesso, funzionario. Gli Affari Interni la cercano.»";
  if (cits >= 2) return "«Troppi errori. Un'altra giornata così e parleremo del suo trasferimento.»";
  if (g.player.sospetto >= 45) return "«Qualcuno ai piani alti ha chiesto di lei. Stia attento a cosa firma.»";
  if (g.country.verita >= 60) return "«C'è troppa luce su certe pratiche. Non mi faccia pensare che venga da questo ufficio.»";
  return "«Niente di eclatante oggi. È così che si fa carriera: senza farsi notare.»";
}

export function DaySummaryScreen() {
  const game = useGameStore((s) => s.game);
  const continueSummary = useGameStore((s) => s.continueSummary);
  const summary = game.lastSummary;
  if (!summary) return null;

  const dayLog = game.log.filter((l) => l.day === summary.day);
  const net = summary.pay - summary.penalty - summary.fines;
  const todayCitations = game.citations.filter((c) => c.day === summary.day && c.visibleToPlayer);
  const hasEnding = !!game.endingId;
  // la scheda completa esce a cadenza (ogni 5 giorni) o all'ultima giornata
  const fullReadout = summary.day % 5 === 0 || hasEnding || summary.day >= LAST_DAY;

  return (
    <div className="h-full w-full tex-wood flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div className="max-w-2xl w-full relative">
        <div className="rds-paper p-6 animate-slideUp">
          <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-3">RESOCONTO · FINE GIORNO {summary.day}</div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/[0.05] border-2 border-ink/20 p-2">
              <div className="font-pixel text-[7px] uppercase tracking-wider text-ink/60">Pratiche evase</div>
              <div className="font-read text-xl text-ink">{summary.processedCount} <span className="text-ink/50 text-sm">/ quota {summary.quota}</span></div>
            </div>
            <div className="bg-black/[0.05] border-2 border-ink/20 p-2">
              <div className="font-pixel text-[7px] uppercase tracking-wider text-ink/60">Compenso</div>
              <div className="font-read text-xl text-ink">₤ {formatLire(net)}</div>
              {summary.penalty > 0 && <div className="text-stamp-red font-read text-[11px]">quota mancata ₤ {formatLire(summary.penalty)}</div>}
              {summary.fines > 0 && <div className="text-stamp-red font-read text-[11px]">multe ₤ {formatLire(summary.fines)}</div>}
            </div>
          </div>

          {todayCitations.length > 0 && (
            <div className="bg-black/[0.05] border-2 border-stamp-red/40 p-3 mb-4">
              <div className="font-pixel text-[7px] uppercase tracking-widest text-stamp-red mb-2">
                Richiami procedurali ({todayCitations.length})
              </div>
              <ul className="font-read text-[12px] text-ink/80 space-y-1 leading-snug">
                {todayCitations.map((c) => (
                  <li key={c.id}>
                    — {c.reason} <span className="text-stamp-red">(₤ {formatLire(c.fine)})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-3">
            {summary.notes.map((n, i) => (<p key={i} className="font-read text-[14px] text-ink/90 italic leading-snug">{n}</p>))}
          </div>

          {/* scheda fazioni — compatta ogni giorno */}
          <div className="bg-black/[0.05] border-2 border-ink/20 p-2 mb-3">
            <div className="font-pixel text-[7px] uppercase tracking-widest text-ink/60 mb-1.5">Rapporti con gli apparati</div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
              {CORE_FACTIONS.map((id) => {
                const rep = game.factions[id].reputation;
                const c = rep >= 20 ? "text-stamp-green" : rep <= -20 ? "text-stamp-red" : "text-ink/60";
                return (
                  <div key={id} className="flex items-center gap-1.5">
                    <FactionEmblem faction={id} size={22} />
                    <span className="font-read text-[11px] text-ink/80 truncate flex-1">{FACTIONS[id].sigla}</span>
                    <span className={`font-term text-[13px] ${c}`}>{rep > 0 ? `+${rep}` : rep}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SCHEDA RISERVATA — esce a cadenza: l'utente capisce come è messo */}
          {fullReadout && (
            <div className="border-2 border-ink/30 bg-ink/[0.05] p-3 mb-4">
              <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-2.5">
                Scheda riservata · stato del funzionario
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <div>
                  <div className="font-pixel text-[7px] uppercase tracking-widest text-ink/55 mb-1">Rapporto personale</div>
                  <div className="space-y-1.5">
                    <PaperGauge label="Famiglia" value={game.player.famiglia} color="#53701b" />
                    <PaperGauge label="Lucidità" value={game.player.lucidita} color="#3f7d72" />
                    <PaperGauge label="Sorveglianza" value={game.player.sospetto} color="#b42b2b" />
                  </div>
                </div>
                <div>
                  <div className="font-pixel text-[7px] uppercase tracking-widest text-ink/55 mb-1">Bollettino interno</div>
                  <div className="space-y-1.5">
                    <PaperGauge label="Repressione" value={game.country.repressione} color="#b42b2b" />
                    <PaperGauge label="Caos" value={game.country.caos} color="#9a6b30" />
                    <PaperGauge label="Verità pubblica" value={game.country.verita} color="#3f7d72" />
                    <PaperGauge label="Compromesso" value={game.country.compromesso} color="#9c7f4f" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* nota del superiore */}
          <div className="border-l-4 border-stamp-red/60 bg-ink/[0.04] pl-3 py-2 mb-4">
            <div className="font-pixel text-[7px] uppercase tracking-widest text-stamp-red mb-0.5">Nota a margine — il superiore</div>
            <p className="font-read text-[13px] text-ink/90 italic leading-snug">{superiorNote(game, todayCitations.length)}</p>
          </div>

          {dayLog.length > 0 && (
            <div className="bg-black/[0.05] border-2 border-ink/20 p-3 mb-4">
              <div className="font-pixel text-[7px] uppercase tracking-widest text-ink/60 mb-2">Diario della giornata</div>
              <ul className="font-read text-[12px] text-ink/80 space-y-1 leading-snug">
                {dayLog.map((l, i) => (<li key={i}>— {l.title}</li>))}
              </ul>
            </div>
          )}

          {hasEnding && <Typewriter lines={["Qualcosa, stanotte, è arrivato al capolinea."]} speed={22} className="font-read text-stamp-red text-[14px] mb-3" />}

          <div className="flex justify-end">
            <button onClick={() => { playClick(); continueSummary(); }} className="rds-btn rds-btn--respinto px-5 py-2 text-[11px]">
              {hasEnding ? "Affronta le conseguenze »" : "Torna a casa »"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
