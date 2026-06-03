/**
 * local_db.js: Database layer using Dexie.js
 */

// Step 2: Definizione dello Schema
const db = new Dexie("ArmoniaFlowDB");

// Definizione del nuovo schema allineato a tmp_meal.json
// Incrementata versione a 3 per aggiungere tracking acqua
db.version(3).stores({
    meals: 'day', 
    user_profile: 'key',
    alternatives_cache: 'dishName',
    water_log: 'day' // Tracking giornaliero dell'acqua
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
    
    // Profilo Utente e Impostazioni
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

    // Acqua (Water Tracking)
    async getWaterIntake(day) {
        return await db.water_log.get(day) || { day, amount: 0, goal: 2000, glasses: 0 };
    },
    async addWater(day, ml = 250) {
        const current = await this.getWaterIntake(day);
        current.amount += ml;
        current.glasses = Math.floor(current.amount / 250);
        current.lastUpdated = Date.now(); // Salva quando ha bevuto l'ultima volta
        return await db.water_log.put(current);
    },
    async saveWaterSettings(settings) {
        return await this.saveUserData('water_settings', settings);
    },

    // Utilità per pulire tutto
    async clearAll() {
        await db.meals.clear();
        await db.user_profile.clear();
        await db.alternatives_cache.clear();
        await db.water_log.clear();
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
