"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseDef } from "@/types";
import { DocumentCard } from "./DocumentCard";
import { Draggable } from "./Draggable";
import { FactionEmblem } from "./FactionEmblem";
import { playClick, playPaper } from "@/lib/sfx";

type Pick = { docId: string; label: string; value: string };

export function Dossier({
  caseDef,
  onAnalysis,
}: {
  caseDef: CaseDef;
  onAnalysis?: (a: { inspected: boolean; discrepanciesFound: number }) => void;
}) {
  const [compareMode, setCompareMode] = useState(false);
  const [first, setFirst] = useState<Pick | null>(null);
  const [second, setSecond] = useState<Pick | null>(null);
  const [result, setResult] = useState<{ note: string; hit: boolean } | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [inspected, setInspected] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const zCounter = useRef(10);

  useEffect(() => {
    setCompareMode(false);
    setFirst(null);
    setSecond(null);
    setResult(null);
    setFound(new Set());
    setInspected(false);
    setResetKey((k) => k + 1);
    zCounter.current = 10;
    playPaper();
  }, [caseDef.id]);

  // riporta l'analisi alla scrivania (sblocca le azioni coerenti)
  useEffect(() => {
    onAnalysis?.({ inspected, discrepanciesFound: found.size });
  }, [inspected, found, onAnalysis]);

  const total = caseDef.discrepancies?.length ?? 0;

  function evaluate(a: Pick, b: Pick) {
    const disc = (caseDef.discrepancies ?? []).find((d) => {
      const m1 = d.aDocId === a.docId && d.aField === a.label && d.bDocId === b.docId && d.bField === b.label;
      const m2 = d.aDocId === b.docId && d.aField === b.label && d.bDocId === a.docId && d.bField === a.label;
      return m1 || m2;
    });
    if (disc) {
      setResult({ note: disc.note, hit: true });
      setFound((p) => new Set(p).add(`${disc.aField}|${disc.bField}`));
    } else {
      setResult({ note: "Nessuna contraddizione evidente tra questi due campi.", hit: false });
    }
  }

  function onSelectField(docId: string, label: string, value: string) {
    if (!compareMode) return;
    playClick();
    const pick: Pick = { docId, label, value };
    if (!first) {
      setFirst(pick);
      setSecond(null);
      setResult(null);
      return;
    }
    if (first.docId === docId && first.label === label) {
      setFirst(null);
      return;
    }
    setSecond(pick);
    evaluate(first, pick);
  }

  function clearCompare() {
    setFirst(null);
    setSecond(null);
    setResult(null);
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* CARTELLA che si apre sulla pratica (consegna + apertura) */}
      <div
        key={`cover-${caseDef.id}`}
        className="absolute left-4 top-10 z-[24] pointer-events-none"
        style={{ width: 248, height: 152, perspective: "640px" }}
        aria-hidden
      >
        <div className="rds-folder-cover w-full h-full">
          <div
            className="w-full h-full border-2 border-[#2c2417] shadow-[4px_6px_0_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: "#9c8a5e", backgroundImage: "var(--noise)", backgroundSize: "140px 140px", backgroundBlendMode: "multiply" }}
          >
            {/* linguetta della cartella */}
            <div className="absolute -top-2 left-8 w-20 h-3 bg-[#8a784e] border-2 border-[#2c2417]" />
            <span className="rds-classified font-pixel text-[9px] tracking-[0.3em] px-3 py-1">RISERVATO</span>
            {caseDef.faction && <FactionEmblem faction={caseDef.faction} size={42} />}
            <span className="font-pixel text-[7px] uppercase tracking-[0.2em] text-[#2c2417]">U.V.A.C. · Sportello 7</span>
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 right-2 z-30 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => { playClick(); setCompareMode((v) => !v); setInspected(true); clearCompare(); }}
          className={`rds-btn ${compareMode ? "rds-btn--neon" : ""} text-[9px] px-2.5 py-1`}
        >
          {compareMode ? "◉ Lente" : "⌕ Confronta"}
        </button>
        <button onClick={() => { playClick(); setResetKey((k) => k + 1); }} className="rds-btn text-[9px] px-2.5 py-1">
          ⤺ Riordina
        </button>
        {compareMode && (
          <span className="font-pixel text-[7px] uppercase tracking-wide text-paper bg-black/50 px-2 py-1">
            due campi{total > 0 ? ` · contraddizioni ${found.size}/${total}` : ""}
          </span>
        )}
        {result && (
          <span
            className={`font-read text-[12px] px-2 py-1 max-w-[58%] ${
              result.hit ? "bg-stamp-red/40 text-paper-cream border-2 border-stamp-red" : "bg-black/50 text-paper/80"
            }`}
          >
            {result.hit ? "⚠ " : ""}
            {result.note}
            <button onClick={clearCompare} className="ml-2 underline text-[10px] opacity-70">pulisci</button>
          </span>
        )}
      </div>

      {caseDef.documents.map((doc, i) => (
        <Draggable
          key={`${doc.id}-${resetKey}`}
          initialX={26 + i * 50}
          initialY={46 + i * 28}
          rotate={i % 2 === 0 ? -1.2 : 1.4}
          bringToFront={() => ++zCounter.current}
        >
          <div className="animate-slideUp" style={{ animationDelay: `${i * 60}ms` }}>
            <DocumentCard
              doc={doc}
              faction={caseDef.faction}
              compareMode={compareMode}
              selected={first ? { docId: first.docId, label: first.label } : null}
              selectedPair={second ? { docId: second.docId, label: second.label } : null}
              onSelectField={onSelectField}
            />
          </div>
        </Draggable>
      ))}
    </div>
  );
}
