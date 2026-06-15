"use client";

import { useRef, useState } from "react";

/**
 * Avvolge un oggetto della scrivania rendendolo trascinabile col puntatore.
 * Gli elementi marcati [data-no-drag] (es. campi cliccabili) non avviano il drag.
 * Una soglia di movimento distingue il click dal trascinamento.
 */
export function Draggable({
  initialX,
  initialY,
  rotate = 0,
  bringToFront,
  children,
}: {
  initialX: number;
  initialY: number;
  rotate?: number;
  bringToFront: () => number;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [z, setZ] = useState(1);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  function onPointerDown(e: React.PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-drag]")) return;
    setZ(bringToFront());
    start.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    moved.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!start.current) return;
    const dx = e.clientX - start.current.px;
    const dy = e.clientY - start.current.py;
    if (!moved.current && Math.hypot(dx, dy) < 4) return;
    moved.current = true;
    setDragging(true);
    setPos({ x: start.current.ox + dx, y: start.current.oy + dy });
  }
  function onPointerUp(e: React.PointerEvent) {
    start.current = null;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className="absolute touch-none select-none"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: z,
        transform: `rotate(${rotate}deg)`,
        cursor: dragging ? "grabbing" : "grab",
        filter: dragging ? "drop-shadow(0 18px 18px rgba(0,0,0,0.55))" : undefined,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  );
}
