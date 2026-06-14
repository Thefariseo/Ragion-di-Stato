# Modello dati — tipi e sistema contenuti

Tutti i tipi vivono in `types/`. I contenuti sono **data file TypeScript** in
`data/`, letti da funzioni pure in `game/`. Sotto, la forma essenziale (la fonte
di verità è `types/`).

## Identificatori
```ts
type FactionId =
  | 'governo' | 'sir' | 'anello' | 'brigate' | 'procura' | 'stampa' // core
  | 'avanguardia' | 'rete' | 'cupola' | 'sindacato' | 'loggia' | 'salotto'; // lore

type DocKind =
  | 'fascicolo' | 'permesso' | 'informativa' | 'tessera' | 'rapporto'
  | 'intercettazione' | 'fotografia' | 'verbale' | 'nota' | 'telex'
  | 'ordine' | 'articolo' | 'lettera';

type ActionKind =
  | 'approva' | 'respingi' | 'archivia' | 'segnala'
  | 'trasmetti' | 'occulta' | 'distruggi' | 'proteggi' | 'incastra' | 'verifica';
```

## Indicatori e stato
```ts
interface FactionStanding { reputation: number; suspicion: number; } // rep −100..100, susp 0..100

interface CountryState {       // 0..100 ciascuno
  repressione: number; caos: number; verita: number; compromesso: number;
}

interface PlayerState {
  stipendio: number;  // lire accumulate
  famiglia: number;   // 0..100 sicurezza
  lucidita: number;   // 0..100
  sospetto: number;   // 0..100 quanto l'Apparato sospetta di te
}

interface GameState {
  seed: number;
  rngCursor: number;            // avanzamento RNG (riproducibilità)
  day: number;                  // 1-based
  phase: GamePhase;             // 'title' | 'briefing' | ... | 'ending'
  clock: number;                // minuti d'ufficio trascorsi (0 = 09:00)
  player: PlayerState;
  factions: Record<FactionId, FactionStanding>;
  country: CountryState;
  flags: Record<string, boolean>;
  queue: string[];              // id caso da processare oggi
  currentCaseIndex: number;
  processed: ProcessedCase[];   // log decisioni (caso, azione, giorno)
  pendingInjects: string[];     // casi sbloccati da iniettare nei giorni futuri
  log: LogEntry[];              // diario eventi per sintesi/UI
  endingId?: string;
  version: number;
}
```

## Documenti
```ts
interface DocumentField { label: string; value: string; group?: string; }

interface GameDocument {
  id: string;
  kind: DocKind;
  title: string;
  issuer?: string;          // provenienza / ente emittente
  authLevel?: 'libero' | 'riservato' | 'segreto';
  fields: DocumentField[];  // dati confrontabili
  body?: string[];          // paragrafi (informativa, articolo…)
  photo?: { seed: number; label?: string }; // foto sgranata procedurale
  stamps?: string[];        // timbri già presenti
  censored?: number;        // n. righe oscurate
  protocollo?: string;
}
```

## Regole (motore di validazione)
```ts
interface Rule {
  id: string;
  text: string;                              // come appare nel regolamento
  // valuta un caso e ritorna eventuale violazione
  check: (c: CaseDef, ctx: RuleContext) => RuleViolation | null;
}
interface RuleViolation { ruleId: string; message: string; fields?: string[]; }
```
`validateCase(case, activeRules)` ⇒ `{ inRegola, violazioni }`. Le **discrepanze**
narrative (campo A vs campo B) sono dichiarate sul caso e rivelate dalla lente.

## Casi
```ts
interface Discrepancy { aDocId: string; aField: string; bDocId: string; bField: string; note: string; }

interface CaseAction {
  id: string; label: string; kind: ActionKind;
  needsStamp?: boolean;
  consequence: Consequence;
  hint?: string;                 // suggerimento UI (non rivela l'esito)
}

interface CaseDef {
  id: string;
  subject: string;               // nome del soggetto/pratica
  faction?: FactionId;           // fazione collegata al caso
  summary: string;               // riga di intestazione della pratica
  documents: GameDocument[];
  discrepancies?: Discrepancy[];
  regulationVerdict?: 'approva' | 'respingi'; // cosa dice il regolamento
  actions: CaseAction[];
  appearsIfFlag?: string;        // inject condizionato
  tags?: string[];
}
```

## Conseguenze (cuore di scelte→effetti)
```ts
interface FactionDelta { reputation?: number; suspicion?: number; }

interface Consequence {
  text: string;                                       // esito narrativo
  factions?: Partial<Record<FactionId, FactionDelta>>;
  rivalSpill?: boolean;                               // reazione a catena rivali
  player?: Partial<PlayerState>;                      // delta risorse
  country?: Partial<CountryState>;                    // delta Paese
  sospetto?: number;                                  // delta sospetto sul player
  setFlags?: string[]; clearFlags?: string[];
  unlockCases?: string[];                             // inject futuri
  unlockEndings?: string[];
  logTitle?: string;
}
```
`applyConsequence(state, consequence)` applica tutti i delta con clamp, propaga
le reazioni a catena tra fazioni (`rivalSpill`), setta flag e accoda inject.

## Eventi
```ts
interface EventOption { label: string; consequence: Consequence; }
interface GameEvent {
  id: string; trigger: 'random' | 'scripted';
  day?: number; afterCaseIndex?: number; requiresFlag?: string;
  channel: 'telefono' | 'telex' | 'busta' | 'ispezione' | 'voce';
  title: string; body: string[];
  options: EventOption[];
  weight?: number;            // peso per selezione random (seed)
}
```

## Giornate
```ts
interface DayDef {
  day: number;
  date: string;               // es. "Lunedì 12 marzo"
  headline: string;           // titolo di giornale del briefing
  briefing: string[];         // testo del comunicato del mattino
  directives: string[];       // nuove regole/ordini (testo)
  ruleIds: string[];          // regole attive in giornata
  caseIds: string[];          // coda base (gli inject si aggiungono)
  events: string[];           // eventi candidabili
  quota: number;              // pratiche minime da evadere
}
```

## Finali
```ts
interface EndingDef {
  id: string; title: string; epitaph: string[]; priority: number;
  condition: (s: GameState) => boolean;
}
```
`evaluateEndings(state)` ⇒ l'`EndingDef` a `priority` massima la cui `condition`
è vera; fallback `sistema_immutato`.

---

## Contenuti del prototipo
- **Fazioni:** 6 core con dati completi + 6 lore (stub descrittivi).
- **Giornate:** 3 (`days.ts`), con briefing, direttive, regole e quota.
- **Casi:** 13+ (`cases/day1|2|3.ts`), inclusi gli esempi-archetipo del GDD.
- **Regole:** ~8 (`rules.ts`), introdotte progressivamente.
- **Eventi:** 3 (`events.ts`): telefono dell'Anello, ispezione interna, busta.
- **Conseguenze cross-day:** ≥2 (es. il latitante segnalato/protetto ritorna; la
  nota del superiore denunciata/eseguita cambia il Giorno 2–3).
- **Finali:** 6 (`endings.ts`) + fallback.
