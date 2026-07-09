"use client";

import type { CutsceneBeat } from "@/types";
import { Stamp } from "@/components/ui/Stamp";
import { FactionEmblem } from "@/components/desk/FactionEmblem";
import { FactionCrest } from "@/components/desk/FactionCrest";
import { factionIdentity } from "@/data/factionIdentity";
import { BoothScene } from "@/components/desk/BoothScene";

/**
 * Rende la SCENA ANIMATA di un beat di cutscene: timeline + oggetti animati in
 * pixel low-res (timbro che cala, lettera, corridoio con porta, stemmi, telex,
 * dossier che si apre, archivio con le luci, porta). Non un pannello statico.
 * Le animazioni partono al montaggio (l'engine rimonta per ogni beat).
 */
export function CutsceneStage({ beat }: { beat: CutsceneBeat }) {
  const scene = beat.scene ?? "letter";

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {scene === "stampfall" && <StampFall label={beat.stampLabel ?? "RISERVATO"} />}
      {scene === "letter" && <Letter title={beat.title} />}
      {scene === "corridor" && <Corridor />}
      {scene === "crest" && beat.faction && <Crest faction={beat.faction} />}
      {scene === "emblems" && <Emblems emblems={beat.emblems ?? []} />}
      {scene === "telex" && <Telex />}
      {scene === "dossier" && <Dossier emblems={beat.emblems ?? []} />}
      {scene === "newspaper" && <Newspaper headline={beat.headline ?? "EDIZIONE STRAORDINARIA"} />}
      {scene === "archive" && <Archive />}
      {scene === "door" && <Door stampLabel={beat.stampLabel} solo={beat.variant === "solo"} />}
      {scene === "office_open" && <OfficeOpen />}
      {scene === "attentato" && <Attentato headline={beat.headline} />}
    </div>
  );
}

function StampFall({ label }: { label: string }) {
  return (
    <div className="relative cs-shake">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-24 bg-black/70 blur-[1px] cs-ink rounded" />
      <div className="cs-stamp-drop">
        <Stamp label={label} big rotate={-8} solid />
      </div>
    </div>
  );
}

function Letter({ title }: { title?: string }) {
  return (
    <div className="cs-paper-up rds-paper rds-paper--white w-[58%] max-w-xl p-5 relative">
      <div className="h-2 w-full bg-env-0 absolute -top-1 left-0 right-0 mx-auto" />
      {title && <div className="font-pixel uppercase text-[12px] text-stamp-red border-b-2 border-ink/30 pb-1 mb-3">{title}</div>}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="cs-slide h-2 bg-ink/35"
            style={{ width: `${88 - (i % 3) * 16}%`, animationDelay: `${250 + i * 180}ms` }}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <div className="cs-emblem" style={{ animationDelay: "1500ms" }}>
          <Stamp label="ASSEGNATO" rotate={-6} />
        </div>
      </div>
    </div>
  );
}

function Corridor() {
  return (
    <div className="absolute inset-0">
      <BoothScene />
      <div className="absolute inset-0 bg-black/45" />
      {/* porta in fondo che si apre sulla luce */}
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-16 h-28 bg-[#cdbf80] overflow-hidden">
        <div className="cs-door absolute inset-0 bg-[#0e120c]" />
      </div>
      {/* sagome che attraversano */}
      {[0, 2600, 5200].map((d, i) => (
        <div key={i} className="absolute bottom-[26%] left-0 animate-walkby" style={{ animationDelay: `${d}ms`, opacity: 0 }}>
          <div className="w-3 h-3 bg-[#0e0f0a] mx-auto" />
          <div className="w-4 h-10 bg-[#0e0f0a]" />
        </div>
      ))}
    </div>
  );
}

function Crest({ faction }: { faction: import("@/types").FactionId }) {
  const ident = factionIdentity(faction);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* pattern dell'ente a tutto campo, debolissimo */}
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: ident.pattern }} />
      {/* fasci di luce dietro la cresta */}
      <div className="absolute w-[60%] h-[60%] rounded-full blur-2xl opacity-25" style={{ backgroundColor: ident.accent }} />
      <div className="cs-emblem relative">
        <FactionCrest faction={faction} size={96} />
      </div>
    </div>
  );
}

