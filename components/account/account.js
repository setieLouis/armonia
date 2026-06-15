/**
 * account.js: Logic for the Account component
 */

async function initAccount() {
    console.log("initAccount: start");

    // UI Elements
    const headerRoot = document.getElementById('acc-header-root');
    const nameEl = document.getElementById('acc-name-value');
    const uidEl = document.getElementById('acc-uid-value');
    const fcmEl = document.getElementById('acc-fcm-value');
    const copyBtns = document.querySelectorAll('.acc-copy-btn');

    // 1. Initialize Header
    if (headerRoot) {
        console.log("initAccount: initializing header");
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        window.initHeader(headerRoot, {
            left: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
            center: "Account",
            right: "", 
            onLeftClick: () => window.navigateTo('today')
        });
    }

    // 2. Load User Data
    if (window.localDB) {
        try {
            const profile = await window.localDB.getUserData('profile');
            if (profile) {
                nameEl.innerText = profile.name || "N/A";
                uidEl.innerText = profile.uid || "N/A";
                fcmEl.innerText = profile.fcmToken || "Token non disponibile";
            } else {
                console.warn("Account: Profilo non trovato nel database.");
            }
        } catch (error) {
            console.error("Account: Errore nel recupero del profilo:", error);
        }
    }

    // 3. Copy to Clipboard Logic
    copyBtns.forEach(btn => {
        btn.onclick = () => {
            const targetId = btn.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = btn.innerText;
                btn.innerText = "✅";
                setTimeout(() => {
                    btn.innerText = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error("Errore nella copia:", err);
            });
        };
    });
}

window.initAccount = initAccount;
