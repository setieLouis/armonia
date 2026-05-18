/**
 * data_handler.js: Centralized Data Service for Armonia Flow
 * Manages state, persistence (mock), and data transformations.
 */

class DataService {
    constructor() {
        this.data = null;
        this.isLoaded = false;
        this.listeners = [];
    }

    /**
     * Loads the initial data from the JSON file.
     * In a real app, this could check localStorage first.
     */
    async loadData() {
        if (this.isLoaded) return this.data;

        try {
            const response = await fetch('components/today/today_meals.json');
            this.data = await response.json();
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
     * Updates the 'use' (completed) status of a specific dish within a meal.
     */
    toggleDishStatus(mealId, dishIndex) {
        const meal = this.getMealById(mealId);
        if (meal && meal.dishes[dishIndex]) {
            meal.dishes[dishIndex].use = !meal.dishes[dishIndex].use;
            this.notifyListeners();
            return true;
        }
        return false;
    }

    /**
     * Mark an entire meal as consumed or unconsumed.
     */
    toggleMealStatus(mealId) {
        const meal = this.getMealById(mealId);
        if (meal) {
            const allCompleted = meal.dishes.every(d => d.use);
            meal.dishes.forEach(d => d.use = !allCompleted);
            this.notifyListeners();
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
