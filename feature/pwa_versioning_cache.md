# Gestione Dinamica del Versionamento e Invalidazione della Cache PWA

## Contesto & Problema
In precedenza, il Service Worker dell'applicazione utilizzava un nome della cache statico cablato direttamente all'interno di `sw.js`:
```javascript
const CACHE_NAME = 'armonia-flow-v1';
```
Questo approccio presentava alcuni limiti:
1. **Mancanza di allineamento**: La versione della cache non era legata alla versione reale dell'applicazione (`APP_VERSION` definita in `script.js`).
2. **Invalidazione manuale complessa**: Ogni rilascio richiedeva l'aggiornamento manuale del codice in più punti separati (`script.js` per l'interfaccia/notifiche e `sw.js` per il Service Worker), aumentando il rischio di disallineamenti e costringendo gli utenti a ricaricare manualmente la pagina più volte per superare la cache del browser.

---

## Decisione ed Architettura (Single Source of Truth)
Abbiamo deciso di centralizzare tutte le informazioni di rilascio e di build in un unico file di configurazione globale situato nella radice del progetto: `version.js`. 

Questo file funge da unica fonte di verità per:
- `APP_VERSION`: La versione semantica dell'applicazione.
- `RELEASE_DATE`: La data di rilascio del pacchetto corrente.
- `CACHE_VERSION`: Un numero incrementale (build) per forzare l'invalidazione della cache all'interno della stessa versione dell'app.

Grazie a questa separazione, sia la finestra del browser (Main Thread) sia il Service Worker (Worker Thread) possono importare le medesime costanti senza generare duplicazioni o conflitti.

---

## Dettaglio dell'Implementazione

### 1. Definizione della Configurazione (`version.js`)
Creato il file [version.js](file:///workspace/version.js) contenente le costanti di versione:
```javascript
const APP_VERSION = "1.2.1";
const RELEASE_DATE = "26 Giugno 2026";
const CACHE_VERSION = "1";
```

### 2. Integrazione nel Thread Principale (`index.html` & `script.js`)
- In [index.html](file:///workspace/index.html), abbiamo registrato il file di configurazione prima dello script orchestratore:
  ```html
  <script src="version.js"></script>
  <script src="script.js"></script>
  ```
- In [script.js](file:///workspace/script.js), abbiamo rimosso le definizioni locali obsolete di `APP_VERSION` e `RELEASE_DATE` per evitare conflitti di doppia dichiarazione, consentendo al codice di usare direttamente quelle globali messe a disposizione da `version.js`.

### 3. Integrazione nel Service Worker (`sw.js`)
Il Service Worker opera in un thread isolato e non ha accesso all'oggetto `window`. Abbiamo quindi utilizzato `importScripts` per caricare la configurazione e calcolare dinamicamente il nome della cache:
- **Importazione e Composizione Dinamica**:
  ```javascript
  importScripts('version.js');
  const CACHE_NAME = `armonia-flow-v${APP_VERSION}.${CACHE_VERSION}`;
  ```
- **Caching del File di Configurazione**:
  Per garantire il corretto funzionamento dell'applicazione offline, abbiamo aggiunto `'/version.js'` all'array `ASSETS_TO_CACHE`. In questo modo il Service Worker salva localmente anche le informazioni di versione correnti.

---

## Flusso di Aggiornamento della Cache (Cache Invalidation)
Quando viene rilasciato un nuovo aggiornamento dell'applicazione:
1. **Aggiornamento File**: Lo sviluppatore incrementa la versione (es. `APP_VERSION = "1.2.2"`) o la build (`CACHE_VERSION = "2"`) in `version.js`.
2. **Rilevamento del Browser**: Al successivo caricamento dell'app, il browser controlla se il Service Worker (`sw.js`) o i suoi script importati (`version.js`) sono cambiati sul server.
3. **Installazione**: Rilevato il cambiamento in `version.js`, il browser installa il nuovo Service Worker. Durante la fase di installazione (`install` event), il nuovo SW scarica le ultime versioni degli asset e le salva nella nuova cache `armonia-flow-v1.2.2.1`.
4. **Attivazione & Cleanup**: Durante la fase di attivazione (`activate` event), il Service Worker confronta i nomi delle cache sul browser, rileva che la vecchia cache (es. `armonia-flow-v1.2.1.1`) non corrisponde al nuovo `CACHE_NAME` e la elimina definitivamente, liberando spazio ed evitando conflitti di cache obsoleta.
