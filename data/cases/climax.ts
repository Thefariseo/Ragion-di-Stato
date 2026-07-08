import type { CaseDef } from "@/types";
import { respingi, archivia, segnala, special } from "./helpers";

/**
 * Casi della FASE FINALE (giorni 7–10): i nodi vengono al pettine.
 * Nuove regole (provenienza, foto). I nodi vengono al pettine.
 * L'ultimo caso, d3_dossier_finale, indirizza i finali.
 */
export const CLIMAX_CASES: CaseDef[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: "d3_politico_nota",
    subject: "On. Crisanti",
    faction: "governo",
    summary: "«Tolga dagli atti la pratica 0418. È nell'interesse del Paese.»",
    intro: [
      "Stavolta la nota la porta un usciere in giacca buona. Viene dall'Onorevole in persona.",
      "Il tono è cortese. La minaccia è sottintesa.",
    ],
    documents: [
      {
        id: "d3c1_nota",
        kind: "nota",
        title: "Nota dell'On. Crisanti",
        issuer: "Segreteria On. Crisanti",
        authLevel: "riservato",
        protocollo: "R-0610/1974",
        fields: [{ label: "Firma", value: "Crisanti", comparable: true }],
        body: [
          "Tolga dagli atti la pratica 0418 e tutto ciò che la richiama.",
          "È nell'interesse del Paese. Il suo, e di chi le sta a cuore.",
        ],
      },
      {
        id: "d3c1_pratica",
        kind: "fascicolo",
        title: "Pratica 0418 (richiami)",
        issuer: "Archivio Centrale",
        authLevel: "riservato",
        fields: [
          { label: "Collegamenti", value: "appalto Bramante, fondo del partito", comparable: true },
        ],
        body: ["Il filo, se tirato, arriva molto in alto."],
      },
    ],
    actions: [
      special("distruggi", "Obbedisci (distruggi)", "distruggi", {
        text: "La pratica 0418 e i suoi richiami spariscono. L'Onorevole ti farà avere i suoi ringraziamenti, nei modi che conosce.",
        factions: { governo: { reputation: 12 }, anello: { reputation: 6 } },
        country: { verita: -8, compromesso: 5 },
        sospetto: -4,
        setFlags: ["servito_crisanti"],
        logTitle: "Distrutta la pratica 0418 per l'On. Crisanti",
      }),
      archivia({
        text: "Non tocchi niente. La pratica resta dov'è. Hai detto di no a un Onorevole: pochi lo fanno, e non gratis.",
        factions: { governo: { reputation: -10 }, procura: { reputation: 6 } },
        sospetto: 6,
        setFlags: ["conservato_0418"],
        logTitle: "Conservata la pratica 0418",
      }),
      special("trasmetti_procura", "Copia alla Procura", "trasmetti", {
        text: "Fai uscire una copia dal palazzo, diretta ad Ardenti. Il fondo del partito ha ora un indirizzo: la Procura.",
        factions: {
          procura: { reputation: 14 },
          governo: { reputation: -14 },
          anello: { suspicion: 8 },
        },
        country: { verita: 8 },
        sospetto: 12,
        setFlags: ["prova_a_procura"],
        logTitle: "Pratica 0418 copiata alla Procura",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: "d3_innocente_rete",
    specialActionId: "trasmetti_procura",
    subject: "Elia Conti",
    faction: "rete",
    summary: "Un maestro elementare il cui nome compare su una lista che non dovrebbe esistere",
    intro: [
      "Un uomo mite, maestro elementare, chiede il rinnovo del porto d'armi sportivo.",
      "Tutto in regola. Solo che il suo nome è anche altrove, su un foglio censurato che ti è arrivato per sbaglio.",
    ],
    documents: [
      {
        id: "d3c2_porto",
        kind: "permesso",
        title: "Porto d'armi sportivo",
        issuer: "Questura di Roma",
        authLevel: "libero",
        protocollo: "04501/1974",
        photo: { seed: 3030, label: "Conti" },
        fields: [
          { label: "Nome", value: "Elia Conti", comparable: true },
          { label: "Professione", value: "maestro elementare", comparable: true },
          { label: "Validità", value: "VALIDA", comparable: true },
          { label: "Provenienza", value: "Questura di Roma", comparable: true },
        ],
      },
      {
        id: "d3c2_lista",
        kind: "fascicolo",
        title: "Elenco riservato (censurato)",
        issuer: "—",
        authLevel: "segreto",
        censored: 6,
        fields: [
          { label: "Nome", value: "Elia Conti", comparable: true },
          { label: "Voce", value: "deposito presso — [omissis]", comparable: true },
          { label: "Nulla osta", value: "ASSENTE", comparable: true },
        ],
        body: [
          "Elenco di nominativi e recapiti «da attivare in caso di emergenza».",
          "Sei righe oscurate. La settima è il nome di un maestro elementare.",
        ],
      },
    ],
    discrepancies: [
      {
        aDocId: "d3c2_porto",
        aField: "Professione",
        bDocId: "d3c2_lista",
        bField: "Voce",
        note: "Un maestro elementare custodisce un «deposito» per conto di una struttura clandestina. Non lo sa, o finge.",
      },
    ],
    regulationVerdict: "approva",
    actions: [
      special("approva_conti", "Rinnova e lascia perdere", "approva", {
        text: "Timbri il porto d'armi e fai finta di non aver visto la lista. Conti torna alla sua classe. La Rete resta dov'è, intatta.",
        factions: { rete: { reputation: 6 } },
        country: { verita: -2 },
        setFlags: ["rete_intatta"],
        logTitle: "Conti rinnovato, lista ignorata",
      }, { needsStamp: true, stampLabel: "APPROVATO" }),
      special("trasmetti_procura", "Consegna la lista alla Procura", "trasmetti", {
        text: "Porti la lista fuori. Se Ardenti regge, è il caso della sua vita. Se non regge, è la fine della tua. Stanotte la macchina sotto casa non è la tua.",
        factions: {
          procura: { reputation: 16 },
          rete: { reputation: -16, suspicion: 14 },
          anello: { suspicion: 10 },
        },
        player: { famiglia: -10 },
        country: { verita: 10 },
        sospetto: 12,
        setFlags: ["scoperta_rete"],
        unlockEndings: ["scoperta_rete"],
        logTitle: "Lista della Rete consegnata alla Procura",
      }),
      special("occulta", "Fai sparire la lista", "occulta", {
        text: "La lista non è mai esistita. Conti non saprà mai di essere stato a un timbro dal baratro. Né tu glielo dirai.",
        factions: { anello: { reputation: 10 }, rete: { reputation: 8 } },
        country: { verita: -6 },
        sospetto: -4,
        setFlags: ["occultata_rete"],
        logTitle: "Occultata la lista della Rete",
      }),
      segnala({
        text: "Segnali Conti. Aprono un fascicolo su un maestro che insegnava l'asta delle «a». La Rete capisce che qualcuno ha letto la lista, e si chiede chi.",
        factions: { rete: { suspicion: 10 }, sir: { reputation: -6 } },
        player: { lucidita: -4 },
        country: { repressione: 2 },
        setFlags: ["conti_segnalato"],
        logTitle: "Maestro Conti segnalato",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: "d3_documento_cupola",
    specialActionId: "trasmetti_procura",
    subject: "Esposto anonimo",
    faction: "cupola",
    summary: "Sembra un falso. Ma dice il vero.",
    intro: [
      "Un esposto anonimo, battuto a macchina male, pieno di errori.",
      "Provenienza ignota: la regola di oggi direbbe di cestinarlo. Eppure i nomi che fa combaciano.",
    ],
    documents: [
      {
        id: "d3c3_esposto",
        kind: "lettera",
        title: "Esposto anonimo",
        issuer: "—",
        authLevel: "libero",
        fields: [
          { label: "Provenienza", value: "ignota", comparable: true },
          { label: "Accusa", value: "denaro da «Don» Scalìa per l'appalto", comparable: true },
        ],
        body: [
          "Un uomo del governo prende soldi dalla Cupola per gli appalti del porto.",
          "Chiedete del verbale 0418, se ancora esiste.",
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      respingi(
        {
          text: "Provenienza ignota: la regola di oggi è chiara. Cestini l'esposto. Il fatto che fosse vero non cambia la regola.",
          country: { verita: -3 },
          sospetto: -2,
          setFlags: ["scartato_esposto"],
          logTitle: "Esposto anonimo respinto (provenienza ignota)",
        },
        "Provenienza ignota: il regolamento di oggi impone di respingere.",
      ),
      special("verifica", "Confronta con gli atti", "verifica", {
        text: "Confronti l'esposto col verbale 0418. Combacia, riga per riga. È anonimo, è scritto male, ed è vero.",
        factions: { procura: { reputation: 8 } },
        setFlags: ["esposto_confermato"],
        logTitle: "Esposto anonimo confermato dagli atti",
      }),
      special("trasmetti_procura", "Trasmetti alla Procura", "trasmetti", {
        text: "Mandi l'esposto alla Procura. Un foglio anonimo può far cadere un uomo del governo, se finisce nelle mani giuste.",
        factions: {
          procura: { reputation: 12 },
          governo: { reputation: -8 },
          cupola: { suspicion: 10 },
        },
        player: { famiglia: -6 },
        country: { verita: 6 },
        sospetto: 8,
        setFlags: ["esposto_a_procura"],
        logTitle: "Esposto anonimo trasmesso alla Procura",
      }),
      special("occulta", "Fallo sparire", "occulta", {
        text: "Brucia l'esposto. Don Scalìa e l'uomo del governo continueranno a stringersi la mano alle inaugurazioni.",
        factions: { anello: { reputation: 6 }, cupola: { reputation: 6 } },
        country: { verita: -4 },
        sospetto: -3,
        setFlags: ["occultato_esposto"],
        logTitle: "Esposto anonimo occultato",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: "d3_ordine_conflitto",
    subject: "Caso Conti — ordine vs informativa",
    faction: "sir",
    summary: "Un ordine dice di fermarlo. Un'informativa dice che è un errore.",
    intro: [
      "Due carte sul caso Conti, arrivate a un'ora di distanza, che dicono il contrario.",
      "Una porta la firma del Colonnello. L'altra, nessuna firma.",
    ],
    documents: [
      {
        id: "d3c4_ordine",
        kind: "ordine",
        title: "Ordine di fermo",
        issuer: "SIR — Col. Beraldo",
        authLevel: "riservato",
        protocollo: "R-0655/1974",
        fields: [
          { label: "Firma", value: "Beraldo", comparable: true },
          { label: "Oggetto", value: "fermare e trattenere E. Conti", comparable: true },
        ],
        body: ["Si dispone il fermo immediato del nominativo in oggetto."],
      },
      {
        id: "d3c4_informativa",
        kind: "informativa",
        title: "Informativa riservata",
        issuer: "SIR — sezione III",
        authLevel: "riservato",
        protocollo: "R-0656/1974",
        fields: [
          { label: "Firma", value: "illeggibile", comparable: true },
          { label: "Esito", value: "Conti estraneo — errore di trascrizione", comparable: true },
        ],
        body: [
          "Il nominativo è finito in elenco per omonimia / errore di trascrizione. Si suggerisce di soprassedere.",
        ],
      },
    ],
    discrepancies: [
      {
        aDocId: "d3c4_ordine",
        aField: "Oggetto",
        bDocId: "d3c4_informativa",
        bField: "Esito",
        note: "L'ordine firmato vuole il fermo. L'informativa non firmata dice che è un errore. Una delle due qualcuno la vuole far sparire.",
      },
    ],
    actions: [
      special("incastra", "Esegui l'ordine (fermo)", "incastra", {
        text: "Dai corso al fermo. Conti viene prelevato a scuola, davanti ai bambini. L'ordine era firmato: ti copre. Non ti assolve.",
        factions: { sir: { reputation: 8 } },
        player: { lucidita: -5 },
        country: { repressione: 4 },
        setFlags: ["eseguito_ordine_conti"],
        logTitle: "Eseguito il fermo di Conti",
      }),
      special("proteggi", "Segui l'informativa (soprassiedi)", "proteggi", {
        text: "Allinei la pratica all'informativa: errore di trascrizione, nessun fermo. Vai contro una firma. Le firme, qui, si vendicano.",
        factions: { sir: { reputation: -6 }, procura: { reputation: 4 } },
        sospetto: 5,
        setFlags: ["protetto_conti"],
        logTitle: "Sospeso il fermo di Conti",
      }),
      special("verifica", "Chiedi conferma al Colonnello", "verifica", {
        text: "Rimandi tutto al Colonnello per conferma. Lui conferma il fermo, ovviamente. Hai solo perso tempo, e un po' di sonno.",
        factions: { sir: { suspicion: 4 } },
        player: { lucidita: -2 },
        setFlags: ["eseguito_ordine_conti"],
        logTitle: "Caso Conti rimesso al Colonnello",
      }),
    ],
  },

  /* ---------------------------------------------------------------- 5 — CLIMAX */
  {
    id: "d3_dossier_finale",
    subject: "Dossier «Ragion di Stato»",
    summary: "A fine giornata, sulla scrivania, c'è tutto. E una sola scelta.",
    intro: [
      "Le luci del ministero si spengono piano per piano. Resti tu.",
      "Davanti hai tutto quello che hai visto in queste settimane: il fondo del partito, l'Anello, la lista della Rete, la fonte Cardo.",
      "Puoi farne una cosa sola.",
    ],
    documents: [
      {
        id: "d3c5_dossier",
        kind: "fascicolo",
        title: "Dossier «Ragion di Stato»",
        issuer: "—",
        authLevel: "segreto",
        fields: [
          { label: "Contenuto", value: "tre giorni di carte, di nomi, di morti", comparable: true },
          { label: "Peso", value: "abbastanza da farti sparire", comparable: true },
        ],
        body: [
          "Tutto ciò che è passato da questa scrivania, raccolto in una cartella.",
          "In regola? Non c'è una regola per questo.",
        ],
      },
    ],
    actions: [
      special("trasmetti_stampa", "Consegna tutto alla Stampa", "trasmetti", {
        text: "Esci con il dossier sotto il cappotto e lo lasci a un cronista. Domani il Paese si sveglia diverso. Tu, forse, non ti svegli affatto.",
        factions: {
          stampa: { reputation: 20 },
          anello: { reputation: -20, suspicion: 12 },
          governo: { reputation: -20 },
        },
        player: { famiglia: -15 },
        country: { verita: 25, caos: 8 },
        sospetto: 20,
        setFlags: ["dossier_stampa"],
        unlockEndings: ["scandalo"],
        logTitle: "Dossier consegnato alla Stampa",
      }),
      special("trasmetti_procura", "Consegna alla Procura", "trasmetti", {
        text: "Affidi il dossier ad Ardenti, in mani che (forse) reggeranno. La giustizia avrà la sua occasione. Tu diventi un testimone, e i testimoni si proteggono male.",
        factions: {
          procura: { reputation: 20 },
          governo: { reputation: -16 },
          anello: { suspicion: 16 },
        },
        country: { verita: 18 },
        sospetto: 18,
        setFlags: ["dossier_procura"],
        unlockEndings: ["collaboratore_procura"],
        logTitle: "Dossier consegnato alla Procura",
      }),
      special("distruggi", "Brucia tutto e accetta la promozione", "distruggi", {
        text: "Dài fuoco a tre giorni di verità. Lunedì troverai una targhetta nuova sulla porta e una moquette sotto i piedi. Il sistema sa premiare i suoi.",
        factions: {
          governo: { reputation: 20 },
          anello: { reputation: 18 },
        },
        country: { verita: -20, compromesso: 10 },
        sospetto: -15,
        setFlags: ["dossier_bruciato"],
        unlockEndings: ["assorbito"],
        logTitle: "Dossier distrutto, promozione accettata",
      }),
      special("occulta", "Tieni una copia e sparisci", "occulta", {
        text: "Fotocopi tutto, prepari una borsa, lasci la luce accesa per far credere che ci sei. Domani non ci sarai. Da qualche parte, un giorno, quelle carte torneranno utili.",
        player: { famiglia: 5 },
        sospetto: 6,
        setFlags: ["preparata_fuga"],
        unlockEndings: ["fuga"],
        logTitle: "Copia del dossier trafugata, fuga preparata",
      }),
    ],
  },
];
