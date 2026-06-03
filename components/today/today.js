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

    // Step 4.5: Caricamento Water Tracker
    const waterRoot = document.getElementById('water-root');
    if (waterRoot && window.localDB) {
        // Controllo azioni da URL (es. da notifica)
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        if (action === 'add-water') {
            await window.localDB.addWater(dateId);
            // Pulisci l'URL per evitare ripetizioni al refresh
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[&?]action=add-water/, ''));
        } else if (action === 'snooze-water') {
            const settings = await window.localDB.getUserData('water_settings') || {};
            settings.snoozeUntil = Date.now() + (15 * 60000); // 15 minuti
            await window.localDB.saveWaterSettings(settings);
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[&?]action=snooze-water/, ''));
        }

        const updateWaterUI = async () => {
            const data = await window.localDB.getWaterIntake(dateId);
            const percentage = Math.min(100, (data.amount / data.goal) * 100);
            
            waterRoot.innerHTML = `
                <div class="water-card" style="margin: 16px; padding: 16px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 20px;">💧</span>
                            <span style="font-weight: 600; color: #333;">Idratazione</span>
                        </div>
                        <span style="font-size: 14px; color: #666;">${data.amount} / ${data.goal} ml</span>
                    </div>
                    <div style="height: 8px; background: #e0f2f1; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
                        <div style="height: 100%; width: ${percentage}%; background: #4fc3f7; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #666; font-size: 14px;">${data.glasses} bicchieri</div>
                        <button id="add-water-btn" style="background: #4fc3f7; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                            + 250ml
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('add-water-btn').onclick = async () => {
                await window.localDB.addWater(dateId);
                updateWaterUI();
                
                // Chiediamo il permesso per le notifiche se non l'abbiamo ancora
                if (window.notificationService) {
                    const status = await window.notificationService.checkPermission();
                    if (status === 'default') {
                        await window.notificationService.requestPermission();
                    }
                }
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
