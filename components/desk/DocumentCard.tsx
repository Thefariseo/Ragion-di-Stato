"use client";

import type { GameDocument } from "@/types";
import { Photo } from "./Photo";
import { Stamp } from "@/components/ui/Stamp";

const KIND_LABEL: Record<string, string> = {
  fascicolo: "Fascicolo",
  permesso: "Permesso",
  informativa: "Informativa",
  tessera: "Tessera",
  rapporto: "Rapporto",
  intercettazione: "Intercettazione",
  fotografia: "Fotografia",
  verbale: "Verbale",
  nota: "Nota",
  telex: "Telex",
  ordine: "Ordine",
  articolo: "Articolo",
  lettera: "Lettera",
};

interface Props {
  doc: GameDocument;
  compareMode: boolean;
  selected: { docId: string; label: string } | null;
  selectedPair: { docId: string; label: string } | null;
  onSelectField: (docId: string, label: string, value: string) => void;
  rotate?: number;
}

export function DocumentCard({
  doc,
  compareMode,
  selected,
  selectedPair,
  onSelectField,
  rotate = 0,
}: Props) {
  const classified = doc.authLevel === "riservato" || doc.authLevel === "segreto";

  const isPicked = (label: string) =>
    (selected?.docId === doc.id && selected.label === label) ||
    (selectedPair?.docId === doc.id && selectedPair.label === label);

  return (
    <div
      className="paper paper-edge w-[300px] p-4 relative"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {classified && (
        <div className="classified-band text-carta-chiara font-stencil text-[10px] tracking-[0.25em] text-center py-0.5 mb-2">
          {doc.authLevel === "segreto" ? "SEGRETO" : "RISERVATO"}
        </div>
      )}

      <div className="flex justify-between items-start gap-2 border-b border-black/30 pb-1">
        <div>
          <div className="font-stencil uppercase tracking-wide text-sm text-inchiostro leading-tight">
            {doc.title}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-inchiostro/60">
            {KIND_LABEL[doc.kind] ?? doc.kind}
            {doc.issuer ? ` · ${doc.issuer}` : ""}
          </div>
        </div>
        {doc.protocollo && (
          <div className="text-[10px] text-inchiostro/70 font-typewriter text-right shrink-0">
            Prot.
            <br />
            {doc.protocollo}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        {doc.photo && (
          <div className="shrink-0">
            <Photo seed={doc.photo.seed} label={doc.photo.label} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {doc.fields.map((f, i) => {
            const pickable = compareMode && f.comparable;
            return (
              <div key={i} className="text-[12px] leading-snug mb-1">
                <span className="uppercase tracking-wide text-inchiostro/55 text-[10px]">
                  {f.label}:{" "}
                </span>
                {pickable ? (
                  <button
                    onClick={() => onSelectField(doc.id, f.label, f.value)}
                    className={`font-typewriter underline decoration-dotted underline-offset-2 text-left ${
                      isPicked(f.label)
                        ? "bg-rossomin/30 text-inchiostro"
                        : "text-inchiostro hover:bg-black/10"
                    }`}
                  >
                    {f.value}
                  </button>
                ) : (
                  <span className="font-typewriter text-inchiostro">{f.value}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {doc.body && doc.body.length > 0 && (
        <div className="mt-2 font-doc text-[15px] text-inchiostro/90 border-t border-black/20 pt-2 space-y-1">
          {doc.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {doc.censored && doc.censored > 0 && (
        <div className="mt-2 space-y-1">
          {Array.from({ length: doc.censored }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-inchiostro"
              style={{ width: `${55 + ((i * 37) % 40)}%` }}
            />
          ))}
        </div>
      )}

      {doc.stamps && doc.stamps.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {doc.stamps.map((s, i) => (
            <Stamp key={i} label={s} rotate={(i % 2 === 0 ? -6 : 5)} />
          ))}
        </div>
      )}
    </div>
  );
}
