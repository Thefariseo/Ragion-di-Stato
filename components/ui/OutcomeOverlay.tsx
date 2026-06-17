"use client";

import { Typewriter } from "./Typewriter";
import { Stamp } from "./Stamp";

/**
 * L'esito di una decisione, reso come oggetto fisico: una nota d'archivio
 * battuta a macchina, timbrata, da mettere via. Il "beat" tra il timbro e il
 * caso successivo.
 */
export function OutcomeOverlay({
  title,
  text,
  onContinue,
}: {
  title?: string;
  text: string;
  onContinue: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-6">
      <div className="rds-paper rds-paper--white max-w-xl w-full p-5 animate-slideUp relative overflow-hidden">
        <div className="absolute -top-1 -right-1 rotate-6 opacity-90">
          <Stamp label="ARCHIVIATO" rotate={6} />
        </div>
        <div className="rds-classified font-pixel text-[8px] tracking-[0.25em] text-center py-1 mb-3">
          NOTA D'ARCHIVIO · ESITO
        </div>
        {title && (
          <div className="font-pixel uppercase text-[11px] text-ink mb-2 border-b border-ink/25 pb-1">
            Pratica: {title}
          </div>
        )}
        <Typewriter lines={text.split("\n")} speed={12} className="font-read text-[16px] text-ink leading-relaxed" />
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-ink/20 pt-2">
          <span className="font-term text-[12px] text-ink/50">prot. interno · annotato agli atti</span>
          <button onClick={onContinue} className="rds-btn px-5 py-2 text-[12px]">Riponi »</button>
        </div>
      </div>
    </div>
  );
}
