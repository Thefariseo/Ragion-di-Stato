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
    headline: "FABBRICHE IN AGITAZIONE. IL GOVERNO: «NESSUN CEDIMENTO ALL'EVERSIONE»",
    briefing: [
      "Archivio Centrale Riservato. Da oggi la sua firma vale come quella dello Stato.",
      "Il suo predecessore risulta «trasferito». Agli atti non figura altro. Va bene così.",
      "Convalidi ciò che è conforme. Il resto non è materia di questo ufficio. Lo ripeta a sé stesso finché non ci crede.",
    ],
    directives: [
      "Convalidare permessi e tessere conformi al regolamento.",
      "Il nominativo deve coincidere su ogni allegato.",
      "Documento scaduto: respingere, senza eccezioni.",
      "Informative, rapporti, ordini, verbali: privi di protocollo, sono materiale non valido.",
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
    headline: "ORDIGNO NELLA NOTTE, RIVENDICAZIONE INCERTA. I SERVIZI INVITANO ALLA CAUTELA",
    briefing: [
      "Ha già imparato che «conforme» e «giusto» portano timbri diversi. Lo tenga per sé.",
      "Da oggi alcune carte sono RISERVATE. Le tratti come tali: meno occhi, meno problemi.",
      "Esistono gli Affari Interni. Oggi potrebbero ricordarsi che esiste anche lei.",
    ],
    directives: [
      "NUOVO: atti RISERVATO o SEGRETO richiedono nulla osta. In sua assenza, trattenere.",
      "NUOVO: ordini e lettere privi di firma leggibile non producono effetti.",
      "Ogni fascicolo che tocca l'ordine pubblico è trasmesso al Servizio per verifica preventiva.",
      "Restano in vigore le disposizioni precedenti.",
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
    headline: "STATO DI ALLERTA NELLA CAPITALE. «CONTROLLI RAFFORZATI A TUTELA DEI CITTADINI»",
    briefing: [
      "Stato di allerta. Il palazzo è nervoso, e il nervosismo, qui, scende sempre di un piano.",
      "Le carte di oggi pesano. Qualcuna pesa quanto una persona.",
      "A fine giornata decida anche cosa fare di ciò che le resta tra le mani. Non glielo chiederemo due volte.",
    ],
    directives: [
      "NUOVO: provenienza «ignota» o «anonima»: respingere, senza annotazioni.",
      "NUOVO: la fotografia deve corrispondere al soggetto del fascicolo.",
      "VIETATA ogni comunicazione di atti alla stampa. Ogni contatto non dichiarato è atto ostile.",
      "Restano in vigore tutte le disposizioni precedenti.",
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
