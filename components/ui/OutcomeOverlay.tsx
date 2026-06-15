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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 p-6">
      <div className="rds-paper max-w-xl w-full p-5 animate-slideUp">
        <div className="rds-classified font-stencil text-[10px] tracking-[0.3em] text-center py-0.5 mb-3">
          E S I T O
        </div>
        {title && (
          <div className="font-stencil uppercase tracking-widest text-ink text-sm mb-2">{title}</div>
        )}
        <Typewriter
          lines={text.split("\n")}
          speed={12}
          className="font-type text-[16px] text-ink leading-relaxed"
        />
        <div className="mt-5 flex justify-end">
          <button onClick={onContinue} className="rds-btn px-5 py-2 text-sm">
            Avanti »
          </button>
        </div>
      </div>
    </div>
  );
}
