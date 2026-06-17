/**
 * Ragion di Stato — tipi condivisi.
 * Unica fonte di verità per motore (game/), contenuti (data/) e UI (components/).
 */

/* ------------------------------------------------------------------ Fazioni */

export type FactionId =
  // core (prototipo)
  | "governo" // Democrazia Solidale (DC-like)
  | "sir" // Servizio Informazioni e Riservatezza (servizi ufficiali)
  | "anello" // l'Anello (servizi deviati)
  | "brigate" // Brigate Proletarie (lotta armata sinistra)
  | "procura" // la Procura (magistratura)
  | "stampa" // la Stampa (giornalismo d'inchiesta)
  // lore (estendibili)
  | "avanguardia" // Avanguardia Nera (lotta armata destra)
  | "rete" // la Rete / Quercia (stay-behind)
  | "cupola" // la Cupola (criminalità organizzata)
  | "sindacato" // il Sindacato
  | "loggia" // la Loggia
  | "salotto"; // il Salotto (poteri economici)

export interface FactionDef {
  id: FactionId;
  name: string;
  sigla: string;
  core: boolean;
  /** colore identificativo (CSS) per timbri/etichette */
  color: string;
  ideology: string;
  goals: string;
  methods: string;
  resources: string;
  keyFigures: string[];
  secret: string;
  /** fazioni naturalmente ostili: ricevono spill di sospetto quando favorisci questa */
  rivals: FactionId[];
}

export interface FactionStanding {
  /** quanto la fazione ti favorisce: -100..100 */
  reputation: number;
  /** quanto la fazione sospetta di te: 0..100 */
  suspicion: number;
}

/* ---------------------------------------------------------------- Documenti */

export type DocKind =
  | "fascicolo"
  | "permesso"
  | "informativa"
  | "tessera"
  | "rapporto"
  | "intercettazione"
  | "fotografia"
  | "verbale"
  | "nota"
  | "telex"
  | "ordine"
  | "articolo"
  | "lettera";

export type AuthLevel = "libero" | "riservato" | "segreto";

export interface DocumentField {
  label: string;
  value: string;
  /** campo confrontabile nella modalità lente */
  comparable?: boolean;
}

export interface GameDocument {
  id: string;
  kind: DocKind;
  title: string;
  issuer?: string;
  authLevel?: AuthLevel;
  protocollo?: string;
  fields: DocumentField[];
  body?: string[];
  /** foto sgranata generata proceduralmente da seed */
  photo?: { seed: number; label?: string };
  /** timbri già presenti sul documento */
  stamps?: string[];
  /** numero di righe oscurate (censura) */
  censored?: number;
}

/* -------------------------------------------------------------------- Regole */

export interface RuleContext {
  day: number;
  flags: Record<string, boolean>;
}

export interface RuleViolation {
  ruleId: string;
  message: string;
}

export interface Rule {
  id: string;
  text: string;
  check: (c: CaseDef, ctx: RuleContext) => RuleViolation | null;
}

export interface ValidationResult {
  inRegola: boolean;
  violations: RuleViolation[];
}

/* --------------------------------------------------------------------- Casi */

export type ActionKind =
  | "approva"
  | "respingi"
  | "archivia"
  | "segnala"
  | "trasmetti"
  | "occulta"
  | "distruggi"
  | "proteggi"
  | "incastra"
  | "verifica";

export interface Discrepancy {
  aDocId: string;
  aField: string;
  bDocId: string;
  bField: string;
  note: string;
}

export interface CaseAction {
  id: string;
  label: string;
  kind: ActionKind;
  /** se true, l'azione apporta un timbro (animazione + suono) */
  needsStamp?: boolean;
  /** etichetta del timbro apposto, se diversa dal default per kind */
  stampLabel?: string;
  consequence: Consequence;
  /** suggerimento UI: NON rivela l'esito */
  hint?: string;
}

export interface CaseDef {
  id: string;
  subject: string;
  faction?: FactionId;
  summary: string;
  /** breve descrizione di chi/cosa si presenta alla scrivania */
  intro?: string[];
  documents: GameDocument[];
  discrepancies?: Discrepancy[];
  regulationVerdict?: "approva" | "respingi";
  actions: CaseAction[];
  /** inject condizionato: il caso entra in coda solo se il flag è attivo */
  appearsIfFlag?: string;
  tags?: string[];
}

/* -------------------------------------------------------------- Conseguenze */

export interface FactionDelta {
  reputation?: number;
  suspicion?: number;
}

export interface PlayerState {
  stipendio: number;
  famiglia: number;
  lucidita: number;
  sospetto: number;
  /** debiti accumulati saltando le spese della notte */
  debiti: number;
}

export interface CountryState {
  repressione: number;
  caos: number;
  verita: number;
  compromesso: number;
}

export interface Consequence {
  text: string;
  factions?: Partial<Record<FactionId, FactionDelta>>;
  /** propaga sospetto alle fazioni rivali di quelle favorite */
  rivalSpill?: boolean;
  player?: Partial<PlayerState>;
  country?: Partial<CountryState>;
  /** delta diretto al sospetto dell'Apparato verso il giocatore */
  sospetto?: number;
  setFlags?: string[];
  clearFlags?: string[];
  unlockCases?: string[];
  unlockEndings?: string[];
  logTitle?: string;
}

/* ------------------------------------------------------------------- Eventi */

export type EventChannel =
  | "telefono"
  | "telex"
  | "busta"
  | "ispezione"
  | "voce";

export interface EventOption {
  label: string;
  consequence: Consequence;
}

