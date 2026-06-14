import type { Config } from "tailwindcss";

/**
 * Palette e token estetici di "Ragion di Stato".
 * Carta ingiallita, rosso ministeriale, verde militare, grigio cemento,
 * nero inchiostro. La UI deve sembrare materia analogica, non un overlay moderno.
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
        // carta
        carta: {
          DEFAULT: "#d8c9a6",
          chiara: "#e7dcc0",
          scura: "#c4b48c",
          bruciata: "#a8956a",
        },
        // inchiostro
        inchiostro: {
          DEFAULT: "#1b1712",
          tenue: "#3a332a",
        },
        // rosso ministeriale (timbri, intestazioni RISERVATO)
        rossomin: {
          DEFAULT: "#7c241c",
          chiaro: "#9c3a2e",
          scuro: "#54160f",
        },
        // verde militare
        verdemil: {
          DEFAULT: "#3b4a37",
          chiaro: "#55663f",
          scuro: "#28321f",
        },
        // grigio cemento (scrivania, ministero)
        cemento: {
          DEFAULT: "#5d5b54",
          scuro: "#403e39",
          notte: "#26241f",
        },
        ocra: "#b07d3a",
        neon: "#9fd9c0",
      },
      fontFamily: {
        typewriter: ["var(--font-typewriter)", "Courier New", "monospace"],
        stencil: ["var(--font-stencil)", "Impact", "sans-serif"],
        doc: ["var(--font-doc)", "Georgia", "serif"],
      },
      boxShadow: {
        carta: "0 2px 0 rgba(0,0,0,0.18), 0 10px 22px rgba(0,0,0,0.45)",
        inset: "inset 0 0 80px rgba(0,0,0,0.35)",
        timbro: "0 0 0 2px currentColor",
      },
      keyframes: {
        stampDown: {
          "0%": { transform: "scale(1.8) rotate(var(--rot,0deg))", opacity: "0" },
          "60%": { transform: "scale(0.92) rotate(var(--rot,0deg))", opacity: "1" },
          "100%": { transform: "scale(1) rotate(var(--rot,0deg))", opacity: "1" },
        },
        flickr: {
          "0%,19%,21%,23%,80%,100%": { opacity: "1" },
          "20%,22%,55%": { opacity: "0.55" },
        },
        slideIn: {
          "0%": { transform: "translateY(40px) rotate(-1deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        ring: {
          "0%,100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-8deg)" },
          "75%": { transform: "rotate(8deg)" },
        },
      },
      animation: {
        stampDown: "stampDown 220ms cubic-bezier(.2,.9,.3,1.2) forwards",
        flickr: "flickr 6s linear infinite",
        slideIn: "slideIn 320ms ease-out forwards",
        ring: "ring 0.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
