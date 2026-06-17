"use client";

/**
 * Oggetti della scrivania (non interattivi): telefono in bachelite, posacenere,
 * tampone, alone di caffè, fascicoli impilati, buste marroni, cartellini
 * RISERVATO, graffette, macchie d'inchiostro. Si accumulano col passare dei
 * giorni: la scrivania diventa più sporca e pesante.
 */
export function DeskProps({ day = 1 }: { day?: number }) {
  const stack = Math.min(6, 2 + day); // più fascicoli impilati nei giorni avanzati

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      {/* telefono in bachelite */}
      <svg className="absolute bottom-3 left-5 w-[150px] opacity-95" viewBox="0 0 150 104" aria-hidden>
        <path d="M18 96 H132 a8 8 0 0 0 8-8 V60 a18 18 0 0 0-18-18 H28 A18 18 0 0 0 10 60 v28 a8 8 0 0 0 8 8 Z" fill="#15120e" />
        <path d="M18 96 H132 a8 8 0 0 0 8-8 V86 H10 v2 a8 8 0 0 0 8 8 Z" fill="#0c0a07" />
        <circle cx="75" cy="70" r="20" fill="#221d16" />
        <circle cx="75" cy="70" r="13" fill="#0e0c09" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={75 + Math.cos(a) * 16} cy={70 + Math.sin(a) * 16} r="1.6" fill="#3a332a" />;
        })}
        <rect x="14" y="30" width="122" height="16" rx="8" fill="#1b1712" />
        <rect x="10" y="24" width="26" height="22" rx="7" fill="#1b1712" />
        <rect x="114" y="24" width="26" height="22" rx="7" fill="#1b1712" />
        <rect x="14" y="30" width="122" height="4" rx="2" fill="#2c261d" />
      </svg>

      {/* fascicoli impilati (in basso a destra, dietro tutto) */}
      <div className="absolute bottom-8 right-5 w-44">
        {Array.from({ length: stack }).map((_, i) => (
          <div
            key={i}
            className="absolute h-3 border border-black/40"
            style={{
              bottom: i * 4,
              left: (i % 2) * 6 - ((i * 3) % 5),
              right: ((i * 2) % 7),
              backgroundColor: ["#b3a37a", "#9c8f66", "#a89a70", "#6a522f"][i % 4],
              transform: `rotate(${(i % 2 ? 1 : -1) * (0.6 + (i % 3) * 0.4)}deg)`,
            }}
          />
        ))}
        {/* cartellino RISERVATO sul fascicolo in cima */}
        <div
          className="absolute -top-1 right-2 rds-classified font-pixel text-[6px] tracking-widest text-paper-cream px-1 rotate-[-7deg]"
          style={{ bottom: stack * 4 + 2 }}
        >
          RISERVATO
        </div>
      </div>

      {/* busta marrone */}
      <svg className="absolute bottom-5 left-[36%] w-[96px] opacity-90 -rotate-3" viewBox="0 0 96 60" aria-hidden>
        <rect x="2" y="6" width="92" height="50" rx="2" fill="#6a522f" />
        <rect x="2" y="6" width="92" height="50" rx="2" fill="none" stroke="#3c2c19" strokeWidth="1.5" />
        <path d="M2 6 L48 34 L94 6" fill="none" stroke="#3c2c19" strokeWidth="1.5" />
        <circle cx="48" cy="34" r="4" fill="#7c241c" />
      </svg>

      {/* alone di caffè */}
      <svg className="absolute bottom-24 left-[30%] w-16 opacity-40" viewBox="0 0 60 60" aria-hidden>
        <circle cx="30" cy="30" r="22" fill="none" stroke="#3a2a17" strokeWidth="3" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="#5a4326" strokeWidth="1" />
      </svg>

      {/* tampone per timbri */}
      <svg className="absolute bottom-6 left-[50%] w-[110px] opacity-95" viewBox="0 0 120 56" aria-hidden>
        <rect x="6" y="16" width="108" height="34" rx="3" fill="#1d1f1b" />
        <rect x="2" y="8" width="116" height="12" rx="3" fill="#2a2d27" />
        <rect x="12" y="20" width="96" height="24" rx="2" fill="#3a1714" />
        <rect x="12" y="20" width="96" height="6" rx="2" fill="#511f19" />
      </svg>

      {/* posacenere + sigaretta */}
      <svg className="absolute bottom-4 right-6 w-[120px] opacity-95" viewBox="0 0 120 70" aria-hidden>
        <ellipse cx="60" cy="50" rx="46" ry="16" fill="#2c2f2a" />
        <ellipse cx="60" cy="48" rx="38" ry="11" fill="#15140f" />
        <rect x="58" y="20" width="44" height="5" rx="2" transform="rotate(-12 58 20)" fill="#d8cdb0" />
        <rect x="96" y="11" width="9" height="5" rx="2" transform="rotate(-12 96 11)" fill="#b03a2c" />
        <path d="M100 8 q6 -10 0 -18 q-5 -8 1 -16" fill="none" stroke="#9aa099" strokeOpacity="0.18" strokeWidth="2" />
      </svg>

      {/* graffette e macchie d'inchiostro (accumulano col giorno) */}
      {Array.from({ length: 2 + day }).map((_, i) => {
        const left = 12 + ((i * 53) % 76);
        const top = 30 + ((i * 37) % 50);
        return i % 2 === 0 ? (
          <div
            key={`clip${i}`}
            className="absolute w-2 h-4 border-2 border-[#7a7468] rounded-full opacity-50"
            style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${(i * 40) % 180}deg)` }}
          />
        ) : (
          <div
            key={`ink${i}`}
            className="absolute rounded-full bg-ink-blu/30"
            style={{ left: `${left}%`, top: `${top}%`, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2 }}
          />
        );
      })}
    </div>
  );
}
