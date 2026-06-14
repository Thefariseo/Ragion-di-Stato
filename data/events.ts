import type { GameEvent } from "@/types";

/**
 * Eventi: scriptati (legati a giornata/flag) e casuali (pesati via seed).
 * Interrompono la coda, propongono una micro-scelta, applicano conseguenze.
 */
export const EVENTS: Record<string, GameEvent> = {
  // GIORNO 1 — il primo contatto con l'Anello
  ev_telefono_anello: {
    id: "ev_telefono_anello",
    trigger: "scripted",
    day: 1,
    afterCaseIndex: 2,
    channel: "telefono",
    title: "Il telefono squilla",
    body: [
      "Lo squillo riempie la stanza. Alzi la cornetta.",
      "Una voce calma, senza fretta: «Buongiorno. Non ci siamo mai visti e non ci vedremo. Ma da oggi lavoriamo, in un certo senso, insieme. Si ricordi: certe carte è meglio che le passi a noi. La richiameremo.»",
    ],
    options: [
      {
        label: "Ascolta in silenzio",
        consequence: {
          text: "Non dici nulla. Riattacchi solo quando lo fa lui. Ti resta in mano un ricevitore caldo e la sensazione di essere già schedato.",
          factions: { anello: { reputation: 6 } },
          setFlags: ["anello_contatto"],
          logTitle: "Primo contatto con l'Anello",
        },
      },
      {
        label: "Riattacca subito",
        consequence: {
          text: "Sbatti giù la cornetta. Dall'altra parte, probabilmente, qualcuno sorride e prende un appunto.",
          factions: { anello: { suspicion: 6 } },
          player: { lucidita: 2 },
          setFlags: ["anello_contatto"],
          logTitle: "Riattaccato in faccia all'Anello",
        },
      },
    ],
  },

  // GIORNO 2 — ispezione interna (Affari Interni)
  ev_ispezione: {
    id: "ev_ispezione",
    trigger: "scripted",
    day: 2,
    afterCaseIndex: 2,
    channel: "ispezione",
    title: "Ispezione interna",
    body: [
      "Due uomini degli Affari Interni entrano senza bussare.",
      "«Controllo di routine. Apra i cassetti, per cortesia.»",
      "Routine, dicono sempre così.",
    ],
    options: [
      {
        label: "Apri tutto, collabora",
        consequence: {
          text: "Mostri ogni cosa. Spulciano, prendono nota, se ne vanno senza salutare. Hai l'aria del funzionario che non ha niente da nascondere. Per ora basta.",
          sospetto: -4,
          player: { lucidita: -3 },
          logTitle: "Ispezione: piena collaborazione",
        },
      },
      {
        label: "Tieni chiuso il cassetto in basso",
        consequence: {
          text: "Un cassetto resta chiuso «perché è rotto». Loro fingono di crederci. Tu fingi di non sudare. Qualcosa, però, se lo segnano.",
          sospetto: 6,
          factions: { anello: { reputation: 4 } },
          player: { lucidita: -2 },
          logTitle: "Ispezione: cassetto tenuto chiuso",
        },
      },
    ],
  },

  // GIORNO 2 — ricompensa cross-day se hai protetto Renzo (G1)
  ev_grazie_renzo: {
    id: "ev_grazie_renzo",
    trigger: "scripted",
    day: 2,
    afterCaseIndex: 1,
    requiresFlag: "militante_protetto",
    channel: "busta",
    title: "Un biglietto senza firma",
    body: [
      "Tra le pratiche del mattino trovi un foglietto piegato in quattro che non ricordi di aver messo lì.",
      "Una grafia minuta: «Grazie per Renzo. Occhio all'ispezione di giovedì. Un amico.»",
    ],
    options: [
      {
        label: "Memorizza e brucia il biglietto",
        consequence: {
          text: "Mandi a mente l'avvertimento e bruci la carta nel posacenere. Sapere prima è già metà del vantaggio.",
          sospetto: -6,
          factions: { brigate: { reputation: 6 } },
          player: { lucidita: 4 },
          setFlags: ["avvisato_da_renzo"],
          logTitle: "Avvertito da un amico di Renzo",
        },
      },
    ],
  },

  // GIORNO 3 — la busta sotto la porta (tangente o minaccia)
  ev_busta: {
    id: "ev_busta",
    trigger: "scripted",
    day: 3,
    afterCaseIndex: 1,
    channel: "busta",
    title: "Una busta sotto la porta",
    body: [
      "Senti un fruscio. Sotto la porta è comparsa una busta spessa, senza nome.",
      "Pesa più di quanto dovrebbe pesare della semplice carta.",
    ],
    options: [
      {
        label: "Apri e conta",
        consequence: {
          text: "Banconote, ben stirate. Un foglietto: «Per la sua discrezione.» Le conti due volte, poi le metti via. Sei più ricco e meno tranquillo.",
          player: { stipendio: 400000, lucidita: -4 },
          factions: { anello: { reputation: 10 } },
          sospetto: 4,
          setFlags: ["presa_tangente"],
          logTitle: "Accettata la busta (tangente)",
        },
      },
      {
        label: "Consegnala agli Affari Interni",
        consequence: {
          text: "Porti la busta intatta agli Affari Interni e verbalizzi tutto. Loro ti guardano come si guarda un ingenuo, o un eroe. Stesso sguardo.",
          sospetto: -6,
          factions: { anello: { reputation: -10, suspicion: 8 } },
          player: { lucidita: -2 },
          setFlags: ["rifiutata_tangente"],
          logTitle: "Consegnata la busta agli Affari Interni",
        },
      },
      {
        label: "Bruciala senza aprirla",
        consequence: {
          text: "Non vuoi sapere quanto c'era dentro. La bruci. È l'unico modo per non doverci pensare. Quasi.",
          player: { lucidita: 2 },
          factions: { anello: { suspicion: 4 } },
          logTitle: "Busta bruciata senza aprirla",
        },
      },
    ],
  },
};

export function getEvent(id: string): GameEvent | undefined {
  return EVENTS[id];
}
