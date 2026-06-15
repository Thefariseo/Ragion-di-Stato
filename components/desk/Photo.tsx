"use client";

import { useEffect, useRef } from "react";
import { drawFace } from "./face";

/** Fototessera sui documenti: volto pixel ~3:4, nativo basso scalato pixelated. */
export function Photo({ seed, width = 60 }: { seed: number; label?: string; width?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 48;
  const H = 60;

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
