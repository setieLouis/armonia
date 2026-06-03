/**
 * diet-update.js: Logic for the Diet Update component with conflict detection
 */

async function initDietUpdate() {
    console.log("Inizializzazione Diet Update...");

    // Elementi UI
    const btnBrowse = document.getElementById('diu-btn-browse');
    const fileInput = document.getElementById('diu-file-input');
    const btnSave = document.getElementById('diu-btn-save');
    const statusText = document.getElementById('diu-status-text');
    const weeksDisplay = document.getElementById('diu-weeks-display');
    const weeksMinus = document.getElementById('diu-weeks-minus');
    const weeksPlus = document.getElementById('diu-weeks-plus');
    
    // Modal Conflitto
    const modalConflict = document.getElementById('diu-modal-conflict');
    const modalClose = document.getElementById('diu-modal-close');
    const btnConfirmOverwrite = document.getElementById('diu-btn-confirm-overwrite');
    const btnCancel = document.getElementById('diu-btn-cancel');
    const conflictMsg = document.getElementById('diu-conflict-msg');

    // Modal Successo
    const modalSuccess = document.getElementById('diu-modal-success');
    const btnSuccessOk = document.getElementById('diu-btn-success-ok');

    let currentWeeks = 1;
    let rawImportedData = null;
    let transformedPlan = [];

    // 1. Inizializza Header
    const headerRoot = document.getElementById('diu-header-root');
    if (headerRoot && typeof window.initHeader === 'function') {
        window.initHeader(headerRoot, {
            left: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
            center: "Aggiorna Dieta",
            right: "", // Vuoto a destra per focus sul centro
            onLeftClick: () => window.navigateTo('today')
        });
    }

    // 2. Stato Database attuale
    async function updateStatus() {
        if (window.db) {
            const count = await window.db.meals.count();
            if (count === 0) {
                statusText.innerText = "Nessun dato presente.";
            } else {
                const days = await window.db.meals.toCollection().primaryKeys();
                const sortedDays = days.sort();
                statusText.innerText = `${count} giorni (da ${sortedDays[0]} a ${sortedDays[sortedDays.length-1]})`;
            }
        }
    }
    await updateStatus();

    // 3. Logica Trasformazione (Replicata da welcome per indipendenza)
    function transformGenerateData(data, numWeeks) {
        const planTemplate = (data && data.weekPlan) ? data.weekPlan : (Array.isArray(data) ? data : null);
        if (!planTemplate) return [];

        const daysMap = {
            "Lunedì": 0, "Martedì": 1, "Mercoledì": 2, "Giovedì": 3,
            "Venerdì": 4, "Sabato": 5, "Domenica": 6
        };

        const now = new Date();
        const dayOfWeek = now.getDay(); 
        const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const currentMonday = new Date(now.setDate(diffToMonday));
        currentMonday.setHours(8, 0, 0, 0);

        const fullPlan = [];
        for (let weekOffset = 0; weekOffset < numWeeks; weekOffset++) {
            planTemplate.forEach(dayPlan => {
                const dayOffset = daysMap[dayPlan.day];
                if (dayOffset === undefined) return;
                const targetDay = new Date(currentMonday);
                targetDay.setDate(currentMonday.getDate() + (weekOffset * 7) + dayOffset);
                fullPlan.push({
                    day: targetDay.toISOString().split('T')[0],
                    meals: dayPlan.meals.map((meal, index) => ({
                        id: `${dayPlan.day.toLowerCase()}-${weekOffset}-${index}-${Date.now()}`,
                        label: meal.label,
                        dishes: meal.dishes.map(dish => ({ ...dish, use: false, alternatives: dish.alternatives || [] }))
                    }))
                });
            });
        }
        return fullPlan;
    }

    function processImportedData() {
        if (rawImportedData) {
            transformedPlan = transformGenerateData(rawImportedData, currentWeeks);
            if (transformedPlan.length > 0) {
                btnSave.style.opacity = "1";
                btnSave.style.pointerEvents = "auto";
            }
        }
    }

    // 4. Conflict Check
    async function checkConflicts() {
        const conflictingDates = [];
        for (const item of transformedPlan) {
            const existing = await window.localDB.getMeal(item.day);
            if (existing) conflictingDates.push(item.day);
        }
        return conflictingDates;
    }

    // 5. Event Listeners UI
    btnBrowse.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    rawImportedData = JSON.parse(event.target.result);
                    btnBrowse.classList.add('is-uploaded');
                    btnBrowse.innerHTML = '<span class="wel__icon wel__icon--pdf"></span> Piano Caricato';
                    processImportedData();
                } catch (err) {
                    alert("File JSON non valido.");
                }
            };
            reader.readAsText(file);
        }
    };

    weeksMinus.onclick = () => { if (currentWeeks > 1) { currentWeeks--; weeksDisplay.innerText = currentWeeks; processImportedData(); } };
    weeksPlus.onclick = () => { if (currentWeeks < 12) { currentWeeks++; weeksDisplay.innerText = currentWeeks; processImportedData(); } };

    btnSave.onclick = async () => {
        const conflicts = await checkConflicts();
        if (conflicts.length > 0) {
            conflictMsg.innerHTML = `Attenzione! <strong>${conflicts.length} giorni</strong> del nuovo piano sovrascriveranno dati già esistenti (es. ${conflicts[0]}).<br><br>Vuoi procedere?`;
            modalConflict.classList.add('is-active');
        } else {
            await saveData();
        }
    };

    async function saveData() {
        for (const day of transformedPlan) {
            await window.localDB.saveMeal(day);
        }
        modalSuccess.classList.add('is-active');
    }

    // Modal Events
    btnSuccessOk.onclick = () => {
        modalSuccess.classList.remove('is-active');
        window.navigateTo('today');
    };

    btnConfirmOverwrite.onclick = async () => {
        modalConflict.classList.remove('is-active');
        await saveData();
    };
    btnCancel.onclick = () => modalConflict.classList.remove('is-active');
    modalClose.onclick = () => modalConflict.classList.remove('is-active');
}

window.initDietUpdate = initDietUpdate;
