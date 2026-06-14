"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Effetto macchina da scrivere: rivela il testo carattere per carattere.
 * Click per completare subito. Le righe sono separate da newline.
 */
export function Typewriter({
  lines,
  speed = 18,
  className = "",
  onDone,
}: {
  lines: string[];
  speed?: number;
  className?: string;
  onDone?: () => void;
}) {
  const full = lines.join("\n");
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setShown(0);
    doneRef.current = false;
  }, [full]);

  useEffect(() => {
    if (shown >= full.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => setShown((s) => s + 1), speed);
    return () => clearTimeout(t);
  }, [shown, full.length, speed, onDone]);

  const text = full.slice(0, shown);
  const complete = shown >= full.length;

  return (
    <div
      className={`whitespace-pre-wrap leading-relaxed ${complete ? "" : "caret"} ${className}`}
      onClick={() => setShown(full.length)}
      role="button"
      tabIndex={0}
    >
      {text}
    </div>
  );
}
