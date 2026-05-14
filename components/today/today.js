// today.js: Orchestrator for Today sub-components
async function initToday() {
    console.log("Inizializzazione sub-componenti Today...");
    
    // Step 2: Caricamento Header
    await loadComponent('header-root', 'components/sub_components/header/header.html');

    // Step 3: Caricamento Calendario (che include la data)
    await loadComponent('calendar-root', 'components/sub_components/calendar/calendar.html');

    // Step 4: Caricamento Lista Pasti
    await loadComponent('meals-root', 'components/sub_components/meals/meals.html', async (element) => {
        // Carichiamo il JS specifico del componente se non è già presente
        if (typeof window.initMeals !== 'function') {
            await loadScript('components/sub_components/meals/meals.js');
        }
        window.initMeals(element);
    });

    // Step 5: Caricamento Progress bar
    await loadComponent('progress-root', 'components/sub_components/progress/progress.html');
}

// Chiamiamo l'inizializzazione se siamo nel contesto giusto
if (document.getElementById('header-root')) {
    initToday();
}
