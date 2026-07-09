"use client";

import { useEffect, useRef } from "react";
import { hashStr } from "@/lib/rng";
import { drawFace } from "./face";

/** Ritratto pixel del richiedente (risoluzione nativa bassa, scalata pixelated). */
export function ApplicantPortrait({ seed, width = 128 }: { seed: number; width?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 64;
  const H = 80;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    drawFace(ctx, W, H, seed);
  }, [seed]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="foto block"
      style={{ width, height: Math.round((width * H) / W) }}
    />
  );
}

export function portraitSeed(s: string): number {
  return hashStr(s);
}
