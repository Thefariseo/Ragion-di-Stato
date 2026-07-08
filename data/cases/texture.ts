import type { CaseDef } from "@/types";
import { approva, respingi, archivia, segnala, special, richiediVerifica } from "./helpers";

/**
 * PRATICHE DI TESSITURA — giorni 3–6. Danno densità alle giornate centrali e
 * INTRECCIANO i sistemi: ogni pratica ha una regola testata, una fazione che
 * agisce, un frammento di lore ricorrente (censura, velina, fondo R), una
 * scelta gated e conseguenze immediate + future (flag → giornale → ritorni).
 */
export const TEXTURE_CASES: CaseDef[] = [
  /* ============ G3 — la CENSURA come pratica quotidiana (Stampa) ========== */
  {
    id: "t3_visto_stampa",
    subject: "Bozza in attesa di visto",
    faction: "stampa",
    summary: "Un trafiletto sull'appalto del porto attende il «visto, si stampi»",
    intro: [
      "Un fattorino della tipografia, inchiostro sulle dita.",
      "«Il direttore chiede il visto entro l'una, o salta la pagina. Dice che è roba innocua. Da quando lo dicono, non lo è mai.»",
    ],
    documents: [
      {
        id: "t3c1_bozza",
        kind: "articolo",
        title: "Bozza di trafiletto",
        issuer: "La Stampa",
        authLevel: "libero",
        protocollo: "ST-114/1974",
        fields: [
          { label: "Titolo", value: "«Porto, la gara che non c'è mai stata»", comparable: true },
          { label: "Riga 12", value: "cita un «fondo di partito»", comparable: true },
        ],
        body: [
          "Il pezzo ricostruisce l'appalto Bramante. Alla riga 12, un inciso: «risorse riconducibili a un fondo del partito di maggioranza».",
          "Tutto il resto è cronaca. Quella riga è dinamite.",
        ],
      },
    ],
    regulationVerdict: "approva",
    actions: [
      approva({
        text: "«Visto, si stampi.» Intero, riga 12 compresa. Domani qualcuno al Ministero leggerà quel trafiletto due volte, e il tuo protocollo una volta sola. Basta.",
        factions: { stampa: { reputation: 10 }, governo: { reputation: -8 } },
        country: { verita: 6 },
        sospetto: 6,
        setFlags: ["trafiletto_integrale"],
        logTitle: "Vistato integrale il trafiletto sul porto",
      }, { stampLabel: "VISTO SI STAMPI", hint: "Approva il pezzo integrale." }),
      special("censura", "Censura la riga 12", "censura", {
        text: "Il pezzo esce senza l'inciso sul fondo. Cronaca pulita, verità amputata. Il direttore capirà chi ha tenuto la matita rossa.",
        factions: { governo: { reputation: 6 }, stampa: { reputation: -8 } },
        country: { verita: -5, compromesso: 3 },
        sospetto: -2,
        setFlags: ["trafiletto_censurato"],
        logTitle: "Censurata la riga sul fondo di partito",
      }, { requires: {}, hint: "Il pezzo esce, ma senza la riga scomoda." }),
      respingi({
        text: "Niente visto: la pagina salta. Né verità né censura: solo un buco bianco dove doveva esserci un articolo. I buchi bianchi, all'estero, li chiamano notizie.",
        factions: { stampa: { reputation: -6 } },
        country: { verita: -2 },
        setFlags: ["trafiletto_bloccato"],
        logTitle: "Negato il visto al trafiletto",
      }),
    ],
  },

  /* ====== G4 — il costo umano della regola (Sindacato, pressione morale) === */
  {
    id: "t4_pensionato",
    subject: "Ettore Baldan",
    faction: "sindacato",
    summary: "Tessera di reversibilità scaduta da nove giorni. Ottant'anni.",
    intro: [
      "Un uomo curvo, il cappello in mano come si usava.",
      "«È scaduta mentre ero in ospedale, signor funzionario. Nove giorni. La pensione di mia moglie... senza tessera non me la pagano.»",
    ],
    documents: [
      {
        id: "t4c1_tessera",
        kind: "tessera",
        title: "Tessera di reversibilità",
        issuer: "Sindacato Unitario",
        authLevel: "libero",
        photo: { seed: 5150, label: "Baldan" },
        fields: [
          { label: "Nome", value: "Ettore Baldan", comparable: true },
          { label: "Validità", value: "SCADUTA (9 giorni)", comparable: true },
        ],
      },
      {
        id: "t4c1_ricovero",
        kind: "nota",
        title: "Certificato di ricovero",
        issuer: "Ospedale S. Camillo",
        authLevel: "libero",
        protocollo: "OSP-2211/1974",
        fields: [
          { label: "Nome", value: "Ettore Baldan", comparable: true },
          { label: "Degenza", value: "dodici giorni, dimesso ieri", comparable: true },
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      respingi({
        text: "«Documento scaduto: respingere, senza eccezioni.» La regola è chiara e tu la applichi. Baldan ripiega la tessera con due mani che tremano. La regola non trema mai.",
        country: { repressione: 1 },
        player: { lucidita: -6 },
        setFlags: ["baldan_respinto"],
        logTitle: "Respinta la tessera scaduta di Baldan",
      }, "Il regolamento non ammette eccezioni."),
      approva({
        text: "Timbri lo stesso: il ricovero vale più dei nove giorni. È un'infrazione, e lo sai. La pensione di una vedova contro una riga di regolamento: oggi ha vinto la vedova.",
        player: { lucidita: 5 },
        factions: { sindacato: { reputation: 8 } },
        sospetto: 3,
        setFlags: ["baldan_aiutato"],
        logTitle: "Rinnovata (in deroga) la tessera di Baldan",
      }, { hint: "Contro il regolamento. Ammenda probabile." }),
      richiediVerifica({
        text: "Chiedi al Sindacato una proroga formale per ricovero documentato. Arriverà. Tra tre settimane. Baldan ringrazia lo stesso: è abituato ad aspettare lo Stato.",
        factions: { sindacato: { reputation: 3 } },
        player: { lucidita: -2 },
        setFlags: ["baldan_rinviato"],
        logTitle: "Richiesta proroga per Baldan",
      }),
    ],
  },

  /* ============ G5 — la VELINA del Ministero (Governo, censura di Stato) === */
  {
    id: "t5_velina",
    subject: "Velina ministeriale",
    faction: "governo",
    summary: "Una nota «di indirizzo» per le testate. Senza firma, naturalmente.",
    intro: [
      "Un usciere in giacca buona la posa sul banco senza guardarti.",
      "«Da protocollare e trasmettere alle testate. Oggi stesso.» La parola d'ordine è scritta a metà pagina: certe cose non vanno nominate.",
    ],
    documents: [
      {
        id: "t5c1_velina",
        kind: "ordine",
        title: "Nota di indirizzo alle testate",
        issuer: "Gabinetto del Sottosegretario Velardi",
        authLevel: "riservato",
        protocollo: "R-0699/1974",
        fields: [
          { label: "Firma", value: "illeggibile", comparable: true },
          { label: "Indicazione", value: "«non dare rilievo a sigle di fantasia (fondo R)»", comparable: true },
        ],
        body: [
          "Si raccomanda alle direzioni «equilibrio» nel riferire di presunti fondi riservati.",
          "È la prima volta che vedi le due parole scritte insieme, su carta intestata: fondo R.",
        ],
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      special("trasmetti_velina", "Protocolla e trasmetti", "trasmetti", {
        text: "La velina parte per le redazioni. Domani i giornali saranno «equilibrati». Hai appena visto come si fabbrica il silenzio, e hai firmato la spedizione.",
        factions: { governo: { reputation: 8 }, stampa: { reputation: -6 } },
        country: { verita: -6, compromesso: 4 },
        sospetto: -2,
        setFlags: ["velina_trasmessa", "anello_riferimento"],
        logTitle: "Trasmessa la velina sul fondo R",
      }, { requires: {}, target: "ministero", hint: "Eseguire l'indirizzo del Gabinetto." }),
      special(
        "trattieni",
        "Trattieni (firma illeggibile)",
        "trattieni",
        {
          text: "Firma illeggibile: la nota non produce effetti, regolamento alla mano. La rispedisci al Gabinetto. Il regolamento, per un giorno, ha difeso i giornali. Domani troveranno un'altra strada.",
          factions: { governo: { reputation: -8 } },
          country: { verita: 3 },
          sospetto: 7,
          setFlags: ["velina_trattenuta"],
          logTitle: "Trattenuta la velina (firma illeggibile)",
        },
        { requires: { ruleViolation: true }, lockHint: "Serve un'irregolarità formale per trattenerla." },
      ),
      special("occulta", "Falla sparire e avvisa Bechis", "occulta", {
        text: "La velina «si smarrisce» e una copia finisce nella borsa del cronista. Se la pubblica, il Paese vedrà l'ordine di tacere. Se risalgono a te, vedrai l'alba da una cella.",
        factions: { stampa: { reputation: 12 }, governo: { reputation: -10, suspicion: 8 } },
        country: { verita: 8 },
        sospetto: 12,
        setFlags: ["velina_a_bechis"],
        logTitle: "Velina passata al cronista Bechis",
      }),
    ],
  },

  /* ====== G6 — l'intercettazione sul Ragioniere (SIR/Brigate, fondo R) ===== */
  {
    id: "t6_intercettazione",
    subject: "Nastro 44-B",
    faction: "sir",
    summary: "Un'intercettazione dove le Brigate parlano dei soldi sbagliati",
    intro: [
      "Un plico del SIR con una trascrizione e un appunto a margine: «valutare rilevanza».",
      "Il nastro è di una base brigatista. Ma i soldi di cui parlano non sono i loro.",
    ],
    documents: [
      {
        id: "t6c1_trascrizione",
        kind: "intercettazione",
        title: "Trascrizione nastro 44-B",
        issuer: "SIR — sezione II",
        authLevel: "segreto",
        protocollo: "S-0230/1974",
        fields: [
          { label: "Voce 1", value: "«il Ragioniere ha pagato in anticipo»", comparable: true },
          { label: "Nulla osta", value: "ASSENTE", comparable: true },
        ],
        body: [
          "«...dice che i fondi non sono un problema. Il Ragioniere ha pagato in anticipo. Come per la piazza.»",
          "«Come per la piazza»: tre parole che legano un uomo dei servizi a un ordigno.",
        ],
      },
      {
        id: "t6c1_massima",
        kind: "nota",
        title: "Appunto di massima",
        issuer: "SIR",
        authLevel: "riservato",
        fields: [
          { label: "Indicazione", value: "«il nominativo citato NON è di interesse»", comparable: true },
        ],
        body: ["Qualcuno, sopra di te, ha già deciso che il Ragioniere non esiste."],
      },
    ],
    discrepancies: [
      {
        aDocId: "t6c1_trascrizione",
        aField: "Voce 1",
        bDocId: "t6c1_massima",
        bField: "Indicazione",
        note: "Il nastro lega «il Ragioniere» ai soldi di un attentato. L'appunto ordina di considerarlo «non di interesse». Uno dei due documenti mente per iscritto.",
      },
    ],
    regulationVerdict: "respingi",
    actions: [
      archivia({
        text: "Archivi il nastro «come da indicazione». Il Ragioniere resta un uomo che non esiste, e la piazza resta senza colpevoli. Il faldone, da qualche parte, si ricorda di te.",
        factions: { sir: { reputation: 6 }, anello: { reputation: 6 } },
        country: { verita: -5 },
        sospetto: -3,
        setFlags: ["nastro_archiviato", "fondoR_coperto"],
        logTitle: "Nastro 44-B archiviato come irrilevante",
      }, "Eseguire l'indicazione: non di interesse."),
      segnala(
        {
          text: "Metti a verbale la contraddizione: nastro contro appunto, firma contro firma. Adesso esiste un atto che dice che qualcuno copre il Ragioniere. Gli atti, qui, hanno le gambe corte. E i denti lunghi.",
          factions: { procura: { reputation: 10 }, sir: { reputation: -8, suspicion: 10 }, anello: { suspicion: 8 } },
          country: { verita: 7 },
          sospetto: 10,
          setFlags: ["nastro_verbalizzato", "amico_procura"],
          unlockCases: ["ret_procura_ancora"],
          logTitle: "Verbalizzata la contraddizione del nastro 44-B",
        },
        { lockHint: "Confronta nastro e appunto: serve la contraddizione a verbale." },
      ),
      special("occulta", "Fai sparire l'appunto di massima", "occulta", {
        text: "L'appunto sparisce: resta solo il nastro, nudo, che accusa. Non hai verbalizzato niente: hai solo tolto la copertura. Che se la vedano tra loro.",
        factions: { anello: { suspicion: 10 }, sir: { suspicion: 6 } },
        country: { verita: 3 },
        sospetto: 6,
        setFlags: ["copertura_rimossa"],
        logTitle: "Rimossa la copertura sul nastro 44-B",
      }),
    ],
  },
];
