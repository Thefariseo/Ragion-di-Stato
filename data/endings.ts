import type { EndingDef, GameState } from "@/types";

/**
 * I finali non dipendono da un singolo bivio ma dalla SOMMA della run.
 * `evaluateEndings` sceglie il finale a priorità massima la cui condizione è
 * vera. `sistema_immutato` è il fallback (priorità 0, sempre vero).
 * Scrittura: epiloghi politici e personali (vedi docs/WRITING_BIBLE.md).
 */
export const ENDINGS: EndingDef[] = [
  {
    id: "arrestato",
    title: "Radiato",
    priority: 100,
    condition: (s: GameState) => s.player.sospetto >= 75,
    epitaph: [
      "Bussarono che era ancora buio. Due uomini, una formula: «verifica preventiva».",
      "Sul suo fascicolo, l'unico che non aveva potuto toccare, calò un timbro rosso.",
      "Sua moglie chiese dove. Le risposero che era stato «trasferito».",
      "Il Mattino, in cronaca, due righe: «Funzionario infedele, indagini in corso».",
      "Aveva visto troppo, o detto troppo. Per l'ufficio competente è la stessa pratica.",
    ],
  },
  {
    id: "scandalo",
    title: "Edizione straordinaria",
    priority: 90,
    condition: (s: GameState) =>
      s.flags["dossier_stampa"] === true ||
      (s.flags["passato_stampa"] === true && s.country.verita >= 55),
    epitaph: [
      "Le rotative girarono tre ore prima del sequestro. Abbastanza per uscire in quattro città.",
      "Caddero due sottosegretari e un editore. Dei mandanti, negli atti, nessuna traccia.",
      "Bechis firmò l'inchiesta. Da allora dorme con la luce accesa, in una casa che non è la sua.",
      "Di lei scrissero «una fonte interna». È il massimo dell'onore, e della condanna.",
      "Il Paese vide in faccia un pezzo di sé. Poi, come sempre, voltò pagina.",
    ],
  },
  {
    id: "collaboratore_procura",
    title: "Il testimone",
    priority: 85,
    condition: (s: GameState) =>
      s.flags["dossier_procura"] === true || s.factions.procura.reputation >= 45,
    epitaph: [
      "Firmò verbali in una stanza senza finestre, accanto a un giudice che non si arrendeva.",
      "Le sue carte diventarono capi d'imputazione. Qualcuno, stavolta, cadde davvero.",
      "Ardenti gli strinse la mano una volta sola. «Non le ho chiesto coraggio. Una copia.»",
      "Per la famiglia, un nome nuovo e una città di provincia. Per lei, la luce sempre accesa.",
      "Aveva scelto la legge in un Paese che la piega come una fisarmonica. Il processo dirà se è servito.",
    ],
  },
  {
    id: "scoperta_rete",
    title: "La Quercia",
    priority: 82,
    condition: (s: GameState) =>
      s.flags["scoperta_rete"] === true && s.factions.procura.reputation >= 20,
    epitaph: [
      "La lista esisteva. Nomi, depositi, recapiti «da attivare il giorno dopo».",
      "Per qualche settimana parve che il velo cadesse. Poi caddero, invece, le inchieste.",
      "Il maestro Conti tornò in classe. Non seppe mai a un timbro da cosa.",
      "A lei toccò una promozione che era un esilio: stessa scrivania, finestra su un muro.",
      "Sa una cosa che non può dire. È il modo più sicuro perché non la dica mai più.",
    ],
  },
  {
    id: "fuga",
    title: "La luce accesa",
    priority: 80,
    condition: (s: GameState) => s.flags["preparata_fuga"] === true,
    epitaph: [
      "Lasciò la lampada accesa e la giacca sulla sedia. Uscì dalla porta di servizio.",
      "Un treno notturno, una frontiera distratta, una copia cucita nella fodera del cappotto.",
      "Non un eroe, non un traditore: un uomo che ha deciso di restare vivo.",
      "La famiglia lo raggiunse a primavera, con due valigie e nessun indirizzo da lasciare.",
      "Quelle carte, un giorno, parleranno. O ammuffiranno con lui, in qualche stanza in affitto.",
    ],
  },
  {
    id: "complice_anello",
    title: "Uno di loro",
    priority: 70,
    condition: (s: GameState) =>
      s.factions.anello.reputation >= 35 && s.country.verita < 25,
    epitaph: [
      "Smisero di chiamarlo al telefono. Cominciarono a invitarlo a pranzo.",
      "Imparò a far sparire le cose prima che diventassero un problema. «Conservi solo la copia conforme.»",
      "Renzo Calabro non risultò mai più da nessuna parte. Non chiese.",
      "Dorme bene. È la cosa più inquietante di tutte.",
      "Lo Stato che non appare nei verbali ha un funzionario in più. Lei.",
    ],
  },
  {
    id: "assorbito",
    title: "Il piano superiore",
    priority: 60,
    condition: (s: GameState) =>
      s.flags["dossier_bruciato"] === true ||
      (s.factions.governo.reputation >= 30 && s.player.sospetto < 30),
    epitaph: [
      "Il fascicolo fu chiuso con firma conforme. Nessuno lo cercò più.",
      "Lo trasferirono al piano superiore. Stessa scrivania, porta migliore, una pianta finta.",
      "Da lassù i corridoi sembravano più silenziosi. Era solo più lontano dalle voci.",
      "Capì la regola non scritta: la verità è una pratica come le altre, e si archivia.",
      "Il sistema non l'ha sconfitto. L'ha promosso. È molto più efficace.",
    ],
  },
  {
    id: "sistema_immutato",
    title: "La macchina gira",
    priority: 0,
    condition: () => true,
    epitaph: [
      "Pratiche evase, pratiche arretrate. Domani altre carte, altre facce allo sportello.",
      "Non ha salvato nessuno e non ha affondato nessuno. Ha timbrato, e basta.",
      "Il giornale del mattino parla d'altro. Di quel che è passato di qui, niente.",
      "Un altro funzionario, un giorno, siederà a questa scrivania, e non saprà nulla di lei.",
      "Il Paese trema, si aggiusta, dimentica. La macchina gira. La macchina gira sempre.",
    ],
  },
];

export function getEnding(id: string): EndingDef | undefined {
  return ENDINGS.find((e) => e.id === id);
}
