"use client";

import { useEffect, useRef } from "react";

/**
 * Scena dello sportello disegnata a risoluzione nativa bassa (pixelated):
 * un corridoio ministeriale cupo oltre il vetro — pavimento in prospettiva,
 * porta illuminata, emblema e bandiera alla parete, neon, coda di sagome.
 * Deterministica, originale.
 */
export function BoothScene() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 240;
  const H = 116;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const px = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    };

    const horizon = H * 0.6;
    // parete di fondo
    px(0, 0, W, horizon, "#2c3227");
    px(0, 0, W, horizon * 0.5, "#262b20");
    // pavimento
    px(0, horizon, W, H - horizon, "#3a3327");
    // fughe del pavimento in prospettiva
    ctx.strokeStyle = "#2c2820";
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + i * 8, horizon);
      ctx.lineTo(W / 2 + i * 40, H);
      ctx.stroke();
    }
    for (let j = 1; j <= 4; j++) {
      const y = horizon + (H - horizon) * (j / 5) ** 1.6;
      px(0, y, W, 1, "#2c2820");
    }

    // porta illuminata in fondo
    const dW = 26;
    const dH = horizon * 0.62;
    px(W / 2 - dW / 2, horizon - dH, dW, dH, "#0f120c");
    px(W / 2 - dW / 2 + 3, horizon - dH + 3, dW - 6, dH - 4, "#7d7a4a");
    px(W / 2 - dW / 2 + 3, horizon - dH + 3, dW - 6, dH - 4, "rgba(180,170,110,0.5)");
    // alone di luce sul pavimento
    const grd = ctx.createLinearGradient(0, horizon, 0, H);
    grd.addColorStop(0, "rgba(190,180,120,0.18)");
    grd.addColorStop(1, "rgba(190,180,120,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(W / 2 - 22, horizon, 44, H - horizon);

    // quadro/emblema alla parete (sinistra)
    px(34, 14, 26, 30, "#1d1a14");
    px(37, 17, 20, 24, "#454b3a");
    px(45, 22, 4, 4, "#9a6b30");
    px(43, 27, 8, 9, "#9a6b30");
    // bandiera (destra)
    px(196, 10, 2, 40, "#15140f");
    px(198, 10, 26, 16, "#7c241c");
    px(198, 10, 26, 5, "#8e2c22");

    // neon appeso
    px(W / 2 - 34, 6, 68, 3, "#cfe7dd");
    const glow = ctx.createRadialGradient(W / 2, 8, 2, W / 2, 8, 50);
    glow.addColorStop(0, "rgba(143,185,173,0.4)");
    glow.addColorStop(1, "rgba(143,185,173,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(W / 2 - 50, 0, 100, 36);

    // coda di sagome (verso destra/sportello), con profondità
    const figs = [
      [150, 1.0], [168, 0.92], [184, 0.84], [120, 0.78], [104, 0.66], [206, 0.7],
    ] as const;
    for (const [x, s] of figs) {
      const fh = 46 * s;
      const fw = 12 * s;
      const baseY = horizon + (H - horizon) * (1 - s) * 0.7 + 6;
      px(x - fw / 2, baseY - fh, fw, fh, "#0e0f0a");
      px(x - fw * 0.35, baseY - fh - fw * 0.7, fw * 0.7, fw * 0.7, "#0e0f0a"); // testa
    }

    // grana
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="absolute inset-0 w-full h-full pixelated"
      style={{ imageRendering: "pixelated", objectFit: "cover" }}
      aria-hidden
    />
  );
}
