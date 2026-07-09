# ART ASSETS — TODO

Stato: ✅ fatto · 🟡 base presente, da rifinire · 🔜 da fare.
Tutto **ricreato originale** (canvas/CSS), nessun asset PP spedito.

## Desk / scrivania
| Asset | Dim. native | Palette | Stato | Uso | Sheet | Anim | Var. fazione |
|---|---|---|---|---|---|---|---|
| Piano legno (`tex-wood`) | tile | legno | ✅ | scrivania | no | no | no |
| Oggetti (telefono, posacenere, tampone, caffè) | ~120px | env/legno | ✅ | `DeskProps` | no | 🔜 telefono squilla | no |
| Bancone/feritoia | strip | metallo | ✅ | divisore | no | 🔜 carta esce | no |
| Schedario | ~190×210 | legno/metallo | 🔜 | archiviazione | no | 🔜 cassetto | no |

## Booth / corridoio
| Scena corridoio (`BoothScene`) | 240×116 | oliva/bruno | ✅ | sfondo sportello | no | 🟡 sagoma+neon | no |
| Sagoma che passa (`walkby`) | piccola | nero | ✅ | ambient | no | ✅ | no |
| Finestra/serranda | — | metallo | 🟡 | sportello | no | 🔜 serranda su/giù | no |
| Tubo pneumatico / fessura | — | metallo | 🔜 | consegna doc | no | 🔜 | no |

## NPC
| Busto richiedente (`NpcSprite`) | 56×92 | pelle/abiti | ✅ | sportello | 🔜 sheet | 🟡 enter+idle | no |
| Guardia / agente / superiore | 56×92 | divise/trench | 🔜 | ambient/eventi | 🔜 | 🔜 | no |
| Foto-segnaletica (`Photo`) | 48×60 | seppia | ✅ | documenti/giornale | no | no | no |
| Anim. scortato/arrestato/fuga | — | — | 🔜 | reazione decisione | 🔜 | 🔜 | no |

## Fazioni / stemmi
| Stemmi core (`FactionEmblem`) | 22×22 | colore fazione | ✅ (6) | doc/resoconto/rubrica | no | no | sì |
| Stemmi lore (6) | 22×22 | colore fazione | 🟡 glifi base | id. | no | no | sì |
| Sigilli/timbri dedicati per ente | ~40px | colore fazione | 🔜 | documenti | no | no | sì |
| Carta intestata per ente (stile) | — | — | 🟡 fascia colore | documenti | no | no | sì |

## Documenti
| Carta per tipo + intestazione + filigrana + firma | ~300×400 | carte | ✅ | scrivania | no | 🔜 apertura | per fazione |
| Stili differenziati per ente (servizi/stampa/mafia/…) | — | — | 🔜 | scrivania | no | no | sì |
| Allegati (graffetta, foto, nota manoscritta) | piccoli | — | 🟡 | documenti | no | 🔜 | no |
| Pizzino / volantino / telex / microfilm | vari | carte povere | 🔜 | casi | no | no | sì |

## Timbri
| Strumento timbro (legno) + impronta | tool + 70×30 | verde/rosso | ✅ | decisioni | no | ✅ slam | 🔜 per ente |
| Timbri speciali (NON ESIBIBILE, SEGRETO…) | — | — | 🟡 | casi | no | ✅ | 🔜 |

## Giornale / briefing / night
| Giornale multi-colonna | 1180-wide | carta-giornale | ✅ | morning | no | no | reattivo |
| Briefing/circolare | — | carta | 🟡 | pre-desk | no | no | no |
| Night report (bilancio+rubrica) | — | carta | ✅ | notte | no | no | no |
| Fine giornata (report+nota superiore+fazioni) | — | carta | ✅ | end day | no | no | stemmi |

## Intro / menu
| Titolo cartellina RISERVATO | — | carta | ✅ | title | no | 🔜 timbro | no |
| Lettera di nomina / telegramma | — | carta | 🔜 | intro | no | 🔜 | no |

## Eventi ambientali (`AmbientEvent` 🔜)
| Telefono che squilla | — | — | 🟡 evento | desk | no | 🔜 | no |
| Ispezione / ispettore che osserva | — | — | 🟡 evento | desk | 🔜 | 🔜 | no |
| Busta lasciata / pacco | — | — | 🟡 evento | desk | 🔜 | 🔜 | no |
| Irruzione / fuga / scorta | — | — | 🔜 | booth | 🔜 | 🔜 | no |
| Blackout / allarme / sirena | — | — | 🔜 | full | no | 🔜 | no |

## Audio (placeholder WebAudio)
| stamp/click/ring/thud/paper/telex/drawer | — | — | ✅ | azioni | — | — | — |
| typewriter/door/serranda/passi/allarme/sirena/neon/ufficio | — | — | 🔜 | azioni/ambient | — | — | — |

## Cursori / inspection / FX
| Cursore pixel custom | 16×16 | — | 🔜 | globale | no | hover/click | no |
| Inspection: selezione + linea collegamento | — | ocra/rosso | 🟡 lente | desk | no | 🔜 linea | no |
| Evidenziazione discrepanza | — | rosso | 🟡 | desk | no | 🔜 | no |

## Debug
| Galleria asset/schermate | — | — | 🔜 | `/debug` o pannello | — | — | — |

### Priorità prossimo giro
1. Stili documentali per ente (servizi/stampa/mafia/gruppi armati). 2. `AmbientEvent`
visibili (ispettore, busta, telefono) con sprite. 3. NPC: uscita/scortato/fuga.
4. Inspection mode con linea di collegamento pixel. 5. Galleria debug.
