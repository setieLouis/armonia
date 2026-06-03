/**
 * acqua.js: Logic for the Acqua component
 */

async function initAcqua() {
    console.log("Inizializzazione Acqua...");

    // UI Elements
    const headerRoot = document.getElementById('acq-header-root');
    const btnSave = document.getElementById('acq-btn-save');
    
    // Form Elements
    const enabledInput = document.getElementById('acq-water-enabled');
    const goalInput = document.getElementById('acq-water-goal');
    const freqSelect = document.getElementById('acq-water-frequency');
    const startInput = document.getElementById('acq-water-start');
    const endInput = document.getElementById('acq-water-end');

    // 1. Initialize Header
    if (headerRoot && typeof window.initHeader === 'function') {
        window.initHeader(headerRoot, {
            left: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
            center: "Acqua",
            right: "", 
            onLeftClick: () => window.navigateTo('today')
        });
    }

    // 2. Load Current Settings
    const settings = await window.localDB.getUserData('water_settings') || { 
        enabled: true, 
        goal: 2000,
        frequency: 120,
        startTime: "08:00",
        endTime: "22:00"
    };

    enabledInput.checked = settings.enabled;
    goalInput.value = settings.goal;
    freqSelect.value = settings.frequency;
    startInput.value = settings.startTime;
    endInput.value = settings.endTime;

    // 3. Save Logic
    btnSave.onclick = async () => {
        const newSettings = {
            enabled: enabledInput.checked,
            goal: parseInt(goalInput.value) || 2000,
            frequency: parseInt(freqSelect.value),
            startTime: startInput.value,
            endTime: endInput.value
        };

        try {
            await window.localDB.saveWaterSettings(newSettings);
            
            // Feedback visivo immediato
            btnSave.innerText = "Salvataggio...";
            btnSave.style.opacity = "0.7";
            
            setTimeout(() => {
                btnSave.innerText = "Impostazioni Salvate! ✅";
                btnSave.style.backgroundColor = "#4A7856";
                
                setTimeout(() => {
                    btnSave.innerText = "Salva Impostazioni";
                    btnSave.style.backgroundColor = "";
                    btnSave.style.opacity = "1";
                }, 2000);
            }, 500);

            // Se l'utente ha attivato le notifiche, chiediamo il permesso se non c'è
            if (newSettings.enabled && window.notificationService) {
                const status = await window.notificationService.checkPermission();
                if (status === 'default') {
                    await window.notificationService.requestPermission();
                }
            }

        } catch (error) {
            console.error("Errore nel salvataggio impostazioni:", error);
            alert("Errore durante il salvataggio.");
        }
    };
}

window.initAcqua = initAcqua;
