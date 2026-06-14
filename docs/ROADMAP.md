# Roadmap di sviluppo

## Fase 0 — Fondamenta (questo prototipo) ✅
- [x] Documenti di design (GDD, core loop, architettura, data model).
- [x] Scaffolding Next.js 15 + TS strict + Tailwind + Zustand, deployabile Vercel.
- [x] Tipi condivisi (`types/`) come unica fonte di verità.
- [x] Motore puro separato dalla UI (`game/`): conseguenze, fazioni, regole,
      eventi, narrative, finali.
- [x] Contenuti: 6 fazioni core, 3 giornate, 13+ casi, ~8 regole, 3 eventi,
      6 finali, conseguenze cross-day.
- [x] Estetica analogica: carta, inchiostro, timbri (visivi + WebAudio), grana,
      vignetta, scanline, font d'epoca.
- [x] Scrivania interattiva: dossier, lettura documenti, modalità Confronto,
      timbri, regolamento, barra di stato.
- [x] Salvataggio `localStorage` (persist) + seed riproducibile.
- [x] Pannello debug.

## Fase 1 — Profondità del prototipo (prossimi passi)
- [ ] Inspection più ricca: trascinamento documenti, lente che ingrandisce,
      verifica via telefono/telex con esiti variabili.
- [ ] Generatori procedurali di documenti "di riempimento" (pratiche minori) per
      densità e ritmo, con seed.
- [ ] Audio ambientale (neon, traffico, telescrivente) loop leggero.
- [ ] Test unitari del motore (Vitest) su `applyConsequence`, regole, finali.
- [ ] Bilanciamento indicatori e soglie dei finali.

## Fase 2 — Contenuto
- [ ] 7–10 giornate con arco narrativo completo (crisi di governo, attentato,
      processo, funerali di Stato, depistaggio).
- [ ] Tutte le 12 fazioni con eventi dedicati e contraddizioni interne.
- [ ] 12+ finali con epiloghi multi-pagina e "schede personaggio" del destino NPC.
- [ ] Sistema reputazione a catena più fine (alleanze/faide tra fazioni).

## Fase 3 — Produzione
- [ ] Direzione artistica definitiva: sprite/asset, foto sgranate autentiche,
      timbri unici per ente, palette per fazione.
- [ ] Localizzazione (IT primaria, EN opzionale).
- [ ] Salvataggi multipli + profili; eventuale cloud save (Supabase/Neon).
- [ ] Accessibilità: dimensioni testo, contrasto alto, riduzione effetti.
- [ ] Telemetria opzionale per bilanciamento (privacy-first).

## Principi mantenuti in ogni fase
Atmosfera · chiarezza del gameplay · modularità · scelte con conseguenze ·
rigiocabilità · coerenza artistica · deploy facile su Vercel.
