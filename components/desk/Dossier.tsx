"use client";

import { useEffect, useState } from "react";
import type { CaseDef } from "@/types";
import { DocumentCard } from "./DocumentCard";
import { Typewriter } from "@/components/ui/Typewriter";
import { playClick } from "@/lib/sfx";

type Pick = { docId: string; label: string; value: string };

export function Dossier({ caseDef }: { caseDef: CaseDef }) {
  const [compareMode, setCompareMode] = useState(false);
  const [first, setFirst] = useState<Pick | null>(null);
  const [second, setSecond] = useState<Pick | null>(null);
  const [result, setResult] = useState<{ note: string; hit: boolean } | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());

  // reset quando cambia il caso
  useEffect(() => {
    setCompareMode(false);
    setFirst(null);
    setSecond(null);
    setResult(null);
    setFound(new Set());
  }, [caseDef.id]);

  const totalDiscrepancies = caseDef.discrepancies?.length ?? 0;

  function evaluate(a: Pick, b: Pick) {
    const disc = (caseDef.discrepancies ?? []).find((d) => {
      const m1 =
        d.aDocId === a.docId &&
        d.aField === a.label &&
        d.bDocId === b.docId &&
        d.bField === b.label;
      const m2 =
        d.aDocId === b.docId &&
        d.aField === b.label &&
        d.bDocId === a.docId &&
        d.bField === a.label;
      return m1 || m2;
    });
    if (disc) {
      setResult({ note: disc.note, hit: true });
      setFound((prev) => new Set(prev).add(`${disc.aField}|${disc.bField}`));
    } else {
      setResult({
        note: "Nessuna contraddizione evidente tra questi due campi.",
        hit: false,
      });
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
    <div className="h-full flex flex-col">
      {/* intestazione pratica */}
      <div className="mb-3 shrink-0">
        <div className="font-stencil uppercase tracking-widest text-carta text-lg">
          {caseDef.subject}
        </div>
        <div className="text-carta/70 text-sm">{caseDef.summary}</div>
        {caseDef.intro && (
          <div className="paper paper-edge mt-2 p-3 max-w-2xl">
            <Typewriter
              lines={caseDef.intro}
              speed={14}
              className="font-doc text-[15px] text-inchiostro"
            />
          </div>
        )}
      </div>

      {/* barra lente */}
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <button
          onClick={() => {
            playClick();
            setCompareMode((v) => !v);
            clearCompare();
          }}
          className={`font-stencil uppercase tracking-wider text-xs px-3 py-1 border ${
            compareMode
              ? "bg-ocra text-inchiostro border-ocra"
              : "bg-black/30 text-carta border-carta/30 hover:bg-black/50"
          }`}
        >
          {compareMode ? "Lente attiva" : "Confronta (lente)"}
        </button>
        {compareMode && (
          <>
            <span className="text-carta/60 text-xs">
              Seleziona due campi per confrontarli.
            </span>
            {totalDiscrepancies > 0 && (
              <span className="text-ocra text-xs">
                Contraddizioni trovate: {found.size}/{totalDiscrepancies}
              </span>
            )}
          </>
        )}
      </div>

      {/* esito confronto */}
      {result && (
        <div
          className={`mb-2 p-2 text-sm font-doc border shrink-0 ${
            result.hit
              ? "bg-rossomin/20 border-rossomin text-carta"
              : "bg-black/30 border-carta/20 text-carta/70"
          }`}
        >
          {result.hit ? "⚠ " : ""}
          {result.note}
          <button
            onClick={clearCompare}
            className="ml-3 underline text-xs text-carta/60"
          >
            pulisci
          </button>
        </div>
      )}

      {/* documenti */}
      <div className="flex-1 overflow-auto thin-scroll">
        <div className="flex flex-wrap gap-5 pb-6">
          {caseDef.documents.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              compareMode={compareMode}
              selected={first ? { docId: first.docId, label: first.label } : null}
              selectedPair={second ? { docId: second.docId, label: second.label } : null}
              onSelectField={onSelectField}
              rotate={i % 2 === 0 ? -0.8 : 0.9}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
