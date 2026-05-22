/**
 * local_db.js: Database layer using Dexie.js
 */

// Step 2: Definizione dello Schema
const db = new Dexie("ArmoniaFlowDB");

// Definizione del nuovo schema allineato a tmp_meal.json
db.version(1).stores({
    meals: 'day', // Usiamo 'day' come chiave primaria (es. "2026-05-18T08:00:00.000Z")
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
        return await db.meals.put(mealData);
    },
    
    // Profilo Utente
    async getUserData(key) {
        return await db.user_profile.get(key);
    },
    async saveUserData(key, data) {
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

// Esponiamo l'istanza globalmente
window.localDB = LocalDB;
window.db = db; 
