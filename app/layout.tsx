import type { Metadata, Viewport } from "next";
import { Silkscreen, Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";

// Pixel "duro" — targhette, sigle, timbri, intestazioni
const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

// Pixel leggibile — corpo documenti e UI
const read = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-read",
  display: "swap",
});

// Terminale / LCD — numeri, orologio, telex
const term = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-term",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAGION DI STATO — Ufficio Validazione e Archivio Centrale",
  description:
    "Un thriller burocratico nell'Italia della Prima Repubblica. Ogni giorno decidi quale verità entra negli archivi dello Stato.",
};

export const viewport: Viewport = {
  themeColor: "#191212",
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
      <body className={`${pixel.variable} ${read.variable} ${term.variable}`}>
        {children}
      </body>
    </html>
  );
}
