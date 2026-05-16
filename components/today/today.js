// today.js: Orchestrator for Today sub-components

headerLeftValue = "Ciao, Eli"
const headerRightValue = `<svg class="icon-leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21V11M12 11C12 11 9 7 5 7C5 7 5 11 9 13C10.5 13.75 12 11 12 11ZM12 11C12 11 15 5 19 5C19 5 20 10 16 12C14.5 12.75 12 11 12 11Z" stroke="#719b6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`




async function initToday() {
    console.log("Inizializzazione sub-componenti Today...");
    
    // Step 2: Caricamento Header (Approccio Render)
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        window.initHeader(headerRoot,{left:headerLeftValue,rigth : headerRightValue });
    }

    // Step 3: Caricamento Calendario (che include la data)
    await loadComponent('calendar-root', 'components//calendar/calendar.html');

    // Step 4: Caricamento Lista Pasti
    await loadComponent('meals-root', 'components/meals/meals.html', async (element) => {
        // Carichiamo il JS specifico del componente se non è già presente
        if (typeof window.initMeals !== 'function') {
            await loadScript('components/meals/meals.js');
        }
        window.initMeals(element);
    });

    // Step 5: Caricamento Progress bar
    await loadComponent('progress-root', 'components/progress/progress.html');
}

// Chiamiamo l'inizializzazione se siamo nel contesto giusto
if (document.getElementById('header-root')) {
    initToday();
}
