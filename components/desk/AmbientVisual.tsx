"use client";

import type { AmbientVisualId } from "@/data/ambient";

/**
 * AmbientEventEngine (parte visiva): rende ANIMATO il vignette del corridoio.
 * Sagome scure coerenti col canvas del corridoio, sopra il WorldScene e dietro
 * lo sportello. Si monta keyed sull'evento, così l'animazione riparte ogni volta.
 * Il testo accompagna; non sostituisce.
 */
export function AmbientVisual({ visual }: { visual: AmbientVisualId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {visual === "scorta" && <Scorta />}
      {visual === "plico" && <Plico />}
      {visual === "telex" && <Telex />}
      {visual === "passi" && <Passi />}
      {visual === "porta" && <Porta />}
      {visual === "neon" && <Neon />}
      {visual === "spioncino" && <Spioncino />}
      {visual === "fascicolo" && <Fascicolo />}
      {visual === "ispettore" && <Ispettore />}
      {visual === "sirena" && <Sirena />}
      {visual === "allarme" && <Allarme />}
      {visual === "convoglio" && <Convoglio />}
    </div>
  );
}

/** sagoma scura (testa + cappotto), opzionale berretto/tesa. */
function Figure({ h = 34, hat }: { h?: number; hat?: "berretto" | "tesa" }) {
  return (
    <div className="flex flex-col items-center" style={{ filter: "brightness(0.5)" }}>
      {hat === "tesa" && <div className="bg-[#0c0d09]" style={{ width: h * 0.5, height: 3 }} />}
      <div className="bg-[#0c0d09]" style={{ width: h * 0.28, height: h * 0.28 }} />
      {hat === "berretto" && <div className="bg-[#0a0b07] -mt-[2px]" style={{ width: h * 0.32, height: 3 }} />}
      <div className="bg-[#0c0d09]" style={{ width: h * 0.42, height: h * 0.72, clipPath: "polygon(16% 0,84% 0,100% 100%,0 100%)" }} />
    </div>
  );
}

function Scorta() {
  // guardia · prelevato · guardia attraversano il corridoio
  return (
    <div className="absolute left-[18%] top-[34%] amb-walk flex items-end gap-1">
      <Figure h={32} hat="berretto" />
      <Figure h={30} />
      <Figure h={32} hat="berretto" />
    </div>
  );
}

function Plico() {
  // un usciere attraversa e lascia un plico sul bancone
  return (
    <>
      <div className="absolute left-[20%] top-[34%] amb-walk"><Figure h={30} /></div>
      <div className="absolute left-[44%] top-[58%] amb-drop">
        <div className="w-9 h-6 bg-[#cabf95] border border-[#7a6c46] shadow-[2px_3px_0_rgba(0,0,0,0.5)]" />
      </div>
    </>
  );
}

function Telex() {
  return (
    <div className="absolute right-[10%] top-[30%] flex flex-col items-center">
      <div className="w-14 h-7 bg-[#23241f] border-2 border-black relative amb-flick">
        <div className="absolute inset-x-2 top-1 h-1.5 bg-[#0a0b07]" />
      </div>
      <div className="cs-telex w-12 bg-[#e6e0c8] border-x-2 border-b-2 border-ink/40" style={{ height: 0 }}>
        <div className="font-term text-[8px] text-ink/70 leading-none px-1">▮▮ ▮▮▮<br/>▮▮▮▮</div>
      </div>
    </div>
  );
}

function Passi() {
  return (
    <div className="absolute left-[26%] top-[36%] amb-walkback"><Figure h={30} /></div>
  );
}

function Porta() {
  // un battente lontano che lampeggia di luce
  return (
    <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-10 h-16 bg-[#0e120c] overflow-hidden">
      <div className="absolute inset-1 bg-[#c8bd86] amb-flick" />
    </div>
  );
}

function Neon() {
  return <div className="absolute inset-0 bg-black amb-flick" />;
}

function Spioncino() {
  // un occhio dietro lo spioncino: punto chiaro con sagoma
  return (
    <div className="absolute right-[24%] top-[26%] amb-peep flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-[#0b0c08] border border-[#3a3a30] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#cdbf80]" />
      </div>
    </div>
  );
}

function Fascicolo() {
  // un fascicolo scivola da uno scaffale e resta a terra
  return (
    <div className="absolute left-[30%] top-[30%] amb-drop">
      <div className="w-10 h-7 bg-[#9c8a5e] border-2 border-[#2c2417] -rotate-6 relative">
        <div className="absolute -bottom-1 left-1 w-7 h-1.5 bg-[#efe9d4]" />
      </div>
    </div>
  );
}

function Ispettore() {
  // un uomo in grigio al vetro che annota
  return (
    <div className="absolute left-1/2 top-[30%] -translate-x-1/2 amb-peep flex items-end gap-1">
      <Figure h={36} hat="tesa" />
      <div className="w-3 h-4 bg-[#cabf95] mb-1 -ml-1 animate-blink" /> {/* taccuino */}
    </div>
  );
}

function Sirena() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-0 bottom-0 w-1/3 amb-sweep" style={{ background: "linear-gradient(90deg, transparent, rgba(180,43,43,0.5), transparent)" }} />
    </div>
  );
}

function Allarme() {
  return (
    <>
      <div className="absolute inset-0 bg-[#b42b2b] cs-alarm mix-blend-screen" />
      <div className="absolute left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#b42b2b] cs-alarm shadow-[0_0_14px_6px_rgba(180,43,43,0.7)]" />
    </>
  );
}

function Convoglio() {
  // camionette in controluce lungo il fondo
  return (
    <div className="absolute left-0 right-0 bottom-[10%] amb-convoy flex items-end gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-[#0b0c08] relative" style={{ width: 46, height: 18 }}>
          <div className="absolute -top-2 left-2 w-5 h-3 bg-[#0b0c08]" />
          <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-black" />
          <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-black" />
        </div>
      ))}
    </div>
  );
}
