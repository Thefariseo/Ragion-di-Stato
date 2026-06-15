"use client";

import { useEffect, useRef } from "react";
import { makeRng, hashStr } from "@/lib/rng";

const SKIN = ["#9a7d63", "#86694f", "#a88665", "#6f5640", "#b08a6a"];
const HAIR = ["#241c14", "#352818", "#4e4234", "#11100d", "#6b6258"];
const COAT = ["#3f4a36", "#4a3a2a", "#414447", "#5a2a22", "#2c3340", "#5a4a2e"];

/**
 * Ritratto pixel del richiedente per lo sportello.
 * Deterministico dal seed: incarnato, capelli e cappotto da set limitati.
 * Disegnato a bassa risoluzione e scalato con image-rendering: pixelated.
 */
export function ApplicantPortrait({
  seed,
  width = 132,
}: {
  seed: number;
  width?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 66;
  const H = 82;
  const height = Math.round((width * H) / W);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const rng = makeRng(seed);
    const px = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
    };

    // fondo grigio + linee misuratore
    px(0, 0, W, H, "#3a3f3a");
    for (let y = 6; y < H; y += 8) px(0, y, W, 1, "#454b44");

    const skin = SKIN[rng.int(0, SKIN.length - 1)] as string;
    const skinShade = shade(skin, -22);
    const hair = HAIR[rng.int(0, HAIR.length - 1)] as string;
    const coat = COAT[rng.int(0, COAT.length - 1)] as string;
    const coatShade = shade(coat, -20);

    const cx = W / 2 + rng.int(-1, 1);
    const headTop = 16 + rng.int(-2, 2);
    const headBot = 52;
    const headR = 15 + rng.int(-1, 1);

    // cappotto / spalle
    for (let y = headBot - 2; y < H; y++) {
      const t = (y - (headBot - 2)) / (H - (headBot - 2));
      const hw = Math.min(W / 2, 8 + t * 26);
      px(Math.round(cx - hw), y, Math.round(hw * 2), 1, y % 9 === 0 ? coatShade : coat);
    }
    // collo
    px(cx - 4, headBot - 6, 8, 8, skinShade);

    // testa (ovale per righe)
    for (let y = headTop; y < headBot; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = Math.round(headR * Math.sqrt(Math.max(0, 1 - dy * dy)));
      if (hw <= 0) continue;
      px(cx - hw, y, hw * 2, 1, skin);
      // lato in ombra
      px(cx + Math.round(hw * 0.4), y, hw - Math.round(hw * 0.4), 1, skinShade);
    }

    // capelli (qualche stile)
    const bald = rng.next() < 0.18;
    if (!bald) {
      for (let y = headTop - 2; y < headTop + 9; y++) {
        const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
        const hw = Math.round(headR * Math.sqrt(Math.max(0, 1 - dy * dy))) + 1;
        px(cx - hw, y, hw * 2, 1, hair);
      }
      // basette
      px(cx - headR, headTop + 8, 2, 6, hair);
      px(cx + headR - 2, headTop + 8, 2, 6, hair);
    }

    // occhi (stanchi)
    const eyeY = headTop + 18;
    px(cx - 8, eyeY, 4, 2, "#1b1712");
    px(cx + 4, eyeY, 4, 2, "#1b1712");
    px(cx - 9, eyeY + 2, 6, 1, skinShade); // occhiaie
    px(cx + 3, eyeY + 2, 6, 1, skinShade);
    // sopracciglia
    px(cx - 9, eyeY - 3, 5, 1, hair);
    px(cx + 4, eyeY - 3, 5, 1, hair);
    // naso
    px(cx - 1, eyeY + 3, 2, 6, skinShade);
    // bocca
    px(cx - 4, eyeY + 12, 8, 1, "#5a3b30");
    // barba accennata
    if (rng.next() < 0.4) {
      for (let i = 0; i < 60; i++) {
        const x = cx + rng.int(-9, 8);
        const y = eyeY + 9 + rng.int(0, 8);
        if (y < headBot) px(x, y, 1, 1, shade(skin, -34));
      }
    }

    // grana
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rng.next() - 0.5) * 26;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
  }, [seed]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="foto block"
      style={{ width, height }}
    />
  );
}

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "").slice(0, 6).padEnd(6, "0");
  const r = clampByte(parseInt(h.slice(0, 2), 16) + amt);
  const g = clampByte(parseInt(h.slice(2, 4), 16) + amt);
  const b = clampByte(parseInt(h.slice(4, 6), 16) + amt);
  return `rgb(${r},${g},${b})`;
}
function clampByte(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** Seed stabile da una stringa (es. id del caso). */
export function portraitSeed(s: string): number {
  return hashStr(s);
}
