import type { EndingDef, GameState } from "@/types";

/**
 * I finali non dipendono da un singolo bivio ma dalla SOMMA della run.
 * `evaluateEndings` sceglie il finale a priorità massima la cui condizione è
 * vera. `sistema_immutato` è il fallback (priorità 0, sempre vero).
 */
export const ENDINGS: EndingDef[] = [
  {
    id: "arrestato",
    title: "L'alba degli Affari Interni",
    priority: 100,
    condition: (s: GameState) => s.player.sospetto >= 75,
    epitaph: [
      "Bussano che è ancora buio. Non sono i ladri: i ladri hanno più riguardo.",
      "Ti portano via in pantofole, davanti ai vicini che chiudono le persiane.",
      "Il tuo fascicolo, l'unico che non hai potuto toccare, è il tuo.",
      "Hai visto troppo, o hai parlato troppo. Per il sistema è la stessa cosa.",
    ],
  },
  {
    id: "scandalo",
    title: "Lo scandalo esplode",
    priority: 90,
    condition: (s: GameState) =>
      s.flags["dossier_stampa"] === true ||
      (s.flags["passato_stampa"] === true && s.country.verita >= 55),
    epitaph: [
      "La prima pagina è un colpo di mortaio. Per giorni non si parla d'altro.",
      "Cadono due sottosegretari, un editore, nessun mandante.",
      "Di te scrivono «una fonte interna». È il massimo dell'onore e della condanna.",
      "Il Paese ha visto in faccia un pezzo di sé. Non è detto che gli sia piaciuto.",
    ],
  },
  {
    id: "collaboratore_procura",
    title: "Il testimone",
    priority: 85,
    condition: (s: GameState) =>
      s.flags["dossier_procura"] === true || s.factions.procura.reputation >= 45,
    epitaph: [
      "Firmi verbali in una stanza senza finestre, con un giudice ostinato e una scorta che fuma.",
      "Le tue carte diventano capi d'imputazione. Qualcuno cadrà davvero.",
      "Vivrai sotto falso nome in una città di provincia, con la luce sempre accesa.",
      "Hai scelto la legge in un Paese che la usa come fisarmonica. Coraggio o ingenuità: lo dirà il processo.",
    ],
  },
  {
    id: "scoperta_rete",
    title: "Hai visto la Quercia",
    priority: 82,
    condition: (s: GameState) =>
      s.flags["scoperta_rete"] === true && s.factions.procura.reputation >= 20,
    epitaph: [
      "La lista esisteva davvero. Nomi, depositi, un piano per «il giorno dopo».",
      "Per qualche settimana sembra che il velo cada. Poi cadono, invece, le inchieste.",
      "A te capita un trasferimento improvviso, una promozione che è un esilio.",
      "Sai una cosa che non puoi dire. È il modo più sicuro per non dirla mai più.",
    ],
  },
  {
    id: "fuga",
    title: "La luce accesa",
    priority: 80,
    condition: (s: GameState) => s.flags["preparata_fuga"] === true,
    epitaph: [
      "Lasci la lampada accesa e la giacca sulla sedia. Esci dalla porta di servizio.",
      "Un treno notturno, una frontiera, una copia del dossier cucita nella fodera.",
      "Non sei un eroe né un traditore: sei uno che ha scelto di restare vivo.",
      "Un giorno, forse, quelle carte parleranno. O ammufiranno con te.",
    ],
  },
  {
    id: "complice_anello",
    title: "Uno di loro",
    priority: 70,
    condition: (s: GameState) =>
      s.factions.anello.reputation >= 35 && s.country.verita < 25,
    epitaph: [
      "Non ti chiamano più al telefono: ora ti invitano a pranzo.",
      "Hai imparato a far sparire le cose prima ancora che diventino un problema.",
      "Dormi bene. È la cosa più inquietante di tutte.",
      "Lo Stato vero, quello che non appare nei verbali, ha un funzionario in più. Te.",
    ],
  },
  {
    id: "assorbito",
    title: "La moquette",
    priority: 60,
    condition: (s: GameState) =>
      s.flags["dossier_bruciato"] === true ||
      (s.factions.governo.reputation >= 30 && s.player.sospetto < 30),
    epitaph: [
      "Targhetta nuova, ufficio più grande, una pianta finta nell'angolo.",
      "Hai capito la regola non scritta: la verità è una pratica come le altre, e si archivia.",
      "Tra vent'anni nessuno ricorderà il tuo nome, e a te andrà benissimo così.",
      "Il sistema non ti ha sconfitto. Ti ha promosso. È molto più efficace.",
    ],
  },
  {
    id: "sistema_immutato",
    title: "Il sistema sopravvive",
    priority: 0,
    condition: () => true,
    epitaph: [
      "Le pratiche evase, le pratiche arretrate. Domani altre carte, altre facce.",
      "Non hai salvato nessuno e non hai affondato nessuno. Hai solo timbrato.",
      "Un altro funzionario, un giorno, siederà a questa scrivania, e non saprà niente di te.",
      "Il Paese trema, si aggiusta, dimentica. La macchina gira. La macchina gira sempre.",
    ],
  },
];

export function getEnding(id: string): EndingDef | undefined {
  return ENDINGS.find((e) => e.id === id);
}
