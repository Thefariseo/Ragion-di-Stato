# Visual Direction Bible — *Ragion di Stato*

> Lo standard estetico del progetto. Ogni nuova feature deve rispettarlo.
> Obiettivo: **un «Papers, Please della Prima Repubblica»** — un oggetto
> burocratico analogico, sporco, oppressivo, diegetico. Non una web app con una
> texture sopra.
>
> **Nota legale.** Gli asset originali di *Papers, Please* (© Lucas Pope / 3909
> LLC) sono usati **solo come riferimento visivo**. Nessun loro file (PNG, .fnt,
> XML) è incluso nel progetto. Tutto è ricreato come asset originale con
> CSS/SVG/Canvas e font web liberi.

---

## 0. Principi (i 6 comandamenti)

1. **Diegetico prima di tutto.** Quasi tutto ciò che si vede appartiene al mondo:
   sportello, scrivania, timbri, telefono, schedario, telex. Niente «UI moderna»
   che galleggia sopra il mondo. Eccezione: il **pannello di debug**, che è
   volutamente non-diegetico (terminale verde) e visivamente separato.
2. **La scrivania è il centro assoluto.** Il giocatore lavora dentro un ufficio,
   non naviga una pagina.
3. **Palette limitata e desaturata.** Pochi colori, sporchi, coerenti. Mai
   saturi, mai «puliti».
4. **Tutto è fisico.** Documenti che si spostano, timbri che colpiscono, pulsanti
   in bachelite, carta consumata. Niente «card» né bottoni web.
5. **Pixel + analogico.** Pixel art nitida (`image-rendering: pixelated`), texture
   di carta/inchiostro/metallo/monitor, grana, neon freddo, vignetta.
6. **Densità leggibile.** Layout denso come una scrivania vera, ma sempre
   leggibile. L'attrito è voluto; la confusione no.

---

## 1. Palette (token: `--rds-*` in `globals.css`)

Desaturata, da archivio. **Non aggiungere colori fuori da questa lista.**

| Ruolo | Token | Hex |
|---|---|---|
| Nero inchiostro | `--ink` | `#14110d` |
| Inchiostro tenue | `--ink-2` | `#2a241c` |
| Carta ingiallita | `--paper` | `#cdbf9b` |
| Carta (luce) | `--paper-hi` | `#ded3b2` |
| Carta (ombra) | `--paper-lo` | `#b3a37a` |
| Bordo carta | `--paper-edge` | `#8c7c57` |
| Verde militare (feltro) | `--felt` | `#2f3a2c` |
| Verde militare (luce) | `--felt-hi` | `#3d4a34` |
| Marrone archivio (legno) | `--wood` | `#46341f` |
| Legno (luce) | `--wood-hi` | `#5d4730` |
| Grigio ministeriale (metallo) | `--metal` | `#3a3d39` |
| Metallo (luce) | `--metal-hi` | `#565a50` |
| Metallo (ombra) | `--metal-lo` | `#22241f` |
| Rosso timbro | `--rosso` | `#8e2c22` |
| Rosso timbro (luce) | `--rosso-hi` | `#b03a2c` |
| Verde timbro | `--verde` | `#4a6b43` |
| Blu notte istituzionale | `--blu` | `#25364c` |
| Ocra / segnalazione | `--ochre` | `#9a6b30` |
| Neon freddo (raro) | `--neon` | `#8fb9ad` |
| Vetro smerigliato | `--glass` | `#56655f` |
| Fondo macchina | `--void` | `#0c0b09` |

Regole: saturazione bassa, contrasti materici (non cromatici). Il **rosso** è
riservato a timbri/RISERVATO/allarme. Il **neon** si usa col contagocce
(orologio, spie, riflessi). Lo sfondo del mondo è grigio/verde militare; la carta
è l'unica fonte di «calore».

---

## 2. Font (4 ruoli, tutti web-free)

| Ruolo | Font | Uso |
|---|---|---|
| **Pixel / targhette** | `Silkscreen` (`--font-pixel`) | etichette console, sigle, codici, stencil |
| **Terminale / LCD** | `VT323` (`--font-term`) | orologio, telex, numeri, lettori |
| **Dattiloscritto** | `Special Elite` (`--font-type`) | corpo dei documenti, note, voce |
| **Stencil istituzionale** | `Oswald` (`--font-stencil`) | intestazioni, bande RISERVATO, titoli |

Niente font «eleganti» o anti-aliasati per la UI. I testi pixel/terminale vanno
renderizzati nitidi. I documenti sono dattiloscritti, mai con serif raffinati.

---

## 3. Regole di composizione

- **Frame fisso.** Il gioco vive dentro una **console** (cornice metallica con
  bulloni), centrata su fondo nero, con CRT (scanline + vignetta). Aspetto ~16:10,
  desktop-first.
- **Due zone verticali.** In alto lo **sportello** (~40%): muro d'ufficio, finestra
  smerigliata, coda di silhouette, ritratto del richiedente, intestazione/manifesto,
  orologio, indicatore di sospetto. In basso la **scrivania** (~60%): feltro/legno,
  documenti manipolabili, dispositivi, **barra dei timbri**.
