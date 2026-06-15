"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GamePhase, GameState, NightDecision } from "@/types";
import {
  SAVE_VERSION,
  advanceDay,
  chooseCaseAction,
  continueFromSummary,
  createGame,
  resolveEvent,
  resolveNight,
} from "@/game/engine";
import { randomSeed } from "@/lib/rng";

function titleState(): GameState {
  return { ...createGame(randomSeed()), phase: "title" };
}

interface GameStore {
  game: GameState;
  hydrated: boolean;
  setHydrated: () => void;

  startNewGame: (seed?: number) => void;
  goToPhase: (phase: GamePhase) => void;
  chooseAction: (actionId: string) => void;
  resolveEventOption: (optionIndex: number) => void;
  continueSummary: () => void;
  resolveNightChoices: (decisions: Record<string, NightDecision>) => void;
  backToTitle: () => void;

  // debug
  debugPatch: (patch: Partial<GameState>) => void;
  debugAdvanceDay: () => void;
  hasSave: () => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: titleState(),
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      startNewGame: (seed?: number) => {
        const s = typeof seed === "number" && !Number.isNaN(seed) ? seed >>> 0 : randomSeed();
        set({ game: createGame(s) });
      },

      goToPhase: (phase: GamePhase) =>
        set((st) => ({ game: { ...st.game, phase } })),

      chooseAction: (actionId: string) =>
        set((st) => ({ game: chooseCaseAction(st.game, actionId) })),

      resolveEventOption: (optionIndex: number) =>
        set((st) => ({ game: resolveEvent(st.game, optionIndex) })),

      continueSummary: () =>
        set((st) => ({ game: continueFromSummary(st.game) })),

      resolveNightChoices: (decisions: Record<string, NightDecision>) =>
        set((st) => ({ game: resolveNight(st.game, decisions) })),

      backToTitle: () => set({ game: titleState() }),

      debugPatch: (patch: Partial<GameState>) =>
        set((st) => ({ game: { ...st.game, ...patch } })),

      debugAdvanceDay: () => set((st) => ({ game: advanceDay(st.game) })),

      hasSave: () => {
        const g = get().game;
        return g.phase !== "title" && !g.endingId;
      },
    }),
    {
      name: "ragion-di-stato/save",
      version: SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (st) => ({ game: st.game }),
      migrate: (persisted, version) => {
        if (version !== SAVE_VERSION) {
          return { game: titleState() } as { game: GameState };
        }
        return persisted as { game: GameState };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
