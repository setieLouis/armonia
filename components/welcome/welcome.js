/**
 * welcome.js: Logic for the Welcome component
 */

(function() {
    const btnImport = document.getElementById('btn-import');
    const btnStart = document.getElementById('btn-start');
    const btnBrowse = document.getElementById('btn-browse');
    const modal = document.getElementById('modal-import');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.querySelector('.wel-modal__overlay');
    const btnModalSave = document.getElementById('btn-modal-save');
    const fileInput = document.getElementById('file-input');
    const userNameInput = document.getElementById('user-name');
    const weeksDisplay = document.getElementById('weeks-display');
    const weeksMinus = document.getElementById('weeks-minus');
    const weeksPlus = document.getElementById('weeks-plus');
    const weeksUnit = document.querySelector('.wel-modal__counter-unit');

    let currentWeeks = 1;
    let isPlanUploaded = false;
    let transformedPlan = [];
    let rawImportedData = null; // Memorizziamo il JSON grezzo per poterlo ri-trasformare se cambiano le settimane

    /**
     * Transforms imported JSON data into the DB schema for N weeks
     */
    function transformGenerateData(data, numWeeks) {
        const planTemplate = (data && data.weekPlan) ? data.weekPlan : (Array.isArray(data) ? data : null);

        if (!planTemplate) {
            console.warn("Welcome: Il JSON caricato non ha la struttura attesa.");
            return [];
        }

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

        // Generiamo i dati per il numero di settimane richiesto
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
                        dishes: meal.dishes.map(dish => ({
                            ...dish,
                            use: false,
                            alternatives: dish.alternatives || []
                        }))
                    }))
                });
            });
        }

        return fullPlan;
    }

    /**
     * Process the imported JSON data
     */
    function processImportedData(jsonData) {
        console.log(`Welcome: Elaborazione JSON importato per ${currentWeeks} settimane...`);
        rawImportedData = jsonData;
        transformedPlan = transformGenerateData(jsonData, currentWeeks);
        
        if (transformedPlan.length > 0) {
            console.log(`Welcome: Piano ${currentWeeks} settimane generato con successo.`);
            isPlanUploaded = true;
            checkStartButtonVisibility();
            
            if (btnImport) {
                btnImport.innerHTML = '<span class="wel__icon wel__icon--pdf"></span> Piano importato';
                btnImport.classList.add('is-uploaded');
            }
        }
    }

    // Inizializzazione Componente
    const init = async () => {
        if (!window.db) {
            setTimeout(init, 100);
            return;
        }

        try {
            await window.db.open();
            console.log("Welcome: Connessione DB stabilita.");
        } catch (err) {
            console.error("Welcome: Errore apertura DB:", err);
        }
    };

    const openModal = () => modal.classList.add('is-active');
    const closeModal = () => modal.classList.remove('is-active');

    const checkStartButtonVisibility = () => {
        const name = userNameInput ? userNameInput.value.trim() : "";
        if (name !== "" && isPlanUploaded) {
            btnStart.classList.add('is-visible');
        } else {
            btnStart.classList.remove('is-visible');
        }
    };

    const updateWeeksDisplay = () => {
        if (weeksDisplay) weeksDisplay.textContent = currentWeeks;
        if (weeksUnit) weeksUnit.textContent = currentWeeks === 1 ? 'settimana' : 'settimane';
    };

    if (btnImport) btnImport.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    if (btnModalSave) {
        btnModalSave.addEventListener('click', () => {
            // Se cambiano le settimane, rigeniamo il piano se abbiamo già caricato un file
            if (rawImportedData) {
                processImportedData(rawImportedData);
            }
            isPlanUploaded = true;
            checkStartButtonVisibility();
            closeModal();
        });
    }

    if (userNameInput) {
        userNameInput.addEventListener('input', checkStartButtonVisibility);
    }

    if (weeksMinus) {
        weeksMinus.addEventListener('click', () => {
            if (currentWeeks > 1) { currentWeeks--; updateWeeksDisplay(); }
        });
    }

    if (weeksPlus) {
        weeksPlus.addEventListener('click', () => {
            if (currentWeeks < 12) { currentWeeks++; updateWeeksDisplay(); }
        });
    }

    if (btnBrowse) btnBrowse.addEventListener('click', () => fileInput.click());

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        processImportedData(jsonData);
                        
                        btnBrowse.textContent = 'Caricato';
                        btnBrowse.classList.add('is-uploaded');
                        if (btnModalSave) btnModalSave.classList.add('is-visible');
                    } catch (err) {
                        console.error("Errore nel parsing del file JSON:", err);
                        alert("Il file caricato non è un JSON valido.");
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', async () => {
            const name = userNameInput.value.trim();
            if (name && window.localDB) {
                try {
                    await window.localDB.saveUserData('profile', { name });
                    if (transformedPlan.length > 0) {
                        for (const dayData of transformedPlan) {
                            await window.localDB.saveMeal(dayData);
                        }
                        console.log(`Welcome: Piano di ${currentWeeks} settimane salvato nel DB locale.`);
                    }
                    if (window.navigateTo) window.navigateTo('today');
                } catch (err) {
                    console.error("Errore durante il salvataggio dei dati:", err);
                }
            }
        });
    }

    init();
    console.log("Welcome component loaded.");
})();
