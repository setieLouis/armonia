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
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Caricamento sequenziale per evitare glitch visivi
    await loadComponent('header-root', 'components/header/header.html');
    await loadComponent('calendar-root', 'components/calendar/calendar.html');
    
    // Componente Meals con logica JS
    await loadComponent('meals-root', 'components/meals/meals.html', async (element) => {
        await loadScript('components/meals/meals.js');
        if (window.initMeals) window.initMeals(element);
    });

    await loadComponent('progress-root', 'components/progress/progress.html');
    await loadComponent('nav-root', 'components/nav/nav.html');

    console.log("Mockup Armonia Flow caricato con successo.");
});
