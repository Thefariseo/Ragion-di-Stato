# AUDIO DIRECTION — *Ragion di Stato*

Direzione sonora e **manifest delle tracce**. La funzione è quella di *Papers,
Please*: minimale, marziale, cupa, burocratica, solenne, fredda — quasi un
**inno statale deformato**. Niente horror, niente azione moderna, niente trailer
music, niente earrape.

## Architettura (già implementata)
- **AudioSystem** (`lib/audio/core.ts`): un AudioContext, un master e 4 **bus**
  separati (music / ambience / sfx / voice) con **volume e mute** indipendenti e
  persistiti; **fade** e **loadBuffer** (decodifica file con cache); resume al
  primo gesto.
- **MusicManager** (`lib/music.ts`): suona i cue del manifest sul bus music; se
  il **file** esiste lo riproduce in loop con **crossfade**, altrimenti usa un
  **fallback procedurale discreto** (drone + pulsazione, nessuna melodia
  invadente). Sostituire una traccia = lasciar cadere il file in `/public/audio`.
- **AmbientLoopSystem** (`lib/ambientAudio.ts`): bed ambientale sul bus ambience
  (ronzio neon, brusio ministeriale, one-shot diegetici). Domina sul gameplay.
- **FactionLeitmotifSystem** (`lib/music.ts → playLeitmotif`): sound signature
  breve per fazione.
- **VoiceBlipSystem** (`lib/voice.ts`): mormorii low-res per categoria di
  personaggio, sincronizzati col testo, sul bus voice.
- **SFXRegistry** (`lib/sfx.ts → SFX/playSfx`): timbri, carta, telefono, telex,
  cassetti, porte, sul bus sfx.
- **Mixer UI** (`components/ui/AudioSettings.tsx`): mute + 4 cursori volume.

## Ruolo della musica
- **Menu / intro / cutscene / presentazione fazioni / crisi / finali** → musica.
- **Gameplay alla scrivania** → niente musica invadente: domina l'**ambiente**.
  Se musica, solo drone basso/texture a volume molto basso.

## Cosa evitare
horror fantasy · azione moderna · elettronica aggressiva · epica generica · caos
sonoro · ansia artificiale · trailer music · loop fastidiosi · clipping/earrape.

## Formato file
`.ogg` (fallback `.mp3`). Loop con zero-crossing puliti. Normalizza ~ -16 LUFS,
true-peak < -1 dBTP. Mono o stereo. Strumenti per produrle: LMMS / Bosca Ceoil /
Helm / bfxr (sfx) o librerie royalty-free (CC0).

## Manifest tracce (vedi `data/audioManifest.ts`)

| # | Cue (id) | File | Durata | Loop | Mood / strumenti | Dove | Prio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `main_theme` | **music/main-theme/main-theme.mp3 ✅ INTEGRATA** | 45–70 s | sì | inno marziale, ottoni bassi/synth brass, percussione secca, drone | Titolo | 5 |
| 2 | `intro` | music/intro/intro-ministero.ogg | 30–45 s | no | solenne, freddo, organo/archi gravi | Intro/nomina | 5 |
| 3 | `gameplay_ambient` | music/gameplay-ambient/gameplay-ambient.ogg | 60–120 s | sì | quasi impercettibile, drone+pulsazione, vol. basso | (opz.) sul banco | 1 |
| 4 | `tension` | music/tension/tension.ogg | 20–40 s | no | marcia che stringe, percussione secca | Eventi gravi/crisi | 6 |
| 5 | `newspaper` | music/newspaper/newspaper.ogg | 10–20 s | no | breve, istituzionale | Giornale del mattino | 2 |
| 6 | `faction_governo` | music/factions/ministero.ogg | 8–15 s | no | marcia lenta, ottoni bassi, timbro secco | Ministero | 4 |
| 7 | `faction_sir`/`faction_anello` | music/factions/servizi.ogg | 8–15 s | no | drone scuro, rumore telefonico, note filtrate | Servizi | 4 |
| 8 | `faction_stampa` | music/factions/stampa.ogg | 8–15 s | no | macchina da scrivere, rotative, ritmo nervoso | Stampa | 4 |
| – | `faction_procura` | music/factions/magistratura.ogg | 8–15 s | no | freddo, ordinato, processuale | Procura | 4 |
| 9 | `faction_cupola` | music/factions/criminalita.ogg | 8–15 s | no | silenzio, nota grave, rumore secco, minaccia | Cupola | 4 |
| – | `faction_rete` | music/factions/rete.ogg | 8–15 s | no | texture misteriosa, fruscio, microfilm, nota ricorrente | Rete | 4 |
| – | `faction_brigate` | music/factions/armati.ogg | 8–15 s | no | ritmo instabile, percussione secca, tensione breve | Gruppi armati | 4 |
| 10 | `ending_system` | music/endings/system.ogg | 30–60 s | no | freddo, ordinato, vuoto | Finale: assorbito dal sistema | 7 |
| 11 | `ending_arrest` | **music/endings/negative-ending.mp3 ✅ INTEGRATA** | 30–60 s | no | passi, porta, timbro, silenzio | Finale: arresto | 7 |
| 12 | `ending_scandal` | music/endings/scandal.ogg | 30–60 s | no | rotative, caos lontano, tema spezzato | Finale: scandalo | 7 |
| 13 | `ending_secret` | music/endings/secret.ogg | 30–60 s | no | quasi silenzio, simbolo ricorrente, inquietudine | Finale: segreto | 7 |
| – | `ending_magistratura` | music/endings/magistratura.ogg | 30–60 s | no | lento, verbali, timbri, solennità ambigua | Finale: magistratura | 7 |
| – | `ending_servizi` | music/endings/servizi.ogg | 30–60 s | no | drone basso, telefono muto, fascicolo bruciato | Finale: servizi deviati | 7 |

## Ambience (loop, bus ambience)
office (brusio+neon) · corridor (passi, porte) · rain · neon (ronzio) · telex.
Oggi sintetizzati in `lib/ambientAudio.ts`; sostituibili con loop in
`public/audio/ambience/*`.

## SFX (bus sfx) — `lib/sfx.ts`
paper · stamps · phone · doors · drawer · typewriter (+ click, ring, thud, telex).
Sintetizzati; sostituibili con campioni in `public/audio/sfx/*`.

## Priorità di produzione
1. **main_theme**, **intro**, **tension** (identità immediata).
2. **faction cues** (governo, servizi, stampa, procura).
3. **ending cues** (system, arrest, scandal, secret).
4. **gameplay_ambient** + ambience loops (rifinitura).
Finché i file mancano, il fallback procedurale resta **discreto** e bilanciato.
