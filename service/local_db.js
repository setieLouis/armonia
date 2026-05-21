/**
 * local_db.js: Database layer using Dexie.js
 */

// Step 2: Definizione dello Schema
const db = new Dexie("ArmoniaFlowDB");

db.version(1).stores({
    meals: 'id', // id è la data (es. "2026-05-18")
    user_profile: 'key', // key può essere "info", "goals", ecc.
    alternatives_cache: 'dishName' // cache per le alternative degli ingredienti
});

// Funzioni helper per semplificare l'uso del DB nel DataService
const LocalDB = {
    // Pasti
    async getMeal(id) {
        return await db.meals.get(id);
    },
    async saveMeal(mealData) {
        return await db.meals.put(mealData);
    },
    
    // Profilo Utente
    async getUserData(key) {
        return await db.user_profile.get(key);
    },
    async saveUserData(key, data) {
        return await db.user_profile.put({ key, ...data });
    }
};

// Esponiamo l'istanza globalmente
window.localDB = LocalDB;
window.db = db; // Esponiamo anche l'istanza Dexie per debug o query avanzate
