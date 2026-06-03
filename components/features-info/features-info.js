/**
 * features-info.js: Logic for the Features Info (What's New) component
 */

async function initFeaturesInfo() {
    console.log("Inizializzazione Features Info...");

    const listContainer = document.getElementById('fei-list');

    // 1. Inizializza Header
    const headerRoot = document.getElementById('fei-header-root');
    if (headerRoot && typeof window.initHeader === 'function') {
        window.initHeader(headerRoot, {
            left: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
            center: "Novità",
            right: "",
            onLeftClick: () => window.navigateTo('today')
        });
    }

    // 2. Carica dati
    try {
        const response = await fetch('components/features-info/features_data.json');
        if (!response.ok) throw new Error('Errore caricamento dati');
        const features = await response.json();
        renderFeatures(features);
    } catch (err) {
        console.error(err);
        if (listContainer) listContainer.innerHTML = '<div class="fei-loading">Impossibile caricare le novità al momento.</div>';
    }

    function renderFeatures(features) {
        if (!listContainer) return;
        
        if (features.length === 0) {
            listContainer.innerHTML = '<div class="fei-loading">Nessuna novità da mostrare.</div>';
            return;
        }

        listContainer.innerHTML = features.map(feat => `
            <div class="fei-card">
                <div class="fei-card__icon">
                    ${feat.icon}
                </div>
                <div class="fei-card__body">
                    <div class="fei-card__title">
                        ${feat.title}
                        <span class="fei-badge fei-badge--${feat.status}">
                            ${feat.statusLabel}
                        </span>
                    </div>
                    <p class="fei-card__desc">${feat.description}</p>
                </div>
            </div>
        `).join('');
    }
}

window.initFeaturesInfo = initFeaturesInfo;
