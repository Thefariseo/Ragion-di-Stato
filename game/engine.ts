import { getDay, LAST_DAY } from "@/data/days";
import { getCase } from "@/data/cases";
import { getEvent } from "@/data/events";
import { FACTIONS } from "@/data/factions";
import { clamp } from "@/lib/format";
import type {
  Consequence,
  DaySummary,
  FactionId,
  GameState,
  NightDecision,
  NightSummary,
  PlayerState,
} from "@/types";
import { applyFactionDeltas, initFactions } from "./factions";
import { buildDayQueue, currentCaseId } from "./narrative";
import { pickEventAfter } from "./events";
import { resolveDayEnding } from "./endings";
import { validateCase } from "./rules";
import { computeCitation } from "./citations";
import { buildNightNeeds } from "./night";

export const SAVE_VERSION = 2;

const MIN_PER_CASE = 40;
const MIN_PER_EVENT = 15;

const DEFAULT_PLAYER: PlayerState = {
  stipendio: 120000,
  famiglia: 80,
  lucidita: 70,
  sospetto: 10,
  debiti: 0,
};

const DEFAULT_COUNTRY = {
  repressione: 45,
  caos: 40,
  verita: 20,
  compromesso: 55,
};

/* ------------------------------------------------------------- creazione */

export function createGame(seed: number): GameState {
  const base: GameState = {
    version: SAVE_VERSION,
    seed,
    rngCursor: 0,
    day: 1,
    phase: "intro",
    clock: 0,
    player: { ...DEFAULT_PLAYER },
    factions: initFactions(),
    country: { ...DEFAULT_COUNTRY },
    flags: {},
    queue: [],
    currentCaseIndex: 0,
    processed: [],
    pendingInjects: [],
    firedEvents: [],
    activeEventId: undefined,
    log: [],
    citations: [],
    lastSummary: undefined,
    lastNight: undefined,
    endingId: undefined,
  };
  base.queue = buildDayQueue(1, base.flags, base.pendingInjects);
  return base;
}

/* --------------------------------------------------- applica conseguenza */

function clampPlayerField(key: keyof PlayerState, value: number): number {
  if (key === "stipendio" || key === "debiti") return value; // non limitati
  return clamp(value, 0, 100);
}

export function applyConsequence(state: GameState, c: Consequence): GameState {
  const factions = applyFactionDeltas(state.factions, c.factions, c.rivalSpill);

  const player: PlayerState = { ...state.player };
  if (c.player) {
    for (const k of Object.keys(c.player) as (keyof PlayerState)[]) {
      const delta = c.player[k] ?? 0;
      player[k] = clampPlayerField(k, player[k] + delta);
    }
  }
  if (typeof c.sospetto === "number") {
    player.sospetto = clamp(player.sospetto + c.sospetto, 0, 100);
  }

  const country = { ...state.country };
  if (c.country) {
    for (const k of Object.keys(c.country) as (keyof typeof country)[]) {
      country[k] = clamp(country[k] + (c.country[k] ?? 0), 0, 100);
    }
  }

  const flags = { ...state.flags };
  for (const f of c.setFlags ?? []) flags[f] = true;
  for (const f of c.clearFlags ?? []) flags[f] = false;
  for (const e of c.unlockEndings ?? []) flags[`end:${e}`] = true;

  const pendingInjects = [...state.pendingInjects, ...(c.unlockCases ?? [])];

  const log = c.logTitle
    ? [...state.log, { day: state.day, title: c.logTitle, text: c.text }]
    : state.log;

  return { ...state, factions, player, country, flags, pendingInjects, log };
}

/* --------------------------------------------------- azione su un caso */

export function chooseCaseAction(state: GameState, actionId: string): GameState {
  const caseId = currentCaseId(state);
  if (!caseId) return state;
  const def = getCase(caseId);
  if (!def) return state;
  const action = def.actions.find((a) => a.id === actionId);
  if (!action) return state;

  const dayDef = getDay(state.day);
  const validation = validateCase(def, dayDef?.ruleIds ?? [], {
    day: state.day,
    flags: state.flags,
  });

  const citation = computeCitation(def, action, validation, state.day);

  let next = applyConsequence(state, action.consequence);
  next = {
    ...next,
    clock: next.clock + MIN_PER_CASE,
    currentCaseIndex: next.currentCaseIndex + 1,
    processed: [
      ...next.processed,
      {
        caseId,
        actionId,
        actionKind: action.kind,
        day: state.day,
        inRegola: validation.inRegola,
      },
    ],
    citations: citation ? [...next.citations, citation] : next.citations,
  };

  const eventId = pickEventAfter(next, next.currentCaseIndex);
  if (eventId) {
    return {
      ...next,
      activeEventId: eventId,
      firedEvents: [...next.firedEvents, eventId],
      phase: "event",
    };
  }

  if (next.currentCaseIndex >= next.queue.length) {
    return endDay(next);
  }
  return { ...next, phase: "desk" };
}

/* --------------------------------------------------- risoluzione evento */

