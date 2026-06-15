import type { NpcDef } from "@/types";

/**
 * NPC ricorrenti: il loro stato è derivato dai flag della run (memoria delle
 * tue scelte). Mostrati nella "Rubrica" della notte. Il primo flag attivo vince.
 */
export const NPCS: NpcDef[] = [
  {
    id: "renzo",
    name: "Renzo Calabro",
    role: "Sospetto militante",
    faction: "brigate",
    defaultStatus: "Non ancora incrociato",
    statusByFlag: [
      { flag: "renzo_aiutato", status: "Scarcerato grazie a una tua nota", tone: "buono" },
      { flag: "militante_protetto", status: "Scagionato: ti sei esposto per lui", tone: "buono" },
      { flag: "dato_anello_renzo", status: "Sparito — consegnato all'Anello", tone: "cattivo" },
      { flag: "militante_segnalato", status: "Arrestato all'alba su tua segnalazione", tone: "cattivo" },
      { flag: "militante_espatriato", status: "Espatriato in Francia col tuo timbro", tone: "neutro" },
    ],
  },
  {
    id: "ardenti",
    name: "Giudice Ardenti",
    role: "Magistrato",
    faction: "procura",
    defaultStatus: "Indaga, da solo, con poca scorta",
    statusByFlag: [
      { flag: "dossier_procura", status: "Ha in mano il tuo dossier", tone: "buono" },
      { flag: "prova_a_procura", status: "Ha la pratica 0418", tone: "buono" },
      { flag: "verbale_alla_procura", status: "Indaga sull'appalto Bramante", tone: "buono" },
      { flag: "accesso_negato", status: "Bloccato dall'alto, per ora", tone: "neutro" },
    ],
  },
  {
    id: "bechis",
    name: "Cronista Bechis",
    role: "Cronista d'inchiesta",
    faction: "stampa",
    defaultStatus: "Annusa qualcosa, gira intorno all'ufficio",
    statusByFlag: [
      { flag: "dossier_stampa", status: "Pubblica il tuo dossier", tone: "buono" },
      { flag: "passato_stampa", status: "Ha la foto, pronta alla stampa", tone: "buono" },
      { flag: "bechis_segnalato", status: "Segnalato come ricettatore", tone: "cattivo" },
      { flag: "protetta_operazione", status: "Ha bruciato la foto", tone: "neutro" },
    ],
  },
  {
    id: "velardi",
    name: "Sottosegretario Velardi",
    role: "Apparato di governo",
    faction: "governo",
    defaultStatus: "Ti osserva dall'alto",
    statusByFlag: [
      { flag: "verbale_alla_procura", status: "Ti vuole fermo: gli hai bruciato un appalto", tone: "cattivo" },
      { flag: "servito_crisanti", status: "In debito con te", tone: "buono" },
      { flag: "distrutto_verbale_0418", status: "«Sarà ricordato»", tone: "buono" },
      { flag: "verbale_archiviato", status: "Non ti perdona la disobbedienza", tone: "cattivo" },
    ],
  },
];

export function getNpc(id: string): NpcDef | undefined {
  return NPCS.find((n) => n.id === id);
}
