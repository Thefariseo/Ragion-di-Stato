"use client";

import type { GameDocument } from "@/types";
import { Photo } from "./Photo";
import { Emblem } from "./Emblem";
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
  width?: number;
}

export function DocumentCard({
  doc,
  compareMode,
  selected,
  selectedPair,
  onSelectField,
  width = 312,
}: Props) {
  const classified = doc.authLevel === "riservato" || doc.authLevel === "segreto";
  const isPicked = (label: string) =>
    (selected?.docId === doc.id && selected.label === label) ||
    (selectedPair?.docId === doc.id && selectedPair.label === label);

  return (
    <div className="rds-paper" style={{ width }}>
      {/* graffetta */}
      <div className="absolute -top-2 left-6 w-3 h-6 border-2 border-[#7a7468] rounded-t-full opacity-70" />

      <div className="p-3.5">
        {/* intestazione ente */}
        <div className="rds-doc-head flex items-start justify-between gap-2 pb-1.5">
          <div className="flex items-start gap-2 min-w-0">
            <Emblem />
            <div className="min-w-0">
              <div className="font-stencil uppercase tracking-wide text-[15px] text-ink leading-none">
                {doc.title}
              </div>
              <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/70 mt-1">
                {KIND_LABEL[doc.kind] ?? doc.kind}
                {doc.issuer ? ` · ${doc.issuer}` : ""}
              </div>
            </div>
          </div>
          {doc.protocollo && (
            <div className="font-pixel text-[8px] text-ink-soft/80 text-right leading-tight shrink-0">
              PROT.
              <br />
              {doc.protocollo}
            </div>
          )}
        </div>

        {classified && (
          <div className="rds-classified font-stencil text-[10px] tracking-[0.3em] text-center py-0.5 my-2">
            {doc.authLevel === "segreto" ? "S E G R E T O" : "R I S E R V A T O"}
          </div>
        )}

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
                <div key={i} className="text-[12.5px] leading-snug mb-1">
                  <span className="font-pixel text-[8px] uppercase tracking-wider text-ink-soft/60">
                    {f.label}
                  </span>{" "}
                  {pickable ? (
                    <button
                      data-no-drag
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => onSelectField(doc.id, f.label, f.value)}
                      className={`font-type text-left underline decoration-dotted underline-offset-2 ${
                        isPicked(f.label)
                          ? "bg-rosso/30 text-ink"
                          : "text-ink hover:bg-black/10"
                      }`}
                    >
                      {f.value}
                    </button>
                  ) : (
                    <span className="font-type text-ink">{f.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {doc.body && doc.body.length > 0 && (
          <div className="rds-rule mt-2 pt-2 font-type text-[13.5px] text-ink/90 space-y-1">
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
                className="h-3 bg-ink"
                style={{ width: `${52 + ((i * 37) % 42)}%` }}
              />
            ))}
          </div>
        )}

        {doc.stamps && doc.stamps.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {doc.stamps.map((s, i) => (
              <Stamp key={i} label={s} rotate={i % 2 === 0 ? -6 : 5} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
