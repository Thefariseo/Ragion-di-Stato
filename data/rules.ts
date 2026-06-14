import type { CaseDef, Rule, GameDocument } from "@/types";

/* ----------------------------- helper di lettura campi ----------------------------- */

function fieldsByLabel(c: CaseDef, label: string): string[] {
  const out: string[] = [];
  for (const d of c.documents) {
    for (const f of d.fields) {
      if (f.label.toLowerCase() === label.toLowerCase()) out.push(f.value.trim());
    }
  }
  return out;
}

function docHasStamp(d: GameDocument, stamp: string): boolean {
  return (d.stamps ?? []).some((s) => s.toUpperCase().includes(stamp.toUpperCase()));
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/* --------------------------------------- regole --------------------------------------- */

export const RULES: Record<string, Rule> = {
  // Introdotta dal Giorno 1
  nomi_concordi: {
    id: "nomi_concordi",
    text: "Il nominativo deve coincidere in tutti i documenti della pratica.",
    check: (c) => {
      const nomi = fieldsByLabel(c, "Nome").map(norm).filter(Boolean);
      const unici = new Set(nomi);
      if (unici.size > 1)
        return {
          ruleId: "nomi_concordi",
          message: "Il nominativo non coincide tra i documenti.",
        };
      return null;
    },
  },

  // Introdotta dal Giorno 1
  tessera_valida: {
    id: "tessera_valida",
    text: "Tessere, permessi e nulla osta scaduti non sono validi.",
    check: (c) => {
      const validita = fieldsByLabel(c, "Validità").map(norm);
      if (validita.some((v) => v.includes("scad")))
        return {
          ruleId: "tessera_valida",
          message: "Documento scaduto: validità non più attiva.",
        };
      return null;
    },
  },

  // Introdotta dal Giorno 1
  protocollo_obbligatorio: {
    id: "protocollo_obbligatorio",
    text:
      "Informative, rapporti, ordini e verbali devono riportare un numero di protocollo.",
    check: (c) => {
      const richiede = new Set(["informativa", "rapporto", "ordine", "verbale"]);
      for (const d of c.documents) {
        if (richiede.has(d.kind) && !d.protocollo)
          return {
            ruleId: "protocollo_obbligatorio",
            message: `Manca il protocollo su «${d.title}».`,
          };
      }
      return null;
    },
  },

  // Introdotta dal Giorno 2
  nulla_osta_riservato: {
    id: "nulla_osta_riservato",
    text:
      "I documenti RISERVATO o SEGRETO richiedono nulla osta dell'Anello (campo «Nulla osta» o timbro).",
    check: (c) => {
      for (const d of c.documents) {
        if (d.authLevel === "riservato" || d.authLevel === "segreto") {
          const nullaOsta = d.fields.find(
            (f) => norm(f.label) === "nulla osta",
          );
          const ok =
            (nullaOsta && nullaOsta.value && !norm(nullaOsta.value).includes("assente")) ||
            docHasStamp(d, "NULLA OSTA");
          if (!ok)
            return {
              ruleId: "nulla_osta_riservato",
              message: `«${d.title}» è ${d.authLevel?.toUpperCase()} ma privo di nulla osta.`,
            };
        }
      }
      return null;
    },
  },

  // Introdotta dal Giorno 2
  firma_valida: {
    id: "firma_valida",
    text: "Ordini e lettere devono recare una firma leggibile.",
    check: (c) => {
      for (const d of c.documents) {
        if (d.kind === "ordine" || d.kind === "lettera") {
          const firma = d.fields.find((f) => norm(f.label) === "firma");
          if (!firma || !firma.value || norm(firma.value).includes("illeggibile"))
            return {
              ruleId: "firma_valida",
              message: `Firma assente o illeggibile su «${d.title}».`,
            };
        }
      }
      return null;
    },
  },

  // Introdotta dal Giorno 3 (stretta repressiva)
  provenienza_riconosciuta: {
    id: "provenienza_riconosciuta",
    text:
      "Sono accettati solo documenti di provenienza riconosciuta. La provenienza «ignota» va respinta.",
    check: (c) => {
      const prov = fieldsByLabel(c, "Provenienza").map(norm);
      if (prov.some((p) => p.includes("ignot") || p.includes("anonim")))
        return {
          ruleId: "provenienza_riconosciuta",
          message: "Provenienza non riconosciuta.",
        };
      return null;
    },
  },

  // Introdotta dal Giorno 3
  foto_corrisponde: {
    id: "foto_corrisponde",
    text: "La fotografia allegata deve corrispondere al soggetto del fascicolo.",
    check: (c) => {
      const labels = c.documents
        .filter((d) => d.photo)
        .map((d) => norm(d.photo?.label ?? ""))
        .filter(Boolean);
      const unici = new Set(labels);
      if (unici.size > 1)
        return {
          ruleId: "foto_corrisponde",
          message: "La fotografia non corrisponde al soggetto dichiarato.",
        };
      return null;
    },
  },
};

export function getRules(ids: string[]): Rule[] {
  return ids.map((id) => RULES[id]).filter((r): r is Rule => Boolean(r));
}
