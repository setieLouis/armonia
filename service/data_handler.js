/**
 * data_handler.js: Centralized Data Service for Armonia Flow
 * Manages state, persistence (Dexie DB), and data transformations.
 */

class DataService {
    constructor() {
        this.data = null;
        this.isLoaded = false;
        this.listeners = [];
        this.currentDay = null;
        this.isSeeded = false;
    }

    /**
     * Seeds the database with initial data from tmp_meal.json if empty.
     */
    async seedDatabase() {
        if (this.isSeeded) return;

        try {
            const count = await window.db.meals.count();
            if (count === 0) {
                console.log("DataService: DB is empty, seeding from tmp_meal.json...");
                const response = await fetch('tmp_meal.json');
                const seedData = await response.json();
                
                // tmp_meal.json is a single object, not an array
                const dataArray = Array.isArray(seedData) ? seedData : [seedData];
                
                for (const dayData of dataArray) {
                    if (dayData && dayData.day) {
                        // Normalize 'day' to YYYY-MM-DD format
                        const normalizedDay = dayData.day.split('T')[0];
                        await window.localDB.saveMeal({
                            ...dayData,
                            day: normalizedDay
                        });
                    }
                }
                console.log("DataService: Database seeded successfully");
            }
            this.isSeeded = true;
        } catch (error) {
            console.warn("DataService: Could not seed database", error);
        }
    }

    /**
     * Loads the initial data for a specific day.
     * Strategy: Try LocalDB, then Firestore, then Seed.
     */
    async loadData(day) {
        if (!day) {
            throw new Error("DataService: day is required as a parameter");
        }

        const targetDay = day.split('T')[0];

        if (this.isLoaded && this.currentDay === targetDay) return this.data;

        try {
            // 1. Prova Local Database (Dexie)
            let localData = await window.localDB.getMeal(targetDay);

            if (localData) {
                console.log(`DataService: Loaded data for ${targetDay} from LocalDB`);
                this.data = localData;
            } else {
                // 2. Se non c'è in locale, prova Firestore
                console.log(`DataService: No local data for ${targetDay}, checking Firestore...`);
                const remoteData = await this.getFromFirestore(targetDay);
                
                if (remoteData) {
                    this.data = remoteData;
                    await window.localDB.saveMeal(remoteData); // Salva in locale per il futuro
                } else {
                    // 3. Se neanche Firestore ha dati, usa il seed
                    await this.seedDatabase();
                    this.data = await window.localDB.getMeal(targetDay);
                }
            }

            this.currentDay = targetDay;
            this.isLoaded = true;
            return this.data;
        } catch (error) {
            console.error(`DataService: Error loading data for ${targetDay}`, error);
            throw error;
        }
    }

    /**
     * Recupera i dati di un giorno specifico da Firestore.
     */
    async getFromFirestore(day) {
        if (!window.firestore) return null;
        try {
            // Nota: qui andrebbe usato un userId reale se l'auth è attiva
            const doc = await window.firestore.collection('meals').doc(day).get();
            return doc.exists ? doc.data() : null;
        } catch (e) {
            console.warn("DataService: Errore nel recupero da Firestore", e);
            return null;
        }
    }

    /**
     * Returns all meals for the current day.
     */
    getMeals() {
        return (this.data && this.data.meals) ? this.data.meals : [];
    }

    /**
     * Helper to find a specific meal object by its ID within the current day.
     */
    getMealById(mealId) {
        if (!this.data || !this.data.meals) return null;
        return this.data.meals.find(m => m.id === mealId);
    }

    /**
     * Genera un ID unico (UUID v4) per l'utente.
     */
    generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Sincronizza il profilo utente con Firestore.
     */
    async syncUserProfile() {
        if (!window.localDB || !window.firestore) return;

        try {
            const profile = await window.localDB.getUserData('profile');
            const waterSettings = await window.localDB.getUserData('water_settings');
            
            if (profile && profile.uid) {
                // Rimuoviamo la chiave 'key' di Dexie per pulire il dato su Firestore
                const { key, ...cleanProfile } = profile;
                
                const syncData = {
                    ...cleanProfile,
                    lastUpdate: new Date().toISOString()
                };

                if (waterSettings) {
                    const { key: wKey, ...cleanWaterSettings } = waterSettings;
                    syncData.water_settings = cleanWaterSettings;
                }

                console.log("DataService: Tentativo sincronizzazione Firestore con dati:", syncData);

                await window.firestore
                    .collection('users')
                    .doc(profile.uid)
                    .set(syncData, { merge: true });
                console.log("DataService: Profilo utente e impostazioni acqua sincronizzati con Firestore");
            } else {
                console.warn("DataService: Impossibile sincronizzare, profilo mancante o senza UID");
            }
        } catch (e) {
            console.error("DataService: Errore sincronizzazione profilo", e);
        }
    }