export function resolveEvent(state: GameState, optionIndex: number): GameState {
  if (!state.activeEventId) return state;
  const ev = getEvent(state.activeEventId);
  if (!ev) return { ...state, activeEventId: undefined, phase: "desk" };
  const opt = ev.options[optionIndex];
  if (!opt) return state;

  let next = applyConsequence(state, opt.consequence);
  next = {
    ...next,
    clock: next.clock + MIN_PER_EVENT,
    activeEventId: undefined,
  };

  if (next.currentCaseIndex >= next.queue.length) {
    return endDay(next);
  }
  return { ...next, phase: "desk" };
}

/* --------------------------------------------------- chiusura giornata */

function descrizioneSospetto(v: number): string {
  if (v >= 75) return "Gli Affari Interni hanno aperto un fascicolo su di te.";
  if (v >= 50) return "Senti gli sguardi nei corridoi. Ti osservano.";
  if (v >= 25) return "Qualcuno, ai piani alti, ha annotato il tuo nome.";
  return "Per ora sei solo un altro timbro nell'ingranaggio.";
}

function fazionePiuVicina(state: GameState): string {
  let best: FactionId | null = null;
  let bestRep = -Infinity;
  for (const id of Object.keys(state.factions) as FactionId[]) {
    const rep = state.factions[id].reputation;
    if (rep > bestRep) {
      bestRep = rep;
      best = id;
    }
  }
  if (!best || bestRep <= 8) return "Nessuna fazione ti considera ancora dei suoi.";
  return `Oggi chi ti guarda con più favore è: ${FACTIONS[best].name}.`;
}

export function endDay(state: GameState): GameState {
  const dayDef = getDay(state.day);
  const processedToday = state.processed.filter(
    (p) => p.day === state.day,
  ).length;
  const quota = dayDef?.quota ?? 0;
  const payPerCase = dayDef?.payPerCase ?? 0;
  const pay = processedToday * payPerCase;
  const penalty = Math.max(0, quota - processedToday) * payPerCase;

  const todayCitations = state.citations.filter((c) => c.day === state.day);
  const fines = todayCitations.reduce((s, c) => s + c.fine, 0);
  const net = pay - penalty - fines;

  const player: PlayerState = {
    ...state.player,
    stipendio: state.player.stipendio + net,
  };

  const summary: DaySummary = {
    day: state.day,
    processedCount: processedToday,
    quota,
    pay,
    penalty,
    citationsCount: todayCitations.length,
    fines,
    notes: [
      descrizioneSospetto(player.sospetto),
      fazionePiuVicina(state),
    ],
  };

  let next: GameState = { ...state, player, lastSummary: summary, phase: "daySummary" };

  const endingId = resolveDayEnding(next);
  if (endingId) next = { ...next, endingId };

  return next;
}

/* --------------------------------------------------- avanzamento giorno */

export function continueFromSummary(state: GameState): GameState {
  if (state.endingId) return { ...state, phase: "ending" };
  return { ...state, phase: "night" };
}

/* ----------------------------------------------------- notte / economia */

export function resolveNight(
  state: GameState,
  decisions: Record<string, NightDecision>,
): GameState {
  const needs = buildNightNeeds(state);
  const player: PlayerState = { ...state.player };
  const flags = { ...state.flags };
  let speso = 0;
  const saltate: string[] = [];
  const note: string[] = [];

  for (const need of needs) {
    const affordable = player.stipendio - speso >= need.cost;
    const wantsPay = (decisions[need.id] ?? "paga") === "paga";
    if (wantsPay && affordable) {
      speso += need.cost;
      if (need.payFamiglia) player.famiglia = clamp(player.famiglia + need.payFamiglia, 0, 100);
      if (need.payLucidita) player.lucidita = clamp(player.lucidita + need.payLucidita, 0, 100);
    } else {
      saltate.push(need.label);
      note.push(need.skipText);
      if (need.skip.famiglia) player.famiglia = clamp(player.famiglia + need.skip.famiglia, 0, 100);
      if (need.skip.lucidita) player.lucidita = clamp(player.lucidita + need.skip.lucidita, 0, 100);
      if (need.skip.sospetto) player.sospetto = clamp(player.sospetto + need.skip.sospetto, 0, 100);
      if (need.skip.debiti) player.debiti += need.skip.debiti;
      for (const f of need.skip.setFlags ?? []) flags[f] = true;
    }
  }
  player.stipendio -= speso;

  const lastNight: NightSummary = { day: state.day, speso, saltate, note };
  const withNight: GameState = { ...state, player, flags, lastNight };
  return advanceDay(withNight);
}

export function advanceDay(state: GameState): GameState {
  const day = state.day + 1;
  const queue = buildDayQueue(day, state.flags, state.pendingInjects);
  return {
    ...state,
    day,
    queue,
    pendingInjects: [],
    currentCaseIndex: 0,
    clock: 0,
    activeEventId: undefined,
    lastSummary: undefined,
    phase: "newspaper",
  };
}

export function isLastDay(state: GameState): boolean {
  return state.day >= LAST_DAY;
}
