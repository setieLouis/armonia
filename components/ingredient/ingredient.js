/**
 * Ingredient Alternatives Component Orchestrator
 */
class IngredientAlternatives {
    constructor(navData = null) {
        this.navData = navData;
        this.data = {
            title: 'Alternative disponibili',
            items: (navData && navData.alternatives) ? navData.alternatives : [],
            originalDish: navData?.dishName || 'Ingrediente',
            originalQuantity: navData?.quantity || '-'
        };
        this.init();
    }

    async init() {
        console.log('IngredientAlternatives initializing with data:', this.navData);
        
        // Load dependencies
        const deps = [];
        if (typeof window.initHeader !== 'function') {
            deps.push(loadScript('components/header/header.js'));
        }
        if (typeof window.renderListTile !== 'function') {
            deps.push(loadScript('components/list-tile/list-tile.js'));
        }
        if (typeof window.renderInfoBanner !== 'function') {
            deps.push(loadScript('components/info-banner/info-banner.js'));
        }
        if (typeof window.getDishIcon !== 'function') {
            deps.push(loadScript('service/emoji_service.js'));
        }
        
        await Promise.all(deps);
        window.injectListTileStyles();
        window.injectInfoBannerStyles();

        this.render();
    }

    render() {
        this.renderContext();
        this.renderHeader();
        this.renderList();
        this.renderInfo();
    }

    renderContext() {
        const contextRoot = document.getElementById('alt-context-root');
        if (contextRoot) {
            const mealParam = this.navData?.mealId ? `, { mealId: '${this.navData.mealId}' }` : '';
            const backIcon = `<div onclick="navigateTo('current-meal'${mealParam})" style="cursor: pointer; margin-bottom: 20px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </div>`;

            const iconData = window.getDishIcon(this.data.originalDish);
            
            contextRoot.innerHTML = `
                ${backIcon}
                ${window.renderListTile({
                    leading: iconData.emoji,
                    bgClass: iconData.bg,
                    title: this.data.originalDish,
                    subtitle: this.data.originalQuantity,
                    variant: 'header'
                })}
            `;
        }
    }

    renderHeader() {
        const headerRoot = document.getElementById('alt-header-root');
        if (headerRoot) {
            const mealParam = this.navData?.mealId ? `, { mealId: '${this.navData.mealId}' }` : '';
            const closeIcon = `<div onclick="navigateTo('current-meal'${mealParam})" style="cursor: pointer; padding: 10px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>`;
            
            window.initHeader(headerRoot, {
                left: `<span style="font-size: 20px; font-weight: 700; color: #111;">${this.data.title}</span>`,
                right: closeIcon
            });

            // Specific adjustment: remove status bar spacer for modal
            const spacer = headerRoot.querySelector('.status-bar-spacer');
            if (spacer) spacer.style.display = 'none';
        }
    }

    renderList() {
        const listRoot = document.getElementById('alt-list-root');
        if (!listRoot) return;

        if (this.data.items.length === 0) {
            listRoot.innerHTML = `
                <div class="no-alt-message" style="text-align: center; padding: 40px 20px; color: #888;">
                    <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">🍽️</div>
                    <p style="font-size: 16px; font-weight: 500; color: #333;">Nessuna alternativa disponibile</p>
                    <p style="font-size: 14px;">Non sono state trovate sostituzioni per questo ingrediente.</p>
                </div>
            `;
            return;
        }

        const addIcon = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.4"/>
                <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;

        listRoot.innerHTML = this.data.items.map(item => {
            const iconData = window.getDishIcon(item.name);
            return window.renderListTile({
                leading: iconData.emoji,
                title: item.name,
                subtitle: `<span>${item.quantity}</span><br><span style="color: #888; font-size: 12px;">${item.macros}</span>`,
                trailing: `<div style="color: ${item.bgClass ? 'inherit' : '#8da67d'}">${addIcon}</div>`,
                bgClass: item.bgClass || iconData.bg
            });
        }).join('');
    }

    renderInfo() {
        const infoRoot = document.getElementById('alt-info-root');
        if (infoRoot) {
            infoRoot.innerHTML = window.renderInfoBanner({
                message: 'Le alternative sono calcolate per avere valori nutrizionali simili.'
            });
        }
    }
}

// Auto-initialize
if (document.getElementById('alt-header-root')) {
    new IngredientAlternatives();
}
window.initIngredientAlternatives = (data) => new IngredientAlternatives(data);