    /**
     * Sincronizza lo stato idratativo corrente con Firestore per le push notification.
     */
    async syncWaterStatus(day) {
        if (!window.localDB || !window.firestore) return;

        try {
            const profile = await window.localDB.getUserData('profile');
            const waterIntake = await window.localDB.getWaterIntake(day);
            
            if (profile && profile.uid && waterIntake) {
                await window.firestore
                    .collection('users')
                    .doc(profile.uid)
                    .set({
                        water_status: {
                            lastDrink: waterIntake.lastUpdated ? new Date(waterIntake.lastUpdated).toISOString() : null,
                            todayTotal: waterIntake.amount,
                            goal: waterIntake.goal,
                            day: day
                        },
                        lastUpdate: new Date().toISOString()
                    }, { merge: true });
                console.log("DataService: Stato acqua sincronizzato con Firestore");
            }
        } catch (e) {
            console.error("DataService: Errore sincronizzazione stato acqua", e);
        }
    }

    /**
     * Persists the current state to the local database and syncs with Firestore.
     */
    async persist() {
        if (this.data) {
            // Salva in locale
            await window.localDB.saveMeal(this.data);
            
            // Sincronizza con Firestore
            if (window.firestore) {
                try {
                    // Recuperiamo il profilo per associare l'utente se disponibile
                    const profile = await window.localDB.getUserData('profile');
                    const mealData = { ...this.data };
                    if (profile && profile.uid) {
                        mealData.ownerId = profile.uid;
                    }

                    await window.firestore
                        .collection('meals')
                        .doc(this.data.day)
                        .set(mealData, { merge: true });
                    console.log("DataService: Sincronizzato con Firestore");
                } catch (e) {
                    console.error("DataService: Errore sincronizzazione Firestore", e);
                }
            }
            
            this.notifyListeners();
        }
    }

    /**
     * Updates the 'use' (completed) status of a specific dish within a meal.
     */
    async toggleDishStatus(mealId, dishIndex) {
        const meal = this.getMealById(mealId);
        if (meal && meal.dishes[dishIndex]) {
            meal.dishes[dishIndex].use = !meal.dishes[dishIndex].use;
            await this.persist();
            return true;
        }
        return false;
    }

    /**
     * Mark an entire meal as consumed or unconsumed.
     */
    async toggleMealStatus(mealId) {
        const meal = this.getMealById(mealId);
        if (meal) {
            const allCompleted = meal.dishes.every(d => d.use);
            meal.dishes.forEach(d => d.use = !allCompleted);
            await this.persist();
            return true;
        }
        return false;
    }

    /**
     * Replaces a dish at a specific index within a meal with a new dish.
     */
    async replaceDish(mealId, dishIndex, newDishData) {
        const meal = this.getMealById(mealId);
        if (meal && meal.dishes[dishIndex]) {
            const originalDish = meal.dishes[dishIndex];
            
            // Manteniamo lo stato di completamento e la lista delle alternative originali
            // in modo che l'utente possa sempre scegliere un'altra opzione per quel "posto".
            meal.dishes[dishIndex] = {
                ...newDishData,
                use: originalDish.use,
                alternatives: originalDish.alternatives || []
            };
            
            await this.persist();
            return true;
        }
        return false;
    }

    /**
     * Calculates the overall progress percentage for the current day.
     */
    calculateProgress() {
        if (!this.data || !this.data.meals) return 0;
        
        let total = 0;
        let completed = 0;

        this.data.meals.forEach(meal => {
            total += meal.dishes.length;
            completed += meal.dishes.filter(d => d.use).length;
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    /**
     * Observer pattern: Subscribe to data changes.
     */
    subscribe(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }
}

// Create a global instance
window.dataService = new DataService();
