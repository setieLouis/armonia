/**
 * calendar.js: Componente Calendario autonomo.
 * Riceve una data e genera automaticamente la settimana e i metadati.
 * Supporta la funzionalità di Switch Day tramite long press.
 */

async function initCalendar(container, targetDateInput = null) {
    // 1. Elaborazione Date (Logica interna autonoma)
    const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    // Generazione della riga settimanale
    const days = [];
    const dayOfWeek = targetDate.getDay();
    // Calcoliamo la differenza per arrivare al Lunedì (se è Domenica, torniamo indietro di 6 giorni)
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(diffToMonday);

    for (let i = 0; i < 7; i++) {
        const current = new Date(startOfWeek);
        current.setDate(startOfWeek.getDate() + i);
        
        days.push({
            label: dayNames[current.getDay()],
            number: current.getDate(),
            dateId: current.toISOString().split('T')[0],
            active: current.toDateString() === targetDate.toDateString()
        });
    }

    // 2. Helper per renderizzare il singolo giorno
    function renderCalendarDay(day) {
        return `
            <div class="calendar-day ${day.active ? 'active' : ''}" 
                 data-date="${day.dateId}"
                 data-label="${day.label} ${day.number}"
                 style="cursor: pointer; user-select: none; -webkit-user-select: none;">
                <span class="day-label">${day.label}</span>
                <span class="day-number">${day.number}</span>
            </div>
        `;
    }

    // 3. Render principale delle tessere
    const daysRoot = container.querySelector('#calendar-days-root');

    if (daysRoot) {
        daysRoot.innerHTML = days.map(day => renderCalendarDay(day)).join('');
        setupCalendarInteractions(daysRoot, days);
    }
}

// 4. Gestione Interazioni: Click e Long Press
function setupCalendarInteractions(daysRoot, days) {
    let timer;
    let isLongPressTriggered = false;
    let targetDayTile = null;

    const start = (e) => {
        const tile = e.target.closest('.calendar-day');
        if (!tile) return;

        targetDayTile = tile;
        isLongPressTriggered = false;

        timer = setTimeout(() => {
            isLongPressTriggered = true;
            
            // Feedback visivo immediato (leggero restringimento)
            tile.style.transform = 'scale(0.94)';
            tile.style.transition = 'transform 0.1s ease';

            // Vibrazione se supportata
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // Ritardo minimo per mostrare l'effetto di pressione e aprire il modal
            setTimeout(() => {
                const dateId = tile.getAttribute('data-date');
                const label = tile.getAttribute('data-label');
                openCalendarSwapModal(dateId, label, days);
                tile.style.transform = '';
            }, 120);
        }, 600); // 600ms per attivare il long press
    };

    const cancel = (e) => {
        clearTimeout(timer);
        if (targetDayTile && !isLongPressTriggered) {
            targetDayTile.style.transform = '';
        }
    };

    // Ascolto eventi per inizio e fine touch/mouse
    daysRoot.addEventListener('mousedown', start);
    daysRoot.addEventListener('touchstart', start, { passive: true });
    daysRoot.addEventListener('mouseup', cancel);
    daysRoot.addEventListener('mouseleave', cancel);
    daysRoot.addEventListener('touchend', cancel);
    daysRoot.addEventListener('touchmove', cancel);

    // Intercettazione del click
    daysRoot.addEventListener('click', (e) => {
        const tile = e.target.closest('.calendar-day');
        if (!tile) return;

        if (isLongPressTriggered) {
            // Se è scattato il long press, blocchiamo la navigazione standard
            e.stopImmediatePropagation();
            e.preventDefault();
            isLongPressTriggered = false;
            return;
        }

        // Navigazione standard
        const dateId = tile.getAttribute('data-date');
        console.log('Day selected:', dateId);
        navigateTo('today', { dateId });
    });
}

