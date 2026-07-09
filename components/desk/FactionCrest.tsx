"use client";

import { FACTIONS } from "@/data/factions";
import { factionIdentity, factionColor } from "@/data/factionIdentity";
import { FactionEmblem } from "./FactionEmblem";
import type { FactionId } from "@/types";

/**
 * CRESTA di fazione: lo stemma grande con sigla, nome e leitmotiv su carta
 * intestata propria (banda + pattern + colore istituzionale). È il biglietto da
 * visita dell'ente — usato nelle mini-cutscene di presentazione e sui dossier.
 */
export function FactionCrest({
  faction,
  size = 84,
  motto = true,
}: {
  faction: FactionId;
  size?: number;
  motto?: boolean;
}) {
  const f = FACTIONS[faction];
  const ident = factionIdentity(faction);
  const color = factionColor(faction);

  return (
    <div
      className="relative inline-flex flex-col items-center px-5 pt-4 pb-3 border-2 shadow-[5px_6px_0_rgba(0,0,0,0.55)]"
      style={{ backgroundColor: ident.paper, borderColor: ident.band, backgroundImage: ident.pattern }}
    >
      {/* filo istituzionale */}
      <span className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />
      {/* sigla in alto a destra */}
      <span
        className="absolute top-2 right-2 font-pixel text-[10px] uppercase tracking-widest px-1 leading-none border"
        style={{ color: ident.band, borderColor: color }}
      >
        {f.sigla}
      </span>

      <div className="mt-1.5 mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
        <FactionEmblem faction={faction} size={size} />
      </div>

      <div
        className={`font-pixel uppercase text-center leading-tight ${ident.tone === "stencil" ? "tracking-[0.18em]" : "tracking-wider"}`}
        style={{ color: ident.band, fontSize: Math.max(11, size * 0.16) }}
      >
        {f.name}
      </div>

      {motto && (
        <div
          className={`mt-1 text-center max-w-[22ch] leading-snug ${ident.tone === "press" ? "font-pixel uppercase text-[9px] tracking-wide" : "font-read italic text-[12px]"}`}
          style={{ color: ident.ink, opacity: 0.85 }}
        >
          «{ident.motto}»
        </div>
      )}
    </div>
  );
}
