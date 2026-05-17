/**
 * Current Meal Component Orchestrator
 */
class CurrentMeal {
    constructor() {
        this.data = {
            mealName: 'Colazione',
            items: [
                { id: 1, name: 'Caffè', quantity: '1 tazzina', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100', completed: true },
                { id: 2, name: 'Latte vaccino', quantity: 'Mezzo bicchiere', img: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=100', completed: true },
                { id: 3, name: 'Yogurt greco intero', quantity: '100 g', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100', completed: true },
                { id: 4, name: 'Burro di arachidi', quantity: '30 g', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100', completed: true },
                { id: 5, name: 'Mirtilli', quantity: '50 g', img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=100', completed: true }
            ],
            alternatives: 5
        };
        this.init();
    }

    async init() {
        console.log('CurrentMeal initializing...');
        
        // Load dependencies
        if (typeof window.initHeader !== 'function') {
            await loadScript('components/header/header.js');
        }
        if (typeof window.renderListTile !== 'function') {
            await loadScript('components/list-tile/list-tile.js');
        }
        window.injectListTileStyles();

        // Global reference for event handlers
        window.currentMealApp = this;

        this.render();
        this.setupLongPress();
    }

    setupLongPress() {
        const listRoot = document.getElementById('c-meal-list-root');
        if (!listRoot) return;

        let timer;
        this.isLongPressTriggered = false;

        const start = (e) => {
            const tile = e.target.closest('.list-tile.variant-default');
            if (!tile) return;

            this.isLongPressTriggered = false;
            timer = setTimeout(() => {
                this.isLongPressTriggered = true;
                tile.style.transform = 'scale(0.95)';
                tile.style.backgroundColor = '#f0f0f0';
                setTimeout(() => {
                    navigateTo('ingredient');
                }, 100);
            }, 600);
        };

        const cancel = (e) => {
            clearTimeout(timer);
            const tile = e.target.closest('.list-tile.variant-default');
            if (tile && !this.isLongPressTriggered) {
                tile.style.transform = '';
                tile.style.backgroundColor = '';
            }
        };

        listRoot.addEventListener('mousedown', start);
        listRoot.addEventListener('touchstart', start, { passive: true });
        listRoot.addEventListener('mouseup', cancel);
        listRoot.addEventListener('mouseleave', cancel);
        listRoot.addEventListener('touchend', cancel);

        // Capture phase to intercept the click if long press was triggered
        listRoot.addEventListener('click', (e) => {
            if (this.isLongPressTriggered) {
                e.stopImmediatePropagation();
                e.preventDefault();
                this.isLongPressTriggered = false;
                
                // Reset visual state
                const tile = e.target.closest('.list-tile.variant-default');
                if (tile) {
                    tile.style.transform = '';
                    tile.style.backgroundColor = '';
                }
            }
        }, true);
    }

    render() {
        this.renderStep2(); // Nav & Header
        this.renderStep3(); // Food List
        this.renderStep4(); // Footer
    }

    getProgressText() {
        const completed = this.data.items.filter(i => i.completed).length;
        const total = this.data.items.length;
        return `${completed} / ${total} completati`;
    }

    renderStep2() {
        // 1. Top Navigation (Plugging Header)
        const navRoot = document.getElementById('c-meal-nav-root');
        if (navRoot) {
            const backIcon = `<div onclick="navigateTo('today')" style="cursor: pointer; display: flex; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </div>`;
            const moreIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
            
            window.initHeader(navRoot, {
                left: backIcon,
                rigth: moreIcon
            });
        }

        // 2. Meal Header (Plugging ListTile)
        const headerRoot = document.getElementById('c-meal-header-root');
        if (headerRoot) {
            headerRoot.innerHTML = window.renderListTile({
                leading: '☀️',
                title: this.data.mealName,
                subtitle: this.getProgressText(),
                variant: 'header',
                bgClass: 'bg-sun'
            });
        }
    }

    toggleItem(id) {
        const item = this.data.items.find(i => i.id === id);
        if (item) {
            item.completed = !item.completed;
            this.render(); // Re-render everything to update state
        }
    }

    renderStep3() {
        const listRoot = document.getElementById('c-meal-list-root');
        if (!listRoot) return;

        const checkIcon = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#8da67d"/>
                <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        
        const emptyCircle = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ddd" stroke-width="2"/>
            </svg>`;

        listRoot.innerHTML = this.data.items.map(item => window.renderListTile({
            leading: `<img src="${item.img}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`,
            title: item.name,
            subtitle: item.quantity,
            trailing: item.completed ? checkIcon : emptyCircle,
            onClick: `currentMealApp.toggleItem(${item.id})`
        })).join('');
    }

    renderStep4() {
        const footerRoot = document.getElementById('c-meal-footer-root');
        if (footerRoot) {
            footerRoot.onclick = () => navigateTo('ingredient');
            footerRoot.innerHTML = `
                <span style="font-weight: 500; font-size: 15px;">Alternative disponibili</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 500; font-size: 15px;">${this.data.alternatives}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
            `;
        }
    }
}

// Auto-initialize
if (document.getElementById('c-meal-nav-root')) {
    new CurrentMeal();
}
window.initCurrentMeal = () => new CurrentMeal();
