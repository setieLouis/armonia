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
     * Strategy: Exclusive usage of LocalDB.
     */
    async loadData(day) {
        if (!day) {
            throw new Error("DataService: day is required as a parameter");
        }

        // Normalize requested day to YYYY-MM-DD
        const targetDay = day.split('T')[0];

        // Ensure database is seeded before loading
        await this.seedDatabase();

        // Use a cache for the currently loaded data if it matches the requested day
        if (this.isLoaded && this.currentDay === targetDay) return this.data;

        try {
            // Try to load from Local Database (Dexie) using normalized 'targetDay'
            let localData = await window.localDB.getMeal(targetDay);

            if (localData) {
                console.log(`DataService: Loaded data for ${targetDay} from LocalDB`);
                this.data = localData;
            } else {
                console.log(`DataService: No data found for ${targetDay} in LocalDB`);
                this.data = null;
            }

            this.currentDay = targetDay;
            this.isLoaded = true;
            return this.data;
        } catch (error) {
            console.error(`DataService: Error loading data for ${targetDay} from DB`, error);
            throw error;
        }
    }

    /**
     * Returns the full data object.
     */
    getData() {
        return this.data;
    }

    /**
     * Returns all meals for the current loaded day.
     */
    getMeals() {
        return (this.data && this.data.meals) ? this.data.meals : [];
    }

    /**
     * Finds a meal by its ID within the current day.
     */
    getMealById(mealId) {
        if (!this.data || !this.data.meals) return null;
        return this.data.meals.find(m => m.id === mealId);
    }

    /**
     * Persists the current state to the local database.
     */
    async persist() {
        if (this.data) {
            await window.localDB.saveMeal(this.data);
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
            const originalUseStatus = meal.dishes[dishIndex].use;
            
            meal.dishes[dishIndex] = {
                ...newDishData,
                use: originalUseStatus,
                alternatives: meal.dishes[mealId === meal.id ? dishIndex : -1]?.alternatives || []
            };
            
            // Note: alternatives handling might need refinement depending on structure
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
