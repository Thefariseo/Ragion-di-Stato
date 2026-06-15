# Audit estetico — Papers, Please → Ragion di Stato

> Analisi data-driven del materiale di riferimento (asset pack ufficiale
> *Papers, Please*, mod "Jorji's House", + CSV del loc-tool) per rifare la nostra
> estetica in modo **fedele alla grammatica visiva** di Papers, Please.
>
> **Provenienza & licenza.** Gli asset analizzati sono proprietari (© Lucas Pope /
> 3909 LLC). **Non vengono inclusi nel nostro gioco.** Servono solo come
> riferimento per misurare palette, proporzioni e struttura. Ricreeremo asset
> **originali** fedeli alla grammatica, in contesto Prima Repubblica. (Il
> repository del nostro gioco non conteneva alcun asset: confermato su tutti i
> branch.)

---

## 1. Il dato tecnico decisivo: risoluzione nativa minuscola + scaling a interi

Le dimensioni reali degli asset rivelano che **tutto è disegnato a risoluzione
bassissima e poi scalato a interi** con nearest-neighbor (niente smoothing):

| Asset | Dimensioni native |
|---|---|
| `Desk.png` (scrivania) | **570 × 217** |
| `BoothWall.png` (parete sportello) | 178 × 135 |
| `Console.png` | 178 × 51 |
| `Shutter.png` / `Curtain.png` | 180 × 120 / 180 × 107 |
| `StampBarTop/Bot` (barra timbri) | 280 × 47 / 280 × 34 |
| `Filer.png` (schedario/regolamento) | 190 × 210 |
| `News.png` / `NightReport.png` | 365 × 220 / 480 × 320 |

→ Il campo di gioco è ~**600 px nativi** di larghezza. È questo che rende PP
"PP": pixel grossi, densità altissima, leggibilità per contrasto e posizione, non
per dimensione del font. **La nostra UI attuale è hi-res e "liscia": è il difetto
di fondo.** Dobbiamo adottare un **modulo pixel** e `image-rendering: pixelated`
sugli sprite/scene.

## 2. Palette estratta (quantizzata dagli asset reali)

### Ambiente (booth / scrivania / console) — dominano bruni scurissimi
| Hex | Ruolo |
|---|---|
| `#191212` | nero-bruno ambiente (ombre) |
| `#26221c` | **bruno dominante** (parete/scrivania) ~59% |
| `#352d29` | bruno medio |
| `#564e43` | grigio-bruno chiaro |
| `#422a1c` · `#6a522f` | legno scuro · legno chiaro |
| `#676c54` · `#848a6b` · `#a2a983` | verde militare/oliva (ombra→luce) |
| `#7c796f` | grigio cemento |

### Documenti — carte tenui e variate (non solo beige!)
| Hex | Ruolo |
|---|---|
| `#efeddc` · `#fffddc` | carta crema / bianco-crema |
| `#e0e9c7` | carta verdolina (moduli) |
| `#ebd5da` · `#d0788f` | carta/permesso rosato |
| `#201c3c` | **inchiostro blu-notte** |
| `#574848` | **colore testo documenti** (bruno-grigio — usato letteralmente in `Papers.xml`) |
| `#4e2950` | viola (sigilli/permessi) |
| `#a7a5a6` · `#565656` | grigi |

### Timbri / inchiostro — verde e rosso desaturati, decisi
| Hex | Ruolo |
|---|---|
| `#53701b` → `#86b42b` | **verde APPROVATO** (ombra→luce) |
| `#701b1b` → `#b42b2b` | **rosso RESPINTO** (ombra→luce) |
| `#3c0e0e` · `#324410` | basi scure rosso/verde |

### Volti (`FacePalette.png`) — incarnati caldi + accenti freddi
Incarnati: `#d8ab89` `#ba8657` `#ac6b47` `#a08b61` · capelli/scuri: `#504631`
`#494949` · indumenti/freddi: `#85a4b1` `#287467` `#3d5043` `#7b965d` `#aacac7`.

### Giornale / report
Nero `#000000`, newsprint `#cbcabb`, crema `#efeddc`, oliva `#556855`.

## 3. Anatomia dei documenti (da `Papers.xml`)

I documenti **non** sono "card": sono uno **sfondo-sprite** + **marche posizionate**.
Esempio reale (passaporto):

```xml
<paper id="Passport" nation="Obristan" outer="PassportOuterObristan.png"
       font="bm_mini_a8_6" fontshifty="2" textcolor="0x574848"
       stampable="true" canconfiscate="true">
  <page image="PassportInnerObristan.png">
    <mark text="$Name" format="Last, First"/>
    <mark image="$Face" scale="0.5"/>
    <mark text="$BirthDate"/>
    <mark text="$ExpirationDate" format="120 720"/>
    <mark text="$IdNumber" align="right"/>
  </page>
</paper>
```

Punti chiave da replicare:
- **Outer + Inner**: copertina (sprite) che si apre sul contenuto.
- **Marche** (`$Name`, `$Face`, `$BirthDate`, `$ExpirationDate`, `$IdNumber`) in
  **posizioni fisse** su carta pre-disegnata, con **font bitmap** e **textcolor `#574848`**.
