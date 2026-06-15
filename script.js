/**
 * Core script for loading components and managing navigation
 */

async function loadComponent(id, path, initFunc = null) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(id);
        if (element) {
            console.log(`loadComponent: found element #${id}, injecting HTML`);
            element.innerHTML = html;
            if (initFunc && typeof initFunc === 'function') {
                await initFunc(element);
            }
        } else {
            console.error(`loadComponent: element #${id} NOT found!`);
        }
    } catch (error) {
        console.error(`Errore nel caricamento del componente ${id}:`, error);
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            console.log(`Script already loaded: ${src}`);
            return resolve();
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Global navigation function
async function navigateTo(view, data = null) {
    console.log(`[Router] Navigating to: ${view}`, data);
    
    if (window.firebaseAnalytics) {
        window.firebaseAnalytics.logEvent('screen_view', {
            screen_name: view,
            app_name: 'ArmoniaFlow'
        });
    }

    const appRoot = 'app-root';
    
    try {
        switch (view) {
            case 'welcome':
                await loadComponent(appRoot, 'components/welcome/welcome.html', async () => {
                    await loadScript('components/welcome/welcome.js');
                });
                break;
            case 'today':
                await loadComponent(appRoot, 'components/today/today.html', async () => {
                    await loadScript('components/today/today.js');
                    const navData = data || { dateId: new Date().toISOString().split('T')[0] };
                    if (window.initToday) await window.initToday(navData);
                });
                break;
            case 'current-meal':
                await loadComponent(appRoot, 'components/current-meal/current-meal.html', async () => {
                    await loadScript('components/current-meal/current-meal.js');
                    if (window.initCurrentMeal) await window.initCurrentMeal(data);
                });
                break;
            case 'ingredient':
                await loadComponent(appRoot, 'components/ingredient/ingredient.html', async (element) => {
                    await loadScript('components/ingredient/ingredient.js');
                    if (window.initIngredientAlternatives) await window.initIngredientAlternatives(data);
                });
                break;
            case 'diet-update':
                await loadComponent(appRoot, 'components/diet-update/diet-update.html', async (element) => {
                    await loadScript('components/diet-update/diet-update.js');
                    if (window.initDietUpdate) await window.initDietUpdate();
                });
                break;
            case 'features-info':
                await loadComponent(appRoot, 'components/features-info/features-info.html', async (element) => {
                    await loadScript('components/features-info/features-info.js');
                    if (window.initFeaturesInfo) await window.initFeaturesInfo();
                });
                break;
            case 'acqua':
                await loadComponent(appRoot, 'components/acqua/acqua.html', async (element) => {
                    await loadScript('components/acqua/acqua.js');
                    if (window.initAcqua) await window.initAcqua();
                });
                break;
            case 'account':
                console.log("[Router] Case account detected");
                await loadComponent(appRoot, 'components/account/account.html', async (element) => {
                    console.log("[Router] Account HTML loaded");
                    await loadScript('components/account/account.js');
                    console.log("[Router] Account script loaded");
                    if (window.initAccount) {
                        await window.initAccount();
                    } else {
                        console.error("[Router] initAccount not found!");
                    }
                });
                break;
            default:
                console.warn(`[Router] View not found: ${view}`);
        }
    } catch (err) {
        console.error(`[Router] Error navigating to ${view}:`, err);
    }
}

/**
 * Checks if a user profile exists to decide the initial view
 */
async function checkUserSession() {
    try {
        // Ensure database is available and open
        if (window.db) {
            await window.db.open();
            if (window.localDB) {
                const profile = await window.localDB.getUserData('profile');
                if (profile && profile.name) {
                    console.log(`Session: Welcome back, ${profile.name}!`);
                    await navigateTo('today');
                    return;
                }
            }
        }
    } catch (err) {
        console.warn("Session: Database check skipped or failed", err);
    }
    
    // Fallback to welcome if no profile or DB error
    console.log("Session: No active profile found, starting with Welcome.");
    await navigateTo('welcome');
}

window.loadComponent = loadComponent;
window.loadScript = loadScript;
window.navigateTo = navigateTo;

document.addEventListener('DOMContentLoaded', () => {
    // Start notification service if available
    if (window.notificationService) {
        window.notificationService.startWaterReminder();
    }

    // Handle PWA shortcuts or deep links
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    
    if (view) {
        navigateTo(view);
    } else {
        checkUserSession();
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.error('Service Worker registration failed', err));
        });
    }
});
