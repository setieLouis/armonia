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
    const fileInput = document.getElementById('file-input');
    const userNameInput = document.getElementById('user-name');

    // Modal logic
    const openModal = () => {
        modal.classList.add('is-active');
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
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

    // Trigger file input
    if (btnBrowse) {
        btnBrowse.addEventListener('click', () => {
            fileInput.click();
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
