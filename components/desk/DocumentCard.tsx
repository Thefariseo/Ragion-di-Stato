"use client";

import type { DocKind, FactionId, GameDocument } from "@/types";
import { FACTIONS } from "@/data/factions";
import { factionIdentity, factionFromIssuer } from "@/data/factionIdentity";
import { Photo } from "./Photo";
import { Emblem } from "./Emblem";
import { FactionEmblem } from "./FactionEmblem";
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

// colore della fascia d'intestazione (carta intestata dell'ente)
const BAND: Partial<Record<DocKind, string>> = {
  permesso: "#6a522f",
  tessera: "#3d4232",
  informativa: "#676c54",
  rapporto: "#676c54",
  ordine: "#201c3c",
  nota: "#701b1b",
  lettera: "#701b1b",
  verbale: "#46341f",
  intercettazione: "#3d4232",
  telex: "#3d4232",
  fascicolo: "#46341f",
  fotografia: "#46341f",
  articolo: "#574848",
};

interface Props {
  doc: GameDocument;
  faction?: FactionId;
  compareMode: boolean;
  selected: { docId: string; label: string } | null;
  selectedPair: { docId: string; label: string } | null;
  onSelectField: (docId: string, label: string, value: string) => void;
  width?: number;
}

export function DocumentCard({
  doc,
  faction,
  compareMode,
  selected,
  selectedPair,
  onSelectField,
  width = 300,
}: Props) {
  const classified = doc.authLevel === "riservato" || doc.authLevel === "segreto";
  // l'identità segue CHI ha emesso il documento; "state" = ufficio neutro;
  // ignoto = ricade sull'affiliazione del caso.
  const inferred = factionFromIssuer(doc.issuer);
  const docFaction: FactionId | undefined = inferred === "state" ? undefined : (inferred ?? faction);
  const fac = docFaction ? FACTIONS[docFaction] : undefined;
  // IDENTITÀ DELL'ENTE: carta intestata, fascia, colore, pattern propri.
  const ident = factionIdentity(docFaction);
  const facColor = fac?.color ?? "#b3a37a";
  // se c'è una fazione, la sua banda vince sul colore generico per tipo
  const band = fac ? ident.band : (BAND[doc.kind] ?? "#574848");
  const isPicked = (label: string) =>
    (selected?.docId === doc.id && selected.label === label) ||
    (selectedPair?.docId === doc.id && selectedPair.label === label);

  return (
    <div
      className={`rds-paper ${fac ? "" : PAPER_VAR[doc.kind] ?? ""} overflow-hidden`}
      style={{ width, ...(fac ? { backgroundColor: ident.paper, borderColor: ident.band } : {}) }}
    >
      {/* filigrana: stemma dell'ente in trasparenza */}
      <div className="absolute right-1 bottom-3 opacity-[0.07] pointer-events-none">
        {docFaction ? <FactionEmblem faction={docFaction} size={116} /> : <Emblem size={120} color="#14110d" />}
      </div>
      {/* pattern dell'ente, debolissimo, su tutto il foglio */}
      {fac && (
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: ident.pattern }} />
      )}
      {/* bordo perforato a sinistra */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 pointer-events-none opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,17,13,0.5) 1px, transparent 1.4px)",
          backgroundSize: "6px 7px",
        }}
      />

      {/* carta intestata dell'ente — filo istituzionale in alto */}
      <div style={{ backgroundColor: facColor, height: 3 }} />
      <div className="px-1.5 py-1 flex items-center gap-1.5" style={{ backgroundColor: band }}>
        {docFaction ? <FactionEmblem faction={docFaction} size={18} /> : <Emblem size={18} color="#efeddc" />}
        <div className="min-w-0">
          <div className="font-pixel uppercase text-[11px] leading-none text-paper-cream truncate">{doc.title}</div>
          <div className="font-read text-[10px] uppercase tracking-wide text-paper-cream/70 leading-tight truncate">
            {doc.issuer ?? fac?.name ?? (KIND_LABEL[doc.kind] ?? doc.kind)}
          </div>
        </div>
        {fac && fac.sigla !== "—" && (
          <div
            className="ml-auto shrink-0 font-pixel text-[8px] uppercase tracking-wider px-1 py-0.5 leading-none text-paper-cream"
            style={{ border: `1px solid ${ident.accent}` }}
          >
            {fac.sigla}
          </div>
        )}
        <div className={`${fac && fac.sigla !== "—" ? "" : "ml-auto"} font-pixel text-[7px] uppercase text-paper-cream/70 shrink-0`}>
          {KIND_LABEL[doc.kind] ?? doc.kind}
        </div>
      </div>

      <div className="relative p-3 pl-4">
        {classified && (
          <div className="rds-classified font-pixel text-[8px] tracking-[0.2em] text-center py-1 mb-2">
            {doc.authLevel === "segreto" ? "SEGRETO" : "RISERVATO"}
          </div>
        )}

        <div className="flex gap-2.5">
          {doc.photo && (
            <div className="shrink-0">
              <Photo seed={doc.photo.seed} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {doc.fields.map((f, i) => {
              const pickable = compareMode && f.comparable;
              return (
                <div key={i} className="flex items-baseline gap-1.5 border-b border-dotted border-ink/25 py-0.5">
                  <span className="font-pixel text-[8px] uppercase tracking-wider text-ink/55 shrink-0 w-[68px] leading-tight">
                    {f.label}
                  </span>
                  {pickable ? (
                    <button
                      data-no-drag
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => onSelectField(doc.id, f.label, f.value)}
                      className={`font-read text-[16px] text-left leading-tight flex-1 min-w-0 ${
                        isPicked(f.label) ? "bg-stamp-red/30 text-ink" : "text-ink hover:bg-black/10"
                      }`}
                    >
                      {f.value}
                    </button>
                  ) : (
                    <span className="font-read text-[16px] text-ink leading-tight flex-1 min-w-0">{f.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {doc.body && doc.body.length > 0 && (
          <div className="mt-2 pt-1.5 font-read text-[15px] text-ink/90 space-y-1 leading-snug relative">
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

        {/* piè di pagina: protocollo + firma */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="font-term text-[12px] text-ink/60 leading-none">
            {doc.protocollo ? `PROT. ${doc.protocollo}` : " "}
          </div>
          <div className="text-right">
            <div className="font-[cursive] text-[14px] text-ink-blu/80 leading-none italic -rotate-3 pr-2">
              {scribble(doc.id)}
            </div>
            <div className="font-pixel text-[6px] uppercase tracking-wider text-ink/40 border-t border-ink/30 pt-0.5 mt-0.5">
              Il funzionario
            </div>
          </div>
        </div>

        {((doc.stamps && doc.stamps.length > 0) || fac) && (
          <div className="mt-2 flex gap-2 flex-wrap items-center">
            {doc.stamps?.map((s, i) => (
              <Stamp key={i} label={s} rotate={i % 2 === 0 ? -6 : 5} />
            ))}
            {/* timbro DEDICATO dell'ente di provenienza */}
            {fac && <Stamp label={ident.stampLabel} color={facColor} rotate={(doc.stamps?.length ?? 0) % 2 === 0 ? 6 : -5} />}
          </div>
        )}
      </div>
    </div>
  );
}

// firma illeggibile deterministica
function scribble(seed: string): string {
  const marks = ["ʃ↜∿", "ϟ⌇~", "∿ʃ↝", "⌁∿ʃ", "↜ϟ∿"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return marks[h % marks.length] as string;
}
