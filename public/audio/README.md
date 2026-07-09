# /public/audio — tracce esterne (drop-in)

Il gioco suona già **senza** questi file grazie al fallback procedurale
(lib/music.ts). Per sostituire una traccia, lascia cadere il file nel percorso
indicato dal manifest (`data/audioManifest.ts`) e, se cambi nome, aggiorna `file`.

Formato consigliato: **.ogg** (fallback .mp3). Loop puliti (zero-cross), normalizzati
a circa **-16 LUFS**, niente clipping. Vedi `docs/AUDIO_DIRECTION.md` per durate,
mood, strumenti e priorità di ogni cue.

Struttura:
- `music/` main-theme, intro, gameplay-ambient, tension, newspaper, factions, endings
- `ambience/` office, corridor, rain, neon, telex (loop ambientali)
- `sfx/` paper, stamps, phone, doors, drawer, typewriter
- `voice/blips` (opzionale: campioni di mormorio low-res)

Tracce REALI già in repo: music/main-theme/main-theme.mp3 (tema del titolo) e
music/endings/negative-ending.mp3 (marcia funebre del bad ending). Gli altri cue
restano su fallback procedurale finché non arrivano i file.
