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

    /**
     * Transforms generate.json data into the DB schema
     */
    function transformGenerateData(data) {
        // Handle both object with weekPlan and direct array
        const plan = (data && data.weekPlan) ? data.weekPlan : (Array.isArray(data) ? data : null);

        if (!plan) {
            console.warn("Welcome: generate.json non ha la struttura attesa (weekPlan o array mancante).");
            return [];
        }

        const daysMap = {
            "Lunedì": 0, "Martedì": 1, "Mercoledì": 2, "Giovedì": 3,
            "Venerdì": 4, "Sabato": 5, "Domenica": 6
        };

        const baseDate = new Date("2026-05-18T08:00:00.000Z");

        return plan.map(dayPlan => {
            const dayOffset = daysMap[dayPlan.day] || 0;
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + dayOffset);

            return {
                day: currentDay.toISOString().split('T')[0],
                meals: dayPlan.meals.map((meal, index) => ({
                    id: `${dayPlan.day.toLowerCase()}-${index}-${Date.now()}`,
                    label: meal.label,
                    dishes: meal.dishes.map(dish => ({
                        ...dish,
                        use: true,
                        alternatives: dish.alternatives || []
                    }))
                }))
            };
        });
    }

    /**
     * Reads generate.json and SAVES it to DB
     */
    async function readAndInitPlan() {
        try {
            console.log("Welcome: Tentativo di caricamento generate.json...");
            const response = await fetch('generate.json');
            if (!response.ok) throw new Error(`Impossibile trovare generate.json (Status: ${response.status})`);
            
            const data = await response.json();
            console.log("Welcome: generate.json caricato, trasformazione in corso...");
            transformedPlan = transformGenerateData(data);
            
            if (transformedPlan.length > 0 && window.localDB) {
                console.log("Welcome: Inizio salvataggio piano nel DB...");
                for (const dayData of transformedPlan) {
                    await window.localDB.saveMeal(dayData);
                }
                console.log('Welcome: Fase 1 completata! Piano salvato nel DB locale.');
                
                isPlanUploaded = true;
                checkStartButtonVisibility();
                
                // Feedback UI
                if (btnImport) {
                    btnImport.innerHTML = '<span class="wel__icon wel__icon--pdf"></span> Piano pre-caricato';
                    btnImport.classList.add('is-uploaded');
                }
            } else {
                console.warn("Welcome: Nessun piano trasformato o localDB non disponibile.");
            }
        } catch (error) {
            console.error('Welcome Error (Phase 1):', error);
        }
    }

    // Inizializzazione Componente
    const init = async () => {
        // Aspettiamo un attimo che Dexie sia pronto se necessario
        if (!window.db) {
            console.warn("Welcome: Database non trovato in window.db, riprovo tra 100ms...");
            setTimeout(init, 100);
            return;
        }

        try {
            await window.db.open();
            console.log("Welcome: Connessione DB stabilita.");
            await readAndInitPlan();
        } catch (err) {
            console.error("Welcome: Errore durante l'apertura del DB nell'init:", err);
        }
    };

    // Modal logic functions
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

    // Event Listeners
    if (btnImport) btnImport.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    if (btnModalSave) {
        btnModalSave.addEventListener('click', () => {
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
            if (e.target.files.length > 0) {
                btnBrowse.textContent = 'Caricato';
                btnBrowse.classList.add('is-uploaded');
                if (btnModalSave) btnModalSave.classList.add('is-visible');
            }
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', async () => {
            const name = userNameInput.value.trim();
            if (name && window.localDB) {
                try {
                    await window.localDB.saveUserData('profile', { name });
                    console.log(`Profilo salvato per: ${name}`);
                    if (window.navigateTo) window.navigateTo('today');
                } catch (err) {
                    console.error("Errore salvataggio profilo:", err);
                }
            }
        });
    }

    // Start initialization
    init();
    console.log("Welcome component loaded.");
})();
