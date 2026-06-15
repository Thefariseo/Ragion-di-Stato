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
              {summary.penalty > 0 && <div className="text-stamp-red font-read text-[11px]">sanzione ₤ {formatLire(summary.penalty)}</div>}
            </div>
          </div>

          <div className="mb-4">
            {summary.notes.map((n, i) => (<p key={i} className="font-read text-[14px] text-ink/90 italic leading-snug">{n}</p>))}
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
