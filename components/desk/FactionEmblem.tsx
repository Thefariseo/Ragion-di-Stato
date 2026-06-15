"use client";

import { useEffect, useRef } from "react";
import { FACTIONS } from "@/data/factions";
import type { FactionId } from "@/types";

/**
 * Stemma pixel di fazione: un sigillo distinto su roundel scuro, disegnato su
 * canvas a bassa risoluzione e scalato pixelated. Niente SVG moderni.
 */
export function FactionEmblem({ faction, size = 22 }: { faction: FactionId; size?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const W = 22;
  const color = FACTIONS[faction]?.color ?? "#b3a37a";

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    drawGlyph(ctx, faction, W, color);
  }, [faction, color]);

  return <canvas ref={ref} width={W} height={W} className="pixelated block" style={{ width: size, height: size }} />;
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, ri: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : ri;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawGlyph(ctx: CanvasRenderingContext2D, id: FactionId, W: number, color: string) {
  const cx = W / 2;
  const cy = W / 2;
  ctx.clearRect(0, 0, W, W);
  // roundel
  ctx.fillStyle = "#14110d";
  ctx.beginPath();
  ctx.arc(cx, cy, cx - 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.4;

  switch (id) {
    case "governo": // scudo + croce
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 6, cy - 4);
      ctx.lineTo(cx + 6, cy + 1);
      ctx.quadraticCurveTo(cx + 6, cy + 7, cx, cy + 8);
      ctx.quadraticCurveTo(cx - 6, cy + 7, cx - 6, cy + 1);
      ctx.lineTo(cx - 6, cy - 4);
      ctx.closePath();
      ctx.stroke();
      ctx.fillRect(cx - 1, cy - 4, 2, 9);
      ctx.fillRect(cx - 3, cy - 1, 6, 2);
      break;
    case "sir": // occhio
      ctx.beginPath();
      ctx.ellipse(cx, cy, 7, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "anello": // anello
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "brigate": // stella
      star(ctx, cx, cy, 6, 2.4);
      ctx.fill();
      break;
    case "procura": // bilancia
      ctx.fillRect(cx - 1, cy - 6, 2, 12);
      ctx.fillRect(cx - 6, cy - 5, 12, 1.6);
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 1, 3, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 6, cy - 1, 3, 0, Math.PI);
      ctx.stroke();
      break;
    case "stampa": // giornale
      ctx.strokeRect(cx - 6, cy - 5, 12, 10);
      ctx.fillRect(cx - 4, cy - 3, 8, 1);
      ctx.fillRect(cx - 4, cy - 1, 8, 1);
      ctx.fillRect(cx - 4, cy + 1, 5, 1);
      break;
    case "avanguardia": // fiamma/triangolo
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.closePath();
      ctx.fill();
      break;
    case "rete": // rete/quercia
      ctx.strokeRect(cx - 6, cy - 6, 12, 12);
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy);
      ctx.lineTo(cx + 6, cy);
      ctx.moveTo(cx, cy - 6);
      ctx.lineTo(cx, cy + 6);
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      break;
    case "cupola": // corona/cupola
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 4);
      ctx.lineTo(cx - 6, cy - 2);
      ctx.lineTo(cx - 2, cy + 1);
      ctx.lineTo(cx, cy - 4);
      ctx.lineTo(cx + 2, cy + 1);
      ctx.lineTo(cx + 6, cy - 2);
      ctx.lineTo(cx + 6, cy + 4);
      ctx.closePath();
      ctx.fill();
      break;
    case "sindacato": // ingranaggio
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        ctx.fillRect(cx + Math.cos(a) * 6 - 1, cy + Math.sin(a) * 6 - 1, 2, 2);
      }
      break;
    case "loggia": // triangolo + occhio
      ctx.beginPath();
      ctx.moveTo(cx, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "salotto": // cilindro
      ctx.fillRect(cx - 5, cy + 3, 10, 2);
      ctx.fillRect(cx - 3, cy - 5, 6, 8);
      break;
    default:
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
  }
}
