"use client";

import type { ActionKind } from "@/types";

const KIND_CLASS: Record<string, string> = {
  approva: "stamp-approvato",
  respingi: "stamp-respinto",
  segnala: "stamp-segnalato",
};

function classForLabel(label: string, kind?: ActionKind): string {
  if (kind && KIND_CLASS[kind]) return KIND_CLASS[kind];
  const l = label.toUpperCase();
  if (l.includes("APPROV")) return "stamp-approvato";
  if (l.includes("RESPINT") || l.includes("NON ESIB")) return "stamp-respinto";
  if (l.includes("SEGNAL")) return "stamp-segnalato";
  return "stamp-neutral";
}

export function Stamp({
  label,
  kind,
  big,
  rotate = -8,
}: {
  label: string;
  kind?: ActionKind;
  big?: boolean;
  rotate?: number;
}) {
  const style: React.CSSProperties = { transform: `rotate(${rotate}deg)` };
  (style as Record<string, string>)["--rot"] = `${rotate}deg`;

  return (
    <span
      className={`stamp ${classForLabel(label, kind)} ${
        big ? "text-5xl px-4 py-2" : "text-[11px]"
      }`}
      style={style}
    >
      {label}
    </span>
  );
}
