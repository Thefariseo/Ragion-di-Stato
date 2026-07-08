"use client";

import { useGameStore } from "@/store/gameStore";
import { formatLire } from "@/lib/format";
import { FACTIONS, CORE_FACTIONS } from "@/data/factions";
import { LAST_DAY } from "@/data/days";
import { FactionEmblem } from "@/components/desk/FactionEmblem";
import { playClick } from "@/lib/sfx";
import type { GameState } from "@/types";

function superiorNote(g: GameState, cits: number): string {
  if (g.player.sospetto >= 70) return "«Il suo nome ricorre troppo spesso, funzionario. Gli Affari Interni la cercano.»";
  if (cits >= 2) return "«Troppi errori. Un'altra giornata così e parleremo del suo trasferimento.»";
  if (g.player.sospetto >= 45) return "«Qualcuno ai piani alti ha chiesto di lei. Stia attento a cosa firma.»";
  if (g.country.verita >= 60) return "«C'è troppa luce su certe pratiche. Non mi faccia pensare che venga da questo ufficio.»";
  return "«Niente di eclatante oggi. È così che si fa carriera: senza farsi notare.»";
}

/** riga di conto: etichetta a sinistra, importo a destra. */
function Line({ label, value, strong, red, green }: { label: string; value: string; strong?: boolean; red?: boolean; green?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between ${strong ? "border-t-2 border-ink/50 pt-1.5 mt-1" : ""}`}>
      <span className={`${strong ? "font-pixel text-[11px] uppercase tracking-widest text-ink" : "font-read text-[14px] text-ink/75"}`}>{label}</span>
      <span
        className={`font-term ${strong ? "text-[26px]" : "text-[17px]"} leading-none ${red ? "text-stamp-red" : green ? "text-stamp-green" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}

/** mini-barra su carta, solo per la scheda a cadenza. */
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

/**
 * RESOCONTO — semplice, visivo, gerarchico:
 * 1) ESITO: pratiche · errori · paga · trattenute · SALDO (grande).
 * 2) DA RICORDARE: al massimo tre fatti del giorno + la voce del superiore.
 * La Scheda riservata completa esce solo a cadenza (ogni 5 giorni / finale).
 * L'allocazione delle risorse avviene subito dopo, nella schermata della notte.
 */
export function DaySummaryScreen() {
  const game = useGameStore((s) => s.game);
  const continueSummary = useGameStore((s) => s.continueSummary);
  const summary = game.lastSummary;
  if (!summary) return null;

  const dayLog = game.log.filter((l) => l.day === summary.day);
  const net = summary.pay - summary.penalty - summary.fines;
  const todayCitations = game.citations.filter((c) => c.day === summary.day && c.visibleToPlayer);
  const hasEnding = !!game.endingId;
  const fullReadout = summary.day % 5 === 0 || hasEnding || summary.day >= LAST_DAY;
  const trattenute = summary.penalty + summary.fines;

  return (
    <div className="h-full w-full tex-wood flex items-start justify-center p-6 relative overflow-y-auto thin-scroll">
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div className="max-w-xl w-full relative my-auto">
        <div className="rds-paper p-6 animate-slideUp">
          <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-4">
            RESOCONTO · FINE GIORNO {summary.day}
          </div>

          {/* 1 · ESITO — il conto, leggibile in tre secondi */}
          <div className="space-y-1.5 mb-5">
            <Line label={`Pratiche evase (quota ${summary.quota})`} value={`${summary.processedCount}`} />
            <Line label={`Errori e richiami`} value={`${todayCitations.length}`} red={todayCitations.length > 0} />
            <Line label="Paga" value={`+ ₤ ${formatLire(summary.pay)}`} green />
            {trattenute > 0 && <Line label="Trattenute (quota mancata, ammende)" value={`− ₤ ${formatLire(trattenute)}`} red />}
            <Line label="Saldo del giorno" value={`₤ ${formatLire(net)}`} strong red={net < 0} green={net >= 0} />
          </div>

          {/* errore più grave, una riga sola */}
          {todayCitations.length > 0 && (
            <p className="font-read text-[12px] text-stamp-red/90 leading-snug mb-4 border-l-4 border-stamp-red/50 pl-2">
              {todayCitations[0]!.reason}
              {todayCitations.length > 1 ? ` (+${todayCitations.length - 1} altri richiami)` : ""}
            </p>
          )}

          {/* 2 · DA RICORDARE — massimo tre fatti + la voce del superiore */}
          {(dayLog.length > 0 || true) && (
            <div className="mb-5">
              <div className="font-pixel text-[8px] uppercase tracking-widest text-ink/55 border-b border-ink/25 pb-1 mb-2">
                Da ricordare
              </div>
              <ul className="font-read text-[13.5px] text-ink/85 space-y-1 leading-snug">
                {dayLog.slice(0, 3).map((l, i) => (
                  <li key={i}>— {l.title}</li>
                ))}
                {dayLog.length === 0 && <li className="text-ink/50">— Una giornata di ordinaria amministrazione.</li>}
              </ul>
              <p className="font-read text-[13px] text-ink/70 italic leading-snug mt-2.5">
                Il superiore: {superiorNote(game, todayCitations.length)}
              </p>
            </div>
          )}

          {/* 3 · SCHEDA RISERVATA — solo a cadenza: lo stato profondo della run */}
          {fullReadout && (
            <div className="border-2 border-ink/30 bg-ink/[0.05] p-3 mb-5">
              <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-2.5">
                Scheda riservata · stato del funzionario
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2 mb-2.5">
                <div className="space-y-1.5">
                  <PaperGauge label="Famiglia" value={game.player.famiglia} color="#53701b" />
                  <PaperGauge label="Lucidità" value={game.player.lucidita} color="#3f7d72" />
                  <PaperGauge label="Sorveglianza" value={game.player.sospetto} color="#b42b2b" />
                </div>
                <div className="space-y-1.5">
                  <PaperGauge label="Repressione" value={game.country.repressione} color="#b42b2b" />
                  <PaperGauge label="Caos" value={game.country.caos} color="#9a6b30" />
                  <PaperGauge label="Verità pubblica" value={game.country.verita} color="#3f7d72" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1.5 border-t border-ink/20">
                {CORE_FACTIONS.map((id) => {
                  const rep = game.factions[id].reputation;
                  const c = rep >= 20 ? "text-stamp-green" : rep <= -20 ? "text-stamp-red" : "text-ink/60";
                  return (
                    <span key={id} className="flex items-center gap-1" title={FACTIONS[id].name}>
                      <FactionEmblem faction={id} size={18} />
                      <span className={`font-term text-[12px] ${c}`}>{rep > 0 ? `+${rep}` : rep}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {hasEnding && (
            <p className="font-read text-stamp-red text-[14px] mb-4">Qualcosa, stanotte, è arrivato al capolinea.</p>
          )}

          {/* CTA: si va a casa, dove il saldo si ALLOCA (affitto, cibo, medicine) */}
          <div className="sticky bottom-0 flex items-center justify-between pt-3 -mx-6 px-6 -mb-6 pb-3 bg-paper-cream border-t-2 border-ink/20">
            <span className="font-read text-[12px] text-ink/55">
              {hasEnding ? "" : "A casa deciderai come spendere il saldo."}
            </span>
            <button onClick={() => { playClick(); continueSummary(); }} className="rds-btn rds-btn--respinto px-5 py-2.5 text-[12px]">
              {hasEnding ? "Affronta le conseguenze »" : "Torna a casa »"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
