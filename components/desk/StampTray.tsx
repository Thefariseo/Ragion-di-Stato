"use client";

import { useState } from "react";
import type { CaseAction } from "@/types";
import type { ActionItem } from "./ActionBar";
import { playDrawer } from "@/lib/sfx";

const DEFAULT_STAMP: Record<string, string> = {
  approva: "APPROVATO",
  respingi: "RESPINTO",
  segnala: "SEGNALATO",
  archivia: "ARCHIVIATO",
};

function inkColor(a: CaseAction, display?: string): string {
  if (display === "accetta") return "#86b42b";
  if (display === "rifiuta") return "#b42b2b";
  if (display === "arresta") return "#ca9038";
  const l = (a.stampLabel ?? a.kind).toUpperCase();
  if (a.kind === "approva" || l.includes("APPROV")) return "#86b42b";
  if (a.kind === "respingi" || l.includes("RESPINT") || l.includes("NON ESIB")) return "#b42b2b";
  if (a.kind === "segnala" || l.includes("SEGNAL")) return "#ca9038";
  return "#9aa6c4";
}

type TrayItem = ActionItem & { display?: string };

/**
 * La RASTRELLIERA DEI TIMBRI, come in Papers, Please: una maniglia sopra la
 * scrivania; la tiri e cala la barra coi timbri di gomma GRANDI. Clicchi un
 * timbro → slam sul documento. Un timbro non giustificato resta appeso,
 * ingrigito, col motivo. Niente bottoni web: legno, ottone, gomma.
 */
export function StampTray({
  items,
  disabled,
  onStamp,
}: {
  items: TrayItem[];
  disabled?: boolean;
  onStamp: (a: CaseAction) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 inset-x-0 z-[26] pointer-events-none flex justify-center">
      <div
        className="pointer-events-auto flex flex-col items-center transition-transform duration-200"
        style={{
          transform: open ? "translateY(0)" : "translateY(calc(-100% + 30px))",
          transitionTimingFunction: "steps(5, end)",
        }}
      >
        {/* barra dei timbri */}
        <div className="bg-[#241f17] border-4 border-black border-t-0 px-4 pt-2 pb-4 shadow-[0_10px_24px_rgba(0,0,0,0.7)] flex items-end gap-4">
          {items.length === 0 && (
            <div className="font-pixel text-[9px] uppercase tracking-widest text-paper/50 px-6 py-6">
              Nessun verdetto a timbro per questa pratica
            </div>
          )}
          {items.map(({ action: a, available, reason, display }) => (
            <button
              key={a.id}
              disabled={disabled || !available}
              onClick={() => {
                setOpen(false);
                onStamp(a);
              }}
              title={available ? a.hint : reason}
              className="group relative flex flex-col items-center disabled:cursor-not-allowed"
            >
              {/* manico di legno */}
              <div
                className={`w-7 h-9 border-2 border-black ${available ? "bg-wood-hi" : "bg-[#3a352c]"}`}
                style={{ clipPath: "polygon(25% 0, 75% 0, 100% 100%, 0 100%)" }}
              />
              <div className={`w-12 h-3 border-2 border-black -mt-0.5 ${available ? "bg-wood" : "bg-[#2c2822]"}`} />
              {/* corpo di gomma con targhetta: la PROCEDURA in grande */}
              <div
                className={`w-24 h-14 border-2 border-black flex flex-col items-center justify-center px-1 transition-transform ${
                  available ? "bg-[#171410] group-hover:translate-y-1 group-active:translate-y-3" : "bg-[#14120e] opacity-60"
                }`}
              >
                <span
                  className="font-pixel text-[13px] leading-tight text-center uppercase"
                  style={{ color: available ? inkColor(a, display) : "#5c584e" }}
                >
                  {display && display !== "speciale" ? display : (a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? a.label)}
                </span>
                <span className="font-read text-[8px] uppercase tracking-wider text-paper/45 leading-none mt-0.5">
                  {a.stampLabel ?? DEFAULT_STAMP[a.kind] ?? ""}
                </span>
              </div>
              {!available && reason && (
                <span className="absolute top-full mt-1 w-36 z-10 font-read text-[10px] leading-tight text-ochre bg-black/85 border border-black px-1 py-0.5 opacity-0 group-hover:opacity-100">
                  {reason}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* maniglia (resta visibile a barra chiusa) */}
        <button
          onClick={() => {
            playDrawer();
            setOpen((v) => !v);
          }}
          className="flex flex-col items-center -mt-1"
          title="Rastrelliera dei timbri"
        >
          <div className="w-1.5 h-3 bg-[#4a443a] border-x-2 border-black" />
          <div className="bg-[#2c2822] border-2 border-black px-3 py-0.5 shadow-[0_4px_0_rgba(0,0,0,0.6)] hover:bg-[#3a352c]">
            <span className="font-pixel text-[9px] uppercase tracking-widest text-tan-hi">{open ? "▲" : "▼"} Timbri</span>
          </div>
        </button>
      </div>
    </div>
  );
}
