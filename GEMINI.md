## 1. Regole di Processo (Come Lavoriamo)

### Git Flow
Il progetto segue il modello **Git Flow** per la gestione dei rami e dei rilasci.

- **main**: Ramo di produzione (stabile).
- **develop**: Ramo principale per lo sviluppo.
- **feature/**: Nuove funzionalità (partono da `develop`).
- **hotfix/**: Correzioni urgenti in produzione (partono da `main`).
- **release/**: Preparazione per il rilascio (partono da `develop`).

> Usare sempre i comandi `git flow [feature|hotfix|release] start/finish` per garantire la coerenza del repository.

---

### Fase di Analisi (Prima di Implementare)
Prima di scrivere qualsiasi codice, è **obbligatorio** fare una fase di analisi conversazionale con il modello.

**Come funziona:**
- Il modello fa domande mirate per capire la vista/funzionalità richiesta.
- L'utente risponde e chiarisce i dettagli.
- Solo quando il quadro è completo e condiviso, si passa all'implementazione.

**Il modello NON deve iniziare a scrivere codice finché non ha capito:**
- Cosa deve fare la vista (obiettivo)
- Quali dati mostra e da dove vengono
- Quali componenti esistenti può riusare
- Quali interazioni utente sono previste

---

## 2. Architettura del Progetto (Com'è Fatto)

### Stack Tecnologico
- **Frontend**: Vanilla HTML5, Vanilla CSS, Vanilla JavaScript (ES6+) — **nessun framework**.
- **Database locale**: Dexie.js (wrapper IndexedDB) per persistenza offline.
- **PWA**: Service Workers + Web App Manifest per funzionamento offline e installazione.

---

### Struttura delle Cartelle

```
armonia-flow/
├── index.html               → SPA entry point
├── script.js                → orchestratore principale (routing tra viste)
├── style.css                → stili globali
├── sw.js                    → service worker (PWA / cache offline)
│
├── components/              → componenti UI riusabili (ognuno ha HTML + CSS + JS)
│   ├── header/              → barra di navigazione superiore
│   ├── list-tile/           → componente atomico per liste e intestazioni
│   ├── info-banner/         → banner messaggi informativi e alert
│   ├── today/               → vista principale giornaliera
│   ├── meals/               → gestione lista pasti
│   ├── current-meal/        → dettaglio pasto corrente
│   ├── calendar/            → vista calendario
│   ├── progress/            → andamento e progressi dieta
│   ├── diet-update/         → aggiornamento piano alimentare
│   ├── welcome/             → onboarding utente
│   ├── account/             → profilo utente
│   ├── acqua/               → reminder idratazione
│   ├── ingredient/          → dettaglio ingredienti
│   ├── menu/                → menu di navigazione
│   └── features-info/       → pagina informativa sulle funzionalità
│
├── service/                 → layer dati e logica di business
│   ├── data_handler.js      → orchestratore dati (punto di accesso principale)
│   ├── local_db.js          → interfaccia IndexedDB via Dexie.js
│   ├── emoji_service.js     → gestione emoji per i piatti
│   └── notification_service.js → notifiche push e reminder
│
└── ui/                      → mockup, risorse grafiche ed Excalidraw
```

---

## 3. Vincoli Tecnici (Cosa Rispettare Sempre)

### Stack
- ❌ Nessun framework JS (no React, Vue, Angular)
- ❌ Nessun CSS framework (no Tailwind, Bootstrap)
- ✅ Solo Vanilla JS / CSS / HTML

### UI e Componenti
- ❌ Non scrivere HTML/CSS custom se esiste già un componente riusabile
- ✅ Controllare sempre `components/` prima di creare nuovo codice UI
- ✅ Il CSS di un componente deve stare **dentro la sua cartella**, non in `style.css`
- ✅ Ogni componente è autonomo: HTML + CSS + JS nella stessa cartella

### Dati e Database
- ✅ Tutti gli accessi al DB passano per `service/data_handler.js`
- ❌ Non accedere direttamente a `local_db.js` dalle viste
- ✅ Usare sempre gli helper `window.localDB.*` per operazioni sul database

### Architettura
- ❌ Non mescolare logica di business nei file HTML
- ✅ La logica di routing e orchestrazione sta in `script.js`

---

## 4. Contesto dell'App (Di Cosa Parla)

**Armonia Flow** è una PWA per la gestione della **dieta alimentare quotidiana**.

### Obiettivo
Aiutare l'utente a seguire il proprio piano alimentare in modo semplice, con supporto offline e un'interfaccia curata ispirata al benessere.

### Funzionalità principali
- Visualizzazione e gestione dei **pasti giornalieri** (colazione, pranzo, cena, spuntini)
- **Sostituzione ingredienti** con alternative equivalenti
- **Progressi dieta** — storico dei giorni rispettati
- **Reminder idratazione** — notifiche per bere acqua
- **Aggiornamento piano** — modifica della dieta dall'app
- **Calendario** — panoramica settimanale/mensile

### Terminologia del dominio
- **Pasto** (`meal`): un'unità del piano giornaliero (es. "Colazione")
- **Piatto** (`dish`): un singolo alimento o preparazione dentro un pasto
- **Piano giornaliero** (`day`): insieme dei pasti di una data specifica
- **Profilo utente** (`user_profile`): dati e preferenze dell'utente

---

## 5. Componenti Plug-and-Play (Riusabili)

Prima di creare nuovo codice UI, **verificare e usare** questi componenti esistenti.

### 1. ListTile (`components/list-tile/list-tile.js`)
Il componente atomico più importante per liste e intestazioni.
- **Varianti**: `default` (card bianca con ombra), `header` (trasparente, font grandi)
- **Proprietà**: `leading` (icona/immagine), `title`, `subtitle`, `trailing`, `bgClass`

### 2. Header (`components/header/header.js`)
Gestore della barra di navigazione superiore.
- **Funzione**: `initHeader(container, {left, right})`
- **Supporta**: titoli dinamici, pulsante back, menu opzioni, `updateHeader` per aggiornamenti senza re-render

### 3. InfoBanner (`components/info-banner/info-banner.js`)
Componente per messaggi informativi, alert o note.
- **Funzione**: `renderInfoBanner({icon, message, variant})`
- **Varianti**: `info` (default beige/marrone)

### Regola d'Oro
> Se un elemento somiglia a una riga di lista o a una barra superiore, **NON** scrivere HTML/CSS custom. Usa i componenti sopra e configurali via JS nell'orchestratore della vista.

---