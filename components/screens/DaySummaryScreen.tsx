"use client";

import { useGameStore } from "@/store/gameStore";
import { formatLire } from "@/lib/format";
import { Typewriter } from "@/components/ui/Typewriter";
import { playClick } from "@/lib/sfx";

export function DaySummaryScreen() {
  const game = useGameStore((s) => s.game);
  const continueSummary = useGameStore((s) => s.continueSummary);
  const summary = game.lastSummary;
  if (!summary) return null;

  const dayLog = game.log.filter((l) => l.day === summary.day);
  const net = summary.pay - summary.penalty;
  const hasEnding = !!game.endingId;

  return (
    <div className="h-full w-full tex-felt flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="max-w-2xl w-full relative">
        <div className="rds-paper p-6 animate-slideUp">
          <div className="rds-classified font-stencil text-[10px] tracking-[0.3em] text-center py-0.5 mb-3">
            R E S O C O N T O · F I N E G I O R N O {summary.day}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/[0.05] border border-ink/20 p-2">
              <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/60">Pratiche evase</div>
              <div className="font-type text-xl text-ink">
                {summary.processedCount}{" "}
                <span className="text-ink-soft/50 text-sm">/ quota {summary.quota}</span>
              </div>
            </div>
            <div className="bg-black/[0.05] border border-ink/20 p-2">
              <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/60">Compenso</div>
              <div className="font-type text-xl text-ink">₤ {formatLire(net)}</div>
              {summary.penalty > 0 && (
                <div className="text-rosso font-type text-[11px]">sanzione ₤ {formatLire(summary.penalty)}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            {summary.notes.map((n, i) => (
              <p key={i} className="font-type text-[14.5px] text-ink/90 italic">
                {n}
              </p>
            ))}
          </div>

          {dayLog.length > 0 && (
            <div className="bg-black/[0.05] border border-ink/20 p-3 mb-4">
              <div className="font-pixel text-[8px] uppercase tracking-widest text-ink-soft/60 mb-2">
                Diario della giornata
              </div>
              <ul className="font-type text-[12px] text-ink/80 space-y-1">
                {dayLog.map((l, i) => (
                  <li key={i}>— {l.title}</li>
                ))}
              </ul>
            </div>
          )}

          {hasEnding && (
            <Typewriter
              lines={["Qualcosa, stanotte, è arrivato al capolinea."]}
              speed={22}
              className="font-type text-rosso text-[14px] mb-3"
            />
          )}

          <div className="flex justify-end">
            <button onClick={() => { playClick(); continueSummary(); }} className="rds-btn rds-btn--rosso px-6 py-2 text-sm">
              {hasEnding ? "Affronta le conseguenze »" : "Torna a casa »"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
