"use client";

import { useEffect, useRef } from "react";
import { FACTIONS } from "@/data/factions";
import type { FactionId } from "@/types";

/**
 * Stemma pixel di fazione, ricco e riconoscibile. Disegnato su canvas ad alta
 * risoluzione nativa (più dettaglio) e scalato pixelated. Ogni ente ha forma,
 * campo e fregio propri, nei suoi colori istituzionali. Niente loghi reali.
 */
export function FactionEmblem({ faction, size = 22 }: { faction: FactionId; size?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // risoluzione nativa proporzionale: più grande = più dettaglio, restando pixel
  const N = Math.max(28, Math.min(72, Math.round(size)));
  const color = FACTIONS[faction]?.color ?? "#b3a37a";

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    drawCrest(ctx, faction, N, color);
  }, [faction, color, N]);

  return <canvas ref={ref} width={N} height={N} className="pixelated block" style={{ width: size, height: size }} />;
}

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const c = (i: number) => Math.max(0, Math.min(255, parseInt(h.slice(i, i + 2), 16) + amt));
  return `rgb(${c(0)},${c(2)},${c(4)})`;
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

function drawCrest(ctx: CanvasRenderingContext2D, id: FactionId, W: number, color: string) {
  const s = W / 22; // fattore di scala rispetto al disegno base 22px
  const cx = W / 2;
  const cy = W / 2;
  const field = "#16140f";
  const accentHi = shade(color, 34);
  ctx.clearRect(0, 0, W, W);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // ---- campo/forma della fazione ----
  const shapeRound = () => {
    ctx.fillStyle = field;
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.4 * s;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 1.4 * s, 0, Math.PI * 2);
    ctx.stroke();
  };
  const shapeShield = () => {
    ctx.fillStyle = field;
    ctx.beginPath();
    ctx.moveTo(cx, 1 * s);
    ctx.lineTo(W - 1.5 * s, 4 * s);
    ctx.lineTo(W - 1.5 * s, cy + 2 * s);
    ctx.quadraticCurveTo(W - 1.5 * s, W - 2 * s, cx, W - 0.5 * s);
    ctx.quadraticCurveTo(1.5 * s, W - 2 * s, 1.5 * s, cy + 2 * s);
    ctx.lineTo(1.5 * s, 4 * s);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.3 * s;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  const shapeSquare = () => {
    ctx.fillStyle = field;
    ctx.fillRect(1.5 * s, 1.5 * s, W - 3 * s, W - 3 * s);
    ctx.lineWidth = 1.3 * s;
    ctx.strokeStyle = color;
    ctx.strokeRect(1.5 * s, 1.5 * s, W - 3 * s, W - 3 * s);
  };

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  switch (id) {
    case "governo": {
      // scudo araldico + croce/stella d'Italia
      shapeShield();
      ctx.fillStyle = accentHi;
      ctx.fillRect(cx - 1.1 * s, cy - 5 * s, 2.2 * s, 10 * s);
      ctx.fillRect(cx - 4 * s, cy - 1.2 * s, 8 * s, 2.2 * s);
      star(ctx, cx, cy - 6.5 * s, 1.6 * s, 0.7 * s);
      ctx.fill();
      break;
    }
    case "sir": {
      // occhio della sorveglianza dentro roundel
      shapeRound();
      ctx.lineWidth = 1.4 * s;
      ctx.strokeStyle = accentHi;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 7 * s, 4.2 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = accentHi;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = field;
      ctx.beginPath();
      ctx.arc(cx + 0.8 * s, cy - 0.8 * s, 0.9 * s, 0, Math.PI * 2);
      ctx.fill();
      // raggi
      ctx.strokeStyle = color;
      ctx.lineWidth = 1 * s;
      for (const a of [-0.5, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(cx - 9 * s, cy + a * 6 * s);
        ctx.lineTo(cx - 7.5 * s, cy + a * 3 * s);
        ctx.moveTo(cx + 9 * s, cy + a * 6 * s);
        ctx.lineTo(cx + 7.5 * s, cy + a * 3 * s);
        ctx.stroke();
      }
      break;
    }
    case "anello": {
      // anello spezzato su campo nerissimo: assenza che pesa
      ctx.fillStyle = "#0e0d0a";
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 0.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.6 * s;
      ctx.beginPath();
      ctx.arc(cx, cy, 5.4 * s, -Math.PI * 0.35, Math.PI * 1.25);
      ctx.stroke();
      ctx.strokeStyle = shade(color, -20);
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.arc(cx, cy, 5.4 * s, -Math.PI * 0.35, Math.PI * 1.25);
      ctx.stroke();
      break;
    }
    case "brigate": {
      // stella a cinque punte "imperfetta", inchiostro che sbava
      ctx.fillStyle = "#14110d";
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 0.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shade(color, -30);
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 1.6 * s, 0, Math.PI * 2);
      ctx.stroke();
      star(ctx, cx, cy, 8 * s, 3.3 * s);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = field;
      star(ctx, cx, cy, 4.2 * s, 1.7 * s);
      ctx.fill();
      break;
    }
    case "procura": {
      // bilancia della giustizia
      shapeRound();
      ctx.strokeStyle = accentHi;
      ctx.fillStyle = accentHi;
      ctx.lineWidth = 1.1 * s;
      ctx.fillRect(cx - 0.8 * s, cy - 7 * s, 1.6 * s, 13 * s);
      ctx.fillRect(cx - 7 * s, cy - 5.4 * s, 14 * s, 1.4 * s);
      ctx.beginPath();
      ctx.moveTo(cx - 7 * s, cy - 4.7 * s);
      ctx.lineTo(cx - 9 * s, cy - 0.5 * s);
      ctx.lineTo(cx - 5 * s, cy - 0.5 * s);
      ctx.closePath();
      ctx.moveTo(cx + 7 * s, cy - 4.7 * s);
      ctx.lineTo(cx + 9 * s, cy - 0.5 * s);
      ctx.lineTo(cx + 5 * s, cy - 0.5 * s);
      ctx.closePath();
      ctx.stroke();
      ctx.fillRect(cx - 3 * s, cy + 6 * s, 6 * s, 1.4 * s);
      break;
    }
    case "stampa": {
      // giornale piegato + testata
      shapeSquare();
      ctx.fillStyle = accentHi;
      ctx.fillRect(cx - 6 * s, cy - 6 * s, 12 * s, 2.2 * s); // testata
      ctx.fillStyle = shade(color, 10);
      for (let i = 0; i < 4; i++) ctx.fillRect(cx - 6 * s, cy - 2.4 * s + i * 2.2 * s, (i === 3 ? 7 : 12) * s, 1.1 * s);
      ctx.strokeStyle = field;
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 3.4 * s);
      ctx.lineTo(cx, cy + 6 * s);
      ctx.stroke();
      break;
    }
    case "avanguardia": {
      shapeRound();
      ctx.fillStyle = accentHi;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7 * s);
      ctx.lineTo(cx + 6.5 * s, cy + 6 * s);
      ctx.lineTo(cx - 6.5 * s, cy + 6 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = field;
      ctx.fillRect(cx - 1 * s, cy - 2 * s, 2 * s, 6 * s);
      break;
    }
    case "rete": {
      shapeRound();
      ctx.strokeStyle = accentHi;
      ctx.lineWidth = 1 * s;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 3 * s, cy - 6 * s);
        ctx.lineTo(cx + i * 3 * s, cy + 6 * s);
        ctx.moveTo(cx - 6 * s, cy + i * 3 * s);
        ctx.lineTo(cx + 6 * s, cy + i * 3 * s);
        ctx.stroke();
      }
      break;
    }
    case "cupola": {
      shapeRound();
      ctx.fillStyle = accentHi;
      ctx.beginPath();
      ctx.moveTo(cx - 7 * s, cy + 5 * s);
      ctx.lineTo(cx - 7 * s, cy - 1 * s);
      ctx.lineTo(cx - 2.5 * s, cy + 2 * s);
      ctx.lineTo(cx, cy - 6 * s);
      ctx.lineTo(cx + 2.5 * s, cy + 2 * s);
      ctx.lineTo(cx + 7 * s, cy - 1 * s);
      ctx.lineTo(cx + 7 * s, cy + 5 * s);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "sindacato": {
      shapeRound();
      ctx.strokeStyle = accentHi;
      ctx.lineWidth = 1.6 * s;
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = accentHi;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        ctx.fillRect(cx + Math.cos(a) * 7 * s - 1.1 * s, cy + Math.sin(a) * 7 * s - 1.1 * s, 2.2 * s, 2.2 * s);
      }
      break;
    }
    case "loggia": {
      shapeRound();
      ctx.strokeStyle = accentHi;
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 6.5 * s);
      ctx.lineTo(cx + 6.5 * s, cy + 6 * s);
      ctx.lineTo(cx - 6.5 * s, cy + 6 * s);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = accentHi;
      ctx.beginPath();
      ctx.arc(cx, cy + 0.5 * s, 1.8 * s, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "salotto": {
      shapeRound();
      ctx.fillStyle = accentHi;
      ctx.fillRect(cx - 5.5 * s, cy + 3.5 * s, 11 * s, 2.2 * s);
      ctx.fillRect(cx - 3.2 * s, cy - 5.5 * s, 6.4 * s, 9 * s);
      break;
    }
    default:
      shapeRound();
      ctx.strokeStyle = accentHi;
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * s, 0, Math.PI * 2);
      ctx.stroke();
  }

  // vignettatura leggera del campo per dare profondità
  const g = ctx.createRadialGradient(cx, cy * 0.7, 1, cx, cy, W * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(0,0,0,0.30)");
  ctx.fillStyle = g;
  ctx.globalCompositeOperation = "overlay";
  ctx.beginPath();
  ctx.arc(cx, cy, cx, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}