- Flag: `stampable`, `canconfiscate`, `fromtraveler`. Ogni documento è un oggetto.

### Proporzioni documenti (distribuzione reale)
| Native | h/w | Uso tipico |
|---|---|---|
| **150 × 200** | 1.33 | pagina interna principale (passaporto/permesso) |
| 130 × 162 | 1.25 | documento medio |
| 60 × 80 | 1.33 | **fototessera** |
| 240 × 160 | 0.67 | documento landscape (biglietto/giornale) |
| 100 × 100 | 1.0 | tessere/sigilli |
| 27 × 28, 16 × 16, 12 × 12 | ~1 | timbri, bolli, emblemi |

→ Documento-tipo **3:4**, ~150×200 nativi (≈ 300×400 a scala ×2). Fototessera 3:4.

## 4. Volti procedurali (da `Faces.xml`)

Volti assemblati da parti con attributi: `age`, `bmi`, `hairheight`,
`head` (Bald/Beard/Balding/Blonde), `eyes` (Glasses), `mouth` (Mustache),
tinti via `FacePalette`. → I nostri ritratti devono variare per acconciatura,
barba, occhiali, corporatura, età; pochi colori per parte.

## 5. Font

19 font **bitmap** da **6–12 px** (`bm_mini_a8_6`, `04b03_6`, `atari_small_6`,
`nokia_cellphone_fc_6`, `uni_05_*`, `pixantiqua_9`, `bm_germar_a12_9`,
`motorola_screentype_12`, `Digits`…). Tutti pixel, nitidi, niente anti-alias.
→ Useremo **font pixel web** (Silkscreen/VT323 + un bitmap 6–8px per i moduli) a
dimensioni piccole, con rendering pixelated. Testo lungo italiano: un pixel-font
leggibile a 8–10px (i documenti PP sono telegrafici; i nostri hanno più testo,
quindi serve un font pixel leggibile, non micro).

## 6. Composizione schermo (da asset + devlog tig-00)

- **Schermo pieno** (NO cornice/bezel "console" generico: era un errore nostro).
- **Alto = sportello/checkpoint**: parete d'ufficio, finestra/saracinesca,
  richiedente in primo piano (ritratto pixel) + fumetto, coda/guardie sullo sfondo.
- **Basso = scrivania**: piano legno/tan, documenti **trascinabili**, **regolamento**
  (Bulletin/Filer), **barra dei timbri** a destra (APPROVATO/RESPINTO) come
  meccanismo fisico. Lo `SpeechBubble`, la `Hand`, gli `InspectSelection`
  (lente/correlazione) sono tutti oggetti del mondo.

## 7. Logica/struttura (da `Days.csv`, `Papers.xml`, `Faces.xml`)

- `Days.csv`: colonne per giorno, righe `DESC`/`RULES` (es. `RuleNeedPassport`).
  → identico nello spirito al nostro `DayDef.ruleIds`.
- `Papers.xml`: documenti come sfondo+marche. → adotteremo un **layout a marche
  posizionate** per i nostri documenti (oggi sono flussi label:valore).
- `Faces.xml`: assemblaggio volti da parti. → generatore volti a parti.

Il nostro **motore** (engine/data/regole/fazioni/finali) è già strutturato bene e
**non va toccato**: l'intervento è 100% di presentazione.

---

## 8. Mappatura → Ragion di Stato (cosa ricreo, originale)

| PP (riferimento) | Ragion di Stato (originale, Prima Repubblica) |
|---|---|
| Booth/checkpoint Arstotzka | Atrio/sportello del Ministero dell'Interno |
| Passport (Inner/Outer) | Carta d'identità / Passaporto della Repubblica |
| Entry Permit / Work Permit | Permesso di circolazione / soggiorno / espatrio |
| ID Card / Access Permit | Tessera, autorizzazione, nulla osta |
| Bulletin (rulebook) | **Regolamento / Circolare ministeriale** (libretto) |
| Dispatch (orders) | Ordine di servizio / nota riservata |
| Newspaper | Giornale "Il Mattino" |
| Stamp APPROVED/DENIED | Timbro **APPROVATO / RESPINTO / SEGNALATO** |
| Faces (Arstotzkan) | Volti italiani anni '70 (baffi, occhiali, basette) |

Palette, proporzioni e densità: come sopra. **Nessun simbolo/nome di Arstotzka.**

## 9. Cosa è riusabile

- **Niente asset proprietari nel gioco.** Ricreo tutto (sprite, sfondi, carte,
  timbri, volti) con Canvas/SVG/CSS a risoluzione nativa.
- Font: web-font pixel liberi (non i `.fnt` del pacchetto).
- Riferimento di struttura (marche, Inner/Outer, scripting giornate): è
  *metodo*, non asset — lecito e già parallelo al nostro engine.

→ Piano operativo nel prossimo step (vedi chat / `VISUAL_DIRECTION.md`).
