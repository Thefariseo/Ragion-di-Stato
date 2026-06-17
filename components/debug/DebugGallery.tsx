"use client";

import { ALL_FACTION_IDS, FACTIONS } from "@/data/factions";
import { FactionEmblem } from "@/components/desk/FactionEmblem";
import { NpcSprite } from "@/components/desk/NpcSprite";
import { Stamp } from "@/components/ui/Stamp";
import { playMusic, stopMusic } from "@/lib/music";
import { playStamp, playPaper, playTelex, playRing, playThud, playDrawer, playClick } from "@/lib/sfx";

const PALETTE: [string, string][] = [
  ["env1", "#26221c"], ["env3", "#564e43"], ["legno", "#6a522f"], ["oliva", "#848a6b"],
  ["carta", "#efeddc"], ["verde", "#e0e9c7"], ["rosa", "#ecd8dd"], ["inchiostro", "#574848"],
  ["blu", "#201c3c"], ["timbro v.", "#53701b"], ["timbro r.", "#701b1b"], ["ocra", "#9a6b30"], ["neon", "#8fb9ad"],
];
const MUSIC = ["solenne", "lavoro", "tensione", "finale"];
const SFX: [string, () => void][] = [
  ["timbro", playStamp], ["carta", playPaper], ["telex", playTelex],
  ["telefono", playRing], ["tonfo", playThud], ["cassetto", playDrawer], ["click", playClick],
];

export function DebugGallery({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] bg-[#0a0907]/97 overflow-auto thin-scroll p-4 text-paper">
      <div className="flex items-center justify-between mb-3 border-b border-neon/30 pb-1">
        <span className="font-pixel uppercase text-neon text-sm tracking-widest">Galleria asset · debug</span>
        <button onClick={onClose} className="border border-neon/40 px-3 py-1 font-pixel text-[9px] uppercase text-neon">chiudi</button>
      </div>

      <Section title="Stemmi fazione">
        <div className="flex flex-wrap gap-3">
          {ALL_FACTION_IDS.map((id) => (
            <div key={id} className="flex flex-col items-center w-20">
              <FactionEmblem faction={id} size={36} />
              <span className="font-read text-[9px] text-paper/70 text-center mt-1 leading-tight">{FACTIONS[id].sigla}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Timbri">
        <div className="flex flex-wrap gap-3 items-center">
          {["APPROVATO", "RESPINTO", "SEGNALATO", "RISERVATO", "SEGRETO", "NON ESIBIBILE"].map((s) => (
            <Stamp key={s} label={s} rotate={-5} />
          ))}
        </div>
      </Section>

      <Section title="Volti / NPC (seed diversi)">
        <div className="flex flex-wrap gap-2">
          {[1, 7, 13, 21, 34, 55, 89].map((s) => (
            <NpcSprite key={s} seed={s} width={64} />
          ))}
        </div>
      </Section>

      <Section title="Palette">
        <div className="flex flex-wrap gap-2">
          {PALETTE.map(([n, hex]) => (
            <div key={n} className="text-center">
              <div className="w-12 h-8 border border-black" style={{ backgroundColor: hex }} />
              <span className="font-read text-[8px] text-paper/60">{n}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Musica">
        <div className="flex flex-wrap gap-2">
          {MUSIC.map((m) => (
            <button key={m} onClick={() => playMusic(m)} className="border border-neon/40 px-3 py-1 font-pixel text-[9px] uppercase text-neon hover:bg-neon hover:text-[#0a0907]">{m}</button>
          ))}
          <button onClick={() => stopMusic()} className="border border-neon/40 px-3 py-1 font-pixel text-[9px] uppercase text-neon">stop</button>
        </div>
      </Section>

      <Section title="Effetti sonori">
        <div className="flex flex-wrap gap-2">
          {SFX.map(([n, fn]) => (
            <button key={n} onClick={fn} className="border border-neon/40 px-3 py-1 font-pixel text-[9px] uppercase text-neon hover:bg-neon hover:text-[#0a0907]">{n}</button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 border border-neon/15 p-3">
      <div className="font-pixel text-[9px] uppercase tracking-widest text-neon/80 mb-2">{title}</div>
      {children}
    </div>
  );
}
