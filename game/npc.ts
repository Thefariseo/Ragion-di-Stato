import { NPCS } from "@/data/npcs";
import type { NpcView } from "@/types";

/** Stato corrente degli NPC ricorrenti, derivato dai flag della run. */
export function buildNpcViews(flags: Record<string, boolean>): NpcView[] {
  return NPCS.map((n) => {
    const match = n.statusByFlag.find((s) => flags[s.flag]);
    return {
      id: n.id,
      name: n.name,
      role: n.role,
      status: match ? match.status : n.defaultStatus,
      tone: match ? match.tone : "neutro",
    };
  });
}
