// today.js: Orchestrator for Today sub-components

async function initToday() {
    console.log("Inizializzazione sub-componenti Today...");

    // Caricamento dati da JSON
    let currentDayMeals;
    let todayData;

    try {
        const [mealsRes, dataRes] = await Promise.all([
            fetch('components/today/today_meals.json'),
            fetch('components/today/today_data.json')
        ]);
        currentDayMeals = await mealsRes.json();
        todayData = await dataRes.json();
    } catch (error) {
        console.error("Errore nel caricamento dei dati JSON:", error);
        return;
    }

    const headerLeftValue = todayData.user.greeting;
    const headerRightValue = `<svg class="icon-leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21V11M12 11C12 11 9 7 5 7C5 7 5 11 9 13C10.5 13.75 12 11 12 11ZM12 11C12 11 15 5 19 5C19 5 20 10 16 12C14.5 12.75 12 11 12 11Z" stroke="#719b6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

    // Step 2: Caricamento Header
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        window.initHeader(headerRoot, { left: headerLeftValue, right: headerRightValue });
    }

    // Step 3: Caricamento Calendario
    await loadComponent('calendar-root', 'components/calendar/calendar.html', async (element) => {
        if (typeof window.initCalendar !== 'function') {
            await loadScript('components/calendar/calendar.js');
        }

        // Generazione dinamica dati calendario basata su currentDayMeals.day
        const targetDate = new Date(currentDayMeals.day);
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        const fullDayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

        const dateData = {
            dayName: fullDayNames[targetDate.getDay()],
            dateFull: `${targetDate.getDate()} ${months[targetDate.getMonth()]}`
        };

        // Calcolo della vista settimanale (centrata sulla data corrente)
        const days = [];
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay()); // Inizio Domenica

        for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek);
            current.setDate(startOfWeek.getDate() + i);
            days.push({
                label: dayNames[current.getDay()],
                number: current.getDate(),
                active: current.toDateString() === targetDate.toDateString()
            });
        }

        window.initCalendar(element, { dateData, days });
    });

    // Step 4: Caricamento Lista Pasti
    await loadComponent('meals-root', 'components/meals/meals.html', async (element) => {
        if (typeof window.initMeals !== 'function') {
            await loadScript('components/meals/meals.js');
        }
        window.initMeals(element, currentDayMeals.meals);
    });

    // Step 5: Caricamento Progress bar
    const progressRoot = document.getElementById('progress-root');
    if (progressRoot) {
        if (typeof window.initProgress !== 'function') {
            await loadScript('components/progress/progress.js');
        }

        // Calcolo progresso reale
        let totalDishes = 0;
        let completedDishes = 0;

        currentDayMeals.meals.forEach(meal => {
            totalDishes += meal.dishes.length;
            completedDishes += meal.dishes.filter(d => d.use).length;
        });

        const percentage = totalDishes > 0 ? Math.round((completedDishes / totalDishes) * 100) : 0;
        
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
    }
}

// Chiamiamo l'inizializzazione se siamo nel contesto giusto
if (document.getElementById('header-root')) {
    initToday();
}
