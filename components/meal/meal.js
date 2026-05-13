// meal.js: Orchestratore per la vista Dettaglio Pasto
async function initMeal(data = {}) {
    console.log("Inizializzazione vista Meal...");
    
    // In futuro qui caricheremo i sub-componenti:
    // - Header (.mea-hea)
    // - Info Nutrizionali (.mea-inf)
    // - Ingredienti (.mea-ing)
    
    console.log("Dati pasto ricevuti:", data);
}

// Esponiamo la funzione globalmente
window.initMeal = initMeal;
