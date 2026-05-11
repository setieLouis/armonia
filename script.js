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
    // 1. Carichiamo la struttura "Today"
    await loadComponent('app-root', 'components/today/today.html');

    // 2. Carichiamo la logica di coordinamento di Today
    await loadScript('components/today/today.js');
    
    // 3. Inizializziamo i componenti (gestito ora da today.js o qui sotto)
    if (window.initToday) {
        await window.initToday();
    }
});
