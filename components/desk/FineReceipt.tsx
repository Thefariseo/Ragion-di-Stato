"use client";

import { useEffect } from "react";
import type { Citation } from "@/types";
import { formatLire } from "@/lib/format";
import { playDrawer } from "@/lib/sfx";

/**
 * Ammenda a scontrino: esce da sotto la scrivania SOLO in caso di errore
 * procedurale grave. Niente esito dopo ogni operazione — solo il rimprovero,
 * battuto a macchina e annotato agli atti.
 */
export function FineReceipt({ citation, onClose }: { citation: Citation; onClose: () => void }) {
  useEffect(() => {
    playDrawer();
    const t = setTimeout(onClose, 6500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 cursor-pointer" onClick={onClose}>
      <div className="rds-receipt rds-paper rds-paper--white w-[260px] px-3 pt-2 pb-3 origin-bottom" style={{ boxShadow: "0 -6px 18px rgba(0,0,0,0.5)" }}>
        {/* bordo dentellato superiore */}
        <div
          className="h-1.5 -mx-3 -mt-2 mb-1.5"
          style={{ backgroundImage: "radial-gradient(circle at 4px 0, transparent 4px, var(--paper-cream) 4px)", backgroundSize: "8px 8px" }}
        />
        <div className="text-center font-pixel text-[7px] uppercase tracking-widest text-ink/70">Ministero dell'Interno</div>
        <div className="text-center font-pixel text-[10px] uppercase tracking-[0.2em] text-stamp-red border-y border-dashed border-ink/40 py-1 my-1">
          {citation.severity === "grave" ? "Nota disciplinare" : "Richiamo"}
        </div>
        <p className="font-term text-[13px] text-ink leading-snug text-center my-2">{citation.reason}</p>
        <div className="flex justify-between font-term text-[13px] text-ink border-t border-dashed border-ink/40 pt-1">
          <span>AMMENDA</span>
          <span className="text-stamp-red">₤ {formatLire(citation.fine)}</span>
        </div>
        {/* finto codice a barre */}
        <div className="flex gap-px justify-center mt-2 h-4 items-end">
          {Array.from({ length: 34 }).map((_, i) => (
            <span key={i} className="bg-ink" style={{ width: 1 + ((i * 7) % 3), height: `${50 + ((i * 13) % 50)}%` }} />
          ))}
        </div>
        <div className="text-center font-pixel text-[6px] uppercase tracking-wider text-ink/50 mt-1">trattenuta a fine giornata · annotato agli atti</div>
      </div>
    </div>
  );
}
