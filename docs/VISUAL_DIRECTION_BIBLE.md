# VISUAL DIRECTION BIBLE — *Ragion di Stato* (vincolante)

> Documento **vincolante** per tutto il progetto. Ogni nuova feature visiva deve
> passare la checklist finale. Supera/estende `VISUAL_DIRECTION.md`.
> Target: **«Papers, Please della Prima Repubblica»** — pixel low-res, compatto,
> fisico, burocratico, **vivo** (mondo accanto alla scrivania). Asset originali;
> i file PP sono solo riferimento (`reference/`, gitignorata, non spedita).

## 1. Target estetico
Pixel art low-res · palette limitatissima · asset piccoli e densi · UI diegetica ·
scrivania fisica e sporca · booth/corridoio animato accanto alla scrivania · NPC
visibili che arrivano/attendono/reagiscono · giornale pieno · fazioni con stemmi
e identità · micro-animazioni a pochi frame · feedback secco · **nulla di moderno**.

## 2. Risoluzione, scaling, griglia
- **Cabinet a risoluzione logica fissa** `1180×664` (`GameViewport`), centrato su
  nero, scalato **solo verso il basso** (mai oltre 1:1 → niente blur su schermi
  grandi). Letterbox = «apparecchio», non pagina web.
- `image-rendering: pixelated` su canvas/sprite. **No** border-radius ampi, **no**
  ombre morbide (solo ombre a scatto `Xpx Ypx 0`), **no** anti-alias sulla chrome.
- Z-index come layer fisici. Documenti trascinabili, sovrapponibili.

## 3. Tre aree della schermata principale
1. **Corridoio/sportello** (alto): `BoothScene` (corridoio pixel: porta
   illuminata, emblema, bandiera, neon) + **ambient** (sagome che passano,
   `walkby`; neon che trema, `lampFlick`) + **NPC** allo sportello.
2. **Booth/comunicazione**: finestra, nameplate, voce, orologio LCD, indicatore
   di sorveglianza, (telefono/telex come eventi).
3. **Scrivania** (basso): feltro/legno sporco, documenti, oggetti (telefono,
   posacenere, tampone), **barra timbri**, console (decisioni/regolamento/scheda).

## 4. Palette (token in `globals.css`, mirror in `tailwind.config.ts`)
Ambiente `#191212/#26221c/#352d29/#564e43` · legno `#46341f/#6a522f` · oliva
`#676c54/#848a6b` · carte `#efeddc/#e0e9c7/#ecd8dd` · **inchiostro `#574848`** /
blu-notte `#201c3c` · timbri verde `#53701b`/`#86b42b`, rosso `#701b1b`/`#b42b2b` ·
ocra `#9a6b30` · neon `#8fb9ad` (raro). Desaturato. Il rosso è dei timbri/RISERVATO.

## 5. Font
`Silkscreen` (pixel, targhette/sigle/timbri/intestazioni) · `Pixelify Sans`
(corpo leggibile) · `VT323` (LCD/numeri). Niente serif/anti-alias per la chrome.

