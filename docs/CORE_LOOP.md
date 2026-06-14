# Core Loop — minuto per minuto

L'unità è la **giornata lavorativa**. Una sessione = N giornate finché non scatta
un finale. Stato macchina: `TITLE → BRIEFING → DIRECTIVES → DESK → (EVENT) →
DAY_SUMMARY → (next day | ENDING)`.

## 0:00 — Avvio (Title)
- Schermata iniziale analogica: logo timbrato, neon, opzioni
  **Nuova Pratica / Continua / Debug**. Mostra il seed corrente.
- "Nuova Pratica" chiede (o genera) un **seed**, inizializza `GameState`.

## 0:30 — Briefing del mattino
- Una schermata-comunicato: data, clima del Paese (indicatori), titolo di
  giornale, eventuali **conseguenze notturne** delle scelte precedenti.
- Tono da vebaline d'ufficio. Pulsante **Prendi servizio**.

## 1:00 — Direttive / Regolamento
- Vengono presentate le **direttive del giorno**: nuove `Rule` che si aggiungono
  o sostituiscono le precedenti (es. "I documenti RISERVATO richiedono nulla osta
  dell'Anello"). Spesso politiche, a volte contraddittorie.
- Il giocatore può riaprire il **Regolamento** in ogni momento dalla scrivania.

## 1:30 → fine giornata — La scrivania (loop centrale)
Per ogni **caso** nella coda della giornata:

1. **Arriva la pratica.** Un fascicolo scivola sulla scrivania: soggetto +
   documenti (permesso, tessera, informativa, foto, nota…).
2. **Lettura.** Il giocatore apre i documenti, legge campi e corpo testo.
3. **Confronto (lente).** Modalità Confronto: seleziona due campi; se sono in
   conflitto secondo le regole attive, si rivela la **discrepanza**.
   Strumenti opzionali: telefono (verifica/voce), telex (interroga registro),
   schedario (precedenti), regolamento.
4. **Decisione.** Azioni comuni (**Approva / Respingi / Archivia / Segnala**) +
   azioni **speciali** del caso (es. *Trasmetti all'Anello*, *Avvisa la
   Procura*, *Distruggi*, *Proteggi*). Le azioni che timbrano richiedono di
   apporre un timbro (animazione + suono).
5. **Conseguenza immediata.** Breve esito narrativo; aggiornamento silenzioso di
   fazioni, sospetto, risorse, Paese, flag; eventuale sblocco di casi futuri.
6. **Tempo che scorre.** Ogni azione consuma tempo (orologio 09:00→17:00). La
   **quota** giornaliera va evasa: pratiche non evase = penalità sullo stipendio.

Durante la giornata può scattare un **evento** (telefono che squilla, ispezione
interna, busta sotto la porta): interrompe il flusso, propone una micro-scelta,
applica conseguenze, poi si torna alla coda.

## ~6:30 — Chiusura
- Esaurita la coda (o finito il tempo), la giornata si chiude.

## Sintesi della giornata
- **Resoconto**: pratiche evase/quota, stipendio del giorno (− sanzioni),
  variazioni di sospetto e fazioni, movimenti degli indicatori di Paese.
- Eventuali **avvisi** (minacce, convocazioni) che preparano il giorno dopo.
- Pulsante **Torna a casa** → `nextDay` oppure, se scattano condizioni, **finale**.

## Fine run — Finale
- `evaluateEndings(state)` sceglie il finale a priorità più alta soddisfatto
  (fallback: *Il sistema sopravvive immutato*). Schermata-epilogo con epitaffio,
  bilancio della run, seed, e opzioni **Nuova Pratica / Title**.

---

### Sensazione momento-per-momento
Leggere → dubitare → confrontare → decidere sotto pressione → subire una
conseguenza ambigua → sospettare di aver sbagliato → voler rigiocare.
La frizione è voluta: la UI è scomoda, il tempo stringe, e *in regola* non
significa *giusto*.
