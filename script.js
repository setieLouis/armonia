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
            element.innerHTML = html;
            if (initFunc && typeof initFunc === 'function') {
                await initFunc(element);
            }
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
    console.log(`Navigating to: ${view}`, data);
    const appRoot = 'app-root';

     if (view === 'welcome') {
        await loadComponent(appRoot, 'components/welcome/welcome.html', async () => {
            await loadScript('components/welcome/welcome.js');
        });
    } 
    
   else if (view === 'today') {
        await loadComponent(appRoot, 'components/today/today.html', async () => {
            await loadScript('components/today/today.js');
            const navData = data || { dateId: new Date().toISOString().split('T')[0] };
            if (window.initToday) await window.initToday(navData);
        });
    } 
    else if (view === 'current-meal') {
        await loadComponent(appRoot, 'components/current-meal/current-meal.html', async () => {
            await loadScript('components/current-meal/current-meal.js');
            if (window.initCurrentMeal) await window.initCurrentMeal(data);
        });
    }
    else if (view === 'ingredient') {
        await loadComponent(appRoot, 'components/ingredient/ingredient.html', async () => {
            await loadScript('components/ingredient/ingredient.js');
            if (window.initIngredientAlternatives) await window.initIngredientAlternatives(data);
        });
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
