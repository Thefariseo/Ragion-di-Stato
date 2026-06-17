# FACTION ART GUIDE

Ogni fazione deve essere **riconoscibile a colpo d'occhio**: stemma, colore,
carta, timbro, tono, leitmotiv, documento tipico. Quando arriva un documento, il
giocatore deve capire da quale mondo viene **prima di leggerlo**.

Legenda: ✅ implementato · 🔜 da fare. Stemmi: `FactionEmblem` (pixel su roundel).

| Fazione | Sigla | Colore | Stemma ✅ | Carta/stile doc | Timbro | Tono | Leitmotiv 🔜 |
|---|---|---|---|---|---|---|---|
| **Democrazia Solidale** | DS | `#e7dcc0` | scudo + croce | istituzionale beige, intestazione, sigillo | RISERVATO rosso | burocratico cortese | solenne |
| **S.I.R.** | SIR | `#55663f` | occhio | classificato, codici, **omissis** pesanti, blu-notte | SEGRETO | freddo, imperativo | tensione |
| **L'Anello** | — | `#7c241c` | anello | fascicoli **senza intestazione**, doppie firme, oscurati | (nessuno) | allusivo, minaccioso | tensione |
| **Brigate Proletarie** | BP | `#9c3a2e` | stella 5 punte | **volantino** ciclostilato sporco, carta povera, sigle | timbro rozzo | ideologico, gergale | tensione |
| **La Procura** | PR | `#3b4a37` | bilancia | carta legale pulita, mandati, verbali, sigilli formali | timbro formale | preciso, secco | solenne |
| **La Stampa** | ST | `#1b1712` | giornale | **carta-giornale**, colonne, foto sgranate, correzioni a penna | (nessuno) | inchiesta, ironico | solenne |
| Avanguardia Nera | AN | `#403e39` | triangolo/fiamma 🔜 | comunicati minacciosi, simboli angolari, nero | rozzo | aggressivo | 🔜 |
| La Rete (Quercia) | RQ | `#28321f` | quercia/rete 🔜 | **senza intestazione**, numerazioni segrete, microfilm | sigillo strano | criptico | 🔜 |
| La Cupola | CU | `#54160f` | corona/dome 🔜 | **pizzino**, carta povera, minacce senza firma | (nessuno) | indiretto, inquietante | 🔜 |
| Il Sindacato | SN | `#9c3a2e` | ingranaggio 🔜 | volantino, comunicato, slogan | timbro | combattivo | 🔜 |
| La Loggia | LG | `#5d5b54` | triangolo+occhio 🔜 | carta elegante, numeri, sigilli, riferimenti criptici | sigillo | ambiguo, cortese | 🔜 |
| Il Salotto | SL | `#b07d3a` | cilindro 🔜 | lettera formale, intestazione aziendale, firme eleganti | (nessuno) | felpato | 🔜 |

## Implementato
- **Stemmi** core (6) + lore (6 glifi base) — `FactionEmblem`.
- **Carta intestata** per documento con fascia-colore d'ente + emblema (`DocumentCard`).
- **Archivio fazioni** diegetico (`FactionArchive`) con identità + segreto-omissis.
- **Cutscene di presentazione** per le 6 core.

## Roadmap (🔜)
1. **Stili documentali per ente**: template `DocumentCard` per famiglia (servizi=
   omissis pesanti/scuro; stampa=carta-giornale a colonne; gruppi armati=volantino
   ciclostilato; mafia=pizzino; loggia=carta elegante criptica).
2. **Timbri dedicati** per ente (forme/inchiostri diversi).
3. **Leitmotiv** musicale breve per fazione (vedi `AUDIO_DIRECTION.md`).
4. Rifinire i glifi delle fazioni lore.
