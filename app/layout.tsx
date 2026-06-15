import type { Metadata, Viewport } from "next";
import { Silkscreen, VT323, Special_Elite, Oswald } from "next/font/google";
import "./globals.css";

// Pixel / targhette
const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

// Terminale / LCD
const term = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-term",
  display: "swap",
});

// Dattiloscritto (corpo documenti)
const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-type",
  display: "swap",
});

// Stencil istituzionale (intestazioni)
const stencil = Oswald({
  subsets: ["latin"],
  variable: "--font-stencil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAGION DI STATO — Ufficio Validazione e Archivio Centrale",
  description:
    "Un thriller burocratico nell'Italia della Prima Repubblica. Ogni giorno decidi quale verità entra negli archivi dello Stato.",
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${pixel.variable} ${term.variable} ${typewriter.variable} ${stencil.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
