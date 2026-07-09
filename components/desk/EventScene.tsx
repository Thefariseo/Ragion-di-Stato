"use client";

/**
 * Scena ANIMATA di un evento: non un pop-up ma una piccola messa in scena in
 * pixel (telefono che squilla, agenti che entrano, busta che scivola, telex).
 * Parte al montaggio del modale. Reagisce al canale dell'evento.
 */
export function EventScene({ channel }: { channel: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-end justify-center">
      {/* fondo: ufficio in penombra */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #20201a 0%, #0a0907 78%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#14110d] border-t-2 border-black" />
      {channel === "telefono" && <PhoneScene />}
      {channel === "ispezione" && <AgentsScene />}
      {channel === "busta" && <EnvelopeScene />}
      {channel === "telex" && <TelexScene />}
      {(channel === "voce" || !["telefono", "ispezione", "busta", "telex"].includes(channel)) && <VoiceScene />}
    </div>
  );
}

function PhoneScene() {
  return (
    <div className="relative mb-[10%] cs-shake">
      {/* onde di squillo */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#8fb9ad] animate-ping"
          style={{ width: 40 + i * 26, height: 40 + i * 26, opacity: 0.5 - i * 0.14, animationDelay: `${i * 220}ms` }}
        />
      ))}
      {/* telefono in bachelite */}
      <div className="relative w-28 h-16">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-9 bg-[#1d1a16] border-2 border-black rounded-sm" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#2a2620] border border-black rounded-full" />
        {/* cornetta che vibra */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-3 bg-[#15120e] border-2 border-black rounded-full cs-shake" style={{ animationIterationCount: "infinite", animationDuration: "0.4s" }} />
        <div className="absolute top-0 left-1 w-3 h-4 bg-[#15120e] border-2 border-black rounded-full" />
        <div className="absolute top-0 right-1 w-3 h-4 bg-[#15120e] border-2 border-black rounded-full" />
      </div>
    </div>
  );
}

function AgentsScene() {
  // la porta si apre e due agenti entrano in CONTROLUCE (silhouette sulla luce)
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* porta illuminata in fondo */}
      <div className="absolute left-1/2 top-[12%] -translate-x-1/2 w-28 h-44 bg-[#d2c690] overflow-hidden border-x-4 border-t-4 border-[#0e0d09]">
        <div className="cs-door absolute inset-0 bg-[#0c0b08]" />
      </div>
      {/* fascio di luce che si allarga sul pavimento */}
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 cs-fade"
        style={{
          width: 0,
          height: 0,
          borderLeft: "120px solid transparent",
          borderRight: "120px solid transparent",
          borderTop: "150px solid rgba(196,184,128,0.16)",
        }}
      />
      {/* due sagome in controluce: si stagliano sulla porta illuminata */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute top-[26%] animate-npcEnter"
          style={{ left: `calc(50% + ${i === 0 ? -42 : 6}px)`, animationDelay: `${650 + i * 280}ms`, opacity: 0 }}
        >
          <div className="w-10 h-2.5 bg-[#0a0b07] mx-auto -mb-0.5 rounded-sm" /> {/* tesa */}
          <div className="w-6 h-6 bg-[#0a0b07] mx-auto" /> {/* testa */}
          <div className="w-12 h-24 bg-[#0a0b07] mx-auto" style={{ clipPath: "polygon(18% 0,82% 0,100% 100%,0 100%)" }} /> {/* cappotto */}
        </div>
      ))}
    </div>
  );
}

function EnvelopeScene() {
  return (
    <div className="relative w-full h-full">
      {/* fessura della porta in alto */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-40 h-1.5 bg-black" />
      {/* busta che scivola dentro e cade */}
      <div className="absolute left-1/2 top-[24%] -translate-x-1/2 rds-deliver">
        <div className="w-28 h-16 bg-[#ddd6c0] border-2 border-[#9a8c66] shadow-[3px_5px_0_rgba(0,0,0,0.5)] relative">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, rgba(20,17,13,0.25) 50%, transparent 52%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#7c241c] rotate-45" /> {/* sigillo */}
        </div>
      </div>
    </div>
  );
}

function TelexScene() {
  return (
    <div className="relative mb-[12%] flex flex-col items-center">
      <div className="w-56 h-14 bg-[#23241f] border-2 border-black relative">
        <div className="absolute inset-x-3 top-2 h-2 bg-[#0a0b07]" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 h-1 bg-black" />
      </div>
      <div className="cs-telex w-44 bg-[#e6e0c8] border-x-2 border-b-2 border-ink/40 px-2 py-1">
        <div className="font-term text-[14px] text-ink/80 leading-tight">
          <div>≡ DISPACCIO ≡</div>
          <div>▮▮▮▮ ▮▮ ▮▮▮▮▮</div>
          <div>▮▮▮▮▮▮ ▮▮▮</div>
          <div>— riservato —</div>
        </div>
      </div>
    </div>
  );
}

function VoiceScene() {
  return (
    <div className="relative mb-[12%] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-[#8fb9ad]/60 animate-blink flex items-center justify-center">
        <div className="w-2 h-8 bg-[#8fb9ad]/70" />
      </div>
    </div>
  );
}
