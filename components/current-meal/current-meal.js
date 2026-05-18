/**
 * Current Meal Component Orchestrator
 */
class CurrentMeal {
    constructor() {
        this.data = {
            mealName: 'Colazione',
            items: [],
            alternatives: 5
        };
        this.init();
    }

    async init() {
        console.log('CurrentMeal initializing...');
        
        // Load dependencies
        const deps = [];
        if (typeof window.initHeader !== 'function') {
            deps.push(loadScript('components/header/header.js'));
        }
        if (typeof window.renderListTile !== 'function') {
            deps.push(loadScript('components/list-tile/list-tile.js'));
        }
        if (typeof window.getDishIcon !== 'function') {
            deps.push(loadScript('service/emoji_service.js'));
        }
        
        await Promise.all(deps);
        window.injectListTileStyles();

        // Load data from JSON
        try {
            const response = await fetch('components/today/today_meals.json');
            const mealsData = await response.json();
            
            // Per ora prendiamo la colazione come default
            const selectedMeal = mealsData.meals[0]; 
            
            this.data.mealName = selectedMeal.label;
            this.data.items = selectedMeal.dishes.map((dish, index) => ({
                id: index + 1,
                name: dish.name,
                quantity: dish.quantity,
                completed: dish.use
            }));
        } catch (error) {
            console.error("Errore nel caricamento dei pasti:", error);
        }

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
                right: moreIcon
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

        listRoot.innerHTML = this.data.items.map(item => {
            const iconData = window.getDishIcon(item.name);
            return window.renderListTile({
                leading: iconData.emoji,
                bgClass: iconData.bg,
                title: item.name,
                subtitle: item.quantity,
                trailing: item.completed ? checkIcon : emptyCircle,
                onClick: `currentMealApp.toggleItem(${item.id})`
            });
        }).join('');
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
