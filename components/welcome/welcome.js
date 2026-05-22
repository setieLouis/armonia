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

    // Modal logic
    const openModal = () => {
        modal.classList.add('is-active');
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
    };

    const updateWeeksDisplay = () => {
        if (weeksDisplay) {
            weeksDisplay.textContent = currentWeeks;
        }
        if (weeksUnit) {
            weeksUnit.textContent = currentWeeks === 1 ? 'settimana' : 'settimane';
        }
    };

    if (btnImport) {
        btnImport.addEventListener('click', openModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    if (btnModalSave) {
        btnModalSave.addEventListener('click', () => {
            // Qui si potrebbe aggiungere logica per validare se il file è stato effettivamente caricato
            closeModal();
        });
    }

    // Counter logic
    if (weeksMinus) {
        weeksMinus.addEventListener('click', () => {
            if (currentWeeks > 1) {
                currentWeeks--;
                updateWeeksDisplay();
            }
        });
    }

    if (weeksPlus) {
        weeksPlus.addEventListener('click', () => {
            if (currentWeeks < 12) {
                currentWeeks++;
                updateWeeksDisplay();
            }
        });
    }

    // Trigger file input
    if (btnBrowse) {
        btnBrowse.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                btnBrowse.textContent = 'Caricato';
                btnBrowse.classList.add('is-uploaded');
                
                // Show the Save button
                if (btnModalSave) {
                    btnModalSave.classList.add('is-visible');
                }
                
                console.log(`File selected: ${fileName}`);
            }
        });
    }

    // Start App logic
    if (btnStart) {
        btnStart.addEventListener('click', async () => {
            const name = userNameInput.value.trim();
            if (name) {
                // Save user name to localDB (user_profile table)
                if (window.localDB) {
                    await window.localDB.saveUserData('profile', { name });
                    console.log(`User name saved: ${name}`);
                }
            }
            
            // Navigate to today view
            if (window.navigateTo) {
                window.navigateTo('today');
            }
        });
    }

    console.log("Welcome component logic initialized.");
})();
