"use client";

import { useEffect, useRef, useState } from "react";
import { playBlip, voiceEvery, type VoiceProfileId } from "@/lib/voice";

/**
 * Effetto macchina da scrivere: rivela il testo carattere per carattere.
 * Click per completare subito. Le righe sono separate da newline.
 * Se `voice` è impostato, emette un mormorio vocale stilizzato sincronizzato
 * con la comparsa delle lettere (VoiceBlipSystem).
 */
export function Typewriter({
  lines,
  speed = 18,
  className = "",
  voice,
  onDone,
}: {
  lines: string[];
  speed?: number;
  className?: string;
  voice?: VoiceProfileId;
  onDone?: () => void;
}) {
  const full = lines.join("\n");
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);
  const letterRef = useRef(0);

  useEffect(() => {
    setShown(0);
    doneRef.current = false;
    letterRef.current = 0;
  }, [full]);

  useEffect(() => {
    if (shown >= full.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => {
      // il carattere che sta per comparire è full[shown]
      const ch = full[shown];
      if (voice && ch && /[a-zà-ù0-9]/i.test(ch)) {
        letterRef.current += 1;
        if (letterRef.current % voiceEvery(voice) === 0) playBlip(voice);
      }
      setShown((s) => s + 1);
    }, speed);
    return () => clearTimeout(t);
  }, [shown, full, speed, voice, onDone]);

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
