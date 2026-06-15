"use client";

/** Piccolo emblema ministeriale stilizzato (originale, non storico). */
export function Emblem({ size = 26, color = "#5a4632" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <g fill="none" stroke={color} strokeWidth="1.4">
        <path d="M12 2 L19 5 V11 C19 16 16 19 12 22 C8 19 5 16 5 11 V5 Z" />
        <path d="M12 6 V18" />
        <path d="M8 9 H16" />
        <path d="M8.5 13 H15.5" />
      </g>
      <circle cx="12" cy="4.4" r="1.1" fill={color} />
    </svg>
  );
}
