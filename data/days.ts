import type { DayDef } from "@/types";

export const LAST_DAY = 10;

const R_BASE = ["nomi_concordi", "tessera_valida", "protocollo_obbligatorio"];
const R_SEGRETO = [...R_BASE, "nulla_osta_riservato", "firma_valida"];
const R_FOTO = [...R_SEGRETO, "foto_corrisponde"];
const R_ALL = [...R_FOTO, "provenienza_riconosciuta"];

/**
 * Le 10 giornate lavorative. La complessità entra UNA COSA PER VOLTA:
 * prima burocrazia, poi sospetto, poi paura, poi compromesso.
 * Vedi docs/DAY_BY_DAY_LORE_PLAN.md per il filo narrativo.
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
    ruleIds: R_BASE,
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
    ruleIds: R_SEGRETO,
    caseIds: ["d2_informatore", "d2_magistrato", "d2_giornalista", "d2_telex_routine"],
    events: ["ev_grazie_renzo", "ev_ispezione"],
    quota: 4,
    payPerCase: 25000,
  },
  3: {
    day: 3,
    date: "Lunedì 19 marzo",
    headline: "BUROCRAZIA E CODE AGLI SPORTELLI. «LO STATO C'È», ASSICURA IL VIMINALE",
    briefing: [
      "Settimana nuova. Le carte si accumulano: la routine è la prima forma del potere.",
      "Quando un allegato manca, non timbri al buio. Chieda una verifica. È un suo diritto. Per ora.",
      "Niente di eclatante, oggi. È così che si fa carriera: senza farsi notare.",
    ],
    directives: [
      "NUOVO: pratica incompleta o allegato mancante: richiedere verifica prima di decidere.",
      "Non convalidare carichi e contenuti non specificati.",
      "Restano in vigore le disposizioni precedenti.",
    ],
    ruleIds: R_SEGRETO,
    caseIds: ["a3_pratica_incompleta", "a3_tessera_doppia"],
    events: [],
    quota: 2,
    payPerCase: 26000,
  },
  4: {
    day: 4,
    date: "Mercoledì 21 marzo",
    headline: "«PIENA FIDUCIA NEGLI APPARATI», RIBADISCE IL SOTTOSEGRETARIO VELARDI",
    briefing: [
      "Da oggi la fotografia conta quanto il nome. Una faccia su due documenti che non combaciano è un problema. Suo.",
      "Qualcuno, allo sportello, non sarà chi dice di essere. Lo capirà solo se confronta.",
      "Si fidi delle carte, non delle facce. Le facce mentono meglio.",
    ],
    directives: [
      "NUOVO: la fotografia deve corrispondere al soggetto e al nominativo dichiarato.",
      "Identità in conflitto tra documenti: confrontare prima di convalidare.",
      "Restano in vigore le disposizioni precedenti.",
    ],
    ruleIds: R_FOTO,
    caseIds: ["a4_doppia_identita"],
    events: [],
    quota: 1,
    payPerCase: 27000,
  },
  5: {
    day: 5,
    date: "Venerdì 23 marzo",
    headline: "APPALTI DEL PORTO, L'OPPOSIZIONE CHIEDE CHIAREZZA. MAGGIORANZA COMPATTA",
    briefing: [
      "Provenienza ignota o anonima: respingere. Non è prudenza, è ordine.",
      "Oggi vedrà un sigillo che non ha mai chiesto a nessuno: un anello spezzato. Faccia finta di niente. O non lo faccia.",
      "Le ricordiamo che questo ufficio non ha memoria. Solo archivi.",
    ],
    directives: [
      "NUOVO: provenienza «ignota» o «anonima»: respingere, senza annotazioni.",
      "Un nulla osta privo di firma e intestazione non è un atto valido.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    caseIds: ["a5_nulla_osta_anello"],
    events: [],
    quota: 1,
    payPerCase: 28000,
  },
  6: {
    day: 6,
    date: "Lunedì 26 marzo",
    headline: "STATO DI TENSIONE NELLA CAPITALE. «CONTROLLI RAFFORZATI A TUTELA DEI CITTADINI»",
    briefing: [
      "Oggi qualcuno la chiamerà. Una voce cortese, senza nome. Ascolti pure. Decidere, però, tocca a lei.",
      "Il nome «Cardo» tornerà. E con lui due lettere e un numero: «fondo R».",
      "Più sa, più pesa ciò che sa. Non dica che non l'avevamo avvertita.",
    ],
    directives: [
      "Le comunicazioni telefoniche non producono atti. Verbale solo ciò che è scritto.",
      "Materiale che collega fonti di Stato a movimenti di denaro: trattare come SEGRETO.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    caseIds: ["a6_fascicolo_cardo2"],
    events: ["ev_telefonata_fondo"],
    quota: 1,
    payPerCase: 29000,
  },
  7: {
    day: 7,
    date: "Giovedì 29 marzo",
    headline: "RETATA ALL'ALBA, FERMI NELL'AUTONOMIA. «OPERAZIONE DI ROUTINE»",
    briefing: [
      "Oggi il corridoio non starà zitto. Tenga gli occhi sulle carte: ciò che accade fuori dal vetro non la riguarda. In teoria.",
      "Un indirizzo può pesare quanto una confessione. Lo confronti, se ne ha il fegato.",
      "Le ricordiamo che la paura è un ottimo collante amministrativo.",
    ],
    directives: [
      "Coincidenze di recapito tra atti pubblici ed elenchi riservati: vanno rilevate.",
      "Non lasciare l'ufficio durante gli allarmi. La pratica resta comunque sua.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    caseIds: ["a7_porto_armi_rete", "d3_documento_cupola"],
    events: ["ev_scorta_g7"],
    quota: 2,
    payPerCase: 30000,
  },
  8: {
    day: 8,
    date: "Sabato 31 marzo",
    headline: "IL MATTINO, PRIMA PAGINA: CIÒ CHE HA DECISO IERI, OGGI È NOTIZIA",
    briefing: [
      "Apra il giornale prima della pratica. Qualcosa, lì dentro, ha la sua firma. Anche se non c'è scritto.",
      "Oggi due carte sullo stesso uomo si contraddicono. Una è firmata, l'altra no. Le firme, qui, si vendicano.",
      "Decida. Ma sappia che, da oggi, decidere si vede.",
    ],
    directives: [
      "Ordine firmato e informativa non firmata in conflitto: prevale la procedura, non la fretta.",
      "Ogni fermo dev'essere sorretto da atto valido. La responsabilità resta dell'ufficio.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    caseIds: ["d3_innocente_rete", "d3_ordine_conflitto"],
    events: [],
    quota: 2,
    payPerCase: 30000,
  },
  9: {
    day: 9,
    date: "Mercoledì 4 aprile",
    headline: "«TUTTO REGOLARE», RIPETE IL PALAZZO. MA QUALCOSA, STAVOLTA, NON TORNA",
    briefing: [
      "Oggi le arriverà tra le mani ciò che il suo predecessore stava chiudendo quando è sparito: il «fondo R».",
      "Non esiste una scelta pulita. Esistono solo conseguenze, e a chi le farà pagare.",
      "Pensi alla sua famiglia. Lo pensano anche loro, quando pensano a lei.",
    ],
    directives: [
      "Atti che espongono più apparati insieme: massima riservatezza, decisione personale.",
      "Ogni inoltro fuori dal palazzo è atto ostile, salvo autorizzazione. Non l'avrà.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    // le varianti ret_* sono mutuamente esclusive (appearsIfFlag): l'NPC che
    // torna — e COME torna — dipende da cosa hai fatto con Renzo e Giulia.
    caseIds: ["ret_renzo_torna", "ret_giulia_torna", "ret_conto_brigate", "a9_fondo_r", "d3_politico_nota"],
    events: ["ev_busta"],
    quota: 2,
    payPerCase: 32000,
  },
  10: {
    day: 10,
    date: "Sabato 7 aprile",
    headline: "EDIZIONE STRAORDINARIA ANNUNCIATA, POI RITIRATA. NESSUNA SPIEGAZIONE",
    briefing: [
      "Ultima giornata. Le luci del ministero si spengono piano per piano. Resterà lei, e una sola scelta.",
      "Tutto ciò che è passato da questa scrivania, in queste settimane, ora pesa insieme.",
      "Decida cosa entra negli archivi dello Stato. E cosa sparisce. Non glielo chiederemo due volte.",
    ],
    directives: [
      "Chiusura dei procedimenti pendenti.",
      "Si raccomanda conformità. E silenzio.",
      "Restano in vigore tutte le disposizioni precedenti.",
    ],
    ruleIds: R_ALL,
    caseIds: ["d3_dossier_finale"],
    events: [],
    quota: 1,
    payPerCase: 32000,
  },
};

export function getDay(day: number): DayDef | undefined {
  return DAYS[day];
}
