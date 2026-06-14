"use client";

import { Typewriter } from "./Typewriter";

/**
 * L'esito di una decisione: il "beat" tra il timbro e il caso successivo.
 * Mostra il testo della conseguenza prima di far avanzare il motore.
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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-6">
      <div className="paper paper-edge max-w-xl w-full p-6 animate-slideIn">
        {title && (
          <div className="font-stencil uppercase tracking-widest text-rossomin text-sm border-b border-black/30 pb-1 mb-3">
            {title}
          </div>
        )}
        <Typewriter
          lines={text.split("\n")}
          speed={12}
          className="font-doc text-lg text-inchiostro"
        />
        <div className="mt-5 flex justify-end">
          <button
            onClick={onContinue}
            className="font-stencil uppercase tracking-widest text-sm bg-inchiostro text-carta px-5 py-2 hover:bg-rossomin transition-colors"
          >
            Avanti »
          </button>
        </div>
      </div>
    </div>
  );
}
