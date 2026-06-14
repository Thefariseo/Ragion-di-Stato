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
    <div className="scrivania h-full w-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="paper paper-edge p-6 animate-slideIn">
          <div className="font-stencil uppercase tracking-widest text-rossomin text-lg border-b border-black/30 pb-1 mb-3">
            Resoconto — fine Giorno {summary.day}
          </div>

          <div className="grid grid-cols-2 gap-3 font-typewriter text-sm text-inchiostro mb-4">
            <div className="bg-black/5 border border-black/20 p-2">
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/60">
                Pratiche evase
              </div>
              <div className="text-xl">
                {summary.processedCount}{" "}
                <span className="text-inchiostro/50 text-sm">/ quota {summary.quota}</span>
              </div>
            </div>
            <div className="bg-black/5 border border-black/20 p-2">
              <div className="text-[10px] uppercase tracking-wider text-inchiostro/60">
                Compenso del giorno
              </div>
              <div className="text-xl">₤ {formatLire(net)}</div>
              {summary.penalty > 0 && (
                <div className="text-rossomin text-[11px]">
                  (sanzione ₤ {formatLire(summary.penalty)})
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            {summary.notes.map((n, i) => (
              <p key={i} className="font-doc text-[15px] text-inchiostro/90 italic">
                {n}
              </p>
            ))}
          </div>

          {dayLog.length > 0 && (
            <div className="bg-black/5 border border-black/20 p-3 mb-4">
              <div className="text-[10px] uppercase tracking-widest text-inchiostro/60 mb-2">
                Diario della giornata
              </div>
              <ul className="font-typewriter text-[12px] text-inchiostro/80 space-y-1">
                {dayLog.map((l, i) => (
                  <li key={i}>— {l.title}</li>
                ))}
              </ul>
            </div>
          )}

          {hasEnding ? (
            <Typewriter
              lines={["Qualcosa, stanotte, è arrivato al capolinea."]}
              speed={20}
              className="font-doc text-rossomin text-[15px] mb-3"
            />
          ) : null}

          <div className="flex justify-end">
            <button
              onClick={() => {
                playClick();
                continueSummary();
              }}
              className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-6 py-2 hover:bg-rossomin transition-colors"
            >
              {hasEnding ? "Affronta le conseguenze »" : "Torna a casa »"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
