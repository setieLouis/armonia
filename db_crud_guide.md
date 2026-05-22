# Guida Operativa CRUD Database Locale - Armonia Flow

Questo documento spiega come gestire i dati nel database locale (IndexedDB tramite Dexie.js) per Armonia Flow. Puoi eseguire questi comandi sia nel codice dell'app che direttamente nella **Console del Browser (F12)**.

Il database si chiama `ArmoniaFlowDB` e ha tre tabelle (Object Stores) principali:
- `meals`: indicizzata per `day` (es. "2026-05-18").
- `user_profile`: indicizzata per `key`.
- `alternatives_cache`: indicizzata per `dishName`.

---

## 1. CREATE / UPDATE (Inserimento e Aggiornamento)

Per inserire o sovrascrivere un intero record, si usa il metodo `put`.

### Salvare un Piano Alimentare Giornaliero
```javascript
// Tramite Helper
window.localDB.saveMeal({
    day: "2026-05-18",
    meals: [
        { id: "breakfast-1", label: "Colazione", dishes: [...] }
    ]
});

// Tramite Dexie (Raw)
db.meals.put({ day: "2026-05-18", meals: [...] });
```

### Salvare Dati Utente
```javascript
window.localDB.saveUserData("info", { name: "Giulia", goal: "Weight Loss" });
```

---

## 2. READ (Lettura)

### Recuperare un giorno specifico
```javascript
// Tramite Helper
window.localDB.getMeal("2026-05-18").then(data => console.log(data));

// Tramite Dexie (Raw)
db.meals.get("2026-05-18");
```

### Vedere TUTTI i dati (Tabella)
```javascript
db.meals.toArray().then(data => console.table(data));
```

---

## 3. DELETE (Cancellazione Singola)

### Rimuovere una giornata specifica
```javascript
// Cancella il record con chiave "2026-05-18"
db.meals.delete("2026-05-18").then(() => {
    console.log("Giorno rimosso con successo");
});
```

### Rimuovere un'impostazione utente
```javascript
db.user_profile.delete("info");
```

---

## 4. CLEAR (Svuotamento Totale)

### Svuotare una singola tabella
```javascript
db.meals.clear().then(() => console.log("Tabella pasti svuotata"));
```

### Svuotare TUTTO il database (Helper)
Abbiamo creato una funzione dedicata per pulire velocemente l'ambiente di sviluppo:
```javascript
window.localDB.clearAll().then(() => {
    console.log("Tutte le tabelle sono state svuotate.");
    location.reload(); // Ricarica per vedere le modifiche (o far partire il seeding)
});
```

---

## 5. UPDATE PARZIALE (Aggiornamento mirato)

Se vuoi cambiare solo una proprietà senza riscrivere l'intero oggetto (es. cambiare solo il nome di un piatto):

```javascript
db.meals.update("2026-05-18", { 
    note: "Mi sento molto bene oggi" 
}).then(updated => {
    if (updated) console.log("Aggiornamento riuscito");
    else console.log("Nessun record trovato con questa chiave");
});
```

---

## Note per il Debugging
- **Persistenza**: Ricorda che IndexedDB è legato all'origine (protocollo + dominio). Se pulisci i dati del sito o cambi browser, i dati locali andranno persi.
- **Errori di Schema**: Se cambi la chiave primaria (es. da `day` a `id`) e Dexie va in errore, usa `db.delete()` per resettare tutto e ripartire.
