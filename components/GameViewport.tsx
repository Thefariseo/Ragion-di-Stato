"use client";

import { useEffect, useState } from "react";

/**
 * Cornice a risoluzione logica FISSA (cabinet), centrata su nero e scalata per
 * stare nella finestra (mai oltre 1:1 → niente sfocatura su schermi grandi).
 * Dà la sensazione di un apparecchio pixel, non di una pagina web fluida.
 */
const BASE_W = 1180;
const BASE_H = 664;

export function GameViewport({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, window.innerWidth / BASE_W, window.innerHeight / BASE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#060503] flex items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 0 0 2px #000, 0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