## 6. NPC (visibili, non solo nomi)
`NpcSprite`: busto pixel (testa+cappotto+cravatta) deterministico dal seed, con
variazioni (capelli/calvizie/barba/baffi/occhiali, abiti anni '70). Animazioni:
**entrata** (`npcEnter`), **idle/respiro** (`idleBob`). 🔜 uscita, scortato,
consegna documento, reazione alla decisione. Stile rigido, pochi colori.

## 7. Fazioni — identità grafica
Ogni fazione: **stemma pixel** (`FactionEmblem`, sigillo distinto su roundel +
colore proprio), sigla, colore, **carta intestata** (fascia colore-ente sul
documento), timbro/tono. Usati su documenti, resoconto, rubrica. 🔜 stile
documentale per ente (servizi=scuro/omissis; stampa=carta-giornale;
gruppi armati=volantino dattiloscritto sporco; mafia=pizzino; ecc.).

## 8. Documenti
Carta intestata (`FactionEmblem`/`Emblem`) + banda RISERVATO/SEGRETO + righe dei
campi (`LABEL` pixel 7px + valore read 14px `#574848`) + filigrana + firma «Il
funzionario» + protocollo + bordo perforato + foto 3:4. **Carta per tipo**
(verdolina/bianco-crema/rosata/crema). Proporzione ~3:4. Trascinabili, ombra a
scatto, rotazione minima.

## 9. Timbri
Gomma inchiostrata (font pixel, bordo, mask noise, multiply). **Battuta**: lo
strumento (legno) si preme → timbro **slam** dall'alto → scossa scrivania
(`deskShake`) → thunk WebAudio.

## 10. Giornale
Multi-colonna: testata + data + sottotestate + **headline** + foto sgranata +
trafiletti in colonne + **box laterale di regime** + listini/meteo/necrologi.
**Reattivo ai flag**: scandalo / versione manipolata / silenzio.

## 11. Animazioni (a scatto, `steps()`)
`stampSlam`, `deskShake`, `slideUp`, `npcEnter`, `idleBob`, `walkby`, `lampFlick`,
`telexFeed`, `flicker`, `blink`. Brevi, rigide, meccaniche. 🔜 cassetto, fascicolo
che si apre, serranda, busta strappata, linea inspection.

## 12. Audio (placeholder WebAudio, secchi/analogici)
`playStamp/Click/Ring/Thud/Paper/Telex/Drawer`. 🔜 macchina da scrivere, porta,
serranda, passi, allarme, sirena, neon, rumore ufficio. Niente suoni «moderni».

## 13. Schermate diegetiche
- **Menu/Intro**: cartellina RISERVATO sul feltro, titolo timbrato.
- **Giornale**: oggetto cartaceo pieno (sopra).
- **Briefing/Circolare**: comunicato/circolare ministeriale.
- **Fine giornata**: report dattiloscritto (pratiche/citazioni/multe/spese/
  sospetto + **scheda fazioni** con stemmi + **nota del superiore**).
- **Notte**: bilancio familiare + Rubrica NPC.

## 14. Reattività visiva del mondo 🔜
Più sospetto → più ispettori/sagome; più caos → giornale più cupo, sirene; fazione
dominante → suoi simboli più presenti; stampa repressa → giornale censurato;
servizi → più omissis. (Roadmap: legare `AmbientEvent` allo stato.)

## 15. Cosa evitare ASSOLUTAMENTE
Web/flat design, border-radius ampi, glassmorphism, gradienti da dashboard, emoji
come icone diegetiche, colori saturi, font lisci per la chrome, card HTML, bottoni
material, schermate vuote/pulite, animazioni lunghe/morbide.

## 16. Giusto / Sbagliato
| ✓ Giusto | ✗ Sbagliato |
|---|---|
| Cabinet fisso letterboxato su nero | Layout fluido a tutta finestra |
| NPC pixel che entra e respira | Solo una foto statica / nessun NPC |
| Stemmi pixel per fazione | Stessa icona generica per tutti |
| Giornale multi-colonna pieno | Una sola headline al centro |
| Ombre a scatto, bordi netti | Ombre morbide, blur, glow |
| Testo documenti `#574848` | Nero puro, serif eleganti |

## 18. Presentazione, cutscene, audio (NUOVO)
- **CutsceneEngine** (`components/cutscene` + `data/cutscenes.ts`): beat
  data-driven (bg/visual/title/lines/sound/music/durata), avanzamento a click,
  **Salta**. Niente cutscene hardcoded. Stile: rigido, low-res, pochi frame,
  cupo, quasi propagandistico (timbro che cade, lettera battuta, stemmi che
  compaiono). 🔜 cutscene per eventi e per ogni finale.
- **Intro** (`intro` cutscene → prima del Giorno 1): nomina ministeriale →
  Paese che trema → **schedario fazioni** (stemmi + una riga ciascuna) → ruolo.
  Onboarding diegetico, non un tutorial moderno.
- **Archivio fazioni** (`FactionArchive`, dal titolo): schedario riservato, non
  un menu — scheda per fazione con stemma, identità, figure, «segreto» con
  **omissis**.
- **Colonna sonora procedurale** (`lib/music.ts`, WebAudio, nessun asset, niente
  copie): cupa, marziale, minimale, in scala minore + drone basso. Temi:
  `solenne` (titolo/intro/finali), `lavoro` (scrivania — quasi solo ambiente,
  non invasivo), `tensione` (eventi), `finale`. Legata alla fase. Parte dopo il
  primo gesto (policy browser). Toggle audio (♪) in basso a destra. 🔜 leitmotiv
  per ogni fazione, più ambiente (pioggia, sirene, telescrivente).
- **Galleria debug** (`DebugGallery`, dal pannello debug): stemmi, timbri, volti,
  palette, musica, sfx — per verificare la coerenza artistica.

## 17. Checklist per ogni nuova feature visiva
1. Sta dentro il cabinet `1180×664` e rispetta lo scaling? 2. Pixel/`pixelated`,
zero blur/anti-alias? 3. Palette nei token? 4. Font pixel? 5. È **diegetica**
(oggetto del mondo)? 6. Ha micro-animazione/feedback secco? 7. Niente elementi
moderni/card/bottoni web? 8. Aumenta pressione/ambiguità/immersione/conseguenze?
Se anche **una** risposta è no → si rifà.
