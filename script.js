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
                    if (window.initFeaturesInfo) await window.initFeaturesInfo(data);
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
                    
                    // Controlla se l'utente ha già visto le novità di questa versione
                    const lastSeenRecord = await window.localDB.getUserData('last_seen_version');
                    const lastSeenVersion = lastSeenRecord ? lastSeenRecord.version : null;

                    if (!lastSeenVersion || lastSeenVersion !== APP_VERSION) {
                        console.log(`Session: Rilevata nuova versione (${APP_VERSION}). Navigazione a novità.`);
                        await navigateTo('features-info', { isStartup: true });
                        return;
                    }

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

    // Register Service Worker & Handle Updates
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('Service Worker registered', reg);
                    
                    // Controlla se c'è già un service worker in attesa
                    if (reg.waiting) {
                        showUpdateBanner(reg.waiting);
                    }

                    // Ascolta aggiornamenti rilevati mentre l'app è aperta
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    showUpdateBanner(newWorker);
                                }
                            }
                        });
                    });
                })
                .catch(err => console.error('Service Worker registration failed', err));
        });

        // Quando il Service Worker attivo cambia (dopo skipWaiting), ricarica la pagina
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }
});

/**
 * Mostra un banner di aggiornamento fluttuante
 */
function showUpdateBanner(worker) {
    const existingToast = document.getElementById('pwa-update-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    
    // Stile in linea per mantenere il banner isolato ed elegante
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.backgroundColor = '#FBF3E9';
    toast.style.border = '1px solid #EAD8C3';
    toast.style.color = '#9C744D';
    toast.style.padding = '14px 20px';
    toast.style.borderRadius = '20px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '16px';
    toast.style.zIndex = '99999';
    toast.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    toast.style.width = 'calc(100% - 32px)';
    toast.style.maxWidth = '400px';
    toast.style.boxSizing = 'border-box';

    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#9C744D; flex-shrink:0;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span style="font-size: 13.5px; font-weight: 600; font-family: 'Cinzel', serif; line-height: 1.3;">Nuova versione disponibile!</span>
        </div>
        <button id="pwa-update-btn" style="background: #719b6e; color: white; border: none; padding: 8px 16px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 12.5px; box-shadow: 0 4px 10px rgba(113,155,110,0.25); transition: background 0.2s, transform 0.1s; font-family: inherit;">
            Aggiorna
        </button>
    `;

    document.body.appendChild(toast);

    // Animazione di ingresso
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    // Esegui skipWaiting al click
    const btn = document.getElementById('pwa-update-btn');
    btn.onclick = () => {
        btn.disabled = true;
        btn.innerText = 'Aggiornamento...';
        worker.postMessage({ type: 'SKIP_WAITING' });
    };
}