- **Bancone** che separa le due zone, con feritoia da cui «entrano» i documenti.
- Gerarchia: il documento attivo è il fuoco; i dispositivi stanno ai bordi; lo
  stato (sospetto, fazioni) è una **scheda** appuntata, non una dashboard.

---

## 4. Proporzioni dei documenti

- Rapporto verticale **~1 : 1.4** (A-series). Larghezza base ~300–340px.
- Anatomia: **intestazione** (ente emittente + sigla/emblema) → **banda
  classificazione** (RISERVATO/SEGRETO, rossa) → **corpo** (campi etichetta:valore
  in dattiloscritto) → **foto/segnaletica** opzionale → **timbri/firme** in basso →
  **numero di protocollo** in un angolo.
- Bordi consumati, angoli con ombra di sollevamento, leggera rotazione (±1–2°),
  graffette/spilli dove serve. Carta con grana e macchie.
- Ogni documento ha **funzione di gameplay** (campi confrontabili) **e** narrativa.
  Mai pura decorazione.

---

## 5. Volti (richiedente)

- Ritratto pixel ~120×150, canvas, `pixelated`.
- **3–4 ombre per elemento** (incarnato, capelli, cappotto, fondo). Palette
  desaturata, fredda. Variazione deterministica dal seed (incarnato, capelli,
  colore cappotto da set limitato).
- Sguardo frontale, segnaletico, stanco. Dietro, **linee del misuratore d'altezza**.
  Niente sorrisi, niente cartoon.

## 6. Foto (sui documenti)

- Fototessera ~92×112, sgranata, `contrast` alto + `saturate` basso + leggero
  seppia, vignetta interna. Stessa logica del volto ma più piccola e «stampata».

## 7. Timbri

- Devono sembrare **gomma inchiostrata**: bordo doppio, lettere stencil (Oswald),
  inchiostro **irregolare** (texture alpha), leggermente ruotati (±6–10°),
  `mix-blend-mode: multiply`. Mai pieni e netti come un badge.
- **Azione**: il timbro **cala dall'alto** (slam), THUNK secco, lascia l'impronta
  sul documento attivo, micro-shake della scrivania. Colori: APPROVATO verde,
  RESPINTO rosso, SEGNALATO ocra, speciali in nero/blu.

## 8. Texture

- **Carta**: grana fine + fibre + macchie d'angolo (SVG turbulence, opacità bassa).
- **Feltro**: rumore fine + luce radiale tenue.
- **Legno**: venatura verticale (gradiente ripetuto) + rumore.
- **Metallo**: spazzolato orizzontale + bulloni + ombra interna.
- **Vetro smerigliato**: traslucido sfocato + feritoie/grata.
- **Monitor/CRT**: scanline + vignetta + tremolio neon. Sempre sopra tutto.

## 9. Pannelli / chrome

- Bachelite/metallo: superfici scure spazzolate, **etichette stencil incise**,
  bulloni agli angoli, bordi smussati (luce sopra, ombra sotto). I «bottoni» sono
  oggetti incassati che si premono (ombra interna all'attivo).
- I pannelli informativi (stato, regolamento, scheda) sono **oggetti** sulla
  parete/scrivania, non riquadri web.

## 10. Animazioni (brevi, meccaniche, amministrative)

- Documenti che **scivolano** dal bancone (slide su, 1 rimbalzo).
- Timbro **slam** + ink set (~220ms) + micro-shake.
- Neon che **tremola** raramente; spie che lampeggiano.
- Leva «chiama il prossimo» che si abbassa.
- Niente easing «morbidi» da web moderno (no fade lunghi, no scale eleganti):
  movimenti secchi, a scatto, da macchina d'ufficio.

---

## 11. Cosa evitare ASSOLUTAMENTE

- UI moderna/flat, ombre morbide diffuse, gradienti «app», angoli molto
  arrotondati, vetri «glassmorphism».
- Colori saturi, accenti brillanti, palette incoerenti.
- Font lisci anti-aliasati per la chrome; emoji come icone diegetiche.
- Card HTML riconoscibili, bottoni «material/tailwind» evidenti.
- Animazioni lunghe e morbide; transizioni decorative.
- Spazi vuoti «ariosi» da landing page: la scrivania è densa.
- Qualsiasi schermata che **non** comunichi «archivio riservato della Prima
  Repubblica» va ripensata.

---

## 12. Implementazione tecnica (design system)

- Token in `app/globals.css` (`:root`): palette, spaziature, ombre, texture, font.
- **Classi di sistema** riusabili (materiali e oggetti): `.rds-console`,
  `.rds-panel`, `.rds-bolt`, `.rds-booth`, `.rds-window`, `.rds-counter`,
  `.rds-desk`, `.tex-paper|felt|wood|metal|glass`, `.rds-paper`, `.rds-stamp`,
  `.rds-ink`, `.rds-stamp-tool`, `.rds-btn`, `.rds-label`, `.rds-lcd`, `.rds-gauge`.
- Componenti React **diegetici** in `components/desk` e `components/screens`;
  debug separato in `components/debug`. Nessuna libreria grafica pesante.
- `image-rendering: pixelated` per canvas/sprite; Vercel-compatibile; desktop-first.
