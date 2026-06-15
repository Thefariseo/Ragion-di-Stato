"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";

const SKIN = ["#d8ab89", "#ba8657", "#ac6b47", "#a08b61", "#c89a74"];
const HAIR = ["#241c14", "#352818", "#4e4234", "#11100d", "#6b6258", "#504631"];
const COAT = ["#3d4232", "#46341f", "#414447", "#45140f", "#25364c", "#5a4a2e"];
const TIE = ["#701b1b", "#25364c", "#3d4232", "#1b1712"];

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const c = (i: number) => Math.max(0, Math.min(255, parseInt(h.slice(i, i + 2), 16) + amt));
  return `rgb(${c(0)},${c(2)},${c(4)})`;
}

/**
 * Figura pixel (busto) del richiedente allo sportello: testa + cappotto +
 * cravatta, con variazioni (capelli, barba, baffi, occhiali). Risoluzione
 * nativa bassa, scalata pixelated. Entra ("npcEnter") e respira ("idleBob").
 */
export function NpcSprite({ seed, width = 96 }: { seed: number; width?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 56;
  const H = 92;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    drawNpc(ctx, W, H, seed);
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

function drawNpc(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number) {
  const rng = makeRng(seed);
  const px = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
  };
  ctx.clearRect(0, 0, W, H);

  const skin = SKIN[rng.int(0, SKIN.length - 1)] as string;
  const skinSh = shade(skin, -26);
  const hair = HAIR[rng.int(0, HAIR.length - 1)] as string;
  const coat = COAT[rng.int(0, COAT.length - 1)] as string;
  const coatSh = shade(coat, -16);
  const tie = TIE[rng.int(0, TIE.length - 1)] as string;
  const shirt = "#cfc7b0";

  const cx = W / 2;
  const headTop = H * 0.07;
  const headBot = H * 0.4;
  const headR = W * 0.21;

  // cappotto / spalle
  const bodyTop = headBot - 3;
  for (let y = bodyTop; y < H; y++) {
    const t = (y - bodyTop) / (H - bodyTop);
    const hw = Math.min(W / 2, W * 0.18 + t * W * 0.42);
    px(cx - hw, y, hw * 2, 1, y % 11 === 0 ? coatSh : coat);
  }
  // collo
  px(cx - W * 0.07, headBot - 5, W * 0.14, 8, skinSh);
  // colletto camicia (V) + cravatta
  px(cx - 5, bodyTop + 2, 10, 7, shirt);
  ctx.beginPath();
  ctx.moveTo(cx - 5, bodyTop + 2);
  ctx.lineTo(cx, bodyTop + 9);
  ctx.lineTo(cx + 5, bodyTop + 2);
  ctx.closePath();
  ctx.fillStyle = coat;
  ctx.fill();
  px(cx - 1.5, bodyTop + 2, 3, H * 0.16, tie);
  px(cx - 2, bodyTop + 2 + H * 0.16, 4, 3, shade(tie, -20));

  // testa
  for (let y = headTop; y < headBot; y++) {
    const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
    const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
    if (hw <= 0) continue;
    px(cx - hw, y, hw * 2, 1, skin);
    px(cx + hw * 0.35, y, hw * 0.65, 1, skinSh);
  }

  const r = rng.next();
  const style = r < 0.16 ? "bald" : r < 0.32 ? "balding" : "full";
  if (style !== "bald") {
    const top = style === "balding" ? headTop + headR * 0.55 : headTop + headR * 0.9;
    for (let y = headTop - 1; y < top; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy)) + 1;
      px(cx - hw, y, hw * 2, 1, hair);
    }
    px(cx - headR, headTop + headR * 0.7, 2, headR * 0.5, hair);
    px(cx + headR - 2, headTop + headR * 0.7, 2, headR * 0.5, hair);
  }

  const eyeY = headTop + headR * 1.1;
  const dx = headR * 0.5;
  const ew = headR * 0.34;
  px(cx - dx - ew * 0.6, eyeY - headR * 0.22, ew * 1.3, 1.5, hair);
  px(cx + dx - ew * 0.7, eyeY - headR * 0.22, ew * 1.3, 1.5, hair);
  px(cx - dx - ew / 2, eyeY, ew, 2, "#1b1712");
  px(cx + dx - ew / 2, eyeY, ew, 2, "#1b1712");
  px(cx - dx - ew / 2, eyeY + 2, ew, 1, skinSh);
  px(cx + dx - ew / 2, eyeY + 2, ew, 1, skinSh);
  if (rng.next() < 0.3) {
    ctx.strokeStyle = "#2a2620";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - dx - ew * 0.8, eyeY - 1.5, ew * 1.6, 4);
    ctx.strokeRect(cx + dx - ew * 0.8, eyeY - 1.5, ew * 1.6, 4);
    px(cx - ew * 0.4, eyeY, ew * 0.8, 1, "#2a2620");
  }
  px(cx - 1, eyeY + headR * 0.22, 2, headR * 0.5, skinSh);
  const mouthY = eyeY + headR * 0.95;
  if (rng.next() < 0.4) px(cx - headR * 0.45, mouthY - 2, headR * 0.9, 2.5, hair);
  px(cx - headR * 0.4, mouthY + 1, headR * 0.8, 1, "#5a3b30");
  if (rng.next() < 0.28) {
    for (let y = Math.round(mouthY); y < headBot; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
      if (hw > 0) px(cx - hw, y, hw * 2, 1, shade(hair, 6));
    }
  }

  // grana
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const n = (rng.next() - 0.5) * 20;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}
