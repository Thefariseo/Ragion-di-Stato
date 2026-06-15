"use client";

/**
 * Oggetti decorativi della scrivania (non interattivi): telefono in bachelite,
 * posacenere, tampone per timbri, alone di caffè. Riempiono il feltro e
 * aumentano la densità "da ufficio". Stanno sotto ai documenti.
 */
export function DeskProps() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      {/* telefono in bachelite */}
      <svg className="absolute bottom-3 left-5 w-[150px] opacity-95" viewBox="0 0 150 104" aria-hidden>
        <g>
          <path d="M18 96 H132 a8 8 0 0 0 8-8 V60 a18 18 0 0 0-18-18 H28 A18 18 0 0 0 10 60 v28 a8 8 0 0 0 8 8 Z" fill="#15120e" />
          <path d="M18 96 H132 a8 8 0 0 0 8-8 V86 H10 v2 a8 8 0 0 0 8 8 Z" fill="#0c0a07" />
          <circle cx="75" cy="70" r="20" fill="#221d16" />
          <circle cx="75" cy="70" r="13" fill="#0e0c09" />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={75 + Math.cos(a) * 16} cy={70 + Math.sin(a) * 16} r="1.6" fill="#3a332a" />;
          })}
          {/* cornetta */}
          <rect x="14" y="30" width="122" height="16" rx="8" fill="#1b1712" />
          <rect x="10" y="24" width="26" height="22" rx="7" fill="#1b1712" />
          <rect x="114" y="24" width="26" height="22" rx="7" fill="#1b1712" />
          <rect x="14" y="30" width="122" height="4" rx="2" fill="#2c261d" />
        </g>
      </svg>

      {/* alone di caffè */}
      <svg className="absolute bottom-24 left-[34%] w-16 opacity-40" viewBox="0 0 60 60" aria-hidden>
        <circle cx="30" cy="30" r="22" fill="none" stroke="#3a2a17" strokeWidth="3" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="#5a4326" strokeWidth="1" />
      </svg>

      {/* tampone per timbri */}
      <svg className="absolute bottom-6 left-[44%] w-[120px] opacity-95" viewBox="0 0 120 56" aria-hidden>
        <rect x="6" y="14" width="108" height="36" rx="3" fill="#23262200" />
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
    </div>
  );
}
