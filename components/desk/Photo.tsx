"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";

/**
 * Fototessera sgranata generata in modo deterministico dal seed.
 * Una silhouette "da archivio": volto scuro, fondo chiaro, grana.
 */
export function Photo({
  seed,
  label,
  size = 92,
}: {
  seed: number;
  label?: string;
  size?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const rng = makeRng(seed);
    const W = cv.width;
    const H = cv.height;

    // fondo carta chiara
    const bg = 180 + rng.int(-12, 18);
    ctx.fillStyle = `rgb(${bg},${bg - 14},${bg - 40})`;
    ctx.fillRect(0, 0, W, H);

    // spalle
    const sk = 70 + rng.int(-18, 24);
    ctx.fillStyle = `rgb(${sk},${sk - 12},${sk - 18})`;
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 1.15, W * 0.55, H * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // testa
    const headY = H * (0.46 + rng.next() * 0.05);
    const headR = W * (0.27 + rng.next() * 0.05);
    ctx.fillStyle = `rgb(${sk + 12},${sk},${sk - 8})`;
    ctx.beginPath();
    ctx.ellipse(W / 2, headY, headR * 0.86, headR, 0, 0, Math.PI * 2);
    ctx.fill();

    // capelli
    ctx.fillStyle = `rgb(${30 + rng.int(0, 30)},${24 + rng.int(0, 20)},${18})`;
    ctx.beginPath();
    ctx.ellipse(W / 2, headY - headR * 0.5, headR * 0.95, headR * 0.7, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // grana
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rng.next() - 0.5) * 60;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }, [seed]);

  return (
    <div className="inline-block bg-black/20 p-1 border border-black/40 shadow">
      <canvas
        ref={ref}
        width={size}
        height={Math.round(size * 1.2)}
        className="foto block"
        style={{ width: size, height: Math.round(size * 1.2) }}
      />
      {label && (
        <div className="text-center text-[8px] uppercase tracking-wider text-inchiostro/70 mt-0.5">
          fototessera
        </div>
      )}
    </div>
  );
}
