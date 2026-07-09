# Visual Direction Bible — *Ragion di Stato*

> Lo standard estetico del progetto. Ogni nuova feature deve rispettarlo.
> Obiettivo: **un «Papers, Please della Prima Repubblica»** — pixel, analogico,
> burocratico, oppressivo, **diegetico**, a tutto schermo. Palette e proporzioni
> sono **estratte dagli asset reali** (vedi `AESTHETIC_AUDIT.md`).
>
> **Legale.** Nessun asset di *Papers, Please* (© Lucas Pope / 3909) è incluso o
> spedito. Sono solo riferimento (cartella `reference/`, gitignorata). Tutto è
> ricreato originale con Canvas/SVG/CSS e font web liberi.

---

## 0. Comandamenti

1. **Pixel, non liscio.** Tutto sembra disegnato a bassa risoluzione: font pixel,
   bordi e ombre **a scatto** (mai blur morbidi), `image-rendering: pixelated`
   sui canvas (volti). Niente gradienti "da app".
2. **Diegetico e a tutto schermo.** Niente cornici/bezel: lo schermo è il mondo
   (sportello + scrivania). Unica eccezione non-diegetica: il pannello debug.
3. **Palette stretta e desaturata** (sotto). Mai colori saturi o "puliti".
4. **La scrivania è il centro.** Documenti fisici trascinabili, timbri che
   colpiscono, pulsanti che si premono.
5. **Densità leggibile.** Fitto come una scrivania vera, ma leggibile.

## 1. Palette (token `--*` in `globals.css`, mirror in `tailwind.config.ts`)

| Gruppo | Token / Hex |
|---|---|
| Ambiente | `--env0 #191212` · `--env1 #26221c` · `--env2 #352d29` · `--env3 #564e43` |
| Legno (scrivania) | `--wood #46341f` · `--wood-hi #6a522f` · `--wood-lo #2c2013` · `--tan #9c7f4f` |
| Oliva (parete) | `--olive #676c54` · `--olive-hi #848a6b` · `--olive-lo #3d4232` |
| Carte | `--paper #e6e0c8` · cream `#efeddc` · white `#fffddc` · green `#e0e9c7` · rose `#ecd8dd` · edge `#b3a37a` |
| Inchiostri | testo documenti `--ink #574848` · blu-notte `#201c3c` · nero `#14110d` |
| Timbri | verde `#53701b`/`#86b42b` · rosso `#701b1b`/`#b42b2b` · ocra `#9a6b30` |
| Accento freddo | neon `#8fb9ad` (raro: LCD/spie) |

Il **testo dei documenti è bruno `#574848`**, non nero. Il rosso è dei timbri /
RISERVATO. Lo sfondo del mondo è bruno/oliva; la carta è l'unico "calore".

## 2. Font (3 ruoli pixel)

- **`Silkscreen`** (`--font-pixel`): targhette, sigle, intestazioni, timbri, label.
- **`Pixelify Sans`** (`--font-read`): corpo documenti e UI (pixel ma leggibile).
- **`VT323`** (`--font-term`): orologio, telex, numeri (LCD).

Niente serif/anti-alias per la UI. Dimensioni piccole, nitide.

## 3. Composizione schermo

- **A tutto schermo**, due zone: **alto = sportello** (parete oliva, finestra
  nera col **ritratto pixel**, nameplate, manifesto, orologio LCD, indicatore di
  sorveglianza) · **basso = scrivania legno** (documenti trascinabili, oggetti,
  console destra con barra timbri / regolamento / scheda). In mezzo, il **bancone**.

## 4. Documenti (proporzioni reali estratte)

- Pagina-tipo **3:4** (~150×200 nativi → larghezza ~300px). Fototessera 3:4.
- Anatomia: intestazione (emblema + ente) → banda RISERVATO/SEGRETO (rossa) →
  campi `LABEL` (pixel 7px) + valore (read 14px, `#574848`) → corpo → timbri/foto.
- **Carta per tipo**: tessera/telex/intercettazione = verdolina; informativa/
  rapporto/ordine = bianco-crema; nota/lettera = rosata; resto = crema.
- Bordo **2px** colore `edge`, ombra **a scatto** `3px 4px 0 nero/45%`, leggera
  rotazione, trascinabili.

## 5. Volti (`face.ts`)

- Canvas a **risoluzione nativa bassa** (48×60 foto / 64×80 sportello), scalato
  pixelated. 3–4 tinte per parte. Variazioni: incarnato, capelli (pieno/stempiato/
  calvo), barba, baffi, occhiali, basette. Sguardo frontale, stanco. Linee del
  misuratore d'altezza sul fondo grigio-verde.

## 6. Timbri

- Gomma inchiostrata: bordo, font pixel, inchiostro **irregolare** (mask noise),
  `mix-blend: multiply`, leggermente ruotato. Colori: verde/rosso/ocra/blu.
- **Battuta**: lo strumento (blocco di legno) si preme; il timbro **cala** (slam) +
  micro-scossa della scrivania + thunk WebAudio.

## 7. Materiali / texture (piatti + grana)

- `tex-wall` (oliva a bande), `tex-wood` (scrivania, venatura), `tex-panel`
  (console scura). Tutti **flat** + grana SVG; niente gradienti morbidi.
- `.rds-paper` carta + grana; `.rds-btn` pulsante piatto con ombra a scatto e
  spostamento al click; `.rds-lcd` schermo verde; `.rds-gauge` barra.

## 8. Animazioni (a scatto, `steps()`)

slam timbro · scossa scrivania · documenti che salgono dal bancone · neon che
tremola · spie che lampeggiano. Durate brevi (160–260ms). Niente easing morbidi.

---

## 9. Giusto / Sbagliato

| ✓ Giusto | ✗ Sbagliato |
|---|---|
| Font pixel (Silkscreen/Pixelify/VT323) | Serif eleganti, anti-alias, Inter/Roboto |
| Bordi 2px netti, ombre `Xpx Ypx 0` | Ombre morbide diffuse, `blur`, glow generico |
| Palette bruna/oliva/crema desaturata | Blu/viola saturi, accenti brillanti, gradienti app |
| Testo documenti `#574848` | Testo nero puro su carta |
| Scrivania a tutto schermo | Cornice "console"/bezel attorno al gioco |
| Volti canvas pixelati a bassa res | Foto lisce / avatar vettoriali tondeggianti |
| Documenti carta trascinabili | Card HTML con angoli arrotondati |
| Pulsanti che si premono (offset) | Bottoni material/flat con hover-elevation |

## 10. Evitare ASSOLUTAMENTE

UI moderna/flat-design, border-radius ampi, glassmorphism, gradienti da
dashboard, emoji come icone diegetiche, colori saturi, font lisci per la chrome,
spazi "ariosi" da landing page, animazioni lunghe e morbide. Se una schermata non
dice «archivio riservato della Prima Repubblica», va rifatta.

## 11. Tecnica

Token in `globals.css` + `tailwind.config.ts`. Classi di sistema riusabili
(`.rds-*`, `.tex-*`). Componenti diegetici in `components/desk|screens|hud`;
debug separato. `image-rendering: pixelated` sui canvas. Motore di gioco
(`game/`,`data/`) **mai** toccato dalla presentazione. Vercel-ok, desktop-first.