export interface GameEvent {
  id: string;
  trigger: "random" | "scripted";
  day?: number;
  /** scatta dopo aver processato N casi della giornata */
  afterCaseIndex?: number;
  requiresFlag?: string;
  forbidsFlag?: string;
  channel: EventChannel;
  title: string;
  body: string[];
  options: EventOption[];
  weight?: number;
}

/* ----------------------------------------------------------------- Giornate */

export interface DayDef {
  day: number;
  date: string;
  headline: string;
  briefing: string[];
  directives: string[];
  ruleIds: string[];
  caseIds: string[];
  events: string[];
  quota: number;
  /** lire per pratica evasa */
  payPerCase: number;
}

/* --------------------------------------------------------------- Citazioni */

export type CitationSeverity = "lieve" | "grave";

export interface Citation {
  id: string;
  day: number;
  caseId: string;
  reason: string;
  severity: CitationSeverity;
  fine: number;
  ruleId?: string;
  /** se false, la multa arriva senza spiegazione (giorni più opachi) */
  visibleToPlayer: boolean;
}

/* ----------------------------------------------------------- Notte/economia */

export interface NightNeed {
  id: string;
  label: string;
  desc: string;
  cost: number;
  /** conseguenza se NON pagata */
  skipText: string;
  skip: {
    famiglia?: number;
    lucidita?: number;
    sospetto?: number;
    debiti?: number;
    setFlags?: string[];
  };
  /** conseguenza se pagata (oltre alla spesa) */
  payFamiglia?: number;
  payLucidita?: number;
}

export type NightDecision = "paga" | "salta";

export interface NightSummary {
  day: number;
  speso: number;
  saltate: string[];
  note: string[];
}

/* ----------------------------------------------------------------- Giornale */

export interface NewspaperItem {
  headline: string;
  body?: string;
  /** appare solo se il flag è attivo (o assente se forbid) */
  requiresFlag?: string;
  forbidsFlag?: string;
}

export interface NewspaperView {
  masthead: string;
  date: string;
  lead: string;
  leadBody: string;
  photoSeed: number;
  items: { headline: string; body?: string }[];
  sidebar: { title: string; body: string };
}

/* --------------------------------------------------------------------- NPC */

export interface NpcDef {
  id: string;
  name: string;
  role: string;
  faction?: FactionId;
  /** mappa flag → etichetta di stato (il primo flag attivo vince) */
  statusByFlag: { flag: string; status: string; tone: "buono" | "cattivo" | "neutro" }[];
  defaultStatus: string;
}

export interface NpcView {
  id: string;
  name: string;
  role: string;
  status: string;
  tone: "buono" | "cattivo" | "neutro";
}

/* --------------------------------------------------------------- Cutscene */

export type CutsceneBg = "black" | "corridor" | "archive" | "paper" | "desk";
export type CutsceneVisual =
  | "none"
  | "letter"
  | "stamp"
  | "newspaper"
  | "emblems"
  | "telex"
  | "folder";

export type CutsceneScene =
  | "stampfall"
  | "letter"
  | "corridor"
  | "emblems"
  | "telex"
  | "dossier"
  | "newspaper"
  | "archive"
  | "door";

export interface CutsceneBeat {
  bg?: CutsceneBg;
  visual?: CutsceneVisual;
  /** scena animata della sequenza (timeline + oggetti animati) */
  scene?: CutsceneScene;
  headline?: string;
  emblems?: { faction: FactionId; caption: string }[];
  title?: string;
  lines?: string[];
  stampLabel?: string;
  sound?: "type" | "stamp" | "telex" | "thud" | "paper" | "ring";
  music?: string;
  /** se impostata, avanza da sola; altrimenti attende il click */
  durationMs?: number;
}

export interface Cutscene {
  id: string;
  beats: CutsceneBeat[];
}

/* ------------------------------------------------------------------ Finali */

export interface EndingDef {
  id: string;
  title: string;
  epitaph: string[];
  priority: number;
  condition: (s: GameState) => boolean;
}

/* --------------------------------------------------------------- GameState */

export type GamePhase =
  | "title"
  | "intro"
  | "cutscene"
  | "newspaper"
  | "briefing"
  | "directives"
  | "desk"
  | "event"
  | "daySummary"
  | "night"
  | "ending";

export interface ProcessedCase {
  caseId: string;
  actionId: string;
  actionKind: ActionKind;
  day: number;
  inRegola: boolean;
}

export interface LogEntry {
  day: number;
  title: string;
  text: string;
}

export interface GameState {
  version: number;
  seed: number;
  rngCursor: number;
  day: number;
  phase: GamePhase;
  clock: number; // minuti trascorsi dalle 09:00
  player: PlayerState;
  factions: Record<FactionId, FactionStanding>;
  country: CountryState;
  flags: Record<string, boolean>;
  queue: string[];
  currentCaseIndex: number;
  processed: ProcessedCase[];
  pendingInjects: string[];
  /** eventi già scattati (per non ripeterli) */
  firedEvents: string[];
  /** evento attivo in attesa di scelta del giocatore */
  activeEventId?: string;
  /** cutscene attiva e fase a cui tornare quando finisce */
  activeCutscene?: string;
  cutsceneReturn?: GamePhase;
  log: LogEntry[];
  /** citazioni/multe accumulate nella run */
  citations: Citation[];
  /** resoconto dell'ultima giornata chiusa */
  lastSummary?: DaySummary;
  /** resoconto dell'ultima notte */
  lastNight?: NightSummary;
  endingId?: string;
}

export interface DaySummary {
  day: number;
  processedCount: number;
  quota: number;
  pay: number;
  penalty: number;
  /** numero di citazioni della giornata */
  citationsCount: number;
  /** totale multe della giornata */
  fines: number;
  notes: string[];
}
