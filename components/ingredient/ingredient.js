/**
 * Ingredient Alternatives Component Orchestrator
 */
class IngredientAlternatives {
    constructor() {
        this.data = {
            title: 'Alternative disponibili',
            items: [
                { name: 'Yogurt greco 0%', quantity: '100 g', macros: '59 kcal • 10 g proteine • 0 g grassi', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100', bgClass: 'bg-alt-green' },
                { name: 'Skyr bianco', quantity: '100 g', macros: '60 kcal • 11 g proteine • 0.2 g grassi', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100', bgClass: 'bg-alt-yellow' },
                { name: 'Yogurt naturale', quantity: '100 g', macros: '61 kcal • 3.5 g proteine • 3.3 g grassi', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100', bgClass: '' },
                { name: 'Yogurt di soia', quantity: '100 g', macros: '80 kcal • 6 g proteine • 3 g grassi', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100', bgClass: '' }
            ]
        };
        this.init();
    }

    async init() {
        console.log('IngredientAlternatives initializing...');
        
        // Load dependencies
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        if (typeof window.renderListTile !== 'function') {
            await loadScript('components/list-tile/list-tile.js');
        }
        window.injectListTileStyles();

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
            const backIcon = `<div onclick="navigateTo('current-meal')" style="cursor: pointer; margin-bottom: 20px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </div>`;

            contextRoot.innerHTML = `
                ${backIcon}
                ${window.renderListTile({
                    leading: `<img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`,
                    title: 'Yogurt greco intero',
                    subtitle: '100 g',
                    variant: 'header'
                })}
            `;
        }
    }

    renderHeader() {
        const headerRoot = document.getElementById('alt-header-root');
        if (headerRoot) {
            const closeIcon = `<div onclick="navigateTo('current-meal')" style="cursor: pointer; padding: 10px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>`;
            
            window.initHeader(headerRoot, {
                left: `<span style="font-size: 20px; font-weight: 700; color: #111;">${this.data.title}</span>`,
                rigth: closeIcon
            });

            // Specific adjustment: remove status bar spacer for modal
            const spacer = headerRoot.querySelector('.status-bar-spacer');
            if (spacer) spacer.style.display = 'none';
        }
    }

    renderList() {
        const listRoot = document.getElementById('alt-list-root');
        if (!listRoot) return;

        const addIcon = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.4"/>
                <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;

        listRoot.innerHTML = this.data.items.map(item => window.renderListTile({
            leading: `<img src="${item.img}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`,
            title: item.name,
            subtitle: `<span>${item.quantity}</span><br><span style="color: #888; font-size: 12px;">${item.macros}</span>`,
            trailing: `<div style="color: ${item.bgClass ? 'inherit' : '#8da67d'}">${addIcon}</div>`,
            bgClass: item.bgClass
        })).join('');
    }

    renderInfo() {
        const infoRoot = document.getElementById('alt-info-root');
        if (infoRoot) {
            infoRoot.innerHTML = `
                <div class="c-alt-info">
                    <svg class="c-alt-info__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <p class="c-alt-info__text">Le alternative sono calcolate per avere valori nutrizionali simili.</p>
                </div>
            `;
        }
    }
}

// Auto-initialize
if (document.getElementById('alt-header-root')) {
    new IngredientAlternatives();
}
window.initIngredientAlternatives = () => new IngredientAlternatives();