function Emblems({ emblems }: { emblems: { faction: import("@/types").FactionId; caption: string }[] }) {
  const single = emblems.length === 1;
  return (
    <div className="w-[64%] max-w-2xl">
      <div className={single ? "flex flex-col items-center gap-3" : "grid grid-cols-1 gap-3"}>
        {emblems.map((e, i) => (
          <div key={i} className="flex items-center gap-3" style={{ justifyContent: single ? "center" : "flex-start" }}>
            <div className="cs-emblem" style={{ animationDelay: `${i * 260}ms` }}>
              <FactionEmblem faction={e.faction} size={single ? 64 : 34} />
            </div>
            <span className="cs-slide font-read text-[15px] text-paper-cream leading-snug" style={{ animationDelay: `${i * 260 + 160}ms` }}>
              {e.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Telex() {
  return (
    <div className="flex flex-col items-center">
      {/* macchina */}
      <div className="w-56 h-14 bg-[#23241f] border-2 border-black relative">
        <div className="absolute inset-x-3 top-2 h-2 bg-[#0a0b07]" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 h-1 bg-black" />
      </div>
      {/* striscia che esce */}
      <div className="cs-telex w-44 bg-[#e6e0c8] border-x-2 border-b-2 border-ink/40 px-2 py-1">
        <div className="font-term text-[13px] text-ink/80 leading-tight">
          <div>≡ DISPACCIO ≡</div>
          <div>▮▮▮▮ ▮▮ ▮▮▮▮▮</div>
          <div>▮▮▮▮▮▮ ▮▮▮</div>
          <div>▮▮ ▮▮▮▮ ▮▮▮▮</div>
          <div>— riservato —</div>
        </div>
      </div>
    </div>
  );
}

function Dossier({ emblems }: { emblems: { faction: import("@/types").FactionId; caption: string }[] }) {
  const e = emblems[0];
  return (
    <div className="relative w-72 h-44" style={{ perspective: "500px" }}>
      {/* contenuto interno */}
      <div className="absolute inset-0 rds-paper p-3 flex items-center justify-center cs-fade">
        {e && (
          <div className="flex flex-col items-center gap-2">
            <div className="cs-emblem" style={{ animationDelay: "500ms" }}>
              <FactionEmblem faction={e.faction} size={48} />
            </div>
          </div>
        )}
        <div className="cs-photo absolute top-3 right-3">
          <div className="w-10 h-12 bg-[#9a8c66] border-2 border-ink" />
        </div>
      </div>
      {/* copertina che si apre */}
      <div className="cs-folder absolute inset-0 tex-wood border-2 border-wood-lo flex items-center justify-center">
        <span className="rds-classified font-pixel text-[8px] tracking-widest text-paper-cream px-2 py-0.5">RISERVATO</span>
      </div>
    </div>
  );
}

function Newspaper({ headline }: { headline: string }) {
  return (
    <div className="cs-paper-up rds-paper w-[60%] max-w-xl p-4">
      <div className="font-pixel uppercase tracking-[0.1em] text-ink text-2xl border-b-4 border-double border-ink/60 pb-1 mb-2">Il Mattino</div>
      <div className="cs-headline font-pixel uppercase text-[20px] leading-tight text-ink mb-2">{headline}</div>
      <div className="columns-2 gap-3 [column-rule:1px_solid_rgba(20,17,13,0.2)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-2 bg-ink/25 mb-1.5" style={{ width: `${92 - (i % 3) * 12}%` }} />
        ))}
      </div>
    </div>
  );
}

function Archive() {
  return (
    <div className="absolute inset-0 tex-panel">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="cs-row-out absolute left-0 right-0 h-6 bg-[#3a342b] border-y border-black/60 flex items-center"
          style={{ top: `${8 + i * 12}%`, animationDelay: `${600 + i * 350}ms` }}
        >
          <div className="flex gap-1 px-3">
            {Array.from({ length: 14 }).map((__, k) => (
              <div key={k} className="w-3 h-4 bg-[#b3a37a]" style={{ opacity: 0.5 + ((k * 7) % 5) / 10 }} />
            ))}
          </div>
        </div>
      ))}
      {/* cassetto che esce */}
      <div className="cs-slide absolute left-[10%] bottom-[16%] w-28 h-7 bg-[#2a2620] border-2 border-black" style={{ animationDelay: "1200ms" }}>
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-6 h-1.5 bg-[#55584f]" />
      </div>
    </div>
  );
}

function OfficeOpen() {
  // apertura ufficio: buio, poi la lampada sfarfalla e si accende sul banco
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#070806]" />
      {/* pozza di luce della lampada */}
      <div
        className="cs-lamp absolute left-1/2 top-[18%] -translate-x-1/2 w-[70%] h-[80%]"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,182,120,0.45) 0%, rgba(196,182,120,0.10) 38%, transparent 66%)" }}
      />
      {/* lampada */}
      <div className="absolute left-1/2 top-[10%] -translate-x-1/2 flex flex-col items-center">
        <div className="w-1 h-10 bg-[#1a1812]" />
        <div className="cs-lamp w-12 h-3 bg-[#cdbf80] rounded-b-full shadow-[0_0_22px_8px_rgba(205,191,128,0.5)]" />
      </div>
      {/* banco con timbro e pratica */}
      <div className="cs-lamp absolute left-1/2 bottom-[12%] -translate-x-1/2 flex items-end gap-4" style={{ animationDelay: "300ms" }}>
        <div className="w-24 h-16 bg-[#efe9d4] border-2 border-[#9a8c66] -rotate-2" />
        <div className="w-8 h-10 bg-wood-hi border-2 border-wood-lo" />
      </div>
    </div>
  );
}

