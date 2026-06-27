/**
 * features-info.js: Logic for the Features Info (What's New) component
 */

async function initFeaturesInfo(data) {
    console.log("Inizializzazione Features Info...");

    const listContainer = document.getElementById('fei-list');
    const isStartup = data && data.isStartup;

    // 1. Inizializza Header o Azione Continua
    const headerRoot = document.getElementById('fei-header-root');
    if (isStartup) {
        if (headerRoot) headerRoot.style.display = 'none';
        
        const actionContainer = document.getElementById('fei-action-container');
        const btnContinue = document.getElementById('fei-btn-continue');
        if (actionContainer) actionContainer.style.display = 'block';
        if (btnContinue) {
            btnContinue.onclick = async () => {
                if (window.localDB) {
                    try {
                        // Salva la versione vista nel database
                        await window.localDB.saveUserData('last_seen_version', { version: APP_VERSION });
                    } catch (e) {
                        console.error("Errore salvataggio versione vista:", e);
                    }
                }
                window.navigateTo('today');
            };
        }
    } else {
        if (headerRoot && typeof window.initHeader === 'function') {
            window.initHeader(headerRoot, {
                left: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
                center: "Novità",
                right: "",
                onLeftClick: () => window.navigateTo('today')
            });
        }
    }

    // Inserisci informazioni versione e rilascio
    const versionInfoEl = document.getElementById('fei-version-info');
    if (versionInfoEl && typeof APP_VERSION !== 'undefined' && typeof RELEASE_DATE !== 'undefined') {
        versionInfoEl.innerText = `Versione ${APP_VERSION} • Rilasciato il ${RELEASE_DATE}`;
    }

    // 2. Carica dati e gestisci i Tab/Filtri
    try {
        const response = await fetch('components/features-info/features_data.json');
        if (!response.ok) throw new Error('Errore caricamento dati');
        const features = await response.json();

        const tabsContainer = document.querySelector('.fei-tabs-container');

        if (isStartup) {
            if (versionInfoEl) versionInfoEl.style.display = 'block';
            if (tabsContainer) tabsContainer.style.display = 'none';

            // All'avvio mostra solo la nuova feature del rilascio corrente
            const currentVersion = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.2.2';
            const newFeatures = features.filter(feat => feat.version === currentVersion);
            renderFeatures(newFeatures);
        } else {
            if (versionInfoEl) versionInfoEl.style.display = 'block';
            if (tabsContainer) tabsContainer.style.display = 'block';

            let activeTab = 'available';

            const updateView = () => {
                const filteredFeatures = features.filter(feat => feat.status === activeTab);
                renderFeatures(filteredFeatures);
            };

            const tabBtns = document.querySelectorAll('.fei-tab-btn');
            tabBtns.forEach(btn => {
                btn.onclick = () => {
                    tabBtns.forEach(b => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                    activeTab = btn.getAttribute('data-tab');
                    updateView();
                };
            });

            // Caricamento iniziale
            updateView();
        }
    } catch (err) {
        console.error(err);
        if (listContainer) listContainer.innerHTML = '<div class="fei-loading">Impossibile caricare le novità al momento.</div>';
    }

    function renderFeatures(features) {
        if (!listContainer) return;
        
        if (features.length === 0) {
            listContainer.innerHTML = '<div class="fei-loading">Nessuna novità da mostrare in questa categoria.</div>';
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