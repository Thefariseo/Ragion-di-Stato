import type { DayDef } from "@/types";

export const LAST_DAY = 3;

/**
 * Le giornate lavorative. Ogni DayDef definisce briefing, direttive (testo),
 * regole attive (ruleIds), coda base (caseIds), eventi candidabili, quota e paga.
 */
export const DAYS: Record<number, DayDef> = {
  1: {
    day: 1,
    date: "Lunedì 12 marzo",
    headline: "TENSIONE NELLE FABBRICHE, IL GOVERNO: «NESSUN CEDIMENTO»",
    briefing: [
      "Ufficio Validazione e Archivio Centrale. Primo giorno.",
      "Il suo predecessore è stato «trasferito». Non chieda dove.",
      "Lei convalida ciò che passa. Niente di più, niente di meno. Lo dica a sé stesso abbastanza volte e magari ci crederà.",
    ],
    directives: [
      "Convalidare permessi e tessere secondo regolamento.",
      "Il nominativo deve coincidere su tutti i documenti.",
      "Documenti scaduti: respingere.",
      "Informative, rapporti, ordini e verbali: senza protocollo non sono validi.",
    ],
    ruleIds: ["nomi_concordi", "tessera_valida", "protocollo_obbligatorio"],
    caseIds: ["d1_permesso", "d1_tessera_scaduta", "d1_fascicolo_foto", "d1_militante", "d1_nota_superiore"],
    events: ["ev_telefono_anello"],
    quota: 4,
    payPerCase: 25000,
  },
  2: {
    day: 2,
    date: "Giovedì 15 marzo",
    headline: "ORDIGNO IN PERIFERIA, NESSUNA RIVENDICAZIONE CREDIBILE",
    briefing: [
      "Tre giorni e ha già imparato che «in regola» e «giusto» sono due timbri diversi.",
      "Da oggi la sua firma vale di più, e per questo costa di più.",
      "Le ricordiamo che esistono gli Affari Interni, e che oggi potrebbero ricordarsene anche loro.",
    ],
    directives: [
      "NUOVO: documenti RISERVATO o SEGRETO richiedono nulla osta dell'Anello.",
      "NUOVO: ordini e lettere devono recare firma leggibile.",
      "Ogni dossier che tocca l'ordine pubblico va trasmesso al SIR.",
      "Restano valide le direttive precedenti.",
    ],
    ruleIds: [
      "nomi_concordi",
      "tessera_valida",
      "protocollo_obbligatorio",
      "nulla_osta_riservato",
      "firma_valida",
    ],
    caseIds: ["d2_informatore", "d2_magistrato", "d2_giornalista", "d2_telex_routine"],
    events: ["ev_grazie_renzo", "ev_ispezione"],
    quota: 4,
    payPerCase: 25000,
  },
  3: {
    day: 3,
    date: "Sabato 17 marzo",
    headline: "STATO DI ALLERTA NELLA CAPITALE, RAFFORZATI I CONTROLLI",
    briefing: [
      "Stato di allerta. Oggi il palazzo è più nervoso del solito, e il nervosismo, qui, si scarica verso il basso.",
      "Le carte che le arriveranno oggi pesano più delle altre. Alcune pesano quanto una vita.",
      "Qualunque cosa decida, a fine giornata, decida anche cosa farne di tutto il resto.",
    ],
    directives: [
      "NUOVO: provenienza «ignota» o «anonima»: respingere.",
      "NUOVO: la fotografia deve corrispondere al soggetto del fascicolo.",
      "VIETATA ogni trasmissione di atti alla stampa.",
      "Restano valide tutte le direttive precedenti.",
    ],
    ruleIds: [
      "nomi_concordi",
      "tessera_valida",
      "protocollo_obbligatorio",
      "nulla_osta_riservato",
      "firma_valida",
      "provenienza_riconosciuta",
      "foto_corrisponde",
    ],
    caseIds: [
      "d3_politico_nota",
      "d3_innocente_rete",
      "d3_documento_cupola",
      "d3_ordine_conflitto",
      "d3_dossier_finale",
    ],
    events: ["ev_busta"],
    quota: 4,
    payPerCase: 30000,
  },
};

export function getDay(day: number): DayDef | undefined {
  return DAYS[day];
}