// 5. Funzione globale per aprire il Modal di Scambio
async function openCalendarSwapModal(sourceDateId, sourceLabel, allDays) {
    const modal = document.getElementById('calendar-swap-modal');
    const sourceDaySpan = document.getElementById('cal-swap-source-day');
    const optionsList = document.getElementById('cal-swap-options');

    if (!modal || !sourceDaySpan || !optionsList) return;

    sourceDaySpan.innerText = sourceLabel;

    // Filtriamo i giorni della settimana escludendo il giorno sorgente stesso
    const otherDays = allDays.filter(d => d.dateId !== sourceDateId);

    optionsList.innerHTML = '';

    for (const day of otherDays) {
        const optionCard = document.createElement('div');
        optionCard.className = 'cal-swap-option-card';
        optionCard.setAttribute('data-target-date', day.dateId);

        optionCard.innerHTML = `
            <div class="cal-swap-option-content">
                <span class="cal-swap-option-name">${day.label} ${day.number}</span>
                <span class="cal-swap-option-preview" id="swap-preview-${day.dateId}">Caricamento pasti...</span>
            </div>
            <span class="cal-swap-option-icon">🔄</span>
        `;

        optionsList.appendChild(optionCard);

        // Caricamento asincrono dell'anteprima dei pasti dal DB locale
        if (window.localDB) {
            window.localDB.getMeal(day.dateId).then(mealData => {
                const previewEl = document.getElementById(`swap-preview-${day.dateId}`);
                if (previewEl) {
                    if (mealData && mealData.meals && mealData.meals.length > 0) {
                        const summary = mealData.meals
                            .map(m => {
                                const dishesNames = m.dishes.map(d => d.name).join(', ');
                                return `${m.label}: ${dishesNames}`;
                            })
                            .filter(Boolean)
                            .join(' • ');

                        const maxLength = 60;
                        previewEl.innerText = summary.length > maxLength 
                            ? summary.substring(0, maxLength) + '...'
                            : summary;
                    } else {
                        previewEl.innerText = "Nessun pasto pianificato";
                    }
                }
            }).catch(err => {
                console.warn(`Errore nel caricamento anteprima pasto per ${day.dateId}`, err);
                const previewEl = document.getElementById(`swap-preview-${day.dateId}`);
                if (previewEl) previewEl.innerText = "Nessun pasto pianificato";
            });
        }

        // Click handler su ciascuna card opzione
        optionCard.addEventListener('click', async () => {
            const targetDateId = optionCard.getAttribute('data-target-date');
            await executeDaySwap(sourceDateId, targetDateId);
        });
    }

    // Mostriamo il modal inserendo la classe attiva
    modal.classList.add('is-active');
}

// 6. Funzione globale per chiudere il Modal
function closeCalendarSwapModal() {
    const modal = document.getElementById('calendar-swap-modal');
    if (modal) {
        modal.classList.remove('is-active');
    }
}

// 7. Funzione asincrona interna per eseguire lo scambio dei dati
async function executeDaySwap(dateIdA, dateIdB) {
    console.log(`[Calendar] Esecuzione scambio dati tra ${dateIdA} e ${dateIdB}...`);
    
    if (!window.localDB) {
        console.error("LocalDB non disponibile.");
        return;
    }

    try {
        // Caricamento dei pasti del giorno A e del giorno B
        const mealA = await window.localDB.getMeal(dateIdA);
        const mealB = await window.localDB.getMeal(dateIdB);

        const mealsA = mealA ? mealA.meals : [];
        const mealsB = mealB ? mealB.meals : [];

        // Scambio dell'array dei pasti, preservando gli ID delle date e le altre info
        const updatedMealA = {
            ...(mealA || {}),
            day: dateIdA,
            meals: mealsB
        };

        const updatedMealB = {
            ...(mealB || {}),
            day: dateIdB,
            meals: mealsA
        };

        // Salvataggio nel database locale Dexie
        await window.localDB.saveMeal(updatedMealA);
        await window.localDB.saveMeal(updatedMealB);

        console.log(`[Calendar] Scambio completato con successo nel database.`);

        // Chiudiamo il modal
        closeCalendarSwapModal();

        // Aggiorniamo lo stato dell'applicazione
        const currentViewDay = window.dataService.currentDay;
        
        // Se la giornata correntemente visualizzata corrisponde a uno dei due giorni scambiati,
        // ricarichiamo i pasti correnti e notifichiamo tutti i listener per aggiornare la UI
        if (currentViewDay === dateIdA || currentViewDay === dateIdB) {
            window.dataService.isLoaded = false; // Forza l'invalidazione della cache locale per caricare i dati aggiornati
            await window.dataService.loadData(currentViewDay);
            window.dataService.notifyListeners();
        }

    } catch (error) {
        console.error("Errore durante lo scambio dei pasti:", error);
        alert("Si è verificato un errore durante lo scambio dei pasti.");
    }
}

// Esposizione globale delle funzioni
window.initCalendar = initCalendar;
window.openCalendarSwapModal = openCalendarSwapModal;
window.closeCalendarSwapModal = closeCalendarSwapModal;

