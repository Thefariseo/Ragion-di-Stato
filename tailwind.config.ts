import type { Config } from "tailwindcss";

/**
 * Token estetici di "Ragion di Stato" — palette ESTRATTA dagli asset di
 * riferimento di Papers, Please (vedi docs/AESTHETIC_AUDIT.md): bruni d'archivio,
 * legno, oliva militare, carte tenui, inchiostro bruno/blu-notte, timbri verde/rosso.
 * Tutto desaturato. Fonte di verità dei colori; rispecchiata in globals.css.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ambiente (booth/scrivania/console)
        env: { 0: "#191212", 1: "#26221c", 2: "#352d29", 3: "#564e43" },
        wood: { DEFAULT: "#46341f", hi: "#6a522f", lo: "#2c2013" },
        tan: { DEFAULT: "#9c7f4f", hi: "#b89a64", lo: "#7a6038" },
        olive: { DEFAULT: "#676c54", hi: "#848a6b", lo: "#3d4232" },
        gray: { DEFAULT: "#7c796f", soft: "#a7a59a" },
        // carte
        paper: {
          DEFAULT: "#e6e0c8",
          cream: "#efeddc",
          white: "#fffddc",
          green: "#e0e9c7",
          rose: "#ecd8dd",
          edge: "#b3a37a",
          shadow: "#9a8c66",
        },
        // inchiostri
        ink: { DEFAULT: "#574848", blu: "#201c3c", dark: "#14110d" },
        // timbri
        stamp: {
          green: "#53701b",
          greenhi: "#86b42b",
          red: "#701b1b",
          redhi: "#b42b2b",
        },
        ochre: "#9a6b30",
        neon: "#8fb9ad",
        glass: "#5b6b66",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        read: ["var(--font-read)", "Courier New", "monospace"],
        term: ["var(--font-term)", "monospace"],
      },
      keyframes: {
        stampSlam: {
          "0%": { transform: "translateY(-150%) scale(1.5)", opacity: "0" },
          "55%": { transform: "translateY(0) scale(0.94)", opacity: "1" },
          "70%": { transform: "translateY(-10%) scale(1)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        deskShake: {
          "0%,100%": { transform: "translate(0,0)" },
          "25%": { transform: "translate(-2px,1px)" },
          "50%": { transform: "translate(2px,-1px)" },
          "75%": { transform: "translate(-1px,2px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(70px)", opacity: "0" },
          "75%": { transform: "translateY(-5px)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flicker: {
          "0%,18%,22%,25%,53%,57%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.6" },
        },
        blink: { "50%": { opacity: "0.25" } },
      },
      animation: {
        stampSlam: "stampSlam 220ms steps(5,end) forwards",
        deskShake: "deskShake 170ms steps(4,end)",
        slideUp: "slideUp 260ms steps(6,end) forwards",
        flicker: "flicker 7s linear infinite",
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
