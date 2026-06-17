"use client";

import type { ActionKind } from "@/types";

function variantFor(label: string, kind?: ActionKind): string {
  if (kind === "approva") return "rds-stamp--approvato";
  if (kind === "respingi") return "rds-stamp--respinto";
  if (kind === "segnala") return "rds-stamp--segnalato";
  const l = label.toUpperCase();
  if (l.includes("APPROV")) return "rds-stamp--approvato";
  if (l.includes("RESPINT") || l.includes("NON ESIB")) return "rds-stamp--respinto";
  if (l.includes("SEGNAL")) return "rds-stamp--segnalato";
  if (l.includes("RISERVAT") || l.includes("SEGRETO")) return "rds-stamp--respinto";
  return "rds-stamp--blu";
}

/** Impronta di timbro inchiostrato, irregolare e ruotata. */
export function Stamp({
  label,
  kind,
  big,
  rotate = -8,
  solid,
  color,
}: {
  label: string;
  kind?: ActionKind;
  big?: boolean;
  rotate?: number;
  /** rende il timbro pieno e vivido (per la battuta sul feltro scuro) */
  solid?: boolean;
  /** colore d'inchiostro personalizzato (timbri dedicati di fazione) */
  color?: string;
}) {
  const style: React.CSSProperties = { transform: `rotate(${rotate}deg)` };
  (style as Record<string, string>)["--rot"] = `${rotate}deg`;
  if (color) style.color = color;
  if (solid) {
    style.mixBlendMode = "normal";
    style.opacity = 1;
    style.background = "rgba(222,211,178,0.92)";
    style.boxShadow = "0 8px 24px rgba(0,0,0,0.6)";
  }
  return (
    <span
      className={`rds-stamp ${color ? "" : variantFor(label, kind)} ${
        big ? "text-5xl px-5 py-2" : "text-[11px]"
      }`}
      style={style}
    >
      {label}
    </span>
  );
}
