/**
 * local_db.js: Database layer using Dexie.js
 */

// Step 2: Definizione dello Schema
const db = new Dexie("ArmoniaFlowDB");

// Definizione del nuovo schema allineato a tmp_meal.json
// Incrementata versione a 2 per forzare aggiornamento schema se esistente
db.version(2).stores({
    meals: 'day', // Usiamo 'day' come chiave primaria
    user_profile: 'key',
    alternatives_cache: 'dishName'
});

// Funzioni helper per semplificare l'uso del DB nel DataService
const LocalDB = {
    // Pasti
    async getMeal(day) {
        return await db.meals.get(day);
    },
    async saveMeal(mealData) {
        if (!mealData || !mealData.day) {
            console.error("LocalDB: Errore, tentativo di salvare un pasto senza la chiave 'day'", mealData);
            throw new Error("Missing 'day' key in meal data");
        }
        return await db.meals.put(mealData);
    },
    
    // Profilo Utente
    async getUserData(key) {
        return await db.user_profile.get(key);
    },
    async saveUserData(key, data) {
        if (!key) {
            console.error("LocalDB: Errore, tentativo di salvare dati utente senza chiave");
            throw new Error("Missing 'key' in user data");
        }
        return await db.user_profile.put({ key, ...data });
    },

    // Utilità per pulire tutto
    async clearAll() {
        await db.meals.clear();
        await db.user_profile.clear();
        await db.alternatives_cache.clear();
        console.log("LocalDB: All tables cleared.");
    }
};

// Inizializzazione esplicita
db.open().then(() => {
    console.log("Dexie: Database aperto correttamente.");
}).catch(err => {
    console.error("Dexie: Errore durante l'apertura del database:", err);
});

// Esponiamo l'istanza globalmente
window.localDB = LocalDB;
window.db = db; 
