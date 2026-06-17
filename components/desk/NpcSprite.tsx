"use client";

import { useEffect, useRef } from "react";
import { drawFace } from "./face";

/**
 * Figura pixel (busto) del richiedente allo sportello, in stile Papers, Please:
 * incarnato desaturato, illuminazione laterale, abiti d'epoca. Entra ("npcEnter")
 * e respira ("idleBob"). Risoluzione nativa bassa, scalata pixelated.
 */
export function NpcSprite({ seed, width = 104 }: { seed: number; width?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 72;
  const H = 94;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    drawFace(ctx, W, H, seed);
  }, [seed]);

  return (
    <div className="animate-npcEnter">
      <div className="animate-idleBob">
        <canvas
          ref={ref}
          width={W}
          height={H}
          className="foto block"
          style={{ width, height: Math.round((width * H) / W), border: "none", boxShadow: "none" }}
        />
      </div>
    </div>
  );
}
