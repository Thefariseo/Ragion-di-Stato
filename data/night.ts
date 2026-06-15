import type { NightNeed } from "@/types";

/** Catalogo delle spese della notte. La selezione per giornata è in game/night.ts. */
export const NIGHT_NEEDS: Record<string, NightNeed> = {
  cibo: {
    id: "cibo",
    label: "Cibo per la famiglia",
    desc: "Pane, latte, qualcosa per i bambini.",
    cost: 30000,
    skipText: "A tavola si stringe la cinghia. A casa nessuno parla.",
    skip: { famiglia: -8, lucidita: -4 },
  },
  affitto: {
    id: "affitto",
    label: "Affitto",
    desc: "Il padrone di casa ha già bussato due volte.",
    cost: 80000,
    skipText: "Salti l'affitto. Una lettera di sfratto è solo questione di giorni.",
    skip: { famiglia: -10, debiti: 80000, setFlags: ["affitto_saltato"] },
  },
  medicine: {
    id: "medicine",
    label: "Medicine",
    desc: "La tosse di tua figlia non passa.",
    cost: 50000,
    skipText: "Niente medicine. La febbre sale, e con lei la tua ansia.",
    skip: { famiglia: -12, lucidita: -8 },
    payLucidita: 2,
  },
  riscaldamento: {
    id: "riscaldamento",
    label: "Riscaldamento",
    desc: "L'inverno della Repubblica è freddo.",
    cost: 22000,
    skipText: "Si dorme col cappotto. Al mattino le finestre sono ghiacciate.",
    skip: { lucidita: -6 },
  },
};
