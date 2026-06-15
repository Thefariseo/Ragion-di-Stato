import type { Config } from "tailwindcss";

/**
 * Token estetici di "Ragion di Stato" (vedi docs/VISUAL_DIRECTION.md).
 * Palette desaturata da archivio: carta ingiallita, grigio ministeriale,
 * verde militare, rosso timbro, marrone archivio, blu notte, nero inchiostro.
 * La fonte di verità per i colori è qui; le stesse tinte sono rispecchiate
 * come variabili CSS in app/globals.css per i materiali diegetici.
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
        void: "#0c0b09",
        ink: { DEFAULT: "#14110d", soft: "#2a241c" },
        paper: {
          DEFAULT: "#cdbf9b",
          hi: "#ded3b2",
          lo: "#b3a37a",
          edge: "#8c7c57",
        },
        felt: { DEFAULT: "#2f3a2c", hi: "#3d4a34" },
        wood: { DEFAULT: "#46341f", hi: "#5d4730" },
        metal: { DEFAULT: "#3a3d39", hi: "#565a50", lo: "#22241f" },
        rosso: { DEFAULT: "#8e2c22", hi: "#b03a2c" },
        verde: "#4a6b43",
        blu: "#25364c",
        ochre: "#9a6b30",
        neon: "#8fb9ad",
        glass: "#56655f",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        term: ["var(--font-term)", "monospace"],
        type: ["var(--font-type)", "Courier New", "monospace"],
        stencil: ["var(--font-stencil)", "Impact", "sans-serif"],
      },
      keyframes: {
        stampSlam: {
          "0%": { transform: "translateY(-140%) scale(1.5)", opacity: "0" },
          "55%": { transform: "translateY(0) scale(0.94)", opacity: "1" },
          "70%": { transform: "translateY(-12%) scale(1.0)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        inkSet: {
          "0%": { opacity: "0", transform: "scale(1.15) rotate(var(--rot,-7deg))" },
          "60%": { opacity: "0.95", transform: "scale(0.98) rotate(var(--rot,-7deg))" },
          "100%": { opacity: "0.88", transform: "scale(1) rotate(var(--rot,-7deg))" },
        },
        deskShake: {
          "0%,100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-2px,1px)" },
          "40%": { transform: "translate(2px,-1px)" },
          "60%": { transform: "translate(-1px,2px)" },
          "80%": { transform: "translate(1px,-1px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(60px) rotate(-1deg)", opacity: "0" },
          "70%": { transform: "translateY(-6px) rotate(0.4deg)", opacity: "1" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        flicker: {
          "0%,18%,22%,25%,53%,57%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.62" },
        },
        blink: { "50%": { opacity: "0.25" } },
        scan: { "0%": { backgroundPositionY: "0" }, "100%": { backgroundPositionY: "100vh" } },
      },
      animation: {
        stampSlam: "stampSlam 240ms steps(6,end) forwards",
        inkSet: "inkSet 260ms ease-out forwards",
        deskShake: "deskShake 180ms steps(5,end)",
        slideUp: "slideUp 320ms cubic-bezier(.2,.8,.2,1) forwards",
        flicker: "flicker 7s linear infinite",
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