function Attentato({ headline }: { headline?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0807]">
      {/* skyline notturno */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] flex items-end justify-center gap-1">
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="bg-[#15140f]" style={{ width: 14, height: 30 + ((i * 53) % 90) }} />
        ))}
      </div>
      {/* lampo d'esplosione */}
      <div
        className="cs-blast absolute left-[54%] bottom-[34%] w-40 h-40 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, #fff3c4 0%, #e8893a 38%, rgba(180,43,43,0.5) 62%, transparent 75%)" }}
      />
      {/* lampeggio rosso d'allarme su tutto */}
      <div className="cs-alarm absolute inset-0 bg-[#b42b2b] mix-blend-screen" />
      {/* titolo che sbatte */}
      {headline && (
        <div className="cs-slam absolute top-[14%] left-1/2 -translate-x-1/2 w-[72%]">
          <div className="rds-paper p-3">
            <div className="font-pixel uppercase text-[10px] tracking-widest text-ink/70 border-b-2 border-ink/40 pb-1 mb-1">Edizione straordinaria</div>
            <div className="font-pixel uppercase text-[20px] leading-tight text-stamp-red">{headline}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Door({ stampLabel, solo }: { stampLabel?: string; solo?: boolean }) {
  // porta sulla luce: due agenti che entrano (arresto) o UNA figura che esce
  // (fuga/scomparsa). Il timbro cala solo se il beat lo dichiara.
  return (
    <div className="relative w-72 h-48 flex items-end justify-center">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-28 h-44 bg-[#d8cdb0] overflow-hidden">
        <div className="cs-door absolute inset-0 bg-[#1b1712]" />
      </div>
      {solo ? (
        <div className="animate-npcEnter relative z-[2]" style={{ animationDelay: "900ms" }}>
          <div className="w-3 h-3 bg-[#0e0f0a] mx-auto" />
          <div className="w-4 h-12 bg-[#0e0f0a]" />
          <div className="w-6 h-3 bg-[#2c2417] mt-0.5" /> {/* valigia */}
        </div>
      ) : (
        <div className="animate-npcEnter flex gap-2 relative z-[2]" style={{ animationDelay: "900ms" }}>
          <div><div className="w-3 h-3 bg-[#0e0f0a] mx-auto" /><div className="w-4 h-12 bg-[#0e0f0a]" /></div>
          <div><div className="w-3 h-3 bg-[#0e0f0a] mx-auto" /><div className="w-4 h-12 bg-[#0e0f0a]" /></div>
        </div>
      )}
      {stampLabel && (
        <div className="cs-stamp-drop absolute" style={{ animationDelay: "1600ms" }}>
          <Stamp label={stampLabel} kind="respingi" big rotate={-9} solid />
        </div>
      )}
    </div>
  );
}
