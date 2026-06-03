// today.js: Orchestrator for Today sub-components

async function initToday(navData = null) {
    console.log("Inizializzazione sub-componenti Today con navData:", navData);

    // Caricamento dati tramite DataService
    let currentDayMeals;
    let todayData;
    let userProfile;
    
    // Gestione della data: parametro o fallback odierno
    const dateId = (navData && typeof navData === 'object' && navData.dateId) 
        ? navData.dateId 
        : new Date().toISOString().split('T')[0];

    try {
        // Carichiamo i pasti dal servizio centralizzato passando il dateId
        currentDayMeals = await window.dataService.loadData(dateId);
        
        // Per oggi_data.json (altre info statiche)
        const dataRes = await fetch('components/today/today_data.json');
        todayData = await dataRes.json();

        // Recupero profilo utente dal DB
        if (window.localDB) {
            userProfile = await window.localDB.getUserData('profile');
        }
    } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        return;
    }

    const userName = (userProfile && userProfile.name) ? userProfile.name : "";
    const headerLeftValue = userName ? `Ciao, ${userName}` : "Ciao";
    
    // Step 2: Caricamento Menu
    const menuRoot = document.getElementById('menu-root');
    if (menuRoot) {
        await loadComponent('menu-root', 'components/menu/menu.html', async (element) => {
            if (typeof window.initMenu !== 'function') {
                await loadScript('components/menu/menu.js');
            }
            window.initMenu(element);
        });
    }

    // Step 3: Caricamento Header
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        // Usiamo l'icona di default (hamburger) definita in header.js
        window.initHeader(headerRoot, { 
            left: headerLeftValue,
            onRightClick: () => {
                if (window.openMenu) window.openMenu();
            }
        });
    }
// Step 4: Caricamento Calendario
await loadComponent('calendar-root', 'components/calendar/calendar.html', async (element) => {
    if (typeof window.initCalendar !== 'function') {
        await loadScript('components/calendar/calendar.js');
    }

    // Il componente calendario è ora autonomo: gli passiamo solo la data target
    window.initCalendar(element, dateId);
});

    // Step 4: Caricamento Progress bar
    const progressRoot = document.getElementById('progress-root');
    if (progressRoot) {
        if (typeof window.initProgress !== 'function') {
            await loadScript('components/progress/progress.js');
        }

        // Funzione per aggiornare la progress bar
        const updateProgressBar = () => {
            const percentage = window.dataService.calculateProgress();
            
            let message = "";
            if (percentage >= 100) message = "Giornata completata! Bravissima! 🎉";
            else if (percentage >= 90) message = "Ultimo sforzo, ci sei quasi! 🔥";
            else if (percentage >= 80) message = "Quasi tutto completato! 🌟";
            else if (percentage >= 70) message = "Ottimo lavoro! Manca poco! 🌱";
            else if (percentage >= 60) message = "Superato il 60%! Continua così! 🌿";
            else if (percentage >= 50) message = "Metà giornata superata! Grandiosa! ⚡";
            else if (percentage >= 40) message = "Ti stai avvicinando alla metà! 🌤️";
            else if (percentage >= 30) message = "Un terzo del percorso è andato! ✨";
            else if (percentage >= 20) message = "Stai prendendo il ritmo giusto! 💃";
            else if (percentage >= 10) message = "Il primo passo è fatto! Dai! 🚀";
            else message = "Inizia la tua giornata con energia! ☕";

            window.initProgress(progressRoot, {
                label: "Giornata completata",
                percentage: percentage,
                message: message
            });
        };

        // Inizializzazione
        updateProgressBar();

        // Iscrizione ai cambiamenti per aggiornare in tempo reale
        window.dataService.subscribe(() => {
            updateProgressBar();
            // Aggiorniamo anche la lista pasti se visibile
            if (window.updateMeals) window.updateMeals(window.dataService.getMeals());
        });
    }

    // Step 5: Caricamento Lista Pasti
    await loadComponent('meals-root', 'components/meals/meals.html', async (element) => {
        if (typeof window.initMeals !== 'function') {
            await loadScript('components/meals/meals.js');
        }
        // Se non ci sono pasti, passiamo un array vuoto
        window.initMeals(element, currentDayMeals ? currentDayMeals.meals : []);
    });
}

// Orchestration is handled via navigateTo -> initToday
window.initToday = initToday;
