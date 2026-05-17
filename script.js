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
        // Remove existing script if it exists to allow re-initialization
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Global navigation function
async function navigateTo(view) {
    console.log(`Navigating to: ${view}`);
    const appRoot = 'app-root';
    
    if (view === 'today') {
        await loadComponent(appRoot, 'components/today/today.html', async () => {
            await loadScript('components/today/today.js');
            if (window.initToday) await window.initToday();
        });
    } 
    else if (view === 'current-meal') {
        await loadComponent(appRoot, 'components/current-meal/current-meal.html', async () => {
            await loadScript('components/current-meal/current-meal.js');
            if (window.initCurrentMeal) await window.initCurrentMeal();
        });
    }
}

window.loadComponent = loadComponent;
window.loadScript = loadScript;
window.navigateTo = navigateTo;

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('today');
});
