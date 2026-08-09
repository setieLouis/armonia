# Architettura Layer Database Locale - Armonia Flow

Questo documento descrive la strategia e i passi tecnici per implementare la persistenza dei dati locale all'interno dell'applicazione, permettendo il funzionamento offline e la conservazione dello stato dell'utente.

## 1. Scelta della Tecnologia
Per Armonia Flow, si consiglia l'uso di **IndexedDB** rispetto a LocalStorage per i seguenti motivi:
- **Capacità**: Supporta grandi quantità di dati (fino a centinaia di MB).
- **Struttura**: Permette di salvare oggetti JavaScript complessi senza doverli serializzare ogni volta in stringhe JSON.
- **Performance**: Funziona in modo asincrono, non bloccando il thread principale dell'interfaccia utente durante operazioni di lettura/scrittura pesanti.

## 2. Definizione dello Schema (Data Modeling)
Verranno creati tre "Object Stores" (equivalenti alle tabelle):
1. `meals`: Memorizza i pasti giornalieri. Chiave primaria: `id` (es. "2026-05-18").
2. `user_profile`: Info utente come nome, obiettivi calorici e progressi storici.
3. `alternatives_cache`: Cache locale per le alternative degli ingredienti per velocizzare il caricamento.

## 3. Implementazione del Database Controller
Verrà creato un file `service/local_db.js` contenente la classe `LocalDatabase`:

```javascript
class LocalDatabase {
    constructor(dbName = "ArmoniaFlowDB") {
        this.dbName = dbName;
        this.version = 1;
    }

    // Apertura connessione e gestione migrazioni
    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('meals')) {
                    db.createObjectStore('meals', { keyPath: 'id' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
```

## 4. Metodi CRUD (Create, Read, Update, Delete)
Il layer fornirà API semplificate per manipolare i dati:
- `getMeal(date)`: Recupera il piano alimentare di una data specifica.
- `saveMeal(mealData)`: Inserisce o aggiorna un pasto (utilizzato dopo ogni toggle o sostituzione).
- `clearOldData()`: Funzione di manutenzione per rimuovere dati molto vecchi.

## 5. Strategia di Bootstrap (Hydration)
La logica di caricamento nel `DataService` seguirà questo flusso:
1. **Controllo Locale**: L'app chiede al Database Locale i dati del giorno corrente.
2. **Fallback JSON**: Se il DB è vuoto (primo avvio), l'app esegue il fetch dei file `.json` originali.
3. **Popolamento**: I dati recuperati dai JSON vengono salvati nel DB Locale.
4. **Sincronizzazione**: Tutte le modifiche future dell'utente verranno scritte prioritariamente sul DB Locale.

## 6. Integrazione nel DataService
Il `DataService` in `data_handler.js` fungerà da orchestratore tra l'interfaccia e il database:

```javascript
async loadData() {
    // Prova il DB locale
    let data = await this.localDB.getMeal(this.todayDate);
    
    // Se non c'è, carica dal server/file e inizializza il DB
    if (!data) {
        data = await this.fetchInitialData();
        await this.localDB.saveMeal(data);
    }
    
    this.data = data;
    return data;
}
```

## 7. Passi Operativi per l'Implementazione
1. [ ] Creazione del file `service/local_db.js`.
2. [ ] Definizione dei metodi di apertura e chiusura DB.
3. [ ] Implementazione dei metodi di lettura/scrittura per i pasti.
4. [ ] Refactoring di `service/data_handler.js` per includere `LocalDatabase` come dipendenza.
5. [ ] Test di persistenza: verificare che dopo un refresh della pagina i pasti sostituiti rimangano tali.
