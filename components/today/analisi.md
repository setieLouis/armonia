# Analisi Tecnica dei Motori di Caricamento

Questo documento analizza la logica di caricamento dinamico dei componenti utilizzata nel progetto Armonia Flow.

## 1. Analisi di `script.js` (Core Loader)

Il file `script.js` funge da **motore di caricamento** e entry-point dell'applicazione. È responsabile della gestione delle operazioni di fetch e dell'iniezione dei componenti nel DOM.

### Funzioni Principali:
- **`loadComponent(id, path, initFunc)`**: 
  - Utilizza la **Fetch API** per recuperare frammenti HTML in modo asincrono.
  - Esegue l'iniezione nel DOM tramite `innerHTML`.
  - Include un **Lifecycle Hook** (`initFunc`) che permette di eseguire logica JS specifica dopo che l'HTML è stato caricato.
- **`loadScript(src)`**: 
  - Gestisce il caricamento dinamico dei file JavaScript.
  - Restituisce una `Promise`, permettendo l'uso di `await` per garantire che la logica sia disponibile prima dell'esecuzione.
- **`DOMContentLoaded`**:
  - Orchestratore iniziale che inietta la struttura principale (`today.html`) e avvia il bootstrapping della vista.

---

## 2. Analisi di `today.js` (Orchestratore di Vista)

Il file `today.js` funge da **orchestratore di secondo livello**. Mentre `script.js` gestisce l'infrastruttura, `today.js` coordina specificamente la composizione della vista "Today".

### Caratteristiche principali:
- **Caricamento Sequenziale**: L'uso di `async/await` garantisce che i componenti (Header, Calendar, Meals, Progress) vengano caricati in ordine logico, riducendo artefatti visivi.
- **Gestione Intelligente degli Script (Lazy Loading)**:
  - Nel caricamento dei **Pasti (Meals)**, il sistema verifica se la funzione di inizializzazione è già presente in `window` prima di caricare il file JS esterno. Questo ottimizza le performance evitando download ridondanti.
- **Integrità del Caricamento**: Include controlli condizionali per assicurarsi che l'inizializzazione avvenga solo se i container necessari sono presenti nel DOM.

---

## Considerazioni Architetturali

### Vantaggi:
- **Zero Dipendenze**: Sistema estremamente leggero e veloce.
- **Modularità**: Separazione netta tra struttura (HTML), stile (CSS inline nei componenti) e logica (JS).

### Possibili Evoluzioni:
- **Parallelismo**: Ottimizzare i caricamenti indipendenti tramite `Promise.all()`.
- **Error Handling**: Aggiungere segnaposti (placeholders) visivi in caso di fallimento del fetch di un singolo componente.
- **Scoped CSS**: Implementare una gestione più rigorosa degli stili per evitare conflitti globali, seguendo la convenzione definita in `GEMINI.md`.
