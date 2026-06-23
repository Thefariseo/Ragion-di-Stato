# CONSEQUENCE PIPELINE — *Ragion di Stato*

> Come una scelta diventa mondo. Ogni scelta importante DEVE produrre almeno una
> conseguenza tracciabile. Una scelta senza conseguenza si taglia.

## Anatomia di una conseguenza (`Consequence`, types/index.ts)
Una scelta applica una `Consequence` (game/engine.ts → `applyConsequence`) che può:

| Campo | Effetto | Dove si vede |
| --- | --- | --- |
| `factions` | reputazione/sospetto di una fazione | resoconto, sblocco casi/eventi, finali |
| `sospetto` | sorveglianza interna su di te | HUD, nota del superiore, finale «Radiato» (≥75) |
| `player` | famiglia, lucidità, stipendio | resoconto, notte/economia |
| `country` | repressione, caos, verità, compromesso | mondo (corridoio, allarmi), giornale, finali |
| `setFlags` | memoria del mondo | **giornale**, **eventi**, **casi futuri**, **finali** |
| `unlockCases` | inietta un caso futuro | un NPC/fazione che **torna** |
| `unlockEndings` | apre un finale | epilogo |
| `logTitle` | riga nel diario della giornata | resoconto |

## Le 5 reazioni che ogni scelta forte attiva (almeno UNA)
1. **Fazione**: reputazione/sospetto cambia → la fazione gioca diverso.
2. **NPC**: salvato / danneggiato / arrestato / scomparso / **che torna**.
3. **Giornale**: un trafiletto reattivo il giorno dopo (`data/newspapers.ts`,
   `NEWS_ITEMS[].requiresFlag`).
4. **Evento futuro**: telefonata/minaccia/favore gated su flag
   (`data/events.ts`, `requiresFlag`/`forbidsFlag`; `DayDef.events`).
5. **Caso futuro / finale**: `unlockCases` (inject con `appearsIfFlag`) o
   `unlockEndings`/flag valutati a G10 (`data/endings.ts`).

## La catena temporale
```
Giorno N: scelta → setFlags(F)
Giorno N (subito): ammenda/timbro, sospetto, log
Giorno N+1 mattino: NEWSPAPER reagisce a F
Giorno N+k: EVENTO o CASO-RITORNO gated su F (NPC/fazione tornano)
Giorno 10: ENDINGS valutano la SOMMA dei flag
```

## Flag canonici (la spina dorsale)
- **Anello**: `passato_ragioniere`/`obbedito_anello` (servito) vs
  `segnalato_ragioniere`/`trattenuto_anello` (incrinato) → favore o ritorsione.
- **fondo R**: `fondoR_coperto` / `fondoR_procura` / `fondoR_distrutto` /
  `copia_fondoR` → giornale + finali (assorbito / collaboratore_procura / fuga).
- **Procura**: `verbale_alla_procura`, `deposito_alla_procura`, `dossier_procura`.
- **Stampa**: `passato_stampa`, `bechis_segnalato`, `dossier_stampa` → scandalo.
- **Rete**: `scoperta_rete`, `occultata_rete`, `conti_segnalato`.
- **NPC**: `militante_segnalato`/`_protetto` (Renzo), `giulia_segnalata`,
  `renzo_aiutato`/`_abbandonato`.

## Audit (regola di qualità)
Una `Consequence` che non tocca NESSUNO dei campi sopra **non è una scelta**: è
un click. Ogni azione dei casi è verificata: deve cambiare almeno fazione,
sospetto, paese, o un flag con effetto a valle. (Eventi puramente atmosferici
ammessi SOLO come `AmbientVisual` del corridoio, non come scelte.)
