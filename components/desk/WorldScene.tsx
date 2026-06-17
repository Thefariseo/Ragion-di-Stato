"use client";

import { useEffect, useRef } from "react";

/**
 * Il mondo FUORI dalla scrivania: un corridoio ministeriale VIVO, animato a
 * risoluzione nativa bassa (pixelated). Coda di persone, guardie in pattuglia,
 * un ispettore che ti osserva quando il sospetto sale, un funzionario che corre,
 * porta illuminata in fondo. Reattivo: più caos = corridoio affollato/agitato;
 * più sospetto = più guardie + ispettore; crisi = allarme rosso.
 */
type Actor = {
  x: number;
  baseY: number;
  vx: number;
  kind: "civ" | "guard" | "inspector" | "runner";
  shade: string;
  phase: number;
  pause: number;
};

export function WorldScene({
  suspicion,
  caos,
  alarm,
}: {
  suspicion: number;
  caos: number;
  alarm?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const cfg = useRef({ suspicion, caos, alarm: !!alarm });
  cfg.current = { suspicion, caos, alarm: !!alarm };
  const actors = useRef<Actor[]>([]);
  const flick = useRef(1);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const g = ctx;
    const W = (cv.width = 300);
    const H = (cv.height = 76);
    const horizon = H * 0.5;
    let raf = 0;
    let last = performance.now();
    let runnerTimer = 4 + Math.random() * 6;

    function depth(y: number) {
      return 0.55 + ((y - horizon) / (H - horizon)) * 0.6;
    }
    function spawnCiv(): Actor {
      return {
        x: 14 + Math.random() * 70,
        baseY: horizon + 6 + Math.random() * (H - horizon - 10),
        vx: 0,
        kind: "civ",
        shade: ["#15140f", "#1c1a14", "#23201a"][Math.floor(Math.random() * 3)] as string,
        phase: Math.random() * 6,
        pause: 0,
      };
    }
    function spawnGuard(): Actor {
      return {
        x: 110 + Math.random() * 150,
        baseY: horizon + 4 + Math.random() * (H - horizon - 8),
        vx: Math.random() < 0.5 ? -0.18 : 0.18,
        kind: "guard",
        shade: "#10110b",
        phase: Math.random() * 6,
        pause: 0,
      };
    }

    function rebuild() {
      const c = cfg.current;
      const queueCount = 2 + Math.floor(c.caos / 18);
      const guardCount = 1 + Math.floor(c.suspicion / 34);
      const inspector = c.suspicion >= 42;
      const list: Actor[] = [];
      for (let i = 0; i < queueCount; i++) list.push(spawnCiv());
      for (let i = 0; i < guardCount; i++) list.push(spawnGuard());
      if (inspector)
        list.push({
          x: 215,
          baseY: horizon + 10,
          vx: 0,
          kind: "inspector",
          shade: "#2a261c",
          phase: 0,
          pause: 0,
        });
      // mantieni eventuale runner
      const runner = actors.current.find((a) => a.kind === "runner");
      if (runner) list.push(runner);
      actors.current = list;
    }
    rebuild();
    const rebuildTimer = setInterval(rebuild, 4000);

    const px = (x: number, y: number, w: number, h: number, c: string) => {
      g.fillStyle = c;
      g.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    };

    function drawFigure(a: Actor) {
      const d = depth(a.baseY);
      const h = Math.round(20 * d);
      const w = Math.max(2, Math.round(5 * d));
      const x = a.x;
      const y = a.baseY - h;
      // corpo
      px(x - w / 2, y + h * 0.3, w, h * 0.7, a.shade);
      // testa
      px(x - w * 0.35, y, w * 0.7, h * 0.3, a.shade);
      // gambe (2 frame se cammina)
      const walking = Math.abs(a.vx) > 0.01 && a.pause <= 0;
      const sw = walking ? Math.sin(a.phase) * w * 0.5 : 0;
      px(x - w * 0.4 - sw, a.baseY - h * 0.18, w * 0.35, h * 0.18, a.shade);
      px(x + w * 0.05 + sw, a.baseY - h * 0.18, w * 0.35, h * 0.18, a.shade);
      if (a.kind === "guard") px(x - w * 0.45, y - 1, w * 0.9, 2, "#0a0b07"); // berretto
      if (a.kind === "inspector") {
        px(x - w * 0.5, y - 2, w, 2, "#1a1610"); // cappello tesa
        px(x - w * 0.3, y - 4, w * 0.6, 2, "#1a1610");
      }
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last);
      last = now;
      const c = cfg.current;

      // flicker luci (più nervoso in allarme)
      if (Math.random() < (c.alarm ? 0.06 : 0.012)) flick.current = 0.45 + Math.random() * 0.3;
      else flick.current += (1 - flick.current) * 0.2;

      // sfondo
      px(0, 0, W, horizon, "#2a3026");
      px(0, 0, W, horizon * 0.5, "#222820");
      px(0, horizon, W, H - horizon, "#37301f");
      // fughe pavimento
      g.strokeStyle = "#2a261c";
      g.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        g.beginPath();
        g.moveTo(W / 2 + i * 10, horizon);
        g.lineTo(W / 2 + i * 46, H);
        g.stroke();
      }
      // porta illuminata
      const dW = 30;
      const dH = horizon * 0.7;
      px(W / 2 - dW / 2, horizon - dH, dW, dH, "#0e120c");
      const lit = (c.alarm ? 0.5 : 0.85) * flick.current;
      px(W / 2 - dW / 2 + 3, horizon - dH + 3, dW - 6, dH - 4, `rgba(190,180,110,${lit})`);
      // manifesto a parete
      px(36, 8, 22, 16, "#6a522f");
      px(38, 10, 18, 3, "#9a6b30");
      px(38, 15, 14, 2, "#7c6a48");
      // bandiera
      px(250, 8, 2, 26, "#15140f");
      px(252, 8, 18, 10, c.alarm ? "#b42b2b" : "#7c241c");

      // attori
      runnerTimer -= dt / 1000;
      if (runnerTimer <= 0 && !actors.current.some((a) => a.kind === "runner")) {
        runnerTimer = 8 + Math.random() * 10;
        actors.current.push({
          x: -10,
          baseY: horizon + 8,
          vx: 0.9,
          kind: "runner",
          shade: "#14130d",
          phase: 0,
          pause: 0,
        });
      }
      const survivors: Actor[] = [];
      for (const a of actors.current) {
        a.phase += (Math.abs(a.vx) > 0.01 ? 0.02 : 0.005) * dt;
        if (a.kind === "guard") {
          if (a.pause > 0) a.pause -= dt;
          else {
            a.x += a.vx * dt * 0.12;
            if (a.x < 100 || a.x > 270) {
              a.vx *= -1;
              a.pause = 600 + Math.random() * 1200;
            }
          }
        } else if (a.kind === "runner") {
          a.x += a.vx * dt * 0.12;
          if (a.x > W + 12) continue; // esce
        } else if (a.kind === "civ") {
          // piccolo shuffle in coda
          if (Math.random() < 0.005) a.x += Math.random() < 0.5 ? -1 : 1;
        }
        survivors.push(a);
      }
      actors.current = survivors;

      // ordina per profondità e disegna
      [...actors.current].sort((a, b) => a.baseY - b.baseY).forEach(drawFigure);

      // velo d'ombra + allarme
      const veil = g.createLinearGradient(0, 0, 0, H);
      veil.addColorStop(0, "rgba(0,0,0,0.25)");
      veil.addColorStop(1, "rgba(0,0,0,0.5)");
      g.fillStyle = veil;
      g.fillRect(0, 0, W, H);
      if (c.alarm) {
        g.fillStyle = `rgba(150,30,20,${0.12 + (1 - flick.current) * 0.25})`;
        g.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rebuildTimer);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pixelated" style={{ imageRendering: "pixelated" }} aria-hidden />;
}
