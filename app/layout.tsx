import type { Metadata, Viewport } from "next";
import { Special_Elite, Oswald, Crimson_Text } from "next/font/google";
import "./globals.css";

const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
  display: "swap",
});

const stencil = Oswald({
  subsets: ["latin"],
  variable: "--font-stencil",
  display: "swap",
});

const doc = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-doc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ragion di Stato",
  description:
    "Un thriller burocratico nell'Italia della Prima Repubblica. Ogni giorno decidi quale verità entra negli archivi dello Stato.",
};

export const viewport: Viewport = {
  themeColor: "#1a1813",
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
        className={`${typewriter.variable} ${stencil.variable} ${doc.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
