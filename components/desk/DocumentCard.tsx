"use client";

import type { DocKind, GameDocument } from "@/types";
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

const PAPER_VAR: Partial<Record<DocKind, string>> = {
  tessera: "rds-paper--green",
  intercettazione: "rds-paper--green",
  telex: "rds-paper--green",
  informativa: "rds-paper--white",
  rapporto: "rds-paper--white",
  ordine: "rds-paper--white",
  nota: "rds-paper--rose",
  lettera: "rds-paper--rose",
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
  width = 300,
}: Props) {
  const classified = doc.authLevel === "riservato" || doc.authLevel === "segreto";
  const isPicked = (label: string) =>
    (selected?.docId === doc.id && selected.label === label) ||
    (selectedPair?.docId === doc.id && selectedPair.label === label);

  return (
    <div className={`rds-paper ${PAPER_VAR[doc.kind] ?? ""}`} style={{ width }}>
      <div className="p-3">
        {/* intestazione ente */}
        <div className="rds-doc-head flex items-start justify-between gap-2 pb-1.5">
          <div className="flex items-start gap-1.5 min-w-0">
            <Emblem size={22} color="#574848" />
            <div className="min-w-0">
              <div className="font-pixel uppercase text-[11px] text-ink leading-tight">
                {doc.title}
              </div>
              <div className="font-read text-[10px] uppercase tracking-wide text-ink/60 mt-0.5">
                {KIND_LABEL[doc.kind] ?? doc.kind}
                {doc.issuer ? ` · ${doc.issuer}` : ""}
              </div>
            </div>
          </div>
          {doc.protocollo && (
            <div className="font-term text-[12px] leading-none text-ink/70 text-right shrink-0">
              PROT.
              <br />
              {doc.protocollo}
            </div>
          )}
        </div>

        {classified && (
          <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 my-2">
            {doc.authLevel === "segreto" ? "SEGRETO" : "RISERVATO"}
          </div>
        )}

        <div className="flex gap-2.5 mt-2">
          {doc.photo && (
            <div className="shrink-0">
              <Photo seed={doc.photo.seed} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {doc.fields.map((f, i) => {
              const pickable = compareMode && f.comparable;
              return (
                <div key={i} className="leading-tight mb-1">
                  <span className="font-pixel text-[7px] uppercase tracking-wider text-ink/55 block">
                    {f.label}
                  </span>
                  {pickable ? (
                    <button
                      data-no-drag
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => onSelectField(doc.id, f.label, f.value)}
                      className={`font-read text-[14px] text-left leading-tight ${
                        isPicked(f.label)
                          ? "bg-stamp-red/30 text-ink underline"
                          : "text-ink underline decoration-dotted underline-offset-2 hover:bg-black/10"
                      }`}
                    >
                      {f.value}
                    </button>
                  ) : (
                    <span className="font-read text-[14px] text-ink leading-tight">{f.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {doc.body && doc.body.length > 0 && (
          <div className="rds-rule mt-2 pt-2 font-read text-[13px] text-ink/90 space-y-1 leading-snug">
            {doc.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {doc.censored && doc.censored > 0 && (
          <div className="mt-2 space-y-1">
            {Array.from({ length: doc.censored }).map((_, i) => (
              <div key={i} className="h-3 bg-ink-dark" style={{ width: `${52 + ((i * 37) % 42)}%` }} />
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
