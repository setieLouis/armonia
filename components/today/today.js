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

            document.getElementById('add-water-btn').onclick = async () => {
                await window.localDB.addWater(dateId);
                if (window.dataService) await window.dataService.syncWaterStatus(dateId);
                updateWaterUI();
            };
        };
        await updateWaterUI();
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
