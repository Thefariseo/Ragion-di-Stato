"use client";

import { Typewriter } from "./Typewriter";

/** L'esito di una decisione: il "beat" tra il timbro e il caso successivo. */
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
      <div className="rds-paper max-w-xl w-full p-5 animate-slideUp">
        <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-3">ESITO</div>
        {title && <div className="font-pixel uppercase text-[11px] text-ink mb-2">{title}</div>}
        <Typewriter lines={text.split("\n")} speed={12} className="font-read text-[15px] text-ink leading-relaxed" />
        <div className="mt-4 flex justify-end">
          <button onClick={onContinue} className="rds-btn px-5 py-2 text-[11px]">Avanti »</button>
        </div>
      </div>
    </div>
  );
}
