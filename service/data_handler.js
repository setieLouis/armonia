/**
 * data_handler.js: Centralized Data Service for Armonia Flow
 * Manages state, persistence (Dexie DB), and data transformations.
 */

class DataService {
    constructor() {
        this.data = null;
        this.isLoaded = false;
        this.listeners = [];
        this.todayId = "2026-05-18"; // Hardcoded for this demo, should be dynamic in real app
    }

    /**
     * Loads the initial data.
     * Strategy: Try LocalDB first, fallback to JSON for initialization.
     */
    async loadData() {
        if (this.isLoaded) return this.data;

        try {
            // 1. Try to load from Local Database (Dexie)
            let localData = await window.localDB.getMeal(this.todayId);

            if (localData) {
                console.log("DataService: Loaded data from LocalDB");
                this.data = localData;
            } else {
                // 2. Fallback to JSON if DB is empty
                console.log("DataService: DB empty, loading from JSON...");
                const response = await fetch('components/today/today_meals.json');
                const jsonData = await response.json();
                
                // Use the fixed ID to ensure consistency in this demo
                jsonData.id = this.todayId;
                
                // 3. Save to LocalDB for future use
                await window.localDB.saveMeal(jsonData);
                this.data = jsonData;
            }

            this.isLoaded = true;
            return this.data;
        } catch (error) {
            console.error("DataService: Error loading data", error);
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
     * Returns all meals.
     */
    getMeals() {
        return this.data ? this.data.meals : [];
    }

    /**
     * Finds a meal by its ID.
     */
    getMealById(id) {
        if (!this.data) return null;
        return this.data.meals.find(m => m.id === id);
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
                alternatives: meal.dishes[dishIndex].alternatives 
            };
            
            await this.persist();
            return true;
        }
        return false;
    }

    /**
     * Calculates the overall progress percentage.
     */
    calculateProgress() {
        if (!this.data) return 0;
        
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
