# Piano di Sviluppo: Presentazione Nuove Feature all'Avvio (Vista Dedicata)

Questo documento descrive i passaggi per implementare la presentazione automatica delle nuove funzionalità all'utente tramite una schermata dedicata all'apertura dell'applicazione dopo un nuovo rilascio, senza alcuna modifica al menu di navigazione.

---

## 1. Obiettivo & Comportamento Atteso
* **Rilevamento**: All'avvio dell'applicazione, confrontare la versione software corrente (`APP_VERSION`) con l'ultima versione registrata nel database locale dell'utente (`last_seen_version`).
* **Schermata Dedicata**: Se la versione corrente è più recente, mostrare all'utente una vista a schermo intero contenente le card delle nuove funzionalità ricavate da `features_data.json`.
* **Navigazione**: La schermata presenterà un pulsante "Continua" per accedere all'app principale.
* **Nessuna modifica al Menu**: Questa vista è temporanea e non sarà accessibile o presente nel menu hamburger.
* **Salvataggio dello Stato**: Al click su "Continua", salvare la nuova versione nel DB in modo da non riproporre la schermata fino al prossimo aggiornamento dell'app.

---

## 2. Roadmap di Sviluppo in Step

### Step 1: Definizione della Versione dell'App
* **File da modificare**: `script.js`
* **Compito**: Definire la costante globale `APP_VERSION` (es. `const APP_VERSION = "1.1.0";`) in `script.js`.

### Step 2: Creazione del Componente Grafico `features-info` come Schermata di Benvenuto
* **File da modificare**: `components/features-info/features-info.html` e `features-info.js`.
* **Compito**:
  * Adattare il layout per funzionare come schermata di atterraggio (Landing Screen) quando caricata all'avvio.
  * Rimuovere/nascondere l'header standard con pulsante back se caricata all'avvio, e mostrare invece un pulsante "Continua" in fondo.
  * Visualizzare le feature contrassegnate come `"available"` come card eleganti.

### Step 3: Logica di Controllo e Routing all'Avvio
* **File da modificare**: `script.js` (in `checkUserSession()`).
* **Compito**:
  1. Durante il controllo della sessione, recuperare `last_seen_version` da `user_profile`.
  2. Se la versione del codice è superiore o se non è presente una versione salvata (ma l'utente ha già un profilo):
     * Deviare la navigazione verso la vista `features-info`.
  3. Se la versione è identica, procedere direttamente verso la vista `today`.

### Step 4: Gestione del pulsante "Continua" e Salvataggio della Versione
* **File da modificare**: `components/features-info/features-info.js`
* **Compito**:
  * Quando l'utente preme il pulsante "Continua":
    1. Salvare la versione corrente nel DB: `await window.localDB.saveUserData('last_seen_version', { version: APP_VERSION });`.
    2. Navigare alla schermata `today` tramite `window.navigateTo('today')`.

### Step 5: Test & Validazione
* **Compito**:
  * Verificare il corretto caricamento delle card delle novità all'avvio incrementando la versione.
  * Assicurarsi che l'app non mostri la schermata agli avvii successivi.
